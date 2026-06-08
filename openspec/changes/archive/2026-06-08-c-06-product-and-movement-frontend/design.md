## Context

El backend (C-01 a C-05) expone endpoints REST en `/products`, `/movements` y `/dashboard`. El frontend tiene scaffolding (App.tsx con rutas, 3 páginas stub) pero cero UI funcional. El stack ya instalado incluye React Query v5, Axios, React Router v6 y TailwindCSS v3. No se agregan dependencias nuevas.

La API del backend corre en `http://localhost:8000` en desarrollo. El proxy de Vite (`vite.config.ts`) debe redirigir `/api/*` al backend para evitar CORS en dev.

## Goals / Non-Goals

**Goals:**
- UI funcional para listar, crear, editar y eliminar productos con validaciones y feedback visual
- UI para registrar movimientos ENTRADA/SALIDA con manejo de error 400 (stock insuficiente)
- Indicadores visuales de estado de stock (normal/bajo/agotado) en la tabla de productos
- Refetch automático con React Query `invalidateQueries` tras mutaciones
- Navbar de navegación entre `/`, `/products`, `/movements`

**Non-Goals:**
- No incluye la página de Dashboard (C-08) ni las KPI cards
- No incluye el panel de alertas IA (C-07)
- No incluye autenticación ni autorización (v1.0 sin auth)
- No incluye paginación del lado del servidor (la v1 lista todos los productos)

## Decisions

### D-01: Estructura de directorios: `types/`, `services/`, `hooks/`, `components/`, `pages/`

Se adopta la estructura propuesta en `knowledge-base/08_arquitectura_propuesta.md`. Separar tipos, servicios Axios, hooks React Query y componentes UI permite testar cada capa independientemente y reutilizar hooks entre páginas.

Alternativa descartada: colocation (hooks y tipos dentro de cada page file) — complica la reutilización cuando C-07 y C-08 necesiten los mismos hooks.

### D-02: Axios instance única con baseURL desde env

Se crea `frontend/src/services/api.ts` con una instancia Axios configurada con `baseURL: import.meta.env.VITE_API_URL ?? '/api'`. El proxy Vite redirige `/api` → `http://localhost:8000` en dev; en producción se configura `VITE_API_URL` apuntando al backend en Render.

Alternativa descartada: hardcodear `http://localhost:8000` — roto en producción.

### D-03: React Query v5 con `queryKey` arrays estables

Claves: `['products']`, `['products', id]`, `['movements']`. Las mutaciones llaman `queryClient.invalidateQueries({ queryKey: ['products'] })` para refetch inmediato. Esto sigue el patrón ya establecido por React Query v5 (objeto de opciones, no string overloads).

### D-04: Estado de stock calculado en el cliente a partir de los datos del backend

El backend retorna `stock` y `minimum_stock` en cada producto pero NO retorna un campo `status`. El cliente calcula el estado: `stock === 0 → 'agotado'`, `stock <= minimum_stock → 'bajo'`, `else → 'normal'`. Esto es consistente con RN-ST-01/02/03/04 (el estado no se persiste).

### D-05: Modal/Dialog para formularios Create/Edit usando estado local

Se usa estado `useState` + condicional para mostrar/ocultar `ProductForm` y `MovementForm` en lugar de una librería de modales externa. Mantiene el conteo de dependencias bajo. Si la complejidad crece en C-07/C-08 se puede migrar a una librería.

### D-06: Proxy Vite como puente API en desarrollo

Se agrega `server.proxy` en `vite.config.ts`: `'/api': { target: 'http://localhost:8000', rewrite: path => path.replace(/^\/api/, '') }`. Evita tener CORS habilitado para `localhost:5173` en el backend.

## Risks / Trade-offs

- **Sin tests de frontend (por diseño)**: React Testing Library no está en el stack. Los componentes se verifican manualmente. → Aceptado para v1.0; C-10 podría agregar Playwright E2E.
- **Lista completa sin paginación**: Si hay muchos productos, la tabla puede crecer sin control. → Mitigación: la búsqueda por nombre filtra en el cliente; paginación real es post-v1.0.
- **Proxy Vite solo en dev**: En producción, `VITE_API_URL` debe configurarse correctamente o las llamadas API fallan silenciosamente. → Mitigación: variable documentada en `.env.example`.
