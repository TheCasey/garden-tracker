# Phase 8: Routine Log Mutations and Task State

## Goal

Wire deterministic quick actions and task checkboxes to repository mutations with instant UI updates and no AI dependency.

## Depends On

- Phase 7: Plant Detail Care Metrics and Milestones

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Implement Water, Harvest, Log, and task checkbox interactions through the repository.
- Reflect next water calculations, harvest tallies, log rows, and task completion state immediately in the UI.
- Keep specialized pollination, Black Tomato bloom, and Gemini diagnostics out of this phase.

## Deliverables

- Functional routine mutation controls
- Inline or modal log-entry flow
- Task view persisted from the backlog state
- Tests for instant deterministic updates

## Files Or Areas To Touch

- src/views/Dashboard.*
- src/views/Tasks.*
- src/components/QuickActionButton.*
- src/components/TaskCheckbox.*
- src/repositories/
- tests/ui/routine-actions.spec.*

## Read First

- garden_tracker_spec.md
- 02-component-library.md
- src/repositories/
- src/domain/
- src/views/
- tests/ui/routine-actions.spec.*

## Exit Criteria

- Watering writes a Watering log, updates the next-water state, and marks the control done.
- Harvest increments total_harvest_count and writes a garden log without invoking AI.
- Task checkbox state persists across reloads.
- Inline note entry writes a garden log for the active plant.

## Automated Test Expectation

Add interaction tests and repository tests covering routine mutations, reload persistence, and no accidental AI/network calls.

## Test Files

- tests/ui/routine-actions.spec.*
- tests/repositories/local-garden-repository.test.*

## Test Cases To Cover

- Watering a plant adds a log and updates visible watering state instantly.
- Harvesting Green Beans increments the harvest count and persists after reload.
- Task checkbox toggles both visual state and persisted state.
- Routine actions do not call the Gemini endpoint.

## No-Test Rationale

None. If automated tests are not useful for this phase, record the rationale here before accepting the phase.

## Validation Modes

- `interaction-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Drive a real interaction flow end to end and note visible regressions, console issues, or broken state.
- `unit-regression`: preferred tools `shell`; default evidence command output. Run the existing focused automated tests that cover the active slice before widening scope.
- `browser-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Load the live UI in a runtime and verify the main happy path for the active slice.

## Runtime Targets

- http://localhost:3000

## Evidence Required

- test output
- screenshot
- command output

## Allowed Discovery

Inspect action handlers, repository methods, and task view files only as needed.

## Test Commands

- npm test -- repository
- npm run test:e2e -- routine-actions
- npm run build

## Manual Verification Follow-Up

- None currently required. Add a follow-up here if the phase cannot be fully verified in-agent.

## Project Manager Questions

- Confirm whether harvest entries should require a count/weight input immediately or allow one-tap default logging first.

## Human Assistance Triggers

- None currently known. Add device, simulator, credential, account, fixture, or manual setup needs here before validation if they appear.

## Master Developer Review Focus

Confirm that Routine Log Mutations and Task State is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only Routine Log Mutations and Task State. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only Routine Log Mutations and Task State using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Working routine mutation path
- Task persistence path
- Log rendering and update behavior
