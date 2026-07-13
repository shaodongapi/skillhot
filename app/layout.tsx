import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkillDetailProvider } from '@/components/skill/SkillDetailProvider';

export const metadata: Metadata = {
  title: 'SkillHot — 发现 Agent Skills | Claude Code · Cursor · Cline',
  description:
    '1800+ GitHub Skills 按场景分类、热度排序，附中文简介和安装命令。每日同步，3 秒判断要不要深入。',
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
