# Research: How to write a clear, high-quality GitHub issue

Investigation against high-trust primary sources (GitHub official docs, Simon
Tatham's "How to Report Bugs Effectively", Mozilla/Bugzilla bug-writing
guidelines, Agile Alliance, Bill Wake's original INVEST article, Cucumber's
Gherkin reference). Each claim links the source that owns it.

## TL;DR — checklist for a great issue

A great issue is **atomic, reproducible-or-testable, and independently
closeable**. Concretely it has:

- [ ] **A specific, action-oriented title** that uniquely identifies the one
  problem or goal — describes the *problem*, not a vague symptom or a proposed
  solution ("Down-arrow scrolling doesn't work in textarea styled with overflow",
  not "Browser should work with my site"). [Bugzilla]
- [ ] **One concern per issue** — one bug, one task, one story. Split anything
  covering multiple things. [Bugzilla, INVEST-Small/Independent]
- [ ] **Enough body to matter** — GitHub only runs duplicate detection once the
  body passes ~100 characters; a one-line issue is under-specified. [GitHub]
- [ ] **For bugs:** Summary, **Steps to reproduce** (the single most important
  field), **Expected** result, **Actual** result, **Environment/version**, and
  facts kept separate from speculation. [Tatham, Bugzilla]
- [ ] **For features/stories:** framed from the user's perspective —
  *"As a [role], I want [goal], so that [benefit]"* — satisfying **INVEST**
  (Independent, Negotiable, Valuable, Estimable, Small, Testable). [Agile Alliance, Wake]
- [ ] **Testable acceptance criteria** — conditions a person or test can verify
  by execution, ideally **Given / When / Then** (context / action / outcome).
  "I understand what I want well enough that I could write a test for it." [Cucumber, Wake]
- [ ] **Structured via a template or issue form** so required information is
  never missing. [GitHub]
- [ ] **Metadata:** labels, milestone, assignee; large work **broken into
  sub-issues** (native parent/child), not manual Markdown task lists (retired). [GitHub]

---

## 1. GitHub's own guidance on issues

GitHub's docs are deliberately thin on prescriptive "quality" rules — they lean
on **structure and tooling** rather than prose guidelines.

- Issues track "bugs, enhancements, or other requests." An issue needs a **title
  and description**; GitHub surfaces **potential duplicates only once the title
  is filled and the body reaches ~100 characters** — a signal that a substantial
  body matters for searchability/dedup.
  Source: <https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue>
- Metadata (assignees, labels, milestones, project links) is how maintainers
  organize issues; Copilot can pre-fill title/body/labels/assignees "using your
  repository's templates and structure." Same source.

### Issue templates and issue forms

- Templates exist to **"customize and standardize the information you'd like
  contributors to include."** Two flavors:
  - **Markdown templates** (`.md` in `.github/ISSUE_TEMPLATE/`, `name:`/`about:`
    frontmatter) — guidance, free-form body.
  - **Issue forms** (`.yml`, GitHub form schema) — web form fields that convert
    to Markdown, and crucially **can mark inputs as required**.
  Source: <https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates>
- Form field types: text input, textarea (optional code rendering), dropdown,
  checkboxes, markdown (instructions), file upload. Key YAML properties: `name`,
  `description`, `title` (auto-populate), `labels`, `assignees`, `type`, `body`;
  per-field `validations: required: true` **forces completion before submit**.
  Filename-prefix (`01-bug.yml`, `02-feature.yml`) controls chooser order.
  Source: <https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository>

### Sub-issues vs. task lists

- **Sub-issues** "break down larger pieces of work into tasks," show a
  parent/child relationship, roll up progress into GitHub Projects (filter/group
  by parent), and support **up to 100 sub-issues per parent and 8 levels of
  nesting**. Existing issues can be converted into sub-issues.
  Source: <https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues>
- **Task lists** (`- [ ]` / `- [x]`) still exist for lightweight in-body
  subtasks, but GitHub states **"Tasklist blocks are retired"** and recommends
  **sub-issues** as the structured replacement for tracking related work and
  dependencies.
  Source: <https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists>

## 2. Bug reports specifically

Two authoritative sources agree strongly.

