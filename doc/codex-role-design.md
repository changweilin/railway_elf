# Codex Role Design for Railway Elf

更新日期：2026-05-09

## 結論

此專案需要「依職能分工」，但不需要把 Claude 的 5 個 agent + 5 個 skill
原封不動重建成 Codex 的常駐多代理系統。Railway Elf 的風險主要來自跨檔案不變式：
手寫站表、generated shape、Leaflet 呈現、合成班表、列車圖示彼此牽動。職能分工應該用來
明確 ownership、驗證路徑與 subagent 派工邊界，而不是把每個小任務都拆給不同代理。

建議採用：

1. `AGENTS.md` 作為 Codex 進專案時的短版操作準則。
2. 本文件作為完整分工設計與任務路由依據。
3. 只有在任務可平行、寫入範圍清楚分離時才啟用 Codex subagents。

## 現有 Claude 設定觀察

`.claude/agents` 目前有 5 個角色：

| Claude agent | 主要範圍 |
|---|---|
| `rail-data-curator` | 路線、站點、train templates、TDX/OSM mapping |
| `geo-analyst` | `RailUtil`、projection、snap、stitch、simplify |
| `ui-logic-engineer` | React state、Leaflet effects、panel/sheet/modal/gesture |
| `i18n-translator` | zh-TW UI、站名、`nameEn`、方向文字 |
| `market-analyst` | synthetic service analytics |

`.claude/skills` 也有 5 個對應技能：

| Claude skill | 主要範圍 |
|---|---|
| `rail-data-update` | 資料與 shape pipeline 變更流程 |
| `geo-math-verify` | 幾何與數值驗證流程 |
| `ui-events-review` | UI state / event / gesture review |
| `i18n-sync` | 字串與地名一致性 |
| `market-insight` | 班距、服務密度、覆蓋率等供給面分析 |

這套分類方向正確，但對 Codex 來說有兩個問題：

- skill 與 agent 大量重疊，容易讓日常任務載入過多長規則。
- 沒有涵蓋已成為專案核心的一塊：列車圖示與 PWA/測試驗證。

## Codex 版分工

### 1. Data Pipeline

負責檔案：

- `src/rail-data.js`
- `scripts/fetch-rail-shapes.mjs`
- `scripts/split-rail-shapes.mjs`
- generated shape outputs, but only through scripts

適用任務：

- 新增或修改 region / line / station / train template。
- 新增 OSM relation、TDX LineID、`corridor`、`loopAnchor`、`stationStops`。
- 修正 station km、站序、座標與 generated shape 對齊。

驗證：

- `npm run build:rail-data`
- `npm run check:shapes`
- `npm run check:timing`
- 必要時 `npm run build`

Codex 派工建議：

- 若只是新增一條線，主線直接做，避免代理來回造成不變式遺漏。
- 若同時要查多個地區的 relation id，可派多個 explorer 做 read-only 查證。
- 若資料與 UI 同時變，Data worker 只碰資料檔，UI worker 只碰 UI 檔。

### 2. Geo Verification

負責檔案：

- `RailUtil` in `src/rail-data.js`
- `scripts/fetch-rail-shapes.mjs` 內 duplicated geo helpers
- `scripts/check-line-shapes.mjs`

適用任務：

- snap 到錯線。
- 顯示距離或 km 錯誤。
- station offset 異常。
- shape stitch 方向、loop 起點、simplify、projection 相關變更。

驗證：

- 先用 Node harness 數值重現，不靠目測猜。
- 變更 shared primitive 時，前端與 build script 的版本要保持一致。
- 重跑 `build:rail-data`、`check:shapes`，比較 `totalKm`、`maxStationOffsetKm`、`shapePoints`。

Codex 派工建議：

- 適合派 explorer 先獨立找最小重現與相關函式。
- 不建議和 Data Pipeline 同時改同一段 shape logic；容易互相踩 invariants。

### 3. UI Interaction

負責檔案：

- `src/app-core.js`
- `src/app-map.js`
- `public/assets/styles.css`
- `public/assets/tokens.css`

適用任務：

- 地圖點擊、候選線、train sheet、panel、modal、notice。
- Leaflet layer、marker、live train animation。
- 手勢、拖拉、響應式互動。

硬限制：

- 不用 JSX；維持 `React.createElement`。
- Leaflet objects 放在 refs，不放 state。
- 保持 `app-core.js` 與 `app-map.js` 的 call-time ES module cycle。
- global listeners 必須 cleanup。

驗證：

- `npm run build`
- `npm run test:smoke`
- 互動變更要用 browser / Playwright 檢查至少 desktop + mobile。

Codex 派工建議：

