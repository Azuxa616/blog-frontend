import { NextRequest } from 'next/server';
import { storage } from '@/lib/storage';
import { withAuth } from '@/lib/utils/authMiddleware';
import { ResponseUtils } from '@/lib/utils/middleware';
import { withErrorHandling } from '@/lib/utils/middleware';

// 获取标签列表（需要认证）
export const GET = withErrorHandling(
  withAuth(async (req: NextRequest, user) => {
    try {
      const tags = await storage.getTags();

      // 格式化标签数据
      const formattedTags = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        color: tag.color || '',
        articleCount: tag.articleCount || 0,
        createdAt: new Date(tag.createdAt).toISOString().split('T')[0],
        updatedAt: new Date(tag.updatedAt).toISOString().split('T')[0],
      }));

      return ResponseUtils.success(formattedTags);
    } catch (error) {
      console.error('获取标签列表失败:', error);
      return ResponseUtils.error('获取标签列表失败', 500);
    }
  })
);

