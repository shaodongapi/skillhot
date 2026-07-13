import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { categories } from '@/data/categories';
import { getCategoryCount } from '@/lib/data';
import { CategoryIcon } from '@/lib/category-icons';
import { cn } from '@/lib/utils';

export const metadata = {
  title: '分类 — SkillHot',
  description: '按 14 个使用场景浏览 Agent Skills：UI 设计、编程开发、办公效率等。',
};

export default function CategoriesPage() {
  return (
    <div className="container py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">分类总览</h1>
        <p className="text-sm text-muted-foreground mt-1">
          按 {categories.length} 个实际使用场景整理，每个分类都附有简介和项目数。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((c) => {
          const count = getCategoryCount(c.id);
          return (
            <Link key={c.id} href={`/categories/${c.slug}`} className="group">
              <Card
                className={cn(
                  'relative overflow-hidden p-5 cursor-pointer h-full transition-all hover:shadow-lg hover:-translate-y-0.5 border-0 bg-gradient-to-br',
                  c.gradientClass
                )}
              >
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/15 blur-2xl pointer-events-none" />
                <div className="relative flex items-start gap-3">
                  <div className="rounded-lg bg-white/20 backdrop-blur p-2 border border-white/30 shrink-0">
                    <CategoryIcon id={c.id} className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-lg text-white drop-shadow-sm">{c.name}</h3>
                      <ArrowRight className="h-4 w-4 text-white/70 group-hover:translate-x-0.5 group-hover:text-white transition-all shrink-0" />
                    </div>
                    <p className="text-xs text-white/85 leading-relaxed line-clamp-2 mb-2">
                      {c.description}
                    </p>
                    <span className="text-[11px] font-medium text-white/95 inline-flex items-center gap-1.5">
                      <span className="inline-block h-1 w-1 rounded-full bg-white/80" />
                      {count} 个项目
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
