'use client'

import { usePathname } from "next/navigation"; // 导入路径检查
import HeaderBar from "@/components/HeaderBar";
import { PageProvider } from "@/contexts/PageContext";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import FloatingActionButton from "@/components/FloatingActionButton";

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  const pathname = usePathname();

  // 检查是否是管理后台路由
  const isAdminRoute = pathname?.startsWith('/admin');
  const isHomeRoute = pathname==="/";
  return (
    <DarkModeProvider>
      <PageProvider>
        {/* 只在前台页面显示顶部导航 */}
        {!isAdminRoute && isHomeRoute &&<HeaderBar isUseSwitch={true} />}
        {/* 非首页路由显示毛玻璃样式头部 */}
        {!isAdminRoute && !isHomeRoute && <HeaderBar isUseSwitch={false} />}
        {/* 动态插入子页面内容 */}
        {children}
        {/* 只在前台页面显示浮动操作按钮 */}
        {!isAdminRoute && <FloatingActionButton />}
      </PageProvider>
    </DarkModeProvider>
  );
}
