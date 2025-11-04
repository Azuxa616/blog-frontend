import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { verifyToken } from '@/lib/utils/auth';
import { ResponseUtils } from '@/lib/utils/middleware';
import { withErrorHandling } from '@/lib/utils/middleware';

export const GET = withErrorHandling(async (req: NextRequest) => {
  try {
    // 从Cookie获取token
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      return ResponseUtils.unauthorized('未登录');
    }

    // 验证token
    const decoded = verifyToken(token);
    if (!decoded) {
      return ResponseUtils.unauthorized('Token无效或已过期');
    }

    // 获取用户信息
    const user = await storage.getUserByUsername(decoded.username);
    if (!user) {
      return ResponseUtils.unauthorized('用户不存在');
    }

    return ResponseUtils.success({
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return ResponseUtils.error('获取用户信息失败', 500);
  }
});

