---
name: dev-start
description: Prepare a project for the multi-agent dev workflow (scout, pm, coder, techlead, qa). Checks git and maps the codebase into AGENTS.md. Roles, prompts, and skills come from installing the dev-workflow package itself — this skill installs nothing. Trigger on "dev:start", "dev start", or "bootstrap this project".
---

# dev-start

Prepares a project so the multi-agent development workflow (BRD → PRD →
issues → scout → code → review → QA) can run on it. The roles, prompts, and
skills are already available globally from installing the dev-workflow
package (see the repo README) — this skill only handles what is inherently
per-project: git and AGENTS.md.

**Idempotent by design**: check what exists, only fill gaps, never overwrite
user files.

## Step 1 — Git

Check `git rev-parse --is-inside-work-tree`. If not a git repo: **ask the
user** whether to initialize one (never init silently). If yes:

1. `git init`
2. Ask how to connect a remote — one question, three options:
   - create on GitHub: ask the repo name, then `gh repo create <name> --private --source=. --remote=origin`
   - existing remote: ask the URL, then `git remote add origin <url>`
   - local-only for now: skip.

If git already exists, move on.

## Step 2 — Map the codebase into AGENTS.md

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

## Step 3 — Report

A few lines: git state, what was added to AGENTS.md, and the one-liner to
start working: run the `pm` flow (`create-brd` → `create-prd`) for a new
feature, `/ship` to drive an issue end to end, `/scout` to see where
everything stands.
