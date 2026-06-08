## ADDED Requirements

### Requirement: Movement list displays all stock movements
The system SHALL render a table at `/movements` showing all movements fetched from `GET /movements`, ordered by date descending, with columns: producto, tipo, cantidad, fecha, observación.

#### Scenario: Table renders movements on load
- **WHEN** the user navigates to `/movements`
- **THEN** the table fetches `GET /movements` and displays each movement as a row, most recent first

#### Scenario: ENTRADA rows are highlighted green
- **WHEN** a movement has `type === "ENTRADA"`
- **THEN** the tipo column shows a green badge labeled "ENTRADA"

#### Scenario: SALIDA rows are highlighted red
- **WHEN** a movement has `type === "SALIDA"`
- **THEN** the tipo column shows a red badge labeled "SALIDA"

---

### Requirement: Movement can be registered via form
The system SHALL provide a "Registrar movimiento" button that opens a form. On submit, `POST /movements` is called, and both movements and products lists are refreshed (stock changes).

#### Scenario: Form opens on button click
- **WHEN** the user clicks "Registrar movimiento"
- **THEN** a form is displayed with fields: producto (selector requerido), tipo ENTRADA/SALIDA (selector requerido), cantidad (requerido, entero > 0), observación (opcional)

#### Scenario: Valid movement saves and refreshes
- **WHEN** the user fills required fields and submits
- **THEN** `POST /movements` is called, the form closes, and both `['movements']` and `['products']` query keys are invalidated

#### Scenario: Insufficient stock shows error inline
- **WHEN** the API returns HTTP 400 (stock insuficiente)
- **THEN** the form stays open and displays the error message from the API response without crashing

#### Scenario: Missing required fields shows validation error
- **WHEN** the user submits without producto, tipo, or cantidad
- **THEN** a validation error is shown inline without calling the API

#### Scenario: Non-positive quantity shows validation error
- **WHEN** the user enters cantidad <= 0
- **THEN** a validation error is shown inline: "La cantidad debe ser mayor a cero"
