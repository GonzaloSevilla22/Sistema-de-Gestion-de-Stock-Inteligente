import { useState, useEffect } from 'react'
import type { Product, ProductCreate, ProductUpdate } from '../types'
import { useCreateProduct, useUpdateProduct } from '../hooks/useProducts'
import axios from 'axios'

interface Props {
  product?: Product
  onClose: () => void
}

interface FormData {
  name: string
  description: string
  category: string
  price: string
  stock: string
  minimum_stock: string
}

const empty: FormData = {
  name: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  minimum_stock: '',
}

export default function ProductForm({ product, onClose }: Props) {
  const [form, setForm] = useState<FormData>(empty)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description ?? '',
        category: product.category ?? '',
        price: String(product.price),
        stock: String(product.stock),
        minimum_stock: String(product.minimum_stock),
      })
    }
  }, [product])

  function validate(): boolean {
    const next: Partial<FormData> = {}
    if (!form.name.trim()) next.name = 'El nombre es requerido'
    if (form.price === '' || isNaN(Number(form.price))) next.price = 'El precio es requerido'
    else if (Number(form.price) < 0) next.price = 'El precio no puede ser negativo'
    if (form.stock === '' || isNaN(Number(form.stock))) next.stock = 'El stock es requerido'
    else if (Number(form.stock) < 0) next.stock = 'El stock no puede ser negativo'
    if (form.minimum_stock === '' || isNaN(Number(form.minimum_stock)))
      next.minimum_stock = 'El stock mínimo es requerido'
    else if (Number(form.minimum_stock) < 0)
      next.minimum_stock = 'El stock mínimo no puede ser negativo'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError(null)
    if (!validate()) return

    const payload: ProductCreate = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      category: form.category.trim() || undefined,
      price: Number(form.price),
      stock: Number(form.stock),
      minimum_stock: Number(form.minimum_stock),
    }

    try {
      if (product) {
        await updateMutation.mutateAsync({ id: product.id, payload: payload as ProductUpdate })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onClose()
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setApiError(String(err.response.data.detail))
      } else {
        setApiError('Ocurrió un error inesperado')
      }
    }
  }

  function field(
    label: string,
    key: keyof FormData,
    type: string = 'text',
    required = false,
  ) {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${errors[key] ? 'border-red-400' : 'border-slate-200'}`}
          step={type === 'number' ? 'any' : undefined}
        />
        {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {product ? 'Modificá los datos del producto' : 'Completá los datos para agregar el producto'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {field('Nombre', 'name', 'text', true)}
          {field('Descripción', 'description')}
          {field('Categoría', 'category')}
          {field('Precio', 'price', 'number', true)}
          {field('Stock inicial', 'stock', 'number', true)}
          {field('Stock mínimo', 'minimum_stock', 'number', true)}

          {apiError && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {apiError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-blue-700 rounded-xl disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
