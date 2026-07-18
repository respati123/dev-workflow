# Research: Architecture Decision Records — and the "is this significant enough?" bar

Investigation against high-trust primary sources on what a good ADR contains,
and — the harder question — **when a decision is "architecturally significant"
enough to warrant one**. Sources: Michael Nygard's canonical 2011 post, the
adr.github.io community home, MADR, the ThoughtWorks Technology Radar entry,
Joel Parker Henderson's ADR catalog, Olaf Zimmermann (ozimmer.ch, co-author of
the Y-statement), and Jeff Bezos's 2016 shareholder letter for the
reversible-vs-irreversible decision frame. Each claim links the source that owns
it.

This is a companion to `docs/research-writing-prd.md` and
`docs/research-pm-skills.md` — same house style, same "what does this lean
AI-driven workflow actually need, and what is YAGNI" lens. A BRD/PRD captures
*what to build and why for the business*; an ADR captures *why the code is
shaped the way it is* — a different artifact for a different question, aimed at
future developers rather than stakeholders.

## TL;DR

**What an ADR is.** A short, immutable Markdown file capturing **one**
architecturally significant decision: the context/forces, the decision made,
and its consequences. It answers "why is the code shaped this way?" for a future
developer (or agent) who wasn't in the room. It lives in the repo next to the
code, in version control, so it stays in sync with what it explains.
[[Nygard]](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
[[ThoughtWorks]](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records)

**Recommended format for THIS project: Nygard-light** — Title, Status, Context,
Decision, Consequences. Five sections, one page. MADR's heavier template
(decision drivers, considered options, per-option pros/cons, confirmation) is
worth it only for a genuinely contested decision with real alternatives to weigh
— not the default. For an autonomous `coder` writing an ADR inline with a PR,
the minimal form is the right floor.
[[Nygard]](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
[[MADR]](https://adr.github.io/madr/)

### The "does this need an ADR?" checklist

Write an ADR when the decision clears **both** gates:

**Gate 1 — is it architecturally significant?** (Nygard's own heuristic: does it
affect **structure, non-functional characteristics, dependencies, interfaces, or
construction techniques**?)
[[Nygard]](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ ] **Structure** — a new module boundary, layering, service split, major
  pattern (event-driven vs. request/response, monolith vs. worker).
- [ ] **Non-functional characteristics** — a choice made *for* performance,
  security, scalability, or reliability (e.g. "we cache X because…", "we chose
  optimistic locking because…").
- [ ] **Dependencies** — adopting (or rejecting) a library, framework, database,
  or external service. "We picked Postgres over Mongo because…".
- [ ] **Interfaces / contracts** — an API shape, a public contract, an
  integration boundary others build against.
- [ ] **Construction techniques** — a cross-cutting convention future code must
  follow (auth strategy, error-handling model, migration approach).

**Gate 2 — is it a one-way door?** Reversible, trivial, self-contained,
single-developer choices do **not** get an ADR. [Bezos: "Many decisions are
reversible, two-way doors… so what if you're wrong?" — those use a
light-weight process, not a record.]
[[Bezos 2016]](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders)
[[Henderson: skip "tiny such as minimal-risk or self-contained or single-developer"]](https://github.com/joelparkerhenderson/architecture-decision-record)
- [ ] **Costly to undo?** Zimmermann's practical test: "ADs that are costly to
  undo simply cannot wait." If reversing it means a migration, a re-write, or
  breaking consumers → ADR. If you can change your mind in an afternoon with a
  small diff → no ADR.
  [[Zimmermann]](https://ozimmer.ch/practices/2023/04/03/ADRCreation.html)
- [ ] **Will a future developer ask "why on earth is it done this way?"** — the
  plain-language test [[Henderson: "when we want future developers to understand
  the 'why'"]](https://github.com/joelparkerhenderson/architecture-decision-record).
  If the code is self-explanatory, skip it.

**Does NOT deserve an ADR:** naming a variable, picking a loop style, a local
refactor, adding a field to an existing model, anything already dictated by an
existing convention/skill, or any choice a single coder can reverse next week
without coordinating. Over-documenting is its own anti-pattern — Zimmermann
names the **"Mega-ADR"** (stuffing architecture docs into ADRs) and the
**"Sprint" ADR** (one option, no real decision) as failure modes.
[[Zimmermann]](https://ozimmer.ch/practices/2023/04/03/ADRCreation.html)

### Ranked integration recommendation (one line)

Build a lean **`create-adr`** skill mirroring `create-prd` (Nygard-light
template), and wire the gate into the roles the same way the API-docs gate is
already wired: `coder` writes the ADR **in the same PR** when a decision clears
the bar, `techlead` treats a **missing ADR as BLOCKING** (exact mirror of the
Postman check), `scout` **reads `docs/adr/` during recon**, and
`setup-dev-workflow` Step 3 **scaffolds `docs/adr/`** as a parallel gap-offer.
Skip adr-tools, skip full-MADR-by-default, skip ADRs for reversible choices.
Full ranking at the bottom.

---

## 1. Michael Nygard — the canonical format

Nygard's 2011 post is the origin of the lightweight ADR. The format is **five
sections**, deliberately short:
[[cognitect.com/blog/2011/11/15]](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

- **Title** — "short noun phrases," e.g. "ADR 1: Deployment on Ruby on Rails
  3.0.10."
- **Status** — "proposed," "accepted," "deprecated," or "superseded" (with a
  reference to the replacement).
- **Context** — "the forces at play, including technological, political, social,
  and project local," in **value-neutral** language (facts, not judgments).
- **Decision** — the response "in full sentences, with active voice. 'We will
  …'".
- **Consequences** — "all consequences," explicitly "positive, negative, and
  neutral," affecting future development.

Key principles from the post:

- **Immutable — superseded, not edited.** "If a decision is reversed, we will
  keep the old one around, but mark it as superseded." The old ADR stays as
  historical context; a new ADR records the reversal. This is the single most
  important mechanical rule — an ADR is a dated journal entry, not a live wiki
  page.
- **Sequential numbering, never reused.** "ADRs will be numbered sequentially
  and monotonically. Numbers will not be reused."
- **One decision per file.** "One ADR describes one significant decision for a
  specific project."
- **The significance heuristic** (the money quote for Gate 1): ADRs record
  decisions "that affect the **structure, non-functional characteristics,
  dependencies, interfaces, or construction techniques**."
  [[Nygard]](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

## 2. adr.github.io — the community home

The community home frames an ADR as capturing "a single architectural decision
and its rationale," helping you "understand the reasons for a chosen
architectural decision, along with its trade-offs and consequences." It defines
an **Architecturally Significant Requirement (ASR)** as "a requirement that has
a **measurable effect** on the architecture and quality of a software and/or
hardware system." The "measurable effect" phrase is the crisp version of Gate 1.
[[adr.github.io]](https://adr.github.io/)

The org's stated goal is a common vocabulary and shared tooling around decision
management; it catalogs multiple templates (Nygard, Y-statement, MADR, and the
seven-template WICSA-2015 comparison) rather than mandating one.

## 3. MADR — the heavier option, and when it earns its weight

MADR (Markdown Any Decision Records) is the fuller template. Its sections:
[[adr.github.io/madr]](https://adr.github.io/madr/)

1. **Context and Problem Statement** — two or three sentences, free form.
2. **Decision Drivers** *(optional)* — the forces/concerns pushing the decision.
3. **Considered Options** — the alternatives evaluated.
4. **Decision Outcome** — "Chosen option: '{X}', because {justification}."
5. **Consequences** *(optional)* — good/bad/neutral results.
6. **Confirmation** *(optional)* — how compliance with the decision is verified.
7. **Pros and Cons of the Options** *(optional)* — per-option Good/Bad/Neutral.
8. **More Information** *(optional)* — evidence and links.

MADR 4.0.0 ships "bare" and "minimal" variants precisely because the full form
is often too much. Filename convention: `NNNN-title-with-dashes.md` (consecutive
number up to 9999). Status field: `proposed | rejected | accepted | deprecated |
… | superseded by ADR-0123`.
[[MADR]](https://adr.github.io/madr/)

**When MADR's fuller form is worth it vs. Nygard's minimal one:** MADR pays off
when the decision has **real, weighable alternatives** and the *comparison* is
the valuable artifact — "Postgres vs. Mongo vs. DynamoDB, here's the scoring."
Its Considered-Options + Pros/Cons structure captures the road not taken. For
the common case — a decision that's significant but not genuinely contested
("we'll use optimistic locking here, and here's why") — Nygard's Context/
Decision/Consequences says everything MADR would, with less ceremony. Default to
Nygard-light; reach for MADR-style options analysis only when a coder/techlead
actually needs to record *why not the alternatives*.

## 4. The "architecturally significant" bar — the WHEN question

This is the part teams get wrong in both directions (nothing recorded, or
everything recorded). The primary sources converge on a two-part test.

**Part A — significance (structure/NFR/deps/interfaces/construction).** Nygard's
five-way heuristic (§1) is the most-cited definition and maps cleanly to a
checklist. adr.github.io sharpens it: a **measurable effect** on architecture and
quality [[adr.github.io]](https://adr.github.io/). Zimmermann adds the severity
lens: "The level of this significance and the severity of the consequences of
the chosen solution (in terms of cost and risk) determine the importance and
urgency of the decision making and capturing."
[[Zimmermann]](https://ozimmer.ch/practices/2023/04/03/ADRCreation.html)

**Part B — irreversibility (the one-way door).** This is what separates
"significant" from "significant *and worth recording now*." Bezos's 2016 letter
is the canonical primary source for the reversible/irreversible frame: "Many
decisions are reversible, two-way doors. Those decisions can use a light-weight
process. For those, so what if you're wrong?" — the corollary being that one-way
(irreversible, consequential) decisions warrant deliberation and a record.
[[Bezos 2016]](https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders)
Zimmermann operationalizes it: "ADs that are costly to undo simply cannot wait."
[[Zimmermann]](https://ozimmer.ch/practices/2023/04/03/ADRCreation.html)

**What explicitly does NOT deserve an ADR.** Henderson is blunt: skip
"decisions that are not about architecture, or are tiny such as minimal-risk or
self-contained or single-developer." Write one only "when we want future
developers to understand the 'why' of what we're doing."
[[Henderson]](https://github.com/joelparkerhenderson/architecture-decision-record)
And the over-documentation anti-patterns to avoid: Zimmermann's **"Mega-ADR"**
(ADRs bloated into full architecture docs) and **"Sprint" ADR** (a rubber-stamp
with only one option considered — no real decision to record).
[[Zimmermann]](https://ozimmer.ch/practices/2023/04/03/ADRCreation.html)

*Note on ISO/IEC/IEEE 42010:* the standard governs *architecture description*
(views, viewpoints, correspondence, and — in the 2022 revision — recording
architecture decisions and rationale) but sits behind a paywall and defines a
conformance framework, not a practical "is this significant" checklist. The
usable, first-party heuristics are Nygard's five-way test and the
reversibility/severity lens above; 42010 is the formal umbrella they live under,
not a source that adds an actionable rule here.

## 5. Lifecycle & mechanics

- **Status lifecycle:** Proposed → Accepted, with Deprecated / Rejected /
  Superseded as terminal states. MADR's field encodes it directly (`proposed |
  rejected | accepted | deprecated | superseded by ADR-0123`)
  [[MADR]](https://adr.github.io/madr/); Nygard uses the same core set
  [[Nygard]](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).
- **Superseding links both ways.** "When an AD is made that replaces or
  invalidates a previous ADR, then a new ADR should be created" — the old one is
  marked `superseded by NNNN` and the new one references what it replaces.
  Immutability is the rule: don't rewrite history, append to it.
  [[Henderson]](https://github.com/joelparkerhenderson/architecture-decision-record)
- **One decision per file, sequential numbering** (§1).
- **Filename:** the dominant convention is `NNNN-title-with-dashes.md`
  (`0001-use-postgres.md`) — used by MADR and adr-tools. (Henderson's own repo
  favors verb-phrase names without numbers, e.g. `choose-database.md`, but the
  numbered form is the community default and gives natural chronological
  ordering — recommend it.)
  [[MADR]](https://adr.github.io/madr/)
- **Where they live:** `docs/adr/` is the most common; `doc/adr/` (adr-tools
  default) and `docs/decisions/` (MADR default) also seen. For this repo,
  **`docs/adr/`** parallels the existing `docs/postman/`, `docs/brd/`,
  `docs/prd/` convention exactly.
- **Version control, not a wiki.** ThoughtWorks: "store these details in source
  control, instead of a wiki or website… so they provide a record that remains
  in sync with the code itself."
  [[ThoughtWorks]](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records)
- **Tooling is OPTIONAL.** adr-tools (Nat Pryce) is a CLI for creating/linking
  ADRs, listed under "Tools" and "presented as optional tooling, not mandated."
  [[Henderson]](https://github.com/joelparkerhenderson/architecture-decision-record)
  ADRs are just Markdown files; a skill that writes the file needs no CLI.

## 6. ADRs in the PR / review workflow

ThoughtWorks recommends ADRs (a Radar "Adopt" technique) and version-controlling
them with the code, but the entry itself does **not** prescribe a code-review
gate.
[[ThoughtWorks]](https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records)
The "an architecturally significant PR must include an ADR" practice is a
**recognized emerging pattern rather than a single-owner canonical rule**: teams
enforce it by having reviewers (human or AI) flag architecturally significant
changes that lack a corresponding ADR, treating the ADR as part of the diff.
[[Shing Lyu: give the AI reviewer the ADRs as instructions so it "flags
violations automatically on every pull request"]](https://shinglyu.com/blog/2026/03/01/ai-adr-code-review.html)
AWS Prescriptive Guidance similarly documents an ADR *process* woven into
delivery.
[[AWS]](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html)

**This matters for the integration:** the gate isn't a Nygard-canonical
mandate, so it should be framed as *this project's* review convention — but it's
a well-supported one, and it maps **exactly** onto the API-docs gate this repo's
`techlead` already enforces (a PR that adds an endpoint without updating
`docs/postman/` is BLOCKING). Same shape: a significant change that omits its
required companion artifact fails review.

---

## 7. Integration design for this workflow

The bar for adding anything here is the same YAGNI bar `research-pm-skills.md`
and `research-writing-prd.md` used: does the lean, AI-driven pipeline actually
need it? ADRs clear the bar for one specific reason — the `coder` and `techlead`
run with **fresh, isolated context** and can't inherit the reasoning behind a
past structural choice from hallway memory. An ADR is the durable channel for
exactly that "why," and it's the one form of decision-rationale the current
pipeline has no home for (BRD = business why, PRD = feature what, Postman = API
contract; none capture "why is the code shaped this way").

### (a) New `create-adr` skill — mirroring `create-prd`

Structure it exactly like `create-brd`/`create-prd`: `SKILL.md` + a
`references/adr-template.md`, saving to a `docs/adr/` convention.

**Proposed frontmatter description** (mirrors create-prd's explicit-trigger
discipline — don't fire on generic "document this"):

> Write an Architecture Decision Record (ADR) capturing one architecturally
> significant, hard-to-reverse decision and its rationale, saved as a numbered
> Markdown file in `docs/adr/`. Trigger only when the user explicitly asks to
> "buat ADR", "create an ADR", "record an architecture decision", or when the
> `coder`/`techlead` gate determines a decision clears the significance bar — not
> on generic requests like "document this" or for reversible/trivial choices.

**Template section list (`references/adr-template.md`) — Nygard-light:**

- **Header:** `# ADR-NNNN: [short noun-phrase title]` + `Status:` /
  `Date:` / `Deciders:` line (mirrors the PRD template's metadata line).
- **Status** — Proposed | Accepted | Deprecated | Superseded by ADR-NNNN
  (one line).
- **Context** — the forces at play (technical/project), value-neutral. *Why is
  a decision needed here?* Link the driving PRD/issue if there is one.
- **Decision** — "We will …", active voice. The actual choice.
- **Consequences** — positive, negative, and neutral. What becomes easier, what
  becomes harder, what future work this constrains.
- *(Optional, MADR-style, include only when the decision is genuinely
  contested)* **Considered Alternatives** — the options weighed and why the
  chosen one won. Keep out of the default fill; add only when recording *why not
  the alternatives* has value.

**Skill workflow** (three short steps, matching the create-prd shape):
1. **Confirm it clears the bar** — run the two-gate checklist (§TL;DR). If it
   doesn't (reversible/trivial), say so and stop rather than manufacturing an
   ADR — the same "stop and say so" discipline create-prd uses when there's no
   BRD.
2. **Assign the next number** — scan `docs/adr/` for the highest `NNNN`, add
   one. Create `docs/adr/` if absent.
3. **Fill `references/adr-template.md`**, save to
   `docs/adr/NNNN-<kebab-slug>.md`. For a decision that *reverses* an earlier
   ADR: create a new file, set the old one's status to `Superseded by ADR-NNNN`,
   and reference the old number in the new Context — never edit the old
   decision's body (immutability, §5).

### (b) Exact wording-level changes to the roles

**`agents/coder.md`** — add a new numbered step after step 7 (the API-docs
step), same "in the same PR, blocked on by the techlead" shape:

> 8. **Made an architecturally significant decision?** If this change involved a
>    hard-to-reverse choice affecting structure, non-functional characteristics,
>    dependencies, interfaces, or construction techniques (see the two-gate
>    checklist), write an ADR with the `create-adr` skill and include it in the
>    **same PR** — the techlead blocks on a significant decision shipped without
>    one. Reversible/trivial/self-contained choices get **no** ADR; don't
>    manufacture them.

(Renumber the existing steps 8/9 to 9/10.)

**`agents/techlead.md`** — add a step 4, worded as a near-exact clone of the
existing step 3 API-docs check:

> 4. **ADR check**: if the diff makes an architecturally significant, hard-to-
>    reverse decision (new dependency/framework/datastore, a new module boundary
>    or service split, a public interface/contract, or a cross-cutting
>    construction technique) and no ADR is added or updated under `docs/adr/` in
>    the same PR, that is a **BLOCKING** finding. A local refactor, a new field,
>    or any reversible choice is **not** significant — do not demand an ADR for
>    those (over-documentation is its own failure mode).

(Renumber the following steps.)

**`agents/scout.md`** — extend the recon report contract. Add to the numbered
report list (e.g. as a new item 5, or fold into "Conventions"):

> 5. **Decisions** — check `docs/adr/` and surface any Accepted ADRs that
>    constrain the target area (a mandated datastore, an established pattern, a
>    rejected approach). Implementers must not re-litigate a settled decision or
>    unknowingly violate it; flag the relevant ADR numbers.

**`skills/setup-dev-workflow/SKILL.md`** — add `docs/adr/` as a parallel
gap-offer in Step 3, right after the `docs/postman/` item, and add it to the
Step 2 detection list and Step 5 report. Unlike Postman, an ADR folder isn't
backend-specific — **any** project can accrue architectural decisions — so it's
offered whenever there's real code (not gated on backend):

> - **`docs/adr/`** missing, and the project has real code → offer to scaffold
>   the directory with a seed `docs/adr/0000-record-architecture-decisions.md`
>   (the ADR that records *using ADRs*) — **recommend yes**: it costs nothing,
>   and `code-review-pr`/`techlead` treat a significant decision shipped without
>   an ADR as BLOCKING, so having the folder and numbering convention ready
>   avoids friction on the first significant PR. Mirror the `docs/postman/`
>   offer exactly.

### (c) What to SKIP — YAGNI, grounded

- **adr-tools (Nat Pryce CLI).** Optional even in the source that lists it
  [[Henderson]](https://github.com/joelparkerhenderson/architecture-decision-record).
  The `create-adr` skill writes a Markdown file and scans a folder for the next
  number — a CLI dependency buys nothing an agent can't do in two file
  operations. Skip.
- **Full MADR for every decision.** MADR itself ships "minimal"/"bare" variants
  because the full template is usually too much
  [[MADR]](https://adr.github.io/madr/). Default to Nygard-light; the
  Considered-Alternatives section stays optional, added only for genuinely
  contested decisions. Forcing options-analysis on every ADR is the "Sprint"
  anti-pattern (one option, rubber-stamped)
  [[Zimmermann]](https://ozimmer.ch/practices/2023/04/03/ADRCreation.html).
- **ADRs for reversible/trivial choices.** The entire point of Gate 2. An ADR
  per PR, or per library bump, produces archaeology no one reads and buries the
  handful that matter. Over-documentation (Mega-ADR) is an explicit anti-pattern
  [[Zimmermann]](https://ozimmer.ch/practices/2023/04/03/ADRCreation.html).
- **A separate status/approval ceremony.** ADRs are git-tracked Markdown
  reviewed in the same PR as the code — the PR *is* the approval. No sign-off
  matrix, no separate ADR review board. (Same call `research-writing-prd.md`
  made against metadata ceremony.)
- **Automated ADR-compliance linting / AI-reviewer-as-enforcer.** The emerging
  practice exists
  [[Shing Lyu]](https://shinglyu.com/blog/2026/03/01/ai-adr-code-review.html),
  but this workflow's `techlead` is *already* a fresh-context reviewer — the
  ADR gate is just one more line in its checklist, not a new tool. Revisit only
  if the ADR set grows large enough that manual review misses violations.

## 8. Ranked recommendations

1. **Build the `create-adr` skill (Nygard-light).** The one real new artifact.
   Mirrors `create-prd` structure exactly (SKILL.md + `references/adr-template.md`,
   saves to `docs/adr/NNNN-slug.md`). This is the piece with no current home in
   the pipeline — the "why is the code shaped this way" that fresh-context agents
   can't otherwise recover. Highest value.
2. **Wire the techlead ADR gate** (missing-ADR-for-significant-change =
   BLOCKING), mirroring the API-docs check. Cheap (one checklist line), and it's
   what makes the artifact actually get written instead of skipped — the
   enforcement lesson from §6 ("most teams fail at *enforcing* ADRs").
3. **Add the coder step** (write the ADR in the same PR when the bar is
   cleared). Pairs with #2 — the gate needs a producer.
4. **Add the scout recon line** (read `docs/adr/`, surface constraining
   decisions). Low cost, prevents re-litigating settled decisions — directly
   serves the fresh-context problem.
5. **Add the `docs/adr/` scaffold to setup-dev-workflow Step 3.** Parallels the
   `docs/postman/` gap-offer; seeds `0000-record-architecture-decisions.md`.
   Lowest urgency (the folder auto-creates on first ADR anyway) but keeps the
   setup skill's "fill every gap" promise consistent.

**Net:** ADRs fill a genuine hole — none of BRD/PRD/Postman captures
*implementation rationale* for the fresh-context coder/techlead/scout. The whole
integration is one new skill plus four one-to-few-line edits that reuse the
API-docs gate pattern already proven in this repo. Everything heavier (adr-tools,
full MADR by default, per-PR ADRs, compliance linting) is YAGNI and stays out.
The discipline that makes it work isn't the template — it's the **two-gate
"significant AND irreversible" bar** that keeps the ADR set small enough to stay
worth reading.

## Sources

- Michael Nygard, "Documenting Architecture Decisions" (2011): <https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions>
- ADR community home: <https://adr.github.io/>
- MADR (Markdown Any Decision Records): <https://adr.github.io/madr/>
- ThoughtWorks Technology Radar — Lightweight Architecture Decision Records: <https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records>
- Joel Parker Henderson, architecture-decision-record catalog: <https://github.com/joelparkerhenderson/architecture-decision-record>
- Olaf Zimmermann, "How to create ADRs — and how not to": <https://ozimmer.ch/practices/2023/04/03/ADRCreation.html>
- Jeff Bezos, 2016 Letter to Shareholders (one-way vs two-way door decisions): <https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders>
- Shing Lyu, "ADR in Code: Architecture Compliance with AI Code Reviews": <https://shinglyu.com/blog/2026/03/01/ai-adr-code-review.html>
- AWS Prescriptive Guidance — ADR process: <https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html>
</content>
</invoke>
