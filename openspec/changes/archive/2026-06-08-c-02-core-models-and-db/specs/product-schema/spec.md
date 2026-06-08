## ADDED Requirements

### Requirement: ProductCreate schema
The system SHALL define a Pydantic v2 `ProductCreate` schema with: `name` (str, required), `description` (str | None, default None), `price` (Decimal or float, required, >= 0), `stock` (int, required, >= 0), `minimum_stock` (int, required, >= 0), `category` (str | None, default None). Field names MUST use English (`stock`, `minimum_stock`).

#### Scenario: Valid product creation payload
- **WHEN** `ProductCreate(name="Teclado", price=4500.0, stock=15, minimum_stock=5)` is instantiated
- **THEN** no validation error is raised and all optional fields default to `None`

#### Scenario: Missing required field rejected
- **WHEN** `ProductCreate(price=100.0, stock=5, minimum_stock=2)` is instantiated without `name`
- **THEN** a Pydantic `ValidationError` is raised

#### Scenario: Negative price rejected
- **WHEN** `ProductCreate(name="X", price=-1.0, stock=5, minimum_stock=2)` is instantiated
- **THEN** a Pydantic `ValidationError` is raised (RN-PR-02)

#### Scenario: Negative stock rejected
- **WHEN** `ProductCreate(name="X", price=10.0, stock=-1, minimum_stock=2)` is instantiated
- **THEN** a Pydantic `ValidationError` is raised (RN-PR-03)

### Requirement: ProductUpdate schema
The system SHALL define a Pydantic v2 `ProductUpdate` schema where all fields are optional (`name`, `description`, `price`, `category`, `stock`, `minimum_stock` — all `| None`). A PATCH with only `price` updated SHALL be valid.

#### Scenario: Partial update with single field
- **WHEN** `ProductUpdate(price=9999.0)` is instantiated
- **THEN** all other fields are `None` and no validation error is raised

### Requirement: ProductResponse schema
The system SHALL define a Pydantic v2 `ProductResponse` schema that includes all fields of `Product` plus a computed `status` field (str) with values `"normal"`, `"low_stock"`, or `"out_of_stock"` based on RN-ST-01/02/03. The schema SHALL use `model_config = ConfigDict(from_attributes=True)`.

#### Scenario: Product response includes all fields
- **WHEN** a `ProductResponse` is constructed from a `Product` ORM instance
- **THEN** `id`, `name`, `description`, `price`, `stock`, `minimum_stock`, `category`, `created_at` are all present
