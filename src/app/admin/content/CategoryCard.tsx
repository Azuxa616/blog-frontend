'use client'

import { useState } from 'react'
interface Category {
  id: string
  name: string
  slug: string
  description: string
  color?: string
  articleCount: number
  createdAt: string
  updatedAt: string
}

interface CategoryCardProps {
  category: Category
  index: number
  onExpand: (categoryId: string) => void
  onFileDrop?: (file: File, categoryId: string) => void
}

export default function CategoryCard({ category, index, onExpand, onFileDrop }: CategoryCardProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const accentColor = category.color || '#2563eb'

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    const file = files[0]
    
    // 验证文件扩展名
    if (!file.name.toLowerCase().endsWith('.md')) {
      alert('只能上传Markdown文件（.md格式）')
      return
    }

    // 如果有onFileDrop回调，调用它
    if (onFileDrop) {
      try {
        await onFileDrop(file, category.id)
      } catch (error) {
        console.error('文件处理错误:', error)
        alert(error instanceof Error ? error.message : '文件处理失败')
      }
    }
  }

  return (
    <div
      onClick={() => onExpand(category.id)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-3xl border border-slate-100/80 bg-white/95 p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--admin-primary)]/50 hover:shadow-2xl active:scale-[0.99] slide-in-from-bottom-4 ${
        isDraggingOver ? 'ring-4 ring-[var(--admin-primary)]/40 ring-offset-2' : ''
      }`}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both',
        borderColor: isDraggingOver ? accentColor : undefined,
      }}
    >
      <div className="group relative text-slate-900">
        {isDraggingOver && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-black/20">
            <div className="text-center">
              <svg 
                className="mx-auto mb-2 h-12 w-12 animate-bounce text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-semibold text-white">松开以上传</p>
            </div>
          </div>
        )}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Category</p>
            <h3 className="mt-2 text-xl font-semibold transition-transform duration-200 group-hover:translate-x-1">
              {category.name}
            </h3>
          </div>
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-white"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #0f172a)` }}
          >
            {category.name.slice(0, 1).toUpperCase()}
          </span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-slate-500 transition-opacity duration-200 group-hover:text-slate-600">
          {category.description || '暂无描述'}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span className="font-medium text-slate-700">{category.articleCount} 篇文章</span>
          <svg 
            className="h-5 w-5 text-slate-400 transition-all duration-200 group-hover:text-slate-600 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

