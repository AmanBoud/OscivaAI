// Lightweight RAG: PDF/URL extraction, sentence-aware chunking, keyword retrieval

import * as pdfjsLib from "pdfjs-dist";
// Vite worker import — `?url` returns a string at build time
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export interface KbChunk {
  text: string;
  sourceId: string;
}

const STOPWORDS = new Set([
  "the","a","an","and","or","but","is","are","was","were","be","been","being","of","in","on","at","to","for","with","by","from","as","that","this","these","those","it","its","i","you","he","she","we","they","them","what","which","who","how","do","does","did","not","no","yes","can","will","would","should","could","have","has","had","if","then","than","so","about","into","over","under","up","down","out","there","here","my","your","our","their","his","her",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

const wordCount = (s: string): number => (s.trim() ? s.trim().split(/\s+/).length : 0);

// Strip markdown noise + normalize whitespace while preserving paragraph breaks.
// (Jina Reader returns markdown; PDFs return messy spacing — both clean up here.)
function normalizeText(raw: string): string {
  return raw
    .replace(/\r\n?/g, "\n")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")          // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")          // links -> link text
    .replace(/^[ \t]*[#>\-*+]+[ \t]*/gm, "")          // heading/bullet/quote markers
    .replace(/[`*_~]+/g, "")                            // emphasis / code markers
    .replace(/[ \t\f\v]+/g, " ")                       // collapse intra-line spaces
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")                        // cap blank runs
    .trim();
}

// Split into sentences, respecting paragraph boundaries.
function splitSentences(text: string): string[] {
  const out: string[] = [];
  for (const para of text.split(/\n{2,}/)) {
    const p = para.trim();
    if (!p) continue;
    // Break after . ! ? when followed by whitespace + a capital/digit/quote.
    const parts = p.split(/(?<=[.!?])\s+(?=["'(\[]?[A-Z0-9])/);
    for (const part of parts) {
      const s = part.replace(/\s+/g, " ").trim();
      if (s) out.push(s);
    }
  }
  return out;
}

// Sentence-aware chunking with overlap, sized to fit the gte-small embedder
// (~512 token ceiling). Defaults: ~180 words/chunk, ~30-word overlap so context
// that spans a boundary isn't lost. Overlong single sentences are hard-split.
export function chunkText(
  text: string,
  sourceId: string,
  opts: { targetWords?: number; overlapWords?: number; maxWords?: number } = {},
): KbChunk[] {
  const targetWords = opts.targetWords ?? 180;
  const overlapWords = opts.overlapWords ?? 30;
  const maxWords = opts.maxWords ?? 220;

  const clean = normalizeText(text);
  if (!clean) return [];

  const sentences = splitSentences(clean);
  const chunks: KbChunk[] = [];
  let cur: string[] = [];
  let curWords = 0;

  const flush = () => {
    const t = cur.join(" ").trim();
    if (t) chunks.push({ text: t, sourceId });
  };

  for (const sentence of sentences) {
    const sWords = wordCount(sentence);

    // A single sentence bigger than the cap: flush, then window it with overlap.
    if (sWords > maxWords) {
      if (curWords) { flush(); cur = []; curWords = 0; }
      const words = sentence.split(/\s+/);
      const step = Math.max(1, maxWords - overlapWords);
      for (let i = 0; i < words.length; i += step) {
        const slice = words.slice(i, i + maxWords).join(" ");
        if (slice.trim()) chunks.push({ text: slice, sourceId });
      }
      continue;
    }

    // Close the current chunk once it's full, carrying an overlap tail forward.
    if (curWords + sWords > targetWords && curWords > 0) {
      flush();
      const overlap: string[] = [];
      let ow = 0;
      for (let i = cur.length - 1; i >= 0 && ow < overlapWords; i--) {
        overlap.unshift(cur[i]);
        ow += wordCount(cur[i]);
      }
      cur = overlap;
      curWords = ow;
    }

    cur.push(sentence);
    curWords += sWords;
  }
  flush();
  return chunks;
}

export async function extractPdfText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let full = "";
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((it: any) => ("str" in it ? it.str : ""))
      .join(" ");
    full += pageText + "\n\n";
  }
  return full;
}

export async function extractUrlText(url: string): Promise<string> {
  const target = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  // Primary: Jina Reader — clean, JS-rendered text, CORS-friendly, no key needed.
  // X-Remove-Selector drops common site chrome (menus/headers/footers) so page
  // navigation doesn't pollute the knowledge base.
  try {
    const res = await fetch(`https://r.jina.ai/${target}`, {
      headers: {
        "X-Return-Format": "text",
        "X-Remove-Selector": "nav,header,footer,aside",
      },
    });
    if (res.ok) {
      const text = (await res.text()).trim();
      if (text) return text;
    }
  } catch {
    // fall through to the proxy fallback
  }

  // Fallback: allorigins proxy (raw HTML → strip to text).
  const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`);
  if (!res.ok) throw new Error(`Failed to fetch URL (${res.status})`);
  const html = await res.text();
  const text = htmlToText(html);
  if (!text) throw new Error("No extractable text found at that URL");
  return text;
}

export function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Browser-side lexical retrieval for the pre-save preview (the deployed widget
// uses the server-side hybrid vector + full-text search instead). Uses BM25:
// IDF down-weights ubiquitous terms, length normalization + term-frequency
// saturation stop long/citation-dense chunks from gaming a raw word count.
export function retrieveTopChunks(query: string, chunks: KbChunk[], k = 3): KbChunk[] {
  if (!chunks?.length) return [];
  const qTokens = Array.from(new Set(tokenize(query)));
  if (!qTokens.length) return chunks.slice(0, k);

  const docs = chunks.map((c) => tokenize(c.text));
  const N = docs.length;
  const avgdl = docs.reduce((a, d) => a + d.length, 0) / (N || 1) || 1;
  const k1 = 1.5;
  const b = 0.75;

  // document frequency per query term
  const df = new Map<string, number>();
  for (const t of qTokens) {
    let n = 0;
    for (const d of docs) if (d.includes(t)) n++;
    df.set(t, n);
  }
  const idf = (t: string) => {
    const n = df.get(t) ?? 0;
    return Math.log(1 + (N - n + 0.5) / (n + 0.5));
  };

  const scored = docs.map((d, i) => {
    const len = d.length || 1;
    let score = 0;
    for (const t of qTokens) {
      let f = 0;
      for (const w of d) if (w === t) f++;
      if (!f) continue;
      const norm = f * (k1 + 1) / (f + k1 * (1 - b + b * (len / avgdl)));
      score += idf(t) * norm;
    }
    return { chunk: chunks[i], score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).slice(0, k).map((s) => s.chunk);
}

export function buildRagSystemPrompt(opts: {
  agentName: string;
  instructions: string;
  personality: string;
  contextChunks: KbChunk[];
}): string {
  const base = `You are ${opts.agentName || "an AI assistant"}. Personality: ${opts.personality}.\n\n${opts.instructions}`;
  if (!opts.contextChunks.length) return base;
  const ctx = opts.contextChunks.map((c) => c.text).join("\n---\n");
  return `${base}\n\nUse the following knowledge base context to answer. If the answer is not in the context, say so clearly.\n\nCONTEXT:\n${ctx}`;
}
