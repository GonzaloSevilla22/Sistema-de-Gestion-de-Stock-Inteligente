## Context

El proyecto parte de cero: no existe aún ningún archivo de código. Este change establece la infraestructura mínima de la que todos los changes subsiguientes dependen. Las decisiones tomadas aquí fijan el contrato tecnológico del proyecto completo.

Stack confirmado: FastAPI + SQLAlchemy 2.0 + Pydantic v2 (backend), React 18 + TypeScript 5 + Vite 5 + TailwindCSS 3 + TanStack Query v5 (frontend).

## Goals / Non-Goals

**Goals:**
- Directorios vacíos pero correctamente nombrados para que los agentes de C-02 en adelante tengan dónde crear archivos sin conflictos de path
- Backend arrancable (`uvicorn app.main:app`) con BD SQLite en dev, sin ningún modelo de dominio aún
- Frontend compilable (`npm run dev`) con rutas base definidas en `App.tsx`, sin páginas reales todavía
- `pytest --collect-only` lista sin errores desde `backend/`
- Variables de entorno documentadas en `.env.example`

**Non-Goals:**
- Ningún modelo de dominio (eso es C-02)
- Ningún endpoint de negocio (CRUD de productos, movimientos, etc.)
- Migraciones Alembic (se configuran en C-02 cuando existan modelos)
- Docker y CI/CD (eso es C-10)
- Autenticación o autorización (fuera de scope v1.0)

## Decisions

### D-01: SQLAlchemy 2.0 exclusivamente

Se usa la API moderna de SQLAlchemy: `Mapped[type]`, `mapped_column()`, `select()`. La API legacy (`Column()`, `session.query()`) está prohibida por regla dura del proyecto.

**Alternativa descartada**: usar SQLAlchemy 1.x style — incompatible con SQLAlchemy 2.x instalado y contra las reglas duras.

### D-02: `DATABASE_URL` determina el motor en runtime

`connection.py` lee `DATABASE_URL` del entorno. Si comienza con `sqlite`, crea un engine SQLite con `check_same_thread=False`; cualquier otro valor se usa directamente como URL de PostgreSQL. No hay lógica de detección por nombre de entorno.

**Alternativa descartada**: dos archivos de settings separados (dev/prod) — añade complejidad innecesaria para v1.0.

### D-03: Lifespan para inicialización de BD

`main.py` usa el pattern `@asynccontextmanager` + `lifespan=` de FastAPI en lugar del deprecated `on_event`. Llama a `Base.metadata.create_all(bind=engine)` al arrancar para crear tablas en SQLite dev.

**Nota**: en producción (PostgreSQL) las tablas se manejan con Alembic (C-02). El `create_all` es seguro porque es idempotente.

### D-04: CORS desde variable de entorno

`CORS_ORIGINS` se parsea como lista separada por comas en `main.py`. En desarrollo se incluye `http://localhost:5173` (puerto de Vite). En producción se lista el origen de Vercel. Nunca se usa `allow_origins=["*"]`.

### D-05: Frontend scaffolding sin Dockerfile en C-01

El `frontend/Dockerfile` se crea en C-10 (`docker-cicd`), no aquí. C-01 solo crea el proyecto Vite con las dependencias correctas. Esto mantiene el scope atómico: no mezclar infraestructura con setup.

### D-06: `conftest.py` mínimo para que pytest arranque

Se crea `backend/tests/conftest.py` vacío (o con fixture de sesión in-memory) para que `pytest --collect-only` no falle. Los fixtures reales de BD se agregan en C-02.

## Risks / Trade-offs

- **[Risk] SQLite en dev no soporta todas las features de PostgreSQL** → Mitigation: los tests corren siempre en SQLite in-memory; las diferencias de comportamiento (e.g., JSONB, `RETURNING`) se documentan cuando aparezcan.
- **[Risk] `create_all` en lifespan crea tablas en SQLite aunque no existan modelos** → Mitigation: sin modelos importados en C-01, `create_all` es no-op; no hay riesgo hasta C-02.
- **[Risk] Vite proxy a backend no configurado en C-01** → Mitigation: el proxy se agrega en `vite.config.ts` al momento de la integración frontend-backend; en C-01 solo se necesita que el frontend compile.
