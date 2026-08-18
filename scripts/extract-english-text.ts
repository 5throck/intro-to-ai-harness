/**
 * extract-english-text.ts
 * Extracts all English text content from skeleton _es.html files
 * that still needs translation, outputting one text file per HTML file.
 * Each output line is: LINE_NUMBER | ORIGINAL_TEXT
 *
 * Usage: bun scripts/extract-english-text.ts
 */

import * as fs from "fs";
import * as path from "path";
import { ES_FILES as FILES, isEnglishDominant } from "./translate-lib";

const BASE = "./docs";

const OUTPUT_DIR = "./_translation_work";

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function isEnglishText(text: string): boolean {
  const clean = text.trim();
  if (clean.length < 15) return false; // Skip very short texts
  if (clean.length > 500) return true; // Long text is likely English prose
  return isEnglishDominant(clean);
}

function extractTranslatableText(html: string): {lineNum: number, text: string}[] {
  const lines = html.split("\n");
  const results: {lineNum: number, text: string}[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track code blocks
    if (/<pre><code/.test(line)) { inCodeBlock = true; continue; }
    if (/<\/code><\/pre>/.test(line)) { inCodeBlock = false; continue; }
    if (inCodeBlock) continue;

    // Skip pure HTML, comments, empty lines
    const stripped = line.replace(/<[^>]*>/g, "").trim();
    if (stripped.length < 15) continue;

    // Skip HTML comments
    if (/^\s*<!--/.test(line)) continue;

    // Skip lines that are only CSS styles, script tags, etc.
    if (/^\s*<(style|script|link|meta)/i.test(line)) continue;

    // Check if this line has English text needing translation
    if (isEnglishText(stripped)) {
      results.push({ lineNum: i + 1, text: line });
    }
  }

  return results;
}

function processFile(relPath: string) {
  const filePath = path.join(BASE, relPath);
  const html = fs.readFileSync(filePath, "utf-8");
  const items = extractTranslatableText(html);

  const outPath = path.join(OUTPUT_DIR, relPath.replace("_es.html", ".lines.txt"));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const output = items.map(item => `${item.lineNum}|${item.text}`).join("\n");
  fs.writeFileSync(outPath, output, "utf-8");

  console.log(`✓ ${relPath}: ${items.length} lines to translate`);
}

console.log("Extracting English text from skeleton files...\n");
for (const file of FILES) {
  processFile(file);
}
console.log(`\nDone! Output in ${OUTPUT_DIR}/`);
