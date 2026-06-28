import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { skills } from '../data/skills';

const outPath = resolve(process.cwd(), 'data/skills.json');
writeFileSync(outPath, JSON.stringify(skills, null, 2) + '\n', 'utf8');
console.log(`Exported ${skills.length} skills → ${outPath}`);
