---
description: Drive a task end-to-end (issue -> scout -> code -> PR -> review -> QA) delegating to the workflow roles, pausing only at checkpoints
argument-hint: "<task description | PRD path | issue number>"
---
Drive this task end to end: $@

You are the orchestrator. Delegate each phase to the matching workflow role
(scout, pm, coder, techlead, qa) using this tool's subagent mechanism; do the
work yourself only if the role isn't available. You MUST stop at every
**[CHECKPOINT]**: present the info concisely, ask, and WAIT for approval.
Never merge — merging is always manual.

## Step 1 — Plan  [CHECKPOINT 1]
- If the task references a PRD (`docs/prd/*.md`), read it: derive the issue
  breakdown and acceptance criteria from its FR numbering — don't invent new ones.
- If the task is an existing issue number, fetch it and skip to step 3 planning.
- Delegate to **pm**: draft the parent issue + sub-issue breakdown per the
  issue conventions (features = parent + BE/FE sub-issues; bugs/chores = single).
- Present the breakdown + implementation order. **STOP. Wait for approval.**

## Step 2 — Issues  (auto after CP1)
- **pm** creates the issues: parent first, then sub-issues, linked via the
  GitHub sub-issues API. Report numbers + URLs.

## Step 3 — Per sub-issue: scout, then implement  (auto)
For each sub-issue, in dependency order (backend first):
- Delegate to **scout** (mandatory, read-only): recon the target area —
  structure, conventions, contracts, commands.
- Delegate to **coder** with the sub-issue + scout report: branch
  `feat/<n>-<slug>`, implement, tests, lint, commit, push, open PR with
  `Closes #<sub-issue>` (never the parent).

## Step 4 — Pre-review summary  [CHECKPOINT 2]
- Present the coder's report: diff summary, lint/test results, PR URL.
- **STOP. Wait for approval to proceed to review.**

## Step 5 — Tech-lead review loop  (auto after CP2)
- Delegate to **techlead** with FRESH context (no coder reasoning): review
  the PR diff vs acceptance criteria. Verdict: BLOCKING findings or LGTM.
- BLOCKING → hand findings back to **coder** to fix on the same branch, then
  re-review with a fresh **techlead**. Max 3 rounds; if still blocked,
  **STOP** and report what remains. [CHECKPOINT]
- LGTM → continue.

## Step 6 — QA  (serial, after LGTM)
- Delegate to **qa**: verify every acceptance criterion by execution on the
  PR branch. FAIL → back to **coder** (counts toward the same 3-round cap),
  then re-run QA. PASS → continue.

## Step 7 — Done  [CHECKPOINT 3]
- Present: PR URL(s), review rounds used, QA checklist, non-blocking notes.
- **STOP. Do NOT merge** — the human merges. The parent issue is closed
  manually once all its sub-issues are done.
