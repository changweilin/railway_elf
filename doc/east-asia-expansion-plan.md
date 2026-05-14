# 大東亞路網擴張計畫

更新日期：2026-05-12

台灣側已涵蓋 21 條線（TRA 全幹線＋4 條支線、阿里山林鐵、THSR、北捷 5 線、機捷、高捷紅/橘、高雄輕軌、淡海輕軌），`follow-up-plan.md` 已標示「沒有尚未完成的必要項目」。本文件定義整個大東亞區域的擴張批次與每條線的執行步驟。

現行完成批次涵蓋範圍：**日本 / 南韓 / 香港 / 中國 / 新加坡 / 馬來西亞 / 泰國 / 越南**。新增 backlog 另列 **印尼 / 菲律賓 / 南亞 / 西亞** 作為泰國與新馬之後的候選池。

## 整體進度

- **Phase A（手寫站表 + 車種）：完成 34/34 條（100%）** — `npm run check:timing` & `npm run test:smoke` & `npm run build` 全通過
- **Phase B（OSM relation 對接）：34/34 條完成（100%）** — 批次 1–11 已補 OSM relation 並回灌真實軌道形狀；本輪沒有保留 0 km fallback。2026-05-11 加入日本 / 南韓 backlog seeds 後，103 條線 runtime maxOffset 全部壓到 1.0 km 內。
- **完整覆蓋 backlog（日本 / 南韓）：已建立規劃事項** — 覆蓋尚未加入的鐵道類型與候選線群；此區塊是後續大型擴張，不列入已完成的 34 條 Phase A/B 統計。
- **亞洲其他區域 backlog（泰國 / 新馬優先）：已建立規劃事項** — 下一輪優先順序調整為泰國曼谷補完 → 新加坡 / 馬來西亞補完與新馬跨境監控 → 印尼 / 菲律賓 / 越南補完；未營運或跨境 CIQ 複雜項目先交 5.5 判定，再下放 5.3。
- **Backlog seed（日本 HSR）：Nishi Kyushu Shinkansen 已完成代表線** — `Nishi-Kyushu-Shinkansen` 已補 5 站手寫站表、`かもめ` train template、OSM relation `7356208` corridor + stop nodes、line-aware `かもめ` train icon；列車圖示先檢查日本既有新幹線圖示，確認無同國同型號 / 同塗裝 `かもめ` PNG 可沿用後才新增 `japan-nishi-kyushu-shinkansen-kamome.png`。
- **Backlog seed（日本 Airport / Monorail）：Tokyo Monorail 已完成代表線** — `Tokyo-Monorail` 已補 11 站手寫站表、普通 train template、OSM relation `3417174`、line-aware monorail train icon；列車圖示先檢查日本既有圖示，確認無同國同型號 monorail PNG 可沿用後才新增 `japan-tokyo-monorail-local.png`。
- **Backlog seed（日本 Tram / LRT）：Utsunomiya Lightline 已完成代表線** — `Utsunomiya-Lightline` 已補 19 站手寫站表、`ライトライン` train template、OSM route relation `12419659`、line-aware LRT train icon；列車圖示先檢查日本既有低床 LRT / tram 圖示，確認無同國同型號 Lightline / HU300 PNG 可沿用後才新增 `japan-utsunomiya-lightline-lightline.png`。
- **Backlog seed（南韓 HSR / Airport / LRT-AGT / Monorail）：SRT Gyeongbu / Honam / Jeolla / Gyeongjeon / Donghae、KTX Honam / Jeolla / Gyeongjeon / Gangneung / Donghae / Jungang / Jungbu Naeryuk、AREX、Gimpo Goldline、Incheon Metro Line 2、Ui LRT、Sillim Line、Uijeongbu U Line、Yongin EverLine、Busan-Gimhae LRT 與 Daegu Metro Line 3 已完成代表線** — `SRT-Gyeongbu` 已補手寫站表、SRT train template、OSM relation `6096884` + `6094351` corridor、line-aware SRT badge train icon；`SRT-Honam` 已補手寫站表、SRT train template、OSM relation `6096884` + `6094351` + `6095809` + `6094787` corridor，並沿用同國同型號 SRT train icon；`SRT-Jeolla` 已補手寫站表、SRT train template、OSM relation `6096884` + `6094351` + `6095809` + `6096342` corridor，並沿用同國同型號 SRT train icon；`SRT-Gyeongjeon` 已補手寫站表、SRT train template、OSM relation `6096884` + `6094351` + `8842494` + `8839114` corridor，並沿用同國同型號 SRT train icon；`SRT-Donghae` 已補手寫站表、SRT train template、OSM relation `6096884` + `6094351` + `8840839` + `8835676` corridor，並沿用同國同型號 SRT train icon；`KTX-Honam` 已補手寫站表、KTX / KTX-산천 train templates、OSM relation `11214334` + `6095809` + `6094787` corridor，並先檢查同國同型號後沿用既有 KTX / KTX-산천 PNG；`KTX-Jeolla` 已補手寫站表、KTX / KTX-산천 train templates、OSM relation `11214334` + `6095809` + `6096342` corridor，並先檢查同國同型號後沿用既有 KTX / KTX-산천 PNG；`KTX-Gyeongjeon` 已補手寫站表、KTX / KTX-산천 train templates、OSM relation `11214334` + `8839114` corridor，並先檢查同國同型號後沿用既有 KTX / KTX-산천 PNG；`KTX-Gangneung` 已補手寫站表、KTX-이음 train template、OSM relation `8842494` + `8817574` + `8821065` + `8825878` corridor，並先檢查同國同型號後新增 KTX-이음 PNG；`KTX-Donghae` 已補手寫站表、KTX / KTX-산천 train templates、OSM relation `11214334` + `8840839` + `8835676` corridor，並先檢查同國同型號後沿用既有 KTX / KTX-산천 PNG；`KTX-Jungang` 已補手寫站表、KTX-이음 train template、OSM relation `8842494` + `8817574` + `8821065` + `8880536` + `8880709` + `8835676` + `8879475` corridor，並先檢查同國同型號後沿用既有 KTX-이음 PNG；`KTX-Jungbu-Naeryuk` 已補手寫站表、KTX-이음 train template、OSM relation `8824194` + `12351758` corridor，並先檢查同國同型號後沿用既有 KTX-이음 PNG；`AREX` 已補手寫站表、all-stop train template、OSM relation `7919000`、line-aware train icon；`Gimpo-Goldline` 已補 light metro 站表、all-stop train template、OSM relation `10092720`、line-aware train icon；`Incheon-Metro-2` 已補 driverless light metro 27 站表、2호선 train template、OSM relation `7527496`、line-aware train icon；`Uijeongbu-LRT` 已補 16 站手寫站表、U Line train template、OSM relation `13738410`、line-aware train icon；`Yongin-EverLine` 已補 15 站手寫站表、EverLine train template、OSM relation `6064093`、line-aware train icon；`Busan-Gimhae-LRT` 已補 21 站手寫站表、BGL train template、OSM relation `2204611`、line-aware train icon；`Daegu-Metro-3` 已補單軌站表、all-stop train template、OSM relation `7685727`、line-aware monorail train icon；可作為後續高速鐵道、機場線、低運量自動化線與單軌線的 SOP 範例。
- **Backlog seed（南韓 LRT-AGT 補充）：Ui LRT、Sillim Line、Uijeongbu U Line、Yongin EverLine 與 Busan-Gimhae LRT 已完成代表線** — `Ui-LRT` 已補手寫站表、우이신설선 train template、OSM relation `7533582`、line-aware Ui-Sinseol train icon；列車圖示先檢查同國既有 Gimpo Goldline / Incheon 2，因 Hyundai Rotem UL000 與 연둣빛塗裝不同而新增 PNG。`Sillim-LRT` 已補 11 站手寫站表、신림선 train template、OSM relation `14191877`、line-aware Sillim train icon；列車圖示先檢查同國既有 Gimpo Goldline / Incheon 2 / Ui LRT，因 Woojin SL000 / K-AGT 與 파란색塗裝不同而新增 PNG。`Uijeongbu-LRT` 已補 16 站手寫站表、U Line train template、OSM relation `13738410`、line-aware Uijeongbu train icon；列車圖示先檢查同國既有 Gimpo Goldline / Incheon 2 / Ui LRT / Sillim，因 VAL 208 / U Line 橘色塗裝不同而新增 PNG。`Yongin-EverLine` 已補 15 站手寫站表、EverLine train template、OSM relation `6064093`、line-aware Yongin EverLine train icon；列車圖示先檢查同國 LRT/AGT 既有圖示，因 Bombardier Innovia ART / EverLine 綠色塗裝不同而新增 PNG。`Busan-Gimhae-LRT` 已補 21 站手寫站表、BGL train template、OSM relation `2204611`、line-aware Busan-Gimhae LRT train icon；列車圖示先檢查同國 LRT/AGT 既有圖示，因 BGL 紫色塗裝與既有圖示不同而新增 PNG。
- **Backlog seed（南韓 Intercity）：ITX-Cheongchun 已完成代表線** — `ITX-Cheongchun` 已補手寫站表、ITX-청춘 train template、OSM relation `8817574` + `8821065` + `8817669` corridor；列車圖示先檢查同國同型號，因目前無 ITX-청춘 PNG 而新增 line-aware ITX-청춘 圖示。可作為後續 ITX / Saemaeul / Mugunghwa / Nuriro 等一般優等列車的 SOP 範例。
- **Backlog seed（南韓 Commuter / Metro）：Seoul Metropolitan Subway Line 3 / 4 / 5 / 6 / 7 / 8 / 9、Shinbundang、Suin-Bundang、Gyeongui-Jungang 與 Gyeongchun 已完成代表線** — `Seoul-Metro-3` 已補手寫站表、3호선 train template、OSM relation `443803` + `4729445` corridor；列車圖示先檢查同國同型號，確認既有 `Daegu-Metro-3|3호선` 是單軌不同型號後新增 line-aware 首都圈 3 號線 metro 圖示。`Seoul-Metro-4` 已補 51 站手寫站表、4호선 train template、OSM relation `13675921` + `2718884` + `4744311` corridor；列車圖示先檢查同國同型號，因目前無 `4호선` PNG 而新增 line-aware 首都圈 4 號線 metro 圖示。`Seoul-Metro-5` 已補 49 站手寫站表（방화 ⇄ 하남검단산 主線）、5호선 train template、OSM relation `12497486`；列車圖示先檢查同國同型號，因目前無 `5호선` PNG 而新增 line-aware 首都圈 5 號線 metro 圖示，마천 branch 留後續 branch-aware pass。`Seoul-Metro-6` 已補 40 個停站事件 / 39 unique stations（응암순환 ⇄ 신내）、6호선 train template、OSM relation `12080315`，並用 `stationKmsByIndex` 保留 응암 one-way loop 的重複站名；列車圖示先檢查同國同型號，因目前無 `6호선` PNG 而新增 line-aware 首都圈 6 號線 metro 圖示。`Seoul-Metro-7` 已補 53 站手寫站表（장암 ⇄ 석남）、7호선 train template、OSM relation `12746493`；列車圖示先檢查同國同型號，因目前無 `7호선` PNG 而新增 line-aware 首都圈 7 號線 metro 圖示。`Seoul-Metro-8` 已補 24 站手寫站表（별내 ⇄ 모란）、8호선 train template、OSM relation `2718901`；列車圖示先檢查同國同型號，因目前無 `8호선` PNG 而新增 line-aware 首都圈 8 號線 metro 圖示。`Seoul-Metro-9` 已補 38 站手寫站表（개화 ⇄ 중앙보훈병원）、9호선 train template、OSM relation `2718888`；列車圖示先檢查同國同型號，因目前無 `9호선` PNG 而新增 line-aware 首都圈 9 號線 metro 圖示；relation stop members 少 `동작`，shape mapping 不使用 `stationStops`，急行 skip-stop 留後續 template 支援後再補。`Shinbundang` 已補 16 站手寫站表（신사 ⇄ 광교）、신분당선 train template、OSM route_master `7728256` / relation `6060963`；列車圖示先檢查同國同型號，因目前無 `신분당선` PNG 而新增 line-aware Shinbundang metro 圖示。`Suin-Bundang` 已補 63 站手寫站表（청량리 ⇄ 인천）、수인분당선 train template、OSM route_master `11619514` / relation `11625556`；列車圖示先檢查同國同型號，因目前無 `수인분당선` PNG 而新增 line-aware Suin-Bundang commuter 圖示。`Gyeongui-Jungang` 已補 52 站手寫站表（문산 ⇄ 용문 主線）、경의중앙선 train template、OSM route_master `8667957` / relation `5993212`；列車圖示先檢查同國同型號，因目前無 `경의중앙선` PNG 而新增 line-aware Gyeongui-Jungang commuter 圖示。서울역 / 임진강 / 도라산 / 지평 服務留後續 branch/short-turn 支援。`Gyeongchun` 已補 24 站手寫站表（청량리 ⇄ 춘천 主線）、경춘선 train template、OSM route_master `8656365` / relation `8656357`；列車圖示先檢查同國同型號，因目前無 `경춘선` PNG 而新增 line-aware Gyeongchun commuter 圖示。상봉 / 광운대 variants 留後續 branch/short-turn 支援。可作為後續首都圈地鐵與廣域電鐵的 SOP 範例。
- **Backlog seed（南韓 Commuter / Metro）：Gyeonggang、Seohae 與 Incheon Metro 1 已完成代表線** — `Gyeonggang` 已補 12 站手寫站表（판교 ⇄ 여주 主線，含 2024-03-30 開通的 `성남`）、경강선 train template、OSM route_master `8735483` / relation `6462562`；relation `6462562` 的 stop members 尚缺 `성남`，因此 shape mapping 不使用 `stationStops`，改以手寫站點投影。列車圖示先檢查同國同型號，因目前無 `경강선` / Class 371000 對應 PNG 而新增 line-aware Gyeonggang commuter 圖示。`Seohae` 已補 21 站手寫站表（일산 ⇄ 원시 all-stop）、서해선 train template、OSM route_master `8725316` / relation `16244688`；relation `16244688` stop members 可完整對齊 21 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，因目前無 `서해선` / Class 391000 對應 PNG 而新增 line-aware Seohae commuter 圖示。`Incheon-Metro-1` 已補 33 站手寫站表（송도달빛축제공원 ⇄ 검단호수공원，含 2025-06-28 검단 extension）、1호선 train template、OSM route_master `7854149` / relation `19425646`；relation `19425646` stop members 可完整對齊 33 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Seoul/Busan 既有 `1호선` 為不同車型/塗裝後新增 line-aware Incheon Metro 1 圖示。대곡 short-turn、Seohae 未來 남쪽延伸與 Incheon 1 後續支線/延伸留後續 branch/extension 支援。
- **Backlog seed（南韓非首都圈 Metro）：Busan Metro Lines 2/3/4、Daegu Metro Lines 1/2、Daejeon Metro Line 1 與 Gwangju Metro Line 1 已完成代表線擴充** — `Busan-Metro-2` 已補 43 站手寫站表（장산 ⇄ 양산）、2호선 train template、OSM route_master `8258658` / relation `2194999`；relation `2194999` stop members 可完整對齊 43 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認既有 Busan 1 與 Incheon 2 圖示皆為不同車型/塗裝後新增 line-aware 釜山 2 號線 metro 圖示。`Busan-Metro-3` 已補 17 站手寫站表（수영 ⇄ 대저）、3호선 train template、OSM route_master `8247017` / relation `2195014`；relation `2195014` stop members 可完整對齊 17 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Seoul 3 與 Daegu 3 為不同車型/系統後新增 line-aware 釜山 3 號線 metro 圖示。`Busan-Metro-4` 已補 14 站手寫站表（미남 ⇄ 안평）、4호선 train template、OSM route_master `8258702` / relation `2205952`；relation `2205952` stop members 可完整對齊 14 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Seoul 4 為不同車型/塗裝後新增 line-aware 釜山 4 號線 rubber-tyred light metro 圖示。`Daegu-Metro-1` 已補 35 站手寫站表（설화명곡 ⇄ 하양，含 2024 하양 extension）、1호선 train template、OSM route_master `7845971` / relation `7685464`；relation `7685464` stop members 可完整對齊 35 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Seoul/Busan/Incheon 既有 `1호선` 與 Daegu 3 單軌圖示皆非同型號/塗裝後新增 line-aware Daegu Metro 1 圖示。`Daegu-Metro-2` 已補 29 站手寫站表（문양 ⇄ 영남대）、2호선 train template、OSM route_master `7845969` / relation `7685783`；relation `7685783` stop members 可完整對齊 29 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Busan/Incheon 既有 `2호선` 與 Daegu 1/3 圖示皆非同車型/塗裝後新增 line-aware Daegu Metro 2 圖示。`Daejeon-Metro-1` 已補 22 站手寫站表（판암 ⇄ 반석）、1호선 train template、OSM route_master `7792528` / relation `7792527`；relation `7792527` stop members 可完整對齊 22 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Seoul/Busan/Incheon/Daegu 既有 `1호선` 皆非同車型/塗裝後新增 line-aware Daejeon Metro 1 圖示。`Gwangju-Metro-1` 已補 20 站手寫站表（녹동 ⇄ 평동）、1호선 train template、OSM route_master `13538911` / relation `13463725`；relation `13463725` stop members 可完整對齊 20 站，因此 shape mapping 使用 `stationStops`。列車圖示先檢查同國同型號，確認 Seoul/Busan/Incheon/Daegu/Daejeon 既有 `1호선` 皆非同車型/塗裝後新增 line-aware Gwangju Metro 1 圖示。

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
| ☑ A ☑ B | LRT | OSM | `Ui-LRT` | 서울 경전철 우이신설선 | 북한산우이 ⇄ 신설동 | 11.2 km / 13 站 |
| ☑ A ☑ B | LRT | OSM | `Sillim-LRT` | 서울 경전철 신림선 | 샛강 ⇄ 관악산 | 7.8 km / 11 站 |
| ☑ A ☑ B | LRT | OSM | `Uijeongbu-LRT` | 의정부경전철 | 발곡 ⇄ 차량기지임시승강장 | 11.3 km / 16 站 |
| ☑ A ☑ B | LRT | OSM | `Yongin-EverLine` | 용인 에버라인 | 기흥 ⇄ 전대·에버랜드 | 18.0 km / 15 站 |
| ☑ A ☑ B | LRT | OSM | `Busan-Gimhae-LRT` | 부산김해경전철 | 사상 ⇄ 가야대 | 23.2 km / 21 站 |
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
| ☑ A ☑ B | Metro | OSM | `Daegu-Metro-1` | 대구 도시철도 1호선 | 설화명곡 ⇄ 하양 | 37.5 km / 35 站 |
| ☑ A ☑ B | Metro | OSM | `Daegu-Metro-2` | 대구 도시철도 2호선 | 문양 ⇄ 영남대 | 31.5 km / 29 站 |
| ☑ A ☑ B | Metro | OSM | `Daejeon-Metro-1` | 대전 도시철도 1호선 | 판암 ⇄ 반석 | 20.7 km / 22 站 |
| ☑ A ☑ B | Metro | OSM | `Gwangju-Metro-1` | 광주 도시철도 1호선 | 녹동 ⇄ 평동 | 20.6 km / 20 站 |

