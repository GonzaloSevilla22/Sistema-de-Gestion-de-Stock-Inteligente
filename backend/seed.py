import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database.connection import Base, engine, SessionLocal
from app.models.product import Product  # noqa: F401 — registers model with Base
from app.models.stock_movement import StockMovement  # noqa: F401

SEED_PRODUCTS = [
    {
        "name": "Teclado Logitech K380",
        "price": 4500.00,
        "stock": 15,
        "minimum_stock": 5,
        "category": "Periféricos",
    },
    {
        "name": 'Monitor Samsung 24"',
        "price": 85000.00,
        "stock": 3,
        "minimum_stock": 5,
        "category": "Monitores",
    },
    {
        "name": "Mouse Inalámbrico",
        "price": 2800.00,
        "stock": 0,
        "minimum_stock": 3,
        "category": "Periféricos",
    },
    {
        "name": "Silla Gamer",
        "price": 45000.00,
        "stock": 8,
        "minimum_stock": 2,
        "category": "Mobiliario",
    },
]


def run_seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        count = db.query(Product).count()
        if count > 0:
            print(f"Seed ya aplicado ({count} productos existentes).")
            return

        products = [Product(**data) for data in SEED_PRODUCTS]
        db.add_all(products)
        db.commit()
        print(f"{len(products)} productos insertados correctamente.")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
