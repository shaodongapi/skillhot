'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SkillCard } from '@/components/skill/SkillCard';
import { searchSkills } from '@/lib/data';

export default function SearchPage() {
  return (
    <React.Suspense fallback={<div className="container py-8">加载中...</div>}>
      <SearchInner />
    </React.Suspense>
  );
}

function SearchInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [q, setQ] = React.useState(searchParams.get('q') || '');

  React.useEffect(() => {
    setQ(searchParams.get('q') || '');
  }, [searchParams]);

  const results = React.useMemo(() => searchSkills(q), [q]);

  return (
    <div className="container py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          搜索
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
        >
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索项目名、描述、话题..."
            className="max-w-lg"
            autoFocus
          />
        </form>
      </header>

      {q && (
        <p className="text-sm text-muted-foreground mb-4">
          找到 <span className="text-foreground font-semibold">{results.length}</span> 个与 「{q}」 相关的项目
        </p>
      )}

      {results.length === 0 ? (
        q ? (
          <p className="text-sm text-muted-foreground">没有匹配的项目，试试别的关键词。</p>
        ) : (
          <p className="text-sm text-muted-foreground">输入关键词开始搜索。</p>
        )
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {results.map((s) => (
            <SkillCard key={s.id} skill={s} />
          ))}
        </div>
      )}
    </div>
  );
}
