// Mock train line data — Taiwan (TRA/HSR) + Japan (JR major lines)
// Each line has an array of stations with {name, lat, lng, km} (km = cumulative km from line origin)
// Trains are generated dynamically from templates.
//
// Optional per-line `grades` field — annotates 路線地形 (construction type) by
// km range. Anything not covered defaults to "ground" (平面/地面).
//   grades: [
//     { from: <km>, to: <km>, type: "ground" | "underground" | "elevated", note?: <string> },
//     ...
//   ]
// Conventions:
//   - `from` and `to` are cumulative km in the SAME space as the hand-coded
//     `station.km` values in this file. After shape merge, both station kms
//     and grade kms are linearly remapped onto the polyline together, so they
//     stay aligned. Always author grades using the hand-coded km column —
//     never the post-merge / TDX-projected values.
//   - Segments must be inside [0, lastStation.km], sorted by `from`,
//     non-overlapping.
//   - Omitted ranges are implicitly "ground"; do not list ground segments.
//   - `note` is optional, used for tooltips / debugging only.
// Type values:
//   "underground" — 鐵路地下化 (urban underground project — the line was
//                   intentionally moved beneath the city to grade-separate
//                   from streets).
//   "tunnel"      — 山岳隧道 / 地形隧道 (the line bores through hill or
//                   topography because the surface route is impractical;
//                   distinct from 都會地下化 even though both are below grade).
//   "elevated"    — 鐵路高架化 / viaduct (visibly raised above ground).
//   "ground"      — 平面 / at-grade (default, not listed).

import { RAIL_SHAPES } from "./rail-data.generated.js";

