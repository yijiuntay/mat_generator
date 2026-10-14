export type Unit = 'in' | 'cm';

export type SizeSource =
  | { mode: 'preset'; presetId: string }
  | { mode: 'manual-diagonal'; diagonalIn: number; widthPx: number; heightPx: number }
  | { mode: 'manual-ppi'; ppi: number; widthPx: number; heightPx: number }
  | {
      mode: 'manual-mm';
      widthMm: number;
      heightMm: number;
      widthPx: number;
      heightPx: number;
    };

export type Orientation = 'portrait' | 'landscape';

export type DeviceCategory = 'phone' | 'tablet' | 'desktop';

export interface DevicePreset {
  id: string;
  label: string;
  category: DeviceCategory;
  widthPx: number;
  heightPx: number;
  diagonalIn: number;
}

export interface GridLineStyle {
  color: string;
  thicknessMm: number;
  // Canonical storage: always in inches. UI converts to/from `MatConfig.unit`
  // for display so toggling in/cm never drifts stored values (spec §8 pt 8).
  spacingIn: number;
}

export interface GridLayer extends GridLineStyle {
  enabled: boolean;
}

export interface DiagonalLayer {
  enabled: boolean;
  color: string;
  thicknessMm: number;
  spacingIn: number;
}

export interface RulerLayer {
  enabled: boolean;
  font: string;
  color: string;
  fontSizeMm: number;
  showEveryNth: number;
}

export interface CornerMarksLayer {
  enabled: boolean;
  color: string;
}

export interface MatConfig {
  size: SizeSource;
  orientation: Orientation;
  unit: Unit;

  matColor: string;

  majorGrid: GridLayer;
  minorGrid: GridLayer;
  diagonalLines: DiagonalLayer;

  ruler: RulerLayer;
  cornerMarks: CornerMarksLayer;
}

export const THICKNESS_MM_MIN = 0.25;
export const THICKNESS_MM_MAX = 5;
