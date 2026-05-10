# Railway Elf SOP

本文件記錄 Railway Elf 新增或維護鐵道路線資料的標準流程。目標是讓不熟悉專案的人，也能照順序完成：路線與站點、列車模板、真實軌道形狀、偏差校正、列車圖示、最後驗證。

## 共同原則

- 先更新來源資料，再跑產生器，最後跑檢查腳本。
- 不手改自動產生檔，除非該檔案本身就是產生器的輸出目標。
- 新增任何 region、line id、train type、asset path 時，命名要穩定、ASCII、可讀。
- 同一個名稱若跨國或跨線可能代表不同東西，使用 line-aware 設定，不依賴全域名稱共用。
- 新增流程或特殊校正後，同步更新本 SOP 或相關文件。
- Windows PowerShell 環境若 `npm` 被 Execution Policy 擋下，改用 `npm.cmd`。

## 整體作業順序

新增或擴充一條路線時，依序做：

1. 定義範圍：確認 region、line id、路線名稱、起終點、路線類型、資料來源。
2. 建立 `src/rail-data.js` 的 region、line、station。
3. 建立 train template，讓列車可被 `TrainGen` 產生。
4. 先驗證 station-to-station fallback 可運作。
5. 建立或更新真實軌道來源設定，產生 generated rail shapes。
6. 執行「鐵道路線站點與真實世界偏差分析與校正流程」。
7. 補齊列車圖示 registry；先沿用同國家既有同型號圖示，沒有可沿用資產時才產生新 PNG。
8. 跑發布前檢查。
9. 記錄新來源、已知偏差、校正方式與 snapshot 更新原因。

### 自動化輪次收斂與回報

- 定期執行 SOP 時，以本輪「列車圖示建立與套用」是否完成作為可收斂完成點：先確認同國家既有同型號圖示能否沿用；若沒有可沿用資產，完成新圖示生成、contact sheet 更新與必要圖示檢查後，該輪即可視為完成。
- 若 `git push` 因外部核准或安全審核暫停，記為 push pending；不要因此判定上一輪未完成，也不要阻塞下一輪選新目標。
- 每輪回報需包含資料量與耗時：新增/修改的 region、line、station、train template、shape mapping、icon registry/PNG 數量；執行過的檢查與各自耗時；整輪開始到完成的總耗時。未變更的類別明確標示 0。

## 路線與站點處理流程

### 目標

在 `src/rail-data.js` 建立可被地圖、nearest rail、TrainGen、shape merge 共用的基礎資料。手寫站點資料同時是 fallback，也是投影到真實 shape 的對照基準。

### 主要檔案

- `src/rail-data.js`: region、line、station、trainTemplates、RailUtil、TrainGen。
- `src/app-core.js`: region selector、預設定位、名稱 tag preference、搜尋語言等 UI 設定。
- `src/app-map.js`: 地圖線、站點、列車 marker 呈現。

### Region 規範

新增國家或地區時，在 `RAIL_DATA` 加 region object：

- `label`: UI 顯示名稱。
- `center`: 地圖預設中心 `[lat, lng]`。
- `zoom`: 地圖預設 zoom。
- `lines`: line object array。
- `trainTemplates`: train template array。

新增 region key 後，同步檢查 `src/app-core.js` 內與 region 有關的設定：反向地理編碼語言、OSM name tag preference、預設定位點、地區切換 UI。

### Line 規範

每條 line 至少包含：

- `id`: 穩定 ASCII id。這個 id 會被 train template、shape fetcher、icon registry 共用。
- `name`: 當地語主要名稱。
- `nameEn`: 英文或拉丁轉寫名稱。
- `color`: 地圖線色與 UI 識別色。
- `category`: 路線類別，用於篩選與呈現。
- `directions: { up, down }`: 兩端方向文字，必須和 station order 一致。
- `stations`: 站點 array。

可選欄位：

- `grades`: 地面、地下、高架、隧道區間。只有已知且對地圖有幫助時才加。
- `loopClosureKm`: 環狀線需要閉合時使用。

### Station 規範

每個 station 至少包含：

