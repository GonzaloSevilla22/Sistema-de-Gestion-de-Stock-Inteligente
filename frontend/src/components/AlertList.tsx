import type { Product } from '../types'

interface AlertListProps {
  products: Product[]
  onRequestAI: (product: Product) => void
}

export default function AlertList({ products, onRequestAI }: AlertListProps) {
  const alerted = products.filter(
    (p) => p.alert_status === 'low' || p.alert_status === 'out_of_stock',
  )

  if (alerted.length === 0) return null

  return (
    <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <h2 className="mb-3 text-sm font-semibold text-yellow-800">
        Productos en alerta ({alerted.length})
      </h2>
      <ul className="space-y-2">
        {alerted.map((product) => (
          <li
            key={product.id}
            className="flex items-center justify-between rounded bg-white px-3 py-2 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800">
                {product.name}
              </span>
              {product.alert_status === 'out_of_stock' ? (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                  Agotado
                </span>
              ) : (
                <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                  Stock bajo
                </span>
              )}
              <span className="text-xs text-gray-500">
                Stock: {product.stock} / Mínimo: {product.minimum_stock}
              </span>
            </div>
            <button
              onClick={() => onRequestAI(product)}
              className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
            >
              Obtener recomendación IA
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
