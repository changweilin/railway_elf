# 大東亞路網擴張計畫

更新日期：2026-05-07

台灣側已涵蓋 21 條線（TRA 全幹線＋4 條支線、阿里山林鐵、THSR、北捷 5 線、機捷、高捷紅/橘、高雄輕軌、淡海輕軌），`follow-up-plan.md` 已標示「沒有尚未完成的必要項目」。本文件定義整個大東亞區域的擴張批次與每條線的執行步驟。

涵蓋範圍：**日本 / 南韓 / 香港 / 中國 / 新加坡 / 馬來西亞 / 泰國 / 越南**。

## 整體進度

- **Phase A（手寫站表 + 車種）：完成 34/34 條（100%）** — `npm run check:timing` & `npm run test:smoke` & `npm run build` 全通過
- **Phase B（OSM relation 對接）：尚未開始 0/34 條** — 需個別查詢 Overpass relation ID，下一階段執行

## 類型分類

每條線在表格的「類型」欄標示一種主類別，方便後續樣式 / icon / 統計：

| 類型 | 縮寫 | 說明 |
|---|---|---|
| 高速鐵路 | `HSR` | 設計時速 ≥ 250 km/h、跨城市的長距離高鐵（新幹線、KTX、中國高鐵） |
| 通勤鐵路 | `Commuter` | 都市圈跨區的中長距離傳統鐵路（JR 通勤線、東急、MTR 東鐵、KL 通勤） |
| 都會地鐵 | `Metro` | 城市內地鐵 / 捷運，含支線 |
| 環狀線 | `Loop` | 閉環營運的特例（山手、大阪環状、首爾 2 號、北京 2 號、SG Circle） |
| 機場線 | `Airport` | 機場專用直通線 |
| 輕軌 | `LRT` | 輕軌、單軌、低運量系統（目前批次內無，台灣側已涵蓋） |

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
| ☑ A ☐ B | Metro | OSM | `Tokyo-Metro-Ginza` | 東京メトロ銀座線 | 浅草 ⇄ 渋谷 | 14.3 km / 19 站 |
| ☑ A ☐ B | Metro | OSM | `Tokyo-Metro-Marunouchi` | 東京メトロ丸ノ内線 | 池袋 ⇄ 荻窪 | 24.2 km / 25 站 |
| ☑ A ☐ B | Commuter | OSM | `JR-Keihin-Tohoku` | 京浜東北線 | 大宮 ⇄ 大船 | 81.2 km / 46 站 |
| ☑ A ☐ B | Commuter | OSM | `JR-Sobu-Local` | 総武線（各駅停車） | 三鷹 ⇄ 千葉 | 60.2 km / 39 站 |
| ☑ A ☐ B | Commuter | OSM | `Tokyu-Toyoko` | 東急東横線 | 渋谷 ⇄ 横浜 | 24.2 km / 21 站 |

## 批次 2 — 日本：大阪圈（3 條）

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☐ B | Loop | OSM | `JR-Osaka-Loop` | 大阪環状線 | 環狀（錨點：大阪） | 21.7 km / 19 站 + 閉環 |
| ☑ A ☐ B | Metro | OSM | `Osaka-Metro-Midosuji` | 大阪メトロ御堂筋線 | 江坂 ⇄ なかもず | 24.5 km / 20 站 |
| ☑ A ☐ B | Commuter | OSM | `Hankyu-Kobe` | 阪急神戸本線 | 大阪梅田 ⇄ 神戸三宮 | 32.3 km / 16 站 |

## 批次 3 — 日本：跨區新幹線（1 條）

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☐ B | HSR | OSM | `Sanyo-Shinkansen` | 山陽新幹線 | 新大阪 ⇄ 博多 | 553.7 km / 19 站 |

---

## 批次 4 — 南韓：首爾圈 + KTX（4 條）