---

## 日本 / 南韓完整覆蓋 backlog（新增規劃事項）

此區塊補上「目前尚未加入，但屬於日本 / 南韓鐵道系統的主要類型」。它不是一次要全做完的線路清單，而是後續拆批次時的覆蓋範圍表；實作時每一列再依城市、營運者、資料品質與 icon 需求拆成小批次。

參考分類依據：

- 日本：JNTO 的 [Traveling by Rail](https://www.japan.travel/en/guide/traveling-by-rail/) 將日本鐵道概括為 JR、新幹線、民鐵、地下鐵與觀光列車；MLIT 的 [鉄道統計年報](https://www.mlit.go.jp/tetudo/tetudo_tk6_000032.html) 涵蓋鐵道、軌道、索道事業，MLIT 中部運輸局的 [主な鉄道用語](https://wwwtb.mlit.go.jp/chubu/tetsudou/yougo.html) 也明列普通鐵道、單軌、新交通、鋼索、磁浮與索道等；MLIT [軌道法（路面電車等）](https://www.mlit.go.jp/road/sisaku/lrt/lrt_index.html) 作為 Tram / LRT 規劃依據。
- 南韓：KORAIL 官方 [Train Information](https://info.korail.com/infoeng/index.do) 分為 High-Speed Train、General train、Metro Train；都市鐵道另有地鐵、輕量捷運與單軌系統。

### 日本：未加入類型與候選線群

目前已加入日本代表線：東海道 / 山陽新幹線、山手、中央快速、京浜東北、総武各停、東急東横、阪急神戸、大阪環状、御堂筋、銀座、丸ノ内、東京モノレール。下表列出尚未完整納入的類型：

| 狀態 | 類型 | 規劃範圍 | 候選線群 / 例子 | 資料源 | 備註 |
|---|---|---|---|---|---|
| ◐ seed | HSR / Maglev | 其餘新幹線、迷你新幹線、未來高速磁浮 | 西九州（☑ A ☑ B）、東北、北海道、上越、北陸、九州、秋田、山形；中央新幹線待營運後評估 | OSM + 官方站距 | Nishi Kyushu 已作為日本 HSR backlog seed；HSR relation 常含上下行、側線、車庫，優先套 `corridor` 重建 |
| □ backlog | Intercity | JR 在來線幹線與特急型服務 | 常磐、東北本線 / 宇都宮、高崎、総武快速 / 横須賀、紀勢、山陰、予讃、日豊、鹿児島本線等 | OSM + JR 公開站表 | 先以幹線段落切批，不一次塞全 JR 網 |
| □ backlog | Commuter | JR 都會圈未覆蓋路線 | 埼京、湘南新宿、京葉、武蔵野、南武、横浜、関西本線 / 大和路、JR 京都 / 神戸 / 宝塚 / 阪和、名古屋 / 札幌 / 仙台圈 | OSM | 與既有山手 / 中央 / 京浜東北互相重疊，需避免重複 snap 干擾 |
| □ backlog | Commuter / Intercity | 大手民鐵與準大手民鐵 | 東武、西武、京王、小田急、京成、京急、相鉄、近鉄、京阪、阪神、南海、名鉄、西鉄；補齊東急 / 阪急其他主線 | OSM + 民鐵站表 | 可先做機場、觀光地、都心放射線 |
| □ backlog | Metro | 地下鐵 / 市營地鐵其餘系統 | Tokyo Metro 其餘線、都営地下鉄、横浜、名古屋、京都、神戸、福岡、札幌、仙台 | OSM | 同城市多線時要先確認 region selector 與 marker density |
| ◐ seed | Airport | 機場聯絡鐵道 | 東京モノレール（☑ A ☑ B）、成田 Express、京成 Skyliner / Access、京急空港線、南海空港線、JR 関西空港線、名鉄空港線、福岡空港線 | OSM | Tokyo Monorail 已作為日本機場聯絡 / 單軌 seed；空港快速 / 区間快速待 skip-stop template 支援後再補 |
| ◐ seed | Tram / LRT | 路面電車與新世代 LRT | 宇都宮ライトレール（☑ A ☑ B）、広島、長崎、熊本、鹿児島、富山、都電荒川、東急世田谷、札幌、函館、岡山、松山、高知、福井、豊橋等 | OSM + MLIT 軌道資料 | Utsunomiya Lightline 已作為日本 Tram / LRT seed；後續新增低床 LRV 先檢查同國同型號圖示再沿用，沒有才生成 |
| ◐ seed | Monorail / AGT / Maglev | 都市單軌、新交通、都市磁浮 | 東京モノレール（☑ A ☑ B）、大阪モノレール、多摩、千葉、湘南、沖縄ゆいレール；ゆりかもめ、日暮里・舎人、ポートライナー、六甲ライナー、ニュートラム；リニモ | OSM | Tokyo Monorail 已驗證 `Monorail` category、monorail icon 與 relation stop 對站；後續同國同型號先沿用，無可沿用才生成 |
| □ backlog | Regional | 第三部門 / 地方鐵道 | IGR / 青い森、三陸、しなの、えちごトキめき、あいの風とやま、IR いしかわ、肥薩おれんじ、各地方私鐵 | OSM + 地方站表 | 站距與班距差異大，適合按地區慢慢補 |
| □ backlog | Heritage | 觀光 / 保存 / 登山 / 鋼索鐵道 | 箱根登山、黒部峡谷、嵯峨野観光、大井川、叡山、江ノ電；高野山ケーブル、生駒ケーブル等 | OSM + 營運者資料 | 若班距稀疏或季節性強，需加季節/休駛提示 |
| □ backlog | Freight | 貨運主幹與臨港線 | JR Freight 主要貨物走廊、港灣 / 工業支線 | OSM + 貨運資料 | 與「下一班客車」核心不同，除非新增 freight layer，保持低優先 |

### 南韓：未加入類型與候選線群

目前已加入南韓代表線：수도권 전철 1호선、서울 지하철 2호선、수도권 전철 3호선、수도권 전철 4호선、수도권 전철 5호선、서울 지하철 6호선、서울 지하철 7호선、서울 지하철 8호선、서울 지하철 9호선、수도권 전철 신분당선、수도권 전철 수인·분당선、수도권 전철 경의·중앙선、수도권 전철 경춘선、수도권 전철 경강선、수도권 전철 서해선、인천 도시철도 1호선、인천 도시철도 2호선、서울 경전철 우이신설선、서울 경전철 신림선、의정부경전철、용인 에버라인、부산김해경전철、KTX 경부선、KTX 호남선、KTX 전라선、KTX 경전선、KTX 강릉선、KTX 동해선、KTX 중앙선、KTX 중부내륙선、SRT 경부선、SRT 호남선、SRT 전라선、SRT 경전선、SRT 동해선、ITX-청춘、AREX、Gimpo Goldline、대구 도시철도 1호선、대구 도시철도 2호선、Daegu Metro Line 3、부산 도시철도 1호선、부산 도시철도 2호선、부산 도시철도 3호선、부산 도시철도 4호선、대전 도시철도 1호선、광주 도시철도 1호선。下表列出尚未完整納入的類型：

| 狀態 | 類型 | 規劃範圍 | 候選線群 / 例子 | 資料源 | 備註 |
|---|---|---|---|---|---|
| ◐ seed | HSR | KTX / SRT 其餘高速服務與走廊 | SRT 경부선（☑ A ☑ B）、SRT 호남선（☑ A ☑ B）、SRT 전라선（☑ A ☑ B）、SRT 경전선（☑ A ☑ B）、SRT 동해선（☑ A ☑ B）、KTX 호남선（☑ A ☑ B）、KTX 전라선（☑ A ☑ B）、KTX 경전선（☑ A ☑ B）、KTX 강릉선（☑ A ☑ B）、KTX 동해선（☑ A ☑ B）、KTX 중앙선（☑ A ☑ B）、KTX 중부내륙선（☑ A ☑ B）；其他 KTX branches 待後續 | OSM + KORAIL / SR 站表 | SRT Gyeongbu / Honam / Jeolla / Gyeongjeon / Donghae 與 KTX Honam / Jeolla / Gyeongjeon / Gangneung / Donghae / Jungang / Jungbu Naeryuk 已完成 HSR seed；新增高速線先檢查同國同型號圖示再沿用，沒有才生成 |
| ◐ seed | Intercity | 一般列車與優等在來線 | ITX-청춘（☑ A ☑ B）；ITX-새마을、ITX-마음、누리로、무궁화호；京釜、湖南、中央、太白、嶺東、京春等 | OSM + KORAIL | ITX-청춘 已作為首條 Intercity seed；後續一般列車先補固定停站、班距穩定的主幹 |
| ◐ seed | Commuter / Metro | 首都圈廣域電鐵與地鐵未覆蓋線 | Seoul Metro 3（☑ A ☑ B）、Seoul Metro 4（☑ A ☑ B）、Seoul Metro 5（☑ A ☑ B）、Seoul Metro 6（☑ A ☑ B）、Seoul Metro 7（☑ A ☑ B）、Seoul Metro 8（☑ A ☑ B）、Seoul Metro 9（☑ A ☑ B）、Shinbundang（☑ A ☑ B）、Suin-Bundang（☑ A ☑ B）、Gyeongui-Jungang（☑ A ☑ B）、Gyeongchun（☑ A ☑ B）、Gyeonggang（☑ A ☑ B）、Seohae（☑ A ☑ B）、Incheon 1（☑ A ☑ B）等 | OSM + operator data | Seoul Metro 3 / 4 / 5 / 6 / 7 / 8 / 9、Shinbundang、Suin-Bundang、Gyeongui-Jungang、Gyeongchun、Gyeonggang、Seohae 與 Incheon 1 已作為首都圈地鐵 / 廣域電鐵 seeds；多線共線與直通複雜，需逐線確認 `directions` 與停站型；Line 9 急行、Gyeongui-Jungang 支線/短折、Gyeongchun 상봉 / 광운대 variants、Gyeonggang 부발 short-turn 與 Seohae 대곡 short-turn 待 skip-stop 或 branch/short-turn template 支援 |
| ◐ seed | Metro | 非首都圈都市地鐵 | Busan 2（☑ A ☑ B）、Busan 3（☑ A ☑ B）、Busan 4（☑ A ☑ B）、Daegu 1（☑ A ☑ B）、Daegu 2（☑ A ☑ B）、Daejeon 1（☑ A ☑ B）、Gwangju 1（☑ A ☑ B） | OSM | Busan 2/3/4 已與既有 Busan 1 組成釜山城市捷運 seed，Daegu 1/2、Daejeon 1 與 Gwangju 1 已補入非首都圈城市捷運 seed；後續同樣先檢查同國同型號列車圖示，無可沿用時才生成 |
| ◐ seed | Airport | 機場聯絡鐵道 | AREX 일반（☑ A ☑ B）；AREX 직통 與金海機場相關城市鐵道銜接待後續 | OSM | AREX all-stop 已作為南韓機場線代表線；直通列車需等 skip-stop template 支援後再建 |
| ◐ seed | LRT / AGT | 輕量捷運與無人自動運轉線 | Gimpo Goldline（☑ A ☑ B）、Incheon 2（☑ A ☑ B）、Ui LRT（☑ A ☑ B）、Sillim Line（☑ A ☑ B）、Uijeongbu U Line（☑ A ☑ B）、Yongin EverLine（☑ A ☑ B）、Busan-Gimhae LRT（☑ A ☑ B） | OSM + operator data | Gimpo Goldline、Incheon 2、Ui LRT、Sillim Line、Uijeongbu U Line、Yongin EverLine 與 Busan-Gimhae LRT 已作為 low-capacity / driverless seeds；Busan-Gimhae 圖示先檢查 Gimpo / Incheon / Ui / Sillim / Uijeongbu / Yongin 既有 LRT/AGT，但 BGL 紫色塗裝不同而新增 line-aware 圖示；後續可沿用或擴充此圖示風格 |
| ◐ seed | Monorail | 都市單軌 | Daegu Line 3（☑ A ☑ B）；觀光型單軌另案評估 | OSM + Daegu operator data | 大邱 3 號線已作為韓國單軌代表線；後續可沿用 monorail 圖示風格 |
| □ backlog | Tram | 現代路面電車 / tram 計畫 | Daejeon Line 2 等營運後納入；既有未營運計畫先不建資料 | OSM + 市府資料 | 未開業線只列規劃，不進 `RAIL_DATA` |
| □ backlog | Regional | 地方支線與區域鐵路 | 東海、慶北、慶全、湖南支線、旌善等地方線 | OSM + KORAIL | 先排客運仍穩定營運者 |
| □ backlog | Heritage | 觀光列車 / 保存鐵道 / railbike | O / V / S-train 類觀光服務、地方觀光鐵道與 railbike | OSM + 營運者資料 | 多為季節性或預約制，班距模型需特例 |
| □ backlog | Freight | 貨運與工業線 | KORAIL 貨運走廊、港灣 / 產業線 | OSM + 貨運資料 | 低優先，除非新增非客運圖層 |

Backlog 執行原則：

1. 每個新類型先做一條「代表線」驗證 icon、速度 profile、站距投影與 snap 行為，再擴成整個城市或營運者。
2. 日本優先順序建議：剩餘新幹線（西九州已 seed）→ 機場線 → 東京 / 大阪地下鐵補齊 → 大手民鐵 → Tram / Monorail / AGT → Regional / Heritage。
3. 南韓優先順序建議：SRT / KTX 其餘走廊 → 首都圈廣域線 → Busan / Daegu / Daejeon / Gwangju → Intercity / LRT / Monorail → Regional / Heritage；SRT Gyeongbu / Honam / Jeolla / Gyeongjeon / Donghae 與 KTX Honam / Jeolla / Gyeongjeon / Gangneung / Donghae / Jungang / Jungbu Naeryuk 已完成 HSR backlog seeds，ITX-Cheongchun 已完成首條 Intercity seed，Seoul-Metro-3 / Seoul-Metro-4 / Seoul-Metro-5 / Seoul-Metro-6 / Seoul-Metro-7 / Seoul-Metro-8 / Seoul-Metro-9 / Shinbundang / Suin-Bundang / Gyeongui-Jungang / Gyeongchun / Gyeonggang / Seohae / Incheon-Metro-1 / Busan-Metro-2 / Busan-Metro-3 / Busan-Metro-4 / Daegu-Metro-1 / Daegu-Metro-2 / Daejeon-Metro-1 / Gwangju-Metro-1 已完成 Commuter / Metro seeds，AREX all-stop 已完成首條 Airport seed，Gimpo Goldline / Incheon-Metro-2 / Ui-LRT / Sillim-LRT / Uijeongbu-LRT / Yongin-EverLine / Busan-Gimhae-LRT 已完成 LRT/AGT seeds，Daegu Metro Line 3 已完成首條 Monorail seed。
4. Freight、鋼索、季節性觀光線若沒有穩定 passenger pass prediction 模型，先做地圖圖層規劃，不阻塞客運功能。

## 亞洲其他區域完整覆蓋 backlog（泰國 / 新馬優先）

此區塊補上日本 / 南韓以外的下一輪路線池。優先順序依本輪決策固定為 **泰國曼谷補完 → 新加坡 / 馬來西亞補完與新馬跨境監控 → 印尼 / 菲律賓 / 越南補完**。這些項目不改寫既有 34 條 Phase A/B 完成率；每輪仍以 1 條 seed 完成 A+B、icon、timing、shape 與 smoke 驗證為單位。

資料確認依據：

- 新加坡：LTA Rail Network 現行 6 條 MRT 與 2 組 LRT，並列 North East / Downtown / Thomson-East Coast / Bukit Panjang LRT / Sengkang-Punggol LRT。
- 泰國：MRTA Yellow / Pink / Blue / Purple、BTS Sukhumvit / Silom / Gold、SRTET Red Line 官方頁面；Orange 等未全線營運者先列監控。
- 馬來西亞 / 新馬：MyRapid LRT / MRT / Monorail、KTMB Komuter / ETS / Intercity、LTA JB-Singapore RTS Link；RTS Link 目標 2026 年底載客服務，營運前不進 5.3 實作。

### P0：泰國曼谷補完（下一輪首選）

| 優先 | 狀態 | 類型 | id | 線名 | 起終點 / 範圍 | 5.3 責任 | 5.5 責任 |
|---|---|---|---|---|---|---|---|
| P0-TH-1 | ☑ A ☑ B | Metro | `BKK-BTS-Silom` | BTS สายสีลม | National Stadium ⇄ Bang Wa | 已補站表、BTS train template、OSM relation、沿用 BTS 綠線圖示；本輪修正 route relation 與 stop-node 座標 | 無阻塞；若未來與 Sukhumvit 共用圖示策略改變，另開 icon pass |
| P0-TH-2 | ☑ A ☑ B | Metro | `BKK-MRT-Purple` | MRT สายสีม่วง | Khlong Bang Phai ⇄ Tao Poon | 已補站表、MRT heavy-rail template、OSM relation、BEM purple icon；本輪修正 route relation 與 stop-node 座標 | 無阻塞；若與未來南延伸合併，另開 extension pass |
| P0-TH-3 | ☑ A ☑ B | Monorail / AGT | `BKK-MRT-Yellow` | MRT สายสีเหลือง | Lat Phrao ⇄ Samrong（30.4 km / 23 站） | 已補站表、`Monorail` template、OSM relation `15806897`、Yellow Line monorail icon、Thailand generated shape | 無阻塞；若未來與 Pink Line 共用 monorail 圖示策略改變，另開 icon pass |
| P0-TH-4 | ☑ A ☑ B | Monorail / AGT | `BKK-MRT-Pink` | MRT สายสีชมพู | Nonthaburi Civic Center ⇄ Min Buri（34.5 km / 30 站） | 已補主線站表、`Monorail` template、OSM relation `16740886`、Pink Line monorail icon、Thailand generated shape | 主線完成；Muang Thong Thani branch gate 已放行為獨立 3-station branch seed，不併入主線或 branch graph |
| P0-TH-5 | ☑ A ☑ B | Commuter | `BKK-SRT-Dark-Red` | SRT Dark Red Line | Krung Thep Aphiwat ⇄ Rangsit / Don Mueang corridor | 已補站表、`Commuter` template、OSM relation `13058384`、SRT Red commuter icon、Thailand generated shape | Dark Red 完成；Light Red 仍保留為獨立 future seed，不合併成單一 branch graph |
| P0-TH-6 | ☑ A ☑ B | Commuter | `BKK-SRT-Light-Red` | SRT Light Red Line | Krung Thep Aphiwat ⇄ Taling Chan / west corridor | 已補 current 4-station segment、`LR` commuter template、OSM relation `13178788`、Light Red commuter icon、Thailand generated shape；shape maxOffset 0.004 km | Salaya / Siriraj extensions 維持 monitor；Dark / Light Red 不合併成 branch graph |
| P0-TH-7 | □ optional seed | AGT | `BKK-BTS-Gold` | BTS Gold Line | Krung Thon Buri ⇄ Khlong San | 可作小型 APM seed，補 3 站、Gold Line APM template、OSM relation 與 Gold Line 圖示 | 5.5 已決定可納入 rail network，但列為低優先 feeder，不阻塞 trunk/P0 cleared seeds |
| P0-TH-8 | □ monitor | Metro | `BKK-MRT-Orange` | MRT Orange Line | 待完整載客段確認 | 不執行 | 只在正式營運段、站名與 OSM relation 穩定後下放 |

### P0：新加坡 / 新馬補完

| 優先 | 狀態 | 類型 | id | 線名 | 起終點 / 範圍 | 5.3 責任 | 5.5 責任 |
|---|---|---|---|---|---|---|---|
| P0-SG-1 | ☑ A ☑ B | Metro | `SG-MRT-North-East` | North East Line | HarbourFront ⇄ Punggol Coast（22 km / 17 站） | 已補站表、driverless heavy metro template、OSM relation、NEL purple icon | 無阻塞；Punggol Coast 已納入 current baseline |
| P0-SG-2 | ☑ A ☑ B | Metro | `SG-MRT-Downtown` | Downtown Line | Bukit Panjang ⇄ Expo（42 km / 35 站，含 Hume） | 已補站表、driverless metro template、OSM relation `2313458`、DTL blue icon | 無阻塞；DTL3e 保留 extension pass；shape maxOffset 0.004 km |
| P0-SG-3 | ☑ A ☑ B | Metro | `SG-MRT-Thomson-East-Coast` | Thomson-East Coast Line | Woodlands North ⇄ Bayshore current segment（40.6 km / 27 站） | 已補站表、TEL template、OSM relation `2383439`、TEL brown icon；shape maxOffset 0.005 km | 未完工東段與 future extension 不提前進 `RAIL_DATA` |
| P0-SG-4 | ☑ A ☑ B | AGT / LRT | `SG-LRT-Bukit-Panjang` | Bukit Panjang LRT | Choa Chu Kang ⇄ Bukit Panjang loop network | 已補 19-stop clockwise loop 站序、`BPLRT` template、OSM relation `1159434`、BPLRT grey icon、Singapore generated shape | 無阻塞；repeated loop stations 保留 indexed km；shape maxOffset 0.508 km |
| P0-SG-5 | ☑ Sengkang ☑ Punggol | AGT / LRT | `SG-LRT-Sengkang` / `SG-LRT-Punggol` | Sengkang / Punggol LRT | 東西 loops | `SG-LRT-Sengkang` 已完成 16-stop explicit East+West loop seed；`SG-LRT-Punggol` 已完成 17-stop explicit East+West loop seed with Teck Lee、`PGLRT` template、OSM relations `1146942` + `2312984`、Singapore generated shape 與 PGLRT icon | 5.5 已決定 loop 以站序與 `loopAnchor`/indexed km 表示，不合併成多分支 schema |
| P0-SG-6 | □ monitor | Cross-border LRT | `SG-MY-RTS-Link` | Johor Bahru-Singapore RTS Link | Woodlands North ⇄ Bukit Chagar（4 km / 2 站，目標 2026 年底） | 載客前不建正式 pass；載客後以 `sg-my` cross-border region seed，補 2 站、RTS template、OSM relation、CIQ 提示與圖示 | 5.5 已決定載客前 monitor；不放入單一 `singapore` 或 `malaysia` region |
| P0-SG-7 | □ monitor | Metro | `SG-MRT-Cross-Island` | Cross Island Line | future stages | 不執行 | 待載客段開通與 LTA current line list 更新 |

### P0：馬來西亞補完

| 優先 | 狀態 | 類型 | id | 線名 | 起終點 / 範圍 | 5.3 責任 | 5.5 責任 |
|---|---|---|---|---|---|---|---|
| P0-MY-1 | ☑ A ☑ B | Metro | `KL-MRT-Putrajaya` | MRT Putrajaya Line | Kwasa Damansara ⇄ Putrajaya Sentral（57.7 km / 36 站） | 已補站表、PYL MRT template、OSM relation `11313578`、PYL yellow icon | 無阻塞；shape maxOffset 0.080 km |
| P0-MY-2 | ☑ A ☑ B | Metro / LRT | `KL-LRT-Ampang` | LRT Ampang Line | Sentul Timur ⇄ Ampang | 已補 18 站、`AGL` template、OSM relation `4466552`、AGL orange icon、Malaysia generated shape | 無阻塞；以獨立 shared-trunk line object 建模；shape maxOffset 0.005 km |
| P0-MY-3 | ☑ A ☑ B | Metro / LRT | `KL-LRT-Sri-Petaling` | LRT Sri Petaling Line | Sentul Timur ⇄ Putra Heights | 已補 29 站、`SPL` template、OSM relation `3374384`、SPL maroon icon、Malaysia generated shape | 無阻塞；以獨立 shared-trunk line object 建模；shape maxOffset 0.008 km |
| P0-MY-4 | ☑ A ☑ B | Monorail | `KL-Monorail` | KL Monorail | KL Sentral ⇄ Titiwangsa（8.6 km / 11 站） | 已補站表、`Monorail` template、OSM relation `2546881`、MRL monorail icon、Malaysia generated shape | 無阻塞；shape maxOffset 0.005 km，可作東南亞 monorail icon 範例 |
| P0-MY-5 | □ cleared seed | Commuter | `KTM-Komuter-Batu-Caves-Pulau-Sebang` | KTM Komuter Batu Caves - Pulau Sebang | Batu Caves ⇄ Pulau Sebang（135 km） | ERL Ekspres 後可補 full-corridor 站表、KTM EMU template、OSM relation、KTM Komuter icon | 只 seed full-corridor canonical line；短折、缺站班次與施工期 special timetable 不進 runtime |
| P0-MY-6 | □ cleared seed | Commuter | `KTM-Komuter-Tanjung-Malim-Port-Klang` | KTM Komuter Tanjung Malim - Port Klang | Tanjung Malim ⇄ Pelabuhan Klang（131 km） | ERL Ekspres 後可補 full-corridor 站表、KTM EMU template、OSM relation、KTM Komuter icon | 同上；採 official `Pelabuhan Klang` label，script-side aliases 可含 `Port Klang` |
| P0-MY-7 | ☑ A ☑ B | Airport | `ERL-KLIA-Transit` | KLIA Transit | KL Sentral ⇄ KLIA T2 local stops | 已補 6 站、`ERL` airport template、OSM relation `8119876`、ERL icon、Malaysia generated shape | 無阻塞；shape maxOffset 0.234 km |
| P0-MY-8 | □ cleared seed | Airport | `ERL-KLIA-Ekspres` | KLIA Ekspres | KL Sentral ⇄ KLIA T1 ⇄ KLIA T2 regular-hours express | 可補 regular-hours express 3-station line object、ERL airport template/icon、OSM relation；不等 runtime | 只代表 regular non-stop express；23:00 後 all-stations 與 maintenance combined service 留 service-pattern pass |
| P0-MY-9 | □ monitor | LRT | `Penang-Mutiara-LRT` | Penang Mutiara Line | future operational segment | 不執行 | 待正式載客與 OSM/官方站表穩定 |

### P1：其他亞洲候選池（泰國 / 新馬之後）

| 優先 | 區域 | 候選線群 | 5.3 可先做 | 5.5 先判斷 |
|---|---|---|---|---|
| P1-ID | 印尼 | Jakarta MRT North-South Phase 1、LRT Jakarta、LRT Jabodebek、KAI Commuter Bogor / Cikarang / Rangkasbitung / Tangerang、Soekarno-Hatta Airport Rail Link | Jakarta MRT Phase 1 已決定為第一條 P1 seed，先做 Lebak Bulus ⇄ Bundaran HI 現行營運段 | KAI Commuter 多分支與長線直通需 branch/short-turn 規則；LRT Jabodebek / Airport Rail Link 後續另排 |
| P1-PH | 菲律賓 | Manila LRT-1、LRT-2、MRT-3、PNR / NSCR future corridor | LRT-2 或 MRT-3 可作第一條 seed | LRT-1 extension 與 NSCR 未來段需確認 current baseline |
| P1-VN | 越南 | HCMC Line 1（已完成）、Hanoi 2A（已完成）、Hanoi Line 3 elevated segment、HCMC Line 2 future | Hanoi Line 3 current service 可作補完 seed | 未全線營運段與 future HCMC extensions 不提前建正式資料 |
| P2-SA | 南亞 / 西亞 | Delhi / Mumbai / Bengaluru / Bangkok-scale 以外大型都會鐵路、Dubai Metro、Doha Metro 等 | 暫不進 5.3 | 需另開大型 region selector、語系與資料量策略 |

### 亞洲其他區域 5.3 / 5.5 任務分配

5.3 可直接執行：

1. 依 P0-TH-1 → P0-TH-5 順序補曼谷已營運線，每條線都完成 Phase A + Phase B、train icon、`check:timing`、`check:shapes`、`test:smoke`。
2. 泰國前 2 條 monorail seed、`BKK-SRT-Dark-Red`、`BKK-SRT-Light-Red`、`KL-Monorail`、`SG-LRT-Bukit-Panjang`、`KL-LRT-Ampang`、`KL-LRT-Sri-Petaling`、`ERL-KLIA-Transit`、`SG-LRT-Sengkang` 與 `SG-LRT-Punggol` 已完成；下一個 5.3 seed 可接 `ERL-KLIA-Ekspres`，之後再做其他 cleared seeds。Dark / Light Red 完成後不批量補完整曼谷，改依 P0 放行狀態在 Malaysia / Singapore cleared seeds 間輪替。
3. 馬來西亞 LRT / KTM / ERL 採「先獨立 line object，後續再合併 branch 模型」策略，避免 branch 規則尚未定案時阻塞站表與 shape 回灌。
4. 新加坡 MRT 補完先做重軌 MRT（North East / Downtown / Thomson-East-Coast current segment），Bukit Panjang LRT loop、Sengkang LRT loop 與 Punggol LRT loop 已完成；RTS Link 載客前仍不下放。
5. `ERL-KLIA-Transit` all-stop local airport service 已完成；`ERL-KLIA-Ekspres` regular-hours 3-station seed 可接續下放，KTM Komuter 兩條 Klang Valley full-corridor seeds 可在 Ekspres 後逐條下放。

5.5 需要先決策：

1. 已決定 seed cadence：每輪只做 1 條完整 seed，完成 icon/template/shape/checks 後才交下一條；不採同城市一次補完，固定「泰國 2 → 馬來西亞 1 → 新加坡 1」只作早期 bootstrapping，不再作硬性循環。
2. 已定義 loop / branch / shared trunk / express service 的資料模型邊界：SG LRT 可用可驗證 loop 站序 seed，KL Ampang / Sri Petaling 與 SRT Red Lines 以獨立 line object 表示共線，ERL KLIA Transit 可先 seed，Ekspres 等 skip-stop template。
3. 已決定 RTS Link 載客後新增 `sg-my` cross-border region；載客前維持 monitor，不交 5.3 建正式資料。
4. 已決定排除非鐵路 BRT（例如 Sunway BRT）；除非未來新增明確 non-rail transit category，預設不列入本鐵道路網計畫。
5. 已決定 P1 第一條 seed：印尼 `JKT-MRT-North-South`（Jakarta MRT North-South Phase 1，Lebak Bulus ⇄ Bundaran HI）；多 region UI 已決定維持原生 select，12+ regions 時改為群組化 select。
6. 已完成 Malaysia airport/commuter gate 的 cleared seed：`ERL-KLIA-Transit`；`ERL-KLIA-Ekspres` 等 skip-stop / express runtime，KTM Komuter 長線等 short-turn policy。
7. 已完成 SRT Light Red current segment：`BKK-SRT-Light-Red` 已作為 4-station independent commuter seed 落地；future west/south extensions 不提前建資料。
8. 已決定 Pink Line Muang Thong Thani branch：另建獨立 branch line object seed，站序 `Muang Thong Thani` ⇄ `Impact Muang Thong Thani` ⇄ `Lake Muang Thong Thani`；不併入 `BKK-MRT-Pink` 主線或新 branch schema。
9. 已決定 KLIA Ekspres regular-hours gate：`ERL-KLIA-Ekspres` 可作獨立 3-station Airport express seed；23:00 後 all-stations pattern 與 maintenance combined service 不納入本 seed。
10. 已決定 KTM Komuter long-corridor gate：`KTM-Komuter-Batu-Caves-Pulau-Sebang` 與 `KTM-Komuter-Tanjung-Malim-Port-Klang` 可作獨立 full-corridor commuter seeds；短折與臨時/部分班次不納入本輪。

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

已完成的批次 1–11 合計 **34 條線**，分布如下；不含既有日本 3 條線（東海道新幹線、山手線、中央線）、上方新增的日本 / 南韓完整覆蓋 backlog、以及亞洲其他區域 P0/P1 backlog。另有 backlog seed：日本 `Nishi-Kyushu-Shinkansen` 1 條 HSR 線、`Tokyo-Monorail` 1 條 Airport / Monorail 線、`Utsunomiya-Lightline` 1 條 Tram / LRT 線、南韓 `SRT-Gyeongbu` / `SRT-Honam` / `SRT-Jeolla` / `SRT-Gyeongjeon` / `SRT-Donghae` / `KTX-Honam` / `KTX-Jeolla` / `KTX-Gyeongjeon` / `KTX-Gangneung` / `KTX-Donghae` / `KTX-Jungang` / `KTX-Jungbu-Naeryuk` 12 條 HSR 線、`ITX-Cheongchun` 1 條 Intercity 線、`Seoul-Metro-3` / `Seoul-Metro-4` / `Seoul-Metro-5` / `Seoul-Metro-6` / `Seoul-Metro-7` / `Seoul-Metro-8` / `Seoul-Metro-9` / `Shinbundang` / `Suin-Bundang` / `Gyeongui-Jungang` / `Gyeongchun` / `Gyeonggang` / `Seohae` / `Incheon-Metro-1` / `Busan-Metro-2` / `Busan-Metro-3` / `Busan-Metro-4` / `Daegu-Metro-1` / `Daegu-Metro-2` / `Daejeon-Metro-1` / `Gwangju-Metro-1` 21 條 Commuter / Metro 線、`AREX` 1 條 Airport 線、`Gimpo-Goldline` / `Incheon-Metro-2` / `Ui-LRT` / `Sillim-LRT` / `Uijeongbu-LRT` / `Yongin-EverLine` / `Busan-Gimhae-LRT` 7 條 LRT/AGT 線、`Daegu-Metro-3` 1 條 Monorail 線已完成 A/B。

| 類型 | 條數 | 線名摘要 |
|---|---|---|
| HSR | 18 | 山陽新幹線、西九州新幹線、KTX 京釜、KTX 湖南、KTX 全羅、KTX 慶全、KTX 江陵、KTX 東海、KTX 中央、KTX 中部內陸、SRT 京釜、SRT 湖南、SRT 全羅、SRT 慶全、SRT 東海、京滬、京廣、滬昆 |
| Intercity | 1 | ITX-청춘 |
| Commuter | 5 | JR 京浜東北、JR 総武各停、東急東横、阪急神戸、MTR 東鐵 |
| Metro | 37 | Tokyo Metro 2、Osaka Metro 1、Seoul 1/3/4/5/6/7/8/9/Shinbundang/Suin-Bundang/Gyeongui-Jungang/Gyeongchun/Gyeonggang/Seohae、Incheon 1、Busan 1/2/3/4、Daegu 1/2、Daejeon 1、Gwangju 1、MTR 2、北京 / 上海地鐵 3、SG MRT 2、KL 2、BKK 2、HCMC/Hanoi 2 |
| Loop | 4 | 大阪環状、Seoul 2 號、Beijing 2 號、SG Circle |
| Airport | 3 | AREX、MTR 機場快綫、BKK Airport Rail Link |
| LRT | 8 | Utsunomiya Lightline、Gimpo Goldline、Incheon 2、Ui LRT、Sillim Line、Uijeongbu U Line、Yongin EverLine、Busan-Gimhae LRT（台灣側已涵蓋淡海、高雄環狀輕軌） |
| Monorail | 2 | Tokyo Monorail、Daegu Metro Line 3 |

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

## 低優先未完成項（由 follow-up-plan 移入）

下列項目不再放在 `doc/follow-up-plan.md` 的近期未完成清單，避免干擾泰國 / 新馬 P0 seed。除非用戶明確指定，這些只在完成高優先資料更新後再挑選執行。

| 類別 | 項目 | 目前處理方式 |
|---|---|---|
| 工程級精度 | Tokaido-Shinkansen 若 OSM 未來有更乾淨 relation，可替換 corridor reconstruction 並更新 snapshot | 依賴上游資料；目前不主動處理 |
| 工程級精度 | 已建立 route 但 maxOffset 約 0.75–1.0 km 的路線可再精修，例如 `JR-Keihin-Tohoku`、`KHH-Red`、`Tamsui-LRT`、`JR-Osaka-Loop`、`Tokyu-Toyoko`、`Seoul-Metro-1`、`TPE-Yellow`、`TYMRT`、`Tokyo-Metro-Marunouchi` | 可用官方站點坐標或更乾淨的 OSM station node 逐站替換；不阻塞 P0 擴張 |
| 工程級精度 | 若要把門檻從 0.75 km 壓到 0.50 km，可依序檢查 `KHH-LRT`、`Beijing-Subway-1`、`KL-MRT-Kajang`、`TRA-Jiji`、`Alishan-Forest`、`Beijing-Subway-2`、`Hankyu-Kobe`、`Seoul-Metro-9`、`KL-Kelana-Jaya`、`BKK-Airport-Rail`、`TRA-Neiwan`、`TRA-Pingxi` | 第二優先品質清單 |
| 日本 / 南韓完整覆蓋 | 日本剩餘新幹線 / JR 都會圈 / 民鐵 / 其餘 Metro / 機場線 / Regional / Heritage / Freight；南韓一般列車、Regional、Heritage、Freight | 已有各類代表線 seed；下一批建議改挑 Regional / Heritage 作範例 |
| 支線與快慢車模型 | AREX 直通、Seoul Line 9 急行、Gyeongui-Jungang 支線/短折、Gyeongchun 상봉 / 광운대 variants、Gyeonggang 부발 short-turn、Seohae 대곡 short-turn | 等 skip-stop 或 branch/short-turn template 成熟後再補 |
| 泰國 / 新馬策略 | SG LRT loops、KL Ampang / Sri Petaling 共線、ERL KLIA Transit / Ekspres、BKK Pink branch、SRT Red Lines 共線 | 基本 loop / shared-trunk 邊界已決定；Light Red current segment 已完成；Ekspres skip-stop 與 Pink branch 仍需後續 pass |
| 跨境與未營運線 | `SG-MY-RTS-Link` region 歸屬、CIQ 提示、跨境票制；`Penang-Mutiara-LRT`、`SG-MRT-Cross-Island`、`BKK-MRT-Orange` 等未完整載客項 | monitor；正式載客與資料穩定前不建正式 pass |
| UI / i18n | 多 region selector 改版、12+ region 分組、泰文 / 馬來文 / 印尼文 / 越南文站名與 zh-TW 字串同步 | 等 P0 seed 量增加後再評估是否需要 UI 改版 |
| 資料源策略 | Level-2 政府 API 與 Level-4 付費資料是否納入、授權上限、更新週期與維護成本 | 需用戶授權與成本判準後才啟動 |

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
- **HSR 類**（東海道、山陽、西九州、京滬、京廣、滬昆、KTX / SRT）：OSM relation 易包含上下行＋折返線，可能需 `corridor` 重建（參考 Tokaido、Nishi Kyushu 與 KTX-Honam 既有作法）。
- **多 region 切換 UI**：地區數從 2 → 9，要看 `src/app-core.js` 的 region selector 是否仍適合（例如改下拉式或分組）。
- **i18n**：新增日文／韓文／中文簡體／泰文／越南文站名後，要走 `i18n-sync` skill 對齊 zh-TW UI 字串。
- **站點座標品質**：本輪沒有 0 km fallback；中國 HSR、TYMRT、Alishan、台鐵支線與高捷紅/輕軌、`Utsunomiya-Lightline` 等粗略站點座標已用 generated OSM shape 做 1 km 門檻吸附。`Nishi-Kyushu-Shinkansen`、`Tokyo-Monorail`、`TPE-Brown`、`KHH-Orange`、`Busan-Metro-1/2/3/4`、`Busan-Gimhae-LRT`、`Daegu-Metro-1/2`、`Daejeon-Metro-1`、`Gwangju-Metro-1`、`Beijing-Subway-1`、`Shanghai-Metro-1/2`、`KL-Kelana-Jaya`、`BKK-BTS-Sukhumvit`、`BKK-MRT-Blue`、`HCMC-Metro-1`、`Hanoi-Metro-2A` 已直接採用 OSM relation stop/platform node 對站。
- **本輪高誤差修正**：`JR-Yamanote` 改用 corridor + loop 起點修正，總長由錯誤的約 56 km 回到約 34.3 km；`KHH-LRT` 改為目前站表列出的 13 站區段（約 7.1 km）；`KHH-Orange`、`Shanghai-Metro-1`、`BKK-BTS-Sukhumvit` 以 stop nodes 移除舊端點外伸/拼接外伸造成的偏移；`Busan-Metro-1` 補 `동대신` 投影 override 並採 stop nodes，避免後段站點 km 被推遲。
- **build 時間**：批次 6/7 的中國高鐵與都會地鐵已大幅增加 generated shape 與 snapshot 體量，後續若再擴張需持續監控 `scripts/.cache/` 大小與 build 時間。

## 執行順序

2026-05-09 已依批次 1 → 11 完成 Phase B 形狀回灌與 snapshot 更新；同日完成高誤差複查、OSM stop member 對站、snapshot 二次精修更新。2026-05-11 起可選 backlog 持續補 seed；`Nishi-Kyushu-Shinkansen` 已完成日本 HSR 代表線，`Tokyo-Monorail` 已完成日本 Airport / Monorail 代表線，`Utsunomiya-Lightline` 已完成日本 Tram / LRT 代表線。2026-05-12 起下一輪擴張優先順序改為泰國曼谷補完、新加坡 / 馬來西亞補完與新馬 RTS Link 監控；日本 / 南韓剩餘完整覆蓋維持可選 backlog。

## 5.3 vs 5.5 任務拆分與進度管理

### 5.3 可直接執行（GPT-5.3-Codex-Spark）
- 目標：可按既有格式直接落地的資料新增/修正，包含手寫站表、train template、OSM 關聯、shape 回灌與 icon 更新。
- 交付條件：資料可驗證、可回復、可建置。

#### 進度看板（5.3）
1. [x] 完成既有 34 條 Phase A / Phase B（含日本・南韓 seed 完成）且 snapshot 已更新到 103 條線。
2. [x] 實做與文件一致的代表線 SOP（日本 HSR、Japan Airport/Monorail、Japan Tram/LRT、South Korea HSR / Intercity / Commuter / Metro / LRT-AGT / Monorail、Hong Kong/China/SG/MY/Thailand/Vietnam 各區批次）。
3. [x] 維護資料源（以 OSM 為主）並更新 `OSM_LINE_MAP`、`rail-data`、`trainTemplates` 的常規新增流程。
4. [x] 針對高誤差路段執行 station-to-station/stop-node 對站修正（已完成：多條南韓與東南亞主要線路）。
5. [ ] 持續追加入列 backlog 的候選新線前：先完成「單線 seed」→ 生成 icon/template → 驗證 → 推進同營運者其餘線路；`BKK-MRT-Yellow`、`BKK-MRT-Pink` 主線、`BKK-SRT-Dark-Red`、`BKK-SRT-Light-Red`、`KL-Monorail`、`SG-LRT-Bukit-Panjang`、`KL-LRT-Ampang`、`KL-LRT-Sri-Petaling`、`ERL-KLIA-Transit`、`SG-LRT-Sengkang` 與 `SG-LRT-Punggol` 已完成，下一個 5.3 seed 可接 `ERL-KLIA-Ekspres`。
6. [ ] 泰國 / 新馬 P0 seed 執行：每條線都補 `rail-data`、train template、OSM relation、train icon，並跑 `npm run build:rail-data`、`npm run check:shapes`、`npm run check:timing`、`npm run test:smoke`。
7. [ ] 維持 `maxOffset` 目標 ≤ 1.0 km，對 0.75–1.0 km 的路段做可選精修，必要時補官方站點坐標。

### 5.5 需要跨模組判斷（GPT-5.5）
- 目標：涉及策略、優先序、資料模型邊界與 UI/流程風險的決策性工作。
- 交付條件：完成規則共識後再下放 5.3 實作，避免反覆退回。

#### 進度看板（5.5）
1. [x] 確認「完成」與「可選 backlog」邊界（目前結論：必要項目已無）並固定為每輪 1 類型 1 seed 的擴張策略。
2. [x] 決定亞洲其他區域下一輪優先順序：泰國曼谷補完 → 新加坡 / 馬來西亞補完與新馬 RTS Link 監控 → 印尼 / 菲律賓 / 越南補完。
3. [x] 評估 loop/複線/共線的策略模板（`loopAnchor`、`corridor`、branch/short-turn）在 `app-core` 與 `app-map` 的長期維運性；優先用於 SG LRT、KL Ampang/Sri Petaling、SRT Red Lines、ERL express/local。
4. [x] 決定 RTS Link 載客後的 region 歸屬、CIQ 提示、跨境線是否新增 `sg-my` region；載客前只監控，不交給 5.3 建正式資料。
5. [x] 規劃多 region UI 與地區切換體驗（12+ region 規模）是否改版為下拉/群組，以免後續擴展衝突。
6. [x] i18n 策略決定（中文、日文、韓文、泰文、馬來文、印尼文、越南文站名對齊）與 `i18n-sync` 執行節奏，避免後續資料新增造成字串裂變。
7. [x] 決定 Level-2 / Level-4 資料源（政府 API、付費資料）是否在未來輪次納入，及其授權/成本判準。
8. [x] 決定 P1 印尼 / 菲律賓 / 越南的第一條 seed：先下放 `JKT-MRT-North-South` 的 Jakarta MRT Phase 1 現行營運段。
9. [x] 決定 `BKK-BTS-Gold` 小型 feeder：可納入 rail network 作 optional AGT/APM seed，但不計為必須完成的 trunk/P0 coverage gate。
10. [x] 決定 Malaysia airport/commuter gate：下一個 cleared seed 為 `ERL-KLIA-Transit`；`ERL-KLIA-Ekspres` 與 KTM Komuter 均已由後續 5.5 gates 放行。
11. [x] 決定 `BKK-SRT-Light-Red` current segment：只 seed Krung Thep Aphiwat ⇄ Taling Chan 現行 4 站；future extensions 維持 monitor。
12. [x] 決定 `BKK-MRT-Pink-Muang-Thong-Thani` branch：可作獨立 3-station branch seed；不改 branch schema、不重寫主線。
13. [x] 決定 `ERL-KLIA-Ekspres` regular-hours express：可作獨立 3-station Airport seed；晚間 all-stations 服務型態另開 runtime pass。
14. [x] 決定 KTM Komuter long-corridor / short-turn gate：兩條 Klang Valley full-corridor commuter seeds 可下放；短折、缺站班次與施工期 timetable 另開 service-pattern pass。

#### 2026-05-14 5.5 決策：Bangkok straddle monorail category

- `decision`: approved + downscope。`BKK-MRT-Yellow` 與 `BKK-MRT-Pink` 主線在 `RAIL_DATA` 中使用既有 `Monorail` 類型，不為曼谷 straddle monorail 另建新 category，也不降級顯示為 `Metro`。5.3 可先補兩條主線的站表、template、OSM relation 與 line-aware icon。
- `scope`: 泰國曼谷 Yellow / Pink 主線的 UI category、train template 類型與 icon kind；owned files for future Spark work are `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs`, `src/train-icon-registry.js`, `scripts/build-train-icons.mjs`, and generated shape/icon outputs from the documented scripts.
- `source`: repo 既有 category taxonomy 已包含 `Monorail` / `AGT`，且 `Tokyo-Monorail`、`Daegu-Metro-3` 已驗證 monorail display 與 line-aware icon path。Yellow / Pink 官方定位雖掛 MRT brand，但車輛與基礎設施是 straddle monorail；用 `Monorail` 可避免把低運量單軌與重軌 MRT 混在同一 UI bucket。
- `constraints`: Do not change the category taxonomy or add a new `StraddleMonorail` type in this pass. `BKK-MRT-Pink` 先只 seed Nonthaburi Civic Center ⇄ Min Buri 主線；Muang Thong Thani branch is a separate future extension pass after branch/extension policy is settled. If a future UI wants MRT-branded grouping, use line name/brand copy rather than changing the category.
- `checks`: For this policy-only docs pass, run `git diff --check`. For future 5.3 seeds, run `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing`, `npm.cmd run check:train-icons`, and `npm.cmd run test:smoke`; run `npm.cmd run build:train-icons` if new Yellow/Pink PNG assets are generated.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 Bangkok monorail category 決策；`BKK-MRT-Yellow` 與 `BKK-MRT-Pink` 主線已於 2026-05-15 5.3 seed 完成，Muang Thong Thani branch 仍保留為後續 branch/extension pass。

#### 2026-05-14 5.5 決策：i18n sync policy

- `decision`: approved + downscope。近期不新增完整 i18n layer，也不為每個 station 建多語欄位。`src/rail-data.js` 維持 `name` 作為當地/官方主要站名、`nameEn` 作為 line 的英文/拉丁顯示；搜尋與反向地理編碼繼續由 `src/app-core.js` 的 `REGION_NOMINATIM_LANG` 與 `REGION_NAME_TAG_PREFS` 控制。只有當 UI 需要同時顯示兩種語言、或同一 region 內出現同名/異名衝突時，才另開 `i18n-sync` patch。
- `scope`: region-level language preference、station/line display naming policy、future `i18n-sync` cadence。owned files for future Spark work are `src/app-core.js` language preference constants, `src/rail-data.js` labels/directions, and any focused doc note; no generated shapes or train icon assets are part of this decision.
- `source`: repo 現況已覆蓋 Taiwan/Japan/Korea/Hong Kong/China/Singapore/Malaysia/Thailand/Vietnam 的 Nominatim language preferences and OSM `name:<lang>` priority. Current data uses local scripts for `name`, English/Latin for most `nameEn`, and region-specific direction labels.
- `constraints`: Do not rename station `name` values just to force English consistency; station names remain the shape/snapshot matching key unless generated index fallback is explicitly used. Do not add broad i18n runtime infrastructure before a concrete UI need. New regions must add `REGION_NOMINATIM_LANG` and `REGION_NAME_TAG_PREFS` in the same seed or in a same-round follow-up, and directions must stay consistent with station order.
- `checks`: For pure label preference changes, run `git diff --check` plus the narrow data check relevant to changed files. For any `src/rail-data.js` name/direction update, run `npm.cmd run check:timing`; if station names or generated shape mapping are touched, also run `npm.cmd run build:rail-data` and `npm.cmd run check:shapes`.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 i18n policy 決策；下一個可下放文件 seed 是「為新增 Indonesia/Philippines region 預先填入 Nominatim language/name tag preference」。

#### 2026-05-14 5.5 決策：Level-2 / Level-4 data-source gate

- `decision`: approved + blocked-by-default。未來輪次不主動納入政府 API、付費資料、需帳號或 API key 的 Level-2 / Level-4 source；除非用戶明確指定資料源且授權、成本、配額、重現性都可接受。OSM、手寫官方站表、已快取的 script output 繼續作為預設資料路徑。
- `scope`: data-source admission policy for route geometry, station facts, timetables, fares, occupancy, alerts, and any deeper service level. This does not change current `RAIL_DATA`, generated shapes, or train templates.
- `source`: repo 現況已用 `scripts/fetch-rail-shapes.mjs` 統一 TDX/OSM geometry flow，並以 generated chunk + snapshot 保持可重現；目前 app 也沒有 secret management 或 runtime API fetch policy for paid sources。
- `constraints`: Do not commit API keys, paid payloads, license-restricted raw data, or generated artifacts that cannot be rebuilt by documented scripts. If a future source requires credentials, keep it behind `.env`, document cache fallback behavior, and require a public/licensed summary in docs before generated outputs are accepted. Legal/cost judgment remains GPT-5.5/user-owned and is not downlisted to 5.3.
- `checks`: For policy-only docs, run `git diff --check`. For any future data-source integration, require source-specific dry run, cache fallback proof, `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, and a short license/cost note in the same commit.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 data-source gate 決策；future seed 可 only prepare adapters, not fetch restricted data, until explicit approval.

#### 2026-05-14 5.5 決策：12+ region selector

- `decision`: approved + downscope。近期維持 `src/app-core.js` `Toolbar` 內現有的原生 `<select>`；目前 `RAIL_DATA` 為 9 個 region，未達必須改版門檻。當 region 數量達 12 時，改為同一個原生 select 的群組化選項（`optgroup` 或等價資料驅動 render），先不要改成 modal、map overlay 或搜尋式 command menu。搜尋式選單只在 18+ regions、跨境 region 增多、或使用者回報難以掃描時再開新 5.5 UI 決策。
- `scope`: 本輪只完成策略文件與看板清理。未來實作若觸發，owned files 以 `src/app-core.js` 的 `Toolbar` region option source 與對應 CSS 為主；`src/app-map.js` 不需要改，除非 region 切換 lifecycle 出現實測 bug。
- `source`: repo 現況顯示 `Toolbar` 已使用原生 select，`RAIL_DATA` 目前有 9 個 region（Taiwan、Japan、Korea、Hong Kong、China、Singapore、Malaysia、Thailand、Vietnam）。P0/P1 backlog 會把 region 推向 12+，但短期仍可用現有 control 承載。
- `constraints`: 保留既有 region key 與 `switchRegion` 流程；不要引入 JSX/TypeScript；不要為此新增 `RAIL_DATA` schema 欄位。若未來新增 `sg-my`，先等 RTS Link 5.5 歸屬決策完成，再放入 `Cross-border / monitor` 群組。
- `checks`: 本輪為文件決策，最小檢查為 `git diff --check`。未來若實作 UI，需跑 `npm.cmd run build`、`npm.cmd run test:smoke`，並用 browser testing 檢查桌面與手機寬度的 toolbar/select 不溢出。
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 UI 策略決策；下一個可下放 UI seed 是「12+ regions 時將 hard-coded region list 抽為 grouped option data」。

#### 2026-05-15 5.5 決策：loop / branch / shared-trunk template

- `decision`: approved + downscope。近期維持 runtime 的單一路線模型：每個 `RAIL_DATA` line object 代表一條可驗證、可排序、可投影的站序；不在 `app-core.js` / `app-map.js` 新增 branch graph、service graph 或 multi-route schema。複線、共線與 shared trunk 以多個獨立 line object 重複共線區間處理；loop 以 explicit station order、必要時 repeated station、`loopAnchor` 與 generated indexed km 處理；短折只使用現有 `stationIdxStart` / `stationIdxEnd` 表示連續子區間。非連續 skip-stop / express 不在本決策下放，需等 `TrainGen` 停站 pattern 與 UI 標示另開實作。
- `scope`: SG LRT Bukit Panjang / Sengkang / Punggol loop seeds、KL Ampang / Sri Petaling shared trunk、SRT Dark / Light Red shared trunk、ERL KLIA Transit / Ekspres local-vs-express；future Spark owned files are `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs`, `src/train-icon-registry.js`, generated shape/icon outputs, and narrow docs. `src/app-core.js` / `src/app-map.js` are explicitly out of scope unless a future UI bug is reproduced.
- `source`: 現有 app already treats train movement as a canonical km along one ordered station chain: `TrainGen.generate` builds directional stops and kinematic segments from line station order, `app-core.js` computes pass time / live position from those segments, and `app-map.js` renders per-line shapes and markers without needing branch topology. Existing examples already cover loop anchors (`Seoul-Metro-2`, `Beijing-Subway-2`, `BKK-MRT-Blue`), duplicated loop station handling (`Seoul-Metro-6` with indexed generated km), corridor reconstruction for noisy multi-relation HSR/metro lines, and contiguous short-turn templates (`Gyeongui-Jungang`, `Gyeongchun`).
- `constraints`: Do not deduplicate repeated start/end stations on loop lines. Do not model a public branch network by packing multiple non-contiguous patterns into one line object. Do not add `branches`, `services`, `stopPattern`, or route graph fields until a concrete UI/runtime pass is accepted. For shared trunks, duplicated station rows and overlapping shapes are acceptable if each line object has stable directions, templates, icons, and shape checks. For express services, `stationIdxStart` / `stationIdxEnd` may only trim endpoints; it must not pretend to skip intermediate stations.
- `checks`: For this policy-only docs pass, run `git diff --check`. For future loop/shared-trunk seeds, run `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing`, `npm.cmd run check:train-icons`, and `npm.cmd run test:smoke`; run `npm.cmd run build:train-icons` when new PNG assets are generated. A future skip-stop/express runtime change must also run `npm.cmd run build` and browser smoke for the train sheet / modal labels.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 loop/branch/shared-trunk 模型決策。`BKK-SRT-Dark-Red`、`KL-LRT-Ampang` 與 `KL-LRT-Sri-Petaling` 已於 2026-05-15 5.3 seed 完成；`ERL-KLIA-Transit` 可先作 local all-stop seed；SG LRT 可先挑一條 loop 以 explicit station order seed；`BKK-SRT-Light-Red` current segment、`BKK-MRT-Pink-Muang-Thong-Thani` branch 與 `ERL-KLIA-Ekspres` regular-hours express 已於後續 5.5 gate 放行。仍保留阻塞：KLIA Ekspres late-night all-stations service-pattern runtime、RTS Link region。

#### 2026-05-15 5.5 決策：RTS Link cross-border region

- `decision`: approved + blocked-until-service。`SG-MY-RTS-Link` 載客前維持 `monitor`，不建正式 `RAIL_DATA` line、train template 或 generated shape。載客後新增 `sg-my` cross-border region，不放進既有 `singapore` 或 `malaysia` region，也不在兩個 region 重複建線。region label 建議為 `新馬跨境 Singapore-Malaysia`，初始 center 取 Woodlands North / Bukit Chagar 中點、zoom 12-13，未來若有更多跨境服務再一起納入同 region。
- `scope`: Woodlands North ⇄ Bukit Chagar 2-station LRT shuttle, cross-border region ownership, CIQ user hint, and post-service seed gates. Future Spark owned files after passenger service are `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs`, `src/train-icon-registry.js`, generated shape/icon outputs, and narrow docs. `app-core.js` / `app-map.js` should only be touched if a small CIQ notice UI is explicitly implemented in the same future pass.
- `source`: Singapore LTA describes RTS Link as a standalone 4 km LRT between Woodlands North and Bukit Chagar, with end-2026 passenger-service target, about 5 minutes journey time, and co-located CIQ where passengers clear both authorities at departure. Singapore MOT's 2026 written reply says fares will be commercially determined by RTS Operations Pte Ltd and announced later, so fare/ticketing behavior is not a data-seed input yet. Sources: https://www.lta.gov.sg/content/ltagov/en/upcoming_projects/rail_expansion/JB-Singapore_RTS_link.html and https://www.mot.gov.sg/news-resources/newsroom/assessment-of-expected-fare-range-for-upcoming-johor-bahru-singapore-rts-link-and-measures-to-ensure-fare-affordability-for-commuters/
- `constraints`: Do not create `sg-my` before official passenger service begins and the station/source geometry is stable. Do not duplicate the same line under both Singapore and Malaysia. Do not model fare, immigration queue time, or ticketing integration until official operator data exists. CIQ hint should be concise and factual: "Clear both Singapore and Malaysia authorities at departure; no second clearance at arrival." If no generic line-notice UI exists at seed time, document the CIQ note in the expansion plan and defer runtime UI to a separate focused patch.
- `checks`: For this policy-only docs pass, run `git diff --check -- doc/east-asia-expansion-plan.md`. For future RTS data seed, run `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing`, `npm.cmd run check:train-icons`, and `npm.cmd run test:smoke`; run `npm.cmd run build` and browser smoke if a CIQ notice UI is added.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 RTS Link region / CIQ 策略決策。仍保留 monitor：正式載客前不交 5.3 建資料；載客後第一個可下放 seed 是 `sg-my` region + `SG-MY-RTS-Link` 2-station shuttle。

#### 2026-05-15 5.5 決策：P0 seed cadence

- `decision`: approved + downscope。後續 P0 擴張維持「每輪 1 條完整 seed」作為硬規則：同一輪必須完成站表、train template、OSM/shape mapping、line-aware icon、generated outputs 與最小檢查後才開下一條。不採同城市一次補完；原先「泰國 2 條 → 馬來西亞 1 條 → 新加坡 1 條」只保留為早期 bootstrapping 參考，現在改用 cleared P0 queue + blocker fallback。
- `scope`: Asia P0 seed order and handoff policy. `BKK-SRT-Dark-Red`, `BKK-SRT-Light-Red`, `KL-Monorail`, `SG-LRT-Bukit-Panjang`, `KL-LRT-Ampang`, `KL-LRT-Sri-Petaling`, `ERL-KLIA-Transit`, `SG-LRT-Sengkang`, and `SG-LRT-Punggol` were completed in 2026-05-15 5.3 rounds; the current 5.3 next target can move to `ERL-KLIA-Ekspres` before KTM Komuter full-corridor seeds or additional optional / monitor items.
- `source`: Current repo backlog shows `BKK-MRT-Yellow`, `BKK-MRT-Pink`, `BKK-SRT-Dark-Red`, `KL-MRT-Putrajaya`, `KL-Monorail`, `SG-MRT-North-East`, `SG-MRT-Downtown`, and `SG-MRT-Thomson-East-Coast` completed. Existing check history demonstrates each seed has non-trivial icon, generated-shape, timing, and smoke-test work, so batching multiple lines in one round increases conflict and verification risk.
- `constraints`: Do not start a second seed in the same 5.3 round before the first seed's icon/template/shape/checks are complete and committed. Do not force a strict country cycle when the next same-country candidate is monitor-only, future-service, or has an unresolved branch/skip-stop blocker. Do not let this cadence decision override the separate RTS Link, ERL Ekspres, SRT Light Red, or Pink branch gates.
- `checks`: For this policy-only docs pass, run `git diff --check -- doc/east-asia-expansion-plan.md doc/follow-up-plan.md`. For future 5.3 seeds, run `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing`, `npm.cmd run check:train-icons`, and `npm.cmd run test:smoke`; run `npm.cmd run build:train-icons` when new PNG assets are generated.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 seed cadence 決策。`BKK-SRT-Dark-Red`、`BKK-SRT-Light-Red`、`KL-Monorail`、`SG-LRT-Bukit-Panjang`、`KL-LRT-Ampang`、`KL-LRT-Sri-Petaling`、`ERL-KLIA-Transit`、`SG-LRT-Sengkang` 與 `SG-LRT-Punggol` 已於 2026-05-15 5.3 seed 完成；下一個可下放 seed 轉 `ERL-KLIA-Ekspres`。

#### 2026-05-15 5.5 決策：P0 launch-gate reconciliation

- `decision`: approved + downscope。啟動前檢查已收斂：Bangkok Yellow / Pink 主線 category 顯示固定用既有 `Monorail`，不新增 `StraddleMonorail`，也不改成 `Metro`；KL Ampang / Sri Petaling、SRT Red Lines、ERL KLIA Transit 的保守策略維持「可驗證站序的獨立 line object」，不等 branch graph 或 skip-stop runtime。這個項目不再阻塞 5.3。
- `scope`: This reconciles the older follow-up 5.5 launch checklist only. It covers `BKK-MRT-Yellow`, `BKK-MRT-Pink`, `BKK-SRT-Dark-Red`, `BKK-SRT-Light-Red`, `KL-LRT-Ampang`, `KL-LRT-Sri-Petaling`, `ERL-KLIA-Transit`, and `ERL-KLIA-Ekspres`. Future Spark work may edit `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs`, `src/train-icon-registry.js`, generated shape/icon outputs, and narrow docs; no `app-core.js` / `app-map.js` schema work is authorized by this reconciliation.
- `source`: Repo-local decisions already record Bangkok monorail category policy, loop / branch / shared-trunk boundaries, and P0 seed cadence. Subsequent 5.3 seeds proved the category and icon path with `BKK-MRT-Yellow`, `BKK-MRT-Pink`, and `BKK-SRT-Dark-Red` completed as independent, line-aware data seeds.
- `constraints`: Do not merge shared-trunk services into a single branch graph. Do not implement non-contiguous skip-stop or express stopping patterns in the existing `stationIdxStart` / `stationIdxEnd` fields. `ERL-KLIA-Ekspres` remains a separate future gate; SRT Light Red current-service confirmation and BKK Pink Muang Thong Thani branch are resolved by later 2026-05-15 decisions. This pass only confirms older launch gates no longer block `KL-LRT-Ampang`, `KL-LRT-Sri-Petaling`, `ERL-KLIA-Transit`, or SG LRT local loop seeds. `KL-Monorail` is now completed as an independent seed.
- `checks`: For this policy-only docs pass, run `git diff --check -- doc/east-asia-expansion-plan.md doc/follow-up-plan.md`. For future seeds touched by this decision, run `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing`, `npm.cmd run check:train-icons`, and `npm.cmd run test:smoke`; run `npm.cmd run build:train-icons` when new PNG assets are generated.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 launch-gate reconciliation。`KL-Monorail`、`SG-LRT-Bukit-Panjang`、`KL-LRT-Ampang` 與 `KL-LRT-Sri-Petaling` 已完成；下一個可下放 seed 轉剩餘 Malaysia / Singapore cleared seeds。

#### 2026-05-15 5.5 決策：non-rail BRT exclusion

- `decision`: approved + blocked-by-default。非鐵路 BRT 不納入目前 Railway Elf rail network；Sunway BRT / BRT Sunway Line 不作 `RAIL_DATA` line、train template、shape mapping 或 icon。未來只有在產品範圍明確擴到 bus/BRT/non-rail transit，且新增 category、UI wording、icon taxonomy 與 checks 後，才可另開 non-rail pass。
- `scope`: Sunway BRT and similar bus rapid transit systems in Malaysia / Southeast Asia backlog triage. This pass changes docs only. Future rail seeds are unaffected: `ERL-KLIA-Transit`, KTM Komuter, remaining SG LRT loops, and confirmed rail/monorail/AGT/LRT lines remain eligible under their own gates.
- `source`: Repo taxonomy and UI are rail-centered (`Metro`, `Commuter`, `HSR`, `Airport`, `LRT`, `Monorail`, `AGT`, etc.) and do not have a bus/BRT category. Rapid KL's official MyRapid page identifies the Sunway service as Bus Rapid Transit using electric buses on a dedicated elevated track, so it is transit infrastructure but not a rail vehicle/service. Source: https://myrapid.com.my/bus-train/rapid-kl/brt/
- `constraints`: Do not overload existing `AGT`, `LRT`, `Monorail`, `Metro`, or `Airport` categories to represent bus services. Do not add bus icons, bus timetables, bus stop naming rules, or bus-specific routing behavior in a rail seed. If a future non-rail feature is approved, isolate it as a separate product/schema decision instead of slipping it into a rail-data pass.
- `checks`: For this policy-only docs pass, run `git diff --check -- doc/east-asia-expansion-plan.md doc/follow-up-plan.md`. No data, generated shape, timing, icon, or smoke checks are required because this pass changes no runtime files. A future non-rail feature would require a new 5.5 UX/data-model decision plus `npm.cmd run build` and browser smoke before any data seed.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 non-rail BRT exclusion 決策。Sunway BRT 不下放 5.3；`ERL-KLIA-Transit` 已於後續 5.3 seed 完成。

#### 2026-05-15 5.5 決策：P1 first seed

- `decision`: approved + downscope。P1 印尼 / 菲律賓 / 越南的第一條 seed 選 `JKT-MRT-North-South`，也就是 Jakarta MRT North-South Phase 1 的現行營運段；先只建 Lebak Bulus ⇄ Bundaran HI 這條單一路線，不把 Phase 2、KAI Commuter、LRT Jabodebek、LRT Jakarta 或 Soekarno-Hatta Airport Rail Link 併進同一輪。
- `scope`: 新增 future `indonesia` region 的第一條 rail seed、Jakarta MRT Phase 1 站序、Metro category、MRT Jakarta train template、OSM relation/shape mapping、line-aware icon 與 region name-tag preference。future Spark owned files are `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs`, `src/train-icon-registry.js`, train icon scripts/assets, generated shape outputs, and narrow docs.
- `source`: MRT Jakarta official Phase 1 page describes the first corridor as a 16 km Lebak Bulus to Bundaran HI line with 13 stations, and the official station list currently exposes the Phase 1 station set. Phase 2 is documented as an extension beyond Bundaran HI toward Ancol Barat, so it is out of scope until the opened passenger-service segment and station naming are stable. Sources: https://jakartamrt.co.id/id/proyek/fase-1, https://www.jakartamrt.co.id/daftar-stasiun, https://www.jakartamrt.co.id/id/proyek/fase-2
- `constraints`: Do not start with KAI Commuter because its branch/short-turn/long-distance service patterns need a separate branch policy. Do not include future or under-construction MRT extensions in the Phase 1 seed. Use sponsor-free canonical station names where possible, but preserve official/current names if they are needed for OSM/generated shape matching; add Indonesian Nominatim/name-tag preference in the same 5.3 seed per the i18n policy.
- `checks`: For this policy-only docs pass, run `git diff --check -- doc/east-asia-expansion-plan.md doc/follow-up-plan.md`. For the future Indonesia data seed, run `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing`, `npm.cmd run check:train-icons`, and `npm.cmd run test:smoke`; run `npm.cmd run build:train-icons` if a new Jakarta MRT PNG/contact sheet is generated.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 P1 first seed 決策。下一個可下放 P1 seed 是 `JKT-MRT-North-South`；若 Jakarta official/OSM mapping 阻塞，fallback 依序評估 `PH-LRT-2` / `PH-MRT-3` 或 `Hanoi-Line-3` current-service segment。

#### 2026-05-15 5.5 決策：Bangkok Gold Line feeder inclusion

- `decision`: approved + downscope。`BKK-BTS-Gold` 可納入 Railway Elf rail network，category 使用既有 `AGT` / small APM，不新增 `Feeder` 或 `PeopleMover` taxonomy。它是 optional low-priority seed：可在 trunk / cleared P0 seeds 之後補 3 站資料，但不列為泰國或東南亞必要 coverage gate，也不拿來取代 ERL/KTM 或 SG LRT loop 等較高優先 rail seeds。
- `scope`: Bangkok Gold Line current 3-station segment only, `Krung Thon Buri` ⇄ `Charoen Nakhon` ⇄ `Khlong San`; future Spark owned files are `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs`, `src/train-icon-registry.js`, train icon scripts/assets, generated Thailand shape outputs, and narrow docs. No `app-core.js` / `app-map.js` category work is authorized by this decision.
- `source`: BTS official Gold Line page says the first phase is part of Bangkok Rail Mass Rapid Transit System, uses an Automated People Mover system, and currently has 3 stations between Krung Thon Buri and Khlong San over 1.8 km. Source: https://www.bts.co.th/eng/info/GoldLine-info-history.html
- `constraints`: Seed only the current 3-station APM segment; do not include future Prajadhipok / other extension concepts until passenger service and official station names are stable. Do not include buses, ferries, ICONSIAM shuttle routing, or non-rail feeder services in this pass. Keep the route as a standalone AGT/APM line object with its own Gold Line icon/template; do not merge it into BTS Silom or treat it as a branch graph.
- `checks`: For this policy-only docs pass, run `git diff --check -- doc/east-asia-expansion-plan.md doc/follow-up-plan.md`. For a future Gold Line data seed, run `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing`, `npm.cmd run check:train-icons`, and `npm.cmd run test:smoke`; run `npm.cmd run build:train-icons` if a new Gold Line PNG/contact sheet is generated.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 Bangkok Gold Line feeder inclusion 決策。`BKK-BTS-Gold` 可下放為 optional AGT/APM seed；`ERL-KLIA-Transit` 已於後續 5.3 seed 完成。

#### 2026-05-15 5.5 決策：Malaysia airport/commuter next seed

- `decision`: approved + downscope。`KL-LRT-Sri-Petaling` 完成後，下一個 Malaysia cleared seed 選 `ERL-KLIA-Transit`，只做 KL Sentral ⇄ KLIA T2 的 all-stop local airport service。`ERL-KLIA-Ekspres` regular-hours express 已由後續 5.5 gate 放行為獨立 3-station seed；KTM Komuter 兩條長線已由後續 5.5 gate 放行為 full-corridor commuter seeds。late-night all-stations behavior、short-turns 與臨時/部分班次等 service pattern 仍另案。
- `scope`: `ERL-KLIA-Transit` only, station order `KL Sentral` ⇄ `Bandar Tasik Selatan` ⇄ `Putrajaya & Cyberjaya` ⇄ `Salak Tinggi` ⇄ `KLIA T1` ⇄ `KLIA T2`; future Spark owned files are `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs`, `src/train-icon-registry.js`, train icon scripts/assets, generated Malaysia shape outputs, and narrow docs. `app-core.js` / `app-map.js` skip-stop or service-pattern work is explicitly out of scope for the Transit seed.
- `source`: KLIA Ekspres official materials describe KLIA Transit as stopping at the intermediate stations Bandar Tasik Selatan, Putrajaya & Cyberjaya, and Salak Tinggi, with current timetable columns for KL Sentral, Bandar Tasik Selatan, Putrajaya & Cyberjaya, Salak Tinggi, KLIA T1, and KLIA T2. The same official site describes KLIA Ekspres as regular non-stop service, with late-night trains stopping at all stations, so Ekspres is not a simple all-stop or contiguous endpoint-trim template. Sources: https://www.kliaekspres.com/about-us/, https://www.kliaekspres.com/products-fares/klia-transit/, https://www.kliaekspres.com/products-fares/klia-ekspres/
- `constraints`: Do not model KLIA Ekspres with `stationIdxStart` / `stationIdxEnd`; that field cannot skip intermediate stations. Do not mix Transit and Ekspres services inside one line object. For `ERL-KLIA-Transit`, keep airport terminal naming aligned with current official labels (`KLIA T1`, `KLIA T2`) while preserving any OSM/generated shape matching keys needed by scripts. KTM Komuter follows the later full-corridor decision and must not encode short-turns without a service-pattern pass.
- `checks`: For this policy-only docs pass, run `git diff --check -- doc/east-asia-expansion-plan.md doc/follow-up-plan.md doc/railway-elf-sop.md`. For the future Transit data seed, run `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing`, `npm.cmd run check:train-icons`, and `npm.cmd run test:smoke`; run `npm.cmd run build:train-icons` if a new ERL PNG/contact sheet is generated.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 Malaysia airport/commuter gate 決策。`ERL-KLIA-Transit` 已於後續 5.3 seed 完成；`ERL-KLIA-Ekspres` regular-hours express 與 KTM Komuter full-corridor seeds 已於後續 5.5 gate 放行。blocked remains：KLIA Ekspres late-night all-stations service-pattern runtime and non-canonical short-turn/partial timetable modeling。

#### 2026-05-15 5.5 決策：KLIA Ekspres regular-hours express

- `decision`: approved + downscope。`ERL-KLIA-Ekspres` 可下放為獨立 `Airport` line object seed，但只代表 regular operating hours 的 express service：`KL Sentral` ⇄ `KLIA T1` ⇄ `KLIA T2`。不新增 `stopPattern`、service graph、branch graph 或 train sheet UI；23:00 後 all-stations service 與 temporary maintenance combined service 另開 runtime/service-pattern pass。
- `scope`: `ERL-KLIA-Ekspres` regular-hours express only, station order `KL Sentral` ⇄ `KLIA T1` ⇄ `KLIA T2`; future Spark owned files are `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs`, `src/train-icon-registry.js`, train icon scripts/assets, generated Malaysia shape outputs, and narrow docs. No `src/app-core.js` / `src/app-map.js` service-pattern work is authorized by this seed decision.
- `source`: KLIA Ekspres official product page says the service runs every 20 minutes, regular non-stop service remains unchanged during regular operating hours, and only trains from 23:00 stop at all stations; the official schedule page currently reports service status as normal. The downloadable Ekspres schedule lists KL Sentral, KLIA T1, and KLIA T2 timing with 28 minutes between KL Sentral and KLIA T1 plus 3 minutes between KLIA T1 and KLIA T2. Sources: https://www.kliaekspres.com/products-fares/klia-ekspres/, https://www.kliaekspres.com/schedule/, https://www.kliaekspres.com/media/4dkinl1y/klia-ekspres-dec-2025.pdf
- `constraints`: Do not model the 23:00+ all-stations period or maintenance combined-service notices in `RAIL_DATA` until the app has explicit service-pattern/runtime labels. Do not include Bandar Tasik Selatan, Putrajaya & Cyberjaya, or Salak Tinggi in the Ekspres station list; those belong to `ERL-KLIA-Transit`. Do not use `stationIdxStart` / `stationIdxEnd` to fake non-contiguous stop patterns. Keep current official terminal labels `KLIA T1` / `KLIA T2`, with script-side aliases if OSM still exposes older `KLIA` / `KLIA2` names.
- `checks`: For this policy-only docs pass, run `git diff --check -- doc/east-asia-expansion-plan.md`. For the future Ekspres data seed, run `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing`, `npm.cmd run check:train-icons`, and `npm.cmd run test:smoke`; run `npm.cmd run build:train-icons` if a new Ekspres PNG/contact sheet is generated.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 KLIA Ekspres regular-hours gate。`ERL-KLIA-Ekspres` can be scheduled as the next independent 3-station Airport seed after the completed `SG-LRT-Punggol` 5.3 work or another cleared queue item; KTM Komuter full-corridor seeds are resolved by the following 5.5 gate. blocked remains：late-night all-stations service-pattern runtime and RTS Link passenger-service monitor.

#### 2026-05-15 5.5 決策：KTM Komuter long-corridor / short-turn gate

- `decision`: approved + downscope。`KTM-Komuter-Batu-Caves-Pulau-Sebang` 與 `KTM-Komuter-Tanjung-Malim-Port-Klang` 可下放為兩個獨立 `Commuter` full-corridor line object seeds；先不新增 `shortTurn`、`servicePattern`、branch graph 或 timetable-specific runtime。每條 seed 只代表 canonical through route station order，不承諾每班車停靠每一站或全程行駛。
- `scope`: Klang Valley KTM Komuter only. Future Spark owned files are `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs`, `src/train-icon-registry.js`, train icon scripts/assets, generated Malaysia shape outputs, and narrow docs. First seed order after `ERL-KLIA-Ekspres` is `KTM-Komuter-Batu-Caves-Pulau-Sebang`, then `KTM-Komuter-Tanjung-Malim-Port-Klang`; no `src/app-core.js` / `src/app-map.js` runtime change is authorized by this decision.
- `source`: KTMB official Komuter page lists the Klang Valley routes `Batu Caves - Tampin / Pulau Sebang` at 135 km and `Tg. Malim - P. Klang` at 131 km, and describes transfers between the two lines at Putra, Bank Negara, Kuala Lumpur, and KL Sentral. The 2026 KTMB weekday timetable PDFs expose station rows for Batu Caves ⇄ Pulau Sebang and Tanjung Malim ⇄ Pelabuhan Klang, while also showing that some trips/rows are blank for selected stations; that supports a canonical route seed but not a per-trip stopping-pattern model. Sources: https://www.ktmb.com.my/Komuter.html, https://www.ktmb.com.my/assets/pdf/2026/BC-PS-BC%20Weekday%2013022026.pdf, https://www.ktmb.com.my/assets/pdf/2026/TM-PK-TM%20Weekday%2013022026.pdf
- `constraints`: Use current KTMB-facing terminal labels: `Batu Caves`, `Pulau Sebang`, `Tanjung Malim`, and `Pelabuhan Klang`; keep `Port Klang`, `Tg. Malim`, and `Tampin` as script/source aliases when needed. Do not model short workings, peak-only services, temporary single-track reductions, skipped station rows, or timetable headways inside `RAIL_DATA`. Do not merge the two Komuter routes into a branch graph even where they share central transfer stations.
- `checks`: For this policy-only docs pass, run `git diff --check -- doc/east-asia-expansion-plan.md doc/railway-elf-sop.md doc/follow-up-plan.md`. For each future KTM data seed, run `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing`, `npm.cmd run check:train-icons`, and `npm.cmd run test:smoke`; run `npm.cmd run build:train-icons` if a new KTM Komuter PNG/contact sheet is generated.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 KTM Komuter full-corridor gate。KTM Komuter can be scheduled after the currently queued `ERL-KLIA-Ekspres` regular-hours seed; blocked remains：non-canonical short-turn/partial timetable service-pattern runtime and RTS Link passenger-service monitor.

#### 2026-05-15 5.5 決策：SRT Light Red current segment

- `decision`: approved + downscope。`BKK-SRT-Light-Red` 可下放為獨立 `Commuter` line object seed，但只 seed 現行 Krung Thep Aphiwat ⇄ Taling Chan 的 4-station service；不把 Salaya、Siriraj 或其他 planned extension 併入 current baseline。
- `scope`: Bangkok SRT Light Red Line current western Red Line segment only, station order `Krung Thep Aphiwat` ⇄ `Bang Son` ⇄ `Bang Bamru` ⇄ `Taling Chan`; future Spark owned files are `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs`, `src/train-icon-registry.js`, train icon scripts/assets, generated Thailand shape outputs, and narrow docs. No `app-core.js` / `app-map.js` branch schema work is authorized by this decision.
- `source`: SRTET official fare information lists the Light Red west-side stations `ตลิ่งชัน` / Taling Chan, `บางบำหรุ` / Bang Bamru, `บางซ่อน` / Bang Son, and `กรุงเทพอภิวัฒน์` / Krung Thep Aphiwat in the Red Line fare table; Thailand.go describes the Red Line as SRT suburban electric trains with the Light Red Bang Sue - Taling Chan segment running 05:30-midnight. Sources: https://www.srtet.co.th/th/fare-information and https://thailand.go.th/issue-focus-detail/001_01_098
- `constraints`: Do not merge Dark Red and Light Red into a branch graph. Do not include unbuilt or non-passenger extensions in `RAIL_DATA`. Use current terminal naming (`Krung Thep Aphiwat`) while allowing script-side aliases if OSM still uses older `Bang Sue` naming. Keep the Light Red seed independent from `BKK-SRT-Dark-Red`, with its own template/icon override if the shared SRT Red commuter asset is not visually clear enough.
- `checks`: For this policy-only docs pass, run `git diff --check -- doc/east-asia-expansion-plan.md`. For the future Light Red data seed, run `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing`, `npm.cmd run check:train-icons`, and `npm.cmd run test:smoke`; run `npm.cmd run build:train-icons` if a new Light Red PNG/contact sheet is generated.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 SRT Light Red current-segment gate。`BKK-SRT-Light-Red` 已於後續 5.3 seed 完成；blocked remains：future Salaya/Siriraj extensions and any Red Line branch graph.

#### 2026-05-15 5.5 決策：Pink Line Muang Thong Thani branch

- `decision`: approved + downscope。`BKK-MRT-Pink-Muang-Thong-Thani` 可下放為獨立 `Monorail` branch seed；只做 Pink Line mainline interchange `Muang Thong Thani (PK10)` ⇄ `Impact Muang Thong Thani (MT01)` ⇄ `Lake Muang Thong Thani (MT02)` 的 current branch service。不把 branch 合併進既有 `BKK-MRT-Pink` mainline，不新增 branch graph / service graph / multi-route schema。
- `scope`: Bangkok MRT Pink Line Muang Thong Thani branch only, using the current 3-station path from PK10 to MT02. Future Spark owned files are `src/rail-data.js`, `scripts/fetch-rail-shapes.mjs`, `src/train-icon-registry.js`, train icon scripts/assets, generated Thailand shape outputs, and narrow docs. No `src/app-core.js` / `src/app-map.js` schema work is authorized by this decision.
- `source`: MRTA identifies the Si Rat - Muang Thong Thani extension as a 3.0 km straddle monorail spur from Pink Line station PK10 to two new stations, MT-01 and MT-02. The current Pink Line / Muang Thong Thani Line operator timetable lists PK10 `Muang Thong Thani`, MT01 `Impact Muang Thong Thani`, MT02 `Lake Muang Thong Thani`, and separate Muang Thong Thani Line service intervals. Sources: https://www.mrta.co.th/en/pink-line-extension-si-rat---muang-thong-thani and https://www.ebm.co.th/cms-routemap/WareHouse/TimeTable/PinkLine.pdf
- `constraints`: Do not duplicate all 30 Pink mainline stations inside the branch object. Do not rename or rewrite existing `BKK-MRT-Pink` mainline data or generated shape output in the branch decision pass. Use current operator-facing English station names; allow script-side aliases for older `Si Rat` / `Muang Thong Thani` naming while keeping PK10 as the branch interchange. Reuse the Pink Line monorail template/icon unless future visual QA shows a distinct branch asset is needed.
- `checks`: For this policy-only docs pass, run `git diff --check -- doc/east-asia-expansion-plan.md`. For the future branch data seed, run `npm.cmd run build:rail-data`, `npm.cmd run check:shapes`, `npm.cmd run check:timing`, `npm.cmd run check:train-icons`, and `npm.cmd run test:smoke`; run `npm.cmd run build:train-icons` if a new branch PNG/contact sheet is generated.
- `report`: 新增/修改 region 0、line 0、station 0、train template 0、shape mapping 0、icon 0；完成 1 個 5.5 Pink Line Muang Thong Thani branch gate。`BKK-MRT-Pink-Muang-Thong-Thani` can be scheduled as an independent 3-station branch seed after the active `BKK-SRT-Light-Red` 5.3 work or another cleared queue item; blocked remains：`ERL-KLIA-Ekspres` skip-stop/service-pattern runtime and RTS Link passenger-service monitor.

### 每 1 輪管理規則（共用）
- 5.3 工作可按 `seed` 粒度收斂：每輪至少完成 1 條完整 seed（A+B）並出具 smoke + shape + timing 驗證。
- 5.5 工作完成後才更新 `doc/east-asia-expansion-plan.md` 的「完成/待辦」欄位，避免前後矛盾。
- 任何 `station-to-station` fallback > 1.0 km 持續維持為高優先修正，並附上對應 `maxOffset` 數值。
