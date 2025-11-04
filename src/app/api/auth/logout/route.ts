import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/utils/auth';
import { withErrorHandling } from '@/lib/utils/middleware';

export const POST = withErrorHandling(async (req: NextRequest) => {
  const response = NextResponse.json({
    success: true,
    message: '登出成功',
  });

  // 清除认证Cookie
  clearAuthCookie(response);

  return response;
});

