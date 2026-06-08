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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Recomendación IA — {product.name}
          </h2>
          <button
            onClick={handleClose}
            className="ml-4 text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {isPending && (
          <div className="flex flex-col items-center gap-3 py-6 text-gray-500">
            <svg
              className="h-8 w-8 animate-spin text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span className="text-sm">Consultando al asistente…</span>
          </div>
        )}

        {!isPending && data && (
          <div className="rounded bg-indigo-50 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {data.recommendation}
          </div>
        )}

        {!isPending && error && (
          <p className="rounded bg-red-50 p-4 text-sm text-red-700">
            No se pudo obtener la recomendación. Intentá de nuevo.
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClose}
            className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
