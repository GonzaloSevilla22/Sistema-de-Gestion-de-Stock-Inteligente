# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **Sistema de Gestión de Stock Inteligente**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

---

## Cómo usar este documento

1. **Identificar el change**: elegí el próximo `C-NN` pendiente (`[ ]`) respetando dependencias.
2. **Leer la KB**: revisá todos los archivos listados en "Leer antes" del change seleccionado.
3. **Proponer**: ejecutá `/opsx:propose C-NN-{nombre}` para que el agente genere la propuesta, diseño y tareas.
4. **Aplicar**: ejecutá `/opsx:apply C-NN-{nombre}` para la implementación.
5. **Marcar**: al completar, cambiá `[ ]` por `[x]` en el Estado del change y ejecutá `/opsx:archive C-NN-{nombre}`.

---

## Árbol de dependencias

```
C-01 foundation-setup
└── C-02 core-models-and-db
    ├── C-03 product-crud-backend
    │   ├── C-04 movement-backend
    │   │   ├── C-06 movement-frontend
    │   │   └── C-07 alerts-frontend
    │   ├── C-05 dashboard-backend
    │   │   └── C-08 dashboard-frontend
    │   └── C-06 movement-frontend
    │       └── C-09 ai-recommendation
    └── C-03 product-crud-frontend
        └── (depende de C-03)
```

```
C-01
 └─ C-02
     ├─ C-03 (product CRUD backend)
     │    ├─ C-04 (movement backend)
     │    │    ├─ C-06 (movement frontend)
     │    │    └─ C-07 (alerts frontend)
     │    ├─ C-05 (dashboard backend)
     │    │    └─ C-08 (dashboard frontend)
     │    └─ C-03-fe (product CRUD frontend — mismo change)
     └─ C-09 (AI recommendation — depende de C-04)
C-10 docker-cicd (depende de C-01..C-09 todos)
```

### Paralelismo por fase

```
GATE 0: C-01 foundation-setup ✓     ← ARRANQUE
  → C-02 core-models-and-db         [Agente A]

GATE 1: C-02 core-models-and-db ✓   ← PRIMER FORK
  → C-03 product-crud-backend        [Agente A]
  → C-05 dashboard-backend           [Agente B — si C-03 ✓ parcialmente]

GATE 2: C-03 product-crud-backend ✓
  → C-04 movement-backend            [Agente A]
  → C-05 dashboard-backend           [Agente B — si no iniciado aún]
  → C-03-fe product-crud-frontend    [Agente C]

GATE 3: C-04 movement-backend ✓     ← SEGUNDO FORK
  → C-06 movement-frontend           [Agente C]
  → C-07 alerts-frontend             [Agente C]
  → C-09 ai-recommendation           [Agente B]

GATE 4: C-05 dashboard-backend ✓
  → C-08 dashboard-frontend          [Agente C — si C-03-fe ✓]

GATE 5: C-01..C-09 todos ✓
  → C-10 docker-cicd                 [Agente A]
```

### Camino crítico (6 changes — mínimo irreducible)

```
C-01 → C-02 → C-03 → C-04 → C-06 → C-10
```

> C-03 incluye tanto el backend como el frontend de productos en un solo change atómico.
> C-09 (IA) es opcional para producción básica pero incluido en el plan.

### Plan óptimo con 3 agentes

| Paso | Agente A (Backend Core) | Agente B (Backend Aux) | Agente C (Frontend) |
|------|------------------------|----------------------|---------------------|
| 1    | C-01 foundation-setup   | —                    | —                   |
| 2    | C-02 core-models-and-db | —                    | —                   |
| 3    | C-03 product-crud-backend | C-05 dashboard-backend | —               |
| 4    | C-04 movement-backend   | C-09 ai-recommendation | C-03 product-crud-frontend |
| 5    | C-10 docker-cicd        | —                    | C-06 movement-frontend + C-07 alerts-frontend |
| 6    | —                       | —                    | C-08 dashboard-frontend |

