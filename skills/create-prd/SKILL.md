---
name: create-prd
description: Write a Product Requirements Document (PRD) for one specific feature, breaking down an existing BRD into concrete user flows, UX requirements, and acceptance criteria. Trigger only when the user explicitly asks to "buat PRD", "create a PRD", or "write a product requirements document" — not on generic requests like "spec this feature" or "document this".
---

# Create PRD

A PRD answers "what exactly are we building, screen by screen" — one level more
concrete than a BRD's "why are we building it." This skill always builds on top
of an existing BRD (see the `create-brd` skill) and covers **one feature per
PRD**, not the whole BRD at once. If a BRD tries to bundle five features, that's
five PRDs later, each reviewable and shippable on its own.

## Workflow

### 1. Find the linked BRD

Look in `docs/brd/` for the BRD this PRD belongs to. If the user names it,
confirm the file. If none matches, **stop and say so** — tell the user to run
`create-brd` first, or point them at it if the intent was actually "just spec
this feature" (in which case `create-brd` might not even be the right call;
ask rather than improvising a BRD-less PRD, since without one there's no goal/
scope to hold the PRD accountable to).

### 2. Identify the feature

A BRD can cover several functional requirements bundled together. Figure out
which one(s) this PRD is for. If the BRD already scopes a single feature,
that's it — confirm in one line rather than re-asking. If it bundles several,
ask the user which feature this PRD covers (one feature = one PRD; if they
want more than one, that's more invocations of this skill, not a bigger doc).

### 3. Codebase research (instead of web research)

Unlike `create-brd`, the research that matters here is **this repo**, not the
web — the BRD already established the external/business context. Look at:
- Existing similar features (UI patterns, routes, components) to know what
  conventions to follow rather than invent new ones.
- The relevant domain skill if it exists (e.g. `ui-design` for anything
  user-facing, `frontend-rules`/`backend-rules` for contract details —
  wherever this project keeps them: `.agents/skills/`, `.claude/skills/`,
  or `.pi/skills/`).
- Existing API endpoints/data model touching this area, so the PRD's
  functional detail matches what's actually feasible instead of guessing.

This is what keeps the PRD implementable instead of aspirational — a PRD that
describes a flow the current data model can't support just becomes a second
round of back-and-forth during implementation.

If research shows the BRD asks for something the current codebase can't
support (missing data, incompatible model), don't silently redesign the
feature around the limitation. Surface it: put it in the PRD's Open Questions
with the options (extend the data model vs. narrow the feature), and let the
user decide — it may mean revising the BRD, not the PRD.

### 4. Interview for the gaps

If the user pasted notes, sketches, or a brief when invoking the skill, mine
those first — don't re-ask what they already answer.

Cross-check `references/prd-template.md` against what the BRD + codebase
research + any pasted material already answer. Ask the user only what's still
open, in one clear batch. Typical gaps worth asking explicitly:

- The happy-path user flow, step by step (if not obvious from the BRD)
- Edge cases / error states the user actually cares about (don't invent a
  generic list — ask which ones matter for this feature)
- What's explicitly out of scope for *this* PRD (separate from the BRD's
  overall out-of-scope — a PRD can narrow further)
- Any UX decision that isn't already covered by this repo's design system
- **Non-functional requirements that actually apply** — a real performance
  target, an authorization rule, an accessibility need. Don't pad with generic
  "shall be fast and secure"; ask only where a concrete bar exists (pull from
  AGENTS.md), and write `N/A — [why]` for the rest. These matter because the
  `coder` builds only what's written and `qa` verifies only what's written.
- **Instrumentation** — if the BRD's success metric is a real outcome, what
  event(s) must the feature emit so the metric is measurable and QA can verify
  it moved? Skip for table-stakes/compliance features with no measured outcome.

If the BRD or codebase already answers something confidently, state the
assumption instead of re-asking ("Following the existing transaction-row
pattern for this list — flag if this needs a different layout").

For a feature with a **frontend surface**, the design isn't settled in prose
here — the `pm` runs `impeccable shape` to produce a confirmed design brief,
which fills the template's "Design / Prototype" field so the coder builds
against a concrete target, not just this document's text. Backend-only
features leave that field `N/A`.

### 5. Draft the PRD

Fill `references/prd-template.md`. Write acceptance criteria as testable
statements, not prose — someone should be able to check each one off during
QA without interpreting intent. Number functional detail against the BRD's
requirement IDs where there's a direct link (e.g. BRD's FR-2 → PRD's FR-2.1,
FR-2.2) so traceability back to the business justification stays intact.

### 6. Save and iterate

Save to `docs/prd/<slug>.md` (kebab-case, ideally same base slug as the BRD
plus the feature name if the BRD covers more than one). Point the user at the
file and ask directly what to change. No formal eval loop here either — the
person implementing against this PRD is the real reviewer.

## Reference

- [PRD template](references/prd-template.md) — section-by-section structure to fill in step 5.
