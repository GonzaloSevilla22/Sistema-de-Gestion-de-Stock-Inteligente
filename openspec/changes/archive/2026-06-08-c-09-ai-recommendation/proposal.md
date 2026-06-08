## Why

El sistema necesita una capa de inteligencia que, dado el estado actual de un producto (stock actual vs stock mínimo), genere una recomendación en lenguaje natural para el gestor de inventario. Es el diferenciador clave del TP respecto a un CRUD básico y desbloquea C-07 (alerts-frontend).

## What Changes

- Agregar `POST /ai/recommendation` — endpoint stateless que recibe datos de un producto y retorna texto libre generado por un LLM.
- Crear `backend/app/schemas/ai_schema.py` — `AIRecommendationRequest` y `AIRecommendationResponse`.
- Crear `backend/app/services/ai_service.py` — lógica de llamada al LLM con soporte para Claude (Anthropic) y Gemini (Google), seleccionable por `AI_PROVIDER` env var, con fallback predefinido si la API falla.
- Crear `backend/app/api/ai_routes.py` — router FastAPI, prefix `/ai`, sin dependencia de BD.
- Registrar el router en `main.py`.
- Agregar tests para `ai_service.py` mockeando la API externa.
- Agregar `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` y `AI_PROVIDER` a `.env.example`.

## Capabilities

### New Capabilities
- `ai-recommendation`: Endpoint `POST /ai/recommendation` — schemas, servicio AI con branching Claude/Gemini, fallback, router y tests con mock de API externa.

### Modified Capabilities
- `backend-foundation`: Se agrega el router `/ai` y tres nuevas variables de entorno (`AI_PROVIDER`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`) al bootstrap de la aplicación.

## Impact

- `backend/app/schemas/ai_schema.py` — nuevo
- `backend/app/services/ai_service.py` — nuevo; depende de `anthropic` o `google-generativeai` según proveedor
- `backend/app/api/ai_routes.py` — nuevo
- `backend/app/main.py` — registro del router `ai_router`
- `backend/requirements.txt` — agregar `anthropic` y `google-generativeai`
- `backend/.env.example` — nuevas vars `AI_PROVIDER`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`
- `backend/tests/test_ai_service.py` — nuevo; mockea `anthropic.Anthropic` / `google.generativeai`
