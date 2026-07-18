---
name: prioritize
description: Rank candidate features/requirements and decide what to build first and what to cut, using RICE, MoSCoW, Kano, or value-vs-effort. Trigger on "prioritize", "prioritas", "what to build first", "apa dulu", "which features first", or when a BRD/PRD bundles several features/FRs and the build order isn't obvious. Sits between create-brd and to-tickets in the pm flow.
---

# prioritize

Decides **order and cut** — what to build first, what to defer, what to drop —
before those choices get frozen into tickets. The pipeline otherwise takes
scope and sequence as given; this is the step that questions them.

Use it when there is a real choice to make: a BRD bundling several FRs, a
backlog, or a feature whose parts could ship in different orders. **Skip it**
when there's genuinely one atomic thing to build — forcing a framework onto a
single obvious task is ceremony, not prioritization. Say so and move on.

## Workflow

### 1. Gather the candidates

List the things being ranked, each as one line: an FR from a BRD/PRD, a
feature, or a backlog item. Pull them from `docs/brd/` or `docs/prd/` if a
spec exists; otherwise ask the user for the list. You can't prioritize what
isn't enumerated — get to a concrete list first.

### 2. Pick the framework (don't run all four)

One framework, chosen to fit the decision. Default to **value-vs-effort** when
unsure — it's the fastest and usually enough at this workflow's scale.

| Framework | Use when | What it gives you |
|---|---|---|
| **Value vs Effort** | Quick first cut, a handful of items | A 2×2: do the high-value/low-effort first |
| **MoSCoW** | Scope or deadline is fixed, need a shippable minimum | Must / Should / Could / Won't — the Must set is the MVP |
| **RICE** | Comparing many *disparate* ideas by ROI | A single comparable score per item |
| **Kano** | Deciding the mix of table-stakes vs. delighters | Each feature classed basic / performance / delighter |

Formulas, scales, and the exact procedure for each are in
[references/frameworks.md](references/frameworks.md) — read it for the one you
picked. Name the framework and *why* it fits before scoring.

### 3. Score with the user, don't guess the inputs

Every framework needs inputs only the user (or data) can supply — reach
numbers, effort estimates, how much a feature matters. Infer what you defensibly
can from the spec and **state each inferred value as an assumption to confirm**
("Assuming ~500 users hit this/month — correct?"); ask for the rest in one
batch. Confidence/uncertainty is itself an input (RICE has a Confidence factor
for exactly this) — don't launder a guess into a precise-looking score.

### 4. Output: ranked list + cut line + build order

Produce, concisely:

- **The ranking** (or MoSCoW buckets / Kano classes), with the score or
  rationale per item.
- **The cut line** — what is explicitly *not* being built now (MoSCoW's Won't,
  or everything below a value threshold). Deciding what to drop is the point;
  don't dodge it.
- **Recommended build order**, respecting hard dependencies (a thing that
  technically must precede another overrides its raw score — note where that
  happens).
- **One line on what would change the answer** (the assumption the ranking is
  most sensitive to), so the user can push back.

The ranking is a **recommendation, not a verdict** — dependencies, strategy, or
a table-stakes obligation can legitimately override a score. Present it so the
user can override; don't apply any framework rigidly.

### 5. Hand off

Feed the approved order into `to-tickets` (or `/ship`): the parent issue plus
sub-issues get created in the recommended sequence, deferred items stay out of
scope for now. If invoked standalone, just report the ranking and stop.

## Reference

- [Frameworks](references/frameworks.md) — RICE / MoSCoW / Kano / value-effort:
  formulas, scales, when-to-use, sources.
