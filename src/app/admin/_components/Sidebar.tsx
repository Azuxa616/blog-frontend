'use client'

import Link from 'next/link'
import { navSections, type NavEntry, type NavIcon, matchNavEntry } from './navigation'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  pathname: string
}

const Icon = ({ name }: { name: NavIcon }) => {
  const common = 'h-5 w-5'
  switch (name) {
    case 'dashboard':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16" opacity="0.4" />
          <path d="M12 4v16" opacity="0.4" />
          <path d="M7 7h4v4H7z" />
          <path d="M13 13h4v4h-4z" />
        </svg>
      )
    case 'content':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4h9l5 5v11a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" />
          <path d="M14 4v5h5" opacity="0.5" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      )
    case 'settings':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" />
          <path d="M19.4 15a1.8 1.8 0 00.36 1.95l.06.06a2.15 2.15 0 010 3l-.5.5a2.15 2.15 0 01-3 0l-.06-.06a1.8 1.8 0 00-1.95-.36 1.8 1.8 0 00-1 1.62V22a2.1 2.1 0 01-2.12 2.12H12A2.1 2.1 0 019.88 22v-.14a1.8 1.8 0 00-1-1.62 1.8 1.8 0 00-1.95.36l-.06.06a2.15 2.15 0 01-3 0l-.5-.5a2.15 2.15 0 010-3l.06-.06a1.8 1.8 0 00.36-1.95 1.8 1.8 0 00-1.62-1H2a2.1 2.1 0 01-2.12-2.12V12A2.1 2.1 0 012 9.88h.14a1.8 1.8 0 001.62-1 1.8 1.8 0 00-.36-1.95l-.06-.06a2.15 2.15 0 010-3l.5-.5a2.15 2.15 0 013 0l.06.06a1.8 1.8 0 001.95.36h.09a1.8 1.8 0 001-1.62V2A2.1 2.1 0 0112 0a2.1 2.1 0 012.12 2.12v.14a1.8 1.8 0 001 1.62h.09a1.8 1.8 0 001.95-.36l.06-.06a2.15 2.15 0 013 0l.5.5a2.15 2.15 0 010 3l-.06.06a1.8 1.8 0 00-.36 1.95v.09a1.8 1.8 0 001.62 1H22A2.1 2.1 0 0124 12a2.1 2.1 0 01-2.12 2.12h-.14a1.8 1.8 0 00-1.62 1z" opacity="0.6" />
        </svg>
      )
    case 'gallery':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    case 'activity':
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h4l3 8 4-16 3 8h4" />
        </svg>
      )
  }
}

const NavItem = ({ entry, isActive, onNavigate }: { entry: NavEntry; isActive: boolean; onNavigate: () => void }) => (
  <Link
    key={entry.href}
    href={entry.href}
    onClick={onNavigate}
    className={`group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm transition-all duration-200 ${
      isActive
        ? 'bg-white/10 text-white shadow-md shadow-black/20 backdrop-blur border-white/10'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`}
  >
    <span className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
      isActive ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 text-slate-300 group-hover:border-white/30'
    }`}>
      <Icon name={entry.icon} />
    </span>
    <span className="flex flex-col">
      <span className="text-sm font-medium leading-tight">{entry.title}</span>
      {entry.description && (
        <span className="text-xs text-slate-400 group-hover:text-slate-200/80">{entry.description}</span>
      )}
    </span>
  </Link>
)

export function Sidebar({ isOpen, onClose, pathname }: SidebarProps) {
  return (
    <aside
      className={`admin-sidebar sticky top-0 z-40 flex h-screen w-72 flex-col border-l border-white/10 bg-[var(--admin-sidebar)]/95 px-4 pb-6 pt-6 shadow-2xl shadow-slate-950/40 lg:block ${
        isOpen ? 'block' : 'hidden lg:block'
      }`}
    >
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-900/60">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12l7-8 9 8-9 8-7-8z" />
            <path d="M12 4v16" opacity="0.4" />
          </svg>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Azuxa Admin</p>
          <p className="text-lg font-semibold text-white">运营中心</p>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto pr-2">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{section.label}</p>
            <div className="mt-3 space-y-2">
              {section.items.map((entry) => (
                <NavItem
                  key={entry.href}
                  entry={entry}
                  isActive={matchNavEntry(pathname, entry)}
                  onNavigate={onClose}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
        <p className="text-sm font-medium">系统健康</p>
        <p className="mt-1 text-xs text-slate-400">CPU 45% - 内存 63%</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">安全态势</p>
            <p className="text-lg font-semibold text-white">正常</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
            +2.4%
          </span>
        </div>
      </div>
    </aside>
  )
}
