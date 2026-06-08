from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_products: int
    low_stock_count: int
    out_of_stock_count: int
