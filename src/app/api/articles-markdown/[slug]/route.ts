import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../lib/storage';
import { logRequest, withErrorHandling } from '../../../../lib/utils/helpers';

// 根据slug获取文章详情（使用SQLite）
export const GET = withErrorHandling(async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params;
  logRequest(req, `GET /api/articles-markdown/${slug}`);

  const article = await storage.getArticleBySlug(slug);

  if (!article) {
    return NextResponse.json(
      { success: false, error: '文章不存在' },
      { status: 404 }
    );
  }

  // 增加浏览量
  await storage.incrementViewCount(article.id);

  // 添加阅读时间
  const articleWithDetails = {
    ...article,
    readTime: Math.ceil((article.content?.length || 0) / 400),
    publishDate: article.publishedAt || article.createdAt,
  };

  return NextResponse.json({
    success: true,
    data: articleWithDetails,
  });
});
