---
name: create-brd
description: Write a Business Requirements Document (BRD) for a software feature or project in this repo, saved as Markdown. Trigger only when the user explicitly asks to "buat BRD", "create a BRD", or "write a business requirements document" — do not trigger on generic requests like "document this feature" or "write a spec".
---

# Create BRD

Produces a BRD for a software feature/project as a Markdown file. The output is
only as good as the questions behind it — a BRD full of generic boilerplate
("the system shall be scalable and secure") is worse than no BRD at all, because
it gives false confidence. The point of this workflow is to ground the document
in the actual product/business context before asking the user anything, so the
questions you do ask are specific and few.

## Workflow

Do these in order. Don't skip straight to drafting — a BRD written from
assumptions is the failure mode this skill exists to avoid.

### 1. Establish the topic

Figure out what the BRD is for: feature/product name, one-line description of
what it does and who it's for. If the user already stated this when invoking
the skill, don't re-ask — confirm your understanding in one line and move on.

### 2. Research (always, before interviewing)

Invoke the `research` skill on the specific domain/topic (not "how to write a
BRD" — that's process, you already know it). Ask it to investigate: how
similar features/products are typically scoped, standard requirements or
compliance concerns for that domain, common pitfalls, what competitors do.
It runs as a background agent and saves findings to a Markdown file — read
that file before moving on to step 4.

This is what lets step 4 ask sharp questions instead of generic template
questions — e.g. for a "recurring transactions" feature, research surfaces
real edge cases (timezone handling, month-end dates like the 31st, failed
retries) that a generic interview would miss. Carry the research file's
sources into the BRD's References section.

### 3. Fold in any raw material

If the user already pasted notes, a meeting transcript, or a brief, treat it
as the seed content — extract what it already answers so you don't re-ask it.
If nothing was provided, skip this step (don't ask "do you have any notes?" as
a stalling question — just proceed to the interview).

### 4. Interview for what's still missing

Cross-reference the template in `references/brd-template.md` against what
research (step 2) and raw material (step 3) already cover. Ask the user
**only the gaps**, clearly, in one batch — not one question at a time, and
not a 20-question form. Typical gaps worth asking about explicitly:

- Business goal / success metric (what does "done" look like, numerically?)
- Scope boundary (what's explicitly OUT, not just what's in)
- Stakeholders/approvers
- Hard constraints (deadline, budget, regulatory)

If the research + raw material already answer something confidently, state
your assumption instead of asking ("Assuming this is IDR-only like the rest of
the app — flag if not") rather than making the user re-type context you
already have.

**Frame the success metric as an outcome, not an output.** An output is
something shipped ("the export button exists", "the endpoint is live"); an
outcome is a change in user behaviour or a business measure ("weekly active
exporters up 20%", "support tickets about X halved"). Push the user for the
outcome — the behaviour/metric whose movement proves the feature worked — not
just the deliverable. If the honest answer is "we just need this to exist"
(table-stakes / compliance), record that plainly rather than inventing a fake
metric. Where you can, tie the functional requirements' acceptance criteria
back to that metric so `qa` verifies the thing that actually matters.

### 5. Draft the BRD

Fill `references/brd-template.md`'s structure with the gathered content.
Write functional requirements as numbered, testable statements (FR-1, FR-2...),
not vague prose. Non-functional requirements should reflect this repo's actual
constraints (see root `AGENTS.md`) where relevant — e.g. i18n for user-facing
copy, mobile-first — rather than generic "shall be fast and secure" filler.

### 6. Save and iterate

Save to `docs/brd/<slug>.md` (kebab-case slug of the feature name; create the
folder if it doesn't exist). Show the user where it landed and ask directly:
"anything to change?" Revise in place — no need for a formal eval loop for
this kind of document; a BRD is judged by the person who has to act on it, not
by an automated assertion.

## Reference

- [BRD template](references/brd-template.md) — section-by-section structure to fill in step 5.

Once the BRD is approved, break each feature it covers into its own PRD with
the `create-prd` skill (`.agents/skills/create-prd/`).
