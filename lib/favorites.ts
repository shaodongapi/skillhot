'use client';

const KEY = 'skillhot:favorites';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string): boolean {
  const list = getFavorites();
  const idx = list.indexOf(id);
  let nowFavorite: boolean;
  if (idx >= 0) {
    list.splice(idx, 1);
    nowFavorite = false;
  } else {
    list.push(id);
    nowFavorite = true;
  }
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('skillhot:favorites-changed'));
  return nowFavorite;
}
