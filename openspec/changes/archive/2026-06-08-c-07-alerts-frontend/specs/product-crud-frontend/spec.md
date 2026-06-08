## ADDED Requirements

### Requirement: Products page integrates AlertList panel
The system SHALL render the `AlertList` component at the top of the `/products` page, receiving the already-loaded `products` array as a prop (no second fetch). The panel SHALL receive an `onRequestAI` callback to open the recommendation modal for a given product.

#### Scenario: AlertList receives products without re-fetching
- **WHEN** the user navigates to `/products`
- **THEN** the same `products` array fetched for the table is passed to `AlertList` as a prop

#### Scenario: Clicking AI button in AlertList opens modal with correct product
- **WHEN** the user clicks "Obtener recomendación IA" for a specific product in the panel
- **THEN** `Products.tsx` sets `selectedProduct` to that product and renders `AIRecommendationModal`

#### Scenario: Closing the modal resets selected product
- **WHEN** the user closes the AI recommendation modal
- **THEN** `selectedProduct` is reset to `null` and the modal is unmounted
