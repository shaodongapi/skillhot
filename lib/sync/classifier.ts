import type { CategoryId } from '@/lib/types';

interface Rule {
  category: CategoryId;
  keywords: string[];
}

const rules: Rule[] = [
  { category: 'ui-design', keywords: ['ui', 'design', 'figma', 'shadcn', 'tailwind', 'css', 'component', 'radix', 'storybook', 'sketch', 'prototype'] },
  { category: 'coding', keywords: ['code', 'coding', 'developer', 'refactor', 'review', 'debug', 'linter', 'typescript', 'javascript', 'python', 'rust', 'golang', 'framework', 'scaffold', 'template', 'ide'] },
  { category: 'office', keywords: ['office', 'email', 'calendar', 'spreadsheet', 'excel', 'word', 'notion', 'slack', 'schedule', 'meeting', 'docs'] },
  { category: 'content', keywords: ['content', 'blog', 'writing', 'writer', 'copywriting', 'seo', 'social', 'marketing', 'article', 'script'] },
  { category: 'data', keywords: ['data', 'sql', 'database', 'query', 'analytics', 'visualization', 'chart', 'etl', 'warehouse', 'dashboard'] },
  { category: 'ai-ml', keywords: ['ai', 'ml', 'machine-learning', 'llm', 'model', 'training', 'inference', 'embedding', 'vector', 'rag', 'prompt', 'agent', 'gpt', 'transformer'] },
  { category: 'devops', keywords: ['devops', 'kubernetes', 'docker', 'terraform', 'helm', 'cicd', 'ci-cd', 'deploy', 'deploy', 'infrastructure', 'observability', 'monitoring', 'cloud'] },
  { category: 'security', keywords: ['security', 'vulnerability', 'cve', 'pentest', 'owasp', 'audit', 'crypto', 'encryption', 'malware', 'reverse-engineering'] },
  { category: 'automation', keywords: ['automation', 'scraping', 'crawler', 'playwright', 'puppeteer', 'selenium', 'rpa', 'workflow', 'bot'] },
  { category: 'docs', keywords: ['documentation', 'docs', 'api-doc', 'readme', 'spec', 'openapi', 'swagger', 'mkdocs', 'docusaurus'] },
  { category: 'media', keywords: ['image', 'video', 'audio', 'ffmpeg', 'transcode', 'media', 'subtitle', 'render', 'encode', 'compress'] },
  { category: 'research', keywords: ['research', 'paper', 'arxiv', 'citation', 'academic', 'note', 'obsidian', 'zotero', 'knowledge'] },
  { category: 'product', keywords: ['product', 'project', 'agile', 'scrum', 'roadmap', 'requirement', 'jira', 'linear', 'task'] },
];

const fallback: CategoryId = 'misc';

export function classify(input: {
  name: string;
  description: string;
  topics: string[];
  readme?: string;
}): CategoryId {
  const text = [
    input.name,
    input.description,
    input.topics.join(' '),
    (input.readme || '').slice(0, 5000),
  ].join(' ').toLowerCase();

  const scores = new Map<CategoryId, number>();
  for (const rule of rules) {
    let s = 0;
    for (const kw of rule.keywords) {
      if (text.includes(kw)) s += 1;
    }
    if (s > 0) scores.set(rule.category, s);
  }

  let best: CategoryId | null = null;
  let bestScore = 0;
  for (const [cat, s] of scores) {
    if (s > bestScore) {
      best = cat;
      bestScore = s;
    }
  }
  return best ?? fallback;
}
