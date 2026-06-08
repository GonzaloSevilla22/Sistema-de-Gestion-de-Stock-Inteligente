import { useMutation } from '@tanstack/react-query'
import { getRecommendation } from '../services/aiApi'
import type { AIRecommendationRequest, AIRecommendationResponse } from '../services/aiApi'

export function useAIRecommendation() {
  const { mutate, isPending, data, error, reset } = useMutation<
    AIRecommendationResponse,
    Error,
    AIRecommendationRequest
  >({
    mutationFn: getRecommendation,
  })

  return { mutate, isPending, data, error, reset }
}
