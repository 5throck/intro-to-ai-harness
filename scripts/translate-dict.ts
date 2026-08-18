/**
 * translate-dict.ts
 * Dictionary-based translation of text content in Spanish HTML files.
 * Despite the original name (translate-with-llm), no LLM is involved —
 * a phrase dictionary is applied outside <pre><code> blocks.
 *
 * Usage: bun scripts/translate-dict.ts
 */

import * as fs from "fs";
import * as path from "path";
import { ES_FILES as FILES, splitCodeSegments } from "./translate-lib";

const BASE = "./docs";

const PROTECTED_TERMS = [
  "Claude Code", "Claude Desktop App", "Anthropic", "Antigravity CLI", "Antigravity",
  "PM Gateway", "PM Agent", "PM", "AGENTS.md", "CONSTITUTION.md", "CLAUDE.md",
  "GEMINI.md", "context.md", "CHANGELOG.md", "SSOT", "co-consult", "co-deck",
];

// Split HTML into segments, marking code blocks as non-translatable
// (see splitCodeSegments in translate-lib.ts)

// Extract translatable text lines from an HTML segment
function extractTranslatableLines(segment: string): string[] {
  const lines = segment.split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip HTML comments
    if (/^\s*<!--/.test(line)) continue;

    // Skip lines that are only HTML tags or whitespace
    const stripped = line.replace(/<[^>]+>/g, "").trim();
    if (stripped.length === 0) continue;

    // Skip lines with only CSS/JS attributes
    if (/^\s*<(style|script|link|meta)/i.test(line)) continue;

    // Skip lines that look like code (inline code)
    if (/<code>.*<\/code>/i.test(line) && stripped.length < 100) continue;

    // Skip lines that are only numbers, URLs, or file paths
    if (/^(https?:\/\/|[\d\s\.\-–—,;:<>\/\\]+$/.test(stripped)) continue;
    if (/^\.?\/?[\w\-]+\.\w+$/.test(stripped)) continue;
    if (/^<code>/.test(stripped)) continue;

    // Check if the line contains mostly English text
    const hasEnglishWords = /\b(the|and|for|that|this|with|from|your|you|are|not|can|will|all|has|but|one|our|out|how|use|each|make|get|let|set|run|see|add|try|open|follow|click|type|enter|after|before|when|where|which|what|why|who|should|must|need|want|into|about|over|under|between|through|during|without|within|using|being|having|doing|going|coming|taken|given|called|known|shown|found|used|made|done|said|been|were|was)\b/i.test(stripped);

    if (hasEnglishWords) {
      result.push(line);
    }
  }

  return result;
}

