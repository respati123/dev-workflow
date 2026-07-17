---
name: to-implement
description: Implement one GitHub sub-issue end to end — scout the area, branch, code, test, push a PR. Trigger on "to-implement", "implement issue #N", "code this issue", "implement this ticket".
---

# to-implement

The coder role's phase, runnable on its own (not only via the full `/ship`
pipeline). This is the only phase allowed to modify code.

## Workflow

1. Identify the target sub-issue. Read its acceptance criteria and its
   `## Parent` reference for feature-level context.
2. Scout first: read the target area's structure, conventions, and existing
   contracts before writing anything — reuse what's already there instead of
   inventing new patterns. If the project provides domain skills
   (`backend-rules`, `frontend-rules`, `ui-design`, etc.), load the ones
   relevant to this task too.
3. `git fetch origin` and branch `feat/<issue>-<slug>` or
   `fix/<issue>-<slug>` off the up-to-date default branch — never a stale
   local copy, a dependent sub-issue needs previously merged work underneath it.
4. Implement, scoped tight to this sub-issue's acceptance criteria only —
   note anything extra you're tempted to fix, don't do it here.
5. Add/update tests for what changed. Run the project's lint and test
   commands; fix failures before handing off.
6. Added or changed an API endpoint? Update the project's API docs (e.g.
   `docs/postman/`) in the same PR.
7. Commit, push, open a PR with `Closes #<sub-issue>` (the sub-issue, never
   the parent).
8. Report: PR URL, branch, files changed, commands run and their results.
   Never merge.