---

## FASE 1 — Foundation e Infraestructura

> Base de todo el proyecto. Sin esta fase no se puede ejecutar nada. Es secuencial y sin paralelismo.

### [C-01] `foundation-setup`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - Crear estructura de directorios del proyecto: `backend/app/{api,models,schemas,repositories,services,database}/`, `backend/tests/`, `frontend/src/{pages,components,services,hooks,types}/`
  - `backend/requirements.txt` con: `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `pydantic[email]`, `python-dotenv`, `pytest`, `httpx`, `anthropic` o `google-generativeai`
  - `backend/.env.example` con variables: `DATABASE_URL`, `AI_API_KEY`, `AI_PROVIDER`, `CORS_ORIGINS`
  - `backend/app/database/connection.py`: Engine SQLAlchemy + Base declarativa; soporta SQLite (dev) y PostgreSQL (prod) según `DATABASE_URL`
  - `backend/app/database/session.py`: función `get_db()` como dependencia FastAPI (yield session)
  - `backend/app/main.py`: app FastAPI, CORS configurado con `CORS_ORIGINS`, lifespan que crea tablas al arrancar
  - `frontend/package.json` con React 18, TypeScript, Vite, TailwindCSS, React Query v5, React Router v6, Axios
  - `frontend/vite.config.ts`, `frontend/tailwind.config.js`
  - `frontend/src/App.tsx`: router principal con rutas `/`, `/products`, `/movements`
  - Tests: script `pytest --co` debe listar sin errores
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios
  - `knowledge-base/08_arquitectura_propuesta.md` §Variables de entorno
  - `knowledge-base/08_arquitectura_propuesta.md` §Seguridad

---

### [C-02] `core-models-and-db`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - `backend/app/models/product.py`: SQLAlchemy model `Product` con campos `id`, `name`, `description`, `price`, `stock`, `minimum_stock`, `category`, `created_at`; índices `idx_product_category`, `idx_product_stock`
  - `backend/app/models/stock_movement.py`: SQLAlchemy model `StockMovement` con FK a `Product`, campo `type` (enum `ENTRADA`/`SALIDA`), `quantity`, `date`, `observation`; CASCADE DELETE; índices `idx_movement_product`, `idx_movement_date`
  - `backend/app/schemas/product_schema.py`: schemas Pydantic `ProductCreate`, `ProductUpdate`, `ProductResponse` (campos en inglés: `stock`, `minimum_stock`)
  - `backend/app/schemas/movement_schema.py`: schemas `MovementCreate`, `MovementResponse`
  - Seed script `backend/seed.py` con 4 productos de ejemplo (estados: normal, bajo, agotado)
  - Tests: `test_models.py` — verificar que los modelos se crean y que CASCADE DELETE funciona en SQLite
- **Dependencias**: `C-01`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Entidades
  - `knowledge-base/04_modelo_de_datos.md` §Reglas de integridad
  - `knowledge-base/04_modelo_de_datos.md` §Seed data inicial
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Productos
  - `knowledge-base/10_preguntas_abiertas.md` §IN-01

---

## FASE 2 — Backend: Dominio de Productos

> El dominio central del sistema. Habilita todos los changes de backend y frontend posteriores.

### [C-03] `product-crud-backend`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - `backend/app/repositories/product_repository.py`: métodos `create()`, `get_by_id()`, `get_all()`, `update()`, `delete()`, `count_all()`, `count_low_stock()`, `count_out_of_stock()`, `get_by_name()`
  - `backend/app/services/product_service.py`: lógica de negocio — validación nombre único (RN-PR-04), validación `price >= 0` (RN-PR-02), `stock >= 0` (RN-PR-03); cálculo de estado de alerta dinámico (RN-ST-01, RN-ST-02, RN-ST-03, RN-ST-04)
  - `backend/app/api/product_routes.py`: endpoints `GET /products`, `GET /products/{id}`, `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}`; respuestas `201` en create, `404` si no existe, `409` en nombre duplicado
  - Tests: `backend/tests/test_product_service.py` — casos: crear producto válido, crear con nombre duplicado (409), precio negativo (422), obtener todos, editar, eliminar con verificación de cascade
- **Dependencias**: `C-02`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Productos
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Stock y Alertas
  - `knowledge-base/06_funcionalidades.md` §Épica 2
  - `knowledge-base/07_flujos_principales.md` §Flujo 3

---

## FASE 3 — Backend: Movimientos, Dashboard e IA

> Tres dominios independientes que se pueden paralelizar una vez C-03 está completo.

### [C-04] `movement-backend`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - `backend/app/repositories/movement_repository.py`: métodos `create()`, `get_all()`, `get_by_product_id()`
  - `backend/app/services/movement_service.py`: lógica — validar `type` en `{ENTRADA, SALIDA}` (RN-MV-01), `quantity > 0` (RN-MV-02), verificar `stock >= quantity` antes de SALIDA (RN-MV-05), actualizar `product.stock` via `product_repository.update_stock()` (RN-MV-03, RN-MV-04), fecha asignada en servidor (RN-MV-06)
  - `backend/app/api/movement_routes.py`: endpoints `GET /movements`, `POST /movements`; respuesta `201` en create, `400` si stock insuficiente, `404` si producto no existe
  - Tests: `backend/tests/test_movement_service.py` — casos: entrada válida incrementa stock, salida válida decrementa stock, salida con stock insuficiente retorna 400, tipo inválido retorna 422, quantity <= 0 retorna 422
- **Dependencias**: `C-03`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Movimientos
  - `knowledge-base/06_funcionalidades.md` §Épica 3
  - `knowledge-base/07_flujos_principales.md` §Flujo 1

---

### [C-05] `dashboard-backend`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - `backend/app/services/dashboard_service.py`: método `get_kpis()` — llama a `product_repository.count_all()`, `count_low_stock()`, `count_out_of_stock()`; todo calculado en tiempo real sin caché (RN-DH-03)
  - `backend/app/api/dashboard_routes.py`: endpoint `GET /dashboard` → `{ "total_products": N, "low_stock_count": N, "out_of_stock_count": N }` (RN-DH-01); lógica en service, no en route (RN-DH-02)
  - Tests: `backend/tests/test_dashboard_service.py` — casos: dashboard con BD vacía retorna ceros, con 4 productos seed retorna conteos correctos para cada estado
- **Dependencias**: `C-03`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Dashboard
  - `knowledge-base/06_funcionalidades.md` §Épica 1
  - `knowledge-base/07_flujos_principales.md` §Flujo 4

---

### [C-09] `ai-recommendation`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - `backend/app/services/ai_service.py`: método `get_recommendation(producto, stock_actual, stock_minimo)` — construye prompt LLM, llama API externa configurada por `AI_PROVIDER` env var (`claude` usa `anthropic` SDK, `gemini` usa `google-generativeai`); si falla → retorna mensaje fallback predefinido en español (RN-AI-03); nunca hardcodea API Key (RN-AI-04); stateless, no persiste (RN-AI-05)
  - `backend/app/api/ai_routes.py`: endpoint `POST /ai/recommendation` recibe `{ "producto": str, "stock_actual": int, "stock_minimo": int }` (RN-AI-01); retorna `{ "recommendation": "texto..." }`; maneja error de API con fallback, nunca 500 (RN-AI-03)
  - Tests: `backend/tests/test_ai_service.py` — mockear API externa; casos: respuesta exitosa retorna texto, API falla retorna fallback, inputs negativos retornan 422
- **Dependencias**: `C-04`
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: IA
  - `knowledge-base/06_funcionalidades.md` §Épica 5
  - `knowledge-base/07_flujos_principales.md` §Flujo 2
  - `knowledge-base/10_preguntas_abiertas.md` §IN-02

---

## FASE 4 — Frontend: Todas las vistas

> Una vez que los backends de productos y movimientos están listos, el frontend puede construirse en paralelo por módulo.

### [C-03-FE] `product-crud-frontend`

> Nota: este change se numera `C-03-FE` pero en el plan secuencial forma parte de la FASE 4 y depende de `C-03` backend.

### [C-06] `product-and-movement-frontend`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - `frontend/src/types/index.ts`: interfaces TypeScript `Product`, `StockMovement`, `MovementCreate`, `DashboardKPIs`; usar nombres en inglés (`stock`, `minimum_stock`) con etiquetas en español en UI
  - `frontend/src/services/productApi.ts`: funciones Axios `getProducts()`, `getProduct(id)`, `createProduct()`, `updateProduct()`, `deleteProduct()`
  - `frontend/src/services/movementApi.ts`: funciones `getMovements()`, `createMovement()`
  - `frontend/src/hooks/useProducts.ts`: React Query hooks `useProducts()`, `useProduct(id)`, `useCreateProduct()`, `useUpdateProduct()`, `useDeleteProduct()`
  - `frontend/src/pages/Products.tsx`: tabla con columnas nombre/categoría/precio/stock/estado; indicador visual de estado (chip verde/amarillo/rojo); búsqueda por nombre; botones Editar/Eliminar; diálogo de confirmación para delete; botón "Nuevo producto"
  - `frontend/src/components/ProductTable.tsx`: componente de tabla reutilizable con TailwindCSS
  - `frontend/src/components/ProductForm.tsx`: formulario Create/Edit — campos nombre (req), descripción, categoría, precio (req), stock inicial (req), stock mínimo (req); validación client-side; errores de API mostrados inline
  - `frontend/src/pages/StockMovements.tsx`: tabla de movimientos — columnas producto/tipo/cantidad/fecha/observación; ordenamiento fecha desc; color ENTRADA (verde) vs SALIDA (rojo); botón "Registrar movimiento"
  - `frontend/src/components/MovementForm.tsx`: formulario — selector de producto, tipo ENTRADA/SALIDA, cantidad, observación; manejo de error 400 (stock insuficiente)
  - React Query `invalidateQueries` en mutaciones para refrescar productos y movimientos
- **Dependencias**: `C-03`, `C-04`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 2, §Épica 3
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios §frontend
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Stock y Alertas
  - `knowledge-base/07_flujos_principales.md` §Flujo 1, §Flujo 3

---

### [C-07] `alerts-frontend`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - `frontend/src/components/AlertList.tsx`: componente que filtra y muestra productos con `stock <= minimum_stock` o `stock == 0`; badge visual por estado (amarillo "Stock bajo" / rojo "Agotado")
  - Integración en `Products.tsx`: renderizar `AlertList` como panel lateral o sección superior cuando existen productos en alerta
  - Botón "Obtener recomendación IA" visible en filas/cards de productos con stock bajo o agotado (condición: `stock <= minimum_stock`)
  - Modal de recomendación: componente con estado loading/success/error; muestra texto de respuesta del LLM o mensaje de fallback
  - `frontend/src/services/aiApi.ts`: función `getRecommendation({ producto, stock_actual, stock_minimo })`
  - React Query `useMutation` para llamada a `/ai/recommendation`; manejo de error amigable (RN-AI-03)
- **Dependencias**: `C-06`, `C-09`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 4, §Épica 5
  - `knowledge-base/05_reglas_de_negocio.md` §Dominio: Stock y Alertas, §Dominio: IA
  - `knowledge-base/07_flujos_principales.md` §Flujo 2

---

### [C-08] `dashboard-frontend`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - `frontend/src/services/dashboardApi.ts`: función `getDashboard()` → `DashboardKPIs`
  - `frontend/src/hooks/useDashboard.ts`: React Query hook `useDashboard()` con `staleTime: 0` (datos en tiempo real)
  - `frontend/src/pages/Dashboard.tsx`: página principal `/`; monta 3 `KPICards`; states de loading (skeleton) y error (mensaje genérico)
  - `frontend/src/components/KPICards.tsx`: 3 cards con: "Productos totales" (azul), "Stock bajo" (amarillo), "Agotados" (rojo); animación de número
  - React Query `invalidateQueries(['dashboard'])` disparado automáticamente tras cualquier mutación de productos o movimientos
  - Navegación: `App.tsx` con React Router — `/` → Dashboard, `/products` → Products, `/movements` → StockMovements; navbar con links
- **Dependencias**: `C-05`, `C-06`
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 1
  - `knowledge-base/07_flujos_principales.md` §Flujo 4
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios §frontend

---

## FASE 5 — Infraestructura y Despliegue

> Solo se ejecuta cuando todas las funcionalidades están implementadas y testeadas.

### [C-10] `docker-cicd`
- **Estado**: `[ ]` pendiente
- **Scope**:
  - `backend/Dockerfile`: imagen Python 3.11-slim, `COPY requirements.txt`, `pip install`, `COPY app/`, `CMD uvicorn app.main:app --host 0.0.0.0 --port 8000`
  - `frontend/Dockerfile`: multi-stage — stage build (`node:20-alpine`, `npm ci`, `npm run build`), stage serve (`nginx:alpine`, copia `dist/`)
  - `docker-compose.yml`: servicios `backend` (port 8000), `frontend` (port 80), red interna; `backend` define env vars desde `.env`; `healthcheck` en backend
  - `.github/workflows/ci.yml`: trigger en `push` a cualquier branch y `pull_request` a `main`; jobs: `test-backend` (setup-python 3.11, `pip install -r requirements.txt`, `pytest --cov`) y `build-frontend` (`npm ci`, `npm run build`)
  - `README.md` actualizado con instrucciones: `docker-compose up --build`, `pytest`, acceso en `localhost:80`
- **Dependencias**: `C-01`, `C-02`, `C-03`, `C-04`, `C-05`, `C-06`, `C-07`, `C-08`, `C-09`
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/08_arquitectura_propuesta.md` §Notas de despliegue
  - `knowledge-base/08_arquitectura_propuesta.md` §Variables de entorno
  - `knowledge-base/10_preguntas_abiertas.md` (verificar si Docker es requisito obligatorio)

