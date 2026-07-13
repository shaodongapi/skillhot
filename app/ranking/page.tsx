import { categories } from '@/data/categories';
import { skills as allSkills } from '@/data/skills';
import { RankingClient } from './RankingClient';
import { RandomSkillButton } from '@/components/skill/RandomSkillButton';
import type { SortKey } from '@/lib/types';

export const metadata = {
  title: '榜单 — SkillHot',
  description: '综合热度、Stars、最近更新三个维度，找到当下最值得关注的 Agent Skills。',
};

export default function RankingPage({
  searchParams,
}: {
  searchParams: { sort?: string; category?: string };
}) {
  const validSorts: SortKey[] = ['popularity', 'stars', 'recent'];
  const sort: SortKey = validSorts.includes(searchParams.sort as SortKey)
    ? (searchParams.sort as SortKey)
    : 'popularity';
  const category = categories.find((c) => c.slug === searchParams.category)?.id;

  return (
    <div className="container py-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">榜单</h1>
          <p className="text-sm text-muted-foreground">
            三种排序维度，挖出当下真正值得关注的项目。
          </p>
        </div>
        <RandomSkillButton />
      </header>
      <RankingClient
        allSkills={allSkills}
        categories={categories}
        initialSort={sort}
        initialCategoryId={category}
      />
    </div>
  );
}
