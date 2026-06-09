import os
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ai_routes import router as ai_router
from app.api.dashboard_routes import router as dashboard_router
from app.api.movement_routes import router as movement_router
from app.api.product_routes import router as product_router
from app.database.connection import Base, engine
import app.models.product  # noqa: F401 — registers Product with Base
import app.models.stock_movement  # noqa: F401 — registers StockMovement with Base


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    Base.metadata.create_all(bind=engine)
    try:
        from seed import run_seed  # noqa: PLC0415
        run_seed()
    except Exception as exc:
        import logging
        logging.getLogger(__name__).warning("Seed skipped: %s", exc)
    yield


app = FastAPI(title="Sistema de Gestión de Stock Inteligente", lifespan=lifespan)

_cors_origins_raw = os.getenv("CORS_ORIGINS", "http://localhost:5173")
origins = [o.strip() for o in _cors_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(ai_router)
app.include_router(dashboard_router)
app.include_router(product_router)
app.include_router(movement_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
