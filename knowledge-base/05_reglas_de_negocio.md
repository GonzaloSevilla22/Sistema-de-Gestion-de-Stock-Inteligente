# Reglas de Negocio

Cada regla tiene un código único `RN-{DOMINIO}-{NN}` para trazabilidad con historias de usuario y tests.

---

## Dominio: Productos (RN-PR)

- **RN-PR-01**: Un producto debe tener `name` y `price` para poder ser creado. `description`, `category` son opcionales.
- **RN-PR-02**: `price` debe ser mayor o igual a cero. No se permiten precios negativos.
- **RN-PR-03**: `stock` y `minimum_stock` deben ser enteros no negativos (>= 0).
- **RN-PR-04**: No pueden existir dos productos con el mismo `name` (constraint de unicidad a nivel service, no solo DB).
- **RN-PR-05**: Al eliminar un producto, todos sus movimientos de stock se eliminan en cascada.

---

## Dominio: Stock y Alertas (RN-ST)

- **RN-ST-01**: Un producto se considera en **stock bajo** cuando `stock_actual > 0` y `stock_actual <= minimum_stock`.
- **RN-ST-02**: Un producto se considera **agotado** cuando `stock_actual == 0`.
- **RN-ST-03**: Un producto en estado **normal** tiene `stock_actual > minimum_stock`.
- **RN-ST-04**: El estado de alerta se calcula dinámicamente en el backend; no se persiste como campo en la BD.
- **RN-ST-05**: El dashboard debe exponer el conteo de productos en cada estado (normal, bajo, agotado) calculado en tiempo real.

---

## Dominio: Movimientos (RN-MV)

- **RN-MV-01**: Solo existen dos tipos de movimiento: `ENTRADA` y `SALIDA`. Cualquier otro valor es rechazado con error 422.
- **RN-MV-02**: La `quantity` de un movimiento debe ser un entero estrictamente positivo (> 0).
- **RN-MV-03**: Al registrar un movimiento de tipo `ENTRADA`, el `stock` del producto se incrementa en `quantity`.
- **RN-MV-04**: Al registrar un movimiento de tipo `SALIDA`, el `stock` del producto se decrementa en `quantity`. — **Requiere validación previa**.
- **RN-MV-05**: No se puede registrar una `SALIDA` si `stock_actual < quantity`. El service debe retornar error 400 con mensaje descriptivo.
- **RN-MV-06**: La fecha del movimiento se asigna automáticamente en el servidor al momento del registro (no enviada por el cliente).

---

## Dominio: Dashboard (RN-DH)

- **RN-DH-01**: El endpoint `GET /dashboard` debe retornar al menos: `total_products`, `low_stock_count`, `out_of_stock_count`.
- **RN-DH-02**: Los conteos se calculan en la capa de servicio (no en la capa de routes).
- **RN-DH-03**: El dashboard se calcula sobre el estado actual del stock en tiempo real; no hay caché ni precálculo.

---

## Dominio: IA (RN-AI)

- **RN-AI-01**: El endpoint `POST /ai/recommendation` recibe `{ "producto": str, "stock_actual": int, "stock_minimo": int }`.
- **RN-AI-02**: La recomendación se genera llamando a un LLM externo (Claude o Gemini). La respuesta es texto libre en lenguaje natural.
- **RN-AI-03**: Si la API de IA no está disponible o retorna error, el endpoint debe retornar un mensaje de fallback predefinido (no 500).
- **RN-AI-04**: La API Key del LLM se gestiona exclusivamente como variable de entorno; nunca se hardcodea en el código.
- **RN-AI-05**: El endpoint no persiste las recomendaciones en la base de datos (stateless por diseño v1.0).

---

## Dominio: Excepciones globales

- **RN-GL-01**: Toda respuesta de error debe incluir un campo `detail` con mensaje descriptivo en español.
- **RN-GL-02**: Los errores de validación de Pydantic (422 Unprocessable Entity) se retornan automáticamente por FastAPI — no se interceptan.
- **RN-GL-03**: Los IDs de recursos no encontrados deben retornar 404 con `detail: "Producto no encontrado"` o similar.
