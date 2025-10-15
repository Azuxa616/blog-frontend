// Next.js 应用根布局组件
import type { Metadata } from "next"; // 导入 Next.js 元数据类型定义
import { Geist, Geist_Mono } from "next/font/google"; // 导入 Google Fonts
import "./globals.css"; // 导入全局样式文件
import HeaderBar from "@/components/HeaderBar";
import FooterBar from "@/components/FooterBar";
import { PageProvider } from "@/contexts/PageContext";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import FloatingActionButton from "@/components/FloatingActionButton";

// 配置 Geist Sans 字体 - 主要用于正文字体
const geistSans = Geist({
  variable: "--font-geist-sans", // CSS 变量名，用于在样式中引用
  subsets: ["latin"], // 只加载拉丁字符集，优化性能
});

// 配置 Geist Mono 字体 - 等宽字体，用于代码和数字
const geistMono = Geist_Mono({
  variable: "--font-geist-mono", // CSS 变量名
  subsets: ["latin"], // 只加载拉丁字符集
});

// 定义应用的元数据，用于 SEO 和页面头部信息
export const metadata: Metadata = {
  title: "Azuxa's BlogSpace", // 页面标题，会显示在浏览器标签页
  description: "Azuxa's BlogSpace", // 页面描述，用于搜索引擎
};

// 根布局组件 - 包装整个应用的根组件
// 所有页面都会被这个布局包裹，提供统一的HTML结构
export default function RootLayout({
  children, // 子组件内容，会被插入到布局中
}: Readonly<{
  children: React.ReactNode; // React 节点类型
}>) {
  return (
    // HTML 根元素，设置页面语言为英语
    <html lang="zh-CN">
      {/* 页面主体，应用字体变量和抗锯齿样式 */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-screen `}
      >
        <DarkModeProvider>
          <PageProvider>
            <HeaderBar />
            {/* 动态插入子页面内容 */}
            {children}
            {/* 全局浮动操作按钮 */}
            <FloatingActionButton />
          </PageProvider>
        </DarkModeProvider>

      </body>
    </html>
  );
}
