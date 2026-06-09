// Lightweight RAG: PDF/URL extraction, chunking, keyword retrieval

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

export function chunkText(text: string, sourceId: string, wordsPerChunk = 500): KbChunk[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const words = clean.split(" ");
  const chunks: KbChunk[] = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const slice = words.slice(i, i + wordsPerChunk).join(" ");
    if (slice.trim()) chunks.push({ text: slice, sourceId });
  }
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
  const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error(`Failed to fetch URL (${res.status})`);
  const data = await res.json();
  const html: string = data.contents ?? "";
  return htmlToText(html);
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

export function retrieveTopChunks(query: string, chunks: KbChunk[], k = 3): KbChunk[] {
  if (!chunks?.length) return [];
  const qTokens = tokenize(query);
  if (!qTokens.length) return chunks.slice(0, k);
  const qSet = new Set(qTokens);
  const scored = chunks.map((c) => {
    const tokens = tokenize(c.text);
    let score = 0;
    for (const t of tokens) if (qSet.has(t)) score++;
    // small length normalization
    return { chunk: c, score: score / Math.sqrt(tokens.length || 1) };
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
