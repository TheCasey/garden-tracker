# Phase 7: Plant Detail Care Metrics and Milestones

## Goal

Build the plant detail view with selected-plant header, care rules grid, AI milestones, per-plant log summary, and responsive navigation behavior.

## Depends On

- Phase 6: Dashboard Plant Matrix and Container Zone

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Render selected plant details from repository data.
- Implement care metrics, milestone list, back navigation, and sidebar active state.
- Reserve the plant diagnostics chatbox for the later Gemini phase.

## Deliverables

- Data-driven plant detail view
- Care metrics and AI milestone components
- Mobile back navigation and desktop side-by-side behavior

## Files Or Areas To Touch

- src/views/PlantDetail.*
- src/components/CareGrid.*
- src/components/MilestonePanel.*
- src/components/Sidebar.*
- tests/ui/plant-detail.spec.*

## Read First

- garden_tracker_spec.md
- 02-component-library.md
- garden_tracker_responsive_mockup.html
- src/views/Dashboard.*
- src/domain/
- tests/ui/plant-detail.spec.*

## Exit Criteria

- Selecting every plant shows the correct detail name, zone, status, metrics, and milestones.
- Mobile back navigation returns to the dashboard cleanly.
- Desktop sidebar selection stays synchronized with the active plant.

## Automated Test Expectation

Add interaction tests for plant selection, mobile back behavior, care metric rendering, and sidebar active-state synchronization.

## Test Files

- tests/ui/plant-detail.spec.*

## Test Cases To Cover

- Cherry Tomatoes detail shows 6 ft, near-yield status, and care metrics.
- Switching from Cherry Tomatoes to Strawberry swaps the visible detail state.
- Back navigation returns mobile users to Dashboard without losing selected plant.

## No-Test Rationale

None. If automated tests are not useful for this phase, record the rationale here before accepting the phase.

## Validation Modes

- `browser-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Load the live UI in a runtime and verify the main happy path for the active slice.
- `interaction-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Drive a real interaction flow end to end and note visible regressions, console issues, or broken state.
- `build-health`: preferred tools `shell`; default evidence command output. Run the narrowest compile, typecheck, or package-health commands that prove the slice still builds.

## Runtime Targets

- http://localhost:3000

## Evidence Required

- test output
- screenshot
- command output

## Allowed Discovery

Follow selected plant state, shell, and detail component imports only.

## Test Commands

- npm run test:e2e -- plant-detail
- npm run build

## Manual Verification Follow-Up

- Review one plant detail screenshot for desktop and mobile against the mockup.

## Project Manager Questions

- None currently known. Ask only if product intent, acceptance criteria, or runtime setup is still underspecified.

## Human Assistance Triggers

- None currently known. Add device, simulator, credential, account, fixture, or manual setup needs here before validation if they appear.

## Master Developer Review Focus

Confirm that Plant Detail Care Metrics and Milestones is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only Plant Detail Care Metrics and Milestones. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only Plant Detail Care Metrics and Milestones using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Selected plant detail surface
- Care metrics rendering
- Responsive plant navigation
