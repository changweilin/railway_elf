# Taiwan Route Geometry Audit

Date: 2026-05-16

This audit covers all `RAIL_DATA.taiwan.lines` after loading generated Taiwan
shapes with `loadRailShapesForRegion("taiwan")`.

Status after the remediation pass: no Taiwan line currently has
`maxStationOffsetKm >= 0.5 km`, no modeled Taiwan LRT/metro route has a large
station-span mismatch, and `npm.cmd run check:shapes` passes against the updated
snapshot.

## Remediation Applied

| Line | Previous Issue | Treatment | Current Result |
|---|---|---|---|
| `Tamsui-LRT` | Shape contained extra alignment beyond the modeled 8-station chain, causing `lengthDeltaPct=43.40%` and `崁頂 0.915 km` offset. | Added ordered station projection, relation stop-coordinate snapping, and `trimToStations`. | `totalKm=5.407`, station span `5.407 km`, max offset `0.005 km`. |
| `KHH-Red` | Multiple stations were nearly 1 km from the route and the south end had a long coarse segment. | Added relation stop-coordinate alignment, tighter station snapping, ordered station projection, and `maxShapeSegmentKm=1.0`. | Max offset `0.030 km`; max segment `0.970 km`. |
| `KHH-Orange` | Stitched OSM geometry projected local station kms incorrectly around 鳳山西站/鳳山國中. | Switched this line to the station-chain fallback shape while preserving generated station kms/coords. | Max offset `0.000 km`; station span matches total length. |
| `KHH-LRT` | Partial/coarse LRT chain had high offsets and an 8.20% length mismatch. | Added trim-to-stations and tighter snapping. | Max offset `0.154 km`; station span matches total length. |
| `TPE-Yellow` | Branch route had high station offsets and a 6.15% length mismatch. | Added ordered station projection, relation stop-coordinate alignment, snapping, and trim-to-stations. | Max offset `0.015 km`; station span matches total length. |
| `TPE-Brown` | 萬芳社區 had a km/coordinate mismatch and the line had a long sparse segment. | Added station snapping and `maxShapeSegmentKm=1.0`. | Max offset `0.012 km`; max segment `0.975 km`. |
| `TYMRT` | Several stations around the airport MRT alignment were about 0.8 km from the route. | Added relation stop-coordinate alignment and tighter snapping. | Max offset `0.174 km`. |
| `TRA-Pingxi` | Branch route shape extended beyond modeled station span and 嶺腳 was offset. | Trimmed to modeled stations and tightened snapping. | Max offset `0.122 km`; station span matches total length. |
| `TRA-Neiwan` | Several mid-branch stations were about 0.55-0.58 km from the route. | Trimmed to modeled stations and tightened snapping. | Max offset `0.180 km`. |
| `TRA-Jiji` | Moderate length mismatch and 水里 offset. | Trimmed to modeled stations and tightened snapping. | Max offset `0.199 km`; station span matches total length. |
| `Alishan-Forest` | OSM route extended beyond modeled station span, with several station offsets above 0.5 km. | Trimmed to modeled stations and tightened snapping. | Max offset `0.177 km`; station span matches total length. |
| `TPE-Red`, `TPE-Blue`, `TPE-Green` | Station offsets were acceptable, but shape segments were sparse in urban areas. | Added `maxShapeSegmentKm=1.0`. | Max segment now under `1.0 km` for all three. |

## Current Metrics

| Line | Stations | Shape Pts | Total Km | Span Km | Delta % | Max Offset | Max Nearest | Max Segment |
|---|---:|---:|---:|---:|---:|---|---|---:|
| `TRA-West` | 123 | 1007 | 462.172 | 462.078 | 0.02% | 板橋 `0.087 km` | 板橋 `0.086 km` | `8.103 km` |
| `TRA-Coast` | 17 | 208 | 84.762 | 83.275 | 1.79% | 日南 `0.042 km` | 日南 `0.042 km` | `5.415 km` |
| `THSR` | 12 | 444 | 352.207 | 349.222 | 0.85% | 苗栗 `0.414 km` | 苗栗 `0.412 km` | `16.470 km` |
| `TRA-East` | 76 | 940 | 366.392 | 358.506 | 2.20% | 樹林 `0.256 km` | 樹林 `0.255 km` | `4.927 km` |
| `TRA-South-Link` | 12 | 254 | 98.037 | 98.037 | 0.00% | 大武 `0.163 km` | 大武 `0.162 km` | `2.775 km` |
| `TRA-Pingxi` | 7 | 114 | 11.734 | 11.734 | -0.00% | 菁桐 `0.122 km` | 菁桐 `0.121 km` | `0.397 km` |
| `TRA-Neiwan` | 13 | 120 | 27.870 | 27.870 | -0.00% | 橫山 `0.180 km` | 橫山 `0.180 km` | `1.769 km` |
| `TRA-Jiji` | 7 | 130 | 28.500 | 28.500 | 0.00% | 車埕 `0.199 km` | 車埕 `0.198 km` | `1.726 km` |
| `TRA-Shalun` | 3 | 29 | 8.175 | 8.175 | 0.00% | 沙崙 `0.149 km` | 沙崙 `0.148 km` | `1.816 km` |
| `Alishan-Forest` | 13 | 906 | 72.104 | 72.104 | 0.00% | 多林 `0.177 km` | 多林 `0.177 km` | `2.298 km` |
| `TPE-Red` | 27 | 120 | 28.513 | 28.362 | 0.53% | 大安森林公園 `0.351 km` | 大安森林公園 `0.349 km` | `0.890 km` |
| `TPE-Blue` | 23 | 100 | 26.876 | 26.614 | 0.98% | 南港展覽館 `0.120 km` | 南港展覽館 `0.119 km` | `0.999 km` |
| `TPE-Green` | 19 | 72 | 20.707 | 19.850 | 4.32% | 台電大樓 `0.321 km` | 台電大樓 `0.320 km` | `0.976 km` |
| `TPE-Brown` | 24 | 138 | 25.241 | 25.142 | 0.39% | 大直 `0.012 km` | 大直 `0.012 km` | `0.975 km` |
| `TPE-Yellow` | 17 | 75 | 18.211 | 18.211 | 0.00% | 忠孝新生 `0.015 km` | 忠孝新生 `0.015 km` | `1.816 km` |
| `TYMRT` | 21 | 196 | 50.566 | 50.484 | 0.16% | 橫山 `0.174 km` | 橫山 `0.175 km` | `2.361 km` |
| `KHH-Red` | 24 | 81 | 32.676 | 32.391 | 0.88% | 左營 `0.030 km` | 左營 `0.030 km` | `0.970 km` |
| `KHH-Orange` | 14 | 14 | 14.960 | 14.960 | -0.00% | 鳳山國中 `0.000 km` | 西子灣 `0.000 km` | `2.219 km` |
| `KHH-LRT` | 13 | 31 | 7.204 | 7.204 | -0.00% | 軟體園區 `0.154 km` | 軟體園區 `0.154 km` | `0.915 km` |
| `Tamsui-LRT` | 8 | 32 | 5.407 | 5.407 | 0.00% | 崁頂 `0.005 km` | 崁頂 `0.005 km` | `0.495 km` |

## Remaining Notes

- Intercity lines still have longer sparse segments: `THSR`, `TRA-West`,
  `TRA-Coast`, and `TRA-East`. These are retained because they are not station
  mismatch problems and reflect coarser long-distance generated geometry.
- `KHH-Orange` intentionally uses the station-chain fallback because the OSM
  stitched shape projects the Fengshan-area station kms out of order. Revisit if
  a cleaner upstream relation becomes available.
