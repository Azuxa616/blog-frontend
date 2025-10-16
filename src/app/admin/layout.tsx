'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminLayoutProps {
    children: React.ReactNode
}

const navigation = [
    { name: '仪表板', href: '/admin/dashboard', icon: '📊' },
    { name: '文章管理', href: '/admin/articles', icon: '📝' },
    { name: '分类管理', href: '/admin/categories', icon: '🏷️' },
    { name: '系统设置', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const pathname = usePathname()

    return (
        <div className="flex h-screen bg-gray-50">


            {/* 侧边栏 */}
            <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}>
                <div className=" flex flex-col h-full">
                    {/* 侧边栏头部 */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="font-semibold text-gray-900">管理中心</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
                            aria-label="关闭侧边栏"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* 导航菜单 */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* 侧边栏底部 */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500 text-center">
                            © 2025 Azuxa&apos;s BlogSpace
                        </div>
                    </div>
                </div>
            </aside>

            {/* 主内容区 */}
            <main className={`flex-1 transition-all duration-300 overflow-y-scroll  ${sidebarOpen ? 'lg:ml-0' : ''
                }`}>
                {/* 遮罩层 - 移动端关闭侧边栏 */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* 页面内容 */}
                <div className="p-6">
                    {children}
                </div>
            </main>

        </div>
    )
}
