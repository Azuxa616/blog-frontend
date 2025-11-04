import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { appConfig } from '../config/app';

const AUTH_COOKIE_NAME = 'auth_token';

/**
 * 加密密码
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, appConfig.security.bcryptRounds);
}

/**
 * 验证密码
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * 生成JWT token
 */
export function generateToken(username: string): string {
  const payload = { username };
  const secret = appConfig.jwt.secret;
  
  // 直接传递expiresIn，jwt库会处理类型转换
  return jwt.sign(payload, secret, {
    expiresIn: appConfig.jwt.expiresIn,
  } as jwt.SignOptions);
}

/**
 * 验证JWT token
 */
export function verifyToken(token: string): { username: string } | null {
  try {
    const decoded = jwt.verify(token, appConfig.jwt.secret) as jwt.JwtPayload & { username: string };
    if (decoded && decoded.username) {
      return { username: decoded.username };
    }
    return null;
  } catch (error) {
    console.error('Token验证失败:', error instanceof Error ? error.message : '未知错误');
    return null;
  }
}

/**
 * 设置认证Cookie（httpOnly）
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  const isProduction = appConfig.isProduction;
  
  // 解析JWT过期时间，设置Cookie过期时间
  // JWT expiresIn格式可能是 '1h', '7d' 等
  let maxAge = 60 * 60; // 默认1小时
  const expiresIn = appConfig.jwt.expiresIn;
  if (expiresIn) {
    if (expiresIn.endsWith('h')) {
      maxAge = parseInt(expiresIn) * 60 * 60;
    } else if (expiresIn.endsWith('d')) {
      maxAge = parseInt(expiresIn) * 24 * 60 * 60;
    } else if (expiresIn.endsWith('m')) {
      maxAge = parseInt(expiresIn) * 60;
    }
  }
  
  // 确保Cookie设置正确
  // 注意：不要在开发环境使用secure，除非使用HTTPS
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: false, // 开发环境设为false，生产环境使用HTTPS时设为true
    sameSite: 'lax',
    maxAge: maxAge,
    path: '/',
  });
  
  // 调试：验证Cookie是否设置成功
  const cookieValue = response.cookies.get(AUTH_COOKIE_NAME)?.value;
  console.log('Cookie设置:', AUTH_COOKIE_NAME, cookieValue ? '成功' : '失败', 'maxAge:', maxAge, 'token长度:', token.length);
  
  // 检查响应头
  const setCookieHeader = response.headers.get('Set-Cookie');
  console.log('Set-Cookie响应头:', setCookieHeader ? setCookieHeader.substring(0, 100) + '...' : '未设置');
}

/**
 * 清除认证Cookie
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.delete(AUTH_COOKIE_NAME);
}

/**
 * 从请求中获取token（用于中间件和API路由）
 */
export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  return cookies[AUTH_COOKIE_NAME] || null;
}

