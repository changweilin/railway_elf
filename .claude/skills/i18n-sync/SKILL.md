---
name: i18n-sync
description: Use when adding or editing user-facing strings, station names, train type labels, or direction labels in this Railway Elf project. The app currently has zh-TW UI text mixed with Chinese station names (Taiwan) and Japanese station names (Japan). Use this skill to keep all locales aligned and to flag missing translations.
---

# Railway Elf · i18n Sync

## Where strings live

| Layer | File | What |
|---|---|---|
| UI chrome (zh-TW) | `src/app-core.js`, `src/app-map.js` | Buttons, labels, tooltips, time formatters |
| Region/line/station names | `src/rail-data.js` | `name` (native), `nameEn`, `directions.up/down` |
| Train type labels | `src/rail-data.js` `trainTemplates[].type` / `.badge` | "自強", "のぞみ", etc. |
| HTML | `index.html` | `<title>`, `<noscript>` |

## Conventions (verified by reading the code)

- The HTML root is `<html lang="zh-TW">`. zh-TW is the default UI locale.
- Station `name` field stores the native name (Chinese for taiwan, Japanese for japan); `nameEn` stores the romanised/English name.
- Line `directions.up` / `directions.down` are localised free-form sentences (e.g. `"北上 (往基隆)"`, `"上り (東京方面)"`).
- Numeric formatters (`formatClock`, `sameDayISO`, `formatCountdown`) are locale-agnostic — do not regress that.
- Time-related text uses these tokens: `已過`, `現`, `即將通過`, `分`, `分鐘後`, `分鐘`, `小時後`. Treat them as a single set when retranslating.

## Workflow when adding or changing a string

1. **Locate** every UI string the change touches. Grep is fine — strings are inline in JSX `React.createElement` calls.
2. **Decide the locale split**:
   - UI chrome → keep zh-TW unless the user is introducing a real i18n layer.
   - Data labels (lines, stations, train types) → require both native and `nameEn`.
3. **If introducing a new region**: every line needs `name`, `nameEn`, `directions.up`, `directions.down`; every station needs `name` (native) plus a sensible `nameEn` (use Hepburn for Japanese, Tongyong/Hanyu for Taiwan if not provided).
4. **Update the upstream config in `scripts/fetch-rail-shapes.mjs`** when station names change — `loadStationsFromRailData` re-projects stations onto fetched shapes by matching `station.name`. A renamed station silently drops out of `stationKms`.
5. **Run** `npm run build:rail-data -- --skip-jp` (or `--skip-tw`) if you only changed one region's stations, to regenerate `rail-data.generated.js`.

## Checklist before reporting done

- [ ] Every new station has `name` AND `nameEn`.
- [ ] Every new line has `directions.up` AND `directions.down`.
- [ ] No mixed scripts inside one `name` field (e.g. don't write `"東京 Tokyo"` — split into `name` / `nameEn`).
- [ ] If station names changed: re-ran `npm run build:rail-data` and committed `src/rail-data.generated.js`.
- [ ] zh-TW UI strings still parse — any apostrophe or backtick inside JSX `React.createElement("…", {…}, "string")` is escaped.

## When to escalate to a full i18n refactor

If the user asks to support a new UI language (English UI, Japanese UI), this skill is no longer enough — flag that the current code inlines zh-TW strings throughout `app-core.js` and `app-map.js` and that a real i18n approach (e.g. a `t(key, locale)` lookup keyed off `region` or browser locale) is needed before bulk-translating.
