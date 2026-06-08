## 1. Tipos y servicio API

- [x] 1.1 Verificar que `DashboardKPIs` existe en `frontend/src/types/index.ts` (debe tener `total_products`, `low_stock_count`, `out_of_stock_count` como `number`)
- [x] 1.2 Crear `frontend/src/services/dashboardApi.ts` con `getDashboardKPIs(): Promise<DashboardKPIs>` usando la instancia Axios de `api.ts`

## 2. Hook React Query

- [x] 2.1 Crear `frontend/src/hooks/useDashboard.ts` con `useDashboard()` que envuelve `getDashboardKPIs`, `staleTime: 30_000`, `refetchInterval: 30_000`, y retorna `{ data, isLoading, isError }`

## 3. Componente KpiCard

- [x] 3.1 Crear `frontend/src/components/KpiCard.tsx` con props `title: string`, `value: number | undefined`, `colorClass: "blue" | "yellow" | "red"`
- [x] 3.2 Implementar estilos condicionales en `KpiCard` para cada `colorClass` usando clases Tailwind estáticas (sin interpolación dinámica)
- [x] 3.3 Implementar estado de loading en `KpiCard`: cuando `value` es `undefined`, mostrar un placeholder animado (`animate-pulse`)

## 4. Página Dashboard

- [x] 4.1 Reemplazar `frontend/src/pages/Dashboard.tsx` con la implementación real que usa `useDashboard()` y renderiza tres `KpiCard`
- [x] 4.2 Agregar estado de loading global: mostrar "Cargando..." o skeleton mientras `isLoading` es true
- [x] 4.3 Agregar estado de error: mostrar mensaje "No se pudo conectar al servidor" cuando `isError` es true
- [x] 4.4 Mostrar las tres tarjetas: Total Productos (blue), Stock Bajo (yellow), Sin Stock (red) con los valores de `data`

## 5. Verificación TypeScript

- [x] 5.1 Ejecutar `npx tsc --noEmit` desde `frontend/` y verificar que compila sin errores
