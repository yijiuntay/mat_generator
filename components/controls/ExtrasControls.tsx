'use client';

import type { MatConfig } from '@/lib/types';
import { THICKNESS_MM_MAX, THICKNESS_MM_MIN } from '@/lib/types';
import type { MatAction } from '@/lib/state';
import { Field, NumberInput, Row, Toggle } from '../ui/Field';
import { ColorPicker } from '../ui/ColorPicker';

export function ExtrasControls({
  config,
  dispatch,
}: {
  config: MatConfig;
  dispatch: React.Dispatch<MatAction>;
}) {
  const d = config.diagonalLines;
  const c = config.cornerMarks;
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Toggle
          checked={d.enabled}
          onChange={(v) => dispatch({ type: 'SET_DIAGONALS', patch: { enabled: v } })}
          label="Enable 45° diagonal lines"
        />
        <Field label="Color">
          <ColorPicker
            value={d.color}
            onChange={(v) => dispatch({ type: 'SET_DIAGONALS', patch: { color: v } })}
          />
        </Field>
        <Row>
          <Field label="Spacing (in)">
            <NumberInput
              value={d.spacingIn}
              min={0.25}
              step={0.25}
              suffix="in"
              onChange={(v) => dispatch({ type: 'SET_DIAGONALS', patch: { spacingIn: v } })}
            />
          </Field>
          <Field label="Thickness (mm)">
            <NumberInput
              value={d.thicknessMm}
              min={THICKNESS_MM_MIN}
              max={THICKNESS_MM_MAX}
              step={0.05}
              suffix="mm"
              onChange={(v) =>
                dispatch({
                  type: 'SET_DIAGONALS',
                  patch: {
                    thicknessMm: Math.max(
                      THICKNESS_MM_MIN,
                      Math.min(THICKNESS_MM_MAX, v),
                    ),
                  },
                })
              }
            />
          </Field>
        </Row>
      </div>

      <div className="space-y-3 border-t border-neutral-800 pt-4">
        <Toggle
          checked={c.enabled}
          onChange={(v) => dispatch({ type: 'SET_CORNER_MARKS', patch: { enabled: v } })}
          label="Enable corner registration marks"
        />
        <Field label="Color">
          <ColorPicker
            value={c.color}
            onChange={(v) => dispatch({ type: 'SET_CORNER_MARKS', patch: { color: v } })}
          />
        </Field>
      </div>

      <div className="space-y-2 border-t border-neutral-800 pt-4">
        <Field label="Units">
          <div className="flex rounded-md bg-neutral-900 p-1">
            {(['in', 'cm'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => dispatch({ type: 'SET_UNIT', unit: u })}
                className={`flex-1 rounded px-2 py-1 text-xs uppercase ${
                  config.unit === u
                    ? 'bg-sky-600 text-white'
                    : 'text-neutral-400 hover:text-neutral-100'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </Field>
        <p className="text-xs text-neutral-500">
          Underlying spacing is stored canonically — toggling units only re-labels
          fields, never rewrites your numbers.
        </p>
      </div>
    </div>
  );
}
