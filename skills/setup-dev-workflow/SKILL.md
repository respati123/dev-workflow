---
name: setup-dev-workflow
description: Prepare a project for the multi-agent dev workflow (scout, pm, coder, techlead, qa). Checks git, AGENTS.md/CLAUDE.md, and (for backend projects) docs/postman/, offering to fill each gap. On Claude Code, also installs the pipeline-phase subagents. Trigger on "setup-dev-workflow".
---

# setup-dev-workflow

Prepares a project so the multi-agent development workflow (BRD → PRD →
issues → scout → code → review → QA) can run on it. Replaces the old
`dev-start` skill: same git + AGENTS.md groundwork, plus CLAUDE.md,
`docs/postman/` for backend projects, and Claude Code subagent installation.

**Idempotent by design**: check what exists, only fill gaps the user
approves, never overwrite user content.

## Step 1 — Git

Check `git rev-parse --is-inside-work-tree`. If not a git repo: **ask the
user** whether to initialize one (never init silently). If yes:

1. `git init`
2. Ask how to connect a remote — one question, three options:
   - create on GitHub: ask the repo name, then `gh repo create <name> --private --source=. --remote=origin`
   - existing remote: ask the URL, then `git remote add origin <url>`
   - local-only for now: skip.

If git already exists, move on.

## Step 2 — Research the codebase

**If the project is empty** (no code yet, maybe just this skill's git init
from Step 1): skip recon — there's nothing to find. Backend = no,
`docs/postman/` question doesn't apply.

Ask **one optional question** before moving on: *"This project is empty —
want to define it now with `to-spec` (BRD → PRD)?"*

- **Yes** → stop here and delegate fully to the `to-spec` skill (its normal
  `create-brd` → `create-prd` interview). Once it's done, the approved
  PRD/BRD is what fills AGENTS.md's Project map / Stack in Step 3 — grounded
  in the approved doc, not guessed. This does **not** trigger the backend /
  `docs/postman/` question even if the PRD describes a backend — that stays
  tied to actual code existing, not to a plan (see Step 3).
- **No** → go to Step 3 with only AGENTS.md/CLAUDE.md to offer, filled as
  placeholders (see below).

**Otherwise**, do the same recon the `scout` role would (as a subagent if
supported, otherwise inline, read-only): structure, stack, commands,
conventions. This single pass also answers the questions the next step
needs — don't run a separate detection pass for any of them:

- **Backend present?** Judged from the same structure/stack findings (an
  API/server entrypoint, routes, a backend framework) — no separate
  heuristic checklist.
- **AGENTS.md exists?** Complete, or missing sections?
- **CLAUDE.md exists?** (only matters if you are running as Claude Code)
- **`docs/postman/` exists?** (only matters if a backend was found)

## Step 3 — Offer to fill the gaps

Present every gap found in **one batch** — don't interrogate one at a time.
For each, the user answers yes/no:

- **AGENTS.md** missing or incomplete → fill
  [references/agents-md-template.md](references/agents-md-template.md). The
  **Development workflow** section is generic (doesn't depend on this
  project's code) and always gets filled in full. **Project map / Stack**
  come from Step 2's recon, or from the approved BRD/PRD if the empty-project
  `to-spec` offer was accepted. **Commands** stays `TODO` for an empty
  project regardless — there's no real toolchain yet, that only exists once
  `to-implement` produces the first code. If genuinely nothing is known (no
  recon, declined `to-spec`), leave the rest as `TODO` too instead of
  guessing. Already exists → **merge**: add only missing sections, never
  delete or rewrite what the user wrote. Show the diff of what you're adding
  before writing.
- **CLAUDE.md** missing, and you are running as Claude Code → create it as a
  **one-line pointer**, not a regenerated duplicate:
  ```
  @AGENTS.md
  ```
  AGENTS.md stays the single source of truth. If CLAUDE.md already exists
  (even with unrelated content), leave it untouched — it may be hand-written.
- **`docs/postman/`** missing, and a backend was found → scaffold an empty
  collection at `docs/postman/collection.json`:
  ```json
  {
    "info": {
      "name": "<project name>",
      "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": []
  }
  ```

Skip any item the user declines. Skip the CLAUDE.md / postman checks
entirely if their precondition (Claude Code / backend) doesn't hold — don't
ask about them.

## Step 4 — Claude Code subagents

If (and only if) you are running as **Claude Code**: install the
pipeline-phase subagents by copying each file from
[references/agents/](references/agents/) into `.claude/agents/` in this
project, **skipping any that already exist** (never overwrite — the user may
have customized one). No need to ask permission first — this only adds new
files, nothing existing is touched:

- `to-spec.md` — BRD → PRD
- `to-tickets.md` — spec → parent issue + sub-issues
- `to-implement.md` — one sub-issue → pushed PR
- `code-review-pr.md` — static PR review, BLOCKING/LGTM
- `to-qa.md` — verify a PR by execution

If you are running as Pi or another tool, skip this step — the equivalent
setup there is the manual symlink step in this package's README
(`ln -s .../agents/*.md ~/.pi/agent/agents/`), which this skill does not do
on your behalf.

## Step 5 — Report

A few lines: git state; whether `to-spec` was run for an empty project (and
the resulting BRD/PRD paths, if so); AGENTS.md/CLAUDE.md status;
`docs/postman/` status; which `.claude/agents/*.md` files were created vs.
already present (Claude Code only). Then the one-liner to start working:

- New feature → `to-spec` (BRD → PRD; wraps `create-brd`/`create-prd`, which
  are still available directly if you only need one of the two).
- Spec approved → `to-tickets` to break it into a parent issue + sub-issues.
- Per sub-issue → `to-implement` → `code-review-pr` → `to-qa`, or `/ship
  <issue>` to drive the whole cycle with checkpoints.
- `/scout` any time to see where every feature/issue currently stands.
