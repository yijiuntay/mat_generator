import type { DevicePreset, SizeSource, Unit } from './types';

export const MM_PER_INCH = 25.4;
export const CM_PER_INCH = 2.54;

export function ppiFromDiagonal(
  widthPx: number,
  heightPx: number,
  diagonalIn: number,
): number {
  if (diagonalIn <= 0) throw new Error('diagonalIn must be > 0');
  return Math.sqrt(widthPx * widthPx + heightPx * heightPx) / diagonalIn;
}

export function ppiFromPhysicalMm(
  widthPx: number,
  heightPx: number,
  widthMm: number,
  heightMm: number,
): number {
  if (widthMm <= 0 || heightMm <= 0) throw new Error('mm dims must be > 0');
  const diagonalPx = Math.sqrt(widthPx * widthPx + heightPx * heightPx);
  const diagonalMm = Math.sqrt(widthMm * widthMm + heightMm * heightMm);
  const diagonalIn = diagonalMm / MM_PER_INCH;
  return diagonalPx / diagonalIn;
}

export function ppiForPreset(preset: DevicePreset): number {
  return ppiFromDiagonal(preset.widthPx, preset.heightPx, preset.diagonalIn);
}

export function resolveSize(
  size: SizeSource,
  presets: DevicePreset[],
): { widthPx: number; heightPx: number; ppi: number } {
  switch (size.mode) {
    case 'preset': {
      const preset = presets.find((p) => p.id === size.presetId);
      if (!preset) throw new Error(`unknown preset: ${size.presetId}`);
      return {
        widthPx: preset.widthPx,
        heightPx: preset.heightPx,
        ppi: ppiForPreset(preset),
      };
    }
    case 'manual-diagonal':
      return {
        widthPx: size.widthPx,
        heightPx: size.heightPx,
        ppi: ppiFromDiagonal(size.widthPx, size.heightPx, size.diagonalIn),
      };
    case 'manual-ppi':
      return { widthPx: size.widthPx, heightPx: size.heightPx, ppi: size.ppi };
    case 'manual-mm':
      return {
        widthPx: size.widthPx,
        heightPx: size.heightPx,
        ppi: ppiFromPhysicalMm(
          size.widthPx,
          size.heightPx,
          size.widthMm,
          size.heightMm,
        ),
      };
  }
}

export function realUnitsToPx(value: number, unit: Unit, ppi: number): number {
  return unit === 'in' ? value * ppi : (value / CM_PER_INCH) * ppi;
}

export function inchesToPx(inches: number, ppi: number): number {
  return inches * ppi;
}

export function mmToPx(mm: number, ppi: number): number {
  return (mm / MM_PER_INCH) * ppi;
}

export function thicknessPx(thicknessMm: number, ppi: number): number {
  return Math.max(1, Math.round(mmToPx(thicknessMm, ppi)));
}

export function convertSpacing(
  value: number,
  from: Unit,
  to: Unit,
): number {
  if (from === to) return value;
  return from === 'in' ? value * CM_PER_INCH : value / CM_PER_INCH;
}

export function orientedDimensions(
  widthPx: number,
  heightPx: number,
  orientation: 'portrait' | 'landscape',
): { widthPx: number; heightPx: number } {
  const isPortraitNatural = heightPx >= widthPx;
  const wantPortrait = orientation === 'portrait';
  if (isPortraitNatural === wantPortrait) return { widthPx, heightPx };
  return { widthPx: heightPx, heightPx: widthPx };
}
