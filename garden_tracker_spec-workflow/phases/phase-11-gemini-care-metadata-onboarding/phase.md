# Phase 11: Gemini Care Metadata Onboarding

## Goal

Implement the asynchronous Gemini structured JSON flow that generates plant care metadata during plant onboarding.

## Depends On

- Phase 10: Medium and Seasonal Alert Cycles

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Add server-side Gemini client wrapper and response-schema enforcement for PlantCareRules.
- Build onboarding API route or action that compiles localized plant metadata and stores ai_care_metadata.
- Add loading, error, retry, and fallback behavior without blocking deterministic CRUD.

## Deliverables

- Gemini PlantCareRules schema and client integration
- Plant onboarding endpoint or server action
- Persistence update for ai_care_metadata
- Mocked tests for structured JSON success and failure paths

## Files Or Areas To Touch

- src/ai/
- src/api/
- src/repositories/
- tests/ai/
- tests/api/

## Read First

- garden_tracker_spec.md
- .env.example
- src/repositories/
- src/domain/
- tests/ai/gemini-care-rules.test.*
- tests/api/plant-onboarding.test.*

## Exit Criteria

- Plant onboarding can request Gemini care rules asynchronously and save valid structured metadata.
- Schema validation rejects malformed model output safely.
- Deterministic plant creation remains responsive when AI is pending or unavailable.

## Automated Test Expectation

Add mocked unit/API tests for Gemini request construction, schema validation, successful metadata persistence, malformed JSON rejection, and deterministic fallback behavior.

## Test Files

- tests/ai/gemini-care-rules.test.*
- tests/api/plant-onboarding.test.*

## Test Cases To Cover

- Request payload includes Columbia, TN micro-climate and planting context.
- Valid PlantCareRules JSON is stored on the plant.
- Missing required schema fields return a safe error without corrupting plant data.
- Plant creation succeeds with pending AI metadata.

## No-Test Rationale

None. If automated tests are not useful for this phase, record the rationale here before accepting the phase.

## Validation Modes

- `unit-regression`: preferred tools `shell`; default evidence command output. Run the existing focused automated tests that cover the active slice before widening scope.
- `api-smoke`: preferred tools `shell`, `curl`; default evidence request or response summary, command output. Exercise the live endpoint or local HTTP contract for the active slice and confirm the expected shape.
- `build-health`: preferred tools `shell`; default evidence command output. Run the narrowest compile, typecheck, or package-health commands that prove the slice still builds.

## Runtime Targets

- http://localhost:3000/api/plants

## Evidence Required

- command output
- request or response summary

## Allowed Discovery

Inspect AI, API, repository, and env validation files only.

## Test Commands

- npm test -- gemini
- npm test -- plant-onboarding
- npm run build

## Manual Verification Follow-Up

- A live Gemini smoke test is optional until the PM provides a real API key.

## Project Manager Questions

- Confirm the Gemini model names for text and multimodal routing if .env.example does not already specify final values.
- Confirm whether live Gemini calls are allowed during local validation or should remain mocked until deployment.

## Human Assistance Triggers

- Provide a Gemini API key for live API smoke testing.

## Master Developer Review Focus

Confirm that Gemini Care Metadata Onboarding is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only Gemini Care Metadata Onboarding. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only Gemini Care Metadata Onboarding using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Gemini client wrapper
- Validated care metadata storage
- AI failure behavior
