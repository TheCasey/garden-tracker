# Garden Tracker Creation Workflow

Source plan: `garden_tracker_spec.md`

## Summary

Create the Garden Tracker application from the existing product specification, design system, component library, and responsive mockup in bounded implementation phases with validation after each slice.

## Roles

- `master-developer`: Own orchestration for the whole creation workflow: resolve PM decisions, keep phases narrow, write downstream prompts, review evidence, and advance state.
- `developer`: Implement only the active Garden Tracker phase and add focused automated tests for behavior changes.
- `tester`: Validate only the active phase with the declared build, unit, API, browser, interaction, accessibility, or manual evidence.
- `researcher`: Answer bounded technical blockers such as Gemini schema details, Cloudflare deployment fit, or backend service tradeoffs without implementing.

## Phase Map

| Phase | Downstream Roles | Validation Modes | Depends On | Status |
| --- | --- | --- | --- | --- |
| [Phase 1: Source Control, GitHub, and Operations Setup](phases/phase-01-source-control-github-and-operations-setup/phase.md) | `developer -> tester` | `code-review`, `build-health`, `manual-qa` | None | `completed` |
| [Phase 2: Stack and Project Foundation](phases/phase-02-stack-and-project-foundation/phase.md) | `developer -> tester` | `build-health`, `unit-regression`, `browser-smoke` | Phase 1: Source Control, GitHub, and Operations Setup | `completed` |
| [Phase 3: Domain Model, Seed Data, and Deterministic Engine](phases/phase-03-domain-model-seed-data-and-deterministic-engine/phase.md) | `developer -> tester` | `unit-regression`, `build-health` | Phase 2: Stack and Project Foundation | `completed` |
| [Phase 4: Local Persistence and Repository Contract](phases/phase-04-local-persistence-and-repository-contract/phase.md) | `developer -> tester` | `unit-regression`, `build-health` | Phase 3: Domain Model, Seed Data, and Deterministic Engine | `completed` |
| [Phase 5: Design System and App Shell UI](phases/phase-05-design-system-and-app-shell-ui/phase.md) | `developer -> tester` | `browser-smoke`, `interaction-smoke`, `build-health` | Phase 4: Local Persistence and Repository Contract | `in_progress` |
| [Phase 6: Dashboard Plant Matrix and Container Zone](phases/phase-06-dashboard-plant-matrix-and-container-zone/phase.md) | `developer -> tester` | `browser-smoke`, `interaction-smoke`, `unit-regression` | Phase 5: Design System and App Shell UI | `pending` |
| [Phase 7: Plant Detail Care Metrics and Milestones](phases/phase-07-plant-detail-care-metrics-and-milestones/phase.md) | `developer -> tester` | `browser-smoke`, `interaction-smoke`, `build-health` | Phase 6: Dashboard Plant Matrix and Container Zone | `pending` |
| [Phase 8: Routine Log Mutations and Task State](phases/phase-08-routine-log-mutations-and-task-state/phase.md) | `developer -> tester` | `interaction-smoke`, `unit-regression`, `browser-smoke` | Phase 7: Plant Detail Care Metrics and Milestones | `pending` |
| [Phase 9: High-Priority Garden Workflows](phases/phase-09-high-priority-garden-workflows/phase.md) | `developer -> tester` | `unit-regression`, `interaction-smoke`, `browser-smoke` | Phase 8: Routine Log Mutations and Task State | `pending` |
| [Phase 10: Medium and Seasonal Alert Cycles](phases/phase-10-medium-and-seasonal-alert-cycles/phase.md) | `developer -> tester` | `unit-regression`, `interaction-smoke`, `build-health` | Phase 9: High-Priority Garden Workflows | `pending` |
| [Phase 11: Gemini Care Metadata Onboarding](phases/phase-11-gemini-care-metadata-onboarding/phase.md) | `developer -> tester` | `unit-regression`, `api-smoke`, `build-health` | Phase 10: Medium and Seasonal Alert Cycles | `pending` |
| [Phase 12: Plant Diagnostics Chat and AI Patches](phases/phase-12-plant-diagnostics-chat-and-ai-patches/phase.md) | `developer -> tester` | `interaction-smoke`, `api-smoke`, `unit-regression`, `browser-smoke` | Phase 11: Gemini Care Metadata Onboarding | `pending` |
| [Phase 13: Production Backend, Storage, and Security](phases/phase-13-production-backend-storage-and-security/phase.md) | `developer -> tester` | `unit-regression`, `api-smoke`, `build-health`, `manual-qa` | Phase 12: Plant Diagnostics Chat and AI Patches | `pending` |
| [Phase 14: Accessibility, Responsive, and Visual Polish](phases/phase-14-accessibility-responsive-and-visual-polish/phase.md) | `developer -> tester` | `browser-smoke`, `interaction-smoke`, `build-health` | Phase 13: Production Backend, Storage, and Security | `pending` |
| [Phase 15: Cloudflare Deployment and Operations](phases/phase-15-cloudflare-deployment-and-operations/phase.md) | `developer -> tester` | `build-health`, `api-smoke`, `browser-smoke`, `manual-qa` | Phase 14: Accessibility, Responsive, and Visual Polish | `pending` |
| [Phase 16: Final Acceptance and Release Readiness](phases/phase-16-final-acceptance-and-release-readiness/phase.md) | `developer -> tester` | `unit-regression`, `api-smoke`, `browser-smoke`, `interaction-smoke`, `build-health`, `manual-qa` | Phase 15: Cloudflare Deployment and Operations | `pending` |

