---
description: Resume interrupted work on an issue — detect current state, report what's left, continue from the right step
argument-hint: "[issue number]"
---
Resume work on: $1 (if empty, infer the issue from the current branch name).

Figure out where the work stopped, report it, and continue the `/ship`
workflow from the matching step. Do NOT restart from scratch or re-create
issues/branches/PRs that already exist.

## Step 1 — Detect state (read-only)

Gather, in this order:
1. `git status` + current branch. Branch names encode the issue: `feat/<n>-<slug>` / `fix/<n>-<slug>`.
2. `gh issue view <n>` — read the body and acceptance criteria. If it's a sub-issue, also view the parent; if it's a parent, list its sub-issues and their states.
3. `gh pr list --head <branch>` — does a PR exist? If yes: `gh pr view` for review state and unresolved comments.
4. Uncommitted/unpushed work: `git log origin/<branch>..HEAD` and the working tree diff.
5. Run lint + tests to see what currently passes.

## Step 2 — Report  [CHECKPOINT]

Present concisely:
- Which issue/sub-issue this is and its acceptance criteria.
- What's already done (commits, passing tests, checked-off criteria).
- What's left (unmet criteria, failing tests, unaddressed review findings).
- Which `/ship` step this maps to (implement / pre-PR / PR+review / done).

**STOP. Wait for confirmation** of the plan before touching anything.

## Step 3 — Continue

Re-enter the `/ship` workflow at the detected step and follow it from there,
including its remaining checkpoints. Same rules apply: never merge, stop at
every checkpoint.

If state is ambiguous (dirty tree from unrelated work, branch doesn't match
any issue, PR closed without merge), report the ambiguity and ask instead of
guessing.
