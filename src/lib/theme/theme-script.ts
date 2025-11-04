/**
 * 生成主题初始化脚本
 * 该脚本在页面加载前执行，防止 FOUC (Flash of Unstyled Content)
 * 优先使用 localStorage 中保存的主题设置，否则使用系统偏好
 */
export function getThemeScript(): string {
  return `(function() {
  try {
    const saved = localStorage.getItem('darkMode');
    const isDark = saved !== null 
      ? saved === 'true' 
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    // 忽略错误，在 SSR 环境下可能会失败
  }
})();`;
}

