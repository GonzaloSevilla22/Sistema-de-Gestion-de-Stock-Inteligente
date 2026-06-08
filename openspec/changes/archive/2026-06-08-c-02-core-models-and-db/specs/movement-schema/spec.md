## ADDED Requirements

### Requirement: MovementCreate schema
The system SHALL define a Pydantic v2 `MovementCreate` schema with: `product_id` (int, required), `type` (MovementType enum, required — `"ENTRADA"` or `"SALIDA"`), `quantity` (int, required, > 0), `observation` (str | None, default None). The `date` field is NOT included — it is assigned server-side (RN-MV-06).

#### Scenario: Valid movement creation payload
- **WHEN** `MovementCreate(product_id=1, type="ENTRADA", quantity=10)` is instantiated
- **THEN** no validation error is raised and `observation` defaults to `None`

#### Scenario: Zero quantity rejected
- **WHEN** `MovementCreate(product_id=1, type="SALIDA", quantity=0)` is instantiated
- **THEN** a Pydantic `ValidationError` is raised (RN-MV-02)

#### Scenario: Negative quantity rejected
- **WHEN** `MovementCreate(product_id=1, type="ENTRADA", quantity=-5)` is instantiated
- **THEN** a Pydantic `ValidationError` is raised (RN-MV-02)

#### Scenario: Invalid type rejected
- **WHEN** `MovementCreate(product_id=1, type="OTRO", quantity=5)` is instantiated
- **THEN** a Pydantic `ValidationError` is raised (RN-MV-01)

### Requirement: MovementResponse schema
The system SHALL define a Pydantic v2 `MovementResponse` schema with: `id` (int), `product_id` (int), `type` (str), `quantity` (int), `date` (datetime), `observation` (str | None). The schema SHALL use `model_config = ConfigDict(from_attributes=True)` for ORM compatibility.

#### Scenario: Movement response constructed from ORM instance
- **WHEN** a `MovementResponse` is constructed from a `StockMovement` ORM instance
- **THEN** all fields are populated including `id`, `date`, and `product_id`
