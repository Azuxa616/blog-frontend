import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/20 bg-white/10 px-6 py-5 shadow-[0_20px_100px_-35px_rgba(15,23,42,0.8)] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.5em] text-slate-500">管理中心</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--admin-foreground)] lg:text-3xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-slate-500 lg:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  )
}
