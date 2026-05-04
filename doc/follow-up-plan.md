# Railway Elf 後續計畫

## 檢查摘要

- 專案目前是 Vite 靜態前端，主要入口為 `index.html`。
- React、ReactDOM、Leaflet、Babel 目前透過 unpkg CDN 載入，核心程式以 `type="text/babel"` 在瀏覽器 runtime 轉譯 `app-core.jsx` 與 `app-map.jsx`。
- `npm.cmd run build` 已通過；但目前 Vite build 主要處理 HTML 與靜態資產，沒有真正編譯或型態/語法檢查核心 JSX 檔。
- `npm.cmd run check:timing` 已通過，共檢查 1806 班列車，結果為 0 failures。
- 專案已有資料更新腳本與 GitHub Actions；`scripts/TDX-SETUP.md` 已記錄 TDX/OSM 流程、GitHub Actions 設定與已知線形問題。
- 檢查時根目錄沒有 `doc/` 或 `docs/`，本次依指定建立 `doc/`。

## 目前狀態

- 前端介面由 `index.html` 載入 `public/assets/app-core.jsx`、`public/assets/app-map.jsx`、`public/assets/rail-data.js` 與 `public/assets/rail-data.generated.js`。
- `public/assets/rail-data.js` 內含靜態車站、路線與列車生成邏輯，並會合併 `rail-data.generated.js` 的真實線形資料。
- `scripts/fetch-rail-shapes.mjs` 負責從 TDX 與 OSM Overpass 更新線形資料，輸出 `public/assets/rail-data.generated.js`。
- `scripts/check-train-timing.mjs` 可驗證 TrainGen 產生的時刻、停站、行車區間與運動模型是否一致。
- `.github/workflows/update-rail-shapes.yml` 已提供排程與手動觸發資料更新流程。

## 主要風險

- 目前 production build 不能完整代表瀏覽器執行狀態；CDN 載入、Babel runtime 轉譯、Leaflet 地圖初始化與 JSX runtime 錯誤都需要瀏覽器 smoke test 才能發現。
- CDN runtime 依賴讓離線開發、版本鎖定、供應鏈風險與載入失敗處理較弱。
- `app-core.jsx` 與 `app-map.jsx` 沒有被 Vite 正式編譯，容易出現 build 通過但瀏覽器 runtime 失敗的落差。
- 已知資料品質問題仍存在：TRA-West 有約 14 km gap，Tokaido-Shinkansen 走廊重建後總長約短少 16%。
- 定位、搜尋、地圖圖磚與第三方 API 失敗時的使用者回饋仍可加強。

## 後續計畫

### 第一階段：補 runtime/browser smoke test

- 建立瀏覽器 smoke test，確認首頁可載入、React root 成功 render、Leaflet 地圖非空白。
- 驗證 CDN/Babel runtime 實際載入正常，並捕捉 console error 與 unhandled rejection。
- 驗證基本操作：台灣/日本地區切換、地圖點選位置、列車列表出現、列車詳情可開關。
- 補一組行動版 viewport 檢查，確認側欄、底部列車 sheet、地圖 HUD 不互相遮擋。

### 第二階段：工程穩定化

- 將 React、ReactDOM、Leaflet 從 CDN 逐步改為 npm dependencies，並由 Vite module entry 載入。
- 移除瀏覽器端 Babel runtime 轉譯，讓 `app-core.jsx` 與 `app-map.jsx` 進入正式 build 流程。
- 保留既有 UI 行為與資料介面，先做等價搬遷，再處理元件拆分或重構。
- 將 build 驗證擴大到核心前端程式，避免只驗 HTML 的假通過。

### 第三階段：資料品質與 UX 改善

- 優先追 TRA-West 14 km gap，評估在 `TDX_LINE_MAP["TRA-West"]` 補入對應 `WL-N` / `WL-M` entry。
- 重新評估 Tokaido-Shinkansen OSM relation 或 route_master 來源，降低走廊重建造成的長度短少。
- 改善定位失敗提示，避免只用 `alert()`，改成可讀、可重試的 UI 狀態。
- 補搜尋、地圖圖磚、Nominatim、TDX/Overpass 更新失敗時的明確錯誤與 fallback 說明。
- 建立固定的桌面與行動版回歸檢查清單，避免面板、HUD、地圖控制與列車 sheet 互相遮擋。

## 驗收檢查

- `doc/follow-up-plan.md` 存在且可讀。
- `npm.cmd run build` 通過。
- `npm.cmd run check:timing` 通過，並維持 0 failures。
- `git status --short --untracked-files=all` 只顯示本次新增的 `doc/follow-up-plan.md`，不混入 build 產物或其他 unrelated changes。

## 假設與備註

- 本次只新增 Markdown 文件，不更動公開 API、資料格式、前端行為或 npm scripts。
- 文件中提到的介面與工程調整皆為後續建議，不屬於本次實作範圍。
- 資料夾名稱使用使用者指定的單數 `doc/`，不是 `docs/`。
- 文件檔名採 `follow-up-plan.md`。
- 後續優先順序預設為：先讓實際瀏覽器行為可驗證，再整理 build 流程，最後收斂資料品質與 UX。
