# Railway Elf

Railway Elf 是一個以 `React 18 + Leaflet + Vite` 打造的鐵路動態預估前端應用，核心目標是以地圖為中心，結合手工維護的鐵路路網資料與列車規則，提供多區域「附近列車候選」與「到站時間預估」體驗，並具備 PWA 與離線快取能力。

專案以 `ES module` + `React.createElement` 為主要風格（未使用 JSX），適合作為台灣、日本、韓國、香港、新加坡、馬來西亞、泰國、越南等地區的跨域鐵道展示與查詢介面。

## 1. 專案標題與簡介 (Title & Description)

### 專案名稱

- Railway Elf

### 一句話描述

- 一個以地圖互動為主軸的鐵道列車預估應用：使用者只要在地圖上選點，即可快速取得附近路線、候選列車與到站預告。

### 專案定位

- 以前端為主體、資料流程為輔助的靜態部署方案。
- 透過腳本化資料流程維持 `RAIL_DATA`、線路幾何與時刻計算的一致性。
- 支援桌機與行動裝置情境的互動與面板操作。

## 2. 核心功能特性 (Features)

- 多區域路網支援：涵蓋 `taiwan`, `japan`, `korea`, `hongkong`, `china`, `singapore`, `malaysia`, `thailand`, `vietnam`。
- 地圖為核心的線路候選邏輯：依據使用者位置/選點與軌道幾何進行 snap，回傳附近可行線路與到站預估。
- 列車時間預估：透過 `TrainGen` 動態生成每趟列車的時序資料，並以 km/速度模型結合停靠時間做預告。
- 互動式地圖體驗：
  - 路線、站點、列車 marker 渲染與管理
  - 地圖主題與圖層（街道／地形／衛星）切換
  - 地圖 bounds 與 viewport 管理
- 清楚的列車資訊面板：
  - 支援方向、類別、時間預覽、收藏位置、通知提示
  - 提供剩餘時間與列車/路線對應視覺標籤
- PWA 基礎支援：離線快取與 manifest，提升離線與回訪體驗。
- 自動化驗證：
  - `scripts/check-line-shapes.mjs`：線路形狀一致性檢查
  - `scripts/check-train-timing.mjs`：列車時序一致性檢查
  - CI 執行建置、形狀檢查、時序檢查與 smoke test
- 圖示與資產治理：
  - `train-icon-registry.js` 與 `public/assets/train-icons/*`
  - 提供 `check:train-icons` / `build:train-icons` 流程。

## 3. 系統需求與安裝步驟 (Prerequisites & Installation)

### 系統需求

- Node.js：建議 `22.x`（CI 使用 Node 22）
- npm：隨 Node 安裝
- Git：用於版本控管與更新
- 作業系統：Windows / macOS / Linux

### 安裝步驟

```bash
# 1. 進入專案資料夾
cd C:\Users\user\Documents\app\railway_elf

# 2. 安裝套件
npm install
```

### 常用腳本

- `npm run dev`：啟動開發伺服器
- `npm run build`：建立 production bundle
- `npm run preview -- --host`：預覽建置結果
- `npm run test:smoke`：執行 Playwright smoke test
- `npm run build:rail-data`：重抓並重建路網資料（含分割 chunk）
- `npm run build:rail-data:tw`：只重建台灣路網
- `npm run build:rail-data:jp`：只重建日本路網
- `npm run build:train-icons`：重建列車圖示
- `npm run check:train-icons`：檢查列車圖示對應
- `npm run check:timing`：檢查列車時序與數值一致性
- `npm run check:shapes`：檢查路線 shape 幾何一致性
- `npm run build:pwa-images`：產生 PWA 影像資產

### TDX / OSM 重建路網（可選）

```bash
# 建立環境變數檔
Copy-Item .env.example .env
# 或 Linux / macOS:
# cp .env.example .env
```

編輯 `.env`，補齊 `TDX_CLIENT_ID` 與 `TDX_CLIENT_SECRET` 後再執行：

```bash
npm run build:rail-data
```

## 4. 快速上手與使用範例 (Quick Start / Usage)

### 4.1 啟動與進入

```bash
npm run dev
```

1. 開啟 `http://localhost:4180`。
2. 選擇地區並載入對應資料。
3. 在地圖點選位置後，觀察底部面板與候選列車列表。
4. 使用方向／類別／時間預覽條件調整搜尋結果。

### 4.2 常見操作

- 切換地區：選取不同地區時會切換對應 `RAIL_DATA` 與 shape 分流。
- 切換時間：提供「現在」、「30 分鐘後」、「60 分鐘後」與自訂時間。
- 線路與方向過濾：依列車別（TRA / HSR / Metro / LRT）與上下行篩選。
- 收藏點位：保存常用查詢位置，快速回到。

### 4.3 路網資料維運流程

```bash
npm run build:rail-data
npm run check:shapes
npm run check:timing
```

> `src/rail-data.generated.js` 與 `src/rail-shapes/*.generated.js` 為自動產生檔，請不要直接手動編輯；若站點、路線或規則變更，請透過腳本重建。

## 5. 專案架構說明 (Project Structure)

```text
C:\Users\user\Documents\app\railway_elf
  .github/
    workflows/
      ci.yml
      deploy-pages.yml
      update-rail-shapes.yml
  scripts/
    fetch-rail-shapes.mjs
    split-rail-shapes.mjs
    check-line-shapes.mjs
    check-train-timing.mjs
    check-train-icons.mjs
    build-train-icons.mjs
    build-pwa-images.mjs
    TDX-SETUP.md
    line-shape-snapshot.json
  src/
    main.js
    app-core.js
    app-map.js
    rail-data.js
    rail-data.generated.js
    rail-shapes/
      taiwan.generated.js
      japan.generated.js
      korea.generated.js
      hongkong.generated.js
      china.generated.js
      singapore.generated.js
      malaysia.generated.js
      thailand.generated.js
      vietnam.generated.js
    train-icon-registry.js
  public/
    sw.js
    manifest.webmanifest
    assets/
      styles.css
      tokens.css
      icons.svg
      logo-mark.svg
      logo-mark-180.png
      train-icons/
        README.md
        train-icon-map.json
        *.png
  tests/
    *.mjs
  index.html
  package.json
  package-lock.json
  playwright.config.js
  vite.config.js
  .env.example
  README.md
```

## 6. 授權條款 (License)

本專案採用 **Apache License 2.0**。

- 若你將專案外部發布或分發，請在根目錄放置 `LICENSE` 檔並保留完整授權內容。
- 官方授權條文：<https://www.apache.org/licenses/LICENSE-2.0>

