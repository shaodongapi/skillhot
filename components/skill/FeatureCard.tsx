'use client';

import { Star, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categoryMap, platformMap } from '@/data/categories';
import { CategoryIcon } from '@/lib/category-icons';
import { useSkillDetail } from './SkillDetailProvider';
import { cn, formatNumber, relativeDate } from '@/lib/utils';
import type { Skill } from '@/lib/types';

interface Props {
  skill: Skill;
  className?: string;
}

export function FeatureCard({ skill, className }: Props) {
  const { open } = useSkillDetail();
  const category = categoryMap[skill.category];
  const isFresh = isNew(skill.lastCommit);

  return (
    <Card
      onClick={() => open(skill.id)}
      className={cn(
        'group cursor-pointer hover:border-primary/40 hover:shadow-md flex flex-col w-[280px] shrink-0 snap-start relative overflow-hidden',
        className
      )}
    >
      {category && (
        <div className={cn('absolute left-0 top-0 bottom-0 w-1', category.accentClass)} />
      )}
      <div className="p-5 flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          {category && (
            <Badge variant="outline" className={cn('text-[10px] border', category.colorClass)}>
              <CategoryIcon id={skill.category} className="h-3 w-3 mr-1" />
              {category.name}
            </Badge>
          )}
          {isFresh && (
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium">
              今日更新
            </span>
          )}
        </div>

        <h3 className="font-bold text-lg mb-2 truncate group-hover:text-primary transition-colors">
          {skill.name}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed min-h-[3.75rem]">
          {skill.descriptionZh || skill.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {skill.platforms.slice(0, 3).map((p) => {
            const plat = platformMap[p];
            return (
              <Badge key={p} variant="secondary" className={cn('text-[10px]', plat?.color)}>
                {plat?.name}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-3 border-t bg-muted/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-semibold">
            <Star className="h-3 w-3 fill-current" />{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              {formatNumber(skill.stars)}
            </span>
          </span>
          <span className="inline-flex items-center gap-0.5 text-muted-foreground">
            <Activity className="h-3 w-3" /> {skill.commits30d}
          </span>
        </div>
        <span className="text-muted-foreground">{relativeDate(skill.lastCommit)}</span>
      </div>
    </Card>
  );
}

function isNew(iso: string): boolean {
  const diff = Date.now() - new Date(iso).getTime();
  return diff < 24 * 60 * 60 * 1000;
}
