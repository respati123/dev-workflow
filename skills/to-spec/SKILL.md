---
name: to-spec
description: Turn a feature idea into a BRD + PRD in one flow — runs create-brd then create-prd back to back. Trigger on "to-spec", "buat spec", "spec this feature", or when the user wants both docs without invoking each skill separately.
---

# to-spec

The pm role's spec-writing phase, end to end: BRD → PRD for one feature, so
the user doesn't have to invoke `create-brd` and `create-prd` separately.

## Workflow

**Delegate first**: if `.claude/agents/to-spec.md` exists (installed by
`setup-dev-workflow`), spawn it via the Agent tool — `subagent_type:
"to-spec"`, foreground (you need its output before you can report back) —
passing the feature description. Relay its report and stop; skip the steps
below.

**No installed subagent** (or not Claude Code): run the phase inline —

1. Load the `create-brd` skill and run it for the feature described. It
   saves to `docs/brd/<slug>.md` and iterates with the user until approved.
2. Once the BRD is approved, load the `create-prd` skill and run it for the
   same feature — or once per feature if the BRD bundles several, per
   `create-prd`'s own one-feature-per-PRD rule.
3. Report both file paths. Stop there — ticket creation is a separate step
   (`to-tickets`), only run it if the user asks.

If the user already has an approved BRD and only wants the PRD, skip step 1
and go straight to `create-prd` — don't force a redundant BRD pass.
