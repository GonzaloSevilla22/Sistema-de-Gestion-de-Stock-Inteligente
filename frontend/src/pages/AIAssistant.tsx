import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useAIRecommendation } from '../hooks/useAI'

export default function AIAssistant() {
  const { data: products = [] } = useProducts()
  const { mutate, isPending, data, error, reset } = useAIRecommendation()
  const [selectedId, setSelectedId] = useState<string>('')

  const selectedProduct = products.find((p) => String(p.id) === selectedId)

  function handleConsult() {
    if (!selectedProduct) return
    reset()
    mutate({
      producto: selectedProduct.name,
      stock_actual: selectedProduct.stock,
      stock_minimo: selectedProduct.minimum_stock,
    })
  }

  const alertedProducts = products.filter(
    (p) => p.alert_status === 'low' || p.alert_status === 'out_of_stock',
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Asistente IA</h1>
            <p className="text-slate-500 text-sm">Recomendaciones inteligentes de inventario</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Consultar producto</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seleccionar producto
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => {
                    setSelectedId(e.target.value)
                    reset()
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
                >
                  <option value="">— Seleccioná un producto —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · Stock: {p.stock} · Mín: {p.minimum_stock}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-xl px-3 py-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Stock actual</p>
                    <p className="font-bold text-slate-900 text-xl">{selectedProduct.stock}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-3 py-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Stock mínimo</p>
                    <p className="font-bold text-slate-900 text-xl">{selectedProduct.minimum_stock}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-3 py-3 text-center">
                    <p className="text-xs text-slate-400 mb-0.5">Estado</p>
                    <p className={`font-bold text-sm ${
                      selectedProduct.alert_status === 'normal' ? 'text-emerald-600' :
                      selectedProduct.alert_status === 'low' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {selectedProduct.alert_status === 'normal' ? 'OK' :
                       selectedProduct.alert_status === 'low' ? 'Bajo' : 'Agotado'}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleConsult}
                disabled={!selectedProduct || isPending}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Consultando…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Obtener recomendación
                  </>
                )}
              </button>
            </div>

            {data && !isPending && (
              <div className="mt-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">Recomendación IA</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {data.recommendation}
                </p>
              </div>
            )}

            {error && !isPending && (
              <div className="mt-5 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
                No se pudo obtener la recomendación. Verificá que el backend esté activo.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-1">Productos en alerta</h2>
            <p className="text-xs text-slate-400 mb-4">Requieren atención inmediata</p>

            {alertedProducts.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto w-10 h-10 text-emerald-300 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-slate-400">Todo el stock está en orden</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {alertedProducts.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => {
                        setSelectedId(String(p.id))
                        reset()
                      }}
                      className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                        selectedId === String(p.id)
                          ? 'border-primary bg-blue-50'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">
                          Stock: {p.stock} / mín. {p.minimum_stock}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.alert_status === 'out_of_stock'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.alert_status === 'out_of_stock' ? 'Agotado' : 'Bajo'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
