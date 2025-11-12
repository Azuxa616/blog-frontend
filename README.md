# Azuxa's BlogWorld 🦋

一个现代化的全栈个人博客系统，采用 Next.js 16 和 React 19 构建，提供完整的文章管理、内容发布和管理后台功能。

## ✨ 项目特色

- 🎨 **现代化设计** - 使用 TailwindCSS 4 构建的美观界面，支持暗色模式
- 📱 **响应式布局** - 完美适配桌面和移动设备
- ⚡ **高性能** - 基于 Next.js 16 和 Turbopack 的快速构建
- 🔧 **TypeScript** - 完整的类型安全支持
- 📝 **Markdown 编辑器** - 内置 Markdown 编辑器，支持实时预览和语法高亮
- 🖼️ **图片管理** - 完整的图片上传、管理和图库功能
- 📊 **数据可视化** - 使用 ECharts 提供数据统计和可视化
- 🔐 **安全认证** - JWT 认证系统，保护管理后台
- 🗄️ **数据库** - 支持 LibSQL/Turso 和本地 SQLite

## 🚀 技术栈

### 核心框架
- **Framework**: [Next.js 16.0.1](https://nextjs.org/) - React 全栈框架（App Router）
- **Runtime**: [React 19.1.0](https://react.dev/) - 用户界面库
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- **Styling**: [TailwindCSS 4.1.14](https://tailwindcss.com/) - 原子化 CSS 框架
- **Build Tool**: Turbopack - Next.js 内置的高性能打包器

### 数据库与 ORM
- **Database**: LibSQL / SQLite - 轻量级数据库
- **ORM**: [Drizzle ORM 0.44.7](https://orm.drizzle.team/) - 类型安全的 ORM
- **Database Client**: [@libsql/client 0.14.0](https://github.com/tursodatabase/libsql-client-ts) - LibSQL 客户端

### 功能库
- **认证**: [Jose 6.1.0](https://github.com/panva/jose) / [jsonwebtoken 9.0.2](https://github.com/auth0/node-jsonwebtoken) - JWT 认证
- **密码加密**: [bcryptjs 2.4.3](https://github.com/dcodeIO/bcrypt.js) - 密码哈希
- **Markdown**: [gray-matter 4.0.3](https://github.com/jonschlinkert/gray-matter) - Front Matter 解析
- **代码高亮**: [prism-react-renderer 2.4.1](https://github.com/FormidableLabs/prism-react-renderer) / [react-syntax-highlighter 16.0.0](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- **数据可视化**: [ECharts 6.0.0](https://echarts.apache.org/) - 图表库
- **文件上传**: [Multer 1.4.5](https://github.com/expressjs/multer) - 文件上传中间件
- **图片处理**: [Sharp 0.33.5](https://sharp.pixelplumbing.com/) - 高性能图片处理
- **验证**: [Zod 3.22.4](https://zod.dev/) - TypeScript 优先的验证库
- **云存储**: [@vercel/blob 2.0.0](https://vercel.com/docs/storage/vercel-blob) - Vercel Blob 存储

### 开发工具
- **Linting**: [ESLint 9](https://eslint.org/) - 代码质量检查
- **字体**: [Geist 1.5.1](https://vercel.com/font) - Vercel 字体

## 📁 项目结构

```
blog-frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API 路由
│   │   │   ├── articles/         # 文章 API
│   │   │   ├── auth/             # 认证 API
│   │   │   ├── categories/       # 分类 API
│   │   │   ├── tags/             # 标签 API
│   │   │   ├── upload/           # 文件上传 API
│   │   │   └── blobs/            # Blob 存储 API
│   │   ├── admin/                # 管理后台
│   │   │   ├── _components/      # 管理后台组件
│   │   │   │   ├── ArticleEditor.tsx    # Markdown 编辑器
│   │   │   │   ├── ChartPanel.tsx       # 数据图表
│   │   │   │   ├── ImagePicker.tsx      # 图片选择器
│   │   │   │   └── Sidebar.tsx          # 侧边栏导航
│   │   │   ├── dashboard/        # 仪表盘
│   │   │   ├── content/          # 内容管理
│   │   │   ├── articles/         # 文章编辑
│   │   │   ├── gallery/          # 图库管理
│   │   │   ├── settings/         # 系统设置
│   │   │   └── login/            # 登录页面
│   │   ├── articles/             # 文章展示
│   │   │   ├── [id]/             # 文章详情页
│   │   │   └── page.tsx          # 文章列表页
│   │   ├── about/                # 关于页面
│   │   ├── layout.tsx            # 根布局
│   │   ├── page.tsx              # 首页
│   │   └── globals.css           # 全局样式
│   ├── components/               # 可复用组件
│   │   ├── HeaderBar.tsx         # 头部导航栏
│   │   ├── FooterBar.tsx         # 页脚
│   │   ├── Typewriter.tsx        # 打字机效果
│   │   ├── BusinessCard.tsx      # 名片组件
│   │   ├── CategoryFilter.tsx    # 分类筛选器
│   │   ├── Pagination.tsx        # 分页组件
│   │   └── ...
│   ├── contexts/                 # React Context
│   │   ├── DarkModeContext.tsx   # 暗色模式上下文
│   │   └── PageContext.tsx       # 页面状态上下文
│   ├── lib/                      # 工具库
│   │   ├── db/                   # 数据库相关
│   │   │   ├── schema.ts         # Drizzle 数据库模式
│   │   │   └── index.ts          # 数据库连接
│   │   ├── storage/              # 存储系统
│   │   ├── utils/                # 工具函数
│   │   │   ├── markdownRenderer/ # Markdown 渲染器
│   │   │   ├── auth.ts           # 认证工具
│   │   │   └── validation.ts     # 数据验证
│   │   └── config/               # 配置文件
│   └── types/                    # TypeScript 类型定义
│       ├── article.ts            # 文章类型
│       ├── category.ts           # 分类类型
│       ├── tag.ts                # 标签类型
│       └── auth.ts               # 认证类型
├── public/                       # 静态资源
│   ├── imgs/                     # 图片资源
│   ├── svgs/                     # SVG 图标
│   └── uploads/                  # 上传文件目录
├── data/                         # 数据目录
│   └── blog.db                   # SQLite 数据库文件
├── sql/                          # SQL 脚本
│   ├── init.sql                  # 数据库初始化脚本
│   └── turso-parts/              # Turso 数据库脚本
├── scripts/                      # 脚本文件
│   ├── setup-env.sh              # 环境配置脚本
│   └── generate-password-hash.ts # 密码哈希生成
├── drizzle.config.ts             # Drizzle ORM 配置
├── next.config.ts                # Next.js 配置
└── package.json                  # 项目依赖

```

## 🛠️ 本地开发

### 环境要求

- Node.js 18.0 或更高版本
- npm/yarn/pnpm/bun

### 环境变量配置

在项目根目录创建 `.env.local` 文件（或使用 `.env.develop` / `.env.production`），配置以下环境变量：

```bash
# 数据库配置
# 本地 SQLite: file:./data/blog.db
# Turso 云数据库: libsql://your-database-name.turso.io
DATABASE_URL=file:./data/blog.db

# Turso 数据库认证令牌（仅在使用 Turso 云数据库时需要）
# DATABASE_AUTH_TOKEN=your-turso-auth-token-here

# JWT 认证配置
JWT_SECRET=your-jwt-secret-key-here
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# 管理员账号配置
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# 应用配置
NEXTAUTH_URL=http://localhost:3000
APP_VERSION=0.1.0
AUTHOR=Azuxa

# 文件上传配置
UPLOAD_DIR=./public/uploads
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# 邮件配置（可选）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@azuxa.com
FROM_NAME=Azuxa's BlogSpace

# Vercel Blob 存储配置（可选）
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

**配置说明：**

1. **本地开发环境**（推荐）：
   - `DATABASE_URL=file:./data/blog.db` - 使用本地 SQLite 文件
   - 不需要 `DATABASE_AUTH_TOKEN`
   - 数据库文件会自动创建在 `data/blog.db`

2. **Turso 云数据库**：
   - `DATABASE_URL=libsql://your-database-name.turso.io`
   - `DATABASE_AUTH_TOKEN=your-turso-auth-token-here`
   - 在 [Turso 控制台](https://turso.tech/) 获取这些信息

3. **环境切换**：
   - 项目包含 `scripts/setup-env.sh` 脚本，可根据 Git 分支自动切换环境配置
   - `main/master` 分支使用 `.env.production`
   - `develop/dev` 分支使用 `.env.develop`

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
# 或
bun install
```

### 初始化数据库

```bash
# 初始化数据库（创建表结构）
npm run init:db

# 导入示例文章（可选）
npm run import:articles

# 一键设置（初始化数据库 + 导入示例文章）
npm run setup

# 初始化存储系统
npm run init
```

### 生成管理员密码哈希

如果需要设置自定义管理员密码，可以使用以下命令生成密码哈希：

```bash
npm run hash-pwd
```

### 启动开发服务器

```bash
# 标准开发模式
npm run dev

# 使用 Turbopack（更快）
npm run dev:turbo
```

打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看结果。

**默认管理员账号：**
- 用户名：`admin`（或 `.env.local` 中配置的 `ADMIN_USERNAME`）
- 密码：`admin`（或 `.env.local` 中配置的 `ADMIN_PASSWORD`）

### 构建生产版本

```bash
# 标准构建
npm run build

# 使用 Turbopack 构建
npm run build:turbo
```

### 启动生产服务器

```bash
npm run start
```

### 代码检查

```bash
npm run lint
```

## 🎯 主要功能

### 前端功能

- **首页** - 精美的欢迎页面，支持展开/折叠动画
- **文章列表** - 支持分类筛选、搜索、排序和分页
- **文章详情** - Markdown 渲染，代码语法高亮，阅读时间估算
- **关于页面** - 个人介绍页面
- **响应式设计** - 完美适配各种设备尺寸
- **暗色模式** - 支持明暗主题切换

### 管理后台

- **仪表盘** - 数据统计和可视化图表
- **内容管理** - 文章、分类、标签的完整 CRUD 操作
- **Markdown 编辑器** - 支持写作/预览/并排三种模式，实时预览
- **图库管理** - 图片上传、预览、删除和管理
- **系统设置** - 应用配置管理
- **用户认证** - JWT 认证保护，安全的登录/登出

### API 功能

- **文章 API** - 文章的增删改查、状态管理
- **分类 API** - 分类管理
- **标签 API** - 标签管理
- **认证 API** - 登录、登出、用户信息
- **文件上传 API** - 图片上传和管理
- **Blob 存储 API** - Vercel Blob 存储支持

## 🗄️ 数据库结构

项目使用 Drizzle ORM 管理数据库，主要表结构：

- **categories** - 文章分类表
- **tags** - 标签表
- **articles** - 文章表
- **article_tags** - 文章标签关联表
- **users** - 用户表（管理员）

详细表结构请查看 `src/lib/db/schema.ts`。

## 🚀 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 部署完成

### 其他部署方式

项目可以部署到任何支持 Node.js 的平台：

- **Netlify** - 支持 Next.js，需要配置环境变量
- **Railway** - 支持数据库和文件存储
- **Render** - 支持 PostgreSQL 和文件存储
- **自托管服务器** - 需要 Node.js 环境和数据库

**部署注意事项：**

1. 确保配置所有必需的环境变量
2. 如果使用 Turso 数据库，配置 `DATABASE_URL` 和 `DATABASE_AUTH_TOKEN`
3. 如果使用本地 SQLite，确保 `data/` 目录可写
4. 配置 `JWT_SECRET` 和 `JWT_REFRESH_SECRET` 为安全的随机字符串
5. 生产环境建议使用强密码和 HTTPS

## 📝 开发说明

### Markdown 支持

项目内置了完整的 Markdown 渲染器，支持：

- 标题（H1-H6）
- 段落和换行
- 列表（有序/无序）
- 代码块（语法高亮）
- 行内代码
- 粗体、斜体、删除线
- 链接和图片
- 引用块
- 水平分割线

### 文件上传

- 支持本地文件系统存储
- 支持 Vercel Blob 云存储
- 图片自动优化（使用 Sharp）
- 文件类型和大小验证

### 认证系统

- JWT Token 认证
- Refresh Token 支持
- 密码使用 bcrypt 加密
- API 路由保护中间件

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENCE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [TailwindCSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [React](https://react.dev/) - 用户界面库
- [TypeScript](https://www.typescriptlang.org/) - 类型系统
- [Drizzle ORM](https://orm.drizzle.team/) - 类型安全的 ORM
- [Turso](https://turso.tech/) - LibSQL 数据库服务
- [ECharts](https://echarts.apache.org/) - 数据可视化库

---

**Azuxa's BlogWorld** - 一个现代化的全栈博客系统 🦋
