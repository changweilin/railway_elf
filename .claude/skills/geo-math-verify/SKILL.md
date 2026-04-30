---
name: geo-math-verify
description: Use when modifying any geometric / numerical code in this project — `RailUtil` (haversine, projectOnSegment, closestOnLine, positionAtKm) in `public/assets/rail-data.js`, or the geo helpers in `scripts/fetch-rail-shapes.mjs` (perpDistKm, simplify, cumulativeKm, stationKmOnShape, stitchPolylines, parseWkt). Also use when investigating "wrong distance" / "snapped to wrong line" / "stations off by N km" bugs.
---

# Railway Elf · Geo Math Verification

## Numerical model in use

- **Earth radius**: `R = 6371 km`. Both files use the same constant — keep it that way.
- **Haversine** for great-circle distance: `2R · asin(sqrt(sin²(Δφ/2) + cosφ₁·cosφ₂·sin²(Δλ/2)))`. Used for cumulative km and final reported distance.
- **Local flat-earth projection** for point-to-segment math:
  - `kx = cos(toRad(latMid)) · 111.32` (km per degree longitude at the local latitude)
  - `ky = 110.57` (km per degree latitude — Δlat rarely matters enough to refine)
  - `latMid = (A.lat + B.lat + P.lat) / 3` — note the **three-way** average. This is intentional so the projection is centred near both endpoints and the query point. Do not "simplify" to the segment midpoint.
- **Douglas–Peucker** simplification with `SIMPLIFY_TOLERANCE_KM = 0.005` (5 m). Iterative stack-based; the boolean `keep` array is `Uint8Array` to avoid GC churn.
- **Polyline stitching** (`stitchPolylines`) greedily appends the segment whose nearest endpoint is closest to the running tail; reverses if the tail-end is closer than the head-end. Junction-deduplicates anything within 1 m (`< 0.001 km`).

## Invariants to check after any change

1. **Cumulative km is monotonic non-decreasing** along the polyline. After `simplify`, recompute `cumulativeKm` — never reuse the pre-simplification array.
2. **`closestOnLine` returns `dist` in km**, not metres or degrees. App-core's `MAX_SNAP_DIST_KM = 2` and `CANDIDATE_GRACE_KM = 1.0` rely on that unit.
3. **`positionAtKm` clamps** to the first/last polyline vertex when `km` is out of range — preserve that. The live-train marker effect calls it with interpolated km that *should* be in range, but train end-of-line edge cases can produce off-by-epsilon values.
4. **`projectOnSegment.t ∈ [0, 1]`** — clamped explicitly. If you remove the clamp the snap point can fall off the segment and `closestOnLine` returns coordinates outside the rail line.
5. **Station re-projection error**: the build script logs `max station offset NNN m` per line. Anything > 500 m means either a bad station coordinate or a wrong upstream relation/LineID. Treat it as a build failure.
6. **Loop lines (Yamanote)**: the polyline's first and last vertex are at the same lat/lng but with different `km` (0 and 34.5). `closestOnLine` will scan both; with a query point near 東京 you can get either depending on tie-breaking. Currently the loop matches the first hit in `if (!best || proj.dist < best.dist)` order — that's stable but not "shortest path along the loop". Don't claim distances along the loop are minimal arc length unless you also implement modular km.

## Quick verification recipe

```bash
node -e "
  const { readFileSync } = require('fs');
  const src = readFileSync('public/assets/rail-data.js', 'utf8');
  // Strip the leading 'window.' assignments and run inside a fake window.
  const window = {}; const w = window;
  eval(src.replace(/^/, ''));  // sets window.RAIL_DATA, window.RAIL_SHAPES (if generated loaded), RailUtil, TrainGen
  const { RailUtil, RAIL_DATA } = window;
  // Sanity: distance Taipei→Kaohsiung along TRA West.
  const tw = RAIL_DATA.taiwan.lines.find(l => l.id === 'TRA-West');
  const taipei = tw.stations.find(s => s.name === '台北');
  const kaohsiung = tw.stations.find(s => s.name === '高雄');
  console.log('km diff:', kaohsiung.km - taipei.km, 'expected ~376');
  console.log('haversine direct:', RailUtil.haversine(taipei, kaohsiung).toFixed(1), 'km (straight line)');
"
```

## When the user reports a snapping bug

Use this triage order:

1. **Off-rail false positive** (user clearly on a line but app says "不在鐵道附近"): check `MAX_SNAP_DIST_KM` (currently 2 km). Then check the line's `shape` (open `rail-data.generated.js`); if it is missing, the fallback uses station-to-station polyline which can be > 2 km from the actual track between distant stations.
2. **Wrong line selected**: print all candidate distances from `closestOnLine` for the user's lat/lng. The chip row already shows them — the bug may be that the *active* line is tied to first-render rather than nearest.
3. **Wrong km on the line**: usually means stitching reversed a TDX sub-line. Check `stitchPolylines` debug — the order in `TDX_LINE_MAP[lineId]` is the seed; the algorithm reverses only follow-up segments.
4. **Distance unit confusion**: anywhere a number is compared to a constant, confirm the constant is also km. `dashArray: '4,6'` is pixels (Leaflet); `weight: 7` is pixels; `radius: 3` (circleMarker) is pixels. `km` and `dist` are kilometres. `lat`/`lng` are degrees.

## Numerical accuracy budget

- Single-segment haversine error vs WGS-84 geodesic: < 0.5% for segments < 100 km. Acceptable.
- Flat-earth projection error vs spherical: < 1 m for segments < 5 km, < 10 m at 50 km. Stations are projected onto pre-simplified polyline whose segments are ≤ ~few km, so projection error is dwarfed by simplification tolerance.
- Cumulative km drift along a 500 km line (Tokaido): O(few hundred metres). The displayed station km in the UI is rounded to 0.1 km; do not surface more precision than that without revisiting drift.
