# Descripción General

## Stack tecnológico

| Capa | Tecnologías | Versión mínima |
|------|-------------|----------------|
| Frontend | React, TypeScript, Vite | React 18, TS 5, Vite 5 |
| Estilos | TailwindCSS | v3 |
| HTTP client | Axios | v1 |
| Estado servidor | React Query (TanStack Query) | v5 |
| Backend | FastAPI | v0.110+ |
| ORM | SQLAlchemy | v2 |
| Validación | Pydantic | v2 |
| BD desarrollo | SQLite | — |
| BD producción | PostgreSQL | v15 |
| IA | Claude API o Gemini API (Free tier) | — |
| Containerización | Docker, Docker Compose | Docker 24+ |
| CI/CD | GitHub Actions | — |
| Deploy backend | Render | — |
| Deploy frontend | Vercel | — |

## Arquitectura general

```
┌──────────────────────────────────────────────────────────┐
│                        FRONTEND                           │
│  React + TS + Vite + TailwindCSS + React Query + Axios   │
│  Vercel (producción)                                      │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────▼─────────────────────────────────┐
│                        BACKEND                            │
│  FastAPI — arquitectura por capas                         │
│  Routes → Services → Repositories → Models               │
│  Render (producción)                                      │
└───────────────┬────────────────────────┬─────────────────┘
                │ SQLAlchemy ORM         │ HTTP
┌───────────────▼──────────┐  ┌──────────▼──────────────────┐
│     BASE DE DATOS         │  │      API de IA               │
│  SQLite (dev)             │  │  Claude API / Gemini Free    │
│  PostgreSQL (prod/Render) │  │  POST /ai/recommendation     │
└───────────────────────────┘  └──────────────────────────────┘
```

**Justificaciones de alto nivel**:
- Separación backend/frontend para facilitar despliegue independiente en Render + Vercel
- SQLite en desarrollo elimina dependencia de servidor de BD local
- Arquitectura por capas (Routes → Services → Repositories) permite testear cada capa en aislamiento
- React Query maneja caché y revalidación automática de datos del servidor

## Integraciones externas

| Servicio | Propósito | Tipo |
|----------|-----------|------|
| Claude API (Anthropic) | Generar recomendaciones de reposición en lenguaje natural | REST |
| Gemini API (alternativa) | Alternativa gratuita para recomendaciones de IA | REST |
| Render | Hosting backend + base de datos PostgreSQL | PaaS |
| Vercel | Hosting frontend estático | PaaS |
| GitHub Actions | CI/CD automatizado | Webhook |

## API REST — resumen de endpoints

| Recurso | Método | Ruta | Descripción |
|---------|--------|------|-------------|
| Productos | GET | `/products` | Listar todos los productos |
| Productos | GET | `/products/{id}` | Obtener producto por ID |
| Productos | POST | `/products` | Crear producto |
| Productos | PUT | `/products/{id}` | Actualizar producto |
| Productos | DELETE | `/products/{id}` | Eliminar producto |
| Movimientos | GET | `/movements` | Listar movimientos |
| Movimientos | POST | `/movements` | Registrar movimiento |
| Dashboard | GET | `/dashboard` | Obtener KPIs |
| IA | POST | `/ai/recommendation` | Obtener recomendación de reposición |
