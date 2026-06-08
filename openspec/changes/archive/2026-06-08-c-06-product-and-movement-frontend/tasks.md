## 1. Infraestructura base

- [x] 1.1 Configurar proxy en `vite.config.ts`: `/api` → `http://localhost:8000` (rewrite quita el prefijo `/api`)
- [x] 1.2 Crear `frontend/src/services/api.ts`: instancia Axios con `baseURL: import.meta.env.VITE_API_URL ?? '/api'`
- [x] 1.3 Crear `frontend/src/types/index.ts`: interfaces `Product`, `StockMovement`, `MovementCreate`, `DashboardKPIs`
- [x] 1.4 Agregar `QueryClientProvider` en `frontend/src/main.tsx` wrapeando `<App />`

## 2. Servicios y hooks de productos

- [x] 2.1 Crear `frontend/src/services/productApi.ts`: funciones `getProducts()`, `getProduct(id)`, `createProduct()`, `updateProduct()`, `deleteProduct()`
- [x] 2.2 Crear `frontend/src/hooks/useProducts.ts`: hooks `useProducts()`, `useProduct(id)`, `useCreateProduct()`, `useUpdateProduct()`, `useDeleteProduct()` con React Query v5; las mutaciones invalidan `['products']`

## 3. Componentes de productos

- [x] 3.1 Crear `frontend/src/components/ProductForm.tsx`: formulario create/edit — campos nombre (req), descripción, categoría, precio (req), stock inicial (req), stock mínimo (req); validación client-side; muestra errores de API inline (409 conflict)
- [x] 3.2 Crear `frontend/src/components/ProductTable.tsx`: tabla TailwindCSS con columnas nombre/categoría/precio/stock/stockMin/estado + botones Editar y Eliminar por fila; chip de estado (verde/amarillo/rojo) calculado del client-side con RN-ST-01/02/03
- [x] 3.3 Implementar `frontend/src/pages/Products.tsx`: monta `ProductTable`, input de búsqueda filtrado en cliente, botón "Nuevo producto", diálogo de confirmación para delete, estado de modal para create/edit

## 4. Servicios y hooks de movimientos

- [x] 4.1 Crear `frontend/src/services/movementApi.ts`: funciones `getMovements()`, `createMovement()`
- [x] 4.2 Crear `frontend/src/hooks/useMovements.ts`: hooks `useMovements()`, `useCreateMovement()` con React Query v5; la mutación crea invalida `['movements']` y `['products']`

## 5. Componentes de movimientos

- [x] 5.1 Crear `frontend/src/components/MovementForm.tsx`: formulario — selector de producto (carga lista con `useProducts()`), selector ENTRADA/SALIDA, campo cantidad (int > 0), observación; maneja error 400 mostrando mensaje inline sin cerrar el formulario
- [x] 5.2 Implementar `frontend/src/pages/StockMovements.tsx`: tabla TailwindCSS con columnas producto/tipo/cantidad/fecha/observación; badge verde para ENTRADA, rojo para SALIDA; botón "Registrar movimiento" que abre `MovementForm`

## 6. Navegación

- [x] 6.1 Actualizar `frontend/src/App.tsx`: agregar navbar con `NavLink` de React Router a `/` (Dashboard), `/products` (Productos), `/movements` (Movimientos); estilo activo con TailwindCSS; `<Outlet>` o layout que envuelva las rutas
