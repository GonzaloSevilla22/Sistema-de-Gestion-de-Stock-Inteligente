## ADDED Requirements

### Requirement: Frontend project is compilable
The system SHALL provide a Vite + React + TypeScript project in `frontend/` that builds without errors using `npm run build` and starts a dev server with `npm run dev`.

#### Scenario: Dev server starts without errors
- **WHEN** `npm run dev` is executed from `frontend/`
- **THEN** the Vite dev server starts on port 5173 without compilation errors

#### Scenario: Production build succeeds
- **WHEN** `npm run build` is executed from `frontend/`
- **THEN** the build completes without TypeScript or Vite errors and outputs to `frontend/dist/`

### Requirement: TypeScript is configured with strict mode
The system SHALL include a `tsconfig.json` (or `tsconfig.app.json`) with `strict: true` so that `any` types and implicit casts are rejected at compile time.

#### Scenario: Strict mode is enforced
- **WHEN** a TypeScript file uses an untyped variable with implicit `any`
- **THEN** `tsc --noEmit` reports a type error

### Requirement: TailwindCSS is integrated and available
The system SHALL configure TailwindCSS so that Tailwind utility classes are available in all `.tsx` files under `frontend/src/`.

#### Scenario: Tailwind class renders correctly
- **WHEN** a component uses a Tailwind class (e.g., `className="text-red-500"`)
- **THEN** the compiled CSS output includes the corresponding rule

### Requirement: React Query is configured as the server state manager
The system SHALL wrap the application in a `QueryClientProvider` so that all components can use TanStack Query v5 hooks.

#### Scenario: QueryClientProvider is present at root
- **WHEN** `App.tsx` renders
- **THEN** `QueryClientProvider` wraps all child components with a configured `QueryClient`

### Requirement: React Router defines three base routes
The system SHALL define three client-side routes in `App.tsx`: `/` (Dashboard), `/products` (Products), `/movements` (StockMovements).

#### Scenario: Route / renders Dashboard placeholder
- **WHEN** the browser navigates to `/`
- **THEN** the Dashboard page component is rendered

#### Scenario: Route /products renders Products placeholder
- **WHEN** the browser navigates to `/products`
- **THEN** the Products page component is rendered

#### Scenario: Route /movements renders StockMovements placeholder
- **WHEN** the browser navigates to `/movements`
- **THEN** the StockMovements page component is rendered

### Requirement: Required dependencies are declared in package.json
The system SHALL declare all required packages in `frontend/package.json`: `react` ^18, `react-dom` ^18, `typescript` ^5, `vite` ^5, `tailwindcss` ^3, `@tanstack/react-query` ^5, `react-router-dom` ^6, `axios` ^1.

#### Scenario: All dependencies are present after npm install
- **WHEN** `npm install` is run from `frontend/`
- **THEN** all required packages are installed without peer dependency errors
