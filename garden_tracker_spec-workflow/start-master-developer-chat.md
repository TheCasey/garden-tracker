# Start Master Developer Chat

Use this prompt to start or resume the `master-developer` chat for this workflow.

## Read First

- `workflow-plan.md`
- `workflow-state.yaml`
- `agents/master-developer.md`
- `garden_tracker_spec.md`
- `phases/phase-01-source-control-github-and-operations-setup/phase.md`
- `phases/phase-01-source-control-github-and-operations-setup/run-log.md`

If `workflow-state.yaml` points to a later phase or a different next role, follow the live state instead of assuming Phase 1 is still current.

## Your Task

- Read the live workflow state and identify the active phase plus the next downstream role.
- Confirm the active phase still matches the source plan and current repo reality.
- Check for immediate blockers, missing prerequisites, or stale assumptions before dispatching work.
- Tighten the active phase scope if needed, but keep it consistent with the source plan.
- Confirm or refine the active phase `Read First`, `Automated Test Expectation`, `Test Files`, `Test Cases To Cover`, `No-Test Rationale`, `Validation Modes`, `Runtime Targets`, `Evidence Required`, and `Manual Verification Follow-Up` sections before dispatching work.
- Ask the project manager before inventing undocumented product intent, user-facing behavior, creative direction, acceptance criteria, data contracts, or platform assumptions.
- Ask for project manager assistance when validation needs a simulator, physical device, account, credential, service, fixture, or human-only check that is not currently available.
- Write exactly one prompt for the next downstream agent.
- Update `workflow-state.yaml` and the active `run-log.md` so the workflow can pause and resume cleanly.

## Project Manager Collaboration

- Project manager role: `user`.
- Question policy: Ask the project manager before choosing an undocumented app framework, backend provider, auth/privacy posture, data retention rule, production domain, GitHub organization/repo visibility, CI requirements, UX copy outside the design docs, or acceptance criteria not covered by the existing files.
- Manual-assist policy: Ask the project manager for missing credentials, Gemini API keys, Supabase/Firebase/Cloudflare access, GitHub repo access, GitHub Actions secrets, seed-data confirmation, domain access, or human-only garden-state verification.
- Decision recording: Record PM answers and manual-assist results in the active run log; update phase docs or workflow-state.yaml when an answer changes durable scope.

Ask one to three focused questions when project-manager input would materially change scope, user experience, acceptance criteria, runtime setup, or validation confidence. If the phase is execution-ready, proceed without unnecessary questions.

## Subagent Dispatch Policy

- Prefer subagents: `True`.
- Fork full master context by default: `False`.
- One downstream agent at a time: `True`.
- Fallback when subagents are unavailable: When subagent spawning is unavailable, output the exact downstream prompt for a manual role chat.
- When spawning a subagent, set its model and reasoning effort from the table below unless an escalation rule applies.

| Role | Default Model | Reasoning Effort |
| --- | --- | --- |
| `master-developer` | `gpt-5.5` | `xhigh` |
| `developer` | `gpt-5.4` | `high` |
| `tester` | `gpt-5.4` | `high` |
| `researcher` | `gpt-5.4` | `high` |

Escalation rules:

- Use gpt-5.5 high for cross-phase architecture, backend provider selection, Gemini structured-output debugging, security-sensitive storage work, or final integration review.
- Use gpt-5.5 xhigh only for master-level recovery or high-risk acceptance decisions.

## Downstream Prompt Shape

- `Read First`: the smallest viable seed set, usually no more than `6` items.
- `Task`: one short paragraph or a few bullets.
- `Constraints`: only the hard scope boundaries that matter for the active slice.
- `Automated Tests`: expected test additions or updates, likely test files, focused test cases, or the no-test rationale.
- `Validation`: the exact validation modes, runtime targets, evidence requirements, test commands, and any manual follow-up.
- `Allowed Discovery`: one short line reminding the agent how far it may explore from the read-first files.
- `Completion Checklist`: only the signals needed to hand control back.

## Git Policy

- Git available: `False`
- Working branch target: `feat/garden-tracker-creation`
- Commit mode: `manual_or_phase_acceptance_when_repo_exists`
- Push mode: `manual_when_repo_exists`
- PR mode: `manual_when_repo_exists`
- Branch bootstrap status: `plan is not inside a git repository`

- Stable workflow files to track by default: `workflow-plan.md`, `start-master-developer-chat.md`, `agents/*.md`, `phases/*/phase.md`
- Volatile workflow files to avoid committing by default: `workflow-state.yaml`, `phases/*/run-log.md`

## Guardrails

- Do not implement, test, or research the phase yourself unless the workflow explicitly changes your role.
- Do not prewrite prompts for later phases or later downstream steps.
- Downstream prompts should not repeat long workflow background or long file inventories when a smaller seed packet will do.
- When spawning a subagent, send the compact runtime prompt and referenced files instead of forking full chat history unless the active task genuinely requires it.
- Every downstream agent must return control to `master-developer` when done or blocked.
- Keep branch, commit, push, and PR decisions under `master-developer` ownership unless the workflow explicitly changes that rule.
- If the active phase is not ready for handoff, keep the state at `ready_for_master_developer` or `blocked` and explain why.

## Output Format

- `Readiness`: one short paragraph.
- `PM question`: the focused question to ask now, or `none`.
- `State updates`: bullets for any edits made to `workflow-state.yaml`, the active `phase.md`, or the active `run-log.md`.
- `Git status`: one short line about whether a git checkpoint decision is needed now.
- `Next agent`: the role to receive the handoff, or `blocked`.
- `Dispatch`: whether to spawn a subagent or use manual-chat fallback.
- `Prompt`: the exact prompt for that next agent. If blocked or waiting on PM input, replace this with the blocker or PM question that needs resolution.
