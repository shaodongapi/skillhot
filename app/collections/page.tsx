import Link from 'next/link';
import { Library, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCollections } from '@/lib/data';

export const metadata = {
  title: '精选合集 — SkillHot',
  description: '热门项目官方与各路大神的 Skill 合集及最佳实践。',
};

export default function CollectionsPage() {
  const collections = getCollections();

  return (
    <div className="container py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Library className="h-6 w-6 text-primary" />
          精选技能合集
        </h1>
        <p className="text-sm text-muted-foreground">
          把官方/大神的 Skill 合集与最佳实践整理出来，直接踩在巨人的肩膀上。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {collections.map((c) => (
          <Link key={c.id} href={`/collections/${c.id}`}>
            <Card className="p-5 hover:border-primary/40 hover:shadow-md cursor-pointer h-full">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg">{c.title}</h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
              <div className="text-xs text-muted-foreground mb-3">
                收录者：<span className="text-foreground">{c.curator}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {c.skills.slice(0, 5).map((s) => (
                  <Badge key={s.id} variant="outline" className="text-[10px]">
                    {s.name}
                  </Badge>
                ))}
                {c.skills.length > 5 && (
                  <Badge variant="outline" className="text-[10px]">
                    +{c.skills.length - 5}
                  </Badge>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
