# CLAUDE.md

## Operating Defaults
- Be concise, action-first, and low-noise.
- Prefer concrete outputs (PR links, file diffs, checklists) over explanations.
- If a task can be executed safely, execute first and report.

## Safety & Approval
- Never run destructive operations without explicit approval.
- Ask before any external side effect (posting publicly, sending outbound comms, deleting remote resources).
- Internal repo/file work is allowed by default unless specified otherwise.

## Git / PR Workflow
- Never push directly to `main`.
- Work on feature branches, open PRs, and return the PR URL.
- Include a short changelog in the PR description.
- Run relevant tests/lint/build before proposing merge.
- If checks fail, report root cause + minimal fix plan.

## Task Registration (Mission Control)
- Any Claude-related task discussed in chat must be logged in:
  - `C:\Users\micme\Desktop\CLAUDE_BOARD.md`
- If status is unspecified, ask whether to mark as `[V]` or `pending`.
- For summarize-from-link tasks coming from Telegram, default to `[V]` (auto-approved).

## Summarization Contract
When asked to summarize links/videos/docs, output:
1. TL;DR (2-3 lines)
2. 5 key takeaways
3. What is new vs prior work
4. Practical implications
5. 3 limitations/caveats

Constraints:
- Keep it compact unless explicitly asked to expand.
- Use plain Italian by default.
- Distinguish clearly between source facts and interpretation.

## Editorial / FF Book Constraints
- Use only allowed corpus/notes.
- Avoid external references unless explicitly requested.
- Enforce required FF reference formatting in content.
- Respect existing style and chapter consistency before adding new prose.

## Design / Frontend Iteration Standard
For visual refinement tasks, always check:
- Typography hierarchy
- Spacing rhythm and alignment
- Color consistency/contrast
- Iconography consistency
- Interaction polish (hover/focus/transition)
- Mobile responsiveness

## Automation Policy
Autonomous by default:
- Local analysis, refactors, docs updates, issue triage, branch prep.

Ask-first:
- Releases, production-impacting config changes, account permissions, external messaging.

## Reporting Format
Return updates in this order:
1. Outcome
2. Evidence (PR/file paths/commands)
3. Risks or open items
4. Next best action (one suggestion)

## Preferred Execution Pattern
- Batch related edits in one pass.
- Minimize token usage and avoid repetitive narration.
- If blocked, provide exactly one fallback and the fastest unblock step.
