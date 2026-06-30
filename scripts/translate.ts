/**
 * 翻译脚本：调用 DeepSeek（OpenAI 兼容协议）把 data/skills.json 中 descriptionZh 为空的项翻译补全。
 *
 * 用法：
 *   npx tsx scripts/translate.ts              # 翻译所有待译项
 *   npx tsx scripts/translate.ts --limit 5    # 只翻译 5 条（调试用）
 *   npx tsx scripts/translate.ts --force      # 强制重新翻译所有
 *   npx tsx scripts/translate.ts --dry-run    # 只打印不调用 API
 *
 * 环境变量：
 *   DEEPSEEK_API_KEY     DeepSeek API key（必填）
 *   DEEPSEEK_BASE_URL    可选，默认 https://api.deepseek.com
 *   TRANSLATE_MODEL      可选，默认 deepseek-chat
 */

import { readFileSync, writeFileSync } from 'node:fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { resolve } from 'node:path';
import pLimit from 'p-limit';
import type { Skill } from '../lib/types';
import { translateToZh } from '../lib/sync/translate';

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const FORCE = args.has('--force');
const LIMIT = args.has('--limit')
  ? parseInt(process.argv[process.argv.indexOf('--limit') + 1], 10)
  : undefined;

const DATA_PATH = resolve(process.cwd(), 'data/skills.json');
const CONCURRENCY = 8;
const CHECKPOINT_EVERY = 50; // 每 50 条写盘一次，超时也能保住进度

async function main() {
  console.log(`\n=== SkillHot 翻译脚本 ${DRY_RUN ? '(dry-run)' : ''} ===\n`);

  if (!DRY_RUN && !process.env.DEEPSEEK_API_KEY && !process.env.OPENAI_API_KEY) {
    console.error('错误：需要 DEEPSEEK_API_KEY（或 OPENAI_API_KEY）环境变量');
    process.exit(1);
  }

  const skills: Skill[] = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  const pending = FORCE ? skills : skills.filter((s) => !s.descriptionZh);
  const target = LIMIT ? pending.slice(0, LIMIT) : pending;

  console.log(`总条目：${skills.length}`);
  console.log(`待翻译：${pending.length}${LIMIT ? `（限 ${LIMIT}）` : ''}`);
  console.log(`并发：${CONCURRENCY}\n`);

  if (DRY_RUN) {
    target.slice(0, 10).forEach((s) => {
      console.log(`  - ${s.id}`);
      console.log(`    EN: ${s.description.slice(0, 80)}`);
    });
    console.log('\n[dry-run] 不调用 API。');
    return;
  }

  const limit = pLimit(CONCURRENCY);
  let done = 0;
  let ok = 0;
  let failed = 0;
  const failedIds: string[] = [];
  const startTime = Date.now();

  await Promise.all(
    target.map((s) =>
      limit(async () => {
        try {
          const zh = await translateToZh(s.description);
          if (zh) {
            s.descriptionZh = zh;
            ok += 1;
          } else {
            failed += 1;
            failedIds.push(s.id);
          }
        } catch (e: any) {
          failed += 1;
          failedIds.push(s.id);
        }
        done += 1;
        if (done % 10 === 0 || done === target.length) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          const rate = (done / ((Date.now() - startTime) / 1000)).toFixed(1);
          process.stdout.write(
            `\r[${done}/${target.length}] OK=${ok} FAIL=${failed} · ${rate}/s · ${elapsed}s   `
          );
        }
        // 检查点：每 50 条写盘一次
        if (done % CHECKPOINT_EVERY === 0) {
          writeFileSync(DATA_PATH, JSON.stringify(skills, null, 2) + '\n', 'utf8');
        }
      })
    )
  );

  // 最终写盘
  writeFileSync(DATA_PATH, JSON.stringify(skills, null, 2) + '\n', 'utf8');

  console.log('\n');
  console.log(`✓ 完成：成功 ${ok} / 失败 ${failed} / 总计 ${target.length}`);
  if (failedIds.length > 0 && failedIds.length <= 20) {
    console.log(`失败列表：${failedIds.join(', ')}`);
  }
  console.log(`✓ 已写回 ${DATA_PATH}`);
}

main().catch((e) => {
  console.error('\n翻译失败：', e);
  process.exit(1);
});
