import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../lib/storage';
import { logRequest, withErrorHandling } from '../../../lib/utils/helpers';

// 获取分类列表（使用SQLite）
export const GET = withErrorHandling(async (req: NextRequest) => {
  logRequest(req, 'GET /api/categories-markdown');

  const categories = await storage.getCategories();

  return NextResponse.json({
    success: true,
    data: categories,
  });
});
