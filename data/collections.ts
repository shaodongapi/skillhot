import type { Collection } from '@/lib/types';

export const collections: Collection[] = [
  {
    id: 'anthropic-official',
    title: 'Anthropic 官方 Skills',
    description: 'Anthropic 官方维护的生产级 Skills 集合，是 SKILL.md 规范的最佳范本。',
    curator: 'Anthropic',
    repoUrl: 'https://github.com/anthropics/skills',
    skillIds: ['anthropics/skills'],
  },
  {
    id: 'getting-started',
    title: '新手入门精选',
    description: '刚接触 Claude Code 生态必看的 5 个项目，从工具到 agents 一网打尽。',
    curator: 'SkillHot 编辑组',
    repoUrl: 'https://github.com/hesreallyhim/awesome-claude-code',
    skillIds: [
      'anthropics/skills',
      'obra/superpowers',
      'wshobson/agents',
      'hesreallyhim/awesome-claude-code',
      'davila7/claude-code-templates',
    ],
  },
  {
    id: 'frontend-productivity',
    title: '前端生产力',
    description: '前端工程师从设计稿到组件全自动产出，shadcn / Figma / 手绘图全覆盖。',
    curator: 'SkillHot 编辑组',
    repoUrl: '',
    skillIds: [
      'RakerZ/shadcn-ui-builder',
      'figma-fetcher/design-skill',
      'RakerZ/perfect-freehand-skill',
    ],
  },
  {
    id: 'devops-essentials',
    title: 'DevOps 必备',
    description: '把部署、CI/CD、安全审计交给 Claude，运维同学的每日工具箱。',
    curator: 'SkillHot 编辑组',
    repoUrl: '',
    skillIds: [
      'obra/devops-backpack',
      'truffle-security/sec-scan',
      'browser-base/automation-skill',
    ],
  },
  {
    id: 'research-stack',
    title: '科研工作流',
    description: '从读论文到整理笔记，把 Obsidian 和 arxiv 接进 Claude Code。',
    curator: 'SkillHot 编辑组',
    repoUrl: '',
    skillIds: [
      'arxiv-reader/research-skill',
      'obsidian-lab/note-skill',
      'chroma-core/skill-pack',
    ],
  },
];