---

## Resumen

| Change | Nombre | Fase | Governance | Dependencias | Estado |
|--------|--------|------|------------|--------------|--------|
| C-01 | foundation-setup | 1 | BAJO | — | `[ ]` |
| C-02 | core-models-and-db | 1 | CRITICO | C-01 | `[ ]` |
| C-03 | product-crud-backend | 2 | CRITICO | C-02 | `[ ]` |
| C-04 | movement-backend | 3 | CRITICO | C-03 | `[ ]` |
| C-05 | dashboard-backend | 3 | MEDIO | C-03 | `[ ]` |
| C-06 | product-and-movement-frontend | 4 | MEDIO | C-03, C-04 | `[ ]` |
| C-07 | alerts-frontend | 4 | MEDIO | C-06, C-09 | `[ ]` |
| C-08 | dashboard-frontend | 4 | BAJO | C-05, C-06 | `[ ]` |
| C-09 | ai-recommendation | 3 | ALTO | C-04 | `[ ]` |
| C-10 | docker-cicd | 5 | ALTO | C-01..C-09 | `[ ]` |

**Total**: 10 changes en 5 fases
**Camino crítico**: 6 changes (`C-01 → C-02 → C-03 → C-04 → C-06 → C-10`)
**Gates de paralelismo**: 5
**Primer change recomendado**: `C-01` (`foundation-setup`)

Para arrancar: `/opsx:propose C-01-foundation-setup`
