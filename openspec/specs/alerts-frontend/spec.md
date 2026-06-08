# Capability: alerts-frontend

## Purpose

Provides the React frontend for stock alert visualization and AI-powered recommendations. Renders an `AlertList` panel on the `/products` page showing products with low or no stock, and integrates an `AIRecommendationModal` that calls the `POST /ai/recommendation` backend endpoint.

---

## Requirements

### Requirement: Alert panel displays products with low or no stock
The system SHALL render an `AlertList` section at the top of the `/products` page showing only products where `alert_status` is `'low'` or `'out_of_stock'`. The section SHALL be hidden when no products are in alert state.

#### Scenario: Panel is visible when alerts exist
- **WHEN** the products list contains at least one product with `alert_status === 'low'` or `alert_status === 'out_of_stock'`
- **THEN** the alert panel is rendered above the product table with a title indicating the number of products in alert

#### Scenario: Panel is hidden when no alerts
- **WHEN** all products have `alert_status === 'normal'`
- **THEN** the alert panel is not rendered

#### Scenario: Alert badges differentiate low from out-of-stock
- **WHEN** a product in the alert panel has `alert_status === 'out_of_stock'`
- **THEN** a red badge labeled "Agotado" is shown next to the product name
- **WHEN** a product in the alert panel has `alert_status === 'low'`
- **THEN** a yellow badge labeled "Stock bajo" is shown next to the product name

---

### Requirement: AI recommendation button available for alerted products
The system SHALL display a button "Obtener recomendación IA" on each product row/card inside `AlertList` where `alert_status` is `'low'` or `'out_of_stock'`.

#### Scenario: Button is visible for alerted products
- **WHEN** a product appears in the alert panel
- **THEN** the "Obtener recomendación IA" button is visible on that product's entry

#### Scenario: Button click opens recommendation modal
- **WHEN** the user clicks "Obtener recomendación IA" for a product
- **THEN** the AI recommendation modal opens for that specific product

---

### Requirement: AI recommendation modal with loading, success, and error states
The system SHALL provide a modal component that calls `POST /ai/recommendation` with the selected product's data and displays the result.

#### Scenario: Modal shows loading state while fetching
- **WHEN** the user clicks "Obtener recomendación IA" and the request is in flight
- **THEN** the modal displays a spinner and the text "Consultando al asistente…"

#### Scenario: Modal shows recommendation on success
- **WHEN** the API responds with a recommendation text
- **THEN** the modal displays the full recommendation text returned by the backend

#### Scenario: Modal shows fallback on API error
- **WHEN** the API call fails (network error, timeout, or server error)
- **THEN** the modal displays a user-friendly error message without crashing the UI

#### Scenario: Modal can be closed
- **WHEN** the user clicks the close button or outside the modal
- **THEN** the modal closes and the mutation state is reset

---

### Requirement: aiApi service calls POST /ai/recommendation
The system SHALL expose a `getRecommendation({ producto, stock_actual, stock_minimo })` function in `frontend/src/services/aiApi.ts` that sends a POST request to `/ai/recommendation`.

#### Scenario: Successful API call returns recommendation
- **WHEN** `getRecommendation` is called with valid product data
- **THEN** the function resolves with `{ recommendation: string }`

#### Scenario: Failed API call propagates error
- **WHEN** the API returns a non-2xx status
- **THEN** the function rejects so the calling hook can handle the error state
