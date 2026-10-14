import type {
  CornerMarksLayer,
  DiagonalLayer,
  GridLayer,
  MatConfig,
  Orientation,
  RulerLayer,
  SizeSource,
  Unit,
} from './types';

export const DEFAULT_CONFIG: MatConfig = {
  size: { mode: 'preset', presetId: 'iphone-15-16' },
  orientation: 'portrait',
  unit: 'in',

  matColor: '#111418',

  majorGrid: {
    enabled: true,
    color: '#8a94a3',
    thicknessMm: 0.4,
    spacingIn: 1,
  },
  minorGrid: {
    enabled: true,
    color: '#3a4250',
    thicknessMm: 0.25,
    spacingIn: 0.25,
  },
  diagonalLines: {
    enabled: false,
    color: '#4b5a70',
    thicknessMm: 0.25,
    spacingIn: 2,
  },

  ruler: {
    enabled: true,
    font: 'roboto-mono',
    color: '#c5cdd8',
    fontSizeMm: 3,
    showEveryNth: 1,
  },
  cornerMarks: {
    enabled: true,
    color: '#c5cdd8',
  },
};

export type MatAction =
  | { type: 'SET_SIZE'; size: SizeSource }
  | { type: 'SET_ORIENTATION'; orientation: Orientation }
  | { type: 'SET_UNIT'; unit: Unit }
  | { type: 'SET_MAT_COLOR'; color: string }
  | { type: 'SET_MAJOR_GRID'; patch: Partial<GridLayer> }
  | { type: 'SET_MINOR_GRID'; patch: Partial<GridLayer> }
  | { type: 'SET_DIAGONALS'; patch: Partial<DiagonalLayer> }
  | { type: 'SET_RULER'; patch: Partial<RulerLayer> }
  | { type: 'SET_CORNER_MARKS'; patch: Partial<CornerMarksLayer> }
  | { type: 'RESET' };

export function matReducer(state: MatConfig, action: MatAction): MatConfig {
  switch (action.type) {
    case 'SET_SIZE':
      return { ...state, size: action.size };
    case 'SET_ORIENTATION':
      return { ...state, orientation: action.orientation };
    case 'SET_UNIT':
      return { ...state, unit: action.unit };
    case 'SET_MAT_COLOR':
      return { ...state, matColor: action.color };
    case 'SET_MAJOR_GRID':
      return { ...state, majorGrid: { ...state.majorGrid, ...action.patch } };
    case 'SET_MINOR_GRID':
      return { ...state, minorGrid: { ...state.minorGrid, ...action.patch } };
    case 'SET_DIAGONALS':
      return {
        ...state,
        diagonalLines: { ...state.diagonalLines, ...action.patch },
      };
    case 'SET_RULER':
      return { ...state, ruler: { ...state.ruler, ...action.patch } };
    case 'SET_CORNER_MARKS':
      return {
        ...state,
        cornerMarks: { ...state.cornerMarks, ...action.patch },
      };
    case 'RESET':
      return DEFAULT_CONFIG;
  }
}
