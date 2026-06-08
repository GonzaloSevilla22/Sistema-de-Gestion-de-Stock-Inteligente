import { useDashboard } from '../hooks/useDashboard'
import KpiCard from '../components/KpiCard'

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboard()

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>

      {isError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          No se pudo conectar al servidor. Verificá que el backend esté corriendo.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Total Productos"
          value={isLoading ? undefined : data?.total_products}
          colorClass="blue"
        />
        <KpiCard
          title="Stock Bajo"
          value={isLoading ? undefined : data?.low_stock_count}
          colorClass="yellow"
        />
        <KpiCard
          title="Sin Stock"
          value={isLoading ? undefined : data?.out_of_stock_count}
          colorClass="red"
        />
      </div>
    </div>
  )
}