- `name`: 與 generated `stationKms` / `stationCoords` 對應的 key。名稱要穩定，避免同站不同字形混用。
- `lat` / `lng`: fallback 與初次 projection 用座標。
- `km`: 沿 line 起點累積公里，必須單調遞增。
- `dwellSec`: 只有特殊停站時間需要覆寫時才加。

建立步驟：

1. 收集官方站序、站名、座標、站距或營業公里。
2. 若有官方累積公里，優先採用官方公里；沒有時用站間距估算。
3. 若是環狀線，站表可用起點站重複收尾，但最後一站 km 必須等於總環長。
4. 確認 station order 和 `directions.up/down` 一致。
5. 新增站點後先用 station-to-station fallback 在地圖上確認方向、站序、城市位置合理。

### 完成條件

- line id 可被 `trainTemplates.line`、`OSM_LINE_MAP` / `TDX_LINE_MAP`、icon registry 一致引用。
- station km 單調遞增。
- fallback 線至少連到正確城市或走廊，不出現明顯錯國、錯城市、反向。
- 新增 region 時，地區切換、搜尋語言、預設中心不報錯。

## 列車模板與時序流程

### 目標

用少量 deterministic train templates 產生可展示的列車班次。這不是即時時刻表，而是基於線路、速度、班距、停站時間和加減速模型的預測/展示資料。

### Template 欄位

每個 template 至少包含：

- `line`: 對應 `line.id`。
- `type`: 車種名稱，也是 type fallback 圖示的 key。
- `badge`: marker label 與列表短標籤。
- `badgeColor`: marker label、fallback 圓點與 UI 色。
- `speed`: 營運展示速度，單位 km/h。
- `interval`: 班距，單位分鐘。
- `accel` / `decel`: 加減速度。
- `aLat`: 曲線舒適速度限制使用的 lateral acceleration cap。
- `dwellSec`: 預設停站秒數。

可選欄位：

- `stationIdxStart` / `stationIdxEnd`: 只跑某一段路線時使用。
- 個別 station 的 `dwellSec`: 特定大站停留較久時使用。

### 建立流程

1. 每條 line 先建立 1 個能代表基礎服務的 template。
2. 長距離或多等級路線再加快速、特急、高鐵等 template。
3. `type` 若可能跨國或跨線撞名，圖示必須使用 line-aware override，不依賴 type-only fallback。
4. `badge` 要短，避免 marker label 在手機上過長。
5. `badgeColor` 優先取路線色或服務色；同線多車種需能互相分辨。
6. `speed` 不要直接填設計極速當全程平均，應採用保守的營運展示上限。
7. 地鐵/捷運班距可短，高鐵/長途線班距可長；避免生成過密導致 marker 過多。

### 驗證

```powershell
npm.cmd run check:timing
```

此檢查會驗證：

- 日期沒有 NaN / Invalid Date。
- arrival、departure、下一站 arrival 單調。
- dwellSec 與 arrival/departure 差值一致。
- trip duration 不低於理論下限，也不超過容忍上限。
- segment 的 `kmAtTime` / `timeAtKm` round-trip 誤差小於 1 m。

### 完成條件

- `check:timing` 無 failures。
- 地圖 marker 密度在主要城市 zoom level 不過量。
- train card 的 badge/type 能讓使用者辨識列車等級。

## 建立軌道流程

### 目標

把手寫站表接上真實世界軌道 polyline。沒有真實軌道時，前端會用 station-to-station 直線 fallback；完成軌道流程後，`mergeShapes()` 會用 generated shape 覆蓋 line shape，並用 generated station km 保持動畫與站點一致。

### 主要檔案

- `scripts/fetch-rail-shapes.mjs`: TDX / OSM 抓取、stitch、dedupe、simplify、station projection。
- `scripts/split-rail-shapes.mjs`: 把 `src/rail-data.generated.js` 拆成 per-region dynamic import chunks。
- `src/rail-data.generated.js`: canonical generated shapes，不手改。
- `src/rail-shapes/*.generated.js`: per-region generated chunks，不手改。
- `scripts/line-shape-snapshot.json`: line shape ratchet baseline。

### 資料來源選擇

