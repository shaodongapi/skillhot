import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Star, GitFork, Activity, Calendar, Code2, ChevronRight, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { categoryMap, platformMap } from '@/data/categories';
import { skills, skillMap } from '@/data/skills';
import { getRelatedSkills, popularityScore } from '@/lib/data';
import { formatNumber, formatDate } from '@/lib/utils';
import {
  FavoriteButton,
  CopyInstallButton,
  OpenGithubButton,
} from '@/components/skill/FavoriteButton';
import { SkillCard } from '@/components/skill/SkillCard';

export const dynamicParams = false;

export function generateStaticParams() {
  return skills.map((s) => ({ id: s.id.split('/') }));
}

function getSkillId(params: { id: string[] }): string {
  return params.id.join('/').toLowerCase();
}

export function generateMetadata({ params }: { params: { id: string[] } }): Metadata {
  const skill = skillMap[getSkillId(params)];
  if (!skill) return { title: '未找到 — SkillHot' };

  const title = `${skill.name} — SkillHot`;
  const description = skill.descriptionZh || skill.description;
  const url = `https://skillhot.dev/skill/${skill.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'SkillHot',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: { canonical: url },
  };
}

export default function SkillDetailPage({ params }: { params: { id: string[] } }) {
  const skill = skillMap[getSkillId(params)];
  if (!skill) notFound();

  const category = categoryMap[skill.category];
  const related = getRelatedSkills(skill, 8);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: skill.name,
    description: skill.descriptionZh || skill.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    url: skill.url,
    discussionUrl: skill.url,
    starRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: skill.stars },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    keywords: skill.topics.join(', '),
  };

  return (
    <div className="container py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-muted-foreground mb-4 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/categories" className="hover:text-foreground">分类</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/categories/${category?.slug}`} className="hover:text-foreground">
          {category?.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{skill.name}</span>
      </nav>

      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{category?.icon}</span>
          <Badge variant="outline">{category?.name}</Badge>
          <span className="text-xs text-muted-foreground font-mono">{skill.id}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{skill.name}</h1>
        <p className="text-muted-foreground">{skill.descriptionZh || skill.description}</p>
      </header>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-6">
          <Card className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat icon={Star} label="Stars" value={formatNumber(skill.stars)} />
            <Stat icon={GitFork} label="Forks" value={formatNumber(skill.forks)} />
            <Stat icon={Activity} label="近 30d 提交" value={String(skill.commits30d)} />
            <Stat
              icon={Code2}
              label="综合热度"
              value={formatNumber(Math.round(popularityScore(skill)))}
            />
          </Card>

          <section>
            <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
              中文简介
            </h2>
            <p className="text-base leading-relaxed">
              {skill.descriptionZh || (
                <span className="text-muted-foreground italic">暂无中文简介</span>
              )}
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
              作者原始描述
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground italic">
              {skill.description}
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
              兼容平台
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skill.platforms.map((p) => (
                <Badge key={p} variant="secondary" className={platformMap[p]?.color}>
                  {platformMap[p]?.name}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
              适用场景
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skill.useCases.length > 0 ? (
                skill.useCases.map((u) => (
                  <Badge key={u} variant="outline">
                    {u}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">暂未标注</span>
              )}
            </div>
          </section>

          {skill.topics.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                话题标签
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skill.topics.map((t) => (
                  <Link key={t} href={`/topics/${t}`}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:border-primary hover:text-primary"
                    >
                      <Tag className="h-2.5 w-2.5 mr-0.5" />
                      {t}
                    </Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {skill.installCmd && (
            <section>
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                安装命令
              </h2>
              <div className="rounded-md bg-muted/70 border px-3 py-2 font-mono text-sm flex items-center justify-between gap-2">
                <code className="truncate">{skill.installCmd}</code>
                <CopyInstallButton skill={skill} />
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section>
              <Separator className="my-6" />
              <h2 className="text-xl font-semibold mb-3">相关推荐</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {related.map((r) => (
                  <SkillCard key={r.id} skill={r} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <Card className="p-4 space-y-3 sticky top-20">
            <div className="flex flex-col gap-2">
              <FavoriteButton skill={skill} size="default" />
              <CopyInstallButton skill={skill} />
              <OpenGithubButton skill={skill} />
            </div>
            <Separator />
            <dl className="text-xs space-y-1.5 text-muted-foreground">
              <Meta icon={Code2} label="语言" value={skill.language || '未指定'} />
              <Meta
                icon={Calendar}
                label="最近提交"
                value={formatDate(skill.lastCommit)}
              />
              <Meta
                icon={Calendar}
                label="首次收录"
                value={formatDate(skill.firstSeen)}
              />
            </dl>
          </Card>
        </aside>
      </div>
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
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mb-1">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="text-lg font-bold">{value}</div>
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
