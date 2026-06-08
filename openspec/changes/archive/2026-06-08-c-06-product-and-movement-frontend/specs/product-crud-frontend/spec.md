## ADDED Requirements

### Requirement: Product list displays all products with stock status
The system SHALL render a table at `/products` showing all products fetched from `GET /products`, with columns: nombre, categoría, precio, stock actual, stock mínimo, and a status chip.

#### Scenario: Table renders products on load
- **WHEN** the user navigates to `/products`
- **THEN** the table fetches `GET /products` and displays each product as a row

#### Scenario: Status chip reflects stock level
- **WHEN** a product has `stock === 0`
- **THEN** the row shows a red chip labeled "Agotado"
- **WHEN** a product has `stock > 0` and `stock <= minimum_stock`
- **THEN** the row shows a yellow chip labeled "Stock bajo"
- **WHEN** a product has `stock > minimum_stock`
- **THEN** the row shows a green chip labeled "Normal"

#### Scenario: Search filters products by name
- **WHEN** the user types in the search input
- **THEN** only rows whose product name contains the search string (case-insensitive) are shown

---

### Requirement: Product can be created via form
The system SHALL provide a "Nuevo producto" button that opens a form. On submit, `POST /products` is called and the list refreshes.

#### Scenario: Create form opens on button click
- **WHEN** the user clicks "Nuevo producto"
- **THEN** a form is displayed with fields: nombre (required), descripción, categoría, precio (required), stock inicial (required), stock mínimo (required)

#### Scenario: Valid create saves and refreshes list
- **WHEN** the user fills all required fields and submits
- **THEN** `POST /products` is called, the form closes, and the product list refreshes via `invalidateQueries(['products'])`

#### Scenario: Missing required field shows validation error
- **WHEN** the user submits without nombre or precio
- **THEN** a validation error message is shown inline without calling the API

#### Scenario: Duplicate name shows API error inline
- **WHEN** the API returns 409 Conflict
- **THEN** the form stays open and displays the error message from the API response

---

### Requirement: Product can be edited via pre-filled form
The system SHALL provide an "Editar" button per row. Clicking it opens the form pre-populated with the product's current data. On submit, `PUT /products/{id}` is called.

#### Scenario: Edit form opens pre-filled
- **WHEN** the user clicks "Editar" on a product row
- **THEN** the form opens with all fields pre-filled with the product's current values

#### Scenario: Valid edit saves and refreshes
- **WHEN** the user modifies fields and submits
- **THEN** `PUT /products/{id}` is called and the product list refreshes

---

### Requirement: Product can be deleted with confirmation
The system SHALL provide a "Eliminar" button per row. Clicking it shows a confirmation dialog. On confirm, `DELETE /products/{id}` is called.

#### Scenario: Delete requires confirmation
- **WHEN** the user clicks "Eliminar"
- **THEN** a confirmation dialog appears before the API is called

#### Scenario: Confirmed delete removes product and refreshes
- **WHEN** the user confirms deletion
- **THEN** `DELETE /products/{id}` is called and the product list refreshes via `invalidateQueries(['products'])`

#### Scenario: Cancelled delete does nothing
- **WHEN** the user cancels the confirmation
- **THEN** no API call is made and the product remains in the list
