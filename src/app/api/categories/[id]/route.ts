import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { withAuth } from '@/lib/utils/authMiddleware';
import { ResponseUtils } from '@/lib/utils/middleware';
import { withErrorHandling } from '@/lib/utils/middleware';

// 更新分类（需要认证）
export const PUT = withErrorHandling(
  withAuth(async (req: NextRequest, user, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const { name, slug, description, color } = body;

      if (!id) {
        return ResponseUtils.error('分类ID不能为空', 400);
      }

      // 检查分类是否存在
      const existing = await storage.getCategoryById(id);
      if (!existing) {
        return ResponseUtils.notFound('分类不存在');
      }

      // 如果修改了slug，检查新slug是否已存在
      if (slug && slug !== existing.slug) {
        const slugExists = await storage.getCategoryBySlug(slug);
        if (slugExists) {
          return ResponseUtils.error('该别名已存在', 400);
        }
      }

      const updates: any = {};
      if (name) updates.name = name;
      if (slug) updates.slug = slug;
      if (description !== undefined) updates.description = description;
      if (color !== undefined) updates.color = color;

      const updatedCategory = await storage.updateCategory(id, updates);

      if (!updatedCategory) {
        return ResponseUtils.error('更新分类失败', 500);
      }

      return ResponseUtils.success({
        id: updatedCategory.id,
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        description: updatedCategory.description || '',
        color: updatedCategory.color || '',
        articleCount: updatedCategory.articleCount || 0,
        createdAt: new Date(updatedCategory.createdAt).toISOString().split('T')[0],
        updatedAt: new Date(updatedCategory.updatedAt).toISOString().split('T')[0],
      }, '分类更新成功');
    } catch (error) {
      console.error('更新分类失败:', error);
      return ResponseUtils.error('更新分类失败', 500);
    }
  })
);

// 删除分类（需要认证）
export const DELETE = withErrorHandling(
  withAuth(async (req: NextRequest, user, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      if (!id) {
        return ResponseUtils.error('分类ID不能为空', 400);
      }

      // 检查分类是否存在
      const category = await storage.getCategoryById(id);
      if (!category) {
        return ResponseUtils.notFound('分类不存在');
      }

      // 检查是否有文章使用此分类
      if (category.articleCount > 0) {
        return ResponseUtils.error('该分类下还有文章，无法删除', 400);
      }

      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return ResponseUtils.error('删除分类失败', 500);
      }

      return ResponseUtils.success(null, '分类删除成功');
    } catch (error) {
      console.error('删除分类失败:', error);
      return ResponseUtils.error('删除分类失败', 500);
    }
  })
);

