import Anthropic from "@anthropic-ai/sdk";
import type { Assessment, QuestionnaireData } from "@/types";
import type { GeocodeResult } from "./geocode";
import type { ClimateData } from "./climate";
import { APPLIANCES } from "./questionnaire-options";
import { totalRooms } from "./utils";
import type { ResourceBundle } from "./resources";
import { methodologyForPrompt } from "./methodology";
import { retrievePassages, formatPassagesForPrompt } from "./retrieval";

/**
 * AI assessment engine.
 *
 * Sends questionnaire + location climate data (and any uploaded photos via
 * Claude vision) to Claude, asking it to act as an expert energy systems
 * engineer and return the structured Assessment JSON.
 *
 * Model: claude-sonnet-4-6 (per spec). The API key is read from the
 * ANTHROPIC_API_KEY environment variable by the SDK.
 *
 * NOTE: We instruct the model to return ONLY JSON and parse it defensively,
 * rather than authoring a full strict json_schema for this large nested shape.
 * This keeps the prompt easy to iterate on (spec §8) and is resilient.
 */

const MODEL = "claude-sonnet-4-6";

export function hasAnthropicKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Human-readable summary of selected appliances for the prompt. */
function describeAppliances(data: QuestionnaireData): string {
  if (data.appliances.length === 0) return "None specified.";
  return data.appliances
    .map((a) => {
      const label = APPLIANCES.find((x) => x.id === a.id)?.label ?? a.id;
      const extra =
        a.id === "lighting" ? ` (${data.lightingType})` : ` x${a.quantity}`;
      return `- ${label}${extra}, used ${a.frequency}`;
    })
    .join("\n");
}

/** Higher-fidelity resource-model section (PVGIS / PVWatts / modelled wind). */
function buildResourceSection(resources?: ResourceBundle): string {
  if (!resources) return "";
  const { solarPV, solarPVWatts, wind } = resources;
  const lines: string[] = [];
  if (solarPV?.specificYield) {
    lines.push(
      `- PVGIS (${solarPV.database}): specific yield ${solarPV.specificYield.toFixed(0)} kWh/kWp/yr; optimal tilt ${solarPV.optimalTilt ?? "?"}°, azimuth ${solarPV.optimalAzimuth ?? "?"}°. Size solar from this yield.`
    );
  }
  if (solarPVWatts?.specificYield) {
    lines.push(
      `- NREL PVWatts cross-check: ${solarPVWatts.specificYield.toFixed(0)} kWh/kWp/yr.`
    );
  }
  if (wind) {
    lines.push(
      `- Modelled wind: ${wind.windSpeedHub} m/s at ${wind.hubHeightM}m hub (shear α=${wind.shearExponent}); capacity factor ${(wind.capacityFactor * 100).toFixed(0)}%; estimated ${wind.annualKWh} kWh/yr from a ${5} kW turbine; site ${wind.viable ? "VIABLE" : "NOT viable"} for small wind. Defer to this viability call.`
    );
  }
  if (lines.length === 0) return "";
  return `\n\nRESOURCE MODELING (use these engineering estimates for sizing/production over the rough thresholds above)\n${lines.join("\n")}`;
}

