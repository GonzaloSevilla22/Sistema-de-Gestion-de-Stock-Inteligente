# Sistema-de-Gestion-de-Stock-Inteligente
Sistema inteligente para gestión de inventario y control de stock desarrollado con React, FastAPI e Inteligencia Artificial.

Tecnologías
React
TypeScript
FastAPI
PostgreSQL
SQLAlchemy
Claude Code
GitHub Actions
Vercel
Render

IA Utilizada
Claude Code para generación de código
Claude para debugging
Claude para documentación
Claude para testing

---

## Desarrollo local con Docker

**Prerrequisitos**: Docker 24+ y Docker Compose v2 instalados.

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd Sistema-de-Gestion-de-Stock-Inteligente

# 2. Crear el archivo de variables de entorno
cp backend/.env.example .env
# Editar .env con tus valores (DATABASE_URL, AI_API_KEY, AI_PROVIDER, CORS_ORIGINS)

# 3. Levantar el stack completo
docker-compose up --build
```

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8000
- **Docs interactivos**: http://localhost:8000/docs

Para detener: `docker-compose down`

---

## Correr tests

```bash
cd backend
pip install -r requirements.txt
pytest --cov
```

---

## Desarrollo local sin Docker

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```
