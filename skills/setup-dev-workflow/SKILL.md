---
name: setup-dev-workflow
description: Prepare a project for the multi-agent dev workflow (scout, pm, coder, techlead, qa), and the entry point for it — the one to run any time you don't know what to do next, on an empty project or one already in flight. Checks git, AGENTS.md/CLAUDE.md, and (for backend projects) docs/postman/, offering to fill each gap; safe to re-run, since re-running just reports current status and the single next command. Trigger on "setup-dev-workflow", or whenever the user seems unsure where to start or what to do next — "where do I start", "I'm new to this project", "help me build this", "gimana cara mulai", "bingung mulai dari mana", "project baru".
---

# setup-dev-workflow

Prepares a project so the multi-agent development workflow (BRD → PRD →
issues → scout → code → review → QA) can run on it. Replaces the old
`dev-start` skill: same git + AGENTS.md groundwork, plus CLAUDE.md,
`docs/postman/` for backend projects, and Claude Code subagent installation.

Also doubles as the workflow's front door: a user with zero context on this
project should be able to say almost anything that signals "I don't know
what to do" and land here, on the first message of a brand new chat.

**Idempotent by design**: check what exists, only fill gaps the user
approves, never overwrite user content. On an already-set-up project, every
step below finds nothing left to fill and falls straight through to Step 5's
recommendation — that's the intended "what do I do next" behavior, not a
wasted run.

**Every question below ships with a recommended default and the reasoning**
— never a bare yes/no or an unranked list of options. Someone who landed
here because they're unsure what to do shouldn't also have to already know
the tradeoffs to answer correctly.

GitHub calls in this skill (`gh label`, `gh issue list`, `gh api
.../sub_issues`): prefer the MCP GitHub tools when connected, otherwise run
`gh` as written — mapping and exceptions in
[docs/github-access.md](../../docs/github-access.md).

## Step 1 — Git

Check `git rev-parse --is-inside-work-tree`. If not a git repo: **ask the
user** whether to initialize one (never init silently) — **recommend yes**:
even an empty project benefits from tracking spec docs and every decision
from the first commit, and a local-only repo has no real downside. If yes,
`git init` and stop there — don't ask about a remote yet. Whether/where to
connect GitHub is a question worth answering once the project has a
direction (see Step 3), not on message one before anything is defined.

If git already exists, move on.

## Step 2 — Research the codebase

**If the project is empty** (no code yet, maybe just this skill's git init
from Step 1): skip recon — there's nothing to find. Backend = no,
`docs/postman/` question doesn't apply.

Ask **one optional question** before moving on: *"This project is empty —
want to define it now with `to-spec` (BRD → PRD)? Recommended — coding
straight from an idea usually means redoing work once real requirements
surface; a short interview now is cheaper than a rewrite later."*

