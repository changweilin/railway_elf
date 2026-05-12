# Railway Elf 進度報告

## 2026-05-12 5.5 route supervision update

- [x] Current route coverage audit: `src/rail-data.js`, `src/rail-data.generated.js`, and `scripts/line-shape-snapshot.json` all cover 103 current line ids; no currently modeled railway is missing a generated route.
- [x] Syntax and generated-merge blockers fixed enough for the data modules to load: `src/rail-data.js` now falls back to generated station km/coord order when generated keys do not match curated station names.
- [x] Train icon registry restored to resolve against the actual `RAIL_DATA` template keys: 101 line overrides, 17 type fallbacks, 0 unresolved templates, 0 unused overrides.
- [x] `npm.cmd run build:rail-data` completed with network access: 98 fresh TDX/OSM sources, 0 cache fallbacks, generated rail data and regional shape chunks rewritten through the script.
- [x] Live rebuild route-error blockers minimized by adding indexed generated station coords: `Tokyo-Monorail` 0.005 km, `Seoul-Metro-7` 0.008 km, `Suin-Bundang` 0.023 km, `Gyeongui-Jungang` 0.039 km, `Seohae` 0.004 km, `Incheon-Metro-1` 0.005 km, `Daegu-Metro-1` 0.004 km, `Daegu-Metro-3` 0.003 km, `Busan-Metro-2` 0.023 km.
- [x] Timing blocker resolved: `Busan-Metro-2` route/station alignment no longer stretches trips; `check:timing` is back to 39,456 trains checked with 0 failures.
- [x] Verification status: `check:train-icons`, `check:shapes`, `check:timing`, and production `build` all passed after the indexed station-coordinate fix.
- [x] Long-running supervision completed: heartbeat `railway-elf-5-5-route-supervision` was stopped after the 5.5 route-minimization blocker checks went green.


更新日期：2026-05-12

## 目前結論

2026-05-12 live rebuild 後，本段舊結論僅保留為歷史狀態；最新可執行清單以下方「下一輪資料更新」為準。

沒有尚未完成的必要修復項目；大東亞擴張 Phase B 已完成 34/34 條 OSM 形狀回灌，snapshot 已更新到 103 條線，且沒有 0 km fallback 或需阻塞上線的資料缺口。下一輪資料更新改以「其他大東亞國家」為主，短期優先序為泰國曼谷補完，接著新加坡 / 馬來西亞補完與新馬跨境監控。日本 / 南韓剩餘完整覆蓋、工程級精度、資料源策略與 UI / i18n 等未完成但優先度較低的工作，已集中移回 `doc/east-asia-expansion-plan.md` 的長期 backlog。

## 2026-05-12 路線與誤差稽核

- [x] 現有資料線 route 覆蓋檢查：`src/rail-data.js` 可掃到 103 條 line id，`src/rail-data.generated.js` 有 103 條 generated route，`scripts/line-shape-snapshot.json` 也有 103 條 snapshot；目前沒有「已在資料檔中、但尚未建立 generated route」的鐵道。
- [x] 長期擴張 backlog 分流：未建立 route 的項目屬於可選擴張，不是現有資料缺口。日本仍有 Intercity、JR 都會圈、民鐵、其餘 Metro、成田/京成/京急/南海等機場線、其餘 Tram / Monorail / AGT、Regional、Heritage、Freight；南韓仍有一般列車幹線、AREX 直通 / 金海機場銜接、Daejeon Line 2 營運後納入、Regional、Heritage、Freight。
- [x] 修復 `src/rail-data.js` 的內容語法錯誤；runtime 已可載入資料並重新計算 maxOffset，後續改以 5.5 route supervision update 的 live rebuild 阻塞清單追蹤。
- [x] 低優先品質清單已移入 `doc/east-asia-expansion-plan.md`，不再列為 follow-up 的未完成工作。

## 下一輪資料更新（泰國 / 新馬優先）

此區塊從 `doc/east-asia-expansion-plan.md` 的 P0/P1 backlog 摘出，作為 follow-up 的近期執行入口。每條 seed 都要完成 Phase A + Phase B、train icon、`npm run build:rail-data`、`npm run check:shapes`、`npm run check:timing` 與 `npm run test:smoke`。

### 5.3 可直接下放

