from pydantic import BaseModel


class AIRecommendationRequest(BaseModel):
    producto: str
    stock_actual: int
    stock_minimo: int


class AIRecommendationResponse(BaseModel):
    recomendacion: str
