/**
 * translate-lib.ts
 * Shared constants and helpers for the one-shot Spanish translation scripts
 * (translate-structural.ts, translate-content.ts, translate-dict.ts,
 * translate-full.ts, extract-english-text.ts, apply-translations.ts,
 * translate-es-llm.ts).
 *
 * Import from here instead of duplicating lists and heuristics per script.
 */

/** Spanish handbook pages processed by the translation pipeline. */
export const ES_FILES: string[] = [
  "ch03/03_Setup_Guide_es.html",
  "ch04/04_Harness_Concepts_es.html",
  "ch05/05_Workspace_Standards_es.html",
  "ch06/06_Co_Consult_Practice_es.html",
  "ch07/07_Co_Deck_Practice_es.html",
  "ch08/08_Integrated_Pipeline_es.html",
  "ch09/09_Creating_Agents_es.html",
  "ch10/10_Creating_Skills_es.html",
  "ch11/11_Building_Agent_Team_es.html",
  "ch12/12_Workflows_Automation_es.html",
  "ch13/13_Next_Steps_es.html",
  "lecture-guide/00_Course_Overview_es.html",
  "lecture-guide/00_Lecture_Guide_es.html",
  "setup/SETUP_es.html",
  "setup/SETUP_CHECKLIST_es.html",
  "appendix/A_Remote_Access_es.html",
  "appendix/B_Claude_Code_CLI_es.html",
  "appendix/C_Low_Cost_Backends_es.html",
];

/** English source page for each Spanish page above. */
export const EN_FILES: string[] = ES_FILES.map((f) => f.replace("_es.html", "_en.html"));

export interface Segment {
  text: string;
  isCode: boolean;
}

/** Split HTML into code-block / non-code segments so code is never translated. */
export function splitCodeSegments(html: string): Segment[] {
  const segments: Segment[] = [];
  const codeBlockRegex = /(<pre><code[\s\S]*?<\/code><\/pre>)/gi;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: html.slice(lastIndex, match.index), isCode: false });
    }
    segments.push({ text: match[1], isCode: true });
    lastIndex = match.index + match[1].length;
  }
  if (lastIndex < html.length) {
    segments.push({ text: html.slice(lastIndex), isCode: false });
  }

  return segments;
}

/** Decode common HTML entities to plain characters (for LLM input). */
export function decodeEntities(text: string): string {
  const entities: [string, string][] = [
    ["&nbsp;", " "],
    ["&mdash;", "—"],
    ["&ndash;", "–"],
    ["&rsquo;", "'"],
    ["&lsquo;", "'"],
    ["&rdquo;", '"'],
    ["&ldquo;", '"'],
    ["&middot;", "·"],
    ["&rarr;", "→"],
    ["&larr;", "←"],
    ["&amp;", "&"],
    ["&lt;", "<"],
    ["&gt;", ">"],
    ["&hellip;", "…"],
  ];
  for (const [entity, char] of entities) {
    text = text.split(entity).join(char);
  }
  return text;
}

/** Strip HTML tags, decode entities, collapse whitespace → plain text. */
export function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

const EN_STOP_WORDS = [
  "the", "is", "are", "was", "were", "has", "have", "had", "will", "would",
  "can", "could", "should", "this", "that", "with", "from", "into", "about",
  "which", "when", "where", "what", "how", "your", "their", "our", "you",
  "they", "we", "he", "she", "it", "and", "but", "for", "not", "all", "each",
  "every", "any", "both", "few", "more", "most", "other", "some", "such",
  "no", "only", "same", "than", "too", "very", "just", "because", "as",
  "until", "while", "of", "at", "by", "an", "be", "if", "or", "who", "so",
  "up", "out", "do", "to", "in", "on", "there", "these", "those", "also",
  "then", "like", "does", "its", "been", "being",
];

const ES_STOP_WORDS = [
  "el", "la", "los", "las", "de", "en", "un", "una", "es", "que", "con",
  "por", "para", "del", "se", "no", "su", "al", "como", "más", "pero",
  "sus", "este", "ya", "todo", "está", "ha", "será", "puede", "son",
  "cada", "hay", "muy", "también", "sobre", "entre", "sin", "cuando",
  "donde", "todos", "otros", "otro", "desde", "debe", "tiene", "nos",
  "les", "lo", "le", "me", "qué", "cómo", "aquí", "ahora", "bien", "solo",
];

/**
 * Heuristic: text is predominantly English (needs translation to Spanish)
 * when English stop words outnumber Spanish stop words by more than 2.
 */
export function isEnglishDominant(text: string): boolean {
  const lower = text.toLowerCase();
  let en = 0;
  let es = 0;
  for (const w of EN_STOP_WORDS) {
    if (new RegExp(`\\b${w}\\b`).test(lower)) en++;
  }
  for (const w of ES_STOP_WORDS) {
    if (new RegExp(`\\b${w}\\b`).test(lower)) es++;
  }
  return en > es + 2;
}
