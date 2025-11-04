/**
 * Edge Runtime 兼容的认证工具
 * 用于中间件等 Edge Runtime 环境
 */
import { jwtVerify } from 'jose';
import { appConfig } from '../config/app';

/**
 * 验证JWT token（Edge Runtime 兼容）
 */
export async function verifyTokenEdge(token: string): Promise<{ username: string } | null> {
  try {
    const secret = new TextEncoder().encode(appConfig.jwt.secret);
    
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });
    
    if (payload && payload.username && typeof payload.username === 'string') {
      return { username: payload.username };
    }
    
    return null;
  } catch (error) {
    console.error('Token验证失败 (Edge):', error instanceof Error ? error.message : '未知错误');
    return null;
  }
}

