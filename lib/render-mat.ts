import { getFont } from './fonts';
import { inchesToPx, mmToPx, thicknessPx } from './ppi';
import type { MatConfig } from './types';

// Snap a coordinate to the nearest half-pixel offset appropriate for a stroke
// of `strokeWidthPx`. Canvas strokes straddle their coordinate, so for a 1px
// line we want x + 0.5 to avoid the 2px anti-aliased blur; for an even width
// stroke we want an integer coordinate.
function snapForStroke(coord: number, strokeWidthPx: number): number {
  const rounded = Math.round(coord);
  return strokeWidthPx % 2 === 0 ? rounded : rounded + 0.5;
}

function drawFullBleedGrid(
  ctx: CanvasRenderingContext2D,
  widthPx: number,
  heightPx: number,
  spacingPx: number,
  strokePx: number,
  color: string,
): void {
  if (spacingPx <= 0 || !Number.isFinite(spacingPx)) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = strokePx;
  ctx.beginPath();
  // Verticals.
  for (let x = 0; x <= widthPx + 0.5; x += spacingPx) {
    const sx = snapForStroke(x, strokePx);
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, heightPx);
  }
  // Horizontals.
  for (let y = 0; y <= heightPx + 0.5; y += spacingPx) {
    const sy = snapForStroke(y, strokePx);
    ctx.moveTo(0, sy);
    ctx.lineTo(widthPx, sy);
  }
  ctx.stroke();
  ctx.restore();
}

function drawDiagonalLines(
  ctx: CanvasRenderingContext2D,
  widthPx: number,
  heightPx: number,
  spacingPx: number,
  strokePx: number,
  color: string,
): void {
  if (spacingPx <= 0 || !Number.isFinite(spacingPx)) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = strokePx;
  ctx.beginPath();

  // 45° lines have slope ±1. Parameterize by their x-intercept at y=0. For
  // full coverage we need intercepts from -heightPx to widthPx+heightPx so
  // both diagonals cover every pixel of the canvas.
  const start = -heightPx;
  const end = widthPx + heightPx;

  // Down-right diagonals: y - 0 = x - c, so c is the x when y=0.
  for (let c = start; c <= end; c += spacingPx) {
    ctx.moveTo(c, 0);
    ctx.lineTo(c + heightPx, heightPx);
  }
  // Down-left diagonals: y = -(x - c), so at y=0, x=c.
  for (let c = start; c <= end; c += spacingPx) {
    ctx.moveTo(c, 0);
    ctx.lineTo(c - heightPx, heightPx);
  }
  ctx.stroke();
  ctx.restore();
}

function drawRulerLabels(
  ctx: CanvasRenderingContext2D,
  widthPx: number,
  heightPx: number,
  ppi: number,
  config: MatConfig,
): void {
  const { ruler, majorGrid, unit } = config;
  if (!ruler.enabled || !majorGrid.enabled) return;

  const spacingPx = inchesToPx(majorGrid.spacingIn, ppi);
  if (spacingPx <= 0 || !Number.isFinite(spacingPx)) return;

  const step = Math.max(1, Math.round(ruler.showEveryNth));
  const fontOpt = getFont(ruler.font);
  const fontPx = Math.max(8, Math.round(mmToPx(ruler.fontSizeMm, ppi)));
  const pad = Math.round(fontPx * 0.35);

  ctx.save();
  ctx.fillStyle = ruler.color;
  ctx.font = `${fontOpt.weight} ${fontPx}px "${fontOpt.family}", ui-sans-serif, system-ui, sans-serif`;
  ctx.textBaseline = 'top';

  // Top edge — horizontal positions (skip index 0 to avoid overlap with left edge origin).
  ctx.textAlign = 'left';
  for (let i = step, n = 0; ; i += step) {
    const x = i * spacingPx;
    if (x > widthPx) break;
    n = i;
    ctx.fillText(formatRulerValue(i, majorGrid.spacingIn, unit), Math.round(x) + pad, pad);
    if (n > 10_000) break; // hard safety
  }

  // Left edge — vertical positions.
  for (let i = step; ; i += step) {
    const y = i * spacingPx;
    if (y > heightPx) break;
    ctx.fillText(formatRulerValue(i, majorGrid.spacingIn, unit), pad, Math.round(y) + pad);
  }
  ctx.restore();
}

