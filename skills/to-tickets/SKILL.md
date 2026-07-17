---
name: to-tickets
description: Break an approved BRD/PRD into a GitHub parent issue + sub-issues, following this repo's issue conventions. Trigger on "to-tickets", "buat tickets", "break this into issues", "turn this spec into issues".
---

# to-tickets

The pm role's ticket-creation phase: turns an approved spec into GitHub
issues. Uses the exact same conventions as the `/issue` command — read
`prompts/issue.md` for the full body templates, label rules, and native
sub-issue linking steps, and follow them exactly. The only difference here is
where the content comes from.

## Workflow

**Delegate first**: if `.claude/agents/to-tickets.md` exists (installed by
`setup-dev-workflow`), spawn it via the Agent tool — `subagent_type:
"to-tickets"`, foreground — passing the spec (or naming which PRD if known).
Relay its report and stop; skip the steps below.

**No installed subagent** (or not Claude Code): run the phase inline —

1. Find the spec: look for the relevant PRD in `docs/prd/` (and its BRD in
   `docs/brd/` for context). If the user names one, confirm it; if none
   exists and none is named, ask which spec this is for — don't invent
   requirements.
2. Derive the breakdown from the PRD's FR numbering: one **parent issue**
   (feature-level acceptance criteria, from the PRD's scope) plus
   **sub-issues** per implementable part (backend first, then frontend) —
   same split rule as `prompts/issue.md`: at minimum one backend + one
   frontend sub-issue, more only if genuinely atomic.
3. Follow `prompts/issue.md`'s body templates, label conventions, and
   creation steps exactly: ensure labels exist, create parent then
   sub-issues, link every sub-issue via the sub-issues API, **verify the
   link worked**, no status label on creation.
4. Propose the full breakdown (parent + sub-issue titles) to the user before
   creating anything.
5. Report parent + sub-issue numbers and URLs.

Bugs/chores found outside a spec still go through the plain `/issue`
command, not this skill — `to-tickets` is specifically for spec-derived
feature breakdowns.
