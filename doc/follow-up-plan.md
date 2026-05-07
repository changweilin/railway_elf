# Railway Elf 待辦清單

更新日期：2026-05-07

這份文件只保留接下來還能實作或需要驗證的工作。

## 進度更新（2026-05-07）

- 已完成:PWA / meta(延伸候選 C,不含 SW)。新增 `public/favicon.svg`(方形圓角、teal→blue 漸層底、黑色列車剪影,跟 logo-mark 的水滴形分開做,小尺寸與深色 tab bar 下都清楚)+ `public/manifest.webmanifest`(start_url/scope `./` 兼容 Vite base、display standalone、theme/bg #0f1117、icon SVG `purpose: "any maskable"`)。`index.html` head 補:description、theme-color、icon link、manifest link、OG 六個(type/site_name/title/description/url/locale,url 絕對指 https://changweilin.github.io/railway_elf/)、Twitter summary card 三個。`npm run build`:dist/ 多了 favicon.svg + manifest.webmanifest(public pass-through),index.html 從 2.38 kB → 3.23 kB;`npm run test:smoke` 21 passed / 1 skipped。刻意不做:apple-touch-icon.png(180×180)、og-image.png(1200×630)— 環境沒有可靠 raster 工具,iOS 主畫面會 fallback 到截圖、社群預覽會 fallback 到純文字 summary card,等之後有設計檔再補。SW / 離線也沒做(每月資料更新與 SW cache 的互動要單獨設計)。
- 已完成:ES module 改寫(延伸候選 B)。把 `rail-data.{,generated.}js` / `app-core.js` / `app-map.js` 從 `public/assets/` `git mv` 進 `src/`(原本在 public/ 下,Vite 只當靜態檔不 transform);全部從 `window.X = ...` / `Object.assign(window, ...)` 改 `export const`;rail-data.generated.js 的 emit 模板改 `export const RAIL_SHAPES`;`scripts/fetch-rail-shapes.mjs` 的 OUT_PATH 與 `loadStationsFromRailData()` 的字面量 regex 跟著改。`app-core.js` ↔ `app-map.js` 是故意的 ESM circular import — React component body / handler 內 lazy reference 沒問題,top-level read 才會 undefined。`src/main.js` 改成完整 entry(`createRoot(...).render(React.createElement(App))`),刪掉 `public/assets/render.js`,`index.html` 只剩一個 `<script type="module" src="/src/main.js">`。check 腳本改用 top-level `await import("../src/rail-data.js")` 取代 vm.runInContext + window-shim。`npm run build` 從 28 modules / 292 kB / gzip 89 kB → 32 modules / 528 kB / gzip 173 kB(主要是 RAIL_SHAPES 字面量 ~280 kB 進入 main bundle,後續可用 manualChunks 拆),其它 3 個 check 通過、`test:smoke` 21 passed / 1 skipped。文件同步全部從「UMD / classic scripts」改「Vite ESM bundle / import-export」,範例 `eval(readFileSync(...))` 改 `await import(...)`,路徑 `public/assets/...` 改 `src/...`。
- 已完成:資料更新 workflow 自動 commit snapshot(延伸候選 E)。`.github/workflows/update-rail-shapes.yml` 在 `Detect diff` 之後加兩個 conditional step(只在 `generated.js` 真的變了時才跑):先 `node scripts/check-line-shapes.mjs` 走 ratchet,若 fail 就讓 workflow fail、不開 PR(資料退化時不要把退化值寫回 snapshot);通過後 `node scripts/check-line-shapes.mjs --update` reseed。`add-paths` 加 `scripts/line-shape-snapshot.json`,讓 `peter-evans/create-pull-request@v6` 把 snapshot 與 `rail-data.generated.js` 一起放進 PR。本機驗證:`check:shapes` 對 23 條線通過(snapshot 2026-05-07T04:37 基準);`--update` 在指標未變時只動 `updatedAt`,但步驟只在 generated.js 已有 diff 時跑,所以不會造成假 PR。
- 已完成：地圖上方「現在 / 預測」HUD tab 接到全局 `quickPick` / `handleQuickPick`，移除 `MapArea` 內部 local `hudMode`，切換 tab 即同步 `targetTime`，`liveTrains` useMemo 與 marker effect 立即重算。涉及 `public/assets/app-core.jsx`、`public/assets/app-map.jsx`，`npm run build` 已通過。
- 已完成:失敗狀態 e2e 測試(延伸候選 D)。新增 `tests/failure-states.spec.mjs`,4 個 case 在 desktop + mobile project 都跑(8 passed):geolocation 拒絕(`addInitScript` 替 `navigator.geolocation` stub,點 panel 內「使用我的位置」→ 確認 `.notice-error` 文字含「已拒絕定位權限」,並驗 dismiss 後消失);Nominatim 失敗(`page.route` abort `**/nominatim.openstreetmap.org/**`,在 search input 打字 → 確認 `.search-error` 出現,清空後消失);Tile burst(同步 abort `cartocdn.com` + `tile.openstreetmap.org`,跳過 `waitForAppReady` 改只等 toolbar,連續 4 次 mouse-drag 觸發 ≥3 tileerror → 確認 `.notice-warn` 含「地圖圖磚載入失敗」);Off-rail empty state(geolocation stub 回 Pacific 24,130 → 確認 `.train-empty-title === '目前位置不在任何鐵道附近'` 且 sidebar `.nearest-empty-title` 同步)。`使用我的位置` 在 panel(`.btn-soft`)與 map FAB(`.map-fab`)有兩個同名 button,scope 改用 `.panel button:has-text(...)`。完整 `npm run test:smoke` 從 13 passed / 1 skip → 21 passed / 1 skip。
- 已完成：CI 串接(延伸候選 A)。新增 `.github/workflows/ci.yml`,`pull_request` + `push:main` 觸發,單一 `verify` job 跑 setup-node@v4 (node 22 + npm cache)、`npm ci`、Playwright browser cache、`npx playwright install --with-deps chromium`、然後依序 `npm run build` → `check:timing` → `check:shapes` → `test:smoke`。失敗時用 `actions/upload-artifact@v4` 上傳 `playwright-report/` + `test-results/`(retention 7 天)。`playwright.config.js` 的 `retries` 改為 `process.env.CI ? 1 : 0`,讓 GH runner 上的 tile CDN 偶發 timeout 自動 retry(本機跑 1 次失敗 → 加 `CI=1` 重跑全綠 13 passed / 1 skip,正是這個機制要擋下的 flake)。新加 `concurrency` group 讓同 PR 多次推送會自動取消前一次。
- 已完成:補上 Playwright smoke test（`tests/smoke.spec.mjs` + `playwright.config.js`，`npm run test:smoke`），desktop 1280×800 與 iPhone 13 mobile emulation（皆走 chromium）共 11 passed / 1 skip。涵蓋 boot、TW/JP 切換、地圖點選、列車詳情開關、HUD tab 立即驅動 `targetTime`、mobile viewport 關鍵控制非遮擋；同時攔 pageerror / console.error / 同源 4xx，第三方 favicon / tile / unpkg 4xx 不視為失敗。新增 devDep `@playwright/test`、需要 `npx playwright install chromium`。
- 已完成：移除 Babel-standalone runtime。`index.html` 不再從 unpkg 載 `@babel/standalone`，三段 `type="text/babel"` 改成一般 `<script>`；`public/assets/app-core.jsx` / `app-map.jsx` 用 `git mv` 改名 `.js`(內容本來就無 JSX，只是 `React.createElement`)；同步更新 README、`.claude/skills/ui-events-review/SKILL.md`、`.claude/agents/ui-logic-engineer.md`、其它 .claude 文件中的路徑引用。`npm run build`、`npm run check:timing`、`npm run test:smoke` 全部通過。
- 已完成：把 React / ReactDOM / Leaflet 從 unpkg 改成 npm dependencies 並進入 Vite bundle。新增 `src/main.js`(import React/ReactDOM/Leaflet + `leaflet/dist/leaflet.css`,在 window 上 expose);`index.html` 拿掉 unpkg `<link>`/`<script>`,所有腳本改成 `<script type="module">`,源順序 main.js → rail-data.generated.js → rail-data.js → app-core.js → app-map.js → render.js。`render.js` 是新拉出來的最後一段(ReactDOM.createRoot().render()),放在 `public/assets/` 讓 Vite 不要 hoist 進 main bundle。`npm run build` 現在會處理 28 modules、輸出 `dist/assets/index-*.js`(292 kB / gzip 89 kB)+ `dist/assets/index-*.css`(15 kB),三個檢查全部通過。
- 已完成:改善失敗狀態 UX。新增 App-level NoticeStack(top-center 浮動 banner,自動 ttl + 手動關閉 + dedupe);`useGeolocation` 把 `alert()` 換成 NoticeStack(error code 1/2/3 各自有對應文字);MapArea tile error 監聽 burst (≥3 in 4 s) 才推一次 `tile-error` notice;SearchBox Nominatim 失敗改成下拉內 inline error。三個 empty state(未選位置 / 離鐵道太遠 / 沒列車匹配)統一由 `renderEmptyState` 產生,標題+細節格式一致,filter 太緊時還會建議放寬。CSS 加 `.notice-stack/.notice-{error,warn,info}/.search-error/.train-empty-{title,detail}/.nearest-empty-{title,detail}`。
- 已完成:資料品質 guardrails。新增 `scripts/check-line-shapes.mjs` + `scripts/line-shape-snapshot.json` + `npm run check:shapes`。每次跑檢查 23 條線的 totalKm / monotonic / maxStationOffsetKm,對 snapshot ratchet:totalKm 不能掉超過 5%、maxOffset 不能超過 snapshot + 0.5 km、stations 必須 monotonic;`--update` flag 在資料 PR 確認後重寫 snapshot。`scripts/fetch-rail-shapes.mjs` 加 `[FRESH]/[CACHE]` 大寫 prefix + 結尾 `[SOURCE SUMMARY]`(fresh/cache-offline/cache-fallback 三類計數),fallback 會 highlight 警告,讓資料 PR 一眼判斷用了快取還是新資料。Tokaido-Shinkansen 已 snapshot 在 464.82 km,後續更新若再短少會 fail。

---

## 現況重點

- App 是靜態 Vite 專案,入口為 `index.html`,base `./` 可放 sub-path。
- React 18 / ReactDOM / Leaflet 已改成 npm dep 並由 Vite bundle(`src/main.js` entry)。`app-core.js` / `app-map.js` / `rail-data.js` / `rail-data.generated.js` 全都搬進 `src/` 並走 ES module import / export(2026-05-07 完成 B),`index.html` 只剩一個 `<script type="module" src="/src/main.js">`。`app-core.js` ↔ `app-map.js` 是故意的 circular import,僅在 component body 內 lazy reference。
- `npm run build` 真的會處理 32 modules,輸出 hashed JS(528 kB / gzip 173 kB)/ CSS。
- `npm run check:timing` 驗列車生成;`npm run check:shapes` 驗 line shape 對 snapshot 的 ratchet。
- `npm run test:smoke` 跑 Playwright 對 dist preview,涵蓋 boot / 互動 / HUD / mobile viewport(11 passed / 1 skipped)。
- 失敗 UX 走 NoticeStack(geolocation / tile burst)+ inline error(search)+ 統一 empty state。
- 資料更新腳本 + 每月 GitHub Actions 已存在;`fetch-rail-shapes.mjs` 會列 `[SOURCE SUMMARY]` 標明 fresh / cache。Tokaido-Shinkansen 16% 短少透過 snapshot ratchet 鎖死下限。

## 接下來可以做

### 1. [已完成] 補瀏覽器 smoke test

實作：`tests/smoke.spec.mjs` + `playwright.config.js`，由 `npm run test:smoke` 觸發。webServer 自動啟 `npm run preview --port 4173 --strictPort`。

涵蓋：

- 同源 4xx / pageerror / console.error / unhandledrejection 攔截（第三方 favicon、tile CDN、unpkg 不視為失敗）。
- `#app` non-empty、`.toolbar` 出現、`.leaflet-tile-loaded` 至少一張。
- 台灣 / 日本 region 切換、地圖中心點點選後 train list 顯示卡片或 empty state、列車詳情 modal 開關。
- HUD「現在 / 預測」tab 點擊立即驅動 `targetTime`：點預測後 `.map-hud-clock-time` 文字必須改變，再切回「現在」aria-selected 正確。
- iPhone 13 mobile emulation（chromium）下，`.toolbar`、`#map`、`.map-hud-clock`、`.train-list` 都在 viewport 內。

跑法：

- `npm run test:smoke`（會自動 reuseExistingServer 或 spawn preview）。
- CI 上需 `npx playwright install chromium`。

後續想擴的：geolocation 失敗的 UX 出來後加一條對應 case；Babel standalone 移除後檢查 console 仍乾淨。

### 2. [已完成] 先移除 Babel standalone runtime

實作：

- `index.html` 移除 `<script src="…@babel/standalone…">`、把三段 `type="text/babel" data-presets="env,react"` 改成一般 `<script>`。
- `public/assets/app-core.jsx` → `app-core.js`、`app-map.jsx` → `app-map.js`(`git mv`，內容無 JSX)。改名後 vite preview 才能用正確的 `application/javascript` MIME serve。
- README / `.claude/skills/ui-events-review/SKILL.md` / `.claude/agents/ui-logic-engineer.md` / 其它 `.claude/*` 引用全部從 `.jsx` 換成 `.js`，並把 Babel-standalone 的描述改成「plain classic scripts」。

驗證:

- `npm run build`、`npm run check:timing`、`npm run test:smoke` 全部通過,smoke test 沒有 Babel/ script loading 相關 console 錯誤。

### 3. [已完成] 讓前端程式進入真正的 build 驗證

實作:

- `npm install react@18.3.1 react-dom@18.3.1 leaflet@1.9.4` 改為 runtime deps。
- 新增 `src/main.js` 作為 Vite entry,import React / ReactDOM (`react-dom/client`) / L / `leaflet/dist/leaflet.css`,然後 `window.React = …` / `window.ReactDOM = …` / `window.L = …` 讓既有 classic-style 腳本繼續用 bare reference。
- `index.html` 拿掉 unpkg 4 個 tag,所有腳本改成 `<script type="module">`,順序固定為 main.js → rail-data.generated.js → rail-data.js → app-core.js → app-map.js → render.js。
- 把原本 inline 的 `ReactDOM.createRoot(...).render(...)` 抽成 `public/assets/render.js`。放在 `public/` 是為了避免 Vite 把它跟 `src/main.js` 合併、導致 render 在 app 腳本前執行(實際踩過一次)。

驗證:

- `npm run build`:28 modules transformed,輸出 `dist/assets/index-<hash>.js`(292 kB / gzip 89 kB)、`dist/assets/index-<hash>.css`(15 kB / gzip 6 kB)、HTML 2.7 kB。
- `npm run check:timing` 通過。
- `npm run test:smoke` 通過(11 passed / 1 skipped),包含 boot、TW/JP 切換、地圖點選、modal 開關、HUD tab 立即驅動 `targetTime`、mobile viewport 不遮擋。

待做(後續可獨立進行):

- ~~把 `app-core.js` / `app-map.js` / `rail-data.js` 改寫為真正的 ES module(import/export 取代 `window.X` globals)~~(2026-05-07 完成,見延伸候選 B)。
- 評估換成 React 18 production build(目前 dev build,bundle size 可降一半)。

### 4. [已完成] 改善失敗狀態 UX

實作:

- App level `NoticeStack` (`public/assets/app-core.js`):top-center 浮動 banner,支援 error / warn / info 三色、ttl 自動消失、手動關閉、`key` 去重(避免一陣 tile-error 連發塞滿畫面)。`pushNotice(text, { level, key, ttlMs })` 注入給 `MapArea`,可擴充給其它子元件。
- `useGeolocation`:`alert()` 全部改用 NoticeStack,GeolocationPositionError code 1(權限拒絕)/2(無訊號)/3(逾時)各有對應文字並提示替代操作(搜尋 / 點地圖)。
- Tile errors (`MapArea` tileLayer effect):監聽 `tileerror` 並做 burst counter,4 秒內 ≥3 次才推一個 `tile-error` notice、避免單張缺圖 noise;effect cleanup 也會 unhook listener、清掉 timer。
- SearchBox:Nominatim fetch 失敗 / 非 2xx 改成下拉清單裡 inline `.search-error` 文字,提示「稍後再試,或在地圖上直接點選位置」;清空輸入時也清 error state。
- Empty states:`renderEmptyState({ nearest, offRail, dirFilter, typeFilters })` 統一產生 train-list 空畫面(尚未選位置 / 離鐵道太遠 / 篩選太緊 / 真的沒列車四個狀態各自有 title + detail);Panel 的 `nearest-empty` 也跟著改成 title/detail 兩段、文案和 actions 一致。
- CSS:`.notice-stack`、`.notice-{error,warn,info}`、`.notice-dismiss`、`.search-error`、`.train-empty-{title,detail}`、`.nearest-empty-{title,detail}`。

驗證:`npm run build`、`npm run check:timing`、`npm run check:shapes`、`npm run test:smoke` 全綠。

### 5. [已完成] 收斂資料品質 guardrails

實作:

- `scripts/check-line-shapes.mjs` 新增,讀 `RAIL_DATA` (merged) 後對每條線算三項指標:`totalKm`(shape 最後一點的 km)、`monotonic`(stations.km 嚴格遞增)、`maxStationOffsetKm`(每站手寫 lat/lng 與 `RailUtil.positionAtKm` 投影位置的 haversine 距離)。
- 規則(對 `scripts/line-shape-snapshot.json` ratchet):
  - `monotonic === false` → FAIL(永遠)。
  - `totalKm < snapshot.totalKm * 0.95` → FAIL。
  - `maxStationOffsetKm > snapshot.maxStationOffsetKm + 0.5 km` → FAIL。
  - 不在 snapshot 的新線 → WARN,提示用 `--update` seed。
- `--update` flag 重寫 snapshot,適合資料 PR 在 review 過後執行。
- npm script `check:shapes`(獨立於 `check:timing`,但同樣是 sandbox bootstrap、可以串進 CI)。
- `scripts/fetch-rail-shapes.mjs` 升級 cache log:`[FRESH]` / `[CACHE]`(OFFLINE 或 fallback)兩種 prefix、結尾 `[SOURCE SUMMARY]` 列出三類計數,fallback 會用 ⚠ + 列出明細,讓資料 PR 一眼判斷用了快取還是新資料。
- Snapshot 已建立(seed),目前 23 條線。Tokaido-Shinkansen 短少 16% 的 known issue 透過 ratchet 變成「不能比現在更短」(目前 464.82 km;5% buffer 容忍到 ~441 km)。

後續可選:

- 若 OSM 將來釋出更乾淨的 Tokaido relation,確認接上後 `totalKm` 更接近實際 552 km 再 `--update` snapshot。
- 把 `check:shapes` / `check:timing` 串進 CI 或 GitHub Actions data-update workflow,讓資料 PR 自動跑。

## 建議順序

1. ~~先做 browser smoke test~~（完成）。
2. ~~移除 Babel standalone~~（完成）。
3. ~~把 React/Leaflet 搬進 Vite build~~（完成）。
4. ~~改善失敗狀態 UX~~（完成）。
5. ~~資料品質 guardrails~~（完成)。

