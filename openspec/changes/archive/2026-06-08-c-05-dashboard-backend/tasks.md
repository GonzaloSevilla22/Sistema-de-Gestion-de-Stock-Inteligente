## 1. Schema de respuesta

- [x] 1.1 Crear `backend/app/schemas/dashboard_schema.py` con `DashboardResponse(BaseModel)`: campos `total_products: int`, `low_stock_count: int`, `out_of_stock_count: int`

## 2. Dashboard Service

- [x] 2.1 Crear `backend/app/services/dashboard_service.py` con función `get_kpis(db: Session) -> DashboardResponse` que llama a `product_repository.count_all()`, `count_low_stock()` y `count_out_of_stock()`

## 3. Dashboard Router

- [x] 3.1 Crear `backend/app/api/dashboard_routes.py` con endpoint `GET /` que retorna `DashboardResponse`; delegar a `dashboard_service.get_kpis(db)`
- [x] 3.2 Registrar el router en `backend/app/main.py` con `prefix="/dashboard"` y `tags=["dashboard"]`

## 4. Tests TDD

- [x] 4.1 Crear `backend/tests/test_dashboard_service.py` — Safety net: ejecutar tests existentes y capturar baseline
- [x] 4.2 RED: escribir test `test_dashboard_empty_db` — BD vacía → todos los conteos en 0
- [x] 4.3 GREEN: confirmar que el service pasa el test
- [x] 4.4 TRIANGULATE: agregar tests `test_dashboard_with_normal_products`, `test_dashboard_with_low_stock`, `test_dashboard_with_out_of_stock`, `test_dashboard_mixed_states`
- [x] 4.5 Ejecutar `pytest backend/tests/test_dashboard_service.py -v` — todos verdes

## 5. Verificación final

- [x] 5.1 Ejecutar `pytest backend/tests/ -v` — suite completa verde sin regresiones
- [x] 5.2 Verificar que `GET /dashboard` está documentado en Swagger (`/docs`)
