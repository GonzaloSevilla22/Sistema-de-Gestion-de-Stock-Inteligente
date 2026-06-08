## ADDED Requirements

### Requirement: Dashboard KPI endpoint
El sistema SHALL exponer un endpoint `GET /dashboard` que retorne los conteos de productos en tiempo real.

La respuesta SHALL tener la estructura:
```json
{ "total_products": int, "low_stock_count": int, "out_of_stock_count": int }
```

Los conteos se calculan en la capa de servicio (no en el router) usando `product_repository`. No hay caché ni precálculo; reflejan el estado actual de la BD.

#### Scenario: Dashboard con base de datos vacía
- **WHEN** no existen productos en la base de datos y se llama `GET /dashboard`
- **THEN** el sistema retorna `{ "total_products": 0, "low_stock_count": 0, "out_of_stock_count": 0 }` con HTTP 200

#### Scenario: Dashboard con productos en estado normal
- **WHEN** existen productos cuyo `stock > minimum_stock` y se llama `GET /dashboard`
- **THEN** `total_products` refleja el conteo total y `low_stock_count` y `out_of_stock_count` son 0

#### Scenario: Dashboard con productos en stock bajo
- **WHEN** existen productos con `stock > 0` y `stock <= minimum_stock` y se llama `GET /dashboard`
- **THEN** `low_stock_count` refleja el conteo de esos productos

#### Scenario: Dashboard con productos agotados
- **WHEN** existen productos con `stock == 0` y se llama `GET /dashboard`
- **THEN** `out_of_stock_count` refleja el conteo de esos productos

#### Scenario: Dashboard con mezcla de estados
- **WHEN** existen productos en los tres estados (normal, bajo, agotado) y se llama `GET /dashboard`
- **THEN** cada conteo refleja solo los productos en su respectivo estado sin superposición

### Requirement: Lógica en capa de servicio
El sistema SHALL calcular los KPIs en `dashboard_service.get_kpis()`, no en el router.

#### Scenario: Separación de responsabilidades
- **WHEN** el endpoint `GET /dashboard` recibe una request
- **THEN** el router delega el cálculo a `dashboard_service.get_kpis(db)` y retorna su resultado sin procesamiento adicional
