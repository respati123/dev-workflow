---
name: to-implement
description: Implement one GitHub sub-issue end to end — scout the area, branch, code, test, push a PR. Trigger on "to-implement", "implement issue #N", "code this issue", "implement this ticket".
---

# to-implement

The coder role's phase, runnable on its own (not only via the full `/ship`
pipeline). This is the only phase allowed to modify code.

GitHub calls below (`gh issue ...`, `gh label ...`): prefer the MCP GitHub
tools when connected, otherwise run the `gh` command as written — mapping
and exceptions (blocked-by check, anything local) in
[docs/github-access.md](../../docs/github-access.md).

## Workflow

**Delegate to the `coder` role** — this whole phase is the coder role's job.
Check your toolset for a delegation mechanism, best match first:

1. **Claude Code**: spawn the `role-installer` subagent first (task `"ensure
   coder"`). `READY` → delegate to `coder` via the Agent tool,
   `subagent_type: "coder"`, `isolation: "worktree"` (it branches, commits,
   and pushes; keep that off the main working tree), foreground — passing
   the target sub-issue if named. `NEEDS_RESTART` → tell the user to
   restart Claude Code once, and run this phase inline for now.
2. **Pi**, with `extensions/subagent/` installed: the same idea via the
   `subagent` tool — `{agent: "role-installer", task: "ensure coder"}`
   first, then `{agent: "coder", task: "...", cwd: "<worktree path>"}` on
   `READY`. Pi's `subagent` tool has no `isolation` flag, so set up the
   worktree yourself (`git worktree add`) before delegating and pass its
   path as `cwd` — same reason as the Claude Code case.
3. **No native delegation tool, but you can spawn a fresh instance of
   yourself non-interactively**: spawn one via bash with `coder`'s role
   file plus the task, and wait for its output.
4. **Neither available**: run the phase inline —

1. Identify the target sub-issue.
   - If the user named one, use it.
   - If not, list open issues (`gh issue list --state open --json
     number,title,labels`) and triage each by querying its native blockers
     — `gh api repos/{owner}/{repo}/issues/<n>/dependencies/blocked_by --jq
     '.[] | select(.state=="open") | .number'`. Any hit means **blocked**;
     no hits and no `in-progress` label means **ready**; already
     `in-progress` means someone's on it. Present the ready list and ask
     which to work on — don't auto-pick.
   - If everything ready is actually blocked, say so and point at the
     blocking issue(s) instead — that's what should get picked up first.
2. Label it `in-progress` before doing anything else (ensure the label
   exists first; ignore already-exists errors):
   ```
   gh label create in-progress --color FBCA04 --description "Being worked on" 2>/dev/null
   gh issue edit <n> --add-label in-progress
   ```
3. Read its acceptance criteria and its `## Parent` reference for
   feature-level context.
4. Scout first: read the target area's structure, conventions, and existing
   contracts before writing anything — reuse what's already there instead of
   inventing new patterns. Load the same skills `coder.md` does: always
   `coding-principles`; `backend-rules-typescript` (+ `hono` if the project
   uses it) for a `backend`-labelled TypeScript sub-issue;
   `frontend-rules-typescript` + `impeccable` for a `frontend`-labelled one.
   Non-TypeScript backend, or the project has its own domain skills
   (`backend-rules`, `frontend-rules`, `ui-design`)? Those take precedence.
5. `git fetch origin` and branch `feat/<issue>-<slug>` or
   `fix/<issue>-<slug>` off the up-to-date default branch — never a stale
   local copy, a dependent sub-issue needs previously merged work underneath it.
6. Implement, scoped tight to this sub-issue's acceptance criteria only —
   note anything extra you're tempted to fix, don't do it here.
7. Add/update tests for what changed. Run the project's lint and test
   commands; fix failures before handing off.
8. Added or changed an API endpoint? Update the project's API docs (e.g.
   `docs/postman/`) in the same PR, with both a positive and a negative
   example request. Added or changed a table/schema, and the project keeps
   an `ERD.md`? Update it too. Both are BLOCKING findings in `techlead`'s
   review if missed.
9. Commit, push, open a PR with `Closes #<sub-issue>` (the sub-issue, never
   the parent).
10. Report: PR URL, branch, files changed, commands run and their results.
    Never merge.
