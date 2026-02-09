# 贡献指南 - JD Optimizer

感谢您对 JD Optimizer 项目的关注！我们欢迎所有形式的贡献，包括但不限于：

- 🐛 报告Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复或新功能
- 🧪 编写测试
- 🌍 翻译文档
- 🎨 改进UI/UX设计

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发环境设置](#开发环境设置)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交信息格式](#提交信息格式)
- [Pull Request流程](#pull-request流程)
- [问题报告](#问题报告)
- [功能请求](#功能请求)

## 行为准则

参与本项目，您同意遵守以下准则：

- 尊重所有贡献者
- 接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表现出同理心

## 如何贡献

### 1. 报告Bug

在使用过程中遇到Bug？请提交Issue并包含：

- 清晰的标题和描述
- 复现步骤
- 预期行为 vs 实际行为
- 截图或录屏（如适用）
- 环境信息（操作系统、浏览器版本等）
- 相关的日志或错误信息

### 2. 建议新功能

我们欢迎新功能建议！提交Issue时请包含：

- 功能的详细描述
- 使用场景和预期收益
- 可能的实现方案（如有）
- 示例或mockups（如适用）

### 3. 提交代码

贡献代码时，请遵循以下步骤。

## 开发环境设置

### 前置要求

```bash
# Node.js版本检查
node --version  # 应该是 v25.2.1 或更高

# pnpm版本检查
pnpm --version  # 应该是 v9.0 或更高

# Git版本检查
git --version
```

### 环境配置

```bash
# 1. Fork并克隆仓库
git clone https://github.com/YOUR_USERNAME/jd-optimizer.git
cd jd-optimizer

# 2. 添加上游仓库
git remote add upstream https://github.com/ORIGINAL_OWNER/jd-optimizer.git

# 3. 安装依赖
pnpm install

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写必要的配置

# 5. 初始化数据库
pnpm db:push

# 6. 启动开发服务器
pnpm dev
```

### 验证环境

访问 http://localhost:3000 确保应用正常运行。

## 开发流程

### 1. 选择任务

- 查看 [Issues](https://github.com/ORIGINAL_OWNER/jd-optimizer/issues)
- 寻找标记为 `good first issue` 或 `help wanted` 的问题
- 在开始工作前，在Issue中留言表示你将处理该任务

### 2. 创建分支

```bash
# 确保在最新的主分支
git checkout main
git pull upstream main

# 创建新的功能分支
# 功能分支命名规范：
# - feature/功能名
# - fix/修复的问题
# - docs/文档更新
# - refactor/重构
# - test/测试相关
# - chore/构建/工具等

# 示例
git checkout -b feature/add-ai-analysis
git checkout -b fix/login-error
git checkout -b docs/update-readme
```

### 3. 进行开发

#### 代码结构规范

```
src/
├── app/              # Next.js页面
├── components/       # React组件
│   ├── ui/          # 基础UI组件（无业务逻辑）
│   ├── auth/        # 认证相关组件
│   ├── jd-editor/   # JD编辑器组件
│   └── shared/      # 共享组件
├── core/           # 核心功能
│   ├── auth/      # 认证系统
│   ├── db/        # 数据库
│   └── rbac/      # 权限控制
├── lib/           # 工具函数
└── shared/        # 共享类型和工具
```

#### 组件开发规范

```tsx
// ✅ 好的组件结构
import { type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-base',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

#### TypeScript使用规范

```typescript
// ✅ 始终使用类型
interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'guest'
  createdAt: Date
}

// ✅ 使用联合类型而不是any
type Status = 'active' | 'inactive' | 'suspended'

// ✅ 使用泛型提高复用性
function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json())
}

// ✅ 避免类型断言，使用类型守卫
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
```

#### 数据库操作规范

```typescript
// ✅ 使用Drizzle ORM
import { db } from '@/core/db'
import { users } from '@/core/db/schema'

// 插入
await db.insert(users).values({
  email: 'user@example.com',
  name: 'John Doe'
})

// 查询
const user = await db.query.users.findFirst({
  where: eq(users.email, 'user@example.com')
})

// 更新
await db.update(users)
  .set({ name: 'Jane Doe' })
  .where(eq(users.id, userId))
```

### 4. 运行测试和检查

```bash
# 代码格式化
pnpm format

# 代码检查
pnpm lint

# 构建检查
pnpm build

# 运行测试（如果有）
pnpm test
```

确保所有检查通过后再提交。

## 代码规范

### JavaScript/TypeScript

#### 命名规范

```typescript
// ✅ 变量和函数：camelCase
const userName = 'John'
function getUser() { }

// ✅ 类和组件：PascalCase
class UserService { }
function UserProfile() { }

// ✅ 常量：UPPER_SNAKE_CASE
const MAX_RETRIES = 3
const API_BASE_URL = 'https://api.example.com'

// ✅ 类型和接口：PascalCase
interface UserProfile { }
type UserRole = 'admin' | 'user'
```

#### 文件组织

```
// ✅ 同一模块的相关文件放在一起
components/
  ├── auth/
  │   ├── login-form.tsx
  │   ├── register-form.tsx
  │   ├── index.ts      # 导出所有组件
  │   └── types.ts      # 相关类型
```

#### 注释规范

```typescript
/**
 * 用户认证服务
 * 提供用户注册、登录、权限验证等功能
 */
class AuthService {
  /**
   * 用户登录
   * @param email - 用户邮箱
   * @param password - 用户密码
   * @returns 登录成功的用户信息
   * @throws {AuthenticationError} 认证失败时抛出
   */
  async login(email: string, password: string) {
    // 实现细节
  }
}

// 单行注释说明复杂逻辑
// 检查用户权限：管理员可以访问所有内容，普通用户只能访问自己的数据
const canAccess = isAdmin || userId === resourceOwnerId
```

### React组件规范

```tsx
// ✅ 组件文件结构
// 1. 导入
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

// 2. 类型定义
interface Props {
  title: string
  onAction?: () => void
}

// 3. 组件定义
export function MyComponent({ title, onAction }: Props) {
  // 4. Hooks
  const [isOpen, setIsOpen] = useState(false)

  // 5. 副作用
  useEffect(() => {
    // 副作用逻辑
  }, [])

  // 6. 事件处理
  const handleClick = () => {
    setIsOpen(true)
    onAction?.()
  }

  // 7. 渲染
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>点击</Button>
    </div>
  )
}
```

### CSS/Tailwind规范

```tsx
// ✅ 使用Tailwind的响应式前缀
<div className="px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4">

// ✅ 使用cn工具合并类名
import { cn } from '@/lib/utils'

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)}>

