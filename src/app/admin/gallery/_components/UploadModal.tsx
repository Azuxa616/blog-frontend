'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import ImageUploader from '@/app/admin/_components/ImageUploader'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess?: () => void
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [uploaderKey, setUploaderKey] = useState(0)

  // 当模态框关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      setUploadedUrl(null)
      setShowSuccess(false)
      // 通过改变 key 来重置 ImageUploader 组件
      setUploaderKey((prev) => prev + 1)
    }
  }, [isOpen])

  const handleUploadSuccess = (url: string) => {
    setUploadedUrl(url)
    setShowSuccess(true)
    // 延迟关闭模态框，让用户看到成功提示
    setTimeout(() => {
      onUploadSuccess?.()
      onClose()
    }, 1500)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="上传图片" size="lg">
      <div className="py-4">
        {showSuccess && uploadedUrl && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-medium">上传成功！</span>
            </div>
            <div className="mt-2 text-sm text-green-600 break-all">
              <span className="font-medium">图片地址：</span>
              <code className="bg-green-100 px-2 py-1 rounded">{uploadedUrl}</code>
            </div>
          </div>
        )}
        <ImageUploader
          key={uploaderKey}
          displayMode="original"
          onUploadSuccess={handleUploadSuccess}
          onUploadError={(error) => {
            console.error('上传失败:', error)
          }}
          className="w-full"
        />
      </div>
    </Modal>
  )
}

