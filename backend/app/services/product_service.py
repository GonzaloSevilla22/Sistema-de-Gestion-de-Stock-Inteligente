from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories import product_repository
from app.schemas.product_schema import ProductCreate, ProductResponse, ProductUpdate


def _calculate_alert_status(stock: int, minimum_stock: int) -> str:
    if stock == 0:
        return "out_of_stock"
    if stock <= minimum_stock:
        return "low"
    return "normal"


def _to_response(product: object) -> ProductResponse:
    base = ProductResponse.model_validate(product)
    return base.model_copy(
        update={"alert_status": _calculate_alert_status(base.stock, base.minimum_stock)}
    )


def create_product(db: Session, data: ProductCreate) -> ProductResponse:
    existing = product_repository.get_by_name(db, data.name)
    if existing is not None:
        raise HTTPException(status_code=409, detail="Ya existe un producto con ese nombre")
    product = product_repository.create(db, data)
    return _to_response(product)


def get_all_products(db: Session) -> list[ProductResponse]:
    return [_to_response(p) for p in product_repository.get_all(db)]


def get_product_by_id(db: Session, product_id: int) -> ProductResponse:
    product = product_repository.get_by_id(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return _to_response(product)


def update_product(db: Session, product_id: int, data: ProductUpdate) -> ProductResponse:
    if data.name is not None:
        existing = product_repository.get_by_name(db, data.name)
        if existing is not None and existing.id != product_id:
            raise HTTPException(status_code=409, detail="Ya existe un producto con ese nombre")
    product = product_repository.update(db, product_id, data)
    if product is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return _to_response(product)


def delete_product(db: Session, product_id: int) -> None:
    deleted = product_repository.delete(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
