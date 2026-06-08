import logging
import os
from typing import Any

logger = logging.getLogger(__name__)

FALLBACK_MESSAGE = (
    "No se pudo generar una recomendación en este momento. "
    "Por favor, revisá el stock manualmente."
)

_PROMPT_TEMPLATE = (
    "Eres un asistente de gestión de inventario. "
    "El producto '{producto}' tiene un stock actual de {stock_actual} unidades "
    "y un stock mínimo de {stock_minimo} unidades. "
    "En no más de 3 oraciones en español, brindá una recomendación concreta "
    "sobre qué acción tomar con este producto."
)


def _call_openai(prompt: str, client: Any = None) -> str:
    if client is None:
        import openai  # noqa: PLC0415

        client = openai.OpenAI(api_key=os.environ["AI_API_KEY"])
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content


def _call_claude(prompt: str, client: Any = None) -> str:
    if client is None:
        import anthropic  # noqa: PLC0415

        client = anthropic.Anthropic(api_key=os.environ["AI_API_KEY"])
    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text


def _call_gemini(prompt: str, model: Any = None) -> str:
    if model is None:
        import google.generativeai as genai  # noqa: PLC0415

        genai.configure(api_key=os.environ["AI_API_KEY"])
        model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text


def get_recommendation(
    producto: str,
    stock_actual: int,
    stock_minimo: int,
    *,
    provider: str | None = None,
    client: Any = None,
) -> str:
    prompt = _PROMPT_TEMPLATE.format(
        producto=producto,
        stock_actual=stock_actual,
        stock_minimo=stock_minimo,
    )
    active_provider = provider or os.getenv("AI_PROVIDER", "claude").lower()
    try:
        if active_provider == "gemini":
            return _call_gemini(prompt, model=client)
        if active_provider == "openai":
            return _call_openai(prompt, client=client)
        return _call_claude(prompt, client=client)
    except Exception:
        logger.exception("AI provider '%s' failed; returning fallback", active_provider)
        return FALLBACK_MESSAGE
