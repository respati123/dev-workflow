---
name: code-review-pr
description: Static review of an open PR against its issue's acceptance criteria — BLOCKING findings or LGTM, posted to the PR. Trigger on "code review pr", "review this PR", "techlead review".
---

# code-review-pr

The techlead role's phase: a static diff review with fresh eyes — judge the
diff on its own merits, don't inherit the implementer's reasoning. If the
project provides its own `code-review` skill for house standards, load that
too.

GitHub calls below (`gh pr diff`, `gh pr review`): prefer the MCP GitHub
tools when connected, otherwise run `gh` as written — mapping in
[docs/github-access.md](../../docs/github-access.md).

## Workflow

**Delegate first**: if `.claude/agents/code-review-pr.md` exists (installed
by `setup-dev-workflow`), spawn it via the Agent tool — `subagent_type:
"code-review-pr"`, foreground — passing the PR number (fresh context matters
here: don't hand it the implementer's reasoning, just the PR). Relay its
verdict and stop; skip the steps below.

**No installed subagent** (or not Claude Code): run the phase inline —

1. Fetch the diff (`gh pr diff <PR>`) and the linked issue's acceptance
   criteria.
2. Review for: correctness, criteria actually met, missing tests, edge
   cases, scope creep, and violations of the project's documented rules.
3. **API docs check**: if the diff adds or changes an endpoint, the
   project's API docs (e.g. `docs/postman/`) must be updated in the same
   PR — a missing doc update is BLOCKING.
4. Group findings **BLOCKING** vs **non-blocking**, each with file, line,
   and a concrete failure scenario. No blocking findings → `LGTM`.
5. Post the review on the PR itself:
   BLOCKING → `gh pr review <PR> --request-changes --body "<findings>"`;
   LGTM → `gh pr review <PR> --approve --body "<summary + non-blocking notes>"`.

Review statically — don't run the app (that's `to-qa`, and it runs after
this passes) and never edit code. Blocking findings go back to whoever's
implementing, not fixed here.