新增 `korea` region，center 約 `[37.55, 126.99]`，zoom 9。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☐ B | Metro | OSM | `Seoul-Metro-1` | 수도권 전철 1호선 | 광운대 ⇄ 인천（核心 25 站） | 51.8 km |
| ☑ A ☐ B | Loop | OSM | `Seoul-Metro-2` | 서울 지하철 2호선 | 環狀（錨點：시청） | 48.8 km / 43 站 + 閉環 |
| ☑ A ☐ B | HSR | OSM | `KTX-Gyeongbu` | KTX 경부선 | 서울 ⇄ 부산 | 418 km / 10 站 |
| ☑ A ☐ B | Metro | OSM | `Busan-Metro-1` | 부산 도시철도 1호선 | 다대포해수욕장 ⇄ 노포 | 40.5 km / 40 站 |

## 批次 5 — 香港：MTR（4 條）

新增 `hongkong` region，center `[22.37, 114.13]`，zoom 11。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☐ B | Metro | OSM | `MTR-Tsuen-Wan` | 荃灣綫 | 中環 ⇄ 荃灣 | 16.0 km / 16 站 |
| ☑ A ☐ B | Metro | OSM | `MTR-Island` | 港島綫 | 堅尼地城 ⇄ 柴灣 | 16.3 km / 17 站 |
| ☑ A ☐ B | Commuter | OSM | `MTR-East-Rail` | 東鐵綫 | 金鐘 ⇄ 羅湖 | 35.5 km / 14 站 |
| ☑ A ☐ B | Airport | OSM | `MTR-Airport-Express` | 機場快綫 | 香港 ⇄ 博覽館 | 35.3 km / 5 站 |

## 批次 6 — 中國：高鐵主幹線（3 條）

新增 `china` region，center `[35.0, 110.0]`，zoom 5。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☐ B | HSR | OSM | `Beijing-Shanghai-HSR` | 京滬高速鐵路 | 北京南 ⇄ 上海虹橋 | 1318 km / 23 站 |
| ☑ A ☐ B | HSR | OSM | `Beijing-Guangzhou-HSR` | 京廣高速鐵路 | 北京西 ⇄ 廣州南 | 2298 km / 28 站 |
| ☑ A ☐ B | HSR | OSM | `Shanghai-Kunming-HSR` | 滬昆高速鐵路 | 上海虹橋 ⇄ 昆明南 | 2252 km / 26 站 |

## 批次 7 — 中國：北京 / 上海都會地鐵（4 條）

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☐ B | Metro | OSM | `Beijing-Subway-1` | 北京地鐵 1 號線 | 蘋果園 ⇄ 環球度假區 | 47.6 km / 35 站 |
| ☑ A ☐ B | Loop | OSM | `Beijing-Subway-2` | 北京地鐵 2 號線 | 環狀（錨點：西直門） | 23.1 km / 18 站 + 閉環 |
| ☑ A ☐ B | Metro | OSM | `Shanghai-Metro-1` | 上海地鐵 1 號線 | 富錦路 ⇄ 莘莊 | 36.4 km / 28 站 |
| ☑ A ☐ B | Metro | OSM | `Shanghai-Metro-2` | 上海地鐵 2 號線 | 徐涇東 ⇄ 浦東國際機場 | 64.0 km / 30 站 |

## 批次 8 — 新加坡：MRT（3 條）

新增 `singapore` region，center `[1.35, 103.82]`，zoom 11。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☐ B | Metro | OSM | `SG-MRT-North-South` | North-South Line | Jurong East ⇄ Marina South Pier | 45 km / 27 站 |
| ☑ A ☐ B | Metro | OSM | `SG-MRT-East-West` | East-West Line | Pasir Ris ⇄ Tuas Link | 57.2 km / 33 站 |
| ☑ A ☐ B | Metro | OSM | `SG-MRT-Circle` | Circle Line | Dhoby Ghaut ⇄ HarbourFront（horseshoe）| 31.0 km / 28 站 |

## 批次 9 — 馬來西亞：吉隆坡（2 條）

