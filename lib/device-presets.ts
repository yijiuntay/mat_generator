// Device presets seed list. Verify + expand periodically — screen specs go stale as
// manufacturers refresh product lines. When adding new devices, keep resolutions in
// portrait orientation (height >= width) and diagonal in inches; the app will swap
// dimensions for landscape rendering.

import type { DevicePreset } from './types';

export const DEVICE_PRESETS: DevicePreset[] = [
  // ── Phones ──────────────────────────────────────────────────────────────
  // Verified Oct 2026 against official spec pages. Diagonals are the full-rectangle
  // measurement: Apple's exact "measured as a rectangle" inches; Samsung and Google
  // from their published mm values (÷ 25.4). Foldables are omitted (two screens).
  // Base iPhone 18 is not yet released (expected spring 2027).
  { id: 'iphone-18-pro',      label: 'iPhone 18 Pro',             category: 'phone',   widthPx: 1206, heightPx: 2622, diagonalIn: 6.27 },
  { id: 'iphone-18-pro-max',  label: 'iPhone 18 Pro Max',         category: 'phone',   widthPx: 1320, heightPx: 2868, diagonalIn: 6.86 },
  { id: 'iphone-17',          label: 'iPhone 17',                 category: 'phone',   widthPx: 1206, heightPx: 2622, diagonalIn: 6.27 },
  { id: 'iphone-17e',         label: 'iPhone 17e',                category: 'phone',   widthPx: 1170, heightPx: 2532, diagonalIn: 6.06 },
  { id: 'iphone-air',         label: 'iPhone Air',                category: 'phone',   widthPx: 1260, heightPx: 2736, diagonalIn: 6.55 },
  { id: 'iphone-17-pro',      label: 'iPhone 17 Pro',             category: 'phone',   widthPx: 1206, heightPx: 2622, diagonalIn: 6.27 },
  { id: 'iphone-17-pro-max',  label: 'iPhone 17 Pro Max',         category: 'phone',   widthPx: 1320, heightPx: 2868, diagonalIn: 6.86 },
  { id: 'iphone-16',          label: 'iPhone 16',                 category: 'phone',   widthPx: 1179, heightPx: 2556, diagonalIn: 6.12 },
  { id: 'iphone-16e',         label: 'iPhone 16e',                category: 'phone',   widthPx: 1170, heightPx: 2532, diagonalIn: 6.06 },
  { id: 'iphone-16-plus',     label: 'iPhone 16 Plus',            category: 'phone',   widthPx: 1290, heightPx: 2796, diagonalIn: 6.69 },
  { id: 'iphone-16-pro',      label: 'iPhone 16 Pro',             category: 'phone',   widthPx: 1206, heightPx: 2622, diagonalIn: 6.27 },
  { id: 'iphone-16-pro-max',  label: 'iPhone 16 Pro Max',         category: 'phone',   widthPx: 1320, heightPx: 2868, diagonalIn: 6.86 },
  { id: 'galaxy-s26',         label: 'Samsung Galaxy S26',        category: 'phone',   widthPx: 1080, heightPx: 2340, diagonalIn: 6.27 },
  { id: 'galaxy-s26-plus',    label: 'Samsung Galaxy S26+',       category: 'phone',   widthPx: 1440, heightPx: 3120, diagonalIn: 6.66 },
  { id: 'galaxy-s26-ultra',   label: 'Samsung Galaxy S26 Ultra',  category: 'phone',   widthPx: 1440, heightPx: 3120, diagonalIn: 6.89 },
  { id: 'galaxy-s25',         label: 'Samsung Galaxy S25',        category: 'phone',   widthPx: 1080, heightPx: 2340, diagonalIn: 6.16 },
  { id: 'galaxy-s25-plus',    label: 'Samsung Galaxy S25+',       category: 'phone',   widthPx: 1440, heightPx: 3120, diagonalIn: 6.66 },
  { id: 'galaxy-s25-ultra',   label: 'Samsung Galaxy S25 Ultra',  category: 'phone',   widthPx: 1440, heightPx: 3120, diagonalIn: 6.86 },
  { id: 'galaxy-s24',         label: 'Samsung Galaxy S24',        category: 'phone',   widthPx: 1080, heightPx: 2340, diagonalIn: 6.16 },
  { id: 'galaxy-s24-plus',    label: 'Samsung Galaxy S24+',       category: 'phone',   widthPx: 1440, heightPx: 3120, diagonalIn: 6.66 },
  { id: 'galaxy-s24-ultra',   label: 'Samsung Galaxy S24 Ultra',  category: 'phone',   widthPx: 1440, heightPx: 3120, diagonalIn: 6.79 },
  { id: 'pixel-11',           label: 'Google Pixel 11',           category: 'phone',   widthPx: 1080, heightPx: 2424, diagonalIn: 6.30 },
  { id: 'pixel-11-pro',       label: 'Google Pixel 11 Pro',       category: 'phone',   widthPx: 1280, heightPx: 2856, diagonalIn: 6.34 },
  { id: 'pixel-11-pro-xl',    label: 'Google Pixel 11 Pro XL',    category: 'phone',   widthPx: 1344, heightPx: 2992, diagonalIn: 6.73 },
  { id: 'pixel-10',           label: 'Google Pixel 10',           category: 'phone',   widthPx: 1080, heightPx: 2424, diagonalIn: 6.30 },
  { id: 'pixel-10-pro',       label: 'Google Pixel 10 Pro',       category: 'phone',   widthPx: 1280, heightPx: 2856, diagonalIn: 6.34 },
  { id: 'pixel-10-pro-xl',    label: 'Google Pixel 10 Pro XL',    category: 'phone',   widthPx: 1344, heightPx: 2992, diagonalIn: 6.73 },
  { id: 'pixel-9',            label: 'Google Pixel 9',            category: 'phone',   widthPx: 1080, heightPx: 2424, diagonalIn: 6.30 },
  { id: 'pixel-9-pro',        label: 'Google Pixel 9 Pro',        category: 'phone',   widthPx: 1280, heightPx: 2856, diagonalIn: 6.34 },
  { id: 'pixel-9-pro-xl',     label: 'Google Pixel 9 Pro XL',     category: 'phone',   widthPx: 1344, heightPx: 2992, diagonalIn: 6.80 },

  // ── Tablets ─────────────────────────────────────────────────────────────
  { id: 'ipad-10',            label: 'iPad (10th gen)',           category: 'tablet',  widthPx: 1640, heightPx: 2360, diagonalIn: 10.9 },
  { id: 'ipad-air',           label: 'iPad Air',                  category: 'tablet',  widthPx: 1640, heightPx: 2360, diagonalIn: 10.9 },
  { id: 'ipad-pro-11',        label: 'iPad Pro 11"',              category: 'tablet',  widthPx: 1668, heightPx: 2388, diagonalIn: 11   },
  { id: 'ipad-pro-12-9',      label: 'iPad Pro 12.9"',            category: 'tablet',  widthPx: 2048, heightPx: 2732, diagonalIn: 12.9 },
  { id: 'galaxy-tab-s9',      label: 'Samsung Galaxy Tab S9',     category: 'tablet',  widthPx: 1600, heightPx: 2560, diagonalIn: 11   },

  // ── Desktop / Laptop ────────────────────────────────────────────────────
  // Diagonal-to-resolution mapping varies widely on monitors of the same size,
  // so surface "manual mm" mode prominently in the UI as the more trusted path.
  { id: 'monitor-1080-24',    label: '1080p 24" monitor',         category: 'desktop', widthPx: 1920, heightPx: 1080, diagonalIn: 24   },
  { id: 'monitor-1440-27',    label: '1440p 27" monitor',         category: 'desktop', widthPx: 2560, heightPx: 1440, diagonalIn: 27   },
  { id: 'monitor-4k-27',      label: '4K 27" monitor',            category: 'desktop', widthPx: 3840, heightPx: 2160, diagonalIn: 27   },
  { id: 'monitor-4k-32',      label: '4K 32" monitor',            category: 'desktop', widthPx: 3840, heightPx: 2160, diagonalIn: 32   },
  { id: 'studio-display-5k',  label: '5K 27" (Studio Display)',   category: 'desktop', widthPx: 5120, heightPx: 2880, diagonalIn: 27   },
  { id: 'mba-13',             label: 'MacBook Air 13"',           category: 'desktop', widthPx: 2560, heightPx: 1664, diagonalIn: 13.6 },
  { id: 'mbp-14',             label: 'MacBook Pro 14"',           category: 'desktop', widthPx: 3024, heightPx: 1964, diagonalIn: 14.2 },
  { id: 'mbp-16',             label: 'MacBook Pro 16"',           category: 'desktop', widthPx: 3456, heightPx: 2234, diagonalIn: 16.2 },
];

export function presetsByCategory(category: DevicePreset['category']): DevicePreset[] {
  return DEVICE_PRESETS.filter((p) => p.category === category);
}

export function getPresetById(id: string): DevicePreset | undefined {
  return DEVICE_PRESETS.find((p) => p.id === id);
}
