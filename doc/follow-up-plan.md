# Railway Elf 進度報告

更新日期：2026-05-07

## 目前結論

主線待辦已完成，沒有尚未完成的必要項目。

目前剩下的是可選優化與工作區整理，不是阻擋上線或繼續開發的 active blocker。

## 已完成

- Browser smoke test：`tests/smoke.spec.mjs`、`playwright.config.js`、`npm run test:smoke`。
- 失敗狀態 e2e：geolocation 拒絕、Nominatim 失敗、tile burst、off-rail empty state。
- CI：`.github/workflows/ci.yml` 串起 build、timing、shape、smoke checks。
- Babel standalone 移除：runtime 不再依賴 `@babel/standalone`。
- React / ReactDOM / Leaflet 改為 npm dependencies，並由 Vite bundle。
- ES module 改寫：核心資料與 UI code 已搬進 `src/`，由 `import` / `export` 進入 Vite module graph。
- 失敗狀態 UX：NoticeStack、search inline error、統一 empty state。
- 資料品質 guardrails：`scripts/check-line-shapes.mjs`、`scripts/line-shape-snapshot.json`、`npm run check:shapes`。
- 資料更新 workflow：shape diff 後先跑 ratchet，再更新 snapshot 並開 PR。
- PWA / meta：favicon、manifest、description、theme-color、OG、Twitter summary card。
- TRA-Coast 海線真實線形已更新。
- 第二頁/第二段字體已統一：`rail-type-section` 使用既有 typography tokens。

## 未完成

必要項目：無。

可選優化：

- Bundle size：`rail-data.generated.js` 目前進 main bundle，後續可用 dynamic import 或 manual chunk 拆開。
- React production bundle：目前可再確認正式部署是否全走 production build，進一步壓低 bundle 與 runtime warning。
- PWA 圖像：可補 `apple-touch-icon.png` 與 `og-image.png`。
- Offline / Service Worker：若要離線模式，需要另外設計資料更新與 cache 互動。
- Tokaido-Shinkansen：若 OSM 未來有更乾淨 relation，可替換 corridor reconstruction 並更新 snapshot。

## 工作區狀態

- 目前只看到 `node_modules/.vite/deps/_metadata.json` 有修改，屬於 Vite 本機快取/開發產物。
- 沒有看到尚未完成的 app source 修改。

## 建議下一步

1. 不需要再做功能性待辦清理。
2. 若準備提交，先處理或忽略 `node_modules/.vite/deps/_metadata.json` 這個本機快取異動。
3. 若要繼續優化，優先做 bundle size 拆分，其次補 PWA raster 圖像。
