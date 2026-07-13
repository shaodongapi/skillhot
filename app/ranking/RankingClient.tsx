'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star, Activity, TrendingUp, Flame, Trophy, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { categoryMap, platformMap } from '@/data/categories';
import { sortBy } from '@/lib/data';
import { cn, formatNumber, relativeDate } from '@/lib/utils';
import { CategoryIcon } from '@/lib/category-icons';
import { SkillRow } from '@/components/skill/SkillRow';
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

  const showPodium = !categoryId && filtered.length >= 3;
  const podium = showPodium ? filtered.slice(0, 3) : [];
  const list = showPodium ? filtered.slice(3) : filtered;
  const listStartRank = showPodium ? 4 : 1;

  return (
    <div className="space-y-4">
      {/* sticky 控件区 */}
      <div className="sticky top-14 z-30 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-md border-b">
        <div className="space-y-3">
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
                  label={c.name}
                  count={count}
                />
              );
            })}
          </div>
        </div>
      </div>

      <Card className="p-3 bg-muted/30 border-dashed">
        <p className="text-xs text-muted-foreground">
          <SortHintIcon className="inline h-3 w-3 mr-1 align-text-bottom" />
          {meta.hint}
        </p>
      </Card>

      {/* Top 3 领奖台（仅主榜显示） */}
      {showPodium && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {podium.map((s, i) => (
            <PodiumCard
              key={s.id}
              skill={s}
              rank={i + 1}
              onOpen={() => open(s.id)}
            />
          ))}
        </section>
      )}

      {/* 紧凑列表 */}
      <div className="space-y-2">
        {list.map((s, i) => (
          <SkillRow key={s.id} skill={s} rank={listStartRank + i} />
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

function PodiumCard({
  skill,
  rank,
  onOpen,
}: {
  skill: Skill;
  rank: number;
  onOpen: () => void;
}) {
  const tint =
    rank === 1
      ? 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-500/15'
      : rank === 2
      ? 'bg-slate-400/10 border-slate-400/30 dark:bg-slate-400/15'
      : 'bg-orange-700/10 border-orange-700/30 dark:bg-orange-700/15';
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
  const category = categoryMap[skill.category];
  const growth = skill.starGrowth30d;

  return (
    <Card
      onClick={onOpen}
      className={cn(
        'p-4 cursor-pointer hover:shadow-md transition-all flex flex-col gap-3 border relative overflow-hidden',
        tint
      )}
    >
      {category && (
        <div className={cn('absolute left-0 top-0 bottom-0 w-1', category.accentClass)} />
      )}
      <div className="flex items-center justify-between">
        <span className="text-2xl leading-none">{medal}</span>
        {growth > 0 && (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
            <TrendingUp className="h-3 w-3 mr-0.5" /> 本周 +{formatNumber(growth)}
          </Badge>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CategoryIcon id={skill.category} className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-bold text-base truncate">{skill.name}</h3>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 min-h-[2rem]">
          {skill.descriptionZh || skill.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {skill.platforms.slice(0, 2).map((p) => (
            <Badge key={p} variant="secondary" className={cn('text-[10px]', platformMap[p]?.color)}>
              {platformMap[p]?.name}
            </Badge>
          ))}
          {category && (
            <Badge variant="outline" className={cn('text-[10px]', category.colorClass)}>
              {category.name}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50 mt-auto">
        <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-semibold">
          <Star className="h-3 w-3 fill-current" />{' '}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            {formatNumber(skill.stars)}
          </span>
        </span>
        <span className="inline-flex items-center gap-0.5 text-muted-foreground">
          <Activity className="h-3 w-3" /> {skill.commits30d}
        </span>
        <span className="text-muted-foreground">{relativeDate(skill.lastCommit)}</span>
      </div>
    </Card>
  );
}
