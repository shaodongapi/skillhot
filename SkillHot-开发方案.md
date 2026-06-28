# SkillHot 开发方案

> **定位**：发现适合你的 Agent Skills
> **核心价值**：从 1500+ GitHub 项目中筛选、分类、排序，让"找 Skill"不再比"用 Skill"还累

---

## 一、技术栈

| 层 | 选型 | 理由 |
|---|---|---|
| 框架 | **Next.js 14 (App Router) + TypeScript** | SSG/ISR 混合渲染，SEO 友好，Vercel 一键部署 |
| 样式 | **Tailwind CSS + shadcn/ui** | 组件库轻量、可定制，Sheet/Drawer 开箱即用 |
| 数据获取 | **Octokit (GitHub REST API)** | 抓 awesome-list 仓库目录树 + 单仓库元数据 |
| 搜索 | **FlexSearch**（前端索引） | MVP 阶段足够，无外部依赖 |
| 收藏 | **localStorage（MVP）→ NextAuth + 数据库（后期）** | 先无后端跑通 |
| 自动同步 | **GitHub Actions cron（每日）** | 定时拉数据生成 JSON，提交回仓库触发重新部署 |
| 部署 | **Vercel** | 与 Next.js 原生集成 |

---

## 二、数据模型

```typescript
interface Skill {
  id: string                 // "owner/repo"
  name: string
  description: string        // GitHub 原文（多为英文）
  descriptionZh: string|null // 中文简介（LLM 翻译）
  stars: number
  forks: number
  topics: string[]
  language: string|null
  category: Category         // 14 类之一
  platforms: Platform[]      // claude-code | opencode | cline | cursor ...
  useCases: string[]
  installCmd: string|null    // 一键复制的安装命令
  lastCommit: string         // ISO，用于「最近更新」
  commits30d: number         // 近 30 天提交，参与热度计算
  starGrowth30d: number      // 近 30 天 star 增长
  popularityScore: number    // 综合热度（构建时算好）
  firstSeen: string          // 首次收录日期（用于「本周新发现」）
  featured: boolean
}

type Category =
  | 'ui-design'         // UI 设计
  | 'coding'            // 编程开发
  | 'office'            // 办公效率
  | 'content'           // 内容创作
  | 'data'              // 数据分析
  | 'ai-ml'             // AI/机器学习
  | 'devops'            // DevOps 运维
  | 'security'          // 安全测试
  | 'automation'        // 自动化工作流
  | 'docs'              // 文档写作
  | 'media'             // 媒体处理（图/音/视）
  | 'research'          // 学习研究
  | 'product'           // 产品/项目管理
  | 'misc';             // 其他

type Platform = 'claude-code' | 'opencode' | 'cline' | 'cursor' | 'windsurf';

interface Topic {
  id: string
  name: string         // 如 'agent-skills'
  displayName: string  // 如 'Agent Skills'
  count: number
}

interface Collection {
  id: string
  title: string        // 如「Anthropic 官方 Skills」
  description: string
  curator: string
  repoUrl: string      // 源 awesome-list
  skillIds: string[]
}
```

---

## 三、14 个分类

> 用户已确认 5 个：UI 设计 · 编程开发 · 办公效率 · 内容创作 · 数据分析
> 补全另外 9 个（可调整）：

| # | 分类 | 说明 |
|---|---|---|
| 1 | UI 设计 | 界面、组件、设计系统、Figma 集成 |
| 2 | 编程开发 | 代码生成、重构、测试、代码审查 |
| 3 | 办公效率 | 文档处理、邮件、日程、表格 |
| 4 | 内容创作 | 写作、文案、博客、脚本 |
| 5 | 数据分析 | 数据清洗、可视化、报表、SQL |
| 6 | AI/机器学习 | 模型训练、Prompt 工程、Agent 框架 |
| 7 | DevOps 运维 | 部署、CI/CD、监控、容器 |
| 8 | 安全测试 | 漏洞扫描、渗透测试、代码审计 |
| 9 | 自动化工作流 | 浏览器自动化、RPA、批处理 |
| 10 | 文档写作 | 技术文档、API 文档、知识库 |
| 11 | 媒体处理 | 图片/音频/视频生成与编辑 |
| 12 | 学习研究 | 论文阅读、知识整理、笔记 |
| 13 | 产品/项目管理 | 需求管理、原型、协作 |
| 14 | 其他 | 不好归类但有趣的项目 |

---

## 四、页面结构与路由

```
/                       发现页（Hero 统计 + 本周新发现 + 精选合集 + 随机漫游）
/ranking                榜单页（三档排序 + 分类筛选）
/categories             14 分类总览（带项目数 + 介绍）
/categories/[slug]      分类详情
/topics                 100+ 话题（基于 GitHub topics）
/topics/[slug]          话题详情
/collections            精选合集
/skill/[id]             Skill 独立页（SEO 落地，详情内容也通过 Drawer 展示）
/favorites              我的收藏
/search?q=              搜索结果
```

---

## 五、四个核心模块的实现思路

### 1. 发现页

