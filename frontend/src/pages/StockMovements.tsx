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

  if (isLoading) return <p className="p-6 text-gray-500">Cargando movimientos…</p>
  if (isError) return <p className="p-6 text-red-500">Error al cargar los movimientos.</p>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Movimientos de stock</h1>
        <button
          onClick={() => setFormOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          + Registrar movimiento
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Producto', 'Tipo', 'Cantidad', 'Fecha', 'Observación'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No hay movimientos registrados
                </td>
              </tr>
            )}
            {sorted.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{productName(m.product_id)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      m.type === 'ENTRADA'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {m.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900 font-semibold">{m.quantity}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(m.date).toLocaleString('es-AR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
                <td className="px-4 py-3 text-gray-500">{m.observation ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formOpen && <MovementForm onClose={() => setFormOpen(false)} />}
    </div>
  )
}
