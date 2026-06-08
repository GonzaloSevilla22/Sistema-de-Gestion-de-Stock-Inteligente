# Modelo de Datos

## Dominios

- **Inventario**: gestión de productos y sus atributos de stock
- **Movimientos**: registro histórico de entradas y salidas de stock

## ERD

```
┌─────────────────────────────┐          ┌──────────────────────────────────┐
│           PRODUCT            │          │         STOCK_MOVEMENT            │
├─────────────────────────────┤          ├──────────────────────────────────┤
│ id          INTEGER (PK)    │          │ id           INTEGER (PK)         │
│ name        VARCHAR(255) NN │◄────────┤ product_id   INTEGER (FK)         │
│ description TEXT            │   1 : N  │ type         VARCHAR(10) NN       │
│ price       DECIMAL(10,2) NN│          │ quantity     INTEGER NN           │
│ stock       INTEGER NN      │          │ date         DATETIME NN          │
│ minimum_stock INTEGER NN    │          │ observation  TEXT                 │
│ category    VARCHAR(100)    │          └──────────────────────────────────┘
│ created_at  DATETIME NN     │
└─────────────────────────────┘
```

**Relación**: `Product 1 ──── N StockMovement` (un producto tiene muchos movimientos de stock)

## Entidades

### Product

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| id | INTEGER | PK, autoincrement | Identificador único |
| name | VARCHAR(255) | NOT NULL | Nombre del producto |
| description | TEXT | nullable | Descripción detallada |
| price | DECIMAL(10,2) | NOT NULL, >= 0 | Precio unitario |
| stock | INTEGER | NOT NULL, >= 0 | Stock actual |
| minimum_stock | INTEGER | NOT NULL, >= 0 | Umbral de alerta de stock bajo |
| category | VARCHAR(100) | nullable | Categoría del producto |
| created_at | DATETIME | NOT NULL, default=now | Fecha de creación |

- **Índice recomendado**: `idx_product_category` sobre `category` para filtrado rápido
- **Índice recomendado**: `idx_product_stock` sobre `stock` para consultas de alertas

### StockMovement

| Atributo | Tipo | Restricciones | Descripción |
|----------|------|---------------|-------------|
| id | INTEGER | PK, autoincrement | Identificador único |
| product_id | INTEGER | FK → Product.id, NOT NULL | Producto asociado |
| type | VARCHAR(10) | NOT NULL, enum('ENTRADA','SALIDA') | Tipo de movimiento |
| quantity | INTEGER | NOT NULL, > 0 | Cantidad del movimiento |
| date | DATETIME | NOT NULL, default=now | Fecha/hora del movimiento |
| observation | TEXT | nullable | Nota u observación libre |

- **Índice recomendado**: `idx_movement_product` sobre `product_id` para filtrar movimientos por producto
- **Índice recomendado**: `idx_movement_date` sobre `date` para ordenamiento cronológico

## Seed data inicial

Para desarrollo local (SQLite), cargar los siguientes productos de ejemplo:

```python
[
    {"name": "Teclado Logitech K380", "price": 4500.00, "stock": 15, "minimum_stock": 5, "category": "Periféricos"},
    {"name": "Monitor Samsung 24\"", "price": 85000.00, "stock": 3, "minimum_stock": 5, "category": "Monitores"},
    {"name": "Mouse Inalámbrico", "price": 2800.00, "stock": 0, "minimum_stock": 3, "category": "Periféricos"},
    {"name": "Silla Gamer", "price": 45000.00, "stock": 8, "minimum_stock": 2, "category": "Mobiliario"},
]
```

Esto genera un dataset que ilustra los 3 estados posibles: stock normal, stock bajo y producto agotado.

## Reglas de integridad a nivel BD

- Al eliminar un `Product`, sus `StockMovement` asociados deben eliminarse en cascada (CASCADE DELETE)
- `quantity` en `StockMovement` siempre es positivo — la dirección la determina `type`
- Al registrar un `StockMovement` de tipo `SALIDA`, el service debe verificar que `stock >= quantity` antes de persistir
