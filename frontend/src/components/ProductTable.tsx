import type { Product } from '../types'

const STATUS_LABEL: Record<Product['alert_status'], string> = {
  normal: 'Normal',
  low: 'Stock bajo',
  out_of_stock: 'Agotado',
}

const STATUS_CLASS: Record<Product['alert_status'], string> = {
  normal: 'bg-green-100 text-green-800',
  low: 'bg-yellow-100 text-yellow-800',
  out_of_stock: 'bg-red-100 text-red-800',
}

interface Props {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Nombre', 'Categoría', 'Precio', 'Stock', 'Mínimo', 'Estado', ''].map((h) => (
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
          {products.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                No hay productos
              </td>
            </tr>
          )}
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
              <td className="px-4 py-3 text-gray-600">{p.category ?? '—'}</td>
              <td className="px-4 py-3 text-gray-600">${p.price.toFixed(2)}</td>
              <td className="px-4 py-3 text-gray-900 font-semibold">{p.stock}</td>
              <td className="px-4 py-3 text-gray-600">{p.minimum_stock}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[p.alert_status]}`}
                >
                  {STATUS_LABEL[p.alert_status]}
                </span>
              </td>
              <td className="px-4 py-3 flex gap-2 justify-end">
                <button
                  onClick={() => onEdit(p)}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(p)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
