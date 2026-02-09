# JD Optimizer 测试用例详细文档

> 版本: 1.0
> 创建日期: 2026-02-09
> 项目位置: `/Users/sumerasian/.openclaw/workspace/jd-optimizer`

## 目录

1. [用户认证测试用例](#用户认证测试用例)
2. [JD生成功能测试用例](#jd生成功能测试用例)
3. [历史记录测试用例](#历史记录测试用例)
4. [导出功能测试用例](#导出功能测试用例)
5. [支付流程测试用例](#支付流程测试用例)
6. [模板库测试用例](#模板库测试用例)
7. [AI服务测试用例](#ai服务测试用例)
8. [API端点测试用例](#api端点测试用例)

---

## 用户认证测试用例

### AUTH-001: 成功注册新用户

**测试类型**: 功能测试
**优先级**: P0
**执行时间**: ~2分钟

**前置条件**:
- 访问注册页面 `/register`

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 输入邮箱: `test+auth001@example.com` | 邮箱格式验证通过 |
| 2 | 输入密码: `SecurePass123!` | 密码强度显示"强" |
| 3 | 输入确认密码: `SecurePass123!` | 密码匹配提示 |
| 4 | 输入用户名: `Test User Auth001` | 用户名显示正常 |
| 5 | 勾选服务条款 | 复选框选中 |
| 6 | 点击"注册"按钮 | 提交表单 |

**预期结果**:
- 显示注册成功消息
- 页面重定向到邮箱验证提示页面
- 发送验证邮件到 `test+auth001@example.com`
- 数据库中创建用户记录，状态为"待验证"

**测试数据**:
```json
{
  "email": "test+auth001@example.com",
  "password": "SecurePass123!",
  "name": "Test User Auth001"
}
```

**验证点**:
- [ ] 邮箱发送成功
- [ ] 用户记录存在数据库
- [ ] 密码已加密存储
- [ ] 默认角色分配正确
- [ ] 会话未创建（需验证邮箱）

---

### AUTH-005: 成功登录

**测试类型**: 功能测试
**优先级**: P0
**执行时间**: ~1分钟

**前置条件**:
- 已有注册并验证的账户

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 访问登录页面 `/login` | 页面正常加载 |
| 2 | 输入邮箱: `test@example.com` | 邮箱显示在输入框 |
| 3 | 输入密码: `SecurePass123!` | 密码以掩码显示 |
| 4 | 勾选"记住我" | 复选框选中 |
| 5 | 点击"登录"按钮 | 提交表单 |

**预期结果**:
- 登录成功
- 重定向到仪表板 `/dashboard`
- 设置认证cookie
- 显示欢迎消息
- "记住我"token已存储

**测试数据**:
```json
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

**验证点**:
- [ ] 重定向到正确页面
- [ ] Cookie设置正确
- [ ] Token有效期正确
- [ ] 用户信息在页面正确显示
- [ ] 可以访问受保护的路由

**边界条件**:
- 使用刚验证的账户登录
- 使用"记住我"功能
- 关闭浏览器后重新打开

---

### AUTH-007: 未注册邮箱登录

**测试类型**: 负面测试
**优先级**: P0
**执行时间**: ~30秒

**前置条件**:
- 访问登录页面

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 输入不存在的邮箱: `notexist@example.com` | 邮箱显示正常 |
| 2 | 输入任意密码 | 密码显示正常 |
| 3 | 点击"登录"按钮 | 提交表单 |

**预期结果**:
- 显示错误消息
- 错误消息不泄露账户信息（如"用户不存在" vs "密码错误"）
- 页面不刷新
- 登录失败
- 不创建新会话

**验证点**:
- [ ] 错误消息安全性
- [ ] 不暴露系统信息
- [ ] 没有会话创建
- [ ] 没有敏感信息泄露
- [ ] 响应时间合理（防止暴力破解）

**安全检查**:
- 响应时间与真实失败相似（防时序攻击）
- 不显示具体错误原因
- 记录登录失败尝试

---

## JD生成功能测试用例

### JD-001: 创建空白JD项目

**测试类型**: 功能测试
**优先级**: P0
**执行时间**: ~1分钟

**前置条件**:
- 已登录
- 访问仪表板

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 点击"创建新JD"按钮 | 打开创建对话框 |
| 2 | 选择"空白开始"选项 | 选项被选中 |
| 3 | 点击"继续"按钮 | 进入编辑器页面 |

**预期结果**:
- 进入JD编辑器页面 `/generator/new`
- 显示空的编辑器
- 显示标题输入框（占位符"输入JD标题"）
- 显示内容编辑器
- 显示保存按钮（禁用状态）
- 显示"分析"按钮（禁用状态）
- 自动生成临时ID

**验证点**:
- [ ] URL正确
- [ ] 编辑器可输入
- [ ] 所有工具按钮状态正确
- [ ] 自动保存功能准备就绪
- [ ] 没有JavaScript错误

**测试数据**:
```json
{
  "project": {
    "title": "",
    "content": "",
    "status": "draft"
  }
}
```

---

### JD-004: AI分析JD内容

**测试类型**: 功能测试
**优先级**: P0
**执行时间**: ~30秒（取决于AI服务）

**前置条件**:
- 已创建JD项目
- 已输入JD内容

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 在编辑器中输入完整的JD文本 | 内容显示在编辑器中 |
| 2 | 点击"分析"按钮 | 按钮显示加载状态 |
| 3 | 等待分析完成 | 分析结果显示 |

**示例JD内容**:
```
Job Title: Senior Software Engineer

We are looking for an experienced Senior Software Engineer to join our team.

Requirements:
- 5+ years of experience in software development
- Proficiency in JavaScript, React, and Node.js
- Experience with cloud platforms (AWS, GCP, or Azure)
- Strong problem-solving skills
- Excellent communication skills

Responsibilities:
- Design and implement scalable software solutions
- Collaborate with cross-functional teams
- Mentor junior developers
- Participate in code reviews
```

**预期结果**:
- 分析结果面板展开
- 显示以下分类:
  - 技能要求
  - 工作职责
  - 经验要求
  - 文化要求
  - 薪资范围建议
- 每个分类显示匹配的关键词
- 高亮显示需要改进的部分
- 显示"优化"按钮（启用状态）

**验证点**:
- [ ] 分析结果准确
- [ ] 关键词提取正确
- [ ] 分类合理
- [ ] 响应时间在预期范围内
- [ ] 网络请求正确处理
- [ ] 错误处理完善

**测试数据**:
```json
{
  "analysis": {
    "skills": ["JavaScript", "React", "Node.js", "AWS"],
    "experience": "5+ years",
    "responsibilities": ["Design", "Implement", "Collaborate"],
    "culture": ["Problem-solving", "Communication"],
    "score": 75
  }
}
```

**边界条件**:
- 极短JD（<50字符）
- 极长JD（>10000字符）
- 特殊字符和表情符号
- 多语言JD

---

### JD-005: AI优化JD内容

**测试类型**: 功能测试
**优先级**: P0
**执行时间**: ~60秒（取决于AI服务）

**前置条件**:
- 已完成JD分析
- 分析结果显示

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 查看分析结果 | 结果面板展开 |
| 2 | 选择要应用的建议 | 建议项被选中 |
| 3 | 点击"优化"按钮 | 按钮显示加载状态 |
| 4 | 等待优化完成 | 优化结果显示 |

**预期结果**:
- 优化进度显示
- 显示优化的各个阶段:
  - 结构优化
  - 语言优化
  - 关键词优化
  - 格式优化
- 优化后的内容替换原内容
- 显示对比视图（原始 vs 优化）
- 高亮显示变更部分
- 显示优化评分提升
- 保存新版本到历史记录

**验证点**:
- [ ] 优化内容质量提升
- [ ] 原始意图保持
- [ ] 格式正确
- [ ] 没有信息丢失
- [ ] 历史记录正确保存
- [ ] 可以撤销优化
- [ ] 响应时间合理

**优化前后对比示例**:

**原始内容**:
```
Looking for dev. Need to know JS and React. Good pay.
```

**优化后内容**:
```
Job Title: Software Developer

Position Overview:
We are seeking a talented Software Developer to join our innovative team and contribute to cutting-edge projects.

Required Skills:
- Strong proficiency in JavaScript
- Experience with React framework
- Problem-solving abilities
- Team collaboration skills
```

---

## 历史记录测试用例

### HIST-001: 查看版本列表

**测试类型**: 功能测试
**优先级**: P0
**执行时间**: ~30秒

**前置条件**:
- JD项目有多个版本
- 访问JD项目页面

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 点击"历史记录"标签页 | 显示版本列表 |
| 2 | 滚动查看所有版本 | 版本按时间排序 |
| 3 | 查看版本详情 | 显示版本信息 |

**预期结果**:
- 显示时间线视图
- 每个版本显示:
  - 版本号
  - 创建时间
  - 编辑者名称
  - 版本标签（如有）
  - 缩略预览
- 最新的版本在顶部
- 高亮当前激活的版本
- 显示版本差异摘要

**验证点**:
- [ ] 所有版本都显示
- [ ] 时间顺序正确
- [ ] 编辑者信息正确
- [ ] 缩略图准确
- [ ] 性能良好（大量版本时）
- [ ] 分页/加载更多正常工作

**测试数据**:
```json
{
  "versions": [
    {
      "id": "v1.0",
      "timestamp": "2026-02-09T10:00:00Z",
      "author": "John Doe",
      "label": "Initial",
      "thumbnail": "/api/thumb/v1.0"
    },
    {
      "id": "v1.1",
      "timestamp": "2026-02-09T11:30:00Z",
      "author": "Jane Smith",
      "label": "After Optimization",
      "thumbnail": "/api/thumb/v1.1"
    }
  ]
}
```

---

### HIST-003: 版本对比功能

**测试类型**: 功能测试
**优先级**: P0
**执行时间**: ~1分钟

**前置条件**:
- JD项目有多个版本
- 访问历史记录页面

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 选择第一个版本 | 版本1被选中 |
| 2 | 选择第二个版本 | 版本2被选中 |
| 3 | 点击"对比"按钮 | 显示对比视图 |

**预期结果**:
- 显示并排对比视图
- 左侧显示版本1，右侧显示版本2
- 差异高亮:
  - 绿色 = 新增内容
  - 红色 = 删除内容
  - 黄色 = 修改内容
- 同步滚动两个视图
- 显示统计信息:
  - 新增字数
  - 删除字数
  - 修改字数
  - 变更百分比
- 提供导出对比报告功能

**验证点**:
- [ ] 对比准确无误
- [ ] 高亮清晰可见
- [ ] 滚动同步正常
- [ ] 统计数据正确
- [ ] 性能良好
- [ ] 可以切换到内联对比模式

**测试场景**:
- 相邻版本对比
- 跨多个版本对比
- 相同版本对比（应显示无差异）
- 大文件对比

---

## 导出功能测试用例

### EXP-001: 导出为PDF

**测试类型**: 功能测试
**优先级**: P0
**执行时间**: ~10秒

**前置条件**:
- 已创建并保存JD项目

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 点击"导出"按钮 | 导出选项菜单显示 |
| 2 | 选择"导出为PDF" | PDF导出对话框打开 |
| 3.1 | 选项1: 使用默认设置 | 继续步骤4 |
| 3.2 | 选项2: 自定义设置 | 修改字体、边距、页眉页脚 |
| 4 | 点击"下载"按钮 | 开始生成PDF |
| 5 | 等待下载完成 | 文件下载到本地 |

**预期结果**:
- PDF文件成功下载
- 文件名格式: `jd-[project-name]-[timestamp].pdf`
- PDF内容:
  - 包含完整JD内容
  - 格式美观专业
  - 包含公司logo（如已设置）
  - 包含页眉页脚
  - 分页合理
  - 超链接可点击
- 文件大小合理（< 1MB）

**验证点**:
- [ ] PDF可打开
- [ ] 内容完整
- [ ] 格式正确
- [ ] 中文字符显示正常
- [ ] 特殊字符显示正常
- [ ] 图片正确渲染
- [ ] 文件大小合理

**自定义选项测试**:
- [ ] 字体选择生效
- [ ] 字体大小生效
- [ ] 页边距生效
- [ ] 页眉页脚生效
- [ ] 添加水印生效
- [ ] 包含日期/时间生效

---

### EXP-002: 导出为Markdown

**测试类型**: 功能测试
**优先级**: P0
**执行时间**: ~5秒

**前置条件**:
- 已创建并保存JD项目

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 点击"导出"按钮 | 导出选项菜单显示 |
| 2 | 选择"导出为Markdown" | 立即开始下载 |

**预期结果**:
- Markdown文件成功下载
- 文件名格式: `jd-[project-name]-[timestamp].md`
- Markdown格式:
  - 使用标准Markdown语法
  - 标题层级正确（#, ##, ###）
  - 列表格式正确（-, 1.）
  - 代码块正确（```）
  - 粗体斜体正确（**, _）
  - 链接格式正确（[]()）

**示例Markdown输出**:
```markdown
# Senior Software Engineer

## Position Overview
We are looking for an experienced...

## Requirements
- 5+ years of experience
- Proficiency in JavaScript
- Experience with React

## Benefits
- Competitive salary
- Remote work
```

**验证点**:
- [ ] 文件可打开
- [ ] Markdown语法正确
- [ ] 可以在GitHub/编辑器中正确渲染
- [ ] 特殊字符正确转义
- [ ] 链接格式正确

---

## 支付流程测试用例

### PAY-001: 查看定价页面

**测试类型**: 功能测试
**优先级**: P0
**执行时间**: ~30秒

**前置条件**:
- 可访问应用

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 点击"定价"链接 | 导航到定价页面 |
| 2 | 查看所有计划 | 显示所有订阅计划 |
| 3 | 鼠标悬停在计划上 | 高亮显示详情 |

**预期结果**:
- 显示所有计划（基础、专业、企业）
- 每个计划显示:
  - 计划名称
  - 月/年价格
  - 功能列表
  - 使用限制（JD数量、AI调用次数）
  - 特色功能高亮
- 推荐/热门标签显示在最佳计划上
- 显示年付优惠（如"节省20%"）
- "开始免费试用"按钮
- 常见问题（FAQ）部分
- 对比表格

**验证点**:
- [ ] 所有计划正确显示
- [ ] 价格准确
- [ ] 功能描述清晰
- [ ] 链接可点击
- [ ] 响应式布局
- [ ] 移动端显示正常

---

### PAY-003: Stripe支付成功

**测试类型**: 集成测试
**优先级**: P0
**执行时间**: ~2分钟

**前置条件**:
- 已登录
- 已选择订阅计划

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 选择订阅计划 | 显示支付页面 |
| 2.1 | 选项1: 使用测试卡号 | `4242 4242 4242 4242` |
| 2.2 | 输入有效期 | 12/34（任意未来日期） |
| 2.3 | 输入CVC | 123（任意3位数字） |
| 3.4 | 输入账单信息（可选） | 填写或跳过 |
| 4 | 点击"支付"按钮 | 开始处理支付 |
| 5 | 等待支付完成 | 显示成功页面 |

**Stripe测试卡号**:
```
成功支付: 4242 4242 4242 4242
需要验证: 4000 0025 0000 3155
卡被拒绝: 4000 0000 0000 0002
余额不足: 4000 0000 0000 9995
```

**预期结果**:
- 支付成功处理
- 显示成功页面
- 显示支付确认信息:
  - 订阅计划
  - 支付金额
  - 下次扣款日期
- 用户账户状态更新为"已订阅"
- 信用额度增加
- 发送确认邮件
- 订阅信息在"账户设置"中显示

**验证点**:
- [ ] Stripe会话创建成功
- [ ] Webhook正确处理
- [ ] 数据库更新正确
- [ ] 邮件发送成功
- [ ] 用户界面正确反映
- [ ] 信用额度正确增加
- [ ] 发票生成成功

**测试数据**:
```json
{
  "payment": {
    "amount": 29.99,
    "currency": "usd",
    "card": {
      "number": "4242424242424242",
      "expiry": "12/34",
      "cvc": "123"
    }
  }
}
```

---

### PAY-005: 支付失败处理

**测试类型**: 负面测试
**优先级**: P0
**执行时间**: ~1分钟

**前置条件**:
- 已登录
- 已选择订阅计划

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 输入拒绝的卡号: `4000 0000 0000 0002` | 卡号输入正常 |
| 2.1 | 输入有效期 | 12/34 |
| 2.2 | 输入CVC | 123 |
| 3 | 点击"支付"按钮 | 开始处理 |
| 4 | 等待响应 | 显示错误消息 |

**预期结果**:
- 支付被拒绝
- 显示友好的错误消息
- 不泄露敏感信息
- 提供解决方案建议:
  - "请检查卡信息"
  - "联系银行"
  - "使用其他支付方式"
- 用户保持在支付页面
- 表单数据保留（方便重试）
- 支付失败记录在数据库

**验证点**:
- [ ] 错误消息友好
- [ ] 不暴露系统信息
- [ ] 表单数据保留
- [ ] 可以重试
- [ ] 失败记录保存
- [ ] 无重复收费

**测试场景**:
- 卡被拒绝
- 余额不足
- 银行系统错误
- 网络超时
- 卡过期

---

## 模板库测试用例

### TPL-001: 浏览所有模板

**测试类型**: 功能测试
**优先级**: P0
**执行时间**: ~1分钟

**前置条件**:
- 已登录

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 点击"模板库"链接 | 导航到模板库页面 |
| 2.1 | 查看模板卡片 | 显示模板信息 |
| 2.2 | 滚动加载更多 | 动态加载更多模板 |
| 3.3 | 鼠标悬停在模板上 | 显示快速预览 |

**预期结果**:
- 显示模板卡片网格
- 每个模板卡片显示:
  - 模板缩略图
  - 模板名称
  - 分类标签
  - 使用次数
  - 评分
  - "使用"按钮
- 分页或无限滚动
- 筛选选项:
  - 按分类
  - 按行业
  - 按难度
  - 按评分
- 排序选项:
  - 最新
  - 最受欢迎
  - 评分最高

**验证点**:
- [ ] 所有模板加载
- [ ] 缩略图正确显示
- [ ] 信息准确
- [ ] 筛选正常工作
- [ ] 排序正常工作
- [ ] 分页正常
- [ ] 性能良好
- [ ] 响应式布局

---

### TPL-006: 使用付费模板

**测试类型**: 功能测试
**优先级**: P1
**执行时间**: ~1分钟

**前置条件**:
- 已登录
- 未订阅付费计划

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 找到付费模板 | 模板显示"付费"标签 |
| 2 | 点击"使用"按钮 | 显示升级提示 |
| 3.1 | 选项1: 点击"升级" | 导航到定价页面 |
| 3.2 | 选项2: 点击取消 | 返回模板库 |

**预期结果**:
- 付费模板显示特殊标签
- 点击"使用"显示升级提示:
  - "此模板需要专业版或更高"
  - 显示模板价格（如单独购买）
  - "升级账户"按钮
  - "取消"按钮
- 未订阅用户无法使用
- 提示清晰友好

**验证点**:
- [ ] 付费标签明显
- [ ] 升级提示清晰
- [ ] 按钮功能正常
- [ ] 导航正确
- [ ] 无漏洞可绕过

**测试场景**:
- 免费用户尝试使用
- 专业版用户使用专业模板
- 企业版用户使用所有模板

---

## AI服务测试用例

### AI-SER-001: JD分析响应时间

**测试类型**: 性能测试
**优先级**: P0
**执行时间**: ~5分钟

**前置条件**:
- 已配置AI服务
- 测试JD内容准备

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1 | 发送分析请求 | 开始计时 |
| 2.1 | 短JD（< 500字符） | < 5秒 |
| 2.2 | 中等JD（500-2000字符） | < 10秒 |
| 2.3 | 长JD（> 2000字符） | < 20秒 |
| 3 | 记录响应时间 | 结果汇总 |

**预期结果**:
- 所有测试响应时间在预期范围内
- P95响应时间 < 15秒
- P99响应时间 < 30秒
- 没有超时错误
- 结果质量一致

**验证点**:
- [ ] 响应时间达标
- [ ] 没有超时
- [ ] 结果准确性不受影响
- [ ] 并发处理正常

**性能基准**:
| JD长度 | 目标响应时间 | 最大可接受 |
|--------|------------|-----------|
| 短JD | < 5秒 | < 10秒 |
| 中等JD | < 10秒 | < 20秒 |
| 长JD | < 20秒 | < 40秒 |

---

### AI-SER-002: AI服务错误处理

**测试类型**: 集成测试
**优先级**: P0
**执行时间**: ~3分钟

**前置条件**:
- 已配置AI服务
- 可以模拟错误

**测试步骤**:

| 步骤 | 操作 | 预期结果 |
|------|------|---------|
| 1.1 | 场景1: 模拟API超时 | 显示友好错误 |
| 1.2 | 场景2: 模拟网络错误 | 显示友好错误 |
| 1.3 | 场景3: 模拟速率限制 | 显示友好错误 |
| 1.4 | 场景4: 模拟服务不可用 | 显示友好错误 |
| 2 | 验证错误日志 | 错误被正确记录 |

**预期结果**:
- 所有错误场景都显示友好错误消息
- 错误消息:
  - 不暴露技术细节
  - 提供下一步操作建议
  - 提供联系支持选项
- 错误被正确记录到日志
- 没有应用崩溃
- 可以重试操作

**错误消息示例**:
```
❌ 分析失败

抱歉，我们遇到了一些问题。请稍后重试。

[重试] [联系支持]
```

**验证点**:
- [ ] 错误消息友好
- [ ] 不暴露系统信息
- [ ] 重试功能正常
- [ ] 错误日志记录
- [ ] 监控告警触发

---

## API端点测试用例

### API-001: POST /api/auth/register

**测试类型**: API测试
**优先级**: P0
**执行时间**: ~1分钟

**测试数据**:

**请求**:
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "test+api001@example.com",
  "password": "SecurePass123!",
  "name": "API Test User"
}
```

**预期响应**:
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": "usr_123456",
    "email": "test+api001@example.com",
    "name": "API Test User",
    "role": "user",
    "status": "pending_verification",
    "createdAt": "2026-02-09T10:00:00Z"
  },
  "message": "Registration successful. Please check your email for verification."
}
```

**测试场景**:

| 场景 | 请求数据 | 预期响应 |
|------|---------|---------|
| 成功注册 | 有效数据 | 201 Created |
| 无效邮箱格式 | `{"email": "invalid", ...}` | 400 Bad Request |
| 弱密码 | `{"password": "123", ...}` | 400 Bad Request |
| 重复邮箱 | 已存在的邮箱 | 409 Conflict |
| 缺少字段 | `{"email": "test@example.com"}` | 400 Bad Request |

**验证点**:
- [ ] 响应状态码正确
- [ ] 响应格式正确
- [ ] 数据验证
- [ ] 密码加密存储
- [ ] 默认角色分配
- [ ] 验证邮件发送
- [ ] 错误处理

---

### API-002: POST /api/jd

**测试类型**: API测试
**优先级**: P0
**执行时间**: ~1分钟

**测试数据**:

**请求**:
```http
POST /api/jd
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "Senior Software Engineer",
  "content": "We are looking for an experienced software engineer...",
  "templateId": "tpl_12345",
  "tags": ["software", "engineer", "remote"]
}
```

**预期响应**:
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": "jd_123456",
    "title": "Senior Software Engineer",
    "content": "We are looking for an experienced software engineer...",
    "status": "draft",
    "userId": "usr_123456",
    "templateId": "tpl_12345",
    "tags": ["software", "engineer", "remote"],
    "version": 1,
    "createdAt": "2026-02-09T10:00:00Z",
    "updatedAt": "2026-02-09T10:00:00Z"
  }
}
```

**测试场景**:

| 场景 | 测试 | 预期响应 |
|------|------|---------|
| 未认证 | 无Authorization头 | 401 Unauthorized |
| 认证成功 | 有效token | 201 Created |
| 缺少标题 | `{"content": "..."}` | 400 Bad Request |
| 缺少内容 | `{"title": "..."}` | 400 Bad Request |
| 长标题 | 标题 > 100字符 | 400 Bad Request |
| 无效用户ID | 伪造token | 401 Unauthorized |

**验证点**:
- [ ] 认证验证
- [ ] 数据验证
- [ ] 外键约束
- [ ] 版本号初始化
- [ ] 时间戳设置
- [ ] 权限检查
- [ ] 错误处理

---

## 自动化测试脚本示例

### Playwright E2E测试示例

```typescript
// tests/e2e/jd-creation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('JD Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'TestPass123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should create and optimize a JD', async ({ page }) => {
    // 导航到JD生成器
    await page.click('text=Create New JD')
    await page.waitForURL('/generator/new')

    // 输入JD内容
    const sampleJD = `
Job Title: Senior Software Engineer

We are looking for an experienced software engineer to join our team.

Requirements:
- 5+ years of experience
- Proficiency in JavaScript
- Experience with React
    `.trim()

    await page.fill('textarea[name="content"]', sampleJD)

    // 点击分析
    await page.click('button:has-text("Analyze")')
    await expect(page.locator('.loading-spinner')).toBeVisible()

    // 等待分析完成
    await expect(page.locator('.analysis-results')).toBeVisible({ timeout: 30000 })

    // 验证分析结果
    await expect(page.locator('text=Skills')).toBeVisible()
    await expect(page.locator('text=Requirements')).toBeVisible()
    await expect(page.locator('text=Experience')).toBeVisible()

    // 点击优化
    await page.click('button:has-text("Optimize")')
    await expect(page.locator('.loading-spinner')).toBeVisible()

    // 等待优化完成
    await expect(page.locator('.optimized-content')).toBeVisible({ timeout: 30000 })

    // 保存项目
    await page.fill('[name="title"]', 'Senior Developer Position')
    await page.click('button:has-text("Save")')

    // 验证保存成功
    await expect(page.locator('.toast:has-text("Saved successfully")')).toBeVisible()

    // 导出PDF
    await page.click('button:has-text("Export")')
    await page.click('button:has-text("Export as PDF")')

    // 验证下载
    const downloadPromise = page.waitForEvent('download')
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/jd-.*\.pdf$/)
  })

  test('should handle analysis errors gracefully', async ({ page }) => {
    await page.goto('/generator/new')

    // 输入短内容
    await page.fill('textarea[name="content"]', 'Short JD')

    // 点击分析
    await page.click('button:has-text("Analyze")')

    // 验证错误消息
    await expect(page.locator('.error-message')).toBeVisible()
    await expect(page.locator('text=content is too short')).toBeVisible()
  })
})
```

---

## 总结

本文档提供了JD Optimizer项目的详细测试用例，包括：

- **功能测试用例**: 47个测试用例覆盖所有核心功能
- **集成测试用例**: API端点、第三方服务集成
- **E2E测试用例**: 完整用户旅程验证
- **自动化脚本示例**: Playwright E2E测试

所有测试用例都包含：
- 明确的前置条件
- 详细的测试步骤
- 清晰的预期结果
- 完整的验证点
- 测试数据示例

这些测试用例可以用于：
- 手动测试执行
- 自动化测试开发
- 测试覆盖率评估
- 质量保证流程

---

**维护说明**: 请根据项目进展定期更新此文档，添加新的测试用例，修改现有用例以反映功能变化。
