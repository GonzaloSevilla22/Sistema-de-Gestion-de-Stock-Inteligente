from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.stock_movement import StockMovement
from app.schemas.movement_schema import MovementCreate


def create(db: Session, movement_data: MovementCreate) -> StockMovement:
    movement = StockMovement(**movement_data.model_dump())
    db.add(movement)
    db.commit()
    db.refresh(movement)
    return movement


def get_all(db: Session) -> list[StockMovement]:
    return list(db.execute(select(StockMovement)).scalars().all())


def get_by_product_id(db: Session, product_id: int) -> list[StockMovement]:
    return list(
        db.execute(
            select(StockMovement).where(StockMovement.product_id == product_id)
        )
        .scalars()
        .all()
    )
