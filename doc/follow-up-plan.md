# Railway Elf 待辦清單

更新日期：2026-05-07

這份文件只保留接下來還能實作或需要驗證的工作。

## 進度更新（2026-05-07）

- 已完成：地圖上方「現在 / 預測」HUD tab 接到全局 `quickPick` / `handleQuickPick`，移除 `MapArea` 內部 local `hudMode`，切換 tab 即同步 `targetTime`，`liveTrains` useMemo 與 marker effect 立即重算。涉及 `public/assets/app-core.jsx`、`public/assets/app-map.jsx`，`npm run build` 已通過。
- 未開始：browser smoke test、Babel standalone 移除、Vite module build 搬遷、失敗狀態 UX、資料品質 guardrails。
- 待驗證：工作區目前有未提交的 About Me 面板、樣式與 HUD time-sync 修改，涉及 `public/assets/app-core.jsx`、`public/assets/app-map.jsx` 與 `public/assets/styles.css`；需在瀏覽器實際切換 HUD tab、確認 marker 即時更新與既有互動沒有 regression 後再視為完成。

---

## 現況重點

- App 仍是靜態 Vite 專案，入口為 `index.html`。
- 前端 runtime 仍從 unpkg 載入 React、ReactDOM、Leaflet 與 Babel standalone。
- `app-core.jsx` 與 `app-map.jsx` 目前主要使用 `React.createElement(...)`，沒有真正依賴 JSX 語法；Babel runtime 可能已經可以先移除或縮小依賴。
- `npm run build` 目前只能驗證 HTML 與靜態資產打包，不能完整覆蓋瀏覽器 runtime 行為。
- `npm run check:timing` 是目前最重要的資料與列車生成 sanity check。
- 資料更新腳本與每月 GitHub Actions 已存在；後續資料品質重點主要剩 Tokaido-Shinkansen 走廊重建長度短少問題。

## 接下來可以做

### 1. [未開始] 補瀏覽器 smoke test

目標：讓 production build 之外，也能驗證真實瀏覽器載入狀態。

- 新增瀏覽器測試腳本，啟動 Vite preview 或靜態 dist 後檢查首頁。
- 捕捉 console error、page error 與 unhandled rejection。
- 檢查 `#app` 已 render、Leaflet map container 非空白、地圖圖層有載入。
- 驗證基本互動：台灣/日本切換、地圖點選、列車列表出現、列車詳情可開關。
- 加一組 mobile viewport，確認側欄、底部 sheet、HUD 與地圖控制不互相遮擋。

完成標準：

- `npm run build` 通過。
- 新增的 smoke test 指令通過。
- 測試失敗時能指出 console/runtime 錯誤，而不是只顯示 build 成功。

### 2. [未開始] 先移除 Babel standalone runtime

目標：先降低 CDN/runtime 依賴，不急著一次搬完整個 React build。

- 確認 `app-core.jsx` 與 `app-map.jsx` 沒有 JSX 語法，只保留可由現代瀏覽器直接執行的 JavaScript。
- 將 `index.html` 中的 `type="text/babel"` script 改為一般 script 載入。
- 移除 `@babel/standalone` CDN script。
- 視需要把檔名從 `.jsx` 改成 `.js`，並同步更新 README 與引用路徑。

完成標準：

- `npm run build` 通過。
- `npm run check:timing` 通過。
- 瀏覽器 smoke test 通過，且 console 沒有 Babel 或 script loading 相關錯誤。

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

1. 先做 browser smoke test，替後續 runtime 調整建立安全網。
2. 再移除 Babel standalone，這是最小的 runtime 依賴瘦身。
3. 接著把 React/Leaflet 搬進 Vite build，讓 build 開始真正檢查前端程式。
4. 最後補 UX 失敗狀態與資料品質 guardrails。
