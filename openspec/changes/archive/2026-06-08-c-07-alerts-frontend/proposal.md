## Why

La página de Productos muestra el estado de alerta (`alert_status`) de cada producto en su tabla, pero no existe ningún componente dedicado que agrupe y destaque visualmente los productos en riesgo, ni tampoco la integración con el endpoint IA (`POST /ai/recommendation`) implementado en C-09. Sin esta capa frontend, el diferenciador inteligente del sistema (recomendaciones LLM) es inaccesible para el usuario.

## What Changes

- **Nuevo** `frontend/src/components/AlertList.tsx`: panel que filtra y muestra sólo los productos con `alert_status` en `'low'` o `'out_of_stock'`, con badges visuales diferenciados.
- **Nuevo** `frontend/src/services/aiApi.ts`: función `getRecommendation()` que llama a `POST /ai/recommendation`.
- **Nuevo** `frontend/src/hooks/useAI.ts`: hook `useAIRecommendation()` con `useMutation` de React Query.
- **Nuevo** `frontend/src/components/AIRecommendationModal.tsx`: modal con estados loading / success / error que muestra la recomendación del LLM o el mensaje de fallback.
- **Modificado** `frontend/src/pages/Products.tsx`: agrega `AlertList` como sección superior y botón "Obtener recomendación IA" en filas con alerta; gestiona apertura del modal.

## Capabilities

### New Capabilities
- `alerts-frontend`: Panel de alertas de stock y flujo de recomendación IA en la vista de Productos.

### Modified Capabilities
- `product-crud-frontend`: Se agrega el panel de alertas y el botón de IA a la página Products existente.

## Impact

- **Frontend**: 3 archivos nuevos, 1 modificado (`Products.tsx`).
- **API**: consume `POST /ai/recommendation` (ya implementado en C-09).
- **Sin cambios en backend ni esquema de BD.**
- **Dependencias npm**: ninguna nueva; usa Axios y React Query ya instalados.
