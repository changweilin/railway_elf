# Railway Elf 進度報告

更新日期：2026-05-10

## 目前結論

沒有尚未完成的必要項目；大東亞擴張 Phase B 已完成 34/34 條 OSM 形狀回灌，snapshot 已更新到 82 條線。高誤差複查後，82 條線 runtime maxOffset 全部壓到 1.0 km 內，沒有 0 km fallback 或需阻塞上線的資料缺口。日本 / 南韓「完整類型覆蓋」已作為可選大型 backlog 加入 `doc/east-asia-expansion-plan.md`，不列入目前完成率；其中南韓 HSR 類已完成 SRT 代表線 `SRT-Gyeongbu` / `SRT-Honam` / `SRT-Jeolla` / `SRT-Gyeongjeon` / `SRT-Donghae` 與 KTX 代表線 `KTX-Honam` / `KTX-Jeolla` / `KTX-Gyeongjeon` / `KTX-Gangneung` / `KTX-Donghae` / `KTX-Jungang` / `KTX-Jungbu-Naeryuk`，Intercity 類已完成第一條代表線 `ITX-Cheongchun`，Commuter / Metro 類已完成代表線 `Seoul-Metro-3` / `Seoul-Metro-4` / `Seoul-Metro-5` / `Seoul-Metro-6` / `Seoul-Metro-7` / `Seoul-Metro-8` / `Seoul-Metro-9` / `Shinbundang` / `Suin-Bundang`，Airport 類已完成第一條代表線 `AREX`，LRT/AGT 類已完成第一條代表線 `Gimpo-Goldline`，Monorail 類已完成第一條代表線 `Daegu-Metro-3`。

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
- 南韓 Airport seed：新增 `AREX` all-stop（서울역 ⇄ 인천공항2터미널）14 站、1 個 train template、OSM relation `7919000`、line-aware AREX 圖示，並在 `doc/east-asia-expansion-plan.md` 清理 Airport backlog 狀態。
- 南韓 LRT/AGT seed：新增 `Gimpo-Goldline` all-stop（양촌 ⇄ 김포공항）10 站、1 個 train template、OSM relation `10092720`、line-aware Gimpo Goldline 圖示，並在 `doc/east-asia-expansion-plan.md` 清理 LRT/AGT backlog 狀態。
- 南韓 Monorail seed：新增 `Daegu-Metro-3` all-stop（칠곡경대병원 ⇄ 용지）30 站、1 個 train template、OSM relation `7685727`、line-aware Daegu monorail 圖示，並在 `doc/east-asia-expansion-plan.md` 清理 Monorail backlog 狀態。
- 南韓 HSR seed：新增 `SRT-Gyeongbu`（수서 ⇄ 부산）12 站、1 個 SRT train template、OSM relation `6096884` + `6094351` corridor、line-aware SRT badge 圖示，並在 `doc/east-asia-expansion-plan.md` 清理 HSR backlog 狀態。
- 南韓 HSR seed：新增 `SRT-Honam`（수서 ⇄ 목포）11 站、1 個 SRT train template、OSM relation `6096884` + `6094351` + `6095809` + `6094787` corridor；列車圖示先檢查同國同型號後沿用既有 SRT PNG，不新增 PNG。
- 南韓 HSR seed：新增 `SRT-Jeolla`（수서 ⇄ 여수EXPO）14 站、1 個 SRT train template、OSM relation `6096884` + `6094351` + `6095809` + `6096342` corridor；列車圖示先檢查同國同型號後沿用既有 SRT PNG，不新增 PNG。
- 南韓 HSR seed：新增 `SRT-Gyeongjeon`（수서 ⇄ 진주）15 站、1 個 SRT train template、OSM relation `6096884` + `6094351` + `8842494` + `8839114` corridor；列車圖示先檢查同國同型號後沿用既有 SRT PNG，不新增 PNG。
- 南韓 HSR seed：新增 `SRT-Donghae`（수서 ⇄ 포항）10 站、1 個 SRT train template、OSM relation `6096884` + `6094351` + `8840839` + `8835676` corridor；列車圖示先檢查同國同型號後沿用既有 SRT PNG，不新增 PNG。
- 南韓 HSR seed：新增 `KTX-Honam`（용산 ⇄ 목포）10 站、2 個 KTX / KTX-산천 train templates、OSM relation `11214334` + `6095809` + `6094787` corridor；列車圖示先檢查同國同型號後沿用既有 KTX / KTX-산천 PNG，不新增 PNG。
- 南韓 HSR seed：新增 `KTX-Jeolla`（용산 ⇄ 여수EXPO）13 站、2 個 KTX / KTX-산천 train templates、OSM relation `11214334` + `6095809` + `6096342` corridor；列車圖示先檢查同國同型號後沿用既有 KTX / KTX-산천 PNG，不新增 PNG。
- 南韓 HSR seed：新增 `KTX-Gyeongjeon`（서울 ⇄ 진주）14 站、2 個 KTX / KTX-산천 train templates、OSM relation `11214334` + `8839114` corridor；列車圖示先檢查同國同型號後沿用既有 KTX / KTX-산천 PNG，不新增 PNG。
- 南韓 HSR seed：新增 `KTX-Gangneung`（서울 ⇄ 강릉）11 站、1 個 KTX-이음 train template、OSM relation `8842494` + `8817574` + `8821065` + `8825878` corridor；列車圖示先檢查同國同型號，因目前無 KTX-이음 PNG 而新增 line-aware KTX-이음 圖示。
- 南韓 HSR seed：新增 `KTX-Donghae`（서울 ⇄ 포항）8 站、2 個 KTX / KTX-산천 train templates、OSM relation `11214334` + `8840839` + `8835676` corridor；列車圖示先檢查同國同型號後沿用既有 KTX / KTX-산천 PNG，不新增 PNG。
- 南韓 HSR seed：新增 `KTX-Jungang`（서울 ⇄ 부전）16 站、1 個 KTX-이음 train template、OSM relation `8842494` + `8817574` + `8821065` + `8880536` + `8880709` + `8835676` + `8879475` corridor；列車圖示先檢查同國同型號後沿用既有 KTX-이음 PNG，不新增 PNG。
- 南韓 HSR seed：新增 `KTX-Jungbu-Naeryuk`（판교 ⇄ 문경）10 站、1 個 KTX-이음 train template、OSM relation `8824194` + `12351758` corridor；列車圖示先檢查同國同型號後沿用既有 KTX-이음 PNG，不新增 PNG。
- 南韓 Intercity seed：新增 `ITX-Cheongchun`（용산 ⇄ 춘천）14 站、1 個 ITX-청춘 train template、OSM relation `8817574` + `8821065` + `8817669` corridor；列車圖示先檢查同國同型號，因目前無 ITX-청춘 PNG 而新增 line-aware ITX-청춘 圖示。
- 南韓 Commuter / Metro seed：新增 `Seoul-Metro-3`（대화 ⇄ 오금）44 站、1 個 3호선 train template、OSM relation `443803` + `4729445` corridor；列車圖示先檢查同國同型號，確認既有 `Daegu-Metro-3|3호선` 是單軌不同型號後新增 line-aware 首都圈 3 號線 metro 圖示。
- 南韓 Commuter / Metro seed：新增 `Seoul-Metro-4`（진접 ⇄ 오이도）51 站、1 個 4호선 train template、OSM relation `13675921` + `2718884` + `4744311` corridor；列車圖示先檢查同國同型號，因目前無 `4호선` PNG 而新增 line-aware 首都圈 4 號線 metro 圖示。
- 南韓 Commuter / Metro seed：新增 `Seoul-Metro-5`（방화 ⇄ 하남검단산 主線）49 站、1 個 5호선 train template、OSM relation `12497486`；列車圖示先檢查同國同型號，因目前無 `5호선` PNG 而新增 line-aware 首都圈 5 號線 metro 圖示，마천 branch 留後續 branch-aware pass。
- 南韓 Commuter / Metro seed：新增 `Seoul-Metro-7`（장암 ⇄ 석남）53 站、1 個 7호선 train template、OSM relation `12746493`；列車圖示先檢查同國同型號，因目前無 `7호선` PNG 而新增 line-aware 首都圈 7 號線 metro 圖示。
- 南韓 Commuter / Metro seed：新增 `Seoul-Metro-8`（별내 ⇄ 모란）24 站、1 個 8호선 train template、OSM relation `2718901`；列車圖示先檢查同國同型號，因目前無 `8호선` PNG 而新增 line-aware 首都圈 8 號線 metro 圖示；route_master `7919019` 仍保留舊短線 relation，建檔採完整 `별내 → 모란` route。
- 南韓 Commuter / Metro seed：新增 `Seoul-Metro-9`（개화 ⇄ 중앙보훈병원）38 站、1 個 9호선 train template、OSM relation `2718888`；列車圖示先檢查同國同型號，因目前無 `9호선` PNG 而新增 line-aware 首都圈 9 號線 metro 圖示；OSM route stop members 少 `동작`，因此 shape mapping 不使用 `stationStops` 以避免 stop/station 錯位，急行 skip-stop relation 留後續 template 支援後再補。
- 南韓 Commuter / Metro seed：新增 `Seoul-Metro-6`（응암순환 ⇄ 신내）40 個停站事件 / 39 unique stations、1 個 6호선 train template、OSM relation `12080315`；列車圖示先檢查同國同型號，因目前無 `6호선` PNG 而新增 line-aware 首都圈 6 號線 metro 圖示；為保留 응암 one-way loop 的重複站名，generated station km 新增 `stationKmsByIndex`。
- 南韓 Commuter / Metro seed：新增 `Shinbundang`（신사 ⇄ 광교）16 站、1 個 신분당선 train template、OSM route_master `7728256` / relation `6060963`；列車圖示先檢查同國同型號，因目前無 `신분당선` PNG 而新增 line-aware Shinbundang metro 圖示。
- 南韓 Commuter / Metro seed：新增 `Suin-Bundang`（청량리 ⇄ 인천）63 站、1 個 수인분당선 train template、OSM route_master `11619514` / relation `11625556`；列車圖示先檢查同國同型號，因目前無 `수인분당선` PNG 而新增 line-aware Suin-Bundang commuter 圖示。

