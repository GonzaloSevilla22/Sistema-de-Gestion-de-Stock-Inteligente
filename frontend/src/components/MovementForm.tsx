import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCreateMovement } from '../hooks/useMovements'
import type { MovementCreate } from '../types'
import axios from 'axios'

interface Props {
  onClose: () => void
}

interface FormData {
  product_id: string
  type: 'ENTRADA' | 'SALIDA' | ''
  quantity: string
  observation: string
}

const empty: FormData = {
  product_id: '',
  type: '',
  quantity: '',
  observation: '',
}

export default function MovementForm({ onClose }: Props) {
  const { data: rawProducts } = useProducts()
  const products = Array.isArray(rawProducts) ? rawProducts : []
  const createMutation = useCreateMovement()

  const [form, setForm] = useState<FormData>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  function validate(): boolean {
    const next: Partial<Record<keyof FormData, string>> = {}
    if (!form.product_id) next.product_id = 'Seleccioná un producto'
    if (!form.type) next.type = 'Seleccioná el tipo'
    if (!form.quantity || isNaN(Number(form.quantity))) {
      next.quantity = 'La cantidad es requerida'
    } else if (Number(form.quantity) <= 0) {
      next.quantity = 'La cantidad debe ser mayor a cero'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError(null)
    if (!validate()) return

    const payload: MovementCreate = {
      product_id: Number(form.product_id),
      type: form.type as 'ENTRADA' | 'SALIDA',
      quantity: Number(form.quantity),
      observation: form.observation.trim() || undefined,
    }

    try {
      await createMutation.mutateAsync(payload)
      onClose()
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setApiError(String(err.response.data.detail))
      } else {
        setApiError('Ocurrió un error inesperado')
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Registrar movimiento</h2>
          <p className="text-sm text-slate-400 mt-0.5">Entrada o salida de stock</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Producto <span className="text-red-500">*</span>
            </label>
            <select
              value={form.product_id}
              onChange={(e) => setForm((f) => ({ ...f, product_id: e.target.value }))}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white ${errors.product_id ? 'border-red-400' : 'border-slate-200'}`}
            >
              <option value="">Seleccioná un producto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (stock: {p.stock})
                </option>
              ))}
            </select>
            {errors.product_id && (
              <p className="text-red-500 text-xs mt-1">{errors.product_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({ ...f, type: e.target.value as 'ENTRADA' | 'SALIDA' | '' }))
              }
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white ${errors.type ? 'border-red-400' : 'border-slate-200'}`}
            >
              <option value="">Seleccioná el tipo</option>
              <option value="ENTRADA">ENTRADA</option>
              <option value="SALIDA">SALIDA</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Cantidad <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${errors.quantity ? 'border-red-400' : 'border-slate-200'}`}
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Observación</label>
            <textarea
              value={form.observation}
              onChange={(e) => setForm((f) => ({ ...f, observation: e.target.value }))}
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
            />
          </div>

          {apiError && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
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
              disabled={createMutation.isPending}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-blue-700 rounded-xl disabled:opacity-50 transition-colors"
            >
              {createMutation.isPending ? 'Registrando…' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
