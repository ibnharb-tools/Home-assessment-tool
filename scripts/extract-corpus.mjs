// scripts/extract-corpus.mjs
//
// Rebuilds the retrieval corpus (src/lib/corpus.json) from the source PDFs in
// docs/. The corpus is what the assessment engine "learns from": at request
// time, lib/retrieval.ts keyword-matches the user's situation against these
// chunks and injects the top passages (with citations) into the prompt.
//
// Usage:
//   npm install            # ensures pdf-parse (devDependency) is present
//   node scripts/extract-corpus.mjs
//
// Add a PDF to docs/, list it in SOURCES below, re-run, and commit corpus.json.

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
// Import the lib entry directly to avoid pdf-parse's debug-mode file read.
import pdf from "pdf-parse/lib/pdf-parse.js";

const ROOT = process.cwd();
const OUT = resolve(ROOT, "src/lib/corpus.json");
const CHUNK = 900; // target characters per chunk

/**
 * Source documents. `boost` marks the user's own report as the preferred source
 * of truth. `maxPages` caps very large textbooks so corpus.json stays lean.
 */
const SOURCES = [
  { id: "report", title: "Harb — MECH 4692 Renewable Energy Final Report (RED model)", file: "Harb_MECH4692_Final_Report.pdf", boost: true },
  { id: "masters", title: "Masters — Renewable and Efficient Electric Power Systems", file: "Renewable and Efficient Electric Power Systems.pdf", maxPages: 80 },
  { id: "gshp", title: "Kavanaugh & Rafferty — Design of Ground-Source Heat Pump Systems", file: "Design of Ground-Source Heat Pump Systems.pdf", maxPages: 60 },
  { id: "om", title: "Operation and Maintenance Decision Support", file: "Operation and Maintenance Decision Support.pdf", maxPages: 40 },
  { id: "pv_geometry", title: "Pacheco-Torres et al. (2014) — Building geometry, PV generation & energy demand", file: "Pacheco-Torres_2014_Building_Geometry_PV_Energy.pdf", maxPages: 40 },
];

const clean = (t) => t.replace(/\s+/g, " ").trim();

function chunkText(text) {
  const words = text.split(" ");
  const chunks = [];
  let buf = "";
  for (const w of words) {
    if (buf.length + w.length + 1 > CHUNK) {
      chunks.push(buf.trim());
      buf = "";
    }
    buf += w + " ";
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks;
}

async function extractPages(buffer, maxPages) {
  const pages = [];
  await pdf(buffer, {
    max: maxPages ?? 0,
    pagerender: async (pageData) => {
      const tc = await pageData.getTextContent({ normalizeWhitespace: true });
      const text = clean(tc.items.map((i) => i.str).join(" "));
      pages.push(text);
      return text;
    },
  });
  return pages;
}

async function main() {
  const out = [];
  for (const src of SOURCES) {
    const path = resolve(ROOT, "docs", src.file);
    let buffer;
    try {
      buffer = await readFile(path);
    } catch {
      console.warn(`! skipping (not found): docs/${src.file}`);
      continue;
    }
    const pages = await extractPages(buffer, src.maxPages);
    let count = 0;
    pages.forEach((text, i) => {
      if (text.length < 120) return;
      for (const chunk of chunkText(text)) {
        out.push({ source: src.id, title: src.title, page: i + 1, text: chunk });
        count++;
      }
    });
    console.log(`✓ ${src.id}: ${pages.length} pages → ${count} chunks`);
  }
  await writeFile(OUT, JSON.stringify(out), "utf8");
  const kb = (JSON.stringify(out).length / 1024).toFixed(1);
  console.log(`\nWrote ${out.length} chunks to src/lib/corpus.json (${kb} KB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
