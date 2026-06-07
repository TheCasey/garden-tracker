# GitHub Operations

## Repository

- Owner: `TheCasey`
- Name: `garden-tracker`
- Visibility: public
- Default branch: `main`
- Active delivery branch: `feat/garden-tracker-creation`

## Branch Strategy

Use `main` as the stable branch and complete phased implementation work on `feat/garden-tracker-creation`. Feature branches may be added later when the project has multiple concurrent work streams.

## Branch Protection

Branch protection is deferred until the app scaffold and meaningful CI checks exist. After Phase 2, enable protection on `main` with these expectations:

- Require pull requests before merging.
- Require the CI workflow to pass.
- Prevent force pushes to `main`.
- Require branch updates before merge when GitHub reports stale checks.

## Phase Acceptance

Each phase should leave evidence in the matching `garden_tracker_spec-workflow/phases/*/run-log.md` file before the phase is accepted. Stable workflow documents and implementation files may be committed; volatile workflow state and run logs can remain uncommitted unless the project manager explicitly wants them included.

## Issue Labels

Suggested labels for future issue triage:

- `phase`
- `bug`
- `enhancement`
- `design`
- `backend`
- `ai`
- `ops`
- `blocked`
