'use client';

import { Star, GitFork, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { categoryMap, platformMap } from '@/data/categories';
import { useSkillDetail } from './SkillDetailProvider';
import { cn, formatNumber, relativeDate } from '@/lib/utils';
import type { Skill } from '@/lib/types';

interface Props {
  skill: Skill;
  className?: string;
}

export function SkillCard({ skill, className }: Props) {
  const { open } = useSkillDetail();
  const category = categoryMap[skill.category];
  const isFresh = isNew(skill.lastCommit);

  return (
    <Card
      onClick={() => open(skill.id)}
      className={cn(
        'group cursor-pointer hover:border-primary/40 hover:shadow-md flex flex-col',
        className
      )}
    >
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base leading-none">{category?.icon}</span>
            <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
              {skill.name}
            </h3>
          </div>
          {isFresh && (
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">
              今日更新
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {skill.descriptionZh}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {skill.platforms.slice(0, 2).map((p) => {
            const plat = platformMap[p];
            return (
              <Badge key={p} variant="secondary" className={cn('text-[10px]', plat?.color)}>
                {plat?.name}
              </Badge>
            );
          })}
          <Badge variant="outline" className="text-[10px]">
            {category?.name}
          </Badge>
        </div>
      </div>

      <div className="px-4 py-2.5 border-t bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-0.5">
            <Star className="h-3 w-3" /> {formatNumber(skill.stars)}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Activity className="h-3 w-3" /> {skill.commits30d}
          </span>
        </div>
        <span>{relativeDate(skill.lastCommit)}</span>
      </div>
    </Card>
  );
}

function isNew(iso: string): boolean {
  const diff = Date.now() - new Date(iso).getTime();
  return diff < 24 * 60 * 60 * 1000;
}
