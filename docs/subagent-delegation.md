# Subagent delegation — install-on-demand fallback

> Note: this doc is a human-readable overview. Because Claude Code's skill
> installer only pulls each skill's own directory (not sibling files under
> `docs/`), every skill's own SKILL.md inlines the actionable steps below
> rather than linking here — keep both in sync if you change the approach.

Every phase skill in this workflow delegates to one of the five workflow-role
subagents — never a separate agent per skill:

| Skill | Delegates to role |
|---|---|
| `to-spec`, `to-tickets` | `pm` |
| `to-implement` | `coder` |
| `code-review-pr` | `techlead` |
| `to-qa` | `qa` |
| `ship` (all phases) | `scout` / `pm` / `coder` / `techlead` / `qa` |

Don't invent a same-named agent per skill (`to-implement.md`,
`code-review-pr.md`, ...) — nothing installs those and there's no reference
template for them. The five role files
(`setup-dev-workflow/references/agents/*.md`) are the only ones that exist.

## Before delegating, make sure the role resolves

**Claude Code**: check whether the target role's `name:` frontmatter
resolves anywhere Claude Code discovers agents recursively — `~/.claude/agents/`
(global) and this project's `.claude/agents/` (project-local).

- **Found** → delegate via the Agent tool, `subagent_type: "<role>"`,
  `run_in_background: false`.
- **Not found anywhere** — this is the "subagent not installed" failure.
  Install it: copy `~/.claude/skills/setup-dev-workflow/references/agents/<role>.md`
  (an absolute, always-resolvable path — not a relative link, which breaks
  once a skill is installed standalone) into `.claude/agents/<role>.md` in
  this project, then retry the delegation.
- **Still unresolved right after installing**: Claude Code's file watcher
  only picks up a brand-new `agents/` directory — or the first file added to
  a previously-empty one — on the *next* session start, not the current one
  (documented at [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)).
  Tell the user to restart Claude Code once. For **techlead**/**qa**, don't
  paper over this by running inline in the same context that wrote/reviewed
  the change — a review or verification by that same context isn't
  independent. Stop and say so instead.

**Pi**: same idea via the `subagent` tool — roles resolve from
`~/.pi/agent/agents/`. If a role is missing there, symlink it from this
package's `agents/<role>.md` (per the README's install step) rather than
copying — Pi's agents are meant to stay live-linked, not copied per project.
