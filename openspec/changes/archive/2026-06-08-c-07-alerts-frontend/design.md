## Context

C-06 implementó la tabla de productos con chips de estado (`alert_status`). C-09 implementó el endpoint `POST /ai/recommendation` en el backend. C-07 conecta ambos: agrega al frontend el panel de alertas y el flujo completo de recomendación IA.

El frontend usa React 18 + TypeScript + TailwindCSS + React Query v5 + Axios. El backend ya expone `/ai/recommendation` sin autenticación.

## Goals / Non-Goals

**Goals:**
- Mostrar un panel `AlertList` en la página de Productos con los productos en estado `low` u `out_of_stock`.
- Proveer un botón "Obtener recomendación IA" en cada fila/card de alerta.
- Implementar el modal de recomendación con estados loading / success / error.
- Crear `aiApi.ts` y el hook `useAIRecommendation` con `useMutation`.

**Non-Goals:**
- Historial de recomendaciones (no hay persistencia en el backend).
- Cambios en el backend o en la BD.
- Autenticación o rate-limiting en el frontend.

## Decisions

### D-01: AlertList como componente separado en Products.tsx (no página nueva)
Colocar `AlertList` como sección superior dentro de la página `/products` existente, visible sólo cuando existen productos con alerta. Alternativa descartada: ruta propia `/alerts` — añade complejidad de navegación sin ganancia para el TP.

### D-02: Modal de IA gestionado en Products.tsx con estado local
El estado `selectedProduct` (para el modal) vive en `Products.tsx` con `useState`. No se usa un store global. Alternativa descartada: contexto React — innecesario para un modal puntual.

### D-03: useMutation para la llamada IA (no useQuery)
La recomendación es una operación disparada por el usuario, no un fetch automático. `useMutation` de React Query es semánticamente correcto y provee `isPending`, `data`, `error` sin polling. `useQuery` con `enabled: false` también funciona pero es menos idiomático.

### D-04: Errores de la API IA no bloquean la UI
Si `POST /ai/recommendation` falla (timeout, clave inválida), el modal muestra el mensaje de fallback del backend o un texto genérico. No se propaga un error de pantalla completa.

## Risks / Trade-offs

- **[Riesgo] Backend IA lento (LLM latency)** → Mostrar spinner con texto "Consultando al asistente…" mientras `isPending`. El usuario percibe actividad y no cierra el modal por error.
- **[Riesgo] API Key no configurada en desarrollo** → El backend retorna fallback; el frontend lo muestra sin crash. No requiere manejo extra.
- **[Trade-off] AlertList duplica el fetch de productos** → Se evita pasando la lista ya cargada por prop desde `Products.tsx` en lugar de hacer un segundo `useProducts()`.
