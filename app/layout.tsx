import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkillDetailProvider } from '@/components/skill/SkillDetailProvider';

export const metadata: Metadata = {
  title: 'SkillHot — 发现适合你的 Agent Skills',
  description:
    '从 1500+ GitHub Agent Skills 中筛选、分类、排序，让找 Skill 不再比用 Skill 还累。涵盖 UI 设计、编程开发、办公效率、内容创作、数据分析等 14 个分类。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <SkillDetailProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SkillDetailProvider>
      </body>
    </html>
  );
}
