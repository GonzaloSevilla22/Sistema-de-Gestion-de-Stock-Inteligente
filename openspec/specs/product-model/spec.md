# Spec: product-model

## Purpose

Defines the `Product` SQLAlchemy 2.0 ORM model, its mapped columns, database indexes, and its one-to-many relationship with `StockMovement`.

---

## Requirements

### Requirement: Product model structure
The system SHALL define a `Product` SQLAlchemy 2.0 model with the following mapped columns: `id` (INTEGER PK autoincrement), `name` (VARCHAR(255) NOT NULL), `description` (TEXT nullable), `price` (NUMERIC(10,2) NOT NULL), `stock` (INTEGER NOT NULL), `minimum_stock` (INTEGER NOT NULL), `category` (VARCHAR(100) nullable), `created_at` (DATETIME NOT NULL default `datetime.utcnow`).

#### Scenario: Product model creation in SQLite in-memory
- **WHEN** `Base.metadata.create_all(engine)` is called on a SQLite in-memory engine
- **THEN** the `product` table is created with all 8 columns and correct types

#### Scenario: Product with only required fields
- **WHEN** a `Product` is instantiated with `name="Test"` and `price=100.0` and `stock=10` and `minimum_stock=5`
- **THEN** `description` and `category` are `None` and `created_at` is auto-set to current UTC time

---

### Requirement: Product table indexes
The system SHALL create two database indexes on the `product` table: `idx_product_category` on the `category` column and `idx_product_stock` on the `stock` column.

#### Scenario: Indexes present after table creation
- **WHEN** `Base.metadata.create_all(engine)` is called
- **THEN** both `idx_product_category` and `idx_product_stock` indexes are defined in the model metadata

---

### Requirement: Product to StockMovement relationship
The system SHALL define a one-to-many relationship from `Product` to `StockMovement` with `cascade="all, delete-orphan"` so that deleting a `Product` removes all its associated `StockMovement` records.

#### Scenario: Cascade delete removes movements
- **WHEN** a `Product` with associated `StockMovement` records is deleted via the ORM session
- **THEN** all `StockMovement` records referencing that `product_id` are also deleted

#### Scenario: Product deletion via direct SQL cascade
- **WHEN** a `Product` is deleted via a raw SQL DELETE (not ORM)
- **THEN** the `StockMovement` records with matching `product_id` are deleted by the database CASCADE constraint
