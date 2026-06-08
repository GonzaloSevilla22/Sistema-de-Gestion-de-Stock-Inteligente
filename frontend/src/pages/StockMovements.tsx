import { useState } from 'react'
import { useMovements } from '../hooks/useMovements'
import { useProducts } from '../hooks/useProducts'
import MovementForm from '../components/MovementForm'

export default function StockMovements() {
  const { data: movements = [], isLoading, isError } = useMovements()
  const { data: products = [] } = useProducts()
  const [formOpen, setFormOpen] = useState(false)

  const productName = (id: number) =>
    products.find((p) => p.id === id)?.name ?? `#${id}`

  const sorted = [...movements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  if (isLoading) {
    return (
      <div className="p-8 flex items-center gap-3 text-slate-500">
        <svg className="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Cargando movimientos…
      </div>
    )
  }

  if (isError) {
    return <div className="p-8 text-red-500 text-sm">Error al cargar los movimientos.</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Movimientos de Stock</h1>
          <p className="text-slate-500 text-sm mt-1">{movements.length} registros en total</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Registrar movimiento
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead>
            <tr className="bg-slate-50/80">
              {['Producto', 'Tipo', 'Cantidad', 'Fecha', 'Observación'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                  <svg className="mx-auto w-10 h-10 text-slate-300 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  No hay movimientos registrados
                </td>
              </tr>
            )}
            {sorted.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4 font-semibold text-slate-900">{productName(m.product_id)}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      m.type === 'ENTRADA'
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                        : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${m.type === 'ENTRADA' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {m.type}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-900 font-bold text-base">{m.quantity}</td>
                <td className="px-5 py-4 text-slate-500 text-xs">
                  {new Date(m.date).toLocaleString('es-AR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
                <td className="px-5 py-4 text-slate-400 max-w-xs truncate">{m.observation ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && <MovementForm onClose={() => setFormOpen(false)} />}
    </div>
  )
}
