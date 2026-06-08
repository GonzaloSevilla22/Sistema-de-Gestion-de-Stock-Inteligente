import pytest
from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session

import app.models.product  # noqa: F401 — registers Product with Base
import app.models.stock_movement  # noqa: F401 — registers StockMovement with Base
from app.models.movement_type import MovementType
from app.models.stock_movement import StockMovement
from app.schemas.product_schema import ProductCreate, ProductUpdate
from app.services import product_service


def _product(
    name: str = "Teclado",
    price: float = 100.0,
    stock: int = 10,
    minimum_stock: int = 5,
) -> ProductCreate:
    return ProductCreate(name=name, price=price, stock=stock, minimum_stock=minimum_stock)


# ---------------------------------------------------------------------------
# create_product
# ---------------------------------------------------------------------------

def test_create_product_valid(db_session: Session) -> None:
    response = product_service.create_product(db_session, _product())
    assert response.id is not None
    assert response.name == "Teclado"
    assert response.alert_status == "normal"  # 10 > 5


def test_create_product_duplicate_name(db_session: Session) -> None:
    product_service.create_product(db_session, _product(name="Mouse"))
    with pytest.raises(HTTPException) as exc_info:
        product_service.create_product(db_session, _product(name="Mouse"))
    assert exc_info.value.status_code == 409


def test_create_product_negative_price() -> None:
    with pytest.raises(ValidationError):
        ProductCreate(name="X", price=-1.0, stock=5, minimum_stock=2)


def test_create_product_negative_stock() -> None:
    with pytest.raises(ValidationError):
        ProductCreate(name="X", price=10.0, stock=-1, minimum_stock=2)


# ---------------------------------------------------------------------------
# get_all_products
# ---------------------------------------------------------------------------

def test_get_all_products_empty(db_session: Session) -> None:
    result = product_service.get_all_products(db_session)
    assert result == []


def test_get_all_products_with_items(db_session: Session) -> None:
    product_service.create_product(db_session, _product(name="A"))
    product_service.create_product(db_session, _product(name="B"))
    result = product_service.get_all_products(db_session)
    assert len(result) == 2
    assert all(hasattr(p, "alert_status") for p in result)


# ---------------------------------------------------------------------------
# get_product_by_id
# ---------------------------------------------------------------------------

def test_get_product_by_id_found(db_session: Session) -> None:
    created = product_service.create_product(db_session, _product())
    found = product_service.get_product_by_id(db_session, created.id)
    assert found.id == created.id


def test_get_product_by_id_not_found(db_session: Session) -> None:
    with pytest.raises(HTTPException) as exc_info:
        product_service.get_product_by_id(db_session, 9999)
    assert exc_info.value.status_code == 404


# ---------------------------------------------------------------------------
# update_product
# ---------------------------------------------------------------------------

def test_update_product_valid(db_session: Session) -> None:
    created = product_service.create_product(db_session, _product(name="Old"))
    updated = product_service.update_product(db_session, created.id, ProductUpdate(name="New"))
    assert updated.name == "New"


def test_update_product_not_found(db_session: Session) -> None:
    with pytest.raises(HTTPException) as exc_info:
        product_service.update_product(db_session, 9999, ProductUpdate(name="X"))
    assert exc_info.value.status_code == 404


def test_update_product_duplicate_name(db_session: Session) -> None:
    product_service.create_product(db_session, _product(name="First"))
    second = product_service.create_product(db_session, _product(name="Second"))
    with pytest.raises(HTTPException) as exc_info:
        product_service.update_product(db_session, second.id, ProductUpdate(name="First"))
    assert exc_info.value.status_code == 409


def test_update_product_same_name_allowed(db_session: Session) -> None:
    created = product_service.create_product(db_session, _product(name="Same"))
    updated = product_service.update_product(db_session, created.id, ProductUpdate(name="Same"))
    assert updated.name == "Same"


# ---------------------------------------------------------------------------
# delete_product
# ---------------------------------------------------------------------------

def test_delete_product_cascade(db_session: Session) -> None:
    created = product_service.create_product(db_session, _product())
    movement = StockMovement(product_id=created.id, type=MovementType.ENTRADA, quantity=5)
    db_session.add(movement)
    db_session.commit()
    movement_id = movement.id

    product_service.delete_product(db_session, created.id)

    with pytest.raises(HTTPException):
        product_service.get_product_by_id(db_session, created.id)

    remaining = db_session.execute(
        select(StockMovement).where(StockMovement.id == movement_id)
    ).scalar_one_or_none()
    assert remaining is None


def test_delete_product_not_found(db_session: Session) -> None:
    with pytest.raises(HTTPException) as exc_info:
        product_service.delete_product(db_session, 9999)
    assert exc_info.value.status_code == 404


# ---------------------------------------------------------------------------
# alert_status (RN-ST-01, RN-ST-02, RN-ST-03)
# ---------------------------------------------------------------------------

def test_alert_status_normal(db_session: Session) -> None:
    response = product_service.create_product(db_session, _product(stock=10, minimum_stock=5))
    assert response.alert_status == "normal"


def test_alert_status_low(db_session: Session) -> None:
    response = product_service.create_product(db_session, _product(stock=3, minimum_stock=5))
    assert response.alert_status == "low"


def test_alert_status_out_of_stock(db_session: Session) -> None:
    response = product_service.create_product(db_session, _product(stock=0, minimum_stock=5))
    assert response.alert_status == "out_of_stock"


def test_alert_status_boundary_stock_equals_minimum(db_session: Session) -> None:
    response = product_service.create_product(db_session, _product(stock=5, minimum_stock=5))
    assert response.alert_status == "low"


# ---------------------------------------------------------------------------
# count methods (used by dashboard C-05)
# ---------------------------------------------------------------------------

def test_count_methods_empty_db(db_session: Session) -> None:
    from app.repositories import product_repository
    assert product_repository.count_all(db_session) == 0
    assert product_repository.count_low_stock(db_session) == 0
    assert product_repository.count_out_of_stock(db_session) == 0


def test_count_methods_with_varied_stock(db_session: Session) -> None:
    from app.repositories import product_repository
    product_service.create_product(db_session, _product(name="Normal", stock=10, minimum_stock=5))
    product_service.create_product(db_session, _product(name="Low", stock=3, minimum_stock=5))
    product_service.create_product(db_session, _product(name="Empty", stock=0, minimum_stock=5))

    assert product_repository.count_all(db_session) == 3
    assert product_repository.count_low_stock(db_session) == 1
    assert product_repository.count_out_of_stock(db_session) == 1
