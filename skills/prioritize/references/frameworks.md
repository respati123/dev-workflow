# Prioritization frameworks — formulas, scales, when to use

Pick **one** framework to fit the decision (SKILL.md step 2). Details and
originator sources below. The project's own research write-up is
`docs/research-pm-skills.md`.

---

## Value vs Effort  (the default)

The fastest cut. Plot each item on two axes and sort.

- **Value** — how much this helps the user/business (rough 1–5, or high/med/low).
- **Effort** — cost to build (rough 1–5, or T-shirt S/M/L).

Order of attack:
1. **High value, low effort** — do first (quick wins).
2. **High value, high effort** — plan deliberately (big bets).
3. **Low value, low effort** — fill-ins, only if cheap.
4. **Low value, high effort** — cut.

Good enough for a handful of items at this workflow's scale. Reach for a
heavier framework only when this doesn't separate the items clearly.

---

## RICE  (compare many disparate ideas by ROI)

Originator: Intercom.
<https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/>

```
RICE score = (Reach × Impact × Confidence) ÷ Effort
```

- **Reach** — how many people/events in a fixed period (e.g. "users per
  quarter"). Use real numbers, one consistent time window for every item.
- **Impact** — per-person effect, on a fixed scale: **3 = massive, 2 = high,
  1 = medium, 0.5 = low, 0.25 = minimal.**
- **Confidence** — % that tempers guesswork: **100% = high, 80% = medium,
  50% = low.** Anything below ~50% means go gather data, not score.
- **Effort** — person-months (or person-weeks), estimated across all functions.

Score = "total impact per unit of work." Rank descending. Don't apply
rigidly — dependencies, strategy, and table-stakes can override the number.

---

## MoSCoW  (fixed scope/deadline → shippable minimum)

Originator: DSDM / Agile Business Consortium.
<https://www.agilebusiness.org/dsdm-project-framework/moscow-prioritisation.html>

Classify every item into exactly one bucket:

- **Must have** — without it there's no point shipping. Together, the Musts are
  the **Minimum Usable SubseT** (the MVP).
- **Should have** — important but not vital; painful to omit, still shippable.
- **Could have** — desirable; include if time allows. This is your contingency.
- **Won't have (this time)** — explicitly out of scope now; recorded, not
  forgotten.

Effort guideline (DSDM): keep **Must ≲ 60% of effort**, with **~20% in Could**
as the buffer that protects the deadline. If Musts are >60%, the release is
over-committed — renegotiate scope now, not mid-build.

---

## Kano  (mix of table-stakes vs. delighters)

Originator: Noriaki Kano (1984).
<https://www.productplan.com/glossary/kano-model/>

Classify features by how presence/absence moves customer satisfaction:

- **Basic / threshold** — expected. Absence causes dissatisfaction; presence
  earns no praise (it's assumed). Must be covered.
- **Performance / one-dimensional** — satisfaction scales linearly with how
  much you invest. "More is better." Compete here.
- **Attractive / delighter** — unexpected; presence delights disproportionately,
  absence isn't missed. A few go a long way.
- **Indifferent** — moves nothing; a candidate to cut.
- **Reverse** — presence actively dissatisfies some users; be careful.

Use it to balance a release: cover the Basics, invest in a couple of
Performance features, sprinkle one Delighter — don't spend the budget on
Indifferent work.

---

## Choosing between them

- **One or two obvious items** → don't run a framework; say so.
- **A quick sequence for a few items** → Value vs Effort.
- **Fixed deadline, need the minimum that ships** → MoSCoW.
- **Many unlike ideas, want an ROI ranking** → RICE.
- **Deciding what kind of features to fund** → Kano.

Whatever the score says, a hard **dependency** wins: if A must exist before B,
A goes first regardless of rank — note it explicitly.
