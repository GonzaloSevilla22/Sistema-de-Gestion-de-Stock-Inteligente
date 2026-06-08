## Context

C-02 dejó definidos el modelo ORM `Product` y los schemas Pydantic (`ProductCreate`, `ProductUpdate`, `ProductResponse`). No existe aún ninguna capa que los consuma: no hay repositorio, no hay service y no hay rutas HTTP. Este change completa la vertical backend del dominio de productos.

Stack relevante: FastAPI 0.110+, SQLAlchemy 2.0 (`select()`, `Mapped`), Pydantic v2, SQLite (dev) / PostgreSQL (prod).

## Goals / Non-Goals

**Goals:**
- Implementar `product_repository.py` con operaciones CRUD y métodos de conteo para dashboard.
- Implementar `product_service.py` con todas las reglas de negocio del dominio (RN-PR-01..05, RN-ST-01..04).
- Exponer los 5 endpoints REST de productos en `product_routes.py`.
- Cubrir los casos de negocio críticos con tests TDD en `test_product_service.py`.

**Non-Goals:**
- Endpoints de movimientos (C-04).
- Endpoints de dashboard (C-05).
- Autenticación / autorización (fuera del alcance v1.0).
- Paginación o filtrado avanzado en el listado (v1.0 devuelve todos los productos).

## Decisions

### 1. Repository pattern estricto
Las queries SQLAlchemy viven **únicamente** en `product_repository.py`. El service recibe objetos de dominio, no sesiones ni `select()`. Esto cumple la regla dura del proyecto y facilita los tests (el service puede testearse con un repositorio falso).

**Alternativa descartada**: queries directas en el service. Se descarta porque viola la separación de capas y la regla dura del proyecto.

### 2. Estado de alerta calculado en el service, no persistido
El campo `alert_status` (normal / low / out_of_stock) se calcula en `product_service.py` a partir de `stock` y `minimum_stock` antes de serializar la respuesta (RN-ST-04). No existe columna en la BD para este campo.

**Alternativa descartada**: columna `alert_status` con trigger. Agrega complejidad innecesaria y diverge en SQLite vs PostgreSQL.

### 3. Validación de nombre único en el service (no solo en DB)
Antes de insertar o actualizar, el service llama a `product_repository.get_by_name(name)`. Si existe y el `id` es distinto al producto actual, lanza `HTTPException(409)`. La constraint `UNIQUE` en la BD existe como última línea de defensa, pero el service es el punto de control real (RN-PR-04).

**Razón**: mejora la experiencia de error — el cliente recibe 409 con mensaje descriptivo en español (RN-GL-01) en lugar de un IntegrityError de SQLAlchemy convertido en 500.

### 4. Inyección de sesión vía dependencia FastAPI
Las rutas reciben `db: AsyncSession = Depends(get_db)` y lo pasan al repositorio. El service no conoce la sesión — la recibe como argumento del repositorio (el repositorio es el propietario de la sesión).

### 5. Respuesta de delete: 204 No Content
`DELETE /products/{id}` retorna `204 No Content` cuando el producto existe y fue eliminado. Si no existe, retorna `404`. Ningún body en la respuesta 204.

## Risks / Trade-offs

- **[Riesgo] Cascade delete en SQLite puede tener comportamiento distinto a PostgreSQL** → Mitigación: el modelo `StockMovement` ya define `cascade="all, delete-orphan"` en la relación ORM (C-02), lo que garantiza el comportamiento en ambos motores.
- **[Trade-off] Sin paginación en v1.0** → `GET /products` devuelve todos los registros. Aceptable para el volumen esperado (catálogo académico, <1000 productos). C-06 o posterior puede añadirla.
- **[Riesgo] Tests en SQLite in-memory** → Los tipos de columna (especialmente `Enum`) pueden comportarse distinto. Mitigación: usar `native_enum=False` en el modelo para compatibilidad multiplataforma (ya definido en C-02).

## Migration Plan

No hay cambios al esquema de la BD — no se requiere migración Alembic. El deploy de este change es: añadir los 3 archivos nuevos y registrar el router en `main.py`.

Rollback: remover el `include_router(product_router)` de `main.py` y los 3 archivos. Sin impacto en datos.
