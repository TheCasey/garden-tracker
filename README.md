# Garden Tracker

Garden Tracker is a custom backyard garden tracking app for a Columbia, TN garden. The project follows the phased workflow in `garden_tracker_spec-workflow/` and uses `garden_tracker_spec.md`, `01-design-system.md`, `02-component-library.md`, and `garden_tracker_responsive_mockup.html` as the current product and design source material.

## Current Phase

Phase 2 establishes the runnable Vite + React + TypeScript application foundation, local scripts, test harnesses, and the initial environment contract.

## Repository Workflow

- Default branch: `main`
- Working branch: `feat/garden-tracker-creation`
- Repository owner: `TheCasey`
- Repository name: `garden-tracker`
- Visibility: public
- Branch protection: deferred until real CI checks exist after the app scaffold is added. When enabled, require pull requests and passing CI before merging to `main`.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Keep `APP_*` values present for the browser shell. Keep secrets populated only in `.env` and never in source control.
3. Install dependencies with `npm install`.
4. Start the app with `npm run dev` and open [http://localhost:3000](http://localhost:3000).

## Commands

- `npm run dev` starts the Vite development server on port `3000`.
- `npm run build` runs TypeScript project builds and produces the Vite bundle.
- `npm run lint` runs ESLint across the scaffold.
- `npm test` runs Vitest unit tests.
- `npm run test:e2e` runs the Playwright browser smoke test and starts Vite through Playwright `webServer`.

## Environment Contract

- Phase 2 validates the public browser runtime contract from `APP_*` values and keeps rendering with safe fallback values so smoke tests are not blocked by an incomplete `.env`.
- Secrets such as `AUTH_SECRET`, `SESSION_SECRET`, `GEMINI_API_KEY`, and backend service keys remain server-only contract entries for later phases and are intentionally not loaded into the Vite client runtime.

## Workflow Files

- `garden_tracker_spec-workflow/workflow-plan.md` describes the phased delivery model.
- `garden_tracker_spec-workflow/workflow-state.yaml` is the live resume state and is treated as volatile workflow state.
- `garden_tracker_spec-workflow/phases/*/run-log.md` files hold phase-local evidence and are treated as volatile workflow state.
