# Railway Elf 後續計畫

更新日期：2026-05-16

本檔只保留尚未完成、阻塞或需要下輪判斷的工作。已完成的 seed 與 5.5 決策不再逐條累積在這裡；需要追溯時用 git history，或查 `doc/east-asia-expansion-plan.md` 的統計與區域脈絡。

## 下一個 5.3 seed

- [ ] `Hanoi-Metro-3`：只建 Hanoi Metro Line 3 current elevated segment（Nhổn ⇄ Cầu Giấy，8 站），沿用 `vietnam` region；不要納入 Cầu Giấy ⇄ Ga Hà Nội 地下段、Hanoi future lines、HCMC Line 2 或其他 future extension。
- [ ] 檔案範圍：`src/rail-data.js`、`scripts/fetch-rail-shapes.mjs`、`src/train-icon-registry.js`、必要 train icon assets/generated shapes，以及窄幅 docs 更新。
- [ ] 驗證：`npm.cmd run build:train-icons`（若新增或重建圖示）、`node --env-file-if-exists=.env scripts/fetch-rail-shapes.mjs --only-lines=Hanoi-Metro-3`、`npm.cmd run build:rail-data`、`npm.cmd run check:train-icons`、`npm.cmd run check:timing`、`npm.cmd run check:shapes`、`npm.cmd run build`、`npm.cmd run test:smoke`。

## 5.5 待判斷

- [ ] `Hanoi-Metro-3` 完成後，再指定下一條 current-service seed；候選池從 Indonesia / Philippines / Vietnam / P2 全球研究項中擇一。
- [ ] P2 全球候選池（瑞士、德國、法國、英國、俄羅斯、印度、荷蘭、瑞典 / 挪威）先做 feasibility gate；不得直接交 5.3 多線落地。國別待辦詳見「P2 全球候選池進度管理」。
- [ ] `BKK-MRT-Orange`、`Penang-Mutiara-LRT`、`SG-MRT-Cross-Island`、`SG-MY-RTS-Link` 只有在正式載客與 official / OSM station data 穩定後才重開 5.5 gate。
- [ ] `ERL-KLIA-Ekspres` late-night all-stations、KTM Komuter short-turn / skipped-station / maintenance timetable、Red Line future extensions、Pink Line branch graph 等仍屬 service-pattern / schema pass，不併入單線 seed。

## P2 全球候選池進度管理

依 `doc/railway-elf-sop.md`，P2 先拆成 5.3 可行性研究與 5.5 gate 兩條進度線管理：5.3 只做範圍清楚、來源可驗證、可用既有 pattern 檢查的研究與代表 seed 風險切割；5.5 負責 region / schema / source / 合規 / 下放條件決策，並用 `decision`、`scope`、`source`、`constraints`、`checks`、`report` 格式回覆。

### 5.3 已完成可行性備忘（每輪留存）

- **2026-05-16 完成 P2-2 瑞士（5.3 feasibility note）**
- 候選線：以蘇黎世都會軸線為先行代表（含德語/法語/意語站序）＋再測 1 條跨境重點都會支線（含法語/意語段）；
  - 來源：SBB 官方站務與時刻資訊、OpenStreetMap route relation / station nodes；
  - OSM 對位風險：站名在德/法/意三語情境下 alias 欠缺時，`name` ↔ `nameEn` 映射需要保留多語別名並先排除停用站；
  - station-to-station 風險：跨地域換乘站重複命名與共線段重疊，首輪只建 `station-to-station` 一對一對位清單，不做 snap 異常修正參數調整；
  - 預估 owned files：`src/rail-data.js`、`scripts/fetch-rail-shapes.mjs`、`src/train-icon-registry.js`、必要 generated shapes / icon assets，以及窄幅 docs（暫不落盤資料）。
- **2026-05-16 完成 P2-3 德國（5.3 feasibility note）**
  - 候選線：優先以柏林 S-Bahn / U-Bahn（城市幹線）與慕尼黑-柏林長距軸線中的一條為 representative seed；先以「城市高頻＋長幹線單向共線」兩組做 station-to-station 對位。
  - 來源：德鐵/各州交通聯盟官方站表（S-Bahn 與地鐵換乘站名冊）、OpenStreetMap route relation / station nodes、區域官方時刻入口輔助比對。
  - OSM 對位風險：`Bahnhof` 常見複名、歷史建築站與新命名混用，`name` / `nameEn` / `name:de` / `loc_name` 需要保留對應 alias；對跨線換乘站需先人工驗證順序是否與官方一致。
  - station-to-station 風險：德國長幹線在城際與區間線重疊處容易導致 snap 跨線吸附，需要先用 representative seed 觀察 `maxOffset` 是否在 0.005–0.01 km 區間穩定。
  - 預估 owned files：`src/rail-data.js`、`scripts/fetch-rail-shapes.mjs`、`src/train-icon-registry.js`、必要 generated shapes / icon assets，以及窄幅 docs（暫不落盤資料）。
