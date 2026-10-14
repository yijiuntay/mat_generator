# Cutting Mat Wallpaper Generator — MVP Build Spec

This is the build spec for Claude Code. Follow it in order. Ask before deviating from the data models or rendering math — everything else (component naming, file layout details) is your call.

## 1. Overview

A web app that generates downloadable cutting-mat-style wallpapers (phone / tablet / desktop) with a grid ruled to real-world scale, so the printed-on-screen grid is actually usable for measuring fabric, paper, vinyl, etc. when the wallpaper is set at native resolution.

Core value prop: **true-to-size accuracy**, not just a nice grid graphic. Everything else (fonts, colors, line styles) is secondary customization on top of that.

No backend, no accounts, no database. Static site. Generate → preview → download PNG.

## 2. Tech Stack

- Next.js 14+ (App Router), TypeScript
- Tailwind CSS for the app UI (not the canvas output)
- Native Canvas 2D API for rendering — no SVG, no charting libs
- `react-colorful` for color pickers
- Google Fonts, self-hosted subset via `next/font/google` where possible (fallback: `<link>` + `document.fonts.ready`)
- Deploy target: Vercel, static export if possible

Do not add: state management libraries (useReducer is enough), a database, auth, or a component library. Keep dependencies minimal.

## 3. Repo Structure

```
/app
  /page.tsx                 → main app shell (preview + control panel)
  /layout.tsx
/components
  /CanvasPreview.tsx         → scaled live preview
  /ControlPanel.tsx          → wraps all control sections
  /controls/
    DeviceSelector.tsx
    ManualSizeInput.tsx
    ColorControls.tsx
    GridControls.tsx
    RulerControls.tsx
    ExtrasControls.tsx        → diagonal lines, corner marks, unit toggle
  /ExportButton.tsx
/lib
  /render-mat.ts              → pure canvas rendering engine
  /ppi.ts                     → size/scale math
  /device-presets.ts          → device dataset
  /types.ts                   → shared types
  /fonts.ts                   → font list + loading helper
/public
  (any static assets)
```

## 4. Core Concept: True-to-Size Accuracy

Browsers cannot detect physical screen size. We derive **pixels-per-inch (PPI)** one of two ways:

**A. Device preset** — user picks a known device from a dropdown; we already know its resolution and diagonal size, so we precompute PPI.

```
PPI = sqrt(width_px² + height_px²) / diagonal_inches
```

**B. Manual input** — user enters one of:
- diagonal size (inches) + resolution (px × px) → compute PPI via formula above, or
- PPI directly (if they know it), or
- physical width/height in mm directly (covers monitors, where diagonal-to-resolution mapping varies a lot between models at the same size)

Manual mode should be the **primary, most-trusted path** in the UI — device presets are a convenience shortcut, not the source of truth, especially for desktop monitors where the same diagonal size ships at wildly different resolutions.

Grid spacing is always defined in real-world units (inches or cm), never in pixels directly. Convert to px using PPI only at draw time:

```
spacing_px = spacing_real_units * PPI   (× 2.54 if cm)
```

Line thickness is defined in **mm**, capped at a configurable MVP maximum (default max: 5mm, min: 0.25mm), converted to px and floored at 1px minimum so it never disappears on high-density displays... but not upscaled beyond its real mm value on low-density ones — i.e., don't let it look artificially different from the number on the label.

### Required user-facing caveat

Show this (or equivalent) near the export button, always visible, not just on first load:

> **For accurate scale:** set this wallpaper at its native resolution with no cropping or "fit to screen" scaling, and disable any perspective/parallax zoom effect (iOS: Settings → Wallpaper → uncheck "Still" or turn off Perspective Zoom on Live/Still wallpapers). Scaled or zoomed wallpapers will not measure true to size.

## 5. Data Models (`lib/types.ts`)

