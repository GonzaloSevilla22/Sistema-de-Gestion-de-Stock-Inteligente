## ADDED Requirements

### Requirement: Backend Dockerfile builds a production-ready image
The system SHALL provide a `backend/Dockerfile` that builds a `python:3.11-slim` image, installs dependencies from `requirements.txt`, copies the `app/` directory, and starts the server with `uvicorn app.main:app --host 0.0.0.0 --port 8000`.

#### Scenario: Backend image builds without errors
- **WHEN** `docker build -t backend ./backend` is run
- **THEN** the build completes successfully with no errors

#### Scenario: Backend container starts and serves requests
- **WHEN** the backend container is started with required env vars
- **THEN** `GET http://localhost:8000/docs` returns HTTP 200

---

### Requirement: Frontend Dockerfile builds a production-ready static image
The system SHALL provide a `frontend/Dockerfile` with a multi-stage build: a `node:20-alpine` build stage that runs `npm ci && npm run build`, and an `nginx:alpine` serve stage that copies the `dist/` output.

#### Scenario: Frontend image builds without errors
- **WHEN** `docker build -t frontend ./frontend` is run
- **THEN** the build completes successfully producing an nginx image with the compiled static assets

#### Scenario: Frontend container serves the app
- **WHEN** the frontend container is started on port 80
- **THEN** `GET http://localhost:80` returns the React application HTML

---

### Requirement: docker-compose.yml orchestrates both services
The system SHALL provide a `docker-compose.yml` at the repo root that defines `backend` (port 8000) and `frontend` (port 80) services on an internal network. The `backend` service SHALL read environment variables from a `.env` file. A healthcheck on the backend SHALL verify the service is ready before marking it healthy.

#### Scenario: Stack starts with a single command
- **WHEN** `docker-compose up --build` is run from the repo root
- **THEN** both backend and frontend containers start successfully

#### Scenario: Backend healthcheck reports healthy
- **WHEN** the backend container has started and uvicorn is serving
- **THEN** the healthcheck `curl -f http://localhost:8000/docs` exits 0 and the container status becomes `healthy`

#### Scenario: Missing .env causes backend to use SQLite fallback
- **WHEN** no `.env` file is present at the repo root
- **THEN** the backend starts using the SQLite fallback from `connection.py` (DATABASE_URL defaults to sqlite)
