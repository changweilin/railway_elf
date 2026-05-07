# Railway Elf 進度報告

更新日期：2026-05-07

## 目前結論

沒有尚未完成的必要項目；只剩下需要外部素材或長期規劃的可選項目。

## 本次完成

- Bundle 拆分：在 `vite.config.js` 加 `manualChunks`，把 `rail-data.generated`、`leaflet`、`react`、`react-dom` 各自獨立成 chunk，降低 main bundle (89.6 kB / gzip 31 kB) 並讓資料 chunk 可獨立 cache。
- 確認 React production build：build output 中 `react-dom` 134 kB（dev 版會 >1 MB）、無 `jsxDEV`／`development` 字樣，確認是 production minified bundle。
- 部署前驗證：`npm run build`、`check:timing`、`check:shapes`、`test:smoke`（22 passed / 2 skipped）皆通過。

## 未完成

必要項目：無。

可選優化：

- PWA 圖像：可補 `apple-touch-icon.png` 與 `og-image.png`（需要美術素材）。
- Offline / Service Worker：若要離線模式，需要另外設計資料更新與 cache 互動。
- Tokaido-Shinkansen：若 OSM 未來有更乾淨 relation，可替換 corridor reconstruction 並更新 snapshot。

## 建議下一步

1. 補 PWA / 社群圖像：新增 `apple-touch-icon.png` 與 `og-image.png`，改善 iOS 主畫面與社群分享預覽。
2. 後續資料改善：若 OSM 未來有更乾淨的 Tokaido-Shinkansen relation，再替換資料來源並更新 snapshot。
