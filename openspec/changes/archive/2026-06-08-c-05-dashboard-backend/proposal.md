## Why

El sistema necesita un endpoint centralizado que exponga los KPIs del inventario en tiempo real para la pantalla de Dashboard (US-001). Sin este endpoint el frontend no puede mostrar los conteos de productos totales, stock bajo y agotados que dan visibilidad inmediata al gestor de stock.

## What Changes

- Nuevo módulo `backend/app/services/dashboard_service.py` con método `get_kpis()` que orquesta los conteos desde el repositorio de productos.
- Nuevo módulo `backend/app/api/dashboard_routes.py` con el endpoint `GET /dashboard`.
- Registro del router de dashboard en `backend/app/main.py`.
- Tests unitarios `backend/tests/test_dashboard_service.py` cubriendo BD vacía y escenarios con productos en distintos estados.

## Capabilities

### New Capabilities

- `dashboard`: Endpoint `GET /dashboard` que retorna `{ total_products, low_stock_count, out_of_stock_count }` calculado en tiempo real sin caché (RN-DH-01, RN-DH-02, RN-DH-03).

### Modified Capabilities

*(ninguna — no cambian requisitos de specs existentes)*

## Impact

- **Nuevos archivos**: `backend/app/services/dashboard_service.py`, `backend/app/api/dashboard_routes.py`, `backend/tests/test_dashboard_service.py`
- **Modificado**: `backend/app/main.py` (registro del router)
- **Sin cambios en BD**: no se agregan modelos ni migraciones
- **Dependencia reutilizada**: `product_repository.count_all()`, `count_low_stock()`, `count_out_of_stock()` ya implementados en C-03
