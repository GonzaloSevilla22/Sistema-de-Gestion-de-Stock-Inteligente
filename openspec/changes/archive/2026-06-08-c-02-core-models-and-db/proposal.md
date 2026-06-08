## Why

La fundación del proyecto (`C-01`) establece la estructura de directorios y la configuración del motor de BD, pero no define ningún modelo ni contrato de datos. Sin los modelos SQLAlchemy y los schemas Pydantic, ningún dominio de negocio (productos, movimientos, dashboard, IA) puede ser implementado. Este change establece la capa de datos persistente que todos los changes de backend posteriores usan como base.

## What Changes

- **Nuevo**: `backend/app/models/product.py` — modelo SQLAlchemy 2.0 `Product` con 8 campos, 2 índices, y relación one-to-many con `StockMovement`
- **Nuevo**: `backend/app/models/stock_movement.py` — modelo SQLAlchemy 2.0 `StockMovement` con FK a `Product`, CASCADE DELETE, enum `ENTRADA`/`SALIDA`, y 2 índices
- **Nuevo**: `backend/app/schemas/product_schema.py` — schemas Pydantic v2 `ProductCreate`, `ProductUpdate`, `ProductResponse` con nombres de campo en inglés
- **Nuevo**: `backend/app/schemas/movement_schema.py` — schemas Pydantic v2 `MovementCreate`, `MovementResponse`
- **Nuevo**: `backend/seed.py` — script de seed con 4 productos que representan los 3 estados posibles (normal, stock bajo, agotado)
- **Nuevo**: `backend/tests/test_models.py` — tests de creación de modelos y CASCADE DELETE en SQLite in-memory

## Capabilities

### New Capabilities

- `product-model`: Modelo de datos `Product` con validaciones de integridad — campos, restricciones, índices y relación con movimientos
- `stock-movement-model`: Modelo de datos `StockMovement` con FK, CASCADE DELETE, enum de tipos y reglas de integridad a nivel BD
- `product-schema`: Contrato Pydantic para la API de productos — separación entre el modelo ORM y el DTO de la API
- `movement-schema`: Contrato Pydantic para la API de movimientos

### Modified Capabilities

## Impact

- **Backend**: los models en `app/models/` y schemas en `app/schemas/` son importados por todos los cambios de backend futuros (C-03 a C-09)
- **Base de datos**: al arrancar `main.py` con `create_all()`, las tablas `product` y `stock_movement` se crean automáticamente en SQLite (dev) o PostgreSQL (prod)
- **Tests**: `backend/tests/test_models.py` requiere SQLite in-memory; no hay dependencias externas
- **Seed**: `backend/seed.py` se ejecuta manualmente o vía `lifespan` en entorno de desarrollo para poblar datos de ejemplo
- **Sin breaking changes**: no existe API pública aún; este change es puramente interno