1. 台灣 TRA / THSR：優先使用 TDX。需要 `.env` 內有 `TDX_CLIENT_ID` / `TDX_CLIENT_SECRET`。
2. 台灣捷運、海外鐵道與地鐵：優先使用 OSM Overpass relation。
3. OSM 品質太差或缺線時，再評估官方 open data；不要直接引入需要商業授權的資料。
4. 來源必須能在 build-time 轉成靜態 shape；前端不可依賴使用者即時呼叫外部 API。

### 新增 OSM 軌道來源

1. 到 Overpass Turbo 用路線名、ref、operator 查 relation：

   ```text
   relation["route"="train"]["name"~"<線名>"]
   relation["route"="subway"]["name"~"<線名>"]
   relation["ref"="<路線代碼>"]
   ```

2. 優先選單方向 route relation，不優先選 route_master。route_master 容易拉入上下行、支線、月台與車庫。
3. 在 `scripts/fetch-rail-shapes.mjs` 的 `OSM_LINE_MAP` 加入 internal line id：

   ```js
   "Internal-Line-Id": {
     name: "Human readable name",
     relationIds: [123456],
   },
   ```

4. 若一條營運線由多個 relation 組成，使用多個 `relationIds`，讓 script stitch。
5. 若是環狀線，加 `loopAnchor`，用起點站附近座標固定 polyline 起點。
6. 若 relation 同時包含上下行、側線、車庫而 stitch 不穩，加 `corridor`，用站點鏈重建 centerline。
7. 若 relation 的 stop/platform members 可對齊站表，加入 `stationStops`，讓 generated `stationCoords` 吸附到 OSM stop member。

### 新增 TDX 軌道來源

1. 確認 `.env` 有 TDX credential；credential 不可 commit。
2. 在 `TDX_LINE_MAP` 加 internal line id 到 TDX LineID 的 mapping。
3. 若一個 TDX LineID 包含多條不相干 segment，使用 `{ lineId, from, to }` anchor slicing，只切出需要的段落。
4. 若 TDX station-of-line 可作權威站表，加入對應 extraction 規則，讓 generated `stations` 直接覆蓋手寫 stub。

### 產生與驗證

1. 只測單線時先用 `--only-lines`，縮短迭代。這個模式會把新結果合併回既有 `rail-data.generated.js`，不會清空其他線：

   ```powershell
   node --env-file-if-exists=.env scripts/fetch-rail-shapes.mjs --only-lines=Internal-Line-Id --refresh-cache
   node scripts/split-rail-shapes.mjs
   ```

2. 全量更新：

   ```powershell
   npm.cmd run build:rail-data
   ```

3. 離線重跑用快取：

   ```powershell
   $env:OFFLINE=1
   npm.cmd run build:rail-data
   Remove-Item Env:OFFLINE
   ```

4. 驗證 shape：

   ```powershell
   npm.cmd run check:shapes
   ```

5. 若新增線通過人工 QA 且只是 snapshot 尚未收錄，更新 snapshot：

   ```powershell
   npm.cmd run check:shapes -- --update
   ```

### 完成條件

- generated shape 存在且對應到正確 internal line id。
- `check:shapes` 無 fail。
- 新增線的 snapshot 已在人工確認後更新。
- 地圖上路線不穿越不合理區域、不反折、不缺主要路段。

## 鐵道路線站點與真實世界偏差分析與校正流程

### 目標

找出手寫站點、generated 軌道形狀、真實世界路線三者之間的偏差，判斷偏差來源，並用最小修改把地圖視覺、站點投影、列車動畫校正到可接受範圍。

### 指標

`npm.cmd run check:shapes` 會輸出每條線：

- `totalKm`: generated polyline 總長。突然變短通常代表 upstream relation 缺段或 corridor 過窄。
- `monotonic`: 站點 km 是否單調。失敗通常代表 polyline 反向、反折、環狀線起點錯、站序錯。
- `maxStationOffsetKm`: 手寫站點座標到該站 km 在 polyline 上投影位置的最大距離。升高代表站點座標、relation stop、shape 或 station km 對不上。
- `shapePoints`: shape 點數。突然大幅下降可能代表抓到錯 relation 或 simplify / corridor 過度。

### 分析流程

1. 重新產生 shape 並取得指標：

   ```powershell
   npm.cmd run build:rail-data
   npm.cmd run check:shapes
   ```

