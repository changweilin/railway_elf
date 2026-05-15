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

### 5.3 可行性研究待辦

- [ ] 共通交付：每國先產出 1 份代表 seed feasibility note，列出候選線、資料來源、OSM/官方站序可信度、station-to-station 對位風險、預估 owned files；不得直接新增多線資料。
- [ ] 共通檢查：若只更新文件，至少跑 `git diff --check`；若做本地資料試算或代表 seed dry run，補跑對應的 `build:rail-data`、`check:shapes`、`check:timing`、`check:train-icons`。

| 狀態 | 候選 | 5.3 待完成 |
|---|---|---|
| [ ] | P2-2 瑞士 | 盤點 OSM 主幹與都會軌道的 station-to-station 對位品質；確認中德法三語站名在 `name` / `nameEn` 的映射策略。 |
| [ ] | P2-3 德國 | 驗證 `OSM + DB/地方運輸` 的 station 名稱一致性；用代表線測長程共線是否會造成 snap 假異常。 |
| [ ] | P2-4 法國 | 做 RER / 大城都會 + 一條長途幹線代表 seed 的 station / km 對位測試。 |
| [ ] | P2-5 英國 | 測 OSM station 對齊與 zone / branch 站序邏輯；先標出 fare pattern、夜間與分流服務不可併入的邊界。 |
| [ ] | P2-6 俄羅斯 | 研究現有 OSM 對位與長期維運穩定性；暫不安排具體 seed 實作。 |
| [ ] | P2-7 印度 | 比對主要城市鐵道與長途運輸官方 station list 的名詞版差；建立多語 station alias 原型。 |
| [ ] | P2-8 荷蘭 | 測 1–2 條高密度都會線 + 1 條長途連線的 OSM 對位與 maxOffset 控制。 |
| [ ] | P2-9 瑞典 / 挪威 | 評估 `shared Nordic` 或 split region；用都會 + 長途各 1 條 representative seed 做可行性測試。 |

### 5.5 Gate 待判斷

- [ ] 共通 gate：每國 5.3 feasibility note 完成後，由 5.5 決定 `approved` / `blocked` / `needs-research` / `downscope`，再指定是否下放單一 5.3 seed；不得一次下放多國或多線。
- [ ] 共通限制：source 授權、region key、i18n alias、service-pattern schema、icon/template 共用策略未決前，不得新增正式 `RAIL_DATA` region / line。

| 狀態 | 候選 | 5.5 待判斷 |
|---|---|---|
| [ ] | P2-2 瑞士 | 決定是否採 `switzerland` 單 region；先不進入通行費 / 票制模型；若核准，只下放 1 條代表 seed。 |
| [ ] | P2-3 德國 | 決定 `Commuter` / `Regional` 是否同類建模；先不建 express / short-turn pass；若核准，先切成「高速代表線」或「S-Bahn 代表線」其一。 |
| [ ] | P2-4 法國 | 決定是否允許官方 GTFS / rail op 作為 Level-2 輔助來源；界定 RER / 都會 / 長途幹線的第一輪範圍。 |
| [ ] | P2-5 英國 | 決定是否先採「核心都會網」再擴展 intercity；明確排除 zone fare、夜間與分流服務的首輪建模。 |
| [ ] | P2-6 俄羅斯 | 決定是否因政治 / 合規 / 維運條件暫停；預設維持 `monitor-blocked`，除非 5.5 明確重開。 |
| [ ] | P2-7 印度 | 決定 i18n alias 策略與資料更新節奏；避免多語 alias 與高頻更新成本在首輪失控。 |
| [ ] | P2-8 荷蘭 | 決定是否採 `netherlands` 單 region，並共用 icon / train template 策略；可作為中短期第一輪候選。 |
| [ ] | P2-9 瑞典 / 挪威 | 決定 `shared Nordic` 或 split region；界定高緯度 station alias 與季節運作特性是否納入模板邊界。 |

## 文件整理規則

- [ ] 每輪只記錄新的未完成項、monitor 項與 gate；完成後從本檔移除，避免再堆 completed log。
- [ ] `doc/east-asia-expansion-plan.md` 的 active backlog / decision board 只保留未完成或 monitor 項；完整歷史用 git history 追溯。
