# Phase 13: Production Backend, Storage, and Security

## Goal

Replace or supplement local persistence with the selected production backend and secure storage for database records, logs, chat history, and uploaded images.

## Depends On

- Phase 12: Plant Diagnostics Chat and AI Patches

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Implement the selected backend adapter for plants, garden_logs, tasks, chat messages, and AI patches.
- Create database migrations or service schema based on the spec's plants and garden_logs blueprint.
- Add image storage upload path and access rules suitable for a personal garden app.
- Do not deploy to Cloudflare yet.

## Deliverables

- Production repository adapter
- Database schema or migration files
- Storage bucket/path contract for uploaded diagnostics photos
- Security/privacy notes and env documentation
- Adapter tests with mocked service client or local emulator

## Files Or Areas To Touch

- src/repositories/
- src/db/
- src/storage/
- .env.example
- tests/repositories/
- tests/storage/

## Read First

- garden_tracker_spec.md
- .env.example
- src/repositories/
- src/api/
- src/ai/
- tests/repositories/backend-adapter.test.*

## Exit Criteria

- The repository boundary can run against the selected production backend.
- Schema covers plants.ai_care_metadata and garden_logs with cascade behavior or equivalent.
- Uploads have deterministic paths, size/type validation, and non-public access unless PM approves otherwise.
- Local development can still run without production credentials via the local adapter or mocks.

## Automated Test Expectation

Add adapter contract tests that run without real credentials, plus migration/schema validation where the chosen backend tooling supports it.

## Test Files

- tests/repositories/backend-adapter.test.*
- tests/storage/uploads.test.*
- tests/db/schema.test.*

## Test Cases To Cover

- Plant CRUD and garden log append pass against the backend adapter contract.
- AI metadata and patch fields persist with JSON structure intact.
- Image uploads reject invalid file types or oversized payloads.
- Missing backend credentials produce clear setup errors without leaking secrets.

## No-Test Rationale

None. If automated tests are not useful for this phase, record the rationale here before accepting the phase.

## Validation Modes

- `unit-regression`: preferred tools `shell`; default evidence command output. Run the existing focused automated tests that cover the active slice before widening scope.
- `api-smoke`: preferred tools `shell`, `curl`; default evidence request or response summary, command output. Exercise the live endpoint or local HTTP contract for the active slice and confirm the expected shape.
- `build-health`: preferred tools `shell`; default evidence command output. Run the narrowest compile, typecheck, or package-health commands that prove the slice still builds.
- `manual-qa`: preferred tools `human`; default evidence manual verification note. Document the manual follow-up that a human must complete before final merge or release confidence.

## Runtime Targets

- http://localhost:3000/api/plants
- http://localhost:3000/api/diagnostics

## Evidence Required

- command output
- request or response summary
- manual verification note

## Allowed Discovery

Inspect repository, API, storage, env, and migration files only.

## Test Commands

- npm test -- backend-adapter
- npm test -- uploads
- npm run build

## Manual Verification Follow-Up

- Live backend validation requires PM-provided Supabase/Firebase credentials and may remain pending if credentials are unavailable.

## Project Manager Questions

- Confirm final backend provider if it was not resolved in Phase 1.
- Confirm whether uploaded plant photos should be private by default.
- Confirm whether authentication is required for the personal app before production cutover.

## Human Assistance Triggers

- Provide backend project credentials, storage bucket configuration, and any required local service setup.

## Master Developer Review Focus

Confirm that Production Backend, Storage, and Security is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only Production Backend, Storage, and Security. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only Production Backend, Storage, and Security using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Production persistence path
- Storage upload contract
- Backend env requirements
