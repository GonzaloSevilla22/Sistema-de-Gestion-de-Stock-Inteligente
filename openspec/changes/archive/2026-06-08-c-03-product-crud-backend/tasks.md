## 1. Safety Net y Setup

- [x] 1.1 Correr `pytest --co` para verificar que los tests de C-02 pasan sin errores (baseline)
- [x] 1.2 Verificar que existen `backend/app/repositories/__init__.py`, `backend/app/services/__init__.py` y `backend/app/api/__init__.py`; crearlos si faltan

## 2. Repositorio de Productos

- [x] 2.1 Crear `backend/app/repositories/product_repository.py` con `create(db, product_data) -> Product`
- [x] 2.2 Agregar `get_by_id(db, product_id) -> Product | None`
- [x] 2.3 Agregar `get_all(db) -> list[Product]`
- [x] 2.4 Agregar `update(db, product_id, update_data) -> Product | None`
- [x] 2.5 Agregar `delete(db, product_id) -> bool`
- [x] 2.6 Agregar `get_by_name(db, name) -> Product | None` (usado para validar unicidad)
- [x] 2.7 Agregar `count_all(db) -> int`, `count_low_stock(db) -> int`, `count_out_of_stock(db) -> int` (para dashboard C-05)

## 3. Service + Tests (TDD — ciclo RED → GREEN → TRIANGULATE → REFACTOR)

- [x] 3.1 [RED] Crear `backend/tests/test_product_service.py`; escribir `test_create_product_valid` — el test debe fallar porque el service no existe
- [x] 3.2 [GREEN] Crear `backend/app/services/product_service.py` con `create_product()` mínimo que pase el test
- [x] 3.3 [RED] Agregar `test_create_product_duplicate_name` — espera `HTTPException(409)`
- [x] 3.4 [GREEN] Agregar validación de nombre único en `create_product()` llamando a `product_repository.get_by_name()`
- [x] 3.5 [TRIANGULATE] Agregar `test_create_product_negative_price` — espera `422` o `HTTPException`; verificar que `ProductCreate` schema rechaza `price < 0`
- [x] 3.6 [RED] Agregar `test_get_all_products_empty` y `test_get_all_products_with_items`
- [x] 3.7 [GREEN] Implementar `get_all_products()` en service con cálculo de `alert_status` para cada producto
- [x] 3.8 [RED] Agregar `test_get_product_by_id_found` y `test_get_product_by_id_not_found` — el segundo espera `HTTPException(404)`
- [x] 3.9 [GREEN] Implementar `get_product_by_id()` con `HTTPException(404)` si no existe
- [x] 3.10 [RED] Agregar `test_update_product_valid` y `test_update_product_duplicate_name`
- [x] 3.11 [GREEN] Implementar `update_product()` con validación de nombre único excluyendo el propio producto
- [x] 3.12 [RED] Agregar `test_delete_product_cascade` — verificar que tras delete el producto no existe y sus movimientos tampoco
- [x] 3.13 [GREEN] Implementar `delete_product()` con `HTTPException(404)` si no existe
- [x] 3.14 [TRIANGULATE] Agregar `test_alert_status_normal`, `test_alert_status_low`, `test_alert_status_out_of_stock` para los tres estados de RN-ST-01/02/03
- [x] 3.15 [REFACTOR] Extraer helper `_calculate_alert_status(stock, minimum_stock) -> str` dentro del service; re-correr tests

## 4. Rutas API

- [x] 4.1 Crear `backend/app/api/product_routes.py` con `APIRouter(prefix="/products", tags=["products"])`
- [x] 4.2 Implementar `GET /products` → llama `product_service.get_all_products()`; retorna `list[ProductResponse]`
- [x] 4.3 Implementar `GET /products/{product_id}` → llama `product_service.get_product_by_id()`; retorna `ProductResponse` o 404
- [x] 4.4 Implementar `POST /products` con `status_code=201` → llama `product_service.create_product()`; retorna `ProductResponse`
- [x] 4.5 Implementar `PUT /products/{product_id}` → llama `product_service.update_product()`; retorna `ProductResponse`
- [x] 4.6 Implementar `DELETE /products/{product_id}` con `status_code=204` → llama `product_service.delete_product()`; retorna `Response` vacío
- [x] 4.7 Registrar `product_router` en `backend/app/main.py` con `app.include_router(product_router)`

## 5. Verificación Final

- [x] 5.1 Correr `pytest backend/tests/test_product_service.py -v` — todos los tests deben pasar en verde
- [x] 5.2 Correr `pytest --co` global — sin errores de colección
- [x] 5.3 Levantar el servidor con `uvicorn app.main:app --reload` y verificar que `GET /products` responde `200 []` y `POST /products` con body válido responde `201`
