## Why

Con C-03 el sistema puede gestionar el catálogo de productos pero no puede registrar entradas ni salidas de stock. Sin esta capa, el stock de cada producto es un valor estático que no refleja la operatoria real del almacén. C-04 implementa el backend completo de movimientos para cerrar esa brecha.

## What Changes

- Nuevo módulo `movement_repository.py` con operaciones CRUD básicas para `StockMovement`
- Nuevo módulo `movement_service.py` con toda la lógica de negocio: validación de tipo, cantidad > 0, verificación de stock suficiente antes de SALIDA, actualización atómica del stock del producto y asignación de fecha en servidor
- Nuevos endpoints `GET /movements` y `POST /movements` en `movement_routes.py`
- Nuevo método `update_stock()` en `product_repository.py` (extensión de C-03)
- Suite de tests en `test_movement_service.py` con todos los casos del negocio documentados en RN-MV

## Capabilities

### New Capabilities
- `stock-movements`: Registro y consulta de movimientos de entrada/salida de stock con actualización automática del stock del producto

### Modified Capabilities
- `products`: Se añade `update_stock()` al repositorio para soportar la actualización de stock desde el servicio de movimientos; no hay cambios en los requerimientos de la spec existente, solo una extensión de la interfaz del repositorio

## Impact

- **Archivos nuevos**: `backend/app/repositories/movement_repository.py`, `backend/app/services/movement_service.py`, `backend/app/api/movement_routes.py`, `backend/tests/test_movement_service.py`
- **Archivos modificados**: `backend/app/repositories/product_repository.py` (nuevo método `update_stock()`), `backend/app/main.py` (registro del router de movimientos)
- **Dependencias**: `C-03` debe estar completo — se reutilizan `ProductRepository`, `Product` model y `StockMovement` model definidos en C-02/C-03
- **APIs expuestas**: `GET /movements` (lista todos), `POST /movements` (crea con validación y actualiza stock)
