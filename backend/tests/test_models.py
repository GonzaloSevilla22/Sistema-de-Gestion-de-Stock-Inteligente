import pytest
from pydantic import ValidationError
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

import app.models.product  # noqa: F401 — ensures Product is registered with Base
import app.models.stock_movement  # noqa: F401 — ensures StockMovement is registered with Base
from app.database.connection import Base
from app.models.movement_type import MovementType
from app.models.product import Product
from app.models.stock_movement import StockMovement
from app.schemas.movement_schema import MovementCreate
from app.schemas.product_schema import ProductCreate


@pytest.fixture
def engine():
    eng = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=eng)
    yield eng
    Base.metadata.drop_all(bind=eng)


@pytest.fixture
def session(engine) -> Session:
    SessionLocal = sessionmaker(bind=engine)
    sess = SessionLocal()
    try:
        yield sess
    finally:
        sess.close()


# --- Model persistence tests ---

def test_product_persists_with_required_fields(session: Session) -> None:
    product = Product(name="Teclado", price=4500.00, stock=15, minimum_stock=5)
    session.add(product)
    session.commit()
    session.refresh(product)

    assert product.id is not None
    assert product.created_at is not None
    assert product.name == "Teclado"


def test_product_optional_fields_default_to_none(session: Session) -> None:
    product = Product(name="Mouse", price=1000.00, stock=5, minimum_stock=2)
    session.add(product)
    session.commit()

    assert product.description is None
    assert product.category is None


def test_cascade_delete_removes_movements(session: Session) -> None:
    product = Product(name="Monitor", price=80000.00, stock=3, minimum_stock=5)
    session.add(product)
    session.flush()

    movement = StockMovement(
        product_id=product.id,
        type=MovementType.ENTRADA,
        quantity=3,
    )
    session.add(movement)
    session.commit()
    movement_id = movement.id

    session.delete(product)
    session.commit()

    remaining = session.get(StockMovement, movement_id)
    assert remaining is None


def test_cascade_delete_via_sql(engine) -> None:
    SessionLocal = sessionmaker(bind=engine)
    sess = SessionLocal()
    try:
        product = Product(name="Silla", price=45000.00, stock=8, minimum_stock=2)
        sess.add(product)
        sess.flush()
        product_id = product.id

        movement = StockMovement(
            product_id=product_id,
            type=MovementType.SALIDA,
            quantity=1,
        )
        sess.add(movement)
        sess.commit()

        sess.execute(text("PRAGMA foreign_keys = ON"))
        sess.execute(text(f"DELETE FROM product WHERE id = {product_id}"))
        sess.commit()

        result = sess.execute(
            text(f"SELECT COUNT(*) FROM stock_movement WHERE product_id = {product_id}")
        ).scalar()
        assert result == 0
    finally:
        sess.close()


# --- Schema validation tests ---

def test_movement_create_rejects_zero_quantity() -> None:
    with pytest.raises(ValidationError):
        MovementCreate(product_id=1, type=MovementType.SALIDA, quantity=0)


def test_movement_create_rejects_negative_quantity() -> None:
    with pytest.raises(ValidationError):
        MovementCreate(product_id=1, type=MovementType.ENTRADA, quantity=-5)


def test_movement_create_rejects_invalid_type() -> None:
    with pytest.raises(ValidationError):
        MovementCreate(product_id=1, type="INVALIDO", quantity=5)  # type: ignore[arg-type]


def test_product_create_rejects_negative_price() -> None:
    with pytest.raises(ValidationError):
        ProductCreate(name="X", price=-1.0, stock=5, minimum_stock=2)


def test_movement_create_valid_entrada() -> None:
    mv = MovementCreate(product_id=1, type=MovementType.ENTRADA, quantity=10)
    assert mv.type == MovementType.ENTRADA
    assert mv.observation is None


def test_movement_create_valid_salida() -> None:
    mv = MovementCreate(product_id=1, type="SALIDA", quantity=3)
    assert mv.type == MovementType.SALIDA


def test_product_create_valid_minimal() -> None:
    p = ProductCreate(name="Mesa", price=0.0, stock=0, minimum_stock=0)
    assert p.description is None
    assert p.category is None
