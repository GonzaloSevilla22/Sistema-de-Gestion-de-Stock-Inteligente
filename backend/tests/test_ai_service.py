from unittest.mock import MagicMock

from app.services.ai_service import FALLBACK_MESSAGE, get_recommendation


# ── helpers ──────────────────────────────────────────────────────────────────

def _make_claude_client(text: str) -> MagicMock:
    """Return a mock that mimics anthropic.Anthropic().messages.create()."""
    content_block = MagicMock()
    content_block.text = text
    message = MagicMock()
    message.content = [content_block]
    client = MagicMock()
    client.messages.create.return_value = message
    return client


def _make_openai_client(text: str) -> MagicMock:
    """Return a mock that mimics openai.OpenAI().chat.completions.create()."""
    message = MagicMock()
    message.content = text
    choice = MagicMock()
    choice.message = message
    response = MagicMock()
    response.choices = [choice]
    client = MagicMock()
    client.chat.completions.create.return_value = response
    return client


def _make_gemini_model(text: str) -> MagicMock:
    """Return a mock that mimics google.generativeai.GenerativeModel()."""
    response = MagicMock()
    response.text = text
    model = MagicMock()
    model.generate_content.return_value = response
    return model


# ── tests ─────────────────────────────────────────────────────────────────────

def test_get_recommendation_claude_returns_mock_text() -> None:
    client = _make_claude_client("Recomendación de prueba Claude.")
    result = get_recommendation(
        producto="Harina",
        stock_actual=5,
        stock_minimo=10,
        provider="claude",
        client=client,
    )
    assert result == "Recomendación de prueba Claude."
    client.messages.create.assert_called_once()


def test_get_recommendation_gemini_returns_mock_text() -> None:
    model = _make_gemini_model("Recomendación de prueba Gemini.")
    result = get_recommendation(
        producto="Arroz",
        stock_actual=0,
        stock_minimo=20,
        provider="gemini",
        client=model,
    )
    assert result == "Recomendación de prueba Gemini."
    model.generate_content.assert_called_once()


def test_get_recommendation_openai_returns_mock_text() -> None:
    client = _make_openai_client("Recomendación de prueba OpenAI.")
    result = get_recommendation(
        producto="Aceite",
        stock_actual=3,
        stock_minimo=8,
        provider="openai",
        client=client,
    )
    assert result == "Recomendación de prueba OpenAI."
    client.chat.completions.create.assert_called_once()


def test_get_recommendation_openai_fallback_on_exception() -> None:
    client = MagicMock()
    client.chat.completions.create.side_effect = RuntimeError("quota exceeded")
    result = get_recommendation(
        producto="Leche",
        stock_actual=0,
        stock_minimo=10,
        provider="openai",
        client=client,
    )
    assert result == FALLBACK_MESSAGE


def test_get_recommendation_fallback_on_exception() -> None:
    client = MagicMock()
    client.messages.create.side_effect = RuntimeError("API down")
    result = get_recommendation(
        producto="Sal",
        stock_actual=2,
        stock_minimo=5,
        provider="claude",
        client=client,
    )
    assert result == FALLBACK_MESSAGE


def test_get_recommendation_gemini_fallback_on_exception() -> None:
    model = MagicMock()
    model.generate_content.side_effect = ConnectionError("timeout")
    result = get_recommendation(
        producto="Azúcar",
        stock_actual=1,
        stock_minimo=15,
        provider="gemini",
        client=model,
    )
    assert result == FALLBACK_MESSAGE
