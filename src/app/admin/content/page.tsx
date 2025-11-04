'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminFloatingButton from '@/components/AdminFloatingButton'
import CategoryCard from './CategoryCard'
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

interface Article {
  id: string
  title: string
  category: string
  categoryId: string
  status: string
  views: number
  publishDate: string
  author: string
  createdAt: string
  updatedAt: string
}

interface CategoryArticles {
  [categoryId: string]: Article[]
}

interface ApiResponse {
  success: boolean
  data?: Category[] | Category | {
    articles: Article[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  error?: string
  message?: string
}

export default function ContentPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [categoryArticles, setCategoryArticles] = useState<CategoryArticles>({})
  const [loadingCategories, setLoadingCategories] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [draggingOverCategory, setDraggingOverCategory] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '',
  })
  const router = useRouter()

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch('/api/categories', {
          method: 'GET',
          credentials: 'include',
        })

        const data: ApiResponse = await response.json()

        if (!response.ok || !data.success) {
          if (response.status === 401) {
            router.push('/admin/login?redirect=/admin/content')
            return
          }
          throw new Error(data.error || '获取分类列表失败')
        }

        if (data.data && Array.isArray(data.data)) {
          setCategories(data.data)
        }
      } catch (err) {
        console.error('获取分类列表错误:', err)
        setError(err instanceof Error ? err.message : '获取分类列表失败')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [router])

  // 获取特定分类下的文章
  const fetchCategoryArticles = async (categoryId: string) => {
    // 如果已经加载过，直接返回
    if (categoryArticles[categoryId]) {
      return
    }

    try {
      setLoadingCategories(prev => new Set(prev).add(categoryId))
      
      const response = await fetch(`/api/articles?categoryId=${categoryId}&limit=100`, {
        method: 'GET',
        credentials: 'include',
      })

      const data: ApiResponse = await response.json()

      if (response.ok && data.success && data.data && 'articles' in data.data) {
        const articlesData = data.data as { articles: Article[]; pagination: any }
        setCategoryArticles(prev => ({
          ...prev,
          [categoryId]: articlesData.articles
        }))
      }
    } catch (err) {
      console.error(`获取分类 ${categoryId} 的文章失败:`, err)
    } finally {
      setLoadingCategories(prev => {
        const newSet = new Set(prev)
        newSet.delete(categoryId)
        return newSet
      })
    }
  }

  // 处理分类展开
  const handleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
        // 加载该分类的文章
        fetchCategoryArticles(categoryId)
      }
      return newSet
    })
  }

  // 处理分类折叠
  const handleCategoryCollapse = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      newSet.delete(categoryId)
      return newSet
    })
  }

  // 过滤分类
  const filteredCategories = categories.filter(category => {
    if (!searchTerm) return true
    return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // 未展开的分类（用于Grid区显示）
  const gridCategories = filteredCategories.filter(cat => !expandedCategories.has(cat.id))
  
  // 已展开的分类（用于展开区显示）
  const expandedCategoriesList = filteredCategories.filter(cat => expandedCategories.has(cat.id))

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">已发布</span>
      case 'draft':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">草稿</span>
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '',
    })
    setEditingCategory(null)
    setError('')
  }

  // 打开模态框
  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        color: category.color || '',
      })
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  // 关闭模态框
  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  // 生成slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  // 处理名称变化
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories'
      
      const method = editingCategory ? 'PUT' : 'POST'
      
      const body = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        color: formData.color || undefined,
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      const data: ApiResponse = await response.json()

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          router.push('/admin/login?redirect=/admin/content')
          return
        }
        throw new Error(data.error || '操作失败')
      }

      // 重新获取分类列表
      const categoriesResponse = await fetch('/api/categories', {
        method: 'GET',
        credentials: 'include',
      })
      const categoriesData: ApiResponse = await categoriesResponse.json()
      
      if (categoriesData.success && categoriesData.data && Array.isArray(categoriesData.data)) {
        setCategories(categoriesData.data)
      }

      closeModal()
    } catch (err) {
      console.error('提交错误:', err)
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setSubmitting(false)
    }
  }

  // 处理文件拖拽上传
  const handleFileDrop = async (file: File, categoryId: string) => {
    try {
      // 解析Markdown文件
      const parsedData = await parseMarkdownFile(file, categoryId)
      
      // 将解析后的数据存储到sessionStorage
      sessionStorage.setItem('articleDraft', JSON.stringify({
        ...parsedData,
        categoryId, // 确保使用拖拽释放的分类
      }))
      
      // 导航到编辑页面
      router.push('/admin/articles/new/edit')
    } catch (error) {
      console.error('文件处理错误:', error)
      throw error
    }
  }

  // 删除分类
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个分类吗？此操作不可撤销。')) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data: ApiResponse = await response.json()

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          router.push('/admin/login?redirect=/admin/content')
          return
        }
        throw new Error(data.error || '删除失败')
      }

      // 更新分类列表
      setCategories(categories.filter(cat => cat.id !== id))
      // 如果该分类已展开，移除它
      handleCategoryCollapse(id)
      // 清除该分类的文章缓存
      setCategoryArticles(prev => {
        const newData = { ...prev }
        delete newData[id]
        return newData
      })
    } catch (err) {
      console.error('删除分类错误:', err)
      alert(err instanceof Error ? err.message : '删除失败')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">内容管理</h1>
          <p className="mt-2 text-gray-600">管理和组织您的博客分类和文章</p>
        </div>
      </div>

      {/* 错误提示 */}
      {error && !isModalOpen && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filter区 */}
      <div className="bg-white shadow rounded-lg p-6 slide-in-from-top-2">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200">
            搜索分类
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="输入分类名称或描述..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 focus:shadow-md"
          />
        </div>
      </div>

      {/* 展开区 */}
      {expandedCategoriesList.length > 0 && (
        <div className="space-y-4 slide-in-from-top-4">
          <h2 className="text-xl font-semibold text-gray-900">已展开的分类 ({expandedCategoriesList.length})</h2>
          {expandedCategoriesList.map((category, index) => {
            const isDraggingOver = draggingOverCategory === category.id
            
            const handleDragOver = (e: React.DragEvent) => {
              e.preventDefault()
              e.stopPropagation()
              setDraggingOverCategory(category.id)
            }

            const handleDragLeave = (e: React.DragEvent) => {
              e.preventDefault()
              e.stopPropagation()
              setDraggingOverCategory(null)
            }

            const handleDrop = async (e: React.DragEvent) => {
              e.preventDefault()
              e.stopPropagation()
              setDraggingOverCategory(null)

              const files = Array.from(e.dataTransfer.files)
              if (files.length === 0) return

              const file = files[0]
              
              if (!file.name.toLowerCase().endsWith('.md')) {
                alert('只能上传Markdown文件（.md格式）')
                return
              }

              try {
                await handleFileDrop(file, category.id)
              } catch (error) {
                console.error('文件处理错误:', error)
                alert(error instanceof Error ? error.message : '文件处理失败')
              }
            }

            return (
              <div
                key={category.id}
                className="bg-white shadow rounded-lg overflow-hidden transition-all duration-500 ease-out slide-in-from-left-4"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* 左侧：分类信息 */}
                  <div 
                    className={`lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50 relative transition-all ${
                      isDraggingOver ? 'ring-4 ring-blue-400 ring-offset-2 bg-blue-50' : ''
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {isDraggingOver && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg z-10">
                        <div className="text-center">
                          <svg 
                            className="w-12 h-12 mx-auto mb-2 animate-bounce text-blue-600" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-lg font-semibold text-blue-600">松开以上传</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                        {category.description && (
                          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                        )}
                        <div className="space-y-1 text-sm text-gray-500">
                          <div>文章数量: <span className="font-medium text-gray-900">{category.articleCount}</span></div>
                          <div>创建时间: <span className="font-medium text-gray-900">{category.createdAt}</span></div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCategoryCollapse(category.id)}
                        className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-all duration-200 hover:scale-110 active:scale-95"
                        title="折叠"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => openModal(category)}
                        className="text-sm text-blue-600 hover:text-blue-900 transition-all duration-200 hover:underline hover:scale-105 active:scale-95"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-sm text-red-600 hover:text-red-900 transition-all duration-200 hover:underline hover:scale-105 active:scale-95"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  {/* 右侧：文章列表 */}
                  <div className="lg:w-2/3 p-6">
                    {loadingCategories.has(category.id) ? (
                      <div className="flex items-center justify-center py-8">
                        <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="ml-2 text-gray-600">加载中...</span>
                      </div>
                    ) : categoryArticles[category.id]?.length > 0 ? (
                      <div className="space-y-2">
                        {categoryArticles[category.id].map((article, articleIndex) => (
                          <Link
                            key={article.id}
                            href={`/admin/articles/${article.id}/edit`}
                            className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 ease-out slide-in-from-right-2 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group"
                            style={{
                              animationDelay: `${articleIndex * 50}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{article.title}</div>
                                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                  {getStatusBadge(article.status)}
                                  <span>浏览量: {article.views.toLocaleString()}</span>
                                  <span>发布时间: {article.publishDate}</span>
                                </div>
                              </div>
                              <svg className="w-5 h-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>该分类下暂无文章</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 分类Grid区 */}
      <div className="fade-in">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 transition-all duration-300">
          分类列表 {gridCategories.length > 0 && `(${gridCategories.length})`}
        </h2>
        {gridCategories.length === 0 && filteredCategories.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center fade-in">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">暂无分类</h3>
            <p className="mt-1 text-sm text-gray-500">创建您的第一个分类来组织文章吧。</p>
          </div>
        ) : gridCategories.length === 0 && expandedCategoriesList.length > 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center fade-in">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">所有分类已展开</h3>
            <p className="mt-1 text-sm text-gray-500">请在上方展开区查看分类详情，或折叠部分分类以在此处显示。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gridCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                onExpand={handleCategoryExpand}
                onFileDrop={handleFileDrop}
              />
            ))}
          </div>
        )}
      </div>

      {/* 分类创建/编辑模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCategory ? '编辑分类' : '新增分类'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 错误提示 */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    分类名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="请输入分类名称"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    别名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="请输入分类别名（URL友好）"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    描述
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="请输入分类描述（可选）"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                    颜色
                  </label>
                  <input
                    type="text"
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="例如: #3B82F6 (可选)"
                    disabled={submitting}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingCategory ? '更新中...' : '创建中...'}
                      </>
                    ) : (
                      editingCategory ? '更新' : '创建'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 浮动操作按钮 */}
      <AdminFloatingButton onNewCategory={() => openModal()} />
    </div>
  )
}

