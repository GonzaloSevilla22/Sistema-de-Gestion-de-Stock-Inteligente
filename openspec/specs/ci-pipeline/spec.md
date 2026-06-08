# Capability: ci-pipeline

## Purpose

Provides a GitHub Actions CI workflow that automatically runs backend tests and frontend build on every push and pull request to main. Ensures quality gates pass before code is merged.

---

## Requirements

### Requirement: CI workflow runs on push and pull_request to main
The system SHALL provide `.github/workflows/ci.yml` that triggers on `push` to any branch and on `pull_request` targeting `main`.

#### Scenario: Workflow triggers on push
- **WHEN** a commit is pushed to any branch
- **THEN** the CI workflow is triggered automatically

#### Scenario: Workflow triggers on pull_request to main
- **WHEN** a pull request is opened or updated targeting `main`
- **THEN** the CI workflow is triggered automatically

---

### Requirement: test-backend job runs pytest with coverage
The CI SHALL include a `test-backend` job that sets up Python 3.11, installs dependencies from `backend/requirements.txt`, and runs `pytest --cov` from the `backend/` directory. The job SHALL fail if any test fails.

#### Scenario: All backend tests pass
- **WHEN** `pytest --cov` runs in the CI environment
- **THEN** the job exits 0 and the workflow reports the job as passed

#### Scenario: A failing test fails the job
- **WHEN** any test assertion fails during `pytest`
- **THEN** the `test-backend` job exits non-zero and the workflow reports failure

---

### Requirement: build-frontend job compiles the React app
The CI SHALL include a `build-frontend` job that sets up Node 20, runs `npm ci` and `npm run build` from the `frontend/` directory. The job SHALL fail if the TypeScript compilation or Vite build fails.

#### Scenario: Frontend build succeeds
- **WHEN** `npm ci && npm run build` runs in the CI environment
- **THEN** the job exits 0 and the `dist/` output is produced

#### Scenario: TypeScript error fails the build job
- **WHEN** a TypeScript type error exists in the source
- **THEN** `tsc -b` fails, the job exits non-zero, and the workflow reports failure
