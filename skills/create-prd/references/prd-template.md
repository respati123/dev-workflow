# PRD Template

Fill every section. If something genuinely doesn't apply, write
"N/A — [why]" instead of deleting it.

```markdown
# PRD: [Feature Name]

**Linked BRD:** [docs/brd/xxx.md] | **Status:** Draft | **Author:** [name]
**Date:** [YYYY-MM-DD] | **Version:** 0.1

## Overview
Lead with the **problem**, then the solution. One sentence on the user problem
this solves (link to the BRD for the full statement rather than restating it),
then one sentence on what this feature does, for whom — phrased so a
non-technical stakeholder could repeat it back correctly.

## Goal (tied to BRD)
Which BRD goal/metric this feature moves, and how. If it doesn't clearly tie
back to one, that's worth flagging as an open question, not silently omitting.

## User Stories
- As a [user type], I want to [action], so that [outcome].

## User Flow
Step-by-step happy path. Use numbered steps, not a wall of prose:
1. User does X
2. System responds with Y
3. ...

## Functional Requirements
Numbered against the BRD where there's a direct link (BRD FR-2 → PRD FR-2.1):
- FR-2.1: [concrete, testable behavior]
- FR-2.2: ...

## UX / UI Requirements
- States to cover: empty, loading, error, success, partial data.
- Reference existing patterns/components used (name them) rather than
  describing new ones from scratch, unless this feature genuinely needs one.
- **Design / Prototype:** link to the confirmed `impeccable shape` design brief
  the coder builds against — inline it if compact (3–5 bullets), or save to
  `docs/design/<feature>.md` and link. `N/A` for backend-only features or UI
  fully covered by existing conventions / the project DESIGN.md.

## Non-Functional Requirements
Release requirements a prototype can't carry and the coder won't build (nor QA
verify) unless written down. Fill only what applies; otherwise `N/A — [why]`.
Pull the concrete bar from the repo's AGENTS.md, not generic "shall be fast and
secure" filler.
- **Performance:** measurable targets that matter here (e.g. "list renders
  <200ms for 1k rows", "endpoint p95 <300ms"), or `N/A — [why]`.
- **Security / authorization:** who may call/see this, authz rules, sensitive
  data handling, or `N/A — [why]`.
- **Accessibility:** keyboard nav, focus, labels/contrast for anything
  user-facing, or `N/A — [why]`.
- **i18n:** new user-facing strings needing translation keys — no hardcoded
  copy (see root AGENTS.md), or `N/A — [why]`.

## Analytics / Instrumentation
So the BRD's success metric is actually measurable and `qa` can verify the
outcome *moved*, not just that the feature renders. Name the event(s)/log(s) to
emit and the property/metric each feeds. If this is a table-stakes/compliance
feature with no measured outcome, write `N/A — [why]` rather than inventing an
event.
- [event name] — fired when [action], feeds [metric from BRD]

## Data & API Impact
From step 3's codebase research — what this feature touches technically:
- Existing endpoints reused: [method + path]
- New/changed endpoints needed: [method + path, one-line purpose]
- Data model changes: [new fields/tables, or "none"]
- **Rollout / rollback:** for risky changes only (schema migration, feature
  flag, backfill, phased release) — how it ships safely and how to undo it.
  Plain additive feature → `N/A`.

## Edge Cases & Error Handling
| Case | Expected behavior |
|------|--------------------|

## Out of Scope (for this PRD specifically)
What's deliberately excluded from this feature, even if it's tempting to bundle in.

## Acceptance Criteria
Testable checklist — someone should be able to verify each line without
guessing intent. Tag each line with the FR it verifies so QA coverage is
checkable (every FR should appear at least once):
- [ ] (FR-2.1) ...
- [ ] (FR-2.2) ...

## Dependencies
Other features, APIs, or teams this needs before it can ship.

## Assumptions
Things the coder will **proceed on** that could turn out wrong (e.g. "assuming
IDR-only", "assuming existing auth middleware covers this route"). State them so
a wrong one surfaces early instead of after implementation. Distinct from Open
Questions: assumptions don't block, they're just risky-if-wrong.

## Open Questions
Anything still unresolved that **blocks** or could change scope/UX meaningfully —
don't silently assume on these.

## References
Linked BRD, code files/patterns inspected during research (step 3).
```
