import { useQuery } from '@tanstack/react-query'
import { getDashboardKPIs } from '../services/dashboardApi'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardKPIs,
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}
