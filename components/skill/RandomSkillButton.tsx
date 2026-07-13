'use client';

import { Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { skills as allSkills } from '@/data/skills';
import { useSkillDetail } from './SkillDetailProvider';

interface Props {
  label?: string;
}

export function RandomSkillButton({ label = '随机翻一个' }: Props) {
  const { open } = useSkillDetail();

  const onClick = () => {
    const random = allSkills[Math.floor(Math.random() * allSkills.length)];
    if (random) open(random.id);
  };

  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <Shuffle className="h-3.5 w-3.5" /> {label}
    </Button>
  );
}
