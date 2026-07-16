# Tool adapters — generating agent wrappers from canonical roles

Each role in `roles/*.md` is the single source of truth. `dev-start` generates
one wrapper file per role per detected tool. The **body** (prompt) is copied
verbatim into every wrapper; only the frontmatter is translated per this table.

| Canonical field | Claude Code (`.claude/agents/<name>.md`) | OpenCode (`.opencode/agent/<name>.md`) | Pi (`.pi/agents/<name>.md`) |
|---|---|---|---|
| `name` | `name` | filename (no field) | `name` |
| `description` | `description` | `description` | `description` |
| `tier` | `model:` small→`haiku`, medium→`sonnet`, large→inherit (omit) | `model:` per user's configured provider — ask once, or omit to inherit | omit (Pi inherits) |
| `write: false` | `tools: Read, Grep, Glob, Bash` | `tools: { write: false, edit: false }` | note "read-only" in body (already there) |
| `write: true` | omit `tools` (inherit all) | omit `tools` | omit |
| `preload-skills` | `skills: [...]` (native preload) | no native preload — prepend to body: "First load these skills: <list>" | no native preload — same body prepend |

Rules for the generator:

- **Filter `preload-skills` against reality**: only include skills that actually
  exist in the target project (`.agents/skills/`, `.claude/skills/`, or
  `.pi/skills/`). A missing skill in Claude Code's `skills:` field logs a
  warning; in a body-prepend it becomes a confusing dead instruction. Drop
  what's absent and mention the drop in the report.
- **Never overwrite** an existing wrapper file — the user may have customized
  it. Skip and report instead.
- **Detect tools by evidence**: `.claude/` dir or user runs Claude Code →
  generate Claude wrappers; `.pi/` → Pi; `.opencode/` → OpenCode. If nothing
  is detectable, ask the user which tool(s) to target rather than generating
  all three speculatively.

Prompt/command locations per tool (for installing the workflow prompts):

| Tool | Slash-command directory |
|---|---|
| Claude Code | `.claude/commands/*.md` |
| Pi | `.pi/prompts/*.md` |
| OpenCode | `.opencode/command/*.md` |
