---
name: ship
description: Drive a task end-to-end (issues -> per sub-issue, scout -> code -> PR -> review -> QA) delegating to the workflow roles, pausing only at checkpoints. Trigger on "ship", "ship this", "drive this end to end", "build this feature end to end", or when given a task description, PRD path, or issue number to fully execute through the pipeline.
---

# ship

Drive the given task (a description, a PRD path, or an issue number) end to
end.

You are the orchestrator. Delegate each phase to the matching workflow role
(scout, pm, coder, techlead, qa). This skill is written to run on **any**
agentic harness, not just the ones named below — check your current toolset
for a delegation mechanism and use the best match available, in this order:

1. **A native subagent/sub-task tool in your toolset** — one call per role,
   always **synchronous** (never backgrounded, never parallel, for this
   pipeline): the cycle is a chain of gates (coder → techlead → qa) and a
   backgrounded phase lets the next gate start against unfinished work. Wait
   for each role's output before starting the next. Known bindings:
   - **Claude Code**: the Agent tool, `subagent_type` set to the role name —
     the same `scout`/`pm`/`coder`/`techlead`/`qa` files `setup-dev-workflow`
     installs into `.claude/agents/`. Pass `run_in_background: false`. If a
     role doesn't resolve ("subagent not installed"), don't fail or silently
     fall through to inline — install it: copy
     `~/.claude/skills/setup-dev-workflow/references/agents/<role>.md` into
     `.claude/agents/<role>.md` in this project (create the directory if it
     doesn't exist yet), then retry. If it *still* doesn't resolve right
     after installing, that's Claude Code's file watcher only picking up a
     brand-new `agents/` directory (or a previously-empty one's first file)
     on the *next* session start — tell the user to restart Claude Code once
     for it to take effect, and run this phase inline for now instead of
     blocking (except techlead/qa — see rung 3 below).
   - **Pi**, with this package's `extensions/subagent/` installed per the
     README: the `subagent` tool. Single mode `{agent: "<role>", task: "..."}`
     for one call; for the coder → techlead → qa sequence prefer **chain
     mode** (`{chain: [{agent, task}, {agent, task}, ...]}`), using
     `{previous}` in a later step's `task` to hand it the prior step's
     output (e.g. the PR URL into techlead's task). Chain mode already awaits
     each step before the next, so the gate ordering holds for free — don't
     use `tasks` (parallel mode) here. Default `agentScope` (`"user"`) finds
     the roles at `~/.pi/agent/agents/`.
   - **Any other harness** with an equivalent delegation tool: bind it the
     same way — one role per call, synchronous, each step's output threaded
     into the next.
2. **No native delegation tool, but you can spawn a fresh instance of
   yourself non-interactively** (a headless/print/`-p`-style flag): spawn one
   per phase via bash from the project root, passing that role's file (e.g.
   `~/.pi/agent/agents/<role>.md`, or wherever your install keeps the five
   role files) plus the task + context, and wait for its output before
   starting the next phase.
3. **Neither is available**: do the phase inline yourself — except
   **techlead and qa, which MUST run with fresh context** (a review by the
   same context that wrote the code is not a review); if you can't get fresh
   context for them, stop and tell the user.

You MUST stop at every **[CHECKPOINT]**: present the info concisely, ask,
and WAIT for approval. Never merge — merging is always manual.

GitHub calls below (`gh issue edit`): prefer the MCP GitHub tools when
connected, otherwise run `gh` as written — mapping in
[docs/github-access.md](../../docs/github-access.md).

**One sub-issue = one PR = one full cycle** (steps 3–6). Sub-issues run
sequentially in dependency order (backend first). A dependent sub-issue does
not start until the sub-issue it depends on is merged.

## Step 0 — Resume check

If the task is an existing issue number, look for prior work before planning:
an `in-progress` label, a `feat/<n>-*`/`fix/<n>-*` branch, or an open PR
referencing it. If found: detect the state (branch, unpushed commits, PR and
review status, labels), report what you detected, and re-enter the cycle at
the matching step below. Never re-create issues, branches, or PRs that exist.
If the number is a parent issue, resume its first non-`done` sub-issue.

## Step 1 — Plan  [CHECKPOINT 1]
- If the task references a PRD (`docs/prd/*.md`), read it: derive the issue
  breakdown and acceptance criteria from its FR numbering — don't invent new ones.
- Delegate to **pm**: draft the parent issue + sub-issue breakdown per the
  issue conventions (features = parent + BE/FE sub-issues; bugs/chores = single).
- Present the breakdown + implementation order. **STOP. Wait for approval.**

## Step 2 — Issues  (auto after CP1)
- **pm** creates the issues: parent first, then sub-issues, linked via the
  GitHub sub-issues API, status labels ensured (see issue conventions).
  Report numbers + URLs.

## Step 3 — Start the next sub-issue  (auto)
Pick the next sub-issue in dependency order:
- Mark it: `gh issue edit <n> --add-label in-progress`. The first sub-issue
  also marks the parent `in-progress`.
- Delegate to **scout** (mandatory, read-only): recon the target area —
  structure, conventions, contracts, commands.
- Delegate to **coder** with the sub-issue + scout report: branch
  `feat/<n>-<slug>`, implement, tests, lint, commit, push, open PR with
  `Closes #<sub-issue>` (never the parent).

## Step 4 — Tech-lead review loop  (auto)
- Delegate to **techlead** with FRESH context (no coder reasoning): review
  the PR diff vs acceptance criteria. Verdict: BLOCKING findings or LGTM.
- BLOCKING → hand findings back to **coder** to fix on the same branch, then
  re-review with a fresh **techlead**. Max 3 rounds; if still blocked,
  **STOP** and report what remains. [CHECKPOINT]
- LGTM → continue.

## Step 5 — QA  (serial, after LGTM)
- Delegate to **qa**: verify every acceptance criterion by execution on the
  PR branch. FAIL → back to **coder** (counts toward the same 3-round cap),
  then re-run QA. PASS → continue.

## Step 6 — Sub-issue done  [CHECKPOINT]
- Swap labels: `gh issue edit <n> --remove-label in-progress --add-label done`.
- Present: PR URL, review rounds used, QA checklist.
- **STOP. Ask the user to merge the PR manually** (merging closes the
  sub-issue via `Closes`). Once merged, loop back to step 3 for the next
  sub-issue.

## Step 7 — Feature done  [FINAL CHECKPOINT]
- When every sub-issue is `done`: label the parent `done`, present the
  summary — all PR URLs, total review rounds, non-blocking notes left over.
- **STOP.** The parent issue is closed manually by the user.
