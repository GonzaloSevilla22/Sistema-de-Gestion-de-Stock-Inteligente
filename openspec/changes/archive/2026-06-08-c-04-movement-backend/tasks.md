## 1. Extender ProductRepository con update_stock()

- [x] 1.1 Agregar método `update_stock(product_id: int, new_stock: int, db: AsyncSession) -> Product | None` en `backend/app/repositories/product_repository.py`
- [x] 1.2 El método debe usar `select()` + `scalar_one_or_none()` (SQLAlchemy 2.0) y retornar `None` si el producto no existe

## 2. Implementar MovementRepository

- [x] 2.1 Crear `backend/app/repositories/movement_repository.py` con clase `MovementRepository`
- [x] 2.2 Implementar `create(movement_data: MovementCreate, db: AsyncSession) -> StockMovement`
- [x] 2.3 Implementar `get_all(db: AsyncSession) -> list[StockMovement]` (sin paginación)
- [x] 2.4 Implementar `get_by_product_id(product_id: int, db: AsyncSession) -> list[StockMovement]`

## 3. Implementar MovementService con lógica de negocio

- [x] 3.1 Crear `backend/app/services/movement_service.py` con clase `MovementService`
- [x] 3.2 Implementar `create_movement(data: MovementCreate, db: AsyncSession) -> StockMovement`:
  - Obtener producto con `product_repository.get_by_id()` → 404 si no existe
  - Si `type == SALIDA` y `product.stock < quantity` → `HTTPException(400, "Stock insuficiente para registrar la salida")`
  - Calcular `new_stock`: `stock + quantity` para ENTRADA, `stock - quantity` para SALIDA
  - Llamar `product_repository.update_stock(product_id, new_stock, db)`
  - Llamar `movement_repository.create(data, db)` para persistir
  - Retornar el movimiento creado
- [x] 3.3 Implementar `get_all_movements(db: AsyncSession) -> list[StockMovement]` delegando al repositorio

## 4. Implementar movement_routes.py

- [x] 4.1 Crear `backend/app/api/movement_routes.py` con `APIRouter(prefix="/movements", tags=["movements"])`
- [x] 4.2 Endpoint `GET /movements` → retorna `list[MovementResponse]` (200)
- [x] 4.3 Endpoint `POST /movements` → recibe `MovementCreate`, retorna `MovementResponse` (201); delega al service

## 5. Registrar el router en main.py

- [x] 5.1 Importar `movement_router` en `backend/app/main.py` y añadirlo con `app.include_router(movement_router)`

## 6. Tests — TDD ciclo completo

- [x] 6.1 Crear `backend/tests/test_movement_service.py` con fixture de BD SQLite in-memory y un producto de prueba
- [x] 6.2 Test: entrada válida → stock del producto se incrementa en `quantity`
- [x] 6.3 Test: salida válida → stock del producto se decrementa en `quantity`
- [x] 6.4 Test: salida con stock insuficiente → retorna 400, stock NO cambia, movimiento NO se crea
- [x] 6.5 Test: `product_id` inexistente → retorna 404
- [x] 6.6 Test: `type` inválido (e.g. `"OTRO"`) → retorna 422 (Pydantic)
- [x] 6.7 Test: `quantity <= 0` → retorna 422 (Pydantic)
- [x] 6.8 Test: `GET /movements` con lista vacía → retorna `[]`
- [x] 6.9 Test: `GET /movements` después de crear movimientos → retorna todos
- [x] 6.10 Verificar que el campo `date` del movimiento creado no puede ser enviado por el cliente (no está en `MovementCreate`)

## 7. Verificación final

- [x] 7.1 Ejecutar `pytest backend/tests/test_movement_service.py -v` — todos los tests en verde
- [x] 7.2 Ejecutar `pytest` completo para verificar que no se rompieron tests de C-03
- [x] 7.3 Iniciar el servidor y verificar que `GET /movements` y `POST /movements` responden correctamente
