# Railway Elf 進度報告

更新日期：2026-05-07

## 目前結論

沒有尚未完成的必要項目；目前只保留可選優化與工作區整理。

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

1. 清理提交狀態：處理或忽略 `node_modules/.vite/deps/_metadata.json` 這個本機快取異動，避免開發產物混進 commit。
2. Bundle size 拆分：將 `rail-data.generated.js` 從 main bundle 拆成獨立 chunk 或 dynamic import，降低初始載入成本。
3. 補 PWA / 社群圖像：新增 `apple-touch-icon.png` 與 `og-image.png`，改善 iOS 主畫面與社群分享預覽。
4. 部署前檢查：發布前跑完整驗證，包含 `npm run build`、`npm run check:timing`、`npm run check:shapes`、`npm run test:smoke`。
5. 後續資料改善：若 OSM 未來有更乾淨的 Tokaido-Shinkansen relation，再替換資料來源並更新 snapshot。