## Prompt Budget

- Downstream prompts should usually seed no more than `6` read-first files or docs.
- Downstream prompts should name only the files, routes, tests, or runtime targets needed to start the active slice.
- Downstream agents may discover adjacent files using the workflow allowed-discovery rule instead of preloading large background bundles.
- `master-developer` should avoid pasting repeated workflow background once the downstream agent has the active phase packet.

## Human PM Collaboration

- Treat `user` as the project manager for product intent, acceptance criteria, manual setup, and human-only verification.
- Ask the project manager before guessing when the source plan or phase brief leaves user-facing behavior, creative direction, UX copy, data contracts, platform assumptions, or acceptance criteria underspecified.
- If a simulator, physical device, account, credential, service, fixture, or human-only check blocks validation, ask for project manager assistance instead of treating the phase as conclusively failed.
- Record project manager answers and manual-assist results in the active `run-log.md`; update the phase brief or workflow state when the answer changes durable scope.

## Subagent Dispatch

- Prefer subagents for downstream `developer`, `tester`, and bounded `researcher` work when the environment supports them.
- Spawn one downstream agent at a time for the active phase unless a bounded researcher task can run independently.
- When spawning a subagent, set its model and reasoning effort from the workflow model policy unless an escalation rule applies.
- Do not fork the full master-developer chat context by default. Send compact prompts that reference workflow files and the active read-first packet.
- If subagents are unavailable, output the exact downstream prompt so the project manager can start a manual role chat.

| Role | Default Model | Reasoning Effort |
| --- | --- | --- |
| `master-developer` | `gpt-5.5` | `xhigh` |
| `developer` | `gpt-5.4` | `high` |
| `tester` | `gpt-5.4` | `high` |
| `researcher` | `gpt-5.4` | `high` |

Escalation rules:

- Use gpt-5.5 high for cross-phase architecture, backend provider selection, Gemini structured-output debugging, security-sensitive storage work, or final integration review.
- Use gpt-5.5 xhigh only for master-level recovery or high-risk acceptance decisions.

## Automated Test Policy

- Behavior-changing phases should include an automated test expectation, likely test files, focused test cases, and narrow test commands.
- `developer` owns implementation plus focused automated tests for the active slice.
- `tester` owns independent verification that the tests run and would catch the intended regression or behavior break.
- If automated tests are not useful for a phase, `master-developer` must record a no-test rationale and alternate validation evidence before accepting the phase.

## Validation Strategy