## 未完成

必要項目：無。

可選優化：

- Tokaido-Shinkansen：若 OSM 未來有更乾淨 relation，可替換 corridor reconstruction 並更新 snapshot（依賴上游資料,目前無動作可做）。
- 若要再往工程級精度推進，可優先精修目前 maxOffset 約 0.75–1.0 km 的路線（如 `Beijing-Shanghai-HSR`、`Beijing-Guangzhou-HSR`、`JR-Keihin-Tohoku`、`KHH-Red`、`Tamsui-LRT`、`JR-Osaka-Loop`、`Tokyu-Toyoko`、`Seoul-Metro-1`、`TPE-Yellow`、`TYMRT`），用官方站點座標或更乾淨的 OSM station node 逐站替換。
- 日本 / 南韓完整覆蓋：依 `doc/east-asia-expansion-plan.md` 的 backlog，未來可從剩餘新幹線 / KTX 走廊、東京 / 首都圈地鐵、Tram / Regional / Heritage 等類型各挑一條代表線先做；南韓 HSR 類已有 `SRT-Gyeongbu` / `SRT-Honam` / `SRT-Jeolla` / `SRT-Gyeongjeon` / `SRT-Donghae` / `KTX-Honam` / `KTX-Jeolla` / `KTX-Gyeongjeon` / `KTX-Gangneung` / `KTX-Donghae` / `KTX-Jungang` / `KTX-Jungbu-Naeryuk` seeds，Intercity 類已有 `ITX-Cheongchun` seed，Commuter / Metro 類已有 `Seoul-Metro-3` / `Seoul-Metro-4` / `Seoul-Metro-5` / `Seoul-Metro-6` / `Seoul-Metro-7` / `Seoul-Metro-8` / `Seoul-Metro-9` / `Shinbundang` / `Suin-Bundang` seeds，Airport 類已有 `AREX` all-stop seed，LRT/AGT 類已有 `Gimpo-Goldline` seed，Monorail 類已有 `Daegu-Metro-3` seed，AREX 直通列車與 Line 9 急行待 skip-stop template 支援後再補。

## 建議下一步

1. 後續資料改善：只做可選精修，優先處理 maxOffset 約 0.75–1.0 km 的路線與官方營業里程交叉校驗。
2. 若 OSM 未來有更乾淨的 Tokaido-Shinkansen relation，再替換資料來源並更新 snapshot。
3. 若要啟動下一輪資料擴張，先從日本 / 南韓完整覆蓋 backlog 選一個尚未 seed 的類型與一條代表線，補 icon / speed profile / shape pipeline 後再批量展開。
