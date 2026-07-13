import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Collection, Skill } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  collection: Collection;
  skills: Skill[];
  className?: string;
  variant?: 'grid' | 'carousel';
}

function hashHue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export function CollectionCard({ collection, skills, className, variant = 'grid' }: Props) {
  const hue = collection.cover ? undefined : hashHue(collection.id);
  const isCarousel = variant === 'carousel';

  return (
    <Link
      href={`/collections/${collection.id}`}
      className={cn(
        'group block h-full',
        isCarousel && 'w-[320px] shrink-0 snap-start',
        className
      )}
    >
      <Card className="overflow-hidden hover:border-primary/40 hover:shadow-md transition-all h-full flex flex-col p-0">
        <div
          className="h-20 relative"
          style={
            collection.cover
              ? { backgroundImage: `url(${collection.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue! + 40) % 360} 65% 45%))` }
          }
        >
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-white text-xs font-bold border border-white/40">
                {initials(collection.curator)}
              </div>
              <div className="text-white text-xs font-medium drop-shadow-sm">
                {collection.curator}
              </div>
            </div>
            <Badge className="bg-white/25 text-white border-white/30 backdrop-blur">
              {skills.length} 个项目
            </Badge>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold group-hover:text-primary transition-colors">{collection.title}</h3>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{collection.description}</p>
          <div className="flex flex-wrap gap-1 mt-auto">
            {skills.slice(0, 4).map((s) => (
              <Badge key={s.id} variant="outline" className="text-[10px]">
                {s.name}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="outline" className="text-[10px]">+{skills.length - 4}</Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
