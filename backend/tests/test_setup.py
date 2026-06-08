from app.main import app


def test_app_is_configured() -> None:
    assert app.title == "Sistema de Gestión de Stock Inteligente"
