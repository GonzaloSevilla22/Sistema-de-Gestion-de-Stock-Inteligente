import api from './api'

export interface AIRecommendationRequest {
  producto: string
  stock_actual: number
  stock_minimo: number
}

export interface AIRecommendationResponse {
  recommendation: string
}

export async function getRecommendation(
  payload: AIRecommendationRequest,
): Promise<AIRecommendationResponse> {
  const { data } = await api.post<AIRecommendationResponse>(
    '/ai/recommendation',
    payload,
  )
  return data
}
