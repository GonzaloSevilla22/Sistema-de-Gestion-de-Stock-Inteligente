import { useState } from 'react'
import type { Product } from '../types'
import { useProducts, useDeleteProduct } from '../hooks/useProducts'
import ProductTable from '../components/ProductTable'
import ProductForm from '../components/ProductForm'
import AlertList from '../components/AlertList'
import AIRecommendationModal from '../components/AIRecommendationModal'

export default function Products() {
  const { data: products = [], isLoading, isError } = useProducts()
  const deleteMutation = useDeleteProduct()

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Product | undefined>(undefined)
  const [toDelete, setToDelete] = useState<Product | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  function handleEdit(product: Product) {
    setEditing(product)
    setFormOpen(true)
  }

  function handleNew() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditing(undefined)
  }

  async function confirmDelete() {
    if (!toDelete) return
    await deleteMutation.mutateAsync(toDelete.id)
    setToDelete(null)
  }

  if (isLoading) return <p className="p-6 text-gray-500">Cargando productos…</p>
  if (isError) return <p className="p-6 text-red-500">Error al cargar los productos.</p>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          + Nuevo producto
        </button>
      </div>

      <AlertList products={products} onRequestAI={setSelectedProduct} />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <ProductTable products={filtered} onEdit={handleEdit} onDelete={setToDelete} />

      {formOpen && (
        <ProductForm product={editing} onClose={handleCloseForm} />
      )}

      {selectedProduct && (
        <AIRecommendationModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {toDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Eliminar producto</h2>
            <p className="text-gray-600 text-sm mb-4">
              ¿Estás seguro de que querés eliminar{' '}
              <span className="font-medium">"{toDelete.name}"</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setToDelete(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
