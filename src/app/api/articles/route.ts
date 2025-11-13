import { NextRequest } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser, withAuth } from '@/lib/utils/authMiddleware';
import { ResponseUtils, withErrorHandling } from '@/lib/utils/middleware';
import { Article, ArticleStatus } from '@/types/article';
import { validateRequest, createArticleSchema } from '@/lib/utils/validation';
import { logRequest } from '@/lib/utils/helpers';
import { appConfig } from '@/lib/config/app';

interface ArticleResponseItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  status: string;
  statusEnum: ArticleStatus;
  publishedAt?: string;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  views: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    color?: string;
  };
  categoryName: string;
  tags: string[];
  author?: {
    id: string;
    username: string;
    avatar?: string;
  };
  readTime?: number;
  isRepost?: boolean;
  originalAuthor?: string;
  originalLink?: string;
}
/**
 * 格式化文章响应数据
 * @param article 文章数据
 * @returns 格式化后的文章响应数据
 */
function formatArticleForResponse(article: Article): ArticleResponseItem {
  const publishSource = article.publishedAt ?? article.createdAt;
  const publishDate = publishSource
    ? new Date(publishSource).toISOString().split('T')[0]
    : '';

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    coverImage: article.coverImage,
    status: article.status.toLowerCase(),
    statusEnum: article.status,
    publishedAt: article.publishedAt,
    publishDate,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    viewCount: article.viewCount,
    views: article.viewCount,
    categoryId: article.categoryId,
    category: article.category
      ? {
          id: article.category.id,
          name: article.category.name,
          color: article.category.color,
        }
      : undefined,
    categoryName: article.category?.name || '未分类',
    tags: article.tags || [],
    author: article.author
      ? {
          id: article.author.id,
          username: article.author.username,
          avatar: article.author.avatar || '/imgs/avatar.jpg',
        }
      : undefined,
    readTime: article.readTime,
    isRepost: article.isRepost,
    originalAuthor: article.originalAuthor,
    originalLink: article.originalLink,
  };
}

export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const authUser = getAuthUser(request);
    const isAuthenticated = Boolean(authUser);

    // 未登录访问默认只返回已发布文章
    const statusParam = searchParams.get('status');
    let status: ArticleStatus | undefined;
    if (isAuthenticated) {
      if (statusParam && statusParam !== 'all') {
        status = statusParam.toUpperCase() as ArticleStatus;
      }
    } else {
      status = ArticleStatus.PUBLISHED;
    }

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const requestedLimit = parseInt(
      searchParams.get('limit') || (isAuthenticated ? '100' : '6'),
      10
    );
    const limit = Math.min(
      Number.isNaN(requestedLimit)
        ? isAuthenticated
          ? 100
          : 6
        : requestedLimit,
      isAuthenticated ? 100 : 50
    );

    const sortBy = (searchParams.get('sortBy') || 'createdAt') as
      | 'createdAt'
      | 'publishedAt'
      | 'viewCount';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const params = {
      status,
      categoryId: searchParams.get('categoryId') || undefined,
      search: searchParams.get('search') || undefined,
      page,
      limit,
      sortBy,
      sortOrder,
    };

    const result = await storage.getArticles(params);
    const formattedArticles = result.items.map(formatArticleForResponse);

    return ResponseUtils.success({
      articles: formattedArticles,
      pagination: result.pagination,
      scope: isAuthenticated ? 'admin' : 'public',
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return ResponseUtils.error('获取文章列表失败', 500);
  }
});

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
        author: data.author 
          ? { id: '', username: data.author, avatar: undefined }
          : { id: '', username: appConfig.admin.username, avatar: undefined },
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
        statusEnum: article.status,
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
