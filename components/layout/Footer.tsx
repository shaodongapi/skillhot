import Link from 'next/link';
import { Flame, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
            <Flame className="h-3 w-3" />
          </span>
          <span>SkillHot — 发现 Agent Skills</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hover:text-foreground">关于</Link>
          <a
            href="https://github.com/anthropics/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
