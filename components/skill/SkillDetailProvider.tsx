'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SkillDetailDrawer } from './SkillDetailDrawer';

interface Ctx {
  open: (skillId: string) => void;
  close: () => void;
}

const SkillDetailContext = React.createContext<Ctx | null>(null);

export function useSkillDetail() {
  const ctx = React.useContext(SkillDetailContext);
  if (!ctx) throw new Error('useSkillDetail must be used inside SkillDetailProvider');
  return ctx;
}

function readSkillFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('skill');
}

export function SkillDetailProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [skillId, setSkillId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSkillId(readSkillFromUrl());
    const handler = () => setSkillId(readSkillFromUrl());
    window.addEventListener('popstate', handler);
    window.addEventListener('skillhot:url-changed', handler);
    return () => {
      window.removeEventListener('popstate', handler);
      window.removeEventListener('skillhot:url-changed', handler);
    };
  }, []);

  const open = React.useCallback(
    (id: string) => {
      const params = new URLSearchParams(window.location.search);
      params.set('skill', id);
      const next = `${pathname}?${params.toString()}`;
      router.push(next);
      setSkillId(id);
    },
    [router, pathname]
  );

  const close = React.useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete('skill');
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
    setSkillId(null);
  }, [router, pathname]);

  const value = React.useMemo(() => ({ open, close }), [open, close]);

  return (
    <SkillDetailContext.Provider value={value}>
      {children}
      <SkillDetailDrawer skillId={skillId} onClose={close} />
    </SkillDetailContext.Provider>
  );
}
