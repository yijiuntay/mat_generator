'use client';

import { useEffect, useMemo, useRef } from 'react';
import { ensureFontReady, getFont } from '@/lib/fonts';
import { orientedDimensions, resolveSize } from '@/lib/ppi';
import { drawMat } from '@/lib/render-mat';
import { DEVICE_PRESETS } from '@/lib/device-presets';
import type { MatConfig } from '@/lib/types';

interface Props {
  config: MatConfig;
  // Exposes the underlying full-res canvas ref so the export button can
  // toBlob() directly without re-rendering at a different resolution.
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}

export function CanvasPreview({ config, canvasRef }: Props) {
  const localRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const resolved = useMemo(() => {
    const base = resolveSize(config.size, DEVICE_PRESETS);
    const oriented = orientedDimensions(
      base.widthPx,
      base.heightPx,
      config.orientation,
    );
    return { ...oriented, ppi: base.ppi };
  }, [config.size, config.orientation]);

  useEffect(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(async () => {
      const canvas = localRef.current;
      if (!canvas) return;
      if (canvas.width !== resolved.widthPx) canvas.width = resolved.widthPx;
      if (canvas.height !== resolved.heightPx) canvas.height = resolved.heightPx;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (config.ruler.enabled) {
        const fontOpt = getFont(config.ruler.font);
        const sizePx = Math.max(
          8,
          Math.round((config.ruler.fontSizeMm / 25.4) * resolved.ppi),
        );
        await ensureFontReady(fontOpt.family, fontOpt.weight, sizePx);
      }
      drawMat(ctx, resolved.widthPx, resolved.heightPx, resolved.ppi, config);
    });
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [config, resolved.widthPx, resolved.heightPx, resolved.ppi]);

  useEffect(() => {
    canvasRef.current = localRef.current;
    return () => {
      canvasRef.current = null;
    };
  }, [canvasRef]);

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div
        className="relative max-h-full overflow-hidden rounded-lg border border-neutral-800 shadow-2xl"
        style={{
          aspectRatio: `${resolved.widthPx} / ${resolved.heightPx}`,
          maxWidth: '100%',
          maxHeight: '75vh',
          // Cap the display height so tall phone canvases don't blow up the viewport;
          // width auto-derives from aspect-ratio.
          height: `min(75vh, calc(100vw - 2rem))`,
        }}
      >
        <canvas
          ref={localRef}
          className="block h-full w-full"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
}
