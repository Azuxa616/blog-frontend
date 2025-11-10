'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { PageHeader } from '../_components'
import ImageDetailModal from './_components/ImageDetailModal'
import UploadModal from './_components/UploadModal'

interface BlobInfo {
  url: string
  pathname: string
  size: number
  uploadedAt: Date
  contentType?: string | null
}

interface ApiResponse {
  success: boolean
  data?: {
    blobs: Array<{
      url: string
      pathname: string
      size: number
      uploadedAt: string
      contentType?: string | null
    }>
    total: number
    cursor?: string
    hasMore?: boolean
  }
  error?: string
  message?: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<BlobInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState<BlobInfo | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const router = useRouter()

  // 获取图片列表
  const fetchImages = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/blobs', {
        method: 'GET',
        credentials: 'include',
      })

      const data: ApiResponse = await response.json()

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          router.push('/admin/login?redirect=/admin/gallery')
          return
        }
        throw new Error(data.error || '获取图片列表失败')
      }

      if (data.data?.blobs) {
        const formattedImages = data.data.blobs.map((blob) => ({
          ...blob,
          uploadedAt: new Date(blob.uploadedAt),
        }))
        setImages(formattedImages)
      }
    } catch (err) {
      console.error('获取图片列表错误:', err)
      setError(err instanceof Error ? err.message : '获取图片列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [router])

  const handleImageClick = (image: BlobInfo) => {
    setSelectedImage(image)
    setIsDetailModalOpen(true)
  }

  const handleUploadSuccess = () => {
    fetchImages() // 刷新列表
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="图床管理"
        description="管理所有上传的图片资源"
      />

      {/* 错误提示 */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">加载中...</div>
        </div>
      )}

      {/* 图片网格 */}
      {!loading && images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <svg
            className="h-16 w-16 mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-lg">暂无图片</p>
          <p className="text-sm mt-2">点击右下角按钮上传图片</p>
        </div>
      )}

      {/* 瀑布流布局 */}
      {!loading && images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200/60 bg-white cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              onClick={() => handleImageClick(image)}
            >
              <Image
                src={image.url}
                alt={image.pathname}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
              />
              {/* 悬停遮罩 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              {/* 文件名提示 */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-white text-xs truncate">{image.pathname}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 图片详情模态框 */}
      <ImageDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedImage(null)
        }}
        image={selectedImage}
      />

      {/* 上传模态框 */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* 右下角上传按钮 */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--admin-primary)] text-white shadow-2xl shadow-blue-500/40 transition-all duration-300 ease-out hover:scale-110 active:scale-95"
          title="上传图片"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

