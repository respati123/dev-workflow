# ADR Template

Nygard-light: five sections, one page. Fill every section; keep it short.
Save as `docs/adr/NNNN-<kebab-slug>.md`.

```markdown
# ADR-NNNN: [short noun-phrase title, e.g. "Use PostgreSQL for the ledger"]

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-NNNN
**Date:** YYYY-MM-DD | **Deciders:** [who] | **Related:** [PRD/issue #, if any]

## Context
The forces at play — technical, project, constraints — in value-neutral
language (facts and forces, not judgments). Why is a decision needed here?
What makes this non-trivial and hard to reverse? Link the driving PRD/issue.

## Decision
The choice, in active voice and full sentences: "We will …". State what was
decided, not a discussion of options.

## Consequences
All of them — positive, negative, and neutral. What becomes easier, what
becomes harder, and what future work this constrains. Be honest about the
downsides; a decision with only upsides usually means the real trade-off wasn't
named.

<!-- Optional — include ONLY when the decision was genuinely contested and
recording "why not the alternatives" has lasting value. Omit otherwise. -->
## Considered Alternatives
- **[Option B]** — why it was weighed and why the chosen option won over it.
- **[Option C]** — …
```
