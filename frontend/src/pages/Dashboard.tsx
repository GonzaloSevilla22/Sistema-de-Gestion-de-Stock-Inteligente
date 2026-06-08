import { useDashboard } from '../hooks/useDashboard'
import { useProducts } from '../hooks/useProducts'
import KpiCard from '../components/KpiCard'

const BoxIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
  </svg>
)

const AlertIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.007v.008H12v-.008z" />
  </svg>
)

const OutIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const MoneyIcon = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboard()
  const { data: products = [] } = useProducts()

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen general del inventario</p>
      </div>

      {isError && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="text-sm font-medium">No se pudo conectar al servidor. Verificá que el backend esté corriendo.</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Productos"
          value={isLoading ? undefined : data?.total_products}
          colorClass="blue"
          icon={BoxIcon}
          subtitle="en catálogo"
        />
        <KpiCard
          title="Stock Bajo"
          value={isLoading ? undefined : data?.low_stock_count}
          colorClass="yellow"
          icon={AlertIcon}
          subtitle="requieren reposición"
        />
        <KpiCard
          title="Sin Stock"
          value={isLoading ? undefined : data?.out_of_stock_count}
          colorClass="red"
          icon={OutIcon}
          subtitle="productos agotados"
        />
        <KpiCard
          title="Valor Inventario"
          value={products.length === 0 ? undefined : formatCurrency(totalValue)}
          colorClass="green"
          icon={MoneyIcon}
          subtitle="estimado total"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Estado del Inventario</h2>
          {products.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-slate-400 text-sm">Sin datos</div>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Disponible', count: products.filter(p => p.alert_status === 'normal').length, color: 'bg-emerald-500', total: products.length },
                { label: 'Stock Bajo', count: products.filter(p => p.alert_status === 'low').length, color: 'bg-amber-500', total: products.length },
                { label: 'Agotado', count: products.filter(p => p.alert_status === 'out_of_stock').length, color: 'bg-red-500', total: products.length },
              ].map(({ label, count, color, total }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">{label}</span>
                    <span className="text-slate-900 font-semibold">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${color}`}
                      style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Productos por Categoría</h2>
          {products.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-slate-400 text-sm">Sin datos</div>
          ) : (
            <div className="space-y-3">
              {Object.entries(
                products.reduce<Record<string, number>>((acc, p) => {
                  const cat = p.category ?? 'Sin categoría'
                  acc[cat] = (acc[cat] ?? 0) + 1
                  return acc
                }, {})
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 font-medium truncate max-w-[160px]">{cat}</span>
                      <span className="text-slate-900 font-semibold">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${(count / products.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
