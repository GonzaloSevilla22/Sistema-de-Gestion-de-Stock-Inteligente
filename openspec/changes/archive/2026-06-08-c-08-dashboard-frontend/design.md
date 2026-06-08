## Context

El backend expone `GET /dashboard` (implementado en C-05) que retorna `{ total_products, low_stock_count, out_of_stock_count }`. El frontend tiene la ruta `/` definida en `App.tsx` apuntando a `<Dashboard />`, pero la página es un stub vacío. El resto del frontend (servicios Axios, hooks React Query v5, tipado estricto TS) ya fue establecido en C-06 y sigue los mismos patrones.

## Goals / Non-Goals

**Goals:**
- Consumir `GET /api/dashboard` y mostrar los tres KPIs en tarjetas visuales.
- Auto-refrescar los datos cada 30 segundos sin intervención del usuario.
- Mostrar estados de loading y error de forma clara.
- Reutilizar los patrones de `services/`, `hooks/` y `types/` ya establecidos en C-06.

**Non-Goals:**
- Gráficos de tendencia o histórico (fuera del alcance v1.0).
- Filtros por fecha o categoría.
- Lógica de recomendación de IA (C-09).

## Decisions

### D-01: Mismo patrón services + hooks que C-06
Crear `dashboardApi.ts` (llamada HTTP) y `useDashboard.ts` (React Query hook) — idéntico al patrón de `productApi.ts` / `useProducts.ts`. Alternativa descartada: llamar fetch directamente en el componente (mezcla capas, dificulta tests).

### D-02: KpiCard como componente presentacional puro
`KpiCard.tsx` recibe `{ title, value, colorClass }` por props. No conoce el dominio. Alternativa descartada: hardcodear las tres tarjetas inline en `Dashboard.tsx` (duplicación de estilos, difícil de mantener si se agregan KPIs).

### D-03: `staleTime` 30 s + `refetchInterval` 30 s en useDashboard
Los KPIs de stock cambian con cada movimiento. 30 s de refresco automático es un balance razonable para un sistema de gestión en clase. Alternativa descartada: invalidar desde `useMovements` (coupling innecesario entre hooks).

### D-04: Color de KpiCard basado en tipo de indicador
- Total productos → azul (`blue`)
- Stock bajo → amarillo (`yellow`)
- Sin stock → rojo (`red`)
Las clases Tailwind se pasan como prop `colorClass` (e.g. `"blue"`) y se mapean a las clases reales dentro de `KpiCard` para evitar problemas de purging dinámico.

## Risks / Trade-offs

- [Risk] Si el backend no está corriendo, el hook retorna error → Mitigation: estado de error visible con mensaje claro ("No se pudo conectar al servidor").
- [Trade-off] El refresco automático genera polling al backend cada 30 s por pestaña abierta → Aceptable para entorno académico; en producción se usaría WebSocket.
