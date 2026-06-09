import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database.connection import Base, engine, SessionLocal
from app.models.product import Product  # noqa: F401
from app.models.stock_movement import StockMovement  # noqa: F401

SEED_PRODUCTS = [
    # Electrónica
    {
        "name": "Monitor Samsung 24\"",
        "description": "Monitor Full HD IPS 24 pulgadas",
        "price": 85000.00,
        "stock": 3,
        "minimum_stock": 5,
        "category": "Electrónica",
    },
    {
        "name": "Notebook Lenovo IdeaPad",
        "description": "Intel Core i5, 8GB RAM, 512GB SSD",
        "price": 420000.00,
        "stock": 5,
        "minimum_stock": 3,
        "category": "Electrónica",
    },
    {
        "name": "Tablet Samsung Galaxy Tab A8",
        "description": "10.5 pulgadas, 64GB, WiFi",
        "price": 95000.00,
        "stock": 0,
        "minimum_stock": 2,
        "category": "Electrónica",
    },
    {
        "name": "Auriculares Sony WH-1000XM4",
        "description": "Cancelación de ruido activa, Bluetooth",
        "price": 78000.00,
        "stock": 7,
        "minimum_stock": 4,
        "category": "Electrónica",
    },
    # Periféricos
    {
        "name": "Teclado Logitech K380",
        "description": "Teclado inalámbrico compacto Bluetooth",
        "price": 4500.00,
        "stock": 15,
        "minimum_stock": 5,
        "category": "Periféricos",
    },
    {
        "name": "Mouse Logitech MX Master 3",
        "description": "Mouse inalámbrico ergonómico de alta precisión",
        "price": 18000.00,
        "stock": 2,
        "minimum_stock": 5,
        "category": "Periféricos",
    },
    {
        "name": "Mouse Redragon M602",
        "description": "Mouse gaming RGB con 7200 DPI",
        "price": 5500.00,
        "stock": 0,
        "minimum_stock": 3,
        "category": "Periféricos",
    },
    {
        "name": "Webcam Logitech C920",
        "description": "Cámara HD 1080p con micrófono stereo",
        "price": 22000.00,
        "stock": 9,
        "minimum_stock": 4,
        "category": "Periféricos",
    },
    {
        "name": "Hub USB-C 7 en 1",
        "description": "HDMI, USB 3.0, SD Card, carga rápida",
        "price": 8500.00,
        "stock": 12,
        "minimum_stock": 6,
        "category": "Periféricos",
    },
    # Oficina
    {
        "name": "Resma A4 500 hojas",
        "description": "Papel bond 75g/m²",
        "price": 1800.00,
        "stock": 45,
        "minimum_stock": 20,
        "category": "Oficina",
    },
    {
        "name": "Silla Ergonómica de Oficina",
        "description": "Soporte lumbar ajustable, apoyabrazos 3D",
        "price": 62000.00,
        "stock": 4,
        "minimum_stock": 2,
        "category": "Oficina",
    },
    {
        "name": "Escritorio Regulable en Altura",
        "description": "Standing desk eléctrico 140x70cm",
        "price": 130000.00,
        "stock": 1,
        "minimum_stock": 2,
        "category": "Oficina",
    },
    {
        "name": "Organizador de Escritorio",
        "description": "Porta lápices y accesorios de bambú",
        "price": 2200.00,
        "stock": 30,
        "minimum_stock": 10,
        "category": "Oficina",
    },
    # Indumentaria
    {
        "name": "Remera Polo Talle M",
        "description": "100% algodón piqué, colores surtidos",
        "price": 3500.00,
        "stock": 28,
        "minimum_stock": 15,
        "category": "Indumentaria",
    },
    {
        "name": "Buzo Unisex Talle L",
        "description": "Frisa interior, cierre completo",
        "price": 6800.00,
        "stock": 0,
        "minimum_stock": 10,
        "category": "Indumentaria",
    },
    {
        "name": "Campera Impermeable",
        "description": "Shell técnico, costuras selladas",
        "price": 18500.00,
        "stock": 6,
        "minimum_stock": 8,
        "category": "Indumentaria",
    },
    # Accesorios
    {
        "name": "Mochila Antirrobo 25L",
        "description": "Bolsillo para notebook, puerto USB",
        "price": 12000.00,
        "stock": 11,
        "minimum_stock": 5,
        "category": "Accesorios",
    },
    {
        "name": "Botella Termos 500ml",
        "description": "Acero inoxidable, 12h frío / 6h calor",
        "price": 3200.00,
        "stock": 3,
        "minimum_stock": 8,
        "category": "Accesorios",
    },
    {
        "name": "Cargador Inalámbrico 15W",
        "description": "Compatible con Qi, carga rápida",
        "price": 4800.00,
        "stock": 18,
        "minimum_stock": 6,
        "category": "Accesorios",
    },
]

SEED_MOVEMENTS = [
    ("Monitor Samsung 24\"", "ENTRADA", 10, "Stock inicial"),
    ("Monitor Samsung 24\"", "SALIDA", 7, "Venta a cliente corporativo"),
    ("Notebook Lenovo IdeaPad", "ENTRADA", 5, "Stock inicial"),
    ("Teclado Logitech K380", "ENTRADA", 20, "Stock inicial"),
    ("Teclado Logitech K380", "SALIDA", 5, "Venta mostrador"),
    ("Mouse Logitech MX Master 3", "ENTRADA", 8, "Stock inicial"),
    ("Mouse Logitech MX Master 3", "SALIDA", 6, "Despacho pedido #1042"),
    ("Mouse Redragon M602", "ENTRADA", 5, "Stock inicial"),
    ("Mouse Redragon M602", "SALIDA", 5, "Devolución pendiente de resolución"),
    ("Resma A4 500 hojas", "ENTRADA", 60, "Compra mensual"),
    ("Resma A4 500 hojas", "SALIDA", 15, "Consumo interno"),
    ("Mochila Antirrobo 25L", "ENTRADA", 15, "Stock inicial"),
    ("Mochila Antirrobo 25L", "SALIDA", 4, "Venta online"),
    ("Webcam Logitech C920", "ENTRADA", 12, "Stock inicial"),
    ("Webcam Logitech C920", "SALIDA", 3, "Equipamiento home office"),
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
        db.flush()

        name_to_id = {p.name: p.id for p in products}

        movements = []
        for product_name, mov_type, qty, obs in SEED_MOVEMENTS:
            product_id = name_to_id.get(product_name)
            if product_id:
                movements.append(
                    StockMovement(
                        product_id=product_id,
                        type=mov_type,
                        quantity=qty,
                        observation=obs,
                    )
                )

        db.add_all(movements)
        db.commit()
        print(f"{len(products)} productos y {len(movements)} movimientos insertados.")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
