import Link from 'next/link';
import { Flame } from 'lucide-react';

export const metadata = {
  title: '关于 — SkillHot',
};

export default function AboutPage() {
  return (
    <div className="container py-8 max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <Flame className="h-6 w-6 text-primary" />
          关于 SkillHot
        </h1>
      </header>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          <span className="text-foreground font-medium">SkillHot</span> 是一个发现 Claude Code / Agent Skills 的网站。
          我们从 GitHub 上抓取开源的 Skill 工具与热门项目，按实际使用场景整理成 14 个分类，每日根据活跃度自动更新。
        </p>
        <p>
          我们的核心目标：让"找 Skill"不再比"用 Skill"还累。
        </p>

        <h2 className="text-base font-semibold text-foreground pt-2">四个核心模块</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <Link href="/" className="text-primary hover:underline">发现</Link>：
            每日同步、本周新发现、精选合集、随机漫游。
          </li>
          <li>
            <Link href="/ranking" className="text-primary hover:underline">榜单</Link>：
            综合热度 / Stars / 最近更新 三种排序。
          </li>
          <li>
            <Link href="/categories" className="text-primary hover:underline">分类</Link>：
            14 个使用场景维度的项目导航。
          </li>
          <li>
            <Link href="/topics" className="text-primary hover:underline">话题</Link>：
            基于 GitHub topics 的另一种发现维度。
          </li>
        </ul>

        <h2 className="text-base font-semibold text-foreground pt-2">综合热度算法</h2>
        <pre className="bg-muted/50 rounded-md p-3 text-xs font-mono whitespace-pre-wrap">
{`score = stars × 1.0
      + commits30d × 5
      + starGrowth30d × 2
      + (有安装命令 ? 50 : 0)
      − (lastCommit 超 180 天 ? 200 : 0)`}
        </pre>
        <p>这个分数会奖励"现在真的有人在用、还在持续迭代"的项目。</p>
      </div>
    </div>
  );
}
