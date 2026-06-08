from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.movement_schema import MovementCreate, MovementResponse
from app.services import movement_service

router = APIRouter(prefix="/movements", tags=["movements"])


@router.get("", response_model=list[MovementResponse])
def list_movements(db: Session = Depends(get_db)) -> list[MovementResponse]:
    return movement_service.get_all_movements(db)


@router.post("", response_model=MovementResponse, status_code=201)
def create_movement(data: MovementCreate, db: Session = Depends(get_db)) -> MovementResponse:
    return movement_service.create_movement(db, data)
