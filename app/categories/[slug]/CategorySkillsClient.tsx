'use client';

import * as React from 'react';
import { SkillCard } from '@/components/skill/SkillCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sortBy } from '@/lib/data';
import type { Skill, SortKey } from '@/lib/types';

const labels: Record<SortKey, string> = {
  popularity: '综合热度',
  stars: 'Stars',
  recent: '最近更新',
};

export function CategorySkillsClient({
  skills,
  defaultSort = 'popularity',
}: {
  skills: Skill[];
  defaultSort?: SortKey;
}) {
  const [sort, setSort] = React.useState<SortKey>(defaultSort);
  const sorted = React.useMemo(() => sortBy(skills, sort), [skills, sort]);

  if (skills.length === 0) {
    return <p className="text-sm text-muted-foreground">这个分类暂无项目，敬请期待。</p>;
  }

  return (
    <div className="space-y-4">
      <Tabs value={sort} onValueChange={(v) => setSort(v as SortKey)}>
        <TabsList>
          {(Object.keys(labels) as SortKey[]).map((k) => (
            <TabsTrigger key={k} value={k}>
              {labels[k]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {sorted.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </div>
    </div>
  );
}
