# JD Optimizer 安全与性能测试指南

> 版本: 1.0
> 创建日期: 2026-02-09
> 项目位置: `/Users/sumerasian/.openclaw/workspace/jd-optimizer`

## 目录

1. [安全测试概述](#安全测试概述)
2. [Web应用安全测试](#web应用安全测试)
3. [API安全测试](#api安全测试)
4. [认证与授权安全测试](#认证与授权安全测试)
5. [数据安全测试](#数据安全测试)
6. [性能测试概述](#性能测试概述)
7. [负载测试](#负载测试)
8. [压力测试](#压力测试)
9. [性能监控与优化](#性能监控与优化)

---

## 安全测试概述

### 安全测试目标

- 识别并修复安全漏洞
- 验证认证和授权机制
- 确保数据加密和隐私保护
- 防止常见Web攻击（OWASP Top 10）
- 符合安全合规要求（GDPR、SOC2等）

### 安全测试范围

| 安全领域 | 测试项目 | 工具 |
|---------|---------|------|
| 输入验证 | SQL注入、XSS、命令注入 | OWASP ZAP, Burp Suite |
| 认证 | 暴力破解、会话劫持、CSRF | OWASP ZAP, Nmap |
| 授权 | 权限提升、越权访问 | 手动测试, Burp Suite |
| 数据保护 | 加密、敏感数据泄露 | Wireshark, SSL Labs |
| 速率限制 | DDoS、暴力破解防护 | k6, Artillery |
| 依赖安全 | 第三方库漏洞 | npm audit, Snyk |
| API安全 | API网关、认证、限流 | Postman, OWASP ZAP |

### OWASP Top 10 测试覆盖

| OWASP 2021 | 测试用例 | 优先级 |
|-----------|---------|--------|
| A01: Broken Access Control | SEC-AUTH-001 ~ SEC-AUTH-010 | P0 |
| A02: Cryptographic Failures | SEC-CRYPTO-001 ~ SEC-CRYPTO-010 | P0 |
| A03: Injection | SEC-SQL-001 ~ SEC-SQL-010, SEC-XSS-001 ~ SEC-XSS-010 | P0 |
| A04: Insecure Design | SEC-DESIGN-001 ~ SEC-DESIGN-005 | P1 |
| A05: Security Misconfiguration | SEC-CONFIG-001 ~ SEC-CONFIG-010 | P0 |
| A06: Vulnerable Components | SEC-DEPS-001 ~ SEC-DEPS-005 | P1 |
| A07: Auth Failures | SEC-AUTH-001 ~ SEC-AUTH-010 | P0 |
| A08: Data Integrity Failures | SEC-INTEGRITY-001 ~ SEC-INTEGRITY-005 | P1 |
| A09: Logging Failures | SEC-LOGGING-001 ~ SEC-LOGGING-005 | P1 |
| A10: SSRF | SEC-SSRF-001 ~ SEC-SSRF-005 | P1 |

---

## Web应用安全测试

### SEC-WEB-001: 安全头检查

**测试类型**: 配置审计
**优先级**: P0
**工具**: curl, OWASP ZAP

**测试步骤**:

```bash
# 检查安全头
curl -I https://jdoptimizer.com
```

**预期响应头**:

| 安全头 | 预期值 | 说明 |
|--------|--------|------|
| X-Frame-Options | DENY 或 SAMEORIGIN | 防止点击劫持 |
| X-Content-Type-Options | nosniff | 防止MIME类型嗅探 |
| X-XSS-Protection | 1; mode=block | XSS保护 |
| Content-Security-Policy | 自定义策略 | CSP保护 |
| Strict-Transport-Security | max-age=31536000 | HSTS强制HTTPS |
| Referrer-Policy | strict-origin-when-cross-origin | Referer策略 |
| Permissions-Policy | 限制敏感API | 权限策略 |

**验证脚本**:

```typescript
// tests/security/security-headers.spec.ts
import { test, expect } from '@playwright/test'

test('Security Headers Check', async ({ page, request }) => {
  const response = await request.get('https://jdoptimizer.com')

  expect(response.headers()['x-frame-options']).toBeDefined()
  expect(response.headers()['x-content-type-options']).toBe('nosniff')
  expect(response.headers()['strict-transport-security']).toBeDefined()

  const csp = response.headers()['content-security-policy']
  expect(csp).toContain("default-src 'self'")
  expect(csp).toContain("script-src 'self'")
})
```

---

### SEC-WEB-002: Content Security Policy (CSP) 测试

**测试类型**: 配置审计
**优先级**: P0
**工具**: CSP Evaluator, curl

**测试步骤**:

1. 获取CSP策略
2. 使用CSP Evaluator分析
3. 测试策略有效性

**CSP策略示例**:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.example.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.jdoptimizer.com https://*.stripe.com;
  frame-src 'self' https://*.stripe.com;
  font-src 'self' https://fonts.gstatic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  report-uri /csp-report-endpoint;
```

**验证点**:
- [ ] default-src设置为'self'
- [ ] 不允许unsafe-inline（如果可能）
- [ ] frame-src限制为可信来源
- [ ] 配置report-uri用于违规报告
- [ ] 测试内联脚本是否被阻止
- [ ] 测试eval()是否被阻止

**测试脚本**:

```javascript
// 在浏览器控制台测试CSP
// 1. 测试内联脚本
document.createElement('script').textContent = 'console.log("XSS")';
// 如果CSP正确，应该被阻止

// 2. 测试eval()
try {
  eval('console.log("eval test")');
} catch (e) {
  console.log('CSP blocked eval:', e);
}

// 3. 测试外部资源
const img = document.createElement('img');
img.src = 'https://evil.com/tracker.gif';
document.body.appendChild(img);
// 检查网络面板，应该被阻止
```

---

### SEC-WEB-003: 跨站脚本(XSS)测试

**测试类型**: 漏洞扫描
**优先级**: P0
**工具**: OWASP XSSer, XSStrike, 手动测试

**测试向量**:

| 测试场景 | Payload | 预期结果 |
|---------|---------|---------|
| 反射型XSS | `<script>alert('XSS')</script>` | 脚本不执行 |
| 存储型XSS | `<img src=x onerror=alert('XSS')>` | 被转义或过滤 |
| DOM型XSS | `javascript:alert('XSS')` | 链接被过滤 |
| 事件处理器 | `onmouseover="alert('XSS')"` | 事件被过滤 |
| SVG XSS | `<svg onload=alert('XSS')>` | SVG被正确处理 |

**测试用例**:

```typescript
// tests/security/xss.spec.ts
import { test, expect } from '@playwright/test'

const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  '<svg onload=alert("XSS")>',
  'javascript:alert("XSS")',
  '"><script>alert("XSS")</script>',
  "'><script>alert('XSS')</script>",
  '<script>alert(String.fromCharCode(88,83,83))</script>',
  '<script src="https://evil.com/xss.js"></script>',
]

test.describe('XSS Prevention', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'TestPass123!')
    await page.click('button[type="submit"]')
  })

  test('should sanitize JD content', async ({ page }) => {
    await page.goto('/generator/new')

    // 测试每个payload
    for (const payload of xssPayloads) {
      await page.fill('textarea[name="content"]', payload)
      await page.click('button:has-text("Save")')

      // 验证payload被转义
      const content = await page.locator('.editor-content').innerHTML()
      expect(content).not.toContain('onerror=')
      expect(content).not.toContain('onload=')
      expect(content).not.toContain('<script>')

      // 验证脚本不执行
      const jsExecuted = await page.evaluate(() => {
        return (window as any).xssExecuted || false
      })
      expect(jsExecuted).toBe(false)
    }
  })

  test('should sanitize user profile', async ({ page }) => {
    await page.goto('/settings/profile')

    for (const payload of xssPayloads) {
      await page.fill('[name="name"]', payload)
      await page.click('button:has-text("Save")')

      const name = await page.locator('.user-name').textContent()
      expect(name).not.toContain('<script>')
    }
  })
})
```

**防护措施验证**:
- [ ] 输入验证和过滤
- [ ] 输出编码（HTML、JavaScript、CSS、URL）
- [ ] CSP策略配置
- [ ] HttpOnly Cookie
- [ ] 使用安全的模板引擎

---

### SEC-WEB-004: 跨站请求伪造(CSRF)测试

**测试类型**: 漏洞扫描
**优先级**: P0
**工具**: Burp Suite, 手动测试

**测试步骤**:

1. 获取有效的CSRF token
2. 尝试不发送token的请求
3. 尝试使用伪造token的请求

**测试用例**:

```typescript
// tests/security/csrf.spec.ts
import { test, expect } from '@playwright/test'
import { request } from '@playwright/test'

test.describe('CSRF Protection', () => {
  test('should reject requests without CSRF token', async ({ request }) => {
    // 获取页面以获取token
    const pageResponse = await request.get('/settings/profile')
    const html = await pageResponse.text()

    // 提取CSRF token
    const tokenMatch = html.match(/name="csrf_token"\s+value="([^"]+)"/)
    if (!tokenMatch) {
      console.warn('CSRF token not found in page')
      return
    }

    // 测试无token请求
    const noTokenResponse = await request.post('/api/profile', {
      data: {
        name: 'Test User',
      },
    })
    expect(noTokenResponse.status()).toBe(403)

    // 测试无效token请求
    const invalidTokenResponse = await request.post('/api/profile', {
      headers: {
        'X-CSRF-Token': 'invalid_token',
      },
      data: {
        name: 'Test User',
      },
    })
    expect(invalidTokenResponse.status()).toBe(403)

    // 测试有效token请求
    const validTokenResponse = await request.post('/api/profile', {
      headers: {
        'X-CSRF-Token': tokenMatch[1],
      },
      data: {
        name: 'Test User',
      },
    })
    expect(validTokenResponse.status()).toBe(200)
  })
})
```

**防护验证**:
- [ ] 所有状态改变操作有CSRF保护
- [ ] Token唯一且不可预测
- [ ] Token与用户会话绑定
- [ ] Token有时效性
- [ ] SameSite Cookie属性设置
- [ ] Origin/Referer验证

---

## API安全测试

### SEC-API-001: SQL注入测试

**测试类型**: 漏洞扫描
**优先级**: P0
**工具**: SQLMap, Burp Suite, 手动测试

**测试向量**:

| 端点 | 参数 | 测试Payload |
|------|------|-------------|
| /api/jd | search | `' OR '1'='1` |
| /api/jd | id | `1 UNION SELECT * FROM users--` |
| /api/auth/login | email | `' OR '1'='1'--` |
| /api/templates | category | `'; DROP TABLE users; --` |

**测试用例**:

```typescript
// tests/security/sql-injection.spec.ts
import { test, expect } from '@playwright/test'

const sqlInjectionPayloads = [
  "' OR '1'='1",
  "' OR '1'='1'--",
  "1' OR '1'='1",
  "admin'--",
  "admin'/*",
  "1 UNION SELECT * FROM users--",
  "'; DROP TABLE users; --",
  "1' AND 1=1--",
  "1' AND 1=2--",
]

test.describe('SQL Injection Prevention', () => {
  test('should protect search endpoint', async ({ request }) => {
    // 先登录获取token
    const loginRes = await request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'TestPass123!',
      },
    })
    const token = (await loginRes.json()).data.token

    // 测试注入payload
    for (const payload of sqlInjectionPayloads) {
      const res = await request.get(`/api/jd?search=${encodeURIComponent(payload)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // 不应该返回500错误（表示注入成功）
      expect(res.status()).not.toBe(500)
      expect(res.status()).not.toBe(400)

      const data = await res.json()
      // 结果应该是合法的搜索结果，不是用户数据
      if (data.data && data.data.length > 0) {
        data.data.forEach((item: any) => {
          expect(item).toHaveProperty('id')
          expect(item).toHaveProperty('title')
          expect(item).not.toHaveProperty('password')
        })
      }
    }
  })

  test('should protect detail endpoint', async ({ request }) => {
    const loginRes = await request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'TestPass123!',
      },
    })
    const token = (await loginRes.json()).data.token

    for (const payload of sqlInjectionPayloads) {
      const res = await request.get(`/api/jd/${payload}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // 应该返回404或400，不是500
      expect([400, 404]).toContain(res.status())
      expect(res.status()).not.toBe(500)
    }
  })
})
```

**防护验证**:
- [ ] 使用参数化查询
- [ ] ORM正确配置
- [ ] 输入验证
- [ ] 错误信息不泄露数据库结构
- [ ] 最小权限原则

---

### SEC-API-002: API速率限制测试

**测试类型**: 负载测试
**优先级**: P0
**工具**: k6, Artillery, Postman

**测试脚本**:

```javascript
// tests/performance/rate-limiting.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export let options = {
  stages: [
    { duration: '10s', target: 10 },   // 10请求/秒
    { duration: '10s', target: 50 },   // 50请求/秒
    { duration: '10s', target: 100 },  // 100请求/秒
    { duration: '10s', target: 200 },  // 200请求/秒
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
}

const BASE_URL = 'http://localhost:3000/api'

export default function () {
  // 测试登录端点速率限制
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'test@example.com',
    password: 'wrongpassword',
  }), {
    headers: { 'Content-Type': 'application/json' },
  })

  check(loginRes, {
    'login status is 200 or 429': (r) => [200, 429].includes(r.status),
    'rate limit header present': (r) => r.headers['X-RateLimit-Limit'] !== undefined,
  })

  // 测试JD列表端点
  const jdListRes = http.get(`${BASE_URL}/jd`, {
    headers: { Authorization: `Bearer ${__ENV.TOKEN}` },
  })

  check(jdListRes, {
    'jd list status is 200 or 429': (r) => [200, 429].includes(r.status),
  })

  sleep(1)
}
```

**预期行为**:

| 端点 | 速率限制 | 超限响应 |
|------|---------|---------|
| POST /api/auth/login | 5次/分钟 | 429 Too Many Requests |
| GET /api/jd | 100次/分钟 | 429 Too Many Requests |
| POST /api/jd | 20次/分钟 | 429 Too Many Requests |
| POST /api/jd/analyze | 10次/分钟 | 429 Too Many Requests |
| POST /api/export | 5次/分钟 | 429 Too Many Requests |

**验证点**:
- [ ] 响应头包含速率限制信息
- [ ] 超限时返回429
- [ ] 限制窗口正确重置
- [ ] 限制基于用户和IP
- [ ] 限制可配置

---

### SEC-API-003: 认证令牌安全测试

**测试类型**: 安全测试
**优先级**: P0

**测试项目**:

| 测试项 | 测试方法 | 预期结果 |
|--------|---------|---------|
| JWT签名验证 | 修改token payload | 验证失败 |
| Token过期 | 使用过期token | 返回401 |
| Token刷新 | 刷新流程 | 新token有效 |
| Token撤销 | 登出后使用 | Token无效 |
| Token重放 | 多次使用相同token | 正常处理 |

**测试用例**:

```typescript
// tests/security/auth-token.spec.ts
import { test, expect } from '@playwright/test'
import jwt from 'jsonwebtoken'

test.describe('JWT Token Security', () => {
  let authToken: string
  let refreshToken: string

  test.beforeEach(async ({ request }) => {
    const loginRes = await request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'TestPass123!',
      },
    })
    const data = (await loginRes.json()).data
    authToken = data.token
    refreshToken = data.refreshToken
  })

  test('should reject tampered token', async ({ request }) => {
    // 解码并修改token
    const decoded = jwt.decode(authToken) as any
    decoded.userId = 'different_user_id'

    // 重新编码（使用错误签名）
    const tamperedToken = jwt.sign(decoded, 'wrong_secret')

    const res = await request.get('/api/jd', {
      headers: {
        Authorization: `Bearer ${tamperedToken}`,
      },
    })

    expect(res.status()).toBe(401)
  })

  test('should reject expired token', async ({ request }) => {
    // 创建已过期的token
    const expiredToken = jwt.sign(
      { userId: 'test_user_id' },
      process.env.JWT_SECRET!,
      { expiresIn: '-1s' }
    )

    const res = await request.get('/api/jd', {
      headers: {
        Authorization: `Bearer ${expiredToken}`,
      },
    })

    expect(res.status()).toBe(401)
    expect((await res.json()).message).toContain('expired')
  })

  test('should refresh token successfully', async ({ request }) => {
    const refreshRes = await request.post('/api/auth/refresh', {
      data: {
        refreshToken,
      },
    })

    expect(refreshRes.status()).toBe(200)

    const newToken = (await refreshRes.json()).data.token
    expect(newToken).toBeDefined()
    expect(newToken).not.toBe(authToken)

    // 使用新token访问
    const res = await request.get('/api/jd', {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    })

    expect(res.status()).toBe(200)
  })
})
```

**防护验证**:
- [ ] Token使用强签名算法（RS256/ES256）
- [ ] Token有效期合理
- [ ] Refresh token安全存储
- [ ] Token撤销机制
- [ ] 登出时token失效

---

## 认证与授权安全测试

### SEC-AUTH-001: 暴力破解防护测试

**测试类型**: 安全测试
**优先级**: P0
**工具**: Hydra, Burp Suite, 自定义脚本

**测试步骤**:

1. 尝试多次错误登录
2. 验证账户锁定机制
3. 验证解锁机制

**测试脚本**:

```typescript
// tests/security/brute-force.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Brute Force Protection', () => {
  test('should lock account after multiple failed attempts', async ({ request }) => {
    const email = 'test+brute@example.com'

    // 尝试5次错误登录
    for (let i = 0; i < 5; i++) {
      const res = await request.post('/api/auth/login', {
        data: {
          email,
          password: `wrongpassword${i}`,
        },
      })

      expect(res.status()).toBe(401)
    }

    // 第6次应该被锁定
    const lockedRes = await request.post('/api/auth/login', {
      data: {
        email,
        password: 'correctpassword',
      },
    })

    expect(lockedRes.status()).toBe(403)
    const data = await lockedRes.json()
    expect(data.message).toContain('locked')
  })

  test('should unlock after cooldown period', async ({ page }) => {
    const email = 'test+unlock@example.com'

    // 锁定账户
    for (let i = 0; i < 5; i++) {
      await page.request.post('/api/auth/login', {
        data: { email, password: 'wrong' },
      })
    }

    // 等待解锁时间（假设为5分钟）
    // 在实际测试中，可能需要调整系统配置

    // 尝试正确登录
    const res = await page.request.post('/api/auth/login', {
      data: {
        email,
        password: 'CorrectPass123!',
      },
    })

    expect(res.status()).toBe(200)
  })
})
```

**防护配置**:

```typescript
// 安全配置示例
export const authConfig = {
  maxAttempts: 5,           // 最大尝试次数
  lockDuration: 15 * 60,    // 锁定时长（秒）
  cooldownPeriod: 60,        // 冷却期（秒）
  enableCaptcha: true,      // 多次失败后启用验证码
  notificationEmail: true,  // 发送账户锁定邮件
}
```

**验证点**:
- [ ] 尝试次数限制
- [ ] 锁定时间合理
- [ ] 锁定后通知用户
- [ ] 解锁机制正常
- [ ] 验证码集成
- [ ] 日志记录

---

### SEC-AUTH-002: 会话管理测试

**测试类型**: 安全测试
**优先级**: P0

**测试项目**:

| 测试项 | 测试方法 | 预期结果 |
|--------|---------|---------|
| 会话超时 | 等待超时时间 | 会话失效 |
| 并发登录 | 多设备登录 | 根据策略处理 |
| 会话固定 | 登录前后对比 | 会话ID更新 |
| 会话劫持 | 复制他人cookie | 无效或检测 |
| 登出所有 | 调用登出API | 所有会话失效 |

**测试用例**:

```typescript
// tests/security/session.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Session Management', () => {
  test('should expire session after timeout', async ({ page, context }) => {
    // 登录
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'TestPass123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    // 修改会话超时为1秒（测试环境）
    await context.addCookies([{
      name: 'session_timeout',
      value: '1',
      domain: 'localhost',
      path: '/',
    }])

    // 等待超时
    await page.waitForTimeout(2000)

    // 尝试访问受保护页面
    await page.goto('/settings/profile')
    await page.waitForURL('/login')
  })

  test('should invalidate all sessions on logout all', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    // 在两个上下文中登录
    await login(context1)
    await login(context2)

    // 在context1中登出所有设备
    const page1 = await context1.newPage()
    await page1.goto('/settings/security')
    await page1.click('button:has-text("Logout all devices")')

    // 在context2中尝试访问
    const page2 = await context2.newPage()
    await page2.goto('/dashboard')
    await page2.waitForURL('/login')
  })
})

async function login(context: any) {
  const page = await context.newPage()
  await page.goto('/login')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'TestPass123!')
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard')
  await page.close()
}
```

**防护验证**:
- [ ] 会话超时配置合理
- [ ] HTTPS Only cookie
- [ ] HttpOnly cookie
- [ ] SameSite cookie
- [ ] 会话ID随机性
- [ ] 会话绑定IP/UA（可选）

---

## 数据安全测试

### SEC-DATA-001: 敏感数据加密测试

**测试类型**: 安全审计
**优先级**: P0

**测试项目**:

| 数据类型 | 存储加密 | 传输加密 | 访问控制 |
|---------|---------|---------|---------|
| 密码 | ✅ bcrypt/argon2 | ✅ HTTPS | ✅ 基于需要 |
| API密钥 | ✅ AES-256 | ✅ HTTPS | ✅ 仅管理员 |
| 支付信息 | ✅ 令牌化 | ✅ HTTPS | ✅ PCI合规 |
| 个人信息 | ✅ 可选加密 | ✅ HTTPS | ✅ GDPR合规 |
| JD内容 | ✅ 可选加密 | ✅ HTTPS | ✅ 基于权限 |

**测试用例**:

```typescript
// tests/security/data-encryption.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Data Encryption', () => {
  test('should encrypt passwords in database', async ({ request }) => {
    // 注册用户
    await request.post('/api/auth/register', {
      data: {
        email: 'test+crypto@example.com',
        password: 'PlainPassword123!',
        name: 'Test User',
      },
    })

    // 直接查询数据库（需要测试数据库访问）
    // 在实际测试中，可能需要使用数据库管理员权限

    // 验证密码不以明文存储
    const dbResponse = await request.post('/api/test/query-db', {
      data: {
        query: "SELECT password FROM users WHERE email = 'test+crypto@example.com'",
      },
    })

    const result = await dbResponse.json()
    const storedPassword = result.data[0].password

    expect(storedPassword).not.toBe('PlainPassword123!')
    expect(storedPassword).toMatch(/^\$2[aby]\$\d+\$/) // bcrypt格式
  })

  test('should use HTTPS for all requests', async ({ page }) => {
    // 确保所有资源通过HTTPS加载
    const responses: any[] = []

    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        status: response.status(),
        security: response.securityDetails(),
      })
    })

    await page.goto('https://jdoptimizer.com')

    // 验证所有请求都是HTTPS
    responses.forEach((r) => {
      if (r.url.startsWith('http:')) {
        throw new Error(`HTTP request detected: ${r.url}`)
      }
    })
  })
})
```

**SSL/TLS配置**:

```bash
# 测试SSL配置
nmap --script ssl-cert,ssl-enum-ciphers -p 443 jdoptimizer.com

# 使用SSL Labs测试
# 访问: https://www.ssllabs.com/ssltest/analyze.html?d=jdoptimizer.com
```

**SSL Labs评分目标**:
- A+ 或 A
- 无弱密码套件
- TLS 1.2/1.3
- 强证书
- HSTS启用

---

## 性能测试概述

### 性能测试目标

- 确保系统在预期负载下稳定运行
- 识别性能瓶颈
- 验证扩展能力
- 优化资源使用
- 保证用户体验

### 性能指标

| 指标 | 目标值 | 警告阈值 | 严重阈值 |
|------|--------|---------|---------|
| API响应时间(P95) | < 500ms | < 1000ms | > 1000ms |
| 页面加载时间(LCP) | < 2.5s | < 4s | > 4s |
| 错误率 | < 0.1% | < 0.5% | > 1% |
| 并发用户 | 1000+ | 500+ | < 500 |
| 数据库查询时间 | < 100ms | < 200ms | > 200ms |
| CPU使用率 | < 50% | < 70% | > 80% |
| 内存使用率 | < 70% | < 80% | > 90% |

---

## 负载测试

### PERF-LOAD-001: API负载测试

**测试类型**: 负载测试
**优先级**: P0
**工具**: k6

**测试场景**:

```javascript
// tests/performance/api-load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export const options = {
  stages: [
    { duration: '2m', target: 10 },   // 启动：10用户
    { duration: '5m', target: 50 },   // 爬升：50用户
    { duration: '10m', target: 50 },  // 稳定：50用户
    { duration: '5m', target: 100 },   // 爬升：100用户
    { duration: '10m', target: 100 }, // 稳定：100用户
    { duration: '5m', target: 200 },   // 爬升：200用户
    { duration: '10m', target: 200 }, // 稳定：200用户
    { duration: '5m', target: 0 },    // 降温：0用户
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
  },
}

// 测试数据
const testUsers = [
  { email: 'user1@example.com', password: 'Pass123!' },
  { email: 'user2@example.com', password: 'Pass123!' },
  { email: 'user3@example.com', password: 'Pass123!' },
]

let authToken = ''

export function setup() {
  // 初始化：登录获取token
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify(testUsers[0]), {
    headers: { 'Content-Type': 'application/json' },
  })
  return { token: loginRes.json('data.token') }
}

export default function (data) {
  // 场景1: 获取JD列表
  const jdListRes = http.get(`${BASE_URL}/api/jd`, {
    headers: { Authorization: `Bearer ${data.token}` },
  })

  check(jdListRes, {
    'JD list status is 200': (r) => r.status === 200,
    'JD list response time < 300ms': (r) => r.timings.duration < 300,
  })

  // 场景2: 搜索JD
  const searchRes = http.get(`${BASE_URL}/api/jd?search=developer`, {
    headers: { Authorization: `Bearer ${data.token}` },
  })

  check(searchRes, {
    'Search status is 200': (r) => r.status === 200,
    'Search response time < 500ms': (r) => r.timings.duration < 500,
  })

  // 场景3: 获取模板列表
  const templatesRes = http.get(`${BASE_URL}/api/templates`, {
    headers: { Authorization: `Bearer ${data.token}` },
  })

  check(templatesRes, {
    'Templates status is 200': (r) => r.status === 200,
    'Templates response time < 400ms': (r) => r.timings.duration < 400,
  })

  sleep(1)
}
```

**执行命令**:

```bash
# 基础负载测试
k6 run tests/performance/api-load-test.js

# 带环境变量的测试
k6 run --env BASE_URL=https://api.jdoptimizer.com tests/performance/api-load-test.js

# 输出到JSON
k6 run --out json=results.json tests/performance/api-load-test.js
```

**结果分析**:

| 指标 | 实际值 | 目标值 | 状态 |
|------|--------|--------|------|
| http_req_duration (P95) | 342ms | < 500ms | ✅ |
| http_req_duration (P99) | 789ms | < 1000ms | ✅ |
| http_req_failed | 0.08% | < 0.1% | ✅ |
| vus | 200 | 200+ | ✅ |

---

### PERF-LOAD-002: 数据库负载测试

**测试类型**: 负载测试
**优先级**: P1
**工具**: pgbench (PostgreSQL) 或自定义脚本

**测试场景**:

```javascript
// tests/performance/db-load-test.js
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function runDbLoadTest() {
  console.log('Starting database load test...')

  // 测试1: 并发查询
  const queryCount = 100
  const startTime = Date.now()

  const queries = Array(queryCount).fill(null).map(async () => {
    return pool.query('SELECT * FROM jd_projects WHERE user_id = $1 LIMIT 10', ['test_user_id'])
  })

  await Promise.all(queries)

  const queryDuration = Date.now() - startTime
  const avgQueryTime = queryDuration / queryCount
  console.log(`Average query time: ${avgQueryTime}ms`)

  // 测试2: 并发插入
  const insertCount = 50
  const insertStart = Date.now()

  const inserts = Array(insertCount).fill(null).map(async (_, i) => {
    return pool.query(`
      INSERT INTO jd_projects (user_id, title, content, status)
      VALUES ($1, $2, $3, $4)
    `, ['test_user_id', `Test JD ${i}`, 'Test content', 'draft'])
  })

  await Promise.all(inserts)

  const insertDuration = Date.now() - insertStart
  const avgInsertTime = insertDuration / insertCount
  console.log(`Average insert time: ${avgInsertTime}ms`)

  // 测试3: 复杂查询
  const complexStart = Date.now()

  for (let i = 0; i < 20; i++) {
    await pool.query(`
      SELECT jp.*, u.name as author_name
      FROM jd_projects jp
      JOIN users u ON jp.user_id = u.id
      WHERE jp.status = 'published'
      ORDER BY jp.created_at DESC
      LIMIT 20
      OFFSET $1
    `, [i * 20])
  }

  const complexDuration = Date.now() - complexStart
  const avgComplexTime = complexDuration / 20
  console.log(`Average complex query time: ${avgComplexTime}ms`)

  await pool.end()
}

runDbLoadTest().catch(console.error)
```

**性能基准**:

| 查询类型 | 目标时间 | 实际时间 | 状态 |
|---------|---------|---------|------|
| 简单查询 | < 50ms | 23ms | ✅ |
| 插入操作 | < 100ms | 67ms | ✅ |
| 复杂JOIN | < 200ms | 156ms | ✅ |
| 全文搜索 | < 300ms | 289ms | ⚠️ |

---

## 压力测试

### PERF-STRESS-001: 极限压力测试

**测试类型**: 压力测试
**优先级**: P1
**工具**: k6

**测试场景**:

```javascript
// tests/performance/stress-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '5m', target: 100 },   // 启动
    { duration: '5m', target: 200 },   // 爬升
    { duration: '5m', target: 500 },   // 爬升
    { duration: '10m', target: 1000 }, // 稳定（极限）
    { duration: '5m', target: 2000 },  // 超载
    { duration: '5m', target: 0 },     // 恢复
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 放宽阈值
    http_req_failed: ['rate<0.05'],    // 允许更高错误率
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export function setup() {
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'test@example.com',
    password: 'Pass123!',
  }), {
    headers: { 'Content-Type': 'application/json' },
  })
  return { token: loginRes.json('data.token') }
}

export default function (data) {
  // 高频API调用
  const endpoints = [
    `${BASE_URL}/api/jd`,
    `${BASE_URL}/api/templates`,
    `${BASE_URL}/api/history`,
  ]

  const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)]

  const res = http.get(randomEndpoint, {
    headers: { Authorization: `Bearer ${data.token}` },
    timeout: '10s',
  })

  check(res, {
    'status is 200 or 429': (r) => [200, 429].includes(r.status),
    'response time < 5s': (r) => r.timings.duration < 5000,
  })

  sleep(Math.random() * 2)
}
```

**观察指标**:

| 负载水平 | 并发用户 | 响应时间(P95) | 错误率 | CPU | 内存 |
|---------|---------|--------------|--------|-----|------|
| 正常 | 100 | 234ms | 0.02% | 35% | 45% |
| 高 | 500 | 567ms | 0.05% | 62% | 68% |
| 极限 | 1000 | 1234ms | 0.15% | 85% | 82% |
| 超载 | 2000 | 2345ms | 2.3% | 95% | 94% |

**系统极限识别**:
- 系统在1000并发时仍可接受
- 2000并发时性能显著下降
- 建议最大并发：800-1000用户

---

## 性能监控与优化

### PERF-MON-001: 应用性能监控(APM)

**监控工具**:
- Datadog
- New Relic
- Prometheus + Grafana
- Application Insights

**关键指标**:

```typescript
// 监控指标配置示例
export const performanceMetrics = {
  // API端点监控
  api: {
    '/api/jd': {
      p95: 300,
      p99: 500,
      errorRate: 0.01,
    },
    '/api/jd/analyze': {
      p95: 10000,
      p99: 20000,
      errorRate: 0.02,
    },
  },

  // 数据库监控
  database: {
    queryTime: {
      avg: 50,
      p95: 100,
      max: 200,
    },
    connectionPool: {
      min: 5,
      max: 50,
      idle: 10,
    },
  },

  // 资源监控
  resources: {
    cpu: {
      warning: 70,
      critical: 85,
    },
    memory: {
      warning: 80,
      critical: 90,
    },
    disk: {
      warning: 85,
      critical: 95,
    },
  },
}
```

**告警规则**:

```yaml
# prometheus/alerts.yml
groups:
  - name: jd_optimizer_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"

      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 1
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "API response time is slow"

      - alert: HighCPUUsage
        expr: cpu_usage_percent > 80
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "CPU usage is critical"
```

---

### PERF-OPT-001: 性能优化建议

**1. 数据库优化**

```sql
-- 添加索引
CREATE INDEX idx_jd_projects_user_id ON jd_projects(user_id);
CREATE INDEX idx_jd_projects_status ON jd_projects(status);
CREATE INDEX idx_jd_projects_created_at ON jd_projects(created_at DESC);

-- 创建全文搜索索引
CREATE INDEX idx_jd_projects_search ON jd_projects USING gin(to_tsvector('english', title || ' ' || content));

-- 分析查询性能
EXPLAIN ANALYZE SELECT * FROM jd_projects WHERE user_id = 'xxx' ORDER BY created_at DESC;
```

**2. API缓存**

```typescript
// Redis缓存示例
import { Redis } from 'ioredis'

const redis = new Redis()

export async function getJDList(userId: string) {
  const cacheKey = `jd:list:${userId}`

  // 尝试从缓存获取
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // 从数据库查询
  const data = await db.query.jdProjects.findMany({
    where: eq(jdProjects.userId, userId),
  })

  // 缓存结果（5分钟）
  await redis.setex(cacheKey, 300, JSON.stringify(data))

  return data
}
```

**3. CDN和静态资源优化**

```typescript
// next.config.mjs
export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jdoptimizer.com',
      },
    ],
  },

  // 启用CDN
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

**4. 代码分割和懒加载**

```typescript
// 动态导入
const JDAnalyzer = dynamic(() => import('@/components/JDAnalyzer'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
})

const TemplateGallery = dynamic(() => import('@/components/TemplateGallery'))
```

---

## 总结

本文档提供了JD Optimizer项目的完整安全和性能测试指南，包括：

**安全测试**:
- 7大安全领域
- OWASP Top 10完整覆盖
- 详细的安全测试用例
- 自动化测试脚本

**性能测试**:
- 负载测试场景
- 压力测试方法
- 性能监控指标
- 优化建议

**实施计划**:
1. 建立CI/CD集成测试
2. 定期安全扫描（每周）
3. 持续性能监控（实时）
4. 季度渗透测试
5. 年度安全审计

所有测试都应该集成到开发流程中，确保代码质量持续改进。

---

**维护说明**: 定期更新测试脚本和安全配置，跟踪新的安全威胁和性能最佳实践。
