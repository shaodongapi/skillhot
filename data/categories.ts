import type { Category, Platform } from '@/lib/types';

export const categories: Category[] = [
  { id: 'ui-design',  name: 'UI 设计',       slug: 'ui-design',  description: '界面、组件、设计系统、Figma 集成相关', icon: '🎨' },
  { id: 'coding',     name: '编程开发',      slug: 'coding',     description: '代码生成、重构、测试、代码审查',     icon: '💻' },
  { id: 'office',     name: '办公效率',      slug: 'office',     description: '文档处理、邮件、日程、表格自动化',   icon: '📊' },
  { id: 'content',    name: '内容创作',      slug: 'content',    description: '写作、文案、博客、视频脚本',         icon: '✍️' },
  { id: 'data',       name: '数据分析',      slug: 'data',       description: '数据清洗、可视化、报表、SQL',        icon: '📈' },
  { id: 'ai-ml',      name: 'AI/机器学习',   slug: 'ai-ml',      description: '模型训练、Prompt 工程、Agent 框架',  icon: '🧠' },
  { id: 'devops',     name: 'DevOps 运维',  slug: 'devops',     description: '部署、CI/CD、监控、容器编排',        icon: '🚀' },
  { id: 'security',   name: '安全测试',      slug: 'security',   description: '漏洞扫描、渗透测试、代码审计',       icon: '🔒' },
  { id: 'automation', name: '自动化工作流',  slug: 'automation', description: '浏览器自动化、RPA、批处理任务',      icon: '⚙️' },
  { id: 'docs',       name: '文档写作',      slug: 'docs',       description: '技术文档、API 文档、知识库',         icon: '📚' },
  { id: 'media',      name: '媒体处理',      slug: 'media',      description: '图片/音频/视频生成与编辑',           icon: '🎬' },
  { id: 'research',   name: '学习研究',      slug: 'research',   description: '论文阅读、知识整理、笔记',           icon: '🔬' },
  { id: 'product',    name: '产品/项目管理', slug: 'product',    description: '需求管理、原型、团队协作',           icon: '📋' },
  { id: 'misc',       name: '其他',          slug: 'misc',       description: '不好归类但值得一看的项目',           icon: '✨' },
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
