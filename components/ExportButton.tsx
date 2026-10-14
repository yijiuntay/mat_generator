'use client';

import { useState } from 'react';
import { DEVICE_PRESETS } from '@/lib/device-presets';
import type { MatConfig } from '@/lib/types';

function safeLabel(config: MatConfig, widthPx: number, heightPx: number) {
  const size = config.size;
  if (size.mode === 'preset') {
    const p = DEVICE_PRESETS.find((x) => x.id === size.presetId);
    if (p) return p.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  return `${widthPx}x${heightPx}`;
}

export function ExportButton({
  config,
  canvasRef,
  widthPx,
  heightPx,
}: {
  config: MatConfig;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  widthPx: number;
  heightPx: number;
}) {
  const [busy, setBusy] = useState(false);

  const onExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setBusy(true);
    // Guard against jank on very large (5K+) canvases — toBlob is async but
    // encode still takes real time.
    canvas.toBlob((blob) => {
      if (!blob) {
        setBusy(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const label = safeLabel(config, widthPx, heightPx);
      a.href = url;
      a.download = `cutting-mat-${label}-${widthPx}x${heightPx}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBusy(false);
    }, 'image/png');
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onExport}
        disabled={busy}
        className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-sky-500 disabled:cursor-wait disabled:bg-sky-800"
      >
        {busy
          ? 'Encoding PNG…'
          : `Download PNG · ${widthPx}×${heightPx}`}
      </button>
      <p className="rounded border border-neutral-800 bg-neutral-900/60 p-3 text-xs leading-relaxed text-neutral-300">
        <b className="text-neutral-100">For accurate scale:</b> set this wallpaper
        at its native resolution with no cropping or "fit to screen" scaling, and
        disable any perspective/parallax zoom effect (iOS: Settings → Wallpaper →
        uncheck "Still" or turn off Perspective Zoom on Live/Still wallpapers).
        Scaled or zoomed wallpapers will not measure true to size.
      </p>
    </div>
  );
}
