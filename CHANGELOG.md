# Changelog

All notable changes to this handbook will be documented in this file.

## [2026-08-18] — Project Review Fixes: Security, CI & Search Completeness

### Security
- **Fixed HTML entity escaping bug** in `site-search.js` — `'<'` was incorrectly escaped as `&gt;`, breaking search result rendering
- Removed all `execSync` (shell invocation) usage from `deploy-handbook.ts` — replaced `run()`/`shellEscape()` with `execFileSync` argument arrays across all 7 call sites
- Removed dead `callLocalLlm()` stub (shell injection pattern) and unused `execSync` imports from translation scripts
- Added 200-character input limit in `inpage-search.js` to prevent regex DoS

### Search
- Added 6 missing pages to `search-manifest.json` (index + setup pages for ko/en) — all 4 languages now have exactly 21 searchable pages
- Replaced 7 hardcoded colors in `site-search.js` with CSS variable references (dark mode support)
- Rewrote `copy-code.js` with clipboard API error handling, ARIA live region, and `execCommand` fallback

### CI
- Consolidated `validate-handbook.yml` from 8 parallel jobs (16 redundant checkout/setup steps) to a single job with 12 sequential checks
- Added 4 previously missing checks to CI: `check-symmetry`, `check-links`, `check-labels`, `check-search`
- Added search index freshness verification (`build-search-index` diff check)

### Translation Scripts (one-shot pipeline, maintenance)
- Moved 6 translation scripts from repo root to `scripts/`; added new shared module `translate-lib.ts` (file list, code-segment splitting, entity decoding, English/Spanish heuristic) used by all 7 translation scripts
- Renamed `translate-with-llm.ts` → `translate-dict.ts` (matches its dictionary-based behavior)
- Removed ~250 lines of dead code from `translate-full.ts`; fixed missing array terminator syntax error
- Deleted `_translation_work/` intermediate artifacts (gitignored working files)

### Misc
- Added `SPDX-License-Identifier: CC-BY-NC-SA-4.0` header to `LICENSE`
- Renormalized mixed CRLF line endings via `git add --renormalize`

## [2026-08-16] — Content Accuracy & Security Review

### Security
- **Fixed shell injection vulnerability** in `deploy-handbook.ts` — all `gh` CLI calls converted from `execSync` string concatenation to `execFileSync` argument arrays; added input validation for `repoSlug`, `visibility`, and `outputDir`

### Content Accuracy
- Added missing **co-abap** variant to all variant counts (9→10) across Korean, English, Japanese, and Spanish editions
- Fixed `memory/MEMORY.md` singular references → correct `memory/YYYY-MM-DD.md` pattern (40 edits across 24 files)
- Removed references to non-existent `common-contract.json` — replaced with actual governance document references (CONSTITUTION.md, AGENTS.md)
- Fixed `docs/context.md` references at workspace root level — clarified AGENTS.md is L0 SSOT
- Fixed directory name `presentations/` → `Projects/` in SVG diagram
- Corrected co-consult description from "7-Phase pipeline" to "PM-dispatched 7단계(Phase 0~6) 컨설팅 워크플로우"
- Replaced non-existent "co-marketing" variant reference with "co-game" in SVG diagrams
- Fixed Chinese text "宽带" mixed into Korean → "대역폭"

### Internationalization & Accessibility
- Internationalized `inpage-search.js` — Korean, English, Japanese, Spanish UI strings with automatic language detection
- Replaced hardcoded CSS colors in `inpage-search.js` with CSS variable references (dark mode support)
- Added `role="img"` and `aria-label` to all 184 SVGs across all language variants

### Cross-language Links
- Fixed Korean HTML links in Japanese (_ja) and Spanish (_es) pages pointing to correct language variants

### Minor
- Removed duplicate paragraph in `08_Intro_Advanced_Chapter` (all 4 variants)
- Fixed "유_ghost AI" typo → "유령 AI"
- Changed hypothetical "co-marketing" → "co-retail" to avoid confusion with actual variants

### Script Fixes
- Added `existsSync` guard in `check-tables.ts` to prevent ENOENT crash when `handbook-components.css` is missing
- Deleted stray `_stray_git_metadata_ignore/` and `_stray_zcode_metadata_ignore/` directories from `docs/setup/`
