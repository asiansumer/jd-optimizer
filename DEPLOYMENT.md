# JD Optimizer - 部署文档

本文档详细说明如何将JD Optimizer部署到生产环境，主要支持Cloudflare Pages平台。

## 目录

- [部署平台选择](#部署平台选择)
- [Cloudflare Pages 部署](#cloudflare-pages-部署)
- [环境变量配置](#环境变量配置)
- [数据库迁移](#数据库迁移)
- [域名配置](#域名配置)
- [监控和日志](#监控和日志)
- [故障排查](#故障排查)

---

## 部署平台选择

JD Optimizer支持以下部署平台：

### 主要平台
- **Cloudflare Pages** (推荐) - 边缘计算，全球CDN，免费SSL
- **Vercel** - 原生Next.js支持，简单部署

### 其他支持
- Docker容器部署
- 自托管服务器

本文档主要介绍Cloudflare Pages的部署流程。

---

## Cloudflare Pages 部署

### 前置要求

1. **Cloudflare 账户**
   - 注册 [Cloudflare](https://dash.cloudflare.com/sign-up)
   - 免费账户即可满足基本需求

2. **Cloudflare Workers 账户**
   - 登录后，进入 Workers & Pages

3. **数据库准备**
   - LibSQL (推荐): [Turso](https://turso.tech/) 免费数据库
   - 或 PostgreSQL (Neon, Supabase等)

### 步骤 1: 安装 Cloudflare CLI

```bash
npm install -g wrangler
```

验证安装：

```bash
wrangler --version
```

### 步骤 2: 配置 wrangler.toml

项目已提供 `wrangler.toml.example`，复制并配置：

```bash
cp wrangler.toml.example wrangler.toml
```

编辑 `wrangler.toml`：

```toml
name = "jd-optimizer"
main = ".open-next/worker.js"
compatibility_date = "2025-03-01"
compatibility_flags = ["nodejs_compat"]

[assets]
binding = "ASSETS"
directory = ".open-next/assets"

[[hyperdrive]]
binding = "HYPERDRIVE"
id = "your-hyperdrive-id"
localConnectionString = "postgres://user:password@host:port/db"

[observability]
enabled = true

[vars]
NEXT_PUBLIC_APP_URL = "https://your-domain.com"
NEXT_PUBLIC_APP_NAME = "JD Optimizer"
NEXT_PUBLIC_THEME = "default"
NEXT_PUBLIC_APPEARANCE = "system"
DATABASE_PROVIDER = "libsql"
DATABASE_URL = "libsql://your-db.turso.io"
DB_SINGLETON_ENABLED = "true"
DB_MAX_CONNECTIONS = "1"
```

### 步骤 3: 构建项目

```bash
# 安装依赖
pnpm install

# 构建Cloudflare版本
pnpm build
# 或使用快速构建
pnpm build:fast
```

### 步骤 4: 部署到 Cloudflare Pages

#### 方法 A: 使用 OpenNext.js (推荐)

项目已集成 `opennextjs-cloudflare`：

```bash
# 本地预览
pnpm cf:preview

# 部署到Cloudflare Pages
pnpm cf:deploy

# 上传到Cloudflare Pages
pnpm cf:upload
```

#### 方法 B: 通过 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create application**
3. 选择 **Pages** → **Upload assets**
4. 构建项目并上传 `.open-next` 目录内容

#### 方法 C: 通过 Git 集成

1. 在Cloudflare Dashboard创建Pages项目
2. 连接GitHub仓库
3. 配置构建设置：
   ```
   Build command: pnpm build
   Build output directory: .open-next
   Environment variables: 见下文
   ```

### 步骤 5: 配置环境变量

在Cloudflare Dashboard中添加环境变量（详见[环境变量配置](#环境变量配置)）。

---

## 环境变量配置

### 必需的环境变量

#### 应用配置

| 变量名 | 说明 | 示例值 | 必需 |
|--------|------|--------|------|
| `NEXT_PUBLIC_APP_URL` | 应用URL | `https://jd-optimizer.com` | ✓ |
| `NEXT_PUBLIC_APP_NAME` | 应用名称 | `JD Optimizer` | ✓ |
| `NEXT_PUBLIC_THEME` | 主题 | `default` | ✓ |
| `NEXT_PUBLIC_APPEARANCE` | 外观模式 | `system` | ✓ |

#### 数据库配置

| 变量名 | 说明 | 示例值 | 必需 |
|--------|------|--------|------|
| `DATABASE_PROVIDER` | 数据库类型 | `libsql` 或 `postgresql` | ✓ |
| `DATABASE_URL` | 数据库连接串 | `libsql://xxx.turso.io` | ✓ |
| `DB_SINGLETON_ENABLED` | 单例连接 | `true` | ✓ |
| `DB_MAX_CONNECTIONS` | 最大连接数 | `1` | ✓ |
| `DATABASE_AUTH_TOKEN` | LibSQL Token | `your-token` | ✓ |

#### 认证配置

| 变量名 | 说明 | 生成方式 | 必需 |
|--------|------|----------|------|
| `AUTH_SECRET` | 认证密钥 | `openssl rand -base64 32` | ✓ |

#### AI配置

| 变量名 | 说明 | 示例值 | 必需 |
|--------|------|--------|------|
| `AI_PROVIDER` | AI提供商 | `openrouter` | ✓ |
| `OPENROUTER_API_KEY` | OpenRouter密钥 | `sk-or-xxx` | ✓ |
| `OPENAI_API_KEY` | OpenAI密钥（备用） | `sk-xxx` | - |
| `REPLICATE_API_TOKEN` | Replicate Token | `r8_xxx` | - |

#### 支付配置

| 变量名 | 说明 | 示例值 | 必需 |
|--------|------|--------|------|
| `STRIPE_SECRET_KEY` | Stripe密钥 | `sk_live_xxx` | ✓ |
| `STRIPE_WEBHOOK_SECRET` | Webhook密钥 | `whsec_xxx` | ✓ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 公钥 | `pk_live_xxx` | ✓ |
| `STRIPE_PRICE_ID` | 价格ID | `price_xxx` | ✓ |

#### 邮件配置

| 变量名 | 说明 | 示例值 | 必需 |
|--------|------|--------|------|
| `RESEND_API_KEY` | Resend密钥 | `re_xxx` | ✓ |

#### OAuth配置（可选）

| 变量名 | 说明 |
|--------|------|
| `GOOGLE_CLIENT_ID` | Google OAuth客户端ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth密钥 |
| `GITHUB_CLIENT_ID` | GitHub OAuth客户端ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth密钥 |

#### 其他配置

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_RATE_LIMIT` | 速率限制 | `10` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - |
| `NODE_ENV` | 运行环境 | `production` |

### Cloudflare Pages 添加环境变量

1. 进入项目设置
2. 选择 **Settings** → **Environment variables**
3. 添加上述变量（区分 Production 和 Preview 环境）

---

## 数据库迁移

### LibSQL (Turso) 数据库

#### 创建数据库

```bash
# 安装Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# 登录
turso auth login

# 创建数据库
turso db create jd-optimizer

# 获取数据库URL
turso db show jd-optimizer --url

# 创建Token
turso db tokens create jd-optimizer
```

#### 运行迁移

```bash
# 本地环境（需配置.env）
pnpm db:push

# 或使用Drizzle Kit
pnpm db:generate
pnpm db:migrate

# 打开数据库管理界面
pnpm db:studio
```

### PostgreSQL 数据库

#### 连接字符串格式

```
postgresql://username:password@hostname:port/database_name
```

#### 使用 Cloudflare Hyperdrive（推荐）

1. 在Cloudflare创建Hyperdrive配置
2. 连接到PostgreSQL数据库
3. 在 `wrangler.toml` 中配置Hyperdrive绑定

```toml
[[hyperdrive]]
binding = "HYPERDRIVE"
id = "your-hyperdrive-id"
localConnectionString = "postgresql://user:pass@host:port/db"
```

---

## 域名配置

### Cloudflare DNS 设置

#### 添加自定义域名

1. 在Cloudflare Dashboard中进入 **Pages** 项目
2. 选择 **Custom domains**
3. 添加域名：
   - 根域名：`jd-optimizer.com`
   - www子域名：`www.jd-optimizer.com`

#### DNS 记录配置

在DNS管理中添加：

| 类型 | 名称 | 内容 | 代理状态 |
|------|------|------|----------|
| CNAME | www | jd-optimizer.pages.dev | 已代理（橙色云） |
| A | @ | (Pages会自动配置) | 已代理 |

#### SSL证书

Cloudflare Pages会自动为自定义域名颁发SSL证书。

### 重定向配置

在 `next.config.mjs` 中配置重定向：

```javascript
async redirects() {
  return [
    {
      source: '/old-path',
      destination: '/new-path',
      permanent: true,
    },
  ];
}
```

---

## 监控和日志

### Cloudflare Analytics

1. 进入项目 **Analytics** 标签
2. 查看关键指标：
   - 访问量
   - 响应时间
   - 错误率
   - 地理位置

### 错误追踪

#### Cloudflare Real User Monitoring (RUM)

在 `wrangler.toml` 中已启用：

```toml
[observability]
enabled = true
```

#### 自定义日志

应用中使用标准日志：

```typescript
console.log('Info:', message);
console.error('Error:', error);
```

### 性能监控

#### Web Vitals

项目已集成 Vercel Analytics：

```typescript
import { Analytics } from '@vercel/analytics/react';

// 在 layout.tsx 中添加
<Analytics />
```

#### Cloudflare Web Analytics

1. 在Cloudflare Dashboard获取Analytics ID
2. 在环境变量中添加 `NEXT_PUBLIC_GA_ID`
3. 在页面中添加追踪代码

### 错误告警

配置 Cloudflare Email Alerting：

1. 进入 **Notifications**
2. 设置告警规则：
   - 错误率超过阈值
   - 响应时间过长
   - 5xx错误

---

## 故障排查

### 常见问题

#### 构建失败

**问题：** `build` 命令失败

**解决方案：**
```bash
# 清理缓存
rm -rf .next node_modules
pnpm install
pnpm build:fast
```

#### 数据库连接错误

**问题：** `Error connecting to database`

**解决方案：**
1. 验证 `DATABASE_URL` 正确
2. 检查数据库Token是否有效
3. 确认数据库白名单配置

#### 环境变量未生效

**问题：** 应用读取不到环境变量

**解决方案：**
1. 确认变量名拼写正确
2. 重新部署应用
3. 检查区分 Production/Preview 环境

#### 404 Not Found

**问题：** 部署后页面404

**解决方案：**
1. 检查 `output` 配置
2. 确认构建输出目录
3. 验证路由配置

#### 部署超时

**问题：** Cloudflare 部署超时

**解决方案：**
```bash
# 使用快速构建
pnpm build:fast

# 或分步部署
pnpm build
pnpm cf:upload
```

### 调试技巧

#### 本地环境测试

```bash
# 使用本地配置
cp wrangler.toml.example wrangler.toml
pnpm cf:preview
```

#### 查看Worker日志

```bash
wrangler tail jd-optimizer
```

#### 检查构建输出

```bash
# 查看构建文件
ls -la .open-next/
```

---

## 回滚操作

### Cloudflare Pages 回滚

1. 进入项目 **Deployments** 标签
2. 找到之前的稳定版本
3. 点击 **Rollback** 按钮

### 手动回滚

```bash
# 切换到稳定分支
git checkout stable-branch

# 重新部署
pnpm cf:deploy
```

---

## 最佳实践

### 部署前检查

- [ ] 所有测试通过
- [ ] 环境变量完整配置
- [ ] 数据库迁移已执行
- [ ] 域名DNS已配置
- [ ] SSL证书已颁发
- [ ] 监控已启用

### 安全建议

- 使用强密码和Token
- 定期轮换API密钥
- 启用Cloudflare WAF
- 配置访问规则
- 定期备份数据库

### 性能优化

- 启用Cloudflare CDN缓存
- 优化图片和静态资源
- 使用HTTP/2和HTTP/3
- 配置合理的缓存策略

---

## 联系支持

如遇到部署问题：

1. 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
2. 检查项目 [GitHub Issues](https://github.com/your-repo/jd-optimizer/issues)
3. 联系技术支持团队

---

## 更新日志

- **2025-02-09**: 初始部署文档创建
- 支持Cloudflare Pages部署
- 集成OpenNext.js
