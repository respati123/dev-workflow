# BRD Template

Fill every section. If a section genuinely doesn't apply, write "N/A — [why]"
instead of deleting it, so the reader knows it was considered, not forgotten.

```markdown
# BRD: [Feature/Project Name]

**Status:** Draft | **Author:** [name] | **Date:** [YYYY-MM-DD] | **Version:** 0.1

## Executive Summary
2-3 sentences: what this is, who it's for, why it matters now.

## Background / Problem Statement
What's the current situation, and what's broken or missing about it? Cite
research from step 2 where it supports the problem (e.g. "competitor X handles
this via Y").

## Goals & Success Metrics
- Goal: [outcome]
  Metric: [number/threshold that proves it happened]
(A goal without a metric is a wish, not a requirement.)

## Scope
**In scope:**
- ...

**Out of scope:**
- ... (explicit exclusions — this is what prevents scope creep later)

## Stakeholders
| Role | Name/Team | Responsibility |
|------|-----------|-----------------|
| Sponsor | | approves scope/budget |
| Product | | owns requirements |
| Engineering | | implements |
| End users | | who actually uses this |

## Functional Requirements
Numbered, testable, one behavior each:
- FR-1: [The system shall ...]
- FR-2: ...

## Non-Functional Requirements
Only include ones that are actually load-bearing for this feature — pull from
this repo's real constraints (AGENTS.md), not a generic checklist:
- Performance: ...
- Security: ...
- i18n/localization: user-facing strings via translation keys, not hardcoded
- Accessibility / mobile-first: ...

## Assumptions & Constraints
- Assumption: [stated explicitly so it can be challenged]
- Constraint: [deadline, budget, regulatory, technical]

## Dependencies
What this needs from other teams/systems/features before it can ship.

## Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|

## Timeline & Milestones
Rough phases/dates if known — mark "TBD" rather than inventing a date.

## Open Questions
Anything still unresolved after the interview — don't silently guess on
things that materially change scope.

## References
Sources used during research (step 2) and any raw material (step 3) this BRD
was built from.
```
