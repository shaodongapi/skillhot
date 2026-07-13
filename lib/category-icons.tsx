import {
  Palette,
  Code2,
  FileSpreadsheet,
  PenLine,
  BarChart3,
  BrainCircuit,
  Rocket,
  ShieldCheck,
  Cog,
  BookOpen,
  Clapperboard,
  Microscope,
  ClipboardList,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryId } from '@/lib/types';

const ICONS: Record<CategoryId, LucideIcon> = {
  'ui-design': Palette,
  'coding': Code2,
  'office': FileSpreadsheet,
  'content': PenLine,
  'data': BarChart3,
  'ai-ml': BrainCircuit,
  'devops': Rocket,
  'security': ShieldCheck,
  'automation': Cog,
  'docs': BookOpen,
  'media': Clapperboard,
  'research': Microscope,
  'product': ClipboardList,
  'misc': Sparkles,
};

export function iconKeyFor(id: CategoryId): LucideIcon {
  return ICONS[id] ?? Sparkles;
}

interface Props {
  id: CategoryId;
  className?: string;
}

export function CategoryIcon({ id, className }: Props) {
  const Icon = iconKeyFor(id);
  return <Icon className={className} aria-hidden />;
}
