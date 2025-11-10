-- ============================================
-- 博客数据库初始化 SQL 脚本
-- Blog Database Initialization SQL Script
-- ============================================
-- 数据库类型: SQLite / LibSQL
-- 创建时间: 2025-11-05
-- ============================================

-- ============================================
-- 第一部分：删除现有表（如果存在）
-- Part 1: Drop existing tables (if exists)
-- ============================================
-- 注意：取消下面的注释以清空现有数据
-- Note: Uncomment below to clear existing data

DROP TABLE IF EXISTS article_tags;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- ============================================
-- 第二部分：创建表结构
-- Part 2: Create table structure
-- ============================================

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  article_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  color TEXT,
  article_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 创建文章表
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  status TEXT NOT NULL,
  published_at TEXT,
  author TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  category_id TEXT,
  read_time INTEGER,
  is_repost INTEGER DEFAULT 0,
  original_author TEXT,
  original_link TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 创建文章标签关联表
CREATE TABLE IF NOT EXISTS article_tags (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id),
  UNIQUE(article_id, tag_id)
);

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  last_login_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- ============================================
-- 第三部分：创建索引
-- Part 3: Create indexes
-- ============================================

CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category_id);
CREATE INDEX IF NOT EXISTS articles_published_idx ON articles(published_at);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS tags_slug_idx ON tags(slug);
CREATE INDEX IF NOT EXISTS article_tags_article_idx ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS article_tags_tag_idx ON article_tags(tag_id);
CREATE INDEX IF NOT EXISTS users_username_idx ON users(username);

-- ============================================
-- 第四部分：插入初始数据
-- Part 4: Insert initial data
-- ============================================

