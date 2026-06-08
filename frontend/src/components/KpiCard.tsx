import type { ReactNode } from 'react'

interface KpiCardProps {
  title: string
  value: number | string | undefined
  colorClass: 'blue' | 'yellow' | 'red' | 'green'
  icon: ReactNode
  subtitle?: string
}

const variants = {
  blue: {
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    valueColor: 'text-slate-900',
    accent: 'bg-blue-600',
  },
  yellow: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    valueColor: 'text-slate-900',
    accent: 'bg-amber-500',
  },
  red: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    valueColor: 'text-slate-900',
    accent: 'bg-red-500',
  },
  green: {
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    valueColor: 'text-slate-900',
    accent: 'bg-emerald-500',
  },
}

export default function KpiCard({ title, value, colorClass, icon, subtitle }: KpiCardProps) {
  const v = variants[colorClass]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${v.iconBg}`}>
        <span className={v.iconColor}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {value === undefined ? (
          <div className="mt-1 h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <p className={`mt-0.5 text-3xl font-bold tracking-tight ${v.valueColor}`}>{value}</p>
        )}
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className={`w-1 h-12 rounded-full self-start ${v.accent} opacity-60`} />
    </div>
  )
}
