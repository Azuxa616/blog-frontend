import { ReactNode } from 'react'

interface ChartPanelProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function ChartPanel({ title, description, actions, children }: ChartPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-200/15 bg-white/80 p-6 shadow-xl shadow-slate-900/10 backdrop-blur">
      <div className="flex flex-col gap-4 border-b border-slate-100/40 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3 text-sm text-slate-500">{actions}</div>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}
