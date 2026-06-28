import type { Skill } from '@/lib/types';
import skillsJson from './skills.json';

// 数据源：data/skills.json
// - 由 scripts/sync-skills.ts 同步 GitHub 元数据
// - 由 scripts/translate.ts 补充 descriptionZh
// - 手工编辑：直接改 skills.json 即可
export const skills: Skill[] = skillsJson as Skill[];

export const skillMap: Record<string, Skill> = Object.fromEntries(
  skills.map((s) => [s.id, s])
);
