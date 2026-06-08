from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.movement_type import MovementType


class MovementCreate(BaseModel):
    product_id: int
    type: MovementType
    quantity: int = Field(gt=0)
    observation: Optional[str] = None


class MovementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    type: str
    quantity: int
    date: datetime
    observation: Optional[str] = None