主清單已全部完成。

## 延伸候選 (post-step-5)

每項都標註目標、步驟、風險、估時與優先順序。A、B、C、D、E 已完成。

主清單與延伸候選都已收斂完。

### A. [已完成] CI 串接 — 把 4 個檢查跑在 PR 上

實作:

- `.github/workflows/ci.yml`,trigger `pull_request` + `push:main`,加 `concurrency` group(同 ref 後續 push 會 cancel-in-progress)。
- 單一 `verify` job:`actions/checkout@v4` → `actions/setup-node@v4`(node 22 + `cache: npm`)→ `npm ci` → `actions/cache@v4` 對 `~/.cache/ms-playwright` 快取(key 看 `package-lock.json`)→ `npx playwright install --with-deps chromium` → 依序跑 `npm run build` → `check:timing` → `check:shapes` → `test:smoke`。
- 任一步失敗 job fail。最後一步 `if: failure()` 用 `actions/upload-artifact@v4` 收 `playwright-report/` + `test-results/`,retention 7 天、`if-no-files-found: ignore`。
- `playwright.config.js` 的 `retries` 改為 `process.env.CI ? 1 : 0`。本機驗證:第一次跑因 OSM/CARTO tile CDN 慢,desktop boot + mobile region toggle 都在 `.leaflet-tile-loaded` 等到 30 s timeout;`CI=1` 重跑(觸發 retries=1)13 passed / 1 skipped,正是 retry 要擋下的 flake。
- 4 個 check 都不需要 TDX cred(rail-data.generated.js 已 commit),CI 不必設 secrets。