function buildPrompt(
  data: QuestionnaireData,
  geo: GeocodeResult,
  climate: ClimateData,
  resources: ResourceBundle | undefined,
  passages: string
): string {
  const solar =
    climate.solarIrradiance !== null
      ? `${climate.solarIrradiance.toFixed(2)} kWh/m²/day`
      : "unavailable";
  const wind50 =
    climate.windSpeed50m !== null
      ? `${climate.windSpeed50m.toFixed(2)} m/s`
      : "unavailable";
  const wind10 =
    climate.windSpeed10m !== null
      ? `${climate.windSpeed10m.toFixed(2)} m/s`
      : "unavailable";
  const temp =
    climate.avgTempC !== null ? `${climate.avgTempC.toFixed(1)} °C` : "unavailable";

  return `You are an expert renewable energy systems engineer producing a property energy assessment.

PROPERTY & LOCATION
- Address: ${geo.displayName}
- Coordinates: ${geo.latitude.toFixed(4)}, ${geo.longitude.toFixed(4)}
- Property type: ${data.propertyType ?? "unspecified"}
- Rooms: ${data.rooms.bedrooms} bed, ${data.rooms.bathrooms} bath, ${data.rooms.living} living, ${data.rooms.kitchens} kitchen, ${data.rooms.garages} garage, ${data.rooms.other} other (${totalRooms(data.rooms)} total)
- Occupants: ${data.occupants}
- Floor area: ${data.floorArea ? `${data.floorArea} ${data.areaUnit === "sqft" ? "sq ft" : "sq m"}` : "unspecified"}
- Ownership: ${data.ownership}
- Grid connection: ${data.gridConnection ?? "unspecified"}
- Existing renewables: ${data.hasRenewables ? data.existingRenewables.join(", ") || "yes (unspecified)" : "none"}
- Stated average daily usage: ${data.dailyKwh ? `${data.dailyKwh} kWh` : "not provided — estimate from appliances"}

APPLIANCES & USAGE
${describeAppliances(data)}

GOALS & CONSTRAINTS
- Priorities: ${data.goals.join(", ") || "unspecified"}
- Budget: ${data.budget ?? "unspecified"}
- Timeframe: ${data.timeframe ?? "unspecified"}

LOCATION CLIMATE DATA (source: ${climate.source})
- Annual avg solar irradiance (GHI): ${solar}
- Annual avg wind speed @ 50m: ${wind50}
- Annual avg wind speed @ 10m: ${wind10}
- Annual avg temperature: ${temp}${buildResourceSection(resources)}

RATING THRESHOLDS — base ratings strictly on the climate values above:
- Solar (kWh/m²/day): >5.0 Excellent; 4.0–5.0 Good; 3.0–4.0 Moderate; <3.0 Poor.
- Wind @50m (m/s): >6.0 Excellent; 5.0–6.0 Good; 4.0–5.0 Moderate; <4.0 Poor (for small wind).
- Geothermal viability: generally High where heating/cooling demand is significant and lot space exists; Moderate otherwise; Low for apartments/condos.

METHODOLOGY — you MUST ground every calculation in these cited equations (do not invent new ones). Cite the equation for each figure in the citations arrays.
${methodologyForPrompt()}

RELEVANT SOURCE PASSAGES (retrieved from the user's report + textbook; cite as needed):
${passages || "(none retrieved)"}

LIVE DATA — use web_search and web_fetch to find:
- Real supplier product options + prices (unit price, installation, annual maintenance) for each recommended technology, available in or shippable to the user's region. Populate each recommendation's "options" array and cite the supplier URL.
- Current government/utility rebate & grant programs for the user's location. Populate "grants" with name + url.
- Filter all product options to the user's budget (${data.budget ?? "unspecified"}).
If a search fails, fall back to reasonable estimates and say so in the citation.

FINANCING
- Provide a "financing" array of real options (green loans, grants, on-bill financing).
${
  data.shariahCompliant
    ? '- The user requires SHARIAH-COMPLIANT (riba/interest-free) financing ONLY. Include only riba-free structures (e.g. Murabaha, Ijara, diminishing Musharaka, Qard Hasan, or grants). Set shariahCompliant=true on each. Do NOT include conventional interest-bearing loans.'
    : '- Include conventional and, where available, Shariah-compliant options; mark each with shariahCompliant true/false.'
}

FINANCIAL ASSUMPTIONS
- Apply Canadian federal rebate assumptions: Canada Greener Homes Grant up to CAD $5,000; note that rebates vary by province. Prefer LIVE grant data when found.
- Use reasonable, clearly-estimated figures (CAD). Do not be falsely precise.
- If the user did not provide daily usage, estimate annual kWh from the appliance list, occupants, and floor area, per the demand equation.

OUTPUT
Return ONLY a single valid JSON object (no markdown, no commentary, no code fences) with EXACTLY this shape:
{
  "energyProfile": {
    "estimatedDailyKwh": number,
    "estimatedMonthlyKwh": number,
    "estimatedAnnualKwh": number,
    "peakDemandKw": number,
    "breakdown": [{ "category": string, "kwh": number, "percentage": number }],
    "comparisonToAverage": string
  },
  "locationData": {
    "solarIrradiance": number,
    "solarRating": "Excellent|Good|Moderate|Poor",
    "windSpeed": number,
    "windRating": "Excellent|Good|Moderate|Poor",
    "geothermalViability": "High|Moderate|Low",
    "climateSummary": string
  },
  "recommendations": [
    {
      "technology": "Solar PV|Wind|Geothermal|Battery Storage",
      "recommended": boolean,
      "confidence": "High|Medium|Low",
      "systemSize": string,
      "estimatedCost": number,
      "estimatedAnnualProduction": number,
      "coveragePercentage": number,
      "explanation": string,
      "placement": string,
      "unitPrice": number,
      "installationCost": number,
      "maintenanceCostPerYear": number,
      "energyRequiredKwh": number,
      "energyProducedKwh": number,
      "options": [{ "name": string, "supplier": string, "unitPrice": number, "installationCost": number, "maintenanceCostPerYear": number, "energyRequiredKwh": number, "energyProducedKwh": number, "url": string, "sourceCitation": string }],
      "citations": [{ "label": string, "source": string, "url": string }]
    }
  ],
  "financial": {
    "totalSystemCost": number,
    "estimatedRebates": number,
    "netCost": number,
    "annualSavings": number,
    "paybackYears": number,
    "twentyFiveYearSavings": number
  },
  "environmental": {
    "annualCo2AvoidedTonnes": number,
    "treesEquivalent": number,
    "kmDrivingEquivalent": number,
    "twentyFiveYearCo2Tonnes": number
  },
  "photoInsights": string or null,
  "financing": [{ "name": string, "provider": string, "type": string, "shariahCompliant": boolean, "summary": string, "url": string }],
  "grants": [{ "label": string, "source": string, "url": string }],
  "citations": [{ "label": string, "source": string, "url": string }]
}
Include a recommendation entry for each of: Solar PV, Wind, Geothermal, Battery Storage (recommended true/false as appropriate). The breakdown should cover Heating, Cooling, Appliances, Water Heating, Lighting, Other and sum to ~100%. Every numeric figure must trace to a methodology equation (in citations) or a live source URL.`;
}

