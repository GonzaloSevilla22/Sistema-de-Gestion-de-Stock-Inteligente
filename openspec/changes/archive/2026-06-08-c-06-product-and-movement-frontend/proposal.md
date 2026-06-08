## Why

El backend de productos y movimientos está completamente implementado (C-01 a C-05 pasando 49 tests) pero el frontend solo tiene páginas stub vacías. Los usuarios no tienen ninguna interfaz funcional para gestionar el inventario ni registrar movimientos de stock.

## What Changes

- Nuevos tipos TypeScript: `Product`, `StockMovement`, `MovementCreate`, `DashboardKPIs` en `frontend/src/types/index.ts`
- Nueva capa de servicios Axios: `productApi.ts`, `movementApi.ts` con todas las llamadas al backend
- Nuevos hooks React Query: `useProducts`, `useProduct`, `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct` en `useProducts.ts`
- Nueva página `Products.tsx`: tabla completa con chips de estado (normal/bajo/agotado), búsqueda por nombre, botones editar/eliminar, diálogo de confirmación para delete, botón "Nuevo producto"
- Nuevo componente `ProductTable.tsx`: tabla reutilizable con TailwindCSS
- Nuevo componente `ProductForm.tsx`: formulario create/edit con validación client-side y errores de API inline
- Nueva página `StockMovements.tsx`: tabla de movimientos ordenada por fecha descendente, colores ENTRADA (verde) / SALIDA (rojo), botón "Registrar movimiento"
- Nuevo componente `MovementForm.tsx`: formulario con selector de producto, tipo ENTRADA/SALIDA, cantidad, observación; manejo de error 400 (stock insuficiente)
- Navbar en `App.tsx` con links a `/`, `/products`, `/movements`
- React Query `invalidateQueries` tras mutaciones para refrescar listas

## Capabilities

### New Capabilities
- `product-crud-frontend`: Gestión completa de productos desde el browser — listar con estado visual, crear, editar y eliminar via API REST
- `stock-movement-frontend`: Registro y visualización de movimientos de stock (ENTRADA/SALIDA) con validación de stock insuficiente en el cliente

### Modified Capabilities
- `frontend-foundation`: Se extiende App.tsx con navbar de navegación (cambio de requisito de estructura visual)

## Impact

- **Frontend**: `frontend/src/types/`, `frontend/src/services/`, `frontend/src/hooks/`, `frontend/src/components/`, `frontend/src/pages/`
- **Backend**: Sin cambios — se consume la API ya existente en `/products`, `/movements`
- **Dependencias nuevas**: ninguna (React Query v5, Axios, React Router v6 ya instalados)
- **API base URL**: configurada en `vite.config.ts` como proxy a `http://localhost:8000`
