# Phase 10: Medium and Seasonal Alert Cycles

## Goal

Implement staking, cantaloupe trellis training, dryout, and hammock trigger workflows from the remaining backlog.

## Depends On

- Phase 9: High-Priority Garden Workflows

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Add tomato support staking warning cycle for plants exceeding 5 feet.
- Add cantaloupe trellis training alerts for the 3 ft and 1 ft vines.
- Add cantaloupe hammock trigger when fruit logs transition from Baby Set to Active Sizing.
- Refine container accelerated dryout warnings and task generation.

## Deliverables

- Medium-priority deterministic alert cycles
- Seasonal cantaloupe trigger behavior
- Task generation or task-surfacing updates
- Tests for threshold and transition behavior

## Files Or Areas To Touch

- src/domain/gardenRules.*
- src/views/Dashboard.*
- src/views/Tasks.*
- tests/domain/garden-rules.test.*
- tests/ui/alert-cycles.spec.*

## Read First

- garden_tracker_spec.md
- 02-component-library.md
- src/domain/gardenRules.*
- src/views/Tasks.*
- tests/domain/garden-rules.test.*
- tests/ui/alert-cycles.spec.*

## Exit Criteria

- Cherry and Brandywine show support warnings while non-threshold plants do not.
- Cantaloupe trellis guidance appears for current vine lengths.
- Baby Set to Active Sizing transition creates a hammock support task.
- Container dryout warnings match the defined percent thresholds.

## Automated Test Expectation

Add unit and interaction tests for staking thresholds, cantaloupe task transitions, and container dryout alert thresholds.

## Test Files

- tests/domain/garden-rules.test.*
- tests/ui/alert-cycles.spec.*

## Test Cases To Cover

- 5 ft and 6 ft tomato heights trigger support alerts.
- 4.5 ft Beefsteak does not trigger the >5 ft alert.
- Cantaloupe Active Sizing state creates a hammock task once.
- Dryout percentages >75 and >95 render warning and danger states.

## No-Test Rationale

None. If automated tests are not useful for this phase, record the rationale here before accepting the phase.

## Validation Modes

- `unit-regression`: preferred tools `shell`; default evidence command output. Run the existing focused automated tests that cover the active slice before widening scope.
- `interaction-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Drive a real interaction flow end to end and note visible regressions, console issues, or broken state.
- `build-health`: preferred tools `shell`; default evidence command output. Run the narrowest compile, typecheck, or package-health commands that prove the slice still builds.

## Runtime Targets

- http://localhost:3000

## Evidence Required

- command output
- test output
- screenshot

## Allowed Discovery

Keep changes within rule generation, dashboard/task surfacing, and nearby tests.

## Test Commands

- npm test -- garden-rules
- npm run test:e2e -- alert-cycles
- npm run build

## Manual Verification Follow-Up

- None currently required. Add a follow-up here if the phase cannot be fully verified in-agent.

## Project Manager Questions

- Confirm whether generated tasks should be auto-created in the Tasks view or displayed only as alert chips until the user acknowledges them.

## Human Assistance Triggers

- None currently known. Add device, simulator, credential, account, fixture, or manual setup needs here before validation if they appear.

## Master Developer Review Focus

Confirm that Medium and Seasonal Alert Cycles is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only Medium and Seasonal Alert Cycles. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only Medium and Seasonal Alert Cycles using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Complete deterministic backlog coverage
- Task and alert behavior for seasonal workflows
