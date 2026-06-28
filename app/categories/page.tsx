import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { categories } from '@/data/categories';
import { getCategoryCount } from '@/lib/data';

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
            <Link key={c.id} href={`/categories/${c.slug}`}>
              <Card className="p-4 hover:border-primary/40 hover:shadow-md cursor-pointer h-full">
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{c.name}</h3>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                      {c.description}
                    </p>
                    <span className="text-[11px] text-primary font-medium">{count} 个项目</span>
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
