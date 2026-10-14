import { describe, expect, it } from 'vitest';
import {
  convertSpacing,
  mmToPx,
  orientedDimensions,
  ppiFromDiagonal,
  ppiFromPhysicalMm,
  realUnitsToPx,
  resolveSize,
  thicknessPx,
} from './ppi';
import type { DevicePreset } from './types';

describe('ppiFromDiagonal', () => {
  it('matches a known 27" 2560x1440 monitor (~108.79 ppi)', () => {
    expect(ppiFromDiagonal(2560, 1440, 27)).toBeCloseTo(108.79, 1);
  });

  it('matches an iPhone 15 Pro 1179x2556 @ 6.1in (~461 ppi)', () => {
    expect(ppiFromDiagonal(1179, 2556, 6.1)).toBeCloseTo(461.44, 1);
  });

  it('throws on zero diagonal', () => {
    expect(() => ppiFromDiagonal(1920, 1080, 0)).toThrow();
  });
});

describe('ppiFromPhysicalMm', () => {
  it('is consistent with ppiFromDiagonal for the same physical size', () => {
    const diagIn = 27;
    const w = 2560;
    const h = 1440;
    const diagMm = diagIn * 25.4;
    const aspect = w / Math.sqrt(w * w + h * h);
    const widthMm = diagMm * aspect;
    const heightMm = diagMm * (h / Math.sqrt(w * w + h * h));
    expect(ppiFromPhysicalMm(w, h, widthMm, heightMm)).toBeCloseTo(
      ppiFromDiagonal(w, h, diagIn),
      3,
    );
  });
});

describe('resolveSize', () => {
  const presets: DevicePreset[] = [
    {
      id: 'demo',
      label: 'Demo',
      category: 'phone',
      widthPx: 1179,
      heightPx: 2556,
      diagonalIn: 6.1,
    },
  ];

  it('resolves a preset', () => {
    const r = resolveSize({ mode: 'preset', presetId: 'demo' }, presets);
    expect(r.widthPx).toBe(1179);
    expect(r.heightPx).toBe(2556);
    expect(r.ppi).toBeGreaterThan(400);
  });

  it('resolves manual-diagonal', () => {
    const r = resolveSize(
      { mode: 'manual-diagonal', widthPx: 2560, heightPx: 1440, diagonalIn: 27 },
      presets,
    );
    expect(r.ppi).toBeCloseTo(108.79, 1);
  });

  it('resolves manual-ppi verbatim', () => {
    const r = resolveSize(
      { mode: 'manual-ppi', widthPx: 100, heightPx: 200, ppi: 300 },
      presets,
    );
    expect(r.ppi).toBe(300);
  });

  it('manual-mm and manual-diagonal agree for the same physical size', () => {
    const diag = resolveSize(
      { mode: 'manual-diagonal', widthPx: 2560, heightPx: 1440, diagonalIn: 27 },
      presets,
    );
    const diagMm = 27 * 25.4;
    const w = 2560;
    const h = 1440;
    const widthMm = (diagMm * w) / Math.sqrt(w * w + h * h);
    const heightMm = (diagMm * h) / Math.sqrt(w * w + h * h);
    const mm = resolveSize(
      { mode: 'manual-mm', widthPx: w, heightPx: h, widthMm, heightMm },
      presets,
    );
    expect(mm.ppi).toBeCloseTo(diag.ppi, 3);
  });

  it('throws on unknown preset id', () => {
    expect(() =>
      resolveSize({ mode: 'preset', presetId: 'missing' }, presets),
    ).toThrow();
  });
});

describe('unit conversion', () => {
  it('mmToPx: 25.4mm at 96ppi = 96px', () => {
    expect(mmToPx(25.4, 96)).toBeCloseTo(96, 6);
  });

  it('realUnitsToPx: 1in at 300ppi = 300px', () => {
    expect(realUnitsToPx(1, 'in', 300)).toBe(300);
  });

  it('realUnitsToPx: 2.54cm at 300ppi = 300px', () => {
    expect(realUnitsToPx(2.54, 'cm', 300)).toBeCloseTo(300, 6);
  });

  it('convertSpacing round trip in <-> cm is lossless', () => {
    const v = 1.375;
    const round = convertSpacing(convertSpacing(v, 'in', 'cm'), 'cm', 'in');
    expect(round).toBeCloseTo(v, 10);
  });
});

describe('thicknessPx', () => {
  it('floors at 1px even for very thin mm at low ppi', () => {
    expect(thicknessPx(0.05, 72)).toBe(1);
  });

  it('rounds thicker values to whole pixels', () => {
    const t = thicknessPx(1, 460);
    expect(t).toBeGreaterThanOrEqual(18);
    expect(t).toBeLessThanOrEqual(19);
  });
});

describe('orientedDimensions', () => {
  it('leaves a natural-portrait canvas alone when portrait is requested', () => {
    const r = orientedDimensions(1179, 2556, 'portrait');
    expect(r).toEqual({ widthPx: 1179, heightPx: 2556 });
  });

  it('swaps when landscape is requested on a natural-portrait canvas', () => {
    const r = orientedDimensions(1179, 2556, 'landscape');
    expect(r).toEqual({ widthPx: 2556, heightPx: 1179 });
  });

  it('leaves a natural-landscape canvas alone when landscape is requested', () => {
    const r = orientedDimensions(2560, 1440, 'landscape');
    expect(r).toEqual({ widthPx: 2560, heightPx: 1440 });
  });
});