// Build a comprehensive dictionary-based translation for common patterns
const COMPREHENSIVE_DICT: [RegExp, string][] = [
  // Nav & structure
  [/&larr; Handbook Home/g, "&larr; Inicio del manual"],
  [/← Handbook Home/g, "← Inicio del manual"],
  [/Other Chapters/g, "Otros capítulos"],
  [/Table of Contents/g, "Tabla de contenidos"],
  [/Next Chapter &rarr;/g, "Siguiente capítulo &rarr;"],
  [/Previous Chapter/g, "Capítulo anterior"],
  [/Based on /g, "Basado en "],
  [/English Educational Materials/g, "Materiales educativos en español"],
  [/Official Docs:/g, "Documentos oficiales:"],
  [/Handbook content is licensed under/g, "El contenido del manual está licenciado bajo"],
  [/Attribution-NonCommercial-ShareAlike 4\.0 International/g, "Atribución-NoComercial-CompartirIgual 4.0 Internacional"],
  [/Introduction to Claude Code and Multi-Agent Harness/g, "Introducción a Claude Code y Multi-Agent Harness"],

  // Chapter/Part/Appendix labels
  [/\bChapter (\d+)\b/g, "Capítulo $1"],
  [/\bCh (\d+)\b/g, "Cap. $1"],
  [/\bPart (\d+)\b/g, "Parte $1"],
  [/\bAppendix\b/g, "Apéndice"],
  [/>App ([A-C])</g, ">Ap $1<"],

  // Section titles (from translate-content.ts - already applied, but ensure)
  [/Pre-flight Checklist/g, "Lista de verificación previa al vuelo"],
  [/Subscription Plans/g, "Planes de suscripción"],
  [/Installation Verification/g, "Verificación de instalación"],
  [/System Requirements/g, "Requisitos del sistema"],
  [/MacOS Installation/g, "Instalación en MacOS"],
  [/Windows Installation/g, "Instalación en Windows"],
  [/Linux Installation/g, "Instalación en Linux"],
  [/Troubleshooting/g, "Solución de problemas"],
  [/Required Subscriptions/g, "Suscripciones requeridas"],
  [/What This Chapter Covers/g, "Lo que cubre este capítulo"],
  [/Creating the Folder/g, "Creando la carpeta"],
  [/Folder Structure/g, "Estructura de la carpeta"],
  [/Version Check/g, "Verificación de versión"],
  [/Run the Verification Script/g, "Ejecutar el script de verificación"],
  [/Sample Verification Results/g, "Resultados de verificación de ejemplo"],
  [/Verification Checklist/g, "Lista de verificación"],
  [/Other Issues/g, "Otros problemas"],
  [/Windows-Specific Tips/g, "Consejos específicos de Windows"],

  // Table headers
  [/Item/g, "Elemento"],
  [/Description/g, "Descripción"],
  [/How to Check/g, "Cómo verificar"],
  [/Minimum/g, "Mínimo"],
  [/Recommended/g, "Recomendado"],
  [/Component/g, "Componente"],
  [/Feature/g, "Función"],
  [/Best For/g, "Ideal para"],
  [/Monthly Price/g, "Precio mensual"],
  [/Usage Multiplier/g, "Multiplicador de uso"],
  [/Projects/g, "Proyectos"],
  [/Symptom/g, "Síntoma"],
  [/Possible Cause/g, "Causa posible"],
  [/Solution/g, "Solución"],
  [/Requirement/g, "Requisito"],
  [/Principle/g, "Principio"],
  [/Instead of this\.\.\./g, "En lugar de esto..."],
  [/Try this\.\.\./g, "Prueba esto..."],

  // SVG labels (preserving tags)
  [/>Root folder</g, ">Carpeta raíz<"],
  [/>Subfolder</g, ">Subcarpeta<"],
  [/>Script file</g, ">Archivo de script<"],
  [/>Project folder</g, ">Carpeta de proyecto<"],
  [/>Handles everything</g, ">Hace todo<"],
  [/>Each specialist focuses on its strength</g, ">Cada especialista se enfoca en su fortaleza<"],
  [/Research \+ Design \+ Code = Complete deliverable</g, "Investigación + Diseño + Código = Entregable completo"],
  [/>One AI</g, ">Una IA<"],
  [/Agent Team/g, "Equipo de agentes"],
  [/Output/g, "Resultado"],
  [/Terminal - setup verification/g, "Terminal - verificación de configuración"],
  [/Installation Verification Results/g, "Resultados de verificación de instalación"],
  [/Installed \(OK\)/g, "Instalado (OK)"],
  [/Not installed or error/g, "No instalado o error"],
  [/checks passed/g, "verificaciones aprobadas"],
  [/Installation complete!/g, "¡Instalación completa!"],
  [/=== Installation Verification Results ===/g, "=== Resultados de verificación de instalación ==="],
  [/Figure/g, "Figura"],
];

function processFileWithDict(html: string): string {
  // Split into code/non-code segments
  const segments = splitCodeSegments(html);
  const result: string[] = [];

  for (const seg of segments) {
    if (seg.isCode) {
      result.push(seg.text);
      continue;
    }

    let text = seg.text;
    // Apply comprehensive dictionary
    for (const [pattern, replacement] of COMPREHENSIVE_DICT) {
      text = text.replace(pattern, replacement);
    }
    result.push(text);
  }

  return result.join("");
}

function processFile(relPath: string) {
  const filePath = path.join(BASE, relPath);
  let html = fs.readFileSync(filePath, "utf-8");
  html = processFileWithDict(html);
  fs.writeFileSync(filePath, html, "utf-8");
  console.log(`✓ Processed: ${relPath}`);
}

// Main
for (const file of FILES) {
  processFile(file);
}
console.log(`\nDone! ${FILES.length} files processed.`);
