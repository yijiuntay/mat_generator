'use client';

import { DEVICE_PRESETS, presetsByCategory } from '@/lib/device-presets';
import type { DeviceCategory, MatConfig } from '@/lib/types';
import type { MatAction } from '@/lib/state';
import { Field, Select, Toggle } from '../ui/Field';
import { ManualSizeInput } from './ManualSizeInput';

const CATEGORIES: { key: DeviceCategory | 'manual'; label: string }[] = [
  { key: 'phone', label: 'Phone' },
  { key: 'tablet', label: 'Tablet' },
  { key: 'desktop', label: 'Desktop' },
  { key: 'manual', label: 'Manual' },
];

export function DeviceSelector({
  config,
  dispatch,
}: {
  config: MatConfig;
  dispatch: React.Dispatch<MatAction>;
}) {
  const size = config.size;
  const activeCategory: DeviceCategory | 'manual' =
    size.mode === 'preset'
      ? (DEVICE_PRESETS.find((p) => p.id === size.presetId)?.category ?? 'phone')
      : 'manual';

  const setCategory = (cat: DeviceCategory | 'manual') => {
    if (cat === 'manual') {
      dispatch({
        type: 'SET_SIZE',
        size: {
          mode: 'manual-diagonal',
          widthPx: 2560,
          heightPx: 1440,
          diagonalIn: 27,
        },
      });
      return;
    }
    const first = presetsByCategory(cat)[0];
    if (first) dispatch({ type: 'SET_SIZE', size: { mode: 'preset', presetId: first.id } });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1 rounded-md bg-neutral-900 p-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategory(c.key)}
            className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
              activeCategory === c.key
                ? 'bg-sky-600 text-white'
                : 'text-neutral-400 hover:text-neutral-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {activeCategory !== 'manual' && size.mode === 'preset' ? (
        <Field label="Device">
          <Select
            value={size.presetId}
            onChange={(id) =>
              dispatch({ type: 'SET_SIZE', size: { mode: 'preset', presetId: id } })
            }
            options={presetsByCategory(activeCategory).map((p) => ({
              value: p.id,
              label: `${p.label} — ${p.widthPx}×${p.heightPx}`,
            }))}
          />
        </Field>
      ) : null}

      {activeCategory === 'desktop' ? (
        <p className="rounded border border-amber-800/60 bg-amber-950/40 px-2 py-1.5 text-xs text-amber-200">
          Desktop diagonal-to-resolution mapping varies between models. If your monitor
          isn't listed or looks off, switch to <b>Manual</b> and enter its physical
          width/height in mm for the most reliable scale.
        </p>
      ) : null}

      {activeCategory === 'manual' ? (
        <ManualSizeInput config={config} dispatch={dispatch} />
      ) : null}

      <Field label="Orientation">
        <div className="flex rounded-md bg-neutral-900 p-1">
          {(['portrait', 'landscape'] as const).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => dispatch({ type: 'SET_ORIENTATION', orientation: o })}
              className={`flex-1 rounded px-2 py-1 text-xs capitalize ${
                config.orientation === o
                  ? 'bg-sky-600 text-white'
                  : 'text-neutral-400 hover:text-neutral-100'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}
