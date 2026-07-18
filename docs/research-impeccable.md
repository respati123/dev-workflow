# Research: Integrating `impeccable` as a prototype-first design phase

Primary source is the local `impeccable` skill (v3.9.1) at
`~/.agents/skills/impeccable/`. Cited by file path, since it's not on the web.
No web lookup was needed; the design-handoff reasoning is grounded in the
skill's own flows plus this repo's existing workflow.

## TL;DR

`impeccable` is a large (20+ command) frontend-design skill that produces
**real, production-grade UI code** — not throwaway mocks — and captures a
project's strategic and visual context in two durable root files it auto-loads
before every run: **PRODUCT.md** (register, users, purpose, brand personality,
anti-references — the "who/what/why") and **DESIGN.md** (tokens, color,
typography, components — the "how it looks"). Its two build commands split
cleanly: **`shape`** plans the UX/UI and emits a confirmed **design brief**
(markdown, no code); **`craft`** runs shape then builds the real feature in the
project's real stack. There is no "throwaway HTML mock" step inside impeccable —
that's the separate global `prototype` skill.

The recommended integration is deliberately lean (this repo's ethos, and the
prior `research-pm-skills.md` conclusion, both say *reuse, don't build*):

- **Once per project:** `setup-dev-workflow` offers `impeccable init` +
  `document` → **PRODUCT.md / DESIGN.md** for UI projects, as a parallel
  gap-offer mirroring `docs/adr/` and `docs/postman/`. This is the reused
  visual language every frontend coder consumes.
- **Per feature (frontend only):** the **`pm`** runs `impeccable shape` — no
  new role — producing a design brief that is **linked from the PRD** via a new
  "Design / Prototype" field. Backend-only sub-issues skip it entirely.
- **At build time:** the **`coder`** loads `impeccable` for `frontend`-labelled
  sub-issues (it auto-reads DESIGN.md + register rules) and builds the real
  stack against the brief. This upgrades coder.md's existing vague
  "`frontend-design`/`ui-craft`" pointer.
- **Skip:** a `designer` role, a new wrapper skill, the 15+ enhance/refine
  commands, mandatory throwaway HTML, and a blocking design gate on every PR.
  Critique/audit stay *optional* checks for frontend PRs, not a new gate.

---

## How impeccable works

### The two durable artifacts: PRODUCT.md + DESIGN.md

`impeccable init` does one codebase crawl that feeds everything
(`impeccable/reference/init.md:1-9`):

- **PRODUCT.md** (strategic, project root): register, target users, product
  purpose, positioning, brand personality, anti-references, design principles,
  platform. Answers "who/what/why". Written only after a real interview round
  and user confirmation — never synthesized from the prompt alone
  (`init.md:54-124`).
- **DESIGN.md** (visual, project root): follows the official DESIGN.md format
  spec — YAML frontmatter of machine-readable tokens (colors, typography,
  rounded, spacing, components) plus six fixed-order prose sections (Overview,
  Colors, Typography, Elevation, Components, Do's and Don'ts)
  (`impeccable/reference/document.md:1-60`). **Tokens are normative; prose is
  context.** This is the parseable design-system file.
- `.impeccable/live/config.json` — live-mode config (web only; irrelevant to a
  headless pipeline).

The key fact for integration: **every impeccable command runs
`scripts/context.mjs` first**, which prints PRODUCT.md and DESIGN.md as a
markdown block and injects the register/platform directive
(`impeccable/SKILL.md:13`, `scripts/context.mjs:2-10,901-929`). So once these
two files exist at the repo root, *any* later impeccable invocation — including
the coder's at build time — automatically inherits the project's visual
language with zero extra wiring. **DESIGN.md is the durable, coder-consumable
design artifact.** These are captured **once per project** (re-run `document`
when the design drifts), not per feature.

`document` has two modes (`document.md:72-76`): **scan** (extract tokens from
existing CSS/Tailwind/components — the default when code exists) and **seed**
(five-question interview for a pre-implementation stub, marked `<!-- SEED -->`,
re-run later against real code). `extract`
(`impeccable/reference/extract.md`) is the deeper, on-demand refactor that
pulls repeated components/values into the design system — a maintenance
command, not part of setup.

### shape vs craft — where the "prototype-first" flow really is

**`shape` is the prototype-first phase, and its output is a design brief, not
code.** The reference is explicit
(`impeccable/reference/shape.md:1-6`):

> Shape the UX and UI for a feature before any code is written. This command
> produces a **design brief**: a structured artifact... **Scope**: Design
> planning only. This command does NOT write code.

Its flow: a discovery interview (purpose, content ranges, edge cases, color
strategy, a "scene sentence" for theme, named anchor references, fidelity/scope)
(`shape.md:11-70`); an *optional, capability-gated* **Visual Direction Probe**
that generates 2-4 direction images — but only when the harness has **native
image generation** (Codex `image_gen`); otherwise it announces the skip and
proceeds text-only (`shape.md:72-110`); then a **Design Brief** (10 sections:
summary, primary action, design direction, scope, layout strategy, key states,
interaction model, content requirements, recommended references, open
questions) that the user must confirm before anything is built
(`shape.md:112-165`). A compact 3-5 bullet brief is the default for clear
prompts; the full structured brief is reserved for genuinely ambiguous work
(`shape.md:116-121`).

**`craft` = shape + real build** (`impeccable/reference/craft.md:1-8`). It
runs shape internally (Step 1), loads references, does harness-gated visual
direction, then **builds to production quality** — and the skill's own design
guidance forbids mocks (`impeccable/SKILL.md:22`):

> Produce ready-to-ship, production-grade code, not prototypes or starting
> points.

Craft's production bar respects the existing framework and build pipeline,
edits source (never writes to `dist/`/`build/`), demands real content, full
state coverage, semantic HTML, and verification in-browser
(`craft.md:22-98`).

**So, answering the throwaway question directly:** impeccable does *not* build
throwaway HTML mocks in the real stack. Its "prototype" is the **shape design
brief** (durable, coder-consumable) plus — only if native image generation
exists — a few **direction probe images** (supporting artifacts, explicitly
"not final UX specification", `shape.md:104-108`). In Claude Code, which lacks
native `image_gen`, shape produces a **text brief only**. A genuine throwaway
HTML prototype is the domain of the *separate* global `prototype` skill, and
building one then rebuilding it in the real stack is the double-work craft
warns against.

Durable vs throwaway summary:

| Artifact | Command | Durable? | Coder-consumable? |
|---|---|---|---|
| PRODUCT.md | `init` | Yes (per project) | Context (register, principles) |
| DESIGN.md | `document` | Yes (per project) | **Yes — the design system** |
| Design brief | `shape` | Per feature (link it) | **Yes — the design target** |
| Direction probe images | `shape` (Codex only) | Throwaway | Supporting only |
| Production UI code | `craft` | Yes | It *is* the build |

### Register (brand vs product) and platform

Register is picked first because it shapes everything
(`init.md:74-80`). **brand** = design IS the product (marketing, landing,
campaign, portfolio, long-form — `impeccable/reference/brand.md:3`);
**product** = design SERVES the product (app UI, admin, dashboards, settings,
tools, authenticated surfaces — `impeccable/reference/product.md:1-3`). The
product register defaults to *earned familiarity* over novelty (Linear/Notion/
Stripe bar), one type family, fixed rem scale, Restrained color, full component
state vocabulary, 150-250ms motion that conveys state not decoration
(`product.md:6-61`). **For this dev-workflow — internal tools, dashboards,
backends — the register is almost always `product` and the platform `web`.**
That's the lane the integration should assume by default; the brand register
and iOS/Android platform rules (`reference/ios.md`, `reference/android.md`)
exist but rarely apply here.

### The evaluate flow (critique / audit)

`critique` (`impeccable/reference/critique.md`) is a scored UX design review
that runs two isolated sub-agents (design review + detector/browser evidence)
and persists a snapshot — heavy, browser-oriented. `audit`
(`impeccable/reference/audit.md:1-59`) is a code-level technical scan scoring
five dimensions 0-4: a11y, performance, theming, responsive, anti-patterns —
lighter and static-friendly. These are the natural "does the built UI match the
design" checks, but see decision C/E on why they stay *optional*.

---

## The integration design (opinionated)

### A. Where the design phase slots

Two insertion points, at two cadences:

1. **Once per project — design-system capture.** `setup-dev-workflow` offers
   `impeccable init` + `document` → PRODUCT.md/DESIGN.md as a **parallel
   gap-offer**, exactly like it already offers `docs/adr/` and `docs/postman/`
   (`skills/setup-dev-workflow/SKILL.md:138-161`). Gated on the project having
   a UI/frontend surface (same recon that decides "backend present?"). This is
   the highest-leverage move: one DESIGN.md that every frontend coder
   auto-inherits.

2. **Per feature — the shape step.** After the PRD is approved and before
   `to-tickets`/coding, for features with a **frontend surface**, run
   `impeccable shape` to produce a confirmed design brief. This sits right where
   the prior research already located it — the PRD's "UX / UI Requirements"
   section is the seam (`skills/create-prd/references/prd-template.md:36-40`),
   and the pm already optionally reaches for `shape`/`prototype`
   (`agents/pm.md:31-34`).

Backend-only features skip the shape step entirely (decision B).

### B. Who owns it — no new role

**Recommendation: the `pm` owns the shape step; the `coder` owns the build.**
Do **not** create a `designer` role.

The workflow's own principle is "a role exists only if it needs different
permissions, skills, or context." A `designer` would need read access plus
Markdown-doc writing and *no* code edit — which is **exactly the `pm`'s
profile** (`agents/pm.md:6-8`: "your outputs are Markdown docs in `docs/` and
GitHub issues"). It would duplicate pm, not differentiate from it. And the pm
already lists `shape`/`prototype` as situational loads. So shape belongs to pm.

The *build* half (real stack code) belongs to the `coder`, the only role that
edits code, which already optionally loads `frontend-design`/`ui-craft` for UI
work (`agents/coder.md:14-16`). impeccable's own model backs this split: `shape`
(plan, no code) is a separable command from `craft` (build). We use them
separately — pm shapes, coder builds — rather than running `craft` as one shot,
because the plan must land *before* tickets exist.

**Frontend vs backend gating.** Decided at the ticket level, using machinery
that already exists. The pm splits every feature into sub-issues "backend first,
then frontend", labelled `backend`/`frontend` (`agents/pm.md:42-71`). The rule:
- Shape runs only when the feature has a **frontend** surface; the brief
  attaches to the `frontend` sub-issue(s).
- The `coder` loads impeccable only for `frontend`-labelled sub-issues.
  `backend`-labelled sub-issues never touch it.

The `frontend` label *is* the gate — no new heuristic needed.

### C. The coder-consumable artifact

Two layers, both already coder-reachable:

1. **Durable: DESIGN.md** (repo root). The coder gets it for free — when it
   loads impeccable for a frontend sub-issue, `context.mjs` auto-injects
   DESIGN.md + the register directive. This is how the *same visual language is
   reused across features*.

2. **Per-feature: the shape design brief, linked from the PRD.** Don't invent a
   `docs/prototypes/` tree. The PRD is already the coder's spec, already read by
   `/ship` and `to-tickets`. Add a **"Design / Prototype" link field** under the
   PRD's "UX / UI Requirements" section. Default content is the confirmed shape
   brief — either inlined (compact briefs are 3-5 bullets) or saved to
   `docs/design/<feature>.md` and linked. If a throwaway artifact genuinely gets
   built (rare — only for real usability uncertainty, via the `prototype`
   skill, or Codex probe images), commit it under `docs/design/` and link it in
   the same field.

**How qa/techlead check the built UI matches the design:** keep it *optional*,
not a new blocking gate. The `techlead` already blocks on "violations of the
project's documented rules" (`agents/techlead.md:20-24`) — and once DESIGN.md
exists, it *is* a documented rule. So the light touch is: on a `frontend` PR,
techlead may run `impeccable audit` (static a11y/responsive/theming/anti-pattern
scan) against DESIGN.md; qa may run `impeccable critique` (browser-based) when
verifying a visual criterion. Both **situational**, matching how pm's optional
skills are framed — not a mandatory design gate on every frontend PR (that's the
ceremony this workflow avoids; see E).

### D. Concrete wiring edits (wording-level)

Both copies of the role files change — `agents/*.md` **and**
`skills/setup-dev-workflow/references/agents/*.md` (they're identical installs).

1. **`agents/pm.md`** — upgrade the existing situational bullet
   (`agents/pm.md:31-34`). Current text points vaguely at `prototype`/`shape`.
   Replace with, roughly:
   > - `impeccable shape` — **for a feature with a frontend surface**, run this
   >   after the PRD is approved to produce a confirmed **design brief** (UX/UI
   >   plan, no code). Link it from the PRD's "Design / Prototype" field so the
   >   `coder` builds against a concrete design target, not just the PRD's
   >   prose. Backend-only features skip it. Reach for the throwaway `prototype`
   >   skill instead only when a flow's *usability* is genuinely uncertain and
   >   worth a disposable mock.

2. **`agents/coder.md`** — sharpen the UI-skill bullet
   (`agents/coder.md:14-16`). Replace "`frontend-design`/`ui-craft` for UI
   work" with:
   > - `impeccable` for `frontend`-labelled sub-issues — it auto-loads the
   >   project's DESIGN.md and register rules via `context.mjs`, so the build
   >   stays on the captured visual language. Build against the PRD's linked
   >   design brief. `backend`-only sub-issues skip it.

3. **`agents/techlead.md`** — add one optional line after the existing checks
   (`agents/techlead.md:20-31`):
   > - For a `frontend` PR with a project DESIGN.md, you *may* run `impeccable
   >   audit` on the diff (a11y / responsive / theming / anti-patterns). Findings
   >   are non-blocking unless they violate a documented DESIGN.md rule.

4. **`agents/qa.md`** — optional, situational note only: for a visual
   acceptance criterion, `impeccable critique` in the browser is a valid way to
   observe it. Keep it one line; don't make it a step.

5. **`skills/create-prd/references/prd-template.md`** — add a field under
   "UX / UI Requirements" (`prd-template.md:36-40`):
   > - **Design / Prototype:** link to the confirmed `impeccable shape` brief
   >   (inline for compact briefs, or `docs/design/<feature>.md`). `N/A` for
   >   backend-only or convention-covered UI.

6. **`skills/create-prd/SKILL.md`** — one line in step 4/5: for a frontend
   feature, note that the shape brief (if the pm produced one) fills the new
   Design / Prototype field.

7. **`skills/setup-dev-workflow/SKILL.md`** — add a gap-offer to Step 3
   (mirror the `docs/adr/` offer at lines 152-161), gated on a UI/frontend
   surface being present in Step 2's recon:
   > - **Design system (PRODUCT.md / DESIGN.md)** missing, and the project has
   >   a frontend/UI surface → offer `impeccable init` + `document` to capture
   >   the register, strategic context, and visual tokens once — recommend yes:
   >   every frontend `coder`/`shape` run auto-loads these, keeping features on
   >   one visual language. Skip for backend-only projects.

   Also add a line to Step 5's report noting PRODUCT.md/DESIGN.md status.

### E. What to SKIP (YAGNI)

impeccable is big; most of it should stay *available on demand* but *out of the
pipeline*.

- **No `designer` role.** It would duplicate pm's exact permission/skill
  profile (decision B). The single biggest thing to not build.
- **No new wrapper skill.** impeccable already has `shape`/`craft`/`document`;
  wrapping them adds a layer with no new behavior. The prior
  `research-pm-skills.md` reached the same "reuse, don't build" conclusion for
  discovery.
- **Don't wire the 15+ enhance/refine/fix commands** — `bolder`, `quieter`,
  `delight`, `animate`, `colorize`, `typeset`, `layout`, `overdrive`,
  `distill`, `harden`, `onboard`, `clarify`, `adapt`, `optimize`. The coder
  reaches for any of these ad hoc during a build; none belongs as a pipeline
  step.
- **Skip `live`** (browser variant mode, web-only, interactive) and `pin`/
  `hooks` (per-user shortcuts). Interactive tools, not pipeline-fit.
- **Don't force impeccable on backend-only work.** The `frontend` label gates
  it. A backend sub-issue that loads a frontend design skill is pure ceremony.
- **Don't mandate throwaway HTML prototypes.** impeccable doesn't produce them,
  and a mock-then-rebuild is double work. The design brief is the target;
  throwaway HTML is a rare, usability-uncertainty-only escape hatch via the
  separate `prototype` skill.
- **Don't make critique/audit a blocking gate on every frontend PR.** Keep them
  optional (decision C). A scored design review on every button change is the
  over-building this workflow exists to avoid.
- **Don't run `craft` as a one-shot in the pipeline.** Splitting shape (pm,
  pre-tickets) from build (coder, per sub-issue) is what lets the design target
  exist before tickets and keeps the one-sub-issue-one-PR discipline intact.

---

## Does impeccable supersede or complement the existing prototype/shape mentions?

Both. It **supersedes** the vague pointers — coder.md's
"`frontend-design`/`ui-craft` for UI work" and pm.md's bare "`prototype` /
`shape`" — with one coherent skill that (a) captures a durable DESIGN.md the
whole team reuses and (b) produces a per-feature brief *in that same visual
language*. It **complements** the generic `prototype` skill, which stays the
throwaway-HTML path for the narrow case of genuine usability uncertainty
(the exact framing `research-pm-skills.md:258-261` already recommends). The two
are not redundant: impeccable = design-system + design-target; `prototype` =
disposable usability check.

---

## Ranked recommendation

1. **`setup-dev-workflow` offers `impeccable init` + `document` → PRODUCT.md /
   DESIGN.md, once per UI project** (edit 7). Highest leverage, lowest cost —
   one artifact every frontend coder auto-inherits, and it mirrors an offer
   pattern the skill already has. Do this first.
2. **`pm` runs `impeccable shape` for frontend features; PRD gets a "Design /
   Prototype" link field** (edits 1, 5, 6). Gives the coder a concrete design
   target instead of prose. This is the "prototype-first" phase itself.
3. **`coder` loads `impeccable` for `frontend` sub-issues** (edit 2). Closes the
   loop — the build reads DESIGN.md + brief and stays on the visual language.
4. **(Optional) `techlead`/`qa` run `impeccable audit`/`critique` on frontend
   PRs against DESIGN.md** (edits 3, 4). Situational, non-blocking. Add last, or
   not at all until a real "built UI drifted from design" problem shows up.

Everything in section E stays unbuilt.

## Sources

- `impeccable` skill v3.9.1 — `~/.agents/skills/impeccable/`: `SKILL.md`,
  `reference/{init,shape,craft,document,extract,product,brand,critique,audit}.md`,
  `scripts/context.mjs`.
- This repo: `agents/{pm,coder,techlead,qa,scout}.md`,
  `skills/create-prd/{SKILL.md,references/prd-template.md}`,
  `skills/setup-dev-workflow/SKILL.md`, `prompts/ship.md`,
  `docs/research-pm-skills.md`, `docs/research-writing-prd.md`.
</content>
</invoke>
