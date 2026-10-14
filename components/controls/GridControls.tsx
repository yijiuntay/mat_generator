'use client';

import type { GridLayer, MatConfig } from '@/lib/types';
import { THICKNESS_MM_MAX, THICKNESS_MM_MIN } from '@/lib/types';
import type { MatAction } from '@/lib/state';
import { convertSpacing } from '@/lib/ppi';
import { Field, NumberInput, Row, Toggle } from '../ui/Field';
import { ColorPicker } from '../ui/ColorPicker';

export function GridControls({
  config,
  dispatch,
  layerKey,
}: {
  config: MatConfig;
  dispatch: React.Dispatch<MatAction>;
  layerKey: 'majorGrid' | 'minorGrid';
}) {
  const layer: GridLayer = config[layerKey];
  const actionType =
    layerKey === 'majorGrid' ? 'SET_MAJOR_GRID' : 'SET_MINOR_GRID';
  const patch = (p: Partial<GridLayer>) =>
    dispatch({ type: actionType, patch: p });

  // Convert stored inches → active unit for display; convert user input back to inches.
  const displayedSpacing = convertSpacing(layer.spacingIn, 'in', config.unit);
  const setDisplayedSpacing = (v: number) =>
    patch({ spacingIn: convertSpacing(v, config.unit, 'in') });

  return (
    <div className="space-y-3">
      <Toggle
        checked={layer.enabled}
        onChange={(v) => patch({ enabled: v })}
        label={`Enable ${layerKey === 'majorGrid' ? 'major' : 'minor'} grid`}
      />
      <Field label="Color">
        <ColorPicker value={layer.color} onChange={(c) => patch({ color: c })} />
      </Field>
      <Row>
        <Field label={`Spacing (${config.unit})`}>
          <NumberInput
            value={Math.round(displayedSpacing * 1000) / 1000}
            min={0.01}
            step={0.05}
            suffix={config.unit}
            onChange={setDisplayedSpacing}
          />
        </Field>
        <Field label="Thickness (mm)">
          <NumberInput
            value={layer.thicknessMm}
            min={THICKNESS_MM_MIN}
            max={THICKNESS_MM_MAX}
            step={0.05}
            suffix="mm"
            onChange={(v) =>
              patch({
                thicknessMm: Math.max(
                  THICKNESS_MM_MIN,
                  Math.min(THICKNESS_MM_MAX, v),
                ),
              })
            }
          />
        </Field>
      </Row>
    </div>
  );
}
