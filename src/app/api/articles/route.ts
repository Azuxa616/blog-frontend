import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { withAuth } from '@/lib/utils/authMiddleware';
import { ResponseUtils } from '@/lib/utils/middleware';
import { withErrorHandling } from '@/lib/utils/middleware';
import { ArticleStatus } from '@/types/article';
import { validateRequest, createArticleSchema } from '@/lib/utils/validation';
import { logRequest } from '@/lib/utils/helpers';

export const GET = withErrorHandling(
  withAuth(async (request: NextRequest, user) => {
    try {
      const { searchParams } = new URL(request.url);
      
      // 转换状态值（前端传递 'published'/'draft'，后端需要 'PUBLISHED'/'DRAFT'）
      let status: ArticleStatus | undefined;
      const statusParam = searchParams.get('status');
      if (statusParam && statusParam !== 'all') {
        status = statusParam.toUpperCase() as ArticleStatus;
      }
      
      const params = {
        status,
        categoryId: searchParams.get('categoryId') || undefined,
        search: searchParams.get('search') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '100'), // 管理后台显示更多
        sortBy: (searchParams.get('sortBy') || 'createdAt') as 'createdAt' | 'publishedAt' | 'viewCount',
        sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc',
      };

      const result = await storage.getArticles(params);
      
      // 格式化文章数据供前端使用
      const formattedArticles = result.items.map(article => ({
        id: article.id,
        title: article.title,
        category: article.category?.name || '未分类',
        categoryId: article.categoryId,
        status: article.status.toLowerCase(), // 转换为小写供前端使用
        views: article.viewCount,
        publishDate: article.publishedAt 
          ? new Date(article.publishedAt).toISOString().split('T')[0]
          : new Date(article.createdAt).toISOString().split('T')[0],
        author: article.author?.username || '站长',
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      }));

      return ResponseUtils.success({
        articles: formattedArticles,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('获取文章列表失败:', error);
      return ResponseUtils.error('获取文章列表失败', 500);
    }
  })
);

// 创建文章（需要认证）
export const POST = withErrorHandling(
  withAuth(async (request: NextRequest, user) => {
    logRequest(request, 'POST /api/articles');
    
    try {
      const body = await request.json();
      
      // 验证请求数据
      const validation = validateRequest(createArticleSchema, body);
      if (!validation.success) {
        return ResponseUtils.error(validation.error, 400);
      }

      const data = validation.data;
      
      // 生成slug（如果没有提供）
      let slug = data.slug;
      if (!slug) {
        slug = data.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
      }

      // 构建文章数据
      const articleData = {
        title: data.title,
        slug: slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        categoryId: data.categoryId,
        status: data.status || ArticleStatus.DRAFT,
        tagNames: data.tagNames || [],
        isRepost: data.isRepost || false,
        originalAuthor: data.originalAuthor,
        originalLink: data.originalLink,
      };

      // 创建文章
      const article = await storage.createArticle(articleData);

      // 格式化返回数据
      const formattedArticle = {
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        coverImage: article.coverImage,
        status: article.status.toLowerCase(),
        categoryId: article.categoryId,
        tagNames: article.tags || [],
        isRepost: article.isRepost,
        originalAuthor: article.originalAuthor,
        originalLink: article.originalLink,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      };

      return ResponseUtils.success(formattedArticle, '文章创建成功');
    } catch (error) {
      console.error('创建文章失败:', error);
      return ResponseUtils.error('创建文章失败', 500);
    }
  })
);
