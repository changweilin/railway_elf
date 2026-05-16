# 非台灣路線幾何排查清單

日期：2026-05-16

## 範圍與量測方式

本次檢查 `RAIL_DATA` 中台灣以外全部路線，並在 `loadAllRailShapes()` 載入各區 generated shapes 後量測，共 109 條路線。

量測項目：

- `shapePoints`：generated shape 點數；0 代表沒有可用 shape。
- `atKmOffset`：以站點 `km` 在 shape 上取點，再與站點座標計算距離。偏高通常代表 station km 對位或 shape stitch 有問題。
- `nearestOffset`：站點座標到整條 shape 的最近距離。偏高通常代表路線本身沒有穿過站點附近。
- `lengthDeltaPct`：shape 總長與首末站 `km` span 的差異比例。
- `maxSegment`：shape 相鄰兩點最大距離。過大時列為可能缺段、過度簡化或 stitch 跳接候選；長距離 HSR 需再搭配地圖人工判讀。

門檻：

- `critical`：缺 shape，或 `atKmOffset` / `nearestOffset` >= 2 km。
- `high`：`atKmOffset` / `nearestOffset` >= 1 km。
- `review`：`atKmOffset` / `nearestOffset` >= 0.5 km，或 `lengthDeltaPct` 絕對值 > 8%，或出現異常長 segment。

## 優先排查

| 優先 | 區域 | 路線 | 問題 | 量測重點 | 建議方向 |
|---|---|---|---|---|---|
| critical | vietnam | `Hanoi-Metro-3` | 缺 generated shape | `shapePoints=0`, `totalKm=0`, station span 8.5 km | 補 OSM/資料源 mapping 或接受 fallback 前先確認是否應有 shape |
| critical | thailand | `BKK-BTS-Sukhumvit` | station km 對位大偏移，且有長 segment | `Bang Bua atKmOffset=4.772 km`; `Yaek Kor Por Aor nearestOffset=1.043 km`; max segment 5.816 km at 5.820-11.636 | 優先檢查北段站序、OSM relation stitch、stationKms 投影 |
| critical | china | `Shanghai-Metro-2` | 東段多站離 shape 過遠 | `川沙 atKmOffset=4.586 km`; `遠東大道 nearestOffset=2.890 km`; `創新中路 nearestOffset=2.632 km` | 檢查浦東機場方向站點座標/路線 relation 是否錯配 |
| critical | malaysia | `KL-Kelana-Jaya` | Glenmarie 站點與路線距離過大 | `Glenmarie atKmOffset=2.438 km`, `nearestOffset=2.440 km` | 檢查 Glenmarie 附近 station coord 或 shape 是否接到錯線 |
| critical | china | `Shanghai-Metro-1` | 多站與 shape 系統性偏移 | `寶安公路 atKmOffset=2.059 km`, `nearestOffset=2.047 km`; `共富新村 nearestOffset=2.028 km` | 檢查北段/南段站點座標與 shape relation |
| high | china | `Beijing-Subway-1` | 東段站點偏移，且有長 segment | `土橋 atKmOffset=1.504 km`, `nearestOffset=1.498 km`; max segment 6.308 km at 4.068-10.376 | 檢查通州段站點座標與 stitch 缺段 |
| high | thailand | `BKK-MRT-Blue` | station offset 高 | `Lat Phrao atKmOffset=1.664 km`; `Bang Phai nearestOffset=1.267 km` | 分別檢查北段 km 對位與 Bang Phai 附近路線 |
| high | korea | `Busan-Metro-1` | station km 對位偏移 | `동대신 atKmOffset=1.043 km`, `nearestOffset=0.837 km` | nearest 未超過 1 km，較像 stationKms 投影或站序對位問題 |
| high | vietnam | `HCMC-Metro-1` | 站點與路線距離過大 | `Phước Long atKmOffset=1.405 km`, `nearestOffset=1.405 km` | 檢查 Phước Long 座標或 relation 是否偏離 |
| high | vietnam | `Hanoi-Metro-2A` | 站點與路線距離過大 | `Văn Khê atKmOffset=1.139 km`, `nearestOffset=1.135 km` | 檢查 Văn Khê 座標或 generated shape |
| high | hongkong | `MTR-East-Rail` | shape 長度與站點 span 嚴重不一致，且有大跳段 | `totalKm=67.457`, station span 37.539 km, `lengthDeltaPct=79.7%`; max segment 26.072 km at 38.611-64.684 | 高度疑似 stitch 進支線/多餘尾段；檢查 Lo Wu / Lok Ma Chau 分支處理 |

## Review：站點距離 0.5-1 km

