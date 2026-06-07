# Phase 6: Dashboard Plant Matrix and Container Zone

## Goal

Build the dashboard view using live seed data, reusable plant cards, plant rows, stat pills, quick-action controls, alert chips, and moisture dryout bars.

## Depends On

- Phase 5: Design System and App Shell UI

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Render Ground Plot cards and Container Zone rows from the domain data rather than hardcoded HTML.
- Implement PlantCard, PlantRow, StatPill, QuickActionButton, AlertChip, and Moisture Dryout Bar components.
- Wire plant selection and navigation only enough to open the selected plant in the existing shell.

## Deliverables

- Data-driven dashboard matrix
- Container moisture indicators
- Plant selection behavior and selected state

## Files Or Areas To Touch

- src/components/PlantCard.*
- src/components/PlantRow.*
- src/components/MoistureDryoutBar.*
- src/views/Dashboard.*
- tests/ui/dashboard.spec.*

## Read First

- 02-component-library.md
- garden_tracker_responsive_mockup.html
- src/domain/
- src/repositories/
- src/components/
- tests/ui/dashboard.spec.*

## Exit Criteria

- Dashboard renders all seed plants grouped by Ground Plot and Container Zone.
- Status accents, stat pills, dryout bars, and quick-action buttons match the design specs.
- Opening a plant selects the correct record without triggering child button navigation.

## Automated Test Expectation

Add browser/component tests for data-driven dashboard rendering, plant selection, child button stop-propagation, and container dryout states.

## Test Files

- tests/ui/dashboard.spec.*
- tests/components/plant-card.test.*

## Test Cases To Cover

- All June 6 seed plants appear in the correct zone.
- Container plants show moisture bars with low, mid, and high states from deterministic dryout input.
- Clicking a plant opens/selects it; clicking a quick action does not open the plant detail by accident.

## No-Test Rationale

None. If automated tests are not useful for this phase, record the rationale here before accepting the phase.

## Validation Modes

- `browser-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Load the live UI in a runtime and verify the main happy path for the active slice.
- `interaction-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Drive a real interaction flow end to end and note visible regressions, console issues, or broken state.
- `unit-regression`: preferred tools `shell`; default evidence command output. Run the existing focused automated tests that cover the active slice before widening scope.

## Runtime Targets

- http://localhost:3000

## Evidence Required

- test output
- screenshot
- command output

## Allowed Discovery

Inspect component and dashboard files plus immediate domain/repository imports only.

## Test Commands

- npm test -- plant-card
- npm run test:e2e -- dashboard
- npm run build

## Manual Verification Follow-Up

- Review desktop and mobile dashboard screenshots for text clipping and token drift.

## Project Manager Questions

- None currently known. Ask only if product intent, acceptance criteria, or runtime setup is still underspecified.

## Human Assistance Triggers

- None currently known. Add device, simulator, credential, account, fixture, or manual setup needs here before validation if they appear.

## Master Developer Review Focus

Confirm that Dashboard Plant Matrix and Container Zone is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only Dashboard Plant Matrix and Container Zone. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only Dashboard Plant Matrix and Container Zone using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Reusable dashboard components
- Plant selection behavior
- Data-driven dashboard rendering
