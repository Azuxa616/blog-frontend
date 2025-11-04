/**
 * API路由认证中间件
 * 用于保护需要认证的API路由
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { ResponseUtils } from './middleware';

/**
 * 从请求中获取并验证JWT token
 */
export function getAuthUser(request: NextRequest): { username: string } | null {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/**
 * 认证中间件 - 保护API路由
 */
export function withAuth(
  handler: (req: NextRequest, user: { username: string }, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const user = getAuthUser(req);
    
    if (!user) {
      return ResponseUtils.unauthorized('请先登录');
    }

    return handler(req, user, ...args);
  };
}

