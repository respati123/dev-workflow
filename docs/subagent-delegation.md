# Subagent delegation — the role-installer pattern

> Human-readable overview. The actual logic lives in
> `skills/setup-dev-workflow/references/agents/role-installer.md` (mirrored
> at `agents/role-installer.md`) — that file is what runs, this doc just
> explains why it exists.

Every phase skill in this workflow delegates to one of the five workflow-role
subagents — never a separate agent per skill:

| Skill | Delegates to role |
|---|---|
| `to-spec`, `to-tickets` | `pm` |
| `to-implement` | `coder` |
| `code-review-pr` | `techlead` |
| `to-qa` | `qa` |
| `ship` (all phases) | `scout` / `pm` / `coder` / `techlead` / `qa` |

## Why a 6th agent instead of inlining the check

An earlier version of this workflow inlined a "check the role resolves,
install it if missing, tell the user to restart if it's still missing"
paragraph into all six of the skills above — the same ~15 lines, repeated
six times, because a shared *doc* (an earlier draft of this file) doesn't
survive the global skill installer (it only pulls each skill's own
directory, not sibling files under `docs/`).

That's correct but wasteful: every one of those six skills' own context
footprint carried the full paragraph, whether or not a role was ever
actually missing. A **subagent**, unlike a doc link, is a real Claude
Code/Pi primitive that runs in its own isolated context — so the fix isn't
"share a doc," it's "share an agent." `role-installer` is a 6th agent file,
installed the exact same way as the five roles (`setup-dev-workflow`'s
Step 4, `references/agents/role-installer.md`), whose only job is the
check-and-install logic. Each of the six phase skills now spends one line
delegating to it before delegating to the real role — the detailed
logic only enters context when `role-installer` actually runs, in its own
disposable window, not every time the calling skill loads.

## What it does

Given a role name (`scout`/`pm`/`coder`/`techlead`/`qa`):

- **Claude Code**: check it resolves in `~/.claude/agents/` (global) or this
  project's `.claude/agents/` (project-local). Missing → copy
  `~/.claude/skills/setup-dev-workflow/references/agents/<role>.md` into
  `.claude/agents/<role>.md`. Still unresolved right after copying? Claude
  Code's file watcher only picks up a brand-new `agents/` directory (or a
  previously-empty one's first file) on the *next* session start — reports
  `NEEDS_RESTART` instead of silently failing.
- **Pi**: check `~/.pi/agent/agents/<role>.md` exists. Missing → symlink it
  from this package's own `agents/<role>.md` (not a copy — Pi's roles stay
  live-linked so `git pull` updates every project at once).

Reports exactly one line: `READY: <role>[, note]` or `NEEDS_RESTART:
<role>`. The caller (whichever phase skill invoked it) decides what to do
with that — install-on-demand fallback logic, e.g. running the phase inline
for non-gate roles, or refusing to fake fresh context for `techlead`/`qa`,
stays in each calling skill, not here.