驗證:本機 `npm run build` / `check:timing` / `check:shapes` / `CI=1 npm run test:smoke` 全綠。實際 GitHub runner 表現待第一個 PR 跑出來才知道,如果 flake 仍嚴重再考慮 retries=2 或拆 job。

### B. [已完成] ES module 改寫 — 拿掉 `window.X` globals

實作:

- `scripts/fetch-rail-shapes.mjs` 的 `emit()` 從 `window.RAIL_SHAPES = ...` 改成 `export const RAIL_SHAPES = ...`;OUT_PATH 從 `public/assets/rail-data.generated.js` 改成 `src/rail-data.generated.js`;`loadStationsFromRailData()` 改抓 `export const RAIL_DATA = (...)` 字面量(原本是 `window.RAIL_DATA = (...)`)。
- 把 `rail-data.js` / `rail-data.generated.js` / `app-core.js` / `app-map.js` 從 `public/assets/` 用 `git mv` 搬到 `src/`(這是讓它們真正進 Vite bundle 的關鍵——public/ 下的檔案 Vite 是當靜態檔 serve,不會 transform)。
- `src/rail-data.js` 從 `window.RAIL_DATA = ...` / `window.RailUtil = ...` / `window.TrainGen = ...` 改成 `export const`,並 `import { RAIL_SHAPES } from "./rail-data.generated.js"`;mergeShapes IIFE 內的 `window.RAIL_SHAPES` / `window.RAIL_DATA` 全改成 module-local 識別字。
- `src/app-core.js`:`import React, { useState, useEffect, useMemo, useRef, useCallback } from "react"`;`import { RAIL_DATA, RailUtil, TrainGen } from "./rail-data.js"`;`import { MapArea, TrainSheet, TrainModal } from "./app-map.js"`(deliberate circular import,只在 component body / handler 引用所以安全);`Object.assign(window, {...})` 改 `export { App, Toolbar, ... }`。
- `src/app-map.js`:`import React, { useState as useStateM, ... } from "react"`(維持 M-suffix 不撞名)、`import L from "leaflet"`、`import { RAIL_DATA, RailUtil } from "./rail-data.js"`、`import { Icon, formatClock, formatCountdown, sameDayISO } from "./app-core.js"`;`if (!window.L) return` 改 `if (!L) return`;export 從 window-assign 改 ESM。
- `src/main.js` 簡化成完整 entry:import React、createRoot、leaflet.css、`{ App }` from `./app-core.js`,然後 `createRoot(...).render(React.createElement(App))`。原本的 `public/assets/render.js` 刪掉。`index.html` 只剩 `<script type="module" src="/src/main.js">` 一個 tag。
- `scripts/check-train-timing.mjs` / `check-line-shapes.mjs`:從 `vm.runInContext` + window-shim 改成 top-level `await import("../src/rail-data.js")`,因為 .mjs 預設就是 ESM,所有 ratchet / 計算邏輯不變。
- 文件同步:README、`.claude/skills/{ui-events-review,rail-data-update,geo-math-verify,market-insight}/SKILL.md`、`.claude/agents/{ui-logic-engineer,geo-analyst,market-analyst,rail-data-curator,i18n-translator}.md`、`scripts/TDX-SETUP.md` 全部把舊路徑 `public/assets/...` 換成 `src/...`,把「UMD / classic scripts / `window.X` globals」描述換成「Vite ESM bundle / import-export / 故意的 circular import」,把示範用的 `eval(readFileSync(...))` 換成 `await import(...)`。

