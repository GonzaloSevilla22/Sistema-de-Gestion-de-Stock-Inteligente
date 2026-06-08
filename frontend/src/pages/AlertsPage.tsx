import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../types'
import AIRecommendationModal from '../components/AIRecommendationModal'

type Filter = 'all' | 'low' | 'out_of_stock'

const STATUS_CONFIG: Record<Product['alert_status'], { label: string; dot: string; badge: string }> = {
  normal: { label: 'Disponible', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  low: { label: 'Stock Bajo', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  out_of_stock: { label: 'Agotado', dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 ring-1 ring-red-200' },
}

export default function AlertsPage() {
  const { data: rawProducts, isLoading } = useProducts()
  const products = Array.isArray(rawProducts) ? rawProducts : []
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const alerted = products.filter((p) => p.alert_status !== 'normal')
  const filtered = filter === 'all' ? alerted : alerted.filter((p) => p.alert_status === filter)

  const outCount = products.filter((p) => p.alert_status === 'out_of_stock').length
  const lowCount = products.filter((p) => p.alert_status === 'low').length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Alertas de Stock</h1>
        <p className="text-slate-500 text-sm mt-1">
          {alerted.length} producto{alerted.length !== 1 ? 's' : ''} requieren atención
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-500">Stock Bajo</p>
            <p className="text-3xl font-bold text-slate-900">{lowCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-500">Agotados</p>
            <p className="text-3xl font-bold text-slate-900">{outCount}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {([
          { value: 'all', label: 'Todos' },
          { value: 'low', label: 'Stock Bajo' },
          { value: 'out_of_stock', label: 'Agotados' },
        ] as { value: Filter; label: string }[]).map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              filter === value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Cargando…
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <svg className="mx-auto w-12 h-12 text-emerald-300 mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-500 font-medium">Sin alertas en esta categoría</p>
          <p className="text-slate-400 text-sm mt-1">El stock está dentro de los niveles mínimos</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="bg-slate-50/80">
                {['Producto', 'Categoría', 'Stock actual', 'Stock mínimo', 'Estado', ''].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p) => {
                const status = STATUS_CONFIG[p.alert_status]
                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900">{p.name}</td>
                    <td className="px-5 py-4 text-slate-500">
                      {p.category ? (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                          {p.category}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 text-base">{p.stock}</td>
                    <td className="px-5 py-4 text-slate-400">{p.minimum_stock}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                        Consultar IA
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedProduct && (
        <AIRecommendationModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
