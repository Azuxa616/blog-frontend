import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../lib/storage';
import { logRequest, withErrorHandling } from '../../../lib/utils/helpers';

// 获取文章列表（使用SQLite）
export const GET = withErrorHandling(async (req: NextRequest) => {
  logRequest(req, 'GET /api/articles-markdown');

  const { searchParams } = new URL(req.url);
  
  const params = {
    status: searchParams.get('status') as any,
    categoryId: searchParams.get('categoryId') || undefined,
    search: searchParams.get('search') || undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
    sortBy: searchParams.get('sortBy') as any || 'publishedAt',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
  };

  const result = await storage.getArticles(params);

  // 添加阅读时间
  const articlesWithDetails = result.items.map(article => ({
    ...article,
    readTime: Math.ceil((article.content?.length || 0) / 400),
    publishDate: article.publishedAt || article.createdAt,
  }));

  return NextResponse.json({
    success: true,
    data: articlesWithDetails,
    pagination: result.pagination,
  });
});
