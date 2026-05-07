# Railway Elf 待辦清單

更新日期：2026-05-07

這份文件只保留接下來還能實作或需要驗證的工作。

## 進度更新（2026-05-07）

- 已完成：地圖上方「現在 / 預測」HUD tab 接到全局 `quickPick` / `handleQuickPick`，移除 `MapArea` 內部 local `hudMode`，切換 tab 即同步 `targetTime`，`liveTrains` useMemo 與 marker effect 立即重算。涉及 `public/assets/app-core.jsx`、`public/assets/app-map.jsx`，`npm run build` 已通過。
- 已完成：補上 Playwright smoke test（`tests/smoke.spec.mjs` + `playwright.config.js`，`npm run test:smoke`），desktop 1280×800 與 iPhone 13 mobile emulation（皆走 chromium）共 11 passed / 1 skip。涵蓋 boot、TW/JP 切換、地圖點選、列車詳情開關、HUD tab 立即驅動 `targetTime`、mobile viewport 關鍵控制非遮擋；同時攔 pageerror / console.error / 同源 4xx，第三方 favicon / tile / unpkg 4xx 不視為失敗。新增 devDep `@playwright/test`、需要 `npx playwright install chromium`。
- 已完成：移除 Babel-standalone runtime。`index.html` 不再從 unpkg 載 `@babel/standalone`，三段 `type="text/babel"` 改成一般 `<script>`；`public/assets/app-core.jsx` / `app-map.jsx` 用 `git mv` 改名 `.js`(內容本來就無 JSX，只是 `React.createElement`)；同步更新 README、`.claude/skills/ui-events-review/SKILL.md`、`.claude/agents/ui-logic-engineer.md`、其它 .claude 文件中的路徑引用。`npm run build`、`npm run check:timing`、`npm run test:smoke` 全部通過。
- 未開始：Vite module build 搬遷、失敗狀態 UX、資料品質 guardrails。
- 待驗證：HUD time-sync 與 About Me 面板已 commit（`181124d`），smoke test 涵蓋 boot / 互動 / HUD 切換；剩下 About Me 面板的視覺微調仍建議在瀏覽器人工掃過一次。

---

## 現況重點

- App 仍是靜態 Vite 專案，入口為 `index.html`。
- 前端 runtime 仍從 unpkg 載入 React、ReactDOM、Leaflet 與 Babel standalone。
- `app-core.jsx` 與 `app-map.jsx` 目前主要使用 `React.createElement(...)`，沒有真正依賴 JSX 語法；Babel runtime 可能已經可以先移除或縮小依賴。
- `npm run build` 目前只能驗證 HTML 與靜態資產打包，不能完整覆蓋瀏覽器 runtime 行為。
- `npm run check:timing` 是目前最重要的資料與列車生成 sanity check。
- 資料更新腳本與每月 GitHub Actions 已存在；後續資料品質重點主要剩 Tokaido-Shinkansen 走廊重建長度短少問題。

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

### 3. [未開始] 讓前端程式進入真正的 build 驗證

目標：把「HTML build 成功但 runtime 壞掉」的落差補起來。

- 評估將 React、ReactDOM、Leaflet 改為 npm dependencies。
- 建立 Vite module entry，讓核心前端程式由 Vite 解析、打包與檢查。
- 保留現有全域資料介面與 UI 行為，先做等價搬遷。
- 搬遷後再評估是否拆分 app/map/data helper 模組。

完成標準：

- app 不再依賴 unpkg React/ReactDOM/Leaflet。
- `npm run build` 會實際處理核心前端程式。
- browser smoke test 與 timing check 都通過。

### 4. [未開始] 改善失敗狀態 UX

目標：第三方服務或瀏覽器 API 失敗時，使用者能理解並重試。

- 將 geolocation 失敗從 `alert()` 改為畫面中的可讀狀態。
- 補地圖圖磚載入失敗、搜尋/Nominatim 失敗的明確提示。
- 對 TDX/Overpass 更新失敗保留目前 cache fallback，並讓 log 訊息更容易判斷用了快取還是新資料。
- 整理空狀態：未選位置、離鐵道太遠、沒有符合篩選列車時，文案與操作要一致。

完成標準：

- 常見失敗不再只靠 alert 或 console。
- mobile 與 desktop 都能看到錯誤狀態，不遮住主要地圖互動。

### 5. [未開始] 收斂資料品質 guardrails

目標：資料更新時能提早發現異常線形或站距變動。

- 在 `scripts/check-train-timing.mjs` 或新資料檢查腳本中加入 line shape 指標。
- 追蹤每條線的總長、站點最大偏移、monotonic 結果與前次差異。
- 對 Tokaido-Shinkansen 保留 16% 短少的 known issue，但加上固定門檻，避免未來更新變得更差。
- 若 OSM 未來出現更乾淨的 route/sub-route，再評估取代 corridor reconstruction。

完成標準：

- 資料更新 PR 能看到關鍵線形指標。
- 明顯長度縮短、站點偏移暴增或 monotonic 失敗會讓檢查失敗。

## 建議順序

1. ~~先做 browser smoke test~~（完成）。
2. ~~移除 Babel standalone~~（完成）。
3. 接著把 React/Leaflet 搬進 Vite build，讓 build 開始真正檢查前端程式。
4. 最後補 UX 失敗狀態與資料品質 guardrails。
