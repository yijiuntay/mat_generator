'use client';

import type { MatConfig } from '@/lib/types';
import type { MatAction } from '@/lib/state';
import { Section } from './ui/Section';
import { DeviceSelector } from './controls/DeviceSelector';
import { ColorControls } from './controls/ColorControls';
import { GridControls } from './controls/GridControls';
import { RulerControls } from './controls/RulerControls';
import { ExtrasControls } from './controls/ExtrasControls';

export function ControlPanel({
  config,
  dispatch,
}: {
  config: MatConfig;
  dispatch: React.Dispatch<MatAction>;
}) {
  return (
    <div className="divide-y divide-neutral-800">
      <Section title="Device & size" defaultOpen>
        <DeviceSelector config={config} dispatch={dispatch} />
      </Section>
      <Section title="Mat color" defaultOpen={false}>
        <ColorControls config={config} dispatch={dispatch} />
      </Section>
      <Section title="Major grid" defaultOpen>
        <GridControls config={config} dispatch={dispatch} layerKey="majorGrid" />
      </Section>
      <Section title="Minor grid" defaultOpen={false}>
        <GridControls config={config} dispatch={dispatch} layerKey="minorGrid" />
      </Section>
      <Section title="Diagonal lines · corner marks · units" defaultOpen={false}>
        <ExtrasControls config={config} dispatch={dispatch} />
      </Section>
      <Section title="Ruler labels" defaultOpen={false}>
        <RulerControls config={config} dispatch={dispatch} />
      </Section>
    </div>
  );
}
