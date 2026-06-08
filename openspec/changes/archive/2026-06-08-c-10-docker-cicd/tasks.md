## 1. Backend Dockerfile

- [x] 1.1 Crear `backend/Dockerfile`: FROM `python:3.11-slim`, WORKDIR `/app`, COPY `requirements.txt`, RUN `pip install --no-cache-dir -r requirements.txt`, COPY `app/ ./app/`, EXPOSE 8000, CMD `["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`

## 2. Frontend Dockerfile

- [x] 2.1 Crear `frontend/Dockerfile` — stage `build`: FROM `node:20-alpine AS build`, WORKDIR `/app`, COPY `package*.json`, RUN `npm ci`, COPY `.`, RUN `npm run build`
- [x] 2.2 Agregar stage `serve`: FROM `nginx:alpine`, COPY `--from=build /app/dist /usr/share/nginx/html`, EXPOSE 80, CMD `["nginx", "-g", "daemon off;"]`

## 3. docker-compose.yml

- [x] 3.1 Crear `docker-compose.yml` en la raíz con versión `"3.9"` y servicio `backend`: build `./backend`, ports `"8000:8000"`, env_file `.env`, networks `app-net`
- [x] 3.2 Agregar servicio `frontend` al compose: build `./frontend`, ports `"80:80"`, depends_on `backend`, networks `app-net`
- [x] 3.3 Agregar healthcheck al servicio `backend`: test `["CMD", "curl", "-f", "http://localhost:8000/docs"]`, interval `30s`, timeout `10s`, retries `3`
- [x] 3.4 Definir la red `app-net` como driver `bridge` al final del archivo

## 4. GitHub Actions CI

- [x] 4.1 Crear directorio `.github/workflows/`
- [x] 4.2 Crear `.github/workflows/ci.yml` con trigger `on: push` (todas las ramas) y `pull_request: branches: [main]`
- [x] 4.3 Agregar job `test-backend`: `runs-on: ubuntu-latest`, steps: checkout, `actions/setup-python@v5` (python-version: "3.11"), `pip install -r backend/requirements.txt`, `pytest --cov` (working-directory: backend)
- [x] 4.4 Agregar job `build-frontend`: `runs-on: ubuntu-latest`, steps: checkout, `actions/setup-node@v4` (node-version: "20"), `npm ci` (working-directory: frontend), `npm run build` (working-directory: frontend)

## 5. README.md

- [x] 5.1 Actualizar `README.md` con sección "Desarrollo local con Docker": prerequisitos (Docker 24+, Docker Compose v2), paso `cp backend/.env.example .env`, paso `docker-compose up --build`, acceso en `http://localhost:80`
- [x] 5.2 Agregar sección "Correr tests": `cd backend && pip install -r requirements.txt && pytest --cov`

## 6. Verificación

- [x] 6.1 Verificar que `docker-compose up --build` levanta ambos servicios sin errores (o correr `docker build` en ambos directorios localmente)
- [x] 6.2 Verificar que el workflow `.github/workflows/ci.yml` es YAML válido (`python -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"`)
