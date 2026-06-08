## 1. Servicio y Hook de IA

- [x] 1.1 Crear `frontend/src/services/aiApi.ts` con la función `getRecommendation({ producto, stock_actual, stock_minimo })` que hace POST a `/ai/recommendation` via Axios y retorna `{ recommendation: string }`
- [x] 1.2 Crear `frontend/src/hooks/useAI.ts` con el hook `useAIRecommendation()` usando `useMutation` de React Query; exportar `{ mutate, isPending, data, error, reset }`

## 2. Componente AlertList

- [x] 2.1 Crear `frontend/src/components/AlertList.tsx`: acepta props `products: Product[]` y `onRequestAI: (product: Product) => void`
- [x] 2.2 Filtrar internamente los productos con `alert_status === 'low'` o `alert_status === 'out_of_stock'`; si la lista filtrada está vacía, retornar `null`
- [x] 2.3 Renderizar el panel con título "Productos en alerta (N)" y un badge por producto: rojo "Agotado" para `out_of_stock`, amarillo "Stock bajo" para `low`
- [x] 2.4 Agregar el botón "Obtener recomendación IA" por cada producto del panel que llama `onRequestAI(product)`

## 3. Modal de Recomendación IA

- [x] 3.1 Crear `frontend/src/components/AIRecommendationModal.tsx`: acepta props `product: Product`, `onClose: () => void`
- [x] 3.2 Al montar, disparar `mutate({ producto: product.name, stock_actual: product.stock, stock_minimo: product.minimum_stock })`
- [x] 3.3 Renderizar estado loading: spinner + texto "Consultando al asistente…" mientras `isPending`
- [x] 3.4 Renderizar estado success: mostrar `data.recommendation` en un bloque de texto
- [x] 3.5 Renderizar estado error: mostrar mensaje genérico "No se pudo obtener la recomendación. Intentá de nuevo."
- [x] 3.6 Botón de cierre que llama `onClose()` y `reset()` del mutation

## 4. Integración en Products.tsx

- [x] 4.1 Agregar `useState<Product | null>(null)` como `selectedProduct` en `Products.tsx`
- [x] 4.2 Importar y renderizar `<AlertList products={products} onRequestAI={setSelectedProduct} />` antes del buscador
- [x] 4.3 Importar y renderizar `{selectedProduct && <AIRecommendationModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}` al final del JSX

## 5. Verificación

- [x] 5.1 Correr `cd frontend && npm run build` sin errores de TypeScript
- [x] 5.2 Verificar en el navegador: con productos en alerta, el panel aparece y el botón IA abre el modal
- [x] 5.3 Verificar: con todos los productos en estado normal, el panel de alertas no aparece
