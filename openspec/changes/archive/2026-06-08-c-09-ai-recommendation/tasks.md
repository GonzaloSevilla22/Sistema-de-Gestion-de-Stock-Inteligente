## 1. Dependencias y configuración

- [x] 1.1 Agregar `anthropic` y `google-generativeai` a `backend/requirements.txt`
- [x] 1.2 Actualizar `backend/.env.example` — ya tenía `AI_API_KEY` y `AI_PROVIDER`; servicio adaptado para usar `AI_API_KEY` con los tres proveedores

## 2. Schemas Pydantic

- [x] 2.1 Crear `backend/app/schemas/ai_schema.py` con `AIRecommendationRequest` (`producto: str`, `stock_actual: int`, `stock_minimo: int`) y `AIRecommendationResponse` (`recomendacion: str`)

## 3. Servicio de IA

- [x] 3.1 Crear `backend/app/services/ai_service.py` con función `get_recommendation(producto: str, stock_actual: int, stock_minimo: int) -> str`
- [x] 3.2 Implementar rama Claude: leer `ANTHROPIC_API_KEY` del entorno, construir `anthropic.Anthropic` client, llamar `messages.create` con el prompt en español (máx 3 oraciones)
- [x] 3.3 Implementar rama Gemini: leer `GEMINI_API_KEY` del entorno, configurar `genai.configure(api_key=...)`, llamar `GenerativeModel("gemini-1.5-flash").generate_content(prompt)`
- [x] 3.4 Implementar selección de proveedor por `AI_PROVIDER` env var (default `"claude"`); agregar fallback que captura cualquier excepción y retorna el string predefinido

## 4. Router y registro

- [x] 4.1 Crear `backend/app/api/ai_routes.py` con `router = APIRouter(prefix="/ai", tags=["ai"])` y endpoint `POST /recommendation` que llama `ai_service.get_recommendation` sin `Depends(get_db)`
- [x] 4.2 Registrar `ai_router` en `backend/app/main.py` junto al resto de routers

## 5. Tests

- [x] 5.1 Crear `backend/tests/test_ai_service.py` con fixture o helper que inyecta un mock client
- [x] 5.2 Escribir test RED: verificar que `get_recommendation` con mock Claude retorna el texto del mock
- [x] 5.3 Escribir test RED: verificar que `get_recommendation` con mock Gemini retorna el texto del mock
- [x] 5.4 Escribir test RED: verificar que cuando el mock lanza excepción, la función retorna el string de fallback exacto
- [x] 5.5 Ejecutar `pytest backend/tests/test_ai_service.py -v` y verificar que todos los tests pasan en verde

## 6. Verificación final

- [x] 6.1 Ejecutar `pytest backend/ -v` y verificar que todos los tests (incluyendo los anteriores C-03/C-04/C-05) siguen en verde
