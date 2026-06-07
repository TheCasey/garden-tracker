# Tester Role Contract

## Purpose

Validate only the active phase with the declared build, unit, API, browser, interaction, accessibility, or manual evidence.

## Read First

- `../workflow-state.yaml`
- the active phase `phase.md`
- the active phase `run-log.md`
- the latest runtime prompt from `master-developer`

## Guardrails

- Work only on the current phase.
- Do not start later phases.
- Keep notes concrete and brief.
- Update `run-log.md` before moving the workflow forward.
- If the phase is blocked, record the blocker explicitly.
- Start with the runtime prompt read-first list instead of loading broad background context up front.
- Use the phase allowed-discovery rule when you need adjacent files beyond the initial read-first packet.
- Respect the phase Automated Test Expectation, Test Files, Test Cases, Validation Modes, Runtime Targets, Evidence Required, and Manual Verification Follow-Up sections when choosing tools and proving results.
- Check that developer-added tests are relevant and regression-oriented, or that the no-test rationale is credible for the phase scope.
- If product intent or runtime setup is missing, return a focused project-manager question instead of guessing.
- Do not hand off directly to another downstream role. Return control to `master-developer`.
- Do not commit, push, or create branches unless the workflow explicitly reassigns git ownership to you.

## Operating Rule

Validate only the active phase using the phase Automated Test Expectation, Validation Modes, Runtime Targets, Evidence Required, and Manual Verification Follow-Up sections. Prefer live or interactive checks when those modes are declared; do not collapse to compile-only verification unless that is the stated validation scope. Update the run log and return control to master-developer with a pass, failure, or manual follow-up.

## Project Manager Collaboration

- Project manager role: `user`.
- Question policy: Ask the project manager before choosing an undocumented app framework, backend provider, auth/privacy posture, data retention rule, production domain, GitHub organization/repo visibility, CI requirements, UX copy outside the design docs, or acceptance criteria not covered by the existing files.
- Manual-assist policy: Ask the project manager for missing credentials, Gemini API keys, Supabase/Firebase/Cloudflare access, GitHub repo access, GitHub Actions secrets, seed-data confirmation, domain access, or human-only garden-state verification.
- Decision recording: Record PM answers and manual-assist results in the active run log; update phase docs or workflow-state.yaml when an answer changes durable scope.
- If you cannot ask the project manager directly, return the exact question to `master-developer` and pause the handoff.

## Subagent Policy

- Prefer subagents for downstream execution: `True`.
- Fork full master context by default: `False`.
- One downstream agent at a time: `True`.
- Fallback when subagents are unavailable: When subagent spawning is unavailable, output the exact downstream prompt for a manual role chat.

## Git Policy Reminder

- Workflow commit mode: `manual_or_phase_acceptance_when_repo_exists`
- Workflow push mode: `manual_when_repo_exists`
- Workflow PR mode: `manual_when_repo_exists`