- **2026-05-16 完成 P2-4 法國（5.3 feasibility note）**
  - 候選線：先以巴黎 RER A/B/C/D 代表都會軌道與一條長距 Intercités / TER 幹線（如巴黎—里昂走廊）做站序對位對照。
  - 來源：SNCF 官方站名與時刻查詢介面、open data route metadata、OpenStreetMap route relation / station nodes；長距段可補用官方簡版時刻表與站序頁。
  - OSM 對位風險：RER 共線段與進出站命名（法語縮寫）常與官方列表用詞不一致，需先在 representative seed 中建立 `name` / `nameEn` / `name:fr` 對照與可選 alias；RER、TER、Intercités 的站點邏輯可能混用。
  - station-to-station 風險：需檢查都會段轉乘節點（多線共站）是否有「同名不同站」與長距段時刻站名簡寫差異，避免對位誤差造成 snap 假對齊。
  - 預估 owned files：`src/rail-data.js`、`scripts/fetch-rail-shapes.mjs`、`src/train-icon-registry.js`、必要 generated shapes / icon assets，以及窄幅 docs（暫不落盤資料）。
- **2026-05-16 完成 P2-5 英國（5.3 feasibility note）**
  - 候選線：以倫敦區域幹線與跨區幹線做雙面測試，代表為 Central / Northern（高頻都會）＋Great Western / Thameslink（跨區 intercity 分層）；
  - 來源：TfL / National Rail Open Data station 清單、Transport for London line map、OpenStreetMap route relation / station nodes、公開時刻站序頁（作交叉核對）。
  - OSM 對位風險：Zone 與票價區邊界與站務站序混用同名站點時，站序可能偏移；`zone` / `public_transport` 標籤與官方站名格式差異大，需先用 alias 鏈保護。
  - station-to-station 風險：分流服務（分支、晚高峰快慢車、夜間關停）不能直接用來推斷一條穩定 base route，需在 note 中先固定為平峰全程可進出節點順序。
  - 預估 owned files：`src/rail-data.js`、`scripts/fetch-rail-shapes.mjs`、`src/train-icon-registry.js`、必要 generated shapes / icon assets，以及窄幅 docs（暫不落盤資料）。
- **2026-05-16 完成 P2-6 俄羅斯（5.3 feasibility note）**
  - 候選線：先做莫斯科圈層級幹線與一條長距區間幹線 representative seed（含近郊與高速客流段），以驗證跨行政區 station 命名與序列對位。
  - 來源：俄羅斯鐵路官方站務入口（RZD）站表、區域公開路網/時刻檔、OpenStreetMap route relation / station nodes。
  - OSM 對位風險：跨區站名漢字/俄文 translit 與中文/英譯名差異大，`name`、`name:en`、`name:ru` 混用時需採保守 alias；地名重名時需人工去重後才做對位。
  - station-to-station 風險：長距路段存在暫時性施工改線與站務更名，且 OSM/官方更新頻率不一致，須先做「站名對位＋幾何偏離」雙條件 dry run，不直接調整 snap 參數。
  - 5.3 風險邊界：先不下放 5.3 seed，先完成可行性與維運穩定性評估；合規 / 地緣風險納入 5.5 gate。
  - 預估 owned files：`src/rail-data.js`、`scripts/fetch-rail-shapes.mjs`、`src/train-icon-registry.js`、必要 generated shapes / icon assets，以及窄幅 docs（暫不落盤資料）。
- **2026-05-16 完成 P2-7 印度（5.3 feasibility note）**
  - 候選線：以孟買 Suburban、德里 Metro 與一條長距幹線（如 Rajdhani/Golden Chariot 類型）做代表性站序與別名檢核，分別驗證都會高頻與長途規格邏輯。
  - 來源：Indian Railways 車站站名總表、DMRC / MST / 主要都會 MRT 官方站務清單、OpenStreetMap route relation / station nodes、公開到離峰時刻表。
  - OSM 對位風險：多語（印地語/英語/地方語言）站名映射與英文轉寫不統一，`name` / `name:en` / `name:hi` / `name:mr` 可能並列出現；站序中也可能混用本地行政代碼，需要 alias 白名單。
  - station-to-station 風險：都會線與長途線站牌語系切換頻繁，易出現同一站中文拼寫差異、站名更新滯後；須先做 station-to-station 清洗並保留「停用站」例外。
  - 5.3 風險邊界：短期不做運行圖模式展開（分段快慢車、通勤時段分流）與 full station alias 清洗，僅先驗證是否具備 canonical base route 對齊條件。
  - 預估 owned files：`src/rail-data.js`、`scripts/fetch-rail-shapes.mjs`、`src/train-icon-registry.js`、必要 generated shapes / icon assets，以及窄幅 docs（暫不落盤資料）。
