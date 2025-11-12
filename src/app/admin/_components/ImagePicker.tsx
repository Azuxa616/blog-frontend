'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Modal from '@/components/Modal'
import ImageUploader from '@/app/admin/_components/ImageUploader'

type ViewType = 'upload' | 'gallery'

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

interface ImagePickerProps {
    onSelect?: (imageUrl: string) => void
    onClear?: () => void
    initialImageUrl?: string | null
    isDisplaySelectedImage?: boolean
}

// Tab样式定义
const tabStyle = 'font-bold px-4 py-2 rounded-lg border-b-2 border-transparent hover:border-[#000] transition-colors'
const tabActiveStyle = 'bg-[#000] text-[#fff]'

export default function ImagePicker({ onSelect, onClear, initialImageUrl, isDisplaySelectedImage }: ImagePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null)
    const [view, setView] = useState<ViewType>('gallery')
    const [images, setImages] = useState<BlobInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const fetchImages = useCallback(async () => {
        try {
            setLoading(true)
            setError('')

            const response = await fetch('/api/blobs', {
                method: 'GET',
                credentials: 'include',
            })

            const data: ApiResponse = await response.json()

            if (!response.ok || !data.success) {
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
    }, [])

    // 当模态框打开且切换到图库视图时，获取图片列表
    useEffect(() => {
        if (isOpen && view === 'gallery') {
            fetchImages()
        }
    }, [isOpen, view, fetchImages])

    // 处理图片选择
    const handleImageSelect = (image: BlobInfo) => {
        setImageUrl(image.url)
        onSelect?.(image.url)
        setIsOpen(false)
    }

    // 处理上传成功
    const handleUploadSuccess = (url: string) => {
        setImageUrl(url)
        onSelect?.(url)
        setIsOpen(false)
    }
    const handleClear = () => {
        setImageUrl('')
        onClear?.()
    }
    return (
        <div className="space-y-2">

            <div className="flex items-center justify-between gap-2">
                <button
                    title="选择图片"
                    onClick={() => setIsOpen(true)}
                    className={`flex items-center justify-center w-full px-4 py-2 bg-[#000] text-white rounded-lg hover:shadow-lg transition-all duration-200`}
                >
                    <Image src="/svgs/image.svg" alt="选择图片" width={20} height={20} />
                </button>
                {imageUrl&&<button
                    title="清除图片"
                    onClick={handleClear}
                    className={`flex items-center justify-center w-full px-4 py-2 bg-[#ff2020] text-white rounded-lg hover:shadow-lg transition-all duration-200`}
                >
                    <Image src="/svgs/cross.svg" alt="清除图片" width={20} height={20} />
                </button>}
            </div>


            {/* 选中的图片预览 */}
            {imageUrl && isDisplaySelectedImage && (
                <div className="relative inline-block">
                    <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                        <Image
                            src={imageUrl}
                            alt="选中的图片"
                            fill
                            className="object-cover"
                            sizes="128px"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setImageUrl(null)
                            onSelect?.('')
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="清除选择"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="选择图片" size="lg">
                {/* tab切换 */}
                <div className="flex justify-start border-b-2 mb-4">
                    <button
                        onClick={() => setView('gallery')}
                        className={`${tabStyle} ${view === 'gallery' ? tabActiveStyle : ''}`}
                    >
                        图库
                    </button>
                    <button
                        onClick={() => setView('upload')}
                        className={`${tabStyle} ${view === 'upload' ? tabActiveStyle : ''}`}
                    >
                        上传
                    </button>
                </div>

                {/* 图库视图 */}
                {view === 'gallery' && (
                    <div className="max-h-[600px] overflow-y-auto">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                {error}
                            </div>
                        )}

                        {loading && (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-slate-400">加载中...</div>
                            </div>
                        )}

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
                            </div>
                        )}

                        {!loading && images.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                    <div
                                        key={`${image.url}-${index}`}
                                        className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200/60 bg-white cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                        onClick={() => handleImageSelect(image)}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.pathname}
                                            fill
                                            className="object-cover transition-transform duration-200 group-hover:scale-110"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                        {/* 悬停遮罩 */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                                        {/* 选中指示 */}
                                        {imageUrl === image.url && (
                                            <div className="absolute inset-0 bg-blue-500/30 border-2 border-blue-500">
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 上传视图 */}
                {view === 'upload' && (
                    <div className="py-4">
                        <ImageUploader
                            displayMode="original"
                            onUploadSuccess={handleUploadSuccess}
                            onUploadError={(error) => {
                                console.error('上传失败:', error)
                            }}
                            className="w-full"
                        />
                    </div>
                )}
            </Modal>
        </div>
    )
}