| 順序 | id | 區域 | 更新內容 | 備註 |
|---|---|---|---|---|
| 1 | `BKK-BTS-Silom` | 泰國 | 補 BTS Silom Line 站表、BTS train template、OSM relation、綠線圖示 | 下一輪首選；確認是否沿用 Sukhumvit 圖示 |
| 2 | `BKK-MRT-Purple` | 泰國 | 補 MRT Purple Line 站表、heavy-rail template、OSM relation、紫線圖示 | 先做現行營運段，未來南延伸另開 pass |
| 3 | `BKK-MRT-Yellow` | 泰國 | 補 Yellow Line 站表、straddle monorail template、OSM relation、圖示 | 類型顯示先依 `Monorail / AGT` 記錄 |
| 4 | `BKK-MRT-Pink` | 泰國 | 補 Pink Line 主線站表、monorail template、OSM relation、圖示 | Muang Thong Thani 支線先不納入 |
| 5 | `BKK-SRT-Dark-Red` | 泰國 | 補 SRT Dark Red Line 站表、commuter EMU template、OSM relation、SRT Red Line 圖示 | 與 Light Red 共線呈現先保守處理 |
| 6 | `KL-MRT-Putrajaya` | 馬來西亞 | 補 Putrajaya Line 站表、MRT template、OSM relation、PYL yellow icon | 長線站距需優先 shape 對站 |
| 7 | `SG-MRT-North-East` | 新加坡 | 補 North East Line 站表、driverless metro template、OSM relation、NEL purple icon | Punggol Coast 納入 current baseline |
| 8 | `SG-MRT-Downtown` | 新加坡 | 補 Downtown Line 站表、driverless metro template、OSM relation、DTL blue icon | 後續 extension 另開 pass |
| 9 | `SG-MRT-Thomson-East-Coast` | 新加坡 | 補 TEL 現行營運段站表、template、OSM relation、brown icon | 未完工東段不提前進 `RAIL_DATA` |
| 10 | `KL-LRT-Ampang` / `KL-LRT-Sri-Petaling` | 馬來西亞 | 先以獨立 line object 補站表、template、OSM relation | branch 模型未定案前不合併 |
| 11 | `KL-Monorail` | 馬來西亞 | 補 monorail 站表、template、OSM relation、KL Monorail icon | 可作東南亞 monorail icon 範例 |
| 12 | KTM Komuter / `ERL-KLIA-Transit` | 馬來西亞 | 補 KTM 長距通勤與 KLIA Transit local service seed | 短折與 express 服務留給後續模型 |

### 5.5 啟動前確認

1. 確認第一輪是否採「泰國 2 條 → 馬來西亞 1 條 → 新加坡 1 條」循環，或先一次補完曼谷。
2. 確認 `BKK-MRT-Yellow` / `BKK-MRT-Pink` 在 UI 中顯示為 `Monorail`、`AGT` 或保留在 `Metro` 分組。
3. 對 `BKK-SRT-Dark-Red`、`KL-LRT-Ampang` / `KL-LRT-Sri-Petaling`、`ERL-KLIA-Transit` 採保守獨立線策略；共線、支線、express/local 模型不阻塞站表與 shape 回灌。

## 本次完成

