import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { getCollections, getCollectionById } from '@/lib/data';
import { SkillCard } from '@/components/skill/SkillCard';
import { Badge } from '@/components/ui/badge';

export const dynamicParams = false;

export function generateStaticParams() {
  return getCollections().map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const c = getCollectionById(params.id);
  return { title: `${c?.title ?? '合集'} — SkillHot` };
}

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  const collection = getCollectionById(params.id);
  if (!collection) notFound();

  return (
    <div className="container py-8">
      <nav className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/collections" className="hover:text-foreground">合集</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{collection.title}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{collection.title}</h1>
        <p className="text-sm text-muted-foreground mb-2">{collection.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>收录者：<span className="text-foreground">{collection.curator}</span></span>
          <span>共 {collection.skills.length} 个项目</span>
          {collection.repoUrl && (
            <a
              href={collection.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-primary hover:underline"
            >
              源仓库 <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {collection.skills.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </div>
    </div>
  );
}
