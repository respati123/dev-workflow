# dev-workflow

Multi-agent development workflow for Pi (and Claude Code). Install once,
globally — every project gets the skills, prompts, and roles. No per-project
generation step.

## Quick start — if you don't know where to begin

Say **`setup-dev-workflow`** as your first message, in any project — empty
or already full of code, doesn't matter. It figures out what state things
are in (no git yet? no spec? spec but no issues? issues already in flight?)
and tells you the single next command to run. Lost again later, mid-project?
Say it again — it's idempotent, never overwrites your work, and on an
already-set-up project it skips straight to the recommendation.

## What's inside

```
agents/    # the five roles: scout, pm, coder, techlead, qa
           # + role-installer: a 6th, utility-only agent every phase skill
           # delegates to first, so the "is this role installed?" check runs
           # in its own isolated context instead of bloating every phase
           # skill's own text with the same paragraph six times over
prompts/   # /issue, /scout — slash commands; ship.md is a thin redirect to
           # the `ship` skill, kept only so bare /ship still works on Pi
           # (Pi's skills register as /skill:name, not /name — see skills/ship/)
extensions/
  subagent/     # delegation tool: spawns a fresh `pi` process per role, streaming TUI
                # (vendored from pi's official examples/extensions/subagent)
skills/
  setup-dev-workflow/  # per-project prep: git, AGENTS.md/CLAUDE.md, docs/postman/,
                       # + installs the subagents below into .claude/agents/ on Claude Code
  ship/            # orchestrator: drives a task through scout -> coder -> techlead -> qa
  create-brd/      # business requirements doc, interview-driven
  create-prd/      # per-feature PRD, grounded in codebase research
  to-spec/         # create-brd -> create-prd back to back
  prioritize/      # rank features / decide what to build first (RICE/MoSCoW/Kano/value-effort)
  create-adr/      # record one architecturally significant decision (Nygard-light)
  to-tickets/      # spec -> parent issue + sub-issues (pm)
  to-implement/    # one sub-issue -> pushed PR (coder)
  code-review-pr/  # static PR review, BLOCKING/LGTM (techlead)
  to-qa/           # verify a PR by execution (qa)
```

Each of the last four mirrors one phase of the `/ship` pipeline (see below)
so it can be invoked on its own — resuming a stuck step, or working outside
the full orchestrator — without needing the `agents/` role files symlinked.
On Claude Code, `setup-dev-workflow` installs them as project-local subagents
too (`.claude/agents/`), so they also run with isolated fresh context via the
Agent tool.

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

There's also a 6th agent, `role-installer` — not a workflow role, a utility
every phase skill delegates to before delegating to one of the five above:
it checks whether that role actually resolves on Claude Code and installs it
on the spot if not, entirely in its own context, so none of the phase
skills' own text has to carry that check-and-install logic.

In each new project, say **"setup-dev-workflow"** once: it checks git,
AGENTS.md/CLAUDE.md, and (for backend projects) `docs/postman/`, offering to
fill any gap; on Claude Code it also installs the pipeline-phase subagents
into `.claude/agents/`. Everything else is already installed globally.

## Editing

Edit `agents/`, `prompts/`, and `skills/` here — the install is live, so
changes apply everywhere immediately (restart running sessions).

The six agent files (five roles + `role-installer`) exist in **two** places
that must stay byte-identical: `agents/*.md` (symlinked into Pi's global
agents) and `skills/setup-dev-workflow/references/agents/*.md` (what that
skill copies into a project's `.claude/agents/` on Claude Code). The two
install paths can't share one file — the Claude Code copy is `cp`'d out of
the skill and must be self-contained, so it inlines the "MCP-first, `gh`
fallback" rule instead of linking `docs/github-access.md`. Edit a role →
update both copies (`cp skills/setup-dev-workflow/references/agents/*.md
agents/`).