```ts
type Unit = 'in' | 'cm';

type SizeSource =
  | { mode: 'preset'; presetId: string }
  | { mode: 'manual-diagonal'; diagonalIn: number; widthPx: number; heightPx: number }
  | { mode: 'manual-ppi'; ppi: number; widthPx: number; heightPx: number }
  | { mode: 'manual-mm'; widthMm: number; heightMm: number; widthPx: number; heightPx: number };

type Orientation = 'portrait' | 'landscape';

interface DevicePreset {
  id: string;
  label: string;
  category: 'phone' | 'tablet' | 'desktop';
  widthPx: number;
  heightPx: number;
  diagonalIn: number;
}

interface GridLineStyle {
  color: string;       // hex
  thicknessMm: number;
  spacing: number;     // in `unit`
}

interface MatConfig {
  size: SizeSource;
  orientation: Orientation;
  unit: Unit;

  matColor: string;             // background hex

  majorGrid: GridLineStyle & { enabled: boolean };
  minorGrid: GridLineStyle & { enabled: boolean };
  diagonalLines: { enabled: boolean; color: string; thicknessMm: number; spacingIn: number };

  ruler: {
    enabled: boolean;
    font: string;               // font family key from lib/fonts.ts
    color: string;
    fontSizeMm: number;
    showEveryNth: number;       // label every Nth major line
  };

  cornerMarks: { enabled: boolean; color: string };
}
```

## 6. Device Presets Dataset (`lib/device-presets.ts`)

Seed with the list below. Mark this file with a comment noting it should be periodically verified/expanded — device specs go stale.

```
PHONES
- iPhone SE (3rd gen)         750×1334    4.7in
- iPhone 13/14                1170×2532   6.1in
- iPhone 15/16                1179×2556   6.1in
- iPhone 15/16 Plus           1290×2796   6.7in
- Samsung Galaxy S24          1080×2340   6.1in
- Samsung Galaxy S24 Ultra    1440×3120   6.8in
- Google Pixel 8              1080×2400   6.2in
- Google Pixel 8 Pro          1344×2992   6.7in

TABLETS
- iPad (10th gen)             1640×2360   10.9in
- iPad Air                    1640×2360   10.9in
- iPad Pro 11"                1668×2388   11in
- iPad Pro 12.9"              2048×2732   12.9in
- Samsung Galaxy Tab S9       1600×2560   11in

DESKTOP (flag in UI: less reliable — see manual-mm mode)
- 1080p 24"                   1920×1080   24in
- 1440p 27"                   2560×1440   27in
- 4K 27"                      3840×2160   27in
- 4K 32"                      3840×2160   32in
- 5K 27" (Studio Display)     5120×2880   27in
- MacBook Air 13"             2560×1664   13.6in
- MacBook Pro 14"             3024×1964   14.2in
- MacBook Pro 16"             3456×2234   16.2in
```

Every preset feeds `sqrt(w²+h²)/diagonal` to get PPI. Do the math in `lib/ppi.ts`, not hardcoded per device.

## 7. Rendering Engine (`lib/render-mat.ts`)

Pure function, no React, no DOM assumptions beyond the canvas context — must be independently testable.

```ts
function drawMat(ctx: CanvasRenderingContext2D, widthPx: number, heightPx: number, ppi: number, config: MatConfig): void
```

**Draw order (each step conditional on its `enabled` flag):**

1. Fill background with `matColor`, full canvas.
2. Minor grid lines — full bleed, edge to edge, spacing computed from `minorGrid.spacing * ppi`.
3. Major grid lines — same, drawn over minor grid, on top.
4. Diagonal 45° lines across the full canvas at configured spacing (used for bias-cutting reference).
5. Ruler numbers — along top and left edges, one label every `showEveryNth` major line, showing the real-world distance from the top-left origin (e.g., `1"`, `2"`, `3"`... or `1cm`, `2cm`...). Load font via `document.fonts.load()` / `document.fonts.ready` **before** this step; never draw text on an unloaded font.
6. Corner registration marks — small L-shaped or crosshair marks in all four corners.

**Math notes:**
- Center the grid or anchor it top-left — anchor **top-left** for MVP (simpler, matches ruler numbering, matches how physical cutting mats are read).
- Line thickness: `Math.max(1, Math.round(thicknessMm / 25.4 * ppi))`.
- Do not anti-alias grid lines into blurriness — snap line positions to whole pixels (`Math.round`) to keep them crisp at 1px.

## 8. UI Components

