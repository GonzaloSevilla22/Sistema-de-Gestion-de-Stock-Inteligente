# Capability: backend-foundation

## Purpose

Establishes the FastAPI backend skeleton: runnable application entry point, database engine configuration (SQLite for development, PostgreSQL for production), injectable session dependency, CORS middleware, startup table creation, environment variable documentation, and a collectable test suite.

---

## Requirements

### Requirement: FastAPI application is executable
The system SHALL provide a runnable FastAPI application entry point in `backend/app/main.py` that starts without errors and exposes a health indicator.

#### Scenario: Application starts with valid DATABASE_URL
- **WHEN** `uvicorn app.main:app` is executed with a valid `DATABASE_URL` environment variable
- **THEN** the server starts on the configured port without errors

#### Scenario: Application starts with SQLite default URL
- **WHEN** `DATABASE_URL=sqlite:///./stock.db` is set
- **THEN** the server starts and the SQLite file is created in the backend directory

---

### Requirement: CORS is configured from environment variable
The system SHALL configure CORS middleware using the `CORS_ORIGINS` environment variable, parsed as a comma-separated list of allowed origins.

#### Scenario: CORS allows listed origin
- **WHEN** a request arrives from an origin listed in `CORS_ORIGINS`
- **THEN** the response includes the appropriate `Access-Control-Allow-Origin` header

#### Scenario: CORS never uses wildcard in production
- **WHEN** `CORS_ORIGINS` does not contain `*`
- **THEN** only the explicitly listed origins are allowed; no wildcard is used

---

### Requirement: Database engine supports SQLite and PostgreSQL
The system SHALL create the SQLAlchemy engine from `DATABASE_URL`, using SQLite-specific settings (`check_same_thread=False`) when the URL starts with `sqlite`, and standard settings otherwise.

#### Scenario: SQLite engine is created for development
- **WHEN** `DATABASE_URL` starts with `sqlite`
- **THEN** the engine is created with `connect_args={"check_same_thread": False}`

#### Scenario: PostgreSQL engine is created for production
- **WHEN** `DATABASE_URL` starts with `postgresql`
- **THEN** the engine is created without SQLite-specific args

---

### Requirement: Database session is injectable as a FastAPI dependency
The system SHALL expose a `get_db()` generator function in `backend/app/database/session.py` that yields a SQLAlchemy session and closes it after the request.

#### Scenario: Session is yielded and closed
- **WHEN** a route uses `Depends(get_db)`
- **THEN** a session is opened before the route handler executes and closed after it returns (even on error)

---

### Requirement: Tables are created at startup in development
The system SHALL call `Base.metadata.create_all(bind=engine)` inside the FastAPI lifespan context manager so all declared models are created in SQLite on first start.

#### Scenario: Lifespan creates tables idempotently
- **WHEN** the application starts and the database already has the expected tables
- **THEN** `create_all` runs without error and no data is lost

---

### Requirement: Environment variables are documented
The system SHALL provide a `backend/.env.example` file listing all required environment variables with example values.

#### Scenario: .env.example lists all required variables
- **WHEN** `backend/.env.example` is read
- **THEN** it contains entries for `DATABASE_URL`, `AI_API_KEY`, `AI_PROVIDER`, and `CORS_ORIGINS`

---

### Requirement: Test suite is collectable
The system SHALL have a `backend/tests/` directory with at least a `conftest.py` so that `pytest --collect-only` runs without errors from the `backend/` directory.

#### Scenario: pytest collects without import errors
- **WHEN** `pytest --collect-only` is run from `backend/`
- **THEN** the command exits with code 0 and reports 0 errors
