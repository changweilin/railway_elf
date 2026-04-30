---
name: rail-data-update
description: Use when adding, removing, or editing rail lines, stations, or train templates in `public/assets/rail-data.js`, or when adjusting the upstream shape sources in `scripts/fetch-rail-shapes.mjs`. This skill encodes the data invariants that keep rail-data.js, rail-data.generated.js, and the map renderer mutually consistent.
---

# Railway Elf · Rail Data Update

## Mental model

```
rail-data.js  ───┐                        ┌─→  app-map.jsx draws polylines/markers
                 │ (hand-coded stations,  │
                 │  train templates)      ├─→  TrainGen synthesises timetables
                 │                        │
fetch-rail-shapes.mjs                     ├─→  RailUtil.closestOnLine snaps user
   reads RAIL_DATA stations,              │     onto shape, returns km
   fetches real shapes from TDX/OSM,      │
   re-projects stations onto shape →      │
                 ↓                        │
rail-data.generated.js  ──────────────────┘
   (window.RAIL_SHAPES = { lineId: { shape, totalKm, stationKms } })
```

`rail-data.js` then merges `RAIL_SHAPES` into each line: `line.shape` (hi-res polyline with cumulative km) is set, and each station's `km` is **overwritten** with the projected value. The drawing layer prefers `line.shape` when present and falls back to `stations` otherwise.

## Required fields per type

**Line** (`RAIL_DATA[region].lines[]`):
- `id` — must be unique across all regions; used as the join key in `RAIL_SHAPES`, `TDX_LINE_MAP`, `OSM_LINE_MAP`.
- `name` (native), `nameEn`, `color` (hex, used for polyline + chip + train badge tinting).
- `directions: { up, down }` — free-form localised strings.
- `stations[]` — each `{ name, lat, lng, km }`. `km` is cumulative from the line origin and **must be monotonically increasing** (loop lines like Yamanote close back to the origin: km 0 → 34.5 with the same `東京` at both ends; that is allowed).

**Train template** (`RAIL_DATA[region].trainTemplates[]`):
- `line` — must equal a line `id` in the same region.
- `type`, `badge`, `badgeColor`, `speed` (km/h), `interval` (minutes between departures of this type).

## Workflow

1. **Read** `public/assets/rail-data.js` end-to-end before editing — the merge function `mergeShapes` and the helpers `RailUtil` / `TrainGen` rely on exact field shapes.
2. **Edit `rail-data.js`** for the canonical data (stations, line metadata, train templates).
3. If you add a line that should have a real-world shape:
   - For Taiwan: add the line `id` to `TDX_LINE_MAP` in `scripts/fetch-rail-shapes.mjs` with one or more TDX `LineID`s (see the comment block listing 1001/1002/.../1008).
   - For Japan: add to `OSM_LINE_MAP` with a verified Overpass relation id (a `route` relation, not `route_master`).
4. **Run** `npm run build:rail-data` (requires `TDX_CLIENT_ID` / `TDX_CLIENT_SECRET` env for Taiwan; OSM is unauthenticated). Use `--skip-tw` or `--skip-jp` to iterate on one side.
5. **Verify** the generated file: `public/assets/rail-data.generated.js` should now include your line id in `window.RAIL_SHAPES`. Open the app (`npm run dev`) and confirm the line draws as a smooth polyline rather than the station-to-station zigzag fallback.
6. **Commit** both files together — a stale `rail-data.generated.js` will silently disagree with `rail-data.js` (different `km` values, missing stations).

## Common pitfalls

- **Renaming a station** breaks `stationKms` lookup in `mergeShapes` (matched by `name`). Always re-run `build:rail-data` after renames.
- **Lat/lng typos** make `stationKmOnShape` pick a wildly wrong segment; the build script logs `max station offset NNN m` per line — flag anything > 500 m.
- **Loop lines** (Yamanote) — duplicating the start station as the last station with the loop's full km is intentional; do not "deduplicate" it.
- **Picking train numbers**: `makeTrainNumber` in `rail-data.js` has hard-coded ranges per `tpl.type` ("高鐵", "のぞみ", "山手線"…). New types fall through to the default `100..1899` range — that is fine unless the user wants realistic numbering.
- **Direction semantics**: `direction === 'up'` means the train traverses `stations` in reverse. The polyline km axis is unchanged; only `TrainGen.generate`'s loop reorders stops.

## Smoke test before reporting done

```bash
node --check scripts/fetch-rail-shapes.mjs
node -e "const RAIL_DATA={};const window={};
  // stub minimum loader and assert no duplicate ids
  require('fs').readFileSync; // sanity
"
```

Then: `npm run dev`, open the app, switch to the affected region, click somewhere on/near the line. The "最近的鐵軌" panel should show the new line name and a sensible distance; the bottom sheet should list trains of every template that targets it.