-- 插入分类数据
INSERT OR IGNORE INTO categories (id, name, slug, description, color, article_count, created_at, updated_at) VALUES
('cat-001', '技术随笔', 'tech-notes', '记录技术学习和实践的点点滴滴', '#3b82f6', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('cat-002', '测试', 'test', '测试分类，用于验证功能', '#10b981', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('cat-003', '前端开发', 'frontend', '前端技术相关文章', '#8b5cf6', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('cat-004', '后端开发', 'backend', '后端技术相关文章', '#f59e0b', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('cat-005', '生活随笔', 'life', '记录生活的美好瞬间', '#ec4899', 0, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z');

-- 插入标签数据
INSERT OR IGNORE INTO tags (id, name, slug, color, article_count, created_at, updated_at) VALUES
('tag-001', 'CSS', 'css', '#3b82f6', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('tag-002', 'TailwindCSS', 'tailwindcss', '#38bdf8', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('tag-003', '前端开发', 'frontend-dev', '#8b5cf6', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('tag-004', '框架', 'framework', '#f59e0b', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('tag-005', 'Markdown', 'markdown', '#10b981', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z'),
('tag-006', '测试', 'test', '#ef4444', 1, '2025-01-01T00:00:00Z', '2025-01-01T00:00:00Z');

-- 插入管理员用户
-- 默认用户名: admin
-- 默认密码: admin
-- ⚠️ 警告：生产环境请务必修改默认密码！
INSERT OR IGNORE INTO users (id, username, password, last_login_at, created_at, updated_at) VALUES
('user-001', 'admin', '$2a$12$ofq3QwMIsHQ3N7WXs0OX7u19kpB75NDae56Hyc04pAr.FOs4ihAve', NULL, '2025-10-09T00:00:00Z', '2025-11-05T00:00:00Z');

-- 插入示例文章 1: TailwindCSS 常用类目
INSERT OR IGNORE INTO articles (
  id, title, slug, content, excerpt, cover_image, status, published_at, author,
  view_count, category_id, read_time, is_repost, original_author, original_link,
  created_at, updated_at
) VALUES (
  'article-001',
  'TailwindCSS 常用类目集合 (v4)',
  'tailwindcss-v4-common-classes',
  '# TailwindCSS 常用类目集合 (v4)

## 概述

Tailwind CSS v4 是一个完全重写的原子化 CSS 框架，提供了更快的构建速度、新的配置系统和增强的功能。本文档总结了 Tailwind CSS v4 最常用的类目及其使用方法。

## v4 新特性

### 🚀 主要改进
- **更快的构建速度** - 重写的 CSS 引擎提供更快的编译和热重载
- **新的配置系统** - 从 JavaScript 迁移到 CSS 中的 @config 指令
- **改进的兼容性** - 更好的浏览器支持和现代 CSS 特性
- **@import 语法** - 使用 `@import "tailwindcss"` 代替旧的 `@tailwind` 指令

### 📝 配置方式变更
```css
/* v4 新语法 */
@import "tailwindcss";

/* 自定义配置 */
@config {
  --color-primary: #3b82f6;
  --font-family-mono: "JetBrains Mono", monospace;
}
```



## 1. 布局类 (Layout)

### 容器和显示
- `container` - 响应式容器
- `block` - 块级元素
- `inline-block` - 内联块级元素
- `inline` - 内联元素
- `flex` - 弹性布局
- `inline-flex` - 内联弹性布局
- `grid` - 网格布局
- `hidden` - 隐藏元素

### 弹性布局
- `flex-row` - 水平排列
- `flex-col` - 垂直排列
- `flex-wrap` - 换行
- `flex-nowrap` - 不换行
- `justify-start` - 起始对齐
- `justify-center` - 居中对齐
- `justify-end` - 结束对齐
- `justify-between` - 两端对齐
- `justify-around` - 均匀分布
- `items-start` - 顶部对齐
- `items-center` - 垂直居中
- `items-end` - 底部对齐

### 网格布局
- `grid-cols-1` 到 `grid-cols-12` - 列数设置
- `gap-1` 到 `gap-96` - 网格间距
- `col-span-1` 到 `col-span-full` - 跨列设置

## 2. 间距类 (Spacing)

### 外边距 (Margin)
- `m-0` 到 `m-96` - 所有方向外边距
- `mx-0` 到 `mx-96` - 水平外边距
- `my-0` 到 `my-96` - 垂直外边距
- `mt-0` 到 `mt-96` - 上外边距
- `mr-0` 到 `mr-96` - 右外边距
- `mb-0` 到 `mb-96` - 下外边距
- `ml-0` 到 `ml-96` - 左外边距

### 内边距 (Padding)
- `p-0` 到 `p-96` - 所有方向内边距
- `px-0` 到 `px-96` - 水平内边距
- `py-0` 到 `py-96` - 垂直内边距
- `pt-0` 到 `pt-96` - 上内边距
- `pr-0` 到 `pr-96` - 右内边距
- `pb-0` 到 `pb-96` - 下内边距
- `pl-0` 到 `pl-96` - 左内边距

## 3. 尺寸类 (Sizing)

### 宽度 (Width)
- `w-0` 到 `w-96` - 固定宽度
- `w-full` - 100%宽度
- `w-screen` - 视口宽度
- `w-auto` - 自动宽度

### 高度 (Height)
- `h-0` 到 `h-96` - 固定高度
- `h-full` - 100%高度
- `h-screen` - 视口高度
- `h-auto` - 自动高度

### 最小/最大尺寸
- `min-w-0`, `min-w-full` - 最小宽度
- `max-w-xs` 到 `max-w-7xl` - 最大宽度
- `min-h-0`, `min-h-full` - 最小高度
- `max-h-screen` - 最大高度

## 4. 排版类 (Typography)

### 字体大小
- `text-xs` - 极小
- `text-sm` - 小
- `text-base` - 基础
- `text-lg` - 大
- `text-xl` 到 `text-9xl` - 各种大小

### 字体粗细
- `font-thin` - 最细
- `font-light` - 细
- `font-normal` - 正常
- `font-medium` - 中等
- `font-semibold` - 半粗
- `font-bold` - 粗
- `font-extrabold` - 特粗
- `font-black` - 最粗

### 文字颜色
- `text-gray-50` 到 `text-gray-900` - 灰色系
- `text-red-50` 到 `text-red-900` - 红色系
- `text-blue-50` 到 `text-blue-900` - 蓝色系
- `text-green-50` 到 `text-green-900` - 绿色系
- `text-yellow-50` 到 `text-yellow-900` - 黄色系
- `text-purple-50` 到 `text-purple-900` - 紫色系
- `text-pink-50` 到 `text-pink-900` - 粉色系
- `text-indigo-50` 到 `text-indigo-900` - 靛蓝色系

### 文字对齐
- `text-left` - 左对齐
- `text-center` - 居中对齐
- `text-right` - 右对齐
- `text-justify` - 两端对齐

### 其他排版
- `leading-none` 到 `leading-relaxed` - 行高
- `tracking-tight` 到 `tracking-wide` - 字间距
- `uppercase` - 大写
- `lowercase` - 小写
- `capitalize` - 首字母大写

## 5. 背景类 (Background)

### 背景颜色
- `bg-white`, `bg-black` - 基础颜色
- `bg-gray-50` 到 `bg-gray-900` - 灰色背景
- `bg-red-50` 到 `bg-red-900` - 红色背景
- `bg-blue-50` 到 `bg-blue-900` - 蓝色背景
- `bg-green-50` 到 `bg-green-900` - 绿色背景
- `bg-yellow-50` 到 `bg-yellow-900` - 黄色背景

### 背景图片
- `bg-cover` - 覆盖
- `bg-contain` - 包含
- `bg-no-repeat` - 不重复
- `bg-repeat` - 重复
- `bg-center` - 居中
- `bg-top`, `bg-bottom`, `bg-left`, `bg-right` - 位置

### 背景渐变
- `bg-gradient-to-r` - 右向渐变
- `bg-gradient-to-l` - 左向渐变
- `bg-gradient-to-t` - 上向渐变
- `bg-gradient-to-b` - 下向渐变
- `from-red-500` 到 `to-blue-500` - 渐变色

## 6. 边框类 (Border)

### 边框宽度
- `border` - 1px边框
- `border-0` - 无边框
- `border-2`, `border-4`, `border-8` - 不同宽度

### 边框颜色
- `border-gray-200` - 灰色边框
- `border-red-500` - 红色边框
- `border-blue-500` - 蓝色边框

### 边框圆角
- `rounded` - 小圆角
- `rounded-md` - 中等圆角
- `rounded-lg` - 大圆角
- `rounded-full` - 完全圆角
- `rounded-none` - 无圆角

### 边框样式
- `border-solid` - 实线
- `border-dashed` - 虚线
- `border-dotted` - 点线

## 7. 效果类 (Effects)

### 阴影
- `shadow` - 小阴影
- `shadow-md` - 中等阴影
- `shadow-lg` - 大阴影
- `shadow-xl` - 超大阴影
- `shadow-2xl` - 极大阴影
- `shadow-inner` - 内阴影

### 不透明度
- `opacity-0` 到 `opacity-100` - 透明度设置

### 变换
- `scale-50` 到 `scale-150` - 缩放
- `rotate-0` 到 `rotate-180` - 旋转
- `translate-x-0` 到 `translate-x-full` - 平移

## 8. 动画类 (Animation)

### 过渡 (v4 增强)
- `transition` - 基础过渡
- `transition-all` - 所有属性过渡
- `transition-colors` - 颜色过渡
- `transition-transform` - 变换过渡
- `duration-75` 到 `duration-1000` - 持续时间
- `ease-linear` - 线性缓动
- `ease-in` - 缓入
- `ease-out` - 缓出
- `ease-in-out` - 缓入缓出

### 🆕 增强动画 (v4)
v4 版本增加了更多内置动画：
- `animate-spin` - 旋转动画
- `animate-ping` - 脉冲动画
- `animate-pulse` - 脉动动画
- `animate-bounce` - 弹跳动画
- `animate-fade-in` - 淡入效果
- `animate-slide-in` - 滑入效果
- `animate-scale-in` - 缩放进入
- `animate-rotate-in` - 旋转进入

### 自定义动画 (v4)
```css
@config {
  --animate-fade-in: fade-in 0.5s ease-in-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## 9. 响应式设计类 (Responsive)

### 断点前缀 (v4 增强)
- `sm:` - ≥640px
- `md:` - ≥768px
- `lg:` - ≥1024px
- `xl:` - ≥1280px
- `2xl:` - ≥1536px

### 🆕 容器查询 (v4 新增)
v4 版本增强了容器查询支持：
- `@container` - 基于容器大小的响应式
- `@container-sm` - 小容器查询
- `@container-md` - 中等容器查询
- `@container-lg` - 大容器查询

```html
<!-- 使用示例 -->
<div class="@container">
  <div class="grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3">
    <!-- 内容会根据容器大小变化 -->
  </div>
</div>
```

### 使用示例
- `md:flex` - 中等屏幕及以上显示为flex
- `lg:hidden` - 大屏幕及以上隐藏
- `sm:text-lg` - 小屏幕及以上使用大文字
- `@container-md:flex` - 容器宽度≥768px时显示为flex

## 10. 状态类 (States)

### 悬停状态
- `hover:bg-gray-100` - 悬停背景色
- `hover:text-blue-600` - 悬停文字色
- `hover:scale-105` - 悬停缩放

### 焦点状态
- `focus:outline-none` - 移除焦点轮廓
- `focus:ring-2` - 焦点环
- `focus:border-blue-500` - 焦点边框色

### 激活状态
- `active:bg-gray-200` - 激活背景色
- `active:scale-95` - 激活缩放

## 实用技巧

### 常用组合
- 居中布局: `flex items-center justify-center`
- 响应式卡片: `bg-white rounded-lg shadow-md p-6`
- 按钮样式: `bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded`

### 自定义配置 (v4)
在 v4 版本中，通过 CSS 文件中的 `@config` 指令来自定义颜色、间距、字体等：

```css
@import "tailwindcss";

@config {
  /* 自定义颜色 */
  --color-primary: #3b82f6;
  --color-secondary: #64748b;

  /* 自定义间距 */
  --spacing-xs: 0.25rem;
  --spacing-xl: 3rem;

  /* 自定义字体 */
  --font-family-sans: "Inter", sans-serif;
  --font-family-mono: "JetBrains Mono", monospace;
}
```

### ⚡ v4 引擎特性
Tailwind CSS v4 的新引擎默认启用 JIT 编译模式，提供：
- **更快的构建速度** - 重写的 CSS 生成器
- **更好的热重载** - 开发时近乎即时的样式更新
- **智能代码分割** - 只生成使用的样式
- **改进的兼容性** - 更好的浏览器支持

### 🎨 增强的颜色系统 (v4)
v4 版本增强了颜色系统，支持：
- **CSS 自定义属性** - 使用 `--color-*` 变量自定义颜色
- **更广泛的颜色范围** - 扩展的颜色调色板
- **更好的对比度** - 改进的无障碍性颜色
- **动态颜色生成** - 支持运行时颜色生成

```css
/* v4 颜色自定义示例 */
@config {
  --color-brand: #6366f1;
  --color-brand-50: oklch(from var(--color-brand) calc(l * 1.2) c h);
  --color-brand-100: oklch(from var(--color-brand) calc(l * 1.1) c h);
  /* ... 其他颜色级别 */
}
```

## 🔄 从 v3 迁移到 v4

### 主要变更点
1. **配置文件迁移**
   - 删除 `tailwind.config.js`
   - 在 CSS 文件中使用 `@config` 指令

2. **指令变更**
   ```css
   /* v3 */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   /* v4 */
   @import "tailwindcss";
   ```

3. **构建工具**
   - v4 原生支持，无需 PostCSS 插件
   - 直接在构建工具中使用

### 兼容性说明
- v4 与 v3 的类名完全兼容
- 现有项目可以逐步迁移
- 支持混合使用 v3 和 v4 语法

## 🛠️ 开发工具集成

### Vite (推荐)
```javascript
// vite.config.js
import { defineConfig } from ''vite''
import tailwindcss from ''@tailwindcss/vite''

export default defineConfig({
  plugins: [tailwindcss()],
})
```

### 其他构建工具
- **Webpack**: 使用 `@tailwindcss/webpack` 插件
- **Parcel**: 原生支持，无需额外配置
- **Astro**: 内置支持
- **Next.js**: App Router 中使用 `@import "tailwindcss"`

## 📚 学习资源

- [Tailwind CSS v4 官方文档](https://tailwindcss.com/docs/v4-beta)
- [Tailwind CSS 中文文档](https://www.tailwindcss.cn/)
- [Tailwind CSS Cheat Sheet](https://tailwindcomponents.com/cheatsheet/)
- [v4 迁移指南](https://tailwindcss.com/docs/v4-beta#migrating-from-v3)

## 🎯 最佳实践 (v4)

### 1. 使用 CSS 配置
```css
@import "tailwindcss";

@config {
  /* 自定义设计令牌 */
  --color-brand: #6366f1;
  --font-family-display: "Inter", sans-serif;
  --spacing-section: 5rem;
}
```

### 2. 利用新的颜色函数
```css
/* 使用现代颜色空间 */
--color-brand-50: oklch(from var(--color-brand) calc(l * 1.2) c h);
--color-brand-900: oklch(from var(--color-brand) calc(l * 0.8) c h);
```

### 3. 优化构建性能
- 只使用需要的工具类
- 利用 v4 的智能代码分割
- 使用 `@layer` 指令组织样式

---

*本文档基于 Tailwind CSS v4 版本整理 | 更新日期: 2025年*"
',
  'Tailwind CSS v4 是一个完全重写的原子化 CSS 框架，本文档总结了最常用的类目及其使用方法，帮助开发者快速掌握 Tailwind CSS v4 的核心功能。',
  NULL,
  'PUBLISHED',
  '2025-10-22T10:00:00Z',
  'Azuxa616',
  0,
  'cat-001',
  5,
  0,
  NULL,
  NULL,
  '2025-10-22T00:00:00Z',
  '2025-10-22T00:00:00Z'
);

-- 插入示例文章 2: Markdown 渲染器测试
INSERT OR IGNORE INTO articles (
  id, title, slug, content, excerpt, cover_image, status, published_at, author,
  view_count, category_id, read_time, is_repost, original_author, original_link,
  created_at, updated_at
) VALUES (
  'article-002',
  'Markdown 渲染器测试',
  'markdown-renderer-test',
  '# Markdown 功能测试
这是测试 **markdownRenderer.tsx** 中所有支持的 Markdown 标记的文章。
## 标题测试
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
## 文本格式测试
**这是粗体文本**，*这是斜体文本*，~~这是删除线文本~~。
正常文本与**粗体**、*斜体*、~~删除线~~混合使用。
## 列表测试
### 无序列表
- 第一项
- 第二项
  - 子项1
  - 子项2
- 第三项
* 星号列表项1
* 星号列表项2
* 星号列表项3
### 有序列表
1. 第一步
2. 第二步
3. 第三步
   1. 子步骤1
   2. 子步骤2
4. 第四步
## 代码测试
### 行内代码
这是一个 `console.log(''Hello World'')` 的行内代码示例。
### 代码块
```javascript
function hello() {
    console.log(''Hello, Markdown!'');
    return ''success'';
}
```
```python
def hello_python():
    print(''Hello from Python!'')
    return True
```
```bash
npm install markdown-renderer
cd blog-project
npm run dev
```
## 链接测试
[百度](https://www.baidu.com)
[GitHub](https://github.com)
这是一个[外部链接示例](https://example.com)，点击跳转。
## 图片测试
![示例图片](https://via.placeholder.com/300x200?text=Sample+Image)
![本地图片测试](/imgs/index-bg-img-01.png)
## 引用测试
> 这是一个引用块
> 可以包含多行内容
> 用于突出重要信息
> 引用可以嵌套使用
> > 嵌套引用示例
## 水平线测试
第一段内容
---
第二段内容
***
第三段内容
## 段落和换行测试
这是一个段落。
这是另一个段落。
这一行后面有换行  
但是不会产生新段落。
这一行后面有空行
所以会产生新段落。
## 混合格式测试
这是一个**包含多种格式**的段落：
1. **粗体** 和 *斜体* 文本
2. `行内代码` 和 [链接](https://example.com)
3. ~~删除线~~ 效果
> 引用中的混合格式
> - **粗体列表项**
> - *斜体列表项*
> - `代码列表项`
## 特殊字符测试
支持特殊字符：© ® ™ € £ ¥ § ± × ÷ ∞ ≈ ≠ ≤ ≥ ← → ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙
数学符号：α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ τ υ φ χ ψ ω
标点符号：! @ # $ % ^ & * ( ) - _ + = { } [ ] | \ : ; " '' < > , . ? / ~ `
## 结尾测试
文章结尾没有特殊格式。',
  '这是测试 markdownRenderer.tsx 中所有支持的 Markdown 标记的文章',
  NULL,
  'PUBLISHED',
  '2025-01-01T10:00:00Z',
  'Azuxa616',
  0,
  'cat-002',
  3,
  0,
  NULL,
  NULL,
  '2025-10-25T00:00:00Z',
  '2025-10-25T00:00:00Z'
);

-- 插入文章标签关联数据
-- 文章 1 (TailwindCSS) 的标签
INSERT OR IGNORE INTO article_tags (id, article_id, tag_id, created_at) VALUES
('at-001', 'article-001', 'tag-001', '2025-01-01T00:00:00Z'), -- CSS
('at-002', 'article-001', 'tag-002', '2025-01-01T00:00:00Z'), -- TailwindCSS
('at-003', 'article-001', 'tag-003', '2025-01-01T00:00:00Z'), -- 前端开发
('at-004', 'article-001', 'tag-004', '2025-01-01T00:00:00Z'); -- 框架

-- 文章 2 (Markdown 测试) 的标签
INSERT OR IGNORE INTO article_tags (id, article_id, tag_id, created_at) VALUES
('at-005', 'article-002', 'tag-005', '2025-01-01T00:00:00Z'), -- Markdown
('at-006', 'article-002', 'tag-006', '2025-01-01T00:00:00Z'); -- 测试

-- ============================================
-- 第五部分：完成提示
-- Part 5: Completion message
-- ============================================

-- 数据库初始化完成！
-- Database initialization completed!

-- 默认管理员账号信息：
-- Default admin account:
--   用户名 / Username: admin
--   密码 / Password: admin
--   ⚠️ 警告：生产环境请务必修改默认密码！
--   ⚠️ Warning: Please change the default password in production!

-- 已创建的初始数据：
-- Initial data created:
--   - 5 个分类 / 5 categories
--   - 6 个标签 / 6 tags
--   - 1 个管理员用户 / 1 admin user
--   - 2 篇示例文章 / 2 sample articles

