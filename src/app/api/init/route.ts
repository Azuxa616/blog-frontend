import { NextRequest, NextResponse } from 'next/server';
import { initializeStorage } from '@/lib/storage/init';
import { ResponseUtils } from '@/lib/utils/middleware';
import { logRequest, withErrorHandling } from '@/lib/utils/helpers';

// 初始化存储系统
export const POST = withErrorHandling(async (req: NextRequest) => {
  logRequest(req, 'POST /api/init');

  try {
    await initializeStorage();
    return ResponseUtils.success(null, '存储系统初始化成功');
  } catch (error) {
    console.error('初始化失败:', error);
    return ResponseUtils.error('初始化失败，请检查日志');
  }
});
