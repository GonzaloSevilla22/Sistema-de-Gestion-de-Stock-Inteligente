## Context

El stack tiene backend FastAPI (Python 3.11, SQLAlchemy, uvicorn) y frontend React/Vite (Node 20, nginx para producción). Ambos se desarrollaron de forma independiente; ahora se integran bajo Docker para despliegue reproducible. No existe ningún Dockerfile ni workflow de CI en el repo.

Variables de entorno sensibles (`DATABASE_URL`, `AI_API_KEY`) no pueden ir en la imagen — se inyectan en runtime via `.env` o env vars del orquestador.

## Goals / Non-Goals

**Goals:**
- `docker-compose up --build` levanta backend + frontend sin pasos manuales.
- Las imágenes son las mínimas viables para producción (slim/alpine).
- El CI valida tests de backend y build de frontend en cada push a GitHub.

**Non-Goals:**
- Deploy automático a Render/Vercel (se configura en esas plataformas apuntando al repo).
- Configuración de TLS/HTTPS en docker-compose (responsabilidad del reverse proxy de producción).
- Publicación de imágenes a Docker Hub o GHCR.

## Decisions

### D-01: Frontend servido por nginx en producción (no `vite preview`)
`nginx:alpine` sirve el `dist/` estático generado por `npm run build`. Alternativa descartada: `node:20-alpine` con `vite preview` — más pesado y no apto para producción.

### D-02: Backend usa `python:3.11-slim` sin virtualenv
La imagen base es `python:3.11-slim`; las dependencias se instalan directamente con `pip install --no-cache-dir`. Virtualenv dentro de Docker no aporta aislamiento adicional y complica `CMD`. Alternativa: imagen `alpine` — descartada por complejidad de compilación de dependencias C (SQLAlchemy, uvicorn).

### D-03: `docker-compose.yml` lee `.env` en la raíz del repo
El servicio `backend` define `env_file: .env`. El usuario debe copiar `backend/.env.example` a `.env` en la raíz. Alternativa: `env_file: backend/.env` — descartado porque `.env` en raíz es el estándar de docker-compose y evita confusión.

### D-04: CI con dos jobs independientes (no matriz)
`test-backend` y `build-frontend` corren en paralelo como jobs separados. Una matriz `strategy` sería overkill para dos stacks distintos con comandos diferentes.

### D-05: `pytest --cov` sin umbral mínimo en CI
El CI reporta cobertura pero no falla por porcentaje. Umbral mínimo quedaría para una fase posterior cuando el equipo defina un target.

### D-06: healthcheck en backend con `curl`
`healthcheck: test: ["CMD", "curl", "-f", "http://localhost:8000/docs"]` — verifica que uvicorn respondió antes de que frontend intente conectarse. Alternativa: `wget` — `curl` ya está disponible en `python:3.11-slim`.

## Risks / Trade-offs

- **[Riesgo] `.env` no existe al correr docker-compose** → El README documenta el paso `cp backend/.env.example .env`. Sin él, el backend arranca sin `DATABASE_URL` y usa el fallback SQLite de `connection.py`.
- **[Riesgo] `stock.db` se genera dentro del contenedor** → En SQLite/dev, la BD no persiste entre reinicios. Para producción se usa PostgreSQL via `DATABASE_URL`. Documentar en README.
- **[Trade-off] nginx sin configuración de proxy_pass al backend** → El frontend en Docker no llama directamente al backend; el cliente (browser) necesita que `VITE_API_URL` apunte al puerto 8000 del host. Esto se resuelve vía `VITE_API_URL=http://localhost:8000` en el `.env` o en el build arg.
