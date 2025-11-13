import { NextRequest, NextResponse } from 'next/server';
import { articleStorage, categoryStorage } from '@/lib/storage';
import { ResponseUtils } from '@/lib/utils/middleware';
import { withAuth } from '@/lib/utils/authMiddleware';
import { validateRequest, idSchema, updateArticleSchema } from '@/lib/utils/validation';
import { logRequest, withErrorHandling } from '@/lib/utils/helpers';
import { ArticleStatus } from '@/types/article';
import { appConfig } from '@/lib/config/app';

// 获取单个文章
export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  logRequest(req, `GET /api/articles/${id}`);

  const validation = validateRequest(idSchema, { id });
  if (!validation.success) {
    return ResponseUtils.error('无效的文章ID');
  }

  const article = await articleStorage.findById(id);
  if (!article) {
    return ResponseUtils.notFound('文章不存在');
  }

  // 增加浏览量
  await articleStorage.incrementViewCount(id);

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

// 更新文章（需要认证）
export const PUT = withErrorHandling(
  withAuth(async (req: NextRequest, user, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    logRequest(req, `PUT /api/articles/${id}`);

    // 验证文章ID
    const idValidation = validateRequest(idSchema, { id });
    if (!idValidation.success) {
      return ResponseUtils.error('无效的文章ID');
    }

    // 检查文章是否存在
    const existingArticle = await articleStorage.findById(id);
    if (!existingArticle) {
      return ResponseUtils.notFound('文章不存在');
    }

    try {
      const body = await req.json();
      // 验证请求数据
      const validation = validateRequest(updateArticleSchema, body);
      if (!validation.success) {
        return ResponseUtils.error(validation.error, 400);
      }

      const data = validation.data;

      // 构建更新数据
      const updateData: Partial<{
        title: string;
        author?: { username: string };
        slug: string;
        content: string;
        excerpt?: string;
        coverImage?: string;
        categoryId: string;
        status: ArticleStatus;
        tagNames?: string[];
        isRepost?: boolean;
        originalAuthor?: string;
        originalLink?: string;
      }> = {};

      if (data.title !== undefined) updateData.title = data.title;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.author !== undefined) {
        updateData.author = { username: data.author || appConfig.admin.username };
      }
      if (data.content !== undefined) updateData.content = data.content;
      if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
      if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
      if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.tagNames !== undefined) updateData.tagNames = data.tagNames;
      if (data.isRepost !== undefined) updateData.isRepost = data.isRepost;
      if (data.originalAuthor !== undefined) updateData.originalAuthor = data.originalAuthor;
      if (data.originalLink !== undefined) updateData.originalLink = data.originalLink;

      // 更新文章
      const updatedArticle = await articleStorage.update(id, updateData);

      // 格式化返回数据
      const formattedArticle = {
        id: updatedArticle.id,
        title: updatedArticle.title,
        slug: updatedArticle.slug,
        content: updatedArticle.content,
        excerpt: updatedArticle.excerpt,
        coverImage: updatedArticle.coverImage,
        status: updatedArticle.status.toLowerCase(),
        statusEnum: updatedArticle.status,
        categoryId: updatedArticle.categoryId,
        tagNames: updatedArticle.tags || [],
        isRepost: updatedArticle.isRepost,
        originalAuthor: updatedArticle.originalAuthor,
        originalLink: updatedArticle.originalLink,
        createdAt: updatedArticle.createdAt,
        updatedAt: updatedArticle.updatedAt,
      };

      return ResponseUtils.success(formattedArticle, '文章更新成功');
    } catch (error) {
      console.error('更新文章失败:', error);
      return ResponseUtils.error('更新文章失败', 500);
    }
  })
);

// 删除文章（需要认证）
export const DELETE = withErrorHandling(
  withAuth(async (req: NextRequest, user, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    logRequest(req, `DELETE /api/articles/${id}`);

    const validation = validateRequest(idSchema, { id });
    if (!validation.success) {
      return ResponseUtils.error('无效的文章ID');
    }

    const article = await articleStorage.findById(id);
    if (!article) {
      return ResponseUtils.notFound('文章不存在');
    }

    // 删除文章
    await articleStorage.delete(id);

    return ResponseUtils.success(null, '文章删除成功');
  })
);
