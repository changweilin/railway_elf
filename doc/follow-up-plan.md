# Railway Elf 進度報告

更新日期：2026-05-09

## 目前結論

沒有尚未完成的必要項目；大東亞擴張 Phase B 已完成 34/34 條 OSM 形狀回灌，snapshot 已更新到 57 條線。高誤差複查後，57 條線 runtime maxOffset 全部壓到 1.0 km 內，沒有 0 km fallback 或需阻塞上線的資料缺口。

## 本次完成

- Bundle 拆分：在 `vite.config.js` 加 `manualChunks`，把 `rail-data.generated`、`leaflet`、`react`、`react-dom` 各自獨立成 chunk，降低 main bundle (89.6 kB / gzip 31 kB) 並讓資料 chunk 可獨立 cache。
- 確認 React production build：build output 中 `react-dom` 134 kB（dev 版會 >1 MB）、無 `jsxDEV`／`development` 字樣，確認是 production minified bundle。
- 部署前驗證：`npm run build`、`check:timing`、`check:shapes`、`test:smoke`（26 passed / 2 skipped）皆通過。
- PWA / 社群圖像：新增 `scripts/build-pwa-images.mjs`（用 Playwright Chromium 渲染 SVG），產出 `public/apple-touch-icon.png` (180×180) 與 `public/og-image.png` (1200×630)；`index.html` 補 `apple-touch-icon` link、`og:image` / `twitter:image` meta，twitter card 升級為 `summary_large_image`；`manifest.webmanifest` 加入 PNG icon。新增 npm script `build:pwa-images` 方便日後重新生成。
- Service Worker / 離線模式：新增 `public/sw.js`（precache app shell + 三層快取策略：hashed asset cache-first、navigation network-first、其他 stale-while-revalidate；跨來源請求一律放行讓 OSM tile / Nominatim 不被攔截）。`src/main.js` 在 production build 才註冊 SW，避免干擾 Vite HMR。新增 `tests/service-worker.spec.mjs` 驗證 SW 註冊後達到 `activated` 狀態。
- SW 升級提示 UX：移除 install 階段的 `skipWaiting`，改由使用者主動觸發。新 SW install 完成後 main.js 偵測到 waiting worker、透過 `window` event `sw:update-ready` 通知 React App；NoticeStack 支援 `action` 按鈕（複用既有 notice 樣式 + 新 `.notice-action` CSS），點「重新載入」會 `postMessage({type:"SKIP_WAITING"})` 給 waiting worker 並在 `controllerchange` 時 reload。新測試覆蓋通知顯示 → 點擊 → 派發 `sw:apply-update` 的整條鏈路（desktop / mobile 皆通過）。
- 大東亞 Phase B：依 `doc/east-asia-expansion-plan.md` 補齊日本、南韓、香港、中國、新加坡、馬來西亞、泰國、越南共 34 條 OSM relation 形狀；`src/rail-data.generated.js` 與 `scripts/line-shape-snapshot.json` 已更新，沒有 0 km fallback。
- 資料修正：修正 JR-Sobu-Local 千葉端站點座標，並在 `kinematicProfile` 補上兩節點短站距的中點，避免短距離站間 inverse timing 誤報。
- 高誤差複查：修正 `JR-Yamanote` loop/corridor 造成的 56 km 錯長度、`KHH-LRT` 全環線誤套到 13 站區段、`Busan-Metro-1` 後段投影漂移；中國 HSR、TYMRT、Alishan、台鐵支線與高捷紅/輕軌的高偏移已用 generated OSM shape 吸附修正。
- OSM stop member 對站：`TPE-Brown`、`KHH-Orange`、`Busan-Metro-1`、`Beijing-Subway-1`、`Shanghai-Metro-1/2`、`KL-Kelana-Jaya`、`BKK-BTS-Sukhumvit`、`BKK-MRT-Blue`、`HCMC-Metro-1`、`Hanoi-Metro-2A` 改用 relation stop/platform node 回填 stationCoords；上海 1/2、胡志明 1、河內 2A 與曼谷 BTS 主要站點已降到公尺級偏移。

## 未完成

必要項目：無。

可選優化：

- Tokaido-Shinkansen：若 OSM 未來有更乾淨 relation，可替換 corridor reconstruction 並更新 snapshot（依賴上游資料,目前無動作可做）。
- 若要再往工程級精度推進，可優先精修目前 maxOffset 約 0.75–1.0 km 的路線（如 `Beijing-Shanghai-HSR`、`Beijing-Guangzhou-HSR`、`JR-Keihin-Tohoku`、`KHH-Red`、`Tamsui-LRT`、`JR-Osaka-Loop`、`Tokyu-Toyoko`、`Seoul-Metro-1`、`TPE-Yellow`、`TYMRT`），用官方站點座標或更乾淨的 OSM station node 逐站替換。

## 建議下一步

1. 後續資料改善：只做可選精修，優先處理 maxOffset 約 0.75–1.0 km 的路線與官方營業里程交叉校驗。
2. 若 OSM 未來有更乾淨的 Tokaido-Shinkansen relation，再替換資料來源並更新 snapshot。
