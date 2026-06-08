## Context

C-03 implementó el `product_repository` con los métodos `count_all()`, `count_low_stock()` y `count_out_of_stock()`. Este change los consume desde una capa de servicio nueva y expone los KPIs vía un router FastAPI separado. El `main.py` ya registra los routers de productos y movimientos con el patrón `app.include_router(...)`.

## Goals / Non-Goals

**Goals:**
- Endpoint `GET /dashboard` que retorna `{ total_products, low_stock_count, out_of_stock_count }`.
- Lógica de conteo en `dashboard_service.py`, no en el router (RN-DH-02).
- Cálculo en tiempo real sin caché (RN-DH-03).
- Tests con SQLite in-memory cubriendo BD vacía y escenarios con productos.

**Non-Goals:**
- Caché o precálculo de KPIs.
- Histórico de KPIs a lo largo del tiempo.
- Autenticación del endpoint (fuera de scope v1.0).
- Métricas adicionales (valor total del inventario, top productos).

## Decisions

### D-01: Dashboard service delegando a product_repository

El `dashboard_service.get_kpis()` llama directamente a `product_repository.count_all()`, `count_low_stock()` y `count_out_of_stock()`. No duplica lógica SQL.

**Alternativa descartada**: calcular conteos en el route con una sola query `SELECT stock, minimum_stock FROM products` y filtrar en Python. Se descarta porque viola RN-DH-02 y dispersa lógica de negocio fuera de la capa de servicio.

### D-02: Schema de respuesta con Pydantic

`DashboardResponse` schema en `backend/app/schemas/dashboard_schema.py` con tres campos `int`. Esto permite validación de salida y documentación automática en Swagger.

### D-03: Router con prefijo `/dashboard`

El router se registra con `prefix="/dashboard"` para consistencia con el patrón ya establecido en `product_routes.py` y `movement_routes.py`.

## Risks / Trade-offs

- **[Riesgo] Conteos inconsistentes bajo carga concurrente** → Aceptable en v1.0 de single-user; no se mitiga en este change.
- **[Trade-off] Tres queries separadas vs una query con CASE WHEN** → Se prefieren tres queries simples para legibilidad y porque el repositorio ya las tiene implementadas. El overhead es insignificante en el volumen esperado.
