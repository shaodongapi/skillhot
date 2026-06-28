'use client';

import * as React from 'react';
import { Shuffle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SkillCard } from '@/components/skill/SkillCard';
import { getRandomSkills } from '@/lib/data';
import type { Skill } from '@/lib/types';

export function RandomWalk() {
  const [items, setItems] = React.useState<Skill[]>([]);

  const refresh = React.useCallback(() => {
    setItems(getRandomSkills(8, items.map((s) => s.id)));
  }, [items]);

  React.useEffect(() => {
    setItems(getRandomSkills(8));
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shuffle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">随机漫游</h2>
          <span className="text-xs text-muted-foreground">不知道找什么？随便看看</span>
        </div>
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className="h-3.5 w-3.5" /> 换一批
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </div>
    </section>
  );
}
