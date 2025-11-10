'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SketchPicker, ColorResult } from 'react-color'
import AdminFloatingButton from '@/components/AdminFloatingButton'
import Modal from '@/components/Modal'
import CategoryCard from './CategoryCard'
import { PageHeader } from '../_components'
import { parseMarkdownFile } from './utils/parseMarkdownFile'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  color?: string
  icon?: string
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
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '',
    icon: '',
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

  const totalArticles = categories.reduce((sum, current) => sum + current.articleCount, 0)
  const expandedArticleCount = expandedCategoriesList.reduce(
    (sum, current) => sum + (categoryArticles[current.id]?.length ?? 0),
    0
  )

  const summaryCards = [
    { label: '分类总数', value: categories.length.toString(), hint: '全部可用分类' },
    { label: '展开中', value: expandedCategoriesList.length.toString(), hint: '当前展开面板' },
    { label: '文章总量', value: totalArticles.toString(), hint: '含草稿与已发布' },
    { label: '已加载文章', value: expandedArticleCount.toString(), hint: '缓存中的明细' },
  ]

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
      icon: '',
    })
    setEditingCategory(null)
    setError('')
    setShowColorPicker(false)
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
        icon: category.icon || '',
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
        icon: formData.icon || undefined,
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
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200/40 bg-white/80 px-8 py-10 text-center shadow-xl shadow-slate-900/5">
          <svg className="mx-auto h-10 w-10 animate-spin text-[var(--admin-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-sm font-medium text-slate-600">正在同步分类与文章...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="内容管理"
        description="统一管理所有内容资产、分类架构与批量导入。"
        actions={
          <button
            type="button"
            onClick={() => openModal()}
            className="rounded-2xl bg-[var(--admin-primary)] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[var(--admin-primary-hover)]"
          >
            新建分类
          </button>
        }
      />

      {/* 错误提示 */}
      {error && !isModalOpen && (
        <div className="rounded-3xl border border-red-200/60 bg-red-50/80 px-5 py-4 text-sm font-medium text-red-700 shadow-sm shadow-red-200/50">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-slate-900/5 lg:col-span-2">
          <label htmlFor="search" className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            搜索分类
          </label>
          <div className="mt-3 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="输入分类名称、描述或关键字"
                className="w-full rounded-2xl border border-slate-300/70 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--admin-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]/20"
              />
            </div>
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
            >
              清除
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {filteredCategories.length} 个匹配结果 · {gridCategories.length} 个待展开
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-slate-200/60 bg-white/90 p-4 shadow-md shadow-slate-900/5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
              <p className="text-xs text-slate-500">{card.hint}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 展开区 */}
      {expandedCategoriesList.length > 0 && (
        <div className="space-y-6 rounded-3xl border border-slate-200/60 bg-white/95 p-6 shadow-xl shadow-slate-900/5 slide-in-from-top-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">已展开的分类 ({expandedCategoriesList.length})</h2>
              <p className="text-sm text-slate-500">拖拽 Markdown 文件到左侧面板即可完成快速导入。</p>
            </div>
            <button
              type="button"
              onClick={() => setExpandedCategories(new Set())}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              折叠全部
            </button>
          </div>
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
                className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-900/5 transition-all duration-500 ease-out slide-in-from-left-4"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* 左侧：分类信息 */}
                  <div 
                    className={`relative lg:w-1/3 border-b border-slate-100/80 bg-slate-50/80 p-6 transition-all lg:border-b-0 lg:border-r ${
                      isDraggingOver ? 'ring-4 ring-[var(--admin-primary)]/30 ring-offset-2 bg-blue-50' : ''
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
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">分类</p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">{category.name}</h3>
                        {category.description && (
                          <p className="mt-2 text-sm text-slate-500">{category.description}</p>
                        )}
                        <div className="mt-4 space-y-1 text-sm text-slate-500">
                          <div>文章数量: <span className="font-medium text-slate-900">{category.articleCount}</span></div>
                          <div>创建时间: <span className="font-medium text-slate-900">{category.createdAt}</span></div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCategoryCollapse(category.id)}
                        className="ml-4 rounded-xl border border-slate-200 p-2 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
                        title="折叠"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => openModal(category)}
                        className="rounded-2xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="rounded-2xl border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:border-red-300"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  {/* 右侧：文章列表 */}
                  <div className="lg:w-2/3 p-6">
                    {loadingCategories.has(category.id) ? (
                      <div className="flex items-center justify-center py-8 text-slate-500">
                        <svg className="h-6 w-6 animate-spin text-[var(--admin-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="ml-2">加载中...</span>
                      </div>
                    ) : categoryArticles[category.id]?.length > 0 ? (
                      <div className="space-y-3">
                        {categoryArticles[category.id].map((article, articleIndex) => (
                          <Link
                            key={article.id}
                            href={`/admin/articles/${article.id}/edit`}
                            className="group block rounded-2xl border border-slate-100/80 p-4 transition-all duration-300 ease-out hover:border-[var(--admin-primary)]/40 hover:bg-slate-50/60 hover:shadow-md slide-in-from-right-2"
                            style={{
                              animationDelay: `${articleIndex * 50}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            <div className="flex items-center justify-between gap-4">
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
                        <button onClick={()=>{}} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">新增文章</button>
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
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? '编辑分类' : '新增分类'}
        size="sm"
      >
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
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line react/forbid-dom-props */}
                      <div
                        className="w-10 h-10 rounded-md border-2 border-gray-300 cursor-pointer flex-shrink-0"
                        style={{ backgroundColor: formData.color || '#ffffff' }}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        title="点击选择颜色"
                      />
                      <input
                        type="text"
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="例如: #3B82F6 (可选)"
                        disabled={submitting}
                      />
                    </div>
                    {showColorPicker && (
                      <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setShowColorPicker(false)} />
                        <div className="absolute z-[70] mt-2 left-0">
                          <SketchPicker
                            color={formData.color || '#ffffff'}
                            onChange={(color: ColorResult) => {
                              setFormData(prev => ({ ...prev, color: color.hex }))
                            }}
                            onChangeComplete={(color: ColorResult) => {
                              setFormData(prev => ({ ...prev, color: color.hex }))
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                    图标
                  </label>
                  <input
                    type="text"
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="请输入图标名称或URL (可选)"
                    disabled={submitting}
                  />
                  <p className="mt-1 text-xs text-gray-500">支持图标名称（如：home, user）或图标URL</p>
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
      </Modal>

      {/* 浮动操作按钮 */}
      <AdminFloatingButton onNewCategory={() => openModal()} />
    </div>
  )
}

