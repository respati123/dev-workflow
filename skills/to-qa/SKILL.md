---
name: to-qa
description: Verify a PR's acceptance criteria by executing the app, not by reading code — runs after code-review-pr's LGTM. Trigger on "to-qa", "qa this PR", "verify this PR".
---

# to-qa

The qa role's phase: dynamic verification, after the review passes (serial,
never parallel with review).

GitHub calls below (`gh api .../sub_issues`): prefer the MCP GitHub tools
when connected, otherwise run `gh` as written — mapping in
[docs/github-access.md](../../docs/github-access.md). `gh pr checkout` stays
`gh` regardless — it's a local operation, no MCP path exists for it.

## Workflow

**Delegate to the `qa` role** — this whole phase is the qa role's job. On
Claude Code, spawn it via the Agent tool, `subagent_type: "qa"`, foreground —
passing the PR number. If `qa` doesn't resolve ("subagent not installed"),
don't fail or silently fall through — install it: copy
`~/.claude/skills/setup-dev-workflow/references/agents/qa.md` into
`.claude/agents/qa.md` in this project (create the directory if needed),
then retry. Relay its verdict and stop; skip the steps below.

**Still unresolved right after installing** (Claude Code's file watcher
only picks up a brand-new `agents/` directory, or its first file, on the
*next* session start): tell the user to restart Claude Code once. Don't run
this phase inline as a workaround unless this context isn't the one that
just implemented or reviewed the change — dynamic verification by the same
context that wrote or approved the code isn't independent verification.
Otherwise, run inline —

1. Check out the PR branch: `gh pr checkout <PR>`. Run the project's lint,
   test, and e2e commands.
2. For each acceptance criterion on the linked issue, verify it **by
   execution** — run the flow, hit the endpoint, observe the output. Reading
   the code is not verification.
3. Report a checklist: each criterion PASS/FAIL with the evidence (command +
   observed output). Anything you couldn't execute is UNVERIFIED, not PASS.
4. Verdict: **PASS** only if every criterion passes; otherwise **FAIL** with
   the failing criteria listed. Never fix code yourself — failures go back
   to whoever's implementing.
5. On **PASS**: check whether this was the last sub-issue for its parent.
   Read the parent number from this issue's `## Parent` line, then list the
   parent's sub-issues and their state:
   ```
   gh api repos/{owner}/{repo}/issues/<parent>/sub_issues --jq '.[] | "\(.number) \(.state)"'
   ```
   If every sub-issue is `closed` (this one included, once its PR is
   merged), say so explicitly: **"All sub-issues of #<parent> are done —
   label the parent `done` and close it manually."** GitHub does not
   auto-close a parent when its sub-issues close, and closing it is a
   manual, human step (same gate `/ship`'s final checkpoint uses) — don't
   label or close the parent yourself. If sub-issues are still open, just
   note how many remain; no action needed.
