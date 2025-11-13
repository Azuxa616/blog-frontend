'use client'

import { useMemo, useState, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { Article, ArticleStatus } from '@/types/article'
import { Category } from '@/types/category'
import { Tag } from '@/types/tag'
import { renderMarkdownWithComponents } from '@/lib/utils/markdownRenderer/markdownRenderer'
import ImagePicker from './ImagePicker'
import { isoToInputValue, toIsoString } from '@/lib/utils/iso'
import Image from 'next/image'
// ==================== 类型定义 ====================
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

// ==================== 常量定义 ====================
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

// ==================== 样式常量 ====================
const containerClass = 'rounded-3xl border border-slate-200 bg-white shadow-lg'
const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[var(--admin-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]/20'
const labelClass = ' block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2'
const buttonPrimaryClass =
  'cursor-pointer rounded-xl bg-[#000] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50'
const buttonSecondaryClass =
  'cursor-pointer rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'

// ==================== 工具函数 ====================

//创建初始元数据
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

// ==================== 子组件：顶部标题栏 ====================
interface HeaderBarProps {
  meta: EditorMetaState
  initialData?: Partial<Article>
  categories: Category[]
  actionState: { loading: boolean }
  onUpdateMeta: <K extends keyof EditorMetaState>(field: K, value: EditorMetaState[K]) => void
  onSubmit: () => void
}

function HeaderBar({ meta, initialData, categories, actionState, onUpdateMeta, onSubmit }: HeaderBarProps) {
  // 根据文章状态动态决定按钮文本和样式
  // 草稿状态显示次要样式，发布状态显示主要样式
  const getButtonText = () => {
    if (actionState.loading) {
      return meta.status === ArticleStatus.DRAFT ? '保存中...' : '发布中...'
    }
    return meta.status === ArticleStatus.DRAFT ? '保存草稿' : '发布文章'
  }

  const getButtonClassName = () => {
    return meta.status === ArticleStatus.DRAFT ? buttonSecondaryClass : buttonPrimaryClass
  }

  return (
    <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 space-y-4">
          <div>
            <label className={labelClass}>文章标题</label>
            <input
              value={meta.title}
              onChange={event => onUpdateMeta('title', event.target.value)}
              placeholder="在此处输入文章标题"
              className="px-2 w-full rounded-xl border-0 bg-transparent text-2xl font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-600 whitespace-nowrap">Slug:</label>
            <input
              value={meta.slug}
              // 自动格式化 slug：空格转连字符，转为小写
              onChange={event => onUpdateMeta('slug', event.target.value.replace(/\s+/g, '-').toLowerCase())}
              placeholder="例如：building-a-modern-cms"
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[var(--admin-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]/20"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onSubmit}
            disabled={actionState.loading}
            className={getButtonClassName()}
          >
            <div className="flex gap-4">
              {(meta.status === ArticleStatus.DRAFT) ?
                <Image
                  src="/svgs/draft.svg"
                  alt="draft"
                  width={20}
                  height={20}
                /> : <Image
                  src="/svgs/publish.svg"
                  alt="publish"
                  width={20}
                  height={20}
                />
              }
              {getButtonText()}
            </div>
          </button>
        </div>
      </div>
      {/* 快速信息栏 - 使用 initialData（数据库中的原始数据）而不是 meta（当前编辑状态） */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 border border-slate-200">
          <span className="text-slate-500">状态:</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[initialData?.status ?? ArticleStatus.DRAFT]}`}>
            {statusLabels[initialData?.status ?? ArticleStatus.DRAFT]}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 border border-slate-200">
          <span className="text-slate-500">分类:</span>
          <span className="font-medium text-slate-700">
            {categories.find(item => item.id === initialData?.categoryId)?.name || '未选择'}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 border border-slate-200">
          <span className="text-slate-500">发布时间:</span>
          <span className="font-medium text-slate-700">
            {initialData?.publishedAt ? isoToInputValue(initialData.publishedAt).replace('T', ' ') : '未设置'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ==================== 子组件：标签输入 ====================
interface TagInputProps {
  tagInput: string
  tags: Tag[]
  selectedTags: string[]
  onTagInputChange: (value: string) => void
  onTagAdd: (tag: string) => void
  onTagRemove: (tag: string) => void
  onTagKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
}

function TagInput({
  tagInput,
  tags,
  selectedTags,
  onTagInputChange,
  onTagAdd,
  onTagRemove,
  onTagKeyDown,
}: TagInputProps) {
  return (
    <div>
      <label className={labelClass}>标签</label>
      <input
        value={tagInput}
        onChange={event => onTagInputChange(event.target.value)}
        onKeyDown={onTagKeyDown}
        placeholder="输入后回车即可添加标签"
        className={inputClass}
      />

      {/* 显示可用的标签建议，最多显示 6 个，排除已选标签 */}
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags
            .filter(tag => !selectedTags.includes(tag.name))
            .slice(0, 6)
            .map(tag => (
              <button
                type="button"
                key={tag.id}
                onClick={() => onTagAdd(tag.name)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 transition-colors hover:border-[var(--admin-primary)] hover:text-[var(--admin-primary)]"
              >
                + {tag.name}
              </button>
            ))}
        </div>
      )}
      <div className="mb-2 flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2 min-h-[2.5rem]">
        {selectedTags.length === 0 && <span className="text-xs text-slate-400 self-center">暂无标签</span>}
        {selectedTags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => onTagRemove(tag)}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 transition-colors hover:bg-slate-200"
          >
            #{tag}
            <span className="text-slate-400 hover:text-slate-600">×</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ==================== 子组件：转载设置 ====================
interface RepostSettingsProps {
  isRepost: boolean
  originalAuthor: string
  originalLink: string
  onToggleRepost: () => void
  onUpdateAuthor: (value: string) => void
  onUpdateLink: (value: string) => void
}

function RepostSettings({
  isRepost,
  originalAuthor,
  originalLink,
  onToggleRepost,
  onUpdateAuthor,
  onUpdateLink,
}: RepostSettingsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">转载设置</p>
          <p className="text-xs text-slate-500">是否属于 Repost</p>
        </div>
        <button
          type="button"
          onClick={onToggleRepost}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isRepost ? 'bg-[#000]' : 'bg-slate-300'
            }`}
          aria-label={isRepost ? '关闭转载设置' : '开启转载设置'}
          {...(isRepost ? { 'aria-pressed': 'true' } : { 'aria-pressed': 'false' })}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isRepost ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
        </button>
      </div>
      {isRepost && (
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <input
            value={originalAuthor}
            onChange={event => onUpdateAuthor(event.target.value)}
            placeholder="原作者"
            className={inputClass}
          />
          <input
            value={originalLink}
            onChange={event => onUpdateLink(event.target.value)}
            placeholder="原文链接"
            className={inputClass}
          />
        </div>
      )}
    </div>
  )
}

// ==================== 子组件：元信息表单 ====================
interface MetaFormProps {
  meta: EditorMetaState
  categories: Category[]
  tags: Tag[]
  tagInput: string
  onUpdateMeta: <K extends keyof EditorMetaState>(field: K, value: EditorMetaState[K]) => void
  onTagInputChange: (value: string) => void
  onTagAdd: (tag: string) => void
  onTagRemove: (tag: string) => void
  onTagKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
}

function MetaForm({
  meta,
  categories,
  tags,
  tagInput,
  onUpdateMeta,
  onTagInputChange,
  onTagAdd,
  onTagRemove,
  onTagKeyDown,
}: MetaFormProps) {
  return (
    <div className="space-y-5">
      {/* 文章分类 */}
      <div>
        <label htmlFor="category-select" className={labelClass}>分类</label>
        <select
          id="category-select"
          value={meta.categoryId}
          onChange={event => onUpdateMeta('categoryId', event.target.value)}
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

      {/* 文章状态和发布时间 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status-select" className={labelClass}>文章状态</label>
          <select
            id="status-select"
            value={meta.status}
            onChange={event => onUpdateMeta('status', event.target.value as ArticleStatus)}
            className={inputClass}
            aria-label="选择文章状态"
          >
            {/* 只显示草稿和发布两种状态 */}
            <option value={ArticleStatus.DRAFT}>
              {statusLabels[ArticleStatus.DRAFT]}
            </option>
            <option value={ArticleStatus.PUBLISHED}>
              {statusLabels[ArticleStatus.PUBLISHED]}
            </option>
            {/* 为未来的加密状态保留接口（暂时不显示） */}
            {/* <option value={ArticleStatus.ENCRYPTED}>
              {statusLabels[ArticleStatus.ENCRYPTED]}
            </option> */}
          </select>
        </div>
      </div>

      {/* 摘要 */}
      <div>
        <label className={labelClass}>摘要</label>
        <textarea
          value={meta.excerpt}
          onChange={event => onUpdateMeta('excerpt', event.target.value)}
          rows={3}
          placeholder="为列表页和 SEO 准备一段 80-120 字的摘要"
          className={inputClass}
        />
      </div>

      {/* 封面图片 */}
      <div>
        <label className={labelClass}>封面图片</label>
        <ImagePicker
          onSelect={imageUrl => onUpdateMeta('coverImage', imageUrl)}
          onClear={() => onUpdateMeta('coverImage', '')}
          initialImageUrl={meta.coverImage}
          isDisplaySelectedImage={false}
        />
        {meta.coverImage && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
            <div
              className="h-40 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${meta.coverImage})` }}
            />
          </div>
        )}
      </div>

      {/* 标签 */}
      <TagInput
        tagInput={tagInput}
        tags={tags}
        selectedTags={meta.tagNames}
        onTagInputChange={onTagInputChange}
        onTagAdd={onTagAdd}
        onTagRemove={onTagRemove}
        onTagKeyDown={onTagKeyDown}
      />

      {/* 转载设置 */}
      <RepostSettings
        isRepost={meta.isRepost}
        originalAuthor={meta.originalAuthor}
        originalLink={meta.originalLink}
        onToggleRepost={() => onUpdateMeta('isRepost', !meta.isRepost)}
        onUpdateAuthor={value => onUpdateMeta('originalAuthor', value)}
        onUpdateLink={value => onUpdateMeta('originalLink', value)}
      />
    </div>
  )
}

// ==================== 子组件：折叠按钮 ====================
interface CollapseButtonProps {
  isCollapsed: boolean
  onToggle: () => void
}

function CollapseButton({ isCollapsed, onToggle }: CollapseButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="top-0 w-8 h-full items-center justify-center bg-white border-l border-slate-200 transition-all duration-300 hover:bg-slate-50 hidden lg:flex shrink-0"
      aria-label={isCollapsed ? '展开侧边栏' : '折叠侧边栏'}
    >
      <svg
        className={`h-5 w-5 text-slate-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  )
}

// ==================== 子组件：元信息侧边栏 ====================
interface MetaSidebarProps {
  meta: EditorMetaState
  categories: Category[]
  tags: Tag[]
  tagInput: string
  isCollapsed: boolean
  onUpdateMeta: <K extends keyof EditorMetaState>(field: K, value: EditorMetaState[K]) => void
  onTagInputChange: (value: string) => void
  onTagAdd: (tag: string) => void
  onTagRemove: (tag: string) => void
  onTagKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onToggleCollapse: () => void
}

function MetaSidebar({
  meta,
  categories,
  tags,
  tagInput,
  isCollapsed,
  onUpdateMeta,
  onTagInputChange,
  onTagAdd,
  onTagRemove,
  onTagKeyDown,
  onToggleCollapse,
}: MetaSidebarProps) {
  return (
    <aside
      className={`relative border-r border-slate-200 bg-slate-50/50 transition-all duration-300 flex h-full min-h-0 ${isCollapsed ? 'lg:w-8' : 'lg:w-80'
        }`}
    >
      {/* 元信息表单内容 */}
      <div
        className={`p-6 transition-all duration-300 overflow-y-auto h-full ${isCollapsed ? 'lg:hidden' : 'lg:block flex-1'
          }`}
      >
        <MetaForm
          meta={meta}
          categories={categories}
          tags={tags}
          tagInput={tagInput}
          onUpdateMeta={onUpdateMeta}
          onTagInputChange={onTagInputChange}
          onTagAdd={onTagAdd}
          onTagRemove={onTagRemove}
          onTagKeyDown={onTagKeyDown}
        />
      </div>

      {/* 折叠按钮 */}
      <CollapseButton isCollapsed={isCollapsed} onToggle={onToggleCollapse} />
    </aside>
  )
}

// ==================== 子组件：编辑器内容 ====================
interface EditorContentProps {
  content: string
  viewMode: EditorMode
  previewNodes: React.ReactNode
  wordCount: number
  charCount: number
  onContentChange: (value: string) => void
  onViewModeChange: (mode: EditorMode) => void
}

function EditorContent({
  content,
  viewMode,
  previewNodes,
  wordCount,
  charCount,
  onContentChange,
  onViewModeChange,
}: EditorContentProps) {
  const editorScrollRef = useRef<HTMLTextAreaElement>(null)
  const previewScrollRef = useRef<HTMLDivElement>(null)
  // 防止滚动同步时的循环触发
  const isScrollingRef = useRef(false)

  // 编辑器滚动同步：计算滚动比例，同步到预览区域
  // 仅在并排模式下生效，使用 requestAnimationFrame 优化性能
  const handleEditorScroll = () => {
    if (isScrollingRef.current || viewMode !== 'split') return
    isScrollingRef.current = true

    const editor = editorScrollRef.current
    const preview = previewScrollRef.current

    if (editor && preview) {
      const editorScrollTop = editor.scrollTop
      const editorScrollHeight = editor.scrollHeight - editor.clientHeight
      const previewScrollHeight = preview.scrollHeight - preview.clientHeight

      if (editorScrollHeight > 0 && previewScrollHeight > 0) {
        const scrollRatio = editorScrollTop / editorScrollHeight
        preview.scrollTop = scrollRatio * previewScrollHeight
      }
    }

    requestAnimationFrame(() => {
      isScrollingRef.current = false
    })
  }

  // 预览区域滚动同步：反向同步到编辑器
  const handlePreviewScroll = () => {
    if (isScrollingRef.current || viewMode !== 'split') return
    isScrollingRef.current = true

    const editor = editorScrollRef.current
    const preview = previewScrollRef.current

    if (editor && preview) {
      const previewScrollTop = preview.scrollTop
      const previewScrollHeight = preview.scrollHeight - preview.clientHeight
      const editorScrollHeight = editor.scrollHeight - editor.clientHeight

      if (previewScrollHeight > 0 && editorScrollHeight > 0) {
        const scrollRatio = previewScrollTop / previewScrollHeight
        editor.scrollTop = scrollRatio * editorScrollHeight
      }
    }

    requestAnimationFrame(() => {
      isScrollingRef.current = false
    })
  }

  return (
    <div className="flex-1 p-6 flex flex-col min-h-[640px]">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">正文内容</h3>
          <p className="text-sm text-slate-500">Markdown 输入，自动使用项目内渲染器预览</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {viewModes.map(mode => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onViewModeChange(mode.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${viewMode === mode.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-4 flex-1 min-h-0 ${viewMode === 'split' ? 'lg:grid-cols-2' : ''}`}>
        {(viewMode === 'write' || viewMode === 'split') && (
          <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden h-full min-h-0">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-600 flex-shrink-0">
              <span className="font-medium">Markdown 编辑</span>
              <span className="text-slate-500">
                {wordCount} 词 / {charCount} 字符
              </span>
            </div>
            <textarea
              ref={editorScrollRef}
              value={content}
              onChange={event => onContentChange(event.target.value)}
              onScroll={handleEditorScroll}
              placeholder="使用 Markdown 语法撰写文章。支持标题、列表、代码块、引用等常见语法。"
              className="flex-1 resize-none bg-transparent px-5 py-4 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none overflow-y-auto min-h-0"
            />
          </div>
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden h-full min-h-0">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600 flex-shrink-0">
              <span className="font-medium">实时预览</span>
            </div>
            <div
              ref={previewScrollRef}
              onScroll={handlePreviewScroll}
              className="prose prose-slate max-w-none px-5 py-6 overflow-y-auto flex-1 min-h-0"
            >
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
  )
}

// ==================== 主组件 ====================
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
  const [actionState, setActionState] = useState<{ loading: boolean }>({
    loading: false,
  })

  // 使用 useMemo 优化 Markdown 渲染性能，避免不必要的重新渲染
  const previewNodes = useMemo(() => (content.trim() ? renderMarkdownWithComponents(content) : []), [content])
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  // 统一的数据变更通知函数，将本地时间格式转换为 ISO 字符串
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

  // 添加标签：去除空白字符，检查重复，清空输入框
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

  // 标签输入键盘事件处理：回车、逗号、空格均可添加标签
  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === ' ') {
      event.preventDefault()
      handleTagAdd(tagInput)
    }
  }

  /**
   * 提交文章：根据侧栏中选择的状态自动决定调用保存草稿还是发布回调
   * - DRAFT: 调用 onSaveDraft（不展示在文章界面）
   * - PUBLISHED: 调用 onPublish（展示在文章页面）
   * - 未来可扩展 ENCRYPTED 状态（加密文章）
   */
  const handleSubmit = async () => {
    if (actionState.loading) return
    const payload: ArticleDraftPayload = {
      meta,
      content,
      publishedAtISO: toIsoString(meta.publishedAt),
    }
    setActionState({ loading: true })
    try {
      if (meta.status === ArticleStatus.DRAFT) {
        // 保存草稿
        if (onSaveDraft) {
          await onSaveDraft(payload)
        }
      } else if (meta.status === ArticleStatus.PUBLISHED) {
        // 发布文章
        if (onPublish) {
          await onPublish(payload)
        }
      }
      // 为未来的加密状态保留接口
      // else if (meta.status === ArticleStatus.ENCRYPTED) {
      //   if (onSaveEncrypted) {
      //     await onSaveEncrypted(payload)
      //   }
      // }
    } finally {
      setActionState({ loading: false })
    }
  }

  return (
    <div className={`${containerClass} flex flex-col max-h-[calc(100vh-4rem)] overflow-hidden`}>
      <HeaderBar
        meta={meta}
        initialData={initialData}
        categories={categories}
        actionState={actionState}
        onUpdateMeta={updateMeta}
        onSubmit={() => handleSubmit()}
      />

      <div className="flex flex-col lg:flex-row relative flex-1 min-h-0 max-h-full overflow-scroll">
        <MetaSidebar
          meta={meta}
          categories={categories}
          tags={tags}
          tagInput={tagInput}
          isCollapsed={isMetaCollapsed}
          onUpdateMeta={updateMeta}
          onTagInputChange={setTagInput}
          onTagAdd={handleTagAdd}
          onTagRemove={handleTagRemove}
          onTagKeyDown={handleTagKeyDown}
          onToggleCollapse={() => setIsMetaCollapsed(!isMetaCollapsed)}
        />

        <EditorContent
          content={content}
          viewMode={viewMode}
          previewNodes={previewNodes}
          wordCount={wordCount}
          charCount={charCount}
          onContentChange={handleContentChange}
          onViewModeChange={setViewMode}
        />
      </div>
    </div>
  )
}