export const RAIL_DATA = {
  taiwan: {
    label: "台灣 Taiwan",
    center: [24.5, 121.0],
    zoom: 8,
    lines: [
      {
        id: "TRA-West",
        name: "台鐵西部幹線",
        nameEn: "TRA West Coast Line",
        color: "#6ee7b7",
        category: "TRA",
        directions: { up: "北上 (往基隆)", down: "南下 (往高雄)" },
        stations: [
          { name: "基隆", lat: 25.1315, lng: 121.7405, km: 0 },
          { name: "台北", lat: 25.0478, lng: 121.5170, km: 28.2, dwellSec: 90 },
          { name: "板橋", lat: 25.0144, lng: 121.4637, km: 35.2, dwellSec: 60 },
          { name: "桃園", lat: 24.9894, lng: 121.3130, km: 51.8 },
          { name: "中壢", lat: 24.9535, lng: 121.2255, km: 63.3 },
          { name: "新竹", lat: 24.8016, lng: 120.9717, km: 104.3 },
          { name: "苗栗", lat: 24.5680, lng: 120.8130, km: 152.7 },
          { name: "台中", lat: 24.1369, lng: 120.6844, km: 198.9 },
          { name: "彰化", lat: 24.0813, lng: 120.5382, km: 215.0 },
          { name: "員林", lat: 23.9581, lng: 120.5717, km: 226.1 },
          { name: "斗六", lat: 23.7111, lng: 120.5419, km: 258.2 },
          { name: "嘉義", lat: 23.4797, lng: 120.4497, km: 288.3 },
          { name: "台南", lat: 22.9972, lng: 120.2111, km: 340.6 },
          { name: "高雄", lat: 22.6393, lng: 120.3020, km: 404.5 },
        ],
        // Approximate annotations of major 鐵路立體化 projects on the West
        // Coast Line. km values are aligned to TDX-canonical station kms after
        // shape merge (see rail-data.generated.js). Ranges are demo-grade
        // (±0.5 km) — refine against 交通部 alignments when adding detail.
        grades: [
          { from: 13.7,  to: 19.7,  type: "elevated",    note: "汐止–南港 高架化" },
          { from: 19.7,  to: 36.1,  type: "underground", note: "南港–松山–板橋 鐵路地下化" },
          { from: 36.1,  to: 41.5,  type: "underground", note: "板橋–樹林 地下化延伸" },
          { from: 179.5, to: 198.0, type: "elevated",    note: "台中鐵路高架化 (豐原–大慶)" },
          { from: 225.2, to: 227.2, type: "elevated",    note: "員林車站高架" },
          { from: 394.3, to: 406.6, type: "underground", note: "高雄鐵路地下化 (左營–鳳山)" },
        ],
      },
      {
        id: "TRA-Coast",
        name: "台鐵海岸線",
        nameEn: "TRA Coast Line",
        color: "#0ea5e9",
        category: "TRA",
        directions: { up: "北上 (往竹南)", down: "南下 (往追分)" },
        // 竹南→追分 (TDX WL-C 海岸線). 真實服務多繼續經 成追線 接彰化,但海線
        // 本身的 polyline 終於追分,因此以追分為南端終點。站點與 km 由 build
        // 步驟由 TDX 寫入 (rail-data.generated.js),這裡的手寫值僅作 fallback。
        stations: [
          { name: "竹南", lat: 24.6856, lng: 120.8755, km: 0,    dwellSec: 60 },
          { name: "談文", lat: 24.6555, lng: 120.8447, km: 4.5  },
          { name: "大山", lat: 24.6037, lng: 120.7958, km: 10.6 },
          { name: "後龍", lat: 24.6121, lng: 120.7867, km: 14.1 },
          { name: "龍港", lat: 24.6463, lng: 120.7700, km: 18.2 },
          { name: "白沙屯", lat: 24.6854, lng: 120.7584, km: 23.1 },
          { name: "新埔", lat: 24.7144, lng: 120.7459, km: 28.2 },
          { name: "通霄", lat: 24.4874, lng: 120.6798, km: 32.0 },
          { name: "苑裡", lat: 24.4421, lng: 120.6510, km: 38.2 },
          { name: "日南", lat: 24.3997, lng: 120.6411, km: 42.6 },
          { name: "大甲", lat: 24.3479, lng: 120.6235, km: 46.4 },
          { name: "台中港", lat: 24.2842, lng: 120.5618, km: 51.6 },
          { name: "清水", lat: 24.2683, lng: 120.5666, km: 55.0 },
          { name: "沙鹿", lat: 24.2342, lng: 120.5660, km: 60.4 },
          { name: "龍井", lat: 24.1929, lng: 120.5466, km: 65.0 },
          { name: "大肚", lat: 24.1500, lng: 120.5400, km: 69.7 },
          { name: "追分", lat: 24.1208, lng: 120.5417, km: 73.2, dwellSec: 60 },
        ],
      },
      {
        id: "THSR",
        name: "台灣高鐵",
        nameEn: "Taiwan High Speed Rail",
        color: "#60a5fa",
        category: "HSR",
        directions: { up: "北上 (往南港)", down: "南下 (往左營)" },
        stations: [
          { name: "南港", lat: 25.0521, lng: 121.6069, km: 0 },
          { name: "台北", lat: 25.0478, lng: 121.5170, km: 9.0, dwellSec: 90 },
          { name: "板橋", lat: 25.0144, lng: 121.4637, km: 15.0, dwellSec: 60 },
          { name: "桃園", lat: 25.0127, lng: 121.2149, km: 45.0 },
          { name: "新竹", lat: 24.8083, lng: 121.0406, km: 80.0 },
          { name: "苗栗", lat: 24.6094, lng: 120.8251, km: 120.0 },
          { name: "台中", lat: 24.1124, lng: 120.6151, km: 175.0 },
          { name: "彰化", lat: 23.8728, lng: 120.5956, km: 215.0 },
          { name: "雲林", lat: 23.7353, lng: 120.4164, km: 240.0 },
          { name: "嘉義", lat: 23.4598, lng: 120.3272, km: 272.0 },
          { name: "台南", lat: 22.9248, lng: 120.2853, km: 325.0 },
          { name: "左營", lat: 22.6870, lng: 120.3082, km: 345.0 },
        ],
        // 台灣高鐵:全線約 73% 高架、18% 隧道、9% 路堤/平面。標出主要區段:
        // 南港–板橋 與台鐵共構地下化、林口隧道、八卦山隧道。其餘整段以
        // 高架為主(本身就是 HSR 的標準工法)。km 採用本檔站點手寫值
        // (南港 0、板橋 15、苗栗 120、台中 175、左營 345)。
        grades: [
          { from: 0,    to: 15,    type: "underground", note: "南港–板橋 共構地下化" },
          { from: 17,   to: 24,    type: "tunnel",      note: "林口隧道(約 7.4 km)" },
          { from: 24,   to: 142,   type: "elevated",    note: "桃園–苗栗 高架(主體)" },
          { from: 142,  to: 150,   type: "tunnel",      note: "八卦山隧道(約 7.4 km)" },
          { from: 150,  to: 345,   type: "elevated",    note: "台中–左營 高架(主體)" },
        ],
      },
      {
        id: "TRA-East",
        name: "台鐵東部幹線",
        nameEn: "TRA East Coast Line",
        color: "#f59e0b",
        category: "TRA",
        directions: { up: "北上 (往樹林)", down: "南下 (往花蓮/台東)" },
        stations: [
          { name: "樹林", lat: 24.9935, lng: 121.4253, km: 0 },
          { name: "板橋", lat: 25.0144, lng: 121.4637, km: 6.3, dwellSec: 60 },
          { name: "台北", lat: 25.0478, lng: 121.5170, km: 13.0, dwellSec: 90 },
          { name: "松山", lat: 25.0497, lng: 121.5774, km: 19.6 },
          { name: "南港", lat: 25.0521, lng: 121.6069, km: 22.7 },
          { name: "八堵", lat: 25.1056, lng: 121.7150, km: 31.6 },
          { name: "瑞芳", lat: 25.1086, lng: 121.8072, km: 39.9 },
          { name: "福隆", lat: 25.0200, lng: 121.9444, km: 57.1 },
          { name: "宜蘭", lat: 24.7548, lng: 121.7619, km: 104.0 },
          { name: "羅東", lat: 24.6779, lng: 121.7664, km: 112.8 },
          { name: "蘇澳新", lat: 24.5985, lng: 121.8286, km: 128.0 },
          { name: "花蓮", lat: 23.9935, lng: 121.6014, km: 211.0, dwellSec: 120 },
          { name: "玉里", lat: 23.3352, lng: 121.3132, km: 290.0 },
          { name: "台東", lat: 22.7930, lng: 121.1243, km: 374.0 },
        ],
        // East Line shares the Taipei underground 隧道 with TRA-West between
        // 樹林 and 南港. km values aligned to TDX-canonical positions.
        grades: [
          { from: 0,    to: 21.6, type: "underground", note: "樹林–南港 鐵路地下化" },
        ],
      },
      {
        id: "TRA-South-Link",
        name: "台鐵南迴線",
        nameEn: "TRA South-Link Line",
        color: "#fb923c",
        category: "TRA",
        directions: { up: "西行 (往枋寮)", down: "東行 (往台東)" },
        stations: [
          { name: "枋寮", lat: 22.3672, lng: 120.5961, km: 0 },
          { name: "加祿", lat: 22.3501, lng: 120.6125, km: 4.4 },
          { name: "內獅", lat: 22.3132, lng: 120.6322, km: 9.0 },
          { name: "枋山", lat: 22.2768, lng: 120.6539, km: 14.0 },
          { name: "古莊", lat: 22.3098, lng: 120.7872, km: 26.7 },
          { name: "大武", lat: 22.3525, lng: 120.9059, km: 45.7 },
          { name: "瀧溪", lat: 22.4631, lng: 120.9555, km: 57.0 },
          { name: "金崙", lat: 22.5325, lng: 120.9684, km: 64.7 },
          { name: "太麻里", lat: 22.6094, lng: 121.0058, km: 73.4 },
          { name: "知本", lat: 22.7060, lng: 121.0640, km: 85.7 },
          { name: "康樂", lat: 22.7619, lng: 121.1078, km: 92.7 },
          { name: "台東", lat: 22.7930, lng: 121.1243, km: 98.2 },
        ],
        // 南迴線:全線多段山岳隧道,下面只標最具代表性的中央隧道。
        // 其餘短隧道未列(後續可細化)。
        grades: [
          { from: 14, to: 22, type: "tunnel", note: "中央隧道(約 8.07 km)" },
        ],
      },
      {
        id: "TRA-Pingxi",
        name: "台鐵平溪線",
        nameEn: "TRA Pingxi Line",
        color: "#fb7185",
        category: "TRA",
        directions: { up: "西行 (往三貂嶺)", down: "東行 (往菁桐)" },
        stations: [
          { name: "三貂嶺", lat: 25.0584, lng: 121.8208, km: 0 },
          { name: "大華", lat: 25.0467, lng: 121.8138, km: 1.7 },
          { name: "十分", lat: 25.0418, lng: 121.7748, km: 5.6 },
          { name: "望古", lat: 25.0438, lng: 121.7595, km: 7.4 },
          { name: "嶺腳", lat: 25.0349, lng: 121.7452, km: 9.0 },
          { name: "平溪", lat: 25.0257, lng: 121.7392, km: 10.6 },
          { name: "菁桐", lat: 25.0252, lng: 121.7271, km: 12.9 },
        ],
      },
      {
        id: "TRA-Neiwan",
        name: "台鐵內灣線",
        nameEn: "TRA Neiwan Line",
        color: "#84cc16",
        category: "TRA",
        directions: { up: "北行 (往新竹)", down: "南行 (往內灣)" },
        stations: [
          { name: "新竹", lat: 24.8016, lng: 120.9717, km: 0 },
          { name: "北新竹", lat: 24.8064, lng: 120.9819, km: 1.0 },
          { name: "千甲", lat: 24.8128, lng: 120.9980, km: 2.7 },
          { name: "新莊", lat: 24.8170, lng: 121.0119, km: 4.0 },
          { name: "竹中", lat: 24.8132, lng: 121.0264, km: 5.8 },
          { name: "上員", lat: 24.7649, lng: 121.0727, km: 9.7 },
          { name: "榮華", lat: 24.7449, lng: 121.0850, km: 11.9 },
          { name: "竹東", lat: 24.7367, lng: 121.0907, km: 14.6 },
          { name: "橫山", lat: 24.7233, lng: 121.1281, km: 19.0 },
          { name: "九讚頭", lat: 24.7242, lng: 121.1404, km: 20.4 },
          { name: "合興", lat: 24.7207, lng: 121.1675, km: 23.3 },
          { name: "富貴", lat: 24.7126, lng: 121.1810, km: 24.8 },
          { name: "內灣", lat: 24.7077, lng: 121.1866, km: 27.1 },
        ],
        // 內灣線:新竹–竹中 都會段 2011 年完工高架化。竹中以南為山區
        // 平面/橋梁路段,未細標。
        grades: [
          { from: 0, to: 5.8, type: "elevated", note: "新竹–竹中 都會高架段" },
        ],
      },
      {
        id: "TRA-Jiji",
        name: "台鐵集集線",
        nameEn: "TRA Jiji Line",
        color: "#a3e635",
        category: "TRA",
        directions: { up: "西行 (往二水)", down: "東行 (往車埕)" },
        stations: [
          { name: "二水", lat: 23.8087, lng: 120.6230, km: 0 },
          { name: "源泉", lat: 23.8159, lng: 120.6526, km: 2.7 },
          { name: "濁水", lat: 23.8302, lng: 120.7008, km: 7.7 },
          { name: "龍泉", lat: 23.8356, lng: 120.7345, km: 11.5 },
          { name: "集集", lat: 23.8284, lng: 120.7869, km: 16.6 },
          { name: "水里", lat: 23.8117, lng: 120.8538, km: 23.2 },
          { name: "車埕", lat: 23.8290, lng: 120.8653, km: 29.7 },
        ],
      },
      {
        id: "TRA-Shalun",
        name: "台鐵沙崙線",
        nameEn: "TRA Shalun Line",
        color: "#fde047",
        category: "TRA",
        directions: { up: "北行 (往中洲)", down: "南行 (往沙崙)" },
        stations: [
          { name: "中洲", lat: 22.9197, lng: 120.2360, km: 0 },
          { name: "長榮大學", lat: 22.9089, lng: 120.2493, km: 2.0 },
          { name: "沙崙", lat: 22.9252, lng: 120.2853, km: 5.3 },
        ],
      },
      {
        id: "Alishan-Forest",
        name: "阿里山林業鐵路",
        nameEn: "Alishan Forest Railway",
        color: "#22c55e",
        category: "TRA",
        directions: { up: "下行 (往嘉義)", down: "上行 (往阿里山)" },
        stations: [
          { name: "嘉義", lat: 23.4797, lng: 120.4497, km: 0 },
          { name: "北門", lat: 23.4847, lng: 120.4597, km: 1.6 },
          { name: "鹿麻產", lat: 23.4892, lng: 120.4877, km: 4.4 },
          { name: "竹崎", lat: 23.5240, lng: 120.5559, km: 14.2 },
          { name: "樟腦寮", lat: 23.5184, lng: 120.6127, km: 23.3 },
          { name: "獨立山", lat: 23.5170, lng: 120.6371, km: 27.4 },
          { name: "梨園寮", lat: 23.5135, lng: 120.6577, km: 32.3 },
          { name: "交力坪", lat: 23.5043, lng: 120.6717, km: 35.6 },
          { name: "水社寮", lat: 23.5093, lng: 120.7035, km: 40.5 },
          { name: "奮起湖", lat: 23.4947, lng: 120.7203, km: 45.7 },
          { name: "多林", lat: 23.4925, lng: 120.7501, km: 50.9 },
          { name: "十字路", lat: 23.4793, lng: 120.7783, km: 55.3 },
          { name: "阿里山", lat: 23.5099, lng: 120.8030, km: 71.4 },
        ],
      },
      {
        id: "TPE-Red",
        name: "台北捷運淡水信義線",
        nameEn: "Taipei Metro Tamsui-Xinyi Line",
        color: "#e2554b",
        category: "Metro",
        directions: { up: "北上 (往淡水)", down: "南下 (往象山)" },
        stations: [
          { name: "淡水", lat: 25.1677, lng: 121.4451, km: 0 },
          { name: "紅樹林", lat: 25.1547, lng: 121.4598, km: 2.0 },
          { name: "竹圍", lat: 25.1366, lng: 121.4598, km: 4.4 },
          { name: "關渡", lat: 25.1257, lng: 121.4671, km: 6.0 },
          { name: "忠義", lat: 25.1308, lng: 121.4736, km: 7.3 },
          { name: "復興崗", lat: 25.1373, lng: 121.4855, km: 8.5 },
          { name: "北投", lat: 25.1322, lng: 121.4985, km: 10.0 },
          { name: "奇岩", lat: 25.1257, lng: 121.5009, km: 11.0 },
          { name: "唭哩岸", lat: 25.1208, lng: 121.5052, km: 11.8 },
          { name: "石牌", lat: 25.1147, lng: 121.5155, km: 13.0 },
          { name: "明德", lat: 25.1086, lng: 121.5189, km: 14.0 },
          { name: "芝山", lat: 25.1029, lng: 121.5221, km: 14.9 },
          { name: "士林", lat: 25.0928, lng: 121.5260, km: 16.1 },
          { name: "劍潭", lat: 25.0850, lng: 121.5253, km: 17.0 },
          { name: "圓山", lat: 25.0712, lng: 121.5197, km: 18.9 },
          { name: "民權西路", lat: 25.0626, lng: 121.5193, km: 20.0 },
          { name: "雙連", lat: 25.0577, lng: 121.5205, km: 20.9 },
          { name: "中山", lat: 25.0526, lng: 121.5204, km: 21.6 },
          { name: "台北車站", lat: 25.0461, lng: 121.5169, km: 22.9 },
          { name: "台大醫院", lat: 25.0421, lng: 121.5176, km: 23.8 },
          { name: "中正紀念堂", lat: 25.0353, lng: 121.5185, km: 24.6 },
          { name: "東門", lat: 25.0339, lng: 121.5285, km: 25.7 },
          { name: "大安森林公園", lat: 25.0303, lng: 121.5360, km: 26.5 },
          { name: "大安", lat: 25.0327, lng: 121.5435, km: 27.6 },
          { name: "信義安和", lat: 25.0331, lng: 121.5527, km: 28.4 },
          { name: "台北101/世貿", lat: 25.0334, lng: 121.5650, km: 29.5 },
          { name: "象山", lat: 25.0327, lng: 121.5705, km: 30.3 },
        ],
        // 淡水信義線:北段(紅樹林~圓山)沿用舊台鐵淡水線高架,圓山以南
        // 全段地下。關渡站本身是地下車站,夾在兩段高架之間。
        grades: [
          { from: 1.0,  to: 5.0,  type: "elevated",    note: "紅樹林–竹圍 高架" },
          { from: 5.0,  to: 6.8,  type: "tunnel",      note: "關渡 隧道(穿越關渡丘陵)" },
          { from: 6.8,  to: 18.0, type: "elevated",    note: "忠義–圓山 高架" },
          { from: 19.5, to: 30.3, type: "underground", note: "民權西路–象山 地下" },
        ],
      },
      {
        id: "TPE-Blue",
        name: "台北捷運板南線",
        nameEn: "Taipei Metro Bannan Line",
        color: "#1763b8",
        category: "Metro",
        directions: { up: "西行 (往頂埔)", down: "東行 (往南港展覽館)" },
        stations: [
          { name: "頂埔", lat: 24.9606, lng: 121.4193, km: 0 },
          { name: "永寧", lat: 24.9667, lng: 121.4361, km: 1.7 },
          { name: "土城", lat: 24.9728, lng: 121.4439, km: 2.7 },
          { name: "海山", lat: 24.9858, lng: 121.4486, km: 4.2 },
          { name: "亞東醫院", lat: 24.9986, lng: 121.4528, km: 5.8 },
          { name: "府中", lat: 25.0083, lng: 121.4592, km: 7.0 },
          { name: "板橋", lat: 25.0144, lng: 121.4637, km: 7.7 },
          { name: "新埔", lat: 25.0218, lng: 121.4685, km: 8.7 },
          { name: "江子翠", lat: 25.0306, lng: 121.4717, km: 10.0 },
          { name: "龍山寺", lat: 25.0353, lng: 121.4998, km: 13.0 },
          { name: "西門", lat: 25.0420, lng: 121.5081, km: 14.2 },
          { name: "台北車站", lat: 25.0461, lng: 121.5169, km: 15.5 },
          { name: "善導寺", lat: 25.0451, lng: 121.5236, km: 16.1 },
          { name: "忠孝新生", lat: 25.0420, lng: 121.5331, km: 17.2 },
          { name: "忠孝復興", lat: 25.0418, lng: 121.5436, km: 18.3 },
          { name: "忠孝敦化", lat: 25.0415, lng: 121.5512, km: 19.0 },
          { name: "國父紀念館", lat: 25.0413, lng: 121.5577, km: 19.6 },
          { name: "市政府", lat: 25.0412, lng: 121.5658, km: 20.5 },
          { name: "永春", lat: 25.0407, lng: 121.5762, km: 21.6 },
          { name: "後山埤", lat: 25.0454, lng: 121.5828, km: 22.5 },
          { name: "昆陽", lat: 25.0509, lng: 121.5945, km: 23.7 },
          { name: "南港", lat: 25.0524, lng: 121.6071, km: 24.9 },
          { name: "南港展覽館", lat: 25.0556, lng: 121.6175, km: 25.9 },
        ],
        // 板南線:頂埔地下站 → 永寧/土城 高架 → 海山以東全段地下化。
        grades: [
          { from: 0,   to: 0.8,  type: "underground", note: "頂埔 地下" },
          { from: 0.8, to: 3.2,  type: "elevated",    note: "永寧–土城 高架" },
          { from: 3.2, to: 25.9, type: "underground", note: "海山–南港展覽館 地下" },
        ],
      },
      {
        id: "TPE-Green",
        name: "台北捷運松山新店線",
        nameEn: "Taipei Metro Songshan-Xindian Line",
        color: "#0e8c4a",
        directions: { up: "南下 (往新店)", down: "北上 (往松山)" },
        category: "Metro",
        stations: [
          { name: "新店", lat: 24.9577, lng: 121.5384, km: 0 },
          { name: "新店區公所", lat: 24.9670, lng: 121.5417, km: 1.0 },
          { name: "七張", lat: 24.9728, lng: 121.5417, km: 1.7 },
          { name: "大坪林", lat: 24.9826, lng: 121.5413, km: 2.9 },
          { name: "景美", lat: 24.9925, lng: 121.5412, km: 4.0 },
          { name: "萬隆", lat: 25.0023, lng: 121.5395, km: 5.1 },
          { name: "公館", lat: 25.0144, lng: 121.5346, km: 6.6 },
          { name: "台電大樓", lat: 25.0244, lng: 121.5285, km: 7.9 },
          { name: "古亭", lat: 25.0270, lng: 121.5226, km: 8.6 },
          { name: "中正紀念堂", lat: 25.0353, lng: 121.5185, km: 9.6 },
          { name: "小南門", lat: 25.0381, lng: 121.5108, km: 10.4 },
          { name: "西門", lat: 25.0420, lng: 121.5081, km: 11.0 },
          { name: "北門", lat: 25.0490, lng: 121.5103, km: 11.9 },
          { name: "中山", lat: 25.0526, lng: 121.5204, km: 13.1 },
          { name: "松江南京", lat: 25.0524, lng: 121.5326, km: 14.5 },
          { name: "南京復興", lat: 25.0521, lng: 121.5440, km: 15.7 },
          { name: "台北小巨蛋", lat: 25.0520, lng: 121.5512, km: 16.5 },
          { name: "南京三民", lat: 25.0517, lng: 121.5681, km: 18.3 },
          { name: "松山", lat: 25.0497, lng: 121.5774, km: 19.4 },
        ],
        // 松山新店線:新店為地下站,南段(新店區公所–公館)沿用舊路堤
        // 高架,古亭以北全段地下化。
        grades: [
          { from: 0,   to: 0.5,  type: "underground", note: "新店 地下" },
          { from: 0.5, to: 7.5,  type: "elevated",    note: "新店區公所–公館 高架" },
          { from: 7.5, to: 19.4, type: "underground", note: "古亭–松山 地下" },
        ],
      },
      {
        id: "TPE-Brown",
        name: "台北捷運文湖線",
        nameEn: "Taipei Metro Wenhu Line",
        color: "#a8744f",
        category: "Metro",
        directions: { up: "南下 (往動物園)", down: "北上 (往南港展覽館)" },
        stations: [
          { name: "動物園", lat: 24.9988, lng: 121.5793, km: 0 },
          { name: "木柵", lat: 25.0001, lng: 121.5683, km: 1.2 },
          { name: "萬芳社區", lat: 25.0021, lng: 121.5713, km: 1.9 },
          { name: "萬芳醫院", lat: 25.0010, lng: 121.5582, km: 3.0 },
          { name: "辛亥", lat: 25.0050, lng: 121.5495, km: 4.0 },
          { name: "麟光", lat: 25.0144, lng: 121.5547, km: 5.0 },
          { name: "六張犁", lat: 25.0233, lng: 121.5535, km: 6.0 },
          { name: "科技大樓", lat: 25.0260, lng: 121.5435, km: 7.2 },
          { name: "大安", lat: 25.0327, lng: 121.5435, km: 7.9 },
          { name: "忠孝復興", lat: 25.0418, lng: 121.5436, km: 8.9 },
          { name: "南京復興", lat: 25.0521, lng: 121.5440, km: 10.0 },
          { name: "中山國中", lat: 25.0612, lng: 121.5443, km: 11.0 },
          { name: "松山機場", lat: 25.0631, lng: 121.5520, km: 11.9 },
          { name: "大直", lat: 25.0795, lng: 121.5471, km: 13.6 },
          { name: "劍南路", lat: 25.0843, lng: 121.5556, km: 14.5 },
          { name: "西湖", lat: 25.0820, lng: 121.5664, km: 15.8 },
          { name: "港墘", lat: 25.0806, lng: 121.5752, km: 16.7 },
          { name: "文德", lat: 25.0775, lng: 121.5859, km: 17.7 },
          { name: "內湖", lat: 25.0838, lng: 121.5944, km: 18.7 },
          { name: "大湖公園", lat: 25.0840, lng: 121.6020, km: 19.5 },
          { name: "葫洲", lat: 25.0721, lng: 121.6075, km: 21.1 },
          { name: "東湖", lat: 25.0668, lng: 121.6152, km: 22.0 },
          { name: "南港軟體園區", lat: 25.0596, lng: 121.6155, km: 23.0 },
          { name: "南港展覽館", lat: 25.0556, lng: 121.6175, km: 24.0 },
        ],
        // 文湖線(中運量):大部分高架,僅松山機場–大直 短段地下化
        // (穿越松山機場跑道)。
        grades: [
          { from: 0,    to: 11.5, type: "elevated",    note: "動物園–中山國中 高架" },
          { from: 11.5, to: 14.0, type: "underground", note: "松山機場–大直 地下" },
          { from: 14.0, to: 24.0, type: "elevated",    note: "劍南路–南港展覽館 高架" },
        ],
      },
      {
        id: "TPE-Yellow",
        name: "台北捷運中和新蘆線",
        nameEn: "Taipei Metro Zhonghe-Xinlu Line",
        color: "#dfa226",
        category: "Metro",
        directions: { up: "北行 (往蘆洲)", down: "南行 (往南勢角)" },
        stations: [
          { name: "南勢角", lat: 24.9883, lng: 121.5099, km: 0 },
          { name: "景安", lat: 24.9929, lng: 121.5054, km: 1.0 },
          { name: "永安市場", lat: 25.0014, lng: 121.5081, km: 2.0 },
          { name: "頂溪", lat: 25.0143, lng: 121.5152, km: 3.6 },
          { name: "古亭", lat: 25.0270, lng: 121.5226, km: 5.4 },
          { name: "東門", lat: 25.0339, lng: 121.5285, km: 6.5 },
          { name: "忠孝新生", lat: 25.0420, lng: 121.5331, km: 7.6 },
          { name: "松江南京", lat: 25.0524, lng: 121.5326, km: 8.8 },
          { name: "行天宮", lat: 25.0613, lng: 121.5326, km: 9.8 },
          { name: "中山國小", lat: 25.0703, lng: 121.5260, km: 11.0 },
          { name: "民權西路", lat: 25.0626, lng: 121.5193, km: 12.0 },
          { name: "大橋頭", lat: 25.0635, lng: 121.5106, km: 13.0 },
          { name: "三重國小", lat: 25.0703, lng: 121.4954, km: 14.4 },
          { name: "三和國中", lat: 25.0760, lng: 121.4895, km: 15.4 },
          { name: "徐匯中學", lat: 25.0817, lng: 121.4830, km: 16.4 },
          { name: "三民高中", lat: 25.0902, lng: 121.4799, km: 17.4 },
          { name: "蘆洲", lat: 25.0891, lng: 121.4654, km: 19.0 },
        ],
        // 中和新蘆線:全線地下化。
        grades: [
          { from: 0, to: 19.0, type: "underground", note: "南勢角–蘆洲 全段地下" },
        ],
      },
      {
        id: "TYMRT",
        name: "桃園機場捷運",
        nameEn: "Taoyuan Airport MRT",
        color: "#9c34a4",
        category: "Metro",
        directions: { up: "東行 (往台北車站)", down: "西行 (往環北)" },
        stations: [
          { name: "台北車站", lat: 25.0461, lng: 121.5169, km: 0 },
          { name: "三重", lat: 25.0596, lng: 121.4853, km: 6.4 },
          { name: "新北產業園區", lat: 25.0631, lng: 121.4570, km: 9.4 },
          { name: "新莊副都心", lat: 25.0436, lng: 121.4593, km: 11.5 },
          { name: "泰山", lat: 25.0497, lng: 121.4382, km: 13.7 },
          { name: "泰山貴和", lat: 25.0395, lng: 121.4194, km: 16.0 },
          { name: "體育大學", lat: 25.0190, lng: 121.3856, km: 22.7 },
          { name: "長庚醫院", lat: 25.0349, lng: 121.3654, km: 25.2 },
          { name: "林口", lat: 25.0702, lng: 121.3608, km: 28.5 },
          { name: "山鼻", lat: 25.0641, lng: 121.3194, km: 31.5 },
          { name: "坑口", lat: 25.0699, lng: 121.2861, km: 34.4 },
          { name: "機場第一航廈", lat: 25.0773, lng: 121.2335, km: 38.7 },
          { name: "機場第二航廈", lat: 25.0732, lng: 121.2316, km: 39.5 },
          { name: "機場旅館", lat: 25.0628, lng: 121.2360, km: 40.7 },
          { name: "大園", lat: 25.0488, lng: 121.2102, km: 43.7 },
          { name: "橫山", lat: 25.0286, lng: 121.2151, km: 45.9 },
          { name: "領航", lat: 25.0188, lng: 121.2329, km: 47.7 },
          { name: "高鐵桃園站", lat: 25.0127, lng: 121.2149, km: 49.7 },
          { name: "桃園體育園區", lat: 25.0064, lng: 121.2257, km: 50.9 },
          { name: "興南", lat: 24.9933, lng: 121.2392, km: 52.5 },
          { name: "環北", lat: 24.9669, lng: 121.2256, km: 54.4 },
        ],
        // 桃園機場捷運:北端與台北車站共構地下,中段轉高架穿越平原,
        // 接近機場端再次入地下,出機場後恢復高架至環北。
        grades: [
          { from: 0,    to: 9.4,  type: "underground", note: "台北車站–新北產業園區 地下" },
          { from: 9.4,  to: 36,   type: "elevated",    note: "新北產業園區–航廈前 高架" },
          { from: 36,   to: 41,   type: "underground", note: "機場第一/第二航廈 地下" },
          { from: 41,   to: 54.4, type: "elevated",    note: "大園–環北 高架" },
        ],
      },
      {
        id: "KHH-Red",
        name: "高雄捷運紅線",
        nameEn: "Kaohsiung MRT Red Line",
        color: "#e2554b",
        category: "Metro",
        directions: { up: "北上 (往南岡山)", down: "南下 (往小港)" },
        stations: [
          { name: "南岡山", lat: 22.7977, lng: 120.2941, km: 0 },
          { name: "岡山", lat: 22.7791, lng: 120.2905, km: 2.3 },
          { name: "橋頭火車站", lat: 22.7592, lng: 120.3013, km: 5.0 },
          { name: "橋頭糖廠", lat: 22.7553, lng: 120.3066, km: 5.5 },
          { name: "青埔", lat: 22.7445, lng: 120.3107, km: 6.6 },
          { name: "都會公園", lat: 22.7263, lng: 120.3125, km: 8.7 },
          { name: "楠梓加工區", lat: 22.7115, lng: 120.3144, km: 10.4 },
          { name: "後勁", lat: 22.6991, lng: 120.3145, km: 11.6 },
          { name: "油廠國小", lat: 22.6868, lng: 120.3134, km: 12.9 },
          { name: "世運", lat: 22.6873, lng: 120.3001, km: 14.6 },
          { name: "左營", lat: 22.6870, lng: 120.3082, km: 15.6 },
          { name: "巨蛋", lat: 22.6726, lng: 120.3023, km: 17.2 },
          { name: "凹子底", lat: 22.6603, lng: 120.3008, km: 18.5 },
          { name: "後驛", lat: 22.6521, lng: 120.3010, km: 19.4 },
          { name: "高雄車站", lat: 22.6395, lng: 120.3023, km: 20.7 },
          { name: "美麗島", lat: 22.6313, lng: 120.3022, km: 21.6 },
          { name: "中央公園", lat: 22.6253, lng: 120.3003, km: 22.4 },
          { name: "三多商圈", lat: 22.6112, lng: 120.3018, km: 23.9 },
          { name: "獅甲", lat: 22.6014, lng: 120.3037, km: 24.9 },
          { name: "凱旋", lat: 22.5921, lng: 120.3074, km: 26.0 },
          { name: "前鎮高中", lat: 22.5746, lng: 120.3140, km: 28.1 },
          { name: "草衙", lat: 22.5651, lng: 120.3296, km: 29.9 },
          { name: "高雄國際機場", lat: 22.5576, lng: 120.3402, km: 31.1 },
          { name: "小港", lat: 22.5650, lng: 120.3576, km: 32.7 },
        ],
        // 高雄捷運紅線:北段延伸(南岡山–都會公園)為全高架;主線
        // 楠梓加工區–小港 全段地下化。
        grades: [
          { from: 0,   to: 8.7,  type: "elevated",    note: "南岡山–都會公園 高架(北段延伸)" },
          { from: 8.7, to: 32.7, type: "underground", note: "楠梓加工區–小港 地下" },
        ],
      },
      {
        id: "KHH-Orange",
        name: "高雄捷運橘線",
        nameEn: "Kaohsiung MRT Orange Line",
        color: "#f99c2a",
        category: "Metro",
        directions: { up: "西行 (往西子灣)", down: "東行 (往大寮)" },
        stations: [
          { name: "西子灣", lat: 22.6201, lng: 120.2670, km: 0 },
          { name: "鹽埕埔", lat: 22.6244, lng: 120.2842, km: 1.7 },
          { name: "市議會", lat: 22.6275, lng: 120.2942, km: 2.7 },
          { name: "美麗島", lat: 22.6313, lng: 120.3022, km: 3.6 },
          { name: "信義國小", lat: 22.6325, lng: 120.3168, km: 5.0 },
          { name: "文化中心", lat: 22.6310, lng: 120.3267, km: 6.0 },
          { name: "五塊厝", lat: 22.6296, lng: 120.3411, km: 7.4 },
          { name: "技擊館", lat: 22.6276, lng: 120.3534, km: 8.6 },
          { name: "衛武營", lat: 22.6249, lng: 120.3622, km: 9.6 },
          { name: "鳳山西站", lat: 22.6266, lng: 120.3531, km: 11.5 },
          { name: "鳳山", lat: 22.6266, lng: 120.3601, km: 12.5 },
          { name: "大東", lat: 22.6266, lng: 120.3681, km: 13.3 },
          { name: "鳳山國中", lat: 22.6196, lng: 120.3801, km: 15.0 },
          { name: "大寮", lat: 22.6055, lng: 120.3954, km: 17.2 },
        ],
        // 高雄捷運橘線:全段地下化。
        grades: [
          { from: 0, to: 17.2, type: "underground", note: "西子灣–大寮 全段地下" },
        ],
      },
      {
        id: "KHH-LRT",
        name: "高雄環狀輕軌",
        nameEn: "Kaohsiung Circular LRT",
        color: "#5dbb46",
        category: "LRT",
        directions: { up: "順行", down: "逆行" },
        stations: [
          { name: "籬仔內", lat: 22.5985, lng: 120.3134, km: 0 },
          { name: "凱旋瑞田", lat: 22.5965, lng: 120.3047, km: 1.0 },
          { name: "前鎮之星", lat: 22.5948, lng: 120.2974, km: 1.8 },
          { name: "凱旋中華", lat: 22.6012, lng: 120.2950, km: 2.5 },
          { name: "夢時代", lat: 22.5983, lng: 120.3068, km: 3.4 },
          { name: "經貿園區", lat: 22.6068, lng: 120.2951, km: 4.5 },
          { name: "軟體園區", lat: 22.6175, lng: 120.2902, km: 5.8 },
          { name: "高雄展覽館", lat: 22.6068, lng: 120.2884, km: 6.8 },
          { name: "高雄圖書館", lat: 22.6125, lng: 120.2891, km: 7.6 },
          { name: "真愛碼頭", lat: 22.6188, lng: 120.2842, km: 8.3 },
          { name: "駁二大義", lat: 22.6196, lng: 120.2774, km: 9.0 },
          { name: "駁二蓬萊", lat: 22.6209, lng: 120.2747, km: 9.5 },
          { name: "哈瑪星", lat: 22.6188, lng: 120.2696, km: 10.1 },
        ],
      },
      {
        id: "Tamsui-LRT",
        name: "淡海輕軌",
        nameEn: "Danhai LRT",
        color: "#48a4cf",
        category: "LRT",
        directions: { up: "北行 (往崁頂)", down: "南行 (往紅樹林)" },
        stations: [
          { name: "紅樹林", lat: 25.1547, lng: 121.4598, km: 0 },
          { name: "竿蓁林", lat: 25.1614, lng: 121.4523, km: 1.0 },
          { name: "淡金鄧公", lat: 25.1685, lng: 121.4499, km: 1.8 },
          { name: "淡金北新", lat: 25.1734, lng: 121.4519, km: 2.5 },
          { name: "新市一路", lat: 25.1801, lng: 121.4571, km: 3.4 },
          { name: "濱海義山", lat: 25.1844, lng: 121.4513, km: 4.3 },
          { name: "濱海沙崙", lat: 25.1908, lng: 121.4475, km: 5.2 },
          { name: "崁頂", lat: 25.1812, lng: 121.4393, km: 6.5 },
        ],
      },
    ],
    trainTemplates: [
      // TRA West — various types. accel/decel in m/s²; aLat is the lateral
      // comfort cap (m/s²) used to derive curve speed limits. dwellSec is the
      // default per non-endpoint stop.
      { line: "TRA-West", type: "自強", badge: "自強", badgeColor: "#f87171", speed: 90,  interval: 30, accel: 0.55, decel: 0.55, aLat: 0.65, dwellSec: 45 },
      { line: "TRA-West", type: "莒光", badge: "莒光", badgeColor: "#fbbf24", speed: 75,  interval: 60, accel: 0.45, decel: 0.50, aLat: 0.55, dwellSec: 60 },
      { line: "TRA-West", type: "區間", badge: "區間", badgeColor: "#60a5fa", speed: 55,  interval: 20, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      // TRA Coast — 海線 has fewer 自強 services and more 區間/區間快 than 山線.
      { line: "TRA-Coast", type: "自強",   badge: "自強",   badgeColor: "#f87171", speed: 85, interval: 60, accel: 0.55, decel: 0.55, aLat: 0.65, dwellSec: 45 },
      { line: "TRA-Coast", type: "區間快", badge: "區間快", badgeColor: "#38bdf8", speed: 70, interval: 60, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      { line: "TRA-Coast", type: "區間",   badge: "區間",   badgeColor: "#60a5fa", speed: 55, interval: 30, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      // THSR — non-tilting high-speed
      { line: "THSR",     type: "高鐵", badge: "HSR",  badgeColor: "#6ee7b7", speed: 260, interval: 15, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      // TRA East — Taroko / Puyuma are tilting EMUs, hence higher aLat.
      { line: "TRA-East", type: "太魯閣", badge: "太魯閣", badgeColor: "#a78bfa", speed: 110, interval: 90, accel: 0.65, decel: 0.65, aLat: 1.30, dwellSec: 45 },
      { line: "TRA-East", type: "普悠瑪", badge: "普悠瑪", badgeColor: "#34d399", speed: 110, interval: 90, accel: 0.65, decel: 0.65, aLat: 1.30, dwellSec: 45 },
      { line: "TRA-East", type: "自強",   badge: "自強",   badgeColor: "#f87171", speed: 95,  interval: 45, accel: 0.55, decel: 0.55, aLat: 0.65, dwellSec: 45 },
      { line: "TRA-East", type: "區間",   badge: "區間",   badgeColor: "#60a5fa", speed: 60,  interval: 30, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      // TRA branches
      { line: "TRA-South-Link", type: "自強", badge: "自強", badgeColor: "#f87171", speed: 90, interval: 60, accel: 0.55, decel: 0.55, aLat: 0.65, dwellSec: 45 },
      { line: "TRA-South-Link", type: "區間", badge: "區間", badgeColor: "#60a5fa", speed: 55, interval: 90, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      { line: "TRA-Pingxi",     type: "區間", badge: "區間", badgeColor: "#60a5fa", speed: 30, interval: 60, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 45 },
      { line: "TRA-Neiwan",     type: "區間", badge: "區間", badgeColor: "#60a5fa", speed: 45, interval: 30, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      { line: "TRA-Jiji",       type: "區間", badge: "區間", badgeColor: "#60a5fa", speed: 45, interval: 60, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      { line: "TRA-Shalun",     type: "區間", badge: "區間", badgeColor: "#60a5fa", speed: 50, interval: 30, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      { line: "Alishan-Forest", type: "阿里山號", badge: "阿里山", badgeColor: "#22c55e", speed: 25, interval: 240, accel: 0.40, decel: 0.50, aLat: 0.45, dwellSec: 60 },
      // Taipei Metro
      { line: "TPE-Red",    type: "捷運", badge: "紅",   badgeColor: "#e2554b", speed: 60, interval: 6, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "TPE-Blue",   type: "捷運", badge: "藍",   badgeColor: "#1763b8", speed: 60, interval: 5, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "TPE-Green",  type: "捷運", badge: "綠",   badgeColor: "#0e8c4a", speed: 60, interval: 6, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "TPE-Brown",  type: "捷運", badge: "文湖", badgeColor: "#a8744f", speed: 50, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 20 },
      { line: "TPE-Yellow", type: "捷運", badge: "黃",   badgeColor: "#dfa226", speed: 60, interval: 7, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      // Taoyuan Airport MRT
      { line: "TYMRT", type: "普通車", badge: "普通", badgeColor: "#9c34a4", speed: 70,  interval: 15, accel: 0.90, decel: 1.00, aLat: 0.95, dwellSec: 30 },
      { line: "TYMRT", type: "直達車", badge: "直達", badgeColor: "#c084fc", speed: 100, interval: 30, accel: 0.90, decel: 1.00, aLat: 0.95, dwellSec: 30 },
      // Kaohsiung MRT
      { line: "KHH-Red",    type: "捷運", badge: "紅", badgeColor: "#e2554b", speed: 60, interval: 8, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "KHH-Orange", type: "捷運", badge: "橘", badgeColor: "#f99c2a", speed: 60, interval: 8, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      // LRT
      { line: "KHH-LRT",    type: "輕軌", badge: "輕軌", badgeColor: "#5dbb46", speed: 30, interval: 12, accel: 0.80, decel: 0.90, aLat: 0.80, dwellSec: 20 },
      { line: "Tamsui-LRT", type: "輕軌", badge: "輕軌", badgeColor: "#48a4cf", speed: 30, interval: 15, accel: 0.80, decel: 0.90, aLat: 0.80, dwellSec: 20 },
    ],
  },

  japan: {
    label: "日本 Japan",
    center: [35.68, 139.76],
    zoom: 9,
    lines: [
      {
        id: "Tokaido-Shinkansen",
        name: "東海道新幹線",
        nameEn: "Tokaido Shinkansen",
        color: "#6ee7b7",
        category: "HSR",
        directions: { up: "上り (東京方面)", down: "下り (新大阪方面)" },
        stations: [
          { name: "東京", lat: 35.6812, lng: 139.7671, km: 0 },
          { name: "品川", lat: 35.6285, lng: 139.7387, km: 6.8, dwellSec: 60 },
          { name: "新横浜", lat: 35.5075, lng: 139.6175, km: 28.8 },
          { name: "小田原", lat: 35.2562, lng: 139.1552, km: 83.9 },
          { name: "熱海", lat: 35.1036, lng: 139.0783, km: 104.6 },
          { name: "三島", lat: 35.1260, lng: 138.9115, km: 120.7 },
          { name: "静岡", lat: 34.9718, lng: 138.3891, km: 180.2 },
          { name: "浜松", lat: 34.7035, lng: 137.7346, km: 257.1 },
          { name: "名古屋", lat: 35.1709, lng: 136.8815, km: 366.0, dwellSec: 90 },
          { name: "京都", lat: 34.9858, lng: 135.7588, km: 513.6 },
          { name: "新大阪", lat: 34.7335, lng: 135.5002, km: 552.6 },
        ],
        // 東海道新幹線:全線約 73% 高架,18% 隧道,9% 路堤。下面只標兩個
        // 主要長隧道(新丹那、日本坂);其餘短隧道未列。
        grades: [
          { from: 0,   to: 96,    type: "elevated",    note: "東京–小田原 高架(主體)" },
          { from: 96,  to: 104,   type: "tunnel",      note: "新丹那トンネル(約 8 km)" },
          { from: 104, to: 190,   type: "elevated",    note: "熱海–静岡 高架/路堤" },
          { from: 190, to: 192.5, type: "tunnel",      note: "日本坂トンネル(約 2.2 km)" },
          { from: 192.5, to: 552.6, type: "elevated",  note: "静岡–新大阪 高架(主體)" },
        ],
      },
      {
        id: "JR-Yamanote",
        name: "山手線",
        nameEn: "JR Yamanote Line",
        color: "#34d399",
        category: "TRA",
        directions: { up: "外回り (澀谷→新宿→池袋)", down: "内回り (池袋→新宿→澀谷)" },
        stations: [
          { name: "東京", lat: 35.6812, lng: 139.7671, km: 0 },
          { name: "神田", lat: 35.6917, lng: 139.7709, km: 1.3 },
          { name: "秋葉原", lat: 35.6983, lng: 139.7731, km: 2.0 },
          { name: "上野", lat: 35.7139, lng: 139.7770, km: 3.6 },
          { name: "日暮里", lat: 35.7278, lng: 139.7709, km: 5.8 },
          { name: "池袋", lat: 35.7295, lng: 139.7109, km: 11.4 },
          { name: "新宿", lat: 35.6896, lng: 139.7006, km: 15.9 },
          { name: "渋谷", lat: 35.6580, lng: 139.7016, km: 20.2 },
          { name: "恵比寿", lat: 35.6466, lng: 139.7101, km: 21.8 },
          { name: "品川", lat: 35.6285, lng: 139.7387, km: 26.0 },
          { name: "田町", lat: 35.6457, lng: 139.7474, km: 28.3 },
          { name: "浜松町", lat: 35.6553, lng: 139.7573, km: 29.6 },
          { name: "有楽町", lat: 35.6749, lng: 139.7631, km: 31.0 },
          { name: "東京", lat: 35.6812, lng: 139.7671, km: 34.5 },
        ],
        // 山手線:東京都心環線,大半路段為高架/路堤(東京-新橋的紅磚
        // 高架橋自 1910 年沿用至今)。為簡化,整環視為 elevated。
        grades: [
          { from: 0, to: 34.5, type: "elevated", note: "山手環線 大部分高架/路堤" },
        ],
      },
      {
        id: "JR-Chuo",
        name: "中央線",
        nameEn: "JR Chuo Rapid Line",
        color: "#fbbf24",
        category: "TRA",
        directions: { up: "上り (往東京)", down: "下り (往高尾)" },
        stations: [
          { name: "東京", lat: 35.6812, lng: 139.7671, km: 0 },
          { name: "神田", lat: 35.6917, lng: 139.7709, km: 1.3 },
          { name: "御茶ノ水", lat: 35.6993, lng: 139.7630, km: 2.6 },
          { name: "四ツ谷", lat: 35.6862, lng: 139.7302, km: 6.6 },
          { name: "新宿", lat: 35.6896, lng: 139.7006, km: 10.3 },
          { name: "中野", lat: 35.7064, lng: 139.6659, km: 14.7 },
          { name: "三鷹", lat: 35.7028, lng: 139.5604, km: 24.1 },
          { name: "国分寺", lat: 35.7006, lng: 139.4803, km: 31.4 },
          { name: "立川", lat: 35.6983, lng: 139.4140, km: 37.5 },
          { name: "八王子", lat: 35.6558, lng: 139.3390, km: 47.4 },
          { name: "高尾", lat: 35.6429, lng: 139.2869, km: 52.4 },
        ],
        // 中央線快速:東京-立川 為著名「中央線連續高架化」工程
        // (三鷹-立川段 2010 年完工),東京-三鷹 早已高架。立川以西
        // 為平面/路堤,未細標。
        grades: [
          { from: 0, to: 37.5, type: "elevated", note: "東京–立川 連續高架化" },
        ],
      },
      {
        id: "Sanyo-Shinkansen",
        name: "山陽新幹線",
        nameEn: "Sanyō Shinkansen",
        color: "#0ea5e9",
        category: "HSR",
        directions: { up: "上り (新大阪方面)", down: "下り (博多方面)" },
        // 山陽新幹線:新大阪↔博多 19 駅 553.7 km。実キロ表記。新大阪以東
        // 直通東海道新幹線、博多以南直通九州新幹線(本表只覆蓋山陽自身)。
        stations: [
          { name: "新大阪",   lat: 34.7335, lng: 135.5002, km: 0,    dwellSec: 90 },
          { name: "新神戸",   lat: 34.7064, lng: 135.1958, km: 32.7 },
          { name: "西明石",   lat: 34.6646, lng: 134.9646, km: 53.2 },
          { name: "姫路",     lat: 34.8369, lng: 134.6911, km: 86.8 },
          { name: "相生",     lat: 34.8027, lng: 134.4622, km: 105.9 },
          { name: "岡山",     lat: 34.6664, lng: 133.9192, km: 164.8, dwellSec: 60 },
          { name: "新倉敷",   lat: 34.5780, lng: 133.7167, km: 187.3 },
          { name: "福山",     lat: 34.4889, lng: 133.3622, km: 217.8 },
          { name: "新尾道",   lat: 34.4467, lng: 133.1717, km: 235.1 },
          { name: "三原",     lat: 34.3997, lng: 133.0789, km: 245.8 },
          { name: "東広島",   lat: 34.4283, lng: 132.7406, km: 280.7 },
          { name: "広島",     lat: 34.3978, lng: 132.4753, km: 309.8, dwellSec: 60 },
          { name: "新岩国",   lat: 34.1614, lng: 132.0433, km: 348.4 },
          { name: "徳山",     lat: 34.0556, lng: 131.8056, km: 391.0 },
          { name: "新山口",   lat: 34.0947, lng: 131.3978, km: 432.6 },
          { name: "厚狭",     lat: 34.0633, lng: 131.0958, km: 465.6 },
          { name: "新下関",   lat: 33.9836, lng: 130.9750, km: 490.1 },
          { name: "小倉",     lat: 33.8869, lng: 130.8825, km: 509.5, dwellSec: 60 },
          { name: "博多",     lat: 33.5897, lng: 130.4206, km: 553.7, dwellSec: 90 },
        ],
        // 山陽新幹線:約半數路段為山岳トンネル(六甲・関門・新神戸前後等
        // 多處長隧道)。下面只標兩處代表性區段,其餘隧道與高架未細列。
        grades: [
          { from: 25,    to: 35,    type: "tunnel",   note: "六甲トンネル (約 16 km, 跨新神戸付近)" },
          { from: 480,   to: 495,   type: "tunnel",   note: "新関門トンネル (約 18.7 km, 海底)" },
        ],
      },
      {
        id: "JR-Osaka-Loop",
        name: "大阪環状線",
        nameEn: "JR Osaka Loop Line",
        color: "#f97316",
        category: "TRA",
        directions: { up: "外回り (天王寺方面 経由 西)", down: "内回り (天王寺方面 経由 東)" },
        // 大阪環状線:全長 21.7 km 環狀。實際營運大量列車跨入 大和路線
        // (奈良方向) 與 阪和線 (関西空港方向);本表只覆蓋環自身。
        // 以「大阪」為錨點:第一站與最後一站同名,表示閉環。
        stations: [
          { name: "大阪",         lat: 34.7025, lng: 135.4959, km: 0,    dwellSec: 30 },
          { name: "福島",         lat: 34.6951, lng: 135.4880, km: 1.0 },
          { name: "野田",         lat: 34.6925, lng: 135.4753, km: 1.9 },
          { name: "西九条",       lat: 34.6802, lng: 135.4644, km: 3.4 },
          { name: "弁天町",       lat: 34.6650, lng: 135.4616, km: 5.4 },
          { name: "大正",         lat: 34.6585, lng: 135.4760, km: 7.4 },
          { name: "芦原橋",       lat: 34.6494, lng: 135.4960, km: 8.5 },
          { name: "今宮",         lat: 34.6491, lng: 135.5045, km: 9.4 },
          { name: "新今宮",       lat: 34.6498, lng: 135.5066, km: 10.0 },
          { name: "天王寺",       lat: 34.6463, lng: 135.5142, km: 11.0, dwellSec: 30 },
          { name: "寺田町",       lat: 34.6519, lng: 135.5256, km: 12.0 },
          { name: "桃谷",         lat: 34.6601, lng: 135.5269, km: 12.9 },
          { name: "鶴橋",         lat: 34.6658, lng: 135.5294, km: 13.9 },
          { name: "玉造",         lat: 34.6747, lng: 135.5304, km: 14.9 },
          { name: "森ノ宮",       lat: 34.6802, lng: 135.5320, km: 15.8 },
          { name: "大阪城公園",   lat: 34.6881, lng: 135.5346, km: 16.7 },
          { name: "京橋",         lat: 34.6968, lng: 135.5343, km: 17.5, dwellSec: 30 },
          { name: "桜ノ宮",       lat: 34.7022, lng: 135.5179, km: 19.0 },
          { name: "天満",         lat: 34.7042, lng: 135.5083, km: 20.4 },
          { name: "大阪",         lat: 34.7025, lng: 135.4959, km: 21.7, dwellSec: 30 },
        ],
        // 大阪環状線:全線高架 / 路堤,無典型「鐵路高架化」工程,但視覺上
        // 整環為都市高架。簡化為單一 elevated 區段。
        grades: [
          { from: 0, to: 21.7, type: "elevated", note: "大阪環状線 全環高架 / 路堤" },
        ],
      },
      {
        id: "Osaka-Metro-Midosuji",
        name: "大阪メトロ御堂筋線",
        nameEn: "Osaka Metro Midōsuji Line",
        color: "#dc2626",
        category: "捷運",
        directions: { up: "上り (江坂方面)", down: "下り (なかもず方面)" },
        // 大阪メトロ M 線:江坂↔なかもず 24.5 km。江坂以北直通 北大阪急行
        // (千里中央方向),本表只覆蓋御堂筋自有區段。
        stations: [
          { name: "江坂",         lat: 34.7592, lng: 135.4979, km: 0,    dwellSec: 30 },
          { name: "東三国",       lat: 34.7480, lng: 135.4974, km: 1.5 },
          { name: "新大阪",       lat: 34.7330, lng: 135.5004, km: 2.5, dwellSec: 30 },
          { name: "西中島南方",   lat: 34.7253, lng: 135.4999, km: 3.5 },
          { name: "中津",         lat: 34.7100, lng: 135.4961, km: 5.3 },
          { name: "梅田",         lat: 34.7039, lng: 135.4988, km: 6.3, dwellSec: 30 },
          { name: "淀屋橋",       lat: 34.6928, lng: 135.5009, km: 7.6 },
          { name: "本町",         lat: 34.6826, lng: 135.4998, km: 8.4 },
          { name: "心斎橋",       lat: 34.6730, lng: 135.4993, km: 9.4 },
          { name: "難波",         lat: 34.6655, lng: 135.5012, km: 10.6, dwellSec: 30 },
          { name: "大国町",       lat: 34.6531, lng: 135.4994, km: 11.9 },
          { name: "動物園前",     lat: 34.6479, lng: 135.5039, km: 13.1 },
          { name: "天王寺",       lat: 34.6463, lng: 135.5142, km: 13.8, dwellSec: 30 },
          { name: "昭和町",       lat: 34.6321, lng: 135.5191, km: 15.4 },
          { name: "西田辺",       lat: 34.6217, lng: 135.5171, km: 16.7 },
          { name: "長居",         lat: 34.6107, lng: 135.5170, km: 17.9 },
          { name: "あびこ",       lat: 34.5980, lng: 135.5168, km: 19.4 },
          { name: "北花田",       lat: 34.5836, lng: 135.5126, km: 21.0 },
          { name: "新金岡",       lat: 34.5705, lng: 135.5128, km: 22.5 },
          { name: "なかもず",     lat: 34.5566, lng: 135.5048, km: 24.5, dwellSec: 30 },
        ],
      },
      {
        id: "Hankyu-Kobe",
        name: "阪急神戸本線",
        nameEn: "Hankyū Kōbe Main Line",
        color: "#7c1d10",
        category: "TRA",
        directions: { up: "上り (大阪梅田方面)", down: "下り (神戸三宮方面)" },
        // 阪急電鐵 神戸本線:大阪梅田↔神戸三宮 32.3 km。本表為特急停站
        // 主要 16 站。各停另外多停若干站,先以特急停車基準上線。
        stations: [
          { name: "大阪梅田",     lat: 34.7058, lng: 135.4974, km: 0,    dwellSec: 30 },
          { name: "中津",         lat: 34.7152, lng: 135.4963, km: 0.9 },
          { name: "十三",         lat: 34.7204, lng: 135.4847, km: 2.4, dwellSec: 30 },
          { name: "神崎川",       lat: 34.7229, lng: 135.4661, km: 4.1 },
          { name: "園田",         lat: 34.7338, lng: 135.4458, km: 6.3 },
          { name: "塚口",         lat: 34.7384, lng: 135.4248, km: 7.9 },
          { name: "武庫之荘",     lat: 34.7359, lng: 135.4047, km: 9.6 },
          { name: "西宮北口",     lat: 34.7405, lng: 135.3556, km: 12.0, dwellSec: 30 },
          { name: "夙川",         lat: 34.7459, lng: 135.3263, km: 14.4 },
          { name: "芦屋川",       lat: 34.7345, lng: 135.3015, km: 16.5 },
          { name: "岡本",         lat: 34.7287, lng: 135.2657, km: 19.6 },
          { name: "御影",         lat: 34.7232, lng: 135.2459, km: 21.6 },
          { name: "六甲",         lat: 34.7184, lng: 135.2247, km: 23.2 },
          { name: "王子公園",     lat: 34.7113, lng: 135.2007, km: 25.6 },
          { name: "春日野道",     lat: 34.7000, lng: 135.1922, km: 27.9 },
          { name: "神戸三宮",     lat: 34.6943, lng: 135.1955, km: 32.3, dwellSec: 30 },
        ],
      },
      {
        id: "Tokyu-Toyoko",
        name: "東急東横線",
        nameEn: "Tōkyū Tōyoko Line",
        color: "#c8102e",
        category: "TRA",
        directions: { up: "上り (渋谷方面)", down: "下り (横浜方面)" },
        // 東急東横線:渋谷↔横浜 24.2 km。澀谷端與東京メトロ副都心線、
        // 横浜端與みなとみらい線直通運轉,但本表只覆蓋東横自有區段。
        stations: [
          { name: "渋谷",       lat: 35.6580, lng: 139.7016, km: 0,    dwellSec: 30 },
          { name: "代官山",     lat: 35.6486, lng: 139.7036, km: 1.5 },
          { name: "中目黒",     lat: 35.6438, lng: 139.6986, km: 2.2 },
          { name: "祐天寺",     lat: 35.6360, lng: 139.6918, km: 3.2 },
          { name: "学芸大学",   lat: 35.6273, lng: 139.6857, km: 4.2 },
          { name: "都立大学",   lat: 35.6166, lng: 139.6809, km: 5.6 },
          { name: "自由が丘",   lat: 35.6072, lng: 139.6691, km: 7.0 },
          { name: "田園調布",   lat: 35.5985, lng: 139.6664, km: 8.2 },
          { name: "多摩川",     lat: 35.5933, lng: 139.6671, km: 9.0 },
          { name: "新丸子",     lat: 35.5871, lng: 139.6595, km: 10.3 },
          { name: "武蔵小杉",   lat: 35.5774, lng: 139.6585, km: 10.8, dwellSec: 30 },
          { name: "元住吉",     lat: 35.5664, lng: 139.6494, km: 12.1 },
          { name: "日吉",       lat: 35.5547, lng: 139.6473, km: 13.6 },
          { name: "綱島",       lat: 35.5388, lng: 139.6357, km: 15.8 },
          { name: "大倉山",     lat: 35.5251, lng: 139.6258, km: 17.3 },
          { name: "菊名",       lat: 35.5119, lng: 139.6280, km: 18.8 },
          { name: "妙蓮寺",     lat: 35.5044, lng: 139.6243, km: 19.8 },
          { name: "白楽",       lat: 35.4969, lng: 139.6262, km: 20.7 },
          { name: "東白楽",     lat: 35.4923, lng: 139.6275, km: 21.4 },
          { name: "反町",       lat: 35.4742, lng: 139.6204, km: 22.6 },
          { name: "横浜",       lat: 35.4661, lng: 139.6219, km: 24.2, dwellSec: 30 },
        ],
      },
      {
        id: "JR-Sobu-Local",
        name: "総武線(各駅停車)",
        nameEn: "JR Sōbu Line (Local)",
        color: "#fde047",
        category: "TRA",
        directions: { up: "上り (三鷹方面)", down: "下り (千葉方面)" },
        // 中央・総武緩行線:三鷹↔千葉 60.2 km。所有車站均停。與中央線快速
        // (本表既有 JR-Chuo) 區隔:Local 通過 大久保 / 代々木 / 信濃町 / 飯田橋
        // 等中央快速通過站。
        stations: [
          { name: "三鷹",       lat: 35.7028, lng: 139.5604, km: 0,    dwellSec: 30 },
          { name: "吉祥寺",     lat: 35.7035, lng: 139.5797, km: 1.6 },
          { name: "西荻窪",     lat: 35.7044, lng: 139.5995, km: 3.5 },
          { name: "荻窪",       lat: 35.7045, lng: 139.6196, km: 5.3 },
          { name: "阿佐ケ谷",   lat: 35.7050, lng: 139.6362, km: 6.7 },
          { name: "高円寺",     lat: 35.7059, lng: 139.6498, km: 7.8 },
          { name: "中野",       lat: 35.7064, lng: 139.6659, km: 9.4 },
          { name: "東中野",     lat: 35.7069, lng: 139.6839, km: 11.4 },
          { name: "大久保",     lat: 35.6997, lng: 139.6982, km: 12.7 },
          { name: "新宿",       lat: 35.6896, lng: 139.7006, km: 13.4, dwellSec: 30 },
          { name: "代々木",     lat: 35.6830, lng: 139.7022, km: 14.2 },
          { name: "千駄ケ谷",   lat: 35.6810, lng: 139.7113, km: 15.0 },
          { name: "信濃町",     lat: 35.6800, lng: 139.7204, km: 15.7 },
          { name: "四ツ谷",     lat: 35.6862, lng: 139.7302, km: 16.7 },
          { name: "市ケ谷",     lat: 35.6909, lng: 139.7351, km: 17.4 },
          { name: "飯田橋",     lat: 35.7022, lng: 139.7448, km: 18.5 },
          { name: "水道橋",     lat: 35.7022, lng: 139.7531, km: 19.3 },
          { name: "御茶ノ水",   lat: 35.6993, lng: 139.7630, km: 20.1 },
          { name: "秋葉原",     lat: 35.6983, lng: 139.7731, km: 21.1 },
          { name: "浅草橋",     lat: 35.7011, lng: 139.7853, km: 22.0 },
          { name: "両国",       lat: 35.6968, lng: 139.7935, km: 22.9 },
          { name: "錦糸町",     lat: 35.6970, lng: 139.8132, km: 24.1 },
          { name: "亀戸",       lat: 35.6979, lng: 139.8262, km: 25.4 },
          { name: "平井",       lat: 35.7058, lng: 139.8404, km: 26.9 },
          { name: "新小岩",     lat: 35.7166, lng: 139.8567, km: 28.7 },
          { name: "小岩",       lat: 35.7335, lng: 139.8830, km: 31.8 },
          { name: "市川",       lat: 35.7314, lng: 139.9088, km: 35.4, dwellSec: 30 },
          { name: "本八幡",     lat: 35.7218, lng: 139.9286, km: 37.5 },
          { name: "下総中山",   lat: 35.7080, lng: 139.9494, km: 39.1 },
          { name: "西船橋",     lat: 35.7039, lng: 139.9684, km: 40.6 },
          { name: "船橋",       lat: 35.7019, lng: 139.9856, km: 42.6, dwellSec: 30 },
          { name: "東船橋",     lat: 35.7065, lng: 140.0050, km: 44.3 },
          { name: "津田沼",     lat: 35.6948, lng: 140.0246, km: 46.1 },
          { name: "幕張本郷",   lat: 35.6824, lng: 140.0469, km: 48.1 },
          { name: "幕張",       lat: 35.6629, lng: 140.0635, km: 49.8 },
          { name: "新検見川",   lat: 35.6606, lng: 140.0867, km: 51.3 },
          { name: "稲毛",       lat: 35.6383, lng: 140.1115, km: 53.6 },
          { name: "西千葉",     lat: 35.6260, lng: 140.1252, km: 55.0 },
          { name: "千葉",       lat: 35.6135, lng: 140.1126, km: 60.2, dwellSec: 30 },
        ],
      },
      {
        id: "JR-Keihin-Tohoku",
        name: "京浜東北線",
        nameEn: "JR Keihin-Tōhoku Line",
        color: "#60a5fa",
        category: "TRA",
        directions: { up: "北行 (大宮方面)", down: "南行 (大船方面)" },
        // 京浜東北・根岸線 大宮↔大船 全線 81.2 km。實際營運跨 JR 東北本線
        // (大宮↔東京) + 東海道本線 (東京↔横浜) + 根岸線 (横浜↔大船),
        // 採同一路線運營,本表合併視為單線。
        stations: [
          { name: "大宮",             lat: 35.9059, lng: 139.6234, km: 0,    dwellSec: 30 },
          { name: "さいたま新都心",   lat: 35.8943, lng: 139.6294, km: 1.6 },
          { name: "与野",             lat: 35.8784, lng: 139.6349, km: 2.7 },
          { name: "北浦和",           lat: 35.8639, lng: 139.6444, km: 4.5 },
          { name: "浦和",             lat: 35.8589, lng: 139.6566, km: 6.4, dwellSec: 30 },
          { name: "南浦和",           lat: 35.8419, lng: 139.6630, km: 8.6 },
          { name: "蕨",               lat: 35.8264, lng: 139.6800, km: 11.4 },
          { name: "西川口",           lat: 35.8055, lng: 139.7108, km: 14.2 },
          { name: "川口",             lat: 35.7927, lng: 139.7224, km: 15.8 },
          { name: "赤羽",             lat: 35.7775, lng: 139.7211, km: 18.0, dwellSec: 30 },
          { name: "東十条",           lat: 35.7675, lng: 139.7228, km: 19.5 },
          { name: "王子",             lat: 35.7530, lng: 139.7384, km: 21.4 },
          { name: "上中里",           lat: 35.7429, lng: 139.7468, km: 23.2 },
          { name: "田端",             lat: 35.7378, lng: 139.7610, km: 24.2 },
          { name: "西日暮里",         lat: 35.7320, lng: 139.7670, km: 25.2 },
          { name: "日暮里",           lat: 35.7278, lng: 139.7709, km: 26.0 },
          { name: "鶯谷",             lat: 35.7215, lng: 139.7783, km: 27.1 },
          { name: "上野",             lat: 35.7139, lng: 139.7770, km: 28.0, dwellSec: 30 },
          { name: "御徒町",           lat: 35.7074, lng: 139.7748, km: 28.6 },
          { name: "秋葉原",           lat: 35.6983, lng: 139.7731, km: 29.6 },
          { name: "神田",             lat: 35.6917, lng: 139.7709, km: 30.3 },
          { name: "東京",             lat: 35.6812, lng: 139.7671, km: 31.1, dwellSec: 30 },
          { name: "有楽町",           lat: 35.6749, lng: 139.7631, km: 31.7 },
          { name: "新橋",             lat: 35.6661, lng: 139.7585, km: 32.8 },
          { name: "浜松町",           lat: 35.6553, lng: 139.7573, km: 33.9 },
          { name: "田町",             lat: 35.6457, lng: 139.7474, km: 34.8 },
          { name: "高輪ゲートウェイ", lat: 35.6358, lng: 139.7402, km: 35.7 },
          { name: "品川",             lat: 35.6285, lng: 139.7387, km: 36.4, dwellSec: 30 },
          { name: "大井町",           lat: 35.6065, lng: 139.7344, km: 39.6 },
          { name: "大森",             lat: 35.5871, lng: 139.7282, km: 41.7 },
          { name: "蒲田",             lat: 35.5614, lng: 139.7164, km: 44.3 },
          { name: "川崎",             lat: 35.5311, lng: 139.6967, km: 47.0, dwellSec: 30 },
          { name: "鶴見",             lat: 35.5076, lng: 139.6766, km: 50.9 },
          { name: "新子安",           lat: 35.4948, lng: 139.6602, km: 53.4 },
          { name: "東神奈川",         lat: 35.4748, lng: 139.6326, km: 55.5 },
          { name: "横浜",             lat: 35.4661, lng: 139.6219, km: 56.6, dwellSec: 30 },
          { name: "桜木町",           lat: 35.4513, lng: 139.6314, km: 57.8 },
          { name: "関内",             lat: 35.4428, lng: 139.6391, km: 58.8 },
          { name: "石川町",           lat: 35.4394, lng: 139.6486, km: 59.4 },
          { name: "山手",             lat: 35.4313, lng: 139.6526, km: 60.6 },
          { name: "根岸",             lat: 35.4053, lng: 139.6362, km: 62.9 },
          { name: "磯子",             lat: 35.3865, lng: 139.6312, km: 65.8 },
          { name: "新杉田",           lat: 35.3733, lng: 139.6231, km: 67.4 },
          { name: "洋光台",           lat: 35.3625, lng: 139.6028, km: 70.3 },
          { name: "港南台",           lat: 35.3585, lng: 139.5867, km: 72.6 },
          { name: "本郷台",           lat: 35.3551, lng: 139.5670, km: 74.7 },
          { name: "大船",             lat: 35.3578, lng: 139.5304, km: 81.2, dwellSec: 30 },
        ],
      },
      {
        id: "Tokyo-Metro-Marunouchi",
        name: "東京メトロ丸ノ内線",
        nameEn: "Tokyo Metro Marunouchi Line",
        color: "#f43f5e",
        category: "捷運",
        directions: { up: "A線 (池袋方面)", down: "B線 (荻窪方面)" },
        // 本表只列本線 池袋–荻窪 25 站 (24.2 km),不含中野坂上–方南町支線。
        stations: [
          { name: "池袋",         lat: 35.7295, lng: 139.7109, km: 0,    dwellSec: 30 },
          { name: "新大塚",       lat: 35.7314, lng: 139.7286, km: 1.2 },
          { name: "茗荷谷",       lat: 35.7172, lng: 139.7402, km: 2.0 },
          { name: "後楽園",       lat: 35.7066, lng: 139.7521, km: 3.4 },
          { name: "本郷三丁目",   lat: 35.7077, lng: 139.7613, km: 4.3 },
          { name: "御茶ノ水",     lat: 35.6993, lng: 139.7630, km: 5.3 },
          { name: "淡路町",       lat: 35.6932, lng: 139.7670, km: 6.0 },
          { name: "大手町",       lat: 35.6855, lng: 139.7666, km: 7.0 },
          { name: "東京",         lat: 35.6812, lng: 139.7671, km: 7.8, dwellSec: 30 },
          { name: "銀座",         lat: 35.6720, lng: 139.7649, km: 8.9, dwellSec: 30 },
          { name: "霞ケ関",       lat: 35.6735, lng: 139.7521, km: 10.0 },
          { name: "国会議事堂前", lat: 35.6745, lng: 139.7458, km: 10.6 },
          { name: "赤坂見附",     lat: 35.6772, lng: 139.7372, km: 11.5 },
          { name: "四ツ谷",       lat: 35.6862, lng: 139.7302, km: 12.4 },
          { name: "四谷三丁目",   lat: 35.6885, lng: 139.7211, km: 13.1 },
          { name: "新宿御苑前",   lat: 35.6878, lng: 139.7104, km: 14.0 },
          { name: "新宿三丁目",   lat: 35.6911, lng: 139.7048, km: 14.7 },
          { name: "新宿",         lat: 35.6896, lng: 139.7006, km: 15.4, dwellSec: 30 },
          { name: "西新宿",       lat: 35.6938, lng: 139.6929, km: 16.4 },
          { name: "中野坂上",     lat: 35.6953, lng: 139.6818, km: 17.6 },
          { name: "新中野",       lat: 35.6986, lng: 139.6680, km: 18.7 },
          { name: "東高円寺",     lat: 35.7048, lng: 139.6584, km: 19.7 },
          { name: "新高円寺",     lat: 35.7034, lng: 139.6504, km: 20.6 },
          { name: "南阿佐ケ谷",   lat: 35.7028, lng: 139.6383, km: 21.7 },
          { name: "荻窪",         lat: 35.7045, lng: 139.6196, km: 24.2, dwellSec: 30 },
        ],
        // 丸ノ内線:幾乎全段地下;唯後楽園–茗荷谷之間有一段地表/高架
        // (神田川沿線),約 0.3 km。category="捷運" 已隱含地下化,僅標
        // 高架特例。
        grades: [
          { from: 2.4, to: 3.0, type: "elevated", note: "茗荷谷–後楽園 神田川高架段" },
        ],
      },
      {
        id: "Tokyo-Metro-Ginza",
        name: "東京メトロ銀座線",
        nameEn: "Tokyo Metro Ginza Line",
        color: "#f59a0c",
        category: "捷運",
        directions: { up: "A線 (浅草方面)", down: "B線 (渋谷方面)" },
        stations: [
          { name: "浅草",       lat: 35.7106, lng: 139.7976, km: 0,    dwellSec: 30 },
          { name: "田原町",     lat: 35.7099, lng: 139.7917, km: 0.6 },
          { name: "稲荷町",     lat: 35.7113, lng: 139.7841, km: 1.3 },
          { name: "上野",       lat: 35.7117, lng: 139.7773, km: 2.2, dwellSec: 30 },
          { name: "上野広小路", lat: 35.7079, lng: 139.7747, km: 2.7 },
          { name: "末広町",     lat: 35.7027, lng: 139.7717, km: 3.3 },
          { name: "神田",       lat: 35.6917, lng: 139.7709, km: 4.4 },
          { name: "三越前",     lat: 35.6873, lng: 139.7727, km: 5.0 },
          { name: "日本橋",     lat: 35.6814, lng: 139.7740, km: 5.7 },
          { name: "京橋",       lat: 35.6770, lng: 139.7706, km: 6.4 },
          { name: "銀座",       lat: 35.6720, lng: 139.7649, km: 7.1, dwellSec: 30 },
          { name: "新橋",       lat: 35.6661, lng: 139.7585, km: 8.0 },
          { name: "虎ノ門",     lat: 35.6695, lng: 139.7493, km: 8.8 },
          { name: "溜池山王",   lat: 35.6738, lng: 139.7411, km: 9.6 },
          { name: "赤坂見附",   lat: 35.6772, lng: 139.7372, km: 10.1 },
          { name: "青山一丁目", lat: 35.6726, lng: 139.7228, km: 11.6 },
          { name: "外苑前",     lat: 35.6691, lng: 139.7170, km: 12.3 },
          { name: "表参道",     lat: 35.6651, lng: 139.7126, km: 12.9 },
          { name: "渋谷",       lat: 35.6580, lng: 139.7016, km: 14.3, dwellSec: 30 },
        ],
        // 銀座線:東京最古老地鐵,自浅草至虎ノ門段為淺層地下;
        // 渋谷站位於高架(東口三樓),整段沒有典型「鐵路高架化」工程,
        // 故僅標渋谷端的高架接駁。其餘地下化由 category="捷運" 隱含。
        grades: [
          { from: 13.6, to: 14.3, type: "elevated", note: "渋谷站高架月台 (東急東横與銀座線共構)" },
        ],
      },
    ],
    trainTemplates: [
      { line: "Tokaido-Shinkansen", type: "のぞみ",     badge: "のぞみ", badgeColor: "#6ee7b7", speed: 270, interval: 10, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Tokaido-Shinkansen", type: "ひかり",     badge: "ひかり", badgeColor: "#fbbf24", speed: 220, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 45 },
      { line: "Tokaido-Shinkansen", type: "こだま",     badge: "こだま", badgeColor: "#60a5fa", speed: 160, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "JR-Yamanote",        type: "山手線",     badge: "山手",   badgeColor: "#34d399", speed: 35,  interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "JR-Chuo",            type: "快速",       badge: "快速",   badgeColor: "#fbbf24", speed: 55,  interval: 8,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "JR-Chuo",            type: "特別快速",   badge: "特快",   badgeColor: "#f87171", speed: 70,  interval: 20, accel: 0.80, decel: 0.90, aLat: 0.85, dwellSec: 30 },
      { line: "Tokyo-Metro-Ginza",        type: "銀座線",     badge: "G",  badgeColor: "#f59a0c", speed: 35, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Tokyo-Metro-Marunouchi",   type: "丸ノ内線",   badge: "M",  badgeColor: "#f43f5e", speed: 40, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "JR-Keihin-Tohoku",         type: "各駅停車",   badge: "京浜",   badgeColor: "#60a5fa", speed: 45, interval: 4,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "JR-Keihin-Tohoku",         type: "快速",       badge: "京浜快", badgeColor: "#22d3ee", speed: 55, interval: 12, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "JR-Sobu-Local",            type: "各駅停車",   badge: "総武",   badgeColor: "#fde047", speed: 40, interval: 4,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Tokyu-Toyoko",             type: "各停",       badge: "各停",   badgeColor: "#c8102e", speed: 40, interval: 5,  accel: 0.95, decel: 1.05, aLat: 0.90, dwellSec: 25 },
      { line: "Tokyu-Toyoko",             type: "急行",       badge: "急行",   badgeColor: "#f87171", speed: 55, interval: 10, accel: 0.95, decel: 1.05, aLat: 0.90, dwellSec: 25 },
      { line: "Tokyu-Toyoko",             type: "特急",       badge: "特急",   badgeColor: "#facc15", speed: 65, interval: 15, accel: 0.95, decel: 1.05, aLat: 0.90, dwellSec: 30 },
      { line: "JR-Osaka-Loop",            type: "普通",       badge: "環状",   badgeColor: "#f97316", speed: 40, interval: 4,  accel: 0.95, decel: 1.05, aLat: 0.90, dwellSec: 25 },
      { line: "JR-Osaka-Loop",            type: "大和路快速", badge: "大和路", badgeColor: "#fb923c", speed: 55, interval: 15, accel: 0.95, decel: 1.05, aLat: 0.90, dwellSec: 25 },
      { line: "Osaka-Metro-Midosuji",     type: "御堂筋線",   badge: "M",      badgeColor: "#dc2626", speed: 40, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Hankyu-Kobe",              type: "普通",       badge: "普通",   badgeColor: "#7c1d10", speed: 50, interval: 8,  accel: 0.90, decel: 1.00, aLat: 0.85, dwellSec: 25 },
      { line: "Hankyu-Kobe",              type: "通勤特急",   badge: "通特",   badgeColor: "#a16207", speed: 65, interval: 15, accel: 0.90, decel: 1.00, aLat: 0.85, dwellSec: 25 },
      { line: "Hankyu-Kobe",              type: "特急",       badge: "特急",   badgeColor: "#fde047", speed: 70, interval: 15, accel: 0.90, decel: 1.00, aLat: 0.85, dwellSec: 30 },
      { line: "Sanyo-Shinkansen",         type: "のぞみ",     badge: "のぞみ", badgeColor: "#0ea5e9", speed: 285, interval: 15, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Sanyo-Shinkansen",         type: "みずほ",     badge: "みずほ", badgeColor: "#a78bfa", speed: 290, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Sanyo-Shinkansen",         type: "さくら",     badge: "さくら", badgeColor: "#f472b6", speed: 270, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Sanyo-Shinkansen",         type: "こだま",     badge: "こだま", badgeColor: "#60a5fa", speed: 180, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
    ],
  },

  korea: {
    label: "한국 Korea",
    center: [37.55, 126.99],
    zoom: 9,
    lines: [
      {
        id: "Seoul-Metro-1",
        name: "수도권 전철 1호선 (서울–인천)",
        nameEn: "Seoul Metro Line 1 (Seoul–Incheon)",
        color: "#0052a4",
        category: "捷運",
        directions: { up: "상행 (광운대 방면)", down: "하행 (인천 방면)" },
        // 1호선 전체는 KORAIL 운영 광역철도 + 서울교통공사 운영 청량리–서울역 구간이
        // 통합 운행. 본표는 광운대–서울역–인천 도시 코어만 커버. 천안/신창/소요산
        // 지선은 별도 작업.
        stations: [
          { name: "광운대",     lat: 37.6235, lng: 127.0578, km: 0,    dwellSec: 30 },
          { name: "석계",       lat: 37.6147, lng: 127.0654, km: 1.4 },
          { name: "청량리",     lat: 37.5803, lng: 127.0466, km: 4.6, dwellSec: 30 },
          { name: "신설동",     lat: 37.5762, lng: 127.0254, km: 6.7 },
          { name: "동대문",     lat: 37.5713, lng: 127.0095, km: 7.5 },
          { name: "종로5가",    lat: 37.5705, lng: 127.0014, km: 8.2 },
          { name: "종로3가",    lat: 37.5710, lng: 126.9919, km: 9.0 },
          { name: "종각",       lat: 37.5703, lng: 126.9826, km: 9.7 },
          { name: "시청",       lat: 37.5645, lng: 126.9776, km: 10.3 },
          { name: "서울역",     lat: 37.5547, lng: 126.9706, km: 11.1, dwellSec: 30 },
          { name: "용산",       lat: 37.5295, lng: 126.9648, km: 13.0 },
          { name: "노량진",     lat: 37.5135, lng: 126.9425, km: 15.2 },
          { name: "영등포",     lat: 37.5156, lng: 126.9070, km: 18.4 },
          { name: "신도림",     lat: 37.5089, lng: 126.8916, km: 21.2 },
          { name: "구로",       lat: 37.5031, lng: 126.8819, km: 22.6 },
          { name: "오류동",     lat: 37.4914, lng: 126.8400, km: 25.8 },
          { name: "역곡",       lat: 37.4844, lng: 126.8079, km: 28.2 },
          { name: "부천",       lat: 37.4838, lng: 126.7787, km: 32.1 },
          { name: "송내",       lat: 37.4877, lng: 126.7530, km: 34.5 },
          { name: "부평",       lat: 37.4895, lng: 126.7236, km: 38.5, dwellSec: 30 },
          { name: "동암",       lat: 37.4690, lng: 126.6998, km: 41.7 },
          { name: "주안",       lat: 37.4574, lng: 126.6776, km: 44.7 },
          { name: "제물포",     lat: 37.4596, lng: 126.6566, km: 46.7 },
          { name: "동인천",     lat: 37.4742, lng: 126.6328, km: 50.6 },
          { name: "인천",       lat: 37.4708, lng: 126.6218, km: 51.8, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-2",
        name: "서울 지하철 2호선",
        nameEn: "Seoul Metro Line 2",
        color: "#00a84d",
        category: "捷運",
        directions: { up: "외선순환 (시계방향)", down: "내선순환 (반시계방향)" },
        // 2호선:48.8 km 환상선,시청을 앵커로 외선순환 기준으로 정렬.
        // 첫 역과 마지막 역 모두 시청(동일 이름)으로 폐환을 표시.
        stations: [
          { name: "시청",                 lat: 37.5645, lng: 126.9776, km: 0,    dwellSec: 30 },
          { name: "을지로입구",           lat: 37.5660, lng: 126.9826, km: 0.5 },
          { name: "을지로3가",            lat: 37.5661, lng: 126.9912, km: 1.3 },
          { name: "을지로4가",            lat: 37.5663, lng: 126.9978, km: 1.9 },
          { name: "동대문역사문화공원",   lat: 37.5666, lng: 127.0080, km: 2.7 },
          { name: "신당",                 lat: 37.5658, lng: 127.0179, km: 3.6 },
          { name: "상왕십리",             lat: 37.5642, lng: 127.0290, km: 4.6 },
          { name: "왕십리",               lat: 37.5614, lng: 127.0376, km: 5.5, dwellSec: 30 },
          { name: "한양대",               lat: 37.5556, lng: 127.0440, km: 6.3 },
          { name: "뚝섬",                 lat: 37.5476, lng: 127.0473, km: 7.5 },
          { name: "성수",                 lat: 37.5446, lng: 127.0560, km: 8.4 },
          { name: "건대입구",             lat: 37.5400, lng: 127.0701, km: 9.7 },
          { name: "구의",                 lat: 37.5371, lng: 127.0858, km: 10.8 },
          { name: "강변",                 lat: 37.5350, lng: 127.0945, km: 11.7 },
          { name: "잠실나루",             lat: 37.5208, lng: 127.1031, km: 13.0 },
          { name: "잠실",                 lat: 37.5135, lng: 127.1003, km: 14.0, dwellSec: 30 },
          { name: "잠실새내",             lat: 37.5113, lng: 127.0860, km: 15.3 },
          { name: "종합운동장",           lat: 37.5111, lng: 127.0735, km: 16.4 },
          { name: "삼성",                 lat: 37.5089, lng: 127.0631, km: 17.5 },
          { name: "선릉",                 lat: 37.5044, lng: 127.0490, km: 19.0 },
          { name: "역삼",                 lat: 37.5005, lng: 127.0364, km: 20.4 },
          { name: "강남",                 lat: 37.4979, lng: 127.0276, km: 21.4, dwellSec: 30 },
          { name: "교대",                 lat: 37.4934, lng: 127.0144, km: 22.7 },
          { name: "서초",                 lat: 37.4915, lng: 127.0078, km: 23.4 },
          { name: "방배",                 lat: 37.4814, lng: 126.9971, km: 24.6 },
          { name: "사당",                 lat: 37.4765, lng: 126.9818, km: 25.9 },
          { name: "낙성대",               lat: 37.4767, lng: 126.9637, km: 27.2 },
          { name: "서울대입구",           lat: 37.4814, lng: 126.9527, km: 28.4 },
          { name: "봉천",                 lat: 37.4824, lng: 126.9415, km: 29.5 },
          { name: "신림",                 lat: 37.4843, lng: 126.9295, km: 30.7 },
          { name: "신대방",               lat: 37.4874, lng: 126.9133, km: 31.9 },
          { name: "구로디지털단지",       lat: 37.4854, lng: 126.9013, km: 33.2 },
          { name: "대림",                 lat: 37.4929, lng: 126.8956, km: 34.0 },
          { name: "신도림",               lat: 37.5089, lng: 126.8916, km: 35.0 },
          { name: "문래",                 lat: 37.5180, lng: 126.8949, km: 36.0 },
          { name: "영등포구청",           lat: 37.5246, lng: 126.8957, km: 36.8 },
          { name: "당산",                 lat: 37.5343, lng: 126.9023, km: 38.1 },
          { name: "합정",                 lat: 37.5497, lng: 126.9134, km: 39.6 },
          { name: "홍대입구",             lat: 37.5567, lng: 126.9237, km: 40.7, dwellSec: 30 },
          { name: "신촌",                 lat: 37.5559, lng: 126.9359, km: 41.6 },
          { name: "이대",                 lat: 37.5567, lng: 126.9461, km: 42.5 },
          { name: "아현",                 lat: 37.5577, lng: 126.9560, km: 43.4 },
          { name: "충정로",               lat: 37.5602, lng: 126.9636, km: 44.3 },
          { name: "시청",                 lat: 37.5645, lng: 126.9776, km: 48.8, dwellSec: 30 },
        ],
      },
      {
        id: "KTX-Gyeongbu",
        name: "KTX 경부선",
        nameEn: "KTX Gyeongbu Line",
        color: "#0c4ca3",
        category: "HSR",
        directions: { up: "상행 (서울 방면)", down: "하행 (부산 방면)" },
        // KTX 경부고속선 + 일반선 혼합 운행. 본표는 주요 정차역 10개만
        // 커버(전 노선 전철로 약 417.5 km).
        stations: [
          { name: "서울",         lat: 37.5547, lng: 126.9706, km: 0,    dwellSec: 90 },
          { name: "광명",         lat: 37.4159, lng: 126.8849, km: 22 },
          { name: "천안아산",     lat: 36.7945, lng: 127.1043, km: 96 },
          { name: "오송",         lat: 36.6202, lng: 127.3260, km: 128 },
          { name: "대전",         lat: 36.3320, lng: 127.4346, km: 161, dwellSec: 60 },
          { name: "김천(구미)",   lat: 36.1153, lng: 128.1732, km: 225 },
          { name: "동대구",       lat: 35.8794, lng: 128.6285, km: 293, dwellSec: 60 },
          { name: "신경주",       lat: 35.7975, lng: 129.1369, km: 335 },
          { name: "울산",         lat: 35.5512, lng: 129.1330, km: 364 },
          { name: "부산",         lat: 35.1153, lng: 129.0418, km: 418, dwellSec: 90 },
        ],
      },
      {
        id: "Busan-Metro-1",
        name: "부산 도시철도 1호선",
        nameEn: "Busan Metro Line 1",
        color: "#f06a00",
        category: "捷運",
        directions: { up: "상행 (다대포해수욕장 방면)", down: "하행 (노포 방면)" },
        // 부산 1호선:다대포해수욕장↔노포 40.5 km 40 역.
        stations: [
          { name: "다대포해수욕장",   lat: 35.0492, lng: 128.9659, km: 0,    dwellSec: 30 },
          { name: "다대포항",         lat: 35.0628, lng: 128.9665, km: 0.8 },
          { name: "낫개",             lat: 35.0726, lng: 128.9694, km: 1.5 },
          { name: "신장림",           lat: 35.0837, lng: 128.9707, km: 2.5 },
          { name: "장림",             lat: 35.0926, lng: 128.9722, km: 3.5 },
          { name: "동매",             lat: 35.0987, lng: 128.9759, km: 4.4 },
          { name: "신평",             lat: 35.0988, lng: 128.9818, km: 5.0 },
          { name: "하단",             lat: 35.1058, lng: 128.9663, km: 6.5 },
          { name: "당리",             lat: 35.1077, lng: 128.9772, km: 7.6 },
          { name: "사하",             lat: 35.1087, lng: 128.9888, km: 8.6 },
          { name: "괴정",             lat: 35.1093, lng: 128.9979, km: 9.7 },
          { name: "대티",             lat: 35.1108, lng: 129.0099, km: 11.0 },
          { name: "서대신",           lat: 35.1135, lng: 129.0224, km: 12.4 },
          { name: "동대신",           lat: 35.1133, lng: 129.0291, km: 13.1 },
          { name: "토성",             lat: 35.1024, lng: 129.0254, km: 14.5 },
          { name: "자갈치",           lat: 35.0974, lng: 129.0310, km: 15.4 },
          { name: "남포",             lat: 35.0980, lng: 129.0349, km: 16.0 },
          { name: "중앙",             lat: 35.1018, lng: 129.0384, km: 16.7 },
          { name: "부산역",           lat: 35.1153, lng: 129.0418, km: 17.5, dwellSec: 30 },
          { name: "초량",             lat: 35.1196, lng: 129.0454, km: 18.5 },
          { name: "부산진",           lat: 35.1383, lng: 129.0526, km: 20.6 },
          { name: "좌천",             lat: 35.1420, lng: 129.0540, km: 21.4 },
          { name: "범일",             lat: 35.1497, lng: 129.0597, km: 22.6 },
          { name: "범내골",           lat: 35.1568, lng: 129.0612, km: 23.4 },
          { name: "서면",             lat: 35.1577, lng: 129.0593, km: 24.0, dwellSec: 30 },
          { name: "부전",             lat: 35.1646, lng: 129.0596, km: 24.8 },
          { name: "양정",             lat: 35.1706, lng: 129.0698, km: 26.0 },
          { name: "시청",             lat: 35.1801, lng: 129.0762, km: 26.8 },
          { name: "연산",             lat: 35.1862, lng: 129.0822, km: 27.5 },
          { name: "교대",             lat: 35.1939, lng: 129.0866, km: 28.5 },
          { name: "동래",             lat: 35.2052, lng: 129.0824, km: 29.7 },
          { name: "명륜",             lat: 35.2148, lng: 129.0789, km: 30.6 },
          { name: "온천장",           lat: 35.2249, lng: 129.0837, km: 31.7 },
          { name: "부산대",           lat: 35.2329, lng: 129.0843, km: 32.6 },
          { name: "장전",             lat: 35.2387, lng: 129.0871, km: 33.4 },
          { name: "구서",             lat: 35.2486, lng: 129.0918, km: 34.5 },
          { name: "두실",             lat: 35.2538, lng: 129.0945, km: 35.2 },
          { name: "남산",             lat: 35.2641, lng: 129.0972, km: 36.2 },
          { name: "범어사",           lat: 35.2769, lng: 129.0967, km: 37.7 },
          { name: "노포",             lat: 35.2935, lng: 129.0930, km: 40.5, dwellSec: 30 },
        ],
      },
    ],
    trainTemplates: [
      { line: "Seoul-Metro-1",  type: "급행",   badge: "급행",   badgeColor: "#1d4ed8", speed: 60, interval: 12, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Seoul-Metro-1",  type: "완행",   badge: "완",     badgeColor: "#0052a4", speed: 40, interval: 4,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Seoul-Metro-2",  type: "순환",   badge: "2",      badgeColor: "#00a84d", speed: 35, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "KTX-Gyeongbu",   type: "KTX",    badge: "KTX",    badgeColor: "#0c4ca3", speed: 250, interval: 20, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Gyeongbu",   type: "KTX-산천", badge: "산천", badgeColor: "#dc2626", speed: 230, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Busan-Metro-1",  type: "1호선",  badge: "1",      badgeColor: "#f06a00", speed: 35, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
    ],
  },

  hongkong: {
    label: "香港 Hong Kong",
    center: [22.37, 114.13],
    zoom: 11,
    lines: [
      {
        id: "MTR-Tsuen-Wan",
        name: "荃灣綫",
        nameEn: "MTR Tsuen Wan Line",
        color: "#e2231a",
        category: "捷運",
        directions: { up: "上行 (往中環)", down: "下行 (往荃灣)" },
        stations: [
          { name: "中環",     lat: 22.2820, lng: 114.1581, km: 0,    dwellSec: 30 },
          { name: "金鐘",     lat: 22.2785, lng: 114.1647, km: 0.6, dwellSec: 30 },
          { name: "尖沙咀",   lat: 22.2974, lng: 114.1722, km: 2.4 },
          { name: "佐敦",     lat: 22.3052, lng: 114.1716, km: 3.1 },
          { name: "油麻地",   lat: 22.3128, lng: 114.1707, km: 3.7 },
          { name: "旺角",     lat: 22.3199, lng: 114.1693, km: 4.5 },
          { name: "太子",     lat: 22.3247, lng: 114.1681, km: 5.2 },
          { name: "深水埗",   lat: 22.3309, lng: 114.1623, km: 6.0 },
          { name: "長沙灣",   lat: 22.3357, lng: 114.1565, km: 6.8 },
          { name: "荔枝角",   lat: 22.3382, lng: 114.1483, km: 7.5 },
          { name: "美孚",     lat: 22.3373, lng: 114.1378, km: 8.7 },
          { name: "荔景",     lat: 22.3486, lng: 114.1259, km: 9.6 },
          { name: "葵芳",     lat: 22.3568, lng: 114.1295, km: 11.5 },
          { name: "葵興",     lat: 22.3631, lng: 114.1313, km: 12.7 },
          { name: "大窩口",   lat: 22.3712, lng: 114.1248, km: 13.8 },
          { name: "荃灣",     lat: 22.3735, lng: 114.1175, km: 16.0, dwellSec: 30 },
        ],
      },
      {
        id: "MTR-Island",
        name: "港島綫",
        nameEn: "MTR Island Line",
        color: "#007dc5",
        category: "捷運",
        directions: { up: "上行 (往堅尼地城)", down: "下行 (往柴灣)" },
        stations: [
          { name: "堅尼地城", lat: 22.2814, lng: 114.1289, km: 0,    dwellSec: 30 },
          { name: "香港大學", lat: 22.2837, lng: 114.1351, km: 1.0 },
          { name: "西營盤",   lat: 22.2858, lng: 114.1426, km: 1.5 },
          { name: "上環",     lat: 22.2867, lng: 114.1518, km: 2.4 },
          { name: "中環",     lat: 22.2820, lng: 114.1581, km: 2.9, dwellSec: 30 },
          { name: "金鐘",     lat: 22.2785, lng: 114.1647, km: 3.5, dwellSec: 30 },
          { name: "灣仔",     lat: 22.2773, lng: 114.1731, km: 4.4 },
          { name: "銅鑼灣",   lat: 22.2802, lng: 114.1853, km: 5.4 },
          { name: "天后",     lat: 22.2823, lng: 114.1922, km: 6.2 },
          { name: "炮台山",   lat: 22.2879, lng: 114.1936, km: 6.7 },
          { name: "北角",     lat: 22.2912, lng: 114.2008, km: 7.4 },
          { name: "鰂魚涌",   lat: 22.2876, lng: 114.2098, km: 8.4 },
          { name: "太古",     lat: 22.2845, lng: 114.2168, km: 9.5 },
          { name: "西灣河",   lat: 22.2818, lng: 114.2218, km: 11.0 },
          { name: "筲箕灣",   lat: 22.2789, lng: 114.2294, km: 11.7 },
          { name: "杏花邨",   lat: 22.2766, lng: 114.2399, km: 13.2 },
          { name: "柴灣",     lat: 22.2645, lng: 114.2374, km: 16.3, dwellSec: 30 },
        ],
      },
      {
        id: "MTR-East-Rail",
        name: "東鐵綫",
        nameEn: "MTR East Rail Line",
        color: "#5eb7e8",
        category: "TRA",
        directions: { up: "上行 (往金鐘)", down: "下行 (往羅湖)" },
        // 東鐵綫:金鐘↔羅湖 約 46 km。落馬洲為支線終點(此表不列),羅湖
        // 過境前往深圳。本表 14 站為主要客運站。
        stations: [
          { name: "金鐘",     lat: 22.2785, lng: 114.1647, km: 0,    dwellSec: 30 },
          { name: "會展",     lat: 22.2829, lng: 114.1730, km: 0.7 },
          { name: "紅磡",     lat: 22.3022, lng: 114.1817, km: 4.2, dwellSec: 30 },
          { name: "旺角東",   lat: 22.3216, lng: 114.1729, km: 6.6 },
          { name: "九龍塘",   lat: 22.3367, lng: 114.1762, km: 8.7, dwellSec: 30 },
          { name: "大圍",     lat: 22.3733, lng: 114.1789, km: 12.3 },
          { name: "沙田",     lat: 22.3814, lng: 114.1866, km: 14.4, dwellSec: 30 },
          { name: "火炭",     lat: 22.3957, lng: 114.1972, km: 16.5 },
          { name: "大學",     lat: 22.4135, lng: 114.2098, km: 19.7 },
          { name: "大埔墟",   lat: 22.4448, lng: 114.1701, km: 24.2 },
          { name: "太和",     lat: 22.4509, lng: 114.1611, km: 25.3 },
          { name: "粉嶺",     lat: 22.4920, lng: 114.1389, km: 28.5 },
          { name: "上水",     lat: 22.5022, lng: 114.1281, km: 30.6 },
          { name: "羅湖",     lat: 22.5279, lng: 114.1132, km: 35.5, dwellSec: 30 },
        ],
      },
      {
        id: "MTR-Airport-Express",
        name: "機場快綫",
        nameEn: "MTR Airport Express",
        color: "#00888a",
        category: "HSR",
        directions: { up: "上行 (往香港)", down: "下行 (往博覽館)" },
        stations: [
          { name: "香港",     lat: 22.2849, lng: 114.1582, km: 0,    dwellSec: 60 },
          { name: "九龍",     lat: 22.3047, lng: 114.1612, km: 2.6, dwellSec: 60 },
          { name: "青衣",     lat: 22.3585, lng: 114.1077, km: 12.0 },
          { name: "機場",     lat: 22.3157, lng: 113.9367, km: 31.6, dwellSec: 60 },
          { name: "博覽館",   lat: 22.3243, lng: 113.9416, km: 35.3, dwellSec: 60 },
        ],
      },
    ],
    trainTemplates: [
      { line: "MTR-Tsuen-Wan",       type: "荃灣綫",     badge: "TWL", badgeColor: "#e2231a", speed: 38, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "MTR-Island",          type: "港島綫",     badge: "ISL", badgeColor: "#007dc5", speed: 38, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "MTR-East-Rail",       type: "東鐵綫",     badge: "EAL", badgeColor: "#5eb7e8", speed: 55, interval: 5,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "MTR-Airport-Express", type: "機場快綫",   badge: "AEL", badgeColor: "#00888a", speed: 120, interval: 12, accel: 0.80, decel: 0.85, aLat: 0.85, dwellSec: 60 },
    ],
  },

  china: {
    label: "中國 China",
    center: [35.0, 110.0],
    zoom: 5,
    lines: [
      {
        id: "Beijing-Shanghai-HSR",
        name: "京滬高速鐵路",
        nameEn: "Beijing–Shanghai HSR",
        color: "#c80000",
        category: "HSR",
        directions: { up: "上行 (北京南方向)", down: "下行 (上海虹橋方向)" },
        // 京滬高鐵:北京南↔上海虹橋 23 站 1318 km。設計 380 km/h,實際營運
        // 「復興號」350 km/h、「和諧號」250 km/h 為主。
        stations: [
          { name: "北京南",     lat: 39.8645, lng: 116.3784, km: 0,    dwellSec: 90 },
          { name: "廊坊",       lat: 39.5340, lng: 116.6750, km: 59 },
          { name: "天津南",     lat: 38.9890, lng: 117.1250, km: 131, dwellSec: 60 },
          { name: "滄州西",     lat: 38.3390, lng: 116.8230, km: 219 },
          { name: "德州東",     lat: 37.4500, lng: 116.3530, km: 326 },
          { name: "濟南西",     lat: 36.6510, lng: 116.8870, km: 406, dwellSec: 60 },
          { name: "泰安",       lat: 36.1860, lng: 117.0610, km: 462 },
          { name: "曲阜東",     lat: 35.5950, lng: 117.0530, km: 533 },
          { name: "滕州東",     lat: 35.0850, lng: 117.2450, km: 588 },
          { name: "棗莊",       lat: 34.7950, lng: 117.3160, km: 626 },
          { name: "徐州東",     lat: 34.2620, lng: 117.2810, km: 692, dwellSec: 60 },
          { name: "宿州東",     lat: 33.6510, lng: 117.0290, km: 767 },
          { name: "蚌埠南",     lat: 32.8920, lng: 117.3280, km: 844 },
          { name: "定遠",       lat: 32.5100, lng: 117.6890, km: 913 },
          { name: "滁州",       lat: 32.2960, lng: 118.3110, km: 989 },
          { name: "南京南",     lat: 31.9650, lng: 118.7920, km: 1018, dwellSec: 60 },
          { name: "鎮江南",     lat: 32.1750, lng: 119.4590, km: 1085 },
          { name: "丹陽北",     lat: 32.0140, lng: 119.6160, km: 1129 },
          { name: "常州北",     lat: 31.8390, lng: 119.9710, km: 1170 },
          { name: "無錫東",     lat: 31.5990, lng: 120.4190, km: 1223 },
          { name: "蘇州北",     lat: 31.4140, lng: 120.6320, km: 1259 },
          { name: "崑山南",     lat: 31.3270, lng: 120.9550, km: 1289 },
          { name: "上海虹橋",   lat: 31.1947, lng: 121.3214, km: 1318, dwellSec: 90 },
        ],
      },
      {
        id: "Beijing-Guangzhou-HSR",
        name: "京廣高速鐵路",
        nameEn: "Beijing–Guangzhou HSR",
        color: "#7e22ce",
        category: "HSR",
        directions: { up: "上行 (北京西方向)", down: "下行 (廣州南方向)" },
        // 京廣高鐵:北京西↔廣州南 28 站 2298 km。世界最長高鐵幹線之一。
        stations: [
          { name: "北京西",     lat: 39.8946, lng: 116.3217, km: 0,    dwellSec: 90 },
          { name: "涿州東",     lat: 39.4770, lng: 116.0890, km: 57 },
          { name: "高碑店東",   lat: 39.3270, lng: 115.8190, km: 99 },
          { name: "保定東",     lat: 38.8550, lng: 115.5340, km: 146 },
          { name: "石家莊",     lat: 38.0420, lng: 114.5160, km: 271, dwellSec: 60 },
          { name: "高邑西",     lat: 37.6230, lng: 114.5950, km: 332 },
          { name: "邢台東",     lat: 37.0780, lng: 114.5570, km: 372 },
          { name: "邯鄲東",     lat: 36.6010, lng: 114.5550, km: 422 },
          { name: "安陽東",     lat: 36.0820, lng: 114.4030, km: 501 },
          { name: "鶴壁東",     lat: 35.7250, lng: 114.3110, km: 545 },
          { name: "新鄉東",     lat: 35.3050, lng: 114.0990, km: 605 },
          { name: "鄭州東",     lat: 34.7750, lng: 113.7370, km: 694, dwellSec: 60 },
          { name: "許昌東",     lat: 34.0030, lng: 113.8760, km: 774 },
          { name: "漯河西",     lat: 33.5800, lng: 113.9370, km: 841 },
          { name: "駐馬店西",   lat: 32.9760, lng: 114.0210, km: 913 },
          { name: "信陽東",     lat: 32.0930, lng: 114.1080, km: 988 },
          { name: "武漢",       lat: 30.6010, lng: 114.4280, km: 1112, dwellSec: 90 },
          { name: "咸寧北",     lat: 29.8360, lng: 114.3210, km: 1207 },
          { name: "赤壁北",     lat: 29.7110, lng: 113.8650, km: 1245 },
          { name: "岳陽東",     lat: 29.3580, lng: 113.1500, km: 1304 },
          { name: "汨羅東",     lat: 28.7990, lng: 113.0710, km: 1411 },
          { name: "長沙南",     lat: 28.1500, lng: 113.0590, km: 1472, dwellSec: 60 },
          { name: "株洲西",     lat: 27.8430, lng: 112.9760, km: 1530 },
          { name: "衡陽東",     lat: 26.9290, lng: 112.6800, km: 1640 },
          { name: "郴州西",     lat: 25.7960, lng: 113.0010, km: 1786 },
          { name: "韶關",       lat: 24.8430, lng: 113.6160, km: 1914 },
          { name: "清遠",       lat: 23.6960, lng: 113.0510, km: 2070 },
          { name: "廣州南",     lat: 22.9890, lng: 113.2680, km: 2298, dwellSec: 90 },
        ],
      },
      {
        id: "Shanghai-Kunming-HSR",
        name: "滬昆高速鐵路",
        nameEn: "Shanghai–Kunming HSR",
        color: "#16a34a",
        category: "HSR",
        directions: { up: "上行 (上海虹橋方向)", down: "下行 (昆明南方向)" },
        // 滬昆高鐵:上海虹橋↔昆明南 26 站 2252 km。中國東西向高鐵主軸。
        stations: [
          { name: "上海虹橋",   lat: 31.1947, lng: 121.3214, km: 0,    dwellSec: 90 },
          { name: "松江南",     lat: 30.9450, lng: 121.2490, km: 40 },
          { name: "嘉興南",     lat: 30.6920, lng: 120.7340, km: 105 },
          { name: "杭州東",     lat: 30.2920, lng: 120.2100, km: 175, dwellSec: 60 },
          { name: "諸暨",       lat: 29.7320, lng: 120.2370, km: 240 },
          { name: "義烏",       lat: 29.3160, lng: 120.0930, km: 295 },
          { name: "金華",       lat: 29.0790, lng: 119.6500, km: 350 },
          { name: "衢州",       lat: 28.9670, lng: 118.8300, km: 425 },
          { name: "玉山南",     lat: 28.6800, lng: 118.2510, km: 470 },
          { name: "上饒",       lat: 28.4760, lng: 117.9710, km: 535 },
          { name: "鷹潭北",     lat: 28.2460, lng: 117.0690, km: 624 },
          { name: "撫州東",     lat: 27.9390, lng: 116.3820, km: 700 },
          { name: "南昌西",     lat: 28.5820, lng: 115.7940, km: 800, dwellSec: 60 },
          { name: "新餘北",     lat: 27.8510, lng: 114.8920, km: 920 },
          { name: "宜春",       lat: 27.8170, lng: 114.4120, km: 985 },
          { name: "萍鄉北",     lat: 27.6250, lng: 113.8320, km: 1080 },
          { name: "株洲西",     lat: 27.8430, lng: 112.9760, km: 1170 },
          { name: "婁底南",     lat: 27.7280, lng: 111.9720, km: 1280 },
          { name: "邵陽北",     lat: 27.3100, lng: 111.4600, km: 1370 },
          { name: "懷化南",     lat: 27.4850, lng: 109.9510, km: 1530 },
          { name: "銅仁南",     lat: 27.6900, lng: 109.1900, km: 1620 },
          { name: "凱里南",     lat: 26.5630, lng: 107.9990, km: 1810 },
          { name: "貴陽東",     lat: 26.6420, lng: 107.0110, km: 1942, dwellSec: 60 },
          { name: "安順西",     lat: 26.2500, lng: 106.0250, km: 2055 },
          { name: "曲靖北",     lat: 25.4910, lng: 103.7870, km: 2178 },
          { name: "昆明南",     lat: 24.7850, lng: 102.8660, km: 2252, dwellSec: 90 },
        ],
      },
      {
        id: "Beijing-Subway-1",
        name: "北京地鐵1號線",
        nameEn: "Beijing Subway Line 1",
        color: "#c23a30",
        category: "捷運",
        directions: { up: "上行 (蘋果園方向)", down: "下行 (環球度假區方向)" },
        // 北京 1 號線 + 八通線 2021 年合併為統一 1 號線運行,蘋果園↔環球度假區
        // 全長 47.6 km、35 站。
        stations: [
          { name: "蘋果園",         lat: 39.9270, lng: 116.1760, km: 0,    dwellSec: 30 },
          { name: "古城",           lat: 39.9110, lng: 116.1900, km: 1.6 },
          { name: "八角遊樂園",     lat: 39.9080, lng: 116.2050, km: 2.5 },
          { name: "八寶山",         lat: 39.9050, lng: 116.2300, km: 4.4 },
          { name: "玉泉路",         lat: 39.9040, lng: 116.2470, km: 6.0 },
          { name: "五棵松",         lat: 39.9070, lng: 116.2750, km: 8.4 },
          { name: "萬壽路",         lat: 39.9060, lng: 116.2920, km: 9.7 },
          { name: "公主墳",         lat: 39.9070, lng: 116.3170, km: 12.0 },
          { name: "軍事博物館",     lat: 39.9070, lng: 116.3270, km: 13.0 },
          { name: "木樨地",         lat: 39.9100, lng: 116.3420, km: 14.5 },
          { name: "南禮士路",       lat: 39.9130, lng: 116.3570, km: 15.7 },
          { name: "復興門",         lat: 39.9100, lng: 116.3580, km: 16.7, dwellSec: 30 },
          { name: "西單",           lat: 39.9070, lng: 116.3740, km: 18.0 },
          { name: "天安門西",       lat: 39.9070, lng: 116.3910, km: 19.3 },
          { name: "天安門東",       lat: 39.9070, lng: 116.4040, km: 20.3 },
          { name: "王府井",         lat: 39.9100, lng: 116.4130, km: 21.4 },
          { name: "東單",           lat: 39.9100, lng: 116.4210, km: 22.1 },
          { name: "建國門",         lat: 39.9100, lng: 116.4350, km: 23.4, dwellSec: 30 },
          { name: "永安里",         lat: 39.9100, lng: 116.4500, km: 24.7 },
          { name: "國貿",           lat: 39.9110, lng: 116.4640, km: 25.9 },
          { name: "大望路",         lat: 39.9110, lng: 116.4810, km: 27.4 },
          { name: "四惠",           lat: 39.9100, lng: 116.5080, km: 29.5 },
          { name: "四惠東",         lat: 39.9100, lng: 116.5230, km: 30.4 },
          { name: "高碑店",         lat: 39.9100, lng: 116.5460, km: 32.0 },
          { name: "傳媒大學",       lat: 39.9130, lng: 116.5610, km: 33.0 },
          { name: "雙橋",           lat: 39.9130, lng: 116.5830, km: 34.5 },
          { name: "管莊",           lat: 39.9130, lng: 116.6050, km: 36.5 },
          { name: "八里橋",         lat: 39.9110, lng: 116.6250, km: 38.5 },
          { name: "通州北苑",       lat: 39.9100, lng: 116.6400, km: 39.5 },
          { name: "果園",           lat: 39.9010, lng: 116.6580, km: 41.0 },
          { name: "九棵樹",         lat: 39.8920, lng: 116.6650, km: 42.5 },
          { name: "梨園",           lat: 39.8810, lng: 116.6670, km: 43.5 },
          { name: "臨河里",         lat: 39.8710, lng: 116.6680, km: 44.5 },
          { name: "土橋",           lat: 39.8600, lng: 116.6680, km: 45.5 },
          { name: "花莊",           lat: 39.8350, lng: 116.6830, km: 46.7 },
          { name: "環球度假區",     lat: 39.8290, lng: 116.7040, km: 47.6, dwellSec: 30 },
        ],
      },
      {
        id: "Beijing-Subway-2",
        name: "北京地鐵2號線",
        nameEn: "Beijing Subway Line 2",
        color: "#066b46",
        category: "捷運",
        directions: { up: "外環 (順時針)", down: "內環 (逆時針)" },
        // 2 號線:北京中心環狀線 23.1 km 18 站。以西直門為錨點,首末站同名
        // 表示閉環。
        stations: [
          { name: "西直門",     lat: 39.9400, lng: 116.3490, km: 0,    dwellSec: 30 },
          { name: "積水潭",     lat: 39.9450, lng: 116.3670, km: 1.5 },
          { name: "鼓樓大街",   lat: 39.9490, lng: 116.3940, km: 3.6 },
          { name: "安定門",     lat: 39.9500, lng: 116.4130, km: 4.7 },
          { name: "雍和宮",     lat: 39.9480, lng: 116.4180, km: 5.6 },
          { name: "東直門",     lat: 39.9400, lng: 116.4350, km: 6.5, dwellSec: 30 },
          { name: "東四十條",   lat: 39.9340, lng: 116.4350, km: 7.4 },
          { name: "朝陽門",     lat: 39.9260, lng: 116.4350, km: 8.4 },
          { name: "建國門",     lat: 39.9100, lng: 116.4350, km: 9.7, dwellSec: 30 },
          { name: "北京站",     lat: 39.9010, lng: 116.4350, km: 11.5, dwellSec: 30 },
          { name: "崇文門",     lat: 39.9010, lng: 116.4180, km: 12.5 },
          { name: "前門",       lat: 39.9000, lng: 116.3980, km: 13.7 },
          { name: "和平門",     lat: 39.9010, lng: 116.3880, km: 14.6 },
          { name: "宣武門",     lat: 39.9000, lng: 116.3710, km: 15.6 },
          { name: "長椿街",     lat: 39.9010, lng: 116.3570, km: 16.5 },
          { name: "復興門",     lat: 39.9100, lng: 116.3580, km: 17.7, dwellSec: 30 },
          { name: "阜成門",     lat: 39.9260, lng: 116.3570, km: 19.0 },
          { name: "車公庄",     lat: 39.9330, lng: 116.3570, km: 20.0 },
          { name: "西直門",     lat: 39.9400, lng: 116.3490, km: 23.1, dwellSec: 30 },
        ],
      },
      {
        id: "Shanghai-Metro-1",
        name: "上海地鐵1號線",
        nameEn: "Shanghai Metro Line 1",
        color: "#e4002b",
        category: "捷運",
        directions: { up: "上行 (富錦路方向)", down: "下行 (莘莊方向)" },
        stations: [
          { name: "富錦路",         lat: 31.3970, lng: 121.3950, km: 0,    dwellSec: 30 },
          { name: "友誼西路",       lat: 31.3880, lng: 121.3980, km: 0.9 },
          { name: "寶安公路",       lat: 31.3780, lng: 121.4020, km: 2.0 },
          { name: "共富新村",       lat: 31.3570, lng: 121.4080, km: 4.5 },
          { name: "呼蘭路",         lat: 31.3450, lng: 121.4130, km: 5.8 },
          { name: "通河新村",       lat: 31.3310, lng: 121.4200, km: 7.4 },
          { name: "共康路",         lat: 31.3200, lng: 121.4270, km: 8.7 },
          { name: "彭浦新村",       lat: 31.3130, lng: 121.4350, km: 9.5 },
          { name: "汶水路",         lat: 31.3010, lng: 121.4430, km: 11.0 },
          { name: "上海馬戲城",     lat: 31.2900, lng: 121.4520, km: 12.2 },
          { name: "延長路",         lat: 31.2810, lng: 121.4560, km: 13.2 },
          { name: "中山北路",       lat: 31.2690, lng: 121.4590, km: 14.5 },
          { name: "上海火車站",     lat: 31.2500, lng: 121.4560, km: 16.7, dwellSec: 30 },
          { name: "漢中路",         lat: 31.2450, lng: 121.4610, km: 17.4 },
          { name: "新閘路",         lat: 31.2400, lng: 121.4660, km: 18.0 },
          { name: "人民廣場",       lat: 31.2340, lng: 121.4710, km: 18.9, dwellSec: 30 },
          { name: "黃陂南路",       lat: 31.2250, lng: 121.4710, km: 19.9 },
          { name: "陝西南路",       lat: 31.2180, lng: 121.4560, km: 21.0 },
          { name: "常熟路",         lat: 31.2120, lng: 121.4500, km: 22.0 },
          { name: "衡山路",         lat: 31.2040, lng: 121.4430, km: 22.9 },
          { name: "徐家匯",         lat: 31.1950, lng: 121.4350, km: 24.0, dwellSec: 30 },
          { name: "上海體育館",     lat: 31.1860, lng: 121.4340, km: 25.1 },
          { name: "漕寶路",         lat: 31.1660, lng: 121.4210, km: 27.6 },
          { name: "上海南站",       lat: 31.1550, lng: 121.4260, km: 28.9, dwellSec: 30 },
          { name: "錦江樂園",       lat: 31.1350, lng: 121.4080, km: 31.4 },
          { name: "蓮花路",         lat: 31.1190, lng: 121.4020, km: 33.4 },
          { name: "外環路",         lat: 31.1040, lng: 121.3950, km: 35.0 },
          { name: "莘莊",           lat: 31.1140, lng: 121.3850, km: 36.4, dwellSec: 30 },
        ],
      },
      {
        id: "Shanghai-Metro-2",
        name: "上海地鐵2號線",
        nameEn: "Shanghai Metro Line 2",
        color: "#84cc16",
        category: "捷運",
        directions: { up: "上行 (徐涇東方向)", down: "下行 (浦東國際機場方向)" },
        // 上海 2 號線:徐涇東↔浦東國際機場 64.0 km 30 站,中國最長地鐵線之一。
        stations: [
          { name: "徐涇東",             lat: 31.1922, lng: 121.2734, km: 0,    dwellSec: 30 },
          { name: "虹橋火車站",         lat: 31.1958, lng: 121.3198, km: 4.4, dwellSec: 30 },
          { name: "虹橋2號航站樓",      lat: 31.1969, lng: 121.3370, km: 6.2 },
          { name: "淞虹路",             lat: 31.2274, lng: 121.3673, km: 9.7 },
          { name: "北新涇",             lat: 31.2218, lng: 121.3856, km: 11.5 },
          { name: "威寧路",             lat: 31.2185, lng: 121.4046, km: 13.3 },
          { name: "婁山關路",           lat: 31.2173, lng: 121.4172, km: 14.5 },
          { name: "中山公園",           lat: 31.2238, lng: 121.4198, km: 15.5 },
          { name: "江蘇路",             lat: 31.2225, lng: 121.4304, km: 16.6 },
          { name: "靜安寺",             lat: 31.2261, lng: 121.4477, km: 18.4 },
          { name: "南京西路",           lat: 31.2326, lng: 121.4612, km: 19.8 },
          { name: "人民廣場",           lat: 31.2342, lng: 121.4709, km: 20.7, dwellSec: 30 },
          { name: "南京東路",           lat: 31.2392, lng: 121.4790, km: 21.8 },
          { name: "陸家嘴",             lat: 31.2386, lng: 121.5032, km: 24.1 },
          { name: "東昌路",             lat: 31.2308, lng: 121.5121, km: 25.0 },
          { name: "世紀大道",           lat: 31.2272, lng: 121.5274, km: 26.5, dwellSec: 30 },
          { name: "上海科技館",         lat: 31.2199, lng: 121.5419, km: 27.9 },
          { name: "世紀公園",           lat: 31.2151, lng: 121.5538, km: 29.0 },
          { name: "龍陽路",             lat: 31.2073, lng: 121.5663, km: 30.4 },
          { name: "張江高科",           lat: 31.2070, lng: 121.5944, km: 33.5 },
          { name: "金科路",             lat: 31.2073, lng: 121.6086, km: 35.0 },
          { name: "廣蘭路",             lat: 31.2073, lng: 121.6248, km: 36.7 },
          { name: "唐鎮",               lat: 31.2154, lng: 121.6727, km: 41.5 },
          { name: "創新中路",           lat: 31.2179, lng: 121.7126, km: 45.4 },
          { name: "華夏東路",           lat: 31.2225, lng: 121.7407, km: 48.5 },
          { name: "川沙",               lat: 31.1969, lng: 121.7012, km: 52.2 },
          { name: "凌空路",             lat: 31.1869, lng: 121.7264, km: 54.7 },
          { name: "遠東大道",           lat: 31.1664, lng: 121.7600, km: 58.7 },
          { name: "海天三路",           lat: 31.1455, lng: 121.7854, km: 62.5 },
          { name: "浦東國際機場",       lat: 31.1510, lng: 121.8084, km: 64.0, dwellSec: 30 },
        ],
      },
    ],
    trainTemplates: [
      { line: "Beijing-Shanghai-HSR",   type: "復興號",   badge: "G",  badgeColor: "#c80000", speed: 290, interval: 10, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Beijing-Shanghai-HSR",   type: "和諧號",   badge: "D",  badgeColor: "#fb923c", speed: 230, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Beijing-Guangzhou-HSR",  type: "復興號",   badge: "G",  badgeColor: "#7e22ce", speed: 280, interval: 15, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Beijing-Guangzhou-HSR",  type: "和諧號",   badge: "D",  badgeColor: "#a855f7", speed: 220, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Shanghai-Kunming-HSR",   type: "復興號",   badge: "G",  badgeColor: "#16a34a", speed: 260, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Shanghai-Kunming-HSR",   type: "和諧號",   badge: "D",  badgeColor: "#84cc16", speed: 210, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Beijing-Subway-1",       type: "1號線",    badge: "1",  badgeColor: "#c23a30", speed: 35, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Beijing-Subway-2",       type: "2號線",    badge: "2",  badgeColor: "#066b46", speed: 35, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Shanghai-Metro-1",       type: "1號線",    badge: "1",  badgeColor: "#e4002b", speed: 38, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Shanghai-Metro-2",       type: "2號線",    badge: "2",  badgeColor: "#84cc16", speed: 40, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
    ],
  },

  singapore: {
    label: "Singapore",
    center: [1.35, 103.82],
    zoom: 11,
    lines: [
      {
        id: "SG-MRT-North-South",
        name: "North-South Line",
        nameEn: "MRT North-South Line",
        color: "#d42e12",
        category: "捷運",
        directions: { up: "Northbound (to Jurong East)", down: "Southbound (to Marina South Pier)" },
        stations: [
          { name: "Jurong East",         lat: 1.3329, lng: 103.7423, km: 0,    dwellSec: 30 },
          { name: "Bukit Batok",         lat: 1.3491, lng: 103.7497, km: 2.0 },
          { name: "Bukit Gombak",        lat: 1.3585, lng: 103.7515, km: 3.4 },
          { name: "Choa Chu Kang",       lat: 1.3853, lng: 103.7440, km: 7.0 },
          { name: "Yew Tee",             lat: 1.3973, lng: 103.7475, km: 8.7 },
          { name: "Kranji",              lat: 1.4253, lng: 103.7619, km: 12.4 },
          { name: "Marsiling",           lat: 1.4326, lng: 103.7740, km: 13.6 },
          { name: "Woodlands",           lat: 1.4370, lng: 103.7864, km: 15.0, dwellSec: 30 },
          { name: "Admiralty",           lat: 1.4407, lng: 103.8009, km: 16.6 },
          { name: "Sembawang",           lat: 1.4490, lng: 103.8200, km: 19.6 },
          { name: "Canberra",            lat: 1.4429, lng: 103.8294, km: 21.0 },
          { name: "Yishun",              lat: 1.4295, lng: 103.8351, km: 22.4 },
          { name: "Khatib",              lat: 1.4174, lng: 103.8328, km: 24.1 },
          { name: "Yio Chu Kang",        lat: 1.3818, lng: 103.8449, km: 27.0 },
          { name: "Ang Mo Kio",          lat: 1.3700, lng: 103.8496, km: 28.6 },
          { name: "Bishan",              lat: 1.3510, lng: 103.8484, km: 30.7, dwellSec: 30 },
          { name: "Braddell",            lat: 1.3404, lng: 103.8466, km: 32.0 },
          { name: "Toa Payoh",           lat: 1.3327, lng: 103.8473, km: 33.0 },
          { name: "Novena",              lat: 1.3204, lng: 103.8438, km: 34.5 },
          { name: "Newton",              lat: 1.3128, lng: 103.8388, km: 35.8 },
          { name: "Orchard",             lat: 1.3043, lng: 103.8321, km: 37.4, dwellSec: 30 },
          { name: "Somerset",            lat: 1.3007, lng: 103.8388, km: 38.5 },
          { name: "Dhoby Ghaut",         lat: 1.2990, lng: 103.8453, km: 39.6 },
          { name: "City Hall",           lat: 1.2934, lng: 103.8526, km: 40.6 },
          { name: "Raffles Place",       lat: 1.2842, lng: 103.8514, km: 41.7 },
          { name: "Marina Bay",          lat: 1.2762, lng: 103.8546, km: 43.0 },
          { name: "Marina South Pier",   lat: 1.2710, lng: 103.8633, km: 45.0, dwellSec: 30 },
        ],
      },
      {
        id: "SG-MRT-East-West",
        name: "East-West Line",
        nameEn: "MRT East-West Line",
        color: "#009645",
        category: "捷運",
        directions: { up: "Eastbound (to Pasir Ris)", down: "Westbound (to Tuas Link)" },
        // East-West Line:Pasir Ris↔Tuas Link 主線。Changi Airport 支線
        // (Tanah Merah↔Changi Airport)未列入。
        stations: [
          { name: "Pasir Ris",           lat: 1.3724, lng: 103.9494, km: 0,    dwellSec: 30 },
          { name: "Tampines",            lat: 1.3534, lng: 103.9450, km: 3.0, dwellSec: 30 },
          { name: "Simei",               lat: 1.3434, lng: 103.9532, km: 4.6 },
          { name: "Tanah Merah",         lat: 1.3275, lng: 103.9466, km: 6.7 },
          { name: "Bedok",               lat: 1.3239, lng: 103.9302, km: 8.5 },
          { name: "Kembangan",           lat: 1.3208, lng: 103.9128, km: 10.7 },
          { name: "Eunos",               lat: 1.3197, lng: 103.9028, km: 12.1 },
          { name: "Paya Lebar",          lat: 1.3179, lng: 103.8924, km: 13.6 },
          { name: "Aljunied",            lat: 1.3164, lng: 103.8829, km: 14.7 },
          { name: "Kallang",             lat: 1.3115, lng: 103.8714, km: 16.4 },
          { name: "Lavender",            lat: 1.3074, lng: 103.8629, km: 17.6 },
          { name: "Bugis",               lat: 1.3008, lng: 103.8559, km: 18.8 },
          { name: "City Hall",           lat: 1.2934, lng: 103.8526, km: 20.0 },
          { name: "Raffles Place",       lat: 1.2842, lng: 103.8514, km: 21.5, dwellSec: 30 },
          { name: "Tanjong Pagar",       lat: 1.2766, lng: 103.8458, km: 22.8 },
          { name: "Outram Park",         lat: 1.2802, lng: 103.8395, km: 23.5 },
          { name: "Tiong Bahru",         lat: 1.2862, lng: 103.8270, km: 25.2 },
          { name: "Redhill",             lat: 1.2895, lng: 103.8170, km: 26.4 },
          { name: "Queenstown",          lat: 1.2944, lng: 103.8059, km: 27.7 },
          { name: "Commonwealth",        lat: 1.3022, lng: 103.7980, km: 29.0 },
          { name: "Buona Vista",         lat: 1.3074, lng: 103.7901, km: 30.0 },
          { name: "Dover",               lat: 1.3115, lng: 103.7787, km: 31.4 },
          { name: "Clementi",            lat: 1.3151, lng: 103.7649, km: 33.2 },
          { name: "Jurong East",         lat: 1.3329, lng: 103.7423, km: 36.5, dwellSec: 30 },
          { name: "Chinese Garden",      lat: 1.3422, lng: 103.7325, km: 38.0 },
          { name: "Lakeside",            lat: 1.3445, lng: 103.7211, km: 39.6 },
          { name: "Boon Lay",            lat: 1.3387, lng: 103.7060, km: 41.5 },
          { name: "Pioneer",             lat: 1.3375, lng: 103.6973, km: 42.8 },
          { name: "Joo Koon",            lat: 1.3279, lng: 103.6783, km: 45.6 },
          { name: "Gul Circle",          lat: 1.3217, lng: 103.6604, km: 48.0 },
          { name: "Tuas Crescent",       lat: 1.3210, lng: 103.6494, km: 50.5 },
          { name: "Tuas West Road",      lat: 1.3300, lng: 103.6395, km: 53.0 },
          { name: "Tuas Link",           lat: 1.3398, lng: 103.6367, km: 57.2, dwellSec: 30 },
        ],
      },
      {
        id: "SG-MRT-Circle",
        name: "Circle Line",
        nameEn: "MRT Circle Line",
        color: "#ff9900",
        category: "捷運",
        directions: { up: "Clockwise (Dhoby Ghaut → HarbourFront)", down: "Anti-clockwise" },
        // Circle Line:目前為 horseshoe(Dhoby Ghaut↔HarbourFront 28 站
        // ~29 km),Stage 6 閉環延伸完工後將正式成環。Marina Bay 支線
        // (Promenade↔Bayfront↔Marina Bay)未納入本表。
        stations: [
          { name: "Dhoby Ghaut",         lat: 1.2990, lng: 103.8453, km: 0,    dwellSec: 30 },
          { name: "Bras Basah",          lat: 1.2967, lng: 103.8505, km: 0.6 },
          { name: "Esplanade",           lat: 1.2933, lng: 103.8556, km: 1.4 },
          { name: "Promenade",           lat: 1.2933, lng: 103.8612, km: 2.2 },
          { name: "Nicoll Highway",      lat: 1.2998, lng: 103.8635, km: 3.0 },
          { name: "Stadium",             lat: 1.3030, lng: 103.8745, km: 4.5 },
          { name: "Mountbatten",         lat: 1.3060, lng: 103.8825, km: 5.5 },
          { name: "Dakota",              lat: 1.3081, lng: 103.8884, km: 6.2 },
          { name: "Paya Lebar",          lat: 1.3179, lng: 103.8924, km: 7.3 },
          { name: "MacPherson",          lat: 1.3266, lng: 103.8898, km: 8.5 },
          { name: "Tai Seng",            lat: 1.3357, lng: 103.8881, km: 9.7 },
          { name: "Bartley",             lat: 1.3427, lng: 103.8801, km: 11.0 },
          { name: "Serangoon",           lat: 1.3499, lng: 103.8731, km: 12.1 },
          { name: "Lorong Chuan",        lat: 1.3517, lng: 103.8639, km: 13.0 },
          { name: "Bishan",              lat: 1.3510, lng: 103.8484, km: 14.2, dwellSec: 30 },
          { name: "Marymount",           lat: 1.3489, lng: 103.8395, km: 15.0 },
          { name: "Caldecott",           lat: 1.3373, lng: 103.8398, km: 16.5 },
          { name: "Botanic Gardens",     lat: 1.3225, lng: 103.8157, km: 19.5 },
          { name: "Farrer Road",         lat: 1.3173, lng: 103.8073, km: 20.6 },
          { name: "Holland Village",     lat: 1.3115, lng: 103.7959, km: 22.0 },
          { name: "Buona Vista",         lat: 1.3074, lng: 103.7901, km: 23.0 },
          { name: "one-north",           lat: 1.2998, lng: 103.7872, km: 24.0 },
          { name: "Kent Ridge",          lat: 1.2935, lng: 103.7842, km: 25.2 },
          { name: "Haw Par Villa",       lat: 1.2826, lng: 103.7820, km: 26.5 },
          { name: "Pasir Panjang",       lat: 1.2762, lng: 103.7910, km: 27.5 },
          { name: "Labrador Park",       lat: 1.2722, lng: 103.8027, km: 28.8 },
          { name: "Telok Blangah",       lat: 1.2706, lng: 103.8094, km: 29.7 },
          { name: "HarbourFront",        lat: 1.2655, lng: 103.8222, km: 31.0, dwellSec: 30 },
        ],
      },
    ],
    trainTemplates: [
      { line: "SG-MRT-North-South",  type: "NSL",  badge: "NSL", badgeColor: "#d42e12", speed: 38, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "SG-MRT-East-West",    type: "EWL",  badge: "EWL", badgeColor: "#009645", speed: 40, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "SG-MRT-Circle",       type: "CCL",  badge: "CCL", badgeColor: "#ff9900", speed: 35, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
    ],
  },

  malaysia: {
    label: "Malaysia",
    center: [3.14, 101.69],
    zoom: 11,
    lines: [
      {
        id: "KL-Kelana-Jaya",
        name: "LRT Laluan Kelana Jaya",
        nameEn: "Kelana Jaya LRT Line",
        color: "#dc2626",
        category: "捷運",
        directions: { up: "Putra Heights bound", down: "Gombak bound" },
        // LRT Laluan Kelana Jaya:Putra Heights↔Gombak 46.4 km 37 站。
        stations: [
          { name: "Putra Heights",     lat: 2.9961, lng: 101.5731, km: 0,    dwellSec: 30 },
          { name: "Subang Alam",       lat: 3.0049, lng: 101.5703, km: 1.5 },
          { name: "Alam Megah",        lat: 3.0227, lng: 101.5651, km: 3.5 },
          { name: "USJ 21",            lat: 3.0399, lng: 101.5872, km: 6.0 },
          { name: "Wawasan",           lat: 3.0468, lng: 101.5921, km: 7.0 },
          { name: "Taipan",            lat: 3.0537, lng: 101.5969, km: 8.0 },
          { name: "USJ 7",             lat: 3.0571, lng: 101.5978, km: 8.5 },
          { name: "SS 18",             lat: 3.0640, lng: 101.6014, km: 9.6 },
          { name: "SS 15",             lat: 3.0758, lng: 101.5941, km: 11.0 },
          { name: "Subang Jaya",       lat: 3.0843, lng: 101.5870, km: 12.0, dwellSec: 30 },
          { name: "Glenmarie",         lat: 3.0786, lng: 101.5621, km: 14.5 },
          { name: "Ara Damansara",     lat: 3.1058, lng: 101.5780, km: 16.5 },
          { name: "Lembah Subang",     lat: 3.1131, lng: 101.6119, km: 19.0 },
          { name: "Kelana Jaya",       lat: 3.1126, lng: 101.6027, km: 20.5 },
          { name: "Taman Bahagia",     lat: 3.1112, lng: 101.6173, km: 21.6 },
          { name: "Taman Paramount",   lat: 3.1056, lng: 101.6300, km: 23.0 },
          { name: "Asia Jaya",         lat: 3.1041, lng: 101.6385, km: 24.0 },
          { name: "Taman Jaya",        lat: 3.1042, lng: 101.6480, km: 25.0 },
          { name: "Universiti",        lat: 3.1145, lng: 101.6605, km: 26.5 },
          { name: "Kerinchi",          lat: 3.1145, lng: 101.6671, km: 27.5 },
          { name: "Bangsar",           lat: 3.1273, lng: 101.6791, km: 29.0 },
          { name: "Abdullah Hukum",    lat: 3.1186, lng: 101.6731, km: 30.0 },
          { name: "KL Sentral",        lat: 3.1339, lng: 101.6863, km: 31.5, dwellSec: 30 },
          { name: "Pasar Seni",        lat: 3.1431, lng: 101.6959, km: 33.0 },
          { name: "Masjid Jamek",      lat: 3.1492, lng: 101.6964, km: 33.7 },
          { name: "Dang Wangi",        lat: 3.1577, lng: 101.7037, km: 34.7 },
          { name: "Kampung Baru",      lat: 3.1639, lng: 101.7099, km: 35.5 },
          { name: "KLCC",              lat: 3.1593, lng: 101.7139, km: 36.5, dwellSec: 30 },
          { name: "Ampang Park",       lat: 3.1606, lng: 101.7193, km: 37.2 },
          { name: "Damai",             lat: 3.1675, lng: 101.7281, km: 38.2 },
          { name: "Datuk Keramat",     lat: 3.1716, lng: 101.7328, km: 38.8 },
          { name: "Jelatek",           lat: 3.1761, lng: 101.7369, km: 39.5 },
          { name: "Setiawangsa",       lat: 3.1822, lng: 101.7430, km: 40.5 },
          { name: "Sri Rampai",        lat: 3.1973, lng: 101.7344, km: 42.5 },
          { name: "Wangsa Maju",       lat: 3.2058, lng: 101.7311, km: 43.5 },
          { name: "Taman Melati",      lat: 3.2168, lng: 101.7271, km: 45.0 },
          { name: "Gombak",            lat: 3.2389, lng: 101.7180, km: 46.4, dwellSec: 30 },
        ],
      },
      {
        id: "KL-MRT-Kajang",
        name: "MRT Laluan Kajang",
        nameEn: "MRT Kajang Line",
        color: "#16a34a",
        category: "捷運",
        directions: { up: "Kwasa Damansara bound", down: "Kajang bound" },
        // MRT Sungai Buloh-Kajang Line:Kwasa Damansara↔Kajang 51.0 km 31 站
        // (原 Sungai Buloh 端在 2022 年延伸後改為 Kwasa Damansara 為始發站)。
        stations: [
          { name: "Kwasa Damansara",    lat: 3.1735, lng: 101.5853, km: 0,    dwellSec: 30 },
          { name: "Kwasa Sentral",      lat: 3.1665, lng: 101.5847, km: 1.0 },
          { name: "Kota Damansara",     lat: 3.1556, lng: 101.5919, km: 2.5 },
          { name: "Surian",             lat: 3.1502, lng: 101.5982, km: 3.5 },
          { name: "Mutiara Damansara",  lat: 3.1559, lng: 101.6087, km: 5.0 },
          { name: "Bandar Utama",       lat: 3.1480, lng: 101.6160, km: 6.5 },
          { name: "TTDI",               lat: 3.1383, lng: 101.6309, km: 8.5 },
          { name: "Phileo Damansara",   lat: 3.1296, lng: 101.6376, km: 9.7 },
          { name: "Pusat Bandar Damansara", lat: 3.1454, lng: 101.6586, km: 12.0 },
          { name: "Semantan",           lat: 3.1490, lng: 101.6651, km: 12.7 },
          { name: "Muzium Negara",      lat: 3.1380, lng: 101.6862, km: 15.0 },
          { name: "Pasar Seni",         lat: 3.1431, lng: 101.6959, km: 16.2 },
          { name: "Merdeka",            lat: 3.1402, lng: 101.7027, km: 17.0 },
          { name: "Bukit Bintang",      lat: 3.1462, lng: 101.7102, km: 18.0, dwellSec: 30 },
          { name: "Tun Razak Exchange", lat: 3.1413, lng: 101.7196, km: 19.5 },
          { name: "Cochrane",           lat: 3.1271, lng: 101.7240, km: 21.0 },
          { name: "Maluri",             lat: 3.1233, lng: 101.7298, km: 22.0 },
          { name: "Taman Pertama",      lat: 3.1129, lng: 101.7320, km: 23.5 },
          { name: "Taman Midah",        lat: 3.1062, lng: 101.7353, km: 24.5 },
          { name: "Taman Mutiara",      lat: 3.0915, lng: 101.7435, km: 26.5 },
          { name: "Taman Connaught",    lat: 3.0760, lng: 101.7448, km: 28.0 },
          { name: "Taman Suntex",       lat: 3.0623, lng: 101.7493, km: 29.5 },
          { name: "Sri Raya",           lat: 3.0526, lng: 101.7593, km: 31.0 },
          { name: "Bandar Tun Hussein Onn", lat: 3.0444, lng: 101.7676, km: 32.5 },
          { name: "Batu 11 Cheras",     lat: 3.0342, lng: 101.7753, km: 34.0 },
          { name: "Bukit Dukung",       lat: 3.0192, lng: 101.7794, km: 36.5 },
          { name: "Sungai Jernih",      lat: 3.0080, lng: 101.7843, km: 38.0 },
          { name: "Stadium Kajang",     lat: 2.9978, lng: 101.7865, km: 40.0 },
          { name: "Kajang",             lat: 2.9836, lng: 101.7910, km: 51.0, dwellSec: 30 },
        ],
      },
    ],
    trainTemplates: [
      { line: "KL-Kelana-Jaya",  type: "LRT",  badge: "LRT", badgeColor: "#dc2626", speed: 38, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "KL-MRT-Kajang",   type: "MRT",  badge: "MRT", badgeColor: "#16a34a", speed: 45, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
    ],
  },

  thailand: {
    label: "ประเทศไทย Thailand",
    center: [13.75, 100.50],
    zoom: 11,
    lines: [
      {
        id: "BKK-BTS-Sukhumvit",
        name: "BTS สายสุขุมวิท",
        nameEn: "BTS Sukhumvit Line",
        color: "#16a34a",
        category: "捷運",
        directions: { up: "Khu Khot bound (เหนือ)", down: "Kheha bound (ใต้)" },
        // BTS Sukhumvit Line:Khu Khot↔Kheha 53.5 km 47 站。
        stations: [
          { name: "Khu Khot",           lat: 13.9626, lng: 100.6498, km: 0,    dwellSec: 30 },
          { name: "Yaek Kor Por Aor",   lat: 13.9566, lng: 100.6396, km: 1.4 },
          { name: "Royal Thai Air Force Museum", lat: 13.9270, lng: 100.6232, km: 4.6 },
          { name: "Bhumibol Adulyadej Hospital", lat: 13.9160, lng: 100.6155, km: 6.0 },
          { name: "Saphan Mai",         lat: 13.9046, lng: 100.6078, km: 7.4 },
          { name: "Sai Yud",            lat: 13.8910, lng: 100.6018, km: 9.0 },
          { name: "Phahon Yothin 59",   lat: 13.8784, lng: 100.5949, km: 10.4 },
          { name: "Wat Phra Sri Mahathat", lat: 13.8729, lng: 100.5946, km: 11.1 },
          { name: "11th Infantry Regiment", lat: 13.8660, lng: 100.5953, km: 12.0 },
          { name: "Bang Bua",           lat: 13.8569, lng: 100.5931, km: 13.0 },
          { name: "Royal Forest Department", lat: 13.8488, lng: 100.5907, km: 14.0 },
          { name: "Kasetsart University", lat: 13.8434, lng: 100.5681, km: 16.4 },
          { name: "Sena Nikhom",        lat: 13.8345, lng: 100.5681, km: 17.5 },
          { name: "Ratchayothin",       lat: 13.8267, lng: 100.5687, km: 18.5 },
          { name: "Phahon Yothin 24",   lat: 13.8180, lng: 100.5618, km: 19.6 },
          { name: "Ha Yaek Lat Phrao",  lat: 13.8161, lng: 100.5597, km: 20.0 },
          { name: "Mo Chit",            lat: 13.8024, lng: 100.5535, km: 21.5, dwellSec: 30 },
          { name: "Saphan Khwai",       lat: 13.7935, lng: 100.5499, km: 22.4 },
          { name: "Sena Ruam",          lat: 13.7856, lng: 100.5466, km: 23.3 },
          { name: "Ari",                lat: 13.7795, lng: 100.5443, km: 24.0 },
          { name: "Victory Monument",   lat: 13.7625, lng: 100.5375, km: 26.0 },
          { name: "Phaya Thai",         lat: 13.7566, lng: 100.5347, km: 26.8, dwellSec: 30 },
          { name: "Ratchathewi",        lat: 13.7515, lng: 100.5325, km: 27.5 },
          { name: "Siam",               lat: 13.7457, lng: 100.5340, km: 28.4, dwellSec: 30 },
          { name: "Chit Lom",           lat: 13.7444, lng: 100.5436, km: 29.4 },
          { name: "Phloen Chit",        lat: 13.7434, lng: 100.5482, km: 30.0 },
          { name: "Nana",               lat: 13.7404, lng: 100.5546, km: 30.7 },
          { name: "Asok",               lat: 13.7370, lng: 100.5605, km: 31.3 },
          { name: "Phrom Phong",        lat: 13.7301, lng: 100.5697, km: 32.5 },
          { name: "Thong Lo",           lat: 13.7239, lng: 100.5783, km: 33.4 },
          { name: "Ekkamai",            lat: 13.7196, lng: 100.5837, km: 34.0 },
          { name: "Phra Khanong",       lat: 13.7152, lng: 100.5917, km: 34.9 },
          { name: "On Nut",             lat: 13.7062, lng: 100.6014, km: 36.2 },
          { name: "Bang Chak",          lat: 13.6962, lng: 100.6072, km: 37.4 },
          { name: "Punnawithi",         lat: 13.6890, lng: 100.6108, km: 38.2 },
          { name: "Udom Suk",           lat: 13.6791, lng: 100.6155, km: 39.5 },
          { name: "Bang Na",            lat: 13.6680, lng: 100.6051, km: 41.0 },
          { name: "Bearing",            lat: 13.6618, lng: 100.5975, km: 42.0 },
          { name: "Samrong",            lat: 13.6469, lng: 100.5970, km: 44.0 },
          { name: "Pu Chao",            lat: 13.6402, lng: 100.5966, km: 45.0 },
          { name: "Chang Erawan",       lat: 13.6298, lng: 100.5963, km: 46.0 },
          { name: "Royal Thai Naval Academy", lat: 13.6173, lng: 100.5963, km: 47.5 },
          { name: "Pak Nam",            lat: 13.5988, lng: 100.5980, km: 49.0 },
          { name: "Srinagarindra",      lat: 13.5895, lng: 100.6026, km: 50.0 },
          { name: "Phraek Sa",          lat: 13.5783, lng: 100.6105, km: 51.5 },
          { name: "Sai Luat",           lat: 13.5676, lng: 100.6166, km: 52.5 },
          { name: "Kheha",              lat: 13.5553, lng: 100.6207, km: 53.5, dwellSec: 30 },
        ],
      },
      {
        id: "BKK-MRT-Blue",
        name: "MRT สายสีน้ำเงิน",
        nameEn: "MRT Blue Line",
        color: "#1d4ed8",
        category: "捷運",
        directions: { up: "Tha Phra outer loop", down: "Lak Song bound" },
        // MRT 藍線:Bangkok 第一條地鐵,目前為 horseshoe loop,自 Tha Phra
        // 經 Sukhumvit / Bang Sue / Chinatown / Hua Lamphong 回 Bang Wa,
        // 再延伸 Lak Song。本表 38 站 主線。
        stations: [
          { name: "Tha Phra",           lat: 13.7211, lng: 100.4748, km: 0,    dwellSec: 30 },
          { name: "Charan 13",          lat: 13.7354, lng: 100.4747, km: 1.5 },
          { name: "Fai Chai",           lat: 13.7460, lng: 100.4781, km: 3.0 },
          { name: "Bang Khun Non",      lat: 13.7569, lng: 100.4794, km: 4.5 },
          { name: "Bang Yi Khan",       lat: 13.7754, lng: 100.4886, km: 7.0 },
          { name: "Sirindhorn",         lat: 13.7905, lng: 100.4929, km: 8.5 },
          { name: "Bang Phlat",         lat: 13.7955, lng: 100.5042, km: 9.7 },
          { name: "Bang O",             lat: 13.8077, lng: 100.5099, km: 11.5 },
          { name: "Bang Pho",           lat: 13.8092, lng: 100.5219, km: 13.0 },
          { name: "Tao Poon",           lat: 13.8059, lng: 100.5311, km: 14.0, dwellSec: 30 },
          { name: "Bang Sue",           lat: 13.8023, lng: 100.5379, km: 14.8 },
          { name: "Kamphaeng Phet",     lat: 13.7998, lng: 100.5497, km: 16.0 },
          { name: "Chatuchak Park",     lat: 13.8003, lng: 100.5536, km: 16.4 },
          { name: "Phahon Yothin",      lat: 13.8136, lng: 100.5605, km: 18.0 },
          { name: "Lat Phrao",          lat: 13.8161, lng: 100.5613, km: 18.5 },
          { name: "Ratchadaphisek",     lat: 13.7878, lng: 100.5734, km: 21.0 },
          { name: "Sutthisan",          lat: 13.7780, lng: 100.5712, km: 22.0 },
          { name: "Huai Khwang",        lat: 13.7693, lng: 100.5731, km: 23.0 },
          { name: "Thailand Cultural Centre", lat: 13.7621, lng: 100.5705, km: 24.0 },
          { name: "Phra Ram 9",         lat: 13.7575, lng: 100.5650, km: 25.0 },
          { name: "Phetchaburi",        lat: 13.7484, lng: 100.5642, km: 26.0 },
          { name: "Sukhumvit",          lat: 13.7378, lng: 100.5615, km: 27.5 },
          { name: "Queen Sirikit Centre", lat: 13.7228, lng: 100.5598, km: 29.0 },
          { name: "Khlong Toei",        lat: 13.7218, lng: 100.5532, km: 30.0 },
          { name: "Lumphini",           lat: 13.7257, lng: 100.5439, km: 31.0 },
          { name: "Si Lom",             lat: 13.7290, lng: 100.5358, km: 32.0 },
          { name: "Sam Yan",            lat: 13.7321, lng: 100.5294, km: 33.0 },
          { name: "Hua Lamphong",       lat: 13.7382, lng: 100.5172, km: 34.5, dwellSec: 30 },
          { name: "Wat Mangkon",        lat: 13.7434, lng: 100.5102, km: 35.5 },
          { name: "Sam Yot",            lat: 13.7488, lng: 100.5008, km: 36.5 },
          { name: "Sanam Chai",         lat: 13.7445, lng: 100.4948, km: 37.5 },
          { name: "Itsaraphap",         lat: 13.7401, lng: 100.4860, km: 38.5 },
          { name: "Bang Phai",          lat: 13.7170, lng: 100.4753, km: 41.0 },
          { name: "Bang Wa",            lat: 13.7204, lng: 100.4571, km: 42.5 },
          { name: "Phetkasem 48",       lat: 13.7159, lng: 100.4396, km: 44.5 },
          { name: "Phasi Charoen",      lat: 13.7134, lng: 100.4248, km: 45.7 },
          { name: "Bang Khae",          lat: 13.7128, lng: 100.4093, km: 47.0 },
          { name: "Lak Song",           lat: 13.7115, lng: 100.3934, km: 48.0, dwellSec: 30 },
        ],
      },
      {
        id: "BKK-Airport-Rail",
        name: "Airport Rail Link",
        nameEn: "Airport Rail Link",
        color: "#dc2626",
        category: "HSR",
        directions: { up: "Phaya Thai bound", down: "Suvarnabhumi bound" },
        stations: [
          { name: "Phaya Thai",         lat: 13.7566, lng: 100.5347, km: 0,    dwellSec: 60 },
          { name: "Ratchaprarop",       lat: 13.7515, lng: 100.5424, km: 1.4 },
          { name: "Makkasan",           lat: 13.7508, lng: 100.5610, km: 3.5, dwellSec: 30 },
          { name: "Ramkhamhaeng",       lat: 13.7506, lng: 100.5828, km: 6.5 },
          { name: "Hua Mak",            lat: 13.7459, lng: 100.6225, km: 10.5 },
          { name: "Ban Thap Chang",     lat: 13.7411, lng: 100.6535, km: 14.5 },
          { name: "Lat Krabang",        lat: 13.7269, lng: 100.7508, km: 24.5 },
          { name: "Suvarnabhumi",       lat: 13.6954, lng: 100.7535, km: 28.6, dwellSec: 60 },
        ],
      },
    ],
    trainTemplates: [
      { line: "BKK-BTS-Sukhumvit", type: "BTS",   badge: "BTS", badgeColor: "#16a34a", speed: 40, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "BKK-MRT-Blue",      type: "MRT",   badge: "MRT", badgeColor: "#1d4ed8", speed: 38, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "BKK-Airport-Rail",  type: "ARL",   badge: "ARL", badgeColor: "#dc2626", speed: 100, interval: 12, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 30 },
    ],
  },

  vietnam: {
    label: "Việt Nam Vietnam",
    center: [16.0, 107.0],
    zoom: 6,
    lines: [
      {
        id: "HCMC-Metro-1",
        name: "Tuyến Metro số 1",
        nameEn: "Hồ Chí Minh City Metro Line 1",
        color: "#dc2626",
        category: "捷運",
        directions: { up: "Bến Thành bound", down: "Suối Tiên bound" },
        // 胡志明市 Metro 1 號線:Bến Thành↔Suối Tiên 19.7 km 14 站,
        // 越南第一條都會地鐵,2024 年通車。
        stations: [
          { name: "Bến Thành",          lat: 10.7724, lng: 106.6986, km: 0,    dwellSec: 30 },
          { name: "Nhà Hát Thành Phố",  lat: 10.7766, lng: 106.7035, km: 0.7 },
          { name: "Ba Son",             lat: 10.7837, lng: 106.7088, km: 1.5 },
          { name: "Văn Thánh",          lat: 10.7984, lng: 106.7142, km: 3.5 },
          { name: "Tân Cảng",           lat: 10.7972, lng: 106.7218, km: 4.5 },
          { name: "Thảo Điền",          lat: 10.8050, lng: 106.7398, km: 6.5 },
          { name: "An Phú",             lat: 10.8096, lng: 106.7497, km: 7.7 },
          { name: "Rạch Chiếc",         lat: 10.8189, lng: 106.7611, km: 9.3 },
          { name: "Phước Long",         lat: 10.8273, lng: 106.7756, km: 11.0 },
          { name: "Bình Thái",          lat: 10.8450, lng: 106.7723, km: 13.5 },
          { name: "Thủ Đức",            lat: 10.8506, lng: 106.7717, km: 14.5 },
          { name: "Khu Công Nghệ Cao",  lat: 10.8595, lng: 106.7878, km: 16.5 },
          { name: "Đại Học Quốc Gia",   lat: 10.8721, lng: 106.7960, km: 18.0 },
          { name: "Suối Tiên",          lat: 10.8765, lng: 106.8093, km: 19.7, dwellSec: 30 },
        ],
      },
      {
        id: "Hanoi-Metro-2A",
        name: "Tuyến số 2A",
        nameEn: "Hà Nội Metro Line 2A",
        color: "#16a34a",
        category: "捷運",
        directions: { up: "Cát Linh bound", down: "Yên Nghĩa bound" },
        // 河內 Metro 2A 線:Cát Linh↔Yên Nghĩa 13.0 km 12 站,
        // 越南第一條城市軌道,2021 年通車。
        stations: [
          { name: "Cát Linh",           lat: 21.0297, lng: 105.8327, km: 0,    dwellSec: 30 },
          { name: "La Thành",           lat: 21.0218, lng: 105.8267, km: 0.9 },
          { name: "Thái Hà",            lat: 21.0148, lng: 105.8224, km: 1.7 },
          { name: "Láng",               lat: 21.0116, lng: 105.8192, km: 2.2 },
          { name: "Đại Học Quốc Gia",   lat: 21.0073, lng: 105.8132, km: 2.9 },
          { name: "Vành Đai 3",         lat: 20.9967, lng: 105.7983, km: 4.5 },
          { name: "Thanh Xuân 3",       lat: 20.9869, lng: 105.7878, km: 6.0 },
          { name: "Bến Xe Hà Đông",     lat: 20.9756, lng: 105.7796, km: 7.5 },
          { name: "Hà Đông",            lat: 20.9654, lng: 105.7768, km: 8.7 },
          { name: "La Khê",             lat: 20.9576, lng: 105.7688, km: 10.0 },
          { name: "Văn Khê",            lat: 20.9497, lng: 105.7657, km: 11.0 },
          { name: "Yên Nghĩa",          lat: 20.9448, lng: 105.7550, km: 13.0, dwellSec: 30 },
        ],
      },
    ],
    trainTemplates: [
      { line: "HCMC-Metro-1",  type: "Metro 1",  badge: "M1", badgeColor: "#dc2626", speed: 40, interval: 5, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Hanoi-Metro-2A", type: "Metro 2A", badge: "2A", badgeColor: "#16a34a", speed: 35, interval: 6, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
    ],
  },
};

// ========================================================
// MERGE GENERATED SHAPES (from rail-data.generated.js, if present)
// Each line in RAIL_SHAPES contributes:
//   - line.shape: [{lat,lng,km}, ...] — high-resolution polyline along the real
//     railway alignment, with cumulative km for fast lookup
//   - station.km is overwritten with the cumulative km of the station projected
//     onto the shape (so stations and shape stay numerically consistent)
// When a line has no generated shape, line.shape stays undefined and helpers
// fall back to the station-to-station polyline as before.
// ========================================================
(function mergeShapes(){
  const shapes = RAIL_SHAPES;
  if (!shapes) return;
  for (const region of Object.values(RAIL_DATA)) {
    for (const line of region.lines) {
      const gen = shapes[line.id];
      if (!gen || !gen.shape || gen.shape.length < 2) continue;

      // Build shape with cumulative km in one pass
      const pts = gen.shape;
      const out = new Array(pts.length);
      let cum = 0;
      out[0] = { lat: pts[0][0], lng: pts[0][1], km: 0 };
      for (let i = 1; i < pts.length; i++) {
        const a = out[i-1];
        const b = { lat: pts[i][0], lng: pts[i][1] };
        // Inline haversine to avoid forward-ref to RailUtil (defined below)
        const R = 6371;
        const toRad = d => d * Math.PI / 180;
        const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
        const la1 = toRad(a.lat), la2 = toRad(b.lat);
        const x = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;
        cum += 2 * R * Math.asin(Math.sqrt(x));
        out[i] = { lat: b.lat, lng: b.lng, km: cum };
      }
      line.shape = out;

      // When the build script emits a full TDX-derived stations array (only for
      // TRA-West, TRA-East, TRA-South-Link), replace the hand-coded stub entirely.
      // The projected km values come straight from the shape projection and are
      // guaranteed monotonic by construction, so we skip the stationKms
      // monotonicity check for these lines.
      if (gen.stations && gen.stations.length > 0) {
        line.stations = gen.stations.map(s => ({ name: s.name, lat: s.lat, lng: s.lng, km: s.km }));
        continue; // shape + stations done; skip the stationKms path below
      }

      // Validate the projected station kms before applying. Multi-segment or
      // loop shapes (e.g. Tokaido stitched across multiple relations, Yamanote
      // loop without a canonical anchor) can produce non-monotonic projected
      // kms that break schedule generation. When that happens, keep the
      // polyline geometry but discard the projected stationKms — the merge
      // still benefits from the curved shape, while station kms fall back to
      // the hand-coded values from the station list (preserved monotonicity).
      let useGenStationKms = true;
      if (gen.stationKms) {
        const isLoopLine = line.stations.length >= 3 &&
          line.stations[0].name === line.stations[line.stations.length - 1].name;
        let prev = -Infinity;
        for (let i = 0; i < line.stations.length; i++) {
          const st = line.stations[i];
          const isLoopBack = isLoopLine && i === line.stations.length - 1 && gen.totalKm != null;
          const k = isLoopBack ? gen.totalKm : gen.stationKms[st.name];
          if (k == null) continue;
          if (k < prev || (k === prev && (i === 0 || line.stations[i-1].name !== st.name))) {
            useGenStationKms = false;
            break;
          }
          prev = k;
        }
        if (!useGenStationKms && typeof console !== 'undefined') {
          console.warn(`[rail-data] line "${line.id}": projected station kms non-monotonic; using polyline shape with hand-coded station kms`);
        }
      }

      // Snapshot hand-coded extremes BEFORE any station-km update, so we can
      // apply the same linear remap to `line.grades` (whose km values were
      // authored in hand-coded km space alongside the station list).
      const handFirst = line.stations[0].km;
      const handLast = line.stations[line.stations.length - 1].km;
      const handSpan = handLast - handFirst;

      // Update station km from generator only when the projection is
      // monotonic (validated above). Otherwise leave st.km at the hand-coded
      // value, but rescale it to fit within the polyline's total length so
      // train kinematics line up with the visible track.
      if (gen.stationKms && useGenStationKms) {
        const isLoopLine = line.stations.length >= 3 &&
          line.stations[0].name === line.stations[line.stations.length - 1].name;
        for (let i = 0; i < line.stations.length; i++) {
          const st = line.stations[i];
          const isLoopBack = isLoopLine && i === line.stations.length - 1 && gen.totalKm != null;
          const k = isLoopBack ? gen.totalKm : gen.stationKms[st.name];
          if (k != null) st.km = k;
        }
      } else if (gen.totalKm != null && line.stations.length >= 2) {
        // Non-monotonic projection: rescale hand-coded kms to span the
        // polyline. Keeps inter-station spacing proportional to data while
        // letting trains traverse the full visible track length.
        const last = line.stations[line.stations.length - 1].km;
        const first = line.stations[0].km;
        const span = last - first;
        if (span > 0) {
          const scale = gen.totalKm / span;
          for (const st of line.stations) {
            st.km = (st.km - first) * scale;
          }
        }
      }

      // Apply the same linear remap (hand-coded km → post-merge station km)
      // to grades so they stay aligned with stations on the polyline. Uses
      // first/last stations as anchor points; intermediate stations may not
      // be exactly proportional but typical drift is < 1 km.
      if (line.grades && handSpan > 0) {
        const newFirst = line.stations[0].km;
        const newLast = line.stations[line.stations.length - 1].km;
        const newSpan = newLast - newFirst;
        if (newSpan > 0 && Math.abs(newSpan - handSpan) > 1e-6) {
          const scale = newSpan / handSpan;
          for (const g of line.grades) {
            g.from = (g.from - handFirst) * scale + newFirst;
            g.to = (g.to - handFirst) * scale + newFirst;
          }
        }
      }
    }
  }
})();

// ========================================================
// GEO HELPERS
// ========================================================
export const RailUtil = (function(){
  const R = 6371; // km
  const toRad = d => d * Math.PI / 180;

  function haversine(a, b) {
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const la1 = toRad(a.lat), la2 = toRad(b.lat);
    const x = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }

  // Project point P onto segment AB, returning {lat,lng,t,dist}
  // where t in [0,1] is param along AB, dist = km from P to closest point.
  // We use a local flat approximation — fine for < 1000 km segments.
  function projectOnSegment(P, A, B) {
    const latMid = (A.lat + B.lat + P.lat) / 3;
    const kx = Math.cos(toRad(latMid)) * 111.32;
    const ky = 110.57;
    const ax = A.lng * kx, ay = A.lat * ky;
    const bx = B.lng * kx, by = B.lat * ky;
    const px = P.lng * kx, py = P.lat * ky;
    const dx = bx - ax, dy = by - ay;
    const len2 = dx*dx + dy*dy;
    let t = len2 === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const cx = ax + t * dx, cy = ay + t * dy;
    const dist = Math.sqrt((px-cx)**2 + (py-cy)**2);
    return {
      lat: A.lat + t * (B.lat - A.lat),
      lng: A.lng + t * (B.lng - A.lng),
      t, dist,
    };
  }

  // Pick the polyline to query for a given line: prefer the high-res shape from
  // rail-data.generated.js, fall back to the station-to-station path.
  function polylineFor(lineOrStations) {
    // Backward-compat: if caller passed a stations array directly, use it.
    if (Array.isArray(lineOrStations)) return lineOrStations;
    const line = lineOrStations;
    return (line.shape && line.shape.length >= 2) ? line.shape : line.stations;
  }

  // Find the closest point on a line's polyline.
  // Accepts either a line object (preferred) or a stations array (legacy).
  // Returns {lat, lng, km, segmentIndex, dist}.
  function closestOnLine(P, lineOrStations) {
    const poly = polylineFor(lineOrStations);
    let best = null;
    for (let i = 0; i < poly.length - 1; i++) {
      const A = poly[i], B = poly[i+1];
      const proj = projectOnSegment(P, A, B);
      const km = A.km + proj.t * (B.km - A.km);
      if (!best || proj.dist < best.dist) {
        best = { lat: proj.lat, lng: proj.lng, km, segmentIndex: i, dist: proj.dist };
      }
    }
    return best;
  }

  // Given a line and a cumulative km value, return lat/lng of that position.
  function positionAtKm(lineOrStations, km) {
    const poly = polylineFor(lineOrStations);
    if (km <= poly[0].km) return { lat: poly[0].lat, lng: poly[0].lng };
    const last = poly[poly.length - 1];
    if (km >= last.km) return { lat: last.lat, lng: last.lng };
    for (let i = 0; i < poly.length - 1; i++) {
      const A = poly[i], B = poly[i+1];
      if (km >= A.km && km <= B.km) {
        const t = (km - A.km) / (B.km - A.km);
        return { lat: A.lat + t * (B.lat - A.lat), lng: A.lng + t * (B.lng - A.lng) };
      }
    }
    return { lat: last.lat, lng: last.lng };
  }

  // ====================================================
  // Kinematic helpers (curvature-aware velocity profile per inter-station run).
  // The profile object is a chain of (x, v, t) nodes along the actual polyline:
  // each node carries its position from departure (m), the speed at that node
  // (m/s), and the elapsed time since departure (s). Speed at every node is
  // capped by both the template cruise speed and the lateral-acceleration limit
  // sqrt(aLat · R), where R is the local curve radius from the polyline shape.
  // A forward (accel-limited) and backward (decel-limited) sweep then enforces
  // kinematic feasibility, giving a profile that starts and ends at rest.
  // Pure functions — shared by TrainGen (build time) and the React memos.
  // ====================================================

  // Min plausible curve radius. Caps the slowdown from noisy polyline points
  // (e.g. OSM zig-zag artefacts) that would otherwise produce R values far
  // tighter than real track geometry permits.
  const MIN_CURVE_RADIUS_M = 60;
  const DEFAULT_A_LAT = 0.65;

  // Curvature radius (m) at every interior node of `points` via 3-point
  // circumscribed-circle formula in a local flat (lat/lng → metres) frame.
  // Endpoints get Infinity (boundary handled via vCap=0 at stations).
  function curvatureRadii(points) {
    const N = points.length;
    const out = new Array(N).fill(Infinity);
    if (N < 3) return out;
    let sumLat = 0;
    for (const p of points) sumLat += p.lat;
    const latMid = sumLat / N;
    const kx = Math.cos(latMid * Math.PI / 180) * 111320; // m per deg lng
    const ky = 110570; // m per deg lat
    for (let i = 1; i < N - 1; i++) {
      const A = points[i-1], B = points[i], C = points[i+1];
      const ax = A.lng * kx, ay = A.lat * ky;
      const bx = B.lng * kx, by = B.lat * ky;
      const cx = C.lng * kx, cy = C.lat * ky;
      const dAB = Math.hypot(bx-ax, by-ay);
      const dBC = Math.hypot(cx-bx, cy-by);
      const dCA = Math.hypot(ax-cx, ay-cy);
      const cross2 = Math.abs((bx-ax)*(cy-ay) - (by-ay)*(cx-ax));
      if (cross2 < 1e-6) { out[i] = Infinity; continue; }
      out[i] = (dAB * dBC * dCA) / (2 * cross2);
    }
    return out;
  }

  // Extract points along `line.shape` between canonical kms kmA and kmB, in
  // travel direction (so x grows from 0 to total length). Endpoints are
  // interpolated onto the polyline. Sub-segments longer than maxStepM are
  // densified (linearly between consecutive shape points) so the kinematic
  // sweep has enough resolution to spend distance accelerating/decelerating.
  function shapeBetween(line, kmA, kmB, maxStepM) {
    if (maxStepM == null) maxStepM = 250;
    const poly = polylineFor(line);
    const reverse = kmB < kmA;
    const lo = Math.min(kmA, kmB);
    const hi = Math.max(kmA, kmB);
    const interp = (i, k) => {
      const A = poly[i], B = poly[i+1];
      const span = B.km - A.km;
      const t = span > 0 ? (k - A.km) / span : 0;
      return {
        lat: A.lat + (B.lat - A.lat) * t,
        lng: A.lng + (B.lng - A.lng) * t,
        km: k,
      };
    };
    let iLo = 0;
    for (let i = 0; i < poly.length - 1; i++) {
      if (poly[i].km <= lo && poly[i+1].km >= lo) { iLo = i; break; }
    }
    let iHi = poly.length - 2;
    for (let i = poly.length - 2; i >= 0; i--) {
      if (poly[i].km <= hi && poly[i+1].km >= hi) { iHi = i; break; }
    }
    const raw = [interp(iLo, lo)];
    for (let i = iLo + 1; i <= iHi; i++) {
      if (poly[i].km > lo && poly[i].km < hi) raw.push(poly[i]);
    }
    raw.push(interp(iHi, hi));

    const seq = reverse ? raw.slice().reverse() : raw;
    const xOf = reverse
      ? (km) => (hi - km) * 1000
      : (km) => (km - lo) * 1000;

    const out = [{ lat: seq[0].lat, lng: seq[0].lng, x: xOf(seq[0].km) }];
    for (let i = 1; i < seq.length; i++) {
      const prev = out[out.length - 1];
      const next = { lat: seq[i].lat, lng: seq[i].lng, x: xOf(seq[i].km) };
      const dx = next.x - prev.x;
      if (dx > maxStepM) {
        const k = Math.ceil(dx / maxStepM);
        for (let j = 1; j < k; j++) {
          const t = j / k;
          out.push({
            lat: prev.lat + (next.lat - prev.lat) * t,
            lng: prev.lng + (next.lng - prev.lng) * t,
            x: prev.x + dx * t,
          });
        }
      }
      out.push(next);
    }
    return out;
  }

  // Build a velocity profile along `points` (with x in metres from start).
  // Returns { L, T, nodes:[{x, v, t}, ...] }. The profile starts and ends at
  // rest (v=0 at first/last node) and respects vCruise + curvature limits +
  // accel/decel feasibility from a forward/backward sweep.
  function kinematicProfile(points, vCruise, accel, decel, aLat) {
    const N = points.length;
    if (N < 2 || !(points[N-1].x - points[0].x > 0)) {
      const x0 = N > 0 ? points[0].x : 0;
      return { L: 0, T: 0, nodes: [{ x: x0, v: 0, t: 0 }] };
    }
    const L = points[N-1].x - points[0].x;
    const aLatEff = (aLat != null && aLat > 0) ? aLat : DEFAULT_A_LAT;
    const R = curvatureRadii(points);

    // 1. Speed cap at each node: cruise ∧ curvature limit. Endpoints clamped to
    // 0 so the sweep starts and ends at rest.
    const vCap = new Array(N);
    for (let i = 0; i < N; i++) {
      if (i === 0 || i === N - 1) { vCap[i] = 0; continue; }
      const r = isFinite(R[i]) ? Math.max(R[i], MIN_CURVE_RADIUS_M) : Infinity;
      const vCurve = isFinite(r) ? Math.sqrt(aLatEff * r) : Infinity;
      vCap[i] = Math.min(vCruise, vCurve);
    }

    // 2. Forward sweep: accel-limited from preceding node.
    const v = new Array(N);
    v[0] = 0;
    for (let i = 1; i < N; i++) {
      const dx = points[i].x - points[i-1].x;
      const vAccel = Math.sqrt(v[i-1]*v[i-1] + 2 * accel * dx);
      v[i] = Math.min(vCap[i], vAccel);
    }

    // 3. Backward sweep: decel-limited into following node.
    for (let i = N - 2; i >= 0; i--) {
      const dx = points[i+1].x - points[i].x;
      const vDecel = Math.sqrt(v[i+1]*v[i+1] + 2 * decel * dx);
      v[i] = Math.min(v[i], vDecel);
    }

    // 4. Time integration. Within each sub-segment v varies linearly with x
    // under constant acceleration, so dt = 2·dx / (v0+v1) (exact).
    const nodes = new Array(N);
    nodes[0] = { x: points[0].x, v: v[0], t: 0 };
    let t = 0;
    for (let i = 1; i < N; i++) {
      const dx = points[i].x - points[i-1].x;
      const vSum = v[i-1] + v[i];
      let dt;
      if (vSum > 1e-9) {
        dt = (2 * dx) / vSum;
      } else if (dx > 0) {
        // Both endpoints at rest with non-zero dx — only happens at degenerate
        // boundaries; fall back to constant-accel-from-rest time.
        dt = Math.sqrt(2 * dx / Math.max(accel, 0.01));
      } else {
        dt = 0;
      }
      t += dt;
      nodes[i] = { x: points[i].x, v: v[i], t };
    }
    return { L, T: t, nodes };
  }

  // Position (m from start) at time τ (s since departure).
  function kmAtTimeInProfile(profile, tau) {
    const nodes = profile.nodes;
    if (tau <= 0) return nodes[0].x;
    if (tau >= profile.T) return nodes[nodes.length - 1].x;
    let lo = 0, hi = nodes.length - 1;
    while (lo + 1 < hi) {
      const mid = (lo + hi) >> 1;
      if (nodes[mid].t <= tau) lo = mid; else hi = mid;
    }
    const a = nodes[lo], b = nodes[hi];
    const dt = b.t - a.t;
    if (dt <= 0) return a.x;
    const v0 = a.v, v1 = b.v;
    const acc = (v1 - v0) / dt; // local constant acceleration
    const tau1 = tau - a.t;
    return a.x + v0 * tau1 + 0.5 * acc * tau1 * tau1;
  }

  // Time (s since departure) at position x (m from start). Subtracts the
  // start offset so this works regardless of whether profile.nodes[0].x is 0.
  function timeAtKmInProfile(profile, x) {
    const nodes = profile.nodes;
    if (x <= nodes[0].x) return 0;
    if (x >= nodes[nodes.length - 1].x) return profile.T;
    let lo = 0, hi = nodes.length - 1;
    while (lo + 1 < hi) {
      const mid = (lo + hi) >> 1;
      if (nodes[mid].x <= x) lo = mid; else hi = mid;
    }
    const a = nodes[lo], b = nodes[hi];
    const dx = b.x - a.x;
    if (dx <= 0) return a.t;
    const dt = b.t - a.t;
    const v0 = a.v, v1 = b.v;
    const acc = (v1 - v0) / dt;
    const xLocal = x - a.x;
    if (Math.abs(acc) < 1e-9) {
      return a.t + xLocal / Math.max(v0, 1e-9);
    }
    // Solve x_local = v0·τ + 0.5·acc·τ² for τ ≥ 0.
    const disc = v0 * v0 + 2 * acc * xLocal;
    const sqrtD = Math.sqrt(Math.max(0, disc));
    return a.t + (-v0 + sqrtD) / acc;
  }

  // Normalize Chinese station names so user input "台北" / "台東" matches the
  // TDX-canonical "臺北" / "臺東" (and vice versa). The two glyphs are
  // semantically identical in Taiwan place names; TDX uses 臺, common usage
  // mixes both. This collapses 臺 → 台 for keys, queries, and equality checks.
  // For display, the canonical TDX form (with 臺) is preserved in `station.name`.
  function normalizeName(s) {
    return typeof s === 'string' ? s.replace(/臺/g, '台') : s;
  }
  function namesEqual(a, b) {
    return normalizeName(a) === normalizeName(b);
  }

  // Split the line's polyline into contiguous segments tagged by grade type
  // (ground / underground / elevated). Gaps in `line.grades` are filled with
  // "ground". Lines without `grades` collapse to a single ground segment
  // covering the entire line (so the renderer can call this unconditionally).
  // Returns: [{ type, fromKm, toKm, points: [[lat,lng], ...], note? }, ...]
  function gradeSegments(line) {
    const poly = polylineFor(line);
    if (!poly || poly.length < 2) return [];
    const totalKm = poly[poly.length - 1].km;
    const raw = (line.grades || []).slice().sort((a, b) => a.from - b.from);
    const ranges = [];
    let cur = 0;
    for (const r of raw) {
      if (r.from > cur + 1e-6) ranges.push({ from: cur, to: r.from, type: 'ground' });
      const from = Math.max(r.from, cur);
      const to = Math.min(r.to, totalKm);
      if (to > from + 1e-6) ranges.push({ from, to, type: r.type, note: r.note });
      cur = Math.max(cur, to);
    }
    if (cur < totalKm - 1e-6) ranges.push({ from: cur, to: totalKm, type: 'ground' });
    if (ranges.length === 0) ranges.push({ from: 0, to: totalKm, type: 'ground' });

    const interp = (i, k) => {
      const A = poly[i], B = poly[i+1];
      const span = B.km - A.km;
      const t = span > 0 ? (k - A.km) / span : 0;
      return [A.lat + (B.lat - A.lat) * t, A.lng + (B.lng - A.lng) * t];
    };
    return ranges.map(r => {
      const lo = r.from, hi = r.to;
      let iLo = 0;
      for (let i = 0; i < poly.length - 1; i++) {
        if (poly[i].km <= lo && poly[i+1].km >= lo) { iLo = i; break; }
      }
      let iHi = poly.length - 2;
      for (let i = poly.length - 2; i >= 0; i--) {
        if (poly[i].km <= hi && poly[i+1].km >= hi) { iHi = i; break; }
      }
      const pts = [interp(iLo, lo)];
      for (let i = iLo + 1; i <= iHi; i++) {
        if (poly[i].km > lo && poly[i].km < hi) pts.push([poly[i].lat, poly[i].lng]);
      }
      pts.push(interp(iHi, hi));
      return { type: r.type, fromKm: lo, toKm: hi, points: pts, note: r.note };
    });
  }

  return { haversine, projectOnSegment, closestOnLine, positionAtKm,
           shapeBetween, curvatureRadii, gradeSegments,
           kinematicProfile, kmAtTimeInProfile, timeAtKmInProfile,
           normalizeName, namesEqual };
})();

// ========================================================
// TRAIN GENERATOR — given a reference time (Date), generate the list of trains
// running on a given day. Each train has stops[{stationIdx, time}].
// ========================================================
export const TrainGen = (function(){
  // Hash for deterministic train numbers
  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  // Generate all trains for a given region + date (local)
  // Cached per (region, dateYYYYMMDD)
  const cache = {};

  function generate(regionKey, date) {
    const region = RAIL_DATA[regionKey];
    const dateKey = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    // Bump the version suffix when the kinematic model changes.
    const cacheKey = regionKey + "|" + dateKey + "|kinV2";
    if (cache[cacheKey]) return cache[cacheKey];

    const trains = [];
    const daySeed = hash(dateKey);
    // Service window: 5:30am -> 23:30 (in minutes from midnight)
    const svcStart = 5.5 * 60, svcEnd = 23.5 * 60;

    region.trainTemplates.forEach((tpl, tplIdx) => {
      const line = region.lines.find(l => l.id === tpl.line);
      if (!line) return;
      const numTrains = Math.max(1, Math.floor((svcEnd - svcStart) / tpl.interval));
      const vCruise = tpl.speed / 3.6; // km/h → m/s
      const accel = tpl.accel, decel = tpl.decel, defaultDwell = tpl.dwellSec;
      const aLat = tpl.aLat; // m/s² lateral comfort cap (per train type)

      for (let dir = 0; dir < 2; dir++) { // 0 = down, 1 = up
        // Build a directional view: stations in travel order, with km-from-origin
        // (always 0 at the start of the run, growing to totalKm at the end). The
        // canonical (region-wide) station.km is preserved for snap lookups.
        const stationsDir = dir === 1
          ? line.stations.slice().reverse()
          : line.stations.slice();
        const lastKm = line.stations[line.stations.length - 1].km;
        const stationIdxOf = (sidx) => dir === 1 ? (line.stations.length - 1 - sidx) : sidx;
        const localKmOf = (st) => dir === 1 ? (lastKm - st.km) : st.km;

        // Pre-compute kinematic profiles once per (template, direction). Each
        // profile runs between consecutive stations in travel order along the
        // actual polyline shape (so curve radii limit the speed locally);
        // tDepart / tArrive are filled in per-train below.
        const segTemplates = [];
        for (let i = 0; i < stationsDir.length - 1; i++) {
          const a = stationsDir[i], b = stationsDir[i+1];
          const pts = RailUtil.shapeBetween(line, a.km, b.km);
          const seg = RailUtil.kinematicProfile(pts, vCruise, accel, decel, aLat);
          segTemplates.push({
            kin: seg,
            kmStartCanonical: a.km,
            kmEndCanonical: b.km,
            localKmStart: localKmOf(a),
            localKmEnd: localKmOf(b),
            stationIdxStart: stationIdxOf(i),
            stationIdxEnd: stationIdxOf(i+1),
          });
        }

        for (let i = 0; i < numTrains; i++) {
          // Stagger up/down by half an interval
          const startMin = svcStart + i * tpl.interval + (dir * tpl.interval * 0.5);
          if (startMin > svcEnd) continue;
          const numBase = 100 + (tplIdx * 200) + (dir * 1000) + i * 2;
          const trainNumber = makeTrainNumber(tpl, numBase, dir, daySeed);

          // Walk segments accumulating clock seconds. arrival[0] = startMin,
          // departure[i] = arrival[i] + dwell, arrival[i+1] = departure[i] + seg.T.
          const startSec = startMin * 60;
          const stops = new Array(stationsDir.length);
          const segments = new Array(segTemplates.length);

          let clock = startSec;
          for (let sidx = 0; sidx < stationsDir.length; sidx++) {
            const st = stationsDir[sidx];
            const arrival = clock;
            const isEndpoint = (sidx === 0 || sidx === stationsDir.length - 1);
            const dwellSec = isEndpoint ? 0 : (st.dwellSec != null ? st.dwellSec : defaultDwell);
            const departure = clock + dwellSec;
            stops[sidx] = {
              stationIdx: stationIdxOf(sidx),
              name: st.name,
              km: st.km,
              lat: st.lat,
              lng: st.lng,
              arrival: secondsToDate(date, arrival),
              departure: secondsToDate(date, departure),
              dwellSec,
            };
            if (sidx < segTemplates.length) {
              const tpl = segTemplates[sidx];
              segments[sidx] = {
                kin: tpl.kin,
                kmStartCanonical: tpl.kmStartCanonical,
                kmEndCanonical: tpl.kmEndCanonical,
                localKmStart: tpl.localKmStart,
                localKmEnd: tpl.localKmEnd,
                stationIdxStart: tpl.stationIdxStart,
                stationIdxEnd: tpl.stationIdxEnd,
                tDepart: secondsToDate(date, departure),
                tArrive: secondsToDate(date, departure + tpl.kin.T),
              };
              clock = departure + tpl.kin.T;
            }
          }

          trains.push({
            id: `${tpl.line}-${tpl.type}-${dir}-${i}`,
            number: trainNumber,
            type: tpl.type,
            badge: tpl.badge,
            badgeColor: tpl.badgeColor,
            line: line,
            direction: dir === 1 ? "up" : "down",
            directionLabel: dir === 1 ? line.directions.up : line.directions.down,
            speed: tpl.speed,
            accel, decel,
            stops,
            segments,
            startTime: stops[0].departure,
            endTime: stops[stops.length - 1].arrival,
          });
        }
      }
    });

    cache[cacheKey] = trains;
    return trains;
  }

  function makeTrainNumber(tpl, base, dir, daySeed) {
    const offset = (daySeed % 97);
    const n = base + offset + (dir ? 0 : 1);
    // Prefixes per type
    const prefixes = {
      "自強": "", "莒光": "", "區間": "",
      "高鐵": "", "太魯閣": "", "普悠瑪": "",
      "のぞみ": "", "ひかり": "", "こだま": "",
      "山手線": "", "快速": "", "特別快速": "",
    };
    // Real-world-ish number ranges
    if (tpl.type === "高鐵") return String(100 + (n % 900));
    if (tpl.type === "のぞみ") return String(1 + (n % 299));
    if (tpl.type === "ひかり") return String(460 + (n % 40));
    if (tpl.type === "こだま") return String(700 + (n % 90));
    if (tpl.type === "山手線") return String(n % 9999).padStart(4, "0") + "G";
    return String(100 + (n % 1800));
  }

  function secondsToDate(baseDate, seconds) {
    const d = new Date(baseDate);
    d.setHours(0, 0, 0, 0);
    // Use ms to preserve sub-second precision (e.g. dwell durations).
    d.setTime(d.getTime() + Math.round(seconds * 1000));
    return d;
  }

  return { generate };
})();
