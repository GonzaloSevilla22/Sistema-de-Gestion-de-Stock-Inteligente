from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.movement_type import MovementType
from app.models.stock_movement import StockMovement
from app.repositories import movement_repository, product_repository
from app.schemas.movement_schema import MovementCreate


def create_movement(db: Session, data: MovementCreate) -> StockMovement:
    product = product_repository.get_by_id(db, data.product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if data.type == MovementType.SALIDA and product.stock < data.quantity:
        raise HTTPException(
            status_code=400,
            detail="Stock insuficiente para registrar la salida",
        )

    new_stock = (
        product.stock + data.quantity
        if data.type == MovementType.ENTRADA
        else product.stock - data.quantity
    )

    product_repository.update_stock(db, data.product_id, new_stock)
    return movement_repository.create(db, data)


def get_all_movements(db: Session) -> list[StockMovement]:
    return movement_repository.get_all(db)
