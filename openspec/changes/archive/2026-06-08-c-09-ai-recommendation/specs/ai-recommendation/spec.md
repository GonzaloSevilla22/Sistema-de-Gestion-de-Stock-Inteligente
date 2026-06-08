## ADDED Requirements

### Requirement: AI recommendation request and response schemas
The system SHALL provide Pydantic v2 schemas `AIRecommendationRequest` and `AIRecommendationResponse` in `backend/app/schemas/ai_schema.py`.

`AIRecommendationRequest` SHALL have:
- `producto: str` — product name
- `stock_actual: int` — current stock (>= 0)
- `stock_minimo: int` — minimum stock threshold (>= 0)

`AIRecommendationResponse` SHALL have:
- `recomendacion: str` — free-text recommendation in Spanish

#### Scenario: Valid request schema is accepted
- **WHEN** a request body `{ "producto": "Harina", "stock_actual": 5, "stock_minimo": 10 }` is parsed
- **THEN** `AIRecommendationRequest` validates successfully with all three fields populated

#### Scenario: Missing field raises validation error
- **WHEN** a request body omits `producto`
- **THEN** Pydantic raises a validation error (HTTP 422)

### Requirement: AI service generates recommendation via LLM
The system SHALL provide `ai_service.get_recommendation(producto, stock_actual, stock_minimo)` in `backend/app/services/ai_service.py` that calls the configured LLM and returns a Spanish natural-language recommendation string.

The service SHALL read `AI_PROVIDER` from the environment (`"claude"`, `"gemini"`, or `"openai"`, default `"claude"`) to select the active provider. The service SHALL read `AI_API_KEY` for all providers — never hardcoded.

#### Scenario: Claude provider returns recommendation
- **WHEN** `AI_PROVIDER=claude`, `AI_API_KEY` is set, and the Anthropic API responds successfully
- **THEN** `get_recommendation` returns a non-empty string in Spanish

#### Scenario: Gemini provider returns recommendation
- **WHEN** `AI_PROVIDER=gemini`, `AI_API_KEY` is set, and the Gemini API responds successfully
- **THEN** `get_recommendation` returns a non-empty string in Spanish

#### Scenario: OpenAI provider returns recommendation
- **WHEN** `AI_PROVIDER=openai`, `AI_API_KEY` is set, and the OpenAI API responds successfully
- **THEN** `get_recommendation` returns a non-empty string in Spanish

#### Scenario: Fallback when LLM API is unavailable
- **WHEN** the LLM API raises any exception (network error, auth error, rate limit)
- **THEN** `get_recommendation` returns the predefined fallback string `"No se pudo generar una recomendación en este momento. Por favor, revisá el stock manualmente."` without raising an exception

### Requirement: POST /ai/recommendation endpoint
The system SHALL expose `POST /ai/recommendation` under the `/ai` prefix that calls `ai_service.get_recommendation` and returns an `AIRecommendationResponse`. The endpoint SHALL NOT access the database.

#### Scenario: Successful recommendation request
- **WHEN** `POST /ai/recommendation` is called with a valid body and the LLM responds
- **THEN** the response is HTTP 200 with `{ "recomendacion": "<text>" }` where text is non-empty

#### Scenario: Fallback response on LLM failure
- **WHEN** `POST /ai/recommendation` is called but the LLM API is unavailable
- **THEN** the response is HTTP 200 with `{ "recomendacion": "No se pudo generar una recomendación en este momento. Por favor, revisá el stock manualmente." }`

#### Scenario: Invalid request body returns 422
- **WHEN** `POST /ai/recommendation` is called with a body missing required fields
- **THEN** the response is HTTP 422 with validation error details

### Requirement: AI service tests mock the external API
The system SHALL provide `backend/tests/test_ai_service.py` that tests `get_recommendation` by injecting mock LLM clients — never calling the real API.

#### Scenario: Test verifies Claude path with mock client
- **WHEN** `get_recommendation` is called with a mock Anthropic client that returns a fixed message
- **THEN** the function returns the mocked message

#### Scenario: Test verifies Gemini path with mock client
- **WHEN** `get_recommendation` is called with a mock Gemini model that returns a fixed response
- **THEN** the function returns the mocked message

#### Scenario: Test verifies fallback on exception
- **WHEN** `get_recommendation` is called with a mock client that raises an exception
- **THEN** the function returns the predefined fallback string without raising