- 大多數 UI 任務主線做即可，因為狀態圖高度耦合。
- 可以派 explorer 找 effect dependency 或既有 gesture pattern。

### 4. Assets & Icons

負責檔案：

- `src/train-icon-registry.js`
- `scripts/build-train-icons.mjs`
- `scripts/check-train-icons.mjs`
- `public/assets/train-icons/*`

適用任務：

- 新增 train type 後補圖。
- 修正 icon lookup、contact sheet、PNG 產物。
- 調整不同 region / line 的 line-aware override。

驗證：

- `npm run check:train-icons`
- `npm run build:train-icons`
- `npm run build`

Codex 派工建議：

- 很適合 worker 獨立處理，前提是 Data Pipeline 已穩定 train template keys。

### 5. Locale & Labels

負責檔案：

- `src/rail-data.js` 的 `name`、`nameEn`、`directions`
- `src/app-core.js` / `src/app-map.js` 的 zh-TW UI 字串
- `index.html` 的 title / noscript / metadata text

適用任務：

- 新地區、新站名、新方向文字。
- romanization / English display audit。
- 導入真正多語 UI 前的範圍評估。

驗證：

- 站名改動後必須重新 build rail data，因為 generated `stationKms` 依 `station.name` 對應。
- UI 字串改動至少跑 `npm run build`。

Codex 派工建議：

- 翻譯 audit 可派 explorer。
- 真正 i18n layer 是架構改造，應先設計再動手。

### 6. Service Analysis

負責檔案：

- 通常 read-only 使用 `RAIL_DATA`、`RailUtil`、`TrainGen`
- 可在暫存腳本或一次性 Node command 中計算

適用任務：

- 服務密度、班距、coverage、class mix、固定點 headway。

限制：

- 專案沒有真實需求、票價、可靠度、營收或 ridership。
- 所有班表都是 synthetic，必須明講 caveat。

Codex 派工建議：

- 適合 explorer 或主線一次性分析。
- 預設不改 code。

## 是否需要重新設計職能分工

需要「整理」，不需要「重做」。

保留：

- Data / Geo / UI / Locale / Analysis 這五個概念邊界。
- 不手改 generated files 的資料管線原則。
- snap / km / station offset 要數值驗證的原則。
- UI 必須尊重 no-JSX、Leaflet refs、effect cleanup 的原則。

調整：

- 把 Claude 的 agent 與 skill 重疊內容濃縮成 Codex 可快速讀取的 `AGENTS.md`。
- 新增 Assets & Icons 職能，因為目前 train icon pipeline 已是主要維護面。
- 把 subagent 從「固定職稱」改成「按任務臨時套用角色 prompt」。
- 把 market 分析定位為 read-only service analysis，避免被誤用成產品策略或真實營運分析。

不建議：

- 不建議把每個職能都做成全域 Codex skill。這是單一 repo 的上下文，放在 repo 的
  `AGENTS.md` 與 `doc/` 更不會污染其他專案。
- 不建議每次功能都派多個 subagents。此專案跨檔 invariants 多，過度平行會增加整合成本。
- 不建議把資料、幾何、UI 混成一個巨型 role；出錯時很難定位應該跑哪組驗證。

## 任務路由表

| 使用者需求 | 主要職能 | 次要職能 | 最小驗證 |
|---|---|---|---|
| 新增國家/路線 | Data Pipeline | Locale, Assets, Geo | `build:rail-data`, `check:shapes`, `check:timing`, `build` |
| 修 snap 錯誤 | Geo Verification | Data 或 UI | Node repro, `check:shapes`, `build` |
| 新增地圖互動 | UI Interaction | Geo if distance-related | `build`, `test:smoke`, browser QA |
| 新增 train type | Data Pipeline | Assets & Icons | `check:timing`, `check:train-icons`, `build` |
| 補列車圖示 | Assets & Icons | UI if marker rendering changes | `check:train-icons`, `build:train-icons`, `build` |
| 翻譯或 romanization | Locale & Labels | Data if station names changed | `build:rail-data` if station names changed, otherwise `build` |
| 問服務密度/覆蓋率 | Service Analysis | Geo for coverage | read-only Node calculation |
| PWA / SW / metadata | UI Interaction | Assets if images touched | `build`, related Playwright specs |

## 建議後續

若未來要讓 Codex 自動發現 Railway Elf 專用 skill，可以再把本文件濃縮成單一
`railway-elf-maintainer` skill，安裝到 `$CODEX_HOME/skills`。目前先留在 repo 內較好：
這份知識明顯是專案專用，而且 `AGENTS.md` 已足夠提供日常維護所需的短上下文。
