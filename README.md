# Azuxa's BlogWorld 🦋

一个现代化、响应式的个人博客前端项目，采用最新的 Web 技术栈构建。

## ✨ 项目特色

- 🎨 **现代化设计** - 使用 TailwindCSS 构建的美观界面
- ⌨️ **打字机效果** - 自定义 Typewriter 组件实现动态文字效果
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

## 🎯 主要功能

### 🏠 首页
- 全屏背景图片展示
- 动态打字机效果标题
- 响应式设计布局

### 👤 关于页面
- 个人介绍页面
- 简洁现代的设计

### ⌨️ Typewriter 组件
- 高度可定制的打字机效果
- 支持初始文本和循环文本
- 可配置打字速度、删除速度、光标样式等

## 🚀 部署

### Vercel 部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/blog-frontend)

### 其他部署方式

项目可以部署到任何支持 Node.js 的平台：

- **Netlify**
- **Railway**
- **Render**
- **自托管服务器**

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [TailwindCSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [React](https://react.dev/) - 用户界面库
- [TypeScript](https://www.typescriptlang.org/) - 类型系统

---

由 ❤️ 和 ☕ 驱动 | © 2025 Azuxa's BlogSpace. 保留所有权利.
