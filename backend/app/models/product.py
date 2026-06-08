from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlalchemy import NUMERIC, Index, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base

if TYPE_CHECKING:
    from app.models.stock_movement import StockMovement


class Product(Base):
    __tablename__ = "product"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[Decimal] = mapped_column(NUMERIC(10, 2), nullable=False)
    stock: Mapped[int] = mapped_column(nullable=False)
    minimum_stock: Mapped[int] = mapped_column(nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    movements: Mapped[list[StockMovement]] = relationship(
        "StockMovement",
        back_populates="product",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("idx_product_category", "category"),
        Index("idx_product_stock", "stock"),
    )
