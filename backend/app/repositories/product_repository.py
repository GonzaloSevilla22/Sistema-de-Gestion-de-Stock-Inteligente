from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product_schema import ProductCreate, ProductUpdate


def create(db: Session, product_data: ProductCreate) -> Product:
    product = Product(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_by_id(db: Session, product_id: int) -> Product | None:
    return db.get(Product, product_id)


def get_all(db: Session) -> list[Product]:
    return list(db.execute(select(Product)).scalars().all())


def update(db: Session, product_id: int, update_data: ProductUpdate) -> Product | None:
    product = db.get(Product, product_id)
    if product is None:
        return None
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


def delete(db: Session, product_id: int) -> bool:
    product = db.get(Product, product_id)
    if product is None:
        return False
    db.delete(product)
    db.commit()
    return True


def get_by_name(db: Session, name: str) -> Product | None:
    return db.execute(
        select(Product).where(Product.name == name)
    ).scalar_one_or_none()


def count_all(db: Session) -> int:
    return db.execute(select(func.count()).select_from(Product)).scalar_one()


def count_low_stock(db: Session) -> int:
    return db.execute(
        select(func.count()).select_from(Product).where(
            Product.stock > 0, Product.stock <= Product.minimum_stock
        )
    ).scalar_one()


def count_out_of_stock(db: Session) -> int:
    return db.execute(
        select(func.count()).select_from(Product).where(Product.stock == 0)
    ).scalar_one()


def update_stock(db: Session, product_id: int, new_stock: int) -> Product | None:
    product = db.get(Product, product_id)
    if product is None:
        return None
    product.stock = new_stock
    db.commit()
    db.refresh(product)
    return product
