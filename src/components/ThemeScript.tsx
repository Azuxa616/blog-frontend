import { getThemeScript } from '@/lib/theme/theme-script';

/**
 * ThemeScript 组件
 * 服务端组件，用于在 HTML head 中注入主题初始化脚本
 * 必须在样式加载前执行，防止页面闪烁
 */
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: getThemeScript(),
      }}
    />
  );
}