/** Build Claude vision image blocks from uploaded data URLs (max 6). */
function buildImageBlocks(
  photos: string[]
): Anthropic.ImageBlockParam[] {
  const blocks: Anthropic.ImageBlockParam[] = [];
  for (const dataUrl of photos.slice(0, 6)) {
    const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl);
    if (!match) continue;
    const [, mediaType, base64] = match;
    blocks.push({
      type: "image",
      source: {
        type: "base64",
        media_type: mediaType as
          | "image/jpeg"
          | "image/png"
          | "image/gif"
          | "image/webp",
        data: base64,
      },
    });
  }
  return blocks;
}

/** Extract the first balanced JSON object from a string. */
function extractJson(text: string): unknown {
  const fenceStripped = text.replace(/```json\s*|\s*```/g, "");
  const start = fenceStripped.indexOf("{");
  const end = fenceStripped.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in model response");
  }
  return JSON.parse(fenceStripped.slice(start, end + 1));
}

export async function buildAssessment(
  data: QuestionnaireData,
  geo: GeocodeResult,
  climate: ClimateData,
  resources?: ResourceBundle
): Promise<Assessment> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

  // Keyword-retrieve grounding passages from the report + textbook.
  const query = [
    data.propertyType,
    "solar PV wind geothermal biomass battery payback RER GHG capacity factor",
    data.goals.join(" "),
    data.appliances.map((a) => a.id).join(" "),
  ]
    .filter(Boolean)
    .join(" ");
  const passages = formatPassagesForPrompt(retrievePassages(query, 5));

  const promptText = buildPrompt(data, geo, climate, resources, passages);
  const imageBlocks = buildImageBlocks(data.photos);

  const content: Anthropic.ContentBlockParam[] = [
    { type: "text", text: promptText },
  ];
  if (imageBlocks.length > 0) {
    content.push({
      type: "text",
      text: "The following photos of the property were provided. Analyze roof type, orientation, shading, and available space, and incorporate observations into photoInsights and placement guidance.",
    });
    content.push(...imageBlocks);
  }

  // Live data: Anthropic server-side web tools for real supplier pricing +
  // grant programs. They run server-side; on long tool loops the API returns
  // stop_reason "pause_turn", which we resume until it completes.
  const tools = [
    { type: "web_search_20260209", name: "web_search" },
    { type: "web_fetch_20260209", name: "web_fetch" },
  ] as unknown as Anthropic.ToolUnion[];

  const messages: Anthropic.MessageParam[] = [{ role: "user", content }];
  let response = await client.messages.create({
    model: MODEL,
    max_tokens: 6000,
    system:
      "You are a precise energy systems engineer. Ground every number in the provided methodology equations or a live source you fetched. After any web searches, your FINAL message must be a single valid JSON object only.",
    tools,
    messages,
  });

  // Resume server-tool loops (pause_turn) a bounded number of times.
  for (let i = 0; i < 4 && response.stop_reason === "pause_turn"; i++) {
    messages.push({ role: "assistant", content: response.content });
    response = await client.messages.create({
      model: MODEL,
      max_tokens: 6000,
      tools,
      messages,
    });
  }

  // Concatenate all text blocks, then extract the final JSON object.
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  if (!text.trim()) throw new Error("Model returned no text content");

  const parsed = extractJson(text) as Assessment;
  return parsed;
}
