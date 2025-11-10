export type NavIcon = 'dashboard' | 'content' | 'settings' | 'activity' | 'gallery'

export interface NavEntry {
  title: string
  description?: string
  href: string
  icon: NavIcon
  matchPaths?: string[]
}

export interface NavSection {
  label: string
  items: NavEntry[]
}

export const navSections: NavSection[] = [
  {
    label: '概览',
    items: [
      {
        title: '控制中心',
        description: '系统健康与数据洞察',
        href: '/admin/dashboard',
        icon: 'dashboard',
      },
    ],
  },
  {
    label: '内容',
    items: [
      {
        title: '内容管理',
        description: '分类、文章与资源',
        href: '/admin/content',
        icon: 'content',
        matchPaths: ['/admin/articles', '/admin/categories'],
      },
      {
        title: '图床管理',
        description: '图片资源管理',
        href: '/admin/gallery',
        icon: 'gallery',
      },
    ],
  },
  {
    label: '系统',
    items: [
      {
        title: '系统设置',
        description: '站点、功能与个人资料',
        href: '/admin/settings',
        icon: 'settings',
      },
    ],
  },
]

export const matchNavEntry = (pathname: string, entry: NavEntry) => {
  if (pathname === entry.href) return true
  return entry.matchPaths?.some((path) => pathname.startsWith(path)) ?? false
}
