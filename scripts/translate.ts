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
import type { Skill } from '../lib/types';
import { translateToZh } from '../lib/sync/translate';

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const FORCE = args.has('--force');
const LIMIT = args.has('--limit')
  ? parseInt(process.argv[process.argv.indexOf('--limit') + 1], 10)
  : undefined;

const DATA_PATH = resolve(process.cwd(), 'data/skills.json');

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

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
  console.log(`待翻译：${pending.length}${LIMIT ? `（限 ${LIMIT}）` : ''}\n`);

  if (DRY_RUN) {
    target.slice(0, 10).forEach((s) => {
      console.log(`  - ${s.id}`);
      console.log(`    EN: ${s.description.slice(0, 80)}`);
    });
    console.log('\n[dry-run] 不调用 API。');
    return;
  }

  let idx = 0;
  for (const s of target) {
    idx += 1;
    process.stdout.write(`[${idx}/${target.length}] ${s.id} ... `);
    try {
      const zh = await translateToZh(s.description);
      if (zh) {
        s.descriptionZh = zh;
        console.log('OK');
      } else {
        console.log('EMPTY');
      }
    } catch (e: any) {
      console.log(`FAIL: ${e?.message || e}`);
      break;
    }
    await sleep(500); // 友善对待 API
  }

  writeFileSync(DATA_PATH, JSON.stringify(skills, null, 2) + '\n', 'utf8');
  console.log(`\n✓ 已写回 ${DATA_PATH}`);
}

main().catch((e) => {
  console.error('\n翻译失败：', e);
  process.exit(1);
});
