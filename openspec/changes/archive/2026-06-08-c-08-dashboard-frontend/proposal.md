## Why

El backend de dashboard (C-05) ya expone `GET /dashboard` con los KPIs de stock. La ruta `/` del frontend muestra actualmente un stub vacío; los usuarios no tienen ninguna vista del estado real del inventario al entrar a la aplicación.

## What Changes

- Reemplazar el placeholder de la página `Dashboard` por una implementación real con tarjetas de KPIs.
- Agregar un servicio `dashboardApi.ts` que llame a `GET /api/dashboard`.
- Agregar un hook `useDashboard.ts` con React Query (auto-refresh cada 30 s).
- Crear el componente `KpiCard.tsx` reutilizable para mostrar un indicador con título, valor e ícono/color de estado.
- Actualizar `src/pages/Dashboard.tsx` para mostrar las tres tarjetas (Total, Stock Bajo, Sin Stock) con loading/error states.

## Capabilities

### New Capabilities
- `dashboard-frontend`: Página Dashboard del frontend — servicio API, hook React Query, componente KpiCard y página que consume `GET /dashboard`.

### Modified Capabilities
- `frontend-foundation`: La ruta `/` pasa de stub a página funcional con KPI cards reales (cambio de comportamiento visible al usuario).

## Impact

- `frontend/src/services/dashboardApi.ts` — nuevo
- `frontend/src/hooks/useDashboard.ts` — nuevo
- `frontend/src/components/KpiCard.tsx` — nuevo
- `frontend/src/pages/Dashboard.tsx` — reemplazado stub
- `frontend/src/types/index.ts` — el tipo `DashboardKPIs` ya existe; no se modifica
- Dependencia de runtime: backend C-05 debe estar corriendo en `http://localhost:8000`
