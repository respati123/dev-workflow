# AGENTS.md template

Generated/updated by `dev-start`. If the project already has an AGENTS.md,
MERGE: add only the missing sections below, never delete or rewrite what the
user wrote.

```markdown
# AGENTS.md

## Project map
<!-- filled from the scout report: what this project is, top-level layout -->
- `<dir>/` — <what lives here>

## Stack
<!-- languages, frameworks, notable libraries — from scout report -->

## Commands
- Install: `<cmd>`
- Dev: `<cmd>`
- Build: `<cmd>`
- Lint: `<cmd>`
- Test: `<cmd>`

## Conventions
<!-- naming, patterns, idioms the scout found; keep only what an implementer
     must follow, not a style essay -->

## Development workflow (multi-agent)
Roles: `scout` (read-only recon), `pm` (BRD/PRD/issues), `coder` (implements),
`techlead` (static review), `qa` (verifies by execution).

Pipeline per feature:
1. `pm` — BRD → PRD → parent issue + sub-issues (backend first).
2. Per sub-issue: `scout` recon (mandatory) → `coder` implements → PR
   (`Closes #<sub-issue>`, never the parent).
3. `techlead` reviews the diff with fresh context: BLOCKING findings go back
   to `coder` (max 3 rounds, then stop and report); `LGTM` proceeds.
4. `qa` runs serially after LGTM: verifies every acceptance criterion by
   execution. FAIL goes back to `coder`; PASS means ready.
5. A human merges. Agents NEVER merge.

## Do not
- Do not merge PRs — merging is always manual.
- Do not let any agent other than `coder` modify code.
- Do not skip the scout step before implementation.
```
