import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { withAuth } from '@/lib/utils/authMiddleware';
import { ResponseUtils } from '@/lib/utils/middleware';
import { withErrorHandling } from '@/lib/utils/middleware';

// 获取分类列表（需要认证）
export const GET = withErrorHandling(
  withAuth(async (req: NextRequest, user) => {
    try {
      const categories = await storage.getCategories();

      // 格式化分类数据
      const formattedCategories = categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        color: category.color || '',
        articleCount: category.articleCount || 0,
        createdAt: new Date(category.createdAt).toISOString().split('T')[0],
        updatedAt: new Date(category.updatedAt).toISOString().split('T')[0],
      }));

      return ResponseUtils.success(formattedCategories);
    } catch (error) {
      console.error('获取分类列表失败:', error);
      return ResponseUtils.error('获取分类列表失败', 500);
    }
  })
);

// 创建分类（需要认证）
export const POST = withErrorHandling(
  withAuth(async (req: NextRequest, user) => {
    try {
      const body = await req.json();
      const { name, slug, description, color } = body;

      if (!name || !slug) {
        return ResponseUtils.error('分类名称和别名不能为空', 400);
      }

      // 检查slug是否已存在
      const existing = await storage.getCategoryBySlug(slug);
      if (existing) {
        return ResponseUtils.error('该别名已存在', 400);
      }

      const category = await storage.createCategory({
        name,
        slug,
        description,
        color,
      });

      return ResponseUtils.success({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        color: category.color || '',
        articleCount: category.articleCount || 0,
        createdAt: new Date(category.createdAt).toISOString().split('T')[0],
        updatedAt: new Date(category.updatedAt).toISOString().split('T')[0],
      }, '分类创建成功');
    } catch (error) {
      console.error('创建分类失败:', error);
      return ResponseUtils.error('创建分类失败', 500);
    }
  })
);
