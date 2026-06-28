import Link from 'next/link';
import { Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getAllTopics } from '@/lib/data';

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
          <Link key={t.id} href={`/topics/${t.id}`}>
            <Card className="p-3 hover:border-primary/40 hover:shadow-md cursor-pointer flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate inline-flex items-center gap-1">
                  <Hash className="h-3 w-3 text-muted-foreground" />
                  {t.displayName}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono truncate">{t.id}</div>
              </div>
              <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {t.count}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
