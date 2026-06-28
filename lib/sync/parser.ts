const GITHUB_LINK = /https?:\/\/github\.com\/([A-Za-z0-9][\w-]{0,38})\/([A-Za-z0-9._-]+)/g;

const STOPWORDS = new Set([
  'github', 'orgs', 'sponsors', 'settings', 'notifications', 'login',
  'signup', 'features', 'pricing', 'about', 'customer-stories', 'topics',
  'trending', 'collections', 'marketplace', 'explore', 'search', 'pulls',
  'issues', 'codespaces', 'copilot', 'security', 'team', 'enterprise',
  'repos', 'new', 'mine', 'watching', 'starred', 'profile', 'account',
]);

export interface RepoRef {
  owner: string;
  repo: string;
}

export function extractReposFromMarkdown(md: string): RepoRef[] {
  const found = new Map<string, RepoRef>();
  for (const m of md.matchAll(GITHUB_LINK)) {
    const owner = m[1];
    let repo = m[2];
    repo = repo.replace(/[?#].*$/, '').replace(/\/$/, '');
    if (owner.includes('.') || STOPWORDS.has(owner.toLowerCase()) || STOPWORDS.has(repo.toLowerCase())) continue;
    if (owner.length < 2 || repo.length < 2) continue;
    if (/^\d+$/.test(repo)) continue;
    if (repo.endsWith('.png') || repo.endsWith('.jpg') || repo.endsWith('.svg') || repo.endsWith('.gif')) continue;
    const key = `${owner}/${repo}`.toLowerCase();
    if (!found.has(key)) found.set(key, { owner, repo });
  }
  return Array.from(found.values());
}

export function detectInstallCommand(
  repo: string,
  readme: string,
  homepage: string | null
): string | null {
  if (!readme) return null;
  const lines = readme.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(npm\s+(i|install|npx)|npx\s+|yarn\s+(add|create)|pnpm\s+(add|create)|pip\s+install|uv\s+(add|pip install)|claude\s+(skill|plugin)\s+(install|add)|brew\s+install)/i.test(trimmed)) {
      const cleaned = trimmed.replace(/^```[a-z]*$/, '').replace(/`/g, '').replace(/^[•\-]\s*/, '').trim();
      if (cleaned && cleaned.length < 200) return cleaned;
    }
  }

  const bashBlock = readme.match(/```(?:bash|shell|sh)\n([\s\S]*?)```/);
  if (bashBlock) {
    const cmd = bashBlock[1].split('\n').map((l) => l.trim()).find((l) =>
      /^(npm|npx|yarn|pnpm|pip|uv|claude|brew|curl|git\s+clone)/i.test(l)
    );
    if (cmd && cmd.length < 200) return cmd;
  }

  if (homepage && /npmjs\.com|pypi\.org/.test(homepage)) {
    return `npm install ${repo.split('/')[1]}`;
  }

  return null;
}
