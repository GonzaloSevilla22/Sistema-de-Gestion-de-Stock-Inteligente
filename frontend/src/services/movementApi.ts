import api from './api'
import type { StockMovement, MovementCreate } from '../types'

export async function getMovements(): Promise<StockMovement[]> {
  const { data } = await api.get<StockMovement[]>('/movements')
  return data
}

export async function createMovement(payload: MovementCreate): Promise<StockMovement> {
  const { data } = await api.post<StockMovement>('/movements', payload)
  return data
}