- `master-developer` must confirm or refine each phase `Read First`, `Automated Test Expectation`, `Test Files`, `Test Cases To Cover`, `No-Test Rationale`, `Validation Modes`, `Runtime Targets`, `Evidence Required`, and `Manual Verification Follow-Up` before dispatching work.
- `tester` should treat compile-only checks as sufficient only when the phase guidance explicitly keeps validation that narrow.
- Phase-local validation should stay attached to the implementation slice instead of drifting into a single final QA pass.
- Default allowed discovery rule: Start with the listed planning or implementation files, then follow imports, routes, adjacent tests, and nearby config only as needed for the active phase.

| Mode | Preferred Tools | Default Evidence | Use When |
| --- | --- | --- | --- |
| `api-smoke` | `shell`, `curl` | request or response summary, command output | Exercise the live endpoint or local HTTP contract for the active slice and confirm the expected shape. |
| `browser-smoke` | `playwright`, `browser-use` | test output, screenshot | Load the live UI in a runtime and verify the main happy path for the active slice. |
| `build-health` | `shell` | command output | Run the narrowest compile, typecheck, or package-health commands that prove the slice still builds. |
| `code-review` | `shell` | code references | Use static inspection only when the phase is contract-only, config-only, or blocked from runtime checks. |
| `extension-smoke` | `playwright`, `computer-use` | test output, screenshot | Validate the browser extension in a live browser context, including load, install, and core interaction paths. |
| `interaction-smoke` | `playwright`, `browser-use` | test output, screenshot | Drive a real interaction flow end to end and note visible regressions, console issues, or broken state. |
| `ios-device-smoke` | `xcodebuild`, `connected device`, `human` | device test note, screenshot or screen recording | Validate the active slice on a connected iOS device when simulator coverage is unavailable or device-specific confidence matters. |
| `ios-simulator-smoke` | `xcodebuild`, `simctl`, `computer-use` | test output, screenshot | Validate the active slice in the iOS simulator or equivalent runtime instead of relying on static review alone. |
| `manual-qa` | `human` | manual verification note | Document the manual follow-up that a human must complete before final merge or release confidence. |
| `unit-regression` | `shell` | command output | Run the existing focused automated tests that cover the active slice before widening scope. |

## Git Workflow

- Git availability: `plan is not inside a git repository`

- Branch template: `feat/garden-tracker-creation`
- Branch in use: `feat/garden-tracker-creation`
- Automatic branch bootstrap: `True`
- Require clean start for branch bootstrap: `False`
- Commit mode: `manual_or_phase_acceptance_when_repo_exists`
- Push mode: `manual_when_repo_exists`
- PR mode: `manual_when_repo_exists`
- Runtime files tracked by default: `False`
- Stable workflow paths to track: `workflow-plan.md`, `start-master-developer-chat.md`, `agents/*.md`, `phases/*/phase.md`
- Volatile workflow paths to ignore or leave uncommitted: `workflow-state.yaml`, `phases/*/run-log.md`
- Commit message template: `{workflow_slug}: accept phase {phase_number} ({phase_slug})`

## Workflow Rules

- `master-developer` is the persistent orchestrator for the whole workflow.
- `workflow-state.yaml` is the source of truth for what should happen next.
- Each phase enters `ready_for_master_developer` before the first downstream handoff and after every downstream result.
- Each phase `role_sequence` is the expected downstream order under `master-developer` oversight.
- The scaffold does not prewrite downstream prompts. `master-developer` writes one runtime prompt at a time based on the live workflow state.
- Downstream agents should work only on the active phase and should return control to `master-developer` instead of handing off directly.
- `master-developer` owns branch, commit, push, and PR decisions for this workflow unless the workflow explicitly reassigns that responsibility.
- Agents should update the current phase `run-log.md` before moving the workflow forward.
- `researcher` may be inserted for a bounded blocker even if it was not the originally expected next role. Record the reason in `run-log.md` and `workflow-state.yaml`.
- Do not start a later phase while the current phase is `blocked` or still active.