// ✅ 避免内联样式（动态样式除外）
<div style={{ transform: `translateX(${x}px)` }}>
```

### Git忽略

确保 `.gitignore` 包含：

```gitignore
# 依赖
node_modules/
.pnpm-store/

# 环境变量
.env
.env.local
.env.*.local

# 构建输出
.next/
out/
dist/
build/

# 数据库
*.db
*.db-shm
*.db-wal

# IDE
.vscode/
.idea/
*.swp
*.swo

# 日志
logs/
*.log

# 临时文件
.DS_Store
```

## 提交信息格式

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构（不是新功能也不是修复）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `ci`: CI配置文件和脚本的变动
- `revert`: 回退之前的commit

### 示例

```bash
# 新功能
git commit -m "feat(jd-editor): add AI analysis feature"

# Bug修复
git commit -m "fix(auth): resolve login session timeout issue"

# 文档更新
git commit -m "docs(readme): update installation instructions"

# 重构
git commit -m "refactor(api): extract user service module"

# 破坏性变更
git commit -m "feat(api)!: remove deprecated endpoint

BREAKING CHANGE: The /api/v1/users endpoint has been removed.
Use /api/v2/users instead."
```

### Commit Message最佳实践

```bash
# ✅ 好的commit message
feat(auth): implement OAuth2 login flow

- Add Google OAuth integration
- Add GitHub OAuth integration
- Update authentication middleware
- Update UI with social login buttons

# ❌ 不好的commit message
fix bug
update
add feature
```

## Pull Request流程

### 1. 准备提交

```bash
# 添加修改的文件
git add .

# 提交代码（遵循commit规范）
git commit -m "feat(jd-editor): add AI analysis feature"

# 推送到你的fork
git push origin feature/add-ai-analysis
```

### 2. 创建Pull Request

1. 访问你的GitHub fork页面
2. 点击 "Compare & pull request"
3. 填写PR模板

#### PR标题格式

```
<type>(<scope>): <short description>
```

#### PR描述模板

```markdown
## 描述
简要描述这个PR的目的和实现的功能

## 变更类型
- [ ] Bug修复
- [ ] 新功能
- [ ] 破坏性变更
- [ ] 文档更新

## 相关Issue
Closes #(issue number)
Fixes #(issue number)
Related to #(issue number)

## 测试
描述你如何测试这些变更：
- [ ] 单元测试
- [ ] 集成测试
- [ ] 手动测试

## 截图（如适用）
添加相关的截图来展示变更

## 检查清单
- [ ] 代码遵循项目的代码规范
- [ ] 我已进行自我代码审查
- [ ] 代码已通过linting
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 提交信息遵循规范
- [ ] 没有引入不必要的依赖
```

### 3. PR审核流程

1. **自动化检查** - CI/CD会自动运行测试和代码检查
2. **代码审查** - 维护者会审查你的代码
3. **反馈** - 根据反馈进行修改
4. **合并** - 通过审核后合并到主分支

### 4. 处理反馈

```bash
# 获取最新更改
git fetch upstream
git rebase upstream/main

# 解决冲突
git add .
git rebase --continue

# 推送更新
git push origin feature/add-ai-analysis --force-with-lease
```

### 5. 合并后

```bash
# 删除已合并的分支
git branch -d feature/add-ai-analysis
git push origin --delete feature/add-ai-analysis

# 获取最新主分支
git checkout main
git pull upstream main
```

## 问题报告

### Bug报告模板

```markdown
## Bug 描述
清晰简洁地描述这个bug

## 复现步骤
1. 前往 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

## 预期行为
描述你预期应该发生什么

## 实际行为
描述实际发生了什么

## 截图
如果适用，添加截图来说明问题

## 环境
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. v0.1.0]

## 额外信息
添加任何其他关于问题的信息
```

## 功能请求

### 功能请求模板

```markdown
## 功能描述
清晰简洁地描述你希望的功能

## 问题或动机
你面临什么问题？
这个功能如何解决你的问题？

## 解决方案
详细描述你希望的解决方案

## 替代方案
描述你考虑过的替代解决方案或功能

## 额外信息
添加任何其他信息或截图
```

## 获取帮助

- 📖 查看 [API文档](./API.md)
- 💬 加入我们的 [Discord社区](https://discord.gg/your-server)
- 📧 发送邮件到 support@jd-optimizer.com
- 🐛 提交 [Issue](https://github.com/ORIGINAL_OWNER/jd-optimizer/issues)

## 致谢

感谢所有贡献者！您的贡献让JD Optimizer变得更好。

---

**再次感谢您的贡献！** 🎉
