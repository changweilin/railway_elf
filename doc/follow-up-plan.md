# Railway Elf 進度報告

更新日期：2026-05-07

## 目前結論

沒有尚未完成的必要項目；只剩下需要外部素材或長期規劃的可選項目。

## 本次完成

- Bundle 拆分：在 `vite.config.js` 加 `manualChunks`，把 `rail-data.generated`、`leaflet`、`react`、`react-dom` 各自獨立成 chunk，降低 main bundle (89.6 kB / gzip 31 kB) 並讓資料 chunk 可獨立 cache。
- 確認 React production build：build output 中 `react-dom` 134 kB（dev 版會 >1 MB）、無 `jsxDEV`／`development` 字樣，確認是 production minified bundle。
- 部署前驗證：`npm run build`、`check:timing`、`check:shapes`、`test:smoke`（22 passed / 2 skipped）皆通過。
- PWA / 社群圖像：新增 `scripts/build-pwa-images.mjs`（用 Playwright Chromium 渲染 SVG），產出 `public/apple-touch-icon.png` (180×180) 與 `public/og-image.png` (1200×630)；`index.html` 補 `apple-touch-icon` link、`og:image` / `twitter:image` meta，twitter card 升級為 `summary_large_image`；`manifest.webmanifest` 加入 PNG icon。新增 npm script `build:pwa-images` 方便日後重新生成。
- Service Worker / 離線模式：新增 `public/sw.js`（precache app shell + 三層快取策略：hashed asset cache-first、navigation network-first、其他 stale-while-revalidate；跨來源請求一律放行讓 OSM tile / Nominatim 不被攔截）。`src/main.js` 在 production build 才註冊 SW，避免干擾 Vite HMR。新增 `tests/service-worker.spec.mjs` 驗證 SW 註冊後可以在離線狀態下重新載入 app shell（desktop / mobile 皆通過）。

## 未完成

必要項目：無。

可選優化：

- Tokaido-Shinkansen：若 OSM 未來有更乾淨 relation，可替換 corridor reconstruction 並更新 snapshot。
- SW 升級提示：目前 `skipWaiting` + `clients.claim` 在 deploy 後讓開啟中的 tab 即時切到新版本，但沒有 toast 提示「新版已可用」。需要更精緻 UX 時再加。

## 建議下一步

1. 後續資料改善：若 OSM 未來有更乾淨的 Tokaido-Shinkansen relation，再替換資料來源並更新 snapshot。
2. 若 SW 普及後想要更友善的更新體驗，再加 `controllerchange` 事件處理 + UI 通知。
