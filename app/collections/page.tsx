import { Library } from 'lucide-react';
import { getCollections } from '@/lib/data';
import { CollectionCard } from '@/components/collection/CollectionCard';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {collections.map((c) => (
          <CollectionCard key={c.id} collection={c} skills={c.skills} />
        ))}
      </div>
    </div>
  );
}
