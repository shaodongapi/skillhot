# SkillHot

> 发现 Agent Skills —— Claude Code · Cursor · Cline · OpenCode · Windsurf 生态的 Skills / 插件 / Agent 仓库，按场景分类、热度排序，附中文简介与安装命令，每日同步 GitHub。

SkillHot 把散落在各个 awesome-list 里的 Agent Skills 聚合起来，做中文翻译、分类、热度评分，帮你 3 秒判断一个项目要不要深入。

🔗 线上：<替换为你的部署地址>

## 核心特性

- **三档榜单** —— 综合热度（stars + 提交频率 + 增长）、纯 Stars 榜、最近更新榜；Top 3 领奖台 + 紧凑列表
- **14 个分类** —— UI 设计、编程开发、办公效率、内容创作、数据分析、AI/ML、DevOps、安全、自动化、文档、媒体、研究、产品管理、其他；每类独立色相 + SVG 图标
- **话题维度** —— 从 GitHub topics 聚合的网状分类，400+ 话题各自哈希出稳定色相，跨领域也能串起来
- **精选合集** —— 编辑挑选的相关 Skill 包（如「Anthropic 官方 Skills」「前端生产力」）
- **详情抽屉** —— 不跳页面，URL 同步、可分享、可浏览器后退
- **中文简介** —— 自动翻译 + 已收录项的翻译缓存
- **一键安装** —— 自动识别 README 里的 `npm install` / `claude skill add` 等命令
- **收藏夹** —— localStorage 本地存储，无需登录
- **SEO 友好** —— 每个 Skill 一个静态落地页 + JSON-LD + sitemap

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js 14（App Router）+ TypeScript |
| 样式 | Tailwind CSS + shadcn/ui（Radix 原语） |
| 数据抓取 | Octokit（GitHub REST API） |
| 翻译 | DeepSeek（OpenAI 兼容协议） |
| 部署 | Vercel + GitHub Actions 每日自动同步 |

## Quick Start

```bash
git clone <repo-url>
cd skillhot
npm install
npm run dev
```

打开 http://localhost:3000。

> 站点本身不依赖任何环境变量即可启动 —— 数据已经在 `data/skills.json` 里。环境变量只在跑同步/翻译脚本时需要。

## 数据同步（项目特色）

数据更新是离线流水线，不依赖运行时数据库：

```
data/sources.json          抓取源（awesome-lists + 单独 repo）
      ↓ npm run sync       Octokit 拉元数据 + 解析 README + 分类 + 评分
data/skills.json           唯一数据源
      ↓ npm run translate  DeepSeek 补中文简介
      ↓ git commit & push  → Vercel 自动重建
```

本地跑一次同步：

```bash
cp .env.example .env.local
# 填入 GITHUB_TOKEN（可选，提升 API 限额到 5000/h）和 DEEPSEEK_API_KEY（翻译必填）

npm run sync               # 全量同步
npm run sync -- --limit 20 # 限制条数调试
npm run translate          # 翻译待译项
npm run translate -- --force  # 强制重译
```

GitHub Actions 每天 UTC 00:00（北京时间 08:00）自动跑这条流水线，把更新 commit 回仓库。

## 项目结构

```
app/                Next.js App Router 路由
  skill/[...id]/    每个 Skill 的静态 SEO 落地页
  ranking/          榜单页（三档排序 + 领奖台 + sticky 控件）
  categories/ topics/ collections/  发现入口
components/
  skill/            SkillDetailProvider + Drawer（核心交互模式）
    SkillCard / SkillRow / FeatureCard  三档密度卡片
  home/             HeroSearch / CategoryGrid / TrendingList
  collection/       CollectionCard
  layout/           Header / HeaderSearch / Footer
  ui/               shadcn/ui 组件
data/
  skills.json       唯一数据源（构建时被 import）
  sources.json      抓取源配置
  categories.ts     14 分类 + 5 平台定义（含 colorClass / gradientClass）
  collections.ts    手工维护的精选合集
lib/
  data.ts           所有数据查询函数（getSkillById / sortBy / searchSkills ...）
  types.ts          Skill / Category / Platform 类型
  topic-color.ts    话题哈希配色（topicHue / topicCssVars / topicGradientStyle）
  category-icons.tsx  14 分类 → lucide 图标静态映射
  favorites.ts      localStorage 收藏
  sync/             抓取管线（github / parser / classifier / platform / score / translate）
scripts/
  sync-skills.ts    npm run sync
  translate.ts      npm run translate
```

更深入的架构、约定和命令说明见 [`CLAUDE.md`](./CLAUDE.md)。

## 部署

