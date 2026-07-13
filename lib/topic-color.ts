/**
 * 话题自动配色：用 topic id 字符串 hash 出一个 0-360 的 hue，
 * 让 400+ 个话题每个都有稳定的独特色相，无需手工指定。
 */
export function topicHue(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) % 360;
  }
  return h;
}

/**
 * 返回 CSS variable 形式的 hue，用于在 component 里写
 * `style={topicCssVars(t.id)}` 然后用 Tailwind arbitrary value 引用：
 *   className="bg-[hsl(var(--topic-hue)_70%_50%_/_0.15)]"
 */
export function topicCssVars(id: string): React.CSSProperties {
  return { '--topic-hue': topicHue(id) } as React.CSSProperties;
}

/** 话题详情页 header 渐变方块用 */
export function topicGradientStyle(id: string): React.CSSProperties {
  const hue = topicHue(id);
  return {
    background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 65% 45%))`,
  };
}
