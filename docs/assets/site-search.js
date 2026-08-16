/* 랜딩 사이트 전체 검색 — 의존성·빌드 없음.
   첫 포커스 때 DOCS의 모든 문서를 fetch → DOMParser로 파싱해 색인 구축(항상 최신).
   매뉴얼: h2[id](섹션) + h3(항목, 안에 <code>) / 예시: .scenario-card[id](시나리오)
   결과 선택 시 해당 문서의 정확한 위치로 이동(+ ?q= 로 그 페이지 검색 자동 적용).

   ★ 사용 시 수정할 곳은 아래 DOCS 배열 하나뿐 — 새 문서의 path·title로 교체한다.
     path 는 docs/ 기준 상대경로, title 은 검색 결과에 표시될 문서명. */
(function () {
  'use strict';
  var DOCS = [
    /* ── Korean ── */
    { path: 'ch01/01_Why_AI_Agents.html', title: '1장 · 왜 AI 에이전트 팀인가?', lang: 'ko' },
    { path: 'ch02/02_Claude_Desktop_App.html', title: '2장 · Claude Desktop App 시작하기', lang: 'ko' },
    { path: 'ch03/03_Setup_Guide.html', title: '3장 · 실습 환경 구축', lang: 'ko' },
    { path: 'ch04/04_Harness_Concepts.html', title: '4장 · 멀티 에이전트 하네스 개념', lang: 'ko' },
    { path: 'ch05/05_Workspace_Standards.html', title: '5장 · ai-workspace-standards 살펴보기', lang: 'ko' },
    { path: 'ch06/06_Co_Consult_Practice.html', title: '6장 · co-consult: AI 컨설팅 실습', lang: 'ko' },
    { path: 'ch07/07_Co_Deck_Practice.html', title: '7장 · co-deck: AI 프레젠테이션 실습', lang: 'ko' },
    { path: 'ch08/08_Integrated_Pipeline.html', title: '8장 · co-consult + co-deck 통합 파이프라인', lang: 'ko' },
    { path: 'ch09/09_Creating_Agents.html', title: '9장 · 에이전트 만들기와 수정', lang: 'ko' },
    { path: 'ch10/10_Creating_Skills.html', title: '10장 · 스킬 만들기와 수정', lang: 'ko' },
    { path: 'ch11/11_Building_Agent_Team.html', title: '11장 · 나만의 에이전트 팀 구성하기', lang: 'ko' },
    { path: 'ch12/12_Workflows_Automation.html', title: '12장 · 워크플로우와 자동화 이해', lang: 'ko' },
    { path: 'ch13/13_Next_Steps.html', title: '13장 · 다음 단계', lang: 'ko' },
    { path: 'appendix/A_Remote_Access_ko.html', title: '별첨 A · 원격 접속 환경 설정', lang: 'ko' },
    { path: 'appendix/B_Claude_Code_CLI_ko.html', title: '별첨 B · Claude Code CLI 사용법', lang: 'ko' },
    { path: 'appendix/C_Low_Cost_Backends_ko.html', title: '별첨 C · 저비용 AI 백엔드 연동', lang: 'ko' },
    { path: 'lecture-guide/00_Course_Overview.html', title: '강의 소개', lang: 'ko' },
    { path: 'lecture-guide/00_Lecture_Guide.html', title: '강의 진행 가이드', lang: 'ko' },
    /* ── English ── */
    { path: 'ch01/01_Why_AI_Agents_en.html', title: 'Ch 1 · Why AI Agent Teams?', lang: 'en' },
    { path: 'ch02/02_Claude_Desktop_App_en.html', title: 'Ch 2 · Getting Started with Claude Desktop App', lang: 'en' },
    { path: 'ch03/03_Setup_Guide_en.html', title: 'Ch 3 · Setting Up Your Lab', lang: 'en' },
    { path: 'ch04/04_Harness_Concepts_en.html', title: 'Ch 4 · Multi-Agent Harness Concepts', lang: 'en' },
    { path: 'ch05/05_Workspace_Standards_en.html', title: 'Ch 5 · Exploring ai-workspace-standards', lang: 'en' },
    { path: 'ch06/06_Co_Consult_Practice_en.html', title: 'Ch 6 · co-consult: AI Consulting in Practice', lang: 'en' },
    { path: 'ch07/07_Co_Deck_Practice_en.html', title: 'Ch 7 · co-deck: AI Presentation in Practice', lang: 'en' },
    { path: 'ch08/08_Integrated_Pipeline_en.html', title: 'Ch 8 · Combined co-consult + co-deck Pipeline', lang: 'en' },
    { path: 'ch09/09_Creating_Agents_en.html', title: 'Ch 9 · Creating & Modifying Agents', lang: 'en' },
    { path: 'ch10/10_Creating_Skills_en.html', title: 'Ch 10 · Creating & Modifying Skills', lang: 'en' },
    { path: 'ch11/11_Building_Agent_Team_en.html', title: 'Ch 11 · Building Your Own Agent Team', lang: 'en' },
    { path: 'ch12/12_Workflows_Automation_en.html', title: 'Ch 12 · Understanding Workflows & Automation', lang: 'en' },
    { path: 'ch13/13_Next_Steps_en.html', title: 'Ch 13 · Next Steps', lang: 'en' },
    { path: 'appendix/A_Remote_Access_en.html', title: 'Appendix A · Remote Access Setup', lang: 'en' },
    { path: 'appendix/B_Claude_Code_CLI_en.html', title: 'Appendix B · Claude Code CLI Guide', lang: 'en' },
    { path: 'appendix/C_Low_Cost_Backends_en.html', title: 'Appendix C · Low-Cost AI Backend Integration', lang: 'en' },
    { path: 'lecture-guide/00_Course_Overview_en.html', title: 'Course Overview · Claude Code & Multi-Agent Harness', lang: 'en' },
    { path: 'lecture-guide/00_Lecture_Guide_en.html', title: 'Lecture Guide · Claude Code & Multi-Agent Harness', lang: 'en' }
  ];

  var LABELS = {
    ko: {
      placeholder: '핸드북 전체 검색 — 섹션·항목·시나리오…',
      section: '섹션', scenario: '시나리오', item: '항목',
      noResult: '결과 없음',
      hint: function(n){ return n + '개 문서 전체에서 찾아 해당 위치로 이동합니다.'; },
      building: '색인 준비 중…'
    },
    en: {
      placeholder: 'Search entire handbook — sections, items, scenarios…',
      section: 'Section', scenario: 'Scenario', item: 'Item',
      noResult: 'No results',
      hint: function(n){ return n + ' documents searched. Navigates to exact position.'; },
      building: 'Building index…'
    }
  };

  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function strip(s){ return (s || '').replace(/\s+/g, ' ').trim(); }
  function escHtml(s){ return s.replace(/[&<>"']/g, function (c){ return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }

  ready(function () {
    var pageLang = (document.documentElement.lang || 'ko').split('-')[0];
    var labels = LABELS[pageLang] || LABELS.ko;

    // Filter DOCS to current language
    var filteredDocs = DOCS.filter(function (d) {
      return !d.lang || d.lang === pageLang;
    });

    var firstGroup = document.querySelector('.group');
    if (!firstGroup) return;

    var style = document.createElement('style');
    style.textContent = [
      '.ss-wrap{margin:0 0 40px;position:relative;}',
      '.ss-wrap input{width:100%;padding:13px 16px;font-size:15px;border:1px solid #d0d7de;border-radius:10px;background:#fff;color:#1f2328;outline:none;}',
      '.ss-wrap input:focus{border-color:#0969da;box-shadow:0 0 0 3px rgba(9,105,218,.12);}',
      '.ss-results{position:absolute;left:0;right:0;top:calc(100% + 6px);background:#fff;border:1px solid #d0d7de;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,.12);max-height:62vh;overflow-y:auto;z-index:30;display:none;}',
      '.ss-results.show{display:block;}',
      '.ss-item{display:block;padding:10px 16px;border-bottom:1px solid #eef1f4;text-decoration:none;color:#1f2328;}',
      '.ss-item:last-child{border-bottom:none;}',
      '.ss-item:hover,.ss-item.ss-active{background:#f0f7ff;}',
      '.ss-item .ss-h{font-size:14px;font-weight:600;color:#0969da;font-family:SFMono-Regular,Consolas,monospace;}',
      '.ss-item .ss-p{font-size:12px;color:#636c76;margin-top:2px;}',
      '.ss-msg{padding:14px 16px;color:#636c76;font-size:13px;}',
      '.ss-hint{margin-top:8px;font-size:12px;color:#636c76;}'
    ].join('');
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.className = 'ss-wrap';
    wrap.innerHTML =
      '<input type="search" placeholder="' + labels.placeholder + '" aria-label="핸드북 전체 검색">' +
      '<div class="ss-results" role="listbox"></div>' +
      '<div class="ss-hint">' + labels.hint(filteredDocs.length) + '</div>';
    firstGroup.parentNode.insertBefore(wrap, firstGroup);

    var input = wrap.querySelector('input');
    var results = wrap.querySelector('.ss-results');
    var index = null, building = false, activeIdx = -1, current = [];

    function parseDoc(doc, html){
      var d = new DOMParser().parseFromString(html, 'text/html');
      var main = d.querySelector('main') || d.body;
      var out = [], curId = '', curTitle = '';
      var nodes = main.querySelectorAll('h2[id], h3, .scenario-card[id]');
      for (var i = 0; i < nodes.length; i++){
        var el = nodes[i];
        if (el.tagName === 'H2'){
          curId = el.id; curTitle = strip(el.textContent);
          out.push({ doc: doc, id: curId, heading: curTitle, section: curTitle, type: labels.section });
        } else if (el.classList && el.classList.contains('scenario-card')){
          var ti = el.querySelector('strong');
          var lv = el.querySelector('span');
          out.push({
            doc: doc, id: el.id,
            heading: ti ? strip(ti.textContent) : el.id,
            section: lv ? strip(lv.textContent) : '',
            type: el.getAttribute('data-kind') || labels.scenario   // 문제/Q&A 등. 없으면 시나리오(하위호환)
          });
        } else { // h3
          var code = el.querySelector('code');
          out.push({
            doc: doc, id: curId,
            heading: code ? strip(code.textContent) : strip(el.textContent),
            section: curTitle, type: labels.item
          });
        }
      }
      return out;
    }

    function build(){
      if (index || building) return;
      building = true;
      results.innerHTML = '<div class="ss-msg">' + labels.building + '</div>';
      results.classList.add('show');
      Promise.all(filteredDocs.map(function (doc){
        return fetch(doc.path).then(function (r){ return r.text(); })
          .then(function (html){ return parseDoc(doc, html); })
          .catch(function (){ return []; });
      })).then(function (all){
        index = Array.prototype.concat.apply([], all);
        building = false;
        if (input.value.trim()) run(input.value);
        else results.classList.remove('show');
      });
    }

    function score(e, q){
      var h = e.heading.toLowerCase();
      if (h === q) return 0;
      if (h.indexOf(q) === 0) return 1;
      if (h.indexOf(q) >= 0) return 2;
      if (e.section.toLowerCase().indexOf(q) >= 0) return 3;
      return -1;
    }

    function run(raw){
      var q = raw.trim().toLowerCase();
      if (!q){ results.classList.remove('show'); results.innerHTML = ''; return; }
      if (!index){ build(); return; }
      var scored = [];
      for (var i = 0; i < index.length; i++){
        var s = score(index[i], q);
        if (s >= 0) scored.push({ e: index[i], s: s, i: i });
      }
      scored.sort(function (a, b){ return a.s - b.s || a.i - b.i; });
      current = scored.slice(0, 12).map(function (x){ return x.e; });
      activeIdx = -1;
      if (!current.length){
        results.innerHTML = '<div class="ss-msg">' + labels.noResult + '</div>';
        results.classList.add('show'); return;
      }
      results.innerHTML = current.map(function (e){
        var href = e.doc.path + '?q=' + encodeURIComponent(raw.trim()) + (e.id ? ('#' + e.id) : '');
        return '<a class="ss-item" role="option" href="' + href + '">' +
          '<div class="ss-h">' + escHtml(e.heading) + '</div>' +
          '<div class="ss-p">' + escHtml(e.doc.title) + (e.section ? ' › ' + escHtml(e.section) : '') + ' · ' + e.type + '</div>' +
        '</a>';
      }).join('');
      results.classList.add('show');
    }

    function setActive(i){
      var items = results.querySelectorAll('.ss-item');
      if (!items.length) return;
      if (activeIdx >= 0 && items[activeIdx]) items[activeIdx].classList.remove('ss-active');
      activeIdx = (i + items.length) % items.length;
      items[activeIdx].classList.add('ss-active');
      items[activeIdx].scrollIntoView({ block: 'nearest' });
    }

    var t;
    input.addEventListener('focus', build);
    input.addEventListener('input', function (){ clearTimeout(t); t = setTimeout(function (){ run(input.value); }, 110); });
    input.addEventListener('keydown', function (e){
      var items = results.querySelectorAll('.ss-item');
      if (e.key === 'ArrowDown'){ e.preventDefault(); setActive(activeIdx + 1); }
      else if (e.key === 'ArrowUp'){ e.preventDefault(); setActive(activeIdx - 1); }
      else if (e.key === 'Enter'){ if (activeIdx >= 0 && items[activeIdx]){ e.preventDefault(); location.href = items[activeIdx].getAttribute('href'); } }
      else if (e.key === 'Escape'){ results.classList.remove('show'); input.blur(); }
    });
    document.addEventListener('click', function (e){ if (!wrap.contains(e.target)) results.classList.remove('show'); });
  });
})();
