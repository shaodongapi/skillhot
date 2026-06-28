'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Search, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/', label: '发现', icon: Flame },
  { href: '/ranking', label: '榜单', icon: null },
  { href: '/categories', label: '分类', icon: null },
  { href: '/topics', label: '话题', icon: null },
  { href: '/collections', label: '合集', icon: null },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Flame className="h-4 w-4" />
          </span>
          <span className="text-base">
            Skill<span className="text-primary">Hot</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {nav.map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 rounded-md transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="搜索"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/favorites"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="我的收藏"
          >
            <Heart className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <nav className="md:hidden border-t">
        <div className="container flex items-center gap-1 overflow-x-auto py-2 text-sm scrollbar-thin">
          {nav.map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'shrink-0 px-3 py-1 rounded-md',
                  active ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
