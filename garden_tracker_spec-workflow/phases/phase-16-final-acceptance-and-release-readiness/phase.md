# Phase 16: Final Acceptance and Release Readiness

## Goal

Run the complete Garden Tracker flow end to end, close documentation gaps, and prepare a release-ready handoff.

## Depends On

- Phase 15: Cloudflare Deployment and Operations

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Exercise dashboard, plant detail, routine logs, task state, deterministic alerts, Gemini onboarding, diagnostics chat, AI patches, backend persistence, and deployment smoke paths.
- Fix only release-blocking defects and documentation gaps found during acceptance.
- Record unresolved manual follow-ups instead of expanding scope.

## Deliverables

- End-to-end acceptance evidence
- Release checklist and known limitations
- Updated setup/deployment documentation
- Final seed data and environment verification notes

## Files Or Areas To Touch

- README.md
- tests/e2e/
- src/
- workflow run logs

## Read First

- garden_tracker_spec.md
- workflow-plan.md
- README.md
- tests/e2e/
- src/
- tests/e2e/garden-tracker-critical-path.spec.*

## Exit Criteria

- A full user flow works from app load through plant selection, routine log mutation, task update, diagnostic prompt, optional patch, and persistence reload.
- Build, unit, API, and browser test suites pass or have documented acceptable exclusions.
- Manual PM acceptance items are recorded with concrete status.
- Release documentation describes setup, env, deployment, and current limitations.

## Automated Test Expectation

Add or update end-to-end tests for the complete critical path and rerun the relevant automated suite before acceptance.

## Test Files

- tests/e2e/garden-tracker-critical-path.spec.*
- tests/api/*.test.*
- tests/domain/*.test.*

## Test Cases To Cover

- Dashboard load to plant detail to watering log to reload persistence.
- Pollination tracker creates countdown alert and task visibility remains stable.
- Diagnostics chat mocked response renders patch and updates care metric.
- Production build serves the app shell and critical API routes.

## No-Test Rationale

None. If automated tests are not useful for this phase, record the rationale here before accepting the phase.

## Validation Modes

- `unit-regression`: preferred tools `shell`; default evidence command output. Run the existing focused automated tests that cover the active slice before widening scope.
- `api-smoke`: preferred tools `shell`, `curl`; default evidence request or response summary, command output. Exercise the live endpoint or local HTTP contract for the active slice and confirm the expected shape.
- `browser-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Load the live UI in a runtime and verify the main happy path for the active slice.
- `interaction-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Drive a real interaction flow end to end and note visible regressions, console issues, or broken state.
- `build-health`: preferred tools `shell`; default evidence command output. Run the narrowest compile, typecheck, or package-health commands that prove the slice still builds.
- `manual-qa`: preferred tools `human`; default evidence manual verification note. Document the manual follow-up that a human must complete before final merge or release confidence.

## Runtime Targets

- http://localhost:3000
- Cloudflare preview URL when available

## Evidence Required

- command output
- request or response summary
- test output
- screenshot
- manual verification note

## Allowed Discovery

Use only files needed to fix acceptance defects or documentation gaps found in final validation.

## Test Commands

- npm test
- npm run test:e2e
- npm run build

## Manual Verification Follow-Up

- PM should complete a final walkthrough on the target device/browser and confirm seed data, alert wording, AI behavior, and deployment target.

## Project Manager Questions

- Confirm release acceptance or list blocking issues after the final walkthrough.

## Human Assistance Triggers

- Provide live credentials and final manual acceptance feedback if production services are in scope.

## Master Developer Review Focus

Treat this as acceptance hardening only. Insert researcher or PM input only for real blockers, not late feature expansion.

## Runtime Handoff Notes

- `developer`: Fix only release-blocking defects and documentation gaps revealed by acceptance validation.
- `tester`: Run the broadest validation of the workflow and clearly separate pass, fail, and manual-only evidence.

## Next Phase Inputs

- No further phase; release or backlog follow-up only.
