# Garden Tracker

Garden Tracker is a custom backyard garden tracking app for a Columbia, TN garden. The project follows the phased workflow in `garden_tracker_spec-workflow/` and uses `garden_tracker_spec.md`, `01-design-system.md`, `02-component-library.md`, and `garden_tracker_responsive_mockup.html` as the current product and design source material.

## Current Phase

Phase 1 establishes source control, GitHub operations, CI placeholders, PR expectations, and secret handling before application code is scaffolded.

## Repository Workflow

- Default branch: `main`
- Working branch: `feat/garden-tracker-creation`
- Repository owner: `TheCasey`
- Repository name: `garden-tracker`
- Visibility: public
- Branch protection: deferred until real CI checks exist after the app scaffold is added. When enabled, require pull requests and passing CI before merging to `main`.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Fill only local development secrets in `.env`.
3. Do not commit `.env`, `.env.*`, local swap files, build output, or dependency folders.

Application install/build/test commands will be added in Phase 2 when the framework scaffold is created.

## Workflow Files

- `garden_tracker_spec-workflow/workflow-plan.md` describes the phased delivery model.
- `garden_tracker_spec-workflow/workflow-state.yaml` is the live resume state and is treated as volatile workflow state.
- `garden_tracker_spec-workflow/phases/*/run-log.md` files hold phase-local evidence and are treated as volatile workflow state.
