---
name: to-spec
description: Turn a feature idea into a BRD + PRD in one flow — runs create-brd then create-prd back to back. Trigger on "to-spec", "buat spec", "spec this feature", or when the user wants both docs without invoking each skill separately.
---

# to-spec

The pm role's spec-writing phase, end to end: BRD → PRD for one feature, so
the user doesn't have to invoke `create-brd` and `create-prd` separately.

## Workflow

### Step 0 — Size check

Before running anything, size the ask the way `scout` would: how many
files/components does this actually touch, is it one concern or several,
does it introduce a new user-facing flow or just adjust an existing one?

- **Small** (1-2 files, one concern, no new flow) — a BRD/PRD is overhead
  that won't earn its cost. Recommend skipping straight to a plain issue
  (`issue` skill) + `to-implement` instead, and say why in one line
  ("this reads like a 1-file fix — recommend `issue` + `to-implement`
  instead of a full BRD/PRD. Still want the spec?"). If the user confirms
  they still want the spec, proceed with the workflow below — explicit
  request wins.
- **Medium/large** (3+ files, a new flow, cross-cutting concern) — proceed
  with the workflow below without asking; this is what `to-spec` is for.

Don't turn this into an investigation — one line of judgment, not a scout
pass. If genuinely unsure, default to running the workflow: a BRD too many
costs a rewrite of prose, a missing one costs a rebuild of code.

**Delegate to the `pm` role** — this whole phase is the pm role's job. On
Claude Code, spawn it via the Agent tool, `subagent_type: "pm"`, foreground
(you need its output before you can report back) — pass it the feature
description and this skill's workflow below. If `pm` doesn't resolve
("subagent not installed"), don't fail or silently fall through — install
it: copy `~/.claude/skills/setup-dev-workflow/references/agents/pm.md` into
`.claude/agents/pm.md` in this project (create the directory if needed),
then retry. Still unresolved right after installing? That's Claude Code's
file watcher only picking up a brand-new `agents/` directory (or its first
file) on the *next* session start — tell the user to restart Claude Code
once, and run this phase inline for now. Relay `pm`'s report and stop; skip
the steps below.

**No Agent tool available at all**: run the phase inline —

1. Load the `create-brd` skill and run it for the feature described. It
   saves to `docs/brd/<slug>.md` and iterates with the user until approved.
2. Once the BRD is approved, load the `create-prd` skill for the same
   feature. If the BRD bundles several features, `create-prd`'s own step 2
   already lists them as options and asks which one to draft now — one PRD
   per invocation, not all of them at once.
3. Once the PRD is saved, **always ask** (`AskUserQuestion`, single-select):
   - **Continue to `to-tickets`** — the common case once a PRD is drafted.
   - **Review / revise the PRD first** — loop back into `create-prd`'s own
     iterate step; re-ask this same question once the user is done revising.
   On "Continue", load the `to-tickets` skill for this PRD. `to-tickets`
   itself asks which issue to start on and hands off to `to-implement` —
   nothing further to do here.
4. If the BRD bundled more features than the one just spec'd, say so plainly
   at the end ("N more feature(s) from this BRD still need a PRD — run
   `to-spec`/`create-prd` again when ready"). Don't loop into the remaining
   features automatically — each one goes through its own review/continue
   checkpoint, not a batch.

If the user already has an approved BRD and only wants the PRD, skip step 1
and go straight to `create-prd` — don't force a redundant BRD pass.
