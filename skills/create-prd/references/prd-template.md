# PRD Template

Fill every section. If something genuinely doesn't apply, write
"N/A — [why]" instead of deleting it.

```markdown
# PRD: [Feature Name]

**Linked BRD:** [docs/brd/xxx.md] | **Status:** Draft | **Author:** [name]
**Date:** [YYYY-MM-DD] | **Version:** 0.1

## Overview
One paragraph: what this feature does, for whom, in one sentence a non-technical
stakeholder could repeat back correctly.

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
- i18n: list any new user-facing strings that need translation keys (no
  hardcoded copy — see root AGENTS.md).

## Data & API Impact
From step 3's codebase research — what this feature touches technically:
- Existing endpoints reused: [method + path]
- New/changed endpoints needed: [method + path, one-line purpose]
- Data model changes: [new fields/tables, or "none"]

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

## Open Questions
Anything still unresolved — don't silently assume on things that change scope
or UX meaningfully.

## References
Linked BRD, code files/patterns inspected during research (step 3).
```
