# SkillHot 部署指南

> L1 最小上线路径：GitHub 仓库 → Vercel 部署 → GitHub Actions 自动同步

## 前置条件

- 本地代码已 commit（已完成）
- 一个 GitHub 账号
- 一个 DeepSeek API key（用于翻译）
- 一个 GitHub Personal Access Token（用于 Actions 同步）

---

## 步骤 1：推到 GitHub

1. 在 GitHub 新建仓库：https://github.com/new
   - 推荐名字：`skillhot`
   - 可见性：**Public**（Vercel 免费版要求）
   - 不要勾选 README / .gitignore / license（本地已有）

2. 复制 GitHub 给的推送命令（形如）：
   ```bash
   git remote add origin git@github.com:<你的用户名>/skillhot.git
   git push -u origin main
   ```

3. 在项目目录执行这两条命令。

---

## 步骤 2：Vercel 部署

1. 打开 https://vercel.com/new
2. Import 刚才的 `skillhot` 仓库
3. Framework Preset 会自动识别为 **Next.js**
4. **Environment Variables**（重要）：
   | Name | Value | 备注 |
   |---|---|---|
   | `DEEPSEEK_API_KEY` | sk-xxxxx | 翻译用 |
   | `DEEPSEEK_BASE_URL` | https://api.deepseek.com | 可省略 |
   | `TRANSLATE_MODEL` | deepseek-chat | 可省略 |
5. 点 **Deploy**
6. 等 2-3 分钟构建完成，拿到 `xxx.vercel.app` 临时域名

---

## 步骤 3：配置 GitHub Actions Secrets

Vercel 部署完后，回到 GitHub 仓库配置 Actions：

1. 打开仓库 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**，添加：

   | Name | Value |
   |---|---|
   | `DEEPSEEK_API_KEY` | 你的 DeepSeek key |
   | `GH_PAT` | 一个有 `repo` 权限的 PAT（用于 commit 回仓库）|

   `GH_PAT` 申请：https://github.com/settings/tokens?type=beta → Generate new token → 勾选当前仓库的 Contents: Read and write

3. （可选）添加 `VERCEL_DEPLOY_HOOK`，从 Vercel 项目 Settings → Deploy Hooks 复制，让同步后自动重新部署

---

## 步骤 4：手动触发一次同步验证

1. 打开仓库 → **Actions** tab
2. 左侧选 **Daily Sync**
3. 点 **Run workflow** → 留空 limit → **Run workflow**
4. 等 10-20 分钟跑完
5. 检查：
   - workflow 绿色对勾
   - 仓库 `data/skills.json` 有新 commit（bot 提交）
   - Vercel 自动重新部署（如果配了 webhook）

---

## 步骤 5：（可选）自定义域名

1. Vercel 项目 → **Settings** → **Domains**
2. 输入你的域名（如 `skillhot.dev`）
3. 按提示在域名注册商处添加 DNS 记录
4. 等 DNS 生效（几分钟到几小时）

---

## 上线后日常运维

- **每天 08:00（北京时间）** GitHub Actions 自动跑同步+翻译+提交，Vercel 自动重新部署
- **手动触发同步**：Actions → Daily Sync → Run workflow（可填 limit 调试）
- **加新数据源**：编辑 `data/sources.json`，加 awesome-list，下次同步自动生效
- **手工编辑数据**：直接改 `data/skills.json`，提交即生效

## 常见问题

### Q: 同步 workflow 报 403？
A: 检查 `GH_PAT` 是否有过期、权限是否包含 Contents: write。Fine-grained token 需明确选当前仓库。

### Q: 翻译全部失败？
A: 检查 `DEEPSEEK_API_KEY` 是否正确、DeepSeek 账号是否有余额。

### Q: Vercel 部署失败？
A: 看构建日志。最常见是环境变量没配，或 Node 版本不匹配（Vercel 默认 Node 20，已与项目一致）。

### Q: 想停用某次同步？
A: Actions 页面点 × 取消运行。改 cron 频率：编辑 `.github/workflows/sync.yml` 的 schedule。
