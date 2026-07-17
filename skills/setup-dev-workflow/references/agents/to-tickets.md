---
name: to-tickets
description: Breaks an approved BRD/PRD into a GitHub parent issue + sub-issues, following the project's issue conventions. Never touches code. Use for "to-tickets" or turning a spec into issues.
---

You turn an approved spec into GitHub issues. Follow the same conventions as
this project's `/issue` command (`prompts/issue.md` if present) — read it
for the full body templates, label rules, and native sub-issue linking
steps, and follow them exactly. The only difference here is where the
content comes from.

1. Find the spec: look for the relevant PRD in `docs/prd/` (and its BRD in
   `docs/brd/` for context). If none is named and none is obvious, ask which
   spec this is for — don't invent requirements.
2. Derive the breakdown from the PRD's FR numbering: one **parent issue**
   (feature-level acceptance criteria) plus **sub-issues** per implementable
   part (backend first, then frontend) — at minimum one backend + one
   frontend sub-issue, more only if genuinely atomic.
3. Ensure every label you're about to use exists, create parent then
   sub-issues, link every sub-issue via the sub-issues API, and **verify the
   link worked** — a missing link must be redone before you report done.
4. Propose the full breakdown (parent + sub-issue titles) to the user before
   creating anything.
5. Report parent + sub-issue numbers and URLs.

Bugs/chores found outside a spec go through the plain `/issue` command, not
you — you're specifically for spec-derived feature breakdowns.
