#!/usr/bin/env python3
"""Validate handbook HTML structure.

Checks every *.html under docs/ for:
  - <pre> / </pre> balance
  - one .copy-btn per <pre>
  - balanced & correctly-nested tags (stack-based: div, table, thead, tbody,
    article, main, ul, ol, p, section, nav, pre, span, ...) — catches extra,
    unmatched, and mis-nested closing tags as well as unclosed tags at EOF.
    A plain open/close count is NOT sufficient: an extra </div> paired with an
    extra <div> balances to zero but still breaks the page layout (content is
    pushed outside <article>), so nesting is validated, not just counts.
  - no nested <div class="code-block">
  - no closing tag immediately followed by stray characters (e.g. "</div>d>")
  - no <img> tags (SVG must be inline)
  - required scripts present (lang-switcher, dark-mode-toggle, inpage-search)
  - ko/en pair completeness

Exit code 0 if all pass, 1 otherwise.
"""

import glob
import html.parser
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, "docs")

PAIRS = [
    ("index.html", "index_en.html"),
    ("ch01/01_Why_AI_Agents.html", "ch01/01_Why_AI_Agents_en.html"),
    ("ch02/02_Claude_Desktop_App.html", "ch02/02_Claude_Desktop_App_en.html"),
    ("ch03/03_Setup_Guide.html", "ch03/03_Setup_Guide_en.html"),
    ("ch04/04_Harness_Concepts.html", "ch04/04_Harness_Concepts_en.html"),
    ("ch05/05_Workspace_Standards.html", "ch05/05_Workspace_Standards_en.html"),
    ("ch06/06_Co_Consult_Practice.html", "ch06/06_Co_Consult_Practice_en.html"),
    ("ch07/07_Co_Deck_Practice.html", "ch07/07_Co_Deck_Practice_en.html"),
    ("ch08/08_Integrated_Pipeline.html", "ch08/08_Integrated_Pipeline_en.html"),
    ("ch09/09_Creating_Agents.html", "ch09/09_Creating_Agents_en.html"),
    ("ch10/10_Creating_Skills.html", "ch10/10_Creating_Skills_en.html"),
    ("ch11/11_Building_Agent_Team.html", "ch11/11_Building_Agent_Team_en.html"),
    ("ch12/12_Workflows_Automation.html", "ch12/12_Workflows_Automation_en.html"),
    ("ch13/13_Next_Steps.html", "ch13/13_Next_Steps_en.html"),
    ("appendix/A_Remote_Access_ko.html", "appendix/A_Remote_Access_en.html"),
    ("appendix/B_Claude_Code_CLI_ko.html", "appendix/B_Claude_Code_CLI_en.html"),
    ("appendix/C_Low_Cost_Backends_ko.html", "appendix/C_Low_Cost_Backends_en.html"),
    ("lecture-guide/00_Course_Overview.html", "lecture-guide/00_Course_Overview_en.html"),
    ("lecture-guide/00_Lecture_Guide.html", "lecture-guide/00_Lecture_Guide_en.html"),
]

# Elements that never carry a closing tag.
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img",
    "input", "link", "meta", "param", "source", "track", "wbr",
}

# Closing tag immediately followed by a stray ASCII letter — a generation
# artifact such as "</div>d>" that a plain count-based check cannot see.
STRAY_AFTER_CLOSE_RE = re.compile(r"</(?:div|table|thead|tbody|article|main|ul|ol)[^>]*>[a-zA-Z]")


