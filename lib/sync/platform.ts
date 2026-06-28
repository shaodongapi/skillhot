import type { PlatformId } from '@/lib/types';

const PLATFORM_RULES: Array<{ id: PlatformId; keywords: string[] }> = [
  { id: 'claude-code', keywords: ['claude code', 'claude-code', 'claude skill', 'anthropic', '.claude', 'claude plugin'] },
  { id: 'opencode', keywords: ['opencode', 'open-code', 'opencodehub'] },
  { id: 'cline', keywords: ['cline', 'cline-ai', 'roo-cline', 'cl1ne'] },
  { id: 'cursor', keywords: ['cursor', 'cursor-rules', 'cursorrules', '.cursorrules'] },
  { id: 'windsurf', keywords: ['windsurf', 'codeium', '.windsurfrules'] },
];

export function detectPlatforms(input: {
  description: string;
  topics: string[];
  readme?: string;
}): PlatformId[] {
  const text = [
    input.description || '',
    input.topics.join(' '),
    (input.readme || '').slice(0, 5000),
  ].join(' ').toLowerCase();

  const result: PlatformId[] = [];
  for (const rule of PLATFORM_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      result.push(rule.id);
    }
  }
  if (result.length === 0) result.push('claude-code');
  return result;
}
