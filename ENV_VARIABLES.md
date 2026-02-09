# JD Optimizer - 环境变量配置文档

本文档详细说明JD Optimizer所需的所有环境变量及其用途。

---

## 目录

- [快速开始](#快速开始)
- [应用配置](#应用配置)
- [数据库配置](#数据库配置)
- [认证配置](#认证配置)
- [AI配置](#ai配置)
- [支付配置](#支付配置)
- [邮件配置](#邮件配置)
- [OAuth配置](#oauth配置)
- [Analytics配置](#analytics配置)
- [Cloudflare特定配置](#cloudflare特定配置)
- [开发环境配置](#开发环境配置)
- [生产环境配置](#生产环境配置)
- [安全最佳实践](#安全最佳实践)

---

## 快速开始

### 本地开发

1. 复制环境变量示例文件：

```bash
cp .env.example .env
```

2. 填写必需的环境变量（见下方配置）

3. 启动开发服务器：

```bash
pnpm dev
```

### Cloudflare Pages

在Cloudflare Dashboard中添加环境变量：

1. 进入项目 **Settings** → **Environment variables**
2. 添加以下变量（区分 Production 和 Preview）

---

## 应用配置

| 变量名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| `NEXT_PUBLIC_APP_URL` | string | - | ✓ | 应用的完整URL，用于OAuth回调等 |
| `NEXT_PUBLIC_APP_NAME` | string | JD Optimizer | ✓ | 应用名称 |
| `NEXT_PUBLIC_THEME` | string | default | ✓ | 默认主题（default, dark, light） |
| `NEXT_PUBLIC_APPEARANCE` | string | system | ✓ | 外观模式（system, light, dark） |
| `NODE_ENV` | string | development | - | 运行环境（development, production） |

### 配置示例

```bash
NEXT_PUBLIC_APP_URL=https://jd-optimizer.com
NEXT_PUBLIC_APP_NAME=JD Optimizer
NEXT_PUBLIC_THEME=default
NEXT_PUBLIC_APPEARANCE=system
NODE_ENV=production
```

---

## 数据库配置

| 变量名 | 类型 | 默认值 | 必需 | 说明 |
|--------|------|--------|------|------|
| `DATABASE_PROVIDER` | string | libsql | ✓ | 数据库提供商（libsql, postgresql, mysql） |
| `DATABASE_URL` | string | - | ✓ | 数据库连接字符串 |
| `DATABASE_AUTH_TOKEN` | string | - | ✓* | LibSQL认证Token（仅LibSQL需要） |
| `DB_SINGLETON_ENABLED` | string | true | - | 是否启用单例连接 |
| `DB_MAX_CONNECTIONS` | string | 1 | - | 最大连接数 |

### LibSQL (Turso) 配置示例

```bash
DATABASE_PROVIDER=libsql
DATABASE_URL=libsql://jd-optimizer-username.turso.io
DATABASE_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DB_SINGLETON_ENABLED=true
DB_MAX_CONNECTIONS=1
```

**创建LibSQL数据库：**

```bash
# 安装Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# 创建数据库
turso db create jd-optimizer

# 获取URL和Token
turso db show jd-optimizer --url
turso db tokens create jd-optimizer
```

### PostgreSQL 配置示例

```bash
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://username:password@host:port/database_name
DB_SINGLETON_ENABLED=true
DB_MAX_CONNECTIONS=5
```

**使用Cloudflare Hyperdrive（推荐）：**

在 `wrangler.toml` 中配置：

```toml
[[hyperdrive]]
binding = "HYPERDRIVE"
id = "your-hyperdrive-id"
localConnectionString = "postgresql://user:password@host:port/db"
```

---

## 认证配置

| 变量名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `AUTH_SECRET` | string | ✓ | 认证密钥，用于签名和加密 |

### 生成AUTH_SECRET

```bash
openssl rand -base64 32
```

### 配置示例

```bash
AUTH_SECRET=your-generated-secret-here
```

**安全提示：**
- 必须使用强随机密钥（32字节以上）
- 不要在不同环境使用相同的密钥
- 定期轮换密钥

---

## AI配置

| 变量名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `AI_PROVIDER` | string | ✓ | AI提供商（openrouter, openai, replicate） |
| `OPENROUTER_API_KEY` | string | ✓* | OpenRouter API密钥 |
| `OPENAI_API_KEY` | string | - | OpenAI API密钥（备用） |
| `REPLICATE_API_TOKEN` | string | - | Replicate API Token |

### OpenRouter 配置（推荐）

```bash
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

**获取API密钥：**
1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册账户
3. 在设置中创建API密钥

### OpenAI 配置

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-xxxxx
```

### Replicate 配置

```bash
AI_PROVIDER=replicate
REPLICATE_API_TOKEN=r8_xxxxx
```

---

## 支付配置

| 变量名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `STRIPE_SECRET_KEY` | string | ✓ | Stripe密钥（生产：sk_live_...） |
| `STRIPE_WEBHOOK_SECRET` | string | ✓ | Stripe Webhook密钥 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | string | ✓ | Stripe公钥（生产：pk_live_...） |
| `STRIPE_PRICE_ID` | string | ✓ | Stripe价格ID |

### Stripe 配置示例

```bash
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_PRICE_ID=price_xxxxx
```

**获取Stripe密钥：**
1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 开发者 → API密钥
3. 生产环境密钥以 `sk_live_` 或 `pk_live_` 开头

**配置Webhook：**
1. 在Stripe中创建Webhook
2. 设置端点：`https://your-domain.com/api/webhooks/stripe`
3. 复制 `Signing secret` 到 `STRIPE_WEBHOOK_SECRET`

---

## 邮件配置

| 变量名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `RESEND_API_KEY` | string | ✓ | Resend API密钥 |

### Resend 配置示例

```bash
RESEND_API_KEY=re_xxxxx
```

**获取API密钥：**
1. 访问 [Resend](https://resend.com/)
2. 注册账户
3. 在设置中创建API密钥

**配置域名：**
1. 在Resend中添加并验证域名
2. 配置SPF/DKIM/DMARC记录

---

## OAuth配置

| 变量名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `GOOGLE_CLIENT_ID` | string | - | Google OAuth客户端ID |
| `GOOGLE_CLIENT_SECRET` | string | - | Google OAuth客户端密钥 |
| `GITHUB_CLIENT_ID` | string | - | GitHub OAuth客户端ID |
| `GITHUB_CLIENT_SECRET` | string | - | GitHub OAuth客户端密钥 |

### Google OAuth 配置示例

```bash
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

**创建Google OAuth应用：**
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建OAuth 2.0凭据
3. 添加授权重定向URI：`https://your-domain.com/api/auth/callback/google`

### GitHub OAuth 配置示例

```bash
GITHUB_CLIENT_ID=Iv1xxxxx
GITHUB_CLIENT_SECRET=xxxxx
```

**创建GitHub OAuth应用：**
1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建OAuth App
3. 设置Authorization callback URL：`https://your-domain.com/api/auth/callback/github`

---

## Analytics配置

| 变量名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `NEXT_PUBLIC_GA_ID` | string | - | Google Analytics ID |
| `NEXT_PUBLIC_RATE_LIMIT` | string | 10 | 速率限制（每分钟请求数） |

### Google Analytics 配置示例

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXX
NEXT_PUBLIC_RATE_LIMIT=10
```

**获取GA ID：**
1. 在[Google Analytics](https://analytics.google.com/)中创建媒体资源
2. 在设置中找到测量ID（G-XXXXXX）

---

## Cloudflare特定配置

### Hyperdrive配置

Hyperdrive用于加速PostgreSQL连接，配置在 `wrangler.toml` 中：

```toml
[[hyperdrive]]
binding = "HYPERDRIVE"
id = "your-hyperdrive-id"
localConnectionString = "postgresql://user:password@host:port/db"
```

### KV存储配置

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"
```

### D1数据库配置

```toml
[[d1_databases]]
binding = "DB"
database_name = "jd-optimizer-db"
database_id = "your-d1-database-id"
```

### R2存储配置

```toml
[[r2_buckets]]
binding = "STORAGE"
bucket_name = "jd-optimizer-storage"
```

---

## 开发环境配置

### 开发环境 `.env` 示例

```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=JD Optimizer (Dev)
NEXT_PUBLIC_THEME=default
NEXT_PUBLIC_APPEARANCE=system
NODE_ENV=development

# Database
DATABASE_PROVIDER=libsql
DATABASE_URL=libsql://dev-db.turso.io
DATABASE_AUTH_TOKEN=dev-token
DB_SINGLETON_ENABLED=true
DB_MAX_CONNECTIONS=1

# Auth
AUTH_SECRET=dev-auth-secret-not-for-production

# AI
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-dev-key

# Payment (Test Mode)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_PRICE_ID=price_xxxxx

# Email (Test)
RESEND_API_KEY=re_dev_xxxxx

# Analytics
NEXT_PUBLIC_RATE_LIMIT=100
```

---

## 生产环境配置

### Cloudflare Pages Production Variables

在Cloudflare Dashboard中配置：

```bash
# Application
NEXT_PUBLIC_APP_URL=https://jd-optimizer.com
NEXT_PUBLIC_APP_NAME=JD Optimizer
NEXT_PUBLIC_THEME=default
NEXT_PUBLIC_APPEARANCE=system
NODE_ENV=production

# Database
DATABASE_PROVIDER=libsql
DATABASE_URL=libsql://prod-db.turso.io
DATABASE_AUTH_TOKEN=prod-auth-token
DB_SINGLETON_ENABLED=true
DB_MAX_CONNECTIONS=5

# Auth
AUTH_SECRET=your-strong-production-secret

# AI
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-prod-key

# Payment (Live Mode)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_PRICE_ID=price_xxxxx

# Email
RESEND_API_KEY=re_prod_xxxxx

# OAuth (Optional)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GITHUB_CLIENT_ID=Iv1xxxxx
GITHUB_CLIENT_SECRET=xxxxx

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXX
NEXT_PUBLIC_RATE_LIMIT=10
```

### Preview环境配置

Preview环境可以使用测试密钥：

```bash
NEXT_PUBLIC_APP_URL=https://preview.jd-optimizer.com
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
# ... 其他变量
```

---

## 安全最佳实践

### 1. 密钥管理

- ✅ 使用强随机密钥
- ✅ 不同环境使用不同密钥
- ✅ 定期轮换密钥（每90天）
- ✅ 使用环境变量存储密钥
- ❌ 不要在代码中硬编码密钥
- ❌ 不要将密钥提交到Git

### 2. 最小权限原则

- 为每个API密钥配置最小必需权限
- 使用专用的生产环境密钥
- 限制数据库用户的权限

### 3. 密钥生成

**AUTH_SECRET生成：**
```bash
openssl rand -base64 32
```

**数据库密码生成：**
```bash
openssl rand -base64 24
```

### 4. 环境隔离

- 开发、预览、生产环境完全隔离
- 使用不同的数据库实例
- 使用不同的API密钥

### 5. 敏感信息处理

- 不要在日志中输出环境变量
- 使用 `.gitignore` 忽略 `.env` 文件
- 定期审计环境变量使用情况

---

## 故障排查

### 数据库连接问题

```bash
# 测试数据库连接
pnpm db:studio

# 检查环境变量
echo $DATABASE_URL
```

### 认证问题

```bash
# 重新生成AUTH_SECRET
openssl rand -base64 32

# 清除浏览器缓存和Cookie
```

### API密钥问题

```bash
# 验证API密钥格式
# OpenRouter: sk-or-v1-...
# OpenAI: sk-proj-... 或 sk-...
# Stripe: sk_live_... 或 sk_test_...
```

### Cloudflare部署问题

```bash
# 检查wrangler配置
wrangler whoami

# 查看Worker日志
wrangler tail jd-optimizer
```

---

## 相关文档

- [部署文档](./DEPLOYMENT.md)
- [生产环境检查清单](./PRODUCTION_CHECKLIST.md)
- [wrangler配置](./wrangler.toml)
- [环境变量示例](./.env.example)

---

## 更新日志

- **2025-02-09**: 初始环境变量文档创建
