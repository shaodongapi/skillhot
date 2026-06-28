import type { Skill } from '@/lib/types';

const DAY = 24 * 60 * 60 * 1000;

export function computePopularity(s: {
  stars: number;
  commits30d: number;
  starGrowth30d: number;
  installCmd: string | null;
  lastCommit: string;
}): number {
  const daysSince = (Date.now() - new Date(s.lastCommit).getTime()) / DAY;
  return (
    s.stars * 1.0 +
    s.commits30d * 5 +
    s.starGrowth30d * 2 +
    (s.installCmd ? 50 : 0) -
    (daysSince > 180 ? 200 : 0)
  );
}

export function markFeatured(skills: Skill[], topN = 12): Set<string> {
  const sorted = [...skills]
    .map((s) => ({ id: s.id, score: computePopularity(s) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
  return new Set(sorted.map((x) => x.id));
}
