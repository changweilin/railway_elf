# 大東亞路網擴張計畫

更新日期：2026-05-11

台灣側已涵蓋 21 條線（TRA 全幹線＋4 條支線、阿里山林鐵、THSR、北捷 5 線、機捷、高捷紅/橘、高雄輕軌、淡海輕軌），`follow-up-plan.md` 已標示「沒有尚未完成的必要項目」。本文件定義整個大東亞區域的擴張批次與每條線的執行步驟。

涵蓋範圍：**日本 / 南韓 / 香港 / 中國 / 新加坡 / 馬來西亞 / 泰國 / 越南**。

## 整體進度

- **Phase A（手寫站表 + 車種）：完成 34/34 條（100%）** — `npm run check:timing` & `npm run test:smoke` & `npm run build` 全通過
- **Phase B（OSM relation 對接）：34/34 條完成（100%）** — 批次 1–11 已補 OSM relation 並回灌真實軌道形狀；本輪沒有保留 0 km fallback。2026-05-11 加入南韓 backlog seeds 後，91 條線 runtime maxOffset 全部壓到 1.0 km 內。
- **完整覆蓋 backlog（日本 / 南韓）：已建立規劃事項** — 覆蓋尚未加入的鐵道類型與候選線群；此區塊是後續大型擴張，不列入已完成的 34 條 Phase A/B 統計。
- **Backlog seed（南韓 HSR / Airport / LRT-AGT / Monorail）：SRT Gyeongbu / Honam / Jeolla / Gyeongjeon / Donghae、KTX Honam / Jeolla / Gyeongjeon / Gangneung / Donghae / Jungang / Jungbu Naeryuk、AREX、Gimpo Goldline、Incheon Metro Line 2 與 Daegu Metro Line 3 已完成代表線** — `SRT-Gyeongbu` 已補手寫站表、SRT train template、OSM relation `6096884` + `6094351` corridor、line-aware SRT badge train icon；`SRT-Honam` 已補手寫站表、SRT train template、OSM relation `6096884` + `6094351` + `6095809` + `6094787` corridor，並沿用同國同型號 SRT train icon；`SRT-Jeolla` 已補手寫站表、SRT train template、OSM relation `6096884` + `6094351` + `6095809` + `6096342` corridor，並沿用同國同型號 SRT train icon；`SRT-Gyeongjeon` 已補手寫站表、SRT train template、OSM relation `6096884` + `6094351` + `8842494` + `8839114` corridor，並沿用同國同型號 SRT train icon；`SRT-Donghae` 已補手寫站表、SRT train template、OSM relation `6096884` + `6094351` + `8840839` + `8835676` corridor，並沿用同國同型號 SRT train icon；`KTX-Honam` 已補手寫站表、KTX / KTX-산천 train templates、OSM relation `11214334` + `6095809` + `6094787` corridor，並先檢查同國同型號後沿用既有 KTX / KTX-산천 PNG；`KTX-Jeolla` 已補手寫站表、KTX / KTX-산천 train templates、OSM relation `11214334` + `6095809` + `6096342` corridor，並先檢查同國同型號後沿用既有 KTX / KTX-산천 PNG；`KTX-Gyeongjeon` 已補手寫站表、KTX / KTX-산천 train templates、OSM relation `11214334` + `8839114` corridor，並先檢查同國同型號後沿用既有 KTX / KTX-산천 PNG；`KTX-Gangneung` 已補手寫站表、KTX-이음 train template、OSM relation `8842494` + `8817574` + `8821065` + `8825878` corridor，並先檢查同國同型號後新增 KTX-이음 PNG；`KTX-Donghae` 已補手寫站表、KTX / KTX-산천 train templates、OSM relation `11214334` + `8840839` + `8835676` corridor，並先檢查同國同型號後沿用既有 KTX / KTX-산천 PNG；`KTX-Jungang` 已補手寫站表、KTX-이음 train template、OSM relation `8842494` + `8817574` + `8821065` + `8880536` + `8880709` + `8835676` + `8879475` corridor，並先檢查同國同型號後沿用既有 KTX-이음 PNG；`KTX-Jungbu-Naeryuk` 已補手寫站表、KTX-이음 train template、OSM relation `8824194` + `12351758` corridor，並先檢查同國同型號後沿用既有 KTX-이음 PNG；`AREX` 已補手寫站表、all-stop train template、OSM relation `7919000`、line-aware train icon；`Gimpo-Goldline` 已補 light metro 站表、all-stop train template、OSM relation `10092720`、line-aware train icon；`Incheon-Metro-2` 已補 driverless light metro 27 站表、2호선 train template、OSM relation `7527496`、line-aware train icon；`Daegu-Metro-3` 已補單軌站表、all-stop train template、OSM relation `7685727`、line-aware monorail train icon；可作為後續高速鐵道、機場線、低運量自動化線與單軌線的 SOP 範例。
- **Backlog seed（南韓 Intercity）：ITX-Cheongchun 已完成代表線** — `ITX-Cheongchun` 已補手寫站表、ITX-청춘 train template、OSM relation `8817574` + `8821065` + `8817669` corridor；列車圖示先檢查同國同型號，因目前無 ITX-청춘 PNG 而新增 line-aware ITX-청춘 圖示。可作為後續 ITX / Saemaeul / Mugunghwa / Nuriro 等一般優等列車的 SOP 範例。
- **Backlog seed（南韓 Commuter / Metro）：Seoul Metropolitan Subway Line 3 / 4 / 5 / 6 / 7 / 8 / 9、Shinbundang、Suin-Bundang、Gyeongui-Jungang 與 Gyeongchun 已完成代表線** — `Seoul-Metro-3` 已補手寫站表、3호선 train template、OSM relation `443803` + `4729445` corridor；列車圖示先檢查同國同型號，確認既有 `Daegu-Metro-3|3호선` 是單軌不同型號後新增 line-aware 首都圈 3 號線 metro 圖示。`Seoul-Metro-4` 已補 51 站手寫站表、4호선 train template、OSM relation `13675921` + `2718884` + `4744311` corridor；列車圖示先檢查同國同型號，因目前無 `4호선` PNG 而新增 line-aware 首都圈 4 號線 metro 圖示。`Seoul-Metro-5` 已補 49 站手寫站表（방화 ⇄ 하남검단산 主線）、5호선 train template、OSM relation `12497486`；列車圖示先檢查同國同型號，因目前無 `5호선` PNG 而新增 line-aware 首都圈 5 號線 metro 圖示，마천 branch 留後續 branch-aware pass。`Seoul-Metro-6` 已補 40 個停站事件 / 39 unique stations（응암순환 ⇄ 신내）、6호선 train template、OSM relation `12080315`，並用 `stationKmsByIndex` 保留 응암 one-way loop 的重複站名；列車圖示先檢查同國同型號，因目前無 `6호선` PNG 而新增 line-aware 首都圈 6 號線 metro 圖示。`Seoul-Metro-7` 已補 53 站手寫站表（장암 ⇄ 석남）、7호선 train template、OSM relation `12746493`；列車圖示先檢查同國同型號，因目前無 `7호선` PNG 而新增 line-aware 首都圈 7 號線 metro 圖示。`Seoul-Metro-8` 已補 24 站手寫站表（별내 ⇄ 모란）、8호선 train template、OSM relation `2718901`；列車圖示先檢查同國同型號，因目前無 `8호선` PNG 而新增 line-aware 首都圈 8 號線 metro 圖示。`Seoul-Metro-9` 已補 38 站手寫站表（개화 ⇄ 중앙보훈병원）、9호선 train template、OSM relation `2718888`；列車圖示先檢查同國同型號，因目前無 `9호선` PNG 而新增 line-aware 首都圈 9 號線 metro 圖示；relation stop members 少 `동작`，shape mapping 不使用 `stationStops`，急行 skip-stop 留後續 template 支援後再補。`Shinbundang` 已補 16 站手寫站表（신사 ⇄ 광교）、신분당선 train template、OSM route_master `7728256` / relation `6060963`；列車圖示先檢查同國同型號，因目前無 `신분당선` PNG 而新增 line-aware Shinbundang metro 圖示。`Suin-Bundang` 已補 63 站手寫站表（청량리 ⇄ 인천）、수인분당선 train template、OSM route_master `11619514` / relation `11625556`；列車圖示先檢查同國同型號，因目前無 `수인분당선` PNG 而新增 line-aware Suin-Bundang commuter 圖示。`Gyeongui-Jungang` 已補 52 站手寫站表（문산 ⇄ 용문 主線）、경의중앙선 train template、OSM route_master `8667957` / relation `5993212`；列車圖示先檢查同國同型號，因目前無 `경의중앙선` PNG 而新增 line-aware Gyeongui-Jungang commuter 圖示。서울역 / 임진강 / 도라산 / 지평 服務留後續 branch/short-turn 支援。`Gyeongchun` 已補 24 站手寫站表（청량리 ⇄ 춘천 主線）、경춘선 train template、OSM route_master `8656365` / relation `8656357`；列車圖示先檢查同國同型號，因目前無 `경춘선` PNG 而新增 line-aware Gyeongchun commuter 圖示。상봉 / 광운대 variants 留後續 branch/short-turn 支援。可作為後續首都圈地鐵與廣域電鐵的 SOP 範例。
- **Backlog seed（南韓 Commuter / Metro）：Gyeonggang、Seohae 與 Incheon Metro 1 已完成代表線** — `Gyeonggang` 已補 12 站手寫站表（판교 ⇄ 여주 主線，含 2024-03-30 開通的 `성남`）、경강선 train template、OSM route_master `8735483` / relation `6462562`；relation `6462562` 的 stop members 尚缺 `성남`，因此 shape mapping 不使用 `stationStops`，改以手寫站點投影。列車圖示先檢查同國同型號，因目前無 `경강선` / Class 371000 對應 PNG 而新增 line-aware Gyeonggang commuter 圖示。`Seohae` 已補 21 站手寫站表（일산 ⇄ 원시 all-stop）、서해선 train template、OSM route_master `8725316` / relation `16244688`；relation `16244688` stop members 可完整對齊 21 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，因目前無 `서해선` / Class 391000 對應 PNG 而新增 line-aware Seohae commuter 圖示。`Incheon-Metro-1` 已補 33 站手寫站表（송도달빛축제공원 ⇄ 검단호수공원，含 2025-06-28 검단 extension）、1호선 train template、OSM route_master `7854149` / relation `19425646`；relation `19425646` stop members 可完整對齊 33 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Seoul/Busan 既有 `1호선` 為不同車型/塗裝後新增 line-aware Incheon Metro 1 圖示。대곡 short-turn、Seohae 未來 남쪽延伸與 Incheon 1 後續支線/延伸留後續 branch/extension 支援。
- **Backlog seed（南韓非首都圈 Metro）：Busan Metro Lines 2/3/4 已完成釜山代表線擴充** — `Busan-Metro-2` 已補 43 站手寫站表（장산 ⇄ 양산）、2호선 train template、OSM route_master `8258658` / relation `2194999`；relation `2194999` stop members 可完整對齊 43 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認既有 Busan 1 與 Incheon 2 圖示皆為不同車型/塗裝後新增 line-aware 釜山 2 號線 metro 圖示。`Busan-Metro-3` 已補 17 站手寫站表（수영 ⇄ 대저）、3호선 train template、OSM route_master `8247017` / relation `2195014`；relation `2195014` stop members 可完整對齊 17 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Seoul 3 與 Daegu 3 為不同車型/系統後新增 line-aware 釜山 3 號線 metro 圖示。`Busan-Metro-4` 已補 14 站手寫站表（미남 ⇄ 안평）、4호선 train template、OSM route_master `8258702` / relation `2205952`；relation `2205952` stop members 可完整對齊 14 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Seoul 4 為不同車型/塗裝後新增 line-aware 釜山 4 號線 rubber-tyred light metro 圖示。Daegu 1/2、Daejeon 1、Gwangju 1 留後續非首都圈城市捷運批次。

