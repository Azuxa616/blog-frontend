'use client'

import { useState, useRef, ChangeEvent, DragEvent } from 'react'
import Image from 'next/image'

type UploadStatus = "pending" | "uploading" | "success" | "error"
type ImageDisplayMode = "thumbnail" | "original"

interface ImageUploaderProps {
    displayMode?: ImageDisplayMode
    thumbnailSize?: { width: number, height: number }
    onUploadSuccess?: (url: string) => void
    onUploadError?: (error: string) => void
    initialImageUrl?: string
    className?: string
}
export default function ImageUploader(
    {
        displayMode = 'thumbnail',
        thumbnailSize = { width: 200, height: 200 },
        onUploadSuccess,
        onUploadError,
        initialImageUrl,
        className = '',
    }: ImageUploaderProps) {
    // 状态管理
    const [status, setStatus] = useState<UploadStatus>(
        initialImageUrl ? 'success' : 'pending'
    )
    const [imageUrl, setImageUrl] = useState<string>(initialImageUrl || "")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)// 错误信息
    const [dragActive, setDragActive] = useState(false)// 拖拽状态
    const [urlInput, setUrlInput] = useState('')// 输入的URL
    const [showUrlInput, setShowUrlInput] = useState(false)// 是否显示输入URL的输入框

    const fileInputRef = useRef<HTMLInputElement>(null)// 文件输入框的引用
    const dropZoneRef = useRef<HTMLDivElement>(null)// 拖拽区域的引用

    //文件上传函数
    const uploadFile = async (file: File) => {
        //验证文件类型
        if (!file.type.startsWith('image/')) {
            const error = "非图片文件！"
            setErrorMessage(error)
            setStatus('error')
            onUploadError?.(error)
            return
        }

        setStatus('uploading')
        setErrorMessage(null)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
            const result = await response.json()
            console.log("上传结果result:", result)
            if (!result.success || !result.data?.url) {
                throw new Error(result.error || '上传失败')
            }
            const url = result.data.url
            setImageUrl(url)
            setStatus('success')
            onUploadSuccess?.(url)

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '上传失败'
            setErrorMessage(errorMessage)
            setStatus('error')
            onUploadError?.(errorMessage)
        }
    }
    // 拖拽处理
    const handleDrag = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }
    // 拖拽进入处理
    const handleDragIn = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragActive(true)
        }
    }
    // 拖拽离开处理
    const handleDragOut = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
    }
    // 拖拽放下处理
    const handleDrop = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            uploadFile(e.dataTransfer.files[0])
        }
    }

    // 文件选择处理
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            uploadFile(e.target.files[0])
        }
    }
    // URL上传处理
    const handleUrlUpload = () => {
        //验证URL
        if (!urlInput.trim()) {
            setErrorMessage('请输入有效的图片 URL')
            setStatus('error')
            return
        }
        // 验证 URL 格式
        try {
            new URL(urlInput.trim())
            setImageUrl(urlInput.trim())
            setStatus('success')
            onUploadSuccess?.(urlInput.trim())
            setUrlInput('')
            setShowUrlInput(false)
        } catch {
            const error = '无效的 URL 格式'
            setErrorMessage(error)
            setStatus('error')
            onUploadError?.(error)
        }
    }
    // 重试
    const handleRetry = () => {
        setStatus('pending')
        setErrorMessage(null)
        setImageUrl("")
    }
    // 渲染不同状态
    const renderContent = () => {
        switch (status) {
            case 'pending':
                return (
                    <div
                        ref={dropZoneRef}
                        onDragEnter={handleDragIn}
                        onDragLeave={handleDragOut}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
              flex flex-col items-center justify-center
              border-2 border-dashed rounded-lg p-8
              cursor-pointer transition-colors
              ${dragActive
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                            }
            `}
                    >
                        <Image
                            src="/svgs/plus.svg"
                            alt="上传图片"
                            width={80}
                            height={80}
                            className="mb-4 opacity-50"
                        />
                        <p className="text-sm text-gray-600 mb-2">
                            点击或拖拽图片到此处上传
                        </p>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowUrlInput(!showUrlInput)
                            }}
                            className="text-xs text-blue-500 hover:text-blue-600"
                        >
                            或输入图片 URL
                        </button>

                        {showUrlInput && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="mt-4 w-full flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="输入图片 URL"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUrlUpload()
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleUrlUpload}
                                    className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                >
                                    确认
                                </button>
                            </div>
                        )}

                        <input
                            title="上传图片"
                            placeholder="选择图片文件"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                )

            case 'uploading':
                return (
                    <div className="flex flex-col items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-sm text-gray-600">上传中...</p>
                    </div>
                )

            case 'success':
                return (
                    <div className="relative">
                        {displayMode === 'thumbnail' ? (
                            <Image
                                src={imageUrl!}
                                alt="上传的图片"
                                width={thumbnailSize.width}
                                height={thumbnailSize.height}
                                className="rounded-lg object-cover"
                            />
                        ) : (
                            <img
                                src={imageUrl!}
                                alt="上传的图片"
                                className="max-w-full h-auto rounded-lg"
                            />
                        )}
                        <button
                            type="button"
                            onClick={handleRetry}
                            className="absolute top-2 right-2 px-2 py-1 bg-gray-800 bg-opacity-50 text-white text-xs rounded hover:bg-opacity-70"
                        >
                            重新上传
                        </button>
                    </div>
                )

            case 'error':
                return (
                    <div className="flex flex-col items-center justify-center p-8 border border-red-200 rounded-lg bg-red-50">
                        <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
                        <button
                            type="button"
                            onClick={handleRetry}
                            className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                            重试
                        </button>
                    </div>
                )
        }
    }
    return (
        <div className={`relative ${className}`}>
            {renderContent()}
        </div>
    )

}

