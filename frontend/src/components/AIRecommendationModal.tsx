import { useEffect } from 'react'
import type { Product } from '../types'
import { useAIRecommendation } from '../hooks/useAI'

interface AIRecommendationModalProps {
  product: Product
  onClose: () => void
}

export default function AIRecommendationModal({
  product,
  onClose,
}: AIRecommendationModalProps) {
  const { mutate, isPending, data, error, reset } = useAIRecommendation()

  useEffect(() => {
    mutate({
      producto: product.name,
      stock_actual: product.stock,
      stock_minimo: product.minimum_stock,
    })
  }, [product.id])

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-700 px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-base leading-none">Asistente IA</p>
                <p className="text-blue-200 text-xs mt-0.5">{product.name}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-5 text-sm">
            <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2.5 text-center">
              <p className="text-slate-400 text-xs">Stock actual</p>
              <p className="font-bold text-slate-900 text-lg">{product.stock}</p>
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2.5 text-center">
              <p className="text-slate-400 text-xs">Stock mínimo</p>
              <p className="font-bold text-slate-900 text-lg">{product.minimum_stock}</p>
            </div>
          </div>

          {isPending && (
            <div className="flex flex-col items-center gap-3 py-8">
              <svg className="h-8 w-8 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-sm text-slate-500">Consultando al asistente IA…</span>
            </div>
          )}

          {!isPending && data && (
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span className="text-xs font-semibold text-primary">Recomendación</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {data.recommendation}
              </p>
            </div>
          )}

          {!isPending && error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
              No se pudo obtener la recomendación. Intentá de nuevo.
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
