## ADDED Requirements

### Requirement: StockMovement model structure
The system SHALL define a `StockMovement` SQLAlchemy 2.0 model with: `id` (INTEGER PK autoincrement), `product_id` (INTEGER FK → `product.id` NOT NULL, `ondelete="CASCADE"`), `type` (VARCHAR(10) NOT NULL, values constrained to `"ENTRADA"` or `"SALIDA"` via Python Enum `MovementType`), `quantity` (INTEGER NOT NULL), `date` (DATETIME NOT NULL default `datetime.utcnow`), `observation` (TEXT nullable).

#### Scenario: StockMovement model creation
- **WHEN** `Base.metadata.create_all(engine)` is called on a SQLite in-memory engine
- **THEN** the `stock_movement` table is created with all 6 columns and a FK constraint on `product_id`

#### Scenario: StockMovement with ENTRADA type
- **WHEN** a `StockMovement` is created with `type=MovementType.ENTRADA`, `quantity=10`, and a valid `product_id`
- **THEN** the record persists with `type="ENTRADA"` and `date` auto-set

#### Scenario: StockMovement with SALIDA type
- **WHEN** a `StockMovement` is created with `type=MovementType.SALIDA`, `quantity=5`, and a valid `product_id`
- **THEN** the record persists with `type="SALIDA"`

### Requirement: StockMovement table indexes
The system SHALL create two database indexes on `stock_movement`: `idx_movement_product` on `product_id` and `idx_movement_date` on `date`.

#### Scenario: Indexes present after table creation
- **WHEN** `Base.metadata.create_all(engine)` is called
- **THEN** both `idx_movement_product` and `idx_movement_date` indexes are defined in the model metadata

### Requirement: MovementType Python Enum
The system SHALL define a Python `Enum` named `MovementType` with exactly two values: `ENTRADA = "ENTRADA"` and `SALIDA = "SALIDA"`. Any other value SHALL be rejected.

#### Scenario: Invalid movement type rejected at schema level
- **WHEN** a Pydantic `MovementCreate` schema is instantiated with `type="OTRO"`
- **THEN** a `ValidationError` is raised with status 422

#### Scenario: Valid enum values accepted
- **WHEN** a `MovementCreate` is instantiated with `type="ENTRADA"` or `type="SALIDA"`
- **THEN** no validation error is raised
