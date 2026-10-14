'use client';

import { FONTS } from '@/lib/fonts';
import type { MatConfig } from '@/lib/types';
import type { MatAction } from '@/lib/state';
import { Field, NumberInput, Row, Select, Toggle } from '../ui/Field';
import { ColorPicker } from '../ui/ColorPicker';

export function RulerControls({
  config,
  dispatch,
}: {
  config: MatConfig;
  dispatch: React.Dispatch<MatAction>;
}) {
  const r = config.ruler;
  const patch = (p: Partial<typeof r>) => dispatch({ type: 'SET_RULER', patch: p });
  return (
    <div className="space-y-3">
      <Toggle
        checked={r.enabled}
        onChange={(v) => patch({ enabled: v })}
        label="Enable ruler labels"
      />
      <Field label="Font">
        <Select
          value={r.font}
          onChange={(v) => patch({ font: v })}
          options={FONTS.map((f) => ({ value: f.key, label: f.label }))}
        />
      </Field>
      <Field label="Color">
        <ColorPicker value={r.color} onChange={(c) => patch({ color: c })} />
      </Field>
      <Row>
        <Field label="Font size (mm)">
          <NumberInput
            value={r.fontSizeMm}
            min={1}
            max={20}
            step={0.5}
            suffix="mm"
            onChange={(v) => patch({ fontSizeMm: v })}
          />
        </Field>
        <Field label="Label every Nth line">
          <NumberInput
            value={r.showEveryNth}
            min={1}
            step={1}
            onChange={(v) => patch({ showEveryNth: Math.max(1, Math.round(v)) })}
          />
        </Field>
      </Row>
    </div>
  );
}
