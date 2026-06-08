# Arquitectura Propuesta

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|--------|-------------|---------|
| Layered Architecture (Routes → Services → Repositories) | Backend completo | Separación de responsabilidades; cada capa testeable en aislamiento |
| Repository Pattern | `repositories/` | Desacopla la lógica de negocio del ORM; permite mockear la BD en tests |
| Service Layer | `services/` | Centraliza reglas de negocio; las routes son thin controllers |
| Schema (DTO) Pattern | `schemas/` con Pydantic | Validación automática de entrada/salida; desacopla modelo DB del contrato API |
| Component-based UI | Frontend con React | Reutilización; cada componente tiene responsabilidad única |
| Server State Management | React Query | Caché, revalidación y estados de loading/error sin boilerplate manual |

## Estructura de directorios

```
Sistema-de-Gestion-de-Stock-Inteligente/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── product_routes.py
│   │   │   ├── movement_routes.py
│   │   │   ├── dashboard_routes.py
│   │   │   └── ai_routes.py
│   │   ├── models/
│   │   │   ├── product.py          # SQLAlchemy model
│   │   │   └── stock_movement.py   # SQLAlchemy model
│   │   ├── schemas/
│   │   │   ├── product_schema.py   # Pydantic schemas (Create, Update, Response)
│   │   │   └── movement_schema.py
│   │   ├── repositories/
│   │   │   ├── product_repository.py
│   │   │   └── movement_repository.py
│   │   ├── services/
│   │   │   ├── product_service.py
│   │   │   ├── movement_service.py
│   │   │   ├── dashboard_service.py
│   │   │   └── ai_service.py
│   │   ├── database/
│   │   │   ├── connection.py       # Engine y Base declarativa
│   │   │   └── session.py          # Dependency injection de DB session
│   │   └── main.py                 # FastAPI app, routers, CORS, lifespan
│   ├── tests/
│   │   ├── test_product_service.py
│   │   ├── test_movement_service.py
│   │   └── test_dashboard_service.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Products.tsx
│   │   │   └── StockMovements.tsx
│   │   ├── components/
│   │   │   ├── ProductTable.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── KPICards.tsx
│   │   │   └── AlertList.tsx
│   │   ├── services/
│   │   │   ├── productApi.ts
│   │   │   ├── movementApi.ts
│   │   │   └── dashboardApi.ts
│   │   ├── hooks/
│   │   │   ├── useProducts.ts
│   │   │   └── useDashboard.ts
│   │   ├── types/
│   │   │   └── index.ts            # Interfaces TypeScript
│   │   └── App.tsx                 # Router principal (React Router)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

## Seguridad

- **Autenticación**: no implementada en v1.0 (ver RN-GL-01 en preguntas abiertas para v2.0)
- **Autorización**: no implementada en v1.0
- **Validación de input**: Pydantic v2 en todas las rutas — rechazo automático 422 ante datos inválidos
- **CORS**: configurado en `main.py` con `origins` explícitos (no `*` en producción); en dev se permite `http://localhost:5173`
- **Secrets management**: toda credencial (API Key de IA, DATABASE_URL) se gestiona via `.env` con `python-dotenv`; nunca se hardcodea

## Variables de entorno

| Variable | Descripción | Ejemplo | Sensible |
|----------|-------------|---------|----------|
| `DATABASE_URL` | URL de conexión a la BD | `sqlite:///./stock.db` (dev) / `postgresql://user:pass@host/db` (prod) | Y |
| `AI_API_KEY` | API Key del LLM (Claude o Gemini) | `sk-ant-...` | Y |
| `AI_PROVIDER` | Proveedor de IA a usar | `claude` o `gemini` | N |
| `CORS_ORIGINS` | Orígenes permitidos para CORS | `http://localhost:5173,https://app.vercel.app` | N |

## Notas de despliegue

- **Render (backend)**: detecta `Dockerfile` automáticamente; requiere `DATABASE_URL` y `AI_API_KEY` como env vars secretas en el dashboard
- **Vercel (frontend)**: deploy estático desde `/frontend`; requiere `VITE_API_URL` apuntando al backend de Render
- **CI/CD**: el workflow de GitHub Actions corre `pytest` en cada push; el deploy a Render/Vercel se dispara automáticamente en merge a `main`
