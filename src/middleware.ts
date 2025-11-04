import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/utils/auth-edge';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只保护 /admin 路由（排除 /admin/login）
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // 从Cookie获取token
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // 未登录，重定向到登录页
      console.log('中间件: 未找到token，重定向到登录页');
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 验证token（使用 Edge Runtime 兼容的验证函数）
    const decoded = await verifyTokenEdge(token);
    if (!decoded) {
      // Token无效，清除Cookie并重定向到登录页
      console.log('中间件: Token无效，清除Cookie并重定向', 'token:', token?.substring(0, 20) + '...');
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth_token');
      return response;
    }

    // Token有效，允许访问
    console.log('中间件: Token验证成功，允许访问:', pathname, 'username:', decoded.username);
  }

  // 如果访问登录页且已登录，重定向到dashboard
  if (pathname === '/admin/login') {
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      const decoded = await verifyTokenEdge(token);
      if (decoded) {
        console.log('中间件: 已登录，重定向到dashboard');
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

// 配置中间件匹配规则
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};

