'use client';

import type { MatConfig } from '@/lib/types';
import type { MatAction } from '@/lib/state';
import { Field } from '../ui/Field';
import { ColorPicker } from '../ui/ColorPicker';

export function ColorControls({
  config,
  dispatch,
}: {
  config: MatConfig;
  dispatch: React.Dispatch<MatAction>;
}) {
  return (
    <Field label="Mat background">
      <ColorPicker
        value={config.matColor}
        onChange={(c) => dispatch({ type: 'SET_MAT_COLOR', color: c })}
      />
    </Field>
  );
}
