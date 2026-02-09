# 变更日志 - JD Optimizer

本文件记录JD Optimizer项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 计划中

- 企业团队协作功能
- 批量JD处理
- 数据分析和报告
- 多语言支持扩展
- 移动端适配

## [0.2.0] - 计划中

### 新增功能

- **AI分析引擎**
  - 集成OpenRouter多模型支持
  - 支持Claude、GPT-4等先进AI模型
  - 智能JD分析和建议

- **JD编辑器**
  - 实时预览功能
  - 富文本编辑
  - Markdown支持
  - 模板库

- **用户仪表板**
  - JD项目管理
  - 使用统计
  - 积分管理

- **导出功能**
  - PDF导出
  - Word文档导出
  - Markdown导出

### 改进

- 优化AI响应速度
- 改进用户界面
- 增强错误处理
- 优化数据库查询性能

### 技术改进

- 升级到Next.js 16.0.7
- 升级到React 19
- 集成Drizzle ORM
- 改进认证系统

### 文档

- 添加API文档
- 添加贡献指南
- 添加部署指南

### 修复

- 修复登录会话超时问题
- 修复文件上传错误
- 修复移动端显示问题

## [0.1.0] - 2024-01-01

### 新增功能

#### 基础架构
- ✅ Next.js 16.0.7项目初始化
- ✅ TypeScript配置
- ✅ Tailwind CSS 4样式系统
- ✅ ESLint和Prettier代码规范

#### 认证系统
- ✅ Better Auth集成
- ✅ 邮箱注册和登录
- ✅ GitHub OAuth集成
- ✅ Google OAuth集成
- ✅ 邮箱验证功能
- ✅ 会话管理

#### 数据库
- ✅ Drizzle ORM集成
- ✅ LibSQL数据库支持
- ✅ PostgreSQL数据库支持
- ✅ 数据库迁移系统
- ✅ 数据库管理界面（Drizzle Studio）

#### 权限系统
- ✅ RBAC（基于角色的访问控制）
- ✅ 角色管理
- ✅ 权限定义
- ✅ 权限检查中间件

#### 用户管理
- ✅ 用户注册
- ✅ 用户登录
- ✅ 用户信息获取
- ✅ 邮箱验证状态检查
- ✅ 积分系统
- ✅ 用户头像上传

#### AI服务
- ✅ AI SDK集成
- ✅ OpenRouter提供商支持
- ✅ Replicate提供商支持
- ✅ 多种AI模型支持（文本、图像、视频、音乐）
- ✅ AI任务管理
- ✅ 异步任务处理
- ✅ 任务状态查询

#### 支付系统
- ✅ Stripe集成
- ✅ PayPal集成
- ✅ 支付会话创建
- ✅ 支付回调处理
- ✅ Webhook通知处理
- ✅ 积分购买

#### 存储服务
- ✅ 图片上传
- ✅ 文件管理
- ✅ CDN集成支持

#### 聊天系统
- ✅ 聊天会话管理
- ✅ 消息发送和接收
- ✅ 聊天历史记录
- ✅ 多模型AI对话

#### API路由
- ✅ 认证API (`/api/auth/*`)
- ✅ 用户API (`/api/user/*`)
- ✅ AI生成API (`/api/ai/*`)
- ✅ 支付API (`/api/payment/*`)
- ✅ 存储API (`/api/storage/*`)
- ✅ 聊天API (`/api/chat/*`)
- ✅ JD管理API (`/api/jds/*`)

#### UI组件
- ✅ Shadcn UI组件库集成
- ✅ 基础UI组件（Button、Input、Select等）
- ✅ 认证组件（登录表单、注册表单）
- ✅ 布局组件
- ✅ 导航组件
- ✅ 响应式设计

#### 页面路由
- ✅ 首页
- ✅ 登录页面
- ✅ 注册页面
- ✅ 仪表板页面
- ✅ 用户设置页面

#### 开发工具
- ✅ 开发服务器（支持Turbopack）
- ✅ 生产构建
- ✅ 代码检查（ESLint）
- ✅ 代码格式化（Prettier）
- ✅ 数据库迁移脚本
- ✅ 认证生成脚本
- ✅ RBAC初始化脚本

#### 文档
- ✅ README.md（项目介绍）
- ✅ CONTRIBUTING.md（贡献指南）
- ✅ API.md（API文档）
- ✅ CHANGELOG.md（变更日志）
- ✅ 环境变量示例
- ✅ Docker配置
- ✅ Vercel部署配置
- ✅ Cloudflare部署配置

#### 配置
- ✅ 环境变量管理
- ✅ Next.js配置
- ✅ TypeScript配置
- ✅ Tailwind CSS配置
- ✅ ESLint配置
- ✅ Prettier配置

#### 部署支持
- ✅ Docker支持
- ✅ Vercel部署配置
- ✅ Cloudflare Workers部署
- ✅ Docker Compose配置

### 技术栈

#### 核心框架
- Next.js 16.0.7
- React 19.2.1
- TypeScript 5.x

#### 样式和UI
- Tailwind CSS 4
- Shadcn UI
- Radix UI
- Framer Motion

#### 数据库和ORM
- Drizzle ORM 0.44.2
- LibSQL 0.15.9
- PostgreSQL支持
- MySQL支持

#### 认证和权限
- Better Auth 1.3.7
- RBAC系统

#### AI服务
- AI SDK 5.0.39
- OpenRouter
- Replicate

#### 支付
- Stripe 18.5.0
- PayPal SDK

#### 其他工具
- Zod 4.1.5（数据验证）
- React Hook Form 7.62.0
- TanStack Table 8.21.3
- Sonner 2.0.7（Toast通知）
- Resend 6.0.3（邮件服务）

### 已知问题

- [ ] 部分AI模型响应速度较慢
- [ ] 文件上传大小限制待优化
- [ ] 移动端某些页面显示需要改进
- [ ] 国际化支持尚未完成

### 限制

- 免费用户每天有AI生成次数限制
- 文件上传最大10MB
- 单个JD最大长度10,000字符

### 即将推出

- [ ] JD分析和优化功能
- [ ] 模板系统
- [ ] 批量处理
- [ ] 数据分析报告
- [ ] 多语言界面
- [ ] 移动端应用

---

## 版本说明

### 版本号格式

- **主版本号**：不兼容的API修改
- **次版本号**：向下兼容的功能新增
- **修订号**：向下兼容的问题修复

### 变更类型

- `新增` - 新功能
- `改进` - 现有功能的改进
- `修复` - Bug修复
- `移除` - 功能移除
- `安全` - 安全相关的修复
- `技术改进` - 技术债务和重构
- `文档` - 文档更新

### 术语表

- **JD** - Job Description，职位描述
- **RBAC** - Role-Based Access Control，基于角色的访问控制
- **OAuth** - Open Authorization，开放授权
- **ORM** - Object-Relational Mapping，对象关系映射
- **SDK** - Software Development Kit，软件开发工具包

---

## 相关链接

- [项目主页](https://github.com/jd-optimizer/jd-optimizer)
- [问题反馈](https://github.com/jd-optimizer/jd-optimizer/issues)
- [功能请求](https://github.com/jd-optimizer/jd-optimizer/discussions)
- [API文档](./API.md)
- [贡献指南](./CONTRIBUTING.md)

---

**注意**: 本项目仍在积极开发中，API可能会有变更。建议在生产环境使用前进行充分测试。
