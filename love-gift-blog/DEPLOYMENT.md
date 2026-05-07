# 项目部署指南 - Vercel

## 项目概述

这是一个基于 **React + TypeScript + Vite** 构建的全栈博客应用，支持多设备数据同步。

### 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 19.2.0 |
| 语言 | TypeScript | ~5.9.3 |
| 构建工具 | Vite | 7.2.4 |
| 样式框架 | Tailwind CSS | 3.4.19 |
| 组件库 | shadcn/ui + Radix UI | - |
| 路由 | React Router DOM | 7.15.0 |
| 数据库 | SQLite + Prisma | - |
| ORM | Prisma | 7.x |

### 核心功能

- ✅ **多设备同步**: 自动定时同步数据（每5秒刷新）
- ✅ **CRUD 操作**: 创建、读取、更新、删除文章
- ✅ **实时更新**: 任何设备的更改会自动同步到其他设备

---

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

```bash
git add .
git commit -m "Add backend with Prisma SQLite"
git push origin main
```

---

### 步骤 3: 部署到 Vercel

#### 方法 A: 通过 Vercel 官网部署（推荐）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New Project**
3. 选择 **Import Git Repository**
4. 选择仓库 `may515-may/77may`
5. 点击 **Import**

#### 配置构建设置

| 设置项 | 值 | 说明 |
|--------|-----|------|
| Framework | Vite | 自动检测 |
| Build Command | `npm run build` | 构建命令 |
| Output Directory | `dist` | 输出目录 |
| Node.js Version | 20.x | 建议使用 LTS 版本 |

#### 配置环境变量

在 Vercel 项目设置中添加环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| DATABASE_URL | `file:./dev.db` | SQLite 数据库路径 |

点击 **Deploy** 开始部署。

---

### 步骤 4: 数据库迁移（首次部署）

部署完成后，需要初始化数据库：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 运行数据库迁移
vercel run npx prisma migrate deploy --prod
```

---

### 步骤 5: 验证部署

部署完成后，Vercel 会提供一个 URL（如 `https://77may.vercel.app`）。

**验证内容：**
- ✅ 页面正常加载
- ✅ 文章列表显示
- ✅ 创建/编辑/删除文章功能
- ✅ 多设备同步测试（在手机和电脑上同时打开，修改内容验证同步）

---

## 后端 API 说明

### API 端点

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/api/articles` | 获取所有文章 |
| GET | `/api/articles/:id` | 获取单篇文章 |
| POST | `/api/articles` | 创建新文章 |
| PUT | `/api/articles/:id` | 更新文章 |
| DELETE | `/api/articles/:id` | 删除文章 |

### 请求示例

**创建文章：**
```bash
curl -X POST https://77may.vercel.app/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "新文章标题",
    "content": "文章内容",
    "excerpt": "文章摘要",
    "tags": ["React", "TypeScript"]
  }'
```

---

## 项目结构说明

```
love-gift-blog/
├── api/                     # Vercel Serverless API
│   └── articles/
│       ├── route.ts         # GET/POST 文章
│       └── [id]/route.ts    # GET/PUT/DELETE 单篇文章
├── prisma/                  # Prisma 配置
│   ├── schema.prisma        # 数据库模型
│   └── prisma.config.ts     # Prisma 配置文件
├── src/
│   ├── components/          # UI 组件
│   │   ├── ui/             # shadcn/ui 组件
│   │   ├── ArticleForm.tsx
│   │   └── Navbar.tsx
│   ├── context/
│   │   └── ArticleContext.tsx  # 数据同步上下文
│   ├── data/
│   │   └── articles.ts      # 初始数据
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   └── useArticleSync.ts   # 同步 Hook
│   ├── services/
│   │   └── articleService.ts   # API 服务层
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── ArticleDetail.tsx
│   │   ├── ArticleList.tsx
│   │   └── TagPage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── App.css
│   └── index.css
├── .env                     # 环境变量
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.cjs
└── postcss.config.js
```

---

## 数据同步机制

### 工作原理

1. **定时刷新**: 前端每 5 秒自动请求后端获取最新数据
2. **即时更新**: CRUD 操作后立即更新本地状态
3. **冲突处理**: 以服务器数据为准，自动覆盖本地更改

### 同步流程

```
设备 A 修改文章
    ↓
发送 PUT 请求到 API
    ↓
服务器更新数据库
    ↓
设备 B 定时轮询（每5秒）
    ↓
获取更新后的文章
    ↓
自动更新 UI
```

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run lint` | 运行 ESLint |
| `npx prisma migrate dev` | 开发环境数据库迁移 |
| `npx prisma migrate deploy` | 生产环境数据库迁移 |
| `npx prisma studio` | 打开数据库管理界面 |

---

## 故障排除

### 数据库连接失败

1. 确保环境变量 `DATABASE_URL` 已正确配置
2. 检查 Prisma 版本是否兼容

### API 404 错误

- 确保 `api/` 目录结构正确
- 检查 Vercel 部署日志

### 同步延迟

- 检查网络连接
- 同步间隔默认为 5 秒，可在 `useArticleSync.ts` 中调整

---

## CI/CD 集成

Vercel 会自动检测 GitHub 变化：

1. ✅ 推送到 `main` 分支 → 自动部署到生产环境
2. ✅ 推送到其他分支 → 创建预览部署

---

## 总结

部署完成后，你的博客应用将具备：

- ✅ 全栈 CRUD 功能
- ✅ 多设备数据同步
- ✅ SQLite 数据库持久化
- ✅ 自动部署流水线

现在你可以在手机、电脑等多个设备上访问应用，所有更改都会自动同步！