## ADDED Requirements

### Requirement: Registrar movimiento de stock
El sistema SHALL permitir registrar movimientos de entrada o salida de stock para un producto existente. Al registrar el movimiento, el stock del producto SHALL actualizarse automáticamente en la misma transacción.

#### Scenario: Entrada válida incrementa stock
- **WHEN** se envía `POST /movements` con `{ "product_id": <id>, "type": "ENTRADA", "quantity": 10, "observation": "Reposición" }` y el producto existe
- **THEN** el sistema crea el movimiento, incrementa `product.stock` en 10 y retorna 201 con el movimiento creado

#### Scenario: Salida válida decrementa stock
- **WHEN** se envía `POST /movements` con `{ "product_id": <id>, "type": "SALIDA", "quantity": 5 }` y `product.stock >= 5`
- **THEN** el sistema crea el movimiento, decrementa `product.stock` en 5 y retorna 201 con el movimiento creado

#### Scenario: Salida con stock insuficiente es rechazada
- **WHEN** se envía `POST /movements` con `type: "SALIDA"` y `quantity > product.stock`
- **THEN** el sistema retorna 400 con `detail` descriptivo en español y NO modifica el stock ni crea el movimiento

#### Scenario: Producto inexistente retorna 404
- **WHEN** se envía `POST /movements` con un `product_id` que no existe en la base de datos
- **THEN** el sistema retorna 404 con `detail: "Producto no encontrado"`

#### Scenario: Tipo de movimiento inválido es rechazado
- **WHEN** se envía `POST /movements` con `type` distinto de "ENTRADA" o "SALIDA"
- **THEN** el sistema retorna 422 (validación Pydantic)

#### Scenario: Quantity cero o negativa es rechazada
- **WHEN** se envía `POST /movements` con `quantity <= 0`
- **THEN** el sistema retorna 422 (validación Pydantic)

#### Scenario: Fecha asignada en servidor
- **WHEN** se registra cualquier movimiento exitoso
- **THEN** el campo `date` del movimiento creado refleja la hora UTC del servidor; el cliente no puede enviarlo

### Requirement: Consultar historial de movimientos
El sistema SHALL exponer el historial completo de movimientos de stock a través de `GET /movements`.

#### Scenario: Lista todos los movimientos
- **WHEN** se hace `GET /movements` con movimientos registrados en la BD
- **THEN** el sistema retorna 200 con la lista completa de movimientos (sin paginación)

#### Scenario: Lista vacía cuando no hay movimientos
- **WHEN** se hace `GET /movements` con la BD sin movimientos
- **THEN** el sistema retorna 200 con lista vacía `[]`
