---
name: dev-start
description: Bootstrap a project for the multi-agent dev workflow (scout, pm, coder, techlead, qa). Checks git, creates agent definitions for the detected tool(s), and maps the codebase into AGENTS.md. Idempotent — safe to re-run, only fills gaps. Trigger on "dev:start", "dev start", "setup dev workflow", or "bootstrap this project".
---

# dev-start

Bootstraps a project so the multi-agent development workflow (BRD → PRD →
issues → scout → code → review → QA) can run on it, regardless of which
coding agent the user drives it with (Claude Code, Pi, OpenCode).

**Idempotent by design**: every step first checks what already exists and
only creates what's missing. Re-running must never overwrite user files.

## Step 1 — Scout current state (read-only)

Check, without changing anything:

- Is this a git repo? (`git rev-parse --is-inside-work-tree`) Does it have a remote?
- Does `.agents/skills/` exist? Which skills are in it (or in `.claude/skills/`, `.pi/skills/`)?
- Does `AGENTS.md` exist?
- Which tool dirs exist: `.claude/`, `.pi/`, `.opencode/`?
- Is the project empty or does it contain code?

Summarize the state in a few lines before proceeding.

## Step 2 — Git

If not a git repo: **ask the user** whether to initialize one (never init
silently). If yes:

1. `git init`
2. Ask how to connect a remote — one question, three options:
   - create on GitHub: ask the repo name, then `gh repo create <name> --private --source=. --remote=origin`
   - existing remote: ask the URL, then `git remote add origin <url>`
   - local-only for now: skip.

If git already exists, move on.

## Step 3 — Install agent roles

Read the canonical roles in [references/roles/](references/roles/) (scout,
pm, coder, techlead, qa) and generate one wrapper per role for each tool
detected in step 1, following the frontmatter mapping in
[references/adapters.md](references/adapters.md). Key rules (details in the
adapter doc):

- Body is copied verbatim; only frontmatter is translated.
- `preload-skills` is filtered to skills that actually exist in this project.
- Existing wrapper files are never overwritten — skip and report.
- No tool dir detectable → ask which tool(s) to target; don't generate all
  three speculatively.

Also install the workflow prompts from
[references/prompts/](references/prompts/) (issue, ship, resume) into the
detected tool's command directory (locations in the adapter doc), same
never-overwrite rule.

## Step 4 — Map the codebase into AGENTS.md

- **Project has code**: delegate to the `scout` role (as a subagent if the
  tool supports it, otherwise do the recon yourself, read-only) to map
  structure, stack, commands, and conventions. Fill
  [references/agents-md-template.md](references/agents-md-template.md) with
  the findings.
- **Project is empty**: write the template with the workflow section filled
  and the map/commands sections as TODO placeholders.
- **AGENTS.md already exists**: merge — add only missing sections, never
  delete or rewrite existing content. Show the user the diff of what you're
  adding before writing.

## Step 5 — Report

One compact summary: what was created, what was skipped (and why), which
skills got preloaded into which roles, and the one-liner to start working:
run the `pm` flow (`create-brd` → `create-prd`) for a new feature, or `/ship`
to drive an issue end to end.

## References

- [roles/](references/roles/) — canonical role definitions (single source of truth)
- [adapters.md](references/adapters.md) — per-tool frontmatter mapping + command dirs
- [agents-md-template.md](references/agents-md-template.md) — AGENTS.md skeleton and merge rules
