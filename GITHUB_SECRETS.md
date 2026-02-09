# GitHub Secrets 配置指南

本文档说明如何在GitHub中配置JD Optimizer项目所需的Secrets，以便自动化CI/CD流程。

---

## 目录

- [概述](#概述)
- [必需的Secrets](#必需的secrets)
- [配置步骤](#配置步骤)
- [Secrets列表](#secrets列表)
- [验证配置](#验证配置)
- [常见问题](#常见问题)

---

## 概述

GitHub Secrets用于存储敏感信息（如API密钥、数据库凭证），在GitHub Actions工作流中安全使用。

### 使用场景

- 自动化部署到Cloudflare Pages
- 运行数据库迁移
- 构建和测试应用程序
- 配置生产环境变量

---

## 配置步骤

### 1. 访问仓库设置

1. 进入GitHub仓库：`https://github.com/your-username/jd-optimizer`
2. 点击 **Settings** 标签
3. 在左侧菜单中选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret** 添加Secret

### 2. 添加Secret

对于每个Secret：

1. 点击 **New repository secret**
2. 输入 **Name**（Secret名称）
3. 输入 **Secret**（Secret值）
4. 点击 **Add secret**

### 3. 区分环境（可选）

如果需要区分不同环境（如Preview、Production）：

1. 进入 **Secrets and variables** → **Actions**
2. 点击 **Environment** 标签
3. 创建新环境（如 `production`, `preview`）
4. 在环境中添加Secrets

---

## Secrets列表

### Cloudflare相关

| Secret名称 | 说明 | 获取方式 | 必需 |
|-----------|------|---------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API令牌 | [创建API Token](https://dash.cloudflare.com/profile/api-tokens) | ✓ |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare账户ID | [Cloudflare Dashboard](https://dash.cloudflare.com/) | ✓ |

#### 获取Cloudflare API Token

1. 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 **Create Token**
3. 使用 **Edit Cloudflare Workers** 模板或自定义权限
4. 所需权限：
   - Account - Cloudflare Pages - Edit
   - Account - Workers Scripts - Edit
   - Zone - Zone - Read
5. 复制生成的Token

#### 获取Cloudflare Account ID

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择任意域名或Workers & Pages
3. 在右侧边栏找到 **Account ID**
4. 复制ID

### 应用配置

| Secret名称 | 说明 | 示例值 | 必需 |
|-----------|------|--------|------|
| `NEXT_PUBLIC_APP_URL` | 应用URL | `https://jd-optimizer.com` | ✓ |

### 数据库配置

| Secret名称 | 说明 | 示例值 | 必需 |
|-----------|------|--------|------|
| `DATABASE_URL` | 数据库连接字符串 | `libsql://xxx.turso.io` | ✓ |
| `DATABASE_AUTH_TOKEN` | LibSQL认证Token | `eyJhbGci...` | ✓* |
| `DATABASE_PROVIDER` | 数据库提供商 | `libsql` | ✓ |

**创建LibSQL数据库：**

```bash
# 安装Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# 创建数据库
turso db create jd-optimizer

# 获取URL
turso db show jd-optimizer --url

# 创建Token
turso db tokens create jd-optimizer
```

### 认证配置

| Secret名称 | 说明 | 生成方式 | 必需 |
|-----------|------|---------|------|
| `AUTH_SECRET` | 认证密钥 | `openssl rand -base64 32` | ✓ |
| `AUTH_SECRET_PREVIEW` | 预览环境认证密钥 | `openssl rand -base64 32` | - |

### AI配置

| Secret名称 | 说明 | 获取方式 | 必需 |
|-----------|------|---------|------|
| `OPENROUTER_API_KEY` | OpenRouter API密钥 | [OpenRouter Dashboard](https://openrouter.ai/keys) | ✓ |
| `OPENAI_API_KEY` | OpenAI API密钥 | [OpenAI Dashboard](https://platform.openai.com/api-keys) | - |
| `REPLICATE_API_TOKEN` | Replicate API Token | [Replicate Dashboard](https://replicate.com/account/api-tokens) | - |

### 支付配置

| Secret名称 | 说明 | 获取方式 | 必需 |
|-----------|------|---------|------|
| `STRIPE_SECRET_KEY` | Stripe密钥 | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) | ✓ |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook密钥 | [Stripe Webhooks](https://dashboard.stripe.com/webhooks) | ✓ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe公钥 | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) | ✓ |
| `STRIPE_PRICE_ID` | Stripe价格ID | [Stripe Products](https://dashboard.stripe.com/products) | ✓ |

### 邮件配置

| Secret名称 | 说明 | 获取方式 | 必需 |
|-----------|------|---------|------|
| `RESEND_API_KEY` | Resend API密钥 | [Resend Dashboard](https://resend.com/api-keys) | ✓ |

### OAuth配置（可选）

| Secret名称 | 说明 | 获取方式 | 必需 |
|-----------|------|---------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth客户端ID | [Google Cloud Console](https://console.cloud.google.com/) | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth密钥 | [Google Cloud Console](https://console.cloud.google.com/) | - |
| `GITHUB_CLIENT_ID` | GitHub OAuth客户端ID | [GitHub Developer Settings](https://github.com/settings/developers) | - |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth密钥 | [GitHub Developer Settings](https://github.com/settings/developers) | - |

### 安全扫描配置（可选）

| Secret名称 | 说明 | 获取方式 | 必需 |
|-----------|------|---------|------|
| `SNYK_TOKEN` | Snyk认证Token | [Snyk Dashboard](https://snyk.io/account) | - |

---

## 验证配置

### 1. 检查Secrets是否配置

在GitHub仓库中：

1. 进入 **Settings** → **Secrets and variables** → **Actions**
2. 检查所有必需的Secrets是否已添加
3. 确保没有拼写错误

### 2. 测试工作流

手动触发工作流：

1. 进入 **Actions** 标签
2. 选择 **CI/CD Pipeline** 工作流
3. 点击 **Run workflow**
4. 选择分支并运行
5. 查看工作流日志，确认Secrets被正确使用

### 3. 检查部署

部署完成后，验证：

1. 访问部署的URL
2. 测试核心功能（登录、AI分析等）
3. 检查控制台日志是否有错误

---

## 常见问题

### 1. Secret未生效

**问题：** 工作流失败，显示Secret未定义

**解决方案：**
- 检查Secret名称拼写（区分大小写）
- 确认Secret在正确的仓库中
- 重新运行工作流

### 2. API Token权限不足

**问题：** Cloudflare部署失败，权限错误

**解决方案：**
- 重新生成API Token，确保包含所有必需权限
- 检查Token作用域（Account vs Zone）
- 验证Account ID是否正确

### 3. 环境变量未传递

**问题：** 应用启动失败，环境变量未设置

**解决方案：**
- 检查工作流文件中的 `env` 部分
- 确认Secret名称与工作流中使用的名称一致
- 查看工作流日志中的环境变量输出

### 4. Preview环境配置

**问题：** Preview部署使用生产环境配置

**解决方案：**
- 使用环境特定的Secrets（如 `DATABASE_URL_PREVIEW`）
- 在工作流中根据分支选择不同的Secrets
- 或使用GitHub Environments功能

### 5. Secret值错误

**问题：** Secret值不正确或已过期

**解决方案：**
- 重新生成API密钥
- 更新GitHub中的Secret
- 确保使用正确的环境（开发 vs 生产）

---

## 安全最佳实践

### 1. Secret管理

- ✅ 使用强随机值（至少32字符）
- ✅ 定期轮换Secrets（每90天）
- ✅ 限制Token权限范围
- ❌ 不要在代码中硬编码Secrets
- ❌ 不要在日志中输出Secrets
- ❌ 不要将Secrets提交到Git

### 2. 访问控制

- 限制谁可以管理Secrets
- 使用GitHub环境进行权限隔离
- 审计Secret访问日志

### 3. 监控和告警

- 监控Secret使用情况
- 设置异常使用告警
- 定期审计Secret列表

---

## 配置检查清单

在配置GitHub Secrets后，使用此清单验证：

- [ ] **Cloudflare配置**
  - [ ] `CLOUDFLARE_API_TOKEN` 已添加
  - [ ] `CLOUDFLARE_ACCOUNT_ID` 已添加
  - [ ] Token权限正确（Pages, Workers）

- [ ] **数据库配置**
  - [ ] `DATABASE_URL` 已添加
  - [ ] `DATABASE_AUTH_TOKEN` 已添加（LibSQL）
  - [ ] `DATABASE_PROVIDER` 已添加

- [ ] **认证配置**
  - [ ] `AUTH_SECRET` 已生成并添加
  - [ ] Preview环境Secret已配置（如需要）

- [ ] **AI配置**
  - [ ] `OPENROUTER_API_KEY` 已添加
  - [ ] 其他AI提供商Secret已配置（如需要）

- [ ] **支付配置**
  - [ ] `STRIPE_SECRET_KEY` 已添加（生产环境）
  - [ ] `STRIPE_WEBHOOK_SECRET` 已添加
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 已添加
  - [ ] `STRIPE_PRICE_ID` 已添加

- [ ] **邮件配置**
  - [ ] `RESEND_API_KEY` 已添加

- [ ] **OAuth配置**（可选）
  - [ ] Google OAuth配置完成
  - [ ] GitHub OAuth配置完成

- [ ] **验证**
  - [ ] 所有Secret拼写正确
  - [ ] 工作流已测试成功
  - [ ] 部署已验证

---

## 相关文档

- [部署文档](./DEPLOYMENT.md)
- [环境变量文档](./ENV_VARIABLES.md)
- [生产环境检查清单](./PRODUCTION_CHECKLIST.md)
- [GitHub Actions工作流](./.github/workflows/deploy.yml)

---

## 更新日志

- **2025-02-09**: 初始GitHub Secrets配置文档创建