- **Yes** → stop here and delegate fully to the `to-spec` skill (its normal
  `create-brd` → `create-prd` interview). Once it's done, the approved PRD is
  what fills AGENTS.md's Project map in Step 3 — grounded in the approved
  doc, not guessed; Stack still gets asked separately (Step 3), since the
  spec deliberately doesn't pin it down. This does **not** trigger the
  backend / `docs/postman/` question even if the PRD describes a backend —
  that stays tied to actual code existing, not to a plan (see Step 3).
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
- **`docs/adr/` exists?** (only matters if the project has real code — ADRs
  aren't backend-specific)
- **Frontend surface present, and PRODUCT.md / DESIGN.md?** (only matters if
  the recon found UI code — a frontend framework, components, routes, styles)

## Step 3 — Offer to fill the gaps

Present every gap found in **one batch** — don't interrogate one at a time.
For each, the user answers yes/no:

- **AGENTS.md** missing or incomplete → fill
  [references/agents-md-template.md](references/agents-md-template.md) —
  **recommend yes**: every other skill in this workflow (scout, to-implement,
  code review) reads it, so skipping it means the rest of the pipeline runs
  blind. The
  **Development workflow** section is generic (doesn't depend on this
  project's code) and always gets filled in full. **Project map** comes from
  Step 2's recon, or from the approved BRD/PRD if the empty-project `to-spec`
  offer was accepted. **Stack** comes from Step 2's recon for an existing
  project, or from the tech-stack question below for a freshly-specced
  greenfield one — never from the BRD/PRD themselves, they're deliberately
  stack-agnostic. **Commands** stays `TODO` for an empty project regardless —
  there's no real toolchain yet, that only exists once `to-implement`
  produces the first code. If genuinely nothing is known (no recon, declined
  `to-spec`), leave the rest as `TODO` too instead of guessing. Already
  exists → **merge**: add only missing sections, never delete or rewrite what
  the user wrote. Show the diff of what you're adding before writing.
- **GitHub remote** missing, and the project now has a clear direction (an
  existing project, or a greenfield one that just completed `to-spec`) → ask
  how to connect one, one question, three options — **recommend "create on
  GitHub"** unless the user already has a remote elsewhere: `to-tickets`,
  `code-review-pr`, and `to-qa`'s parent-closing check all depend on GitHub
  issues/PRs through `gh`, so picking local-only quietly disables most of
  this workflow — say that plainly if the user leans that way, don't let it
  be a silent tradeoff:
  - create on GitHub (recommended): ask the repo name, then `gh repo create <name> --private --source=. --remote=origin`
  - existing remote: ask the URL, then `git remote add origin <url>`
  - local-only for now: works, but disables `to-tickets`/`to-implement`/`code-review-pr`/`to-qa` — only pick this if that's intended.

  Still no direction (empty project, `to-spec` declined) → skip this
  question — there's nothing to connect a remote *for* yet. It'll come up
  naturally once `to-tickets` needs `gh` and finds none configured.
- **Tech stack** unknown, and it's a greenfield project that just completed
  `to-spec` → ask directly, but don't ask blind: skim the approved BRD/PRD
  for signals (kind of product, expected scale, integrations mentioned) and
  propose a stack that fits, with the one-line reasoning (e.g. "a CRUD-heavy
  internal tool, no unusual scale — a mainstream, well-supported
  framework/language is a safe default unless you already have a
  preference or team expertise to favor instead"). The user still decides —
  this narrows the field instead of leaving them to pick blind. This is the
  one point in the flow where stack actually gets pinned down for a new
  project — the BRD/PRD won't have it, and `to-implement` needs it before
  writing the first line. Existing projects skip this; Step 2's recon
  already found the real stack.
- **CLAUDE.md** missing, and you are running as Claude Code → create it as a
  **one-line pointer**, not a regenerated duplicate — **recommend yes**: it
  costs one line and keeps every Claude Code session grounded in AGENTS.md
  automatically:
  ```
  @AGENTS.md
  ```
  AGENTS.md stays the single source of truth. If CLAUDE.md already exists
  (even with unrelated content), leave it untouched — it may be hand-written.
- **`docs/postman/`** missing, and a backend was found → scaffold an empty
  collection at `docs/postman/collection.json` — **recommend yes**: it costs
  nothing to scaffold now, and `code-review-pr` already treats a missing API
  doc update as BLOCKING once endpoints exist, so having the file ready
  avoids friction on the very first backend PR:
  ```json
  {
    "info": {
      "name": "<project name>",
      "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": []
  }
  ```
- **`docs/adr/`** missing, and the project has real code → scaffold the
  directory with a seed `docs/adr/0000-record-architecture-decisions.md` (the
  ADR that records *using ADRs*, status Accepted) — **recommend yes**: it costs
  nothing, and `techlead`/`code-review-pr` treat an architecturally significant
  decision shipped without an ADR as BLOCKING, so having the folder and
  numbering convention ready avoids friction on the first significant PR.
  Unlike `docs/postman/` this isn't backend-gated — any project accrues
  architectural decisions. Mirror the `docs/postman/` offer; the `create-adr`
  skill writes real ADRs from there on.
- **Design system (PRODUCT.md / DESIGN.md)** missing, and Step 2 found a
  frontend/UI surface → offer to run `impeccable init` + `document` to capture
  the register, strategic context, and visual tokens once — **recommend yes**:
  every later `impeccable shape` (pm) and frontend build (coder) auto-loads
  these, so features stay on one visual language instead of each coder
  reinventing it. `DESIGN.md` also becomes a "documented rule" the techlead can
  check frontend PRs against. Skip entirely for backend-only projects — there's
  no UI to capture.

- **Dev hygiene** (offer only once real code + a toolchain exist — skip for
  an empty project) → two optional add-ons, each its own yes/no, each backed
  by an existing skill so this skill doesn't reinvent them:
  - **Pre-commit hooks** — recommend yes for any project with a lint/test
    toolchain: run the `setup-pre-commit` skill (Husky + lint-staged, format
    + typecheck + test on commit) so the `coder` role's changes are checked
    before they ever reach a PR, shrinking the techlead's blocking findings.
  - **Git guardrails** — recommend yes on Claude Code: run the
    `git-guardrails-claude-code` skill to block destructive git commands
    (`push --force`, `reset --hard`, `clean`, `branch -D`) via hooks. The
    workflow never merges or force-pushes on the user's behalf; this makes
    that a hard guarantee rather than a convention.

Skip any item the user declines. Skip the CLAUDE.md / postman / adr /
design-system / dev-hygiene checks entirely if their precondition (Claude Code
/ backend / real code / frontend surface / real code + toolchain) doesn't
hold — don't ask about them.

## Step 4 — Claude Code subagents

If (and only if) you are running as **Claude Code**:

**First check whether the roles are already installed globally.** If the user
keeps them in their user scope — `~/.claude/agents/*.md` or a subfolder like
`~/.claude/agents/dev-workflow/*.md` (Claude Code discovers agents recursively;
the name comes from each file's `name:` frontmatter, not its path) — then
`scout`/`pm`/`coder`/`techlead`/`qa` already resolve in **every** project and a
project-local copy is redundant. Check for the five `name:` values across
`~/.claude/agents/` (recursively). If all five are already present globally,
**skip the copy entirely** and just report "roles already installed globally".
Only copy the ones that are genuinely missing.

Otherwise, install the five workflow-role subagents by copying each file from
[references/agents/](references/agents/) into `.claude/agents/` in this
project, **skipping any that already exist** (never overwrite — the user may
have customized one). No need to ask permission first — this only adds new
files, nothing existing is touched:

- `scout.md` — read-only recon, feeds everyone
- `pm.md` — BRD → PRD → parent issue + sub-issues (loads `to-spec`/`to-tickets`)
- `coder.md` — one sub-issue → pushed PR (the only role that edits code)
- `techlead.md` — static PR review, BLOCKING/LGTM, posted on the PR
- `qa.md` — verify a PR by execution

These are the exact role names `/ship` delegates to (scout → coder →
techlead → qa), so the orchestrator resolves each phase to a real subagent
here instead of falling back to inline work. Each runs with **fresh,
isolated context** via the Agent tool — which matters most for `techlead`
and `qa`: a review by the same context that wrote the code is not a review.

**Run these synchronously, never in the background.** The pipeline is a chain
of gates — `coder` must finish before `techlead` reviews its PR, `techlead`
must LGTM before `qa` runs. Delegating in the background breaks the ordering
and lets a later gate start against unfinished work. When `/ship` (or you)
delegate via the Agent tool, pass `run_in_background: false` for `coder`,
`techlead`, and `qa`. (`scout` and `pm` are also fine synchronous; the hard
requirement is the coder → techlead → qa gate chain.)

The standalone phase skills (`to-spec`, `to-tickets`, `to-implement`,
`code-review-pr`, `to-qa`) stay available for invoking a single phase by hand
outside `/ship` — they complement these role subagents, they don't replace
them.

If you are running as Pi or another tool, skip this step — the equivalent
setup there is the manual symlink step in this package's README
(`ln -s .../agents/*.md ~/.pi/agent/agents/`), which this skill does not do
on your behalf.

## Step 5 — Report

A few lines: git state; whether `to-spec` was run for an empty project (and
the resulting BRD/PRD paths, if so); AGENTS.md/CLAUDE.md status;
`docs/postman/`, `docs/adr/`, and PRODUCT.md/DESIGN.md status; and the role
subagents' state — "already installed globally", or which project-local
`.claude/agents/*.md` files were created vs. already present (Claude Code only).

Then recommend exactly **one** next command — not a menu. A user who's lost
enough to land here can't be expected to pick the right item off a list:

- Repo has GitHub issues already (`gh issue list --state all --limit 1`
  returns anything) → this project is already past spec/tickets. Run the
  same gather-and-recommend logic as `/scout` (`prompts/scout.md`) and
  report **its** single recommendation instead of anything below.
- No issues yet, but an approved spec exists in `docs/prd/` → recommend
  `to-tickets`.
- No spec yet → recommend `to-spec` (BRD → PRD; `create-brd`/`create-prd`
  are still available directly if only one is needed).

Close with one line making the re-run behavior explicit: "not sure what to
do later either — just say `setup-dev-workflow` again."
