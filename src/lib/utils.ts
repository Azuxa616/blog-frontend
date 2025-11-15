/**
 * 合并 className 字符串的工具函数
 * 过滤掉空值和假值，并合并为单个字符串
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

