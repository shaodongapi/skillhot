export type CategoryId =
  | 'ui-design'
  | 'coding'
  | 'office'
  | 'content'
  | 'data'
  | 'ai-ml'
  | 'devops'
  | 'security'
  | 'automation'
  | 'docs'
  | 'media'
  | 'research'
  | 'product'
  | 'misc';

export type PlatformId =
  | 'claude-code'
  | 'opencode'
  | 'cline'
  | 'cursor'
  | 'windsurf';

export interface Category {
  id: CategoryId;
  name: string;        // 中文显示名
  slug: string;
  description: string; // 一句话介绍
  icon: string;        // emoji 占位
}

export interface Platform {
  id: PlatformId;
  name: string;
  color: string;       // tailwind class fragment
}

export interface Skill {
  id: string;                    // "owner/repo"
  name: string;
  description: string;           // 原文（多为英文）
  descriptionZh: string;         // 中文简介
  url: string;                   // GitHub URL
  homepage: string | null;
  stars: number;
  forks: number;
  topics: string[];
  language: string | null;
  category: CategoryId;
  platforms: PlatformId[];
  useCases: string[];            // 适用场景
  installCmd: string | null;
  lastCommit: string;            // ISO date
  commits30d: number;
  starGrowth30d: number;
  firstSeen: string;             // ISO date, 首次收录
  featured: boolean;
  archived: boolean;
}

export interface Topic {
  id: string;          // 'agent-skills'
  displayName: string; // 'Agent Skills'
  count: number;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  curator: string;
  repoUrl: string;
  skillIds: string[];
  cover?: string;
}

export type SortKey = 'popularity' | 'stars' | 'recent';
