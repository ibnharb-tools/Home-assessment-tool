import Anthropic from "@anthropic-ai/sdk";
import type { Assessment, QuestionnaireData } from "@/types";
import type { GeocodeResult } from "./geocode";
import type { ClimateData } from "./climate";
import { APPLIANCES } from "./questionnaire-options";
import { totalRooms } from "./utils";

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

function buildPrompt(
  data: QuestionnaireData,
  geo: GeocodeResult,
  climate: ClimateData
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
- Annual avg temperature: ${temp}

RATING THRESHOLDS — base ratings strictly on the climate values above:
- Solar (kWh/m²/day): >5.0 Excellent; 4.0–5.0 Good; 3.0–4.0 Moderate; <3.0 Poor.
- Wind @50m (m/s): >6.0 Excellent; 5.0–6.0 Good; 4.0–5.0 Moderate; <4.0 Poor (for small wind).
- Geothermal viability: generally High where heating/cooling demand is significant and lot space exists; Moderate otherwise; Low for apartments/condos.

FINANCIAL ASSUMPTIONS
- Apply Canadian federal rebate assumptions: Canada Greener Homes Grant up to CAD $5,000; note that rebates vary by province.
- Use reasonable, clearly-estimated figures (CAD). Do not be falsely precise.
- If the user did not provide daily usage, estimate annual kWh from the appliance list, occupants, and floor area.

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
      "placement": string
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
  "photoInsights": string or null
}
Include a recommendation entry for each of: Solar PV, Wind, Geothermal, Battery Storage (recommended true/false as appropriate). The breakdown should cover Heating, Cooling, Appliances, Water Heating, Lighting, Other and sum to ~100%.`;
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
  climate: ClimateData
): Promise<Assessment> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

  const promptText = buildPrompt(data, geo, climate);
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

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system:
      "You are a precise energy systems engineer. You respond with a single valid JSON object only — no prose, no markdown fences.",
    messages: [{ role: "user", content }],
  });

  const textPart = response.content.find((b) => b.type === "text");
  if (!textPart || textPart.type !== "text") {
    throw new Error("Model returned no text content");
  }

  const parsed = extractJson(textPart.text) as Assessment;
  return parsed;
}
