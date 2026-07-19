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

**Delegate to the `qa` role** — this whole phase is the qa role's job. Check
your toolset for a delegation mechanism, best match first:

1. **Claude Code**: spawn the `role-installer` subagent first (task `"ensure
   qa"`). `READY` → delegate to `qa` via the Agent tool, `subagent_type:
   "qa"`, foreground — passing the PR number. `NEEDS_RESTART` → tell the
   user to restart Claude Code once; don't run inline as a workaround unless
   this context isn't the one that just implemented or reviewed the
   change — dynamic verification by the same context that wrote or approved
   the code isn't independent verification.
2. **Pi**, with `extensions/subagent/` installed: the same idea via the
   `subagent` tool — `{agent: "role-installer", task: "ensure qa"}` first,
   then `{agent: "qa", task: "..."}` on `READY`.
3. **No native delegation tool, but you can spawn a fresh instance of
   yourself non-interactively**: spawn one via bash with `qa`'s role file
   plus the task, and wait for its output.
4. **Neither available, and this context is independent of the
   implementation/review**: run the phase inline —

1. Check out the PR branch: `gh pr checkout <PR>`. Run the project's lint,
   test, and e2e commands.
2. **CI status**: check `gh pr checks <PR>` (or `statusCheckRollup`). Still
   running → wait and re-check. Failed → a finding, same as a local
   failure, even if the local run passed.
3. A failing test → re-run up to **2 more times, hard cap**. Consistently
   fails → genuine **FAIL**. Inconsistent across attempts → report
   **FLAKY** separately (which test, attempts, pattern) instead of quietly
   calling it PASS — it doesn't block this PR by itself, but never hide it.
4. For each acceptance criterion on the linked issue, verify it **by
   execution** — run the flow, hit the endpoint, observe the output. Reading
   the code is not verification.
5. Report a checklist: each criterion PASS/FAIL with the evidence (command +
   observed output), CI status, and any FLAKY tests. Anything you couldn't
   execute is UNVERIFIED, not PASS.
6. Verdict: **PASS** only if every criterion passes AND CI is green (or no
   CI configured); otherwise **FAIL** with the failing criteria/CI check
   listed. Never fix code yourself.

   **Invoked standalone (not via `ship`)**: on FAIL, don't just report and
   stop — ask the user (`AskUserQuestion`, single-select) how to proceed:
   (1) delegate to the `coder` role/subagent to fix the failing criteria on
   the same PR branch, then re-run `to-qa`, or (2) leave it for the user to
   fix manually. Only spawn `coder` on explicit choice (1) — never fix the
   findings yourself or assume the answer.
7. On **PASS**: check whether this was the last sub-issue for its parent.
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
