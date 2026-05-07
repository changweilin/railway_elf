---
name: market-insight
description: Use when the user asks for service-level analytics on the rail data — frequency / interval / coverage / catchment / class-mix questions. Examples "how many trains pass 板橋 per hour", "which station has the densest service", "what fraction of users within 2 km of any line are within 500 m". This skill describes what data is and isn't available in the project today and how to derive answers from it.
---

# Railway Elf · Market & Service Analytics

## What the project actually has

- **Synthetic timetables only.** `TrainGen.generate(region, date)` builds a deterministic-per-day list of trains from `trainTemplates[]`. Each template has `{ speed, interval }` and runs on a fixed 5:30–23:30 service window with up/down staggered by half an interval. There are no real timetables, no peak-hour shaping, no weekend variant.
- **Hand-coded stations** with `{ name, lat, lng, km }` per line. Station km is overwritten by build-time projection onto the real shape.
- **Real shape geometry** for: `TRA-West`, `TRA-East`, `THSR` (TDX), `Tokaido-Shinkansen`, `JR-Yamanote`, `JR-Chuo` (OSM). Other lines fall back to station-to-station polylines — coverage analyses must account for that.
- **No usage telemetry.** Favourites are stored in `localStorage('relf.favs')` only. No backend.

So any "market" question is answered from synthetic supply (intervals × hours × directions) and geometric coverage — not real demand.

## Useful derived quantities

### Service density at a station (passes per hour)

For a station on line L, sum over each `tpl in trainTemplates where tpl.line === L.id`:
`passes_per_hour ≈ 2 · (60 / tpl.interval)` (×2 for both directions; `interval` is per-direction-per-template).

Cross-check against `TrainGen.generate` to confirm: filter the generated list by `train.line.id === L.id` and any stop with `stationIdx` matching the target.

### Catchment (population-style coverage)

Project a grid of points around the region centre onto `RailUtil.closestOnLine` for every line; bucket by snap distance. The app's own thresholds `MAX_SNAP_DIST_KM = 2` and `CANDIDATE_GRACE_KM = 1.0` are reasonable defaults — quote results at "within 2 km of any rail" and "within 500 m" tiers.

### Class mix on a line

Group `trainTemplates` filtered to the line by `type`; report `interval` per type and the fraction of total trains-per-day each accounts for.

### Headway / interval distribution at a chip-snap point

For a fixed user lat/lng, compute `nearest` exactly as `app-core.js` does, then the inter-arrival distribution at that snap point is approximately the line's combined template intervals (after merging up + down). The exact distribution comes from the synthesised `passTime` series — sort and diff.

## Workflow

1. **Decide if the question is supply-only or demand-bearing.** This codebase only answers supply.
2. **Pick the data source**: if the question is "how many trains", run `TrainGen.generate` for a representative date and aggregate. If "how dense is the network", grid-sample `closestOnLine`. If "how do classes mix", aggregate `trainTemplates`.
3. **Run the calculation in a one-off Node script** that loads the same data files the app loads. Pattern:

```js
// scratch/<descriptive-name>.mjs — keep these out of git
import { RAIL_DATA, RailUtil, TrainGen } from '../src/rail-data.js';
// … your aggregation here
```

4. **Quote units explicitly** — "passes per hour per direction", "km of track", "% of grid points within 2 km". This data is approximate and silent unit drift will mislead the user.
5. **Flag synthetic-vs-real** when reporting numbers. e.g. "Yamanote is configured at 4-min headway → ~30 passes/hour/direction; real Yamanote runs ~3-min peak / 5-min off-peak — this app does not model peak shaping."

## What this skill does NOT cover

- Real ridership (no data source).
- Revenue / fare analysis (no fare data).
- Rolling stock utilisation (no consist data).
- Reliability / on-time performance (timetables are deterministic).

If the user asks for any of these, name the missing data source and ask whether they want to (a) ingest a real dataset, (b) extend `trainTemplates` to express the missing dimension, or (c) accept a supply-side approximation.

## Reporting template

```
Question: <user's question>
Data used: <files / functions / what was held synthetic>
Method: <one-paragraph explanation, including unit choices>
Result: <numbers with units>
Caveats: <synthetic-vs-real, missing peak shaping, fallback geometry, etc.>
```
