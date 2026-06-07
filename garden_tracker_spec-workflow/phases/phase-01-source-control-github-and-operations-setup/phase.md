# Phase 1: Source Control, GitHub, and Operations Setup

## Goal

Set up the project foundation around source control, GitHub repository management, CI, issue tracking, secret policy, and collaboration rules before application code starts.

## Depends On

- None

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Initialize Git if the workspace is still not a repository.
- Create or connect the GitHub repository, establish branch strategy, and document protected-branch expectations.
- Add baseline GitHub Actions workflows for install, lint, typecheck, tests, build, and optional preview deployment once the app scaffold exists.
- Create project setup docs covering secrets, .env handling, issue labels, PR checklist, and phase acceptance policy.
- Do not implement app features or choose backend-specific schemas in this phase.

## Deliverables

- Local Git repository initialized or connected to an existing repo
- GitHub repository plan or created remote
- Branch, PR, and issue workflow documentation
- Baseline CI workflow placeholders or initial checks
- Secret handling policy for Gemini, Cloudflare, Supabase/Firebase, and future GitHub Actions secrets

## Files Or Areas To Touch

- .gitignore
- .github/workflows/
- .github/pull_request_template.md
- README.md
- docs/operations/

## Read First

- garden_tracker_spec.md
- .gitignore
- .env.example
- 01-design-system.md
- 02-component-library.md
- .github/workflows/*.yml

## Exit Criteria

- The project has a clear Git/GitHub operating model before feature work begins.
- Secrets and .env files are excluded from source control and documented.
- CI expectations are documented even if full app commands become active after Phase 2.
- The PM has confirmed repo visibility, owner, and whether Codex should create/push the remote.

## Automated Test Expectation

No app behavior tests are expected before the app scaffold exists; validate GitHub workflow syntax and documentation completeness where possible.

## Test Files

- .github/workflows/*.yml
- .github/workflows/*.yaml

## Test Cases To Cover

- GitHub workflow YAML parses.
- CI placeholders do not reference non-existent scripts unless intentionally gated.
- .env and local secret files are ignored.
- PR template includes test evidence, manual verification, and phase acceptance sections.

## No-Test Rationale

This phase is project-operations setup before application behavior exists; use workflow syntax checks, git status, and documentation review as validation.

## Validation Modes

- `code-review`: preferred tools `shell`; default evidence code references. Use static inspection only when the phase is contract-only, config-only, or blocked from runtime checks.
- `build-health`: preferred tools `shell`; default evidence command output. Run the narrowest compile, typecheck, or package-health commands that prove the slice still builds.
- `manual-qa`: preferred tools `human`; default evidence manual verification note. Document the manual follow-up that a human must complete before final merge or release confidence.

## Runtime Targets

- No explicit runtime targets listed. Add them before live validation if the phase needs them.

## Evidence Required

- code references
- command output
- manual verification note

## Allowed Discovery

Inspect only repository metadata, env examples, existing planning docs, and GitHub workflow files.

## Test Commands

- git status --short --branch
- ruby -e 'require "yaml"; Dir[".github/workflows/*.{yml,yaml}"].each { |p| YAML.load_file(p); puts p }'

## Manual Verification Follow-Up

- PM should confirm GitHub repo owner, repo name, visibility, and whether branch protection should be configured immediately.

## Project Manager Questions

- Should Codex initialize a new Git repository here and create/push a GitHub remote, or should this connect to an existing repo?
- What GitHub owner and repository name should be used?
- Should the repository be private or public?

## Human Assistance Triggers

- Provide GitHub authentication or create the repository if the local gh/GitHub connector cannot create it directly.
- Configure branch protection in GitHub settings if required before the first PR.

## Master Developer Review Focus

Resolve GitHub setup before any feature implementation. If the PM wants to handle GitHub manually, record the answer and continue with local Git policy.

## Runtime Handoff Notes

- `developer`: Set up operations files only; do not scaffold the app implementation in this phase.
- `tester`: Validate repository hygiene, workflow syntax where possible, and documentation clarity.

## Next Phase Inputs

- Git/GitHub operating model
- CI and PR expectations
- Secret handling policy
