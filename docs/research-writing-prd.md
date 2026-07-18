# Research: How to write a genuinely good PRD

Investigation against high-trust primary sources on what a top-tier Product
Requirements Document contains, what the anti-patterns are, and how the modern
discovery-driven PRD differs from the old heavyweight spec. Sources: Amazon's
"Working Backwards" / PR-FAQ (aboutamazon.com + Bryar & Carr), Marty Cagan /
SVPG (svpg.com), Atlassian's product-management guidance (atlassian.com),
Lenny Rachitsky's published PRD template, and Intercom's RICE. Each claim links
the source that owns it.

This is a companion to `docs/research-writing-issues.md` (which already covered
INVEST + Given/When/Then for the *tickets* a PRD becomes) — so this file focuses
on the **PRD document itself** and does not re-derive user-story mechanics.

## TL;DR

### The essential-PRD checklist (consensus across sources)

A good modern PRD is **lean, living, problem-first, and outcome-framed** — one
level more concrete than a BRD, but not a 50-page waterfall spec. Consensus-
essential sections:

- [ ] **Problem / context, stated before the solution** — who it's for, what
  pain, what evidence. Problem-first is the single most emphasized rule. [Lenny, Amazon]
- [ ] **Goal + success metric as an outcome, not an output** — the number that
  proves it worked, not "the button exists." [Atlassian, Amazon internal-FAQ]
- [ ] **User stories** (As a / I want / so that), often tabular with per-story
  success metric. [Atlassian]
- [ ] **The solution / user experience** — flows and UX; for human teams this is
  increasingly a high-fidelity prototype rather than prose. [Cagan]
- [ ] **Scope: explicit "Not Doing" / out-of-scope.** [Atlassian, Lenny]
- [ ] **Functional requirements** — concrete, testable behaviors. [all]
- [ ] **Non-functional / release requirements** — reliability, performance,
  scalability, security — kept *in writing* because a prototype can't carry
  them. [Cagan]
- [ ] **Assumptions + open questions** — what's still unresolved. [Atlassian]
- [ ] **Living-document discipline** — updated as you learn, links for
  progressive disclosure, not frozen upfront. [Atlassian]

Situational (add only when the feature warrants it): analytics/instrumentation,
rollout/rollback plan, dependencies, personas.

### Top gaps in this project's `create-prd`

The template (`skills/create-prd/prd-template.md`) is already strong: it has
Overview, Goal-tied-to-BRD, User Stories, User Flow, FR (BRD-numbered), UX
states, Data/API impact, Edge Cases, Out-of-Scope, FR-tagged Acceptance
Criteria, Dependencies, Open Questions. Grounded in the sources and the
AI-coder/qa lens, the concrete gaps are:

1. **No explicit non-functional requirements section** (perf/security/a11y;
   i18n is buried under UX). This is the biggest gap — Cagan is explicit that
   release requirements belong *in writing*, and an autonomous `coder` won't
   build, nor `qa` verify, an NFR that isn't stated.
2. **No analytics / instrumentation** — the BRD now frames an outcome metric,
   but nothing tells the coder what events to emit so that outcome is
   measurable and `qa`/`to-qa` can verify the metric moved, not just that the
   feature exists.
3. **Overview is solution-first** — it opens with "what this feature does"
   rather than the problem. Cheap to reframe problem-first.
4. **No rollout/rollback note** for risky changes (migrations, flags) —
   situational, add as one optional line, not a mandatory section.

And, deliberately, several heavyweight PRD sections should be **skipped as
YAGNI** for this workflow (PR-FAQ, prototype-as-spec, personas/TAM/GTM,
in-PRD prioritization) — grounded below.

---

## 1. Amazon "Working Backwards" / PR-FAQ

Amazon vets most major products since 2004 with **Working Backwards**: "start by
defining the customer experience, then iteratively work backwards from that
point until the team achieves clarity of thought around what to build."
Source: <https://www.aboutamazon.com/news/workplace/an-insider-look-at-amazons-culture-and-processes>

The artifact is the **PR-FAQ**:

- **Press Release (PR)** — "a few paragraphs, always under one page," describing
  the highlights of the customer experience and answering "Why will this new
  product be compelling enough for customers to take action and buy it?" [aboutamazon]