- **2026-05-16 完成 P2-8 荷蘭（5.3 feasibility note）**
  - 候選線：以阿姆斯特丹地區高密度幹線（含地鐵與區域捷運）＋一條長距跨城（如 Schiphol—鹿特丹）當作 representative seed，做都會與長距混合風險比對。
  - 來源：NS official 站表與時刻頁、荷蘭 9292/地方交通資料、OpenStreetMap route relation / station nodes、官方路線圖的 station alias 資訊。
  - OSM 對位風險：station names 的停站縮寫與多種語系顯示差異（Dutch / English）導致 alias 需雙向映射；同名站在轉乘 hub 易與鄰近站混淆。
  - station-to-station 風險：高密度都會線上的多站距離短，可能放大 `maxOffset` 導致誤吸附；需以 1–2 條都會線與 1 條長途線分別檢查 `maxOffset` 門檻。
  - 5.3 風險邊界：先不進行 route 分段服務細節建模（夜間/快慢車/短線），僅測站序對位與幾何可行性是否可交付代表 seed baseline。
  - 預估 owned files：`src/rail-data.js`、`scripts/fetch-rail-shapes.mjs`、`src/train-icon-registry.js`、必要 generated shapes / icon assets，以及窄幅 docs（暫不落盤資料）。
- **2026-05-16 完成 P2-9 瑞典/挪威（5.3 feasibility note）**
  - 候選線：先各選一條都會高密度線路（斯德哥爾摩、哥德堡）與一條跨區長途幹線（如斯德哥爾摩—奧斯陸）做 representative seed；同時評估是採 shared Nordic 還是 split region。
  - 來源：Sweden / Norway rail operator station 公開站表、Jernbanekontoret / Trafikverket / Entur 對應站序資源、OpenStreetMap route relation / station nodes、季節性運行公告（北歐高緯度班次調整）。
  - OSM 對位風險：北歐站名存在多語字元與歷史字形差異，`name` / `name:en` / `name:sv` / `name:no` 並存，且有季節性替代名稱；需建立北歐區 shared alias 鏈。
  - station-to-station 風險：跨境長距段時區與通勤服務切分可能造成站序不一致；需以官方站序為主，輔以 OSM 幾何核對，避免 snap 跨邊界錯配。
  - 5.3 風險邊界：先不做冬季/夏季時刻變更與特殊節慶服務展開；本輪僅完成 shared-vs-split 的可行性定位。
  - 預估 owned files：`src/rail-data.js`、`scripts/fetch-rail-shapes.mjs`、`src/train-icon-registry.js`、必要 generated shapes / icon assets，以及窄幅 docs（暫不落盤資料）。

### 5.3 可行性研究待辦

- [ ] 共通交付：每國先產出 1 份代表 seed feasibility note，列出候選線、資料來源、OSM/官方站序可信度、station-to-station 對位風險、預估 owned files；不得直接新增多線資料。
- [ ] 共通檢查：若只更新文件，至少跑 `git diff --check`；若做本地資料試算或代表 seed dry run，補跑對應的 `build:rail-data`、`check:shapes`、`check:timing`、`check:train-icons`。

| 狀態 | 候選 | 5.3 待完成 |
|---|---|---|

### 5.5 Gate 待判斷

- [ ] 共通 gate：每國 5.3 feasibility note 完成後，由 5.5 決定 `approved` / `blocked` / `needs-research` / `downscope`，再指定是否下放單一 5.3 seed；不得一次下放多國或多線。
- [ ] 共通限制：source 授權、region key、i18n alias、service-pattern schema、icon/template 共用策略未決前，不得新增正式 `RAIL_DATA` region / line。

| 狀態 | 候選 | 5.5 待判斷 |
|---|---|---|
| [ ] | P2-3 德國 | 決定 `Commuter` / `Regional` 是否同類建模；先不建 express / short-turn pass；若核准，先切成「高速代表線」或「S-Bahn 代表線」其一。 |
| [ ] | P2-4 法國 | 決定是否允許官方 GTFS / rail op 作為 Level-2 輔助來源；界定 RER / 都會 / 長途幹線的第一輪範圍。 |
| [ ] | P2-5 英國 | 決定是否先採「核心都會網」再擴展 intercity；明確排除 zone fare、夜間與分流服務的首輪建模。 |
| [ ] | P2-7 印度 | 決定 i18n alias 策略與資料更新節奏；避免多語 alias 與高頻更新成本在首輪失控。 |
| [ ] | P2-8 荷蘭 | 決定是否採 `netherlands` 單 region，並共用 icon / train template 策略；可作為中短期第一輪候選。 |
| [ ] | P2-9 瑞典 / 挪威 | 決定 `shared Nordic` 或 split region；界定高緯度 station alias 與季節運作特性是否納入模板邊界。 |

## 文件整理規則

- [ ] 每輪只記錄新的未完成項、monitor 項與 gate；完成後從本檔移除，避免再堆 completed log。
- [ ] `doc/east-asia-expansion-plan.md` 的 active backlog / decision board 只保留未完成或 monitor 項；完整歷史用 git history 追溯。
