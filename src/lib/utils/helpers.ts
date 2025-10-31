import { NextRequest } from 'next/server';
import { Logger } from './middleware';

/**
 * 记录请求日志
 */
export function logRequest(req: NextRequest, message: string): void {
  Logger.logRequest(req, message);
}

/**
 * 错误处理包装器
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      Logger.logError(error as Error);
      throw error;
    }
  };
}

/**
 * 生成安全的slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-')     // 空格转成横杠
    .replace(/-+/g, '-')      // 多个横杠合并
    .trim()
    .substring(0, 50);        // 限制长度
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 计算阅读时间
 */
export function calculateReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const wordsPerMinute = 200; // 中文阅读速度
  return Math.ceil(words / wordsPerMinute);
}

/**
 * 提取文本摘要
 */
export function extractExcerpt(content: string, maxLength: number = 200): string {
  const plainText = content
    .replace(/<[^>]*>/g, '') // 移除HTML标签
    .replace(/\s+/g, ' ')    // 合并空白字符
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + '...';
}