class StructureChecker(html.parser.HTMLParser):
    """Stack-based tag nesting validator.

    Each open tag is pushed onto a stack; every closing tag must match the
    top of the stack. This catches what an open/close *count* cannot:
    an extra ``</div>`` that prematurely closes ``<article>``/``<main>``
    (mis-nest), an unmatched closing tag, or a tag left open at EOF.
    """

    def __init__(self):
        super().__init__(convert_charrefs=False)
        # stack entries: (tag, line, classes)
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag in VOID_TAGS:
            return
        attrs_dict = dict(attrs)
        classes = set(attrs_dict.get("class", "").split())
        if tag == "div" and "code-block" in classes:
            if any(t == "div" and "code-block" in c for t, _, c in self.stack):
                self.errors.append(
                    f"nested <div class=\"code-block\"> at line {self.getpos()[0]}"
                )
        self.stack.append((tag, self.getpos()[0], classes))

    def handle_startendtag(self, tag, attrs):
        pass

    def handle_endtag(self, tag):
        if tag in VOID_TAGS:
            return
        if not self.stack:
            self.errors.append(
                f"extra </{tag}> at line {self.getpos()[0]} (no matching open tag)"
            )
            return
        if self.stack[-1][0] == tag:
            self.stack.pop()
            return
        names = [t for t, _, _ in self.stack]
        if tag in names:
            idx = len(names) - 1 - names[::-1].index(tag)
            unclosed = [t for t, _, _ in self.stack[idx + 1:]]
            self.errors.append(
                f"</{tag}> at line {self.getpos()[0]} closes an outer tag "
                f"while these are still open: {', '.join(unclosed)}"
            )
            del self.stack[idx:]
        else:
            self.errors.append(
                f"unmatched </{tag}> at line {self.getpos()[0]} (not currently open)"
            )

    def final_issues(self):
        issues = list(self.errors)
        if self.stack:
            for tag, line, _ in self.stack:
                issues.append(f"unclosed <{tag}> at end of file (opened at line {line})")
        return issues


def check_file(relpath):
    """Return list of issue strings for one file."""
    issues = []
    path = os.path.join(DOCS, relpath)
    if not os.path.exists(path):
        return [f"{relpath}: FILE MISSING"]
    content = open(path, encoding="utf-8").read()

    pre_open = len(re.findall(r"<pre[^>]*>", content))
    pre_close = len(re.findall(r"</pre>", content))
    if pre_open != pre_close:
        issues.append(f"pre balance {pre_open}/{pre_close}")
    if pre_open != content.count('class="copy-btn"'):
        issues.append(f"copy-btn count {pre_open} pre vs {content.count('class=\"copy-btn\"')} btn")

    if "<img" in content:
        issues.append("contains <img> (SVG must be inline)")
    if "</code></code>" in content:
        issues.append("double </code> close")
    if "<code><div class=" in content:
        issues.append("polluted <code><div>")

    # Stack-based nesting validation (replaces the old net-count div check).
    checker = StructureChecker()
    checker.feed(content)
    checker.close()
    issues.extend(checker.final_issues())

    # Generation artifacts that survive count checks: a closing tag with
    # stray characters glued to it, e.g. "</div>d>".
    for m in STRAY_AFTER_CLOSE_RE.finditer(content):
        issues.append(f"stray characters after closing tag: {m.group(0)!r}")

    if "index" not in relpath:
        for script in ("lang-switcher.js", "dark-mode-toggle.js", "inpage-search.js"):
            if script not in content:
                issues.append(f"missing {script}")
        # copyCode only required when the page has code blocks
        if pre_open > 0 and "function copyCode" not in content:
            issues.append("missing copyCode function")

    lang = 'lang="ko"' in content or 'lang="en"' in content
    if not lang:
        issues.append("missing lang attribute")

    return issues


def main():
    files = sorted(
        f.replace("\\", "/")
        for f in glob.glob(os.path.join(DOCS, "**", "*.html"), recursive=True)
    )
    total_issues = 0
    for rel in files:
        for issue in check_file(rel):
            print(f"  [FAIL] {rel}: {issue}")
            total_issues += 1

    for ko, en in PAIRS:
        for rel in (ko, en):
            path = os.path.join(DOCS, rel)
            if not os.path.exists(path):
                print(f"  [FAIL] pair member missing: {rel}")
                total_issues += 1

    if total_issues == 0:
        print(f"PASS: {len(files)} files validated, all structure checks clean.")
        return 0
    print(f"FAIL: {total_issues} issue(s) found.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
