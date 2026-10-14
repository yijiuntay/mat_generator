// Device presets seed list. Verify + expand periodically — screen specs go stale as
// manufacturers refresh product lines. When adding new devices, keep resolutions in
// portrait orientation (height >= width) and diagonal in inches; the app will swap
// dimensions for landscape rendering.

import type { DevicePreset } from './types';

export const DEVICE_PRESETS: DevicePreset[] = [
  // ── Phones ──────────────────────────────────────────────────────────────
  { id: 'iphone-se-3',        label: 'iPhone SE (3rd gen)',       category: 'phone',   widthPx: 750,  heightPx: 1334, diagonalIn: 4.7  },
  { id: 'iphone-13-14',       label: 'iPhone 13 / 14',            category: 'phone',   widthPx: 1170, heightPx: 2532, diagonalIn: 6.1  },
  { id: 'iphone-15-16',       label: 'iPhone 15 / 16',            category: 'phone',   widthPx: 1179, heightPx: 2556, diagonalIn: 6.1  },
  { id: 'iphone-15-16-plus',  label: 'iPhone 15 / 16 Plus',       category: 'phone',   widthPx: 1290, heightPx: 2796, diagonalIn: 6.7  },
  { id: 'galaxy-s24',         label: 'Samsung Galaxy S24',        category: 'phone',   widthPx: 1080, heightPx: 2340, diagonalIn: 6.1  },
  { id: 'galaxy-s24-ultra',   label: 'Samsung Galaxy S24 Ultra',  category: 'phone',   widthPx: 1440, heightPx: 3120, diagonalIn: 6.8  },
  { id: 'pixel-8',            label: 'Google Pixel 8',            category: 'phone',   widthPx: 1080, heightPx: 2400, diagonalIn: 6.2  },
  { id: 'pixel-8-pro',        label: 'Google Pixel 8 Pro',        category: 'phone',   widthPx: 1344, heightPx: 2992, diagonalIn: 6.7  },

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
