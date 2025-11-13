// Next.js 应用根布局组件
import type { Metadata } from "next"; // 导入 Next.js 元数据类型定义
import { Geist, Geist_Mono } from "next/font/google"; // 导入 Google Fonts
import "./globals.css"; // 导入全局样式文件
import RootLayoutClient from "@/components/RootLayoutClient";
import ThemeScript from "@/components/ThemeScript";
//从 geist npm 包导入本地字体
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';



// 定义应用的元数据，用于 SEO 和页面头部信息
export const metadata: Metadata = {
  title: "Azuxa's BlogWorld", // 页面标题，会显示在浏览器标签页
  description: "Azuxa's BlogWorld", // 页面描述，用于搜索引擎
};

// 根布局组件 - 服务端组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // HTML 根元素，设置页面语言为英语
    // suppressHydrationWarning: 主题脚本会在客户端设置 dark 类，导致服务端和客户端不一致
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 主题初始化脚本，必须在样式加载前执行，防止 FOUC */}
        <ThemeScript />
      </head>
      {/* 页面主体，应用字体变量和抗锯齿样式 */}
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-w-screen `}
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
