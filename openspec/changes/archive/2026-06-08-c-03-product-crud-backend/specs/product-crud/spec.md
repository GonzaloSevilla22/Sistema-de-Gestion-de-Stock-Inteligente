## ADDED Requirements

### Requirement: Listar todos los productos
El sistema SHALL exponer `GET /products` que retorna la lista completa de productos con su estado de alerta calculado dinámicamente.

#### Scenario: Listado exitoso con productos
- **WHEN** se hace `GET /products` y existen productos en la BD
- **THEN** el sistema retorna `200 OK` con un array de objetos `ProductResponse` incluyendo el campo `alert_status` calculado

#### Scenario: Listado con BD vacía
- **WHEN** se hace `GET /products` y no hay productos
- **THEN** el sistema retorna `200 OK` con un array vacío `[]`

---

### Requirement: Obtener producto por ID
El sistema SHALL exponer `GET /products/{id}` que retorna un único producto o 404 si no existe.

#### Scenario: Producto encontrado
- **WHEN** se hace `GET /products/{id}` con un `id` existente
- **THEN** el sistema retorna `200 OK` con el objeto `ProductResponse` correspondiente

#### Scenario: Producto no encontrado
- **WHEN** se hace `GET /products/{id}` con un `id` que no existe
- **THEN** el sistema retorna `404 Not Found` con `{ "detail": "Producto no encontrado" }` (RN-GL-03)

---

### Requirement: Crear producto
El sistema SHALL exponer `POST /products` que crea un producto válido o rechaza datos inválidos.

#### Scenario: Creación exitosa
- **WHEN** se hace `POST /products` con `name`, `price >= 0`, `stock >= 0`, `minimum_stock >= 0` válidos
- **THEN** el sistema retorna `201 Created` con el producto creado incluyendo `id` y `created_at` asignados por el servidor

#### Scenario: Nombre duplicado
- **WHEN** se hace `POST /products` con un `name` que ya existe en la BD
- **THEN** el sistema retorna `409 Conflict` con `{ "detail": "Ya existe un producto con ese nombre" }` (RN-PR-04)

#### Scenario: Precio negativo
- **WHEN** se hace `POST /products` con `price < 0`
- **THEN** el sistema retorna `422 Unprocessable Entity` (RN-PR-02)

#### Scenario: Stock negativo
- **WHEN** se hace `POST /products` con `stock < 0` o `minimum_stock < 0`
- **THEN** el sistema retorna `422 Unprocessable Entity` (RN-PR-03)

#### Scenario: Campos requeridos ausentes
- **WHEN** se hace `POST /products` sin `name` o sin `price`
- **THEN** el sistema retorna `422 Unprocessable Entity` (RN-PR-01)

---

### Requirement: Actualizar producto
El sistema SHALL exponer `PUT /products/{id}` que actualiza los atributos de un producto existente.

#### Scenario: Actualización exitosa
- **WHEN** se hace `PUT /products/{id}` con datos válidos y el producto existe
- **THEN** el sistema retorna `200 OK` con el producto actualizado

#### Scenario: Producto no encontrado en update
- **WHEN** se hace `PUT /products/{id}` con un `id` que no existe
- **THEN** el sistema retorna `404 Not Found` con mensaje descriptivo

#### Scenario: Nombre duplicado en update
- **WHEN** se hace `PUT /products/{id}` con un `name` que ya usa otro producto distinto
- **THEN** el sistema retorna `409 Conflict` con `{ "detail": "Ya existe un producto con ese nombre" }` (RN-PR-04)

---

### Requirement: Eliminar producto
El sistema SHALL exponer `DELETE /products/{id}` que elimina un producto y sus movimientos en cascada.

#### Scenario: Eliminación exitosa
- **WHEN** se hace `DELETE /products/{id}` con un `id` existente
- **THEN** el sistema retorna `204 No Content` y el producto ya no existe en la BD; sus movimientos también son eliminados (RN-PR-05)

#### Scenario: Producto no encontrado en delete
- **WHEN** se hace `DELETE /products/{id}` con un `id` que no existe
- **THEN** el sistema retorna `404 Not Found`

---

### Requirement: Cálculo dinámico de estado de alerta
El service SHALL calcular `alert_status` dinámicamente antes de retornar cualquier producto, sin persistirlo en la BD (RN-ST-04).

#### Scenario: Estado normal
- **WHEN** `stock > minimum_stock`
- **THEN** `alert_status` es `"normal"` (RN-ST-03)

#### Scenario: Stock bajo
- **WHEN** `stock > 0` y `stock <= minimum_stock`
- **THEN** `alert_status` es `"low"` (RN-ST-01)

#### Scenario: Agotado
- **WHEN** `stock == 0`
- **THEN** `alert_status` es `"out_of_stock"` (RN-ST-02)

---

### Requirement: Métodos de conteo para dashboard
El repositorio SHALL exponer `count_all()`, `count_low_stock()` y `count_out_of_stock()` para que el dashboard service (C-05) pueda obtener KPIs sin duplicar lógica de conteo.

#### Scenario: Conteo con productos en distintos estados
- **WHEN** existen productos con estados normal, low y out_of_stock
- **THEN** `count_all()` retorna el total, `count_low_stock()` retorna los que tienen `0 < stock <= minimum_stock`, `count_out_of_stock()` retorna los que tienen `stock == 0`

#### Scenario: Conteo con BD vacía
- **WHEN** no hay productos en la BD
- **THEN** los tres métodos de conteo retornan `0`
