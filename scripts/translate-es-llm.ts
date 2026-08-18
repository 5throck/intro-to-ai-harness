/**
 * translate-es-llm.ts
 *
 * ⚠️  STUB — the LLM call is NOT implemented. The main loop only extracts
 *     untranslated text nodes and logs what would be translated. Wire up a
 *     real LLM integration (e.g., MCP ask_local_llm, Ollama API) before use.
 *
 * Translates remaining English text in Spanish HTML files using the local LLM.
 * Strategy: extract plain text → send to LLM → replace text nodes in HTML.
 *
 * Usage:
 *   bun run scripts/translate-es-llm.ts [--chapter ch04] [--dry-run]
 *
 * If --chapter is specified, only that chapter is processed.
 * --dry-run shows what would change without writing files.
 */

import * as fs from "node:fs";
import * as path from "path";
import { decodeEntities, isEnglishDominant } from "./translate-lib";

const DOCS_DIR = path.resolve("docs");

// Chapters that still have significant untranslated content
const CHAPTERS_TO_PROCESS = [
  "ch04/04_Harness_Concepts",
  "ch05/05_Workspace_Standards",
  "ch07/07_Co_Deck_Practice",
  "ch08/08_Integrated_Pipeline",
  "ch06/06_Co_Consult_Practice",
];

interface TextNode {
  index: number;
  tag: string;
  html: string;
  plainText: string;
  isCode: boolean;
  isSvg: boolean;
}

/**
 * Extract translatable text nodes from an HTML string.
 * Returns nodes with their plain text for LLM translation.
 */
function extractTextNodes(html: string): TextNode[] {
  const nodes: TextNode[] = [];
  // Match text content inside common elements, preserving outer tags
  const pattern =
    /<(p|h[1-6]|li|div|strong|em|span|td|th|dt|dd|caption|figcaption|a)\b([^>]*)>([\s\S]*?)<\/\1>/gi;

  let match;
  while ((match = pattern.exec(html)) !== null) {
    const fullMatch = match[0];
    const tag = match[1].toLowerCase();
    const attrs = match[2];
    const innerHtml = match[3];

    // Skip code blocks, scripts, styles, SVG
    if (
      /<(?:pre|code|script|style|svg)\b/i.test(fullMatch) ||
      /class="[^"]*(?:copy-code|dark-mode|lang-switch|inpage-search|site-search)/i.test(
        attrs
      )
    ) {
      continue;
    }

    // Strip inner HTML tags to get plain text
    const plainText = decodeEntities(
      innerHtml.replace(/<[^>]+>/g, " ")
    )
      .replace(/\s+/g, " ")
      .trim();

    // Skip very short texts, pure numbers, or code-like content
    if (plainText.length < 15) continue;
    if (/^[\d\s.,;:!?]+$/.test(plainText)) continue;

    // If English words dominate, this needs translation
    if (isEnglishDominant(plainText)) {
      nodes.push({
        index: match.index,
        tag,
        html: fullMatch,
        plainText,
        isCode: false,
        isSvg: false,
      });
    }
  }

  return nodes;
}

/**
 * Build a translation prompt for a batch of plain text lines.
 */
function buildTranslationPrompt(lines: string[]): string {
  const systemPrompt = `Eres un traductor profesional de inglés a español para un manual técnico sobre orquestación de agentes de IA.
Reglas:
- Usa register "tú" (informal), NO uses "usted"
- Mantén términos técnicos en inglés: agent, skill, PM, PM Gateway, handoff contract, 3-Tier strategy, tier, trigger, pipeline, gate, co-deck, co-consult, ai-workspace-standards, Claude Code, Antigravity, harness, scaffold, audit
- Traduce de forma natural, NO literal
- Output SOLO las traducciones, una por línea, mismo orden que el input, SIN números de línea
- Mantén cualquier texto entre comillas dobles "..." tal cual`;
  return systemPrompt + "\n\nInput:\n" + lines.join("\n");
}

// --- Main ---

const args = process.argv.slice(2);
const chapterFilter = args.includes("--chapter")
  ? args[args.indexOf("--chapter") + 1]
  : null;
const dryRun = args.includes("--dry-run");

console.log("=== Spanish LLM Translation Script ===");
console.log(`Dry run: ${dryRun}`);
console.log(`Chapter filter: ${chapterFilter || "all"}`);
console.log();

for (const chapter of CHAPTERS_TO_PROCESS) {
  if (chapterFilter && !chapter.includes(chapterFilter)) continue;

  const esFile = path.join(DOCS_DIR, `${chapter}_es.html`);

  if (!fs.existsSync(esFile)) {
    console.log(`SKIP: ${esFile} not found`);
    continue;
  }

  const html = fs.readFileSync(esFile, "utf-8");
  const nodes = extractTextNodes(html);

  console.log(`${chapter}: ${nodes.length} text nodes need translation`);

  if (dryRun) {
    for (const node of nodes) {
      console.log(`  [${node.tag}] ${node.plainText.substring(0, 80)}...`);
    }
    continue;
  }

  // Process in batches of 30
  const batchSize = 30;
  for (let i = 0; i < nodes.length; i += batchSize) {
    const batch = nodes.slice(i, i + batchSize);
    const plainLines = batch.map((n) => n.plainText);

    const prompt = buildTranslationPrompt(plainLines);
    console.log(`  Batch ${Math.floor(i / batchSize) + 1}: translating ${batch.length} lines...`);

    // In actual execution, this would call the LLM
    // For now, just log what needs translation
    console.log(`  (Translation placeholder - implement LLM call here)`);
  }
}
