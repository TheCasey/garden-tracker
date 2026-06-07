# Phase 9: High-Priority Garden Workflows

## Goal

Implement the pollination tracker, Black Tomato bloom monitor, and persistent harvest hygiene behavior from the immediate backlog.

## Depends On

- Phase 8: Routine Log Mutations and Task State

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Build manual pollination tracking for squash and cucumber with 72-hour fruit-set countdown alerts.
- Build Black Tomato Blooms Open milestone toggle that pushes a morning electric toothbrush pollination tip.
- Verify the harvest hygiene alert is present across Ground Plot profiles and relevant dashboard/detail contexts.

## Deliverables

- Pollination tracker UI and state
- Black Tomato bloom milestone toggle and dashboard tip
- Ground Plot harvest hygiene alert behavior

## Files Or Areas To Touch

- src/domain/gardenRules.*
- src/views/Dashboard.*
- src/views/PlantDetail.*
- src/views/Tasks.*
- tests/ui/high-priority-workflows.spec.*

## Read First

- garden_tracker_spec.md
- 02-component-library.md
- src/domain/
- src/views/Dashboard.*
- src/views/PlantDetail.*
- tests/domain/garden-rules.test.*

## Exit Criteria

- Squash and cucumber pollination buttons set Manually Pollinated state and show the correct countdown chip.
- Countdown warning states update across the 48h and 72h boundaries from deterministic time input.
- Black Tomato bloom toggle creates the specified morning toothbrush pollination tip.
- Ground Plot hygiene alert remains visible where required.

## Automated Test Expectation

Add deterministic rule tests plus interaction tests for pollination countdown states, bloom toggle behavior, and hygiene alert coverage.

## Test Files

- tests/domain/garden-rules.test.*
- tests/ui/high-priority-workflows.spec.*

## Test Cases To Cover

- Pollination click creates a 72-hour armed alert for cucumber and squash.
- 48-hour and >72-hour pollination states render warning and danger chips respectively.
- Black Tomato bloom toggle emits the morning-hour electric toothbrush tip.
- Ground Plot plant detail pages show harvest hygiene guidance.

## No-Test Rationale

None. If automated tests are not useful for this phase, record the rationale here before accepting the phase.

## Validation Modes

- `unit-regression`: preferred tools `shell`; default evidence command output. Run the existing focused automated tests that cover the active slice before widening scope.
- `interaction-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Drive a real interaction flow end to end and note visible regressions, console issues, or broken state.
- `browser-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Load the live UI in a runtime and verify the main happy path for the active slice.

## Runtime Targets

- http://localhost:3000

## Evidence Required

- command output
- test output
- screenshot

## Allowed Discovery

Stay within garden rules, affected views, and adjacent tests.

## Test Commands

- npm test -- garden-rules
- npm run test:e2e -- high-priority-workflows
- npm run build

## Manual Verification Follow-Up

- PM may verify the wording and urgency of the pollination and hygiene guidance in the live UI.

## Project Manager Questions

- Confirm exact dashboard tip copy for Black Tomato if the component library wording is insufficient.

## Human Assistance Triggers

- None currently known. Add device, simulator, credential, account, fixture, or manual setup needs here before validation if they appear.

## Master Developer Review Focus

Confirm that High-Priority Garden Workflows is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only High-Priority Garden Workflows. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only High-Priority Garden Workflows using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Specialized immediate-backlog workflows
- Countdown rule coverage
- Alert coverage across dashboard and detail
