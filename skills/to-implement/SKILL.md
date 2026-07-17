---
name: to-implement
description: Implement one GitHub sub-issue end to end — scout the area, branch, code, test, push a PR. Trigger on "to-implement", "implement issue #N", "code this issue", "implement this ticket".
---

# to-implement

The coder role's phase, runnable on its own (not only via the full `/ship`
pipeline). This is the only phase allowed to modify code.

## Workflow

**Delegate first**: if `.claude/agents/to-implement.md` exists (installed by
`setup-dev-workflow`), spawn it via the Agent tool — `subagent_type:
"to-implement"`, `isolation: "worktree"` (it branches, commits, and pushes;
keep that off the main working tree), foreground — passing the target
sub-issue if named. Relay its report (PR URL, branch, files changed) and
stop; skip the steps below.

**No installed subagent** (or not Claude Code): run the phase inline —

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
   inventing new patterns. If the project provides domain skills
   (`backend-rules`, `frontend-rules`, `ui-design`, etc.), load the ones
   relevant to this task too.
5. `git fetch origin` and branch `feat/<issue>-<slug>` or
   `fix/<issue>-<slug>` off the up-to-date default branch — never a stale
   local copy, a dependent sub-issue needs previously merged work underneath it.
6. Implement, scoped tight to this sub-issue's acceptance criteria only —
   note anything extra you're tempted to fix, don't do it here.
7. Add/update tests for what changed. Run the project's lint and test
   commands; fix failures before handing off.
8. Added or changed an API endpoint? Update the project's API docs (e.g.
   `docs/postman/`) in the same PR.
9. Commit, push, open a PR with `Closes #<sub-issue>` (the sub-issue, never
   the parent).
10. Report: PR URL, branch, files changed, commands run and their results.
    Never merge.
