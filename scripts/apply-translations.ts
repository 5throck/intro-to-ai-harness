/**
 * apply-translations.ts
 * Reads extracted translation files, applies translations using the local LLM,
 * and writes the translated content back to the HTML files.
 * 
 * This script reads the _translation_work/*.lines.txt files and applies
 * the translations from companion _translation_work/*.translated.txt files.
 * 
 * If no translated file exists yet, it creates a prompt file for manual/LLM translation.
 *
 * Usage: bun scripts/apply-translations.ts
 */

import * as fs from "fs";
import * as path from "path";
import { ES_FILES as FILES } from "./translate-lib";

const BASE = "./docs";
const WORK_DIR = "./_translation_work";

function applyTranslations(htmlFilePath: string, linesFilePath: string): void {
  const translatedPath = linesFilePath.replace(".lines.txt", ".translated.txt");
  
  if (!fs.existsSync(translatedPath)) {
    console.log(`  ⚠ No translated file found: ${translatedPath}`);
    return;
  }

  let html = fs.readFileSync(htmlFilePath, "utf-8");
  const translatedContent = fs.readFileSync(translatedPath, "utf-8");

  // Parse translated lines: format is "LINE_NUM|TRANSLATED_HTML"
  const translations = new Map<number, string>();
  for (const line of translatedContent.split("\n")) {
    const pipeIdx = line.indexOf("|");
    if (pipeIdx === -1) continue;
    const lineNum = parseInt(line.substring(0, pipeIdx));
    const translated = line.substring(pipeIdx + 1);
    if (!isNaN(lineNum)) {
      translations.set(lineNum, translated);
    }
  }

  // Apply translations by replacing lines
  const htmlLines = html.split("\n");
  let replaceCount = 0;
  for (const [lineNum, translated] of translations) {
    if (lineNum >= 1 && lineNum <= htmlLines.length) {
      htmlLines[lineNum - 1] = translated;
      replaceCount++;
    }
  }

  html = htmlLines.join("\n");
  fs.writeFileSync(htmlFilePath, html, "utf-8");
  console.log(`  ✓ Applied ${replaceCount} translations`);
}

// Main
console.log("Applying translations to HTML files...\n");
for (const file of FILES) {
  const linesFile = path.join(WORK_DIR, file.replace("_es.html", ".lines.txt"));
  const htmlFile = path.join(BASE, file);
  
  if (fs.existsSync(linesFile)) {
    console.log(`Processing: ${file}`);
    applyTranslations(htmlFile, linesFile);
  } else {
    console.log(`⊘ No lines file: ${file}`);
  }
}
console.log("\nDone!");
