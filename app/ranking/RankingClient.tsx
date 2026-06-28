'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star, GitFork, Activity, Flame, Trophy, Clock, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { categoryMap, platformMap } from '@/data/categories';
import { sortBy, popularityScore } from '@/lib/data';
import { cn, formatNumber, relativeDate } from '@/lib/utils';
import { useSkillDetail } from '@/components/skill/SkillDetailProvider';
import type { Category, Skill, SortKey } from '@/lib/types';

const sortMeta: Record<SortKey, { label: string; icon: React.ComponentType<{ className?: string }>; hint: string }> = {
  popularity: { label: '综合热度', icon: Flame, hint: '综合 stars + 更新频率 + 社区增长，反映"现在真的有人在用、还在持续迭代"' },
  stars: { label: 'Stars 榜', icon: Trophy, hint: '纯人气榜，经过群众检验的稳妥选择' },
  recent: { label: '最近更新', icon: Clock, hint: '按最后提交时间排序，挖低 Stars 但活跃的宝藏' },
};

interface Props {
  allSkills: Skill[];
  categories: Category[];
  initialSort: SortKey;
  initialCategoryId?: string;
}

export function RankingClient({ allSkills, categories, initialSort, initialCategoryId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open } = useSkillDetail();

  const [sort, setSort] = React.useState<SortKey>(initialSort);
  const [categoryId, setCategoryId] = React.useState<string | undefined>(initialCategoryId);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === 'popularity') params.delete('sort');
    else params.set('sort', sort);
    if (categoryId) params.set('category', categories.find((c) => c.id === categoryId)?.slug ?? '');
    else params.delete('category');
    const q = params.toString();
    router.replace(q ? `/ranking?${q}` : '/ranking');
  }, [sort, categoryId, router, searchParams, categories]);

  const filtered = React.useMemo(() => {
    const list = categoryId
      ? allSkills.filter((s) => s.category === categoryId)
      : allSkills;
    return sortBy(list, sort);
  }, [allSkills, sort, categoryId]);

  const meta = sortMeta[sort];
  const SortHintIcon = meta.icon;

  return (
    <div className="space-y-4">
      <Tabs value={sort} onValueChange={(v) => setSort(v as SortKey)}>
        <TabsList>
          {(Object.keys(sortMeta) as SortKey[]).map((k) => {
            const Icon = sortMeta[k].icon;
            return (
              <TabsTrigger key={k} value={k} className="gap-1">
                <Icon className="h-3 w-3" /> {sortMeta[k].label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <Card className="p-3 bg-muted/30 border-dashed">
        <p className="text-xs text-muted-foreground">
          <SortHintIcon className="inline h-3 w-3 mr-1 align-text-bottom" />
          {meta.hint}
        </p>
      </Card>

      <div className="flex flex-wrap gap-1">
        <CategoryChip
          active={!categoryId}
          onClick={() => setCategoryId(undefined)}
          label="全部"
          count={allSkills.length}
        />
        {categories.map((c) => {
          const count = allSkills.filter((s) => s.category === c.id).length;
          if (count === 0) return null;
          return (
            <CategoryChip
              key={c.id}
              active={categoryId === c.id}
              onClick={() => setCategoryId(c.id)}
              label={`${c.icon} ${c.name}`}
              count={count}
            />
          );
        })}
      </div>

      <div className="space-y-2">
        {filtered.map((s, i) => (
          <RankingRow
            key={s.id}
            index={i + 1}
            skill={s}
            sort={sort}
            onOpen={() => open(s.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            这个筛选下暂无项目。
          </p>
        )}
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-2.5 py-1 rounded-full text-xs transition-colors border',
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
      )}
    >
      {label} <span className="opacity-60">{count}</span>
    </button>
  );
}

function RankingRow({
  index,
  skill,
  sort,
  onOpen,
}: {
  index: number;
  skill: Skill;
  sort: SortKey;
  onOpen: () => void;
}) {
  const category = categoryMap[skill.category];
  const medal = index === 1 ? '🥇' : index === 2 ? '🥈' : index === 3 ? '🥉' : null;

  return (
    <Card
      onClick={onOpen}
      className="p-3 flex items-center gap-3 cursor-pointer hover:border-primary/40 hover:shadow-md"
    >
      <div className="w-8 text-center shrink-0">
        {medal ? (
          <span className="text-xl">{medal}</span>
        ) : (
          <span className="text-sm text-muted-foreground font-mono">{index}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm">{category?.icon}</span>
          <h3 className="font-semibold text-sm truncate">{skill.name}</h3>
          <span className="text-xs text-muted-foreground truncate hidden sm:inline">{skill.id}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{skill.descriptionZh}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {skill.platforms.slice(0, 3).map((p) => (
            <Badge key={p} variant="secondary" className={cn('text-[10px]', platformMap[p]?.color)}>
              {platformMap[p]?.name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1 text-xs">
        <span className="inline-flex items-center gap-0.5 text-amber-600">
          <Star className="h-3 w-3 fill-current" />
          <span className="font-semibold">{formatNumber(skill.stars)}</span>
        </span>
        <span className="inline-flex items-center gap-0.5 text-muted-foreground">
          <Activity className="h-3 w-3" />
          {skill.commits30d}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {sort === 'recent' ? relativeDate(skill.lastCommit) : relativeDate(skill.lastCommit)}
        </span>
      </div>
    </Card>
  );
}
