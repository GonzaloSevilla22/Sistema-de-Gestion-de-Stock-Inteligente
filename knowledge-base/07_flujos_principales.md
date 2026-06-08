# Flujos Principales

---

## Flujo 1: Registrar movimiento de salida

**Disparador**: el gestor hace clic en "Registrar salida" para un producto  
**Actor**: Gestor de stock  

**Pasos**:
1. Usuario abre el formulario de nuevo movimiento y selecciona tipo `SALIDA`
2. Frontend envía `POST /movements { product_id, type: "SALIDA", quantity, observation }`
3. `movement_routes.py` recibe la request y llama a `movement_service.create_movement()`
4. `movement_service` llama a `product_repository.get_by_id(product_id)` para obtener el producto
5. `movement_service` verifica que `product.stock >= quantity` (RN-MV-05)
   - Si NO: lanza `HTTPException(400, "Stock insuficiente")`
   - Si SÍ: continúa
6. `movement_service` llama a `product_repository.update_stock(product_id, new_stock)` donde `new_stock = stock - quantity`
7. `movement_service` llama a `movement_repository.create(movement_data)` para persistir el registro
8. Route retorna `201 Created` con el movimiento creado
9. Frontend actualiza la tabla de movimientos y el stock del producto via React Query `invalidateQueries`

**Diagrama de secuencia**:
```
Frontend → POST /movements → movement_routes
                                    ↓
                            movement_service
                              ↓          ↓
                    product_repo     movement_repo
                    get_by_id()      create()
                    update_stock()
                              ↑          ↑
                            PostgreSQL / SQLite
```

**Casos de error**:
- `product_id` no existe → 404 "Producto no encontrado"
- `quantity <= 0` → 422 (Pydantic validation)
- `stock < quantity` → 400 "Stock insuficiente para registrar la salida"
- DB unreachable → 500 (no manejado explícitamente en v1.0)

---

## Flujo 2: Obtener recomendación IA

**Disparador**: el administrador hace clic en "Recomendación IA" en un producto con stock bajo  
**Actor**: Administrador + Sistema de IA  

**Pasos**:
1. Frontend envía `POST /ai/recommendation { "producto": str, "stock_actual": int, "stock_minimo": int }`
2. `ai_routes.py` recibe la request y llama a `ai_service.get_recommendation()`
3. `ai_service` construye el prompt para el LLM:
   ```
   "El producto '{producto}' tiene stock actual de {stock_actual} unidades
    y el stock mínimo requerido es {stock_minimo} unidades.
    ¿Qué recomendás hacer?"
   ```
4. `ai_service` llama a la API del LLM (Claude o Gemini) con el prompt
   - Si OK: extrae el texto de la respuesta
   - Si error: retorna mensaje de fallback definido en `ai_service`
5. Route retorna `200 OK` con `{ "recommendation": "texto de respuesta..." }`
6. Frontend muestra el texto en un modal

**Casos de error**:
- API Key inválida o ausente → fallback message (RN-AI-03)
- Timeout de la API de IA → fallback message
- `stock_actual` o `stock_minimo` negativos → 422 (Pydantic validation)

---

## Flujo 3: Crear producto

**Disparador**: el administrador completa el formulario de nuevo producto  
**Actor**: Administrador  

**Pasos**:
1. Frontend envía `POST /products { name, description, price, stock, minimum_stock, category }`
2. `product_routes.py` recibe y delega a `product_service.create_product()`
3. `product_service` valida que no exista un producto con el mismo `name` (RN-PR-04)
   - Si existe: lanza `HTTPException(409, "Ya existe un producto con ese nombre")`
4. `product_service` llama a `product_repository.create(product_data)`
5. Route retorna `201 Created` con el producto creado (incluyendo `id` y `created_at` asignados)
6. Frontend invalida la query de productos → la tabla se refresca

**Casos de error**:
- `name` o `price` ausentes → 422 (Pydantic validation)
- `price < 0` → 422
- Nombre duplicado → 409 "Ya existe un producto con ese nombre"

---

## Flujo 4: Ver dashboard (carga inicial)

**Disparador**: el usuario navega a `/` (página principal)  
**Actor**: Cualquier usuario  

**Pasos**:
1. Frontend monta el componente `Dashboard.tsx` y dispara React Query `useQuery(['dashboard'])`
2. Axios hace `GET /dashboard`
3. `dashboard_routes.py` llama a `dashboard_service.get_kpis()`
4. `dashboard_service` llama a `product_repository.count_all()`, `count_low_stock()`, `count_out_of_stock()`
5. Retorna `{ "total_products": N, "low_stock_count": N, "out_of_stock_count": N }`
6. Frontend renderiza las 3 `KPICards` con los valores

**Casos de error**:
- BD no disponible → 500 (el frontend muestra un estado de error genérico)
