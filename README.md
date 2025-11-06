# Azuxa's BlogWorld 🦋

一个现代化、响应式的个人博客前端项目，采用最新的 Web 技术栈构建。

## ✨ 项目特色

- 🎨 **现代化设计** - 使用 TailwindCSS 构建的美观界面
- 📱 **响应式布局** - 完美适配桌面和移动设备
- ⚡ **高性能** - 基于 Next.js 15 和 Turbopack 的快速构建
- 🔧 **TypeScript** - 完整的类型安全支持

## 🚀 技术栈

- **Framework**: [Next.js 15.5.4](https://nextjs.org/) - React 全栈框架
- **Runtime**: [React 19.1.0](https://react.dev/) - 用户界面库
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- **Styling**: [TailwindCSS 4.1.14](https://tailwindcss.com/) - 原子化 CSS 框架
- **Build Tool**: Turbopack - Next.js 内置的高性能打包器
- **Linting**: [ESLint](https://eslint.org/) - 代码质量检查

## 📁 项目结构

```
blog-frontend/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── about/             # 关于页面
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   └── components/            # 可复用组件
│       ├── HeaderBar.tsx      # 头部导航栏
│       ├── MenuButton.tsx     # 菜单按钮
│       └── Typewriter.tsx     # 打字机组件
└── public/                    # 静态资源
    ├── imgs/                  # 图片资源
    └── svgs/                  # SVG 图标

```

## 🛠️ 本地开发

### 环境要求

- Node.js 18.0 或更高版本
- npm/yarn/pnpm/bun

### 数据库配置

项目使用 LibSQL (Turso) 数据库。在项目根目录创建 `.env` 文件并配置以下环境变量：

```bash
# 数据库连接 URL
# 本地 SQLite: file:./data/blog.db
# Turso 云数据库: libsql://your-database-name.turso.io
DATABASE_URL=file:./data/blog.db

# Turso 数据库认证令牌（仅在使用 Turso 云数据库时需要）
# 如果使用本地 SQLite 文件，可以省略此配置
# DATABASE_AUTH_TOKEN=your-turso-auth-token-here
```

**配置说明：**

1. **本地开发环境**（推荐）：
   - `DATABASE_URL=file:./data/blog.db`
   - 不需要 `DATABASE_AUTH_TOKEN`
   - 数据库文件会自动创建在 `data/blog.db`

2. **Turso 云数据库**：
   - `DATABASE_URL=libsql://your-database-name.turso.io`
   - `DATABASE_AUTH_TOKEN=your-turso-auth-token-here`
   - 在 [Turso 控制台](https://turso.tech/) 获取这些信息

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

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看结果。

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 启动生产服务器

```bash
npm run start
# 或
yarn start
# 或
pnpm start
```

### 代码检查

```bash
npm run lint
# 或
yarn lint
# 或
pnpm lint
```

## 🚀 部署

### Vercel 部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/blog-frontend)

### 其他部署方式

项目可以部署到任何支持 Node.js 的平台：

- **Netlify**
- **Railway**
- **Render**
- **自托管服务器**

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [TailwindCSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [React](https://react.dev/) - 用户界面库
- [TypeScript](https://www.typescriptlang.org/) - 类型系统

