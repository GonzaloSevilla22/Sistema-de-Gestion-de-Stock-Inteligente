## Why

El proyecto no tiene aún ninguna estructura de código: ni backend ni frontend existen como directorios ejecutables. Este change establece el esqueleto mínimo que permite que todos los changes posteriores (C-02 en adelante) tengan dónde vivir y se puedan ejecutar de inmediato.

## What Changes

- Crear árbol de directorios completo: `backend/app/{api,models,schemas,repositories,services,database}/`, `backend/tests/`, `frontend/src/{pages,components,services,hooks,types}/`
- Agregar `backend/requirements.txt` con dependencias de runtime y test: `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `pydantic[email]`, `python-dotenv`, `alembic`, `pytest`, `httpx`, `anthropic`, `google-generativeai`
- Crear `backend/.env.example` con las cuatro variables de entorno del sistema: `DATABASE_URL`, `AI_API_KEY`, `AI_PROVIDER`, `CORS_ORIGINS`
- Implementar `backend/app/database/connection.py`: Engine SQLAlchemy 2.0 con soporte dual SQLite (dev) / PostgreSQL (prod) y `Base` declarativa
- Implementar `backend/app/database/session.py`: dependencia `get_db()` via `yield` para inyección en rutas FastAPI
- Implementar `backend/app/main.py`: aplicación FastAPI con CORS desde `CORS_ORIGINS`, lifespan que llama `Base.metadata.create_all()` al arrancar
- Crear `frontend/package.json` con React 18, TypeScript 5, Vite 5, TailwindCSS 3, TanStack Query v5, React Router v6, Axios
- Crear `frontend/vite.config.ts` y `frontend/tailwind.config.js` configurados
- Crear `frontend/src/App.tsx`: router principal con rutas `/`, `/products`, `/movements`
- Verificar que `pytest --collect-only` lista sin errores (carpeta `tests/` vacía más conftest básico)

## Capabilities

### New Capabilities

- `backend-foundation`: Aplicación FastAPI ejecutable con conexión a BD (SQLite dev / PostgreSQL prod), sesión inyectable y CORS configurado
- `frontend-foundation`: Aplicación React + TypeScript + Vite compilable con TailwindCSS, React Query y React Router configurados; rutas base definidas

### Modified Capabilities

<!-- No hay specs previos — este es el primer change del proyecto -->

## Impact

- **Código**: todos los archivos listados en What Changes son nuevos (no hay código previo)
- **Dependencias externas**: Python (`fastapi`, `sqlalchemy`, `pydantic`, `anthropic`, etc.), Node.js (`react`, `vite`, `tailwindcss`, `@tanstack/react-query`)
- **Variables de entorno**: los cuatro `DATABASE_URL`, `AI_API_KEY`, `AI_PROVIDER`, `CORS_ORIGINS` deben existir en `.env` para levantar el backend; en tests se usa SQLite in-memory sin env vars externas
- **Changes desbloqueados**: C-02 (`core-models-and-db`) sólo puede arrancar si este change está completo — necesita `connection.py`, `Base` y la estructura de `models/`