## 類型分類

每條線在表格的「類型」欄標示一種主類別，方便後續樣式 / icon / 統計：

| 類型 | 縮寫 | 說明 |
|---|---|---|
| 高速鐵路 | `HSR` | 設計時速 ≥ 250 km/h、跨城市的長距離高鐵（新幹線、KTX、中國高鐵） |
| 通勤鐵路 | `Commuter` | 都市圈跨區的中長距離傳統鐵路（JR 通勤線、東急、MTR 東鐵、KL 通勤） |
| 都會地鐵 | `Metro` | 城市內地鐵 / 捷運，含支線 |
| 環狀線 | `Loop` | 閉環營運的特例（山手、大阪環状、首爾 2 號、北京 2 號、SG Circle） |
| 機場線 | `Airport` | 機場專用直通線 |
| 傳統城際鐵路 | `Intercity` | 非高鐵的跨城市幹線與優等列車（JR 在來線特急、KORAIL ITX / Saemaeul / Mugunghwa / Nuriro） |
| 地方 / 第三部門鐵路 | `Regional` | 地方鐵道、第三部門鐵道、郊外或鄉村支線 |
| 輕軌 / 路面電車 | `LRT` / `Tram` | 輕軌、路面電車、新世代 LRT；台灣側已涵蓋淡海與高雄輕軌 |
| 單軌 / 新交通 | `Monorail` / `AGT` | 都市單軌、膠輪導軌式新交通、低運量自動化捷運 |
| 磁浮 / 線性馬達 | `Maglev` | 既有都市磁浮與未來營運的高速磁浮線 |
| 觀光 / 保存鐵道 | `Heritage` | 觀光列車、保存鐵道、登山鐵道、鋼索線；班距模型需逐線判斷 |
| 貨運鐵路 | `Freight` | 以路網完整性或非客運圖層為主；除非另建貨運預測模式，否則低優先 |

