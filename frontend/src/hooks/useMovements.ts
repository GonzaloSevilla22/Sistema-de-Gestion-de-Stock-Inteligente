import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMovements, createMovement } from '../services/movementApi'
import type { MovementCreate } from '../types'

export function useMovements() {
  return useQuery({ queryKey: ['movements'], queryFn: getMovements })
}

export function useCreateMovement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: MovementCreate) => createMovement(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['movements'] })
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
