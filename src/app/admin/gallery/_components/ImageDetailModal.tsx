'use client'

import { useState } from 'react'
import Image from 'next/image'
import Modal from '@/components/Modal'

interface BlobInfo {
  url: string
  pathname: string
  size: number
  uploadedAt: Date
  contentType?: string | null
}

interface ImageDetailModalProps {
  isOpen: boolean
  onClose: () => void
  image: BlobInfo | null
}

export default function ImageDetailModal({ isOpen, onClose, image }: ImageDetailModalProps) {
  const [copied, setCopied] = useState(false)

  if (!image) return null

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(image.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="图片详情" size="lg">
      <div className="space-y-4">
        {/* 图片预览 */}
        <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={image.url}
            alt={image.pathname}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>

        {/* 图片信息 */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">文件名</span>
            <span className="text-sm text-gray-900 break-all text-right max-w-[70%]">
              {image.pathname}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">文件大小</span>
            <span className="text-sm text-gray-900">{formatFileSize(image.size)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">上传时间</span>
            <span className="text-sm text-gray-900">{formatDate(image.uploadedAt)}</span>
          </div>

          {image.contentType && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">文件类型</span>
              <span className="text-sm text-gray-900">{image.contentType}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm font-medium text-gray-700">URL</span>
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              {copied ? '已复制!' : '复制链接'}
            </button>
          </div>

          <div className="bg-gray-50 rounded-md p-3 break-all">
            <code className="text-xs text-gray-700">{image.url}</code>
          </div>
        </div>
      </div>
    </Modal>
  )
}

