# Railway Elf

A static web app that predicts when the next train will pass a given point on
Taiwan and Japan rail lines. Pick a line, drop a pin, and the map shows live
animated trains plus a sheet listing each upcoming pass.

- Frontend: React 18 + Leaflet 1.9, bundled by Vite from npm dependencies. The app code itself is plain `React.createElement` (no JSX) and shares globals across files via `window.X` assignments.
- Map: Leaflet 1.9 with hand-tuned markers and gestures.
- Data: hand-curated lines/stations/templates in `public/assets/rail-data.js`,
  merged with real polyline geometry generated into
  `public/assets/rail-data.generated.js`.

## Quick start

```bash
npm install
npm run dev          # vite on http://localhost:4180
```

The page is fully static — `npm run build` outputs to `dist/` and can be served
from anywhere (the Vite `base` is `./`, so it works under a sub-path).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server on port 4180. |
| `npm run build` | Static production build into `dist/`. |
| `npm run preview` | Preview the production build. |
| `npm run build:rail-data` | Regenerate `public/assets/rail-data.generated.js` from TDX (Taiwan) + OSM Overpass (Japan). |
| `npm run build:rail-data:tw` | TW lines only (skip Japan). |
| `npm run build:rail-data:jp` | JP lines only (no TDX credentials needed). |
| `npm run check:timing` | Sanity-check generated train timing against templates. |

## Data pipeline

End users do **not** need any API keys — the published site is pure static
HTML/JS. Credentials are only needed when you regenerate the rail-shape file
locally:

1. Register at <https://tdx.transportdata.tw/> and create an API key.
2. `cp .env.example .env` and fill in `TDX_CLIENT_ID` / `TDX_CLIENT_SECRET`.
3. `npm run build:rail-data`.

Full walk-through (with TDX schema notes, OSM relation ids, and known
shape-quality caveats) lives in `scripts/TDX-SETUP.md`.

A GitHub Actions workflow (`.github/workflows/update-rail-shapes.yml`) reruns
the pipeline monthly and opens a PR if the shapes change.

## Repository layout

```
index.html                       Entry HTML; references the Vite bundle and the public app scripts in load order.
src/
  main.js                        Vite entry. Imports React, ReactDOM, Leaflet, leaflet.css; exposes them on window.
public/assets/
  app-core.js                    App shell, state, panels, sheets.
  app-map.js                     Leaflet integration, markers, gestures.
  rail-data.js                   Hand-curated lines / stations / train templates (RailUtil lives here too).
  rail-data.generated.js         Generated polylines + station-km tables (do not edit by hand).
  render.js                      Final ReactDOM.createRoot call; loaded last so the app globals are populated.
  styles.css, tokens.css, icons.svg, logo-mark.svg
  train-icons/                   Top-down PNG icons + train-icon-map.json (see its own README).
scripts/
  fetch-rail-shapes.mjs          TDX + OSM Overpass fetcher / stitcher / simplifier.
  check-train-timing.mjs         Timing sanity check.
  TDX-SETUP.md                   Data-source setup guide.
doc/                             Project notes.
```

## Tech notes

- React, ReactDOM, and Leaflet come from npm via `src/main.js`, which is a
  Vite module entry. Vite bundles them into a hashed `dist/assets/index-*.js`
  and the bundled main.js attaches them to `window` for the legacy classic
  scripts to consume.
- `app-core.js` / `app-map.js` are still loaded as `<script type="module">`
  but are kept in `public/assets/` so Vite copies them through unchanged.
  They share globals (`React`, `ReactDOM`, `L`, `RAIL_DATA`, `RailUtil`,
  `App`, `MapArea`, …) via `window.X` writes; cross-script references
  resolve through the global object even in module scope.
- Keep them UMD-friendly — no ES module imports inside the app scripts and
  no JSX syntax (`React.createElement` only). `render.js` is the final
  script in load order and triggers `ReactDOM.createRoot(...).render(...)`.
- Geometry helpers (haversine, projection, position-at-km) live in `RailUtil`
  inside `public/assets/rail-data.js` and are mirrored on the build side in
  `scripts/fetch-rail-shapes.mjs`.
- Generated shapes are authoritative for station kilometres; the frontend
  `mergeShapes` reconciles the hand-curated and generated data.

## License / data attribution

- Taiwan rail geometry: TDX (交通部運輸資料流通服務).
- Japan rail geometry: © OpenStreetMap contributors, ODbL.
- Train icon visual references: see `public/assets/train-icons/README.md`.
