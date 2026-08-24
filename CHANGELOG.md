# Changelog

All notable changes to this handbook will be documented in this file.

## [2026-08-24] — Four-Language Content Parity & Workspace Accuracy

### Added
- **`scripts/check-i18n-parity.ts`** — new cross-language content gate: FAIL on heading/code-block count mismatches, missing language variants, and wrong-language internal links; WARN on >15% list/table drift and numeric-token divergence. Wired into `handbook-doctor` (Check 13) and `package.json` (`bun run check-i18n`).
- **bun run ci** - one-command local run of the exact CI check chain (validate-handbook through check-search); prevents the doctor-green-but-CI-red failure mode.

### Changed
- **Regenerated en/ja/es editions from the Korean canonical** for ch01, ch02, ch04, ch05, ch07, ch08, ch09, ch10, ch11, ch13, Appendix A, Appendix B, Appendix C — structure now identical across languages: ch09/ch10 practice labs restored (were empty), ch13 FAQ set unified at 12 questions, ch02 plan-comparison table, ch04 gateway sections + 3-Tier table, ch08 handoff procedure & timeline, ch11 team-builder internals (+202 lines of backported sections), App A/B install details and full command sets, App C z.ai/GLM pricing.
- README_ko/ja/es re-aligned to the README.md section structure.
- Workspace-accuracy fixes carried into all four languages: 11 variants incl. co-hr, `--country <CODE>` option, Phase 0–6 pipeline model (ch06), corrected agent frontmatter spec with nested tier map + lifecycle governance record (ch09), tool-hook chain & /sync safety gates documented (ch12), KOSIS_API_KEY pre-listed in `.env.sample` country-scoped block (App D).

### Fixed
- Spanish headings translated in ch03/ch06/ch12 (54 headings) plus index/ch04 titles; ch13_es FAQ numbering normalized to P1–P11; SETUP_CHECKLIST_ja wrong-language link retargeted; stale `lang-switcher.js` comment corrected; ch07_es `70 %`→`70%` formatting.

## [2026-08-23] — Copy Button CSP Compliance

### Bug Fix
- **Fixed all copy buttons site-wide** — the CSP meta tag (`script-src 'self'`) blocks inline event handlers, so every `<button onclick="copyCode(this)">` stopped working. Clicks are now handled by document-level event delegation for `.copy-btn` in `copy-code.js`, and all 538 inline handlers across 60 pages were removed.

### Hardening
- Copy feedback now restores each button's original localized label instead of a hardcoded string (button labels vary by page language)
- No CSP change — the strict `script-src 'self'` policy is preserved

### Maintenance
- Normalized mixed CRLF/LF line endings in `docs/*.html` back to the repo's canonical CRLF checkout form (damage introduced by a crashed one-shot edit script)

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
