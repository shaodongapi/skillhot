/**
 * 同步脚本（增量优化版）：
 *   1. 解析 awesome-lists 得到所有 repo 引用
 *   2. GraphQL 批量拉取元数据（1 次查询 50 个 repo，代替 N×4 REST）
 *   3. 区分新 repo vs 已收录：仅对新 repo 拉 README 并重新分类
 *   4. starGrowth30d 仍走 REST（GraphQL 不支持）
 *   5. 合并、排序、写盘
 *
 * 用法：
 *   npx tsx scripts/sync-skills.ts              # 全量
 *   npx tsx scripts/sync-skills.ts --dry-run    # 只打印
 *   npx tsx scripts/sync-skills.ts --limit 20   # 调试
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { resolve } from 'node:path';
import pLimit from 'p-limit';
import type { Skill } from '../lib/types';
import { fetchReadme, starGrowthSince } from '../lib/sync/github';
import { fetchReposBatch, type RepoRef } from '../lib/sync/github-graphql';
import { extractReposFromMarkdown, detectInstallCommand } from '../lib/sync/parser';
import { classify } from '../lib/sync/classifier';
import { detectPlatforms } from '../lib/sync/platform';
import { computePopularity } from '../lib/sync/score';

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const LIMIT = args.has('--limit')
  ? parseInt(process.argv[process.argv.indexOf('--limit') + 1], 10)
  : undefined;

const DATA_PATH = resolve(process.cwd(), 'data/skills.json');
const SOURCES_PATH = resolve(process.cwd(), 'data/sources.json');

interface Sources {
  awesomeLists: Array<{ owner: string; repo: string; enabled: boolean }>;
  repos: Array<{ owner: string; repo: string }>;
}

const concurrencyLimit = pLimit(3);

async function main() {
  console.log(`\n=== SkillHot 同步脚本（增量版） ${DRY_RUN ? '(dry-run)' : ''} ===\n`);

  const sources = JSON.parse(readFileSync(SOURCES_PATH, 'utf8')) as Sources;
  const existing: Skill[] = existsSync(DATA_PATH)
    ? (JSON.parse(readFileSync(DATA_PATH, 'utf8')) as Skill[])
    : [];
  const existingMap = new Map(existing.map((s) => [s.id.toLowerCase(), s]));
  console.log(`本地已有 ${existing.length} 条`);

  // === Step 1: 解析 awesome-lists 得到 refs ===
  const refsMap = new Map<string, RepoRef>();

  for (const list of sources.awesomeLists) {
    if (!list.enabled) continue;
    console.log(`[list] ${list.owner}/${list.repo} - 拉取 README...`);
    const readme = await fetchReadme(list.owner, list.repo);
    const found = extractReposFromMarkdown(readme);
    console.log(`  解析出 ${found.length} 个 repo`);
    for (const r of found) {
      refsMap.set(`${r.owner}/${r.repo}`.toLowerCase(), { owner: r.owner, repo: r.repo });
    }
  }
  for (const r of sources.repos) {
    refsMap.set(`${r.owner}/${r.repo}`.toLowerCase(), { owner: r.owner, repo: r.repo });
  }

  let allRefs = Array.from(refsMap.values());
  if (LIMIT) allRefs = allRefs.slice(0, LIMIT);
  console.log(`\n待抓取 repo 总数：${allRefs.length}`);

  // === Step 2: GraphQL 批量拉元数据 ===
  const since30d = new Date(Date.now() - 30 * 86400000).toISOString();
  console.log(`\n[graphql] 开始批量拉取元数据（50/批）...`);
  const metaMap = await fetchReposBatch(allRefs, since30d);

  // === Step 3: 区分新 repo vs 已收录（增量核心） ===
  const newRefs: RepoRef[] = [];
  const cachedSkills: Skill[] = [];

  for (const ref of allRefs) {
    const id = `${ref.owner}/${ref.repo}`.toLowerCase();
    const item = metaMap.get(id);
    if (!item?.meta) continue;

    const prev = existingMap.get(id);
    if (!prev) {
      newRefs.push(ref);
    } else if (prev.lastCommit === item.meta.pushed_at) {
      // pushed_at 未变：复用已有分类/平台/翻译/install，只更新基础元数据
      cachedSkills.push({
        ...prev,
        stars: item.meta.stargazers_count,
        forks: item.meta.forks_count,
        topics: item.meta.topics,
        archived: item.meta.archived,
        commits30d: item.commits30d,
        lastCommit: item.meta.pushed_at,
      });
    } else {
      // pushed_at 变了：需要重新分类（拉新 README）
      newRefs.push(ref);
    }
  }

  console.log(`\n增量分析：新/需重分类 ${newRefs.length} · 复用缓存 ${cachedSkills.length}`);

  // === Step 4: 对新 repo 拉 README + 分类 + 平台 + 安装命令（并发 8）===
  // 同时为所有 repo 拉 starGrowth30d（GraphQL 不支持，只能 REST）
  const fetchedSkills: Skill[] = [];

  console.log(`\n[new] 处理 ${newRefs.length} 个新 repo（README + 分类 + 翻译待办）...`);
  let newIdx = 0;
  await Promise.all(
    newRefs.map((ref) =>
      concurrencyLimit(async () => {
        newIdx += 1;
        const id = `${ref.owner}/${ref.repo}`.toLowerCase();
        const item = metaMap.get(id)!;
        const meta = item.meta!;
        const prev = existingMap.get(id);
        process.stdout.write(`  [${newIdx}/${newRefs.length}] ${id} ... `);

        const readme = await fetchReadme(ref.owner, ref.repo);
        const starGrowth30d = await starGrowthSince(ref.owner, ref.repo, since30d);

        const category = classify({
          name: meta.name,
          description: meta.description || '',
          topics: meta.topics,
          readme,
        });
        const platforms = detectPlatforms({
          description: meta.description || '',
          topics: meta.topics,
          readme,
        });
        const installCmd = detectInstallCommand(meta.name, readme, meta.homepage);

        const skill: Skill = {
          id: meta.full_name.toLowerCase(),
          name: meta.name,
          description: meta.description || prev?.description || meta.name,
          descriptionZh: prev?.descriptionZh || '',
          url: meta.html_url,
          homepage: meta.homepage || null,
          stars: meta.stargazers_count,
          forks: meta.forks_count,
          topics: meta.topics,
          language: meta.language,
          category,
          platforms,
          useCases: prev?.useCases || [],
          installCmd,
          lastCommit: meta.pushed_at,
          commits30d: item.commits30d,
          starGrowth30d,
          firstSeen: prev?.firstSeen || new Date().toISOString(),
          featured: prev?.featured || false,
          archived: meta.archived,
        };

        console.log(`★${skill.stars} cat=${category} ${skill.descriptionZh ? '(已译)' : '(待译)'}`);
        fetchedSkills.push(skill);
      })
    )
  );

  // === Step 5: 为 cached 补 starGrowth30d（增量也是数据）===
  // 但为节省 REST 调用，cached 的 starGrowth 也复用（30 天内变化不大）
  // 仅当上次更新超过 1 天才重新拉
  const oneDayAgo = Date.now() - 86400000;
  const needStarRefresh = cachedSkills.filter(
    (s) => !s.firstSeen || new Date(s.lastCommit).getTime() > oneDayAgo
  );
  if (needStarRefresh.length > 0 && needStarRefresh.length < 200) {
    console.log(`\n[star] 为 ${needStarRefresh.length} 个活跃 repo 刷新 starGrowth30d...`);
    await Promise.all(
      needStarRefresh.map((s) =>
        concurrencyLimit(async () => {
          const [owner, repo] = s.id.split('/');
          s.starGrowth30d = await starGrowthSince(owner, repo, since30d);
        })
      )
    );
  }

  // === Step 6: 关键：保留本次未抓取的已收录项目（孤儿）===
  const fetchedIds = new Set<string>();
  for (const ref of allRefs) {
    fetchedIds.add(`${ref.owner}/${ref.repo}`.toLowerCase());
  }
  const orphans = existing.filter((s) => !fetchedIds.has(s.id.toLowerCase()));
  if (orphans.length > 0) {
    console.log(`\n保留已收录但本次未抓取的项目：${orphans.length} 条`);
  }

  // === Step 7: 合并 + 排序 ===
  const result = [...fetchedSkills, ...cachedSkills, ...orphans];
  result.sort((a, b) => computePopularity(b) - computePopularity(a));

  console.log(`\n=== 同步完成 ===`);
  console.log(`成功抓取/更新：${fetchedSkills.length}`);
  console.log(`复用缓存：${cachedSkills.length}`);
  console.log(`孤儿保留：${orphans.length}`);
  console.log(`总计：${result.length}`);
  const pendingZh = result.filter((s) => !s.descriptionZh).length;
  console.log(`待翻译中文简介：${pendingZh}`);

  if (DRY_RUN) {
    console.log('\n[dry-run] 不写入文件。');
    return;
  }

  writeFileSync(DATA_PATH, JSON.stringify(result, null, 2) + '\n', 'utf8');
  console.log(`\n✓ 已写入 ${DATA_PATH}`);
}

main().catch((e) => {
  console.error('\n同步失败：', e);
  process.exit(1);
});
