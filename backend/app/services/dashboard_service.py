from sqlalchemy.orm import Session

from app.repositories import product_repository
from app.schemas.dashboard_schema import DashboardResponse


def get_kpis(db: Session) -> DashboardResponse:
    return DashboardResponse(
        total_products=product_repository.count_all(db),
        low_stock_count=product_repository.count_low_stock(db),
        out_of_stock_count=product_repository.count_out_of_stock(db),
    )
