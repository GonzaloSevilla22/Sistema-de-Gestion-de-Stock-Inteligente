# Capability: dashboard-frontend

## Purpose

Provides the frontend Dashboard page that consumes `GET /dashboard` and displays real-time KPI cards for total products, low-stock count, and out-of-stock count.

---

## Requirements

### Requirement: Dashboard API service
The system SHALL provide a `dashboardApi.ts` service that calls `GET /api/dashboard` using the shared Axios instance and returns a `DashboardKPIs` object.

#### Scenario: Successful API call returns KPIs
- **WHEN** `getDashboardKPIs()` is called and the backend responds with HTTP 200
- **THEN** the function resolves with `{ total_products, low_stock_count, out_of_stock_count }` as numbers

#### Scenario: API call fails with network error
- **WHEN** `getDashboardKPIs()` is called and the backend is unreachable
- **THEN** the function rejects with an Axios error that the caller can handle

---

### Requirement: useDashboard React Query hook
The system SHALL provide a `useDashboard` hook that wraps `getDashboardKPIs` with TanStack Query v5, auto-refreshes every 30 seconds, and exposes `{ data, isLoading, isError }`.

#### Scenario: Hook returns data on success
- **WHEN** `useDashboard()` is called and the API call succeeds
- **THEN** `data` contains the `DashboardKPIs` object and `isLoading` is false

#### Scenario: Hook reflects loading state on first fetch
- **WHEN** `useDashboard()` is called before the first API response arrives
- **THEN** `isLoading` is true and `data` is undefined

#### Scenario: Hook reflects error state on failure
- **WHEN** `useDashboard()` is called and the API call fails
- **THEN** `isError` is true and `data` is undefined

#### Scenario: Hook auto-refreshes every 30 seconds
- **WHEN** the Dashboard page is mounted and 30 seconds elapse
- **THEN** `useDashboard` triggers a new call to `getDashboardKPIs` without user interaction

---

### Requirement: KpiCard presentational component
The system SHALL provide a `KpiCard` component that receives `title: string`, `value: number | undefined`, and `colorClass: "blue" | "yellow" | "red"` props and renders a styled card.

#### Scenario: KpiCard renders title and value
- **WHEN** `<KpiCard title="Total" value={42} colorClass="blue" />` is rendered
- **THEN** the card displays "Total" and "42" visually

#### Scenario: KpiCard renders loading state when value is undefined
- **WHEN** `<KpiCard title="Total" value={undefined} colorClass="blue" />` is rendered
- **THEN** the card shows a loading placeholder instead of a number

#### Scenario: KpiCard applies color-coded styling
- **WHEN** `colorClass="yellow"` is passed
- **THEN** the card uses yellow Tailwind classes for its accent color

---

### Requirement: Dashboard page displays KPI cards
The system SHALL render three `KpiCard` components on the Dashboard page using data from `useDashboard`: Total Productos (blue), Stock Bajo (yellow), Sin Stock (red).

#### Scenario: Dashboard shows all three KPI cards when data loads
- **WHEN** the user navigates to `/` and the backend responds with KPIs
- **THEN** three cards are visible: "Total Productos", "Stock Bajo", "Sin Stock" with their respective values

#### Scenario: Dashboard shows loading state while fetching
- **WHEN** the user navigates to `/` before the API responds
- **THEN** all three cards display a loading placeholder

#### Scenario: Dashboard shows error message on API failure
- **WHEN** the backend is unreachable and the API call fails
- **THEN** the Dashboard displays an error message (e.g., "No se pudo conectar al servidor")
