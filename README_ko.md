# Claude Code와 멀티 에이전트 하네스 — 입문 핸드북

Language: [English](README.md) | **한국어**

AI 초보자를 위한 한글/영문 이중 언어 핸드북입니다. Claude Desktop App을 기본 도구로 사용하여 AI 에이전트 팀의 개념부터 직접 만들어 쓰는 방법까지, 복사 가능한 명령어와 인라인 SVG 다이어그램으로 쉽게 배웁니다.

## 🌐 교육 프로그램 바로가기 (웹사이트)

👉 **[온라인 핸드북 보기](https://5throck.github.io/intro-to-ai-harness/)**

## 📚 커리큘럼 구성 (13장 + 3별첨)

| # | 한국어 | English | 핵심 내용 |
|---|--------|---------|----------|
| 1 | 왜 AI 에이전트 팀인가? | Why AI Agent Teams? | AI 트렌드, 단일 AI vs 다중 에이전트, 하네스 개념 |
| 2 | Claude Desktop App 시작하기 | Getting Started with Claude Desktop App | 설치, 구독, 프로젝트, 첫 대화, Artifacts |
| 3 | 실습 환경 구축 | Setting Up Your Lab | OS별 설치 스크립트와 검증 |
| 4 | 멀티 에이전트 하네스 개념 | Multi-Agent Harness Concepts | 에이전트, 스킬, 워크플로우, PM 오케스트레이션 |
| 5 | ai-workspace-standards 살펴보기 | Exploring ai-workspace-standards | 저장소 구조, L0→L1→L2, variant, 공통 컨트랙트 |
| 6 | co-consult: AI 컨설팅 실습 | co-consult: AI Consulting in Practice | 7-Phase 워크플로우, 팀 구성 시나리오 |
| 7 | co-deck: AI 프레젠테이션 실습 | co-deck: AI Presentation in Practice | 11-Stage 파이프라인, theme/style, Gate 승인 |
| 8 | co-consult + co-deck 통합 파이프라인 | Combined co-consult + co-deck Pipeline | 보고서 → 발표자료 통합 실습 |
| 9 | 에이전트 만들기와 수정 | Creating & Modifying Agents | 에이전트 파일 형식, agent-lifecycle-manager |
| 10 | 스킬 만들기와 수정 | Creating & Modifying Skills | 스킬 파일 형식, skill-lifecycle-manager |
| 11 | 나만의 에이전트 팀 구성하기 | Building Your Own Agent Team | team-builder 5-step 워크플로우 |
| 12 | 워크플로우와 자동화 이해 | Understanding Workflows & Automation | /sync 명령, Git/GitHub, Hook, CI/CD |
| 13 | 다음 단계 | Next Steps | 커뮤니티, 학습 자료, 응용 시나리오, FAQ |

### 별첨

| 별첨 | 제목 | 내용 |
|------|------|------|
| A | 원격 접속 환경 설정 | Tailscale / NoMachine / Windows RDP |
| B | Claude Code CLI 사용법 | 설치, 터미널 사용, 주요 명령어 |
| C | 저비용 AI 백엔드 연동 | DeepSeek / GLM / LiteLLM |

### 강사용 자료 (Instructor Materials)

| 페이지 | 내용 |
|--------|------|
| [강의 소개](docs/lecture-guide/00_Course_Overview.html) | 학습 목표 · 대상자 · 사전 요구사항 · 강의 형태 · 일정 · 수료 후 성과 |
| [강의 진행 가이드](docs/lecture-guide/00_Lecture_Guide.html) | 사전 준비물 통합 체크리스트 · 시간 배분표 · 장별 강사 노트 · 장별 확인 질문 |

## ✨ 특징

- **이중 언어 (Bilingual)**: 모든 장이 한국어/영어 페어 (`*_en.html`), 우측 상단 언어 전환 드롭다운
- **87개 인라인 SVG 다이어그램**: CSS 변수 색상으로 다크 모드 자동 대응
- **복사 가능한 명령어**: 모든 코드 블록에 복사 버튼
- **크로스 플랫폼**: MacOS / Windows / Linux 명령어 모두 제공
- **다크 모드**: 테마 토글 지원
- **페이지 내 검색**: 브라우저 검색 대체 인페이지 검색

## 📁 프로젝트 구조

```
intro-to-ai-harness/
  README.md                  # English README
  README_ko.md               # 한국어 README (이 파일)
  LICENSE                    # CC BY-NC-SA 4.0
  docs/
    index.html                # 한국어 목차
    index_en.html             # English TOC
    ch01/ ~ ch13/             # 각 장 (ko + en)
    lecture-guide/            # 강사용 자료 (ko + en)
    appendix/                 # 별첨 A/B/C (ko + en)
    assets/
      css/
        handbook-variables.css      # 공유 CSS 변수
        handbook-components.css     # 공유 컴포넌트 CSS
      dark-mode-toggle.js
      inpage-search.js
      lang-switcher.js
  scripts/                    # 검증 및 도구 스크립트
  package.json
```

## 🛠 개발

핸드북은 정적 사이트입니다. 편집 방법:

1. 기존 장 파일(예: `ch04/04_Harness_Concepts.html`)을 템플릿으로 복사합니다.
2. HTML 구조를 따릅니다: `<div class="layout">` → `<nav>` → `<main>` → `<article class="reading">`.
3. 모든 코드 블록에 다음 형식을 사용합니다:
   ```html
   <div class="code-block">
   <pre><code>COMMAND</code></pre>
   <button type="button" class="copy-btn" onclick="copyCode(this)">복사</button>
   </div>
   ```
4. 모든 SVG 다이어그램을 CSS 변수(`var(--accent)`, `var(--text)` 등)와 함께 인라인으로 작성합니다.
5. 하단에 스크립트를 포함합니다:
   ```html
   <script src="../assets/inpage-search.js" defer></script>
   <script>/* copyCode function */</script>
   <script src="../assets/dark-mode-toggle.js"></script>
   <script src="../assets/lang-switcher.js"></script>
   ```

### 검증

```bash
# 통합 검증: 구조 + 내비게이션 + 테이블을 한 번에
bun run validate-handbook

# 개별 검사
bun run check-structure   # 태그 중첩, pre/copy-btn, 중첩 code-block, 언어 페어
bun run validate-nav      # 링크 확인, prev/next 대칭, 라벨 일치
bun run check-tables      # 테이블 컬럼 크기 정책

# 종합 건강 검사
bun run doctor

# GitHub Pages 배포
bun run deploy --repo 5throck/intro-to-ai-harness --visibility public
```

## 🎯 대상 버전

- Claude Code 2026-07
- Claude Desktop App (최신)
- ai-workspace-standards main (2026-07)

## 📄 라이센스

- **핸드북 콘텐츠**: [CC BY-NC-SA 4.0](LICENSE) (저작자표시-비영리-동일조건변경허락 4.0 국제)
