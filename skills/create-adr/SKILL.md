---
name: create-adr
description: Write an Architecture Decision Record (ADR) capturing one architecturally significant, hard-to-reverse decision and its rationale, saved as a numbered Markdown file in docs/adr/. Trigger when the user explicitly asks to "buat ADR", "create an ADR", "record an architecture decision", or when the coder/techlead gate finds a decision that clears the significance bar — not on generic "document this" requests, and not for reversible/trivial choices.
---

# Create ADR

An ADR records **one** architecturally significant decision so a future
developer (or a fresh-context agent) understands *why the code is shaped this
way* — the rationale that a BRD (business why) and a PRD (feature what) don't
capture. It's a short, immutable Markdown file in `docs/adr/`, in version
control next to the code (Nygard).

## When to write one — the two-gate bar (check this FIRST)

Only write an ADR when the decision clears **both** gates. Most changes don't —
over-documenting is its own failure mode.

**Gate 1 — architecturally significant?** Does it affect **structure,
non-functional characteristics, dependencies, interfaces, or construction
techniques**? (Nygard)
- Structure — a module boundary, layering, service split, major pattern.
- Non-functional — a choice made *for* performance, security, scalability,
  reliability.
- Dependencies — adopting/rejecting a library, framework, datastore, service.
- Interfaces/contracts — an API shape or integration boundary others build on.
- Construction techniques — a cross-cutting convention future code must follow
  (auth strategy, error-handling model, migration approach).

**Gate 2 — a one-way door?** Is it costly to undo, and will a future developer
ask "why on earth is it done this way?" If you could change your mind in an
afternoon with a small diff, or the code is self-explanatory → **no ADR**.

**Does NOT deserve an ADR:** naming, loop style, a local refactor, adding a
field, anything already dictated by an existing convention/skill, or any choice
a single coder can reverse next week without coordinating. If it doesn't clear
both gates, **say so and stop** — don't manufacture an ADR.

## Workflow

### 1. Confirm it clears the bar

Run the two-gate check above against the decision. If it fails, tell the user
plainly why no ADR is warranted and stop — the same "stop and say so"
discipline `create-prd` uses when there's no BRD.

### 2. Assign the next number

Scan `docs/adr/` for the highest `NNNN` prefix and add one (zero-padded, e.g.
`0007`). Create `docs/adr/` if it doesn't exist. Numbers are sequential and
**never reused** (Nygard).

### 3. Fill the template and save

Fill `references/adr-template.md` and save to
`docs/adr/NNNN-<kebab-slug>.md` (slug = short noun phrase of the decision).
Write Context in value-neutral language (facts/forces, not judgments), the
Decision in active voice ("We will…"), and **all** Consequences — positive,
negative, and neutral. Keep the optional Considered Alternatives section out
unless the decision was genuinely contested and recording *why not the
alternatives* has value (else it's the "Sprint ADR" anti-pattern — one option,
rubber-stamped).

### 4. Superseding, never editing

ADRs are **immutable**. If this decision reverses an earlier one: create a
**new** file, set the old ADR's Status to `Superseded by ADR-NNNN`, and
reference the old number in the new Context. Never rewrite a past decision's
body — an ADR is a dated journal entry, not a live wiki page (Nygard).

## Reference

- [ADR template](references/adr-template.md) — the Nygard-light structure to
  fill in step 3.
- Full rationale, sources, and the significance bar: `docs/research-adr.md`.
