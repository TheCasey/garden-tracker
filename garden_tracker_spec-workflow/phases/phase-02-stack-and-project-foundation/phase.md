# Phase 2: Stack and Project Foundation

## Goal

Create the initial application skeleton and lock the runtime, package, lint, test, and environment contract for the rest of the build.

## Depends On

- Phase 1: Source Control, GitHub, and Operations Setup

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Choose or confirm the frontend framework, package manager, TypeScript policy, test stack, and local dev command.
- Create the app shell, config files, env validation, and placeholder routes without implementing feature behavior.
- Keep backend provider integration, Gemini calls, and full UI composition out of this phase.

## Deliverables

- Runnable web app scaffold
- Package scripts for dev, build, lint, unit tests, and browser tests
- Environment variable schema aligned with .env.example
- Project README or setup note for local startup

## Files Or Areas To Touch

- package.json
- src/
- tests/
- .env.example
- README.md

## Read First

- garden_tracker_spec.md
- 01-design-system.md
- 02-component-library.md
- garden_tracker_responsive_mockup.html
- .env.example
- tests/app-shell.spec.*

## Exit Criteria

- A developer can install dependencies, start the local app, and see a minimal Garden Tracker shell.
- Build, lint, and the initial test command execute successfully.
- The selected stack and unresolved PM decisions are recorded in the run log.

## Automated Test Expectation

Add a minimal smoke test proving the app shell renders and the configured test runner works.

## Test Files

- tests/app-shell.spec.*
- src/**/*.test.*

## Test Cases To Cover

- The app shell renders Garden Tracker without runtime errors.
- Environment validation reports missing required values clearly without exposing secrets.

## No-Test Rationale

None. If automated tests are not useful for this phase, record the rationale here before accepting the phase.

## Validation Modes

- `build-health`: preferred tools `shell`; default evidence command output. Run the narrowest compile, typecheck, or package-health commands that prove the slice still builds.
- `unit-regression`: preferred tools `shell`; default evidence command output. Run the existing focused automated tests that cover the active slice before widening scope.
- `browser-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Load the live UI in a runtime and verify the main happy path for the active slice.

## Runtime Targets

- http://localhost:3000

## Evidence Required

- command output
- test output
- screenshot

## Allowed Discovery

Read the existing planning files and inspect generated framework files only as needed to wire scripts and smoke tests.

## Test Commands

- npm run build
- npm test
- npm run test:e2e

## Manual Verification Follow-Up

- None currently required. Add a follow-up here if the phase cannot be fully verified in-agent.

## Project Manager Questions

- Confirm the preferred app stack if the repo does not already imply one: Next.js, Vite React, or another web framework.
- Confirm whether Supabase or Firebase should be the first production backend target.
- Confirm whether the local-first prototype may use browser storage before the backend phase lands.

## Human Assistance Triggers

- None currently known. Add device, simulator, credential, account, fixture, or manual setup needs here before validation if they appear.

## Master Developer Review Focus

Resolve stack and backend direction before dispatching developer. Do not let phase 1 drift into feature implementation.

## Runtime Handoff Notes

- `developer`: Bootstrap the project and prove the toolchain works; keep feature UI minimal.
- `tester`: Validate setup from a clean command path and capture the first browser screenshot.

## Next Phase Inputs

- Runnable app foundation
- Documented commands
- Confirmed backend direction or recorded PM blocker
