# Railway Elf Codex Guide

Use this guide as the project-level operating contract for Codex. The older
`.claude/agents` and `.claude/skills` files are useful source material, but do
not mirror them one-to-one: Codex works best with concise repo instructions and
task-specific delegation only when parallel work is actually useful.

## Project Shape

- Static React 18 + Leaflet app built by Vite. Source files are plain ES modules
  and `React.createElement`; do not introduce JSX or TypeScript unless the user
  explicitly asks for the build pipeline change.
- `src/app-core.js` owns app state, panels, sheets, filtering, notices, and train
  pass calculations.
- `src/app-map.js` owns Leaflet setup, imperative map effects, markers, layers,
  gestures, and the bottom train sheet.
- `src/rail-data.js` is the canonical hand-curated rail data plus `RailUtil` and
  `TrainGen`.
- `scripts/fetch-rail-shapes.mjs` fetches and stitches TDX/OSM geometry, then
  `scripts/split-rail-shapes.mjs` emits per-region generated chunks.
- Generated files (`src/rail-data.generated.js`,
  `src/rail-shapes/*.generated.js`, `scripts/line-shape-snapshot.json`) should be
  changed through scripts, not hand-edited.

## Functional Tracks

Use these as role prompts when decomposing work. In Codex, prefer local work for
tightly coupled tasks and use subagents only for clearly parallel exploration or
disjoint worker patches.

| Track | Owns | Use When | Do Not Touch |
|---|---|---|---|
| Data Pipeline | `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs`, generated shape flow | Adding/editing regions, lines, stations, train templates, OSM/TDX mappings | UI interaction logic unless the data change requires a caller fix |
| Geo Verification | `RailUtil`, duplicated geo helpers in fetch scripts, shape diagnostics | Snap bugs, wrong km, station offsets, stitch/simplify/projection changes | Station facts, translations, UI layout |
| UI Interaction | `src/app-core.js`, `src/app-map.js`, styles tied to interactions | Panels, sheets, modals, filters, map gestures, Leaflet marker behavior | Rail facts, generated files, geo math without a numerical repro |
| Assets & Icons | `src/train-icon-registry.js`, `scripts/build-train-icons.mjs`, `public/assets/train-icons` | New train types, missing icons, contact sheet updates | Rail shapes and timetable logic |
| Locale & Labels | User-facing zh-TW strings, `name`, `nameEn`, direction labels | Translation, romanization, locale consistency, new language planning | Inventing station facts or changing generated shape files directly |
| Service Analysis | Read-only use of `RAIL_DATA`, `RailUtil`, `TrainGen` | Frequency, coverage, headway, class-mix analysis | Shipping code changes unless separately requested |

## Codex Delegation Pattern

- Use an `explorer` subagent for bounded read-only questions, such as "which
  files own train icon lookup?" or "where does snap distance get filtered?"
- Use a `worker` subagent only when its write scope is disjoint, for example
  one worker on train icons while the main thread updates documentation.
- Always tell workers their owned files and that other edits may be happening in
  the repo.
- Keep Data Pipeline and Geo Verification separate when the bug is numerical;
  first reproduce the numeric issue, then patch.
- Keep UI Interaction and Assets separate unless the UI directly consumes a new
  asset registry field.

## Required Checks

Run the narrowest relevant checks before reporting done:

- Data or shape changes: `npm run build:rail-data`, `npm run check:shapes`,
  `npm run check:timing`.
- Train icon changes: `npm run check:train-icons`, `npm run build:train-icons`
  when assets must be regenerated.
- UI changes: `npm run build`, `npm run test:smoke`; use browser testing for
  interaction or responsive layout changes.
- Service worker, PWA, or production entry changes: `npm run build` and the
  related Playwright tests.

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm`.

## Guardrails

- Read the affected file in full before editing `app-core.js`, `app-map.js`, or
  `rail-data.js`; these files have intentional cross-file and data invariants.
- Preserve the deliberate `app-core.js` <-> `app-map.js` ES module cycle by only
  using cross-file references at call time.
- Keep Leaflet objects in refs and clean them up in effects.
- Preserve km units throughout `RailUtil`, shape scripts, and app snap thresholds.
- For loop lines, do not deduplicate the repeated start/end station unless the
  route model is explicitly redesigned.
- If station names or coordinates change, regenerate shapes so station km and
  generated shape data stay aligned.
