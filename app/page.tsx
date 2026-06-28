import Link from 'next/link';
import { Sparkles, TrendingUp, ArrowRight, Library, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkillCard } from '@/components/skill/SkillCard';
import { RandomWalk } from '@/components/home/RandomWalk';
import {
  getStats,
  getRecentSkills,
  getCollections,
  sortBy,
} from '@/lib/data';
import { skills as allSkills } from '@/data/skills';
import { formatDate } from '@/lib/utils';

export default function HomePage() {
  const stats = getStats();
  const recent = getRecentSkills(7, 8);
  const collections = getCollections().slice(0, 4);
  const topFeatured = sortBy(allSkills, 'popularity').slice(0, 6);

  return (
    <div className="container py-8 space-y-10">
      <section className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-accent/60 via-background to-background p-6 md:p-10">
        <div className="relative z-10 max-w-3xl">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="h-3 w-3 mr-1" /> 每日自动同步 GitHub
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            发现适合你的 <span className="text-primary">Agent Skills</span>
          </h1>
          <p className="text-muted-foreground md:text-lg mb-6">
            从 {stats.totalSkills}+ 开源 Skill 工具与热门项目中，按使用场景整理成 {stats.totalCategories} 个分类，让找 Skill 不再比用 Skill 还累。
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/ranking">
                <TrendingUp className="h-4 w-4" /> 看榜单
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/categories">浏览分类</Link>
            </Button>
          </div>
        </div>
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 right-12 h-40 w-40 rounded-full bg-orange-300/20 blur-3xl" />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label="收录仓库" value={`${stats.totalSkills}+`} hint="持续增长" />
        <StatCard label="分类数" value={String(stats.totalCategories)} hint="按使用场景" />
        <StatCard
          label="最近同步"
          value={formatDate(stats.lastSync)}
          hint="自动每日更新"
          icon={Calendar}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">本周新发现</h2>
            <span className="text-xs text-muted-foreground">最近 7 天首次收录</span>
          </div>
          <Link
            href="/ranking?sort=recent"
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
          >
            查看全部 <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">本周暂无新项目。</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {recent.map((s) => (
              <SkillCard key={s.id} skill={s} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Library className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">精选技能合集</h2>
            <span className="text-xs text-muted-foreground">踩在巨人的肩膀上</span>
          </div>
          <Link
            href="/collections"
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
          >
            查看全部 <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {collections.map((c) => (
            <Link key={c.id} href={`/collections/${c.id}`}>
              <Card className="p-4 hover:border-primary/40 hover:shadow-md cursor-pointer h-full">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold">{c.title}</h3>
                  <Badge variant="secondary">{c.skills.length} 个项目</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
                <div className="flex flex-wrap gap-1">
                  {c.skills.slice(0, 4).map((s) => (
                    <Badge key={s.id} variant="outline" className="text-[10px]">
                      {s.name}
                    </Badge>
                  ))}
                  {c.skills.length > 4 && (
                    <Badge variant="outline" className="text-[10px]">
                      +{c.skills.length - 4}
                    </Badge>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">热门精选</h2>
          <span className="text-xs text-muted-foreground">综合热度最高</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {topFeatured.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </div>
      </section>

      <RandomWalk />
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="p-4">
      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </div>
      <div className="text-2xl font-bold mb-0.5">{value}</div>
      <div className="text-[11px] text-muted-foreground">{hint}</div>
    </Card>
  );
}
