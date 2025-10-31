import { NextRequest, NextResponse } from 'next/server';
import { articleStorage, categoryStorage } from '../../../../lib/storage';
import { ResponseUtils } from '../../../../lib/utils/middleware';
import { validateRequest, idSchema } from '../../../../lib/utils/validation';
import { logRequest, withErrorHandling } from '../../../../lib/utils/helpers';

// 获取单个文章
export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  logRequest(req, `GET /api/articles/${params.id}`);

  const validation = validateRequest(idSchema, { id: params.id });
  if (!validation.success) {
    return ResponseUtils.error('无效的文章ID');
  }

  const article = await articleStorage.findById(params.id);
  if (!article) {
    return ResponseUtils.notFound('文章不存在');
  }

  // 增加浏览量
  await articleStorage.incrementViewCount(params.id);

  // 获取分类信息
  const category = await categoryStorage.findById(article.categoryId);

  // 组合文章数据，包含分类信息
  const articleWithCategory = {
    ...article,
    category: category ? {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
    } : undefined,
    author: {
      id: 'system',
      username: '系统',
      avatar: '/imgs/avatar.jpg',
    },
    readTime: article.content ? Math.ceil(article.content.length / 400) : 1,
    publishDate: article.publishedAt || article.createdAt,
    layout: 'standard' as const,
  };

  return ResponseUtils.success(articleWithCategory);
});