- **FAQ** — "five pages or less," giving the salient details *and* "a clear-eyed
  and thorough assessment of how expensive and challenging it will be for the
  company to build the product." [aboutamazon] In practice the FAQ splits into an
  **external FAQ** (pricing, availability, comparison to alternatives) and an
  **internal FAQ** (bill of materials, success metrics, go-to-market, resource
  requirements). Source: <https://commoncog.com/putting-amazons-pr-faq-to-practice/>

The core value is a **perspective shift**: "The primary point of the process is
to shift from an internal/company perspective to a customer perspective" — the
press-release format "ruthlessly forces you to reason from the perspective of a
customer," and "If the press release doesn't describe a product that is
meaningfully better ... than what is already out there ... then it isn't worth
building." [aboutamazon, commoncog] The five questions it forces: who is the
customer, what problem, what's the solution (explained to customers not
engineers), would customers actually adopt it, is the market big enough.
[commoncog]

**Relevance here:** the PR-FAQ is a *discovery / should-we-build-this* artifact
that sits **upstream of a spec** — its job is to kill bad ideas before anyone
writes requirements. In this repo that job is already owned by `create-brd`
(customer + outcome metric) plus the optional `grilling`/`prototype` value
checks. It is **not** something to bolt onto the per-feature PRD (see §8, Skip).

## 2. Marty Cagan / SVPG — prototype over heavy spec

Cagan's central argument: **the spec should mostly be a high-fidelity
prototype, not a document.** "Rather than spend weeks working on a 50-page Word
document that few will read and is impossible to test ... the majority of the
product spec should be the high-fidelity prototype, representing the functional
requirements, the information architecture, the interaction design, and the
visual design."
Source: <https://www.svpg.com/revisiting-the-product-spec/>

The **assumption test**: unlike paper, a prototype "can be put in front of
actual target users" to test **usability** (can they figure it out) and
**desirability** (do they care). "You don't actually have a spec worth handing
over to engineering until your prototype passes these two tests." Big upfront
specs are dangerous precisely because they lock in an *unvalidated* solution:
flawed requirements reach engineering, and the team either reworks endlessly or
ships something that misses. [svpg.com/revisiting-the-product-spec]

Crucially for our purposes, Cagan keeps **some writing** — and names exactly
what a prototype *cannot* carry: "release requirements (e.g. reliability,
performance, scalability) or platform delivery requirements" and use-case
narratives live in a lightweight wiki alongside the prototype. The prototype "is
not meant to be production quality software (reliable, maintainable, scalable,
fault-tolerant)."
Sources: <https://www.svpg.com/revisiting-the-product-spec/>,
<https://www.svpg.com/high-fidelity-prototypes/>

**Relevance here:** this is the key nuance for an AI workflow. Cagan's
"prototype > spec" is advice for **human** teams doing discovery — a prototype
is superior *for validating with users and for a human eng team to build
from*. But an autonomous `coder` agent cannot consume a Figma prototype the way
a human engineer can; it needs concrete, FR-numbered, testable text. So in this
workflow the **concrete PRD is genuinely more valuable than a prototype** — the
opposite of Cagan's default — while his warning still binds: **don't
over-specify implementation, keep it outcome-framed, and put the
non-functional/release requirements in writing** (which is exactly the gap in
create-prd, §7). Prototyping stays what it already is in `agents/pm.md`: an
*optional* usability check for genuinely uncertain flows.

## 3. Atlassian — lean, living PRD

