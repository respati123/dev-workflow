---
description: Create a well-structured GitHub issue (bug or task) via gh
argument-hint: "<title> [context]"
---
Create a GitHub issue using the `gh` CLI, following the project's issue conventions.

Raw input — title: $1 | context: ${@:2}

## Before creating

1. Detect the type from the input: **bug**, **feature/task**, or **chore**.
2. Keep it atomic — one concern per issue. If the input covers multiple things, propose splitting into separate issues and ask which to create.
3. **Features get a parent issue + sub-issues.** Every feature is created as one **parent issue** (the feature itself: context, goal, overall acceptance criteria) plus **sub-issues** for the implementable parts, linked via GitHub's native sub-issue relationship:
   - Split by layer at minimum: one `backend` sub-issue, one `frontend` sub-issue. Add more sub-issues only if the feature genuinely has more atomic parts — don't pad.
   - The backend sub-issue comes first; note it as a dependency in the frontend sub-issue's body.
   - Each sub-issue gets acceptance criteria scoped to its layer; the parent holds the feature-level criteria.
   - Features touching a single layer still get a parent + one sub-issue, so tracking is uniform.
   - **Bugs and chores stay single issues** — no parent/sub structure.
4. Rewrite the title to be specific and action-oriented, imperative mood
   (e.g. "Fix crash when saving an expense with an empty amount"), not vague ("app is broken").
5. Choose labels: `bug` | `feature` | `chore`, plus **area labels** — at least one of `backend` / `frontend`. Use both only when the issue genuinely touches both layers (rare after rule 3).

## Body template — bug

```
## Summary
<one-sentence description>

## Steps to reproduce
1. ...
2. ...

## Expected
<what should happen>

## Actual
<what happens instead>

## Environment
<device / browser / API version, if relevant>

## Severity
low | medium | high | critical
```

## Body template — feature parent issue

```
## Context
<why this is needed — the problem or goal>

## Description
<what to build, feature-level — details live in the sub-issues>

## Acceptance criteria (feature-level)
- [ ] <condition verifiable when ALL sub-issues are done>
- [ ] ...

## Out of scope
<what this feature does NOT cover>
```

Sub-issues appear automatically in GitHub's sub-issue panel — don't maintain a manual task list in the body.

## Body template — sub-issue / task

```
## Parent
#<parent issue number>

## Description
<what to build / change in THIS layer only>

## Acceptance criteria
- [ ] <clear, testable condition scoped to this layer>
- [ ] ...

## Dependencies / related
<e.g. "Blocked by #<backend sub-issue>" for the frontend sub-issue>
```

## Body template — chore

Use the sub-issue/task template without the Parent section.

## Create

1. Build titles and bodies from the correct templates above. For a feature, propose the full breakdown (parent + sub-issue titles) to the user **before creating anything**.
2. Create each issue: `gh issue create --title "<title>" --body "<body>" --label "<labels>"`. For features: parent first, then backend sub-issue, then frontend sub-issue.
3. Link each sub-issue to the parent using the sub-issues API (needs the sub-issue's database ID, not its number):
   ```
   sub_id=$(gh api repos/{owner}/{repo}/issues/<sub_number> --jq .id)
   gh api repos/{owner}/{repo}/issues/<parent_number>/sub_issues -F sub_issue_id=$sub_id
   ```
   (Use `gh repo view --json owner,name` if owner/repo aren't known.)
4. If a milestone or assignee is obvious from context, add `--milestone` / `--assignee`.
5. Report back: parent issue number + URL and each sub-issue number + URL. Do not start coding yet unless asked.