驗證:

- `npm run build`:32 modules transformed(原本 28 個,因為 4 個 source file 進了 module graph),輸出 `dist/assets/index-*.js` 528 kB / gzip 173 kB(原本 292 kB / 89 kB),CSS 不變。bundle 變大主要是 rail-data.generated.js 那 ~280 kB 的 RAIL_SHAPES literal 現在被 inline 進 main bundle;以前它在 public/ 是另一個 module fetch。後續若要 code-split 可用 `manualChunks`。
- `npm run check:timing`、`npm run check:shapes`、`npm run test:smoke`(21 passed / 1 skipped)全綠。

風險證實:circular import 在實務上沒有問題——React component bodies 與 event handlers 是 lazy reference,等到呼叫時兩個 module 都已經完整 evaluate 完。如果未來在 module top level 直接讀取 `MapArea` 或 `Icon`(例如做成常數陣列)就會撞 `undefined`,要拆成 lazy getter 或拆檔。

### C. [已完成] PWA / meta(favicon、OG、manifest)

實作:

- 新增 `public/favicon.svg`:獨立的 64×64 圖標(teal→blue 漸層底,黑色列車剪影),為了在小尺寸與深色 tab bar 下都清楚可辨,改成方形圓角(rx=14)而不是 logo-mark 的水滴形;與 `public/assets/logo-mark.svg`(品牌主視覺)分開,品牌 logo 保持自由形狀。
- 新增 `public/manifest.webmanifest`:`name`/`short_name` = "Railway Elf"、`description`、`start_url: "./"`、`scope: "./"`(兼容 Vite `base: './'` 部署到 sub-path 的設定)、`display: standalone`、`orientation: portrait`、`background_color`/`theme_color: #0f1117`(與深色 UI 一致)、`lang: zh-TW`、icon 指向 `favicon.svg`(`purpose: "any maskable"`)。
- `index.html` head 加:`<meta name="description">`、`<meta name="theme-color" content="#0f1117">`、`<link rel="icon" type="image/svg+xml" href="./favicon.svg">`、`<link rel="manifest" href="./manifest.webmanifest">`、OG 五個(type=website、site_name、title、description、url=`https://changweilin.github.io/railway_elf/`、locale=zh_TW)、Twitter card 三個(card=summary、title、description)。url 採絕對(scrapers 需要),其餘資源走相對 base。

