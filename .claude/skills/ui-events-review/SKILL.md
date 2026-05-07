---
name: ui-events-review
description: Use when adding, modifying, or reviewing React state, event handlers, Leaflet side-effects, gestures (swipe / drag-to-resize), or panel/sheet/modal interactions in `public/assets/app-core.js` and `public/assets/app-map.js`. The app uses React 18 UMD loaded as plain classic scripts — no JSX, no Babel — plus Leaflet directly. Review with that constraint in mind.
---

# Railway Elf · UI Events & State Review

## Architecture facts (do not regress)

- **No build step for the React code.** `index.html` loads React/ReactDOM UMD and the app scripts as plain `<script>` tags (no `type="text/babel"`, no Babel-standalone). Everything is `React.createElement(...)` — there is no JSX compilation. New components must follow the same calling convention.
- **Hooks are aliased**: `app-core.js` does `const { useState, useEffect, useMemo, useRef, useCallback } = React;` and `app-map.js` does the same with `M`-suffixed names to avoid identifier collisions across the separately-loaded scripts. Keep that pattern.
- **Globals via `Object.assign(window, { ... })`** at the bottom of each script is how cross-file references work — these scripts are not modules. Adding a new top-level component means exporting it the same way.
- **Leaflet lives in refs**, not state: `mapRef`, `leafletRef`, `userMarkerRef`, `railLinesRef`, `nearestMarkerRef`, `connectorRef`, `trainMarkersRef`, `tileLayerRef`. State changes drive `useEffect`s that mutate the map imperatively. Never put a `L.Map` or `L.Layer` into `useState` — it will deep-compare on every render and thrash.

## State graph (App in app-core.js)

| State | Owner | Drives |
|---|---|---|
| `region` | App | RAIL_DATA selection, default location, type filter reset |
| `now` | App (30s tick) | Countdown text in TrainCard, `quickPick === 'now'` keeps `targetTime` in sync |
| `targetTime` | App | TrainGen.generate cache key (region + day), live train window, slider position |
| `location` | App | candidates / nearest / liveTrains memos |
| `activeLineId` | App | which candidate line drives the train sheet |
| `dirFilter` / `typeFilters` | App | filteredTrains memo |
| `selectedTrain` | App | TrainModal open/close |
| `panelOpen` (mobile) / `panelCollapsed` (desktop) | App | layout class on `.main`, panel visibility |
| `sheetCollapsed` | App | bottom sheet height |
| `quickPick` | App | which `time-quick` button is highlighted; `'now'` re-syncs targetTime to clock |
| `flyTo: {lat, lng, ts}` | App → MapArea | bumping `ts` triggers `map.flyTo` once |
| `timeFocusTick` | App → Panel | bumping it scrolls/flashes the time section, focuses date input |

The **`ts` / tick** pattern (`flyTo.ts`, `timeFocusTick`) is how the codebase models "fire-and-forget" effects without exposing imperative refs across components — preserve it for similar use-cases.

## Effect hazards in this codebase

1. **`mapRef` init effect** (`app-map.js`) — guarded by `if (leafletRef.current) return;` so it runs once. Do not add `[region]` to its deps; region changes are handled by the *fitBounds* effect.
2. **Tile layer effect** removes the previous layer before adding the new one. Skipping the remove leaks tile layers on every theme switch.
3. **Live train markers effect** does diffing manually (`currentIds` set + `setLatLng`/`setIcon` for existing markers). Replacing this with "remove all then re-add" causes flicker and a Leaflet zoom reset on every clock tick.
4. **Sheet drag effect** registers global `mousemove` / `touchmove` / `touchend` / `touchcancel` listeners. Always return the cleanup; otherwise dragging across a hot-reload duplicates handlers.
5. **`map.panTo` deps** are `[location && location.lat, location && location.lng]` — *not* `[location]` (the object identity changes every render due to spread).

## Gesture/interaction primitives present

- **Sheet drag-to-resize** (`app-map.js` TrainSheet): pointer down → set `dragRef.current.active`, `mousemove`/`touchmove` updates `userHeight` clamped to `[120px, 0.85 * mapH]`, persisted to `localStorage('relf.sheetHeight')`. Single click (no movement > 4 px) toggles collapse. Double-click resets to default.
- **Panel swipe-to-close** (`app-core.js` Panel): tracks first touch, closes when `dx < -60` and horizontal beats vertical motion.
- **Time slider**: native `<input type="range">` with custom track/thumb overlay; min 0, max 1439 min, step 5.

## Review checklist

When reviewing or writing new UI logic:

- [ ] Does the new code use `React.createElement`, not JSX?
- [ ] Are Leaflet objects in `useRef`, with `useEffect` cleanup that calls `.remove()` / `.removeLayer()`?
- [ ] Are derived values in `useMemo` with the right deps (the closures often capture `region`, `targetTime`, `nearest` — all three usually need to be in deps)?
- [ ] Are global event listeners (`window.addEventListener`) paired with a cleanup `removeEventListener`?
- [ ] Is `passive: false` set on `touchmove` listeners that call `preventDefault()`?
- [ ] If reusing the `{ts}` tick pattern, is the consumer effect keyed on `[someState && someState.ts]`?
- [ ] Does any new top-level component get re-exported via `Object.assign(window, { ... })`?
- [ ] Is the `localStorage` key prefixed with `relf.`?

## Quick verification

`npm run dev`, then exercise:

1. Resize bottom sheet by dragging handle — height should persist across reload.
2. Click HUD clock — left panel should scroll to the time section and the date input should focus.
3. Swipe the mobile panel left — should close.
4. Switch region → click on the new region → "最近的鐵軌" updates → train sheet repopulates.
5. Drag time slider → live train markers reposition smoothly without flicker; click a moving train → modal opens with timetable.