2. 找出異常線：

   - `monotonic = false`: 先處理，這會直接影響動畫。
   - `maxStationOffsetKm` 明顯升高：檢查站點座標與 OSM stop member。
   - `totalKm` 比 snapshot 短超過 5%：檢查 relation 是否缺段、抓到支線或 corridor 過窄。

3. 在地圖上人工檢查該線：

   - 是否沿正確城市/走廊。
   - 是否穿越海面、山區或城市外不合理區域。
   - 是否有直線跨接、折返、繞進車庫、側線、月台群。
   - 站點 dot 是否貼在線上。

4. 判斷偏差來源：

   - 站點座標錯：修 `src/rail-data.js` station lat/lng，或用 generated `stationCoords` 吸附。
   - 站序錯：修 station array 順序與 directions。
   - station km 錯：修手寫 km，或讓 generated `stationKms` 成為權威。
   - OSM relation 錯：換 relation、拆多個 relationIds、避免 route_master。
   - 上下行/側線太多：加或調整 `corridor`。
   - 環狀線起點錯：加或調整 `loopAnchor`。
   - relation stop member 比站表可靠：加 `stationStops`。
   - TDX multi-segment 混線：用 `{ lineId, from, to }` anchor slicing。

### 校正手段

依優先順序使用：

1. 修正來源 mapping：換正確 relation / LineID，或拆成多段 relationIds。
2. 修正站表：站序、站名、座標、km。
3. 加 `loopAnchor`：只用於環狀線或需要固定起點的閉合線。
4. 加 `stationStops`: 用 relation stop/platform members 產生 `stationCoords`。
5. 加 `corridor`: relation 包含上下行、側線、車庫時，用站點鏈重建 centerline。
6. 加 anchor slicing: TDX 或 OSM shape 包含多條不相干 segment 時，只切需要的段。
7. 加 `snapStationCoordsOverKm`: 站點座標偏離 shape 超過門檻時，把站點吸附到投影位置。
8. 最後才調整 snapshot；snapshot 更新只代表接受新狀態，不是修復方法。

### 校正後驗證

1. 重跑：

   ```powershell
   npm.cmd run build:rail-data
   npm.cmd run check:shapes
   npm.cmd run check:timing
   npm.cmd run build
   npm.cmd run test:smoke
   ```

2. 若 `check:shapes` 只剩 new line warning，人工確認地圖與指標合理後才更新 snapshot：

   ```powershell
   npm.cmd run check:shapes -- --update
   ```

3. 在 PR 或 commit 說明記錄：

   - 偏差症狀。
   - 根因判斷。
   - 使用的校正手段。
   - 校正前後 `totalKm`、`maxStationOffsetKm`、`shapePoints`。

### 完成條件

- `monotonic` 必須為 true。
- `maxStationOffsetKm` 沒有超過 snapshot slack，或有明確文件說明接受原因。
- `totalKm` 沒有非預期短少。
- 地圖人工 QA 看起來沿真實鐵道走廊。
- snapshot 只在人工接受後更新。

## 列車圖示建立與套用

### 目標

讓地圖上的 live train marker 使用 256 x 256 透明 PNG 圖示。圖示 lookup 順序固定為：

1. `lineOverrides["${region}|${train.line.id}|${train.type}"]`
2. `typeFallbacks[train.type]`
3. `.train-icon-fallback` 彩色圓點

### 主要檔案

- `src/train-icon-registry.js`: 圖示 registry、line-aware resolver、kind size、marker priority。
- `scripts/build-train-icons.mjs`: 依 registry 的 line overrides 產生 PNG、`train-icon-map.json`、contact sheet。
- `scripts/check-train-icons.mjs`: 驗證所有 train template 都能 resolve 到存在的 256 x 256 alpha PNG。
- `public/assets/train-icons/`: PNG、contact sheet、JSON mirror、README。
- `src/app-map.js`: 地圖 marker 使用 `resolveTrainIcon(train, region)` 套用圖示。

### 新增或更新圖示流程

1. 確認缺圖範圍：

   ```powershell
   npm.cmd run check:train-icons
   ```

   若新增了 train template 但還沒補圖，這個檢查會列出 unresolved key。

