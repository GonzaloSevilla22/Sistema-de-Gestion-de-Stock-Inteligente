## Context

El backend (C-01→C-04) ya tiene la arquitectura de capas (router → service → repository). El servicio de IA es distinto: es stateless, sin acceso a BD, y delega a una API externa. La decisión de arquitectura DD-02 establece que el proveedor es configurable via `AI_PROVIDER` env var (`claude` | `gemini`). Las reglas RN-AI-01→05 definen el contrato exacto.

## Goals / Non-Goals

**Goals:**
- Exponer `POST /ai/recommendation` que llama al LLM y retorna texto libre.
- Soportar Claude (Anthropic SDK) y Gemini (google-generativeai) sin cambiar código.
- Retornar mensaje de fallback si la API externa falla (no propagar 500 al cliente).
- Tests unitarios que mockean la API externa (nunca llaman a la red).

**Non-Goals:**
- Persistir recomendaciones en BD (explícitamente fuera de scope: RN-AI-05).
- Streaming de respuesta (texto completo en una sola respuesta).
- Rate limiting o caché de respuestas.
- Implementar C-07 (UI de alertas que consume este endpoint).

## Decisions

### D-01: Branching por proveedor en ai_service, no en router
`ai_service.get_recommendation()` lee `AI_PROVIDER` del entorno y selecciona la implementación (Claude o Gemini) internamente. El router no sabe qué proveedor está activo. Alternativa descartada: dos endpoints separados (complejidad innecesaria de routing).

### D-02: Función pura con parámetros inyectables para facilitar tests
`ai_service.get_recommendation(producto, stock_actual, stock_minimo, provider=None, client=None)` acepta provider y client opcionales. En producción se resuelven del entorno; en tests se inyectan mocks. Alternativa descartada: `unittest.mock.patch` en los tests (funciona pero hace los tests más frágiles a cambios de nombre de módulo).

### D-03: Fallback explícito, no re-raise
Si la llamada al LLM lanza cualquier excepción, `ai_service` captura el error, lo loguea, y retorna el string de fallback `"No se pudo generar una recomendación en este momento. Por favor, revisá el stock manualmente."`. El router retorna HTTP 200 con ese texto (no 500, per RN-AI-03). Alternativa descartada: retornar 503 — añade complejidad al cliente sin beneficio real.

### D-04: Dependencias opcionales en requirements.txt
Agregar `anthropic` y `google-generativeai` a `requirements.txt`. Aunque solo se usa uno según `AI_PROVIDER`, es más simple instalar ambos que hacer instalación condicional. Alternativa descartada: `requirements-claude.txt` + `requirements-gemini.txt` (over-engineering para el scope académico).

### D-05: Prompt estructurado pero mínimo
El prompt al LLM incluye nombre, stock actual, mínimo y pide una recomendación concisa en español (máx 3 oraciones). No incluye historial de movimientos ni contexto adicional en v1.0.

## Risks / Trade-offs

- [Risk] La API de IA puede no estar disponible durante la presentación → Mitigation: fallback explícito (D-03) + mock para demo offline.
- [Risk] `anthropic` y `google-generativeai` son dependencias pesadas → Trade-off aceptado: el scope universitario no justifica instalación selectiva.
- [Trade-off] El proveedor se lee del entorno en cada llamada → simple pero levemente ineficiente; aceptable dado el volumen bajo de requests.
