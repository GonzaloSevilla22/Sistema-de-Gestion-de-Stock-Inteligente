from fastapi import APIRouter

from app.schemas.ai_schema import AIRecommendationRequest, AIRecommendationResponse
from app.services import ai_service

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/recommendation", response_model=AIRecommendationResponse)
def get_recommendation(request: AIRecommendationRequest) -> AIRecommendationResponse:
    recomendacion = ai_service.get_recommendation(
        producto=request.producto,
        stock_actual=request.stock_actual,
        stock_minimo=request.stock_minimo,
    )
    return AIRecommendationResponse(recomendacion=recomendacion)
