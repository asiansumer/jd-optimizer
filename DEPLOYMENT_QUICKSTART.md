# 快速部署指南

本指南提供JD Optimizer快速部署的简化步骤。详细的部署说明请参考 [完整部署文档](./DEPLOYMENT.md)。

---

## 目录

- [Cloudflare Pages 部署（推荐）](#cloudflare-pages-部署推荐)
- [环境变量快速配置](#环境变量快速配置)
- [验证部署](#验证部署)
- [常见问题](#常见问题)

---

## Cloudflare Pages 部署（推荐）

### 前置条件

- Cloudflare账户（[免费注册](https://dash.cloudflare.com/sign-up)）
- Cloudflare域名（或使用Cloudflare Pages子域名）
- GitHub账户（用于CI/CD自动化）

### 步骤 1: 准备数据库

使用LibSQL（Turso）- 免费、快速：

```bash
# 安装Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# 创建数据库
turso db create jd-optimizer

# 获取连接信息
turso db show jd-optimizer --url
turso db tokens create jd-optimizer
```

### 步骤 2: 配置环境变量

在Cloudflare Pages中配置以下必需变量：

#### 应用配置
```
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=JD Optimizer
NEXT_PUBLIC_THEME=default
NEXT_PUBLIC_APPEARANCE=system
```

#### 数据库配置
```
DATABASE_PROVIDER=libsql
DATABASE_URL=libsql://your-db-url.turso.io
DATABASE_AUTH_TOKEN=your-database-token
DB_SINGLETON_ENABLED=true
DB_MAX_CONNECTIONS=1
```

#### 认证配置
```bash
# 生成密钥
openssl rand -base64 32

# 配置
AUTH_SECRET=your-generated-secret
```

#### AI配置
```
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-your-api-key
```

**获取OpenRouter API密钥：**
1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册并创建API密钥

### 步骤 3: GitHub配置

#### 配置GitHub Secrets

在GitHub仓库中添加以下Secrets（**Settings → Secrets and variables → Actions**）：

```
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
DATABASE_URL=your-database-url
DATABASE_AUTH_TOKEN=your-database-token
DATABASE_PROVIDER=libsql
AUTH_SECRET=your-auth-secret
OPENROUTER_API_KEY=your-openrouter-api-key
```

**获取Cloudflare API Token：**
1. 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 创建Token，权限需要：
   - Account - Cloudflare Pages - Edit
   - Account - Workers Scripts - Edit

**获取Cloudflare Account ID：**
- 在Cloudflare Dashboard的右侧边栏中找到

### 步骤 4: 部署

有两种方式部署：

#### 方式 A: GitHub Actions自动化（推荐）

1. 推送代码到 `main` 分支
2. GitHub Actions自动触发CI/CD流程
3. 自动部署到Cloudflare Pages

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

#### 方式 B: 手动部署

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/jd-optimizer.git
cd jd-optimizer

# 2. 安装依赖
pnpm install

# 3. 构建项目
pnpm build

# 4. 部署到Cloudflare
pnpm cf:deploy
```

或使用部署脚本：

```bash
chmod +x scripts/deploy-cloudflare.sh
./scripts/deploy-cloudflare.sh
```

### 步骤 5: 配置域名

在Cloudflare Dashboard中：

1. 进入 **Workers & Pages** → **jd-optimizer**
2. 点击 **Custom domains**
3. 添加你的域名（如 `jd-optimizer.com`）
4. DNS会自动配置

---

## 环境变量快速配置

### 必需变量（最小配置）

```bash
# 应用
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=JD Optimizer

# 数据库
DATABASE_PROVIDER=libsql
DATABASE_URL=libsql://your-db-url.turso.io
DATABASE_AUTH_TOKEN=your-token

# 认证
AUTH_SECRET=your-secret

# AI
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your-api-key
```

### 可选变量（支付和邮件）

```bash
# Stripe支付
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_PRICE_ID=price_xxx

# 邮件
RESEND_API_KEY=re_xxx
```

详细的环境变量配置请参考 [ENV_VARIABLES.md](./ENV_VARIABLES.md)。

---

## 验证部署

### 1. 检查部署状态

```bash
# 查看Cloudflare部署日志
wrangler tail jd-optimizer
```

### 2. 访问应用

访问你的域名：
- `https://jd-optimizer.pages.dev`（Cloudflare默认域名）
- 或自定义域名：`https://your-domain.com`

### 3. 功能测试

- [ ] 页面正常加载
- [ ] 用户注册/登录功能正常
- [ ] JD分析功能正常
- [ ] AI响应正常

### 4. 数据库验证

```bash
# 查看数据库
pnpm db:studio
```

---

## 常见问题

### Q: 部署失败，提示"Build failed"

**解决方案：**
```bash
# 清理缓存并重新构建
rm -rf .next node_modules
pnpm install
pnpm build:fast
```

### Q: 数据库连接错误

**解决方案：**
1. 验证 `DATABASE_URL` 和 `DATABASE_AUTH_TOKEN` 正确
2. 确认数据库Token未过期
3. 检查LibSQL数据库白名单

### Q: API密钥未生效

**解决方案：**
1. 在Cloudflare Dashboard中重新添加环境变量
2. 重新部署应用
3. 确认变量名拼写正确（区分大小写）

### Q: 预览部署失败

**解决方案：**
1. 确保Preview环境的环境变量已配置
2. 检查GitHub Actions中的环境变量使用
3. 查看Actions日志获取详细错误信息

### Q: 域名无法访问

**解决方案：**
1. 等待DNS传播（可能需要几分钟到24小时）
2. 检查DNS配置是否正确
3. 确认Cloudflare SSL证书已颁发

### Q: 支付功能不工作

**解决方案：**
1. 确认Stripe密钥是生产环境密钥（`sk_live_`）
2. 检查Webhook端点配置
3. 验证Price ID是否正确

---

## 生产力脚本

### 快速部署脚本

项目提供了自动化部署脚本：

```bash
# 快速部署（跳过测试）
./scripts/deploy-cloudflare.sh quick

# 预览环境部署
./scripts/deploy-cloudflare.sh preview

# 回滚部署
./scripts/deploy-cloudflare.sh rollback
```

### 本地预览

```bash
# Cloudflare预览
pnpm cf:preview
```

---

## 监控和维护

### 查看日志

```bash
# Cloudflare Workers日志
wrangler tail jd-optimizer

# 应用日志（在Cloudflare Dashboard中查看）
```

### 健康检查

访问 `/health` 端点检查应用状态。

### 性能监控

- Cloudflare Analytics: 在Dashboard中查看
- Lighthouse CI: 已集成到CI/CD流程

---

## 升级

### 更新代码

```bash
git pull origin main
pnpm install
pnpm build
pnpm cf:deploy
```

### 数据库迁移

```bash
# 应用新的数据库schema
pnpm db:push

# 或使用迁移
pnpm db:migrate
```

---

## 相关文档

- [完整部署文档](./DEPLOYMENT.md) - 详细的部署步骤和配置
- [环境变量文档](./ENV_VARIABLES.md) - 所有环境变量的详细说明
- [生产环境检查清单](./PRODUCTION_CHECKLIST.md) - 部署前的检查清单
- [GitHub Secrets配置](./GITHUB_SECRETS.md) - GitHub Secrets配置指南
- [故障排查](./DEPLOYMENT.md#故障排查) - 常见问题和解决方案

---

## 需要帮助？

- 📖 查看完整文档：[DEPLOYMENT.md](./DEPLOYMENT.md)
- 🐛 提交问题：[GitHub Issues](https://github.com/yourusername/jd-optimizer/issues)
- 💬 加入社区：[Discord](https://discord.gg/jd-optimizer)

---

**部署愉快！** 🚀