- **Hero 区**：`总仓库数 / 分类数 / 最近同步时间`（构建时注入）
- **本周新发现**：`firstSeen >= now - 7d`，按 stars 降序
  - 卡片元素：分类、Stars、今日更新小标签、活跃度
- **精选技能合集**：维护 `collections.json`，收录官方/大神的 awesome-list
- **随机漫游**：客户端从全量数据 `Math.random` 抽 8 个，点「换一批」重新抽

### 2. 榜单页（三种排序）

- **综合热度**（自定义权重）：
  ```text
  score = stars × 1.0
        + commits30d × 5
        + starGrowth30d × 2
        + (有安装命令 ? 50 : 0)
        − (lastCommit 超 180 天 ? 200 : 0)
  ```
  > 反映"现在真的有人在用、还在持续迭代"
- **Stars 榜**：纯人气榜，按 `stars` 排
- **最近更新**：按 `lastCommit` 排，挖"低 Stars 但活跃"的宝藏
- 每个分类有独立子榜单（顶部分类 tab + 左侧分类侧边栏）

### 3. 详情 Drawer（核心交互）

- shadcn/ui 的 `Sheet` 组件，从右侧滑出
- URL 同步 `?skill=owner/repo`，支持分享/浏览器后退
- 内容区：
  - 中文项目简介（翻译）
  - 作者原始描述（英文原文）
  - 兼容平台标签（Claude Code / OpenCode / Cline ...）
  - 适用场景
  - 安装命令（一键复制）
  - GitHub 跳转按钮
  - 相关推荐
- **关键**：不开新页、不跳 GitHub，3 秒内判断要不要深入

### 4. 话题页

- 数据源：抓取时收集所有 `topics` 字段，按出现频次取 Top 100
- 每个 topic 关联其出现的所有 skill
- 提供"另一种找东西的维度"——分类是树状的，话题是网状的
- 跨领域的好东西在分类里可能翻不到，但顺着话题能串起来

### 5. 收藏功能

- **MVP**：localStorage，无需登录
- **后期**：NextAuth + GitHub OAuth + 数据库（Postgres/Supabase）
- 收藏夹页面集中查看已收藏的 Skill

---

## 六、数据同步策略

### 抓取源（初期维护 `sources.json`）

- `anthropics/skills`（官方）
- `hesreallyhim/awesome-claude-code`
- `korbinzhao/awesome-claude-skills`
- `wong2/awesome-claude-code`
- `hikarulight/awesome-claude-skills`
- 其他 awesome-list

### 同步流程

```text
GitHub Actions cron (每日 0 点 UTC)
   ↓
解析 awesome-list 仓库目录树
   ↓
对每个 repo 调 GitHub API 拉元数据（stars/topics/lastCommit/...）
   ↓
计算 commits30d / starGrowth30d / popularityScore
   ↓
调用 Claude API 翻译 description → descriptionZh（带缓存）
   ↓
写入 data/skills.json + data/topics.json + data/collections.json
   ↓
git commit & push → Vercel 自动重新部署
```

### 限速处理

- GitHub REST API：5000 req/h（带 token），用 ETag 缓存可翻倍
- 翻译 API：对 description 做内容 hash 缓存，避免重复翻译

---

## 七、分阶段开发计划

| 阶段 | 范围 | 预计 |
|---|---|---|
| **Phase 1 · MVP** | 项目脚手架 + 数据模型 + 30 条种子数据 + 发现页（Hero/本周新发现/随机漫游）+ 详情 Drawer + 14 分类骨架 | 1-2 天 |
| **Phase 2** | 榜单页（三种排序）+ 话题页 + 精选合集 + 收藏（localStorage） | 2-3 天 |
| **Phase 3** | GitHub Actions 自动同步 + 中文翻译 + 搜索 + SEO（独立 Skill 页） | 3-4 天 |
| **Phase 4** | 登录系统（NextAuth）+ 后台管理 + 性能优化 | 按需 |

---

## 八、待确认的决策点

1. **14 个分类**是否按上表定稿？或你想自己调整剩下 9 个？
2. **平台标签**默认做 `Claude Code / OpenCode / Cline / Cursor / Windsurf` 五个，是否增减？
3. **MVP 范围**：先按 Phase 1 跑通，还是一口气把 Phase 1 + Phase 2 都做了？
4. **种子数据**：MVP 阶段先手工挑 30 条高质量 Skill 入库，还是直接上 GitHub 抓取逻辑？

---

## 九、风险与注意事项

| 风险 | 缓解策略 |
|---|---|
| **中文翻译质量** | LLM 翻译 + 人工抽检；后续可开放社区 PR |
| **自动分类不准** | 规则匹配（keywords/topics）+ 人工兜底；提供"建议分类"功能 |
| **GitHub API 限速** | Token + ETag 缓存 + 错峰抓取 |
| **重复 Skill** | 按 repo URL 去重；同一项目多个 awesome-list 引用只算一条 |
| **死链 / 归档项目** | 同步时检查 archived 字段，自动标记下架 |
