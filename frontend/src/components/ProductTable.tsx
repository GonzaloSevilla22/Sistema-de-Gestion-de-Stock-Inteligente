import type { Product } from '../types'

const STATUS_CONFIG: Record<
  Product['alert_status'],
  { label: string; dot: string; badge: string }
> = {
  normal: {
    label: 'Disponible',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
  low: {
    label: 'Stock Bajo',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  },
  out_of_stock: {
    label: 'Agotado',
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  },
}

interface Props {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead>
          <tr className="bg-slate-50/80">
            {['Nombre', 'Categoría', 'Precio', 'Stock', 'Mínimo', 'Estado', ''].map((h) => (
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
          {products.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                <svg className="mx-auto w-10 h-10 text-slate-300 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                No hay productos
              </td>
            </tr>
          )}
          {products.map((p) => {
            const status = STATUS_CONFIG[p.alert_status]
            return (
              <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4 font-semibold text-slate-900">{p.name}</td>
                <td className="px-5 py-4 text-slate-500">
                  {p.category ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      {p.category}
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-5 py-4 text-slate-700 font-medium">${p.price.toFixed(2)}</td>
                <td className="px-5 py-4 text-slate-900 font-bold text-base">{p.stock}</td>
                <td className="px-5 py-4 text-slate-400">{p.minimum_stock}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => onEdit(p)}
                      className="text-xs font-semibold text-primary hover:text-blue-800 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
