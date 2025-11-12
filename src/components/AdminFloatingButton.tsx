'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AdminFloatingButtonProps {
  onNewCategory: () => void
}

export default function AdminFloatingButton({ onNewCategory }: AdminFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 按钮组 */}
      <div className={`flex mb-6 flex-col gap-3 transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
        {/* 新建分类按钮 */}
        <button
          onClick={() => {
            setIsOpen(false)
            onNewCategory()
          }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/40 bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 active:scale-95"
          title="新建分类"
          style={{
            transitionDelay: isOpen ? '0ms' : '0ms'
          }}
        >
          <svg className="h-6 w-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </button>

        {/* 新建文章按钮 */}
        <Link
          href="/admin/articles/new/edit"
          onClick={() => setIsOpen(false)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-300/40 bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 active:scale-95"
          title="新建文章"
          style={{
            transitionDelay: isOpen ? '50ms' : '0ms'
          }}
        >
          <svg className="h-6 w-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </Link>
      </div>

      {/* 主按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--admin-primary)] text-white shadow-2xl shadow-blue-500/40 transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
        title={isOpen ? '关闭' : '新建'}
      >
        <svg className="h-6 w-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  )
}

