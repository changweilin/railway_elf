# Railway Elf 待辦清單

更新日期：2026-05-06

這份文件只保留接下來還能實作的工作；已完成的檢查摘要、一次性建檔說明與過期資料問題不再放在 active todo 裡。

## 已清理的舊項目

- `doc/follow-up-plan.md` 建檔與可讀性檢查已完成，後續不再列為待辦。
- `npm run build` 與 `npm run check:timing` 的舊執行結果只代表當時狀態，改為每次修改後的驗證步驟。
- TRA-West 舊的 14 km gap 待查項目已被較新的 TDX/OSM 文件取代；目前 `scripts/TDX-SETUP.md` 記錄的是 WL detour 清理後的狀態。
- TDX schema 變更、GitHub Actions 更新流程與 cache/fallback 策略已收斂到 `scripts/TDX-SETUP.md`，這裡不重複維護。
- 「只新增 Markdown、不更動程式」等本次工作假設已過期，從待辦移除。

## 現況重點

- App 仍是靜態 Vite 專案，入口為 `index.html`。
- 前端 runtime 仍從 unpkg 載入 React、ReactDOM、Leaflet 與 Babel standalone。
- `app-core.jsx` 與 `app-map.jsx` 目前主要使用 `React.createElement(...)`，沒有真正依賴 JSX 語法；Babel runtime 可能已經可以先移除或縮小依賴。
- `npm run build` 目前只能驗證 HTML 與靜態資產打包，不能完整覆蓋瀏覽器 runtime 行為。
- `npm run check:timing` 是目前最重要的資料與列車生成 sanity check。
- 資料更新腳本與每月 GitHub Actions 已存在；後續資料品質重點主要剩 Tokaido-Shinkansen 走廊重建長度短少問題。

## 接下來可以做

### 1. 補瀏覽器 smoke test

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

### 2. 先移除 Babel standalone runtime

目標：先降低 CDN/runtime 依賴，不急著一次搬完整個 React build。

- 確認 `app-core.jsx` 與 `app-map.jsx` 沒有 JSX 語法，只保留可由現代瀏覽器直接執行的 JavaScript。
- 將 `index.html` 中的 `type="text/babel"` script 改為一般 script 載入。
- 移除 `@babel/standalone` CDN script。
- 視需要把檔名從 `.jsx` 改成 `.js`，並同步更新 README 與引用路徑。

完成標準：

- `npm run build` 通過。
- `npm run check:timing` 通過。
- 瀏覽器 smoke test 通過，且 console 沒有 Babel 或 script loading 相關錯誤。

### 3. 讓前端程式進入真正的 build 驗證

目標：把「HTML build 成功但 runtime 壞掉」的落差補起來。

- 評估將 React、ReactDOM、Leaflet 改為 npm dependencies。
- 建立 Vite module entry，讓核心前端程式由 Vite 解析、打包與檢查。
- 保留現有全域資料介面與 UI 行為，先做等價搬遷。
- 搬遷後再評估是否拆分 app/map/data helper 模組。

完成標準：

- app 不再依賴 unpkg React/ReactDOM/Leaflet。
- `npm run build` 會實際處理核心前端程式。
- browser smoke test 與 timing check 都通過。

### 4. 改善失敗狀態 UX

目標：第三方服務或瀏覽器 API 失敗時，使用者能理解並重試。

- 將 geolocation 失敗從 `alert()` 改為畫面中的可讀狀態。
- 補地圖圖磚載入失敗、搜尋/Nominatim 失敗的明確提示。
- 對 TDX/Overpass 更新失敗保留目前 cache fallback，並讓 log 訊息更容易判斷用了快取還是新資料。
- 整理空狀態：未選位置、離鐵道太遠、沒有符合篩選列車時，文案與操作要一致。

完成標準：

- 常見失敗不再只靠 alert 或 console。
- mobile 與 desktop 都能看到錯誤狀態，不遮住主要地圖互動。

### 5. 收斂資料品質 guardrails

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
