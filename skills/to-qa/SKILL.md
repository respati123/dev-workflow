---
name: to-qa
description: Verify a PR's acceptance criteria by executing the app, not by reading code — runs after code-review-pr's LGTM. Trigger on "to-qa", "qa this PR", "verify this PR".
---

# to-qa

The qa role's phase: dynamic verification, after the review passes (serial,
never parallel with review).

## Workflow

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
