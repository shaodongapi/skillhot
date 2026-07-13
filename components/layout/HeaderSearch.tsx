'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function HeaderSearch() {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [q, setQ] = React.useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-xs hidden md:block">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="搜索（⌘K）"
        className="pl-8 h-8 text-sm bg-muted/40 border-transparent focus-visible:bg-background focus-visible:border-input"
        aria-label="搜索 Skill"
      />
    </form>
  );
}