- Bundle 拆分：在 `vite.config.js` 加 `manualChunks`，把 `rail-data.generated`、`leaflet`、`react`、`react-dom` 各自獨立成 chunk，降低 main bundle (89.6 kB / gzip 31 kB) 並讓資料 chunk 可獨立 cache。
- 確認 React production build：build output 中 `react-dom` 134 kB（dev 版會 >1 MB）、無 `jsxDEV`／`development` 字樣，確認是 production minified bundle。
- 部署前驗證：`npm run build`、`check:timing`、`check:shapes`、`test:smoke`（26 passed / 2 skipped）皆通過。
- PWA / 社群圖像：新增 `scripts/build-pwa-images.mjs`（用 Playwright Chromium 渲染 SVG），產出 `public/apple-touch-icon.png` (180×180) 與 `public/og-image.png` (1200×630)；`index.html` 補 `apple-touch-icon` link、`og:image` / `twitter:image` meta，twitter card 升級為 `summary_large_image`；`manifest.webmanifest` 加入 PNG icon。新增 npm script `build:pwa-images` 方便日後重新生成。
- Service Worker / 離線模式：新增 `public/sw.js`（precache app shell + 三層快取策略：hashed asset cache-first、navigation network-first、其他 stale-while-revalidate；跨來源請求一律放行讓 OSM tile / Nominatim 不被攔截）。`src/main.js` 在 production build 才註冊 SW，避免干擾 Vite HMR。新增 `tests/service-worker.spec.mjs` 驗證 SW 註冊後達到 `activated` 狀態。
- SW 升級提示 UX：移除 install 階段的 `skipWaiting`，改由使用者主動觸發。新 SW install 完成後 main.js 偵測到 waiting worker、透過 `window` event `sw:update-ready` 通知 React App；NoticeStack 支援 `action` 按鈕（複用既有 notice 樣式 + 新 `.notice-action` CSS），點「重新載入」會 `postMessage({type:"SKIP_WAITING"})` 給 waiting worker 並在 `controllerchange` 時 reload。新測試覆蓋通知顯示 → 點擊 → 派發 `sw:apply-update` 的整條鏈路（desktop / mobile 皆通過）。
- 大東亞 Phase B：依 `doc/east-asia-expansion-plan.md` 補齊日本、南韓、香港、中國、新加坡、馬來西亞、泰國、越南共 34 條 OSM relation 形狀；`src/rail-data.generated.js` 與 `scripts/line-shape-snapshot.json` 已更新，沒有 0 km fallback。
- 日本 HSR seed：新增 `Nishi-Kyushu-Shinkansen` all-stop `かもめ`（武雄温泉 ⇄ 長崎）5 站、1 個 train template、OSM relation `7356208` corridor + stop nodes、line-aware `かもめ` 圖示；列車圖示先檢查日本既有新幹線圖示後確認無同國同型號 / 同塗裝 `かもめ` PNG 可沿用，才新增 `japan-nishi-kyushu-shinkansen-kamome.png`。
- 日本 Airport / Monorail seed：新增 `Tokyo-Monorail` all-stop（モノレール浜松町 ⇄ 羽田空港第2ターミナル）11 站、1 個普通 train template、OSM relation `3417174`、line-aware Tokyo Monorail 圖示；列車圖示先檢查日本既有圖示後確認無同國同型號 monorail PNG 可沿用，才新增 `japan-tokyo-monorail-local.png`。
- 日本 Tram / LRT seed：新增 `Utsunomiya-Lightline` all-stop（宇都宮駅東口 ⇄ 芳賀・高根沢工業団地）19 站、1 個 `ライトライン` train template、OSM relation `12419659`、line-aware Utsunomiya Lightline 圖示；列車圖示先檢查日本既有低床 LRT / tram 圖示後確認無同國同型號 Lightline / HU300 PNG 可沿用，才新增 `japan-utsunomiya-lightline-lightline.png`。
- 資料修正：修正 JR-Sobu-Local 千葉端站點座標，並在 `kinematicProfile` 補上兩節點短站距的中點，避免短距離站間 inverse timing 誤報。
- 高誤差複查：修正 `JR-Yamanote` loop/corridor 造成的 56 km 錯長度、`KHH-LRT` 全環線誤套到 13 站區段、`Busan-Metro-1` 後段投影漂移；中國 HSR、TYMRT、Alishan、台鐵支線與高捷紅/輕軌的高偏移已用 generated OSM shape 吸附修正。
- OSM stop member 對站：`TPE-Brown`、`KHH-Orange`、`Busan-Metro-1`、`Daegu-Metro-1/2`、`Daejeon-Metro-1`、`Gwangju-Metro-1`、`Beijing-Subway-1`、`Shanghai-Metro-1/2`、`KL-Kelana-Jaya`、`BKK-BTS-Sukhumvit`、`BKK-MRT-Blue`、`HCMC-Metro-1`、`Hanoi-Metro-2A` 改用 relation stop/platform node 回填 stationCoords；上海 1/2、大邱 1/2、大田 1、光州 1、胡志明 1、河內 2A 與曼谷 BTS 主要站點已降到公尺級偏移。
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
- 南韓 Commuter / Metro seed：新增 `Gyeongui-Jungang`（문산 ⇄ 용문 主線）52 站、1 個 경의중앙선 train template、OSM route_master `8667957` / relation `5993212`；列車圖示先檢查同國同型號，因目前無 `경의중앙선` PNG 而新增 line-aware Gyeongui-Jungang commuter 圖示。서울역 / 임진강 / 도라산 / 지평 服務留後續 branch/short-turn 支援。
- 南韓 Commuter / Metro seed：新增 `Gyeongchun`（청량리 ⇄ 춘천 主線）24 站、1 個 경춘선 train template、OSM route_master `8656365` / relation `8656357`；列車圖示先檢查同國同型號，因目前無 `경춘선` PNG 而新增 line-aware Gyeongchun commuter 圖示。상봉 / 광운대 variants 留後續 branch/short-turn 支援。
- 南韓 Commuter / Metro seed：新增 `Gyeonggang`（판교 ⇄ 여주 主線）12 站、1 個 경강선 train template、OSM route_master `8735483` / relation `6462562`；relation `6462562` 的 stop members 尚缺 `성남`，shape mapping 不使用 `stationStops`。列車圖示先檢查同國同型號，因目前無 `경강선` / Class 371000 對應 PNG 而新增 line-aware Gyeonggang commuter 圖示。부발 short-turn 與未來延伸留後續 branch/extension 支援。
- 南韓 Commuter / Metro seed：新增 `Seohae`（일산 ⇄ 원시 all-stop）21 站、1 個 서해선 train template、OSM route_master `8725316` / relation `16244688`；relation `16244688` 的 stop members 可完整對齊 21 站，shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，因目前無 `서해선` / Class 391000 對應 PNG 而新增 line-aware Seohae commuter 圖示。대곡 short-turn 與未來南延伸留後續 branch/extension 支援。
- 南韓 Commuter / Metro seed：新增 `Incheon-Metro-1`（송도달빛축제공원 ⇄ 검단호수공원 all-stop）33 站、1 個 1호선 train template、OSM route_master `7854149` / relation `19425646`；relation `19425646` 的 stop members 可完整對齊 33 站，shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Seoul/Busan 既有 `1호선` PNG 為不同車型/塗裝後新增 line-aware Incheon Metro 1 圖示。2025-06-28 검단 extension 已納入；未來 branch/extension 支援留後續。
- 南韓 LRT/AGT seed：新增 `Incheon-Metro-2`（검단오류 ⇄ 운연 all-stop）27 站、1 個 2호선 train template、OSM relation `7527496`；relation `7527496` 的 stop members 可完整對齊 27 站，shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認既有 Gimpo Goldline 為不同車型/塗裝後新增 line-aware Incheon Metro 2 圖示。
- 南韓 LRT/AGT seed：新增 `Ui-LRT`（북한산우이 ⇄ 신설동）13 站、1 個 우이신설선 train template、OSM relation `7533582`；relation stop members 可完整對齊 13 站，shape mapping 使用 `stationStops`，並以 stationKms 回填手寫站距。列車圖示先檢查同國 LRT/AGT 既有 Gimpo Goldline / Incheon 2，確認 Hyundai Rotem UL000 與 연둣빛塗裝無可直接沿用後新增 line-aware Ui-Sinseol 圖示。
- 南韓 LRT/AGT seed：新增 `Sillim-LRT`（샛강 ⇄ 관악산）11 站、1 個 신림선 train template、OSM relation `14191877`；relation stop members 可完整對齊 11 站，shape mapping 使用 `stationStops`，並以 stationKms 回填手寫站距。列車圖示先檢查同國 LRT/AGT 既有 Gimpo Goldline / Incheon 2 / Ui LRT，確認 Woojin SL000 / K-AGT 與 파란색塗裝無可直接沿用後新增 line-aware Sillim 圖示。
- 南韓 LRT/AGT seed：新增 `Uijeongbu-LRT`（발곡 ⇄ 차량기지임시승강장）16 站、1 個 U Line train template、OSM relation `13738410`；relation stop members 可完整對齊 16 站，shape mapping 使用 `stationStops`，並以 stationKms 回填手寫站距。列車圖示先檢查同國 LRT/AGT 既有 Gimpo Goldline / Incheon 2 / Ui LRT / Sillim，確認 VAL 208 / U Line 橘色塗裝無可直接沿用後新增 line-aware Uijeongbu 圖示。
- 南韓 LRT/AGT seed：新增 `Yongin-EverLine`（기흥 ⇄ 전대·에버랜드）15 站、1 個 EverLine train template、OSM relation `6064093`；relation stop members 可完整對齊 15 站，shape mapping 使用 `stationStops`，並以 stationKms 回填手寫站距。列車圖示先檢查同國 LRT/AGT 既有 Gimpo Goldline / Incheon 2 / Ui LRT / Sillim / Uijeongbu，確認 Bombardier Innovia ART / EverLine 綠色塗裝無可直接沿用後新增 line-aware Yongin EverLine 圖示。
- 南韓 LRT/AGT seed：新增 `Busan-Gimhae-LRT`（사상 ⇄ 가야대）21 站、1 個 BGL train template、OSM relation `2204611`；relation stop members 可完整對齊 21 站，shape mapping 使用 `stationStops`，並以 stationKms 回填手寫站距。列車圖示先檢查同國 LRT/AGT 既有 Gimpo Goldline / Incheon 2 / Ui LRT / Sillim / Uijeongbu / Yongin，確認 BGL 紫色塗裝與既有圖示不同後新增 line-aware Busan-Gimhae LRT 圖示。
- 南韓非首都圈 Metro seed：新增 `Busan-Metro-2`（장산 ⇄ 양산 all-stop）43 站、1 個 2호선 train template、OSM route_master `8258658` / relation `2194999`；relation `2194999` 的 stop members 可完整對齊 43 站，shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認既有 Busan 1 與 Incheon 2 為不同車型/塗裝後新增 line-aware Busan Metro 2 圖示。
- 南韓非首都圈 Metro seed：新增 `Busan-Metro-3`（수영 ⇄ 대저 all-stop）17 站、1 個 3호선 train template、OSM route_master `8247017` / relation `2195014`；relation `2195014` 的 stop members 可完整對齊 17 站，shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認既有 Seoul 3 與 Daegu 3 為不同車型/系統後新增 line-aware Busan Metro 3 圖示。
- 南韓非首都圈 Metro seed：新增 `Busan-Metro-4`（미남 ⇄ 안평 all-stop）14 站、1 個 4호선 train template、OSM route_master `8258702` / relation `2205952`；relation `2205952` 的 stop members 可完整對齊 14 站，shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認既有 Seoul 4 為不同車型/塗裝後新增 line-aware Busan Metro 4 rubber-tyred light metro 圖示。
- 南韓非首都圈 Metro seed：新增 `Daegu-Metro-1`（설화명곡 ⇄ 하양 all-stop）35 站、1 個 1호선 train template、OSM route_master `7845971` / relation `7685464`；relation `7685464` 的 stop members 可完整對齊 35 站，shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認既有 Seoul/Busan/Incheon `1호선` 與 Daegu 3 單軌圖示皆非同型號/塗裝後新增 line-aware Daegu Metro 1 圖示。
- 南韓非首都圈 Metro seed：新增 `Daegu-Metro-2`（문양 ⇄ 영남대 all-stop）29 站、1 個 2호선 train template、OSM route_master `7845969` / relation `7685783`；relation `7685783` 的 stop members 可完整對齊 29 站，shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Busan/Incheon 既有 `2호선` 與 Daegu 1/3 圖示皆非同車型/塗裝後新增 line-aware Daegu Metro 2 圖示。
- 南韓非首都圈 Metro seed：新增 `Daejeon-Metro-1`（판암 ⇄ 반석 all-stop）22 站、1 個 1호선 train template、OSM route_master `7792528` / relation `7792527`；relation `7792527` 的 stop members 可完整對齊 22 站，shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Seoul/Busan/Incheon/Daegu 既有 `1호선` 皆非同車型/塗裝後新增 line-aware Daejeon Metro 1 圖示。
- 南韓非首都圈 Metro seed：新增 `Gwangju-Metro-1`（녹동 ⇄ 평동 all-stop）20 站、1 個 1호선 train template、OSM route_master `13538911` / relation `13463725`；relation `13463725` 的 stop members 可完整對齊 20 站，shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Seoul/Busan/Incheon/Daegu/Daejeon 既有 `1호선` 皆非同車型/塗裝後新增 line-aware Gwangju Metro 1 圖示。

