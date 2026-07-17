# GitHub access — MCP first, `gh` CLI fallback

Every skill/agent in this workflow that talks to GitHub's API should prefer
the GitHub MCP server when it's connected, and fall back to the `gh` CLI
command written in the skill otherwise. Check your tool list for
`mcp__github__*` tools before each GitHub operation below — don't assume
either way.

## Mapping (use the MCP tool when present)

| Written in the skills as...                                    | MCP tool                                |
|---|---|
| `gh issue list ...` / `gh issue view ...`                       | `list_issues` / `issue_read`            |
| `gh issue create --title --body --label ...`                    | `issue_write` (create)                  |
| `gh issue edit <n> --add-label/--remove-label ...`               | `issue_write` (update)                  |
| `gh label create ...`                                            | `label_write`                           |
| `gh pr diff <PR>`                                                 | `pull_request_read` (get_diff)          |
| `gh pr review <PR> --approve/--request-changes --body ...`       | `pull_request_review_write`             |
| `gh api .../issues/<parent>/sub_issues -F sub_issue_id=...` (link)| `sub_issue_write`                       |

**Before trusting an MCP result, check it actually returns what the next
step needs.** `gh pr list --json ...` and `gh issue list --json ...` let you
name exact fields (`reviewDecision`, `statusCheckRollup`, `labels`); confirm
the MCP tool's response includes the same before relying on it — if it
doesn't, use the `gh` command for that call instead of working with less
information than the skill assumes.

## Always `gh` / plain git — no MCP path exists

- **Anything touching the local working tree**: `git fetch`, branching,
  local commit/push, `gh pr checkout <PR>`. The GitHub MCP server is a
  remote HTTP API — it has no access to your working directory, so none of
  this can move to it, MCP installed or not.
- **`gh api .../issues/<n>/dependencies/blocked_by`** — the blocked-by check
  `to-implement` and `/issue` use to pick ready work. As of this writing the
  GitHub MCP server has no tool for issue dependency/blocked-by
  relationships. Always `gh api` for this one.

## Rule of thumb

Unlisted operation, or unsure whether the MCP tool's output matches what
`gh --json ...` would give you → just use `gh`. It's the one guaranteed to
match what the skill documents. MCP is an optimization here, not a
requirement — every skill must still work with `gh` alone if the MCP server
isn't installed.
