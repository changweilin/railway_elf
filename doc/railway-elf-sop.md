# Railway Elf SOP

這份 SOP 只保留日常維護 Railway Elf 時真正需要查的流程。專案層級規則以
`AGENTS.md` 為準；公開介紹與安裝方式看 `README.md`。

## 先判斷改動類型

| 類型 | 主要檔案 | 注意事項 |
|---|---|---|
| 路網資料 | `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs` | 新增/修改 region、line、station、train template、OSM/TDX mapping |
| 幾何驗證 | `RailUtil`, `scripts/fetch-rail-shapes.mjs`, `scripts/check-line-shapes.mjs` | 先重現數值問題，再修 km、projection、stitch、snap |
| UI 互動 | `src/app-core.js`, `src/app-map.js`, `public/assets/styles.css` | 面板、篩選、marker、Leaflet lifecycle、bottom sheet |
| 列車圖示 | `src/train-icon-registry.js`, `scripts/build-train-icons.mjs`, `public/assets/train-icons` | registry、PNG、contact sheet 要一起對齊 |
| 文案標籤 | `name`, `nameEn`, directions, UI strings | 不要憑空發明站名、路線事實或翻譯 |
| 分析報告 | `RAIL_DATA`, `RailUtil`, `TrainGen` read-only | 只做 coverage、frequency、headway、class mix 分析 |

## 5.3 / 5.5 分工

5.3 適合處理範圍清楚、資料來源已確認、可用現有 pattern 完成的任務。5.5
負責不確定性高、需要來源判斷、或牽涉幾何/架構風險的 gate。

### 交給 5.3 的工作

- 依已核准的 source/gate 結果補 region、line、station、train template。
- 更新既有 OSM/TDX mapping、icon registry、train icon recipe。
- 跑 `build:rail-data`、`check:shapes`、`check:timing`、`check:train-icons`、`build`、`test:smoke`。
- 做 read-only service analysis，例如 coverage、headway、class mix。
- 修正範圍明確的 UI bug，但要遵守 React/Leaflet 既有 pattern。

### 先交給 5.5 的工作

- 新城市、新路線、未確認營運狀態、或資料來源彼此衝突。
- OSM relation、TDX LineID、station order、km、座標、loop/corridor 需要判斷。
- `RailUtil`、projection、stitch、simplify、snapshot baseline 等數值或幾何問題。
- `app-core.js` / `app-map.js` 的跨檔狀態、ES module cycle、Leaflet lifecycle、i18n 或 build pipeline 改動。
- 任何會改變路線模型、資料契約、或使用者流程的大範圍調整。

### 5.5 Gate 回覆格式

5.5 gate 要輸出可交給 5.3 執行的明確指令：

- `decision`: `approved` / `blocked` / `needs-research` / `downscope`
- `scope`: region、line id、station、owned files
- `source`: 使用的資料來源與可信度
- `constraints`: 不可變更的事實、route model、snapshot 或 UI 限制
- `checks`: 完成後必跑的檢查
- `report`: 回報時要列出的 before/after、數值或風險

## 基本流程

1. 先界定範圍：region、line id、station、train type、或 UI 行為。
2. 讀完受影響的 owner 檔，再改。`app-core.js`、`app-map.js`、`rail-data.js` 尤其要完整讀。
3. 只改必要檔案；不要順手重構無關區塊。
4. 產生檔不要手改：
   - `src/rail-data.generated.js`
   - `src/rail-shapes/*.generated.js`
   - `scripts/line-shape-snapshot.json`
5. 站名、座標、km 或路線順序變動時，要重建 shapes，避免資料和幾何不同步。
6. 回報時列出改了什麼、跑了哪些檢查、還有什麼風險或待確認。

## 必跑檢查

| 改動內容 | 檢查 |
|---|---|
| 路網資料或 shape | `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing` |
| 列車圖示 | `npm.cmd run check:train-icons`; 若重建資產再跑 `npm.cmd run build:train-icons` |
| UI 互動 | `npm.cmd run build`, `npm.cmd run test:smoke`; 互動/響應式改動要做 browser QA |
| PWA 或 production entry | `npm.cmd run build` 加相關 Playwright 測試 |
| 純文件 | 通常不用跑 build；檢查 diff 即可 |

PowerShell 若 `npm` 被 execution policy 擋住，改用 `npm.cmd`。

## 路網與 Shape 守則

- `line.id` 要和 train template、shape mapping、icon registry 保持一致。
- `RailUtil`、shape script、snap threshold 全部維持 km 單位。
- loop line 不要移除重複的首尾站，除非整套路線模型一起重新設計。
- OSM relation、TDX LineID、`corridor`、`loopAnchor`、`stationStops` 都要有清楚理由。
- `check:shapes -- --update` 只在確認新 baseline 合理後才使用。

## 列車圖示流程

1. 先跑 `npm.cmd run check:train-icons` 找 unresolved key。
2. 優先加 line-aware override：`${region}|${lineId}|${trainType}`。
3. 只有多條線共用同一種車型時，才加 type fallback。
4. 需要新圖時更新 `scripts/build-train-icons.mjs` 的 recipe，再跑 `npm.cmd run build:train-icons`。
5. 最後確認 contact sheet、`train-icon-map.json`、registry path 都一致。

## 不要放進這份 SOP

- 已完成的歷史 checklist。
- 特定模型或舊 agent 的分工細節。
- README 已經有的安裝教學與產品介紹。
- `AGENTS.md` 已經涵蓋的 Codex 操作契約。
