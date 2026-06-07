# Phase 12: Plant Diagnostics Chat and AI Patches

## Goal

Build the plant-scoped multimodal diagnostics chatbox, AI response rendering, and structured patch application flow.

## Depends On

- Phase 11: Gemini Care Metadata Onboarding

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Implement Plant Care Chatbox UI at the top of plant detail.
- Submit prompt text and optional image through a diagnostics endpoint with plant history context.
- Render scoped message history, attachments, AI responses, patch previews, and approved patch application.
- Preserve deterministic UI updates after patch application without a full refresh.

## Deliverables

- Plant diagnostics chatbox component
- Diagnostics endpoint with mocked Gemini multimodal support
- Patch preview and allowed-field patch application
- Tests for message scoping and patch behavior

## Files Or Areas To Touch

- src/components/PlantDiagnosticsChat.*
- src/views/PlantDetail.*
- src/ai/
- src/api/
- src/repositories/
- tests/ui/plant-diagnostics.spec.*
- tests/api/plant-diagnostics.test.*

## Read First

- garden_tracker_spec.md
- 02-component-library.md
- src/views/PlantDetail.*
- src/ai/
- src/repositories/
- tests/ui/plant-diagnostics.spec.*

## Exit Criteria

- User messages append immediately and are scoped to the selected plant.
- Optional image attachments submit with the active plant_id and prompt.
- AI responses render conversational text and patch blocks when patch_detected is true.
- Allowed target_fields update the active plant and rerender affected care metrics and alerts.

## Automated Test Expectation

Add mocked API and browser interaction tests for chat submission, plant-scoped histories, in-flight state, patch rendering, allowed patch application, and rejected patch fields.

## Test Files

- tests/ui/plant-diagnostics.spec.*
- tests/api/plant-diagnostics.test.*

## Test Cases To Cover

- Submitting a prompt immediately appends a user message and disables the send button while pending.
- Switching plants swaps visible message history.
- Patch-detected response renders a PATCH block and updates approved care fields.
- Unknown patch fields are ignored or rejected with a safe message.

## No-Test Rationale

None. If automated tests are not useful for this phase, record the rationale here before accepting the phase.

## Validation Modes

- `interaction-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Drive a real interaction flow end to end and note visible regressions, console issues, or broken state.
- `api-smoke`: preferred tools `shell`, `curl`; default evidence request or response summary, command output. Exercise the live endpoint or local HTTP contract for the active slice and confirm the expected shape.
- `unit-regression`: preferred tools `shell`; default evidence command output. Run the existing focused automated tests that cover the active slice before widening scope.
- `browser-smoke`: preferred tools `playwright`, `browser-use`; default evidence test output, screenshot. Load the live UI in a runtime and verify the main happy path for the active slice.

## Runtime Targets

- http://localhost:3000

## Evidence Required

- test output
- request or response summary
- screenshot

## Allowed Discovery

Stay within diagnostics chat, AI endpoint, repository patch code, and adjacent tests.

## Test Commands

- npm test -- plant-diagnostics
- npm run test:e2e -- plant-diagnostics
- npm run build

## Manual Verification Follow-Up

- PM should inspect the diagnostic UI with a realistic plant photo once a live Gemini key and upload path exist.

## Project Manager Questions

- Confirm whether AI patches should apply automatically after validation or require a user confirmation click.

## Human Assistance Triggers

- Provide a representative plant photo for live multimodal validation when available.

## Master Developer Review Focus

Confirm that Plant Diagnostics Chat and AI Patches is still the right active phase, assign the automated test expectation and narrowest useful validation strategy, and write the next downstream prompt only when the work packet is execution-ready.

## Runtime Handoff Notes

- `developer`: Implement only Plant Diagnostics Chat and AI Patches. Start from the prompt read-first list, keep the change set narrow, add or update focused automated tests when behavior changes, and do not start later phases.
- `tester`: Validate only Plant Diagnostics Chat and AI Patches using the automated test expectation, declared validation modes, runtime targets, and evidence requirements. Prefer live checks when the phase guidance calls for them, then return control to master-developer.

## Next Phase Inputs

- Plant-scoped diagnostics UI
- Patch application path
- Diagnostics API behavior
