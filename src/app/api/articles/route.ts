import { NextRequest, NextResponse } from 'next/server';
import { SQLiteStorage } from '../../../lib/storage/sqliteStorage';

const storage = new SQLiteStorage();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params = {
      status: searchParams.get('status') as any,
      categoryId: searchParams.get('categoryId') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc',
    };

    const result = await storage.getArticles(params);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: '获取文章列表失败' }, { status: 500 });
  }
}
