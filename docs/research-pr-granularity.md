# Research: Is "one sub-issue = one PR" a best practice?

Investigation against high-trust primary sources (Google Eng Practices, GitHub
official docs, trunk-based development, Martin Fowler). Each claim links the
source that owns it.

## TL;DR verdict

**Mostly yes — with one caveat.** The industry consensus from primary sources is
overwhelmingly "keep PRs small, focused, single-purpose." A sub-issue is a
natural unit for exactly that kind of PR, so mapping one sub-issue → one PR is a
sound default and aligns cleanly with Google, GitHub, trunk-based development,
and Fowler.

The caveat: **the rule is "one PR per unit of reviewable change," not "one PR
per issue."** If a sub-issue is still too big to review in one sitting (Google's
rough ceiling: ~100 lines good, ~1000 lines too large), the *sub-issue* was cut
too coarse — the fix is to split the sub-issue (or stack multiple PRs under it),
not to force one oversized PR. So "one sub-issue = one PR" is a good rule *as
long as sub-issues are scoped to be individually reviewable*. It becomes an
anti-pattern only if it forces you to keep a too-large change in a single PR
just to preserve the 1:1 count.

---

## 1. PR sizing / granularity

**Google (Engineering Practices — "Small CLs")** is the most explicit primary
source. Key points, quoted:

- Recommended size: **~100 lines is usually reasonable; ~1000 lines is usually
  too large.** "The number of files that a change is spread across also affects
  its 'size.'"
- A good change "makes a minimal change that addresses **just one thing**" and
  stays self-contained (includes its tests, still works after submission).
- Guiding rule: **"When in doubt, write CLs that are smaller than you think you
  need to write."**
