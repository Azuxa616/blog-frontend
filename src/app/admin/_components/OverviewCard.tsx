import { ReactNode } from 'react'

interface OverviewCardProps {
  title: string
  value: string
  trend?: string
  trendLabel?: string
  icon?: ReactNode
  variant?: 'default' | 'success' | 'warning'
}

const variantMap = {
  default: 'from-slate-900/80 to-slate-800/60 border-slate-800/80 text-white',
  success: 'from-emerald-600/80 to-emerald-500/60 border-emerald-400/40 text-emerald-50',
  warning: 'from-blue-600/80 to-cyan-500/70 border-cyan-400/40 text-cyan-50',
}

export function OverviewCard({ title, value, trend, trendLabel, icon, variant = 'default' }: OverviewCardProps) {
  return (
    <div className={`rounded-3xl border bg-gradient-to-br p-5 shadow-[0_15px_80px_-40px_rgba(15,23,42,1)] ${variantMap[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">{trendLabel || '当前值'}</p>
          <p className="mt-2 text-3xl font-semibold leading-tight">{value}</p>
        </div>
        {icon && <div className="rounded-2xl bg-white/10 p-3 text-white">{icon}</div>}
      </div>
      <p className="mt-6 text-base font-medium text-white/90">{title}</p>
      {trend && <p className="mt-1 text-sm text-white/70">{trend}</p>}
    </div>
  )
}