## 資料來源分級

每條線在表格另設「資料源」欄，依以下四級分類，第 4 級「必須付費」**先列入但不執行**：

| 級別 | 標記 | 說明 | 已用於本專案的例子 |
|---|---|---|---|
| 1. 免費 | `OSM` | 完全免費、匿名可用、無流量限制（軟性 fair-use 例外） | OpenStreetMap Overpass API（Tokaido / Yamanote / 中央線、所有台北捷運形狀） |
| 2. 免費 + 註冊 | `OSM+Reg` 或 `Gov` | 免費但需取得 client id / API key，多為政府開放資料平台 | TDX（台鐵 / THSR shape & 站表）、LTA DataMall（新加坡）、data.go.kr（南韓） |
| 3. 免費 + 額度 | `Quota` | 有免費額度但超過後計費或拒絕；build-time 抓取要計算總請求數 | Mapbox Directions、HERE、Google Maps Platform |
| 4. 必須付費 | `Paid` | 商業 GIS 授權，**本批次不執行**，僅列入未來考慮 | 商用 GTFS-RT 資料、私營路線最新 alignment、Esri ArcGIS 訂閱 |

**執行原則**：

- 預設用 Level 1（OSM）作為 Phase B 的形狀來源。所有批次目前都規劃在這一級。
- Level 2（TDX / Gov）僅在 OSM 缺漏或品質太差時補位；TDX 已用於台灣 region。
- Level 3 暫不啟用，待 OSM 不足以覆蓋的城市再考慮（例如北京地鐵某些新線）。
- Level 4 僅在後續「品質提升 backlog」段落列舉，本計畫不執行。

## 工作流程（每條線通用）

每條新線分兩階段。Phase A 完成即可上線（資料庫有正確站點，渲染使用 station-to-station 直線 polyline 作 fallback）。Phase B 把 OSM relation ID 補進來後，build 階段會用真實軌道形狀覆蓋。

### Phase A：手寫站點 + 車種

1. 在 `src/rail-data.js` 對應 region 加入新 line object：
   - `id` / `name`（當地語）/ `nameEn` / `color` / `category`（HSR / TRA / 捷運）
   - `directions: { up, down }`
   - `stations: [{ name, lat, lng, km, dwellSec? }, ...]` — km 為起站累積公里
   - 視情況加 `grades: [...]`（高架／隧道／地下化區段）
2. 在該 region 的 `trainTemplates` 加 1～3 個車種（普通／快速／特急）
3. 跑 `npm run check:timing` 與 `npm run test:smoke` 驗證無破壞

> 若 region 是新建（南韓、香港、中國、新加坡、馬來西亞、泰國、越南），同時要在 `RAIL_DATA` 加 `{ label, center, zoom, lines, trainTemplates }` 並更新地區切換 UI。

### Phase B：OSM relation 對接

1. 透過 Overpass `relation["route"="train"|"subway"]["name"~"<線名>"]` 查 relation ID
2. 在 `scripts/fetch-rail-shapes.mjs` `OSM_LINE_MAP` 加入 `{ name, relationIds: [...] }`，必要時補 `loopAnchor`（環狀線）或 `corridor`（雙向疊軌噪訊大時）
3. 跑 `node scripts/fetch-rail-shapes.mjs --skip-tw --refresh-cache`（之後可考慮新增 `--skip-jp` 之外的 region 旗標）
4. 跑 `npm run check:shapes` 確認 polyline km 與站點 km 對齊
5. 把進度標到本文件下方的勾選表

---

## 批次 1 — 日本：東京圈（5 條）

新增到既有 `japan` region。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☑ B | Metro | OSM | `Tokyo-Metro-Ginza` | 東京メトロ銀座線 | 浅草 ⇄ 渋谷 | 14.3 km / 19 站 |
| ☑ A ☑ B | Metro | OSM | `Tokyo-Metro-Marunouchi` | 東京メトロ丸ノ内線 | 池袋 ⇄ 荻窪 | 24.2 km / 25 站 |
| ☑ A ☑ B | Commuter | OSM | `JR-Keihin-Tohoku` | 京浜東北線 | 大宮 ⇄ 大船 | 81.2 km / 46 站 |
| ☑ A ☑ B | Commuter | OSM | `JR-Sobu-Local` | 総武線（各駅停車） | 三鷹 ⇄ 千葉 | 60.2 km / 39 站 |
| ☑ A ☑ B | Commuter | OSM | `Tokyu-Toyoko` | 東急東横線 | 渋谷 ⇄ 横浜 | 24.2 km / 21 站 |

## 批次 2 — 日本：大阪圈（3 條）

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☑ B | Loop | OSM | `JR-Osaka-Loop` | 大阪環状線 | 環狀（錨點：大阪） | 21.7 km / 19 站 + 閉環 |
| ☑ A ☑ B | Metro | OSM | `Osaka-Metro-Midosuji` | 大阪メトロ御堂筋線 | 江坂 ⇄ なかもず | 24.5 km / 20 站 |
| ☑ A ☑ B | Commuter | OSM | `Hankyu-Kobe` | 阪急神戸本線 | 大阪梅田 ⇄ 神戸三宮 | 32.3 km / 16 站 |

