# Phase 3: Domain Model, Seed Data, and Deterministic Engine

## Goal

Encode plants, logs, care metadata, seed garden state, and deterministic rule functions that future UI and backend phases depend on.

## Depends On

- Phase 2: Stack and Project Foundation

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Represent plants, garden logs, care rules, zones, statuses, heights, current seed metrics, and backlog task state in typed code.
- Implement pure deterministic functions for next-water dates, container dryout, height-based staking warnings, pollination countdown states, harvest tally updates, and cantaloupe hammock trigger states.
- Do not wire persistence, full UI, or Gemini calls in this phase.

## Deliverables

- Typed domain model and seed data copied from the June 6, 2026 spec
- Pure deterministic garden rule engine
- Unit tests for rule edge cases and seed-data integrity

## Files Or Areas To Touch

- src/domain/
- src/data/
- src/lib/gardenRules.*
- tests/domain/

## Read First

- garden_tracker_spec.md
- 02-component-library.md
- src/
- tests/
- tests/domain/garden-rules.test.*
- tests/domain/seed-data.test.*

## Exit Criteria

- All plant seed records match the spec's real garden state.
- Rule functions are pure, time-injectable, and covered by focused tests.
- No AI or network dependency is needed for deterministic mutations.

## Automated Test Expectation

Add focused unit tests for every deterministic rule and a seed-data integrity test for the current garden state.

## Test Files

- tests/domain/garden-rules.test.*
- tests/domain/seed-data.test.*

## Test Cases To Cover

- Watering computes next warning state from injected current time and AI care interval.
- Pollination states transition across <48h, 48-72h, and >72h boundaries.
- Tomatoes at or above 5 ft emit staking warnings while Beefsteak at 4.5 ft does not.
- Cantaloupe Baby Set to Active Sizing emits hammock support task.

## No-Test Rationale

None. If automated tests are not useful for this phase, record the rationale here before accepting the phase.

## Validation Modes

- `unit-regression`: preferred tools `shell`; default evidence command output. Run the existing focused automated tests that cover the active slice before widening scope.
- `build-health`: preferred tools `shell`; default evidence command output. Run the narrowest compile, typecheck, or package-health commands that prove the slice still builds.

## Runtime Targets

- No explicit runtime targets listed. Add them before live validation if the phase needs them.

## Evidence Required

- command output

## Allowed Discovery

Follow generated domain imports and nearby tests only.

## Test Commands

- npm test -- garden-rules
- npm test -- seed-data
- npm run build

## Manual Verification Follow-Up

- PM should verify the seed-data snapshot if the live garden state has changed since June 6, 2026.

## Project Manager Questions

- Confirm whether seed data should remain fixed to June 6, 2026 for prototype parity or be updated before implementation begins.

## Human Assistance Triggers

- Provide updated plant metrics if the current garden state should replace the spec snapshot.

## Master Developer Review Focus

Confirm that Domain Model, Seed Data, and Deterministic Engine is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only Domain Model, Seed Data, and Deterministic Engine. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only Domain Model, Seed Data, and Deterministic Engine using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Stable typed domain model
- Pure rule functions
- Seed data consumed by UI and persistence
