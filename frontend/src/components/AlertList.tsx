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
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <h2 className="text-sm font-semibold text-amber-800">
          {alerted.length} producto{alerted.length !== 1 ? 's' : ''} en alerta
        </h2>
      </div>
      <ul className="space-y-2">
        {alerted.map((product) => (
          <li
            key={product.id}
            className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5 shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-800">{product.name}</span>
              {product.alert_status === 'out_of_stock' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold ring-1 ring-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Agotado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold ring-1 ring-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Stock bajo
                </span>
              )}
              <span className="text-xs text-slate-400">
                {product.stock} / mín. {product.minimum_stock}
              </span>
            </div>
            <button
              onClick={() => onRequestAI(product)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Consultar IA
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
