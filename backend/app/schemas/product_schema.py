from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(ge=0)
    stock: int = Field(ge=0)
    minimum_stock: int = Field(ge=0)
    category: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, ge=0)
    stock: Optional[int] = Field(default=None, ge=0)
    minimum_stock: Optional[int] = Field(default=None, ge=0)
    category: Optional[str] = None


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    minimum_stock: int
    category: Optional[str] = None
    created_at: datetime
    alert_status: str = "normal"
