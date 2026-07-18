# Research: Core PM competencies vs. what the `pm` role is missing

Investigation against high-trust primary sources — Marty Cagan / Silicon Valley
Product Group, Teresa Torres (Product Talk), Intercom (RICE originator), the
Agile Business Consortium / DSDM (MoSCoW originator), Noriaki Kano's model,
John Doerr / What Matters (OKRs), Aha! and Amplitude. Each claim links the
source that owns it. The point is not "make the `pm` role do everything a
staff PM does" — it's to find the gaps that actually matter for a small
AI-driven dev workflow, and flag where the current lean setup is already right.

## TL;DR

**The core PM competency areas** (Cagan's framing, which the others slot into):

1. **Deep knowledge in four areas** — customer, data, business, industry — so
   decisions aren't guesses. [Cagan/SVPG]
2. **Owning value + business-viability risk** as one of the "four big risks"
   (value, usability, feasibility, viability). [Cagan/SVPG]
3. **Product discovery** — validating those risks *before* committing to build,
   via assumption/hypothesis testing, prototypes, and continuous customer
   contact (opportunity solution trees, dual-track agile). [Torres]
4. **Prioritization** — deciding what to build first and what to cut (RICE,
   MoSCoW, Kano, value/effort). [Intercom, Agile Business Consortium, Kano]
5. **Outcomes over outputs** — tying work to a measurable result, not a feature
   count (OKRs, north-star metric, success metrics). [What Matters, Amplitude]
6. **Roadmapping & stakeholder communication** — strategy → roadmap → spec
   layering, organized by goals/themes not feature lists. [Aha!]
7. **Requirements artifacts** — BRD/PRD/user stories/acceptance criteria, which
   in the modern view are lighter and *follow* discovery rather than replace it.

**Top gaps in this project's `pm` role**, ranked by how real the gap is:

1. **No prioritization step at all.** The role goes idea → BRD → PRD → tickets,
   taking scope and ordering as given. There is no mechanism to rank features,
   decide what *not* to build, or sequence backend/frontend by value. This is
   the single biggest real gap.
2. **No explicit value/assumption validation before writing a full PRD.** The
   role writes the solution (BRD→PRD) straight from the idea; it never asks "is
   this the right problem / will anyone use it" (Cagan's value risk) with any
   structure. Partly mitigated because a human supplies the intent.
3. **Outcome/success-metric definition is present but weak.** `create-brd` asks
   for a numeric success metric, but nothing enforces outcome-over-output
   framing or a north-star link. Low-severity — the hook exists.
4. **No multi-feature roadmap / sequencing.** The role is one-feature-at-a-time
   by design. For a small workflow this is a *deliberate and correct*
   omission, not a gap to fix.

**Recommendation in one line:** create one new **`prioritize`** skill (RICE /
MoSCoW / Kano / value-vs-effort) and have `pm` optionally load the *existing*
global **`grilling`** and **`prototype`** skills to cover discovery cheaply —
rather than building a heavy new "product-discovery" skill. Everything else is
either already covered or correctly out of scope. Full ranking at the bottom.

---

## 1. What a PM actually does — core responsibilities & competencies

**Cagan / SVPG** is the highest-trust originator source for the modern view.
The PM is "explicitly responsible for ensuring both **value and viability**",
and on empowered teams is "an **individual contributor**", *not* a project
coordinator executing predetermined work. Without deep knowledge, "the product
manager is just guessing."
([svpg.com/the-product-manager-contribution](https://www.svpg.com/the-product-manager-contribution/))

Cagan's **four critical areas of deep knowledge** a PM must personally own
(cannot be delegated):

1. **Customers and users** — qualitative *and* quantitative; the PM is "the
   acknowledged expert on the customer."
2. **Data** — how the product is actually used (analytics), sales data, and how
   it changes over time.
3. **Business** — go-to-market, stakeholder needs, business model (how you make
   money), ecosystem, product economics.
4. **Industry** — competitors plus trends in technology, customer behavior and
   expectations.
([svpg.com — four critical areas](https://www.svpg.com/the-product-manager-contribution/),
summarized at [productbenny substack](https://productbenny.substack.com/p/marty-cagan-the-four-critical-areas))

**Modern (discovery/outcome) view vs. old (spec-and-hand-off) view.** Cagan is
emphatic the PM role "is **not a project manager role**" and is "absolutely
distinct from the other disciplines"; the failure mode he names is a PM who
merely organizes feature requests into a backlog on a "feature team," where
managers "become mere project coordinators executing predetermined work."
([svpg.com/behind-every-great-product](https://www.svpg.com/behind-every-great-product/),
[the-product-manager-contribution](https://www.svpg.com/the-product-manager-contribution/))
The modern PM is closest to a **CEO of the product** — strategic across
functions — with the difference that "unlike the CEO, nobody reports to the
product manager."

> **Implication for this project:** the `pm` role today is essentially the
> *old* model — it takes an idea and produces specs + tickets. That's a
> reasonable division of labor for an AI coding workflow (the human is the de
> facto product owner supplying the customer/business knowledge Cagan says the
> PM must own). The gaps below are about the few discovery/prioritization
> reflexes worth adding *without* turning `pm` into a full staff PM.

## 2. Product discovery

Cagan's **four big risks** — the checklist a team should tackle *early*:

- **Value risk** — "whether customers will buy it or users will choose to use
  it." The **PM is accountable** for this.
- **Usability risk** — "whether users can figure out how to use it." The
  designer owns it.
- **Feasibility risk** — "whether our engineers can build what we need with the
  time, skills and technology we have." Engineering owns it.
- **Business-viability risk** — "whether this solution also works for the
  various aspects of our business" (go-to-market, legal, economics, brand).
  The **PM** owns it alongside value.
([svpg.com/four-big-risks](https://www.svpg.com/four-big-risks/))

**Teresa Torres — continuous discovery & the opportunity solution tree.** The
tree has four layers: a **desired outcome** (a measure of customer behavior,
the business value) → **opportunities** ("unmet customer needs, pain points,
and desires") → **solutions** → **assumption tests** (experiments that evaluate
which solutions actually create value). Discovery is *continuous*: story-based
customer interviews "week over week," revisiting the opportunity space "every
three to four customer interviews."
([producttalk.org/opportunity-solution-tree](https://www.producttalk.org/opportunity-solution-tree/))
This is the "dual-track agile" idea — a discovery track (validate what to
build) running alongside a delivery track (build it).

> **Implication:** the modern view says *validate value/usability with cheap
> assumption tests and prototypes before writing the full spec*. This project
> jumps idea → BRD → PRD. A full discovery apparatus is overkill for a
> coding workflow, but the cheap parts (stress-test the assumptions; prototype
> when usability is uncertain) are worth wiring in — and the global skill
> library already has them (`grilling`, `prototype`, `shape`, `brainstorming`).

## 3. Prioritization frameworks

The role currently has **no** prioritization step. The authoritative options:

- **RICE (originator: Intercom).** Score = **(Reach × Impact × Confidence) ÷
  Effort**. Reach = how many people, in a fixed period; Impact = per-person
  effect on a fixed scale (massive 3× / high 2× / medium 1× / low 0.5× /
  minimal 0.25×); Confidence = % (100/80/50) to temper guesses; Effort =
  person-months. Produces "total impact per time worked." Best for comparing
  disparate ideas consistently — but not applied rigidly (dependencies /
  strategy / table-stakes can override).
  ([intercom.com/blog/rice-…](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/))
- **MoSCoW (originator: DSDM / Agile Business Consortium).** Must / Should /
  Could / Won't-have-this-time. "Must" = the Minimum Usable SubseT — if it
  isn't delivered "there would be no point deploying the solution." DSDM
  recommends **no more than ~60% of effort on Must, ~20% on Could** as
  contingency. Best when time/scope is fixed and you need a deliverable
  minimum.
  ([agilebusiness.org — MoSCoW](https://www.agilebusiness.org/dsdm-project-framework/moscow-prioritisation.html))
- **Kano model (Noriaki Kano, 1984).** Classifies features by how they move
  customer satisfaction vs. investment: **Basic/threshold** (absence causes
  dissatisfaction, presence doesn't delight), **Performance/one-dimensional**
  (linear satisfaction with investment), **Attractive/delighters**
  (disproportionate delight, unmissed if absent), plus **Indifferent** and
  **Reverse/dissatisfaction**. Best for deciding the mix of must-haves vs.
  delighters.
  ([productplan.com/glossary/kano-model](https://www.productplan.com/glossary/kano-model/))
- **Value vs. Effort / Weighted Scoring** — the lightweight 2×2 and its scored
  generalization; fastest when you just need a rough sequence.

**When to use which:** RICE for ranking many disparate ideas by ROI; MoSCoW for
carving a fixed-scope release into a minimum shippable set; Kano for balancing
table-stakes against delight; value/effort for a quick first cut. For *this*
project's scale, value/effort + MoSCoW (what's the Must-have slice) are the two
that pay off; RICE is the natural "compare features" tool if a BRD bundles
several.

## 4. Goal-setting / outcomes

- **OKRs (originator: Andy Grove @ Intel; brought to Google by John Doerr).**
  Objective = "what is to be achieved… significant, concrete, action oriented,
  and (ideally) inspirational." Key Results = "specific, time-bound, and
  aggressive yet realistic" measures — "you either meet a Key Result's
  requirements or you don't." Doerr's formula: **"I will [Objective] as measured
  by [Key Results]."** OKRs are "measures *for change*, whereas KPIs are
  measures of health."
  ([whatmatters.com — OKR meaning](https://www.whatmatters.com/faqs/okr-meaning-definition-example))
- **North-star metric & outcome-over-output (Amplitude).** A north-star is "the
  key measure of success… the relationship between the customer problems your
  product team is trying to solve and the revenue you aim to generate," and
  must be a **leading indicator**. The framing: teams are too often "measured
  by how much they ship, not on their business impact" — the fix is to hold
  teams "accountable for an outcome."
  ([amplitude.com — north star metric](https://amplitude.com/blog/product-north-star-metric))

> **Implication:** `create-brd` already asks for a numeric success metric and a
> scope boundary — so the *hook* for outcomes exists. What's missing is the
> discipline of framing it as an **outcome (behavior/metric change), not an
> output (feature shipped)**, and tying acceptance criteria back to it. This is
> a one-paragraph reinforcement in `create-brd`, not a new skill.

## 5. Roadmapping & stakeholder communication

Aha! (a roadmapping originator-authority) defines a roadmap as "a tool that
communicates your product vision and outlines the steps to achieve it… high-level
goals and initiatives, planned releases, and key features." The key principle:
roadmaps should be **strategy-driven and organized around goals/initiatives, not
feature lists** — "what gets included… should be closely aligned with the product
strategy you have already defined," where strategy is "the 'why' behind your
product."
([aha.io — product roadmap](https://www.aha.io/roadmapping/guide/product-roadmap))
The modern **now / next / later** (theme-based) roadmap deliberately avoids
false-precision timeline commitments; the layering is **strategy → roadmap →
PRD** (why → what-order → what-exactly).

> **Implication:** this is the area where the lean setup is **correctly**
> minimal. The `pm` role is one-feature-at-a-time and has no portfolio to
> sequence; a roadmap skill would be speculative (YAGNI) until the workflow
> routinely juggles multiple competing features.

## 6. Requirements artifacts — where PRDs sit now

Traditional layering: **BRD** (business why/goals/scope) → **PRD** (what we're
building, flows, acceptance criteria) → **user stories** (INVEST) with
**Given/When/Then** acceptance criteria. This project already implements exactly
this chain (`create-brd` → `create-prd` → `to-tickets`, INVEST + Gherkin).

**Are heavy PRDs still recommended?** In the modern discovery view, the big
upfront PRD is de-emphasized in favor of **lighter artifacts + prototypes +
continuous discovery** — because the risk is that a detailed spec locks in an
unvalidated solution (Cagan's value risk). *However*, for an AI coding workflow
the concrete PRD + testable acceptance criteria is precisely the artifact the
`coder`/`qa` roles need — a prototype can't be handed to an autonomous coder the
way a spec can. So the project's PRD-driven approach is **appropriate**; the
only correction the sources suggest is *sequencing*: a lightweight
value/assumption check should come *before* the full PRD, so the spec documents
a validated solution rather than the first idea.

---

## PM role: what it has vs. what's missing

| Competency area | Authority | `pm` role today | Verdict |
|---|---|---|---|
| Four areas of deep knowledge (customer/data/business/industry) | Cagan | Human supplies it; `create-brd` does web research | Covered enough — human is product owner |
| Value & viability risk ownership | Cagan (four big risks) | Not explicit | **Gap (moderate)** — no value check before spec |
| Usability & feasibility risk | Cagan | `create-prd` does codebase research (feasibility); usability implicit | Partial — feasibility ok, usability weak |
| Product discovery / assumption testing | Torres | None | **Gap (moderate)** — but cheap to cover via existing skills |
| Prioritization (RICE/MoSCoW/Kano/value-effort) | Intercom, ABC, Kano | **None** | **Gap (biggest, real)** |
| Outcomes over outputs / success metric | What Matters, Amplitude | `create-brd` asks for numeric success metric | Partial — hook exists, framing weak |
| North-star / OKR linkage | What Matters, Amplitude | None | Minor gap — arguably out of scope |
| Roadmapping / theme-based sequencing | Aha! | None (one feature at a time) | **Not a gap** — deliberately out of scope |
| BRD / PRD / user stories / acceptance criteria | traditional + INVEST/Gherkin | Full chain implemented | Covered (strong) |
| Stress-testing the plan before build | (grilling skill) | None | Gap — but existing skill covers it |

---

## Recommendations

### A. Existing global skills the `pm` role should also (optionally) load

These already exist in `~/.claude/skills` — reuse beats building. Add them as
*optional, situational* loads in `agents/pm.md`, not mandatory steps:

1. **`grilling`** — stress-test the BRD/PRD's assumptions before committing.
   This is the cheapest possible stand-in for Cagan's "value risk" check: force
   the PM to defend "will anyone use this / is this the right problem" before
   writing tickets. **Highest-value add, near-zero cost.**
2. **`prototype`** (and/or **`shape` / `wireframe-prototyping`**) — when a
   feature's *usability* is genuinely uncertain, throw a throwaway prototype at
   it before the PRD locks in a flow. Covers usability risk without a discovery
   framework.
3. **`brainstorming`** — generate 2-3 solution options before defaulting to the
   first idea (Torres's "solutions" divergence), for features where the
   approach isn't obvious.

Do **not** make these mandatory — for a well-understood feature the current
idea→BRD→PRD path is right, and forcing prototypes/brainstorms on every ticket
is exactly the over-building this workflow avoids.

### B. New skills worth creating, ranked by value

1. **`prioritize`** *(build this — the one real gap)* — given several
   candidate features/requirements (e.g. a BRD bundling five FRs, or a backlog),
   rank them and recommend what to cut/defer. Ships the four authoritative
   methods with guidance on when to use each: **value-vs-effort** (quick first
   cut), **MoSCoW** (fixed-scope minimum slice), **RICE** (compare disparate
   ideas by ROI), **Kano** (must-haves vs. delighters). Slots in between
   `create-brd` and `to-tickets`. This is the highest-value new skill because
   nothing in the pipeline currently decides *order* or *what not to build*.

2. **`define-outcome` / success-metrics** *(optional — or just fold into
   `create-brd`)* — enforce outcome-over-output framing (OKR "I will [obj] as
   measured by [KR]" + leading north-star indicator) and tie each acceptance
   criterion back to the metric. **Recommendation: don't build a separate
   skill** — `create-brd` already asks for a success metric; add one paragraph
   there requiring an outcome (behavior/metric change) rather than an output
   (feature shipped). Cheaper, same effect.

3. **`product-discovery`** *(probably don't build)* — a full four-risks /
   opportunity-solution-tree / continuous-interview skill. **Recommendation:
   skip it.** For a small AI dev workflow the human is the customer proxy, and
   the valuable 20% (assumption stress-test + prototype) is already covered by
   loading `grilling` + `prototype` per (A). Building a heavy discovery skill
   would be speculative apparatus — the classic over-build.

4. **`roadmap`** *(don't build — YAGNI)* — now/next/later theme-based
   sequencing. Genuinely out of scope until the workflow routinely manages
   multiple competing features with a strategy layer above them. Revisit only
   if that day comes.

### Bottom line

The `pm` role's lean, one-feature-at-a-time, spec-driven shape is **mostly
correct** for an AI coding workflow — the sources' heavier machinery (roadmaps,
OKRs, continuous discovery) is appropriately absent. The **one thing genuinely
missing is prioritization**: build `prioritize`. Everything else is best served
by *loading two existing skills* (`grilling`, `prototype`) and *tightening one
paragraph* in `create-brd` (outcome framing) — not by new construction.

## Sources

- Cagan / SVPG — [The Product Manager Contribution](https://www.svpg.com/the-product-manager-contribution/), [Behind Every Great Product](https://www.svpg.com/behind-every-great-product/), [The Four Big Risks](https://www.svpg.com/four-big-risks/)
- Teresa Torres — [Opportunity Solution Tree / continuous discovery](https://www.producttalk.org/opportunity-solution-tree/)
- Intercom (RICE originator) — [RICE: Simple prioritization for product managers](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/)
- Agile Business Consortium / DSDM (MoSCoW originator) — [MoSCoW Prioritisation](https://www.agilebusiness.org/dsdm-project-framework/moscow-prioritisation.html)
- Kano model — [ProductPlan glossary: Kano Model](https://www.productplan.com/glossary/kano-model/)
- John Doerr / What Matters (OKRs) — [OKR meaning & definition](https://www.whatmatters.com/faqs/okr-meaning-definition-example)
- Amplitude — [North Star Metric](https://amplitude.com/blog/product-north-star-metric)
- Aha! — [Product roadmap guide](https://www.aha.io/roadmapping/guide/product-roadmap)
