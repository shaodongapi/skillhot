# SkillHot

> 发现适合你的 Agent Skills —— 从 1500+ GitHub 项目中筛选、分类、排序，让「找 Skill」不再比「用 Skill」还累。

SkillHot 聚合 Claude Code / Cursor / Cline / OpenCode / Windsurf 等生态的 Skills、插件、Agent 仓库，做中文翻译、分类、热度排序，帮你 3 秒判断一个项目要不要深入。

🔗 线上：https://skillhot.dev

## 核心特性

- **三档榜单** —— 综合热度（stars + 提交频率 + 增长）、纯 Stars 榜、最近更新榜
- **14 个分类** —— UI 设计、编程开发、办公效率、内容创作、数据分析、AI/ML、DevOps、安全、自动化、文档、媒体、研究、产品管理、其他
- **话题维度** —— 从 GitHub topics 聚合的网状分类，跨领域也能串起来
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
  ranking/          榜单页（三档排序）
  categories/ topics/ collections/  发现入口
components/
  skill/            SkillDetailProvider + Drawer（核心交互模式）
  ui/               shadcn/ui 组件
data/
  skills.json       唯一数据源（构建时被 import）
  sources.json      抓取源配置
  categories.ts     14 分类 + 5 平台定义
  collections.ts    手工维护的精选合集
lib/
  data.ts           所有数据查询函数（getSkillById / sortBy / searchSkills ...）
  types.ts          Skill / Category / Platform 类型
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

## 相关文档

- [`CLAUDE.md`](./CLAUDE.md) —— 给 Claude Code 的代码库导览（架构、约定、命令）
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) —— Vercel + GitHub Actions 上线步骤
- [`SkillHot-开发方案.md`](./SkillHot-开发方案.md) —— 最初的设计与决策记录
