import { list } from '@vercel/blob'
import { withErrorHandling } from '@/lib/utils/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/utils/authMiddleware'
import { ResponseUtils } from '@/lib/utils/middleware'

// 图片 MIME 类型列表
const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/ico',
]

// 图片文件扩展名列表
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico']

// 判断是否为图片文件
function isImageFile(pathname: string, contentType?: string | null): boolean {
  // 优先检查 content-type
  if (contentType && IMAGE_MIME_TYPES.includes(contentType.toLowerCase())) {
    return true
  }
  
  // 检查文件扩展名
  const lowerPath = pathname.toLowerCase()
  return IMAGE_EXTENSIONS.some(ext => lowerPath.endsWith(ext))
}

export const GET = withErrorHandling(
  withAuth(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor') || undefined
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    try {
      const { blobs, cursor: nextCursor, hasMore } = await list({
        cursor,
        limit: Math.min(limit, 1000), // 限制最大数量
      })

      // 过滤只返回图片类型
      const imageBlobs = blobs.filter(blob => 
        isImageFile(blob.pathname)
      )

      return ResponseUtils.success({
        blobs: imageBlobs,
        total: imageBlobs.length,
        cursor: nextCursor,
        hasMore,
      }, '获取图片列表成功')
    } catch (error) {
      console.error('获取 blob 列表失败:', error)
      return ResponseUtils.error('获取图片列表失败', 500)
    }
  })
)

