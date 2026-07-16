# dev-workflow

Multi-agent development workflow for Pi (and Claude Code). Install once,
globally — every project gets the skills, prompts, and roles. No per-project
generation step.

## What's inside

```
agents/    # the five roles: scout, pm, coder, techlead, qa
prompts/   # /issue, /ship, /scout — slash commands
extensions/
  subagent/     # delegation tool: spawns a fresh `pi` process per role, streaming TUI
                # (vendored from pi's official examples/extensions/subagent)
skills/
  dev-start/    # per-project prep: git check + AGENTS.md mapping (installs nothing)
  create-brd/   # business requirements doc, interview-driven
  create-prd/   # per-feature PRD, grounded in codebase research
```

## Install (Pi)

```bash
pi install /path/to/dev-workflow     # skills + prompts, loaded live (no copying)
ln -s /path/to/dev-workflow/agents/*.md ~/.pi/agent/agents/   # roles (packages can't ship agents)
mkdir -p ~/.pi/agent/extensions/subagent                      # delegation tool
ln -s /path/to/dev-workflow/extensions/subagent/*.ts ~/.pi/agent/extensions/subagent/
```

The subagent extension gives `/ship` real delegation: isolated context per
role, live streaming of the child's tool calls, usage stats, Ctrl+C abort.
Without it, `/ship` falls back to spawning `pi -p` via bash (works, no UI).

Restart any running Pi session to pick the new resources up. Everything
stays symlinked/live: `git pull` in this repo updates all projects at once.

Claude Code: symlink the same dirs — `agents/*.md` into `~/.claude/agents/`,
`prompts/*.md` into `~/.claude/commands/`, `skills/*` into `~/.claude/skills/`.

## The workflow

Five roles — an agent only exists if it needs different permissions, skills,
or fresh context:

| Role | Does | May edit code |
|---|---|---|
| `scout` | read-only recon; feeds everyone | no |
| `pm` | BRD → PRD → parent issue + sub-issues | no |
| `coder` | one sub-issue at a time → pushed PR | **yes (only one)** |
| `techlead` | static diff review, fresh context, BLOCKING/LGTM | no |
| `qa` | serial after LGTM; verifies acceptance criteria by execution | no |

Pipeline: `pm` → per sub-issue (`scout` → `coder` → PR → `techlead` loop,
max 3 rounds → `qa`) → human merges → next sub-issue. **One sub-issue = one
PR.** Issues carry `in-progress` / `done` labels so progress is trackable at
a glance. `/ship <issue>` resumes interrupted work by detecting labels,
branches, and PRs; `/scout` reports where every feature stands and recommends
the next action. Agents never merge.

In each new project, say **"dev:start"** once: it checks git and maps the
codebase into AGENTS.md. That's all it does — everything else is already
installed globally.

## Editing

Edit `agents/`, `prompts/`, and `skills/` here — the install is live, so
changes apply everywhere immediately (restart running sessions).