- Why small: faster reviews ("easier to find five minutes several times than a
  30-minute block"), fewer bugs, less wasted effort if direction is wrong,
  easier rollbacks and fewer merge conflicts.
- Source: https://google.github.io/eng-practices/review/developer/small-cls.html

**GitHub (official docs — "Helping others review your changes" / best practices
for pull requests):**

- "**Aim to create small, focused pull requests that fulfill a single
  purpose.**" They are "easier and faster to review and merge, leave less room
  to introduce bugs, and provide a clearer history of changes."
- For larger changes, "provide guidance to reviewers about the order in which to
  review the files."
- Source: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes

Both authorities converge: the unit of a PR is **one focused, single-purpose,
independently reviewable change** — defined by scope/reviewability, not by any
issue-tracking artifact.

---

## 2. Small PRs / stacked PRs / stacked diffs

The concept of breaking a big change into a chain of small, incrementally
reviewable pieces is explicitly endorsed by Google as one of the primary ways to
keep CLs small ("How to Split"):

- **"Stack changes"**: "Submit one CL for review, then begin the next one based
  on it." (This is exactly the stacked-PR / stacked-diff pattern.)
- Other documented splitting strategies: split by files/components, horizontal
  splits (layers isolated behind stubs/interfaces), **vertical splits** (break
  work into independent full-stack features), and keeping refactors in their own
  CLs separate from feature/bug-fix CLs.
- Source: https://google.github.io/eng-practices/review/developer/small-cls.html

Takeaway: authorities treat a large feature as **a series of small PRs**, not one
big PR. Stacking is the sanctioned technique when the pieces have dependencies.
This is directly relevant to the "1:1" question — sometimes the natural unit is
*several* stacked PRs, and that's endorsed, not discouraged.

---

## 3. Trunk-based development vs GitHub Flow / Fowler

**Trunk-based development (trunkbaseddevelopment.com):**

- Long-lived shared branches are "bad at any release cadence"; GitFlow-style
  multiple long-running branches are explicitly rejected.
- Short-lived feature branches are permitted *only* when they are "short-lived
  and the product of a single dev-workstation," existing just long enough for
  review and CI before merging to trunk.
- Everyone should commit to trunk **at least every 24 hours** — which forces
  small batches.
- Source: https://trunkbaseddevelopment.com/

**Martin Fowler ("Patterns for Managing Source Code Branches"):**

- High-Frequency Integration beats low-frequency: "Smaller integrations mean
  less work... but more importantly than less work, it's also less risk."
- Rule of thumb: never have "more than a day's work sitting unintegrated."
- Cites the State of DevOps research: branches with lifetimes **"less than a
  day"** and **"less than three active branches in total"** correlate with
  higher delivery performance.
- Source: https://martinfowler.com/articles/branching-patterns.html

**GitHub Flow (official docs):**

- "Make a **separate branch for each set of unrelated changes**."
- "Ideally, **each commit contains an isolated, complete change**."
- Short, descriptive branches; open a PR for feedback; merge and delete the
  branch when the work is done.
- Source: https://docs.github.com/en/get-started/using-github/github-flow

How this relates to granularity: all three models push toward **small units
integrated fast**. A sub-issue that produces one short-lived branch + one small
PR merged within a day is the ideal shape under every one of these models. The
danger they warn against — long-lived branches accumulating days of unmerged
work — happens when an issue is too big and its PR drags on, *not* when issues
are small enough to be one quick PR each.

---

## 4. Linking issues to PRs (GitHub official docs)

GitHub documents the mechanics but **does not prescribe a strict 1:1
issue↔PR rule** — the linking is flexible in both directions:

- Closing keywords supported: `close`, `closes`, `closed`, `fix`, `fixes`,
  `fixed`, `resolve`, `resolves`, `resolved` (colon and uppercase allowed).
- **One PR can close multiple issues**: use full syntax per issue, e.g.
  `Resolves #10, resolves #123, resolves octo-org/octo-repo#100`.
- **Multiple PRs can be linked to one issue** (manual linking supports up to ten
  issues per PR; the issue sidebar can link across repos).
- Auto-close via keyword works when the PR merges into the repository's default
  branch; cross-repo needs `KEYWORD OWNER/REPO#N`.
- Sources:
  https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue
  and the PR best-practices page:
  https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes
  ("Add keywords like `Closes ISSUE-LINK` in your description to automatically
  link and close the issue when the pull request is merged.")

So the tooling *supports* 1:1, but also 1-PR-to-many-issues and
many-PRs-to-1-issue. **One-issue-one-PR is a convention teams adopt, not a
GitHub-documented mandate.** GitHub's own doc endorses linking PRs to "tracking
issues" for context — consistent with, but not requiring, 1:1.

---

## 5. The specific claim: does "sub-issue → one PR" align or conflict?

**It aligns**, provided sub-issues are sized to be reviewable:

- A sub-issue is a decomposition of a feature into a smaller unit. If each
  sub-issue is scoped so its diff is ~a few hundred lines and does "just one
  thing," then one PR per sub-issue *is* Google's "small, self-contained CL" and
  GitHub's "small, focused, single-purpose PR." The 1:1 mapping is the
  bookkeeping that makes the small-PR discipline legible.

**Where it can conflict / tradeoffs:**

| Situation | 1:1 outcome | Correct move |
|---|---|---|
| Sub-issue is genuinely tiny/focused | Tiny PR — ideal | Keep 1:1. This is the sweet spot. |
| Sub-issue still too big for one review (>~400–1000 lines, many concerns) | One oversized PR that violates small-CL guidance | **Split the sub-issue**, or open **stacked PRs** under it. Don't preserve 1:1 at the cost of reviewability. |
| Sub-issue naturally wants stacked PRs (e.g. schema → API → wiring with dependencies) | Forcing one PR mixes refactor + feature, hurts review | Google explicitly endorses stacking; let it be N PRs. Link them all to the sub-issue (GitHub allows many PRs → one issue). |
| Refactor bundled into a feature sub-issue | 1:1 PR mixes refactor + behavior change | Google: keep refactors in separate CLs. Split even within one sub-issue. |

The core principle every source shares: **the PR boundary is set by
reviewability and single-purpose scope, not by the issue count.** "One sub-issue
= one PR" is a good *heuristic* precisely because a well-cut sub-issue usually
*is* one reviewable change. It stops being good the moment it's used to justify a
too-large PR ("but it's one issue, so it must be one PR").

---

## So: is one-sub-issue-one-PR good — for this dev-workflow project?

This project's flow is: **pm → parent issue + backend/frontend sub-issues, one
PR per sub-issue, worked sequentially in dependency order.** Verdict for that
specific shape:

**Good, and well-aligned with the primary sources — with two guardrails.**

Why it's a good fit:

- Splitting a parent feature into **backend and frontend sub-issues is exactly
  Google's "horizontal split"** (isolating layers) and a form of vertical
  slicing. Each sub-issue → one small, single-purpose PR matches Google's small-
  CL guidance and GitHub's "small, focused, single-purpose PR" doc.
- **Sequential-in-dependency-order** is the natural fallback when you don't stack
  branches: each PR merges to trunk before the next starts, so branches stay
  short-lived and integration stays frequent — precisely what trunk-based
  development and Fowler advocate (branch life < 1 day, < 3 active branches).
- Linking each sub-issue PR with `Closes #N` is the documented GitHub pattern
  and gives clean traceability parent → sub-issue → PR.

Two guardrails to keep it honest:

1. **Size the sub-issues, not just the PRs.** The 1:1 rule only yields small PRs
   if pm cuts sub-issues small. If a "backend" sub-issue balloons past ~a few
   hundred lines or does more than one thing, the fix is at the *ticketing*
   layer: pm should split it further (or the coder should open stacked PRs under
   it), not ship one giant PR to honor the count. Google: "When in doubt, write
   CLs that are smaller than you think you need to write."

2. **Sequential ordering trades parallelism for simplicity — that's fine here,
   but watch branch age.** Doing sub-issues strictly one-after-another keeps ≤1
   active branch (great by Fowler/DevOps metrics) but serializes throughput. If a
   sub-issue's PR sits in review for days, the "short-lived branch" ideal erodes.
   Keep review turnaround fast (small PRs make this easy — the whole point) so
   the dependency chain doesn't stall. Where sub-issues have a hard dependency
   chain and you want to keep coding, **stacked PRs** (Google-endorsed) are the
   sanctioned alternative to blocking.

Bottom line: keep the 1:1 rule as the default; treat it as "one *reviewable*
change per PR" and let pm's sub-issue sizing — plus stacking when dependencies
demand it — be the escape valve, rather than ever inflating a single PR to
preserve the count.

---

### Sources

- Google Eng Practices — Small CLs: https://google.github.io/eng-practices/review/developer/small-cls.html
- GitHub — Helping others review your changes / PR best practices: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes
- GitHub — Linking a pull request to an issue: https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue
- GitHub Flow: https://docs.github.com/en/get-started/using-github/github-flow
- Trunk-Based Development: https://trunkbaseddevelopment.com/
- Martin Fowler — Patterns for Managing Source Code Branches: https://martinfowler.com/articles/branching-patterns.html
