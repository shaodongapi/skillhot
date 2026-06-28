import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Hash } from 'lucide-react';
import { getAllTopics, getSkillsByTopic, sortBy } from '@/lib/data';
import { SkillCard } from '@/components/skill/SkillCard';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTopics().map((t) => ({ slug: t.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `#${params.slug} — SkillHot` };
}

export default function TopicDetailPage({ params }: { params: { slug: string } }) {
  const topic = getAllTopics().find((t) => t.id === params.slug);
  if (!topic) notFound();

  const skills = sortBy(getSkillsByTopic(topic.id), 'popularity');

  return (
    <div className="container py-8">
      <nav className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/topics" className="hover:text-foreground">话题</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">#{topic.id}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Hash className="h-5 w-5 text-primary" />
          {topic.displayName}
        </h1>
        <p className="text-sm text-muted-foreground">
          共 {skills.length} 个相关项目
        </p>
      </header>

      {skills.length === 0 ? (
        <p className="text-sm text-muted-foreground">这个话题暂无项目。</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {skills.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </div>
      )}
    </div>
  );
}
