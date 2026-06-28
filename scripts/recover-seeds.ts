/**
 * 一次性恢复脚本：把 data/seeds-backup.json 中的种子数据 merge 回 data/skills.json。
 * - 当前 skills.json 已有的项目优先保留（含最新 stars + 最新翻译）
 * - 不存在的项目从 backup 补回
 * 跑完即可删除（或保留作为"出厂默认值"恢复用）。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Skill } from '../lib/types';

const DATA_PATH = resolve(process.cwd(), 'data/skills.json');
const BACKUP_PATH = resolve(process.cwd(), 'data/seeds-backup.json');

const current: Skill[] = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
const backup: Skill[] = JSON.parse(readFileSync(BACKUP_PATH, 'utf8'));

const currentIds = new Set(current.map((s) => s.id.toLowerCase()));
const recovered = backup.filter((s) => !currentIds.has(s.id.toLowerCase()));

const merged = [...current, ...recovered];
writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf8');

console.log(`当前 ${current.length} 条 + 恢复 ${recovered.length} 条 = 合并后 ${merged.length} 条`);
