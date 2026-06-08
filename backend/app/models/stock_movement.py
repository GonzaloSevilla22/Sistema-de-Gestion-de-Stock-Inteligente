from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional

from sqlalchemy import ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base
from app.models.movement_type import MovementType

if TYPE_CHECKING:
    from app.models.product import Product


class StockMovement(Base):
    __tablename__ = "stock_movement"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("product.id", ondelete="CASCADE"), nullable=False
    )
    type: Mapped[MovementType] = mapped_column(String(10), nullable=False)
    quantity: Mapped[int] = mapped_column(nullable=False)
    date: Mapped[datetime] = mapped_column(
        nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    observation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    product: Mapped[Product] = relationship("Product", back_populates="movements")

    __table_args__ = (
        Index("idx_movement_product", "product_id"),
        Index("idx_movement_date", "date"),
    )