## 未完成

必要項目：無。

近期未完成：泰國 / 新馬 P0 seed 尚未落地，執行清單以上方「下一輪資料更新」為準。

已移出 follow-up：Tokaido relation 替換、工程級 maxOffset 精修、日本 / 南韓完整覆蓋、branch/short-turn 長期模型、RTS Link 跨境 region、Level-2/4 資料源、多 region UI 與 i18n 策略，統一追蹤於 `doc/east-asia-expansion-plan.md`。

## 建議下一步

1. 先做 `BKK-BTS-Silom` Phase A+B，完成 icon / speed profile / shape pipeline。
2. 接著推 `BKK-MRT-Purple`，確認曼谷重軌 MRT template 與 BEM icon 樣式。
3. 泰國前 2 條 seed 穩定後，再啟動 `KL-MRT-Putrajaya` 與 `SG-MRT-North-East`，確保新馬 region 格式與既有資料一致。

## 5.3 vs 5.5 任務拆分與進度管理（本輪與下一輪）

### 5.3 可直接執行
- 目標：維持既有完成品質，做可驗證的資料更新與下一輪 P0 seed 擴展。
- 當前狀態：本輪「必要項目」已結束，follow-up 只追蹤泰國 / 新馬優先資料更新；低優先未完成項已移至 `doc/east-asia-expansion-plan.md`。