驗證:

- `npm run build`:32 modules 跟之前一樣,新加的 `dist/favicon.svg`、`dist/manifest.webmanifest` 由 Vite public/ pass-through 自動帶過去,index.html bundle 從 2.38 kB → 3.23 kB(+0.85 kB / +0.32 kB gzip)。
- `npm run test:smoke`:21 passed / 1 skipped(沒有 favicon 404 或 manifest parse error)。

刻意不做的:

- **apple-touch-icon.png**(180×180):iOS 18+ 仍偏好 PNG,SVG 不被「加到主畫面」採用。要靠工具(sharp / inkscape / Figma export)生 PNG,目前環境沒有可靠的 raster pipeline。沒做的後果:iOS 加到主畫面時用 viewport 截圖當圖標,會糊但不會壞。
- **og:image**(1200×630 PNG):同上,沒可靠工具生圖。少了 og:image 的 Twitter card 會 fallback 成純文字 summary card(仍可用),Facebook / LINE 抓不到預覽圖時會 fallback 到網域 favicon。
- **Service Worker / 離線**:把 scope 拉大很多,而且每月資料更新跟 SW cache 的互動需要單獨設計(SW 不能擋更新)。如果未來要做,推薦走 `vite-plugin-pwa` 而不是手寫 SW。

