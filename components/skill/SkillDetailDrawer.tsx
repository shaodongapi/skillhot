'use client';

import * as React from 'react';
import Link from 'next/link';
import { Star, GitFork, Activity, Calendar, Code2, Tag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { categoryMap, platformMap } from '@/data/categories';
import { getSkillById, getRelatedSkills, popularityScore } from '@/lib/data';
import { cn, formatNumber, formatDate } from '@/lib/utils';
import { CategoryIcon } from '@/lib/category-icons';
import { FavoriteButton, CopyInstallButton, OpenGithubButton } from './FavoriteButton';
import { useSkillDetail } from './SkillDetailProvider';

interface Props {
  skillId: string | null;
  onClose: () => void;
}

export function SkillDetailDrawer({ skillId, onClose }: Props) {
  const { open } = useSkillDetail();
  const skill = skillId ? getSkillById(skillId) : undefined;

  return (
    <Sheet open={!!skill} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto scrollbar-thin p-0"
      >
        {skill && (
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 pb-3 border-b bg-gradient-to-br from-accent/50 to-transparent">
              <div className="flex items-center gap-2 mb-1">
                <CategoryIcon id={skill.category} className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className={cn('text-xs', categoryMap[skill.category]?.colorClass)}>
                  {categoryMap[skill.category]?.name}
                </Badge>
                <span className="text-xs text-muted-foreground">{skill.id}</span>
              </div>
              <SheetTitle className="text-2xl">{skill.name}</SheetTitle>
              <SheetDescription className="text-sm">
                {skill.descriptionZh}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 px-6 py-4 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <Stat icon={Star} label="Stars" value={formatNumber(skill.stars)} />
                <Stat icon={GitFork} label="Forks" value={formatNumber(skill.forks)} />
                <Stat icon={Activity} label="近30d提交" value={String(skill.commits30d)} />
              </div>

              <Section title="中文简介">
                <p className="text-sm leading-relaxed">{skill.descriptionZh}</p>
              </Section>

              <Section title="作者原始描述">
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  {skill.description}
                </p>
              </Section>

              <Section title="兼容平台">
                <div className="flex flex-wrap gap-1.5">
                  {skill.platforms.map((p) => {
                    const plat = platformMap[p];
                    return (
                      <Badge key={p} variant="secondary" className={plat?.color}>
                        {plat?.name}
                      </Badge>
                    );
                  })}
                  {skill.platforms.length === 0 && (
                    <span className="text-xs text-muted-foreground">未明确</span>
                  )}
                </div>
              </Section>

              <Section title="适用场景">
                <div className="flex flex-wrap gap-1.5">
                  {skill.useCases.map((u) => (
                    <Badge key={u} variant="outline" className="text-xs">
                      {u}
                    </Badge>
                  ))}
                </div>
              </Section>

              {skill.topics.length > 0 && (
                <Section title="话题标签">
                  <div className="flex flex-wrap gap-1.5">
                    {skill.topics.map((t) => (
                      <Link key={t} href={`/topics/${t}`}>
                        <Badge
                          variant="outline"
                          className="text-xs cursor-pointer hover:border-primary hover:text-primary"
                        >
                          <Tag className="h-2.5 w-2.5 mr-0.5" />
                          {t}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </Section>
              )}

              {skill.installCmd && (
                <Section title="安装命令">
                  <div className="rounded-md bg-muted/70 border px-3 py-2 font-mono text-xs flex items-center justify-between gap-2">
                    <code className="truncate">{skill.installCmd}</code>
                    <CopyInstallButton skill={skill} />
                  </div>
                </Section>
              )}

              <Section title="元数据">
                <dl className="text-xs space-y-1.5 text-muted-foreground">
                  <Meta icon={Code2} label="语言" value={skill.language || '未指定'} />
                  <Meta
                    icon={Star}
                    label="综合热度"
                    value={formatNumber(Math.round(popularityScore(skill)))}
                  />
                  <Meta
                    icon={Calendar}
                    label="最近提交"
                    value={formatDate(skill.lastCommit)}
                  />
                  <Meta
                    icon={Calendar}
                    label="收录于"
                    value={formatDate(skill.firstSeen)}
                  />
                </dl>
              </Section>

              <Separator />

              <Section title="相关推荐">
                <RelatedList skillId={skill.id} onPick={open} />
              </Section>
            </div>

            <div className="border-t p-4 flex items-center gap-2 bg-background sticky bottom-0">
              <FavoriteButton skill={skill} />
              <CopyInstallButton skill={skill} />
              <OpenGithubButton skill={skill} />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border bg-muted/30 px-3 py-2">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

function RelatedList({
  skillId,
  onPick,
}: {
  skillId: string;
  onPick: (id: string) => void;
}) {
  const skill = getSkillById(skillId);
  if (!skill) return null;
  const related = getRelatedSkills(skill, 4);
  if (related.length === 0)
    return <p className="text-xs text-muted-foreground">暂无相关项目</p>;
  return (
    <ul className="space-y-1.5">
      {related.map((r) => (
        <li key={r.id}>
          <button
            onClick={() => onPick(r.id)}
            className="w-full text-left p-2 rounded-md hover:bg-accent flex items-center justify-between gap-2"
          >
            <span className="min-w-0">
              <span className="text-sm font-medium block truncate">{r.name}</span>
              <span className="text-xs text-muted-foreground block truncate">
                {r.descriptionZh}
              </span>
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground shrink-0">
              <Star className="h-3 w-3" />
              {formatNumber(r.stars)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
