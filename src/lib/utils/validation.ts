import { z } from 'zod';
import { ArticleStatus } from '../../types/article';

// ID验证模式
export const idSchema = z.object({
  id: z.string().min(1, 'ID不能为空'),
});

// 文章查询参数验证模式
export const articleQuerySchema = z.object({
  status: z.nativeEnum(ArticleStatus).optional(),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.enum(['createdAt', 'publishedAt', 'viewCount']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// 创建文章验证模式
export const createArticleSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题不能超过200字符'),
  content: z.string().min(1, '内容不能为空'),
  slug: z.string().max(200, 'slug不能超过200字符').optional(),
  excerpt: z.string().max(500, '摘要不能超过500字符').optional(),
  coverImage: z.string().url('封面图片必须是有效的URL').optional(),
  categoryId: z.string().min(1, '分类不能为空'),
  tagNames: z.array(z.string()).optional(),
  status: z.nativeEnum(ArticleStatus).optional(),
  author: z.string().max(100, '作者名称不能超过100字符').optional(),
  isRepost: z.boolean().optional(),
  originalAuthor: z.string().max(100, '原作者姓名不能超过100字符').optional(),
  originalLink: z.string().url('原文章链接必须是有效的URL').optional(),
});

// 更新文章验证模式
export const updateArticleSchema = createArticleSchema.partial();

/**
 * 验证请求参数
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errorMessage = result.error.errors[0]?.message || '验证失败';
    return { success: false, error: errorMessage };
  }
}
