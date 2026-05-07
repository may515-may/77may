# 项目部署指南 - Vercel

## 项目概述

这是一个基于 **React + TypeScript + Vite** 构建的博客应用，使用了以下技术栈：

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **样式**: Tailwind CSS 3
- **组件库**: shadcn/ui + Radix UI
- **路由**: React Router DOM
- **状态管理**: React Context

## 部署到 Vercel 的步骤

### 前提条件

1. 已安装 Git
2. 有 GitHub 账户
3. 有 Vercel 账户（可使用 GitHub 账号登录）

---

### 步骤 1: 准备项目

确保项目可以正常构建：

```bash
# 安装依赖
npm install

# 构建项目
npm run build
```

如果构建成功，会生成 `dist` 目录。

---

### 步骤 2: 推送到 GitHub

首先初始化 Git 仓库并推送到 GitHub：

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 创建 .gitignore 文件（如果不存在）
# 确保包含 node_modules/, dist/, .env 等

# 提交
git commit -m "Initial commit"

# 添加远程仓库（替换为你的 GitHub 仓库地址）
git remote add origin https://github.com/may515-may/May77.git

# 推送到 GitHub
git push -u origin main
```

---

### 步骤 3: 部署到 Vercel

#### 方法 A: 通过 Vercel 官网部署（推荐）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New Project**
3. 选择 **Import Git Repository**
4. 选择你的 GitHub 仓库（`love-gift-blog`）
5. 点击 **Import**

#### 配置构建设置

在配置页面，确保以下设置正确：

| 设置项 | 值 | 说明 |
|--------|-----|------|
| Framework | Vite | 自动检测 |
| Build Command | `npm run build` | 构建命令 |
| Output Directory | `dist` | 输出目录 |
| Node.js Version | 20.x | 建议使用 LTS 版本 |

点击 **Deploy** 开始部署。

---

#### 方法 B: 使用 Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 在项目目录中初始化
vercel

# 部署到生产环境
vercel --prod
```

---

### 步骤 4: 配置环境变量（如需要）

如果项目使用环境变量，需要在 Vercel 中配置：

1. 进入项目 Dashboard
2. 点击 **Settings** > **Environment Variables**
3. 添加环境变量

---

### 步骤 5: 验证部署

部署完成后，Vercel 会提供一个 URL（如 `https://love-gift-blog.vercel.app`）。

访问该 URL 验证：
- 页面是否正常加载
- 所有功能是否正常工作
- 样式是否正确渲染

---

## Vite 配置说明

项目的 `vite.config.ts` 已配置为相对路径：

```typescript
export default defineConfig({
  base: './',  // 相对路径，确保静态资源正确加载
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

> **注意**: `base: './'` 确保部署后静态资源路径正确。

---

## 项目结构说明

```
love-gift-blog/
├── src/
│   ├── components/          # UI 组件
│   │   ├── ui/             # shadcn/ui 组件
│   │   ├── ArticleForm.tsx # 文章表单组件
│   │   └── Navbar.tsx      # 导航栏组件
│   ├── context/            # React Context
│   │   └── ArticleContext.tsx
│   ├── data/               # 模拟数据
│   │   └── articles.ts
│   ├── hooks/              # 自定义 Hooks
│   │   └── use-mobile.ts
│   ├── lib/                # 工具函数
│   │   └── utils.ts
│   ├── pages/              # 页面组件
│   │   ├── About.tsx
│   │   ├── ArticleDetail.tsx
│   │   ├── ArticleList.tsx
│   │   └── TagPage.tsx
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 入口文件
│   ├── App.css             # 应用样式
│   └── index.css           # 全局样式
├── package.json            # 依赖配置
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── tailwind.config.cjs     # Tailwind 配置
└── postcss.config.js       # PostCSS 配置
```

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run preview` | 预览构建结果 |

---

## 故障排除

### 构建失败

1. **检查依赖**: 确保所有依赖已安装
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **检查 TypeScript 错误**: 运行 `npx tsc` 检查类型错误

3. **检查 Node 版本**: 确保使用 Node.js 20+

### 部署后样式丢失

- 确保 `vite.config.ts` 中 `base: './'` 配置正确
- 确保 `tailwind.config.cjs` 配置正确

### 路由问题

- 使用 React Router DOM 的 `BrowserRouter` 时，Vercel 会自动配置回退路由
- 如果使用 `HashRouter`，需要配置 `base` 路径

---

## CI/CD 集成

Vercel 会自动检测 GitHub 仓库的变化并触发部署：

1. 每次推送到 `main` 分支会自动部署到生产环境
2. 每次推送到其他分支会创建预览部署

可以在 Vercel Dashboard 中配置：
- 部署分支策略
- 环境变量
- 构建命令

---

## 自定义域名

如需使用自定义域名：

1. 在 Vercel Dashboard 中进入项目
2. 点击 **Settings** > **Domains**
3. 添加自定义域名
4. 在 DNS 服务商处配置 CNAME 记录

---

## 总结

部署流程：
1. ✅ 确保项目可构建
2. ✅ 推送到 GitHub
3. ✅ 在 Vercel 中导入仓库
4. ✅ 配置构建设置
5. ✅ 部署并验证

完成以上步骤后，你的博客应用就成功部署到 Vercel 了！