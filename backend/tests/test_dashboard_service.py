import pytest
from sqlalchemy.orm import Session

import app.models.product  # noqa: F401 — registers Product with Base
import app.models.stock_movement  # noqa: F401 — registers StockMovement with Base
from app.schemas.product_schema import ProductCreate
from app.services import dashboard_service, product_service


# ── helpers ──────────────────────────────────────────────────────────────────

def _make_product(
    db: Session,
    name: str,
    stock: int,
    minimum_stock: int,
) -> None:
    product_service.create_product(
        db,
        ProductCreate(name=name, price=10.0, stock=stock, minimum_stock=minimum_stock),
    )


# ── tests ─────────────────────────────────────────────────────────────────────

def test_dashboard_empty_db(db_session: Session) -> None:
    result = dashboard_service.get_kpis(db_session)

    assert result.total_products == 0
    assert result.low_stock_count == 0
    assert result.out_of_stock_count == 0


def test_dashboard_with_normal_products(db_session: Session) -> None:
    _make_product(db_session, "Producto A", stock=10, minimum_stock=5)
    _make_product(db_session, "Producto B", stock=20, minimum_stock=3)

    result = dashboard_service.get_kpis(db_session)

    assert result.total_products == 2
    assert result.low_stock_count == 0
    assert result.out_of_stock_count == 0


def test_dashboard_with_low_stock(db_session: Session) -> None:
    _make_product(db_session, "Crítico", stock=3, minimum_stock=10)   # stock bajo
    _make_product(db_session, "Normal", stock=15, minimum_stock=5)    # normal

    result = dashboard_service.get_kpis(db_session)

    assert result.total_products == 2
    assert result.low_stock_count == 1
    assert result.out_of_stock_count == 0


def test_dashboard_with_out_of_stock(db_session: Session) -> None:
    _make_product(db_session, "Agotado", stock=0, minimum_stock=5)
    _make_product(db_session, "Normal", stock=8, minimum_stock=5)

    result = dashboard_service.get_kpis(db_session)

    assert result.total_products == 2
    assert result.low_stock_count == 0
    assert result.out_of_stock_count == 1


def test_dashboard_mixed_states(db_session: Session) -> None:
    _make_product(db_session, "Normal",    stock=10, minimum_stock=5)
    _make_product(db_session, "Bajo",      stock=3,  minimum_stock=10)
    _make_product(db_session, "Agotado 1", stock=0,  minimum_stock=5)
    _make_product(db_session, "Agotado 2", stock=0,  minimum_stock=2)

    result = dashboard_service.get_kpis(db_session)

    assert result.total_products == 4
    assert result.low_stock_count == 1
    assert result.out_of_stock_count == 2


def test_dashboard_boundary_stock_equals_minimum(db_session: Session) -> None:
    # stock == minimum_stock → bajo (RN-ST-01: stock > 0 y stock <= minimum_stock)
    _make_product(db_session, "Borde", stock=5, minimum_stock=5)

    result = dashboard_service.get_kpis(db_session)

    assert result.low_stock_count == 1
    assert result.out_of_stock_count == 0
