# Phase 4: Local Persistence and Repository Contract

## Goal

Create the persistence boundary for plants, garden logs, task state, chat messages, and AI patches so the UI can mutate data without knowing the final backend.

## Depends On

- Phase 3: Domain Model, Seed Data, and Deterministic Engine

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Define repository interfaces and a local implementation backed by browser storage or local database fixtures.
- Implement CRUD for plants and garden logs, task state persistence, plant-scoped chat history, and AI patch application.
- Keep production Supabase/Firebase implementation and Gemini network calls out of this phase.

## Deliverables

- Repository abstraction for plants, logs, tasks, chat messages, and patches
- Local persistence adapter seeded from the domain fixtures
- Tests proving local mutations persist and rehydrate

## Files Or Areas To Touch

- src/repositories/
- src/data/
- src/lib/persistence.*
- tests/repositories/

## Read First

- garden_tracker_spec.md
- src/domain/
- src/data/
- tests/domain/
- tests/repositories/local-garden-repository.test.*

## Exit Criteria

- Routine mutations can be persisted and reloaded locally.
- AI patch payloads can update allowed target fields through the same repository boundary.
- The repository contract is ready for a later backend adapter.

## Automated Test Expectation

Add unit or integration tests for repository CRUD, log append behavior, task persistence, chat scoping, and patch allow-list enforcement.

## Test Files

- tests/repositories/local-garden-repository.test.*

## Test Cases To Cover

- Adding a watering log persists and rehydrates for one plant.
- Harvest count increments atomically with a matching garden_logs entry.
- Task checkbox state persists under the garden_tasks_state equivalent.
- AI patches can update approved care-rule fields and reject unknown fields.

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

Follow domain and adapter imports only as needed.

## Test Commands

- npm test -- repository
- npm run build

## Manual Verification Follow-Up

- None currently required. Add a follow-up here if the phase cannot be fully verified in-agent.

## Project Manager Questions

- Confirm whether a no-login personal app is acceptable for the first production version or whether authentication must be added before backend persistence.

## Human Assistance Triggers

- None currently known. Add device, simulator, credential, account, fixture, or manual setup needs here before validation if they appear.

## Master Developer Review Focus

Confirm that Local Persistence and Repository Contract is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only Local Persistence and Repository Contract. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only Local Persistence and Repository Contract using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Repository API
- Local persistence behavior
- Patch application contract
