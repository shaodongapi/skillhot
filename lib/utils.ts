import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000);
  if (diff < 1) return '今天';
  if (diff < 2) return '昨天';
  if (diff < 7) return `${Math.floor(diff)} 天前`;
  if (diff < 30) return `${Math.floor(diff / 7)} 周前`;
  if (diff < 365) return `${Math.floor(diff / 30)} 个月前`;
  return `${Math.floor(diff / 365)} 年前`;
}

export function relativeDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
  if (diff === 0) return '今天更新';
  if (diff === 1) return '昨天更新';
  if (diff < 7) return `${diff} 天前更新`;
  if (diff < 30) return `${Math.floor(diff / 7)} 周前更新`;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
