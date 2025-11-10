import { put } from '@vercel/blob'
import { withErrorHandling } from '@/lib/utils/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/utils/authMiddleware'
import { ResponseUtils } from '@/lib/utils/middleware'

export const POST = withErrorHandling(
  withAuth(async (request: NextRequest) => {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return ResponseUtils.error('未找到文件', 400)
    }

    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true, // 避免覆盖
    })

    return ResponseUtils.success(blob, '文件上传成功')
  })
)