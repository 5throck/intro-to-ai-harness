/**
 * translate-content.ts
 * Translates visible text content in Spanish skeleton HTML files.
 * Uses a large phrase dictionary applied outside of <pre><code> blocks.
 *
 * Usage: bun scripts/translate-content.ts
 */

import * as fs from "fs";
import * as path from "path";
import { ES_FILES as FILES, splitCodeSegments } from "./translate-lib";

const BASE = "./docs";

// Comprehensive English → Spanish dictionary (applied longest-first to avoid partial matches)
const DICT: [RegExp, string][] = [
  // Nav
  [/&larr; Handbook Home/g, "&larr; Inicio del manual"],
  [/← Handbook Home/g, "← Inicio del manual"],
  [/Handbook Home/g, "Inicio del manual"],
  [/Other Chapters/g, "Otros capítulos"],
  [/Table of Contents/g, "Tabla de contenidos"],

  // Chapter labels
  [/Chapter (\d+)/g, "Capítulo $1"],
  [/Ch (\d+)/g, "Cap. $1"],
  [/chapter-eyebrow">Chapter (\d+)/g, "chapter-eyebrow\">Capítulo $1"],
  [/>Chapter (\d+)<\/div>/g, ">Capítulo $1</div>"],

  // Part labels
  [/>Part (\d+)</g, ">Parte $1"],

  // Appendix labels
  [/Appendix/g, "Apéndice"],
  [/App [A-C]/g, (m) => m.replace("App", "Ap")],

  // Common section headers
  [/What This Chapter Covers/g, "Lo que cubre este capítulo"],
  [/What You'll Be Able to Do After This Handbook/g, "Lo que serás capaz de hacer después de este manual"],
  [/What You Will Be Able to Do/g, "Lo que serás capaz de hacer"],

  // Navigation
  [/Next Chapter &rarr;/g, "Siguiente capítulo &rarr;"],
  [/Previous Chapter/g, "Capítulo anterior"],
  [/Previous Chapter/g, "Capítulo anterior"],

  // Footer already handled by structural script

  // Common phrases - longer matches first
  [/multi-agent harness/g, "harness multi-agente"],
  [/multi-agent teams/g, "equipos multi-agente"],
  [/multi-agent system/g, "sistema multi-agente"],
  [/multi-agent workflows/g, "flujos de trabajo multi-agente"],
  [/Multi-Agent Harness/g, "Multi-Agent Harness"],

  // Common UI labels
  [/Copy<\/button>/g, "Copiar</button>"],

  // Common prose phrases
  [/This chapter walks you through/g, "Este capítulo te guía a través de"],
  [/This chapter explores/g, "Este capítulo explora"],
  [/This chapter covers/g, "Este capítulo cubre"],
  [/let's walk through/g, "repasemos"],
  [/Let us walk through/g, "Repasemos"],
  [/Let's walk through/g, "Repasemos"],
  [/in this section/g, "en esta sección"],
  [/In this section/g, "En esta sección"],
  [/In this chapter/g, "En este capítulo"],
  [/In this handbook/g, "En este manual"],
  [/this handbook/g, "este manual"],
  [/this chapter/g, "este capítulo"],
  [/This handbook/g, "Este manual"],
  [/This chapter/g, "Este capítulo"],

  // Common phrases
  [/Getting Started with/g, "Comenzando con"],
  [/Setting Up Your Lab/g, "Configurando tu laboratorio"],
  [/Setting Up the Folder/g, "Configurando la carpeta"],
  [/Setting Up Your Lab/g, "Configurando tu laboratorio"],
  [/Expected Benefits/g, "Beneficios esperados"],
  [/Rapid AI Evolution/g, "Evolución rápida de la IA"],
  [/Single AI vs\. Agent Teams/g, "IA individual vs. equipos de agentes"],
  [/What is a Harness\?/g, "¿Qué es un Harness?"],
  [/What is a Harness/g, "¿Qué es un Harness"],
  [/Handbook Roadmap/g, "Mapa del manual"],
  [/Harness Concepts/g, "Conceptos del Harness"],
  [/Workspace Standards/g, "Estándares del workspace"],
  [/Why AI Agent Teams\?/g, "¿Por qué equipos de AI agent?"],
  [/Why AI Agent Teams/g, "¿Por qué equipos de AI agent?"],
  [/Why AI Agents/g, "¿Por qué AI agent?"],
  [/Creating &amp; Modifying Agents/g, "Creación y modificación de agentes"],
  [/Creating &amp; Modifying Skills/g, "Creación y modificación de skills"],
  [/Creating Agents/g, "Creando agentes"],
  [/Creating Skills/g, "Creando skills"],
  [/Building Your Own Agent Team/g, "Construyendo tu propio equipo de agentes"],
  [/Building Agent Team/g, "Construyendo equipo de agentes"],
  [/Understanding Workflows &amp; Automation/g, "Comprendiendo flujos de trabajo y automatización"],
  [/Workflows Automation/g, "Automatización de flujos de trabajo"],
  [/Next Steps/g, "Próximos pasos"],
  [/Integrated Pipeline/g, "Pipeline integrado"],
  [/Co-Consult Practice/g, "Práctica de co-consult"],
  [/Co-Deck Practice/g, "Práctica de co-deck"],
  [/Combined co-consult \+ co-deck Pipeline/g, "Pipeline combinado co-consult + co-deck"],
  [/Course Overview/g, "Vista general del curso"],
  [/Lecture Guide/g, "Guía del instructor"],
  [/Pre-Installation Checklist/g, "Lista de verificación previa a la instalación"],
  [/Remote Access Setup/g, "Configuración de acceso remoto"],
  [/Remote Access Environment Setup/g, "Configuración de entorno de acceso remoto"],
  [/Claude Code CLI Guide/g, "Guía de Claude Code CLI"],
  [/Low-Cost AI Backend Integration/g, "Integración de backends de IA de bajo costo"],
  [/Low-Cost Backends/g, "Backends de bajo costo"],

  // Subscription/setup
  [/Pre-flight Checklist/g, "Lista de verificación previa al vuelo"],
  [/Subscription Plans/g, "Planes de suscripción"],
  [/Installation Verification/g, "Verificación de instalación"],
  [/System Requirements/g, "Requisitos del sistema"],
  [/MacOS Installation/g, "Instalación en MacOS"],
  [/Windows Installation/g, "Instalación en Windows"],
  [/Linux Installation/g, "Instalación en Linux"],
  [/Troubleshooting/g, "Solución de problemas"],

  // Common table headers
  [/Requirement/g, "Requisito"],
  [/Minimum/g, "Mínimo"],
  [/Recommended/g, "Recomendado"],
  [/Description/g, "Descripción"],
  [/How to Check/g, "Cómo verificar"],
  [/Component/g, "Componente"],
  [/Feature/g, "Función"],
  [/Best For/g, "Ideal para"],
  [/Monthly Price/g, "Precio mensual"],
  [/Usage Multiplier/g, "Multiplicador de uso"],
  [/Projects/g, "Proyectos"],
  [/Symptom/g, "Síntoma"],
  [/Possible Cause/g, "Causa posible"],
  [/Solution/g, "Solución"],
  [/Principle/g, "Principio"],
  [/Instead of this\.\.\./g, "En lugar de esto..."],
  [/Try this\.\.\./g, "Prueba esto..."],

  // Tip/note boxes
  [/Copy<\/button>/g, "Copiar</button>"],

  // Verification checklist items
  [/Installation complete!/g, "¡Instalación completa!"],
  [/checks passed/g, "verificaciones aprobadas"],

  // Common UI text in SVGs
  [/Terminal - setup verification/g, "Terminal - verificación de configuración"],
  [/Installation Verification Results/g, "Resultados de verificación de instalación"],
  [/Installed \(OK\)/g, "Instalado (OK)"],
  [/Not installed or error/g, "No instalado o error"],

  // Step labels
  [/Step (\d+):/g, "Paso $1:"],

  // Common prose
  [/Step-by-Step Approach/g, "Enfoque paso a paso"],
  [/Overloaded Prompt/g, "Prompt sobrecargado"],
  [/Write Clear Prompts/g, "Escribe prompts claros"],
  [/Break Down Complex Requests/g, "Descompón solicitudes complejas"],
  [/Set Your Language Preference/g, "Establece tu preferencia de idioma"],
  [/Use Claude for Learning, Not Just Answers/g, "Usa Claude para aprender, no solo para obtener respuestas"],
  [/Common Beginner Mistakes to Avoid/g, "Errores comunes de principiantes a evitar"],

  // SVG labels
  [/Root folder/g, "Carpeta raíz"],
  [/Subfolder/g, "Subcarpeta"],
  [/Script file/g, "Archivo de script"],
  [/Project folder/g, "Carpeta de proyecto"],
  [/Handles everything/g, "Hace todo"],
  [/Each specialist focuses on its strength/g, "Cada especialista se enfoca en su fortaleza"],
  [/Research \+ Design \+ Code = Complete deliverable/g, "Investigación + Diseño + Código = Entregable completo"],
  [/One AI/g, "Una IA"],
  [/Agent Team/g, "Equipo de agentes"],
  [/Output/g, "Resultado"],
  [/Topic/g, "Tema"],

  // Fig captions
  [/Figure/g, "Figura"],
];

// Protected terms that should NOT be translated
const PROTECTED = /\b(Claude Code|Claude Desktop App|Antigravity CLI|Antigravity|PM Gateway|AGENTS\.md|CONSTITUTION\.md|CLAUDE\.md|GEMINI\.md|context\.md|CHANGELOG\.md|SSOT)\b/g;

function translateContent(html: string): string {
  // Split into code/non-code segments; odd segments are code blocks
  const parts = splitCodeSegments(html).map((seg) => {
    if (seg.isCode) return seg.text; // Skip code blocks

    // Apply dictionary translations
    let result = seg.text;
    for (const [pattern, replacement] of DICT) {
      result = result.replace(pattern, replacement);
    }
    return result;
  });
  return parts.join("");
}

async function processFile(relPath: string) {
  const filePath = path.join(BASE, relPath);
  let html = fs.readFileSync(filePath, "utf-8");
  html = translateContent(html);
  fs.writeFileSync(filePath, html, "utf-8");
  console.log(`✓ Translated content: ${relPath}`);
}

async function main() {
  console.log("Translating content in skeleton files...\n");
  for (const file of FILES) {
    await processFile(file);
  }
  console.log(`\nDone! ${FILES.length} files translated.`);
}

main();
