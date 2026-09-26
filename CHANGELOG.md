
## 2026-09-26

### Fixed
- Restored the missing September skill-lifecycle and `/sync` safety-gate guidance in the Japanese and Spanish editions, and aligned the related operational dates and validation details.
- Resolved the graft `$0` numeric-token parity warnings and the Korean mid-word emphasis warning.

### Fixed
- Reordered Design and i18n chapter check questions to match the teaching sequence.

### Fixed
- Added visible Hermes Agents appendix cards to every localized home page.

### Changed
- Promoted Design and i18n into numbered chapters; added Hermes Appendix F and operational standards updates.
- Synced with `ai-workspace-standards` main (2026-09-26).

# Changelog

All notable changes to this handbook will be documented in this file.

## [2026-09-26] — Design Foundation Structure

### Changed
- Reorganized Design Foundation into design philosophy, principles, guides, color system, typography and font system, standard components and screens, accessibility, and AI-output review.
- Added four-language guide and typography visuals, decision tables, and implementation rules for spacing, responsive behavior, glyph fallback, code type, and readable text.

## [2026-09-26] — Design Color System and Accessibility Expansion

### Changed
- Added a dedicated Design color-system section in all language editions: raw palette, semantic and component token tiers, state colors, dark-mode review, contrast, non-color cues, and keyboard focus.
- Extended the course schedule with Design Foundation·Accessibility (35 minutes) and i18n Design·Content Quality (25 minutes). The single-day core program is now 7 hours 40 minutes excluding breaks.

## [2026-09-26] — Substantive Design, i18n, and Hermes Revision

### Changed
- Rewrote the Design Foundation and i18n Operations core chapters in all four language editions with beginner-oriented concept explanations, decision tables, practical contracts, self-checks, and inline SVG flow diagrams that remain readable in light and dark modes.
- Rewrote the Hermes Agents appendix from a placeholder into an operations guide covering the `.hermes/skills/` mirror, native `AGENTS.md` loading, the deliberate absence of `HERMES.md` and registration manifests, user-owned trust configuration, context-size risks, and verification evidence.
- Synced the handbook footer baseline with `ai-workspace-standards` main (2026-09-26), rebuilt the search index, and preserved four-language structural parity.

## [2026-09-20] — Upstream Sync: --platform all, Domain Operating Model Note, Graft-First Scaffolding

### Changed
- Synced with `ai-workspace-standards` main (2026-09-20).
- **ch05** (ko/en/ja/es): the `new-project.ts` `--platform` flag now reads `claude|antigravity|codex|all` — the old `both` value was renamed to `all` upstream and expanded to cover all three platforms (Claude Code + Gemini/Antigravity + Codex); the default is `all` and naming a single platform keeps only that one. Also added a beginner-level note that official variant templates now carry the **Domain Operating Model** structure (workflow stages, RACI, decision gates declared as data per ADR-0083/0084), with a pointer to the advanced handbook's dedicated chapter.
- **Appendix E · graft** (ko/en/ja/es): notes that `new-project.ts` now builds the graft graph automatically at scaffold time — graft-first with a `bunx` fallback — so freshly created projects can answer `graft ask` from day one (upstream spec `2026-09-20-graft-scaffold-resilience`).
- Footer baseline date bumped to 2026-09-20; README Target Versions `ai-workspace-standards` main (2026-09).

## [2026-09-11] — Upstream Sync: k-ecos & k-krx Skills, /sync Safety Gates

### Changed
- Synced with `ai-workspace-standards` main (2026-09): the KR country scope grew from four to **six skills** with the addition of **k-ecos** (Bank of Korea ECOS open API; public demo key `sample`, ≤10 rows per call; cycle codes `A/S/Q/M/SM/D` — the legacy `YY/QQ/MM/DD` forms return ERROR-100) and **k-krx** (KRX Data Marketplace; no demo key, requests without a key return `401 Unauthorized Key`; key passed via the `AUTH_KEY` header; errors come back as bare `{"respCode":"...","respMsg":"..."}`).
- **Appendix D (ko/en/ja/es)** extended from three to five services: new ECOS and KRX rows in the key table (with `(2026-09 신규)` / localized markers), a new "What's new 2026-09" section covering both skills (issuance flow, curl examples, expected results, error shapes), `.env` snippets with `ECOS_API_KEY` / `KRX_API_KEY`, and license guidance scoped per service (KOGL still applies to the three public-sector services only). Free-of-charge claim now explicitly names DART · LAW(법제처) · KOSIS.
- **ch05** (ko/en): Korea-scope skill injection list updated to six skills.
- **ch12** (ko/en): the "Extra /sync safety gates" list gains the **Typecheck gate** (`dev-sync` step 3.95b → `scripts/typecheck.ts` vs the zero-error baseline in `scripts/helpers/typecheck-baseline.json`) and the **Upgrade coverage gate (ADR-0073)** (`audit.ts` runs `check-upgrade-coverage.ts --strict`).

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
