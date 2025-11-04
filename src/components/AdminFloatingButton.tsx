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
      <div className={`flex flex-col gap-3 transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
        {/* 新建分类按钮 */}
        <button
          onClick={() => {
            setIsOpen(false)
            onNewCategory()
          }}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out flex items-center justify-center group transform hover:scale-110 active:scale-95 hover:-translate-y-1"
          title="新建分类"
          style={{
            transitionDelay: isOpen ? '0ms' : '0ms'
          }}
        >
          <svg className="w-6 h-6 transition-transform duration-200 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </button>

        {/* 新建文章按钮 */}
        <Link
          href="/admin/articles/new"
          onClick={() => setIsOpen(false)}
          className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out flex items-center justify-center group transform hover:scale-110 active:scale-95 hover:-translate-y-1"
          title="新建文章"
          style={{
            transitionDelay: isOpen ? '50ms' : '0ms'
          }}
        >
          <svg className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </Link>
      </div>

      {/* 主按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-out flex items-center justify-center transform hover:scale-110 active:scale-95 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
        title={isOpen ? '关闭' : '新建'}
      >
        <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  )
}

