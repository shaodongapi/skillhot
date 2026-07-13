import Link from 'next/link';
import { Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getAllTopics } from '@/lib/data';
import { topicCssVars } from '@/lib/topic-color';

export const metadata = {
  title: '话题 — SkillHot',
  description: '基于 GitHub topics 聚合的生态话题，从另一种维度发现 Agent Skills。',
};

export default function TopicsPage() {
  const topics = getAllTopics();

  return (
    <div className="container py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">话题</h1>
        <p className="text-sm text-muted-foreground">
          基于 GitHub topics 聚合的 {topics.length} 个生态话题，分类里翻不到的跨领域好东西，顺着话题就能串起来。
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {topics.map((t) => (
          <Link key={t.id} href={`/topics/${t.id}`} className="group">
            <Card
              style={topicCssVars(t.id)}
              className="relative overflow-hidden p-3 pl-4 hover:shadow-md cursor-pointer flex items-center justify-between gap-2 border transition-all hover:-translate-y-0.5"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[hsl(var(--topic-hue)_70%_50%)]" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate inline-flex items-center gap-1">
                  <Hash className="h-3 w-3 text-[hsl(var(--topic-hue)_70%_45%)] dark:text-[hsl(var(--topic-hue)_70%_65%)]" />
                  {t.displayName}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono truncate">{t.id}</div>
              </div>
              <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--topic-hue)_70%_50%_/_0.15)] text-[hsl(var(--topic-hue)_70%_35%)] dark:text-[hsl(var(--topic-hue)_70%_75%)] font-medium">
                {t.count}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
