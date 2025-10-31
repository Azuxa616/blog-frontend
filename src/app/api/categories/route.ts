import { NextRequest, NextResponse } from 'next/server';
import { categoryStorage } from '../../../lib/storage';
import { ResponseUtils } from '../../../lib/utils/middleware';
import { logRequest, withErrorHandling } from '../../../lib/utils/helpers';

// 获取分类列表
export const GET = withErrorHandling(async (req: NextRequest) => {
  logRequest(req, 'GET /api/categories');

  try {
    const categories = await categoryStorage.findAllWithCounts();

    // 为每个分类添加文章数量统计
    const categoriesWithStats = categories.map(category => ({
      ...category,
      articleCount: category.articleCount,
    }));

    return ResponseUtils.success(categoriesWithStats);
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return ResponseUtils.error('获取分类列表失败');
  }
});
