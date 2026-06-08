## Why

Con C-01..C-09 completos, el sistema funciona en desarrollo local pero carece de empaquetado reproducible y pipeline de calidad automatizado. C-10 agrega los Dockerfiles, el docker-compose y el workflow de GitHub Actions que permiten levantar el stack completo con un solo comando y garantizar que los tests corran en cada push.

## What Changes

- **Nuevo** `backend/Dockerfile`: imagen `python:3.11-slim`, instala dependencias desde `requirements.txt`, copia `app/`, arranca con `uvicorn`.
- **Nuevo** `frontend/Dockerfile`: multi-stage — stage `build` (`node:20-alpine`, `npm ci`, `npm run build`) + stage `serve` (`nginx:alpine`, sirve `dist/`).
- **Nuevo** `docker-compose.yml`: servicios `backend` (puerto 8000) y `frontend` (puerto 80) en red interna; `backend` consume env vars desde `.env`; healthcheck en backend.
- **Nuevo** `.github/workflows/ci.yml`: trigger en `push` a cualquier branch y `pull_request` a `main`; jobs `test-backend` (Python 3.11, `pytest --cov`) y `build-frontend` (`npm ci`, `npm run build`).
- **Actualizado** `README.md`: instrucciones `docker-compose up --build`, acceso en `localhost:80`, cómo correr `pytest`.

## Capabilities

### New Capabilities
- `docker-deployment`: Empaquetado y orquestación del stack completo vía Docker y docker-compose.
- `ci-pipeline`: Workflow de GitHub Actions que valida tests y build en cada push.

### Modified Capabilities
_(ninguna — no hay cambios en requisitos de capacidades existentes)_

## Impact

- **Archivos nuevos**: `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml`.
- **Archivos modificados**: `README.md`.
- **Sin cambios en código de aplicación** (backend ni frontend).
- **Dependencias de runtime**: Docker 24+, Docker Compose v2 (plugin).
- **CI**: GitHub Actions — `ubuntu-latest`, runners públicos gratuitos.
- **Variables de entorno**: el `docker-compose.yml` lee `.env` en la raíz del proyecto (debe existir, derivado de `backend/.env.example`).
