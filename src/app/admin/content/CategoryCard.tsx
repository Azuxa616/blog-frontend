'use client'

import { useState } from 'react'
import { parseMarkdownFile } from './utils/parseMarkdownFile'

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
      className={`bg-white shadow 
      rounded-lg p-6 cursor-pointer 
      hover:shadow-xl transition-all duration-300 ease-out 
      transform hover:scale-105 hover:-translate-y-1 
      active:scale-100 slide-in-from-bottom-4
      ${isDraggingOver ? 'ring-4 ring-blue-400 ring-offset-2 scale-110 shadow-2xl' : ''}`}
      style={{
        backgroundColor: category.color || '#3B82F6',
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className="text-white group relative">
        {isDraggingOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg z-10">
            <div className="text-center">
              <svg 
                className="w-12 h-12 mx-auto mb-2 animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-semibold">松开以上传</p>
            </div>
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2 transition-transform duration-200 group-hover:translate-x-1">
          {category.name}
        </h3>
        <p className="text-sm opacity-90 mb-3 line-clamp-2 transition-opacity duration-200 group-hover:opacity-100">
          {category.description || '无描述'}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-80 transition-opacity duration-200 group-hover:opacity-100">
            {category.articleCount} 篇文章
          </span>
          <svg 
            className="w-5 h-5 opacity-80 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1" 
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

