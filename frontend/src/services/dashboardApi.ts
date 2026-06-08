import api from './api'
import type { DashboardKPIs } from '../types'

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const response = await api.get<DashboardKPIs>('/dashboard')
  return response.data
}
