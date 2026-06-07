# Phase 5: Design System and App Shell UI

## Goal

Implement the Garden Tracker visual system, responsive shell, topbar, alert banner, sidebar, and view switching from the reference mockup.

## Depends On

- Phase 4: Local Persistence and Repository Contract

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Create global tokens, typography imports, dark-mode token overrides, Tabler icon loading, accessibility focus rules, and shell layout.
- Implement topbar, nav tabs, persistent harvest hygiene alert, desktop sidebar, mobile view switching, and shell landmarks.
- Do not build the full dashboard cards, plant detail content, or task behavior yet.

## Deliverables

- Design-token CSS implementation
- Responsive app shell matching the design references
- Initial navigation between Dashboard, Plant, and Tasks views

## Files Or Areas To Touch

- src/styles/
- src/components/AppShell.*
- src/components/Topbar.*
- src/components/AlertBanner.*
- src/components/Sidebar.*
- tests/ui/

## Read First

- 01-design-system.md
- 02-component-library.md
- garden_tracker_responsive_mockup.html
- src/
- tests/ui/app-shell.spec.*
- tests/ui/responsive-shell.spec.*

## Exit Criteria

- The app shell visually follows the organic-utilitarian design system.
- Desktop shows the sidebar; mobile uses tabbed view switching without overlapping text.
- The hygiene alert is persistent and non-dismissible.

## Automated Test Expectation

Add browser or component tests proving shell landmarks, tab switching, sidebar breakpoint behavior, and persistent alert rendering.

## Test Files

- tests/ui/app-shell.spec.*
- tests/ui/responsive-shell.spec.*

## Test Cases To Cover

- Dashboard, Plant, and Tasks tabs switch the active view.
- The hygiene alert is present on every view.
- Sidebar is visible at desktop width and absent below the mobile breakpoint.
- Keyboard focus is visible on interactive shell controls.

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

Start from design docs and generated shell components; inspect adjacent styling only as needed.

## Test Commands

- npm run build
- npm run test:e2e -- app-shell

## Manual Verification Follow-Up

- Compare one desktop and one mobile screenshot against the responsive mockup for obvious layout drift.

## Project Manager Questions

- None currently known. Ask only if product intent, acceptance criteria, or runtime setup is still underspecified.

## Human Assistance Triggers

- None currently known. Add device, simulator, credential, account, fixture, or manual setup needs here before validation if they appear.

## Master Developer Review Focus

Confirm that Design System and App Shell UI is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only Design System and App Shell UI. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only Design System and App Shell UI using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Reusable shell components
- Global design tokens
- Responsive navigation foundation
