# Phase 14: Accessibility, Responsive, and Visual Polish

## Goal

Harden the complete UI against design-system drift, accessibility issues, mobile layout problems, and interaction regressions.

## Depends On

- Phase 13: Production Backend, Storage, and Security

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Audit and refine typography, tokens, borders, focus states, touch targets, text wrapping, dark mode, and responsive breakpoints.
- Add accessibility attributes where missing and fix keyboard navigation defects.
- Keep feature expansion out of this phase.

## Deliverables

- Responsive polish fixes
- Accessibility fixes
- Visual regression or screenshot coverage for key views
- Reduced console/runtime warnings

## Files Or Areas To Touch

- src/styles/
- src/components/
- src/views/
- tests/ui/
- tests/accessibility/

## Read First

- 01-design-system.md
- 02-component-library.md
- garden_tracker_responsive_mockup.html
- src/styles/
- tests/ui/
- tests/ui/responsive.spec.*

## Exit Criteria

- Dashboard, Plant Detail, Tasks, and Diagnostics views are usable at mobile and desktop widths.
- Text does not overlap or clip in core cards, rows, buttons, chat, task items, and alerts.
- Keyboard focus and screen-reader labels meet the design-system accessibility rules.
- Dark mode semantic tokens remain legible.

## Automated Test Expectation

Add or update browser, screenshot, and accessibility tests for the full UI surface; no feature-only tests are required beyond regression coverage for fixes.

## Test Files

- tests/ui/responsive.spec.*
- tests/accessibility/a11y.spec.*

## Test Cases To Cover

- Core views render at mobile and desktop widths without overlapping text.
- Interactive controls have accessible names and visible focus state.
- Dark mode semantic alert and AI patch surfaces meet basic contrast expectations.
- No console errors appear during the dashboard-to-detail-to-tasks flow.

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

Inspect styling, component markup, and tests required to fix visible/a11y defects only.

## Test Commands

- npm run test:e2e -- responsive
- npm run test:e2e -- a11y
- npm run build

## Manual Verification Follow-Up

- PM should review desktop and mobile screenshots for design acceptance.

## Project Manager Questions

- None currently known. Ask only if product intent, acceptance criteria, or runtime setup is still underspecified.

## Human Assistance Triggers

- None currently known. Add device, simulator, credential, account, fixture, or manual setup needs here before validation if they appear.

## Master Developer Review Focus

Confirm that Accessibility, Responsive, and Visual Polish is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only Accessibility, Responsive, and Visual Polish. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only Accessibility, Responsive, and Visual Polish using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Polished UI baseline
- Responsive and a11y validation evidence
