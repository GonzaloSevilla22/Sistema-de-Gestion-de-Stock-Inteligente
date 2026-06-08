import pytest
from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session

import app.models.product  # noqa: F401 — registers Product with Base
import app.models.stock_movement  # noqa: F401 — registers StockMovement with Base
from app.models.movement_type import MovementType
from app.models.stock_movement import StockMovement
from app.schemas.movement_schema import MovementCreate
from app.schemas.product_schema import ProductCreate
from app.services import movement_service, product_service


def _create_product(db: Session, name: str = "Laptop", stock: int = 20) -> object:
    data = ProductCreate(name=name, price=999.0, stock=stock, minimum_stock=5)
    return product_service.create_product(db, data)


def _movement(
    product_id: int,
    movement_type: MovementType = MovementType.ENTRADA,
    quantity: int = 5,
    observation: str | None = None,
) -> MovementCreate:
    return MovementCreate(
        product_id=product_id,
        type=movement_type,
        quantity=quantity,
        observation=observation,
    )


# ---------------------------------------------------------------------------
# create_movement — happy paths
# ---------------------------------------------------------------------------

def test_entrada_increments_stock(db_session: Session) -> None:
    product = _create_product(db_session, stock=20)
    movement_service.create_movement(db_session, _movement(product.id, MovementType.ENTRADA, 10))
    updated = product_service.get_product_by_id(db_session, product.id)
    assert updated.stock == 30  # 20 + 10


def test_salida_decrements_stock(db_session: Session) -> None:
    product = _create_product(db_session, stock=20)
    movement_service.create_movement(db_session, _movement(product.id, MovementType.SALIDA, 5))
    updated = product_service.get_product_by_id(db_session, product.id)
    assert updated.stock == 15  # 20 - 5


def test_create_movement_returns_movement_object(db_session: Session) -> None:
    product = _create_product(db_session)
    result = movement_service.create_movement(db_session, _movement(product.id))
    assert result.id is not None
    assert result.product_id == product.id
    assert result.type == MovementType.ENTRADA


# ---------------------------------------------------------------------------
# create_movement — error paths
# ---------------------------------------------------------------------------

def test_salida_insufficient_stock_raises_400(db_session: Session) -> None:
    product = _create_product(db_session, stock=5)
    with pytest.raises(HTTPException) as exc_info:
        movement_service.create_movement(db_session, _movement(product.id, MovementType.SALIDA, 10))
    assert exc_info.value.status_code == 400

    # stock must NOT have changed
    unchanged = product_service.get_product_by_id(db_session, product.id)
    assert unchanged.stock == 5

    # movement must NOT have been persisted
    remaining = db_session.execute(
        select(StockMovement).where(StockMovement.product_id == product.id)
    ).scalars().all()
    assert len(remaining) == 0


def test_nonexistent_product_raises_404(db_session: Session) -> None:
    with pytest.raises(HTTPException) as exc_info:
        movement_service.create_movement(db_session, _movement(9999))
    assert exc_info.value.status_code == 404


def test_invalid_type_raises_validation_error() -> None:
    with pytest.raises(ValidationError):
        MovementCreate(product_id=1, type="OTRO", quantity=5)


def test_zero_quantity_raises_validation_error() -> None:
    with pytest.raises(ValidationError):
        MovementCreate(product_id=1, type=MovementType.ENTRADA, quantity=0)


def test_negative_quantity_raises_validation_error() -> None:
    with pytest.raises(ValidationError):
        MovementCreate(product_id=1, type=MovementType.ENTRADA, quantity=-3)


# ---------------------------------------------------------------------------
# get_all_movements
# ---------------------------------------------------------------------------

def test_get_all_movements_empty(db_session: Session) -> None:
    result = movement_service.get_all_movements(db_session)
    assert result == []


def test_get_all_movements_returns_all(db_session: Session) -> None:
    product = _create_product(db_session)
    movement_service.create_movement(db_session, _movement(product.id, MovementType.ENTRADA, 10))
    movement_service.create_movement(db_session, _movement(product.id, MovementType.SALIDA, 3))
    result = movement_service.get_all_movements(db_session)
    assert len(result) == 2


# ---------------------------------------------------------------------------
# RN-MV-06: date is server-assigned, not client-provided
# ---------------------------------------------------------------------------

def test_movement_date_is_server_assigned(db_session: Session) -> None:
    product = _create_product(db_session)
    data = _movement(product.id)
    # MovementCreate must not expose a 'date' field
    assert not hasattr(data, "date")
    movement = movement_service.create_movement(db_session, data)
    assert movement.date is not None