| 區域 | 路線 | 量測重點 | 備註 |
|---|---|---|---|
| china | `Beijing-Guangzhou-HSR` | `武漢 atKmOffset=0.597 km`, `nearestOffset=0.597 km`; max segment 37.953 km | 站距偏移不大，但有 HSR 長 segment |
| china | `Beijing-Shanghai-HSR` | `廊坊 atKmOffset=0.680 km`, `nearestOffset=0.678 km`; max segment 94.624 km | 需檢查 741.900-836.523 km 缺段候選 |
| korea | `KTX-Jungang` | `영천 atKmOffset=0.865 km`, `nearestOffset=0.860 km`; max segment 34.934 km | station 與 long segment 都需 review |
| thailand | `BKK-Airport-Rail` | `Hua Mak atKmOffset=0.593 km`, `nearestOffset=0.589 km`; max segment 9.525 km | shape 點數偏少，可能是簡化/缺段 |
| korea | `Seoul-Metro-1` | `주안 atKmOffset=0.857 km`, `nearestOffset=0.852 km` | 站點偏移 review |
| malaysia | `KL-MRT-Kajang` | `Bandar Tun Hussein Onn atKmOffset=0.716 km`, `nearestOffset=0.716 km` | 站點偏移 review |
| korea | `Seoul-Metro-9` | `개화 atKmOffset=0.630 km`, `nearestOffset=0.631 km` | 起點附近偏移 |
| china | `Beijing-Subway-2` | `北京站 atKmOffset=0.677 km`, `nearestOffset=0.675 km` | 多站約 0.6 km 偏移 |
| singapore | `SG-LRT-Bukit-Panjang` | `Teck Whye atKmOffset=0.508 km`; nearest 最大僅 0.008 km | shape 有通過站點附近，較像 km 對位問題 |

## Review：路線連續性 / 長 segment 候選

以下路線未必都有站點距離問題，但 shape 相鄰點距離明顯偏長，後續應在地圖上檢查是否為缺段、過度簡化、跨支線直連或合法長距離 HSR chord。

| 區域 | 路線 | 最大/主要長 segment |
|---|---|---|
| china | `Shanghai-Kunming-HSR` | 129.839 km at 1214.528-1344.367; 119.054 km at 1414.375-1533.429; 77.419 km at 2112.071-2189.490 |
| china | `Beijing-Shanghai-HSR` | 94.624 km at 741.900-836.523; 24.080 km at 877.695-901.775; 21.135 km at 1120.607-1141.742 |
| korea | `KTX-Donghae` | 62.231 km at 281.533-343.765; 48.804 km at 165.778-214.582 |
| korea | `SRT-Donghae` | 62.233 km at 272.668-334.901; 48.159 km at 155.583-203.742; 31.158 km at 223.373-254.531 |
| korea | `KTX-Gyeongjeon` | 61.230 km at 286.613-347.842; 29.314 km at 187.130-216.444; 28.023 km at 238.934-266.957 |
| china | `Beijing-Guangzhou-HSR` | 37.953 km at 460.508-498.462 |
| korea | `KTX-Jungang` | 34.934 km at 255.739-290.673; 27.684 km at 386.459-414.143; 26.586 km at 109.558-136.144 |
| korea | `SRT-Honam` | 29.953 km at 110.545-140.498; 26.326 km at 263.654-289.980; 22.293 km at 316.720-339.013 |
| korea | `SRT-Jeolla` | 29.953 km at 110.545-140.498; 22.081 km at 235.721-257.802 |
| korea | `SRT-Gyeongbu` | 27.883 km at 230.469-258.353; 26.821 km at 178.487-205.309 |
| korea | `KTX-Honam` | 25.212 km at 123.907-149.118 |
| korea | `KTX-Jeolla` | 25.212 km at 123.907-149.118 |
| korea | `KTX-Jungbu-Naeryuk` | 22.806 km at 5.377-28.182; 9.029 km at 84.305-93.333 |
| korea | `SRT-Gyeongjeon` | 20.025 km at 426.245-446.270 |
| korea | `KTX-Gangneung` | 16.817 km at 70.785-87.602 |
| thailand | `BKK-Airport-Rail` | 9.525 km at 12.887-22.411; 5.303 km at 6.562-11.865 |
| thailand | `BKK-MRT-Yellow` | 8.046 km at 0.217-8.263 |
| china | `Beijing-Subway-1` | 6.308 km at 4.068-10.376 |
| thailand | `BKK-BTS-Sukhumvit` | 5.816 km at 5.820-11.636 |
| korea | `Seoul-Metro-2` | 5.715 km at 18.105-23.819 |
| malaysia | `ERL-KLIA-Transit` | 5.545 km at 14.768-20.313 |
| thailand | `BKK-MRT-Pink` | 5.172 km at 17.378-22.551; 4.939 km at 0.749-5.688 |

## 通過本次門檻

其餘 73 條非台灣路線沒有超過上述門檻。既有 `npm.cmd run check:shapes` 也通過，表示目前 generated shape 沒有相對 snapshot 的回歸；本清單是額外的絕對值風險盤點。
