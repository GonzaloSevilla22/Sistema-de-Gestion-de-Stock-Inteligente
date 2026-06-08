## MODIFIED Requirements

### Requirement: React Router defines three base routes
The system SHALL define three client-side routes in `App.tsx`: `/` (Dashboard), `/products` (Products), `/movements` (StockMovements). A persistent navigation bar SHALL be rendered on every page with links to all three routes, highlighting the active route. The Dashboard route SHALL render the full KPI dashboard, not a placeholder.

#### Scenario: Route / renders Dashboard with KPI cards
- **WHEN** the browser navigates to `/`
- **THEN** the Dashboard page component is rendered showing three KPI cards (Total Productos, Stock Bajo, Sin Stock)

#### Scenario: Route /products renders Products page
- **WHEN** the browser navigates to `/products`
- **THEN** the Products page component is rendered

#### Scenario: Route /movements renders StockMovements page
- **WHEN** the browser navigates to `/movements`
- **THEN** the StockMovements page component is rendered

#### Scenario: Navbar is visible on all routes
- **WHEN** the user is on any route
- **THEN** a navbar with links "Dashboard", "Productos" and "Movimientos" is visible at the top of the page

#### Scenario: Active link is visually distinguished
- **WHEN** the user is on `/products`
- **THEN** the "Productos" nav link appears visually active (different style than inactive links)