#### 5.3 進度看板
1. [x] 完成本輪必要項目（0 未完成）。
2. [x] 完成 34/34 Phase A 與 Phase B，並更新 `src/rail-data.generated.js`、`scripts/line-shape-snapshot.json`。
3. [x] 34/34 完成後建置與測試通過：`npm run build` / `npm run check:timing` / `npm run check:shapes` / `npm run test:smoke`（26 passed / 2 skipped）。
4. [x] Service Worker、PWA 圖片、bundle 拆分完成並回歸。
5. [x] 本輪可選精修：將 `maxOffset 0.75–1.0 km` 清單中的 `Beijing-Shanghai-HSR`、`Beijing-Guangzhou-HSR`、`Tokaido` 壓低至 `0.75 km` 以下。
   - [x] Beijing-Shanghai-HSR 已壓低到 0.680 km（< 0.75）。
   - [x] Beijing-Guangzhou-HSR 已壓低到 0.597 km（< 0.75）。
   - [x] Tokaido-Shinkansen 已壓低到 0.131 km，並沿用既有 icon：`japan-` 系列；`check:train-icons`、`check:shapes`、`check:timing` 通過。
6. [x] 本輪可選精修：完成已標註待補關係的支線/變體（如 Line 9 快慢法、Gyeongui short-turn、Gyeongchun variants）所需 template 支援。
7. [ ] 下一輪亞洲其他區域 seed：先做 `BKK-BTS-Silom` Phase A+B，再依序推 `BKK-MRT-Purple`、`BKK-MRT-Yellow`、`BKK-MRT-Pink`、`BKK-SRT-Dark-Red`、`KL-MRT-Putrajaya`、`SG-MRT-North-East`。

