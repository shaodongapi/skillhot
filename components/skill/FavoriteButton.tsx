'use client';

import * as React from 'react';
import { Heart, Check, Copy, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFavorites, isFavorite, toggleFavorite } from '@/lib/favorites';
import type { Skill } from '@/lib/types';

export function FavoriteButton({ skill, size = 'sm' }: { skill: Skill; size?: 'sm' | 'default' }) {
  const [fav, setFav] = React.useState(false);

  React.useEffect(() => {
    setFav(isFavorite(skill.id));
  }, [skill.id]);

  React.useEffect(() => {
    const handler = () => setFav(isFavorite(skill.id));
    window.addEventListener('skillhot:favorites-changed', handler);
    return () => window.removeEventListener('skillhot:favorites-changed', handler);
  }, [skill.id]);

  return (
    <Button
      variant={fav ? 'default' : 'outline'}
      size={size}
      onClick={() => {
        const next = toggleFavorite(skill.id);
        setFav(next);
      }}
    >
      <Heart className={fav ? 'fill-current' : ''} />
      {fav ? '已收藏' : '收藏'}
    </Button>
  );
}

export function CopyInstallButton({ skill }: { skill: Skill }) {
  const [copied, setCopied] = React.useState(false);
  if (!skill.installCmd) return null;
  return (
    <Button
      variant="default"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(skill.installCmd!);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {}
      }}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? '已复制' : '复制安装命令'}
    </Button>
  );
}

export function OpenGithubButton({ skill }: { skill: Skill }) {
  return (
    <Button variant="outline" size="sm" asChild>
      <a href={skill.url} target="_blank" rel="noopener noreferrer">
        <Github /> 在 GitHub 打开
      </a>
    </Button>
  );
}