**Simon Tatham — "How to Report Bugs Effectively"**
(<https://www.chiark.greenend.org.uk/~sgtatham/bugs.html>):

- The goal is singular: **"enable the programmer to see the program failing in
  front of them."** Give exact steps to reproduce it independently.
- **Report symptoms, not diagnoses.** Separate "what are actual facts" from "what
  are speculations." Describe observed behavior even if you have a theory.
- **Include error messages verbatim** — "error messages are there because the
  computer is too confused to report the error in words"; the numbers in them are
  diagnostic data.
- **State expected vs. actual** explicitly, so it's unambiguous that the behavior
  is a defect.
- **Be precise** — "clicked Load", not "selected Load"; avoid ambiguous pronouns.
- **Intermittent bugs:** document frequency, conditions, and correlating state.
- **Freeze the failure state** rather than restarting/reinstalling.

**Mozilla / Bugzilla bug-writing guidelines**
(<https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html>):

- **One issue per report.**
- **Summary** (~<60 chars) that uniquely identifies the problem and describes the
  *problem, not a proposed solution*.
- **Steps to reproduce** is "the most important part of any bug report" — precise,
  sequential, with whether repro is consistent/occasional/impossible.
- **Expected results** vs **Actual results**, stated objectively ("displays error
  -91", not "doesn't work").
- Extra context per bug type: crashes → stack traces; perf → profiles;
  regressions → the breaking commit; test against a **current build** first.

Fields these two converge on — and which a good bug template should force:
**Summary · Steps to reproduce · Expected · Actual · Environment/version ·
Severity/frequency.**

## 3. User stories & acceptance criteria

**User story format** (Agile Alliance,
<https://www.agilealliance.org/glossary/user-stories/>):

- Template: **"As a [role], I want [goal], so that [benefit]"** — frames the
  requirement from the user's perspective, not as a technical spec.
- The **Three C's**: **Card** (a short reminder, not a full doc), **Conversation**
  (details co-created with the customer), **Confirmation** (**acceptance
  criteria** that define done). Criteria "can be expressed in terms directly
  usable as automated acceptance tests."

**INVEST** — originated by **Bill Wake (2003)**
(<https://xp123.com/invest-in-good-stories-and-smart-tasks/>), catalogued by
Agile Alliance (<https://www.agilealliance.org/glossary/invest/>):

| Letter | Meaning (Wake's phrasing) |
|--------|---------------------------|
| **I**ndependent | "not overlap in concept… schedule and implement them in any order" |
| **N**egotiable | "not an explicit contract for features; details will be co-created" |
| **V**aluable | "valuable to the customer"; split *vertically* ("the essence of the whole cake") |
| **E**stimable | enough detail "to rank and schedule"; "bigger stories are harder to estimate" |
| **S**mall | "at most a few person-weeks"; "smaller stories tend to get more accurate estimates" |
| **T**estable | **"I understand what I want well enough that I could write a test for it"** |

INVEST's **Testable** and the Three C's' **Confirmation** are the same idea from
two angles: a story isn't ready until its acceptance is verifiable.

**Given / When / Then (Gherkin)** (<https://cucumber.io/docs/gherkin/reference/>)
makes those criteria concrete and unambiguous:

- **Given** = context / precondition ("put the system in a known state").
- **When** = the action or event the user takes.
- **Then** = the expected, **observable** outcome (an assertion).
- **And / But** chain same-type steps; **Scenario Outline** + examples table
  parameterizes one scenario across many cases.
- Because context/action/outcome are separated by keyword, "steps cannot contain
  conflicting assumptions" — the criterion becomes both documentation and an
  executable test.

## 4. Titles, scope, atomicity

Every primary source pushes the same way: **one issue = one concern, named
specifically, independently closeable.**

- **Atomicity:** Bugzilla's "one issue per report"; INVEST's **Independent**
  ("implement in any order") and **Small** ("a few person-weeks"). An issue you
  can't close without also closing something else was scoped too coarse.
- **Specific, problem-oriented titles:** Bugzilla — a summary must "quickly and
  uniquely identify" the problem and describe the *problem, not the solution*.
  Compare "Down-arrow scrolling doesn't work in textarea styled with overflow"
  (good) vs "Browser should work with my web site" (bad).
- **Independently closeable:** a corollary of Independent + Testable — the issue
  states a condition whose satisfaction is self-contained and checkable.

## 5. Acceptance criteria QA can verify by execution

Ties sections 3–4 together: criteria must be **observable outcomes**, not
intentions.

- Wake's **Testable** bar — you could write the test *before* building it;
  "actually writing the tests early helps us know whether this goal is met."
- Gherkin's **Then** is by definition an assertion on observable state — exactly
  what a QA engineer executes and checks.
- Bugzilla's insistence on objective actual results ("displays error -91", not
  "doesn't work") is the same discipline applied to bugs: criteria and results
  must be things you can *see happen*, not adjectives.

A criterion that can't be checked by running the software (e.g. "code is clean",
"performance is good") fails the Testable bar and should be rewritten as a
concrete, observable condition (a Given/When/Then, a measured threshold, a
specific visible output).

---

## How this maps to this project

Files reviewed: `prompts/issue.md` (body templates + creation flow), `agents/pm.md`,
`skills/setup-dev-workflow/references/agents/pm.md` (identical content).

### What already aligns well

- **Atomicity is enforced** — "one concern per issue", split-if-multiple, and the
  parent + backend/frontend sub-issue split all match Bugzilla's one-issue-per-report
  and INVEST Small/Independent. Sizing sub-issues to be individually reviewable
  echoes INVEST-Small.
- **Native sub-issues over Markdown task lists** — exactly GitHub's current
  recommendation ("Tasklist blocks are retired"). The prompt is correct to say
  "don't maintain a manual task list in the body."
- **Action-oriented, imperative, specific titles** ("Fix crash when saving an
  expense with an empty amount", not "app is broken") — matches Bugzilla's
  problem-oriented, uniquely-identifying summary rule.
- **Bug template** covers Summary, Steps to reproduce, Expected, Actual,
  Environment, Severity — a near-complete match to the Tatham + Bugzilla field
  set. This template is in good shape.
- **Testable acceptance criteria, FR-tagged, QA-verified-by-execution** — squarely
  matches INVEST-Testable, the Three C's' Confirmation, and the "observable
  outcome" bar. The `pm.md` rule "write nothing that can't be verified" is the
  right instinct.
- **Native blocked-by links** for the frontend→backend dependency — respects that
  sub-issues, unlike stories, legitimately have implementation-order dependencies.

### Concrete gaps / improvements

1. **Feature parent has no user-story framing.** The parent template is
   Context/Description/Acceptance/Out-of-scope — solid, but the "why for whom"
   is left to free-form Context. Adding an explicit
   **"As a [role], I want [goal], so that [benefit]"** line to the parent (and
   optionally sub-issue) template would enforce the user's-perspective framing
   that Agile Alliance treats as the definition of a story. Low cost, high clarity.

2. **Acceptance criteria are unstructured checkboxes — adopt Given/When/Then.**
   Both templates use bare `- [ ]` conditions. They're testable in spirit, but
   nothing forces the context/action/outcome structure that makes them
   unambiguous and directly executable by QA. Recommending (not mandating)
   **Given/When/Then** phrasing for non-trivial criteria would raise the floor,
   and it dovetails with the existing "QA verifies by execution" model — a
   Given/When/Then *is* a QA script. Keep plain checkboxes allowed for trivial
   conditions to avoid ceremony.

3. **No explicit "problem, not solution" rule for the bug Summary.** The title
   guidance (imperative, specific) is good, but Bugzilla's sharper rule — the
   summary should describe the *problem*, not a proposed fix — isn't stated. One
   sentence in the bug section would close this.

4. **"Separate facts from speculation" is missing from the bug template.** Tatham
   and Bugzilla both stress reporting symptoms objectively and not burying the
   real facts under a guessed cause. The Steps/Actual fields imply it, but a short
   note ("state what you observed; keep any hypothesis in a separate note") would
   help agents filing bugs from noisy input.

5. **INVEST as an explicit checklist for sub-issue sizing.** `pm.md` already
   encodes Small (reviewable-diff sizing) and Independent (blocked-by ordering).
   Naming INVEST as the standard would give the PM a shared vocabulary for
   *Valuable* (each sub-issue should deliver a vertical slice, not a purely
   horizontal layer) and *Negotiable* — a useful counter-pressure to the rigid
   "always split backend/frontend" default, which can produce non-vertical slices
   that INVEST-Valuable warns against.

6. **Chore template is minimal by design — leave it.** Reusing the sub-issue
   template minus Parent is appropriately lazy and fine; chores don't need
   user-story framing. No change recommended.

**Net:** the templates are already close to primary-source best practice. The two
highest-value additions are (1) the **As-a/I-want/so-that** line on feature
issues and (2) a **Given/When/Then** convention for acceptance criteria — both
small edits to `prompts/issue.md` that make issues more unambiguous and more
directly QA-executable without adding process weight.