Vercel + GitHub Actions，完整步骤见 [`DEPLOYMENT.md`](./DEPLOYMENT.md)。Actions secrets 需要：

- `GH_PAT` —— commit 回仓库（Contents: write 权限）
- `DEEPSEEK_API_KEY` —— 翻译用
- `VERCEL_DEPLOY_HOOK`（可选）—— 同步后自动触发 Vercel 重建

> 安全提示：所有密钥只放在 GitHub Secrets / Vercel 环境变量 / 本地 `.env.local`，不要写入代码或提交到仓库。

## 数据源

本站从以下 awesome-list 和官方仓库聚合数据（配置在 `data/sources.json`）：

- [anthropics/skills](https://github.com/anthropics/skills)（官方）
- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- [hikarulight/awesome-claude-skills](https://github.com/hikarulight/awesome-claude-skills)
- [korbinzhao/awesome-claude-skills](https://github.com/korbinzhao/awesome-claude-skills)
- [wong2/awesome-claude-code](https://github.com/wong2/awesome-claude-code)
- [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
- [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
- 以及更多，详见 `data/sources.json`

所有 Skill 的元数据、stars、提交记录归原项目作者所有，本站仅做发现和索引。

## 版本历史

### v0.2.0 — UI 重构 + 色彩系统（2026-07）

参考 Product Hunt × GitHub Trending 重做整站视觉，从「平铺一片」改为节奏清晰、视觉分级。

**视觉地基**
- 14 个分类全部从 emoji 切到统一描边 SVG（lucide），新增 `lib/category-icons.tsx` 静态映射
- `Category` 类型扩展 `colorClass / accentClass / gradientClass`，14 色等分色环，每类独立色相
- 修复 `tailwind.config.ts` content glob 未包含 `data/**`，导致 `gradientClass` JIT 不生成的问题

**卡片分级**
- 新增 `SkillRow`（紧凑横向 row，榜单/搜索用）
- 新增 `FeatureCard`（宽版 carousel 卡片，首页新发现用）
- `SkillCard` 接口零改动，仅 refine 外观（左侧 accent 条、渐变星标），8 处调用方零迁移

**首页 5 区块**
- Hero：标题渐变文字 + mesh gradient 装饰 + **搜索框**（cmd+K 聚焦）+ 数据条
- 本周新发现：横向 carousel（FeatureCard）
- 精选合集：横向 carousel（CollectionCard）
- 热门精选 Top 10：GitHub Trending 风格纵向 SkillRow 列表
- 分类入口：14 tile 网格，渐变背景 + 玻璃图标块

**榜单页**
- 控件区 `sticky top-14` 贴在 Header 下
- Top 3 领奖台（金/银/铜色调）+ 剩余紧凑列表
- 新增「随机翻一个」入口

**Header**
- 桌面端 nav 与右侧 icon 之间插入搜索框
- Logo 块改为渐变色，"Hot" 文字渐变剪切

**话题模块**
- 新增 `lib/topic-color.ts`：`topicHue` 字符串哈希出 0-360 hue
- 400+ 话题每个都有稳定独特色相，无需手工指定
- 用 CSS variable + Tailwind arbitrary value 模式（`bg-[hsl(var(--topic-hue)_70%_50%_/_0.15)]`）渲染，避免动态拼接类名

**合集卡片**
- 封面色块（按 collection id 哈希取 hue）+ curator 首字母头像 + 项目数徽章
- 与 SkillCard 视觉强区分

### v0.1.0 — MVP（2026-06）

首个可用版本，跑通数据流水线 + 完整发现站。

- **数据同步管线**：Octokit 抓 GitHub 元数据 + 解析 README + 自动分类 + 热度评分，每日 UTC 00:00 自动跑
- **14 个分类 + 5 个兼容平台**：Claude Code / Cursor / Cline / OpenCode / Windsurf
- **三档榜单**：综合热度 / Stars / 最近更新
- **中文翻译**：DeepSeek 自动翻译 description，已翻译项缓存避免重复请求
- **详情抽屉**：URL 同步 `?skill=owner/repo`，支持分享、浏览器后退
- **收藏夹**：localStorage 本地存储
- **SSG + SEO**：`/skill/[...id]` 全静态生成（`dynamicParams=false`），JSON-LD + sitemap + Open Graph
- **一键安装**：自动识别 README 里的安装命令

## 相关文档

- [`CLAUDE.md`](./CLAUDE.md) —— 给 Claude Code 的代码库导览（架构、约定、命令）
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) —— Vercel + GitHub Actions 上线步骤
- [`SkillHot-开发方案.md`](./SkillHot-开发方案.md) —— 最初的设计与决策记录
