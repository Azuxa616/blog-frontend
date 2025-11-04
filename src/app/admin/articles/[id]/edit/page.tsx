'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArticleStatus } from '@/types/article'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  color?: string
}

interface ArticleFormData {
  title: string
  content: string
  excerpt: string
  coverImage: string
  categoryId: string
  status: ArticleStatus
  tagNames: string[]
  isRepost: boolean
  originalAuthor: string
  originalLink: string
}

interface ApiResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

export default function ArticleEditPage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string
  const isNew = articleId === 'new'

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    categoryId: '',
    status: ArticleStatus.DRAFT,
    tagNames: [],
    isRepost: false,
    originalAuthor: '',
    originalLink: '',
  })

  // 加载分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories', {
          method: 'GET',
          credentials: 'include',
        })

        const data: ApiResponse = await response.json()

        if (response.ok && data.success && data.data && Array.isArray(data.data)) {
          setCategories(data.data)
        }
      } catch (err) {
        console.error('获取分类列表错误:', err)
      }
    }

    fetchCategories()
  }, [])

  // 加载文章数据（编辑模式）或从sessionStorage获取（新建模式）
  useEffect(() => {
    const loadArticleData = async () => {
      try {
        setLoading(true)

        if (isNew) {
          // 新建模式：尝试从sessionStorage获取拖拽上传的数据
          const draftData = sessionStorage.getItem('articleDraft')
          if (draftData) {
            try {
              const parsed = JSON.parse(draftData)
              setFormData(prev => ({
                ...prev,
                ...parsed,
                tagNames: parsed.tagNames || [],
              }))
              // 清除sessionStorage
              sessionStorage.removeItem('articleDraft')
            } catch (e) {
              console.error('解析草稿数据失败:', e)
            }
          }
        } else {
          // 编辑模式：从API加载文章数据
          const response = await fetch(`/api/articles/${articleId}`, {
            method: 'GET',
            credentials: 'include',
          })

          const data: ApiResponse = await response.json()

          if (response.ok && data.success && data.data) {
            const article = data.data
            setFormData({
              title: article.title || '',
              content: article.content || '',
              excerpt: article.excerpt || '',
              coverImage: article.coverImage || '',
              categoryId: article.categoryId || '',
              status: article.status?.toUpperCase() as ArticleStatus || ArticleStatus.DRAFT,
              tagNames: article.tagNames || article.tags || [],
              isRepost: article.isRepost || false,
              originalAuthor: article.originalAuthor || '',
              originalLink: article.originalLink || '',
            })
          } else {
            setError(data.error || '加载文章失败')
          }
        }
      } catch (err) {
        console.error('加载文章数据错误:', err)
        setError(err instanceof Error ? err.message : '加载文章数据失败')
      } finally {
        setLoading(false)
      }
    }

    loadArticleData()
  }, [articleId, isNew])

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      // 验证必填字段
      if (!formData.title.trim()) {
        setError('标题不能为空')
        setSubmitting(false)
        return
      }

      if (!formData.content.trim()) {
        setError('内容不能为空')
        setSubmitting(false)
        return
      }

      if (!formData.categoryId) {
        setError('请选择分类')
        setSubmitting(false)
        return
      }

      // 准备提交数据
      const submitData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        coverImage: formData.coverImage.trim() || undefined,
        categoryId: formData.categoryId,
        status: formData.status,
        tagNames: formData.tagNames.filter(t => t.trim()),
        isRepost: formData.isRepost,
        originalAuthor: formData.originalAuthor.trim() || undefined,
        originalLink: formData.originalLink.trim() || undefined,
      }

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submitData),
      })

      const data: ApiResponse = await response.json()

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          router.push('/admin/login?redirect=/admin/articles/new/edit')
          return
        }
        throw new Error(data.error || '保存文章失败')
      }

      setSuccess(true)
      
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push('/admin/content')
      }, 1500)
    } catch (err) {
      console.error('保存文章错误:', err)
      setError(err instanceof Error ? err.message : '保存文章失败')
    } finally {
      setSubmitting(false)
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isNew ? '新建文章' : '编辑文章'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isNew ? '创建一篇新文章' : '编辑文章内容'}
        </p>
      </div>

      {/* 成功提示 */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          文章保存成功！正在跳转...
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        {/* 标题 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文章标题"
            required
            disabled={submitting}
          />
        </div>

        {/* 内容 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={20}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="请输入文章内容（Markdown格式）"
            required
            disabled={submitting}
          />
        </div>

        {/* 分类 */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
            分类 <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            value={formData.categoryId}
            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={submitting}
          >
            <option value="">请选择分类</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 状态 */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            状态
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ArticleStatus }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={submitting}
          >
            <option value={ArticleStatus.DRAFT}>草稿</option>
            <option value={ArticleStatus.PUBLISHED}>已发布</option>
            <option value={ArticleStatus.ARCHIVED}>已归档</option>
            <option value={ArticleStatus.HIDDEN}>已隐藏</option>
          </select>
        </div>

        {/* 摘要 */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            摘要
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文章摘要（可选）"
            disabled={submitting}
          />
        </div>

        {/* 封面图 */}
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
            封面图URL
          </label>
          <input
            type="url"
            id="coverImage"
            value={formData.coverImage}
            onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
            disabled={submitting}
          />
        </div>

        {/* 标签 */}
        <div>
          <label htmlFor="tagNames" className="block text-sm font-medium text-gray-700 mb-2">
            标签
          </label>
          <input
            type="text"
            id="tagNames"
            value={formData.tagNames.join(', ')}
            onChange={(e) => {
              const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t)
              setFormData(prev => ({ ...prev, tagNames: tags }))
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="标签1, 标签2, 标签3（用逗号分隔）"
            disabled={submitting}
          />
        </div>

        {/* 转载相关 */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">转载信息</h3>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRepost}
                onChange={(e) => setFormData(prev => ({ ...prev, isRepost: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={submitting}
              />
              <span className="ml-2 text-sm text-gray-700">这是一篇转载文章</span>
            </label>
          </div>

          {formData.isRepost && (
            <>
              <div className="mb-4">
                <label htmlFor="originalAuthor" className="block text-sm font-medium text-gray-700 mb-2">
                  原作者
                </label>
                <input
                  type="text"
                  id="originalAuthor"
                  value={formData.originalAuthor}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalAuthor: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入原作者姓名"
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="originalLink" className="block text-sm font-medium text-gray-700 mb-2">
                  原文链接
                </label>
                <input
                  type="url"
                  id="originalLink"
                  value={formData.originalLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalLink: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/article"
                  disabled={submitting}
                />
              </div>
            </>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
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
                保存中...
              </>
            ) : (
              '保存文章'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

