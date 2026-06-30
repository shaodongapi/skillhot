import { Octokit } from '@octokit/rest';
import { throttling } from '@octokit/plugin-throttling';

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

const ThrottledOctokit = Octokit.plugin(throttling);

export const octokit = new ThrottledOctokit({
  auth: token || undefined,
  userAgent: 'skillhot-sync/v1',
  throttle: {
    onRateLimit: (retryAfter, options, octokitInstance, retries) => {
      const remaining = (options as any)?.request?.retryCount ?? 0;
      console.warn(`\n  ⚠️  主速率限制，${retryAfter}s 后重试 (第 ${remaining + 1} 次)`);
      return retries < 2;
    },
    onSecondaryRateLimit: (retryAfter, options, octokitInstance, retries) => {
      const remaining = (options as any)?.request?.retryCount ?? 0;
      console.warn(`\n  ⚠️  次级速率限制（不重试，跳过）：${remaining + 1}`);
      return false;
    },
  },
});

export interface RawRepoMeta {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  language: string | null;
  owner: { login: string; avatar_url: string; html_url: string };
  pushed_at: string;
  archived: boolean;
}

export async function fetchRepo(owner: string, repo: string): Promise<RawRepoMeta | null> {
  try {
    const { data } = await octokit.repos.get({ owner, repo });
    return data as unknown as RawRepoMeta;
  } catch (e: any) {
    if (e?.status === 404) {
      console.warn(`[skip] ${owner}/${repo} - 404`);
      return null;
    }
    if (e?.status === 403) {
      // 重试已由 throttling 插件处理，到这里说明重试用尽
      console.warn(`[skip] ${owner}/${repo} - 403 (重试用尽)`);
      return null;
    }
    throw e;
  }
}

export async function fetchReadme(owner: string, repo: string): Promise<string> {
  try {
    const { data } = await octokit.repos.getReadme({
      owner,
      repo,
      headers: { accept: 'application/vnd.github.raw' },
    });
    return data as unknown as string;
  } catch {
    return '';
  }
}

export async function countCommitsSince(
  owner: string,
  repo: string,
  sinceIso: string
): Promise<number> {
  try {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
      since: sinceIso,
      per_page: 100,
    });
    return data.length;
  } catch {
    return 0;
  }
}

export async function starGrowthSince(
  owner: string,
  repo: string,
  sinceIso: string
): Promise<number> {
  try {
    const { data } = await octokit.activity.listStargazersForRepo({
      owner,
      repo,
      since: sinceIso,
      per_page: 1,
      headers: { accept: 'application/vnd.github.star+json' },
    });
    return (data as unknown as { starred_at: string }[]).length;
  } catch {
    return 0;
  }
}
