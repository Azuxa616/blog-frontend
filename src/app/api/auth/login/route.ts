import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/utils/auth';
import { ResponseUtils } from '@/lib/utils/middleware';
import { withErrorHandling } from '@/lib/utils/middleware';

const AUTH_COOKIE_NAME = 'auth_token';

export const POST = withErrorHandling(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return ResponseUtils.error('用户名和密码不能为空', 400);
    }

    // 获取用户密码哈希
    const passwordHash = await storage.getUserPasswordHash(username);
    if (!passwordHash) {
      return ResponseUtils.error('用户名或密码错误', 401);
    }

    // 验证密码
    const isValid = await verifyPassword(password, passwordHash);
    if (!isValid) {
      return ResponseUtils.error('用户名或密码错误', 401);
    }

    // 更新最后登录时间
    await storage.updateLastLogin(username);

    // 获取用户信息
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return ResponseUtils.error('用户不存在', 404);
    }

    // 生成JWT token
    const token = generateToken(username);
    console.log('生成的Token:', token.substring(0, 20) + '...');

    // 先创建响应对象
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isActive: user.isActive,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      message: '登录成功',
    });

    // 设置httpOnly Cookie - 必须在返回响应前设置
    setAuthCookie(response, token);

    // 调试：确认Cookie已设置
    const cookieHeader = response.headers.get('Set-Cookie');
    console.log('登录成功，Cookie响应头:', cookieHeader ? '已设置' : '未设置');
    console.log('登录成功，已设置Cookie:', AUTH_COOKIE_NAME);

    return response;
  } catch (error) {
    console.error('登录错误:', error);
    return ResponseUtils.error('登录失败，请稍后重试', 500);
  }
});

