## Why

El modelo `Product` y sus schemas Pydantic ya existen (C-02), pero no hay ninguna capa que los exponga al exterior. Este change implementa el repositorio, el service con reglas de negocio y los endpoints REST de productos para que el frontend (y los changes dependientes C-04, C-05) puedan operar sobre el inventario.

## What Changes

- **Nuevo**: `backend/app/repositories/product_repository.py` — operaciones CRUD sobre `Product` más métodos de conteo para el dashboard (`count_all`, `count_low_stock`, `count_out_of_stock`, `get_by_name`).
- **Nuevo**: `backend/app/services/product_service.py` — lógica de negocio: validación de nombre único (RN-PR-04), precio ≥ 0 (RN-PR-02), stock ≥ 0 (RN-PR-03), cálculo dinámico de estado de alerta (RN-ST-01, RN-ST-02, RN-ST-03, RN-ST-04).
- **Nuevo**: `backend/app/api/product_routes.py` — endpoints `GET /products`, `GET /products/{id}`, `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}`; respuestas `201` en create, `404` si no existe, `409` en nombre duplicado.
- **Nuevo**: `backend/tests/test_product_service.py` — suite TDD: crear válido, nombre duplicado (409), precio negativo (422), listar, editar, eliminar con cascada.

## Capabilities

### New Capabilities
- `product-crud`: API REST completa de productos — repositorio, service con reglas de negocio (RN-PR-01..05, RN-ST-01..04) y rutas FastAPI.

### Modified Capabilities
<!-- Sin cambios de requisitos en specs existentes -->

## Impact

- **Depende de**: `C-02` (`product-model`, `product-schema`, `backend-foundation`).
- **Habilita**: `C-04` (movement-backend necesita `product_repository.get_by_id` y `update_stock`), `C-05` (dashboard-backend usa los métodos de conteo), `C-06` (frontend de productos consume los endpoints).
- **Sin cambios de schema** en la BD — no requiere migración Alembic nueva.
- **API externa** afectada: ninguna en este change (la IA es C-09).
