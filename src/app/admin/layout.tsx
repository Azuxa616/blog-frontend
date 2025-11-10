'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar, PageContainer } from './_components'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isAuthRoute = pathname?.startsWith('/admin/login')

  if (isAuthRoute) {
    return <div className="admin min-h-screen bg-[var(--admin-background)] text-[var(--admin-foreground)]">{children}</div>
  }

  return (
    <div className="admin relative flex max-h-screen bg-[var(--admin-background)] text-[var(--admin-foreground)]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} pathname={pathname} />

      <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-[var(--admin-background)]">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-12 h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[140px]" />
        </div>

        <main className="relative flex-1 overflow-y-auto">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>


      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
