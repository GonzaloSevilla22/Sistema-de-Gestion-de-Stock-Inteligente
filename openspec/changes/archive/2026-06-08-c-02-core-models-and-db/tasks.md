## 1. MovementType Enum

- [x] 1.1 Crear `backend/app/models/__init__.py` vacío (hace el directorio un paquete Python)
- [x] 1.2 Crear `backend/app/schemas/__init__.py` vacío
- [x] 1.3 Crear `backend/app/models/movement_type.py` con el `Enum` Python `MovementType` — valores `ENTRADA = "ENTRADA"` y `SALIDA = "SALIDA"`

## 2. Modelo Product

- [x] 2.1 Crear `backend/app/models/product.py` — modelo SQLAlchemy 2.0 `Product` con campos: `id` (`Mapped[int]`, PK autoincrement), `name` (`Mapped[str]`, VARCHAR(255) NOT NULL), `description` (`Mapped[Optional[str]]`, TEXT), `price` (`Mapped[Decimal]`, NUMERIC(10,2) NOT NULL), `stock` (`Mapped[int]`, INTEGER NOT NULL), `minimum_stock` (`Mapped[int]`, INTEGER NOT NULL), `category` (`Mapped[Optional[str]]`, VARCHAR(100)), `created_at` (`Mapped[datetime]`, NOT NULL, default `datetime.utcnow`)
- [x] 2.2 Agregar índices `idx_product_category` (sobre `category`) e `idx_product_stock` (sobre `stock`) al modelo `Product`
- [x] 2.3 Declarar la relación `movements: Mapped[list["StockMovement"]]` con `cascade="all, delete-orphan"` y `back_populates="product"`

## 3. Modelo StockMovement

- [x] 3.1 Crear `backend/app/models/stock_movement.py` — modelo SQLAlchemy 2.0 `StockMovement` con campos: `id` (PK autoincrement), `product_id` (`Mapped[int]`, FK → `product.id`, NOT NULL, `ondelete="CASCADE"`), `type` (`Mapped[MovementType]`, VARCHAR(10) NOT NULL), `quantity` (`Mapped[int]`, INTEGER NOT NULL), `date` (`Mapped[datetime]`, NOT NULL, default `datetime.utcnow`), `observation` (`Mapped[Optional[str]]`, TEXT)
- [x] 3.2 Agregar índices `idx_movement_product` (sobre `product_id`) e `idx_movement_date` (sobre `date`) al modelo `StockMovement`
- [x] 3.3 Declarar `product: Mapped["Product"]` con `back_populates="movements"` en `StockMovement`

## 4. Schemas Pydantic — Productos

- [x] 4.1 Crear `backend/app/schemas/product_schema.py` con `ProductCreate` — campos: `name: str`, `description: str | None = None`, `price: float` (≥ 0, validador `Field(ge=0)`), `stock: int` (≥ 0, `Field(ge=0)`), `minimum_stock: int` (≥ 0, `Field(ge=0)`), `category: str | None = None`
- [x] 4.2 Agregar `ProductUpdate` a `product_schema.py` — todos los campos opcionales: `name: str | None = None`, `description: str | None = None`, `price: float | None = None`, `stock: int | None = None`, `minimum_stock: int | None = None`, `category: str | None = None`
- [x] 4.3 Agregar `ProductResponse` a `product_schema.py` con todos los campos de `ProductCreate` más `id: int` y `created_at: datetime`; usar `model_config = ConfigDict(from_attributes=True)`

## 5. Schemas Pydantic — Movimientos

- [x] 5.1 Crear `backend/app/schemas/movement_schema.py` con `MovementCreate` — campos: `product_id: int`, `type: MovementType`, `quantity: int` (> 0, `Field(gt=0)`), `observation: str | None = None`; importar `MovementType` desde `models.movement_type`
- [x] 5.2 Agregar `MovementResponse` a `movement_schema.py` con campos: `id: int`, `product_id: int`, `type: str`, `quantity: int`, `date: datetime`, `observation: str | None`; `model_config = ConfigDict(from_attributes=True)`

## 6. Seed Script

- [x] 6.1 Crear `backend/seed.py` — script independiente que crea la sesión de BD, verifica si ya hay productos (`SELECT COUNT(*)`), y si la BD está vacía inserta los 4 productos de ejemplo (Teclado Logitech K380 stock=15 min=5, Monitor Samsung 24" stock=3 min=5, Mouse Inalámbrico stock=0 min=3, Silla Gamer stock=8 min=2)
- [x] 6.2 El script debe mostrar en consola el resultado: cuántos productos se insertaron o un mensaje "Seed ya aplicado" si la BD tenía datos

## 7. Registro de Modelos en Base

- [x] 7.1 Verificar que `backend/app/database/connection.py` (creado en C-01) importa `Base` desde `sqlalchemy.orm` y que los modelos `Product` y `StockMovement` son importados en `backend/app/main.py` (o en `connection.py`) ANTES de llamar `Base.metadata.create_all()`, para que las tablas se creen al arrancar

## 8. Tests de Modelos

- [x] 8.1 Crear `backend/tests/test_models.py` — fixture `engine` con SQLite in-memory (`create_engine("sqlite:///:memory:")`) y `Base.metadata.create_all(engine)`
- [x] 8.2 Test: crear un `Product` con todos los campos requeridos y verificar que se persiste correctamente (id asignado, `created_at` no nulo)
- [x] 8.3 Test: crear un `Product` con campos opcionales en `None` y verificar que no lanza error
- [x] 8.4 Test: crear un `Product` con un `StockMovement` asociado, eliminar el `Product` vía ORM y verificar que el `StockMovement` también fue eliminado (CASCADE DELETE)
- [x] 8.5 Test: crear `MovementCreate` con `quantity=0` y verificar que Pydantic lanza `ValidationError`
- [x] 8.6 Test: crear `MovementCreate` con `type="INVALIDO"` y verificar que Pydantic lanza `ValidationError`
- [x] 8.7 Test: crear `ProductCreate` con `price=-1.0` y verificar que Pydantic lanza `ValidationError`
- [x] 8.8 Correr `pytest backend/tests/test_models.py -v` y verificar que todos los tests pasan en verde
