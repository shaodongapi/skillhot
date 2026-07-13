import Link from 'next/link';
import { Sparkles, TrendingUp, ArrowRight, Library, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/skill/FeatureCard';
import { SkillRow } from '@/components/skill/SkillRow';
import { CollectionCard } from '@/components/collection/CollectionCard';
import { HeroSearch } from '@/components/home/HeroSearch';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import {
  getStats,
  getRecentSkills,
  getCollections,
  sortBy,
} from '@/lib/data';
import { categories } from '@/data/categories';
import { skills as allSkills } from '@/data/skills';
import { formatDate } from '@/lib/utils';

export default function HomePage() {
  const stats = getStats();
  const recent = getRecentSkills(7, 8);
  const collections = getCollections().slice(0, 6);
  const trending = sortBy(allSkills, 'popularity').slice(0, 10);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute top-12 left-[10%] h-72 w-72 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-32 left-[35%] h-64 w-64 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 left-[20%] h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 hidden lg:flex h-full w-[28rem] opacity-30 pointer-events-none">
          {categories.slice(0, 7).map((c, i) => (
            <div
              key={c.id}
              className="flex-1"
              style={{ background: `hsl(${(i * 360) / 7} 70% 60% / 0.18)` }}
            />
          ))}
        </div>
        <div className="container py-12 md:py-16 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-medium mb-4">
              <Sparkles className="h-3 w-3" /> 每日自动同步 GitHub
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              发现{' '}
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                Agent Skills
              </span>
            </h1>
            <p className="text-muted-foreground md:text-lg mb-6">
              {stats.totalSkills}+ Claude Code · Cursor · Cline 生态 Skills，按场景分类、热度排序。每日同步 GitHub，附中文翻译与一键安装命令。
            </p>
            <HeroSearch />
            <div className="flex flex-wrap gap-3 mt-4">
              <Button asChild size="lg">
                <Link href="/ranking">
                  <TrendingUp className="h-4 w-4" /> 看榜单
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/categories">浏览分类</Link>
              </Button>
            </div>
            <div className="mt-6 text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
              <span><strong className="text-foreground">{stats.totalSkills}+</strong> Skills</span>
              <span className="opacity-50">·</span>
              <span><strong className="text-foreground">{stats.totalCategories}</strong> 分类</span>
              <span className="opacity-50">·</span>
              <span>同步于 {formatDate(stats.lastSync)}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container space-y-12">
        {/* 本周新发现 */}
        <section className="space-y-4">
          <SectionHeader
            icon={Sparkles}
            title="本周新发现"
            subtitle="最近 7 天首次收录的项目"
            href="/ranking?sort=recent"
            hrefLabel="查看全部"
          />
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">本周暂无新项目。</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto scrollbar-thin snap-x pb-2 -mx-1 px-1">
              {recent.map((s) => (
                <FeatureCard key={s.id} skill={s} />
              ))}
            </div>
          )}
        </section>

        {/* 精选合集 */}
        <section className="space-y-4">
          <SectionHeader
            icon={Library}
            iconClassName="text-rose-500"
            title="精选技能合集"
            subtitle="踩在巨人的肩膀上"
            href="/collections"
            hrefLabel="查看全部"
          />
          <div className="flex gap-3 overflow-x-auto scrollbar-thin snap-x pb-2 -mx-1 px-1">
            {collections.map((c) => (
              <CollectionCard
                key={c.id}
                collection={c}
                skills={c.skills}
                variant="carousel"
              />
            ))}
          </div>
        </section>

        {/* 热门精选 Top 10 */}
        <section className="space-y-4">
          <SectionHeader
            icon={TrendingUp}
            iconClassName="text-amber-500"
            title="热门精选 Top 10"
            subtitle="综合热度最高"
            href="/ranking"
            hrefLabel="完整榜单"
          />
          <div className="space-y-2">
            {trending.map((s, i) => (
              <SkillRow key={s.id} skill={s} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* 分类入口 */}
        <section className="space-y-4">
          <SectionHeader
            icon={LayoutGrid}
            iconClassName="text-emerald-500"
            title="按分类浏览"
            subtitle="14 个分类，按使用场景整理"
            href="/categories"
            hrefLabel="全部分类"
          />
          <CategoryGrid />
        </section>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  iconClassName,
  title,
  subtitle,
  href,
  hrefLabel,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {Icon && <Icon className={`h-5 w-5 ${iconClassName ?? 'text-primary'}`} />}
          {title}
        </h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {href && hrefLabel && (
        <Link
          href={href}
          className="text-sm text-muted-foreground hover:text-primary inline-flex items-center shrink-0"
        >
          {hrefLabel} <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
        </Link>
      )}
    </div>
  );
}
