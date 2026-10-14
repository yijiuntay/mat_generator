export interface FontOption {
  key: string;
  label: string;
  family: string;
  weight: number;
  googleParam: string;
}

export const FONTS: FontOption[] = [
  { key: 'inter',        label: 'Inter (Sans)',           family: 'Inter',              weight: 500, googleParam: 'Inter:wght@500' },
  { key: 'roboto-mono',  label: 'Roboto Mono',            family: 'Roboto Mono',        weight: 500, googleParam: 'Roboto+Mono:wght@500' },
  { key: 'jetbrains',    label: 'JetBrains Mono',         family: 'JetBrains Mono',     weight: 500, googleParam: 'JetBrains+Mono:wght@500' },
  { key: 'space-mono',   label: 'Space Mono',             family: 'Space Mono',         weight: 700, googleParam: 'Space+Mono:wght@700' },
  { key: 'playfair',     label: 'Playfair Display',       family: 'Playfair Display',   weight: 600, googleParam: 'Playfair+Display:wght@600' },
  { key: 'dm-serif',     label: 'DM Serif Display',       family: 'DM Serif Display',   weight: 400, googleParam: 'DM+Serif+Display' },
  { key: 'bebas',        label: 'Bebas Neue',             family: 'Bebas Neue',         weight: 400, googleParam: 'Bebas+Neue' },
  { key: 'caveat',       label: 'Caveat (Handwritten)',   family: 'Caveat',             weight: 600, googleParam: 'Caveat:wght@600' },
];

export function getFont(key: string): FontOption {
  return FONTS.find((f) => f.key === key) ?? FONTS[0];
}

export function googleFontsHref(): string {
  const params = FONTS.map((f) => `family=${f.googleParam}`).join('&');
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

// Ensure the font is actually rasterized at the size we're about to draw.
// document.fonts.load resolves once the font file for that (weight, size, family)
// combination is available; without this, ctx.fillText silently falls back to a
// system font on first render.
export async function ensureFontReady(
  family: string,
  weight: number,
  sizePx: number,
): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  const spec = `${weight} ${Math.max(8, Math.round(sizePx))}px "${family}"`;
  try {
    await document.fonts.load(spec);
    await document.fonts.ready;
  } catch {
    // Font unavailable — the canvas will fall back; caller can choose to
    // signal this to the UI, but we don't want to block rendering entirely.
  }
}
