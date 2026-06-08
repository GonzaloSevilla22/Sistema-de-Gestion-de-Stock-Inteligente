## 1. Estructura de directorios

- [x] 1.1 Crear árbol de directorios `backend/app/{api,models,schemas,repositories,services,database}/` con `__init__.py` vacíos en cada uno
- [x] 1.2 Crear `backend/tests/` con `__init__.py` vacío
- [x] 1.3 Crear árbol de directorios `frontend/src/{pages,components,services,hooks,types}/` (vacíos por ahora)

## 2. Backend — dependencias y variables de entorno

- [x] 2.1 Crear `backend/requirements.txt` con: `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `pydantic[email]`, `python-dotenv`, `alembic`, `pytest`, `httpx`, `aiosqlite`, `anthropic`, `google-generativeai`
- [x] 2.2 Crear `backend/.env.example` con las cuatro variables: `DATABASE_URL`, `AI_API_KEY`, `AI_PROVIDER`, `CORS_ORIGINS`

## 3. Backend — base de datos

- [x] 3.1 Crear `backend/app/database/connection.py`: importar `create_engine`, `DeclarativeBase`; crear `Base`; crear `engine` desde `DATABASE_URL` con lógica dual SQLite/PostgreSQL (D-02)
- [x] 3.2 Crear `backend/app/database/session.py`: importar `SessionLocal` desde `connection`; implementar `get_db()` con `yield` para inyección de dependencia FastAPI

## 4. Backend — aplicación FastAPI

- [x] 4.1 Crear `backend/app/main.py`: instanciar `FastAPI(lifespan=lifespan)`; agregar `CORSMiddleware` con `CORS_ORIGINS` parseado de env; implementar `lifespan` con `Base.metadata.create_all(bind=engine)`
- [x] 4.2 Verificar que `python -c "from app.main import app"` ejecuta sin errores desde `backend/`

## 5. Backend — test suite

- [x] 5.1 Crear `backend/tests/conftest.py` con fixture `db_session` que usa SQLite in-memory (`sqlite+aiosqlite:///:memory:` o `sqlite:///:memory:`)
- [x] 5.2 Verificar que `pytest --collect-only` desde `backend/` sale con código 0 y sin errores de importación

## 6. Frontend — proyecto Vite + React + TypeScript

- [x] 6.1 Crear `frontend/package.json` declarando las dependencias: `react` ^18, `react-dom` ^18, `typescript` ^5, `vite` ^5, `@vitejs/plugin-react`, `tailwindcss` ^3, `postcss`, `autoprefixer`, `@tanstack/react-query` ^5, `react-router-dom` ^6, `axios` ^1; scripts `dev`, `build`, `preview`
- [x] 6.2 Crear `frontend/vite.config.ts`: plugin `@vitejs/plugin-react`, resolver de rutas si aplica
- [x] 6.3 Crear `frontend/tailwind.config.js`: content apuntando a `./src/**/*.{ts,tsx}`; plugins vacíos
- [x] 6.4 Crear `frontend/postcss.config.js` con `tailwindcss` y `autoprefixer`
- [x] 6.5 Crear `frontend/tsconfig.json` con `strict: true`, `jsx: "react-jsx"`, target ES2020
- [x] 6.6 Crear `frontend/index.html` con entry point `<script type="module" src="/src/main.tsx">`
- [x] 6.7 Crear `frontend/src/main.tsx`: renderiza `<App />` dentro de `<QueryClientProvider>`
- [x] 6.8 Crear `frontend/src/index.css` con las tres directivas de Tailwind (`@tailwind base/components/utilities`)

## 7. Frontend — rutas y páginas placeholder

- [x] 7.1 Crear `frontend/src/pages/Dashboard.tsx`: componente funcional con `<h1>Dashboard</h1>` (placeholder)
- [x] 7.2 Crear `frontend/src/pages/Products.tsx`: componente funcional con `<h1>Productos</h1>` (placeholder)
- [x] 7.3 Crear `frontend/src/pages/StockMovements.tsx`: componente funcional con `<h1>Movimientos</h1>` (placeholder)
- [x] 7.4 Crear `frontend/src/App.tsx`: `BrowserRouter` + `Routes` con tres `Route`: `/` → `Dashboard`, `/products` → `Products`, `/movements` → `StockMovements`

## 8. Verificación final

- [x] 8.1 Ejecutar `npm install` desde `frontend/` — sin errores de peer dependencies
- [x] 8.2 Ejecutar `npm run build` desde `frontend/` — sale con código 0
- [x] 8.3 Ejecutar `pytest --collect-only` desde `backend/` — sale con código 0