## 批次 3 — 日本：跨區新幹線（1 條）

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☑ B | HSR | OSM | `Sanyo-Shinkansen` | 山陽新幹線 | 新大阪 ⇄ 博多 | 553.7 km / 19 站 |

---

## 批次 4 — 南韓：首爾圈 + KTX（代表線）

新增 `korea` region，center 約 `[37.55, 126.99]`，zoom 9。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☑ B | Metro | OSM | `Seoul-Metro-1` | 수도권 전철 1호선 | 광운대 ⇄ 인천（核心 25 站） | 51.8 km |
| ☑ A ☑ B | Loop | OSM | `Seoul-Metro-2` | 서울 지하철 2호선 | 環狀（錨點：시청） | 48.8 km / 43 站 + 閉環 |
| ☑ A ☑ B | Metro | OSM | `Seoul-Metro-3` | 수도권 전철 3호선 | 대화 ⇄ 오금 | 57.4 km / 44 站 |
| ☑ A ☑ B | Metro | OSM | `Seoul-Metro-4` | 수도권 전철 4호선 | 진접 ⇄ 오이도 | 85.7 km / 51 站 |
| ☑ A ☑ B | Metro | OSM | `Seoul-Metro-5` | 수도권 전철 5호선 | 방화 ⇄ 하남검단산（主線） | 52.9 km / 49 站 |
| ☑ A ☑ B | Metro | OSM | `Seoul-Metro-6` | 서울 지하철 6호선 | 응암순환 ⇄ 신내 | 36.4 km / 40 停站（39 站） |
| ☑ A ☑ B | Metro | OSM | `Seoul-Metro-7` | 서울 지하철 7호선 | 장암 ⇄ 석남 | 61.3 km / 53 站 |
| ☑ A ☑ B | Metro | OSM | `Seoul-Metro-8` | 서울 지하철 8호선 | 별내 ⇄ 모란 | 30.1 km / 24 站 |
| ☑ A ☑ B | Metro | OSM | `Seoul-Metro-9` | 서울 지하철 9호선 | 개화 ⇄ 중앙보훈병원 | 40.6 km / 38 站 |
| ☑ A ☑ B | Metro | OSM | `Shinbundang` | 수도권 전철 신분당선 | 신사 ⇄ 광교 | 33.2 km / 16 站 |
| ☑ A ☑ B | Metro | OSM | `Suin-Bundang` | 수도권 전철 수인·분당선 | 청량리 ⇄ 인천 | 106.9 km / 63 站 |
| ☑ A ☑ B | Metro | OSM | `Gyeongui-Jungang` | 수도권 전철 경의·중앙선 | 문산 ⇄ 용문（主線） | 118.0 km / 52 站 |
| ☑ A ☑ B | Metro | OSM | `Gyeongchun` | 수도권 전철 경춘선 | 청량리 ⇄ 춘천（主線） | 85.1 km / 24 站 |
| ☑ A ☑ B | Metro | OSM | `Gyeonggang` | 수도권 전철 경강선 | 판교 ⇄ 여주（主線） | 56.0 km / 12 站 |
| ☑ A ☑ B | Metro | OSM | `Seohae` | 수도권 전철 서해선 | 일산 ⇄ 원시 | 47.1 km / 21 站 |
| ☑ A ☑ B | Metro | OSM | `Incheon-Metro-1` | 인천 도시철도 1호선 | 송도달빛축제공원 ⇄ 검단호수공원 | 37.1 km / 33 站 |
| ☑ A ☑ B | LRT | OSM | `Incheon-Metro-2` | 인천 도시철도 2호선 | 검단오류 ⇄ 운연 | 29.3 km / 27 站 |
| ☑ A ☑ B | HSR | OSM | `KTX-Gyeongbu` | KTX 경부선 | 서울 ⇄ 부산 | 418 km / 10 站 |
| ☑ A ☑ B | HSR | OSM | `KTX-Honam` | KTX 호남선 | 용산 ⇄ 목포 | 423.9 km / 10 站 |
| ☑ A ☑ B | HSR | OSM | `KTX-Jeolla` | KTX 전라선 | 용산 ⇄ 여수EXPO | 388.2 km / 13 站 |
| ☑ A ☑ B | HSR | OSM | `KTX-Gyeongjeon` | KTX 경전선 | 서울 ⇄ 진주 | 426.3 km / 14 站 |
| ☑ A ☑ B | HSR | OSM | `KTX-Gangneung` | KTX 강릉선 | 서울 ⇄ 강릉 | 215.1 km / 11 站 |
| ☑ A ☑ B | HSR | OSM | `KTX-Donghae` | KTX 동해선 | 서울 ⇄ 포항 | 347.9 km / 8 站 |
| ☑ A ☑ B | HSR | OSM | `KTX-Jungang` | KTX 중앙선 | 서울 ⇄ 부전 | 424.2 km / 16 站 |
| ☑ A ☑ B | HSR | OSM | `KTX-Jungbu-Naeryuk` | KTX 중부내륙선 | 판교 ⇄ 문경 | 136.0 km / 10 站 |
| ☑ A ☑ B | Intercity | OSM | `ITX-Cheongchun` | ITX-청춘 | 용산 ⇄ 춘천 | 102.4 km / 14 站 |
| ☑ A ☑ B | Metro | OSM | `Busan-Metro-1` | 부산 도시철도 1호선 | 다대포해수욕장 ⇄ 노포 | 40.5 km / 40 站 |
| ☑ A ☑ B | Metro | OSM | `Busan-Metro-2` | 부산 도시철도 2호선 | 장산 ⇄ 양산 | 45.8 km / 43 站 |
| ☑ A ☑ B | Metro | OSM | `Busan-Metro-3` | 부산 도시철도 3호선 | 수영 ⇄ 대저 | 18.2 km / 17 站 |
| ☑ A ☑ B | Metro | OSM | `Busan-Metro-4` | 부산 도시철도 4호선 | 미남 ⇄ 안평 | 12.3 km / 14 站 |

---

## 日本 / 南韓完整覆蓋 backlog（新增規劃事項）

此區塊補上「目前尚未加入，但屬於日本 / 南韓鐵道系統的主要類型」。它不是一次要全做完的線路清單，而是後續拆批次時的覆蓋範圍表；實作時每一列再依城市、營運者、資料品質與 icon 需求拆成小批次。

參考分類依據：

