'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Article, ArticleStatus } from '@/types/article'
import { Category } from '@/types/category'
import { Tag } from '@/types/tag'
import ArticleEditor, { ArticleDraftPayload } from '@/app/admin/_components/ArticleEditor'
import Modal from '@/components/Modal'
import { renderMarkdownWithComponents } from '@/lib/utils/markdownRenderer/markdownRenderer'

interface ApiResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

// 状态标签和样式（与 ArticleEditor 保持一致）
const statusStyles: Record<ArticleStatus, string> = {
  [ArticleStatus.DRAFT]: 'bg-slate-100 text-slate-700 border border-slate-200',
  [ArticleStatus.PUBLISHED]: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  [ArticleStatus.ARCHIVED]: 'bg-amber-50 text-amber-700 border border-amber-200',
  [ArticleStatus.HIDDEN]: 'bg-rose-50 text-rose-700 border border-rose-200',
}

const statusLabels: Record<ArticleStatus, string> = {
  [ArticleStatus.DRAFT]: '草稿',
  [ArticleStatus.PUBLISHED]: '已发布',
  [ArticleStatus.ARCHIVED]: '已归档',
  [ArticleStatus.HIDDEN]: '已隐藏',
}

export default function ArticleEditPage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string
  const isNew = articleId === 'new'

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [article, setArticle] = useState<Partial<Article> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingPayload, setPendingPayload] = useState<ArticleDraftPayload | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // 加载分类和标签列表
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 加载分类
        const categoriesResponse = await fetch('/api/categories', {
          method: 'GET',
          credentials: 'include',
        })
        const categoriesData: ApiResponse = await categoriesResponse.json()
        if (categoriesResponse.ok && categoriesData.success && categoriesData.data && Array.isArray(categoriesData.data)) {
          setCategories(categoriesData.data)
        }

        // 加载标签
        const tagsResponse = await fetch('/api/tags', {
          method: 'GET',
          credentials: 'include',
        })
        const tagsData: ApiResponse = await tagsResponse.json()
        if (tagsResponse.ok && tagsData.success && tagsData.data && Array.isArray(tagsData.data)) {
          setTags(tagsData.data)
        }
      } catch (err) {
        console.error('获取数据错误:', err)
      }
    }

    fetchData()
  }, [])

  // 加载文章数据（编辑模式）或从sessionStorage获取（新建模式）
  useEffect(() => {
    const loadArticleData = async () => {
      try {
        setLoading(true)
        setError('')

        if (isNew) {
          // 新建模式：尝试从sessionStorage获取拖拽上传的数据
          const draftData = sessionStorage.getItem('articleDraft')
          if (draftData) {
            try {
              const parsed = JSON.parse(draftData)
              setArticle({
                title: parsed.title || '',
                content: parsed.content || '',
                excerpt: parsed.excerpt || '',
                coverImage: parsed.coverImage || '',
                categoryId: parsed.categoryId || '',
                status: parsed.status || ArticleStatus.DRAFT,
                tags: parsed.tagNames || parsed.tags || [],
                isRepost: parsed.isRepost || false,
                originalAuthor: parsed.originalAuthor || '',
                originalLink: parsed.originalLink || '',
              })
              // 清除sessionStorage
              sessionStorage.removeItem('articleDraft')
            } catch (e) {
              console.error('解析草稿数据失败:', e)
            }
          } else {
            // 空状态初始化
            setArticle(null)
          }
        } else {
          // 编辑模式：从API加载文章数据
          const response = await fetch(`/api/articles/${articleId}`, {
            method: 'GET',
            credentials: 'include',
          })

          const data: ApiResponse = await response.json()

          if (response.ok && data.success && data.data) {
            const articleData = data.data
            // 转换为 Article 格式
            setArticle({
              id: articleData.id,
              title: articleData.title || '',
              slug: articleData.slug || '',
              content: articleData.content || '',
              excerpt: articleData.excerpt || '',
              coverImage: articleData.coverImage || '',
              categoryId: articleData.categoryId || '',
              status: (articleData.status?.toUpperCase() || ArticleStatus.DRAFT) as ArticleStatus,
              tags: articleData.tagNames || articleData.tags || [],
              publishedAt: articleData.publishedAt || articleData.publishDate,
              isRepost: articleData.isRepost || false,
              originalAuthor: articleData.originalAuthor || '',
              originalLink: articleData.originalLink || '',
            })
          } else {
            if (response.status === 401) {
              router.push(`/admin/login?redirect=/admin/articles/${articleId}/edit`)
              return
            }
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
  }, [articleId, isNew, router])

  // 处理保存草稿和发布：打开确认弹窗
  const handleSaveDraft = async (payload: ArticleDraftPayload) => {
    setPendingPayload(payload)
    setIsModalOpen(true)
  }

  const handlePublish = async (payload: ArticleDraftPayload) => {
    setPendingPayload(payload)
    setIsModalOpen(true)
  }

  // 确认提交文章
  const handleConfirmSubmit = async () => {
    if (!pendingPayload || submitting) return

    setSubmitting(true)
    setError('')

    try {
      const submitData = {
        title: pendingPayload.meta.title.trim(),
        content: pendingPayload.content.trim(),
        slug: pendingPayload.meta.slug.trim() || undefined,
        excerpt: pendingPayload.meta.excerpt.trim() || undefined,
        coverImage: pendingPayload.meta.coverImage.trim() || undefined,
        categoryId: pendingPayload.meta.categoryId,
        status: pendingPayload.meta.status,
        tagNames: pendingPayload.meta.tagNames.filter(t => t.trim()),
        isRepost: pendingPayload.meta.isRepost,
        originalAuthor: pendingPayload.meta.originalAuthor.trim() || undefined,
        originalLink: pendingPayload.meta.originalLink.trim() || undefined,
      }

      let response: Response
      if (isNew) {
        // console.log('isNew', submitData)
        // 新建文章：使用 POST
        response = await fetch('/api/articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(submitData),
        })
      } else {

        // 更新文章：使用 PUT
        // console.log('isUpdate', submitData)
        response = await fetch(`/api/articles/${articleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(submitData),
        })
      }

      const data: ApiResponse = await response.json()

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          router.push(`/admin/login?redirect=/admin/articles/${articleId}/edit`)
          return
        }
        throw new Error(data.error || (isNew ? '创建文章失败' : '更新文章失败'))
      }

      // 提交成功，关闭弹窗并跳转
      setIsModalOpen(false)
      setPendingPayload(null)
      router.push('/admin/content')
    } catch (err) {
      console.error('提交文章错误:', err)
      setError(err instanceof Error ? err.message : '提交文章失败')
    } finally {
      setSubmitting(false)
    }
  }

  // 取消提交
  const handleCancelSubmit = () => {
    setIsModalOpen(false)
    setPendingPayload(null)
    setError('')
  }

  // 渲染预览内容
  const previewNodes = useMemo(() => {
    if (!pendingPayload?.content) return []
    return renderMarkdownWithComponents(pendingPayload.content)
  }, [pendingPayload?.content])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
    <>
      <ArticleEditor
        initialData={article || undefined}
        categories={categories}
        tags={tags}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />
      {/* 确认提交文章弹窗 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelSubmit}
        title="确认提交文章"
        size="xl"
      >
        {pendingPayload && (
          <div className="space-y-6">
            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* 文章元信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">文章信息</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">标题</label>
                  <p className="mt-1 text-sm text-slate-900">{pendingPayload.meta.title || '未设置'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Slug</label>
                  <p className="mt-1 text-sm text-slate-900 font-mono">{pendingPayload.meta.slug || '未设置'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">分类</label>
                  <p className="mt-1 text-sm text-slate-900">
                    {categories.find(c => c.id === pendingPayload.meta.categoryId)?.name || '未选择'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">状态</label>
                  <p className="mt-1">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[pendingPayload.meta.status]}`}>
                      {statusLabels[pendingPayload.meta.status]}
                    </span>
                  </p>
                </div>
                {pendingPayload.meta.excerpt && (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">摘要</label>
                    <p className="mt-1 text-sm text-slate-700">{pendingPayload.meta.excerpt}</p>
                  </div>
                )}
                {pendingPayload.meta.tagNames.length > 0 && (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">标签</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {pendingPayload.meta.tagNames.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {pendingPayload.meta.isRepost && (
                  <>
                    {pendingPayload.meta.originalAuthor && (
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">原作者</label>
                        <p className="mt-1 text-sm text-slate-900">{pendingPayload.meta.originalAuthor}</p>
                      </div>
                    )}
                    {pendingPayload.meta.originalLink && (
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">原文链接</label>
                        <p className="mt-1 text-sm text-slate-900 break-all">
                          <a href={pendingPayload.meta.originalLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {pendingPayload.meta.originalLink}
                          </a>
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 文章预览 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">内容预览</h3>
              <div className="prose prose-slate max-w-none border border-slate-200 rounded-lg p-6 bg-slate-50 max-h-[400px] overflow-y-auto">
                {previewNodes.length > 0 ? (
                  previewNodes
                ) : (
                  <p className="text-sm text-slate-400">暂无内容</p>
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancelSubmit}
                disabled={submitting}
                className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#000] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isNew ? '创建中...' : '更新中...'}
                  </>
                ) : (
                  '确认提交'
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