### 5.5 需要策略決策
- 目標：在再擴張前定義下一輪大方向，避免資源重工。
- 建議由 5.5 負責每輪啟動前的節點決策，5.3 只負責落地執行。

#### 5.5 進度看板
1. [x] 已完成「本輪必要項目判定」：回報無阻塞項目，將 backlog 轉為可選。
2. [x] 決定下一輪首選區域：泰國曼谷補完優先，新加坡 / 馬來西亞補完第二，印尼 / 菲律賓 / 越南第三，日本 / 南韓剩餘完整覆蓋暫列可選。
3. [ ] 決定 seed 擴展節奏：每輪固定 1 代表線→先驗證 icon/speed/shape→再擴張同網絡；建議先跑「泰國 2 條 → 馬來西亞 1 條 → 新加坡 1 條」循環。
4. [ ] 啟動前確認曼谷 monorail 類別顯示，以及 KL / ERL / SRT Red 先以獨立線落地的保守策略。
5. [x] 將 branch/short-turn 長期模型、RTS Link region、資料源與 UI/i18n 等低優先未完成項移入 `doc/east-asia-expansion-plan.md`。

### 下一步行事曆（建議）
- 每輪開始：5.5 完成 P0 seed 排序與必要模型確認。
- 每輪執行：5.3 以 seed 粒度完成 A/B + script 更新。
- 每輪結束：5.5 檢視 `maxOffset`、回傳下一輪 P0 優先修正清單、更新兩份文檔的進度條。
