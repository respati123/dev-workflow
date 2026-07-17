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
