'use client'

import Link from 'next/link'

// 模拟数据
const stats = [
  {
    name: '今日访客',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: '👥',
  },
  {
    name: '页面浏览量',
    value: '5,678',
    change: '+8%',
    changeType: 'positive',
    icon: '📊',
  },
  {
    name: '文章总数',
    value: '42',
    change: '+3',
    changeType: 'positive',
    icon: '📝',
  },
  {
    name: '分类数量',
    value: '8',
    change: '+1',
    changeType: 'positive',
    icon: '🏷️',
  },
]

const recentArticles = [
  { id: 1, title: 'Next.js 13+ App Router 完全指南', views: 1234, status: 'published' },
  { id: 2, title: 'React 性能优化最佳实践', views: 987, status: 'draft' },
  { id: 3, title: 'TypeScript 高级类型详解', views: 756, status: 'published' },
  { id: 4, title: '现代前端开发工具链', views: 543, status: 'published' },
]

const quickActions = [
  {
    name: '写新文章',
    href: '/admin/articles/new',
    icon: '✏️',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    name: '管理分类',
    href: '/admin/categories',
    icon: '🏷️',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    name: '查看评论',
    href: '/admin/comments',
    icon: '💬',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    name: '系统设置',
    href: '/admin/settings',
    icon: '⚙️',
    color: 'bg-gray-500 hover:bg-gray-600',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
        <p className="mt-2 text-gray-600">欢迎回来！这里是您网站的概览信息。</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        <svg className={`self-center flex-shrink-0 h-4 w-4 ${
                          stat.changeType === 'positive'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d={`${
                            stat.changeType === 'positive'
                              ? 'M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z'
                              : 'M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z'
                          }`} clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">
                          {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                        </span>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 最近文章 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">最近文章</h3>
              <Link
                href="/admin/articles"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                查看全部 →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentArticles.map((article) => (
              <div key={article.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {article.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {article.views} 次浏览
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 快速操作 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">快速操作</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className={`flex flex-col items-center justify-center p-6 rounded-lg text-white transition-colors duration-200 ${action.color}`}
                >
                  <span className="text-3xl mb-3">{action.icon}</span>
                  <span className="text-sm font-medium text-center">
                    {action.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 系统状态 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">系统状态</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">系统状态</p>
                <p className="text-sm text-gray-500">运行正常</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">上次备份</p>
                <p className="text-sm text-gray-500">2小时前</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">在线时长</p>
                <p className="text-sm text-gray-500">7天 12小时</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
