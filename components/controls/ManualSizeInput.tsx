'use client';

import type { MatConfig, SizeSource } from '@/lib/types';
import type { MatAction } from '@/lib/state';
import { Field, NumberInput, Row, Select } from '../ui/Field';

type ManualMode = 'manual-diagonal' | 'manual-ppi' | 'manual-mm';

export function ManualSizeInput({
  config,
  dispatch,
}: {
  config: MatConfig;
  dispatch: React.Dispatch<MatAction>;
}) {
  const size = config.size;
  const mode: ManualMode = size.mode.startsWith('manual-')
    ? (size.mode as ManualMode)
    : 'manual-mm';

  const setSize = (s: SizeSource) => dispatch({ type: 'SET_SIZE', size: s });

  const setMode = (m: ManualMode) => {
    const w = 'widthPx' in size ? size.widthPx : 2560;
    const h = 'heightPx' in size ? size.heightPx : 1440;
    if (m === 'manual-diagonal') {
      setSize({ mode: m, widthPx: w, heightPx: h, diagonalIn: 27 });
    } else if (m === 'manual-ppi') {
      setSize({ mode: m, widthPx: w, heightPx: h, ppi: 109 });
    } else {
      // Approximate mm from a 27" 16:9 monitor.
      setSize({ mode: m, widthPx: w, heightPx: h, widthMm: 597, heightMm: 336 });
    }
  };

  const w = 'widthPx' in size ? size.widthPx : 2560;
  const h = 'heightPx' in size ? size.heightPx : 1440;

  return (
    <div className="space-y-3 rounded-md border border-neutral-800 bg-neutral-950/60 p-3">
      <Field
        label="Manual mode"
        hint="Manual is the most trusted path for accuracy — pick whichever spec you actually know for your screen."
      >
        <Select<ManualMode>
          value={mode}
          onChange={setMode}
          options={[
            { value: 'manual-mm', label: 'Physical width/height (mm)' },
            { value: 'manual-diagonal', label: 'Diagonal + resolution' },
            { value: 'manual-ppi', label: 'PPI directly' },
          ]}
        />
      </Field>

      <Row>
        <Field label="Width (px)">
          <NumberInput
            value={w}
            min={100}
            step={1}
            onChange={(v) => setSize({ ...(size as any), widthPx: v })}
          />
        </Field>
        <Field label="Height (px)">
          <NumberInput
            value={h}
            min={100}
            step={1}
            onChange={(v) => setSize({ ...(size as any), heightPx: v })}
          />
        </Field>
      </Row>

      {mode === 'manual-diagonal' && size.mode === 'manual-diagonal' ? (
        <Field label="Diagonal (inches)">
          <NumberInput
            value={size.diagonalIn}
            min={1}
            step={0.1}
            suffix="in"
            onChange={(v) => setSize({ ...size, diagonalIn: v })}
          />
        </Field>
      ) : null}

      {mode === 'manual-ppi' && size.mode === 'manual-ppi' ? (
        <Field label="PPI">
          <NumberInput
            value={size.ppi}
            min={1}
            step={1}
            suffix="ppi"
            onChange={(v) => setSize({ ...size, ppi: v })}
          />
        </Field>
      ) : null}

      {mode === 'manual-mm' && size.mode === 'manual-mm' ? (
        <Row>
          <Field label="Physical width (mm)">
            <NumberInput
              value={size.widthMm}
              min={1}
              step={1}
              suffix="mm"
              onChange={(v) => setSize({ ...size, widthMm: v })}
            />
          </Field>
          <Field label="Physical height (mm)">
            <NumberInput
              value={size.heightMm}
              min={1}
              step={1}
              suffix="mm"
              onChange={(v) => setSize({ ...size, heightMm: v })}
            />
          </Field>
        </Row>
      ) : null}
    </div>
  );
}
