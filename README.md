# Introduction to Claude Code and Multi-Agent Harness

Language: **English** | [한국어](README_ko.md)

A beginner-friendly bilingual handbook (Korean/English) for AI newcomers. Using Claude Desktop App as the default tool, it teaches AI agent team concepts from basics to hands-on creation — with copyable commands and inline SVG diagrams.

## 🌐 Read the Handbook Live

👉 **[Online Handbook](https://5throck.github.io/intro-to-ai-harness/)**

## 📚 Curriculum / Contents (13 Chapters + 3 Appendices)

| # | English | 한국어 | Key Topics |
|---|---------|--------|------------|
| 1 | Why AI Agent Teams? | 왜 AI 에이전트 팀인가? | AI trends, single AI vs multi-agent, harness concept |
| 2 | Getting Started with Claude Desktop App | Claude Desktop App 시작하기 | Installation, subscription, projects, first conversation, Artifacts |
| 3 | Setting Up Your Lab | 실습 환경 구축 | OS-specific install scripts and verification |
| 4 | Multi-Agent Harness Concepts | 멀티 에이전트 하네스 개념 | Agents, skills, workflows, PM orchestration |
| 5 | Exploring ai-workspace-standards | ai-workspace-standards 살펴보기 | Repository structure, L0→L1→L2, variant, common contract |
| 6 | co-consult: AI Consulting in Practice | co-consult: AI 컨설팅 실습 | 7-Phase workflow, team composition scenarios |
| 7 | co-deck: AI Presentation in Practice | co-deck: AI 프레젠테이션 실습 | 11-Stage pipeline, theme/style, Gate approval |
| 8 | Combined co-consult + co-deck Pipeline | co-consult + co-deck 통합 파이프라인 | Report + presentation integration exercise |
| 9 | Creating & Modifying Agents | 에이전트 만들기와 수정 | Agent file format, agent-lifecycle-manager |
| 10 | Creating & Modifying Skills | 스킬 만들기와 수정 | Skill file format, skill-lifecycle-manager |
| 11 | Building Your Own Agent Team | 나만의 에이전트 팀 구성하기 | team-builder 5-step workflow |
| 12 | Understanding Workflows & Automation | 워크플로우와 자동화 이해 | /sync command, Git/GitHub, Hook, CI/CD |
| 13 | Next Steps | 다음 단계 | Community, learning resources, use cases, FAQ |

### Appendices

| Appendix | Title | Description |
|----------|-------|-------------|
| A | Remote Access Setup | Tailscale / NoMachine / Windows RDP |
| B | Claude Code CLI Guide | Installation, terminal usage, key commands |
| C | Low-Cost AI Backend Integration | DeepSeek / GLM / LiteLLM |

### Instructor Materials

| Page | Description |
|-------|-------------|
| [Course Overview](docs/lecture-guide/00_Course_Overview_en.html) | Learning objectives, target audience, prerequisites, schedule, outcomes |
| [Lecture Guide](docs/lecture-guide/00_Lecture_Guide_en.html) | Preparation checklist, time allocation, chapter instructor notes, review questions |

## ✨ Features

- **Bilingual (한국어/English)**: Every chapter in Korean/English pairs (`*_en.html`), language switcher dropdown
- **87 inline SVG diagrams**: CSS variable colors auto-adapt to dark mode
- **Copyable commands**: Copy button on every code block
- **Cross-platform**: MacOS / Windows / Linux commands provided
- **Dark mode**: Theme toggle support
- **In-page search**: Browser-search alternative built-in search

## 📁 Project Structure

```
intro-to-ai-harness/
  README.md                  # English README (this file)
  README_ko.md               # 한국어 README
  LICENSE                    # CC BY-NC-SA 4.0
  docs/
    index.html                # 한국어 목차
    index_en.html             # English TOC
    ch01/ ~ ch13/             # 각 장 (ko + en)
    lecture-guide/            # Instructor materials (ko + en)
    appendix/                 # Appendices A/B/C (ko + en)
    assets/
      css/
        handbook-variables.css      # Shared CSS variables
        handbook-components.css     # Shared component styles
      dark-mode-toggle.js
      inpage-search.js
      lang-switcher.js
  scripts/                    # Validation and tooling scripts
  package.json
```

## 🛠 Development

The handbook is a static site. To edit:

1. Copy an existing chapter file (e.g., `ch04/04_Harness_Concepts.html`) as a template.
2. Follow the HTML structure: `<div class="layout">` → `<nav>` → `<main>` → `<article class="reading">`.
3. Every code block must use:
   ```html
   <div class="code-block">
   <pre><code>COMMAND</code></pre>
   <button type="button" class="copy-btn" onclick="copyCode(this)">복사</button>
   </div>
   ```
4. All SVG diagrams inline with CSS variables (`var(--accent)`, `var(--text)`, etc.).
5. Include the scripts at the bottom:
   ```html
   <script src="../assets/inpage-search.js" defer></script>
   <script>/* copyCode function */</script>
   <script src="../assets/dark-mode-toggle.js"></script>
   <script src="../assets/lang-switcher.js"></script>
   ```

### Validation

```bash
# Unified validation: structure + nav + tables in one command
bun run validate-handbook

# Individual checks
bun run check-structure   # tag nesting, pre/copy-btn, nested code-block, lang pairs
bun run validate-nav      # broken links, prev/next symmetry, label match
bun run check-tables      # table column-sizing policy

# Comprehensive health check
bun run doctor

# Deploy to GitHub Pages
bun run deploy --repo 5throck/intro-to-ai-harness --visibility public
```

## 🎯 Target Versions

- Claude Code 2026-07
- Claude Desktop App (latest)
- ai-workspace-standards main (2026-07)

## 📜 License

- **Handbook content**: [CC BY-NC-SA 4.0](LICENSE) (Attribution-NonCommercial-ShareAlike 4.0 International)
