'use client'

import { useState } from 'react'
import Image from 'next/image'

// 模拟配置数据
const initialSettings = {
  site: {
    name: 'Azuxa&apos;s BlogSpace',
    description: '欢迎来到我的个人博客空间，这里分享技术见解和生活感悟。',
    keywords: '博客,技术,前段开发,React,Next.js',
    logo: '/imgs/avatar.jpg',
  },
  features: {
    comments: true,
    search: true,
    rss: true,
    sitemap: true,
  },
  personal: {
    nickname: '站长',
    email: 'admin@example.com',
    bio: '热爱技术的全栈开发者，专注于前端技术和用户体验。',
  },
}

type Settings = typeof initialSettings

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [activeTab, setActiveTab] = useState<'site' | 'features' | 'personal'>('site')
  const [saving, setSaving] = useState(false)

  const updateSettings = (section: keyof Settings, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    // 模拟保存设置
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert('设置已保存！')
  }

  const tabs = [
    { id: 'site', name: '站点设置', icon: '🌐' },
    { id: 'features', name: '功能开关', icon: '⚙️' },
    { id: 'personal', name: '个人资料', icon: '👤' },
  ] as const

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
        <p className="mt-2 text-gray-600">配置您的网站和个人资料信息</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        {/* 选项卡导航 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* 选项卡内容 */}
        <div className="p-6">
          {/* 站点设置 */}
          {activeTab === 'site' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">站点基本信息</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="site-name" className="block text-sm font-medium text-gray-700 mb-2">
                      站点名称
                    </label>
                    <input
                      type="text"
                      id="site-name"
                      value={settings.site.name}
                      onChange={(e) => updateSettings('site', 'name', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="请输入站点名称"
                    />
                  </div>

                  <div>
                    <label htmlFor="site-description" className="block text-sm font-medium text-gray-700 mb-2">
                      站点描述
                    </label>
                    <textarea
                      id="site-description"
                      rows={3}
                      value={settings.site.description}
                      onChange={(e) => updateSettings('site', 'description', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="请输入站点描述"
                    />
                  </div>

                  <div>
                    <label htmlFor="site-keywords" className="block text-sm font-medium text-gray-700 mb-2">
                      关键词（用逗号分隔）
                    </label>
                    <input
                      type="text"
                      id="site-keywords"
                      value={settings.site.keywords}
                      onChange={(e) => updateSettings('site', 'keywords', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="请输入SEO关键词"
                    />
                  </div>

                  <div>
                    <label htmlFor="site-logo" className="block text-sm font-medium text-gray-700 mb-2">
                      站点Logo
                    </label>
                    <input
                      type="text"
                      id="site-logo"
                      value={settings.site.logo}
                      onChange={(e) => updateSettings('site', 'logo', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="请输入Logo图片路径"
                    />
                    {settings.site.logo && (
                      <div className="mt-2">
                        <Image
                          src={settings.site.logo}
                          alt="站点Logo预览"
                          width={64}
                          height={64}
                          className="object-cover rounded-lg border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 功能开关 */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">功能开关</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">💬</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">评论功能</div>
                        <div className="text-sm text-gray-500">允许访客对文章发表评论</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSettings('features', 'comments', !settings.features.comments)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.features.comments ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                      aria-label={`评论功能 ${settings.features.comments ? '已开启' : '已关闭'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.features.comments ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">搜索功能</div>
                        <div className="text-sm text-gray-500">启用站内搜索功能</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSettings('features', 'search', !settings.features.search)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.features.search ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                      aria-label={`搜索功能 ${settings.features.search ? '已开启' : '已关闭'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.features.search ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">📡</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">RSS订阅</div>
                        <div className="text-sm text-gray-500">生成RSS订阅源</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSettings('features', 'rss', !settings.features.rss)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.features.rss ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                      aria-label={`RSS订阅 ${settings.features.rss ? '已开启' : '已关闭'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.features.rss ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">🗺️</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">网站地图</div>
                        <div className="text-sm text-gray-500">自动生成网站地图</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSettings('features', 'sitemap', !settings.features.sitemap)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings.features.sitemap ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                      aria-label={`网站地图 ${settings.features.sitemap ? '已开启' : '已关闭'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.features.sitemap ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 个人资料 */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">个人信息设置</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                      昵称
                    </label>
                    <input
                      type="text"
                      id="nickname"
                      value={settings.personal.nickname}
                      onChange={(e) => updateSettings('personal', 'nickname', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="请输入昵称"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱地址
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={settings.personal.email}
                      onChange={(e) => updateSettings('personal', 'email', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="请输入邮箱地址"
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      个人简介
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      value={settings.personal.bio}
                      onChange={(e) => updateSettings('personal', 'bio', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="请输入个人简介"
                    />
                  </div>
                </div>
              </div>

              {/* 密码修改 */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">密码修改</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
                      当前密码
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="请输入当前密码"
                    />
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                      新密码
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="请输入新密码"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                      确认新密码
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="请再次输入新密码"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 保存按钮 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                保存中...
              </>
            ) : (
              '保存设置'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
