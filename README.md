# Cutting Mat Wallpaper Generator

Turn your phone, tablet, or monitor into a **true-to-scale cutting mat**.

This web app generates cutting-mat-style wallpapers with a grid ruled to real-world units. Set the wallpaper at native resolution and a 1-inch square on screen measures 1 real inch, so you can use your screen to measure fabric, paper, vinyl, and other small pieces.

**Live app:** <https://mat-generator.vercel.app/>

## Features

- **Ruled to real-world size:** grid spacing is in inches or centimetres, line thickness is in millimetres, and both are converted using your screen's pixel density (PPI).
- **Device presets:** recent iPhones, Samsung Galaxy S, Google Pixel, iPads, MacBooks, and common monitors, each with its native resolution and screen size.
- **Manual sizing:** enter a diagonal size, a known PPI, or the physical width and height of the screen in mm. This is the most reliable option for desktop monitors.
- **Customizable look:** mat color, major and minor grids, 45° diagonal lines for bias cutting, ruler labels in 8 fonts, and corner registration marks.
- **Native-resolution PNG export:** the download always matches the device's exact pixel size, never the scaled-down preview.
- **Private:** no accounts, no backend, no tracking. Everything renders in your browser.
- **Works on phones:** you can make a phone wallpaper from the phone itself.

## How to use it

1. **Pick your screen.** Choose Phone, Tablet, or Desktop and select your device. If it isn't listed, or you're on a monitor, use **Manual** and enter its size.
2. **Choose an orientation** (portrait or landscape) and **units** (in or cm).
3. **Style the mat:** colors, grid spacing and thickness, diagonals, ruler labels, and corner marks.
4. **Download the PNG** and set it as your wallpaper.

### Getting accurate measurements

The scale is only correct if the wallpaper is shown pixel-for-pixel:

- Set it at **native resolution**, without cropping, zooming, or "fit to screen" scaling.
- Turn off parallax and perspective zoom. On iOS, disable **Perspective Zoom** when setting the wallpaper.
- On a desktop, view the PNG at **100% zoom** with no OS display scaling applied to the image.
- To check it, lay a physical ruler against a 1-inch (or 1 cm) major grid square.

### How the scale is calculated

Browsers can't detect a screen's physical size, so the app calculates pixel density (PPI) from what it knows:

```
PPI = √(width_px² + height_px²) / diagonal_inches
spacing_px = spacing_inches × PPI
thickness_px = max(1, round(thickness_mm / 25.4 × PPI))
```

Device presets use the manufacturer's exact full-rectangle diagonal, not the rounded marketing size. For example, an iPhone 17 is listed at 6.27″, not 6.3″. Small diagonal errors produce measurable scale errors.

## Running locally

Requirements: **Node.js 18.17+** (developed on Node 22).

```bash
git clone https://github.com/yijiuntay/mat_generator.git
cd mat_generator
npm install
npm run dev        # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build a static export into `out/` |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

### Deploying

The app is configured as a static export (`output: 'export'` in `next.config.mjs`). `npm run build` writes a plain HTML/JS/CSS site to `out/`, which you can host anywhere: Vercel, Netlify, GitHub Pages, Cloudflare Pages, or an S3 bucket.

## Project structure

```
app/                  Next.js App Router shell (layout, main page)
components/
  CanvasPreview.tsx   Full-resolution offscreen canvas + scaled preview
  ControlPanel.tsx    Groups the control sections
  ExportButton.tsx    PNG export + accuracy caveat
  controls/           Device, size, color, grid, ruler, and extras controls
  ui/                 Small shared UI primitives
lib/
  render-mat.ts       Pure Canvas 2D rendering engine (no React)
  ppi.ts              Size and scale math
  device-presets.ts   Device resolution/diagonal dataset
  fonts.ts            Ruler font list + font-loading helper
  state.ts            Default config + reducer
  types.ts            Shared types
```

**Tech stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, the native Canvas 2D API, `react-colorful`, and Vitest.

## Contributing

Contributions are welcome! Open an issue to report a bug or suggest an idea, or send a pull request.

### Workflow

1. Fork the repo and create a branch: `git checkout -b feat/my-change`
2. Make your change and keep it focused.
3. Make sure everything passes:
   ```bash
   npm test
   npx tsc --noEmit
   ```
4. Open a pull request that explains what changed and why. For visual changes, include a screenshot.

### Adding or updating a device preset

The most useful contribution is keeping `lib/device-presets.ts` accurate. Device specs go out of date as new models ship.

- **Use official sources only:** the manufacturer's tech-specs page (Apple Support, Samsung, Google Store/Pixel support, etc.). Don't use leaks, rumor sites, or unsourced spec aggregators.
- **List resolutions in portrait** (`heightPx >= widthPx`). The app swaps them for landscape.
- **Use the most precise diagonal published:** the full-rectangle measurement, not the rounded-corner one. If the manufacturer gives millimetres, divide by 25.4.
- **Sanity-check the diagonal:** PPI calculated from your values should be close to the PPI the manufacturer publishes.
- **Link the source** for each device in your PR description.

### Guidelines

- **Accuracy comes first.** Changes to `lib/ppi.ts` or `lib/render-mat.ts` need unit tests and must not change real-world scale.
- **Keep `render-mat.ts` pure:** it should depend only on the canvas context, with no React or DOM assumptions.
- **Keep dependencies minimal.** Please open an issue before adding a new dependency.
- **Stay in scope:** accounts, a backend, and analytics/telemetry are intentionally out of scope.
- **Test the mobile layout** for any UI changes.

## License

[MIT](LICENSE) © 2026 yijiuntay
