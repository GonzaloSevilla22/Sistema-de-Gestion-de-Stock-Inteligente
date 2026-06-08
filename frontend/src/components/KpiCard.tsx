interface KpiCardProps {
  title: string
  value: number | undefined
  colorClass: 'blue' | 'yellow' | 'red'
}

const colorStyles: Record<'blue' | 'yellow' | 'red', { border: string; text: string; bg: string }> = {
  blue: {
    border: 'border-blue-400',
    text: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  yellow: {
    border: 'border-yellow-400',
    text: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  red: {
    border: 'border-red-400',
    text: 'text-red-600',
    bg: 'bg-red-50',
  },
}

export default function KpiCard({ title, value, colorClass }: KpiCardProps) {
  const styles = colorStyles[colorClass]

  return (
    <div className={`rounded-lg border-l-4 p-6 shadow-sm ${styles.border} ${styles.bg}`}>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {value === undefined ? (
        <div className="mt-2 h-9 w-16 animate-pulse rounded bg-gray-200" />
      ) : (
        <p className={`mt-2 text-4xl font-bold ${styles.text}`}>{value}</p>
      )}
    </div>
  )
}
