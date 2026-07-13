import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { categories } from '@/data/categories';
import { CategoryIcon } from '@/lib/category-icons';
import { getCategoryCount } from '@/lib/data';
import { cn } from '@/lib/utils';

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {categories.map((c) => {
        const count = getCategoryCount(c.id);
        return (
          <Link key={c.id} href={`/categories/${c.slug}`} className="group">
            <Card
              className={cn(
                'relative overflow-hidden p-3 h-full flex flex-col gap-2 transition-all hover:shadow-md hover:-translate-y-0.5 border',
                c.colorClass
              )}
            >
              <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', c.gradientClass)} />
              <div className="flex items-center justify-between mt-1">
                <div className={cn('inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br text-white shadow-sm', c.gradientClass)}>
                  <CategoryIcon id={c.id} className="h-5 w-5" />
                </div>
                <ArrowRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="text-[11px] opacity-70">{count} 个项目</div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
