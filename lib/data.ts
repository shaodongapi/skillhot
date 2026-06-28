import { skills as allSkills, skillMap } from '@/data/skills';
import { categories } from '@/data/categories';
import { collections as allCollections } from '@/data/collections';
import type { CategoryId, Skill, SortKey, Topic } from '@/lib/types';

const DAY = 24 * 60 * 60 * 1000;

export function popularityScore(s: Skill): number {
  const starsWeight = s.stars * 1.0;
  const commitsWeight = s.commits30d * 5;
  const growthWeight = s.starGrowth30d * 2;
  const installBonus = s.installCmd ? 50 : 0;
  const daysSinceCommit = (Date.now() - new Date(s.lastCommit).getTime()) / DAY;
  const stalePenalty = daysSinceCommit > 180 ? 200 : 0;
  return starsWeight + commitsWeight + growthWeight + installBonus - stalePenalty;
}

export function sortBy(skills: Skill[], key: SortKey): Skill[] {
  const copy = [...skills];
  if (key === 'stars') return copy.sort((a, b) => b.stars - a.stars);
  if (key === 'recent')
    return copy.sort(
      (a, b) => new Date(b.lastCommit).getTime() - new Date(a.lastCommit).getTime()
    );
  return copy.sort((a, b) => popularityScore(b) - popularityScore(a));
}

export function getStats() {
  const lastCommitDates = allSkills.map((s) => new Date(s.lastCommit).getTime());
  const lastSync = new Date(Math.max(...lastCommitDates)).toISOString();
  return {
    totalSkills: allSkills.length,
    totalCategories: categories.length,
    lastSync,
  };
}

export function getRecentSkills(days = 7, limit = 8): Skill[] {
  const cutoff = Date.now() - days * DAY;
  return allSkills
    .filter((s) => new Date(s.firstSeen).getTime() >= cutoff)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, limit);
}

export function getFeatured(limit = 6): Skill[] {
  return allSkills.filter((s) => s.featured).slice(0, limit);
}

export function getRandomSkills(n = 8, excludeIds: string[] = []): Skill[] {
  const pool = allSkills.filter((s) => !excludeIds.includes(s.id));
  const result: Skill[] = [];
  const used = new Set<number>();
  const max = Math.min(n, pool.length);
  while (result.length < max) {
    const i = Math.floor(Math.random() * pool.length);
    if (!used.has(i)) {
      used.add(i);
      result.push(pool[i]);
    }
  }
  return result;
}

export function getSkillById(id: string): Skill | undefined {
  return skillMap[id];
}

export function getSkillsByCategory(categoryId: CategoryId): Skill[] {
  return allSkills.filter((s) => s.category === categoryId);
}

export function getCategoryCount(categoryId: CategoryId): number {
  return allSkills.filter((s) => s.category === categoryId).length;
}

export function getAllTopics(): Topic[] {
  const counter = new Map<string, number>();
  const display = new Map<string, string>();
  for (const s of allSkills) {
    for (const t of s.topics) {
      counter.set(t, (counter.get(t) || 0) + 1);
      if (!display.has(t)) {
        display.set(t, t.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
      }
    }
  }
  return Array.from(counter.entries())
    .map(([id, count]) => ({ id, displayName: display.get(id) || id, count }))
    .sort((a, b) => b.count - a.count);
}

export function getSkillsByTopic(topicId: string): Skill[] {
  return allSkills.filter((s) => s.topics.includes(topicId));
}

export function getCollections() {
  return allCollections.map((c) => ({
    ...c,
    skills: c.skillIds.map((id) => skillMap[id]).filter(Boolean) as Skill[],
  }));
}

export function getCollectionById(id: string) {
  const c = allCollections.find((x) => x.id === id);
  if (!c) return undefined;
  return {
    ...c,
    skills: c.skillIds.map((id) => skillMap[id]).filter(Boolean) as Skill[],
  };
}

export function getRelatedSkills(skill: Skill, n = 4): Skill[] {
  return allSkills
    .filter((s) => s.id !== skill.id)
    .map((s) => {
      let score = 0;
      if (s.category === skill.category) score += 3;
      score += s.topics.filter((t) => skill.topics.includes(t)).length * 2;
      s.platforms.forEach((p) => {
        if (skill.platforms.includes(p)) score += 1;
      });
      return { s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.s);
}

export function searchSkills(q: string): Skill[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  return allSkills
    .map((s) => {
      let score = 0;
      if (s.name.toLowerCase().includes(query)) score += 10;
      if (s.id.toLowerCase().includes(query)) score += 8;
      if (s.descriptionZh.includes(query)) score += 5;
      if (s.description.toLowerCase().includes(query)) score += 3;
      if (s.topics.some((t) => t.toLowerCase().includes(query))) score += 4;
      if (s.useCases.some((u) => u.includes(query))) score += 2;
      return { s, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.s);
}
