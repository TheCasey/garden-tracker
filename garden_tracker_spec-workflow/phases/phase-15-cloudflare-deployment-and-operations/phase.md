# Phase 15: Cloudflare Deployment and Operations

## Goal

Prepare and validate Cloudflare-hosted production deployment with environment variables, secrets, domain routing, and operational checks.

## Depends On

- Phase 14: Accessibility, Responsive, and Visual Polish

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Configure the app for Cloudflare hosting using the selected runtime target.
- Map local .env variables to Cloudflare secrets and environment groups.
- Add deployment scripts or config, health checks, and production build documentation.
- Do not perform destructive production changes without PM confirmation.

## Deliverables

- Cloudflare deployment configuration
- Documented secrets and environment mapping
- Production build command and deployment checklist
- Smoke-tested preview or local Cloudflare runtime where credentials permit

## Files Or Areas To Touch

- wrangler.toml
- cloudflare/
- package.json
- .env.example
- README.md
- tests/deployment/

## Read First

- garden_tracker_spec.md
- .env.example
- package.json
- README.md
- tests/deployment/cloudflare-config.test.*

## Exit Criteria

- Production build succeeds for the Cloudflare target.
- Required secrets are documented and not committed.
- Preview or local Cloudflare runtime loads the app and basic API routes where possible.
- Custom garden subdomain cutover steps are documented for PM approval.

## Automated Test Expectation

Add deployment config checks or smoke tests where the selected framework allows them; record a no-test rationale for any Cloudflare-only validation that needs credentials.

## Test Files

- tests/deployment/cloudflare-config.test.*

## Test Cases To Cover

- Cloudflare config references the expected app entry and compatibility settings.
- Required secrets are listed in documentation without secret values.
- Production build output exists and app shell smoke test passes.

## No-Test Rationale

None. If automated tests are not useful for this phase, record the rationale here before accepting the phase.

## Validation Modes

- `build-health`: preferred tools `shell`; default evidence command output. Run the narrowest compile, typecheck, or package-health commands that prove the slice still builds.
- `api-smoke`: preferred tools `shell`, `curl`; default evidence request or response summary, command output. Exercise the live endpoint or local HTTP contract for the active slice and confirm the expected shape.
- `browser-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Load the live UI in a runtime and verify the main happy path for the active slice.
- `manual-qa`: preferred tools `human`; default evidence manual verification note. Document the manual follow-up that a human must complete before final merge or release confidence.

## Runtime Targets

- http://localhost:3000
- Cloudflare preview URL when available

## Evidence Required

- command output
- request or response summary
- screenshot
- manual verification note

## Allowed Discovery

Inspect deployment config, env docs, package scripts, and framework deployment docs only as needed.

## Test Commands

- npm run build
- npm run test:e2e -- smoke

## Manual Verification Follow-Up

- PM must approve subdomain, Cloudflare account target, and any production secret upload before cutover.

## Project Manager Questions

- Confirm the exact garden subdomain and Cloudflare account/zone target.
- Confirm whether preview deployment is enough for this phase or whether production cutover should be attempted.

## Human Assistance Triggers

- Provide Cloudflare account, zone, subdomain, and deployment credentials or complete the manual dashboard steps.

## Master Developer Review Focus

Confirm that Cloudflare Deployment and Operations is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only Cloudflare Deployment and Operations. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only Cloudflare Deployment and Operations using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Deployment configuration
- Operations checklist
- Preview or local production evidence
