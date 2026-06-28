import OpenAI from 'openai';

let client: OpenAI | null = null;

function getConfig() {
  return {
    apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
    baseURL:
      process.env.DEEPSEEK_BASE_URL ||
      process.env.OPENAI_BASE_URL ||
      'https://api.deepseek.com',
    model: process.env.TRANSLATE_MODEL || 'deepseek-chat',
  };
}

function getClient(): OpenAI {
  const { apiKey, baseURL } = getConfig();
  if (!apiKey) {
    throw new Error(
      '翻译需要 DEEPSEEK_API_KEY（或 OPENAI_API_KEY）环境变量；端点可由 DEEPSEEK_BASE_URL 配置'
    );
  }
  if (!client) {
    client = new OpenAI({ apiKey, baseURL });
  }
  return client;
}

export async function translateToZh(text: string): Promise<string> {
  if (!text || !text.trim()) return '';
  const c = getClient();
  const { model } = getConfig();
  const resp = await c.chat.completions.create({
    model,
    max_tokens: 256,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: `将下面这个 GitHub 项目的英文描述翻译成简短的中文简介（不超过 80 字，直接输出译文，不要加引号或解释，不要输出"该项目"之类的引导语）：

${text}`,
      },
    ],
  });
  return resp.choices[0]?.message?.content?.trim() || '';
}
