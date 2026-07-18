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

**Delegate to the `techlead` role** — this whole phase is the techlead
role's job. On Claude Code: spawn the `role-installer` subagent first (task
`"ensure techlead"`).

- `READY` → delegate to `techlead` via the Agent tool, `subagent_type:
  "techlead"`, foreground — passing the PR number (fresh context matters
  here: don't hand it the implementer's reasoning, just the PR). Relay its
  verdict and stop; skip the steps below.
- `NEEDS_RESTART` → tell the user to restart Claude Code once. Don't run
  this phase inline as a workaround unless this context did **not** write
  the diff being reviewed — a review by the same context that wrote the
  code is not a review, so faking fresh context defeats the point of this
  gate. Otherwise, run inline —

1. Fetch the diff (`gh pr diff <PR>`) and the linked issue's acceptance
   criteria.
2. Review for: correctness, criteria actually met, missing tests, edge
   cases, scope creep, and violations of the project's documented rules.
3. **API docs check**: if the diff adds or changes an endpoint, the
   project's API docs (e.g. `docs/postman/`) must be updated in the same
   PR, with both a positive and a negative example request for the
   affected endpoint — a missing doc update, or one with only the happy
   path, is **BLOCKING**.
4. **Data model check**: if the diff adds or changes a table/schema and
   the project keeps an `ERD.md`, it must be updated in the same PR — a
   missing update is **BLOCKING**.
5. **ADR check**: if the diff makes an architecturally significant,
   hard-to-reverse decision (a new dependency/framework/datastore, a new
   module boundary or service split, a public interface/contract, or a
   cross-cutting construction technique) and no ADR under `docs/adr/` is
   added or updated in the same PR, that's **BLOCKING**. A local refactor,
   a new field, or any reversible/self-contained choice is not significant
   — don't demand an ADR for those.
6. **Security check** (per `coding-principles`): string-concatenated/
   interpolated SQL instead of parameterized queries, a hardcoded secret or
   credential, a non-crypto RNG for a token/ID/nonce, or a resource access
   with no per-resource authorization check are each **BLOCKING** — a
   targeted check for these specific red flags, not an open-ended audit.
7. Group findings **BLOCKING** vs **non-blocking**, each with file, line,
   and a concrete failure scenario. No blocking findings → `LGTM`.
8. Post the review on the PR itself:
   BLOCKING → `gh pr review <PR> --request-changes --body "<findings>"`;
   LGTM → `gh pr review <PR> --approve --body "<summary + non-blocking notes>"`.

Review statically — don't run the app (that's `to-qa`, and it runs after
this passes) and never edit code. Blocking findings go back to whoever's
implementing, not fixed here.