後續可選:用設計工具生 `public/apple-touch-icon.png`(180×180)+ `public/og-image.png`(1200×630),然後在 `index.html` 加兩個 link / meta tag。

### D. [已完成] 失敗狀態 e2e 測試 — Playwright 覆蓋 step 4 NoticeStack

實作:

- `tests/failure-states.spec.mjs`,4 個 test 在 desktop + mobile 兩個 project 都跑(8 passed)。
- Helpers:`waitForToolbar`(輕量 ready check,不依賴 `.leaflet-tile-loaded` — tile burst 會故意全擋);`waitForAppReady`(完整版,有 tile);`openPanelIfNeeded`(檢查 `.tb-menu-btn` 有沒有展開 panel,只在 mobile 有用);`installGeolocationStub({ kind, code | lat,lng })`(`addInitScript` 替 `navigator.geolocation`,在頁面腳本之前注入)。
- Case 1 — Geolocation 拒絕:stub 回 `code: 1`,點 panel 內「使用我的位置」(注意 panel 與地圖 FAB 共用同一 accessible name,要 scope `.panel button:has-text(...)`),驗 `.notice-error` 含「已拒絕定位權限」,並按 `.notice-dismiss` 後 count 變 0。
- Case 2 — Nominatim 失敗:`page.route('**/nominatim.openstreetmap.org/**', r => r.abort())`,search input 填字觸發 400ms debounce,驗 `.search-error` 出現且含「搜尋暫時無法使用」,按 `.search-clear` 後 count 變 0。
- Case 3 — Tile burst:同時 abort `**/*.basemaps.cartocdn.com/**`、`**/cartocdn.com/**`、`**/*.tile.openstreetmap.org/**`(各種 tile 來源都擋掉),跳過 `waitForAppReady` 改只等 toolbar(否則會 hang),連 4 次 mouse drag pan 地圖逼出新的 tile request,驗 `.notice-warn` 含「地圖圖磚載入失敗」。
- Case 4 — Off-rail:stub 回 Pacific Ocean 24, 130,點「使用我的位置」,驗 `.train-empty-title === '目前位置不在任何鐵道附近'`、`.train-empty-detail` 含「km」、sidebar 的 `.nearest-empty-title` 同步。