新增 `malaysia` region，center `[3.14, 101.69]`，zoom 11。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☐ B | Metro | OSM | `KL-Kelana-Jaya` | LRT Laluan Kelana Jaya | Putra Heights ⇄ Gombak | 46.4 km / 37 站 |
| ☑ A ☐ B | Metro | OSM | `KL-MRT-Kajang` | MRT Laluan Kajang | Kwasa Damansara ⇄ Kajang | 51.0 km / 29 站 |

## 批次 10 — 泰國：曼谷（3 條）

新增 `thailand` region，center `[13.75, 100.50]`，zoom 11。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☐ B | Metro | OSM | `BKK-BTS-Sukhumvit` | BTS สายสุขุมวิท | Khu Khot ⇄ Kheha | 53.5 km / 47 站 |
| ☑ A ☐ B | Metro | OSM | `BKK-MRT-Blue` | MRT สายสีน้ำเงิน | Tha Phra ⇄ Lak Song | 48.0 km / 38 站 |
| ☑ A ☐ B | Airport | OSM | `BKK-Airport-Rail` | Airport Rail Link | Phaya Thai ⇄ Suvarnabhumi | 28.6 km / 8 站 |

## 批次 11 — 越南：胡志明 / 河內（2 條）

新增 `vietnam` region，center `[16.0, 107.0]`，zoom 6。

| 狀態 | 類型 | 資料源 | id | 線名 | 起終點 | 全長 |
|---|---|---|---|---|---|---|
| ☑ A ☐ B | Metro | OSM | `HCMC-Metro-1` | Tuyến Metro số 1 | Bến Thành ⇄ Suối Tiên | 19.7 km / 14 站 |
| ☑ A ☐ B | Metro | OSM | `Hanoi-Metro-2A` | Tuyến số 2A | Cát Linh ⇄ Yên Nghĩa | 13.0 km / 12 站 |

---

## 分類統計

整個計畫合計 **34 條線**，分布如下：

| 類型 | 條數 | 線名摘要 |
|---|---|---|
| HSR | 5 | 山陽新幹線、KTX 京釜、京滬、京廣、滬昆 |
| Commuter | 4 | JR 京浜東北、JR 総武各停、東急東横、阪急神戸、MTR 東鐵 |
| Metro | 19 | Tokyo Metro 2、Osaka Metro 1、Seoul 2、Busan 1、MTR 2、京滬地鐵 3、SG MRT 2、KL 2、BKK 2、HCMC/Hanoi 2 |
| Loop | 5 | 大阪環状、Seoul 2 號、Beijing 2 號、SG Circle |
| Airport | 2 | MTR 機場快綫、BKK Airport Rail Link |
| LRT | 0 | （台灣側已涵蓋淡海、高雄環狀輕軌） |

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
- **HSR 類**（東海道、山陽、京滬、京廣、滬昆、KTX）：OSM relation 易包含上下行＋折返線，可能需 `corridor` 重建（參考 Tokaido 既有作法）。
- **多 region 切換 UI**：地區數從 2 → 9，要看 `src/app-core.js` 的 region selector 是否仍適合（例如改下拉式或分組）。
- **i18n**：新增日文／韓文／中文簡體／泰文／越南文站名後，要走 `i18n-sync` skill 對齊 zh-TW UI 字串。
- **OSM 缺資料**：部分新興路線（HCMC Metro 1、KL MRT 新延伸）OSM 可能尚未完整，缺資料時 Phase B 可暫緩，Phase A 仍可上線。
- **build 時間**：批次 6/7 的中國高鐵與都會地鐵會大幅增加 OSM 抓取量，要監控 `scripts/.cache/` 大小與 build 時間，必要時把 build 拆批跑。

## 執行順序

依序執行批次 1 → 11。每批做完 Phase A 即可 commit；Phase B 完成（OSM 形狀回灌）後再 commit 一次。中途若遇上游 OSM 資料缺，跳過該條 Phase B、繼續下一批。
