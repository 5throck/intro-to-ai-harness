/**
 * translate-structural.ts
 * Performs structural transformations on English HTML files to create Spanish skeleton files.
 * Then for each file, shows what text content needs manual translation.
 *
 * Usage: bun scripts/translate-structural.ts
 */

import * as path from "path";
import * as fs from "fs";
import { ES_FILES, EN_FILES } from "./translate-lib";

const BASE = "./docs";

// [input, output] pairs derived from the shared file list
const FILES: [string, string][] = EN_FILES.map((en, i) => [en, ES_FILES[i]]);

// Common English → Spanish translations for structural elements
const STRUCT_REPLACEMENTS: [RegExp, string][] = [
  [/<html lang="en">/g, '<html lang="es">'],
  [/English Educational Materials/g, 'Materiales educativos en español'],
  [/Official Docs:/g, 'Documentos oficiales:'],
  [/Attribution-NonCommercial-ShareAlike 4\.0 International/g, 'Atribución-NoComercial-CompartirIgual 4.0 Internacional'],
  [/Handbook content is licensed under/g, 'El contenido del manual está licenciado bajo'],
  [/Based on /g, 'Basado en '],
];

async function processFile(inputRel: string, outputRel: string) {
  const inputPath = path.join(BASE, inputRel);
  const outputPath = path.join(BASE, outputRel);

  // Ensure output directory exists
  const outDir = path.dirname(outputPath);
  const fullOutDir = path.join(BASE, outDir);
  fs.mkdirSync(fullOutDir, { recursive: true });

  let html = fs.readFileSync(inputPath, "utf-8");

  // Apply structural replacements
  for (const [pattern, replacement] of STRUCT_REPLACEMENTS) {
    html = html.replace(pattern, replacement);
  }

  // Replace _en.html with _es.html in all href attributes (but not in code blocks)
  // We'll do a simple approach: replace in href attributes only
  html = html.replace(/(href="[^"]*)_en\.html(")/g, '$1_es.html$2');

  fs.writeFileSync(outputPath, html, "utf-8");
  console.log(`✓ Created structural skeleton: ${outputRel}`);
}

async function main() {
  console.log("Creating structural Spanish skeletons...\n");
  for (const [input, output] of FILES) {
    await processFile(input, output);
  }
  console.log(`\nDone! ${FILES.length} structural skeletons created.`);
  console.log("These files have: lang=es, _es links, translated footer.");
  console.log("Content text still needs manual translation.");
}

main();