風險證實:tile burst 在 abort 攔截下確實會 fire ≥3 tileerror(初始 viewport + 第一個 pan 就破門檻),`addInitScript` 路線可靠(`Object.defineProperty(navigator, 'geolocation', {...})` 用 configurable: true 即可)。`grantPermissions` 走不通是因為要的是 `error` callback 而不是缺權限。

不在範圍:filter-too-tight(typeFilters / dirFilter 設緊)— 預設台北位置雙向都有 train,要可靠造出 0-match 需要事先固定資料 or mock 時間,複雜度高、收益低。如果之後有時間可以單獨補一條,但 D 的 4 個 case 已經把 step 4 的核心 UX 鎖住了。

### E. [已完成] 資料更新 workflow 自動 commit snapshot

實作:

- `.github/workflows/update-rail-shapes.yml` 在 `Detect diff` 之後、`Open PR` 之前加兩個 conditional step(`if: steps.diff.outputs.changed == 'true'`):
  1. **Validate against shape ratchet** — `node scripts/check-line-shapes.mjs`。失敗時 workflow fail,PR 不會被開,等人介入(這是設計目的:資料退化時 ratchet 把退化值擋在 snapshot 之外)。
  2. **Refresh shape snapshot** — `node scripts/check-line-shapes.mjs --update`。只在 ratchet 通過後才 reseed,新地板就是這次的指標。
- `add-paths` 加上 `scripts/line-shape-snapshot.json`,讓 `peter-evans/create-pull-request@v6` 把 snapshot 與 `rail-data.generated.js` 一起放進 PR,review 時直接看 diff。
- PR body 加註「ratchet 通過 + snapshot 已 reseed」說明,reviewer 不必猜這次是新資料還是舊。

驗證:本機 `npm run check:shapes` 對當前 23 條線通過(snapshot 鎖在 2026-05-07);`npm run check:shapes -- --update` 在指標未變時只會改寫 `updatedAt` 時戳——但因為 step 只在 `generated.js` 已經有 diff 時才跑,snapshot 觸碰不會造成假 PR。

風險與決策:資料 *改善* 時(totalKm 變長、maxOffset 變小)不會 fail,通過後 `--update` 把改善值寫進 snapshot 變成新地板,符合 ratchet 語意。資料 *退化* 時 ratchet 在 update 之前先 fail,不會把退化值寫回 snapshot。`check:shapes` 只用 node 內建 + 讀檔,不需 `npm ci`(workflow 本身也沒裝 deps)。
