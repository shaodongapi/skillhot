import type { Category, Platform } from '@/lib/types';

export const categories: Category[] = [
  { id: 'ui-design',  name: 'UI 设计',       slug: 'ui-design',  description: '界面、组件、设计系统、Figma 集成相关', icon: '🎨', colorClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20', accentClass: 'bg-rose-500', gradientClass: 'from-rose-500 to-pink-500' },
  { id: 'coding',     name: '编程开发',      slug: 'coding',     description: '代码生成、重构、测试、代码审查',       icon: '💻', colorClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20', accentClass: 'bg-blue-500', gradientClass: 'from-blue-500 to-cyan-500' },
  { id: 'office',     name: '办公效率',      slug: 'office',     description: '文档处理、邮件、日程、表格自动化',     icon: '📊', colorClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20', accentClass: 'bg-emerald-500', gradientClass: 'from-emerald-500 to-teal-500' },
  { id: 'content',    name: '内容创作',      slug: 'content',    description: '写作、文案、博客、视频脚本',           icon: '✍️', colorClass: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20', accentClass: 'bg-orange-500', gradientClass: 'from-orange-500 to-red-500' },
  { id: 'data',       name: '数据分析',      slug: 'data',       description: '数据清洗、可视化、报表、SQL',          icon: '📈', colorClass: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20', accentClass: 'bg-cyan-500', gradientClass: 'from-cyan-500 to-sky-500' },
  { id: 'ai-ml',      name: 'AI/机器学习',   slug: 'ai-ml',      description: '模型训练、Prompt 工程、Agent 框架',    icon: '🧠', colorClass: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20', accentClass: 'bg-violet-500', gradientClass: 'from-violet-500 to-purple-500' },
  { id: 'devops',     name: 'DevOps 运维',   slug: 'devops',     description: '部署、CI/CD、监控、容器编排',          icon: '🚀', colorClass: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20', accentClass: 'bg-indigo-500', gradientClass: 'from-indigo-500 to-blue-500' },
  { id: 'security',   name: '安全测试',      slug: 'security',   description: '漏洞扫描、渗透测试、代码审计',         icon: '🔒', colorClass: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20', accentClass: 'bg-red-500', gradientClass: 'from-red-500 to-rose-500' },
  { id: 'automation', name: '自动化工作流',  slug: 'automation', description: '浏览器自动化、RPA、批处理任务',        icon: '⚙️', colorClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20', accentClass: 'bg-amber-500', gradientClass: 'from-amber-500 to-orange-500' },
  { id: 'docs',       name: '文档写作',      slug: 'docs',       description: '技术文档、API 文档、知识库',           icon: '📚', colorClass: 'bg-stone-500/10 text-stone-700 dark:text-stone-300 border-stone-500/20', accentClass: 'bg-stone-500', gradientClass: 'from-slate-500 to-blue-600' },
  { id: 'media',      name: '媒体处理',      slug: 'media',      description: '图片/音频/视频生成与编辑',             icon: '🎬', colorClass: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/20', accentClass: 'bg-fuchsia-500', gradientClass: 'from-fuchsia-500 to-pink-500' },
  { id: 'research',   name: '学习研究',      slug: 'research',   description: '论文阅读、知识整理、笔记',             icon: '🔬', colorClass: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20', accentClass: 'bg-teal-500', gradientClass: 'from-teal-500 to-emerald-500' },
  { id: 'product',    name: '产品/项目管理', slug: 'product',    description: '需求管理、原型、团队协作',             icon: '📋', colorClass: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20', accentClass: 'bg-yellow-500', gradientClass: 'from-yellow-500 to-amber-500' },
  { id: 'misc',       name: '其他',          slug: 'misc',       description: '不好归类但值得一看的项目',             icon: '✨', colorClass: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20', accentClass: 'bg-slate-500', gradientClass: 'from-zinc-500 to-slate-600' },
];

export const categoryMap: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c])
);

export const platforms: Platform[] = [
  { id: 'claude-code', name: 'Claude Code', color: 'bg-orange-100 text-orange-700' },
  { id: 'opencode',    name: 'OpenCode',    color: 'bg-purple-100 text-purple-700' },
  { id: 'cline',       name: 'Cline',       color: 'bg-blue-100 text-blue-700' },
  { id: 'cursor',      name: 'Cursor',      color: 'bg-emerald-100 text-emerald-700' },
  { id: 'windsurf',    name: 'Windsurf',    color: 'bg-cyan-100 text-cyan-700' },
];

export const platformMap: Record<string, Platform> = Object.fromEntries(
  platforms.map((p) => [p.id, p])
);
