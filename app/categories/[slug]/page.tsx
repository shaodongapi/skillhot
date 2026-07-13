import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { categories, categoryMap } from '@/data/categories';
import { getSkillsByCategory, sortBy } from '@/lib/data';
import { SkillCard } from '@/components/skill/SkillCard';
import { CategoryIcon } from '@/lib/category-icons';
import { cn } from '@/lib/utils';
import { CategorySkillsClient } from './CategorySkillsClient';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const cat = categories.find((c) => c.slug === params.slug);
  return { title: `${cat?.name ?? '分类'} — SkillHot` };
}

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const skills = getSkillsByCategory(category.id);
  const defaultSorted = sortBy(skills, 'popularity');

  return (
    <div className="container py-8">
      <nav className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/categories" className="hover:text-foreground">分类</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className={cn('inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md', category.gradientClass)}>
            <CategoryIcon id={category.id} className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <span className="text-sm text-muted-foreground">({skills.length} 个项目)</span>
        </div>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </header>

      <CategorySkillsClient skills={skills} defaultSort="popularity" />
    </div>
  );
}
