# StockIQ — Sistema de Gestión de Stock Inteligente

> Trabajo Práctico Integrador · Gestión de inventario con asistente de IA

[![CI](https://github.com/GonzaloSevilla22/Sistema-de-Gestion-de-Stock-Inteligente/actions/workflows/ci.yml/badge.svg)](https://github.com/GonzaloSevilla22/Sistema-de-Gestion-de-Stock-Inteligente/actions/workflows/ci.yml)
[![Deploy](https://github.com/GonzaloSevilla22/Sistema-de-Gestion-de-Stock-Inteligente/actions/workflows/build-and-deploy.yml/badge.svg)](https://github.com/GonzaloSevilla22/Sistema-de-Gestion-de-Stock-Inteligente/actions/workflows/build-and-deploy.yml)

---

## Descripción

**StockIQ** es una aplicación web fullstack para la gestión inteligente de inventario. Permite registrar productos, controlar movimientos de stock, visualizar alertas y obtener recomendaciones de reposición mediante inteligencia artificial.

---

## Demo

| Capa | URL |
|------|-----|
| Frontend | https://frontend-opal-three-77.vercel.app |
| Backend API | https://stockiq-backend-ezn9.onrender.com |
| Health check | https://stockiq-backend-ezn9.onrender.com/health |

> El backend corre en Render free tier — puede tardar ~30 segundos en responder tras un período de inactividad.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite 5 |
| Estilos | TailwindCSS v3 |
| Estado servidor | TanStack Query v5 |
| HTTP client | Axios |
| Backend | FastAPI 0.115 |
| ORM | SQLAlchemy 2.0 |
| Validación | Pydantic v2 |
| BD desarrollo | SQLite |
| BD producción | PostgreSQL 18 (Render) |
| IA | Claude API (Anthropic) |
| Deploy frontend | Vercel |
| Deploy backend | Render |
| CI/CD | GitHub Actions |

---

## Funcionalidades

- **Dashboard** — KPIs en tiempo real: total de productos, stock bajo, agotados y valor estimado del inventario. Paneles visuales de estado por categoría.
- **Productos** — CRUD completo con búsqueda, badges de estado (Disponible / Stock Bajo / Agotado) y alertas automáticas.
- **Movimientos de Stock** — Registro de entradas y salidas con historial ordenado.
- **Alertas** — Panel dedicado con filtros por tipo de alerta y acceso rápido al asistente IA.
- **Asistente IA** — Recomendaciones de reposición generadas por ChatGPT (OpenIA) para productos con stock crítico.

---

## Estructura del proyecto

```
├── backend/                  # API FastAPI
│   ├── app/
│   │   ├── api/              # Rutas REST
│   │   ├── models/           # Modelos SQLAlchemy
│   │   ├── repositories/     # Capa de acceso a datos
│   │   ├── schemas/          # Schemas Pydantic
│   │   ├── services/         # Lógica de negocio + IA
│   │   └── database/         # Conexión y sesión DB
│   ├── tests/                # Tests con pytest + SQLite in-memory
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # App React
│   ├── src/
│   │   ├── pages/            # Dashboard, Products, Movements, Alerts, AI
│   │   ├── components/       # KpiCard, ProductTable, Forms, Modals
│   │   ├── hooks/            # React Query hooks
│   │   ├── services/         # Clientes Axios
│   │   └── types/            # Tipos TypeScript
│   └── package.json
├── .github/workflows/        # CI + Deploy automático
└── render.yaml               # Config de Render
```

---

## Correr localmente

### Requisitos
- Python 3.11+
- Node.js 20+

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Correr el servidor
uvicorn app.main:app --reload
```

El backend queda disponible en `http://localhost:8000`.  
Documentación interactiva: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173`.

---

## Variables de entorno

### Backend (`.env`)

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | Conexión a la base de datos | `sqlite:///./stock.db` |
| `AI_PROVIDER` | Proveedor de IA (`claude` / `openai` / `gemini`) | `claude` |
| `AI_API_KEY` | API key del proveedor de IA | — |
| `CORS_ORIGINS` | Orígenes permitidos para CORS | `http://localhost:5173` |

### Frontend (`.env`)

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base del backend |

---

## Tests

```bash
cd backend
pytest --cov
```

Los tests usan SQLite in-memory — no requieren base de datos real ni mocks de red.

---

## API — Endpoints principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Estado del servicio |
| `GET` | `/products` | Listar productos |
| `POST` | `/products` | Crear producto |
| `PUT` | `/products/{id}` | Actualizar producto |
| `DELETE` | `/products/{id}` | Eliminar producto |
| `GET` | `/movements` | Listar movimientos |
| `POST` | `/movements` | Registrar movimiento |
| `GET` | `/dashboard` | KPIs del dashboard |
| `POST` | `/ai/recommendation` | Recomendación IA |

---

## CI/CD

Cada push a `main` ejecuta:

1. **CI** — Tests de backend con cobertura + build del frontend
2. **Deploy** — Build y deploy automático a Vercel (frontend)

El backend se redeploya automáticamente en Render con cada push.

---

## Correr con Docker

```bash
cp backend/.env.example .env
# Editar .env con tus valores

docker-compose up --build
```

- Frontend: `http://localhost:80`
- Backend: `http://localhost:8000`

---

## Informe Técnico

La experiencia de desarrollo con IA está documentada en [`INFORME_TECNICO.md`](./INFORME_TECNICO.md): herramientas utilizadas, metodología, debugging en producción y lecciones aprendidas.

---

## Autores

**Gonzalo Sevilla** **Lucas Norton** **Lorenzo Espetxe** **Geronimo Guevara** · TP Integrador
