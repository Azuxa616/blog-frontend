'use client'

import { useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import ImageUploader from './ImageUploader'
import { Article, ArticleStatus } from '@/types/article'
import { Category } from '@/types/category'
import { Tag } from '@/types/tag'
import { renderMarkdownWithComponents } from '@/lib/utils/markdownRenderer/markdownRenderer'

type EditorMode = 'write' | 'preview' | 'split'

interface ArticleEditorProps {
  initialData?: Partial<Article>
  categories?: Category[]
  tags?: Tag[]
  onChange?: (payload: ArticleDraftPayload) => void
  onSaveDraft?: (payload: ArticleDraftPayload) => Promise<void> | void
  onPublish?: (payload: ArticleDraftPayload) => Promise<void> | void
}

type EditorMetaState = {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  categoryId: string
  status: ArticleStatus
  publishedAt: string
  tagNames: string[]
  isRepost: boolean
  originalAuthor: string
  originalLink: string
}

export interface ArticleDraftPayload {
  meta: EditorMetaState
  content: string
  publishedAtISO?: string
}

const viewModes: { id: EditorMode; label: string; description: string }[] = [
  { id: 'write', label: '写作', description: '专注编辑 Markdown' },
  { id: 'split', label: '并排', description: '左右同步预览' },
  { id: 'preview', label: '预览', description: '阅读渲染效果' },
]

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

const isoToInputValue = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (num: number) => num.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const toIsoString = (value?: string) => {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

const createInitialMeta = (initialData?: Partial<Article>): EditorMetaState => ({
  title: initialData?.title ?? '',
  slug: initialData?.slug ?? '',
  excerpt: initialData?.excerpt ?? '',
  coverImage: initialData?.coverImage ?? '',
  categoryId: initialData?.categoryId ?? '',
  status: initialData?.status ?? ArticleStatus.DRAFT,
  publishedAt: isoToInputValue(initialData?.publishedAt),
  tagNames: initialData?.tags ?? [],
  isRepost: initialData?.isRepost ?? false,
  originalAuthor: initialData?.originalAuthor ?? '',
  originalLink: initialData?.originalLink ?? '',
})

// 统一样式类
const containerClass = 'rounded-3xl border border-slate-200 bg-white shadow-lg'
const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[var(--admin-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]/20'
const labelClass = ' block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2'
const buttonPrimaryClass =
  'rounded-xl bg-[var(--admin-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50'
const buttonSecondaryClass =
  'rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'

export default function ArticleEditor({
  initialData,
  categories = [],
  tags = [],
  onChange,
  onSaveDraft,
  onPublish,
}: ArticleEditorProps) {
  const [meta, setMeta] = useState<EditorMetaState>(() => createInitialMeta(initialData))
  const [content, setContent] = useState(initialData?.content ?? '')
  const [tagInput, setTagInput] = useState('')
  const [viewMode, setViewMode] = useState<EditorMode>('write')
  const [isMetaCollapsed, setIsMetaCollapsed] = useState(false)
  const [actionState, setActionState] = useState<{ intent: 'draft' | 'publish' | null; loading: boolean }>({
    intent: null,
    loading: false,
  })

  const previewNodes = useMemo(() => (content.trim() ? renderMarkdownWithComponents(content) : []), [content])
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  const emitChange = (nextMeta: EditorMetaState, nextContent: string) => {
    onChange?.({
      meta: nextMeta,
      content: nextContent,
      publishedAtISO: toIsoString(nextMeta.publishedAt),
    })
  }

  const updateMeta = <K extends keyof EditorMetaState>(field: K, value: EditorMetaState[K]) => {
    setMeta(prev => {
      const next = { ...prev, [field]: value }
      emitChange(next, content)
      return next
    })
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    emitChange(meta, value)
  }

  const handleTagAdd = (tagRaw: string) => {
    const tag = tagRaw.trim()
    if (!tag || meta.tagNames.includes(tag)) return
    const next = [...meta.tagNames, tag]
    updateMeta('tagNames', next)
    setTagInput('')
  }

  const handleTagRemove = (tag: string) => {
    const next = meta.tagNames.filter(item => item !== tag)
    updateMeta('tagNames', next)
  }

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === ' ') {
      event.preventDefault()
      handleTagAdd(tagInput)
    }
  }

  const handleSubmit = async (intent: 'draft' | 'publish') => {
    if (actionState.loading) return
    const payload: ArticleDraftPayload = {
      meta,
      content,
      publishedAtISO: toIsoString(meta.publishedAt),
    }
    setActionState({ intent, loading: true })
    try {
      if (intent === 'draft') {
        if (onSaveDraft) {
          await onSaveDraft(payload)
        }
      } else if (onPublish) {
        await onPublish(payload)
      }
    } finally {
      setActionState({ intent: null, loading: false })
    }
  }

  return (
    <div className={containerClass}>
      {/* 顶部标题栏 */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-4">
            <div>
              <label className={labelClass}>文章标题</label>
              <input
                value={meta.title}
                onChange={event => updateMeta('title', event.target.value)}
                placeholder="在此处输入文章标题"
                className="w-full rounded-xl border-0 bg-transparent text-2xl font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-600 whitespace-nowrap">Slug:</label>
              <input
                value={meta.slug}
                onChange={event => updateMeta('slug', event.target.value.replace(/\s+/g, '-').toLowerCase())}
                placeholder="例如：building-a-modern-cms"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[var(--admin-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]/20"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={actionState.loading}
              className={buttonSecondaryClass}
            >
              {actionState.loading && actionState.intent === 'draft' ? '保存中...' : '保存草稿'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('publish')}
              disabled={actionState.loading}
              className={buttonPrimaryClass}
            >
              {actionState.loading && actionState.intent === 'publish' ? '发布中...' : '发布'}
            </button>
          </div>
        </div>
        {/* 快速信息栏 */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 border border-slate-200">
            <span className="text-slate-500">状态:</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[meta.status]}`}>
              {statusLabels[meta.status]}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 border border-slate-200">
            <span className="text-slate-500">分类:</span>
            <span className="font-medium text-slate-700">
              {categories.find(item => item.id === meta.categoryId)?.name || '未选择'}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 border border-slate-200">
            <span className="text-slate-500">发布时间:</span>
            <span className="font-medium text-slate-700">
              {meta.publishedAt ? meta.publishedAt.replace('T', ' ') : '未设置'}
            </span>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex flex-col lg:flex-row">
        {/* 元信息侧边栏 - 可折叠 */}
        <aside
          className={`border-r border-slate-200 bg-slate-50/50 transition-all duration-300 ${
            isMetaCollapsed ? 'lg:w-0 lg:overflow-hidden' : 'lg:w-80'
          }`}
        >
          <div className="sticky top-0 p-6">
            {/* 折叠按钮 */}
            <button
              type="button"
              onClick={() => setIsMetaCollapsed(!isMetaCollapsed)}
              className="mb-4 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <span>内容元信息</span>
              <svg
                className={`h-5 w-5 transition-transform duration-300 ${isMetaCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 元信息表单 */}
            <div
              className={`space-y-5 overflow-hidden transition-all duration-300 ${
                isMetaCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'
              }`}
            >
              <div>
                <label htmlFor="category-select" className={labelClass}>分类</label>
                <select
                  id="category-select"
                  value={meta.categoryId}
                  onChange={event => updateMeta('categoryId', event.target.value)}
                  className={inputClass}
                  aria-label="选择文章分类"
                >
                  <option value="" disabled>
                    请选择分类
                  </option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="status-select" className={labelClass}>文章状态</label>
                  <select
                    id="status-select"
                    value={meta.status}
                    onChange={event => updateMeta('status', event.target.value as ArticleStatus)}
                    className={inputClass}
                    aria-label="选择文章状态"
                  >
                    {Object.values(ArticleStatus).map(status => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="published-at-input" className={labelClass}>发布时间</label>
                  <input
                    id="published-at-input"
                    type="datetime-local"
                    value={meta.publishedAt}
                    onChange={event => updateMeta('publishedAt', event.target.value)}
                    className={inputClass}
                    aria-label="设置发布时间"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>摘要</label>
                <textarea
                  value={meta.excerpt}
                  onChange={event => updateMeta('excerpt', event.target.value)}
                  rows={3}
                  placeholder="为列表页和 SEO 准备一段 80-120 字的摘要"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>封面图片</label>
                <input
                  value={meta.coverImage}
                  onChange={event => updateMeta('coverImage', event.target.value)}
                  placeholder="输入图片 URL 或上传后的地址"
                  className={inputClass}
                />
                <ImageUploader />
                {meta.coverImage && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                    <div
                      className="h-40 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${meta.coverImage})` }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>标签</label>
                <div className="mb-2 flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2 min-h-[2.5rem]">
                  {meta.tagNames.length === 0 && <span className="text-xs text-slate-400 self-center">暂无标签</span>}
                  {meta.tagNames.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 transition-colors hover:bg-slate-200"
                    >
                      #{tag}
                      <span className="text-slate-400 hover:text-slate-600">×</span>
                    </button>
                  ))}
                </div>
                <input
                  value={tagInput}
                  onChange={event => setTagInput(event.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="输入后回车即可添加标签"
                  className={inputClass}
                />
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags
                      .filter(tag => !meta.tagNames.includes(tag.name))
                      .slice(0, 6)
                      .map(tag => (
                        <button
                          type="button"
                          key={tag.id}
                          onClick={() => handleTagAdd(tag.name)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 transition-colors hover:border-[var(--admin-primary)] hover:text-[var(--admin-primary)]"
                        >
                          + {tag.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">转载设置</p>
                    <p className="text-xs text-slate-500">是否属于 Repost</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateMeta('isRepost', !meta.isRepost)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      meta.isRepost ? 'bg-[#000]' : 'bg-slate-300'
                    }`}
                    aria-label={meta.isRepost ? '关闭转载设置' : '开启转载设置'}
                    aria-pressed={meta.isRepost ? 'true' : 'false'}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        meta.isRepost ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {meta.isRepost && (
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <input
                      value={meta.originalAuthor}
                      onChange={event => updateMeta('originalAuthor', event.target.value)}
                      placeholder="原作者"
                      className={inputClass}
                    />
                    <input
                      value={meta.originalLink}
                      onChange={event => updateMeta('originalLink', event.target.value)}
                      placeholder="原文链接"
                      className={inputClass}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* 编辑器主区域 */}
        <div className="flex-1 p-6">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">正文内容</h3>
              <p className="text-sm text-slate-500">Markdown 输入，自动使用项目内渲染器预览</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {viewModes.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setViewMode(mode.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    viewMode === mode.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`grid gap-4 ${viewMode === 'split' ? 'lg:grid-cols-2' : ''}`}>
            {(viewMode === 'write' || viewMode === 'split') && (
              <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-600">
                  <span className="font-medium">Markdown 编辑</span>
                  <span className="text-slate-500">
                    {wordCount} 词 / {charCount} 字符
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={event => handleContentChange(event.target.value)}
                  placeholder="使用 Markdown 语法撰写文章。支持标题、列表、代码块、引用等常见语法。"
                  className="min-h-[400px] flex-1 resize-none bg-transparent px-5 py-4 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            )}

            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
                  <span className="font-medium">实时预览</span>
                  <span className="text-[var(--admin-primary)]">renderMarkdownWithComponents</span>
                </div>
                <div className="prose prose-slate max-w-none px-5 py-6">
                  {content.trim() ? (
                    previewNodes
                  ) : (
                    <p className="text-sm text-slate-400">开始输入内容以查看渲染效果</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