2. 先檢查同國家是否已有可沿用的同型號列車圖示：

   - 在 `src/train-icon-registry.js` 搜尋同一個 `region` 的 `lineOverrides`，確認是否已有相同車型、車系、營運者或足夠接近的代表塗裝。
   - 同步檢查 `public/assets/train-icons/<region>-*.png` 與 `train-icons-contact-sheet.png`，避免 registry 尚未覆蓋但資產已存在。
   - 若可沿用，新增目標 `${region}|${lineId}|${trainType}` 的 `lineOverrides`，讓 `icon` 指向既有 PNG；不要為了同型號重複新增 PNG 或 `VISUALS` recipe。
   - 若同國家沒有該型號，或既有圖示會造成車型/塗裝誤認，才進入新圖示生成流程。

3. 在 `src/train-icon-registry.js` 補 registry：

   - 同一個 `train.type` 跨國或跨線可能代表不同車型時，放在 `lineOverrides`。
   - 確定可跨線共用的泛用車種才放在 `typeFallbacks`。
   - `lineOverrides` key 使用 `${region}|${lineId}|${trainType}`。
   - 若沿用既有同國家同型號資產，`icon` path 指向既有 PNG。
   - 若需要新圖示，`icon` path 使用 `assets/train-icons/<region>-<line-id-lowercase>-<service-slug>.png`。

4. 選擇 `kind`：

   - `shinkansen`: 高鐵、新幹線、KTX、中國高鐵。
   - `express`: 機場快線、快速、急行、特急、通勤特急。
   - `commuter`: 一般重鐵通勤車、區間車、普通列車。
   - `metro`: MRT、MTR、BTS、地鐵、城市捷運。
   - `lrt`: 真正輕軌。
   - `heritage`: 阿里山或其他保存/觀光鐵道風格。

5. 只有在沒有可沿用資產時，才在 `scripts/build-train-icons.mjs` 的 `VISUALS` 補同一個 key 的簡化視覺 recipe：

   - `shape`: `shinkansen`、`express`、`commuter`、`metro`、`classic`。
   - `body`: 車體主色。
   - `accent` / `accent2` / `band`: 路線色、服務色或代表塗裝色。
   - 原則是把照片或實車參考濃縮成 24 px 仍能辨識的俯視符號，不追求照片細節。

6. 若新增或修改了 `VISUALS` recipe，產生圖示與 contact sheet：

   ```powershell
   npm.cmd run build:train-icons
   ```

   這會輸出：

   - 新 PNG 到 `public/assets/train-icons/`
   - `public/assets/train-icons/train-icon-map.json`
   - `public/assets/train-icons/train-icons-contact-sheet.png`

7. 視覺 QA：

   - 打開 `public/assets/train-icons/train-icons-contact-sheet.png`。
   - 檢查 256 / 64 / 32 / 24 px 都可辨識。
   - 確認背景透明、沒有文字、沒有商標、沒有殘留色塊。
   - 確認同國家沿用的圖示確實是同型號或可接受的同車系代表圖，不只是同服務名稱。
   - 確認同名但不同國家/路線的列車沒有共用錯圖。

8. 跑檢查：

   ```powershell
   npm.cmd run check:train-icons
   ```

### 完成條件

- 所有 `RAIL_DATA[region].trainTemplates` 都能 resolve 到 PNG 或明確允許 fallback。
- `check:train-icons` 通過。
- 若新增或重生 PNG，`train-icons-contact-sheet.png` 已更新且人工檢查通過。
- 若沿用既有 PNG，registry 指向的既有資產已在 contact sheet 中確認可辨識，且沒有重複生成同型號圖示。
- `src/app-map.js` 沒有重新引入 type-only lookup。

## 發布前檢查

每次新增或修改資料/資產後，至少跑：

```powershell
npm.cmd run check:train-icons
npm.cmd run build
npm.cmd run test:smoke
```

若修改 `src/rail-data.js`、station、line、train template，先加跑：

```powershell
npm.cmd run check:timing
```

若涉及軌道或路線幾何，再加跑：

```powershell
npm.cmd run check:shapes
```

若在受限環境中遇到 Vite config access denied，先確認不是程式錯誤，再於核准後在沙盒外重跑同一指令。
