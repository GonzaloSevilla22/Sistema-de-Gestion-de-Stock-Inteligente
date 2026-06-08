## Context

C-03 establece el repositorio y servicio de productos con operaciones CRUD completas. El modelo `StockMovement` ya existe (definido en C-02) pero no hay capa de acceso ni endpoints. Este change añade las capas repository → service → routes para movimientos, reutilizando los patrones ya establecidos en C-03.

**Restricciones clave**:
- Reglas de negocio RN-MV-01 a RN-MV-06 son no negociables
- El stock del producto debe actualizarse en la misma transacción que se crea el movimiento (atomicidad)
- No hay autenticación en v1.0 (DD confirmado en KB)

## Goals / Non-Goals

**Goals:**
- Implementar `GET /movements` y `POST /movements` con toda la lógica de negocio
- Garantizar la actualización atómica de `product.stock` al registrar un movimiento
- Cubrir todos los casos de error con los códigos HTTP correctos (400, 404, 422)
- Suite de tests con SQLite in-memory que cubra todos los escenarios RN-MV

**Non-Goals:**
- Filtrado o paginación de movimientos (fuera de scope v1.0)
- `GET /movements/{id}` — no requerido por la spec
- `DELETE` o `PATCH` de movimientos — los movimientos son inmutables
- Historial por producto vía query param (alcance del frontend en C-06)

## Decisions

### D-01: Atomicidad de stock update via una sola sesión SQLAlchemy

El `movement_service` recibe la sesión de BD como dependencia FastAPI y ejecuta dentro de ella tanto `product_repository.update_stock()` como `movement_repository.create()`. Si cualquiera falla, el `rollback` automático de SQLAlchemy revierte ambas operaciones.

**Alternativa rechazada**: dos operaciones separadas con commit individual — riesgo de inconsistencia si la segunda falla.

### D-02: `update_stock()` vive en `ProductRepository`, no en `MovementRepository`

El stock es propiedad del producto. El repositorio de movimientos no debe conocer ni modificar entidades de otro dominio. El servicio de movimientos orquesta la secuencia: get_product → validate → update_stock → create_movement.

**Alternativa rechazada**: `MovementRepository` con JOIN update — viola la separación de repositorios.

### D-03: La fecha se asigna en el modelo, no en el servicio

`StockMovement.date` usa `default=datetime.utcnow` en SQLAlchemy (ya definido en C-02). El schema `MovementCreate` no incluye el campo `date` para que nunca pueda ser enviado por el cliente (RN-MV-06).

### D-04: Error 400 como `HTTPException`, no como excepción de dominio custom

Dado que v1.0 no tiene una capa de excepciones custom, el service lanza `HTTPException(status_code=400, detail="Stock insuficiente para registrar la salida")` directamente. Consistente con el patrón ya usado en C-03 para el 409 de nombre duplicado.

**Alternativa rechazada**: excepciones de dominio custom + handler — overhead innecesario para el scope actual.

## Risks / Trade-offs

- **[Riesgo] Race condition en validación de stock**: Si dos requests simultáneas verifican stock antes de que alguna lo decremente, ambas podrían pasar la validación. → Mitigación: aceptado para v1.0 (operación single-user según supuesto SU-01 de la KB). Para producción multi-usuario se requeriría `SELECT FOR UPDATE`.
- **[Trade-off] Sin paginación en `GET /movements`**: Para datasets grandes, retornar todos los movimientos puede ser lento. → Aceptado para v1.0; la KB no especifica paginación y el alcance es una demo académica.
- **[Riesgo] `update_stock()` no verifica stock mínimo**: El repositorio solo actualiza el valor; la validación de stock suficiente la hace el servicio. Si alguien llama al repositorio directamente, puede dejar stock negativo. → Mitigación: regla dura de arquitectura (no queries fuera del repository, no llamadas directas al repo desde fuera del service).
