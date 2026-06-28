/**
 * 同步脚本：从 GitHub 拉取最新 Skill 元数据并合并到 data/skills.json。
 *
 * 用法：
 *   npx tsx scripts/sync-skills.ts              # 全量同步
 *   npx tsx scripts/sync-skills.ts --dry-run    # 只打印不写文件
 *   npx tsx scripts/sync-skills.ts --limit 20   # 限制抓取条数（调试用）
 *
 * 需要环境变量：
 *   GITHUB_TOKEN  GitHub PAT（提高 API 限额，可选）
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { resolve } from 'node:path';
import type { Skill } from '../lib/types';
import {
  fetchRepo,
  fetchReadme,
  countCommitsSince,
  starGrowthSince,
} from '../lib/sync/github';
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

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`\n=== SkillHot 同步脚本 ${DRY_RUN ? '(dry-run)' : ''} ===\n`);

  const sources = JSON.parse(readFileSync(SOURCES_PATH, 'utf8')) as Sources;
  const existing: Skill[] = existsSync(DATA_PATH)
    ? (JSON.parse(readFileSync(DATA_PATH, 'utf8')) as Skill[])
    : [];
  const existingMap = new Map(existing.map((s) => [s.id.toLowerCase(), s]));

  const refs = new Map<string, { owner: string; repo: string }>();

  for (const list of sources.awesomeLists) {
    if (!list.enabled) {
      console.log(`[skip-list] ${list.owner}/${list.repo} (disabled)`);
      continue;
    }
    console.log(`[list] ${list.owner}/${list.repo} - 拉取 README...`);
    const readme = await fetchReadme(list.owner, list.repo);
    const found = extractReposFromMarkdown(readme);
    console.log(`  解析出 ${found.length} 个 repo`);
    for (const r of found) {
      refs.set(`${r.owner}/${r.repo}`.toLowerCase(), r);
    }
  }
  for (const r of sources.repos) {
    refs.set(`${r.owner}/${r.repo}`.toLowerCase(), r);
  }

  const allRefs = Array.from(refs.values());
  if (LIMIT) allRefs.length = Math.min(LIMIT, allRefs.length);
  console.log(`\n待抓取 repo 总数：${allRefs.length}`);

  const since30d = new Date(Date.now() - 30 * 86400000).toISOString();
  const fetchedMap = new Map<string, Skill>();
  let idx = 0;

  for (const ref of allRefs) {
    idx += 1;
    const id = `${ref.owner}/${ref.repo}`.toLowerCase();
    process.stdout.write(`[${idx}/${allRefs.length}] ${id} ... `);
    const meta = await fetchRepo(ref.owner, ref.repo);
    if (!meta) {
      console.log('SKIP (404/403)');
      continue;
    }
    const readme = await fetchReadme(ref.owner, ref.repo);
    const prev = existingMap.get(id);

    const commits30d = await countCommitsSince(ref.owner, ref.repo, since30d);
    const starGrowth30d = await starGrowthSince(ref.owner, ref.repo, since30d);

    const category = classify({
      name: meta.name,
      description: meta.description || '',
      topics: meta.topics || [],
      readme,
    });
    const platforms = detectPlatforms({
      description: meta.description || '',
      topics: meta.topics || [],
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
      topics: meta.topics || [],
      language: meta.language,
      category,
      platforms,
      useCases: prev?.useCases || [],
      installCmd,
      lastCommit: meta.pushed_at,
      commits30d,
      starGrowth30d,
      firstSeen: prev?.firstSeen || new Date().toISOString(),
      featured: prev?.featured || false,
      archived: meta.archived,
    };

    console.log(
      `★${skill.stars} commits30d=${commits30d} cat=${category} ${skill.descriptionZh ? '(已译)' : '(待译)'}`
    );

    fetchedMap.set(skill.id, skill);
    await sleep(400); // 节流：每 repo 之间 400ms，配合 throttling 插件避免触发次级限制
  }

  // 关键：保留本次未抓取的已收录项目（防止 awesome-list 收缩导致数据丢失）
  const fetchedIds = new Set(fetchedMap.keys());
  const orphans = existing.filter((s) => !fetchedIds.has(s.id.toLowerCase()));
  if (orphans.length > 0) {
    console.log(`\n保留已收录但本次未抓取的项目：${orphans.length} 条`);
  }

  const result = [...fetchedMap.values(), ...orphans];
  result.sort((a, b) => computePopularity(b) - computePopularity(a));

  console.log(`\n成功抓取：${result.length}/${allRefs.length}`);
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