- 日本：JNTO 的 [Traveling by Rail](https://www.japan.travel/en/guide/traveling-by-rail/) 將日本鐵道概括為 JR、新幹線、民鐵、地下鐵與觀光列車；MLIT 的 [鉄道統計年報](https://www.mlit.go.jp/tetudo/tetudo_tk6_000032.html) 涵蓋鐵道、軌道、索道事業，MLIT 中部運輸局的 [主な鉄道用語](https://wwwtb.mlit.go.jp/chubu/tetsudou/yougo.html) 也明列普通鐵道、單軌、新交通、鋼索、磁浮與索道等；MLIT [軌道法（路面電車等）](https://www.mlit.go.jp/road/sisaku/lrt/lrt_index.html) 作為 Tram / LRT 規劃依據。
- 南韓：KORAIL 官方 [Train Information](https://info.korail.com/infoeng/index.do) 分為 High-Speed Train、General train、Metro Train；都市鐵道另有地鐵、輕量捷運與單軌系統。

### 日本：未加入類型與候選線群

目前已加入日本代表線：東海道 / 山陽新幹線、山手、中央快速、京浜東北、総武各停、東急東横、阪急神戸、大阪環状、御堂筋、銀座、丸ノ内。下表列出尚未完整納入的類型：

| 狀態 | 類型 | 規劃範圍 | 候選線群 / 例子 | 資料源 | 備註 |
|---|---|---|---|---|---|
| □ backlog | HSR / Maglev | 其餘新幹線、迷你新幹線、未來高速磁浮 | 東北、北海道、上越、北陸、九州、西九州、秋田、山形；中央新幹線待營運後評估 | OSM + 官方站距 | HSR relation 常含上下行、側線、車庫，優先套 `corridor` 重建 |
| □ backlog | Intercity | JR 在來線幹線與特急型服務 | 常磐、東北本線 / 宇都宮、高崎、総武快速 / 横須賀、紀勢、山陰、予讃、日豊、鹿児島本線等 | OSM + JR 公開站表 | 先以幹線段落切批，不一次塞全 JR 網 |
| □ backlog | Commuter | JR 都會圈未覆蓋路線 | 埼京、湘南新宿、京葉、武蔵野、南武、横浜、関西本線 / 大和路、JR 京都 / 神戸 / 宝塚 / 阪和、名古屋 / 札幌 / 仙台圈 | OSM | 與既有山手 / 中央 / 京浜東北互相重疊，需避免重複 snap 干擾 |
| □ backlog | Commuter / Intercity | 大手民鐵與準大手民鐵 | 東武、西武、京王、小田急、京成、京急、相鉄、近鉄、京阪、阪神、南海、名鉄、西鉄；補齊東急 / 阪急其他主線 | OSM + 民鐵站表 | 可先做機場、觀光地、都心放射線 |
| □ backlog | Metro | 地下鐵 / 市營地鐵其餘系統 | Tokyo Metro 其餘線、都営地下鉄、横浜、名古屋、京都、神戸、福岡、札幌、仙台 | OSM | 同城市多線時要先確認 region selector 與 marker density |
| □ backlog | Airport | 機場聯絡鐵道 | 成田 Express、京成 Skyliner / Access、京急空港線、東京モノレール、南海空港線、JR 関西空港線、名鉄空港線、福岡空港線 | OSM | 班距與停站型態明確，適合做成高優先小批次 |
| □ backlog | Tram / LRT | 路面電車與新世代 LRT | 広島、長崎、熊本、鹿児島、富山、宇都宮ライトレール、都電荒川、東急世田谷、札幌、函館、岡山、松山、高知、福井、豊橋等 | OSM + MLIT 軌道資料 | 需補 tram icon 與低速 profile |
| □ backlog | Monorail / AGT / Maglev | 都市單軌、新交通、都市磁浮 | 東京モノレール、大阪モノレール、多摩、千葉、湘南、沖縄ゆいレール；ゆりかもめ、日暮里・舎人、ポートライナー、六甲ライナー、ニュートラム；リニモ | OSM | 建議獨立 `Monorail` / `AGT` icon，不併入一般捷運 |
| □ backlog | Regional | 第三部門 / 地方鐵道 | IGR / 青い森、三陸、しなの、えちごトキめき、あいの風とやま、IR いしかわ、肥薩おれんじ、各地方私鐵 | OSM + 地方站表 | 站距與班距差異大，適合按地區慢慢補 |
| □ backlog | Heritage | 觀光 / 保存 / 登山 / 鋼索鐵道 | 箱根登山、黒部峡谷、嵯峨野観光、大井川、叡山、江ノ電；高野山ケーブル、生駒ケーブル等 | OSM + 營運者資料 | 若班距稀疏或季節性強，需加季節/休駛提示 |
| □ backlog | Freight | 貨運主幹與臨港線 | JR Freight 主要貨物走廊、港灣 / 工業支線 | OSM + 貨運資料 | 與「下一班客車」核心不同，除非新增 freight layer，保持低優先 |

### 南韓：未加入類型與候選線群

目前已加入南韓代表線：수도권 전철 1호선、서울 지하철 2호선、수도권 전철 3호선、수도권 전철 4호선、수도권 전철 5호선、서울 지하철 6호선、서울 지하철 7호선、서울 지하철 8호선、서울 지하철 9호선、수도권 전철 신분당선、수도권 전철 수인·분당선、수도권 전철 경의·중앙선、수도권 전철 경춘선、수도권 전철 경강선、수도권 전철 서해선、인천 도시철도 1호선、인천 도시철도 2호선、KTX 경부선、KTX 호남선、KTX 전라선、KTX 경전선、KTX 강릉선、KTX 동해선、KTX 중앙선、KTX 중부내륙선、SRT 경부선、SRT 호남선、SRT 전라선、SRT 경전선、SRT 동해선、ITX-청춘、AREX、Gimpo Goldline、Daegu Metro Line 3、부산 도시철도 1호선、부산 도시철도 2호선、부산 도시철도 3호선、부산 도시철도 4호선。下表列出尚未完整納入的類型：

| 狀態 | 類型 | 規劃範圍 | 候選線群 / 例子 | 資料源 | 備註 |
|---|---|---|---|---|---|
| ◐ seed | HSR | KTX / SRT 其餘高速服務與走廊 | SRT 경부선（☑ A ☑ B）、SRT 호남선（☑ A ☑ B）、SRT 전라선（☑ A ☑ B）、SRT 경전선（☑ A ☑ B）、SRT 동해선（☑ A ☑ B）、KTX 호남선（☑ A ☑ B）、KTX 전라선（☑ A ☑ B）、KTX 경전선（☑ A ☑ B）、KTX 강릉선（☑ A ☑ B）、KTX 동해선（☑ A ☑ B）、KTX 중앙선（☑ A ☑ B）、KTX 중부내륙선（☑ A ☑ B）；其他 KTX branches 待後續 | OSM + KORAIL / SR 站表 | SRT Gyeongbu / Honam / Jeolla / Gyeongjeon / Donghae 與 KTX Honam / Jeolla / Gyeongjeon / Gangneung / Donghae / Jungang / Jungbu Naeryuk 已完成 HSR seed；新增高速線先檢查同國同型號圖示再沿用，沒有才生成 |
| ◐ seed | Intercity | 一般列車與優等在來線 | ITX-청춘（☑ A ☑ B）；ITX-새마을、ITX-마음、누리로、무궁화호；京釜、湖南、中央、太白、嶺東、京春等 | OSM + KORAIL | ITX-청춘 已作為首條 Intercity seed；後續一般列車先補固定停站、班距穩定的主幹 |
| ◐ seed | Commuter / Metro | 首都圈廣域電鐵與地鐵未覆蓋線 | Seoul Metro 3（☑ A ☑ B）、Seoul Metro 4（☑ A ☑ B）、Seoul Metro 5（☑ A ☑ B）、Seoul Metro 6（☑ A ☑ B）、Seoul Metro 7（☑ A ☑ B）、Seoul Metro 8（☑ A ☑ B）、Seoul Metro 9（☑ A ☑ B）、Shinbundang（☑ A ☑ B）、Suin-Bundang（☑ A ☑ B）、Gyeongui-Jungang（☑ A ☑ B）、Gyeongchun（☑ A ☑ B）、Gyeonggang（☑ A ☑ B）、Seohae（☑ A ☑ B）、Incheon 1（☑ A ☑ B）等 | OSM + operator data | Seoul Metro 3 / 4 / 5 / 6 / 7 / 8 / 9、Shinbundang、Suin-Bundang、Gyeongui-Jungang、Gyeongchun、Gyeonggang、Seohae 與 Incheon 1 已作為首都圈地鐵 / 廣域電鐵 seeds；多線共線與直通複雜，需逐線確認 `directions` 與停站型；Line 9 急行、Gyeongui-Jungang 支線/短折、Gyeongchun 상봉 / 광운대 variants、Gyeonggang 부발 short-turn 與 Seohae 대곡 short-turn 待 skip-stop 或 branch/short-turn template 支援 |
| ◐ seed | Metro | 非首都圈都市地鐵 | Busan 2（☑ A ☑ B）、Busan 3（☑ A ☑ B）、Busan 4（☑ A ☑ B）、Daegu 1–2、Daejeon 1、Gwangju 1 | OSM | Busan 2/3/4 已與既有 Busan 1 組成釜山城市捷運 seed；後續同樣先檢查同國同型號列車圖示，無可沿用時才生成 |
| ◐ seed | Airport | 機場聯絡鐵道 | AREX 일반（☑ A ☑ B）；AREX 직통 與金海機場相關城市鐵道銜接待後續 | OSM | AREX all-stop 已作為南韓機場線代表線；直通列車需等 skip-stop template 支援後再建 |
| ◐ seed | LRT / AGT | 輕量捷運與無人自動運轉線 | Gimpo Goldline（☑ A ☑ B）、Incheon 2（☑ A ☑ B）；Ui LRT、Sillim Line、Uijeongbu U Line、Yongin EverLine、Busan-Gimhae LRT 等待後續 | OSM + operator data | Gimpo Goldline 與 Incheon 2 已作為 low-capacity / driverless seeds；Incheon 2 圖示先檢查 Gimpo Goldline 但因 Class 2000 / 塗裝不同而新增 line-aware 圖示；後續可沿用或擴充此圖示風格 |
| ◐ seed | Monorail | 都市單軌 | Daegu Line 3（☑ A ☑ B）；觀光型單軌另案評估 | OSM + Daegu operator data | 大邱 3 號線已作為韓國單軌代表線；後續可沿用 monorail 圖示風格 |
| □ backlog | Tram | 現代路面電車 / tram 計畫 | Daejeon Line 2 等營運後納入；既有未營運計畫先不建資料 | OSM + 市府資料 | 未開業線只列規劃，不進 `RAIL_DATA` |
| □ backlog | Regional | 地方支線與區域鐵路 | 東海、慶北、慶全、湖南支線、旌善等地方線 | OSM + KORAIL | 先排客運仍穩定營運者 |
| □ backlog | Heritage | 觀光列車 / 保存鐵道 / railbike | O / V / S-train 類觀光服務、地方觀光鐵道與 railbike | OSM + 營運者資料 | 多為季節性或預約制，班距模型需特例 |
| □ backlog | Freight | 貨運與工業線 | KORAIL 貨運走廊、港灣 / 產業線 | OSM + 貨運資料 | 低優先，除非新增非客運圖層 |

Backlog 執行原則：

1. 每個新類型先做一條「代表線」驗證 icon、速度 profile、站距投影與 snap 行為，再擴成整個城市或營運者。
2. 日本優先順序建議：剩餘新幹線 → 機場線 → 東京 / 大阪地下鐵補齊 → 大手民鐵 → Tram / Monorail / AGT → Regional / Heritage。
3. 南韓優先順序建議：SRT / KTX 其餘走廊 → 首都圈廣域線 → Busan / Daegu / Daejeon / Gwangju → Intercity / LRT / Monorail → Regional / Heritage；SRT Gyeongbu / Honam / Jeolla / Gyeongjeon / Donghae 與 KTX Honam / Jeolla / Gyeongjeon / Gangneung / Donghae / Jungang / Jungbu Naeryuk 已完成 HSR backlog seeds，ITX-Cheongchun 已完成首條 Intercity seed，Seoul-Metro-3 / Seoul-Metro-4 / Seoul-Metro-5 / Seoul-Metro-6 / Seoul-Metro-7 / Seoul-Metro-8 / Seoul-Metro-9 / Shinbundang / Suin-Bundang / Gyeongui-Jungang / Gyeongchun / Gyeonggang / Seohae / Incheon-Metro-1 / Busan-Metro-2 / Busan-Metro-3 / Busan-Metro-4 已完成 Commuter / Metro seeds，AREX all-stop 已完成首條 Airport seed，Gimpo Goldline / Incheon-Metro-2 已完成 LRT/AGT seeds，Daegu Metro Line 3 已完成首條 Monorail seed。
4. Freight、鋼索、季節性觀光線若沒有穩定 passenger pass prediction 模型，先做地圖圖層規劃，不阻塞客運功能。

## 批次 5 — 香港：MTR（4 條）

新增 `hongkong` region，center `[22.37, 114.13]`，zoom 11。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☑ B | Metro | OSM | `MTR-Tsuen-Wan` | 荃灣綫 | 中環 ⇄ 荃灣 | 16.0 km / 16 站 |
| ☑ A ☑ B | Metro | OSM | `MTR-Island` | 港島綫 | 堅尼地城 ⇄ 柴灣 | 16.3 km / 17 站 |
| ☑ A ☑ B | Commuter | OSM | `MTR-East-Rail` | 東鐵綫 | 金鐘 ⇄ 羅湖 | 35.5 km / 14 站 |
| ☑ A ☑ B | Airport | OSM | `MTR-Airport-Express` | 機場快綫 | 香港 ⇄ 博覽館 | 35.3 km / 5 站 |

## 批次 6 — 中國：高鐵主幹線（3 條）

新增 `china` region，center `[35.0, 110.0]`，zoom 5。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☑ B | HSR | OSM | `Beijing-Shanghai-HSR` | 京滬高速鐵路 | 北京南 ⇄ 上海虹橋 | 1318 km / 23 站 |
| ☑ A ☑ B | HSR | OSM | `Beijing-Guangzhou-HSR` | 京廣高速鐵路 | 北京西 ⇄ 廣州南 | 2298 km / 28 站 |
| ☑ A ☑ B | HSR | OSM | `Shanghai-Kunming-HSR` | 滬昆高速鐵路 | 上海虹橋 ⇄ 昆明南 | 2252 km / 26 站 |

## 批次 7 — 中國：北京 / 上海都會地鐵（4 條）

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☑ B | Metro | OSM | `Beijing-Subway-1` | 北京地鐵 1 號線 | 蘋果園 ⇄ 環球度假區 | 47.6 km / 35 站 |
| ☑ A ☑ B | Loop | OSM | `Beijing-Subway-2` | 北京地鐵 2 號線 | 環狀（錨點：西直門） | 23.1 km / 18 站 + 閉環 |
| ☑ A ☑ B | Metro | OSM | `Shanghai-Metro-1` | 上海地鐵 1 號線 | 富錦路 ⇄ 莘莊 | 36.4 km / 28 站 |
| ☑ A ☑ B | Metro | OSM | `Shanghai-Metro-2` | 上海地鐵 2 號線 | 徐涇東 ⇄ 浦東國際機場 | 64.0 km / 30 站 |

## 批次 8 — 新加坡：MRT（3 條）

新增 `singapore` region，center `[1.35, 103.82]`，zoom 11。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☑ B | Metro | OSM | `SG-MRT-North-South` | North-South Line | Jurong East ⇄ Marina South Pier | 45 km / 27 站 |
| ☑ A ☑ B | Metro | OSM | `SG-MRT-East-West` | East-West Line | Pasir Ris ⇄ Tuas Link | 57.2 km / 33 站 |
| ☑ A ☑ B | Metro | OSM | `SG-MRT-Circle` | Circle Line | Dhoby Ghaut ⇄ HarbourFront（horseshoe）| 31.0 km / 28 站 |

## 批次 9 — 馬來西亞：吉隆坡（2 條）

新增 `malaysia` region，center `[3.14, 101.69]`，zoom 11。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☑ B | Metro | OSM | `KL-Kelana-Jaya` | LRT Laluan Kelana Jaya | Putra Heights ⇄ Gombak | 46.4 km / 37 站 |
| ☑ A ☑ B | Metro | OSM | `KL-MRT-Kajang` | MRT Laluan Kajang | Kwasa Damansara ⇄ Kajang | 51.0 km / 29 站 |

## 批次 10 — 泰國：曼谷（3 條）

新增 `thailand` region，center `[13.75, 100.50]`，zoom 11。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☑ B | Metro | OSM | `BKK-BTS-Sukhumvit` | BTS สายสุขุมวิท | Khu Khot ⇄ Kheha | 53.5 km / 47 站 |
| ☑ A ☑ B | Metro | OSM | `BKK-MRT-Blue` | MRT สายสีน้ำเงิน | Tha Phra ⇄ Lak Song | 48.0 km / 38 站 |
| ☑ A ☑ B | Airport | OSM | `BKK-Airport-Rail` | Airport Rail Link | Phaya Thai ⇄ Suvarnabhumi | 28.6 km / 8 站 |

## 批次 11 — 越南：胡志明 / 河內（2 條）

新增 `vietnam` region，center `[16.0, 107.0]`，zoom 6。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☑ B | Metro | OSM | `HCMC-Metro-1` | Tuyến Metro số 1 | Bến Thành ⇄ Suối Tiên | 19.7 km / 14 站 |
| ☑ A ☑ B | Metro | OSM | `Hanoi-Metro-2A` | Tuyến số 2A | Cát Linh ⇄ Yên Nghĩa | 13.0 km / 12 站 |

---

## 分類統計

已完成的批次 1–11 合計 **34 條線**，分布如下；不含既有日本 3 條線（東海道新幹線、山手線、中央線）與上方新增的日本 / 南韓完整覆蓋 backlog。另有 backlog seed：南韓 `SRT-Gyeongbu` / `SRT-Honam` / `SRT-Jeolla` / `SRT-Gyeongjeon` / `SRT-Donghae` / `KTX-Honam` / `KTX-Jeolla` / `KTX-Gyeongjeon` / `KTX-Gangneung` / `KTX-Donghae` / `KTX-Jungang` / `KTX-Jungbu-Naeryuk` 12 條 HSR 線、`ITX-Cheongchun` 1 條 Intercity 線、`Seoul-Metro-3` / `Seoul-Metro-4` / `Seoul-Metro-5` / `Seoul-Metro-6` / `Seoul-Metro-7` / `Seoul-Metro-8` / `Seoul-Metro-9` / `Shinbundang` / `Suin-Bundang` / `Gyeongui-Jungang` / `Gyeongchun` / `Gyeonggang` / `Seohae` / `Incheon-Metro-1` / `Busan-Metro-2` / `Busan-Metro-3` / `Busan-Metro-4` 17 條 Commuter / Metro 線、`AREX` 1 條 Airport 線、`Gimpo-Goldline` / `Incheon-Metro-2` 2 條 LRT/AGT 線、`Daegu-Metro-3` 1 條 Monorail 線已完成 A/B。

| 類型 | 條數 | 線名摘要 |
|---|---|---|
| HSR | 17 | 山陽新幹線、KTX 京釜、KTX 湖南、KTX 全羅、KTX 慶全、KTX 江陵、KTX 東海、KTX 中央、KTX 中部內陸、SRT 京釜、SRT 湖南、SRT 全羅、SRT 慶全、SRT 東海、京滬、京廣、滬昆 |
| Intercity | 1 | ITX-청춘 |
| Commuter | 5 | JR 京浜東北、JR 総武各停、東急東横、阪急神戸、MTR 東鐵 |
| Metro | 33 | Tokyo Metro 2、Osaka Metro 1、Seoul 1/3/4/5/6/7/8/9/Shinbundang/Suin-Bundang/Gyeongui-Jungang/Gyeongchun/Gyeonggang/Seohae、Incheon 1、Busan 1/2、MTR 2、北京 / 上海地鐵 3、SG MRT 2、KL 2、BKK 2、HCMC/Hanoi 2 |
| Loop | 4 | 大阪環状、Seoul 2 號、Beijing 2 號、SG Circle |
| Airport | 2 | MTR 機場快綫、BKK Airport Rail Link |
| LRT | 1 | Incheon 2（台灣側已涵蓋淡海、高雄環狀輕軌） |

按國家：

| 國家 | 條數 | 批次 |
|---|---|---|
| 日本 | 9 | 1, 2, 3 |
| 南韓 | 4 | 4 |
| 香港 | 4 | 5 |
| 中國 | 7 | 6, 7 |
| 新加坡 | 3 | 8 |
| 馬來西亞 | 2 | 9 |
| 泰國 | 3 | 10 |
| 越南 | 2 | 11 |

按資料源分級：

| 級別 | 條數 | 對應批次 |
|---|---|---|
| 1. 免費（OSM） | 34 | 1–11（全部）|
| 2. 免費 + 註冊 | 0（已執行：台灣 21 條 by TDX） | — |
| 3. 免費 + 額度 | 0 | — |
| 4. 必須付費 | 0（僅 backlog，**不執行**）| — |

## Level 4（必須付費）資料源 backlog — 不執行

下列為已知商用資料源，**本計畫不執行**，僅列入未來品質提升 backlog：

| 資料源 | 提供者 | 涵蓋範圍 | 用途 |
|---|---|---|---|
| GTFS-RT 即時 feed（部分商用） | 各民營鐵路 / Trafi / Moovit | 多國通勤鐵路 | 真實時刻表 / 即時誤點 |
| Esri ArcGIS Online 訂閱 | Esri | 中國高鐵、東南亞地鐵 | 高解析鐵路中心線 GIS |
| Here Routing API（超出免費額度） | HERE | 全球 | 路線規劃 / ETA |
| 私營路網精細 alignment（CRRC, JR 集團商用授權） | 各鐵路公司 | 中國高鐵、JR | 工程級坐標 |
| Trafi / Citymapper API | Trafi、Citymapper | 多國都會 | 整合票價與班表 |

採用任何 Level 4 資料源前，需用戶明確授權並評估授權條款。

---

## 完成標準

- 每條線 Phase A 完成後本表勾左格、Phase B 完成後再勾右格
- 各批次結束後跑：
  - `npm run check:timing`
  - `npm run check:shapes`
  - `npm run build`
  - `npm run test:smoke`
- 全部批次完成後更新 `doc/follow-up-plan.md`，把大東亞納入「目前結論」段落

## 風險 / 備忘

- **Loop 類**（山手、大阪環状、首爾 2 號、北京 2 號、新加坡 Circle）：用 `loopAnchor` 切開，避免 km 累積錯亂。
- **HSR 類**（東海道、山陽、京滬、京廣、滬昆、KTX / SRT）：OSM relation 易包含上下行＋折返線，可能需 `corridor` 重建（參考 Tokaido 與 KTX-Honam 既有作法）。
- **多 region 切換 UI**：地區數從 2 → 9，要看 `src/app-core.js` 的 region selector 是否仍適合（例如改下拉式或分組）。
- **i18n**：新增日文／韓文／中文簡體／泰文／越南文站名後，要走 `i18n-sync` skill 對齊 zh-TW UI 字串。
- **站點座標品質**：本輪沒有 0 km fallback；中國 HSR、TYMRT、Alishan、台鐵支線與高捷紅/輕軌等粗略站點座標已用 generated OSM shape 做 1 km 門檻吸附。`TPE-Brown`、`KHH-Orange`、`Busan-Metro-1/2/3/4`、`Beijing-Subway-1`、`Shanghai-Metro-1/2`、`KL-Kelana-Jaya`、`BKK-BTS-Sukhumvit`、`BKK-MRT-Blue`、`HCMC-Metro-1`、`Hanoi-Metro-2A` 已直接採用 OSM relation stop/platform node 對站。
- **本輪高誤差修正**：`JR-Yamanote` 改用 corridor + loop 起點修正，總長由錯誤的約 56 km 回到約 34.3 km；`KHH-LRT` 改為目前站表列出的 13 站區段（約 7.1 km）；`KHH-Orange`、`Shanghai-Metro-1`、`BKK-BTS-Sukhumvit` 以 stop nodes 移除舊端點外伸/拼接外伸造成的偏移；`Busan-Metro-1` 補 `동대신` 投影 override 並採 stop nodes，避免後段站點 km 被推遲。
- **build 時間**：批次 6/7 的中國高鐵與都會地鐵已大幅增加 generated shape 與 snapshot 體量，後續若再擴張需持續監控 `scripts/.cache/` 大小與 build 時間。

## 執行順序

2026-05-09 已依批次 1 → 11 完成 Phase B 形狀回灌與 snapshot 更新；同日完成高誤差複查、OSM stop member 對站、snapshot 二次精修更新。後續只剩可選的官方站點座標 / 官方營業里程交叉校驗，不再需要長期排程或重跑本輪循環。