**Layout:** two-pane. Left/top = live preview (dominant, scaled to fit viewport). Right/bottom = scrollable control panel. Stack vertically on narrow viewports (this app will often be used from a phone).

**Control panel sections, in this order:**
1. **Device & size** — category tabs (Phone/Tablet/Desktop/Manual), preset dropdown, orientation toggle, manual-entry fallback fields
2. **Mat color** — single color picker
3. **Major grid** — enable toggle, color, thickness slider (mm, min/max enforced), spacing input (in current unit)
4. **Minor grid** — same fields
5. **Diagonal lines** — enable toggle, color, thickness, spacing
6. **Ruler labels** — enable toggle, font dropdown, color, font size, "label every Nth line"
7. **Corner marks** — enable toggle, color
8. **Units** — in/cm toggle (converts displayed values, doesn't change underlying stored numbers awkwardly — store in one canonical unit internally, e.g. always store spacing in inches, convert for display only)

**Live preview behavior:**
- Render at **full native resolution** on an offscreen/hidden canvas.
- Display a CSS-scaled-down version (`width: 100%; height: auto` inside a fixed-aspect-ratio container) — never re-render at a different resolution just for preview, or accuracy testing becomes meaningless.
- Redraw is debounced via `requestAnimationFrame` while dragging sliders — don't redraw synchronously on every input event.

## 9. State Management

Single `MatConfig` object in a `useReducer` at the page level. One action type per field group is fine (`SET_SIZE`, `SET_MAJOR_GRID`, etc.) — don't over-engineer this into a full action-per-field system. Pass `config` + `dispatch` down as props; no context needed for MVP given the shallow tree.

## 10. Export Flow

- Export button always exports the **full native resolution** canvas as PNG, regardless of what the preview is showing scaled down to.
- `canvas.toBlob('image/png')` → object URL → trigger download.
- Filename convention: `cutting-mat-{deviceLabelOrWxH}-{widthPx}x{heightPx}.png`
- Disable/spinner the export button while the blob is generating on very large (5K+) canvases — it can take a noticeable moment.

## 11. Responsive/Mobile UI

The app itself must work well on a phone browser, since a meaningful chunk of users will be generating a phone wallpaper *from* their phone. Control panel should collapse into accordion sections on small screens rather than one long scroll of every option expanded.

## 12. Acceptance Criteria

- [ ] Selecting a device preset produces a canvas at that device's exact pixel resolution
- [ ] Manual PPI/diagonal/mm entry all produce mathematically consistent grid spacing with each other for the same physical size
- [ ] A 1-inch major grid spacing, measured on a downloaded PNG opened at 100% zoom on a display of known PPI, equals 1 real inch (spot-check with at least one known monitor)
- [ ] Line thickness never renders as 0px regardless of how thin the mm value + ppi combination is
- [ ] Ruler text never renders with a fallback system font (i.e., font-load race condition is actually fixed — test on a hard page refresh, not just hot reload)
- [ ] Orientation toggle correctly swaps width/height and re-centers/re-anchors the grid
- [ ] Exported PNG resolution always matches the selected device's native px dimensions exactly, never the scaled preview size
- [ ] Unit toggle (in/cm) doesn't drift stored values on repeated toggling (convert for display only, canonical storage stays fixed)
- [ ] Works and is usable end-to-end on a phone-sized viewport

## 13. Explicitly Out of Scope for MVP

Do not build any of these unless asked:
- Accounts, saved presets, or a gallery of past generations
- SVG or PDF export
- Custom font upload
- Sharing links / social export
- Multiple cutting mats composited on one canvas
- Server-side rendering of the canvas
- Any analytics/telemetry

## 14. Build Order

1. Types + PPI math (`lib/types.ts`, `lib/ppi.ts`) with a few unit tests for the formula
2. Device presets dataset
3. `render-mat.ts` rendering engine, exercised via a throwaway test page before any UI exists
4. Page shell + `useReducer` state
5. Control panel components, wired to state
6. Live preview (offscreen full-res canvas + scaled display)
7. Font preloading fix
8. Export button
9. Mobile responsive pass on the control panel
10. Walk the acceptance criteria checklist above