Atlassian's recommended one-page PRD has **eight components**: (1) Document
Properties / metadata (owner, stakeholders, status, target release), (2) Overall
Goals, (3) Background & Strategic Fit, (4) Assumptions, (5) User Stories
(tabular, with per-story success metrics), (6) User Interaction & Design
(embedded or linked), (7) Questions (open decisions), (8) **Not Doing**
(explicit out-of-scope).
Source: <https://www.atlassian.com/blog/2013/07/agile-requirements-documentation-a-guide>
(structure also summarized at
<https://www.atlassian.com/agile/product-management/requirements>)

Their stance is explicitly **anti-heavyweight**: "Be agile about your
documentation! You don't have to follow a format every time — do what you need,
when you need it." The PRD is a **living document** updated throughout
development, using **embedded links for progressive disclosure** — "abstract out
the complexity and progressively disclose information to the reader as needed"
rather than inlining every detail. The anti-pattern they name: documentation
"becoming stale post-implementation without updates."
[atlassian.com/blog/2013/07/agile-requirements-documentation-a-guide]

Two Atlassian details worth stealing: **Assumptions** as a first-class section,
and **per-story success metrics** in the user-story table (not just one global
metric).

## 4. Lenny Rachitsky / practitioner templates + Intercom RICE

Lenny Rachitsky's widely-used PRD template is aggressively **problem-first and
short**. Its published sections: **Description** ("what is it?"), **Problem**
("what problem is this solving?"), **Why** ("how do we know this is a real
problem and worth solving?"), **Success** ("how do we know if we've solved
it?"), **Audience** ("who are we building for?"), **What** ("what does this look
like in the product?").
Source: <https://www.atlassian.com/software/confluence/templates/lennys-product-requirements>

The animating idea: "Nailing the problem statement is the single most important
step in solving any problem ... when done well it's a superpower of the best
leaders." Modern startup PRDs in this vein run **1–3 pages**, separating problem
understanding from solution design, with success metric, out-of-scope, and open
questions.
Source: <https://www.lennysnewsletter.com/p/prds-1-pagers-examples> (post itself
paywalled; sections summarized via the published Confluence template above and
<https://www.startups.com/lexicon/product-requirements-document>)

**Intercom RICE** (how top teams decide *what* to spec before writing a PRD):
score = **(Reach × Impact × Confidence) ÷ Effort**. Reach = people affected per
time period; Impact = per-person effect on a 3/2/1/0.5/0.25 scale; Confidence =
100/80/50% to temper "unvalidated ideas"; Effort = person-months. "RICE scores
shouldn't be used as a hard and fast rule."
Source: <https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/>

**Relevance here:** RICE is prioritization, and this repo already has a
dedicated `prioritize` skill (RICE/MoSCoW/Kano) that runs between `create-brd`
and `to-tickets`. So prioritization belongs *there*, not inside the PRD (§8).

## 5. Essential PRD sections — synthesized

| Section | Consensus? | Owning source(s) |
|---|---|---|
| Problem / context (before solution) | **Essential** | Lenny, Amazon |
| Goal + success metric (outcome, not output) | **Essential** | Atlassian, Amazon internal-FAQ |
| User stories (As a / I want / so that) | **Essential** | Atlassian |
| Solution / UX + flows (prototype for human teams) | **Essential** | Cagan, Atlassian |
| Functional requirements (concrete, testable) | **Essential** | all |
| Scope: explicit out-of-scope / "Not Doing" | **Essential** | Atlassian, Lenny |
| Non-functional / release requirements | **Essential** (in writing) | Cagan |
| Assumptions | Common | Atlassian |
| Open questions | Common | Atlassian, Lenny |
| Dependencies | Situational | Atlassian (links) |
| Analytics / instrumentation | Situational | Atlassian (per-story metrics), Amazon internal-FAQ |
| Rollout / rollback / release plan | Situational | Amazon internal-FAQ (GTM) |
| Personas / TAM / GTM / competitive | Discovery-stage, **not** per-feature PRD | Amazon (PR-FAQ), belongs upstream |

## 6. Anti-patterns (with sources)

- **The 50-page spec nobody reads and can't be tested** — Cagan's canonical
  target; a document that "few will read and is impossible to test."
  [svpg.com/revisiting-the-product-spec]
- **Big-bang spec frozen upfront and never updated** — Atlassian names stale
  post-implementation docs as the failure mode; the fix is the living document.
  [atlassian.com/blog/2013/07]
- **Solution-first / no problem statement** — Lenny ("nailing the problem
  statement is the single most important step") and Amazon (start from the
  customer, not the feature). [Lenny, aboutamazon]
- **Output instead of outcome** — a spec whose success is "the endpoint is
  live" rather than a behavior/metric change; Amazon's internal-FAQ demands
  success metrics, and this repo's `create-brd` already encodes the
  output-vs-outcome distinction.
- **Requirements that dictate implementation instead of outcome** — Cagan's
  whole point; over-specified solutions lock in unvalidated decisions.
  [svpg.com/revisiting-the-product-spec]
- **No explicit out-of-scope** — Atlassian makes "Not Doing" a required section
  "for team focus." [atlassian.com/blog/2013/07]
- **Untestable / vague requirements** — covered in depth in
  `docs/research-writing-issues.md` (INVEST-Testable, Given/When/Then); not
  re-derived here.

## 7. Modern vs. old, and the AI-workflow twist

**Old (waterfall):** a heavyweight spec written once, thrown over the wall to
engineering, output-framed, never revisited — Cagan's "50-page Word document."

**Modern (discovery-driven):** lean (1–3 pages, Lenny), **living** (updated as
you learn, Atlassian), **problem-first** (Lenny, Amazon), **outcome-framed**
(success metric, Atlassian), and for human teams **paired with a validated
prototype** rather than replaced by prose (Cagan).

**The twist for this repo:** the PRD is consumed by an autonomous `coder` and
verified by a `qa` agent. "Lean and living" must **not** collapse into "vague" —
a machine can't fill gaps from hallway context the way a human team can. So the
right target here is a **concrete, FR-numbered, testable PRD** (which create-prd
already produces) that stays **outcome-framed and avoids over-specifying
implementation** (Cagan's discipline) — plus the pieces a prototype/human team
would normally carry implicitly but a coder needs spelled out: **non-functional
requirements** and **instrumentation**. The heavyweight discovery apparatus
(PR-FAQ, personas, TAM) stays upstream where the BRD and optional
grilling/prototype already handle it.

## 8. `create-prd`: what it has vs. what's missing

| Source-backed section | In create-prd today? | Notes |
|---|---|---|
| Problem-first framing | Partial | "Overview" leads with *what it does* (solution), not the problem. BRD owns the problem, so a one-line problem restatement is enough. |
| Goal + outcome metric | Yes | "Goal (tied to BRD)" — good; leans on BRD's outcome framing. |
| User stories | Yes | "As a / I want / so that." |
| User flow / UX | Yes | Numbered happy path + UX states (empty/loading/error/success/partial). Strong. |
| Functional requirements (FR-numbered) | Yes | BRD-linked FR numbering — a genuine strength for `qa` traceability. |
| Out-of-scope | Yes | "Out of Scope (for this PRD specifically)." Matches Atlassian "Not Doing." |
| Acceptance criteria (testable, FR-tagged) | Yes | Best-in-class for the coder/qa loop. |
| Data & API impact | Yes | Not a classic PRD section, but correct and valuable for a coder. |
| Edge cases | Yes | Table. Good. |
| Dependencies | Yes | Present. |
| Open questions | Yes | Present. |
| **Non-functional / release requirements** | **No** | Only i18n, buried under UX. Cagan says these belong in writing; coder/qa can't build/verify unstated perf/security/a11y. **Top gap.** |
| **Analytics / instrumentation** | **No** | Nothing emits the events that make the BRD outcome metric measurable/verifiable. |
| **Rollout / rollback** | **No** | Absent; matters for migrations/flags. Situational. |
| Assumptions | Partial | Folded into Open Questions; Atlassian keeps it separate. Minor. |

## 9. Ranked recommendations

### ADD to create-prd (highest value first)

1. **A Non-Functional Requirements section.** Consolidate the existing i18n
   line and add performance, security/authorization, and accessibility — each
   filled *only when it applies*, else `N/A — [why]` (the template already uses
   this convention). Pull the concrete bar from the repo's `AGENTS.md` (i18n,
   mobile-first) rather than generic "shall be fast and secure" filler — the
   exact anti-pattern `create-brd` already warns against. **Why #1:** Cagan is
   explicit that release requirements (reliability/performance/scalability) must
   be written, not prototyped
   [svpg.com/revisiting-the-product-spec]; an autonomous coder builds only what's
   stated and `qa` verifies only what's stated.

2. **An Analytics / Instrumentation line** (situational, but cheap). When the
   BRD success metric is a real outcome, name the event(s)/log(s) the feature
   must emit so the metric is measurable and `to-qa` can verify the outcome
   moved — not just that the button renders. Skip explicitly for
   table-stakes/compliance features with no measured outcome (mirroring the
   BRD skill's "record that plainly rather than inventing a fake metric").
   Grounds: Atlassian's per-story success metrics + Amazon internal-FAQ.

3. **Reframe "Overview" to lead with the problem**, then the solution — one
   sentence of customer problem before "what this feature does." Nearly free,
   and aligns with the most-emphasized rule across Lenny and Amazon. Keep it to
   one line since the BRD already owns the full problem statement (progressive
   disclosure, Atlassian-style — link to the BRD rather than restating it).

4. **An optional Rollout / Rollback line** for risky changes only (schema
   migration, feature flag, phased release, backfill). Not a mandatory section —
   add it to the Dependencies or Data/API area as "how this ships safely," and
   write `N/A` for a plain additive feature. Grounds: Amazon internal-FAQ
   (go-to-market / cost-and-challenge assessment).

5. **Promote Assumptions to its own line** (split from Open Questions):
   assumptions the coder *will proceed on* that could be wrong, vs. questions
   that block. Minor clarity win from Atlassian's structure.

### LEVERAGE existing skills (don't duplicate in the PRD)

- **Prioritization → `prioritize` skill.** RICE/MoSCoW/Kano already live in a
  dedicated skill that runs between `create-brd` and `to-tickets`
  (`agents/pm.md`). Keep RICE *out* of the PRD. [Intercom RICE is prioritization,
  not spec content.]
- **Value / assumption check → `grilling` + `prototype`.** These optional pm
  skills are the cheap stand-in for Cagan's assumption test and Amazon's
  "is-this-worth-building" gate. So the PRD does **not** need to carry a PR-FAQ
  or a desirability argument — that's already handled upstream.
- **Testable acceptance criteria → issue conventions.** `to-tickets` + `pm.md`
  already enforce INVEST + Given/When/Then (see `docs/research-writing-issues.md`).
  The PRD's FR-tagged acceptance criteria feed straight into that — no change.

### SKIP deliberately (YAGNI for this workflow), grounded

- **A PR-FAQ / press release inside the PRD.** Amazon's own framing puts the
  PR-FAQ *upstream of the spec* as a should-we-build-it vetting tool
  [aboutamazon]; the BRD + grilling already own that gate. Adding a press release
  to a per-feature PRD is ceremony the coder can't use.
- **Prototype-as-the-spec.** Cagan's model targets human eng teams doing user
  discovery; an autonomous coder needs concrete FR text, not a Figma file. Keep
  prototyping the *optional* usability check it already is in `pm.md`. This is a
  deliberate inversion of Cagan's default, justified by the consumer being a
  machine.
- **Personas, TAM/market sizing, GTM, competitive analysis.** Discovery-stage
  content (Amazon PR-FAQ, BRD scope) — irrelevant to building one feature.
- **Metadata ceremony** (approver matrices, sign-off tables, target-release
  fields). Atlassian lists document-properties, but this workflow's PRDs are
  git-tracked Markdown reviewed by the person implementing them; status/version
  already exist in the template. Don't expand it.

**Net:** create-prd is already well past the primary-source floor for a
*document* (problem-adjacent overview, outcome goal, testable FR-numbered
criteria, explicit out-of-scope, edge cases). The two highest-value additions
are a **Non-Functional Requirements section** and an **Analytics/instrumentation
line** — precisely the things a prototype or a co-located human team would carry
implicitly, but an autonomous coder/qa pair needs written down. Everything
heavier (PR-FAQ, prototype-as-spec, personas, prioritization) is already handled
upstream or by a sibling skill, and should stay out.

## Sources

- Amazon Working Backwards / PR-FAQ: <https://www.aboutamazon.com/news/workplace/an-insider-look-at-amazons-culture-and-processes>, <https://commoncog.com/putting-amazons-pr-faq-to-practice/> (Bryar & Carr, *Working Backwards*)
- Marty Cagan / SVPG: <https://www.svpg.com/revisiting-the-product-spec/>, <https://www.svpg.com/high-fidelity-prototypes/>
- Atlassian: <https://www.atlassian.com/agile/product-management/requirements>, <https://www.atlassian.com/blog/2013/07/agile-requirements-documentation-a-guide>
- Lenny Rachitsky: <https://www.atlassian.com/software/confluence/templates/lennys-product-requirements>, <https://www.lennysnewsletter.com/p/prds-1-pagers-examples>
- Intercom RICE: <https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/>
