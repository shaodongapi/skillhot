'use client';

import { Star, Activity, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { categoryMap } from '@/data/categories';
import { CategoryIcon } from '@/lib/category-icons';
import { useSkillDetail } from './SkillDetailProvider';
import { cn, formatNumber, relativeDate } from '@/lib/utils';
import type { Skill } from '@/lib/types';

interface Props {
  skill: Skill;
  rank?: number;
  className?: string;
}

export function SkillRow({ skill, rank, className }: Props) {
  const { open } = useSkillDetail();
  const category = categoryMap[skill.category];
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;
  const growth = skill.starGrowth30d;

  return (
    <Card
      onClick={() => open(skill.id)}
      className={cn(
        'p-3 flex items-center gap-3 cursor-pointer hover:border-primary/40 hover:shadow-md relative overflow-hidden',
        className
      )}
    >
      {category && (
        <div className={cn('absolute left-0 top-0 bottom-0 w-1', category.accentClass)} />
      )}
      {rank !== undefined && (
        <div className="w-7 text-center shrink-0">
          {medal ? (
            <span className="text-lg leading-none">{medal}</span>
          ) : (
            <span className="text-xs text-muted-foreground font-mono">{rank}</span>
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <CategoryIcon id={skill.category} className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <h3 className="font-semibold text-sm truncate">{skill.name}</h3>
          <span className="text-xs text-muted-foreground truncate hidden sm:inline font-mono">
            {skill.id}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {skill.descriptionZh || skill.description}
        </p>
      </div>

      <div className="shrink-0 flex items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
          <Star className="h-3 w-3 fill-current" />
          <span className="font-semibold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            {formatNumber(skill.stars)}
          </span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-0.5 text-muted-foreground">
          <Activity className="h-3 w-3" /> {skill.commits30d}
        </span>
        {growth > 0 && (
          <span className="hidden md:inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" /> +{formatNumber(growth)}
          </span>
        )}
        <span className="hidden lg:inline text-[11px] text-muted-foreground">
          {relativeDate(skill.lastCommit)}
        </span>
      </div>
    </Card>
  );
}
