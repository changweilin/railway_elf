# 閉合尾段幾何修正清單

本清單記錄「非環狀路線被上游幾何 stitch 成 P 字形或閉合尾巴」的判斷方式、修法與待確認項目。典型症狀是線尾或分岔點從同一個 junction 繞出去又回來，導致終點後方多出一段閉合 detour。

## 判斷規則

- 高信心同類問題：
  - 非環狀線出現重複座標，且兩次出現之間的路徑長度大於 `0.8 km`。
  - 非環狀線終端附近出現近距離回到同一 junction 的閉合段。
  - 最後一站 km 與 shape `totalKm` 明顯不一致，且尾段本身又有上述閉合特徵。
- 需要人工排除的正常幾何：
  - 真正的環線，例如山手線、大阪環狀線、首爾 2 號線。
  - 真實地形造成的髮夾彎、螺旋線或市中心折返，例如阿里山森林鐵路、新加坡 Downtown Line、釜山 1 號線、Kelana Jaya Line。
- 單純端點尾段不等於同類問題；若沒有閉合或重複 junction，應優先檢查端點定義、上游 shape 範圍、anchor slicing 或 `trimToStations`。

## 標準修法

1. 在生成腳本中保留 stitch 後的主線，移除大型閉合 detour。
2. OSM 來源路線以逐線設定啟用：

   ```js
   removeClosedDetours: { minLoopKm: 1.0 }
   ```

3. TDX 來源路線若 stitch 產生閉合分支，使用同一個 `removeLargeClosedDetours` helper。
4. 若問題不是閉合 detour，不要套用這個修法；改用 `trimToStations`、`corridor`、`stationStops`、或 TDX anchor slicing。
5. 更新資料後依序執行：

   ```powershell
   $env:OFFLINE='1'; npm.cmd run build:rail-data
   node scripts/check-line-shapes.mjs --update
   npm.cmd run check:shapes
   npm.cmd run check:timing
   ```

## 已處理

| 狀態 | 路線 | 問題 | 解法 |
| --- | --- | --- | --- |
| 已修 | `TPE-Green` | 松山端 stitch 出約 `2.5 km` 閉合尾段，造成終點附近呈 P 字形。 | 在 `OSM_LINE_MAP` 對本線加入 `removeClosedDetours: { minLoopKm: 1.0 }`，於 OSM stitch 後移除閉合 detour。修正後 `totalKm` 為 `18.947`，松山為終點 km。 |
| 已有防護 | `TRA-West` | TDX `WL` 曾把桃園附近支線 stitch 回主線，形成大型 closed detour。 | TDX stitch 流程已使用 `removeLargeClosedDetours` 移除同一 junction 繞出又回來的分支。 |

## 本次掃描結果

目前沒有新的高信心未修案例。

掃描條件排除已知環線與真實髮夾彎後，沒有非環狀線同時符合「終端閉合 detour」或「重複 junction 閉合段」條件。唯一的 exact closed coordinate 來自真實環線：

- `JR-Yamanote`
- `JR-Osaka-Loop`
- `Seoul-Metro-2`

## 待確認清單

以下路線只呈現端點尾段或弱訊號，尚不屬於松山綠線同類問題。若未來視覺檢查發現端點形狀異常，再依問題類型選擇 trim、anchor 或 detour removal。

| 優先度 | 路線 | 訊號 | 建議下一步 |
| --- | --- | --- | --- |
| P2 | `TRA-East` | 終端尾段約 `7.886 km`，未偵測到閉合 junction。 | 確認東部幹線資料範圍是否刻意保留端點外延伸；若不是，改用 anchor slicing 或 trim。 |
| P3 | `THSR` | 起點尾段約 `1.440 km`，終點尾段約 `1.545 km`，未偵測到閉合 junction。 | 既有 `snapStationCoordsOverKm` 已處理高鐵站點偏移；只在地圖視覺異常時調整。 |
| P3 | `TRA-Coast` | 終端尾段約 `1.487 km`，未偵測到閉合 junction。 | 檢查海線終端 shape 是否包含台中主線接續段；不要直接套閉合 detour removal。 |
| P3 | `KTX-Gyeongjeon` | 終端尾段約 `1.635 km`，未偵測到閉合 junction。 | 若視覺端點正常，保留；若端點過長，調整來源範圍或 trim。 |
| P3 | `KTX-Honam` | 起點尾段約 `1.447 km`，未偵測到閉合 junction。 | 同上，先做視覺確認。 |
| P3 | `KTX-Jeolla` | 起點尾段約 `1.447 km`，未偵測到閉合 junction。 | 同上，先做視覺確認。 |
| P3 | `SRT-Gyeongjeon` | 終端尾段約 `1.034 km`，未偵測到閉合 junction。 | 同上，先做視覺確認。 |
| P3 | `JKT-MRT-North-South` | 起點尾段約 `0.907 km`，未偵測到閉合 junction。 | 檢查是否為 depot 或上游 shape 端點；必要時 trim。 |

## 不應直接修剪的弱訊號

這些路線有近距離回到附近的形狀，但目前判斷為真實幾何或需人工地圖比對，不應套用閉合 detour removal：

- `Alishan-Forest`
- `SG-MRT-Downtown`
- `Busan-Metro-1`
- `KL-Kelana-Jaya`

