'use client';

import { useMemo, useReducer, useRef } from 'react';
import { CanvasPreview } from '@/components/CanvasPreview';
import { ControlPanel } from '@/components/ControlPanel';
import { ExportButton } from '@/components/ExportButton';
import { DEVICE_PRESETS } from '@/lib/device-presets';
import { orientedDimensions, resolveSize } from '@/lib/ppi';
import { DEFAULT_CONFIG, matReducer } from '@/lib/state';

export default function Page() {
  const [config, dispatch] = useReducer(matReducer, DEFAULT_CONFIG);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dims = useMemo(() => {
    const base = resolveSize(config.size, DEVICE_PRESETS);
    const o = orientedDimensions(base.widthPx, base.heightPx, config.orientation);
    return { ...o, ppi: base.ppi };
  }, [config.size, config.orientation]);

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <section className="flex min-h-[45vh] flex-1 items-center justify-center bg-neutral-950 lg:min-h-screen">
        <CanvasPreview config={config} canvasRef={canvasRef} />
      </section>

      <aside className="flex w-full flex-col border-t border-neutral-800 bg-neutral-950 lg:w-[380px] lg:border-l lg:border-t-0">
        <header className="border-b border-neutral-800 px-4 py-3">
          <h1 className="text-sm font-semibold text-neutral-100">
            Cutting Mat Wallpaper Generator
          </h1>
          <p className="text-xs text-neutral-500">
            True-to-scale grid ·{' '}
            <span className="text-neutral-400">
              {dims.widthPx}×{dims.heightPx} · {Math.round(dims.ppi)} ppi
            </span>
          </p>
        </header>

        <div className="flex-1 overflow-y-auto">
          <ControlPanel config={config} dispatch={dispatch} />
        </div>

        <div className="border-t border-neutral-800 p-4">
          <ExportButton
            config={config}
            canvasRef={canvasRef}
            widthPx={dims.widthPx}
            heightPx={dims.heightPx}
          />
        </div>
      </aside>
    </main>
  );
}
