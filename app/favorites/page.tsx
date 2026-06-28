'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SkillCard } from '@/components/skill/SkillCard';
import { getFavorites } from '@/lib/favorites';
import { skills as allSkills } from '@/data/skills';

export default function FavoritesPage() {
  const [ids, setIds] = React.useState<string[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const load = () => setIds(getFavorites());
    load();
    setHydrated(true);
    window.addEventListener('skillhot:favorites-changed', load);
    return () => window.removeEventListener('skillhot:favorites-changed', load);
  }, []);

  const favSkills = ids.map((id) => allSkills.find((s) => s.id === id)).filter(Boolean) as typeof allSkills;

  return (
    <div className="container py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-current" />
          我的收藏
        </h1>
        <p className="text-sm text-muted-foreground">
          好技能一定要收藏起来，下次想用时直接来这里。
        </p>
      </header>

      {!hydrated ? null : favSkills.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground mb-4">还没有收藏任何 Skill。</p>
          <Button asChild>
            <Link href="/">
              去发现 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {favSkills.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </div>
      )}
    </div>
  );
}