function formatRulerValue(
  gridIndex: number,
  spacingIn: number,
  unit: 'in' | 'cm',
): string {
  const inches = gridIndex * spacingIn;
  const value = unit === 'in' ? inches : inches * 2.54;
  const rounded = Math.round(value * 100) / 100;
  return unit === 'in' ? `${rounded}"` : `${rounded}cm`;
}

function drawCornerMarks(
  ctx: CanvasRenderingContext2D,
  widthPx: number,
  heightPx: number,
  ppi: number,
  color: string,
): void {
  // Arm length ~= 6mm, thickness = 1mm floor 2px so they stay legible.
  const armPx = Math.max(6, Math.round(mmToPx(6, ppi)));
  const strokePx = Math.max(2, Math.round(mmToPx(1, ppi)));
  const inset = Math.max(strokePx, Math.round(mmToPx(2, ppi)));

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = strokePx;
  ctx.beginPath();

  const draw = (x: number, y: number, dx: number, dy: number) => {
    const sx = snapForStroke(x, strokePx);
    const sy = snapForStroke(y, strokePx);
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + dx * armPx, sy);
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx, sy + dy * armPx);
  };

  draw(inset, inset, 1, 1); // top-left
  draw(widthPx - inset, inset, -1, 1); // top-right
  draw(inset, heightPx - inset, 1, -1); // bottom-left
  draw(widthPx - inset, heightPx - inset, -1, -1); // bottom-right

  ctx.stroke();
  ctx.restore();
}

export function drawMat(
  ctx: CanvasRenderingContext2D,
  widthPx: number,
  heightPx: number,
  ppi: number,
  config: MatConfig,
): void {
  // 1. Background.
  ctx.save();
  ctx.fillStyle = config.matColor;
  ctx.fillRect(0, 0, widthPx, heightPx);
  ctx.restore();

  // 2. Minor grid.
  if (config.minorGrid.enabled) {
    const spacingPx = inchesToPx(config.minorGrid.spacingIn, ppi);
    const strokePx = thicknessPx(config.minorGrid.thicknessMm, ppi);
    drawFullBleedGrid(
      ctx,
      widthPx,
      heightPx,
      spacingPx,
      strokePx,
      config.minorGrid.color,
    );
  }

  // 3. Major grid on top of minor.
  if (config.majorGrid.enabled) {
    const spacingPx = inchesToPx(config.majorGrid.spacingIn, ppi);
    const strokePx = thicknessPx(config.majorGrid.thicknessMm, ppi);
    drawFullBleedGrid(
      ctx,
      widthPx,
      heightPx,
      spacingPx,
      strokePx,
      config.majorGrid.color,
    );
  }

  // 4. Diagonals (bias-cutting reference); always in inches per data model.
  if (config.diagonalLines.enabled) {
    const spacingPx = config.diagonalLines.spacingIn * ppi;
    const strokePx = thicknessPx(config.diagonalLines.thicknessMm, ppi);
    drawDiagonalLines(
      ctx,
      widthPx,
      heightPx,
      spacingPx,
      strokePx,
      config.diagonalLines.color,
    );
  }

  // 5. Ruler labels — caller MUST have awaited ensureFontReady() before this.
  drawRulerLabels(ctx, widthPx, heightPx, ppi, config);

  // 6. Corner marks.
  if (config.cornerMarks.enabled) {
    drawCornerMarks(ctx, widthPx, heightPx, ppi, config.cornerMarks.color);
  }
}
