# Sistema de Gestión de Stock Inteligente — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos.

---

## Stack Tecnológico

| Capa | Tecnología | Versión mínima |
|------|------------|----------------|
| Frontend | React + TypeScript + Vite | React 18, TS 5, Vite 5 |
| Estilos | TailwindCSS | v3 |
| HTTP client | Axios | v1 |
| Estado servidor | TanStack Query (React Query) | v5 |
| Backend | FastAPI | v0.110+ |
| ORM | SQLAlchemy | v2 |
| Validación | Pydantic | v2 |
| BD desarrollo | SQLite | — |
| BD producción | PostgreSQL | v15 (Render) |
| IA | Claude API / Gemini API (configurable) | — |
| Containerización | Docker + Docker Compose | Docker 24+ |
| CI/CD | GitHub Actions | — |
| Deploy backend | Render | — |
| Deploy frontend | Vercel | — |

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---------|---------------|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito, alcance y métricas de éxito |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Actores, permisos (sin auth en v1.0) |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | ERD, entidades Product/StockMovement, seed data |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas RN-PR / RN-ST / RN-MV / RN-DH / RN-AI / RN-GL |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | 10 historias de usuario en 5 épicas |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | 4 flujos E2E con diagramas de secuencia |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, estructura de dirs, seguridad, env vars, deploy |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | 5 decisiones documentadas (DD) + 4 supuestos (SU) |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Inconsistencias a resolver ANTES de codear |

> ⚠️ Resolver las preguntas de prioridad **Alta** de `10_preguntas_abiertas.md` antes de arrancar el primer change. En particular: **IN-01** (nombres de campos inglés/español) e **IN-02** (proveedor de IA).

---

## Skills Disponibles

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **Backend Core** | FastAPI, SQLAlchemy, modelos, repositorios | `fastapi-templates`, `sqlalchemy-postgres`, `python-testing`, `python-testing-patterns` |
| **Backend Aux** | Servicios de IA, dashboard, integraciones externas | `fastapi-templates`, `python-testing` |
| **Frontend** | React, TypeScript, TailwindCSS, React Query | `tailwind-design-system` |
| **Testing / QA** | Cobertura, TDD, mocks | `pytest-coverage`, `python-testing-patterns`, `python-testing` |
| **Orquestación** | OPSX, KB, roadmap, rules | `kb-creator`, `roadmap-generator`, `skill-registry`, `agent-instruction` |

Cargá la skill correspondiente al contexto ANTES de escribir código.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 10 changes en 5 fases.
- **Camino crítico** (6 changes): `C-01 → C-02 → C-03 → C-04 → C-06 → C-10`.
- **Primer change**: `C-01` (`foundation-setup`) — estructura de directorios, requirements, DB, main.py, App.tsx.
- **Gates de paralelismo**: 5 — tras C-03 se pueden ejecutar backend y frontend en paralelo.

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

Para arrancar: `/opsx:propose C-01-foundation-setup`

---

## Reglas Duras (específicas del proyecto)

> Reglas **globales** ya definidas en `~/.claude/CLAUDE.md` (orquestador OPSX, governance, TDD estricto, engram): el proyecto las **hereda**, no se repiten acá.

Las siguientes reglas son específicas del stack de este proyecto, confirmadas por el equipo. Son contrato; romperlas es un defecto.

### Python / FastAPI
- **NUNCA** funciones sin type hints → toda función debe tener anotaciones de tipos en parámetros y retorno.
- **NUNCA** nombres de módulos, funciones o variables en camelCase → usar `snake_case` siempre.
- **NUNCA** queries SQLAlchemy fuera de `repositories/` → la capa de service no puede acceder directamente a la sesión de BD.

### SQLAlchemy
- **NUNCA** usar la API legacy de SQLAlchemy (`Column()`, `session.query()`) → usar exclusivamente SQLAlchemy 2.0: `Mapped[type]`, `mapped_column()`, `select()`.
- **NUNCA** aplicar migraciones sin Alembic → toda modificación al schema va por `alembic revision --autogenerate`.

### React / TypeScript
- **NUNCA** usar `any` en TypeScript → tipar estricto; `tsconfig` debe tener `strict: true`.
- **NUNCA** nombres de componentes React en minúsculas o snake_case → usar `PascalCase` siempre.

### Tests
- **NUNCA** mockear la base de datos → los tests usan SQLite in-memory (`sqlite+aiosqlite:///:memory:`); solo se mockean APIs externas (LLM).
- **NUNCA** hacer pasar un test con una aserción vacía o trivial → cada test debe verificar un comportamiento real.

### Commits y CI
- **NUNCA** commitear sin que los tests pasen → `pytest` debe correr verde antes de cualquier commit.
- **NUNCA** mensajes de commit sin prefijo Conventional Commits → usar `feat:`, `fix:`, `chore:`, `test:`, `docs:`.
- **Siempre** incluir `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` en commits generados por agente.

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias
3. /opsx:propose C-NN-nombre                     → proposal + design + specs + tasks
4. Implementar las tasks (cargando skills)       → respetando las reglas duras
5. /opsx:archive C-NN-nombre + marcar [x]        → cerrar el change
```

Ante conflicto entre la KB y este archivo, las **reglas duras prevalecen**.
Ante conflicto entre `CHANGES.md` y la KB, la **KB prevalece** (es la fuente de verdad del dominio).
