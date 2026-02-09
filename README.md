# JD Optimizer - 开发者招聘JD优化器

一个基于AI的智能招聘职位描述优化工具，帮助HR和招聘者创建更专业、更吸引人的职位描述。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Version](https://img.shields.io/badge/version-0.1.0-brightgreen)]()

## 📋 目录

- [项目简介](#项目简介)
- [核心特性](#核心特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [开发环境设置](#开发环境设置)
- [项目结构](#项目结构)
- [可用脚本](#可用脚本)
- [部署指南](#部署指南)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 项目简介

JD Optimizer 是一个基于AI的智能招聘职位描述优化工具。利用先进的人工智能技术，帮助HR和招聘者：
- 分析和优化招聘职位描述
- 确保内容专业、清晰且具有吸引力
- 提升职位描述的标准化程度
- 帮助公司吸引更多优质开发者候选人

本工具支持多语言、批量处理，并提供丰富的导出格式，适合个人用户和企业团队使用。

## 核心特性

### 🎯 智能分析
- **AI驱动分析** - 使用最先进的AI模型深度分析JD内容
- **自动优化建议** - 基于行业最佳实践提供优化建议
- **智能重写** - 一键优化和重写职位描述
- **行业标准模板** - 内置多种职位类型的专业模板

### ✨ 编辑与管理
- **实时预览** - 所见即所得的编辑体验
- **版本管理** - 自动保存历史版本，支持回溯
- **项目管理** - 组织和管理多个职位描述项目
- **批量处理** - 高效处理大量JD文件

### 🚀 高级功能
- **多语言支持** - 支持中英文等多语言界面
- **多种导出格式** - 支持PDF、Word、Markdown等格式
- **API集成** - 开放API接口，支持第三方集成
- **协作功能** - 团队成员间共享和协作
- **数据分析** - 提供使用统计和效果分析报告

### 🔐 用户系统
- **认证授权** - 安全的用户注册和登录
- **角色管理** - 支持多角色权限控制
- **企业版功能** - 为企业团队提供高级功能

## 技术栈

### 前端框架
- **Next.js 16.0.7** - React全栈框架，提供SSR/SSG支持
- **React 19** - 现代化的用户界面库
- **TypeScript** - 类型安全的JavaScript超集
- **Tailwind CSS 4** - 新一代原子化CSS框架

### 数据库与ORM
- **Drizzle ORM** - 现代化的TypeScript ORM
- **LibSQL** - 轻量级嵌入式SQL数据库
- **PostgreSQL** - 生产环境数据库支持（可选）

### 认证与安全
- **Better Auth** - 现代化的认证解决方案
- **RBAC** - 基于角色的访问控制

### AI与集成
- **AI SDK** - 统一的AI模型接口
- **OpenRouter** - 多AI模型提供商支持
- **Replicate** - AI模型部署平台

### UI组件
- **Shadcn UI** - 高质量React组件库
- **Radix UI** - 无障碍的UI基础组件
- **Framer Motion** - 流畅的动画效果

### �与其他工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Stripe** - 支付处理
- **Resend** - 邮件服务

## 快速开始

### 方式一：Docker（推荐）

```bash
# 克隆项目
git clone https://github.com/yourusername/jd-optimizer.git
cd jd-optimizer

# 使用Docker Compose启动
docker-compose up -d

# 访问应用
open http://localhost:3000
```

### 方式方式二：本地开发

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/jd-optimizer.git
cd jd-optimizer

# 2. 安装依赖（使用pnpm）
pnpm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写必要的配置

# 4. 初始化数据库
pnpm db:push

# 5. 启动开发服务器
pnpm dev

# 6. 访问应用
# 打开浏览器访问 http://localhost:3000
```

## 开发环境设置

### 前置要求

- **Node.js** 25.2.1 或更高版本
- **pnpm** 9.0 或更高版本（推荐）
- **Git** 最新版本

### 环境变量配置

复制 `.env.example` 到 `.env` 并配置以下变量：

```bash
# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="JD Optimizer"

# 数据库配置
DATABASE_URL="file:./dev.db"
# 或者使用PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/jd_optimizer"

# 认证配置
AUTH_SECRET=your-secret-key-here
AUTH_URL=http://localhost:3000

# AI配置
OPENROUTER_API_KEY=your-openrouter-api-key
# 或者配置Replicate
REPLICATE_API_TOKEN=your-replicate-token

# OAuth配置（可选）
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 邮件配置（可选）
RESEND_API_KEY=your-resend-api-key

# 支付配置（可选）
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### 数据库初始化

```bash
# 生成数据库迁移文件
pnpm db:generate

# 应用数据库迁移
pnpm db:migrate

# 或直接推送schema到数据库（开发环境）
pnpm db:push

# 打开数据库管理界面
pnpm db:studio
```

### 认证系统初始化

```bash
# 生成认证配置
pnpm auth:generate

# 初始化RBAC角色
pnpm rbac:init

# 为用户分配角色
pnpm rbac:assign
```

## 项目结构

```
jd-optimizer/
├── src/
│   ├── app/                    # Next.js App Router页面
│   │   ├── (auth)/            # 认证相关页面
│   │   ├── (dashboard)/       # 仪表板页面
│   │   ├── (marketing)/       # 营销页面
│   │   ├── api/               # API路由
│   │   └── layout.tsx         # 根布局
│   ├── components/            # React组件
│   │   ├── ui/               # 基础UI组件
│   │   ├── auth/             # 认证组件
│   │   ├── jd-editor/        # JD编辑器组件
│   │   └── shared/           # 共享组件
│   ├── core/                  # 核心功能
│   │   ├── auth/             # 认证系统
│   │   ├── db/               # 数据库配置和schema
│   │   └── rbac/             # 权限控制
│   ├── lib/                   # 工具库
│   ├── styles/                # 全局样式
│   └── shared/                # 共享类型和工具
├── public/                     # 静态资源
│   ├── images/
│   └── icons/
├── scripts/                    # 构建和部署脚本
├── content/                    # 文档内容
├── .env.example               # 环境变量示例
├── package.json               # 项目配置
├── tsconfig.json              # TypeScript配置
├── next.config.mjs            # Next.js配置
├── tailwind.config.ts         # Tailwind CSS配置
└── README.md                  # 项目文档
```

## 可用脚本

### 开发
```bash
pnpm dev              # 启动开发服务器（带Turbopack）
pnpm build            # 构建生产版本
pnpm build:fast       # 快速构建生产版本
pnpm start            # 启动生产服务器
```

### 代码质量
```bash
pnpm lint             # 运行ESLint检查
pnpm format           # 格式化代码
pnpm format:check     # 检查代码格式
```

### 数据库
```bash
pnpm db:generate      # 生成数据库迁移文件
pnpm db:migrate       # 应用数据库迁移
pnpm db:              # 推送schema到数据库
pnpm db:studio        # 打开数据库管理界面
```

### 认证与权限
```bash
pnpm auth:generate    # 生成认证配置
pnpm rbac:init        # 初始化RBAC角色
pnpm rbac:assign      # 为用户分配角色
```

### Cloudflare部署
```bash
pnpm cf:preview       # Cloudflare预览
pnpm cf:deploy        # 部署到Cloudflare
pnpm cf:upload        # 上传到Cloudflare
pnpm cf:typegen       # 生成Cloudflare类型
```

## 部署指南

### Vercel部署（推荐）

1. **连接Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **部署**
   ```bash
   vercel
   ```

3. **配置环境变量**
   在Vercel控制台配置所有必要的环境变量

4. **查看部署**
   访问 `https://your-project.vercel.app`

### Docker部署

```bash
# 构建Docker镜像
docker build -t jd-optimizer .

# 运行容器
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./dev.db" \
  -e AUTH_SECRET="your-secret" \
  jd-optimizer
```

### Cloudflare Workers部署

```bash
# 部署到Cloudflare
pnpm cf:deploy

# 上传资源
pnpm cf:upload
```

详细部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 贡献指南

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细信息。

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### 代码规范

- 遵循ESLint和Prettier配置
- 编写清晰的commit message
- 添加必要的测试
- 更新相关文档

## 相关文档

- [API文档](./API.md) - 完整的API参考
- [贡献指南](./CONTRIBUTING.md) - 如何参与贡献
- [变更日志](./CHANGELOG.md) - 版本更新记录
- [许可证](./LICENSE) - MIT许可证

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件

## 联系方式

- **项目主页**: https://github.com/yourusername/jd-optimizer
- **问题反馈**: https://github.com/yourusername/jd-optimizer/issues
- **邮箱**: support@jd-optimizer.com

---

**⭐ 如果这个项目对你有帮助，请给一个Star！**
