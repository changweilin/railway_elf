# Railway Elf

Railway Elf is a React + Leaflet + Vite web application for rail train ETA estimation centered around an interactive map. It combines curated rail network data and train-generation rules to provide nearby-line matching, filtered train lists, and arrival-time predictions, and includes PWA support with offline behavior.

The project is implemented as ES modules and uses `React.createElement` directly (no JSX), designed for multi-region use cases such as Taiwan, Japan, South Korea, Hong Kong, Singapore, Malaysia, Thailand, and Vietnam.

## 1. Title & Description

### Project Name

- Railway Elf

### One-line Description

- A map-first rail app that lets users tap/select a location and quickly get candidate lines, nearby trains, and arrival-time previews.

### Project Positioning

- Frontend-first with data-generation workflows in scripts to keep rail data and train calculations consistent.
- Designed to run as a static site with optional offline support.
- Responsive interaction flow for desktop and mobile.

## 2. Features

- Multi-region support: `taiwan`, `japan`, `korea`, `hongkong`, `china`, `singapore`, `malaysia`, `thailand`, `vietnam`.
- Map-driven candidate-line matching: finds nearby rail lines from a selected point using geometry and tolerance rules.
- Train ETA estimation: `TrainGen` generates train schedules and travel timing derived from track geometry, train speed, and dwell assumptions.
- Interactive map experience:
  - Route, station, and train marker rendering
  - Base map theme/layer switching (streets/terrain/satellite)
  - Viewport and bounds coordination
- Structured train list panel:
  - Filters by direction and rail category (TRA/HSR/Metro/LRT)
  - Time preview modes, favorites, notices, and quick controls
- PWA foundations: offline-ready service worker and manifest support.
- Automated validation:
  - `scripts/check-line-shapes.mjs` for route geometry checks
  - `scripts/check-train-timing.mjs` for schedule consistency
  - CI runs build + shape checks + timing checks + smoke tests
- Train icon governance:
  - `train-icon-registry.js` + `public/assets/train-icons/*`
  - `check:train-icons` and `build:train-icons` scripts for maintenance

## 3. Prerequisites & Installation

### Prerequisites

- Node.js (recommended `22.x`)
- npm (bundled with Node.js)
- Git
- Windows / macOS / Linux

### Installation

```bash
# 1. Enter project directory
cd /path/to/railway_elf
# Windows example:
# cd C:\Users\user\Documents\app\railway_elf

# 2. Install dependencies
npm install
```

### Common Scripts

- `npm run dev` — Start Vite dev server.
- `npm run build` — Create production build.
- `npm run preview -- --host` — Preview production build.
- `npm run test:smoke` — Run Playwright smoke tests.
- `npm run build:rail-data` — Rebuild rail geometry and split per-region shape chunks.
- `npm run build:rail-data:tw` — Rebuild Taiwan dataset only.
- `npm run build:rail-data:jp` — Rebuild Japan dataset only.
- `npm run build:train-icons` — Regenerate train icon assets/maps.
- `npm run check:train-icons` — Validate icon map completeness.
- `npm run check:timing` — Validate schedule generation consistency.
- `npm run check:shapes` — Validate route shape consistency.
- `npm run build:pwa-images` — Build PWA image assets.

### Optional: Rebuild Rail Data via TDX/OSM

```bash
# Windows
Copy-Item .env.example .env
# macOS / Linux
# cp .env.example .env
```

Fill in:
- `TDX_CLIENT_ID`
- `TDX_CLIENT_SECRET`

Then run:

```bash
npm run build:rail-data
```

## 4. Quick Start / Usage

### 4.1 Start the App

```bash
npm run dev
```

1. Open `http://localhost:4180`.
2. Choose a region.
3. Click/ tap map point.
4. Review nearby train candidates and schedule preview from the bottom sheet and map.

### 4.2 Common Usage

- Switch regions to load region-specific rail data.
- Filter by category and direction.
- Change time mode: now / +30 minutes / +60 minutes / custom.
- Save favorite locations for faster re-entry.

### 4.3 Data Maintenance Flow

```bash
npm run build:rail-data
npm run check:shapes
npm run check:timing
```

> `src/rail-data.generated.js` and `src/rail-shapes/*.generated.js` are generated artifacts. Do not edit them manually.

## 5. Project Structure

```text
C:\Users\user\Documents\app\railway_elf
  .github/
    workflows/
      ci.yml
      deploy-pages.yml
      update-rail-shapes.yml
  scripts/
    fetch-rail-shapes.mjs
    split-rail-shapes.mjs
    check-line-shapes.mjs
    check-train-timing.mjs
    check-train-icons.mjs
    build-train-icons.mjs
    build-pwa-images.mjs
    TDX-SETUP.md
    line-shape-snapshot.json
  src/
    main.js
    app-core.js
    app-map.js
    rail-data.js
    rail-data.generated.js
    rail-shapes/
      taiwan.generated.js
      japan.generated.js
      korea.generated.js
      hongkong.generated.js
      china.generated.js
      singapore.generated.js
      malaysia.generated.js
      thailand.generated.js
      vietnam.generated.js
    train-icon-registry.js
  public/
    sw.js
    manifest.webmanifest
    assets/
      styles.css
      tokens.css
      icons.svg
      logo-mark.svg
      logo-mark-180.png
      train-icons/
        README.md
        train-icon-map.json
        *.png
  tests/
    *.mjs
  index.html
  package.json
  package-lock.json
  playwright.config.js
  vite.config.js
  .env.example
  README.md
  README.en.md
```

## 6. License

This project uses the **Apache License 2.0**.

- Keep a complete `LICENSE` file in the repository root when redistributing.
- Official license text: <https://www.apache.org/licenses/LICENSE-2.0>
