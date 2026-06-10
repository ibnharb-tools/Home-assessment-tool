import corpus from "./corpus.json";

/**
 * Lightweight keyword retrieval over the source corpus (your MECH 4692 report +
 * the Masters textbook), no vector DB or embedding service — the "simplest
 * setup that fits the stack". Scores chunks by TF with a rough IDF weighting
 * and returns the top matches with their source + page for citation.
 *
 * The corpus is built offline by scripts/extract-corpus (pymupdf) and shipped
 * as corpus.json; it is imported server-side only (used from /api/assess).
 */

export interface CorpusChunk {
  source: string; // "report" | "masters"
  title: string;
  page: number;
  text: string;
}

const CHUNKS = corpus as CorpusChunk[];

const STOP = new Set(
  "the a an of to in on for and or is are be by with as at from this that it its into your you we our their than then so if not no can will may use used using per".split(
    " "
  )
);

function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(
    (t) => t.length > 2 && !STOP.has(t)
  );
}

// Document frequency for IDF, computed once at module load.
const DF = new Map<string, number>();
for (const c of CHUNKS) {
  for (const t of new Set(tokenize(c.text))) DF.set(t, (DF.get(t) ?? 0) + 1);
}
const N = CHUNKS.length;
const idf = (t: string) => Math.log(1 + N / (1 + (DF.get(t) ?? 0)));

export interface RetrievedPassage extends CorpusChunk {
  score: number;
}

/** Return the top-k corpus passages relevant to the query terms. */
export function retrievePassages(query: string, k = 5): RetrievedPassage[] {
  const qTerms = tokenize(query);
  if (qTerms.length === 0) return [];
  const qSet = new Set(qTerms);

  const scored = CHUNKS.map((c) => {
    const terms = tokenize(c.text);
    const tf = new Map<string, number>();
    for (const t of terms) if (qSet.has(t)) tf.set(t, (tf.get(t) ?? 0) + 1);
    let score = 0;
    for (const [t, f] of tf) score += (1 + Math.log(f)) * idf(t);
    // small boost for the user's own report (preferred source of truth)
    if (c.source === "report") score *= 1.15;
    return { ...c, score };
  });

  return scored
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

/** Format retrieved passages for inclusion in the assessment prompt. */
export function formatPassagesForPrompt(passages: RetrievedPassage[]): string {
  if (passages.length === 0) return "";
  return passages
    .map(
      (p, i) =>
        `[S${i + 1}] (${p.title}, p.${p.page})\n${p.text.slice(0, 700)}`
    )
    .join("\n\n");
}
