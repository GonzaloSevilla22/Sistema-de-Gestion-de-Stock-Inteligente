## Context

`C-01` creó el motor SQLAlchemy (`connection.py`) y la sesión (`session.py`) pero no registró ningún modelo. Este change define los dos únicos modelos del sistema (`Product` y `StockMovement`) junto con sus schemas Pydantic, cerrando así la capa de datos antes de que cualquier ruta o servicio sea implementado.

Stack: Python 3.11, FastAPI 0.110+, SQLAlchemy 2.0, Pydantic v2, SQLite (dev) / PostgreSQL 15 (prod).

## Goals / Non-Goals

**Goals:**
- Definir los modelos ORM `Product` y `StockMovement` con SQLAlchemy 2.0 (`Mapped[T]`, `mapped_column()`)
- Crear los schemas Pydantic v2 desacoplados de los modelos ORM
- Definir índices de BD documentados en la KB
- Implementar CASCADE DELETE a nivel ORM y DB
- Proveer seed data con los 4 productos de ejemplo
- Tests de modelos en SQLite in-memory

**Non-Goals:**
- Lógica de negocio (validaciones de unicidad, stock suficiente) — pertenece a C-03 y C-04
- Endpoints HTTP — pertenecen a C-03 y C-04
- Repositorios — pertenecen a C-03 y C-04
- Migraciones Alembic — el lifespan de C-01 usa `create_all()` para desarrollo; Alembic va en C-10
- Frontend — pertenece a C-06

## Decisions

### D-01: SQLAlchemy 2.0 exclusivamente (sin API legacy)

**Decisión**: usar `Mapped[type]`, `mapped_column()`, `select()` en todos los modelos. No usar `Column()`, `session.query()`.

**Alternativa descartada**: API legacy de SQLAlchemy 1.x — ya declarada obsoleta en SA 2.0 y prohibida por regla dura del proyecto.

**Razón**: compatibilidad con SA 2.0, type safety, alineación con la regla dura del CLAUDE.md.

---

### D-02: Enum de tipo de movimiento como `str` Python Enum + validación Pydantic

**Decisión**: el campo `type` en `StockMovement` se representa como un `Enum` Python (`MovementType`) con valores `"ENTRADA"` y `"SALIDA"`. SQLAlchemy lo almacena como `VARCHAR(10)` (sin tipo `ENUM` nativo de BD) para compatibilidad SQLite/PostgreSQL.

**Alternativa descartada**: `ENUM` de PostgreSQL — no soportado en SQLite; complicaría las migraciones.

**Razón**: portabilidad entre SQLite (dev) y PostgreSQL (prod) sin necesidad de migraciones condicionales.

---

### D-03: Schemas Pydantic desacoplados de los modelos ORM

**Decisión**: los schemas `ProductCreate`, `ProductUpdate`, `ProductResponse` y sus equivalentes de movimiento son clases Pydantic independientes. No usan `from_orm()` ni herencia directa del modelo SQLAlchemy.

**Razón**: el modelo ORM puede cambiar (índices, relaciones) sin afectar el contrato de la API. Permite evolución independiente de la capa de datos y la capa de presentación.

**Nota sobre nombres de campo**: todos los campos usan inglés (`stock`, `minimum_stock`, `product_id`) siguiendo la decisión IN-01 de `knowledge-base/10_preguntas_abiertas.md`. Las etiquetas en español aparecen solo en el frontend.

---

### D-04: CASCADE DELETE a nivel ORM (no solo constraint SQL)

**Decisión**: la relación `Product → StockMovement` define `cascade="all, delete-orphan"` en el lado ORM y `ondelete="CASCADE"` en el `ForeignKey`. Ambas capas se configuran para garantizar el comportamiento tanto en operaciones ORM como en DELETE directo por SQL.

**Razón**: RN-PR-05 exige que al eliminar un producto, todos sus movimientos se eliminen. Sin `ondelete="CASCADE"` en el FK, una deleción directa por SQL (seed, tests) no propaga el cascade.

---

### D-05: Seed script independiente (`backend/seed.py`)

**Decisión**: el seed no es parte del lifespan de la app en producción. Es un script independiente que se ejecuta manualmente con `python seed.py` o bien puede invocarse condicionalmente en el lifespan solo si `ENV=development`.

**Razón**: no contaminar la BD de producción con datos de prueba.

## Risks / Trade-offs

- **[Riesgo] SQLite no valida el tipo VARCHAR del Enum en CHECK constraint** → Mitigación: la validación ocurre en el schema Pydantic (nivel API) y en el service (nivel negocio); SQLite es solo para desarrollo.
- **[Trade-off] `create_all()` en lugar de Alembic** → Para desarrollo local es suficiente; Alembic se agrega en C-10 para producción. Riesgo: si se modifica el schema en C-03+, hay que dropear y recrear la BD local manualmente.
- **[Riesgo] Índices no creados en SQLite in-memory en tests** → Los tests verifican comportamiento de modelos, no performance; los índices son definidos en el modelo y se crean con `create_all()`, por lo que si los tests usan `create_all()` también se crean.

## Open Questions

- ¿El campo `created_at` de `Product` debe tener `timezone=True`? → Por ahora `False` (naive datetime) para simplicidad; cambiar en C-10 si el deploy en producción requiere TZ-aware.
