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
          { name: "新神戸",   lat: 34.7065, lng: 135.1956, km: 32.7 },
          { name: "西明石",   lat: 34.6669, lng: 134.9604, km: 53.2 },
          { name: "姫路",     lat: 34.8264, lng: 134.6908, km: 86.8 },
          { name: "相生",     lat: 34.8183, lng: 134.4740, km: 105.9 },
          { name: "岡山",     lat: 34.6668, lng: 133.9183, km: 164.8, dwellSec: 60 },
          { name: "新倉敷",   lat: 34.5653, lng: 133.6785, km: 187.3 },
          { name: "福山",     lat: 34.4893, lng: 133.3619, km: 217.8 },
          { name: "新尾道",   lat: 34.4301, lng: 133.1903, km: 235.1 },
          { name: "三原",     lat: 34.4008, lng: 133.0833, km: 245.8 },
          { name: "東広島",   lat: 34.3889, lng: 132.7589, km: 280.7 },
          { name: "広島",     lat: 34.3985, lng: 132.4754, km: 309.8, dwellSec: 60 },
          { name: "新岩国",   lat: 34.1646, lng: 132.1495, km: 348.4 },
          { name: "徳山",     lat: 34.0511, lng: 131.8021, km: 391.0 },
          { name: "新山口",   lat: 34.0931, lng: 131.3970, km: 432.6 },
          { name: "厚狭",     lat: 34.0534, lng: 131.1598, km: 465.6 },
          { name: "新下関",   lat: 34.0082, lng: 130.9493, km: 490.1 },
          { name: "小倉",     lat: 33.8868, lng: 130.8825, km: 509.5, dwellSec: 60 },
          { name: "博多",     lat: 33.5900, lng: 130.4204, km: 553.7, dwellSec: 90 },
        ],
        // 山陽新幹線:約半數路段為山岳トンネル(六甲・関門・新神戸前後等
        // 多處長隧道)。下面只標兩處代表性區段,其餘隧道與高架未細列。
        grades: [
          { from: 25,    to: 35,    type: "tunnel",   note: "六甲トンネル (約 16 km, 跨新神戸付近)" },
          { from: 480,   to: 495,   type: "tunnel",   note: "新関門トンネル (約 18.7 km, 海底)" },
        ],
      },
      {
        id: "Nishi-Kyushu-Shinkansen",
        name: "西九州新幹線",
        nameEn: "Nishi Kyushu Shinkansen",
        color: "#e11d48",
        category: "HSR",
        directions: { up: "上り (武雄温泉方面)", down: "下り (長崎方面)" },
        // 西九州新幹線:武雄温泉↔長崎 5 駅,約 66 km。fallback km is
        // line-length scaled; generated OSM stationKms replace it for runtime.
        stations: [
          { name: "武雄温泉", lat: 33.1964792, lng: 130.0230661, km: 0,    dwellSec: 60 },
          { name: "嬉野温泉", lat: 33.1066719, lng: 129.9989438, km: 10.9 },
          { name: "新大村",   lat: 32.9329805, lng: 129.9570496, km: 32.2 },
          { name: "諫早",     lat: 32.8515808, lng: 130.0414370, km: 44.7, dwellSec: 60 },
          { name: "長崎",     lat: 32.7521727, lng: 129.8688815, km: 66.0, dwellSec: 90 },
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
          { name: "東船橋",     lat: 35.6998, lng: 140.0043, km: 44.3 },
          { name: "津田沼",     lat: 35.6914, lng: 140.0202, km: 46.1 },
          { name: "幕張本郷",   lat: 35.6727, lng: 140.0423, km: 48.1 },
          { name: "幕張",       lat: 35.6593, lng: 140.0580, km: 49.8 },
          { name: "新検見川",   lat: 35.6518, lng: 140.0731, km: 51.3 },
          { name: "稲毛",       lat: 35.6371, lng: 140.0926, km: 53.6 },
          { name: "西千葉",     lat: 35.6227, lng: 140.1031, km: 55.0 },
          { name: "千葉",       lat: 35.6137, lng: 140.1125, km: 60.2, dwellSec: 30 },
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
      {
        id: "Tokyo-Monorail",
        name: "東京モノレール羽田空港線",
        nameEn: "Tokyo Monorail Haneda Airport Line",
        color: "#003685",
        category: "Monorail",
        directions: { up: "上り (モノレール浜松町方面)", down: "下り (羽田空港第2ターミナル方面)" },
        // Official line map lists 11 stations from Monorail Hamamatsucho to
        // Haneda Airport Terminal 2; only the all-stop local template is modeled
        // until skip-stop service support is available.
        stations: [
          { name: "モノレール浜松町",       lat: 35.6555976, lng: 139.7567934, km: 0.050, dwellSec: 30 },
          { name: "天王洲アイル",           lat: 35.6227519, lng: 139.7508064, km: 4.141 },
          { name: "大井競馬場前",           lat: 35.5951293, lng: 139.7470745, km: 7.318 },
          { name: "流通センター",           lat: 35.5816902, lng: 139.7491442, km: 8.851 },
          { name: "昭和島",                 lat: 35.5707693, lng: 139.7500681, km: 10.105 },
          { name: "整備場",                 lat: 35.5551633, lng: 139.7533778, km: 12.005 },
          { name: "天空橋",                 lat: 35.5489899, lng: 139.7543945, km: 12.705 },
          { name: "羽田空港第3ターミナル",  lat: 35.5438943, lng: 139.7686676, km: 14.227, dwellSec: 30 },
          { name: "新整備場",               lat: 35.5428370, lng: 139.7868127, km: 16.329 },
          { name: "羽田空港第1ターミナル",  lat: 35.5491467, lng: 139.7845042, km: 17.100, dwellSec: 30 },
          { name: "羽田空港第2ターミナル",  lat: 35.5508377, lng: 139.7882856, km: 18.047, dwellSec: 30 },
        ],
      },
      {
        id: "Utsunomiya-Lightline",
        name: "宇都宮芳賀ライトレール線",
        nameEn: "Utsunomiya Haga Light Rail Line",
        color: "#facc15",
        category: "LRT",
        directions: { up: "上り (宇都宮駅東口方面)", down: "下り (芳賀・高根沢工業団地方面)" },
        // Official route map lists 19 stops from Utsunomiya Station East to
        // Haga-Takanezawa Industrial Park. Fallback km values are scaled to the
        // 14.6 km project length; generated OSM stationKms replace them at runtime.
        stations: [
          { name: "宇都宮駅東口", lat: 36.5590222, lng: 139.8995751, km: 0.000, dwellSec: 25 },
          { name: "東宿郷", lat: 36.5582650, lng: 139.9040643, km: 0.432 },
          { name: "駅東公園前", lat: 36.5579621, lng: 139.9081419, km: 0.817 },
          { name: "峰", lat: 36.5575329, lng: 139.9162772, km: 1.584 },
          { name: "陽東3丁目", lat: 36.5572788, lng: 139.9232319, km: 2.239 },
          { name: "宇都宮大学陽東キャンパス", lat: 36.5570446, lng: 139.9301903, km: 2.894 },
          { name: "平石", lat: 36.5550683, lng: 139.9392659, km: 3.778 },
          { name: "平石中央小学校前", lat: 36.5548335, lng: 139.9447606, km: 4.296 },
          { name: "飛山城跡", lat: 36.5483643, lng: 139.9634208, km: 6.208 },
          { name: "清陵高校前", lat: 36.5449489, lng: 139.9762998, km: 7.484 },
          { name: "清原地区市民センター前", lat: 36.5476408, lng: 139.9842429, km: 8.295 },
          { name: "グリーンスタジアム前", lat: 36.5535964, lng: 139.9832384, km: 8.999 },
          { name: "ゆいの杜西", lat: 36.5674513, lng: 139.9872795, km: 10.665 },
          { name: "ゆいの杜中央", lat: 36.5677248, lng: 139.9929737, km: 11.202 },
          { name: "ゆいの杜東", lat: 36.5676112, lng: 139.9987885, km: 11.749 },
          { name: "芳賀台", lat: 36.5661120, lng: 140.0064986, km: 12.495 },
          { name: "芳賀町工業団地管理センター前", lat: 36.5649729, lng: 140.0106667, km: 12.909 },
          { name: "かしの森公園前", lat: 36.5723821, lng: 140.0145609, km: 13.851 },
          { name: "芳賀・高根沢工業団地", lat: 36.5784382, lng: 140.0120077, km: 14.600, dwellSec: 25 },
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
      { line: "Nishi-Kyushu-Shinkansen",  type: "かもめ",     badge: "かもめ", badgeColor: "#e11d48", speed: 230, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Tokyo-Monorail",           type: "普通",       badge: "MO",     badgeColor: "#003685", speed: 80,  interval: 5,  accel: 0.95, decel: 1.05, aLat: 0.85, dwellSec: 25 },
      { line: "Utsunomiya-Lightline",     type: "ライトライン", badge: "HU",   badgeColor: "#facc15", speed: 30,  interval: 8,  accel: 0.80, decel: 0.90, aLat: 0.80, dwellSec: 20 },
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
        id: "Seoul-Metro-3",
        name: "수도권 전철 3호선",
        nameEn: "Seoul Metropolitan Subway Line 3",
        color: "#ED6C00",
        category: "捷運",
        directions: { up: "상행 (대화 방면)", down: "하행 (오금 방면)" },
        // 3호선: Daehwa ↔ Ogeum all-stop service. OSM stop nodes provide the
        // station anchors; generated shapes replace these fallback kms at build time.
        stations: [
          { name: "대화",       lat: 37.6761485, lng: 126.7474578, km: 0,    dwellSec: 30 },
          { name: "주엽",       lat: 37.6701110, lng: 126.7612341, km: 1.5 },
          { name: "정발산",     lat: 37.6597112, lng: 126.7732179, km: 3.1 },
          { name: "마두",       lat: 37.6520005, lng: 126.7777178, km: 4.1 },
          { name: "백석",       lat: 37.6430565, lng: 126.7879533, km: 5.5 },
          { name: "대곡",       lat: 37.6318362, lng: 126.8096784, km: 7.9 },
          { name: "화정",       lat: 37.6345957, lng: 126.8326234, km: 10.1 },
          { name: "원당",       lat: 37.6538264, lng: 126.8433973, km: 12.5 },
          { name: "원흥",       lat: 37.6504946, lng: 126.8737376, km: 15.3 },
          { name: "삼송",       lat: 37.6531033, lng: 126.8954689, km: 17.3 },
          { name: "지축",       lat: 37.6479341, lng: 126.9149061, km: 19.2 },
          { name: "구파발",     lat: 37.6368537, lng: 126.9187721, km: 20.6 },
          { name: "연신내",     lat: 37.6194491, lng: 126.9208580, km: 22.7, dwellSec: 30 },
          { name: "불광",       lat: 37.6098806, lng: 126.9303980, km: 24.0 },
          { name: "녹번",       lat: 37.6009430, lng: 126.9357156, km: 25.2 },
          { name: "홍제",       lat: 37.5886740, lng: 126.9441990, km: 26.9 },
          { name: "무악재",     lat: 37.5823147, lng: 126.9503083, km: 27.8 },
          { name: "독립문",     lat: 37.5745130, lng: 126.9578197, km: 29.0 },
          { name: "경복궁",     lat: 37.5757585, lng: 126.9735668, km: 30.3 },
          { name: "안국",       lat: 37.5768286, lng: 126.9862272, km: 31.6 },
          { name: "종로3가",    lat: 37.5720185, lng: 126.9916922, km: 32.3, dwellSec: 30 },
          { name: "을지로3가",  lat: 37.5663629, lng: 126.9925882, km: 32.9 },
          { name: "충무로",     lat: 37.5606488, lng: 126.9948063, km: 33.7, dwellSec: 30 },
          { name: "동대입구",   lat: 37.5590197, lng: 127.0057659, km: 34.7 },
          { name: "약수",       lat: 37.5548296, lng: 127.0105499, km: 35.4 },
          { name: "금호",       lat: 37.5480153, lng: 127.0158595, km: 36.3 },
          { name: "옥수",       lat: 37.5408763, lng: 127.0178475, km: 37.1 },
          { name: "압구정",     lat: 37.5261356, lng: 127.0284705, km: 39.1 },
          { name: "신사",       lat: 37.5161705, lng: 127.0196309, km: 40.5 },
          { name: "잠원",       lat: 37.5127485, lng: 127.0110886, km: 41.4 },
          { name: "고속터미널", lat: 37.5050376, lng: 127.0049022, km: 42.5, dwellSec: 30 },
          { name: "교대",       lat: 37.4928812, lng: 127.0138064, km: 44.2, dwellSec: 30 },
          { name: "남부터미널", lat: 37.4849718, lng: 127.0162904, km: 45.1 },
          { name: "양재",       lat: 37.4845433, lng: 127.0343170, km: 46.8, dwellSec: 30 },
          { name: "매봉",       lat: 37.4870435, lng: 127.0469913, km: 48.0 },
          { name: "도곡",       lat: 37.4908838, lng: 127.0554872, km: 48.9 },
          { name: "대치",       lat: 37.4944502, lng: 127.0632186, km: 49.7 },
          { name: "학여울",     lat: 37.4964802, lng: 127.0699125, km: 50.4 },
          { name: "대청",       lat: 37.4936540, lng: 127.0795056, km: 51.3 },
          { name: "일원",       lat: 37.4837678, lng: 127.0841812, km: 52.6 },
          { name: "수서",       lat: 37.4874270, lng: 127.1019706, km: 54.3, dwellSec: 30 },
          { name: "가락시장",   lat: 37.4922475, lng: 127.1177039, km: 55.8 },
          { name: "경찰병원",   lat: 37.4953088, lng: 127.1238319, km: 56.5 },
          { name: "오금",       lat: 37.5021419, lng: 127.1283544, km: 57.4, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-4",
        name: "수도권 전철 4호선",
        nameEn: "Seoul Metropolitan Subway Line 4",
        color: "#009BCE",
        category: "捷運",
        directions: { up: "상행 (진접 방면)", down: "하행 (오이도 방면)" },
        // 4호선:Jinjeop ↔ Oido all-stop trunk. Pungyang is not included until
        // it opens in service; generated shapes replace these fallback kms.
        stations: [
          { name: "진접",               lat: 37.7212032, lng: 127.2031634, km: 0,    dwellSec: 30 },
          { name: "오남",               lat: 37.7057341, lng: 127.1923455, km: 2.1 },
          { name: "별내별가람",         lat: 37.6680941, lng: 127.1169523, km: 10.4 },
          { name: "불암산",             lat: 37.6709164, lng: 127.0797159, km: 13.9, dwellSec: 30 },
          { name: "상계",               lat: 37.6599912, lng: 127.0726737, km: 15.3 },
          { name: "노원",               lat: 37.6561244, lng: 127.0623632, km: 16.4, dwellSec: 30 },
          { name: "창동",               lat: 37.6529636, lng: 127.0466586, km: 17.9, dwellSec: 30 },
          { name: "쌍문",               lat: 37.6484204, lng: 127.0345485, km: 19.1 },
          { name: "수유",               lat: 37.6379893, lng: 127.0256914, km: 20.6 },
          { name: "미아",               lat: 37.6254296, lng: 127.0264909, km: 22.1 },
          { name: "미아사거리",         lat: 37.6131644, lng: 127.0300744, km: 23.6 },
          { name: "길음",               lat: 37.6024214, lng: 127.0244140, km: 25.0 },
          { name: "성신여대입구",       lat: 37.5926650, lng: 127.0164111, km: 26.3 },
          { name: "한성대입구",         lat: 37.5882010, lng: 127.0053156, km: 27.5 },
          { name: "혜화",               lat: 37.5821434, lng: 127.0019312, km: 28.3 },
          { name: "동대문",             lat: 37.5707564, lng: 127.0093746, km: 29.8, dwellSec: 30 },
          { name: "동대문역사문화공원", lat: 37.5652027, lng: 127.0080476, km: 30.5, dwellSec: 30 },
          { name: "충무로",             lat: 37.5610655, lng: 126.9926025, km: 32.0, dwellSec: 30 },
          { name: "명동",               lat: 37.5609174, lng: 126.9862899, km: 32.6 },
          { name: "회현",               lat: 37.5587614, lng: 126.9784360, km: 33.3 },
          { name: "서울역",             lat: 37.5525760, lng: 126.9724492, km: 34.3, dwellSec: 30 },
          { name: "숙대입구",           lat: 37.5451375, lng: 126.9719211, km: 35.1 },
          { name: "삼각지",             lat: 37.5344579, lng: 126.9729031, km: 36.4, dwellSec: 30 },
          { name: "신용산",             lat: 37.5291568, lng: 126.9678072, km: 37.2 },
          { name: "이촌",               lat: 37.5226181, lng: 126.9736117, km: 38.1, dwellSec: 30 },
          { name: "동작",               lat: 37.5021191, lng: 126.9808291, km: 40.6, dwellSec: 30 },
          { name: "총신대입구",         lat: 37.4870260, lng: 126.9822046, km: 42.4, dwellSec: 30 },
          { name: "사당",               lat: 37.4762635, lng: 126.9815846, km: 43.7, dwellSec: 30 },
          { name: "남태령",             lat: 37.4639720, lng: 126.9889176, km: 45.3 },
          { name: "선바위",             lat: 37.4507449, lng: 127.0030560, km: 47.3 },
          { name: "경마공원",           lat: 37.4438286, lng: 127.0079130, km: 48.3 },
          { name: "대공원",             lat: 37.4350880, lng: 127.0061773, km: 49.3 },
          { name: "과천",               lat: 37.4330278, lng: 126.9968428, km: 50.2 },
          { name: "정부과천청사",       lat: 37.4264288, lng: 126.9897471, km: 51.2 },
          { name: "인덕원",             lat: 37.4013614, lng: 126.9769874, km: 54.4 },
          { name: "평촌",               lat: 37.3942706, lng: 126.9638926, km: 55.9 },
          { name: "범계",               lat: 37.3898873, lng: 126.9509188, km: 57.2 },
          { name: "금정",               lat: 37.3715851, lng: 126.9439463, km: 59.5, dwellSec: 30 },
          { name: "산본",               lat: 37.3575433, lng: 126.9321639, km: 61.5 },
          { name: "수리산",             lat: 37.3498152, lng: 126.9253962, km: 62.6 },
          { name: "대야미",             lat: 37.3272174, lng: 126.9162856, km: 65.4 },
          { name: "반월",               lat: 37.3116652, lng: 126.9032326, km: 67.6 },
          { name: "상록수",             lat: 37.3028721, lng: 126.8656673, km: 71.2 },
          { name: "한대앞",             lat: 37.3104519, lng: 126.8528880, km: 72.7 },
          { name: "중앙",               lat: 37.3160633, lng: 126.8374647, km: 74.3, dwellSec: 30 },
          { name: "고잔",               lat: 37.3169005, lng: 126.8220934, km: 75.8 },
          { name: "초지",               lat: 37.3211622, lng: 126.8049024, km: 77.5, dwellSec: 30 },
          { name: "안산",               lat: 37.3274089, lng: 126.7879605, km: 79.2 },
          { name: "신길온천",           lat: 37.3380983, lng: 126.7661867, km: 81.6 },
          { name: "정왕",               lat: 37.3520536, lng: 126.7419901, km: 84.4 },
          { name: "오이도",             lat: 37.3628018, lng: 126.7387180, km: 85.7, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-5",
        name: "수도권 전철 5호선",
        nameEn: "Seoul Metropolitan Subway Line 5",
        color: "#996CAC",
        category: "捷運",
        directions: { up: "상행 (방화 방면)", down: "하행 (하남검단산 방면)" },
        // 5호선: Banghwa → Hanam Geomdansan main branch only. The Macheon
        // branch splits after Gangdong and is intentionally left for a later
        // branch-aware data pass.
        stations: [
          { name: "방화", lat: 37.5773986, lng: 126.8126915, km: 0,    dwellSec: 30 },
          { name: "개화산", lat: 37.5728725, lng: 126.8081607, km: 0.7 },
          { name: "김포공항", lat: 37.5621160, lng: 126.8013024, km: 2.1, dwellSec: 30 },
          { name: "송정", lat: 37.5612507, lng: 126.8119964, km: 3.1 },
          { name: "마곡", lat: 37.5602258, lng: 126.8247396, km: 4.3 },
          { name: "발산", lat: 37.5584330, lng: 126.8374583, km: 5.5 },
          { name: "우장산", lat: 37.5488667, lng: 126.8362945, km: 6.6 },
          { name: "화곡", lat: 37.5416946, lng: 126.8403637, km: 7.6 },
          { name: "까치산", lat: 37.5320943, lng: 126.8464982, km: 8.8, dwellSec: 30 },
          { name: "신정", lat: 37.5250243, lng: 126.8559551, km: 10.0 },
          { name: "목동", lat: 37.5261036, lng: 126.8645084, km: 10.8 },
          { name: "오목교", lat: 37.5245316, lng: 126.8751484, km: 11.9 },
          { name: "양평", lat: 37.5256184, lng: 126.8861154, km: 12.9 },
          { name: "영등포구청", lat: 37.5240118, lng: 126.8964077, km: 13.9, dwellSec: 30 },
          { name: "영등포시장", lat: 37.5226792, lng: 126.9051244, km: 14.7 },
          { name: "신길", lat: 37.5174957, lng: 126.9166068, km: 15.9 },
          { name: "여의도", lat: 37.5219444, lng: 126.9248093, km: 16.9, dwellSec: 30 },
          { name: "여의나루", lat: 37.5268372, lng: 126.9325490, km: 17.8 },
          { name: "마포", lat: 37.5396061, lng: 126.9459969, km: 19.7 },
          { name: "공덕", lat: 37.5436373, lng: 126.9508356, km: 20.4 },
          { name: "애오개", lat: 37.5534301, lng: 126.9567324, km: 21.7, dwellSec: 30 },
          { name: "충정로", lat: 37.5594482, lng: 126.9621729, km: 22.5, dwellSec: 30 },
          { name: "서대문", lat: 37.5657783, lng: 126.9666700, km: 23.4 },
          { name: "광화문", lat: 37.5715921, lng: 126.9769127, km: 24.6 },
          { name: "종로3가", lat: 37.5725275, lng: 126.9908072, km: 25.9, dwellSec: 30 },
          { name: "을지로4가", lat: 37.5669307, lng: 126.9980713, km: 26.8 },
          { name: "동대문역사문화공원", lat: 37.5642040, lng: 127.0072575, km: 27.7, dwellSec: 30 },
          { name: "청구", lat: 37.5602418, lng: 127.0136945, km: 28.5 },
          { name: "신금호", lat: 37.5544039, lng: 127.0202557, km: 29.4 },
          { name: "행당", lat: 37.5575595, lng: 127.0299795, km: 30.4 },
          { name: "왕십리", lat: 37.5610151, lng: 127.0357909, km: 31.1, dwellSec: 30 },
          { name: "마장", lat: 37.5660844, lng: 127.0429225, km: 32.0 },
          { name: "답십리", lat: 37.5667984, lng: 127.0526477, km: 32.9 },
          { name: "장한평", lat: 37.5614569, lng: 127.0645907, km: 34.1 },
          { name: "군자", lat: 37.5571224, lng: 127.0795354, km: 35.6, dwellSec: 30 },
          { name: "아차산", lat: 37.5516758, lng: 127.0897660, km: 36.8 },
          { name: "광나루", lat: 37.5452672, lng: 127.1035050, km: 38.3 },
          { name: "천호", lat: 37.5385722, lng: 127.1234109, km: 40.3, dwellSec: 30 },
          { name: "강동", lat: 37.5357680, lng: 127.1325963, km: 41.2, dwellSec: 30 },
          { name: "길동", lat: 37.5383373, lng: 127.1402269, km: 42.0 },
          { name: "굽은다리", lat: 37.5456477, lng: 127.1429834, km: 42.9 },
          { name: "명일", lat: 37.5519222, lng: 127.1441072, km: 43.6 },
          { name: "고덕", lat: 37.5549570, lng: 127.1537952, km: 44.6 },
          { name: "상일동", lat: 37.5568602, lng: 127.1680427, km: 45.9 },
          { name: "강일", lat: 37.5574904, lng: 127.1761414, km: 46.7 },
          { name: "미사", lat: 37.5629465, lng: 127.1928227, km: 48.4 },
          { name: "하남풍산", lat: 37.5528169, lng: 127.2043013, km: 50.0 },
          { name: "하남시청", lat: 37.5416107, lng: 127.2069843, km: 51.3 },
          { name: "하남검단산", lat: 37.5396413, lng: 127.2236752, km: 52.9, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-6",
        name: "서울 지하철 6호선",
        nameEn: "Seoul Subway Line 6",
        color: "#7C4932",
        category: "捷運",
        directions: { up: "상행 (응암순환 방면)", down: "하행 (신내 방면)" },
        // 6호선: Eungam one-way loop followed by the eastbound trunk to Sinnae.
        // Eungam intentionally appears twice so the loop movement stays explicit.
        stations: [
          { name: "응암", lat: 37.5987740, lng: 126.9157018, km: 0,    dwellSec: 30 },
          { name: "역촌", lat: 37.6060541, lng: 126.9228008, km: 1.1 },
          { name: "불광", lat: 37.6107380, lng: 126.9292223, km: 1.8, dwellSec: 30 },
          { name: "독바위", lat: 37.6184519, lng: 126.9330576, km: 2.8 },
          { name: "연신내", lat: 37.6186289, lng: 126.9205315, km: 3.9, dwellSec: 30 },
          { name: "구산", lat: 37.6110401, lng: 126.9170995, km: 4.9 },
          { name: "응암", lat: 37.5984384, lng: 126.9154726, km: 6.3, dwellSec: 30 },
          { name: "새절", lat: 37.5910867, lng: 126.9134797, km: 7.2 },
          { name: "증산", lat: 37.5841289, lng: 126.9098598, km: 8.0 },
          { name: "디지털미디어시티", lat: 37.5762160, lng: 126.9014392, km: 9.2, dwellSec: 30 },
          { name: "월드컵경기장", lat: 37.5701609, lng: 126.8992939, km: 9.9 },
          { name: "마포구청", lat: 37.5635156, lng: 126.9033737, km: 10.8 },
          { name: "망원", lat: 37.5559808, lng: 126.9101224, km: 11.8 },
          { name: "합정", lat: 37.5492052, lng: 126.9134584, km: 12.7, dwellSec: 30 },
          { name: "상수", lat: 37.5477391, lng: 126.9229225, km: 13.5 },
          { name: "광흥창", lat: 37.5474490, lng: 126.9320010, km: 14.4 },
          { name: "대흥", lat: 37.5476895, lng: 126.9423171, km: 15.3 },
          { name: "공덕", lat: 37.5436396, lng: 126.9515209, km: 16.2, dwellSec: 30 },
          { name: "효창공원앞", lat: 37.5393117, lng: 126.9613534, km: 17.3, dwellSec: 30 },
          { name: "삼각지", lat: 37.5355911, lng: 126.9738989, km: 18.5, dwellSec: 30 },
          { name: "녹사평", lat: 37.5347329, lng: 126.9864975, km: 19.6 },
          { name: "이태원", lat: 37.5344810, lng: 126.9943860, km: 20.3 },
          { name: "한강진", lat: 37.5398199, lng: 127.0017633, km: 21.3 },
          { name: "버티고개", lat: 37.5482256, lng: 127.0066769, km: 22.3 },
          { name: "약수", lat: 37.5541596, lng: 127.0103961, km: 23.1, dwellSec: 30 },
          { name: "청구", lat: 37.5602864, lng: 127.0138544, km: 23.8, dwellSec: 30 },
          { name: "신당", lat: 37.5664040, lng: 127.0162221, km: 24.6, dwellSec: 30 },
          { name: "동묘앞", lat: 37.5714130, lng: 127.0158026, km: 25.1, dwellSec: 30 },
          { name: "창신", lat: 37.5797860, lng: 127.0152730, km: 26.1 },
          { name: "보문", lat: 37.5852622, lng: 127.0193326, km: 26.8, dwellSec: 30 },
          { name: "안암", lat: 37.5862818, lng: 127.0293290, km: 27.7 },
          { name: "고려대", lat: 37.5897500, lng: 127.0359359, km: 28.5 },
          { name: "월곡", lat: 37.6019240, lng: 127.0414890, km: 29.9 },
          { name: "상월곡", lat: 37.6062070, lng: 127.0482569, km: 30.7 },
          { name: "돌곶이", lat: 37.6105343, lng: 127.0564905, km: 31.6 },
          { name: "석계", lat: 37.6148757, lng: 127.0657680, km: 32.6, dwellSec: 30 },
          { name: "태릉입구", lat: 37.6172248, lng: 127.0745285, km: 33.4, dwellSec: 30 },
          { name: "화랑대", lat: 37.6197559, lng: 127.0837172, km: 34.3 },
          { name: "봉화산", lat: 37.6173928, lng: 127.0910747, km: 35.0, dwellSec: 30 },
          { name: "신내", lat: 37.6124026, lng: 127.1046462, km: 36.4, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-7",
        name: "서울 지하철 7호선",
        nameEn: "Seoul Subway Line 7",
        color: "#747F00",
        category: "捷運",
        directions: { up: "상행 (장암 방면)", down: "하행 (석남 방면)" },
        // 7호선: Jangam → Seongnam all-stop service. Full current westward
        // extension is used; older Onsu/Bupyeong-gu Office short routes are not
        // modeled as separate templates in this seed pass.
        stations: [
          { name: "장암", lat: 37.7001801, lng: 127.0530750, km: 0,    dwellSec: 30 },
          { name: "도봉산", lat: 37.6888071, lng: 127.0467403, km: 1.4, dwellSec: 30 },
          { name: "수락산", lat: 37.6770108, lng: 127.0552337, km: 3.0 },
          { name: "마들", lat: 37.6647424, lng: 127.0577568, km: 4.4 },
          { name: "노원", lat: 37.6535163, lng: 127.0607422, km: 5.7, dwellSec: 30 },
          { name: "중계", lat: 37.6455228, lng: 127.0638548, km: 6.6 },
          { name: "하계", lat: 37.6359753, lng: 127.0682067, km: 7.8 },
          { name: "공릉", lat: 37.6256062, lng: 127.0729869, km: 9.0 },
          { name: "태릉입구", lat: 37.6181175, lng: 127.0754565, km: 9.9, dwellSec: 30 },
          { name: "먹골", lat: 37.6114362, lng: 127.0775866, km: 10.7 },
          { name: "중화", lat: 37.6016296, lng: 127.0794500, km: 11.8 },
          { name: "상봉", lat: 37.5958368, lng: 127.0856306, km: 12.7, dwellSec: 30 },
          { name: "면목", lat: 37.5883794, lng: 127.0875458, km: 13.5 },
          { name: "사가정", lat: 37.5807153, lng: 127.0883912, km: 14.4 },
          { name: "용마산", lat: 37.5738974, lng: 127.0864879, km: 15.2 },
          { name: "중곡", lat: 37.5662958, lng: 127.0844900, km: 16.1 },
          { name: "군자", lat: 37.5572237, lng: 127.0795184, km: 17.2, dwellSec: 30 },
          { name: "어린이대공원", lat: 37.5476281, lng: 127.0743859, km: 18.4 },
          { name: "건대입구", lat: 37.5401446, lng: 127.0707105, km: 19.3, dwellSec: 30 },
          { name: "자양", lat: 37.5308705, lng: 127.0664071, km: 20.4 },
          { name: "청담", lat: 37.5188573, lng: 127.0500373, km: 22.4 },
          { name: "강남구청", lat: 37.5171958, lng: 127.0413029, km: 23.2, dwellSec: 30 },
          { name: "학동", lat: 37.5139701, lng: 127.0307332, km: 24.3 },
          { name: "논현", lat: 37.5111305, lng: 127.0214771, km: 25.2 },
          { name: "반포", lat: 37.5081855, lng: 127.0116190, km: 26.1 },
          { name: "고속터미널", lat: 37.5038331, lng: 127.0053083, km: 26.9, dwellSec: 30 },
          { name: "내방", lat: 37.4872377, lng: 126.9921169, km: 29.1 },
          { name: "이수", lat: 37.4853378, lng: 126.9819566, km: 30.0, dwellSec: 30 },
          { name: "남성", lat: 37.4843794, lng: 126.9718787, km: 30.9 },
          { name: "숭실대입구", lat: 37.4956558, lng: 126.9541388, km: 33.0 },
          { name: "상도", lat: 37.5032145, lng: 126.9476896, km: 34.0 },
          { name: "장승배기", lat: 37.5049927, lng: 126.9391954, km: 34.8 },
          { name: "신대방삼거리", lat: 37.4997200, lng: 126.9282087, km: 36.0 },
          { name: "보라매", lat: 37.4999833, lng: 126.9197810, km: 36.7, dwellSec: 30 },
          { name: "신풍", lat: 37.5001548, lng: 126.9089367, km: 37.7 },
          { name: "대림", lat: 37.4925164, lng: 126.8962526, km: 39.1, dwellSec: 30 },
          { name: "남구로", lat: 37.4854040, lng: 126.8866733, km: 40.3 },
          { name: "가산디지털단지", lat: 37.4801015, lng: 126.8816142, km: 41.1, dwellSec: 30 },
          { name: "철산", lat: 37.4760589, lng: 126.8677626, km: 42.4 },
          { name: "광명사거리", lat: 37.4796210, lng: 126.8538115, km: 43.7 },
          { name: "천왕", lat: 37.4863535, lng: 126.8389512, km: 45.3 },
          { name: "온수", lat: 37.4925674, lng: 126.8221638, km: 46.9, dwellSec: 30 },
          { name: "까치울", lat: 37.5062561, lng: 126.8113774, km: 48.8 },
          { name: "부천종합운동장", lat: 37.5054654, lng: 126.7972534, km: 50.1 },
          { name: "춘의", lat: 37.5037437, lng: 126.7871771, km: 51.0 },
          { name: "신중동", lat: 37.5030595, lng: 126.7762185, km: 52.0 },
          { name: "부천시청", lat: 37.5047828, lng: 126.7631827, km: 53.2 },
          { name: "상동", lat: 37.5058462, lng: 126.7531662, km: 54.1 },
          { name: "삼산체육관", lat: 37.5065175, lng: 126.7423065, km: 55.1 },
          { name: "굴포천", lat: 37.5070361, lng: 126.7313177, km: 56.0 },
          { name: "부평구청", lat: 37.5075712, lng: 126.7198593, km: 57.1, dwellSec: 30 },
          { name: "산곡", lat: 37.5086158, lng: 126.7036796, km: 58.5 },
          { name: "석남", lat: 37.5063954, lng: 126.6731764, km: 61.3, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-8",
        name: "서울 지하철 8호선",
        nameEn: "Seoul Subway Line 8",
        color: "#E6186C",
        category: "捷運",
        directions: { up: "상행 (별내 방면)", down: "하행 (모란 방면)" },
        // 8호선: Byeollae → Moran all-stop service. The current Byeollae
        // extension is used; older Amsa/Moran short relations are not modeled
        // as separate templates in this seed pass.
        stations: [
          { name: "별내", lat: 37.6418028, lng: 127.1280243, km: 0,    dwellSec: 30 },
          { name: "다산", lat: 37.6237479, lng: 127.1496187, km: 2.9 },
          { name: "동구릉", lat: 37.6101744, lng: 127.1381349, km: 4.8 },
          { name: "구리", lat: 37.6016366, lng: 127.1410186, km: 5.8, dwellSec: 30 },
          { name: "장자호수공원", lat: 37.5864905, lng: 127.1378478, km: 7.6 },
          { name: "암사역사공원", lat: 37.5568968, lng: 127.1365133, km: 11.0 },
          { name: "암사", lat: 37.5490025, lng: 127.1270746, km: 12.3 },
          { name: "천호", lat: 37.5380736, lng: 127.1232037, km: 13.6, dwellSec: 30 },
          { name: "강동구청", lat: 37.5306815, lng: 127.1205980, km: 14.5 },
          { name: "몽촌토성", lat: 37.5175496, lng: 127.1126502, km: 16.2 },
          { name: "잠실", lat: 37.5143195, lng: 127.1034964, km: 17.1, dwellSec: 30 },
          { name: "석촌", lat: 37.5053042, lng: 127.1070931, km: 18.2, dwellSec: 30 },
          { name: "송파", lat: 37.4996207, lng: 127.1122514, km: 19.0 },
          { name: "가락시장", lat: 37.4931855, lng: 127.1181478, km: 20.0, dwellSec: 30 },
          { name: "문정", lat: 37.4858500, lng: 127.1224840, km: 20.9 },
          { name: "장지", lat: 37.4788927, lng: 127.1260371, km: 21.8 },
          { name: "복정", lat: 37.4701567, lng: 127.1266101, km: 22.8, dwellSec: 30 },
          { name: "남위례", lat: 37.4624724, lng: 127.1397967, km: 24.3 },
          { name: "산성", lat: 37.4568481, lng: 127.1499078, km: 25.4 },
          { name: "남한산성입구", lat: 37.4515840, lng: 127.1598040, km: 26.5 },
          { name: "단대오거리", lat: 37.4450934, lng: 127.1567551, km: 27.3 },
          { name: "신흥", lat: 37.4410138, lng: 127.1476254, km: 28.3 },
          { name: "수진", lat: 37.4374574, lng: 127.1406647, km: 29.1 },
          { name: "모란", lat: 37.4340338, lng: 127.1303157, km: 30.1, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-9",
        name: "서울 지하철 9호선",
        nameEn: "Seoul Subway Line 9",
        color: "#BDB092",
        category: "捷運",
        directions: { up: "상행 (개화 방면)", down: "하행 (중앙보훈병원 방면)" },
        // 9호선: Gaehwa to VHS Medical Center all-stop service. Express
        // skip-stop patterns exist, but are left for a later skip-stop pass.
        stations: [
          { name: "개화", lat: 37.5784343, lng: 126.7968238, km: 0,    dwellSec: 30 },
          { name: "김포공항", lat: 37.5619723, lng: 126.8015364, km: 2.1, dwellSec: 30 },
          { name: "공항시장", lat: 37.5634156, lng: 126.8104215, km: 2.9 },
          { name: "신방화", lat: 37.5674056, lng: 126.8178288, km: 3.8 },
          { name: "마곡나루", lat: 37.5666674, lng: 126.8277135, km: 4.8, dwellSec: 30 },
          { name: "양천향교", lat: 37.5684782, lng: 126.8412018, km: 6.1 },
          { name: "가양", lat: 37.5611258, lng: 126.8550615, km: 7.7 },
          { name: "증미", lat: 37.5574220, lng: 126.8619300, km: 8.5 },
          { name: "등촌", lat: 37.5511895, lng: 126.8645708, km: 9.3 },
          { name: "염창", lat: 37.5470051, lng: 126.8754428, km: 10.5 },
          { name: "신목동", lat: 37.5442270, lng: 126.8831853, km: 11.3 },
          { name: "선유도", lat: 37.5378557, lng: 126.8938639, km: 12.6 },
          { name: "당산", lat: 37.5329103, lng: 126.9037755, km: 13.7, dwellSec: 30 },
          { name: "국회의사당", lat: 37.5274368, lng: 126.9184254, km: 15.3 },
          { name: "여의도", lat: 37.5217071, lng: 126.9241053, km: 16.2, dwellSec: 30 },
          { name: "샛강", lat: 37.5172824, lng: 126.9283959, km: 16.8, dwellSec: 30 },
          { name: "노량진", lat: 37.5136072, lng: 126.9418701, km: 18.2, dwellSec: 30 },
          { name: "노들", lat: 37.5129494, lng: 126.9535788, km: 19.4 },
          { name: "흑석", lat: 37.5083660, lng: 126.9639299, km: 20.5 },
          { name: "동작", lat: 37.5026030, lng: 126.9788678, km: 22.1, dwellSec: 30 },
          { name: "구반포", lat: 37.5012703, lng: 126.9867889, km: 22.9 },
          { name: "신반포", lat: 37.5035801, lng: 126.9964259, km: 23.9 },
          { name: "고속터미널", lat: 37.5060746, lng: 127.0047415, km: 24.7, dwellSec: 30 },
          { name: "사평", lat: 37.5041050, lng: 127.0153773, km: 25.8 },
          { name: "신논현", lat: 37.5045465, lng: 127.0248738, km: 26.7 },
          { name: "언주", lat: 37.5073701, lng: 127.0341153, km: 27.7 },
          { name: "선정릉", lat: 37.5103535, lng: 127.0442542, km: 28.7, dwellSec: 30 },
          { name: "삼성중앙", lat: 37.5130743, lng: 127.0537122, km: 29.7 },
          { name: "봉은사", lat: 37.5141546, lng: 127.0601774, km: 30.3 },
          { name: "종합운동장", lat: 37.5111232, lng: 127.0767504, km: 32.0, dwellSec: 30 },
          { name: "삼전", lat: 37.5044780, lng: 127.0871856, km: 33.2 },
          { name: "석촌고분", lat: 37.5024170, lng: 127.0965651, km: 34.2 },
          { name: "석촌", lat: 37.5050452, lng: 127.1068567, km: 35.2, dwellSec: 30 },
          { name: "송파나루", lat: 37.5112303, lng: 127.1128828, km: 36.2 },
          { name: "한성백제", lat: 37.5167113, lng: 127.1162809, km: 36.9 },
          { name: "올림픽공원", lat: 37.5160799, lng: 127.1303019, km: 38.3, dwellSec: 30 },
          { name: "둔촌오륜", lat: 37.5198527, lng: 127.1383293, km: 39.2 },
          { name: "중앙보훈병원", lat: 37.5282699, lng: 127.1482860, km: 40.6, dwellSec: 30 },
        ],
      },
      {
        id: "Ui-LRT",
        name: "서울 경전철 우이신설선",
        nameEn: "Seoul LRT Ui-Sinseol Line",
        color: "#BACC50",
        category: "LRT",
        directions: { up: "상행 (북한산우이 방면)", down: "하행 (신설동 방면)" },
        // Seoul's first fully underground driverless light metro; OSM relation
        // 7533582 follows the Bukhansan Ui→Sinseol-dong direction.
        stations: [
          { name: "북한산우이", lat: 37.6633606, lng: 127.0123479, km: 0.000, dwellSec: 30 },
          { name: "솔밭공원", lat: 37.6559343, lng: 127.0131587, km: 0.850 },
          { name: "4.19민주묘지", lat: 37.6493635, lng: 127.0136521, km: 1.604 },
          { name: "가오리", lat: 37.6420351, lng: 127.0165155, km: 2.459 },
          { name: "화계", lat: 37.6340359, lng: 127.0174308, km: 3.353 },
          { name: "삼양", lat: 37.6269639, lng: 127.0181389, km: 4.142 },
          { name: "삼양사거리", lat: 37.6211740, lng: 127.0205140, km: 4.840 },
          { name: "솔샘", lat: 37.6202204, lng: 127.0137122, km: 5.605 },
          { name: "북한산보국문", lat: 37.6119626, lng: 127.0082576, km: 6.880 },
          { name: "정릉", lat: 37.6027532, lng: 127.0133380, km: 8.014 },
          { name: "성신여대입구", lat: 37.5925679, lng: 127.0164561, km: 9.187, dwellSec: 30 },
          { name: "보문", lat: 37.5850612, lng: 127.0194667, km: 10.086, dwellSec: 30 },
          { name: "신설동", lat: 37.5760855, lng: 127.0231571, km: 11.147, dwellSec: 30 },
        ],
      },
      {
        id: "Sillim-LRT",
        name: "서울 경전철 신림선",
        nameEn: "Seoul LRT Sillim Line",
        color: "#6789CA",
        category: "LRT",
        directions: { up: "상행 (샛강 방면)", down: "하행 (관악산 방면)" },
        // Rubber-tyred automated light metro; OSM relation 14191877 follows
        // the Saetgang→Gwanaksan direction and provides stop members for all stations.
        stations: [
          { name: "샛강", lat: 37.5173398, lng: 126.9293465, km: 0.000, dwellSec: 30 },
          { name: "대방", lat: 37.5125156, lng: 126.9250675, km: 0.600, dwellSec: 30 },
          { name: "서울지방병무청", lat: 37.5059702, lng: 126.9226486, km: 1.400 },
          { name: "보라매", lat: 37.5003803, lng: 126.9204283, km: 2.000, dwellSec: 30 },
          { name: "보라매공원", lat: 37.4952476, lng: 126.9181210, km: 2.600 },
          { name: "보라매병원", lat: 37.4929164, lng: 126.9242838, km: 3.400 },
          { name: "당곡", lat: 37.4897250, lng: 126.9277642, km: 3.900 },
          { name: "신림", lat: 37.4848427, lng: 126.9295604, km: 4.600, dwellSec: 30 },
          { name: "서원", lat: 37.4781827, lng: 126.9329546, km: 5.300 },
          { name: "서울대벤처타운", lat: 37.4720468, lng: 126.9336031, km: 6.400 },
          { name: "관악산", lat: 37.4687700, lng: 126.9452234, km: 7.800, dwellSec: 30 },
        ],
      },
      {
        id: "Uijeongbu-LRT",
        name: "의정부경전철",
        nameEn: "Uijeongbu LRT U Line",
        color: "#F0831E",
        category: "LRT",
        directions: { up: "상행 (발곡 방면)", down: "하행 (차량기지임시승강장 방면)" },
        // Elevated rubber-tyred VAL light metro; OSM relation 13738410
        // follows the Balgok→Depot Temporary Platform station order.
        stations: [
          { name: "발곡", lat: 37.7269971, lng: 127.0529344, km: 0.000, dwellSec: 30 },
          { name: "회룡", lat: 37.7250332, lng: 127.0471527, km: 0.795, dwellSec: 30 },
          { name: "범골", lat: 37.7289028, lng: 127.0437020, km: 1.450 },
          { name: "경전철의정부", lat: 37.7374450, lng: 127.0433186, km: 2.400, dwellSec: 30 },
          { name: "의정부시청", lat: 37.7393951, lng: 127.0348982, km: 3.316 },
          { name: "흥선", lat: 37.7432726, lng: 127.0374127, km: 3.949 },
          { name: "의정부중앙", lat: 37.7436756, lng: 127.0498713, km: 5.045 },
          { name: "동오", lat: 37.7453477, lng: 127.0571834, km: 5.755 },
          { name: "새말", lat: 37.7488705, lng: 127.0639796, km: 6.482 },
          { name: "경기도청북부청사", lat: 37.7507504, lng: 127.0718140, km: 7.202 },
          { name: "효자", lat: 37.7539890, lng: 127.0773992, km: 7.824 },
          { name: "곤제", lat: 37.7503452, lng: 127.0838985, km: 8.601 },
          { name: "어룡", lat: 37.7425371, lng: 127.0852351, km: 9.502 },
          { name: "송산", lat: 37.7371073, lng: 127.0873011, km: 10.132 },
          { name: "탑석", lat: 37.7334804, lng: 127.0889389, km: 10.561, dwellSec: 30 },
          { name: "차량기지임시승강장", lat: 37.7286629, lng: 127.0949069, km: 11.343, dwellSec: 30 },
        ],
      },
      {
        id: "Yongin-EverLine",
        name: "용인 에버라인",
        nameEn: "Yongin EverLine",
        color: "#44A436",
        category: "LRT",
        directions: { up: "상행 (기흥 방면)", down: "하행 (전대·에버랜드 방면)" },
        // Automated Bombardier Innovia ART light metro; OSM relation 6064093
        // follows the Giheung→Jeondae Everland station order.
        stations: [
          { name: "기흥", lat: 37.2753771, lng: 127.1170247, km: 0.000, dwellSec: 30 },
          { name: "강남대", lat: 37.2700508, lng: 127.1262349, km: 1.049 },
          { name: "지석", lat: 37.2698069, lng: 127.1368761, km: 2.111 },
          { name: "어정", lat: 37.2750080, lng: 127.1439872, km: 3.026 },
          { name: "동백", lat: 37.2688635, lng: 127.1528478, km: 4.208 },
          { name: "초당", lat: 37.2606548, lng: 127.1596362, km: 5.304 },
          { name: "삼가", lat: 37.2420185, lng: 127.1683974, km: 7.890 },
          { name: "시청·용인대", lat: 37.2393178, lng: 127.1791165, km: 8.925 },
          { name: "명지대", lat: 37.2378920, lng: 127.1905189, km: 9.956 },
          { name: "김량장", lat: 37.2372156, lng: 127.1988861, km: 10.708 },
          { name: "용인중앙시장", lat: 37.2377806, lng: 127.2092509, km: 11.647 },
          { name: "고진", lat: 37.2446925, lng: 127.2143199, km: 12.582 },
          { name: "보평", lat: 37.2590842, lng: 127.2184773, km: 14.337 },
          { name: "둔전", lat: 37.2673470, lng: 127.2137260, km: 15.369 },
          { name: "전대·에버랜드", lat: 37.2854600, lng: 127.2194319, km: 17.995, dwellSec: 30 },
        ],
      },
      {
        id: "AREX",
        name: "공항철도",
        nameEn: "Airport Railroad Express",
        color: "#0079ac",
        category: "HSR",
        directions: { up: "상행 (서울역 방면)", down: "하행 (인천공항2터미널 방면)" },
        // AREX all-stop service:서울역↔인천공항2터미널 63.8 km 14 역.
        // 직통열차는 현재 skip-stop 모델이 없으므로 별도 template 으로 넣지 않는다.
        stations: [
          { name: "서울역",               lat: 37.554095, lng: 126.969920, km: 0,    dwellSec: 60 },
          { name: "공덕",                 lat: 37.542389, lng: 126.952230, km: 3.3 },
          { name: "홍대입구",             lat: 37.557625, lng: 126.926429, km: 6.1 },
          { name: "디지털미디어시티",     lat: 37.577412, lng: 126.898038, km: 9.5 },
          { name: "마곡나루",             lat: 37.565659, lng: 126.827619, km: 18.1 },
          { name: "김포공항",             lat: 37.561726, lng: 126.801544, km: 20.4, dwellSec: 30 },
          { name: "계양",                 lat: 37.571752, lng: 126.736350, km: 27.0 },
          { name: "검암",                 lat: 37.569132, lng: 126.673677, km: 32.5 },
          { name: "청라국제도시",         lat: 37.556381, lng: 126.624703, km: 37.3 },
          { name: "영종",                 lat: 37.511973, lng: 126.524889, km: 47.6 },
          { name: "운서",                 lat: 37.492783, lng: 126.493800, km: 51.1 },
          { name: "공항화물청사",         lat: 37.458856, lng: 126.477670, km: 55.4 },
          { name: "인천공항1터미널",      lat: 37.447176, lng: 126.452766, km: 58.0, dwellSec: 60 },
          { name: "인천공항2터미널",      lat: 37.468988, lng: 126.433429, km: 63.8, dwellSec: 60 },
        ],
      },
      {
        id: "Shinbundang",
        name: "수도권 전철 신분당선",
        nameEn: "Seoul Metropolitan Subway Shinbundang Line",
        color: "#B81B30",
        category: "捷運",
        directions: { up: "상행 (신사 방면)", down: "하행 (광교 방면)" },
        stations: [
          { name: "신사", lat: 37.5157525, lng: 127.0196599, km: 0,    dwellSec: 30 },
          { name: "논현", lat: 37.5099469, lng: 127.0218958, km: 0.66, dwellSec: 30 },
          { name: "신논현", lat: 37.5035711, lng: 127.0249157, km: 1.417, dwellSec: 30 },
          { name: "강남", lat: 37.4971249, lng: 127.0279931, km: 2.183, dwellSec: 30 },
          { name: "양재", lat: 37.4838155, lng: 127.0346881, km: 3.78, dwellSec: 30 },
          { name: "양재시민의숲", lat: 37.4701433, lng: 127.0383592, km: 5.405 },
          { name: "청계산입구", lat: 37.4483921, lng: 127.0545673, km: 8.266 },
          { name: "판교", lat: 37.3943639, lng: 127.1111873, km: 16.466, dwellSec: 30 },
          { name: "정자", lat: 37.3673677, lng: 127.1084329, km: 19.504, dwellSec: 30 },
          { name: "미금", lat: 37.3499880, lng: 127.1089145, km: 21.437, dwellSec: 30 },
          { name: "동천", lat: 37.3378769, lng: 127.1028482, km: 23.065 },
          { name: "수지구청", lat: 37.3224903, lng: 127.0947567, km: 25.1 },
          { name: "성복", lat: 37.3134135, lng: 127.0803106, km: 26.776 },
          { name: "상현", lat: 37.2974137, lng: 127.0693373, km: 28.896 },
          { name: "광교중앙", lat: 37.2885470, lng: 127.0514993, km: 31.241, dwellSec: 30 },
          { name: "광교", lat: 37.3024813, lng: 127.0435221, km: 33.17, dwellSec: 30 },
        ],
      },
      {
        id: "Suin-Bundang",
        name: "수도권 전철 수인·분당선",
        nameEn: "Seoul Metropolitan Subway Suin-Bundang Line",
        color: "#ECA300",
        category: "捷運",
        directions: { up: "상행 (청량리 방면)", down: "하행 (인천 방면)" },
        stations: [
          { name: "청량리", lat: 37.5808603, lng: 127.0479196, km: 0, dwellSec: 30 },
          { name: "왕십리", lat: 37.5607527, lng: 127.0389074, km: 2.465, dwellSec: 30 },
          { name: "서울숲", lat: 37.5436119, lng: 127.0447677, km: 4.53 },
          { name: "압구정로데오", lat: 37.5278095, lng: 127.0407302, km: 6.326 },
          { name: "강남구청", lat: 37.5167874, lng: 127.0414625, km: 7.599 },
          { name: "선정릉", lat: 37.5106840, lng: 127.0437422, km: 8.307 },
          { name: "선릉", lat: 37.5045872, lng: 127.0490134, km: 9.158 },
          { name: "한티", lat: 37.4962880, lng: 127.0528888, km: 10.142 },
          { name: "도곡", lat: 37.4906191, lng: 127.0555009, km: 10.813 },
          { name: "구룡", lat: 37.4869490, lng: 127.0594678, km: 11.385 },
          { name: "개포동", lat: 37.4891184, lng: 127.0660366, km: 12.027 },
          { name: "대모산입구", lat: 37.4914098, lng: 127.0727398, km: 12.683 },
          { name: "수서", lat: 37.4871034, lng: 127.1018995, km: 15.824, dwellSec: 30 },
          { name: "복정", lat: 37.4701492, lng: 127.1267445, km: 18.962 },
          { name: "가천대", lat: 37.4486985, lng: 127.1267480, km: 21.355 },
          { name: "태평", lat: 37.4397127, lng: 127.1277696, km: 22.359 },
          { name: "모란", lat: 37.4321817, lng: 127.1291124, km: 23.204, dwellSec: 30 },
          { name: "야탑", lat: 37.4112825, lng: 127.1287390, km: 25.533 },
          { name: "이매", lat: 37.3952555, lng: 127.1282725, km: 27.321 },
          { name: "서현", lat: 37.3848959, lng: 127.1233499, km: 28.647 },
          { name: "수내", lat: 37.3783898, lng: 127.1142619, km: 29.728 },
          { name: "정자", lat: 37.3661802, lng: 127.1081423, km: 31.317, dwellSec: 30 },
          { name: "미금", lat: 37.3499987, lng: 127.1090211, km: 33.121 },
          { name: "오리", lat: 37.3395228, lng: 127.1089708, km: 34.286 },
          { name: "죽전", lat: 37.3245618, lng: 127.1074384, km: 35.972, dwellSec: 30 },
          { name: "보정", lat: 37.3123537, lng: 127.1083504, km: 37.337 },
          { name: "구성", lat: 37.2990235, lng: 127.1057833, km: 38.885 },
          { name: "신갈", lat: 37.2861829, lng: 127.1114081, km: 40.474 },
          { name: "기흥", lat: 37.2755112, lng: 127.1160397, km: 41.808 },
          { name: "상갈", lat: 37.2616481, lng: 127.1089132, km: 43.8 },
          { name: "청명", lat: 37.2599671, lng: 127.0795655, km: 46.501 },
          { name: "영통", lat: 37.2513378, lng: 127.0713229, km: 47.707 },
          { name: "망포", lat: 37.2455829, lng: 127.0570030, km: 49.259 },
          { name: "매탄권선", lat: 37.2530129, lng: 127.0404191, km: 51.054 },
          { name: "수원시청", lat: 37.2617204, lng: 127.0318902, km: 52.363 },
          { name: "매교", lat: 37.2654534, lng: 127.0157180, km: 53.853 },
          { name: "수원", lat: 37.2658117, lng: 126.9993051, km: 55.43, dwellSec: 30 },
          { name: "고색", lat: 37.2494292, lng: 126.9796874, km: 58.166 },
          { name: "오목천", lat: 37.2431034, lng: 126.9634832, km: 59.769 },
          { name: "어천", lat: 37.2503749, lng: 126.9081819, km: 64.87 },
          { name: "야목", lat: 37.2616308, lng: 126.8833633, km: 67.417 },
          { name: "사리", lat: 37.2915384, lng: 126.8573725, km: 72.146 },
          { name: "한대앞", lat: 37.3103831, lng: 126.8527773, km: 74.433, dwellSec: 30 },
          { name: "중앙", lat: 37.3160633, lng: 126.8374647, km: 76.038 },
          { name: "고잔", lat: 37.3169005, lng: 126.8220934, km: 77.401 },
          { name: "초지", lat: 37.3211622, lng: 126.8049024, km: 79.028 },
          { name: "안산", lat: 37.3274089, lng: 126.7879605, km: 80.69 },
          { name: "신길온천", lat: 37.3380983, lng: 126.7661867, km: 82.954 },
          { name: "정왕", lat: 37.3520536, lng: 126.7419901, km: 85.709 },
          { name: "오이도", lat: 37.3623497, lng: 126.7386441, km: 87.126, dwellSec: 30 },
          { name: "달월", lat: 37.3807129, lng: 126.7458836, km: 89.312 },
          { name: "월곶", lat: 37.3921604, lng: 126.7423159, km: 90.735 },
          { name: "소래포구", lat: 37.4013038, lng: 126.7325487, km: 92.078 },
          { name: "인천논현", lat: 37.4004832, lng: 126.7215322, km: 93.073 },
          { name: "호구포", lat: 37.4020968, lng: 126.7077547, km: 94.373 },
          { name: "남동인더스파크", lat: 37.4082483, lng: 126.6943986, km: 95.741 },
          { name: "원인재", lat: 37.4136809, lng: 126.6856687, km: 96.72, dwellSec: 30 },
          { name: "연수", lat: 37.4183698, lng: 126.6779472, km: 97.579 },
          { name: "송도", lat: 37.4303043, lng: 126.6538721, km: 100.151 },
          { name: "인하대", lat: 37.4489904, lng: 126.6493767, km: 102.548 },
          { name: "숭의", lat: 37.4612390, lng: 126.6370849, km: 104.331 },
          { name: "신포", lat: 37.4689305, lng: 126.6236807, km: 105.809 },
          { name: "인천", lat: 37.4769719, lng: 126.6173267, km: 106.914, dwellSec: 30 },
        ],
      },
      {
        id: "Gyeongui-Jungang",
        name: "수도권 전철 경의·중앙선",
        nameEn: "Seoul Metropolitan Subway Gyeongui-Jungang Line",
        color: "#6AC2B3",
        category: "捷運",
        directions: { up: "상행 (문산 방면)", down: "하행 (용문 방면)" },
        // Main all-stop corridor: Munsan ↔ Yongmun. Seoul Station, Imjingang,
        // Dorasan, and sparse Jipyeong services need branch/short-turn support.
        stations: [
          { name: "문산", lat: 37.8536263, lng: 126.7879859, km: 0, dwellSec: 30 },
          { name: "파주", lat: 37.8142380, lng: 126.7926805, km: 4.387 },
          { name: "월롱", lat: 37.7955006, lng: 126.7922970, km: 6.537 },
          { name: "금촌", lat: 37.7658340, lng: 126.7737312, km: 10.61 },
          { name: "금릉", lat: 37.7506152, lng: 126.7657991, km: 12.71 },
          { name: "운정", lat: 37.7245774, lng: 126.7667245, km: 15.814 },
          { name: "야당", lat: 37.7121076, lng: 126.7613347, km: 17.28 },
          { name: "탄현", lat: 37.6931171, lng: 126.7610484, km: 19.393 },
          { name: "일산", lat: 37.6821094, lng: 126.7699182, km: 21.008 },
          { name: "풍산", lat: 37.6716106, lng: 126.7867036, km: 22.955 },
          { name: "백마", lat: 37.6575978, lng: 126.7949216, km: 24.673 },
          { name: "곡산", lat: 37.6451532, lng: 126.8021797, km: 26.197 },
          { name: "대곡", lat: 37.6313327, lng: 126.8103746, km: 27.895, dwellSec: 30 },
          { name: "능곡", lat: 37.6185073, lng: 126.8213369, km: 29.643 },
          { name: "행신", lat: 37.6122614, lng: 126.8341932, km: 31.043 },
          { name: "강매", lat: 37.6124295, lng: 126.8446915, km: 31.968 },
          { name: "한국항공대", lat: 37.6022601, lng: 126.8689497, km: 34.504 },
          { name: "수색", lat: 37.5801350, lng: 126.8963173, km: 37.953 },
          { name: "디지털미디어시티", lat: 37.5770829, lng: 126.9008550, km: 38.478, dwellSec: 30 },
          { name: "가좌", lat: 37.5682788, lng: 126.9155556, km: 40.111 },
          { name: "홍대입구", lat: 37.5573063, lng: 126.9271637, km: 41.737, dwellSec: 30 },
          { name: "서강대", lat: 37.5519834, lng: 126.9357580, km: 42.702 },
          { name: "공덕", lat: 37.5419764, lng: 126.9533741, km: 44.655, dwellSec: 30 },
          { name: "효창공원앞", lat: 37.5383603, lng: 126.9635452, km: 45.647 },
          { name: "용산", lat: 37.5285081, lng: 126.9636297, km: 47.208, dwellSec: 30 },
          { name: "이촌(국립중앙박물관)", lat: 37.5222635, lng: 126.9739881, km: 49.028 },
          { name: "서빙고", lat: 37.5196341, lng: 126.9892394, km: 50.43 },
          { name: "한남", lat: 37.5297070, lng: 127.0099115, km: 52.679 },
          { name: "옥수", lat: 37.5410818, lng: 127.0196130, km: 54.233 },
          { name: "응봉", lat: 37.5505539, lng: 127.0349018, km: 55.98 },
          { name: "왕십리", lat: 37.5613457, lng: 127.0384326, km: 57.346, dwellSec: 30 },
          { name: "청량리", lat: 37.5806700, lng: 127.0481704, km: 59.753, dwellSec: 30 },
          { name: "회기", lat: 37.5898882, lng: 127.0583976, km: 61.141, dwellSec: 30 },
          { name: "중랑", lat: 37.5952240, lng: 127.0771185, km: 62.907 },
          { name: "상봉", lat: 37.5970179, lng: 127.0860245, km: 63.717, dwellSec: 30 },
          { name: "망우", lat: 37.5996557, lng: 127.0931647, km: 64.411, dwellSec: 30 },
          { name: "양원", lat: 37.6068926, lng: 127.1089835, km: 66.042 },
          { name: "구리", lat: 37.6035577, lng: 127.1443580, km: 69.275 },
          { name: "도농", lat: 37.6088094, lng: 127.1611904, km: 70.878 },
          { name: "양정", lat: 37.6035431, lng: 127.1949837, km: 74.574 },
          { name: "덕소", lat: 37.5862296, lng: 127.2101005, km: 76.996, dwellSec: 30 },
          { name: "도심", lat: 37.5793764, lng: 127.2236437, km: 78.421 },
          { name: "팔당", lat: 37.5469642, lng: 127.2446171, km: 82.577 },
          { name: "운길산", lat: 37.5544075, lng: 127.3107824, km: 88.986 },
          { name: "양수", lat: 37.5456213, lng: 127.3299121, km: 90.935 },
          { name: "신원", lat: 37.5249382, lng: 127.3735585, km: 95.573 },
          { name: "국수", lat: 37.5164148, lng: 127.4003392, km: 98.544 },
          { name: "아신", lat: 37.5136649, lng: 127.4443172, km: 102.538 },
          { name: "오빈", lat: 37.5059864, lng: 127.4746621, km: 105.347 },
          { name: "양평", lat: 37.4920648, lng: 127.4926684, km: 107.622, dwellSec: 30 },
          { name: "원덕", lat: 37.4686581, lng: 127.5476780, km: 113.427 },
          { name: "용문", lat: 37.4823229, lng: 127.5945812, km: 118.024, dwellSec: 30 },
        ],
      },
      {
        id: "Gyeongchun",
        name: "수도권 전철 경춘선",
        nameEn: "Seoul Metropolitan Subway Gyeongchun Line",
        color: "#007A62",
        category: "捷運",
        directions: { up: "상행 (청량리 방면)", down: "하행 (춘천 방면)" },
        // Main all-stop corridor: Cheongnyangni ↔ Chuncheon. Sangbong and
        // Gwangwoon Univ. variants need branch/short-turn support; ITX is separate.
        stations: [
          { name: "청량리", lat: 37.5807488, lng: 127.0480007, km: 0, dwellSec: 30 },
          { name: "회기", lat: 37.5898882, lng: 127.0583976, km: 1.389, dwellSec: 30 },
          { name: "중랑", lat: 37.5952240, lng: 127.0771185, km: 3.155 },
          { name: "상봉", lat: 37.5975308, lng: 127.0865782, km: 4.028, dwellSec: 30 },
          { name: "망우", lat: 37.6001579, lng: 127.0920944, km: 4.597, dwellSec: 30 },
          { name: "신내", lat: 37.6126451, lng: 127.1032226, km: 6.586 },
          { name: "갈매", lat: 37.6339552, lng: 127.1147005, km: 9.174 },
          { name: "별내", lat: 37.6426852, lng: 127.1283724, km: 10.775 },
          { name: "퇴계원", lat: 37.6482702, lng: 127.1435237, km: 12.249 },
          { name: "사릉", lat: 37.6511137, lng: 127.1769097, km: 15.498 },
          { name: "금곡", lat: 37.6373387, lng: 127.2074212, km: 19.083 },
          { name: "평내호평", lat: 37.6532338, lng: 127.2444884, km: 23.028, dwellSec: 30 },
          { name: "천마산", lat: 37.6592290, lng: 127.2850612, km: 26.892 },
          { name: "마석", lat: 37.6527896, lng: 127.3116743, km: 29.406 },
          { name: "대성리", lat: 37.6838528, lng: 127.3795675, km: 36.751 },
          { name: "청평", lat: 37.7355228, lng: 127.4266248, km: 44.313 },
          { name: "상천", lat: 37.7701614, lng: 127.4544037, km: 49.127 },
          { name: "가평", lat: 37.8145424, lng: 127.5107447, km: 56.228, dwellSec: 30 },
          { name: "굴봉산", lat: 37.8319414, lng: 127.5571302, km: 60.775 },
          { name: "백양리", lat: 37.8307979, lng: 127.5891698, km: 63.699 },
          { name: "강촌", lat: 37.8057393, lng: 127.6341157, km: 68.998 },
          { name: "김유정", lat: 37.8184499, lng: 127.7143217, km: 76.443 },
          { name: "남춘천", lat: 37.8639923, lng: 127.7239204, km: 82.4, dwellSec: 30 },
          { name: "춘천", lat: 37.8845276, lng: 127.7166203, km: 85.089, dwellSec: 30 },
        ],
      },
      {
        id: "Gyeonggang",
        name: "수도권 전철 경강선",
        nameEn: "Seoul Metropolitan Subway Gyeonggang Line",
        color: "#0B318F",
        category: "捷運",
        directions: { up: "상행 (판교 방면)", down: "하행 (여주 방면)" },
        // Main all-stop corridor: Pangyo to Yeoju. Bubal short-turns share the
        // same template; future extensions west of Pangyo and east of Yeoju
        // need branch/extension support before being folded into this line.
        stations: [
          { name: "판교", lat: 37.3947577, lng: 127.1115664, km: 0, dwellSec: 30 },
          { name: "성남", lat: 37.3947450, lng: 127.1206192, km: 0.763, dwellSec: 30 },
          { name: "이매", lat: 37.3946908, lng: 127.1276046, km: 1.38, dwellSec: 30 },
          { name: "삼동", lat: 37.4086667, lng: 127.2033703, km: 8.314 },
          { name: "경기광주", lat: 37.3989152, lng: 127.2532951, km: 13.271 },
          { name: "초월", lat: 37.3731656, lng: 127.3004700, km: 18.387 },
          { name: "곤지암", lat: 37.3505190, lng: 127.3462861, km: 23.206 },
          { name: "신둔도예촌", lat: 37.3156754, lng: 127.4052750, km: 30.009 },
          { name: "이천", lat: 37.2642550, lng: 127.4421828, km: 37.791 },
          { name: "부발", lat: 37.2604283, lng: 127.4903138, km: 42.265, dwellSec: 30 },
          { name: "세종대왕릉", lat: 37.2936415, lng: 127.5706498, km: 50.565 },
          { name: "여주", lat: 37.2828230, lng: 127.6290136, km: 55.96, dwellSec: 30 },
        ],
      },
      {
        id: "Seohae",
        name: "수도권 전철 서해선",
        nameEn: "Seoul Metropolitan Subway Seohae Line",
        color: "#5EAC41",
        category: "捷運",
        directions: { up: "상행 (일산 방면)", down: "하행 (원시 방면)" },
        // Main all-stop corridor: Ilsan to Wonsi. Most trains short-turn at
        // Daegok; future southward extensions need branch/extension support.
        stations: [
          { name: "일산", lat: 37.6821094, lng: 126.7699182, km: 0, dwellSec: 30 },
          { name: "풍산", lat: 37.6716106, lng: 126.7867036, km: 1.947 },
          { name: "백마", lat: 37.6575978, lng: 126.7949216, km: 3.665 },
          { name: "곡산", lat: 37.6451532, lng: 126.8021797, km: 5.19 },
          { name: "대곡", lat: 37.6312822, lng: 126.8102660, km: 6.889, dwellSec: 30 },
          { name: "능곡", lat: 37.6184109, lng: 126.8211962, km: 8.636 },
          { name: "김포공항", lat: 37.5605190, lng: 126.8044964, km: 16.143, dwellSec: 30 },
          { name: "원종", lat: 37.5221625, lng: 126.8049364, km: 20.54 },
          { name: "부천종합운동장", lat: 37.5055909, lng: 126.7974602, km: 22.573 },
          { name: "소사", lat: 37.4824192, lng: 126.7951956, km: 25.195, dwellSec: 30 },
          { name: "소새울", lat: 37.4687000, lng: 126.7972489, km: 26.758 },
          { name: "시흥대야", lat: 37.4501052, lng: 126.7930513, km: 28.94 },
          { name: "신천", lat: 37.4393371, lng: 126.7868733, km: 30.256 },
          { name: "신현", lat: 37.4096889, lng: 126.7878815, km: 33.624 },
          { name: "시흥시청", lat: 37.3820315, lng: 126.8058563, km: 37.213 },
          { name: "시흥능곡", lat: 37.3702397, lng: 126.8088237, km: 38.557 },
          { name: "달미", lat: 37.3489976, lng: 126.8091335, km: 40.965 },
          { name: "선부", lat: 37.3343857, lng: 126.8099592, km: 42.597 },
          { name: "초지", lat: 37.3198213, lng: 126.8080122, km: 44.236, dwellSec: 30 },
          { name: "시우", lat: 37.3130971, lng: 126.7957458, km: 45.625 },
          { name: "원시", lat: 37.3025413, lng: 126.7868312, km: 47.136, dwellSec: 30 },
        ],
      },
      {
        id: "Incheon-Metro-1",
        name: "인천 도시철도 1호선",
        nameEn: "Incheon Subway Line 1",
        color: "#B4C7E7",
        category: "捷運",
        directions: { up: "상행 (송도달빛축제공원 방면)", down: "하행 (검단호수공원 방면)" },
        // Incheon Line 1 after the 2025-06-28 Geomdan extension: 33 stations,
        // 37.1 km. Station order follows OSM route 19425646 because its stop
        // members include all stations, including 인천대입구.
        stations: [
          { name: "송도달빛축제공원", lat: 37.4067870, lng: 126.6260503, km: 0, dwellSec: 30 },
          { name: "국제업무지구", lat: 37.3997664, lng: 126.6305042, km: 0.874 },
          { name: "센트럴파크", lat: 37.3933820, lng: 126.6345132, km: 1.668 },
          { name: "인천대입구", lat: 37.3860039, lng: 126.6394959, km: 2.599 },
          { name: "지식정보단지", lat: 37.3780049, lng: 126.6455001, km: 3.634 },
          { name: "테크노파크", lat: 37.3819920, lng: 126.6559828, km: 5.013 },
          { name: "캠퍼스타운", lat: 37.3878438, lng: 126.6616832, km: 5.835 },
          { name: "동막", lat: 37.3983217, lng: 126.6739517, km: 7.441 },
          { name: "동춘", lat: 37.4045662, lng: 126.6806620, km: 8.354 },
          { name: "원인재", lat: 37.4124962, lng: 126.6880891, km: 9.454 },
          { name: "신연수", lat: 37.4179744, lng: 126.6938914, km: 10.25 },
          { name: "선학", lat: 37.4271567, lng: 126.6990793, km: 11.404 },
          { name: "문학경기장", lat: 37.4348761, lng: 126.6978836, km: 12.275 },
          { name: "인천터미널", lat: 37.4418961, lng: 126.6997770, km: 13.082 },
          { name: "예술회관", lat: 37.4500411, lng: 126.7010891, km: 13.995 },
          { name: "인천시청", lat: 37.4579298, lng: 126.7022364, km: 14.878 },
          { name: "간석오거리", lat: 37.4673120, lng: 126.7079669, km: 16.257 },
          { name: "부평삼거리", lat: 37.4778688, lng: 126.7102992, km: 17.457 },
          { name: "동수", lat: 37.4854320, lng: 126.7184693, km: 18.633 },
          { name: "부평", lat: 37.4899777, lng: 126.7237760, km: 19.386, dwellSec: 30 },
          { name: "부평시장", lat: 37.4983757, lng: 126.7223422, km: 20.329 },
          { name: "부평구청", lat: 37.5080784, lng: 126.7206376, km: 21.42, dwellSec: 30 },
          { name: "갈산", lat: 37.5167011, lng: 126.7215481, km: 22.383 },
          { name: "작전", lat: 37.5303004, lng: 126.7225937, km: 23.898 },
          { name: "경인교대입구", lat: 37.5384258, lng: 126.7226536, km: 24.802 },
          { name: "계산", lat: 37.5432872, lng: 126.7278961, km: 25.68 },
          { name: "임학", lat: 37.5451262, lng: 126.7387700, km: 26.769 },
          { name: "박촌", lat: 37.5536206, lng: 126.7450735, km: 27.866 },
          { name: "귤현", lat: 37.5674066, lng: 126.7422024, km: 29.496 },
          { name: "계양", lat: 37.5715213, lng: 126.7366990, km: 30.243, dwellSec: 30 },
          { name: "아라", lat: 37.5921919, lng: 126.7133760, km: 34.284 },
          { name: "신검단중앙", lat: 37.6026985, lng: 126.6985035, km: 36.293 },
          { name: "검단호수공원", lat: 37.6024640, lng: 126.6885315, km: 37.172, dwellSec: 30 },
        ],
      },
      {
        id: "Incheon-Metro-2",
        name: "인천 도시철도 2호선",
        nameEn: "Incheon Subway Line 2",
        color: "#F4A462",
        category: "LRT",
        directions: { up: "상행 (검단오류 방면)", down: "하행 (운연 방면)" },
        // Incheon Line 2 is a driverless light metro using ITC 2000-series cars.
        // Station order follows OSM route 7527496; its stop members cover all 27 stations.
        stations: [
          { name: "검단오류", lat: 37.5949031, lng: 126.6282878, km: 0, dwellSec: 30 },
          { name: "왕길", lat: 37.5952783, lng: 126.6427535, km: 1.326 },
          { name: "검단사거리", lat: 37.6019359, lng: 126.6570932, km: 2.797 },
          { name: "마전", lat: 37.5974375, lng: 126.6673527, km: 3.849 },
          { name: "완정", lat: 37.5925926, lng: 126.6728784, km: 4.622 },
          { name: "독정", lat: 37.5847513, lng: 126.6759397, km: 5.541 },
          { name: "검암", lat: 37.5685199, lng: 126.6756990, km: 7.384, dwellSec: 30 },
          { name: "검바위", lat: 37.5608918, lng: 126.6774743, km: 8.266 },
          { name: "아시아드경기장", lat: 37.5510172, lng: 126.6770356, km: 9.365 },
          { name: "서구청", lat: 37.5433208, lng: 126.6767447, km: 10.221 },
          { name: "가정", lat: 37.5241073, lng: 126.6752382, km: 12.362 },
          { name: "가정중앙시장", lat: 37.5170880, lng: 126.6767385, km: 13.233 },
          { name: "석남", lat: 37.5063870, lng: 126.6761225, km: 14.424, dwellSec: 30 },
          { name: "서부여성회관", lat: 37.4995411, lng: 126.6757103, km: 15.186 },
          { name: "인천가좌", lat: 37.4895993, lng: 126.6751276, km: 16.293 },
          { name: "가재울", lat: 37.4835734, lng: 126.6844519, km: 17.451 },
          { name: "주안국가산단", lat: 37.4732154, lng: 126.6808599, km: 18.827 },
          { name: "주안", lat: 37.4648978, lng: 126.6788699, km: 19.77, dwellSec: 30 },
          { name: "시민공원", lat: 37.4583648, lng: 126.6813015, km: 20.775 },
          { name: "석바위시장", lat: 37.4576075, lng: 126.6929190, km: 21.804 },
          { name: "인천시청", lat: 37.4567305, lng: 126.7028705, km: 22.688, dwellSec: 30 },
          { name: "석천사거리", lat: 37.4566506, lng: 126.7112017, km: 23.426 },
          { name: "모래내시장", lat: 37.4558040, lng: 126.7199840, km: 24.207 },
          { name: "만수", lat: 37.4549230, lng: 126.7322622, km: 25.296 },
          { name: "남동구청", lat: 37.4481210, lng: 126.7373278, km: 26.536 },
          { name: "인천대공원", lat: 37.4484300, lng: 126.7533155, km: 28.004 },
          { name: "운연", lat: 37.4393136, lng: 126.7594871, km: 29.277, dwellSec: 30 },
        ],
      },
      {
        id: "Gimpo-Goldline",
        name: "김포골드라인",
        nameEn: "Gimpo Goldline",
        color: "#ad8605",
        category: "LRT",
        directions: { up: "상행 (양촌 방면)", down: "하행 (김포공항 방면)" },
        // Gimpo Goldline: Yangchon ↔ Gimpo Int'l Airport 23.47 km, 10 stations.
        // Light metro / AGT-like automated service, modeled as all-stop only.
        stations: [
          { name: "양촌",       lat: 37.641658, lng: 126.614822, km: 0,    dwellSec: 30 },
          { name: "구래",       lat: 37.645315, lng: 126.628743, km: 1.37 },
          { name: "마산",       lat: 37.640560, lng: 126.644145, km: 2.54 },
          { name: "장기",       lat: 37.643975, lng: 126.669070, km: 5.53 },
          { name: "운양",       lat: 37.653783, lng: 126.683932, km: 7.22 },
          { name: "걸포북변",   lat: 37.631465, lng: 126.705881, km: 10.61 },
          { name: "사우",       lat: 37.620157, lng: 126.719728, km: 12.48 },
          { name: "풍무",       lat: 37.612354, lng: 126.732440, km: 13.86 },
          { name: "고촌",       lat: 37.601304, lng: 126.770147, km: 17.55 },
          { name: "김포공항",   lat: 37.562389, lng: 126.801895, km: 23.47, dwellSec: 30 },
        ],
      },
      {
        id: "Daegu-Metro-1",
        name: "대구 도시철도 1호선",
        nameEn: "Daegu Metro Line 1",
        color: "#EF5E37",
        category: "捷運",
        directions: { up: "상행 (설화명곡 방면)", down: "하행 (하양 방면)" },
        // Daegu Line 1: Seolhwa-Myeonggok→Hayang all-stop route; OSM
        // relation 7685464 includes the 2024 Hayang extension and 35 stops.
        stations: [
          { name: "설화명곡", lat: 35.7986759, lng: 128.4893370, km: 0.000, dwellSec: 30 },
          { name: "화원", lat: 35.8042787, lng: 128.5003930, km: 1.189 },
          { name: "대곡", lat: 35.8094126, lng: 128.5125079, km: 2.431 },
          { name: "진천", lat: 35.8137562, lng: 128.5226822, km: 3.490 },
          { name: "월배", lat: 35.8161096, lng: 128.5304345, km: 4.241 },
          { name: "상인", lat: 35.8189392, lng: 128.5378522, km: 4.983 },
          { name: "월촌", lat: 35.8240106, lng: 128.5458898, km: 5.932 },
          { name: "송현", lat: 35.8312484, lng: 128.5519764, km: 6.906 },
          { name: "서부정류장", lat: 35.8369013, lng: 128.5571566, km: 7.696 },
          { name: "대명", lat: 35.8392258, lng: 128.5650316, km: 8.460 },
          { name: "안지랑", lat: 35.8391616, lng: 128.5738399, km: 9.256 },
          { name: "현충로", lat: 35.8407964, lng: 128.5813354, km: 9.987 },
          { name: "영대병원", lat: 35.8443850, lng: 128.5886490, km: 10.758 },
          { name: "교대", lat: 35.8503938, lng: 128.5906054, km: 11.518 },
          { name: "명덕", lat: 35.8569420, lng: 128.5907999, km: 12.246 },
          { name: "반월당", lat: 35.8652084, lng: 128.5934479, km: 13.203, dwellSec: 30 },
          { name: "중앙로", lat: 35.8707400, lng: 128.5941029, km: 13.822 },
          { name: "대구역", lat: 35.8762249, lng: 128.5970846, km: 14.535 },
          { name: "칠성시장", lat: 35.8760602, lng: 128.6050621, km: 15.273 },
          { name: "신천", lat: 35.8745695, lng: 128.6176043, km: 16.482 },
          { name: "동대구역", lat: 35.8772995, lng: 128.6274527, km: 17.429, dwellSec: 30 },
          { name: "동구청", lat: 35.8844960, lng: 128.6323595, km: 18.348 },
          { name: "아양교", lat: 35.8871194, lng: 128.6399259, km: 19.108 },
          { name: "동촌", lat: 35.8859970, lng: 128.6503660, km: 20.156 },
          { name: "해안", lat: 35.8835489, lng: 128.6588633, km: 20.982 },
          { name: "방촌", lat: 35.8797454, lng: 128.6696328, km: 22.049 },
          { name: "용계", lat: 35.8762307, lng: 128.6813844, km: 23.178 },
          { name: "율하", lat: 35.8696762, lng: 128.6927905, km: 24.479 },
          { name: "신기", lat: 35.8666654, lng: 128.7017034, km: 25.393 },
          { name: "반야월", lat: 35.8658937, lng: 128.7136998, km: 26.478 },
          { name: "각산", lat: 35.8678436, lng: 128.7239176, km: 27.442 },
          { name: "안심", lat: 35.8711424, lng: 128.7337402, km: 28.400, dwellSec: 30 },
          { name: "대구한의대병원", lat: 35.8716571, lng: 128.7511584, km: 30.021 },
          { name: "부호", lat: 35.9001593, lng: 128.8031097, km: 35.863 },
          { name: "하양", lat: 35.9093966, lng: 128.8175446, km: 37.549, dwellSec: 30 },
        ],
      },
      {
        id: "Daegu-Metro-2",
        name: "대구 도시철도 2호선",
        nameEn: "Daegu Metro Line 2",
        color: "#33AA46",
        category: "捷運",
        directions: { up: "상행 (문양 방면)", down: "하행 (영남대 방면)" },
        // Daegu Line 2: Munyang→Yeungnam University all-stop route; OSM
        // relation 7685783 provides complete stop members for 29 stations.
        stations: [
          { name: "문양", lat: 35.8643039, lng: 128.4371644, km: 0.000, dwellSec: 30 },
          { name: "다사", lat: 35.8653200, lng: 128.4579020, km: 2.831 },
          { name: "대실", lat: 35.8572721, lng: 128.4656502, km: 3.967 },
          { name: "강창", lat: 35.8530741, lng: 128.4780960, km: 5.241 },
          { name: "계명대", lat: 35.8514819, lng: 128.4919275, km: 6.502 },
          { name: "성서산업단지", lat: 35.8516848, lng: 128.5070241, km: 7.869 },
          { name: "이곡", lat: 35.8505073, lng: 128.5157932, km: 8.670 },
          { name: "용산", lat: 35.8489970, lng: 128.5288891, km: 9.894 },
          { name: "죽전", lat: 35.8504172, lng: 128.5382364, km: 10.755 },
          { name: "감삼", lat: 35.8542959, lng: 128.5482878, km: 11.759 },
          { name: "두류", lat: 35.8571511, lng: 128.5557793, km: 12.505 },
          { name: "내당", lat: 35.8600749, lng: 128.5647603, km: 13.377 },
          { name: "반고개", lat: 35.8623859, lng: 128.5736624, km: 14.219 },
          { name: "청라언덕", lat: 35.8650572, lng: 128.5832267, km: 15.132, dwellSec: 30 },
          { name: "반월당", lat: 35.8653962, lng: 128.5937558, km: 16.117, dwellSec: 30 },
          { name: "경대병원", lat: 35.8630360, lng: 128.6030138, km: 17.001 },
          { name: "대구은행", lat: 35.8597102, lng: 128.6141103, km: 18.089 },
          { name: "범어", lat: 35.8589767, lng: 128.6264978, km: 19.208 },
          { name: "수성구청", lat: 35.8587763, lng: 128.6357941, km: 20.047 },
          { name: "만촌", lat: 35.8588297, lng: 128.6451118, km: 20.886 },
          { name: "담티", lat: 35.8546377, lng: 128.6541896, km: 21.841 },
          { name: "연호", lat: 35.8463576, lng: 128.6719606, km: 23.699 },
          { name: "수성알파시티", lat: 35.8425943, lng: 128.6799597, km: 24.534 },
          { name: "고산", lat: 35.8428572, lng: 128.6934096, km: 25.793 },
          { name: "신매", lat: 35.8407648, lng: 128.7049547, km: 26.867 },
          { name: "사월", lat: 35.8367886, lng: 128.7160117, km: 27.964 },
          { name: "정평", lat: 35.8340264, lng: 128.7282908, km: 29.112 },
          { name: "임당", lat: 35.8340509, lng: 128.7410260, km: 30.260 },
          { name: "영남대", lat: 35.8365664, lng: 128.7535757, km: 31.457, dwellSec: 30 },
        ],
      },
      {
        id: "Daegu-Metro-3",
        name: "대구 도시철도 3호선",
        nameEn: "Daegu Metro Line 3",
        color: "#FDA208",
        category: "Monorail",
        directions: { up: "상행 (칠곡경대병원 방면)", down: "하행 (용지 방면)" },
        // Daegu Line 3: Chilgok Kyungpook Nat'l Univ. Medical Center ↔ Yongji.
        // Korea's first straddle-beam urban monorail; 30 stations, about 23.95 km.
        stations: [
          { name: "칠곡경대병원",   lat: 35.958513, lng: 128.559856, km: 0,    dwellSec: 30 },
          { name: "학정",           lat: 35.951571, lng: 128.559137, km: 0.8 },
          { name: "팔거",           lat: 35.944128, lng: 128.558301, km: 1.6 },
          { name: "동천",           lat: 35.937750, lng: 128.556629, km: 2.3 },
          { name: "칠곡운암",       lat: 35.931544, lng: 128.554521, km: 3.1 },
          { name: "구암",           lat: 35.925777, lng: 128.550275, km: 3.8 },
          { name: "태전",           lat: 35.919753, lng: 128.547359, km: 4.5 },
          { name: "매천",           lat: 35.912723, lng: 128.543359, km: 5.4 },
          { name: "매천시장",       lat: 35.904339, lng: 128.545648, km: 6.5 },
          { name: "팔달",           lat: 35.897835, lng: 128.546678, km: 7.3 },
          { name: "공단",           lat: 35.892030, lng: 128.553548, km: 8.2 },
          { name: "만평",           lat: 35.889842, lng: 128.561037, km: 9.0 },
          { name: "팔달시장",       lat: 35.888865, lng: 128.567867, km: 9.6 },
          { name: "원대",           lat: 35.887871, lng: 128.574296, km: 10.2 },
          { name: "북구청",         lat: 35.883802, lng: 128.581398, km: 11.0 },
          { name: "달성공원",       lat: 35.875696, lng: 128.582052, km: 12.0 },
          { name: "서문시장",       lat: 35.869703, lng: 128.582221, km: 12.7 },
          { name: "청라언덕",       lat: 35.864203, lng: 128.582325, km: 13.4, dwellSec: 30 },
          { name: "남산",           lat: 35.856674, lng: 128.583379, km: 14.2 },
          { name: "명덕",           lat: 35.856931, lng: 128.590143, km: 14.8, dwellSec: 30 },
          { name: "건들바위",       lat: 35.855388, lng: 128.599592, km: 15.7 },
          { name: "대봉교",         lat: 35.854966, lng: 128.606335, km: 16.4 },
          { name: "수성시장",       lat: 35.854298, lng: 128.615996, km: 17.2 },
          { name: "수성구민운동장", lat: 35.852365, lng: 128.625152, km: 18.2 },
          { name: "어린이세상",     lat: 35.845156, lng: 128.624445, km: 19.0 },
          { name: "황금",           lat: 35.839037, lng: 128.623901, km: 19.7 },
          { name: "수성못",         lat: 35.831413, lng: 128.623188, km: 20.5 },
          { name: "지산",           lat: 35.825252, lng: 128.631819, km: 21.7 },
          { name: "범물",           lat: 35.820951, lng: 128.640013, km: 22.5 },
          { name: "용지",           lat: 35.818265, lng: 128.646436, km: 23.2, dwellSec: 30 },
        ],
        grades: [
          { from: 0, to: 23.2, type: "elevated", note: "大邱 3 號線跨座式單軌全線高架" },
        ],
      },
      {
        id: "Daejeon-Metro-1",
        name: "대전 도시철도 1호선",
        nameEn: "Daejeon Metro Line 1",
        color: "#007448",
        category: "捷運",
        directions: { up: "상행 (판암 방면)", down: "하행 (반석 방면)" },
        // Daejeon Line 1: Panam→Banseok all-stop route; OSM relation
        // 7792527 provides complete stop members for 22 stations.
        stations: [
          { name: "판암", lat: 36.3169619, lng: 127.4576797, km: 0.000, dwellSec: 30 },
          { name: "신흥", lat: 36.3196335, lng: 127.4489861, km: 0.852 },
          { name: "대동", lat: 36.3294490, lng: 127.4429386, km: 2.161 },
          { name: "대전역", lat: 36.3313841, lng: 127.4333493, km: 3.180, dwellSec: 30 },
          { name: "중앙로", lat: 36.3286138, lng: 127.4258937, km: 3.915 },
          { name: "중구청", lat: 36.3248208, lng: 127.4195531, km: 4.637 },
          { name: "서대전네거리", lat: 36.3224022, lng: 127.4125356, km: 5.441 },
          { name: "오룡", lat: 36.3284108, lng: 127.4050960, km: 6.385 },
          { name: "용문", lat: 36.3382554, lng: 127.3932978, km: 7.906 },
          { name: "탄방", lat: 36.3461286, lng: 127.3847192, km: 9.177 },
          { name: "시청", lat: 36.3514837, lng: 127.3866258, km: 9.824, dwellSec: 30 },
          { name: "정부청사", lat: 36.3576300, lng: 127.3816126, km: 10.825, dwellSec: 30 },
          { name: "갈마", lat: 36.3577013, lng: 127.3727947, km: 11.615 },
          { name: "월평", lat: 36.3583733, lng: 127.3645747, km: 12.356 },
          { name: "갑천", lat: 36.3546063, lng: 127.3544975, km: 13.408 },
          { name: "유성온천", lat: 36.3537327, lng: 127.3417016, km: 14.703, dwellSec: 30 },
          { name: "구암", lat: 36.3567574, lng: 127.3306550, km: 15.748 },
          { name: "현충원", lat: 36.3594558, lng: 127.3214460, km: 16.625 },
          { name: "월드컵경기장", lat: 36.3667814, lng: 127.3179378, km: 17.650 },
          { name: "노은", lat: 36.3741401, lng: 127.3179740, km: 18.468 },
          { name: "지족", lat: 36.3843970, lng: 127.3195772, km: 19.635 },
          { name: "반석", lat: 36.3926366, lng: 127.3144036, km: 20.667, dwellSec: 30 },
        ],
      },
      {
        id: "Gwangju-Metro-1",
        name: "광주 도시철도 1호선",
        nameEn: "Gwangju Metro Line 1",
        color: "#009088",
        category: "捷運",
        directions: { up: "상행 (녹동 방면)", down: "하행 (평동 방면)" },
        // Gwangju Line 1: Nokdong→Pyeongdong all-stop route; OSM relation
        // 13463725 provides complete stop members for 20 stations.
        stations: [
          { name: "녹동", lat: 35.1068152, lng: 126.9340426, km: 0.000, dwellSec: 30 },
          { name: "소태", lat: 35.1236547, lng: 126.9322702, km: 1.930 },
          { name: "학동·증심사입구", lat: 35.1331325, lng: 126.9281965, km: 3.048 },
          { name: "남광주", lat: 35.1394057, lng: 126.9228689, km: 3.900 },
          { name: "문화전당", lat: 35.1467213, lng: 126.9198690, km: 4.783, dwellSec: 30 },
          { name: "금남로4가", lat: 35.1507626, lng: 126.9146034, km: 5.445 },
          { name: "금남로5가", lat: 35.1537794, lng: 126.9100288, km: 5.979 },
          { name: "양동시장", lat: 35.1545606, lng: 126.9017218, km: 6.927 },
          { name: "돌고개", lat: 35.1517511, lng: 126.8955310, km: 7.580 },
          { name: "농성", lat: 35.1532570, lng: 126.8841168, km: 8.767 },
          { name: "화정", lat: 35.1519537, lng: 126.8768469, km: 9.444 },
          { name: "쌍촌", lat: 35.1515347, lng: 126.8695561, km: 10.110 },
          { name: "운천", lat: 35.1504421, lng: 126.8586931, km: 11.107 },
          { name: "상무", lat: 35.1467699, lng: 126.8486397, km: 12.120, dwellSec: 30 },
          { name: "김대중컨벤션센터", lat: 35.1431984, lng: 126.8412775, km: 12.898 },
          { name: "공항", lat: 35.1441580, lng: 126.8117209, km: 15.724, dwellSec: 30 },
          { name: "송정공원", lat: 35.1436097, lng: 126.7995073, km: 16.839 },
          { name: "광주송정", lat: 35.1376413, lng: 126.7915725, km: 17.897, dwellSec: 30 },
          { name: "도산", lat: 35.1316358, lng: 126.7875518, km: 18.666 },
          { name: "평동", lat: 35.1247461, lng: 126.7687769, km: 20.581, dwellSec: 30 },
        ],
      },
      {
        id: "ITX-Cheongchun",
        name: "ITX-청춘",
        nameEn: "ITX-Cheongchun",
        color: "#2563eb",
        category: "Intercity",
        directions: { up: "용산 방면", down: "춘천 방면" },
        // KORAIL ITX-Cheongchun links Yongsan and Chuncheon via the
        // Gyeongwon, Jungang, and Gyeongchun corridors.
        stations: [
          { name: "용산",       lat: 37.529953, lng: 126.964827, km: 0,    dwellSec: 75 },
          { name: "옥수",       lat: 37.540264, lng: 127.018359, km: 4.9 },
          { name: "왕십리",     lat: 37.561486, lng: 127.038579, km: 7.5 },
          { name: "청량리",     lat: 37.580596, lng: 127.048257, km: 9.3,  dwellSec: 60 },
          { name: "상봉",       lat: 37.597031, lng: 127.085656, km: 13.1 },
          { name: "퇴계원",     lat: 37.648256, lng: 127.143532, km: 20.2 },
          { name: "사릉",       lat: 37.651099, lng: 127.176896, km: 23.2 },
          { name: "평내호평",   lat: 37.653214, lng: 127.244490, km: 29.3 },
          { name: "마석",       lat: 37.652775, lng: 127.311675, km: 35.3 },
          { name: "청평",       lat: 37.735508, lng: 127.426636, km: 48.0 },
          { name: "가평",       lat: 37.814518, lng: 127.510763, km: 58.4, dwellSec: 60 },
          { name: "강촌",       lat: 37.805714, lng: 127.634129, km: 69.5 },
          { name: "남춘천",     lat: 37.864011, lng: 127.723938, km: 79.2, dwellSec: 60 },
          { name: "춘천",       lat: 37.884560, lng: 127.716664, km: 81.1, dwellSec: 75 },
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
        id: "KTX-Honam",
        name: "KTX 호남선",
        nameEn: "KTX Honam Line",
        color: "#2563eb",
        category: "HSR",
        directions: { up: "용산 방면", down: "목포 방면" },
        // KORAIL operates Honam KTX on the Yongsan/Seoul - Gwangju-Songjeong/Mokpo axis.
        // This seed models the representative Yongsan - Mokpo high-speed stopping pattern.
        stations: [
          { name: "용산",       lat: 37.529849, lng: 126.964561, km: 0,     dwellSec: 90 },
          { name: "광명",       lat: 37.4159,   lng: 126.8849,   km: 18.4 },
          { name: "천안아산",   lat: 36.794380, lng: 127.104499, km: 104.0 },
          { name: "오송",       lat: 36.620230, lng: 127.327363, km: 136.0 },
          { name: "공주",       lat: 36.332237, lng: 127.096637, km: 173.0 },
          { name: "익산",       lat: 35.941256, lng: 126.945913, km: 211.0, dwellSec: 60 },
          { name: "정읍",       lat: 35.575773, lng: 126.841917, km: 251.0 },
          { name: "광주송정",   lat: 35.137707, lng: 126.790110, km: 303.8, dwellSec: 60 },
          { name: "나주",       lat: 35.013927, lng: 126.717485, km: 324.0 },
          { name: "목포",       lat: 34.792134, lng: 126.387645, km: 367.0, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Jeolla",
        name: "KTX 전라선",
        nameEn: "KTX Jeolla Line",
        color: "#0ea5e9",
        category: "HSR",
        directions: { up: "용산 방면", down: "여수EXPO 방면" },
        // KORAIL Jeolla KTX runs on the Yongsan/Seoul - Jeonju/Suncheon/Yeosu EXPO axis.
        // This seed uses the Gongju high-speed routing before entering the Jeolla Line at Iksan.
        stations: [
          { name: "용산",       lat: 37.529849, lng: 126.964561, km: 0,     dwellSec: 90 },
          { name: "광명",       lat: 37.4159,   lng: 126.8849,   km: 18.4 },
          { name: "천안아산",   lat: 36.794380, lng: 127.104499, km: 104.0 },
          { name: "오송",       lat: 36.620230, lng: 127.327363, km: 136.0 },
          { name: "공주",       lat: 36.332237, lng: 127.096637, km: 173.0 },
          { name: "익산",       lat: 35.941256, lng: 126.945913, km: 211.0, dwellSec: 60 },
          { name: "전주",       lat: 35.850054, lng: 127.162365, km: 236.4 },
          { name: "남원",       lat: 35.411251, lng: 127.361333, km: 289.2 },
          { name: "곡성",       lat: 35.283456, lng: 127.304458, km: 305.8 },
          { name: "구례구",     lat: 35.163478, lng: 127.451967, km: 325.5 },
          { name: "순천",       lat: 34.945811, lng: 127.504060, km: 351.8, dwellSec: 60 },
          { name: "여천",       lat: 34.779462, lng: 127.664450, km: 376.8 },
          { name: "여수EXPO",   lat: 34.755514, lng: 127.749239, km: 385.7, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Gyeongjeon",
        name: "KTX 경전선",
        nameEn: "KTX Gyeongjeon Line",
        color: "#0284c7",
        category: "HSR",
        directions: { up: "서울 방면", down: "진주 방면" },
        // KORAIL Gyeongjeon KTX runs Seoul - Dongdaegu - Miryang - Changwon/Masan/Jinju.
        // This seed mirrors the SRT Gyeongjeon branch after Dongdaegu while using the Seoul KTX trunk.
        stations: [
          { name: "서울",       lat: 37.5547,   lng: 126.9706,   km: 0,     dwellSec: 90 },
          { name: "광명",       lat: 37.4159,   lng: 126.8849,   km: 22.0 },
          { name: "천안아산",   lat: 36.7945,   lng: 127.1043,   km: 96.0 },
          { name: "오송",       lat: 36.6202,   lng: 127.3260,   km: 128.0 },
          { name: "대전",       lat: 36.3320,   lng: 127.4346,   km: 161.0, dwellSec: 60 },
          { name: "김천구미",   lat: 36.1153,   lng: 128.1732,   km: 225.0 },
          { name: "서대구",     lat: 35.881470, lng: 128.540403, km: 284.0 },
          { name: "동대구",     lat: 35.8794,   lng: 128.6285,   km: 293.0, dwellSec: 60 },
          { name: "밀양",       lat: 35.474851, lng: 128.771418, km: 340.0 },
          { name: "진영",       lat: 35.298748, lng: 128.773550, km: 368.5 },
          { name: "창원중앙",   lat: 35.242572, lng: 128.701605, km: 382.5 },
          { name: "창원",       lat: 35.258125, lng: 128.607034, km: 392.5 },
          { name: "마산",       lat: 35.236364, lng: 128.576728, km: 398.0, dwellSec: 60 },
          { name: "진주",       lat: 35.150120, lng: 128.118349, km: 445.0, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Gangneung",
        name: "KTX 강릉선",
        nameEn: "KTX Gangneung Line",
        color: "#0f766e",
        category: "HSR",
        directions: { up: "서울 방면", down: "강릉 방면" },
        // KORAIL operates KTX-Eum on the Seoul/Cheongnyangni - Gangneung axis.
        // This seed models the representative Seoul - Gangneung stopping pattern.
        stations: [
          { name: "서울",       lat: 37.554555, lng: 126.970779, km: 0,     dwellSec: 90 },
          { name: "청량리",     lat: 37.580596, lng: 127.048257, km: 15.0,  dwellSec: 60 },
          { name: "상봉",       lat: 37.597031, lng: 127.085656, km: 21.0 },
          { name: "양평",       lat: 37.492847, lng: 127.491897, km: 58.0 },
          { name: "서원주",     lat: 37.348530, lng: 127.839395, km: 94.0 },
          { name: "만종",       lat: 37.353949, lng: 127.893112, km: 103.0 },
          { name: "횡성",       lat: 37.482807, lng: 128.010484, km: 123.0 },
          { name: "둔내",       lat: 37.510021, lng: 128.221271, km: 147.0 },
          { name: "평창",       lat: 37.561957, lng: 128.430034, km: 174.0 },
          { name: "진부(오대산)", lat: 37.642569, lng: 128.574822, km: 191.0 },
          { name: "강릉",       lat: 37.764520, lng: 128.899398, km: 238.0, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Donghae",
        name: "KTX 동해선",
        nameEn: "KTX Donghae Line",
        color: "#0369a1",
        category: "HSR",
        directions: { up: "서울 방면", down: "포항 방면" },
        // KORAIL Donghae KTX runs on the Seoul - Dongdaegu - Pohang axis.
        // This seed models the representative Seoul - Pohang stopping pattern.
        stations: [
          { name: "서울",       lat: 37.554700, lng: 126.970600, km: 0,     dwellSec: 90 },
          { name: "광명",       lat: 37.415900, lng: 126.884900, km: 22.0 },
          { name: "천안아산",   lat: 36.794500, lng: 127.104300, km: 96.0 },
          { name: "오송",       lat: 36.620200, lng: 127.326000, km: 128.0 },
          { name: "대전",       lat: 36.332000, lng: 127.434600, km: 161.0, dwellSec: 60 },
          { name: "김천구미",   lat: 36.115300, lng: 128.173200, km: 225.0 },
          { name: "동대구",     lat: 35.879400, lng: 128.628500, km: 293.0, dwellSec: 60 },
          { name: "포항",       lat: 36.071233, lng: 129.342678, km: 363.0, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Jungang",
        name: "KTX 중앙선",
        nameEn: "KTX Jungang Line",
        color: "#0891b2",
        category: "HSR",
        directions: { up: "서울 방면", down: "부전 방면" },
        // KORAIL KTX-Eum central-line service links Seoul/Cheongnyangni with
        // Bujeon via the Jungang and Donghae corridors. This seed models the
        // representative Seoul - Bujeon stopping pattern.
        stations: [
          { name: "서울",       lat: 37.554700, lng: 126.970600, km: 0,     dwellSec: 90 },
          { name: "청량리",     lat: 37.580596, lng: 127.048257, km: 15.0,  dwellSec: 60 },
          { name: "상봉",       lat: 37.597031, lng: 127.085656, km: 21.0 },
          { name: "양평",       lat: 37.492847, lng: 127.491897, km: 58.0 },
          { name: "서원주",     lat: 37.348530, lng: 127.839395, km: 94.0 },
          { name: "원주",       lat: 37.316379, lng: 127.920730, km: 104.0 },
          { name: "제천",       lat: 37.128700, lng: 128.205400, km: 151.0 },
          { name: "단양",       lat: 36.981712, lng: 128.342873, km: 169.0 },
          { name: "풍기",       lat: 36.872000, lng: 128.524000, km: 196.0 },
          { name: "영주",       lat: 36.810700, lng: 128.624000, km: 207.0 },
          { name: "안동",       lat: 36.569302, lng: 128.678354, km: 237.0 },
          { name: "의성",       lat: 36.352000, lng: 128.697000, km: 264.0 },
          { name: "영천",       lat: 35.966800, lng: 128.938100, km: 311.0 },
          { name: "경주",       lat: 35.798100, lng: 129.138100, km: 333.0 },
          { name: "태화강",     lat: 35.538700, lng: 129.353700, km: 367.0 },
          { name: "부전",       lat: 35.162700, lng: 129.061100, km: 433.0, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Jungbu-Naeryuk",
        name: "KTX 중부내륙선",
        nameEn: "KTX Jungbu Naeryuk Line",
        color: "#0d9488",
        category: "HSR",
        directions: { up: "판교 방면", down: "문경 방면" },
        // KORAIL KTX-Eum service runs from Pangyo over the Gyeonggang corridor,
        // then branches at Bubal onto the Jungbu Naeryuk Line to Mungyeong.
        stations: [
          { name: "판교",       lat: 37.394730, lng: 127.111189, km: 0.1,   dwellSec: 90 },
          { name: "부발",       lat: 37.260402, lng: 127.490328, km: 40.7,  dwellSec: 60 },
          { name: "가남",       lat: 37.197417, lng: 127.535438, km: 50.9 },
          { name: "감곡장호원", lat: 37.127043, lng: 127.635620, km: 63.0 },
          { name: "앙성온천",   lat: 37.092071, lng: 127.786949, km: 77.7 },
          { name: "충주",       lat: 36.975257, lng: 127.908068, km: 96.7,  dwellSec: 60 },
          { name: "살미",       lat: 36.902245, lng: 127.960179, km: 107.2 },
          { name: "수안보온천", lat: 36.841692, lng: 128.005012, km: 115.7 },
          { name: "연풍",       lat: 36.786434, lng: 128.018302, km: 121.9 },
          { name: "문경",       lat: 36.720262, lng: 128.110201, km: 136.0, dwellSec: 90 },
        ],
      },
      {
        id: "SRT-Gyeongbu",
        name: "SRT 경부선",
        nameEn: "SRT Gyeongbu Line",
        color: "#6f2da8",
        category: "HSR",
        directions: { up: "수서 방면", down: "부산 방면" },
        // SR official route: 수서 → 동탄 → 평택지제 → 천안아산 → 오송 → 대전 →
        // 김천(구미) → 서대구 → 동대구 → 신경주 → 울산(통도사) → 부산.
        // The end-to-end distance follows SR's Suseo-Busan 401.2 km service length.
        stations: [
          { name: "수서",       lat: 37.487321, lng: 127.101690, km: 0,     dwellSec: 90 },
          { name: "동탄",       lat: 37.200138, lng: 127.095533, km: 32.4 },
          { name: "평택지제",   lat: 37.018749, lng: 127.069842, km: 56.9 },
          { name: "천안아산",   lat: 36.7945,   lng: 127.1043,   km: 82.0 },
          { name: "오송",       lat: 36.6202,   lng: 127.3260,   km: 114.0 },
          { name: "대전",       lat: 36.3320,   lng: 127.4346,   km: 147.0, dwellSec: 60 },
          { name: "김천구미",   lat: 36.1153,   lng: 128.1732,   km: 211.0 },
          { name: "서대구",     lat: 35.881470, lng: 128.540403, km: 270.0 },
          { name: "동대구",     lat: 35.8794,   lng: 128.6285,   km: 279.0, dwellSec: 60 },
          { name: "신경주",     lat: 35.7975,   lng: 129.1369,   km: 321.0 },
          { name: "울산",       lat: 35.5512,   lng: 129.1330,   km: 350.0 },
          { name: "부산",       lat: 35.1153,   lng: 129.0418,   km: 401.2, dwellSec: 90 },
        ],
      },
      {
        id: "SRT-Honam",
        name: "SRT 호남선",
        nameEn: "SRT Honam Line",
        color: "#8b5cf6",
        category: "HSR",
        directions: { up: "수서 방면", down: "목포 방면" },
        // SR official route: 수서 → 동탄 → 평택지제 → 천안아산 → 오송 → 공주 →
        // 익산 → 정읍 → 광주송정 → 나주 → 목포.
        // The end-to-end distance follows SR's Suseo-Mokpo 354.2 km service length.
        stations: [
          { name: "수서",       lat: 37.487321, lng: 127.101690, km: 0,     dwellSec: 90 },
          { name: "동탄",       lat: 37.200359, lng: 127.095576, km: 32.4 },
          { name: "평택지제",   lat: 37.018753, lng: 127.069867, km: 56.9 },
          { name: "천안아산",   lat: 36.794380, lng: 127.104499, km: 82.0 },
          { name: "오송",       lat: 36.620230, lng: 127.327363, km: 114.0 },
          { name: "공주",       lat: 36.332237, lng: 127.096637, km: 151.0 },
          { name: "익산",       lat: 35.941256, lng: 126.945913, km: 188.0, dwellSec: 60 },
          { name: "정읍",       lat: 35.575773, lng: 126.841917, km: 229.0 },
          { name: "광주송정",   lat: 35.137707, lng: 126.790110, km: 281.0, dwellSec: 60 },
          { name: "나주",       lat: 35.013927, lng: 126.717485, km: 301.0 },
          { name: "목포",       lat: 34.792134, lng: 126.387645, km: 354.2, dwellSec: 90 },
        ],
      },
      {
        id: "SRT-Jeolla",
        name: "SRT 전라선",
        nameEn: "SRT Jeolla Line",
        color: "#a855f7",
        category: "HSR",
        directions: { up: "수서 방면", down: "여수EXPO 방면" },
        // SR official route: 수서 → 동탄 → 평택지제 → 천안아산 → 오송 → 공주 →
        // 익산 → 전주 → 남원 → 곡성 → 구례구 → 순천 → 여천 → 여수EXPO.
        // Iksan-Yeosu EXPO follows the Jeolla Line route distance of 180.4 km.
        stations: [
          { name: "수서",       lat: 37.487321, lng: 127.101690, km: 0,     dwellSec: 90 },
          { name: "동탄",       lat: 37.200359, lng: 127.095576, km: 32.7 },
          { name: "평택지제",   lat: 37.018753, lng: 127.069867, km: 53.5 },
          { name: "천안아산",   lat: 36.794380, lng: 127.104499, km: 80.6 },
          { name: "오송",       lat: 36.620230, lng: 127.327363, km: 109.0 },
          { name: "공주",       lat: 36.332237, lng: 127.096637, km: 148.5 },
          { name: "익산",       lat: 35.941256, lng: 126.945913, km: 194.6, dwellSec: 60 },
          { name: "전주",       lat: 35.850054, lng: 127.162365, km: 220.0 },
          { name: "남원",       lat: 35.411251, lng: 127.361333, km: 272.8 },
          { name: "곡성",       lat: 35.283456, lng: 127.304458, km: 289.4 },
          { name: "구례구",     lat: 35.163478, lng: 127.451967, km: 309.1 },
          { name: "순천",       lat: 34.945811, lng: 127.504060, km: 335.4, dwellSec: 60 },
          { name: "여천",       lat: 34.779462, lng: 127.664450, km: 360.4 },
          { name: "여수EXPO",   lat: 34.755514, lng: 127.749239, km: 369.3, dwellSec: 90 },
        ],
      },
      {
        id: "SRT-Gyeongjeon",
        name: "SRT 경전선",
        nameEn: "SRT Gyeongjeon Line",
        color: "#9333ea",
        category: "HSR",
        directions: { up: "수서 방면", down: "진주 방면" },
        // SR official route: 수서 → 동탄 → 평택지제 → 천안아산 → 오송 → 대전 →
        // 김천(구미) → 서대구 → 동대구 → 밀양 → 진영 → 창원중앙 → 창원 → 마산 → 진주.
        // Dongdaegu-Jinju uses the Gyeongbu Line to Miryang and the Gyeongjeon Line branch.
        stations: [
          { name: "수서",       lat: 37.487321, lng: 127.101690, km: 0,     dwellSec: 90 },
          { name: "동탄",       lat: 37.200138, lng: 127.095533, km: 32.4 },
          { name: "평택지제",   lat: 37.018749, lng: 127.069842, km: 56.9 },
          { name: "천안아산",   lat: 36.794500, lng: 127.104300, km: 82.0 },
          { name: "오송",       lat: 36.620200, lng: 127.326000, km: 114.0 },
          { name: "대전",       lat: 36.332000, lng: 127.434600, km: 147.0, dwellSec: 60 },
          { name: "김천구미",   lat: 36.115300, lng: 128.173200, km: 211.0 },
          { name: "서대구",     lat: 35.881470, lng: 128.540403, km: 270.0 },
          { name: "동대구",     lat: 35.879400, lng: 128.628500, km: 279.0, dwellSec: 60 },
          { name: "밀양",       lat: 35.474851, lng: 128.771418, km: 326.0 },
          { name: "진영",       lat: 35.298748, lng: 128.773550, km: 354.5 },
          { name: "창원중앙",   lat: 35.242572, lng: 128.701605, km: 368.5 },
          { name: "창원",       lat: 35.258125, lng: 128.607034, km: 378.5 },
          { name: "마산",       lat: 35.236364, lng: 128.576728, km: 384.0, dwellSec: 60 },
          { name: "진주",       lat: 35.150120, lng: 128.118349, km: 431.0, dwellSec: 90 },
        ],
      },
      {
        id: "SRT-Donghae",
        name: "SRT 동해선",
        nameEn: "SRT Donghae Line",
        color: "#7c3aed",
        category: "HSR",
        directions: { up: "수서 방면", down: "포항 방면" },
        // SR official route: 수서 → 동탄 → 평택지제 → 천안아산 → 오송 → 대전 →
        // 김천(구미) → 서대구 → 동대구 → 포항.
        // Dongdaegu-Pohang follows the Gyeongbu HSR, Geoncheon connection, and Donghae Line.
        stations: [
          { name: "수서",       lat: 37.487321, lng: 127.101690, km: 0,     dwellSec: 90 },
          { name: "동탄",       lat: 37.200138, lng: 127.095533, km: 32.4 },
          { name: "평택지제",   lat: 37.018749, lng: 127.069842, km: 56.9 },
          { name: "천안아산",   lat: 36.794500, lng: 127.104300, km: 82.0 },
          { name: "오송",       lat: 36.620200, lng: 127.326000, km: 114.0 },
          { name: "대전",       lat: 36.332000, lng: 127.434600, km: 147.0, dwellSec: 60 },
          { name: "김천구미",   lat: 36.115300, lng: 128.173200, km: 211.0 },
          { name: "서대구",     lat: 35.881470, lng: 128.540403, km: 270.0 },
          { name: "동대구",     lat: 35.879400, lng: 128.628500, km: 279.0, dwellSec: 60 },
          { name: "포항",       lat: 36.071233, lng: 129.342678, km: 363.0, dwellSec: 90 },
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
      {
        id: "Busan-Metro-2",
        name: "부산 도시철도 2호선",
        nameEn: "Busan Metro Line 2",
        color: "#81BF48",
        category: "捷運",
        directions: { up: "상행 (장산 방면)", down: "하행 (양산 방면)" },
        // 부산 2호선: Jangsan→Yangsan all-stop route; OSM relation 2194999
        // provides complete stop members for the current 43-station service.
        stations: [
          { name: "장산", lat: 35.1694514, lng: 129.1759213, km: 0.478, dwellSec: 30 },
          { name: "중동", lat: 35.1666518, lng: 129.1678104, km: 1.315 },
          { name: "해운대", lat: 35.1636846, lng: 129.1588087, km: 2.223 },
          { name: "동백", lat: 35.1612770, lng: 129.1480904, km: 3.339 },
          { name: "벡스코", lat: 35.1688889, lng: 129.1387511, km: 4.556 },
          { name: "센텀시티", lat: 35.1686251, lng: 129.1311985, km: 5.392 },
          { name: "민락", lat: 35.1673950, lng: 129.1217190, km: 6.409 },
          { name: "수영", lat: 35.1654182, lng: 129.1146714, km: 7.284, dwellSec: 30 },
          { name: "광안", lat: 35.1579160, lng: 129.1131700, km: 8.13 },
          { name: "금련산", lat: 35.1497560, lng: 129.1109700, km: 9.059 },
          { name: "남천", lat: 35.1421344, lng: 129.1078416, km: 9.967 },
          { name: "경성대·부경대", lat: 35.1375580, lng: 129.1005310, km: 10.812 },
          { name: "대연", lat: 35.1351480, lng: 129.0921720, km: 11.627 },
          { name: "못골", lat: 35.1347580, lng: 129.0847830, km: 12.301 },
          { name: "지게골", lat: 35.1356680, lng: 129.0742240, km: 13.336 },
          { name: "문현", lat: 35.1391392, lng: 129.0673312, km: 14.133 },
          { name: "국제금융센터·부산은행", lat: 35.1457278, lng: 129.0667134, km: 14.871 },
          { name: "전포", lat: 35.1528193, lng: 129.0653641, km: 15.68 },
          { name: "서면", lat: 35.1577084, lng: 129.0591028, km: 16.769, dwellSec: 30 },
          { name: "부암", lat: 35.1574390, lng: 129.0505061, km: 17.552 },
          { name: "가야", lat: 35.1558284, lng: 129.0426874, km: 18.286 },
          { name: "동의대", lat: 35.1539803, lng: 129.0321386, km: 19.266 },
          { name: "개금", lat: 35.1532536, lng: 129.0204602, km: 20.336 },
          { name: "냉정", lat: 35.1512851, lng: 129.0124257, km: 21.112 },
          { name: "주례", lat: 35.1505040, lng: 129.0031500, km: 21.96 },
          { name: "감전", lat: 35.1557054, lng: 128.9908801, km: 23.273 },
          { name: "사상", lat: 35.1625081, lng: 128.9845090, km: 24.227, dwellSec: 30 },
          { name: "덕포", lat: 35.1738665, lng: 128.9839737, km: 25.555 },
          { name: "모덕", lat: 35.1803610, lng: 128.9856210, km: 26.292 },
          { name: "모라", lat: 35.1892988, lng: 128.9884422, km: 27.322 },
          { name: "구남", lat: 35.1969455, lng: 128.9950174, km: 28.408 },
          { name: "구명", lat: 35.2028827, lng: 128.9996216, km: 29.19 },
          { name: "덕천", lat: 35.2107798, lng: 129.0050608, km: 30.337, dwellSec: 30 },
          { name: "수정", lat: 35.2233039, lng: 129.0091715, km: 31.857 },
          { name: "화명", lat: 35.2352534, lng: 129.0138007, km: 33.27 },
          { name: "율리", lat: 35.2464762, lng: 129.0128975, km: 34.531 },
          { name: "동원", lat: 35.2586149, lng: 129.0124334, km: 35.966 },
          { name: "금곡", lat: 35.2673839, lng: 129.0168673, km: 37.022 },
          { name: "호포", lat: 35.2810803, lng: 129.0174697, km: 38.581 },
          { name: "증산", lat: 35.3083224, lng: 129.0102327, km: 42.046 },
          { name: "부산대양산캠퍼스", lat: 35.3168773, lng: 129.0139796, km: 43.057 },
          { name: "남양산", lat: 35.3254040, lng: 129.0193639, km: 44.158 },
          { name: "양산", lat: 35.3386950, lng: 129.0263995, km: 45.801, dwellSec: 30 },
        ],
      },
      {
        id: "Busan-Metro-3",
        name: "부산 도시철도 3호선",
        nameEn: "Busan Metro Line 3",
        color: "#BB8C00",
        category: "捷運",
        directions: { up: "상행 (수영 방면)", down: "하행 (대저 방면)" },
        // 부산 3호선: Suyeong→Daejeo all-stop route; OSM relation 2195014
        // provides complete stop members for the current 17-station service.
        stations: [
          { name: "수영", lat: 35.1654182, lng: 129.1146714, km: 0, dwellSec: 30 },
          { name: "망미", lat: 35.1717331, lng: 129.1075159, km: 1.065 },
          { name: "배산", lat: 35.1734626, lng: 129.0957491, km: 2.159 },
          { name: "물만골", lat: 35.1766388, lng: 129.0858331, km: 3.214 },
          { name: "연산", lat: 35.1859918, lng: 129.0815013, km: 4.333, dwellSec: 30 },
          { name: "거제", lat: 35.1885438, lng: 129.0739981, km: 5.073 },
          { name: "종합운동장", lat: 35.1914648, lng: 129.0674868, km: 5.767 },
          { name: "사직", lat: 35.1990904, lng: 129.0650666, km: 6.643 },
          { name: "미남", lat: 35.2065443, lng: 129.0687047, km: 7.563, dwellSec: 30 },
          { name: "만덕", lat: 35.2129876, lng: 129.0364611, km: 10.774 },
          { name: "남산정", lat: 35.2133254, lng: 129.0239260, km: 11.925 },
          { name: "숙등", lat: 35.2119767, lng: 129.0127544, km: 12.958 },
          { name: "덕천", lat: 35.2102272, lng: 129.0057948, km: 13.62, dwellSec: 30 },
          { name: "구포", lat: 35.2067105, lng: 128.9963297, km: 14.65 },
          { name: "강서구청", lat: 35.2112369, lng: 128.9819597, km: 16.204 },
          { name: "체육공원", lat: 35.2125086, lng: 128.9693851, km: 17.355 },
          { name: "대저", lat: 35.2134159, lng: 128.9607978, km: 18.142, dwellSec: 30 },
        ],
      },
      {
        id: "Busan-Metro-4",
        name: "부산 도시철도 4호선",
        nameEn: "Busan Metro Line 4",
        color: "#217DCB",
        category: "捷運",
        directions: { up: "상행 (미남 방면)", down: "하행 (안평 방면)" },
        // 부산 4호선: rubber-tyred light metro from Minam to Anpyeong; OSM
        // relation 2205952 provides complete stop members for 14 stations.
        stations: [
          { name: "미남", lat: 35.2065213, lng: 129.0687890, km: 0, dwellSec: 30 },
          { name: "동래", lat: 35.2047222, lng: 129.0772975, km: 0.926 },
          { name: "수안", lat: 35.2017248, lng: 129.0838787, km: 1.611 },
          { name: "낙민", lat: 35.2001883, lng: 129.0908233, km: 2.267 },
          { name: "충렬사", lat: 35.1997237, lng: 129.0975688, km: 2.979 },
          { name: "명장", lat: 35.2053788, lng: 129.1017618, km: 3.722 },
          { name: "서동", lat: 35.2130228, lng: 129.1075237, km: 4.765 },
          { name: "금사", lat: 35.2157922, lng: 129.1152377, km: 5.552 },
          { name: "반여농산물시장", lat: 35.2177692, lng: 129.1238374, km: 6.368 },
          { name: "석대", lat: 35.2180644, lng: 129.1368574, km: 7.567 },
          { name: "영산대", lat: 35.2256484, lng: 129.1460921, km: 8.934 },
          { name: "윗반송", lat: 35.2325216, lng: 129.1539359, km: 10.056 },
          { name: "고촌", lat: 35.2361256, lng: 129.1604700, km: 10.795 },
          { name: "안평", lat: 35.2373765, lng: 129.1717326, km: 11.856, dwellSec: 30 },
        ],
      },
      {
        id: "Busan-Gimhae-LRT",
        name: "부산김해경전철",
        nameEn: "Busan-Gimhae Light Rail Transit",
        color: "#8652A1",
        category: "LRT",
        directions: { up: "상행 (사상 방면)", down: "하행 (가야대 방면)" },
        // BGL's official route map lists Sasang→Kaya University station order.
        // OSM relation 2204611 provides one-direction stop members along that corridor.
        stations: [
          { name: "사상", lat: 35.1622969, lng: 128.9859362, km: 0.205, dwellSec: 30 },
          { name: "괘법르네시떼", lat: 35.1632779, lng: 128.9777255, km: 0.962 },
          { name: "서부산유통지구", lat: 35.1663971, lng: 128.9549558, km: 3.226 },
          { name: "공항", lat: 35.1719342, lng: 128.9485611, km: 4.134, dwellSec: 30 },
          { name: "덕두", lat: 35.1819682, lng: 128.9541369, km: 5.454 },
          { name: "등구", lat: 35.1962280, lng: 128.9635275, km: 7.318 },
          { name: "대저", lat: 35.2130680, lng: 128.9605168, km: 9.378, dwellSec: 30 },
          { name: "평강", lat: 35.2140428, lng: 128.9506178, km: 10.284 },
          { name: "대사", lat: 35.2177127, lng: 128.9382966, km: 11.479 },
          { name: "불암", lat: 35.2222403, lng: 128.9278224, km: 12.563 },
          { name: "지내", lat: 35.2276363, lng: 128.9237133, km: 13.271 },
          { name: "김해대학", lat: 35.2289874, lng: 128.9155819, km: 14.063 },
          { name: "인제대", lat: 35.2281017, lng: 128.9017358, km: 15.325 },
          { name: "김해시청", lat: 35.2270991, lng: 128.8903193, km: 16.368 },
          { name: "부원", lat: 35.2264726, lng: 128.8838005, km: 16.964 },
          { name: "봉황", lat: 35.2273503, lng: 128.8742550, km: 17.934 },
          { name: "수로왕릉", lat: 35.2329251, lng: 128.8720656, km: 18.589 },
          { name: "박물관", lat: 35.2401301, lng: 128.8718405, km: 19.394 },
          { name: "연지공원", lat: 35.2496565, lng: 128.8692227, km: 20.506 },
          { name: "장신대", lat: 35.2595560, lng: 128.8671904, km: 21.694 },
          { name: "가야대", lat: 35.2668321, lng: 128.8649754, km: 22.560, dwellSec: 30 },
        ],
      },
    ],
    trainTemplates: [
      { line: "Seoul-Metro-1",  type: "급행",   badge: "급행",   badgeColor: "#1d4ed8", speed: 60, interval: 12, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Seoul-Metro-1",  type: "완행",   badge: "완",     badgeColor: "#0052a4", speed: 40, interval: 4,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Seoul-Metro-2",  type: "순환",   badge: "2",      badgeColor: "#00a84d", speed: 35, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-3",  type: "3호선",  badge: "3",      badgeColor: "#ED6C00", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-4",  type: "4호선",  badge: "4",      badgeColor: "#009BCE", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-5",  type: "5호선",  badge: "5",      badgeColor: "#996CAC", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-6",  type: "6호선",  badge: "6",      badgeColor: "#7C4932", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-7",  type: "7호선",  badge: "7",      badgeColor: "#747F00", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-8",  type: "8호선",  badge: "8",      badgeColor: "#E6186C", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-9",  type: "9호선",  badge: "9",      badgeColor: "#BDB092", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-9",  type: "Line 9 Fast",  badge: "9F", badgeColor: "#BDB092", speed: 40, interval: 22, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25, stationIdxStart: 0, stationIdxEnd: 21 },
      { line: "Seoul-Metro-9",  type: "Line 9 Slow",  badge: "9S", badgeColor: "#BDB092", speed: 40, interval: 24, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25, stationIdxStart: 0, stationIdxEnd: 21 },
      { line: "Ui-LRT",         type: "우이신설선", badge: "UI", badgeColor: "#BACC50", speed: 70, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Sillim-LRT",     type: "신림선", badge: "SL",     badgeColor: "#6789CA", speed: 70, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Uijeongbu-LRT",  type: "U Line", badge: "U",      badgeColor: "#F0831E", speed: 80, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Yongin-EverLine", type: "EverLine", badge: "E",   badgeColor: "#44A436", speed: 80, interval: 6,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Shinbundang",    type: "신분당선", badge: "DX",    badgeColor: "#B81B30", speed: 80, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Suin-Bundang",   type: "수인분당선", badge: "SB",  badgeColor: "#ECA300", speed: 80, interval: 6,  accel: 0.90, decel: 1.00, aLat: 0.90, dwellSec: 25 },
      { line: "Gyeongui-Jungang", type: "경의중앙선", badge: "GJ", badgeColor: "#6AC2B3", speed: 85, interval: 10, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Gyeongui-Jungang", type: "Gyeongui short-turn", badge: "GJ", badgeColor: "#6AC2B3", speed: 85, interval: 20, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25, stationIdxStart: 0, stationIdxEnd: 23 },
      { line: "Gyeongchun",     type: "경춘선", badge: "GC",     badgeColor: "#007A62", speed: 85, interval: 15, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Gyeongchun",     type: "Gyeongchun Sangbong", badge: "GC", badgeColor: "#007A62", speed: 85, interval: 20, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25, stationIdxStart: 0, stationIdxEnd: 3 },
      { line: "Gyeongchun",     type: "Gyeongchun Gwangwoon", badge: "GC", badgeColor: "#007A62", speed: 85, interval: 22, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25, stationIdxStart: 0, stationIdxEnd: 5 },
      { line: "Gyeonggang",     type: "경강선", badge: "GG",     badgeColor: "#0B318F", speed: 85, interval: 15, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Seohae",         type: "서해선", badge: "SH",     badgeColor: "#5EAC41", speed: 85, interval: 15, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Incheon-Metro-1", type: "1호선", badge: "I1",     badgeColor: "#B4C7E7", speed: 40, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Incheon-Metro-2", type: "2호선", badge: "I2",     badgeColor: "#F4A462", speed: 70, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "AREX",           type: "AREX",   badge: "A",      badgeColor: "#0079ac", speed: 90, interval: 8,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 30 },
      { line: "Gimpo-Goldline", type: "골드라인", badge: "G",    badgeColor: "#ad8605", speed: 80, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Daegu-Metro-1",  type: "1호선",  badge: "1",      badgeColor: "#EF5E37", speed: 40, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Daegu-Metro-2",  type: "2호선",  badge: "2",      badgeColor: "#33AA46", speed: 40, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Daegu-Metro-3",  type: "3호선",  badge: "3",      badgeColor: "#FDA208", speed: 70, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.90, dwellSec: 25 },
      { line: "Daejeon-Metro-1", type: "1호선", badge: "D1",     badgeColor: "#007448", speed: 40, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Gwangju-Metro-1", type: "1호선", badge: "G1",     badgeColor: "#009088", speed: 40, interval: 7,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "ITX-Cheongchun", type: "ITX-청춘", badge: "ITX",  badgeColor: "#2563eb", speed: 180, interval: 60, accel: 0.70, decel: 0.75, aLat: 0.85, dwellSec: 45 },
      { line: "KTX-Gyeongbu",   type: "KTX",    badge: "KTX",    badgeColor: "#0c4ca3", speed: 250, interval: 20, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Gyeongbu",   type: "KTX-산천", badge: "산천", badgeColor: "#dc2626", speed: 230, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Honam",      type: "KTX",    badge: "KTX",    badgeColor: "#2563eb", speed: 250, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Honam",      type: "KTX-산천", badge: "산천", badgeColor: "#dc2626", speed: 230, interval: 40, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Jeolla",     type: "KTX",    badge: "KTX",    badgeColor: "#0ea5e9", speed: 250, interval: 40, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Jeolla",     type: "KTX-산천", badge: "산천", badgeColor: "#dc2626", speed: 230, interval: 50, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Gyeongjeon", type: "KTX",    badge: "KTX",    badgeColor: "#0284c7", speed: 250, interval: 50, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Gyeongjeon", type: "KTX-산천", badge: "산천", badgeColor: "#dc2626", speed: 230, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Gangneung",  type: "KTX-이음", badge: "이음", badgeColor: "#0f766e", speed: 230, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Donghae",    type: "KTX",    badge: "KTX",    badgeColor: "#0369a1", speed: 250, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Donghae",    type: "KTX-산천", badge: "산천", badgeColor: "#dc2626", speed: 230, interval: 70, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Jungang",    type: "KTX-이음", badge: "이음", badgeColor: "#0891b2", speed: 230, interval: 80, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Jungbu-Naeryuk", type: "KTX-이음", badge: "이음", badgeColor: "#0d9488", speed: 230, interval: 120, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "SRT-Gyeongbu",   type: "SRT",    badge: "SRT",    badgeColor: "#6f2da8", speed: 250, interval: 20, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "SRT-Honam",      type: "SRT",    badge: "SRT",    badgeColor: "#8b5cf6", speed: 250, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "SRT-Jeolla",     type: "SRT",    badge: "SRT",    badgeColor: "#a855f7", speed: 240, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "SRT-Gyeongjeon", type: "SRT",    badge: "SRT",    badgeColor: "#9333ea", speed: 240, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "SRT-Donghae",    type: "SRT",    badge: "SRT",    badgeColor: "#7c3aed", speed: 240, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Busan-Metro-1",  type: "1호선",  badge: "1",      badgeColor: "#f06a00", speed: 35, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Busan-Metro-2",  type: "2호선",  badge: "2",      badgeColor: "#81BF48", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Busan-Metro-3",  type: "3호선",  badge: "3",      badgeColor: "#BB8C00", speed: 40, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Busan-Metro-4",  type: "4호선",  badge: "4",      badgeColor: "#217DCB", speed: 55, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Busan-Gimhae-LRT", type: "BGL", badge: "BGL",     badgeColor: "#8652A1", speed: 80, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
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
        id: "SG-MRT-North-East",
        name: "North East Line",
        nameEn: "MRT North East Line",
        color: "#9900aa",
        category: "捷運",
        directions: { up: "Northbound (to Punggol Coast)", down: "Southbound (to HarbourFront)" },
        // North East Line: HarbourFront↔Punggol Coast 22 km / 17 stations.
        stations: [
          { name: "HarbourFront",         lat: 1.2653, lng: 103.8214, km: 0,    dwellSec: 30 },
          { name: "Outram Park",         lat: 1.2803, lng: 103.8395, km: 2.8, dwellSec: 30 },
          { name: "Chinatown",           lat: 1.2844, lng: 103.8436, km: 3.5 },
          { name: "Clarke Quay",         lat: 1.2889, lng: 103.8466, km: 4.2 },
          { name: "Dhoby Ghaut",         lat: 1.2990, lng: 103.8453, km: 5.4, dwellSec: 30 },
          { name: "Little India",        lat: 1.3068, lng: 103.8496, km: 6.5, dwellSec: 30 },
          { name: "Farrer Park",         lat: 1.3123, lng: 103.8543, km: 7.4 },
          { name: "Boon Keng",           lat: 1.3194, lng: 103.8615, km: 8.6 },
          { name: "Potong Pasir",        lat: 1.3314, lng: 103.8691, km: 10.3 },
          { name: "Woodleigh",           lat: 1.3392, lng: 103.8708, km: 11.3 },
          { name: "Serangoon",           lat: 1.3499, lng: 103.8731, km: 12.6, dwellSec: 30 },
          { name: "Kovan",               lat: 1.3602, lng: 103.8850, km: 14.5 },
          { name: "Hougang",             lat: 1.3713, lng: 103.8922, km: 16.1 },
          { name: "Buangkok",            lat: 1.3829, lng: 103.8931, km: 17.5 },
          { name: "Sengkang",            lat: 1.3917, lng: 103.8955, km: 18.6, dwellSec: 30 },
          { name: "Punggol",             lat: 1.4052, lng: 103.9023, km: 20.4, dwellSec: 30 },
          { name: "Punggol Coast",       lat: 1.4158, lng: 103.9100, km: 22.0, dwellSec: 30 },
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
      {
        id: "SG-MRT-Downtown",
        name: "Downtown Line",
        nameEn: "MRT Downtown Line",
        color: "#005ec4",
        category: "?琿?",
        directions: { up: "Eastbound (to Expo)", down: "Westbound (to Bukit Panjang)" },
        // Downtown Line: Bukit Panjang to Expo 42 km / 35 operational stations.
        // DTL3e to Xilin / Sungei Bedok remains a future extension pass.
        stations: [
          { name: "Bukit Panjang",       lat: 1.3787, lng: 103.7620, km: 0.0, dwellSec: 30 },
          { name: "Cashew",              lat: 1.3694, lng: 103.7647, km: 1.2 },
          { name: "Hillview",            lat: 1.3623, lng: 103.7674, km: 2.2 },
          { name: "Hume",                lat: 1.3545, lng: 103.7693, km: 3.2 },
          { name: "Beauty World",        lat: 1.3412, lng: 103.7759, km: 5.0 },
          { name: "King Albert Park",    lat: 1.3357, lng: 103.7838, km: 6.3 },
          { name: "Sixth Avenue",        lat: 1.3309, lng: 103.7973, km: 8.0 },
          { name: "Tan Kah Kee",         lat: 1.3262, lng: 103.8070, km: 9.4 },
          { name: "Botanic Gardens",     lat: 1.3226, lng: 103.8162, km: 10.6, dwellSec: 30 },
          { name: "Stevens",             lat: 1.3202, lng: 103.8259, km: 11.9, dwellSec: 30 },
          { name: "Newton",              lat: 1.3137, lng: 103.8381, km: 13.6, dwellSec: 30 },
          { name: "Little India",        lat: 1.3066, lng: 103.8492, km: 15.3, dwellSec: 30 },
          { name: "Rochor",              lat: 1.3040, lng: 103.8526, km: 15.8 },
          { name: "Bugis",               lat: 1.2998, lng: 103.8568, km: 16.6, dwellSec: 30 },
          { name: "Promenade",           lat: 1.2926, lng: 103.8610, km: 17.6, dwellSec: 30 },
          { name: "Bayfront",            lat: 1.2827, lng: 103.8598, km: 18.9, dwellSec: 30 },
          { name: "Downtown",            lat: 1.2794, lng: 103.8528, km: 19.8 },
          { name: "Telok Ayer",          lat: 1.2823, lng: 103.8483, km: 20.5 },
          { name: "Chinatown",           lat: 1.2842, lng: 103.8451, km: 20.9, dwellSec: 30 },
          { name: "Fort Canning",        lat: 1.2926, lng: 103.8443, km: 22.0 },
          { name: "Bencoolen",           lat: 1.2990, lng: 103.8503, km: 23.1 },
          { name: "Jalan Besar",         lat: 1.3055, lng: 103.8554, km: 24.1 },
          { name: "Bendemeer",           lat: 1.3137, lng: 103.8626, km: 25.5 },
          { name: "Geylang Bahru",       lat: 1.3216, lng: 103.8720, km: 27.1 },
          { name: "Mattar",              lat: 1.3269, lng: 103.8833, km: 28.6 },
          { name: "MacPherson",          lat: 1.3264, lng: 103.8897, km: 29.4, dwellSec: 30 },
          { name: "Ubi",                 lat: 1.3301, lng: 103.8993, km: 30.7 },
          { name: "Kaki Bukit",          lat: 1.3351, lng: 103.9086, km: 32.0 },
          { name: "Bedok North",         lat: 1.3347, lng: 103.9180, km: 33.2 },
          { name: "Bedok Reservoir",     lat: 1.3368, lng: 103.9321, km: 35.0 },
          { name: "Tampines West",       lat: 1.3454, lng: 103.9383, km: 36.3 },
          { name: "Tampines",            lat: 1.3553, lng: 103.9430, km: 37.7, dwellSec: 30 },
          { name: "Tampines East",       lat: 1.3563, lng: 103.9550, km: 39.2 },
          { name: "Upper Changi",        lat: 1.3416, lng: 103.9615, km: 41.2 },
          { name: "Expo",                lat: 1.3356, lng: 103.9622, km: 42.0, dwellSec: 30 },
        ],
      },
      {
        id: "SG-MRT-Thomson-East-Coast",
        name: "Thomson-East Coast Line",
        nameEn: "MRT Thomson-East Coast Line",
        color: "#734538",
        category: "捷運",
        directions: { up: "Northbound (to Woodlands North)", down: "Eastbound (to Bayshore)" },
        // Thomson-East Coast Line: Woodlands North to Bayshore current segment,
        // 40.6 km / 27 operational stations. TEL5 to Bedok South and Sungei
        // Bedok remains a future extension pass until it opens.
        stations: [
          { name: "Woodlands North",     lat: 1.4485, lng: 103.7858, km: 0.0,  dwellSec: 30 },
          { name: "Woodlands",           lat: 1.4363, lng: 103.7881, km: 1.5,  dwellSec: 30 },
          { name: "Woodlands South",     lat: 1.4274, lng: 103.7938, km: 2.8 },
          { name: "Springleaf",          lat: 1.3982, lng: 103.8181, km: 7.5 },
          { name: "Lentor",              lat: 1.3849, lng: 103.8366, km: 10.3 },
          { name: "Mayflower",           lat: 1.3725, lng: 103.8369, km: 11.9 },
          { name: "Bright Hill",         lat: 1.3637, lng: 103.8335, km: 13.0 },
          { name: "Upper Thomson",       lat: 1.3546, lng: 103.8327, km: 14.1 },
          { name: "Caldecott",           lat: 1.3376, lng: 103.8402, km: 16.4, dwellSec: 30 },
          { name: "Stevens",             lat: 1.3195, lng: 103.8256, km: 19.3, dwellSec: 30 },
          { name: "Napier",              lat: 1.3068, lng: 103.8189, km: 21.1 },
          { name: "Orchard Boulevard",   lat: 1.3026, lng: 103.8240, km: 21.9 },
          { name: "Orchard",             lat: 1.3030, lng: 103.8314, km: 22.8, dwellSec: 30 },
          { name: "Great World",         lat: 1.2946, lng: 103.8336, km: 23.9 },
          { name: "Havelock",            lat: 1.2881, lng: 103.8337, km: 24.7 },
          { name: "Outram Park",         lat: 1.2816, lng: 103.8395, km: 25.8, dwellSec: 30 },
          { name: "Maxwell",             lat: 1.2804, lng: 103.8437, km: 26.3 },
          { name: "Shenton Way",         lat: 1.2777, lng: 103.8505, km: 27.2 },
          { name: "Marina Bay",          lat: 1.2746, lng: 103.8556, km: 27.9, dwellSec: 30 },
          { name: "Gardens by the Bay",  lat: 1.2794, lng: 103.8680, km: 29.6 },
          { name: "Tanjong Rhu",         lat: 1.2972, lng: 103.8735, km: 31.9 },
          { name: "Katong Park",         lat: 1.2980, lng: 103.8864, km: 33.5 },
          { name: "Tanjong Katong",      lat: 1.2992, lng: 103.8974, km: 34.8 },
          { name: "Marine Parade",       lat: 1.3032, lng: 103.9056, km: 36.0 },
          { name: "Marine Terrace",      lat: 1.3071, lng: 103.9159, km: 37.3 },
          { name: "Siglap",              lat: 1.3099, lng: 103.9294, km: 39.0 },
          { name: "Bayshore",            lat: 1.3130, lng: 103.9418, km: 40.6, dwellSec: 30 },
        ],
      },
      {
        id: "SG-LRT-Bukit-Panjang",
        name: "Bukit Panjang LRT",
        nameEn: "Bukit Panjang LRT",
        color: "#748477",
        category: "LRT",
        directions: { up: "Counter-clockwise loop", down: "Clockwise loop" },
        // Bukit Panjang LRT: current 13-station automated guideway network.
        // This seed models the OSM clockwise loop relation as one runnable
        // service pattern; repeated stem stations are intentional.
        stations: [
          { name: "Choa Chu Kang",  lat: 1.384710, lng: 103.744577, km: 0.0,  dwellSec: 30 },
          { name: "South View",     lat: 1.380289, lng: 103.745290, km: 0.7 },
          { name: "Keat Hong",      lat: 1.378613, lng: 103.749044, km: 1.2 },
          { name: "Teck Whye",      lat: 1.376680, lng: 103.753633, km: 1.8 },
          { name: "Phoenix",        lat: 1.378620, lng: 103.757991, km: 2.4 },
          { name: "Bukit Panjang",  lat: 1.377940, lng: 103.763081, km: 3.0,  dwellSec: 30 },
          { name: "Senja",          lat: 1.382676, lng: 103.762366, km: 3.7 },
          { name: "Jelapang",       lat: 1.386706, lng: 103.764498, km: 4.3 },
          { name: "Segar",          lat: 1.387803, lng: 103.769586, km: 4.9 },
          { name: "Fajar",          lat: 1.384586, lng: 103.770891, km: 5.5 },
          { name: "Bangkit",        lat: 1.380037, lng: 103.772667, km: 6.1 },
          { name: "Pending",        lat: 1.376142, lng: 103.771288, km: 6.7 },
          { name: "Petir",          lat: 1.377753, lng: 103.766621, km: 7.3 },
          { name: "Bukit Panjang",  lat: 1.377895, lng: 103.763098, km: 7.9,  dwellSec: 30 },
          { name: "Phoenix",        lat: 1.378598, lng: 103.757998, km: 8.5 },
          { name: "Teck Whye",      lat: 1.376651, lng: 103.753635, km: 9.1 },
          { name: "Keat Hong",      lat: 1.378578, lng: 103.749034, km: 9.7 },
          { name: "South View",     lat: 1.380263, lng: 103.745279, km: 10.2 },
          { name: "Choa Chu Kang",  lat: 1.384708, lng: 103.744501, km: 10.9, dwellSec: 30 },
        ],
      },
      {
        id: "SG-LRT-Sengkang",
        name: "Sengkang LRT",
        nameEn: "Sengkang LRT",
        color: "#748477",
        category: "LRT",
        directions: { up: "Clockwise loop", down: "Anti-clockwise loop" },
        // Sengkang LRT: current 14-station automated guideway network.
        // This seed models the east loop followed by the west loop as one
        // explicit station-order pattern; repeated Sengkang anchors are
        // intentional until a branch/loop runtime model exists.
        stations: [
          { name: "Sengkang",     lat: 1.391512, lng: 103.895303, km: 0.0, dwellSec: 30 },
          { name: "Compassvale",  lat: 1.394563, lng: 103.900452, km: 0.7 },
          { name: "Rumbia",       lat: 1.391505, lng: 103.906030, km: 1.4 },
          { name: "Bakau",        lat: 1.388080, lng: 103.905388, km: 1.8 },
          { name: "Kangkar",      lat: 1.383926, lng: 103.902250, km: 2.3 },
          { name: "Ranggung",     lat: 1.384022, lng: 103.897330, km: 2.9 },
          { name: "Sengkang",     lat: 1.391743, lng: 103.895509, km: 3.8, dwellSec: 30 },
          { name: "Renjong",      lat: 1.386678, lng: 103.890518, km: 4.6 },
          { name: "Tongkang",     lat: 1.389365, lng: 103.885803, km: 5.2 },
          { name: "Layar",        lat: 1.392072, lng: 103.880010, km: 5.9 },
          { name: "Fernvale",     lat: 1.391897, lng: 103.876265, km: 6.3 },
          { name: "Thanggam",     lat: 1.397354, lng: 103.875585, km: 6.9 },
          { name: "Kupang",       lat: 1.398281, lng: 103.881247, km: 7.5 },
          { name: "Farmway",      lat: 1.397246, lng: 103.889227, km: 8.4 },
          { name: "Cheng Lim",    lat: 1.396356, lng: 103.893804, km: 9.0 },
          { name: "Sengkang",     lat: 1.391743, lng: 103.895509, km: 9.5, dwellSec: 30 },
        ],
      },
      {
        id: "SG-LRT-Punggol",
        name: "Punggol LRT",
        nameEn: "Punggol LRT",
        color: "#748477",
        category: "LRT",
        directions: { up: "Clockwise loop", down: "Anti-clockwise loop" },
        // Punggol LRT: current automated guideway network with Teck Lee open.
        // This seed models the east loop followed by the west loop as one
        // explicit station-order pattern; repeated Punggol anchors are
        // intentional until a branch/loop runtime model exists.
        stations: [
          { name: "Punggol",       lat: 1.405277, lng: 103.902307, km: 0.0, dwellSec: 30 },
          { name: "Damai",         lat: 1.405273, lng: 103.908651, km: 0.7 },
          { name: "Oasis",         lat: 1.402310, lng: 103.912764, km: 1.3 },
          { name: "Kadaloor",      lat: 1.399585, lng: 103.916537, km: 1.8 },
          { name: "Riviera",       lat: 1.394503, lng: 103.916188, km: 2.4 },
          { name: "Coral Edge",    lat: 1.393822, lng: 103.912633, km: 2.8 },
          { name: "Meridian",      lat: 1.396910, lng: 103.908856, km: 3.3 },
          { name: "Cove",          lat: 1.399428, lng: 103.905743, km: 3.7 },
          { name: "Punggol",       lat: 1.405090, lng: 103.902506, km: 4.5, dwellSec: 30 },
          { name: "Soo Teck",      lat: 1.405336, lng: 103.897208, km: 5.1 },
          { name: "Sumang",        lat: 1.408506, lng: 103.898539, km: 5.4 },
          { name: "Nibong",        lat: 1.411907, lng: 103.900331, km: 5.9 },
          { name: "Samudera",      lat: 1.415955, lng: 103.902146, km: 6.4 },
          { name: "Punggol Point", lat: 1.416887, lng: 103.906679, km: 6.9 },
          { name: "Teck Lee",      lat: 1.412740, lng: 103.906605, km: 7.3 },
          { name: "Sam Kee",       lat: 1.409702, lng: 103.904929, km: 7.7 },
          { name: "Punggol",       lat: 1.405090, lng: 103.902506, km: 8.3, dwellSec: 30 },
        ],
      },
    ],
    trainTemplates: [
      { line: "SG-MRT-North-South",  type: "NSL",  badge: "NSL", badgeColor: "#d42e12", speed: 38, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "SG-MRT-East-West",    type: "EWL",  badge: "EWL", badgeColor: "#009645", speed: 40, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "SG-MRT-North-East",   type: "NEL",  badge: "NEL", badgeColor: "#9900aa", speed: 38, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "SG-MRT-Circle",       type: "CCL",  badge: "CCL", badgeColor: "#ff9900", speed: 35, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "SG-MRT-Downtown",     type: "DTL",  badge: "DTL", badgeColor: "#005ec4", speed: 35, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "SG-MRT-Thomson-East-Coast", type: "TEL", badge: "TEL", badgeColor: "#734538", speed: 35, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "SG-LRT-Bukit-Panjang", type: "BPLRT", badge: "BPLRT", badgeColor: "#748477", speed: 35, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 20 },
      { line: "SG-LRT-Sengkang", type: "SKLRT", badge: "SKLRT", badgeColor: "#748477", speed: 35, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 20 },
      { line: "SG-LRT-Punggol", type: "PGLRT", badge: "PGLRT", badgeColor: "#748477", speed: 35, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 20 },
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
        id: "KL-LRT-Ampang",
        name: "LRT Laluan Ampang",
        nameEn: "Ampang LRT Line",
        color: "#e57200",
        category: "LRT",
        directions: { up: "Sentul Timur bound", down: "Ampang bound" },
        // LRT Ampang Line: Sentul Timur to Ampang, 18 stations.
        // Shared trunk duplication with Sri Petaling is intentional until a
        // branch-aware route model exists.
        stations: [
          { name: "Sentul Timur",  lat: 3.185832, lng: 101.695327, km: 0.0,  dwellSec: 30 },
          { name: "Sentul",        lat: 3.178586, lng: 101.695506, km: 0.8 },
          { name: "Titiwangsa",    lat: 3.173587, lng: 101.695253, km: 1.4,  dwellSec: 30 },
          { name: "PWTC",          lat: 3.166563, lng: 101.693594, km: 2.2 },
          { name: "Sultan Ismail", lat: 3.161185, lng: 101.694127, km: 2.8 },
          { name: "Bandaraya",     lat: 3.155547, lng: 101.694446, km: 3.4 },
          { name: "Masjid Jamek",  lat: 3.149468, lng: 101.696403, km: 4.1,  dwellSec: 30 },
          { name: "Plaza Rakyat",  lat: 3.144554, lng: 101.701792, km: 4.9 },
          { name: "Hang Tuah",     lat: 3.139873, lng: 101.706158, km: 5.6,  dwellSec: 30 },
          { name: "Pudu",          lat: 3.134948, lng: 101.712051, km: 6.5 },
          { name: "Chan Sow Lin",  lat: 3.127748, lng: 101.715657, km: 7.4,  dwellSec: 30 },
          { name: "Miharja",       lat: 3.120962, lng: 101.717869, km: 8.2 },
          { name: "Maluri",        lat: 3.123292, lng: 101.726934, km: 9.2,  dwellSec: 30 },
          { name: "Pandan Jaya",   lat: 3.130269, lng: 101.738981, km: 10.8 },
          { name: "Pandan Indah",  lat: 3.134785, lng: 101.746672, km: 11.7 },
          { name: "Cempaka",       lat: 3.138496, lng: 101.753044, km: 12.6 },
          { name: "Cahaya",        lat: 3.140658, lng: 101.756598, km: 13.0 },
          { name: "Ampang",        lat: 3.150510, lng: 101.760168, km: 14.2, dwellSec: 30 },
        ],
      },
      {
        id: "KL-LRT-Sri-Petaling",
        name: "LRT Laluan Sri Petaling",
        nameEn: "Sri Petaling LRT Line",
        color: "#721422",
        category: "LRT",
        directions: { up: "Sentul Timur bound", down: "Putra Heights bound" },
        // LRT Sri Petaling Line: Sentul Timur to Putra Heights, 29 stations.
        // Shared trunk duplication with Ampang is intentional until a
        // branch-aware route model exists.
        stations: [
          { name: "Sentul Timur",                 lat: 3.185832, lng: 101.695327, km: 0.0,  dwellSec: 30 },
          { name: "Sentul",                       lat: 3.178586, lng: 101.695506, km: 0.8 },
          { name: "Titiwangsa",                   lat: 3.173587, lng: 101.695253, km: 1.4,  dwellSec: 30 },
          { name: "PWTC",                         lat: 3.166563, lng: 101.693594, km: 2.2 },
          { name: "Sultan Ismail",                lat: 3.161185, lng: 101.694127, km: 2.8 },
          { name: "Bandaraya",                    lat: 3.155547, lng: 101.694446, km: 3.4 },
          { name: "Masjid Jamek",                 lat: 3.149468, lng: 101.696403, km: 4.1,  dwellSec: 30 },
          { name: "Plaza Rakyat",                 lat: 3.144554, lng: 101.701792, km: 4.9 },
          { name: "Hang Tuah",                    lat: 3.139873, lng: 101.706158, km: 5.6,  dwellSec: 30 },
          { name: "Pudu",                         lat: 3.134948, lng: 101.712051, km: 6.5 },
          { name: "Chan Sow Lin",                 lat: 3.127748, lng: 101.715657, km: 7.7,  dwellSec: 30 },
          { name: "Cheras",                       lat: 3.112736, lng: 101.714325, km: 9.5 },
          { name: "Salak Selatan",                lat: 3.102073, lng: 101.706321, km: 11.0 },
          { name: "Bandar Tun Razak",             lat: 3.089635, lng: 101.712435, km: 12.7 },
          { name: "Bandar Tasik Selatan",         lat: 3.076067, lng: 101.711311, km: 14.5, dwellSec: 30 },
          { name: "Sungai Besi",                  lat: 3.063931, lng: 101.708054, km: 15.9 },
          { name: "Bukit Jalil",                  lat: 3.058126, lng: 101.692198, km: 18.1 },
          { name: "Sri Petaling",                 lat: 3.061499, lng: 101.687088, km: 18.8 },
          { name: "Awan Besar",                   lat: 3.062014, lng: 101.670652, km: 20.7 },
          { name: "Muhibbah",                     lat: 3.061916, lng: 101.662603, km: 21.6 },
          { name: "Alam Sutera",                  lat: 3.054649, lng: 101.656535, km: 22.9 },
          { name: "Kinrara BK5",                  lat: 3.050450, lng: 101.644261, km: 24.3 },
          { name: "IOI Puchong Jaya",             lat: 3.048049, lng: 101.621057, km: 27.1 },
          { name: "Pusat Bandar Puchong",         lat: 3.033236, lng: 101.616114, km: 28.9 },
          { name: "Taman Perindustrian Puchong",  lat: 3.022715, lng: 101.613548, km: 30.1 },
          { name: "Bandar Puteri",                lat: 3.016928, lng: 101.612995, km: 30.8 },
          { name: "Puchong Perdana",              lat: 3.007812, lng: 101.605277, km: 32.3 },
          { name: "Puchong Prima",                lat: 2.999879, lng: 101.596817, km: 34.0 },
          { name: "Putra Heights",                lat: 2.995961, lng: 101.575540, km: 36.9, dwellSec: 30 },
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
      {
        id: "KL-MRT-Putrajaya",
        name: "MRT Laluan Putrajaya",
        nameEn: "MRT Putrajaya Line",
        color: "#ffcc00",
        category: "?琿?",
        directions: { up: "Kwasa Damansara bound", down: "Putrajaya Sentral bound" },
        // MRT Putrajaya Line: Kwasa Damansara to Putrajaya Sentral 57.7 km,
        // 36 operational stations. Provisional Bandar Malaysia stations are
        // intentionally omitted until they open for passenger service.
        stations: [
          { name: "Kwasa Damansara",       lat: 3.176226, lng: 101.572410, km: 0.0,  dwellSec: 30 },
          { name: "Kampung Selamat",       lat: 3.197167, lng: 101.578379, km: 2.6 },
          { name: "Sungai Buloh",          lat: 3.206379, lng: 101.581771, km: 3.8 },
          { name: "Damansara Damai",       lat: 3.199829, lng: 101.592923, km: 5.4 },
          { name: "Sri Damansara Barat",   lat: 3.198298, lng: 101.608403, km: 7.3 },
          { name: "Sri Damansara Sentral", lat: 3.198588, lng: 101.621135, km: 8.8 },
          { name: "Sri Damansara Timur",   lat: 3.207665, lng: 101.628534, km: 10.3 },
          { name: "Metro Prima",           lat: 3.214599, lng: 101.640381, km: 11.9 },
          { name: "Kepong Baru",           lat: 3.211744, lng: 101.648209, km: 12.9 },
          { name: "Jinjang",               lat: 3.209617, lng: 101.655918, km: 13.9 },
          { name: "Sri Delima",            lat: 3.207253, lng: 101.665612, km: 15.1 },
          { name: "Kampung Batu",          lat: 3.205889, lng: 101.675337, km: 16.3 },
          { name: "Kentonmen",             lat: 3.195332, lng: 101.679662, km: 17.7 },
          { name: "Jalan Ipoh",            lat: 3.189437, lng: 101.681171, km: 18.4 },
          { name: "Sentul Barat",          lat: 3.178814, lng: 101.685233, km: 19.8 },
          { name: "Titiwangsa",            lat: 3.174691, lng: 101.696394, km: 21.3 },
          { name: "Hospital Kuala Lumpur", lat: 3.174154, lng: 101.701762, km: 21.9 },
          { name: "Raja Uda",              lat: 3.167937, lng: 101.710930, km: 23.3 },
          { name: "Ampang Park",           lat: 3.161743, lng: 101.718011, km: 24.4 },
          { name: "Persiaran KLCC",        lat: 3.156803, lng: 101.718224, km: 25.0 },
          { name: "Conlay",                lat: 3.150660, lng: 101.718478, km: 25.8 },
          { name: "Tun Razak Exchange",    lat: 3.142906, lng: 101.720031, km: 26.7 },
          { name: "Chan Sow Lin",          lat: 3.128287, lng: 101.716632, km: 28.6, dwellSec: 30 },
          { name: "Kuchai",                lat: 3.089585, lng: 101.694192, km: 34.0 },
          { name: "Taman Naga Emas",       lat: 3.077747, lng: 101.699605, km: 35.6 },
          { name: "Sungai Besi",           lat: 3.063845, lng: 101.708424, km: 37.6 },
          { name: "Serdang Raya Utara",    lat: 3.041700, lng: 101.705007, km: 40.3 },
          { name: "Serdang Raya Selatan",  lat: 3.028520, lng: 101.707569, km: 41.9 },
          { name: "Serdang Jaya",          lat: 3.021537, lng: 101.709005, km: 42.8 },
          { name: "UPM",                   lat: 3.008440, lng: 101.705391, km: 44.4 },
          { name: "Taman Equine",          lat: 2.989297, lng: 101.672643, km: 49.1 },
          { name: "Putra Permai",          lat: 2.983047, lng: 101.660611, km: 50.7 },
          { name: "16 Sierra",             lat: 2.965249, lng: 101.654935, km: 53.0 },
          { name: "Cyberjaya Utara",       lat: 2.949241, lng: 101.657568, km: 54.9 },
          { name: "Cyberjaya City Centre", lat: 2.938934, lng: 101.665730, km: 56.5 },
          { name: "Putrajaya Sentral",     lat: 2.931374, lng: 101.671549, km: 57.7, dwellSec: 30 },
        ],
      },
      {
        id: "KL-Monorail",
        name: "Laluan Monorel KL",
        nameEn: "KL Monorail Line",
        color: "#84bd00",
        category: "Monorail",
        directions: { up: "KL Sentral bound", down: "Titiwangsa bound" },
        // KL Monorail Line: KL Sentral to Titiwangsa, 11 stations / 8.6 km.
        stations: [
          { name: "KL Sentral",       lat: 3.132682, lng: 101.687898, km: 0.0, dwellSec: 30 },
          { name: "Tun Sambanthan",   lat: 3.131452, lng: 101.690862, km: 0.4 },
          { name: "Maharajalela",     lat: 3.138948, lng: 101.699203, km: 2.0 },
          { name: "Hang Tuah",        lat: 3.140689, lng: 101.706024, km: 2.9, dwellSec: 30 },
          { name: "Imbi",             lat: 3.142812, lng: 101.709447, km: 3.5 },
          { name: "Bukit Bintang",    lat: 3.146073, lng: 101.711486, km: 4.0, dwellSec: 30 },
          { name: "Raja Chulan",      lat: 3.150831, lng: 101.710416, km: 4.7 },
          { name: "Bukit Nanas",      lat: 3.156140, lng: 101.704831, km: 5.7 },
          { name: "Medan Tuanku",     lat: 3.159253, lng: 101.698899, km: 6.6 },
          { name: "Chow Kit",         lat: 3.167394, lng: 101.698385, km: 7.7 },
          { name: "Titiwangsa",       lat: 3.173229, lng: 101.695950, km: 8.6, dwellSec: 30 },
        ],
      },
      {
        id: "ERL-KLIA-Transit",
        name: "KLIA Transit",
        nameEn: "KLIA Transit",
        color: "#7c3aed",
        category: "Airport",
        directions: { up: "KL Sentral bound", down: "KLIA T2 bound" },
        // KLIA Transit all-stop airport service: KL Sentral to KLIA T2.
        // KLIA Ekspres remains omitted until skip-stop service patterns exist.
        stations: [
          { name: "KL Sentral",             lat: 3.133887, lng: 101.686639, km: 0.0,  dwellSec: 45 },
          { name: "Bandar Tasik Selatan",   lat: 3.075819, lng: 101.710193, km: 8.9 },
          { name: "Putrajaya/Cyberjaya",    lat: 2.931692, lng: 101.670988, km: 29.4 },
          { name: "Salak Tinggi",           lat: 2.825665, lng: 101.713435, km: 44.3 },
          { name: "KLIA T1",                lat: 2.754550, lng: 101.704527, km: 53.8 },
          { name: "KLIA T2",                lat: 2.744480, lng: 101.685208, km: 56.2, dwellSec: 45 },
        ],
      },
      {
        id: "ERL-KLIA-Ekspres",
        name: "KLIA Ekspres",
        nameEn: "KLIA Ekspres",
        color: "#7c3aed",
        category: "Airport",
        directions: { up: "KL Sentral bound", down: "KLIA T2 bound" },
        // KLIA Ekspres regular-hours express service only: KL Sentral to KLIA T2.
        // 23:00+ all-stations operation remains deferred until service-pattern runtime exists.
        stations: [
          { name: "KL Sentral", lat: 3.133871, lng: 101.686645, km: 0.0,  dwellSec: 45 },
          { name: "KLIA T1",    lat: 2.754550, lng: 101.704527, km: 53.8 },
          { name: "KLIA T2",    lat: 2.744480, lng: 101.685208, km: 56.2, dwellSec: 45 },
        ],
      },
      {
        id: "KTM-Komuter-Batu-Caves-Pulau-Sebang",
        name: "KTM Komuter Batu Caves - Pulau Sebang",
        nameEn: "KTM Komuter Batu Caves - Pulau Sebang",
        color: "#1964b7",
        category: "Commuter",
        directions: { up: "Batu Caves bound", down: "Pulau Sebang/Tampin bound" },
        // KTM Komuter canonical full-corridor seed only. Short-turn,
        // skipped-station, and temporary timetable variants remain deferred.
        stations: [
          { name: "Batu Caves",                 lat: 3.237821, lng: 101.681159, km: 0.0, dwellSec: 35 },
          { name: "Taman Wahyu",                lat: 3.214529, lng: 101.672167, km: 3.1 },
          { name: "Kampung Batu",               lat: 3.204778, lng: 101.675630, km: 4.4 },
          { name: "Batu Kentonmen",             lat: 3.198225, lng: 101.681232, km: 5.5 },
          { name: "Sentul",                     lat: 3.182309, lng: 101.688716, km: 7.6 },
          { name: "Putra",                      lat: 3.165584, lng: 101.690736, km: 9.7, dwellSec: 35 },
          { name: "Bank Negara",                lat: 3.154549, lng: 101.693000, km: 11.1, dwellSec: 35 },
          { name: "Kuala Lumpur",               lat: 3.139571, lng: 101.693622, km: 13.0, dwellSec: 35 },
          { name: "KL Sentral",                 lat: 3.134385, lng: 101.686362, km: 14.1, dwellSec: 35 },
          { name: "Mid Valley",                 lat: 3.118671, lng: 101.678951, km: 16.3, dwellSec: 35 },
          { name: "Seputeh",                    lat: 3.113690, lng: 101.681291, km: 16.9 },
          { name: "Salak Selatan",              lat: 3.098191, lng: 101.705339, km: 20.5 },
          { name: "Bandar Tasik Selatan",       lat: 3.076251, lng: 101.710994, km: 23.3, dwellSec: 35 },
          { name: "Serdang",                    lat: 3.023162, lng: 101.715888, km: 29.9 },
          { name: "Kajang",                     lat: 2.982263, lng: 101.790491, km: 40.5, dwellSec: 35 },
          { name: "Kajang 2",                   lat: 2.962559, lng: 101.791917, km: 43.0 },
          { name: "UKM",                        lat: 2.939666, lng: 101.787856, km: 45.8 },
          { name: "Bangi",                      lat: 2.904058, lng: 101.786255, km: 50.3 },
          { name: "Batang Benar",               lat: 2.830400, lng: 101.826766, km: 60.7 },
          { name: "Nilai",                      lat: 2.802357, lng: 101.799782, km: 65.5 },
          { name: "Labu",                       lat: 2.753983, lng: 101.826582, km: 72.4 },
          { name: "Tiroi",                      lat: 2.741281, lng: 101.871976, km: 78.3 },
          { name: "Seremban",                   lat: 2.718828, lng: 101.940483, km: 87.2, dwellSec: 35 },
          { name: "Senawang",                   lat: 2.690608, lng: 101.971728, km: 92.4 },
          { name: "Sungai Gadut",               lat: 2.660499, lng: 101.996159, km: 97.3 },
          { name: "Rembau",                     lat: 2.593024, lng: 102.094634, km: 112.1 },
          { name: "Pulau Sebang/Tampin",        lat: 2.463508, lng: 102.226146, km: 135.0, dwellSec: 35 },
        ],
      },
      {
        id: "KTM-Komuter-Tanjung-Malim-Port-Klang",
        name: "KTM Komuter Tanjung Malim - Pelabuhan Klang",
        nameEn: "KTM Komuter Tanjung Malim - Pelabuhan Klang",
        color: "#d71920",
        category: "Commuter",
        directions: { up: "Tanjung Malim bound", down: "Pelabuhan Klang bound" },
        // KTM Komuter canonical full-corridor seed only. Short-turn,
        // skipped-station, and temporary timetable variants remain deferred.
        stations: [
          { name: "Tanjung Malim",              lat: 3.684748, lng: 101.518258, km: 0.0, dwellSec: 35 },
          { name: "Kuala Kubu Bharu",           lat: 3.553193, lng: 101.639451, km: 21.9 },
          { name: "Rasa",                       lat: 3.500308, lng: 101.634181, km: 28.4 },
          { name: "Batang Kali",                lat: 3.468387, lng: 101.637734, km: 32.4 },
          { name: "Serendah",                   lat: 3.376064, lng: 101.614439, km: 44.0 },
          { name: "Rawang",                     lat: 3.319465, lng: 101.574770, km: 52.5, dwellSec: 35 },
          { name: "Kuang",                      lat: 3.258186, lng: 101.554758, km: 60.4 },
          { name: "Sungai Buloh",               lat: 3.206178, lng: 101.580035, km: 67.5, dwellSec: 35 },
          { name: "Kepong Sentral",             lat: 3.208648, lng: 101.628507, km: 73.4, dwellSec: 35 },
          { name: "Kepong",                     lat: 3.202642, lng: 101.637246, km: 74.7 },
          { name: "Segambut",                   lat: 3.186417, lng: 101.664198, km: 78.6 },
          { name: "Putra",                      lat: 3.165584, lng: 101.690736, km: 82.7, dwellSec: 35 },
          { name: "Bank Negara",                lat: 3.154549, lng: 101.693000, km: 84.1, dwellSec: 35 },
          { name: "Kuala Lumpur",               lat: 3.139571, lng: 101.693622, km: 85.9, dwellSec: 35 },
          { name: "KL Sentral",                 lat: 3.134594, lng: 101.686264, km: 87.0, dwellSec: 35 },
          { name: "Abdullah Hukum",             lat: 3.119315, lng: 101.673481, km: 89.5, dwellSec: 35 },
          { name: "Angkasapuri",                lat: 3.113304, lng: 101.673260, km: 90.2 },
          { name: "Pantai Dalam",               lat: 3.095607, lng: 101.670009, km: 92.4 },
          { name: "Petaling",                   lat: 3.086237, lng: 101.664166, km: 93.8 },
          { name: "Jalan Templer",              lat: 3.083486, lng: 101.656516, km: 94.8 },
          { name: "Kampung Dato Harun",         lat: 3.084479, lng: 101.632279, km: 97.7 },
          { name: "Seri Setia",                 lat: 3.084535, lng: 101.621904, km: 99.0 },
          { name: "Setia Jaya",                 lat: 3.083194, lng: 101.611442, km: 100.3 },
          { name: "Subang Jaya",                lat: 3.084743, lng: 101.588304, km: 103.1, dwellSec: 35 },
          { name: "Batu Tiga",                  lat: 3.075982, lng: 101.559696, km: 106.8 },
          { name: "Shah Alam",                  lat: 3.056447, lng: 101.525116, km: 111.7, dwellSec: 35 },
          { name: "Padang Jawa",                lat: 3.052364, lng: 101.492674, km: 115.7 },
          { name: "Bukit Badak",                lat: 3.035950, lng: 101.470218, km: 119.1 },
          { name: "Klang",                      lat: 3.043158, lng: 101.449984, km: 121.7, dwellSec: 35 },
          { name: "Teluk Pulai",                lat: 3.040310, lng: 101.431636, km: 124.0 },
          { name: "Teluk Gadong",               lat: 3.034062, lng: 101.424947, km: 125.1 },
          { name: "Kampung Raja Uda",           lat: 3.020628, lng: 101.410503, km: 127.5 },
          { name: "Jalan Kastam",               lat: 3.013656, lng: 101.402979, km: 128.8 },
          { name: "Pelabuhan Klang",            lat: 2.999604, lng: 101.391363, km: 131.0, dwellSec: 35 },
        ],
      },
    ],
    trainTemplates: [
      { line: "KL-Kelana-Jaya",  type: "LRT",  badge: "LRT", badgeColor: "#dc2626", speed: 38, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "KL-LRT-Ampang",   type: "AGL",  badge: "AGL", badgeColor: "#e57200", speed: 38, interval: 6, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "KL-LRT-Sri-Petaling", type: "SPL", badge: "SPL", badgeColor: "#721422", speed: 38, interval: 6, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "KL-MRT-Kajang",   type: "MRT",  badge: "MRT", badgeColor: "#16a34a", speed: 45, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "KL-MRT-Putrajaya", type: "PYL",  badge: "PYL", badgeColor: "#ffcc00", speed: 45, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "KL-Monorail",     type: "MRL",  badge: "MRL", badgeColor: "#84bd00", speed: 38, interval: 7, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "ERL-KLIA-Transit", type: "ERL",  badge: "ERL", badgeColor: "#7c3aed", speed: 90, interval: 20, accel: 0.80, decel: 0.90, aLat: 0.85, dwellSec: 45 },
      { line: "ERL-KLIA-Ekspres", type: "ERL",  badge: "ERL", badgeColor: "#7c3aed", speed: 120, interval: 20, accel: 0.80, decel: 0.90, aLat: 0.85, dwellSec: 45 },
      { line: "KTM-Komuter-Batu-Caves-Pulau-Sebang", type: "KTM", badge: "KTM", badgeColor: "#1964b7", speed: 90, interval: 20, accel: 0.75, decel: 0.85, aLat: 0.75, dwellSec: 35 },
      { line: "KTM-Komuter-Tanjung-Malim-Port-Klang", type: "KTM", badge: "KTM", badgeColor: "#d71920", speed: 90, interval: 20, accel: 0.75, decel: 0.85, aLat: 0.75, dwellSec: 35 },
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
        id: "BKK-BTS-Silom",
        name: "BTS สายสีเขียว",
        nameEn: "BTS Silom Line",
        color: "#16a34a",
        category: "捷運",
        directions: { up: "National Stadium bound", down: "Bang Wa bound" },
        // BTS Silom Line: National Stadium↔Bang Wa 14 stations (2025).
        stations: [
          { name: "National Stadium",       lat: 13.746532, lng: 100.529090, km: 0.0 },
          { name: "Siam",                   lat: 13.745558, lng: 100.534208, km: 1.0 },
          { name: "Ratchadamri",            lat: 13.739471, lng: 100.539450, km: 2.1, dwellSec: 30 },
          { name: "Sala Daeng",             lat: 13.728568, lng: 100.534342, km: 3.3 },
          { name: "Chong Nonsi",            lat: 13.723797, lng: 100.529325, km: 4.4 },
          { name: "Saint Louis",            lat: 13.720816, lng: 100.526686, km: 5.3 },
          { name: "Surasak",                lat: 13.719268, lng: 100.521462, km: 6.5 },
          { name: "Saphan Taksin",          lat: 13.718813, lng: 100.514223, km: 7.6 },
          { name: "Krung Thon Buri",        lat: 13.720931, lng: 100.502718, km: 8.8, dwellSec: 30 },
          { name: "Wongwian Yai",           lat: 13.721082, lng: 100.495159, km: 10.0 },
          { name: "Pho Nimit",              lat: 13.719243, lng: 100.485968, km: 11.2 },
          { name: "Talat Phlu",             lat: 13.714220, lng: 100.476691, km: 12.4 },
          { name: "Wutthakat",              lat: 13.713023, lng: 100.468903, km: 13.5 },
          { name: "Bang Wa",                 lat: 13.720796, lng: 100.457805, km: 14.3, dwellSec: 30 },
        ],
      },
      {
        id: "BKK-BTS-Gold",
        name: "BTS Gold Line",
        nameEn: "BTS Gold Line",
        color: "#a58704",
        category: "AGT",
        directions: { up: "Krung Thon Buri bound", down: "Khlong San bound" },
        // Gold Line APM: Krung Thon Buri to Khlong San, 3 stations / 1.8 km.
        stations: [
          { name: "Krung Thon Buri", lat: 13.721106, lng: 100.503715, km: 0.0, dwellSec: 25 },
          { name: "Charoen Nakhon",  lat: 13.726462, lng: 100.509069, km: 0.9 },
          { name: "Khlong San",      lat: 13.730307, lng: 100.507721, km: 1.8, dwellSec: 25 },
        ],
      },
      {
        id: "BKK-MRT-Purple",
        name: "MRT สายสีม่วง",
        nameEn: "MRT Purple Line",
        color: "#a855f7",
        category: "捷運",
        directions: { up: "Khlong Bang Phai bound", down: "Tao Poon bound" },
        // MRT Purple Line: Khlong Bang Phai→Tao Poon 16 stations (currently terminal 2026).
        stations: [
          { name: "Khlong Bang Phai",        lat: 13.892440, lng: 100.408285, km: 0.0 },
          { name: "Talad Bang Yai",          lat: 13.881018, lng: 100.409354, km: 2.0 },
          { name: "Sam Yaek Bang Yai",       lat: 13.874737, lng: 100.419357, km: 4.0 },
          { name: "Bang Phlu",               lat: 13.875824, lng: 100.433798, km: 6.0 },
          { name: "Bang Rak Yai",            lat: 13.876669, lng: 100.444934, km: 8.0 },
          { name: "Bang Rak Noi Tha It",      lat: 13.874866, lng: 100.455998, km: 9.8 },
          { name: "Sai Ma",                  lat: 13.870573, lng: 100.466711, km: 11.6 },
          { name: "Phra Nang Klao Bridge",   lat: 13.870348, lng: 100.480126, km: 13.4 },
          { name: "Yaek Nonthaburi 1",       lat: 13.866011, lng: 100.494108, km: 15.2 },
          { name: "Bang Kraso",              lat: 13.861714, lng: 100.504668, km: 16.8 },
          { name: "Nonthaburi Civic Center", lat: 13.860233, lng: 100.513072, km: 18.4 },
          { name: "Ministry of Public Health",lat: 13.848499, lng: 100.514776, km: 20.0 },
          { name: "Yaek Tiwanon",            lat: 13.839575, lng: 100.515011, km: 21.8 },
          { name: "Wong Sawang",             lat: 13.829919, lng: 100.526532, km: 23.4 },
          { name: "Bang Son",                lat: 13.820087, lng: 100.532521, km: 25.2 },
          { name: "Tao Poon",                lat: 13.806090, lng: 100.530849, km: 27.0, dwellSec: 30 },
        ],
      },
      {
        id: "BKK-MRT-Yellow",
        name: "MRT สายสีเหลือง",
        nameEn: "MRT Yellow Line",
        color: "#ffd400",
        category: "Monorail",
        directions: { up: "Lat Phrao bound", down: "Samrong bound" },
        // MRT Yellow Line: Lat Phrao→Samrong 23 stations / 30.4 km, straddle monorail.
        stations: [
          { name: "Lat Phrao",          lat: 13.806991, lng: 100.574808, km: 0.0, dwellSec: 30 },
          { name: "Phawana",            lat: 13.800171, lng: 100.584217, km: 1.4 },
          { name: "Chok Chai 4",        lat: 13.794431, lng: 100.594465, km: 2.7 },
          { name: "Lat Phrao 71",       lat: 13.787103, lng: 100.607590, km: 4.5 },
          { name: "Lat Phrao 83",       lat: 13.783753, lng: 100.613605, km: 5.3 },
          { name: "Mahat Thai",         lat: 13.778377, lng: 100.623187, km: 6.6 },
          { name: "Lat Phrao 101",      lat: 13.774678, lng: 100.629803, km: 7.5 },
          { name: "Bang Kapi",          lat: 13.769098, lng: 100.639756, km: 8.8 },
          { name: "Yaek Lam Sali",      lat: 13.761844, lng: 100.645552, km: 9.9 },
          { name: "Si Kritha",          lat: 13.750433, lng: 100.644812, km: 11.3 },
          { name: "Hua Mak",            lat: 13.738100, lng: 100.645500, km: 12.8, dwellSec: 30 },
          { name: "Kalantan",           lat: 13.725343, lng: 100.641796, km: 14.4 },
          { name: "Si Nut",             lat: 13.711144, lng: 100.644158, km: 16.1 },
          { name: "Srinagarindra 38",   lat: 13.701115, lng: 100.646484, km: 17.3 },
          { name: "Suan Luang Rama IX", lat: 13.690848, lng: 100.647113, km: 18.6 },
          { name: "Si Udom",            lat: 13.676628, lng: 100.646185, km: 20.3 },
          { name: "Si Iam",             lat: 13.667664, lng: 100.645081, km: 21.4 },
          { name: "Si La Salle",        lat: 13.654958, lng: 100.642136, km: 22.9 },
          { name: "Si Bearing",         lat: 13.643471, lng: 100.636241, km: 24.5 },
          { name: "Si Dan",             lat: 13.633125, lng: 100.630104, km: 25.9 },
          { name: "Si Thepha",          lat: 13.629879, lng: 100.622682, km: 26.9 },
          { name: "Thipphawan",         lat: 13.636736, lng: 100.609916, km: 28.6 },
          { name: "Samrong",            lat: 13.645044, lng: 100.596616, km: 30.4, dwellSec: 30 },
        ],
      },
      {
        id: "BKK-MRT-Pink",
        name: "MRT สายสีชมพู",
        nameEn: "MRT Pink Line",
        color: "#e76589",
        category: "Monorail",
        directions: { up: "Nonthaburi Civic Center bound", down: "Min Buri bound" },
        // MRT Pink Line: Nonthaburi Civic Center to Min Buri main line,
        // 30 stations / 34.5 km. Muang Thong Thani branch is a separate pass.
        stations: [
          { name: "Nonthaburi Civic Center",       lat: 13.859700, lng: 100.518106, km: 0.0, dwellSec: 30 },
          { name: "Khae Rai",                      lat: 13.862640, lng: 100.520642, km: 0.4 },
          { name: "Sanambin Nam",                  lat: 13.874100, lng: 100.516307, km: 1.9 },
          { name: "Samakkhi",                      lat: 13.889258, lng: 100.510563, km: 3.7 },
          { name: "Royal Irrigation Department",   lat: 13.898537, lng: 100.507079, km: 4.9 },
          { name: "Yaek Pak Kret",                 lat: 13.906148, lng: 100.505400, km: 5.8 },
          { name: "Pak Kret Bypass",               lat: 13.906477, lng: 100.515558, km: 6.9 },
          { name: "Chaeng Watthana-Pak Kret 28",   lat: 13.904138, lng: 100.529267, km: 8.5 },
          { name: "Si Rat",                        lat: 13.900636, lng: 100.540031, km: 9.8 },
          { name: "Muang Thong Thani",             lat: 13.897398, lng: 100.548436, km: 10.8 },
          { name: "Chaeng Watthana 14",            lat: 13.893283, lng: 100.560143, km: 12.2 },
          { name: "Government Complex",            lat: 13.890753, lng: 100.567343, km: 13.1 },
          { name: "National Telecom",              lat: 13.887563, lng: 100.575709, km: 14.1 },
          { name: "Lak Si",                        lat: 13.884050, lng: 100.582681, km: 14.9, dwellSec: 30 },
          { name: "Rajabhat Phranakhon",           lat: 13.879928, lng: 100.589283, km: 15.8 },
          { name: "Wat Phra Sri Mahathat",         lat: 13.874461, lng: 100.597268, km: 16.9, dwellSec: 30 },
          { name: "Ram Inthra 3",                  lat: 13.870939, lng: 100.602604, km: 17.7 },
          { name: "Lat Pla Khao",                  lat: 13.862778, lng: 100.617802, km: 19.6 },
          { name: "Ram Inthra Kor Mor 4",          lat: 13.858291, lng: 100.626119, km: 20.7 },
          { name: "Maiyalap",                      lat: 13.855001, lng: 100.632213, km: 21.5 },
          { name: "Vacharaphol",                   lat: 13.849250, lng: 100.642869, km: 22.8 },
          { name: "Ram Inthra Kor Mor 6",          lat: 13.845243, lng: 100.650234, km: 23.8 },
          { name: "Khu Bon",                       lat: 13.840609, lng: 100.658781, km: 24.9 },
          { name: "Ram Inthra Kor Mor 9",          lat: 13.833766, lng: 100.667563, km: 26.2 },
          { name: "Outer Ring Road - Ram Inthra",  lat: 13.824440, lng: 100.677195, km: 27.7 },
          { name: "Nopparat",                      lat: 13.816520, lng: 100.685641, km: 29.0 },
          { name: "Bang Chan",                     lat: 13.812702, lng: 100.702928, km: 31.0 },
          { name: "Setthabutbamphen",              lat: 13.812678, lng: 100.712628, km: 32.1 },
          { name: "Min Buri Market",               lat: 13.812493, lng: 100.725833, km: 33.6 },
          { name: "Min Buri",                      lat: 13.808402, lng: 100.732674, km: 34.5, dwellSec: 30 },
        ],
      },
      {
        id: "BKK-MRT-Pink-Muang-Thong-Thani",
        name: "MRT สายสีชมพู เมืองทองธานี",
        nameEn: "MRT Pink Line Muang Thong Thani Branch",
        color: "#e76589",
        category: "Monorail",
        directions: { up: "Muang Thong Thani bound", down: "Lake Muang Thong Thani bound" },
        // Pink Line Muang Thong Thani branch: PK10 to MT02, 3 stations / 3.0 km.
        stations: [
          { name: "Muang Thong Thani",        lat: 13.897541, lng: 100.548487, km: 0.0, dwellSec: 30 },
          { name: "Impact Muang Thong Thani", lat: 13.910445, lng: 100.544248, km: 1.6 },
          { name: "Lake Muang Thong Thani",   lat: 13.918379, lng: 100.545652, km: 3.0, dwellSec: 30 },
        ],
      },
      {
        id: "BKK-SRT-Dark-Red",
        name: "รถไฟฟ้าชานเมืองสายสีแดงเข้ม",
        nameEn: "SRT Dark Red Line",
        color: "#b91c1c",
        category: "Commuter",
        directions: { up: "Krung Thep Aphiwat bound", down: "Rangsit bound" },
        // SRT Dark Red Line: Krung Thep Aphiwat to Rangsit, 10 stations / 26 km.
        // Light Red remains a separate future seed per the shared-trunk policy.
        stations: [
          { name: "Krung Thep Aphiwat", lat: 13.804043, lng: 100.541316, km: 0.0, dwellSec: 45 },
          { name: "Chatuchak",          lat: 13.826645, lng: 100.549424, km: 3.1 },
          { name: "Wat Samian Nari",    lat: 13.841626, lng: 100.557449, km: 5.3 },
          { name: "Bang Khen",          lat: 13.849392, lng: 100.561619, km: 6.4 },
          { name: "Thung Song Hong",    lat: 13.860232, lng: 100.567479, km: 8.0 },
          { name: "Lak Si",             lat: 13.886341, lng: 100.581886, km: 11.9, dwellSec: 30 },
          { name: "Kan Kheha",          lat: 13.898683, lng: 100.588823, km: 13.7 },
          { name: "Don Muang",          lat: 13.914752, lng: 100.597757, km: 16.1, dwellSec: 30 },
          { name: "Lak Hok",            lat: 13.965721, lng: 100.605355, km: 22.8 },
          { name: "Rangsit",            lat: 13.990543, lng: 100.602140, km: 26.0, dwellSec: 45 },
        ],
      },
      {
        id: "BKK-SRT-Light-Red",
        name: "รถไฟฟ้าชานเมืองสายสีแดงอ่อน",
        nameEn: "SRT Light Red Line",
        color: "#fc5353",
        category: "Commuter",
        directions: { up: "Krung Thep Aphiwat bound", down: "Taling Chan bound" },
        // SRT Light Red Line current segment: Krung Thep Aphiwat to Taling Chan,
        // 4 stations / 15.3 km. Salaya and Siriraj extensions remain future gates.
        stations: [
          { name: "Krung Thep Aphiwat", lat: 13.803836, lng: 100.541858, km: 0.0, dwellSec: 45 },
          { name: "Bang Son",           lat: 13.822113, lng: 100.534211, km: 2.3 },
          { name: "Bang Bamru",         lat: 13.792139, lng: 100.477465, km: 10.4 },
          { name: "Taling Chan",        lat: 13.789259, lng: 100.440070, km: 15.3, dwellSec: 45 },
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
      { line: "BKK-BTS-Silom",     type: "BTS",   badge: "BTS", badgeColor: "#16a34a", speed: 40, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "BKK-BTS-Gold",      type: "GL",    badge: "GL",  badgeColor: "#a58704", speed: 35, interval: 6, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "BKK-MRT-Purple",    type: "MRT",   badge: "MRT", badgeColor: "#a855f7", speed: 38, interval: 6, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "BKK-MRT-Yellow",    type: "YL",    badge: "YL",  badgeColor: "#ffd400", speed: 40, interval: 5, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "BKK-MRT-Pink",      type: "PK",    badge: "PK",  badgeColor: "#e76589", speed: 40, interval: 5, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "BKK-MRT-Pink-Muang-Thong-Thani", type: "PK", badge: "PK", badgeColor: "#e76589", speed: 40, interval: 10, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "BKK-SRT-Dark-Red",  type: "DR",    badge: "DR",  badgeColor: "#b91c1c", speed: 90, interval: 12, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 30 },
      { line: "BKK-SRT-Light-Red", type: "LR",    badge: "LR",  badgeColor: "#fc5353", speed: 90, interval: 20, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 30 },
      { line: "BKK-MRT-Blue",      type: "MRT",   badge: "MRT", badgeColor: "#1d4ed8", speed: 38, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "BKK-Airport-Rail",  type: "ARL",   badge: "ARL", badgeColor: "#dc2626", speed: 100, interval: 12, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 30 },
    ],
  },

  indonesia: {
    label: "Indonesia",
    center: [-6.2000, 106.8167],
    zoom: 11,
    lines: [
      {
        id: "JKT-MRT-North-South",
        name: "MRT Jakarta Lin Utara-Selatan",
        nameEn: "Jakarta MRT North-South Line",
        color: "#ce0037",
        category: "Metro",
        directions: { up: "Lebak Bulus bound", down: "Bundaran HI bound" },
        // Jakarta MRT North-South Phase 1 current service: Lebak Bulus to Bundaran HI.
        stations: [
          { name: "Lebak Bulus",     lat: -6.289296, lng: 106.774932, km: 0.0, dwellSec: 30 },
          { name: "Fatmawati",       lat: -6.292471, lng: 106.792463, km: 1.8 },
          { name: "Cipete Raya",     lat: -6.278372, lng: 106.797342, km: 3.4 },
          { name: "Haji Nawi",       lat: -6.266696, lng: 106.797345, km: 4.7 },
          { name: "Blok A",          lat: -6.255787, lng: 106.797172, km: 5.9 },
          { name: "Blok M",          lat: -6.244423, lng: 106.798239, km: 7.2, dwellSec: 30 },
          { name: "ASEAN",           lat: -6.238771, lng: 106.798470, km: 7.9 },
          { name: "Senayan",         lat: -6.226784, lng: 106.802524, km: 9.4 },
          { name: "Istora",          lat: -6.222442, lng: 106.808665, km: 10.2 },
          { name: "Bendungan Hilir", lat: -6.215063, lng: 106.817995, km: 11.5 },
          { name: "Setiabudi",       lat: -6.209095, lng: 106.821762, km: 12.4 },
          { name: "Dukuh Atas",      lat: -6.200802, lng: 106.822828, km: 13.3, dwellSec: 30 },
          { name: "Bundaran HI",     lat: -6.191849, lng: 106.823062, km: 14.5, dwellSec: 30 },
        ],
      },
    ],
    trainTemplates: [
      { line: "JKT-MRT-North-South", type: "MRTJ", badge: "MRTJ", badgeColor: "#ce0037", speed: 38, interval: 5, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
    ],
  },

  philippines: {
    label: "Philippines",
    center: [14.58, 121.03],
    zoom: 11,
    lines: [
      {
        id: "MNL-MRT-3",
        name: "Manila MRT-3",
        nameEn: "Manila MRT-3",
        color: "#ffcc00",
        category: "Metro",
        directions: { up: "North Avenue bound", down: "Taft Avenue bound" },
        // Manila MRT-3 current service: North Avenue to Taft Avenue, 13 stations.
        stations: [
          { name: "North Avenue",    lat: 14.651694, lng: 121.032633, km: 0.0, dwellSec: 30 },
          { name: "Quezon Avenue",   lat: 14.642449, lng: 121.038645, km: 1.3 },
          { name: "GMA Kamuning",    lat: 14.635333, lng: 121.043275, km: 2.3 },
          { name: "Araneta Cubao",   lat: 14.619478, lng: 121.051057, km: 4.6 },
          { name: "Santolan",        lat: 14.607541, lng: 121.056574, km: 6.0 },
          { name: "Ortigas",         lat: 14.587341, lng: 121.056519, km: 8.2 },
          { name: "Shaw Boulevard",  lat: 14.581102, lng: 121.053408, km: 9.0 },
          { name: "Boni",            lat: 14.573093, lng: 121.047644, km: 10.1 },
          { name: "Guadalupe",       lat: 14.566719, lng: 121.045438, km: 10.9 },
          { name: "Buendia",         lat: 14.553952, lng: 121.033684, km: 12.9 },
          { name: "Ayala",           lat: 14.548755, lng: 121.027540, km: 13.8 },
          { name: "Magallanes",      lat: 14.541743, lng: 121.019050, km: 15.0 },
          { name: "Taft Avenue",     lat: 14.537597, lng: 121.001890, km: 16.9, dwellSec: 30 },
        ],
      },
      {
        id: "MNL-LRT-2",
        name: "Manila LRT-2",
        nameEn: "Manila LRT-2",
        color: "#7c3aed",
        category: "Metro",
        directions: { up: "Recto bound", down: "Antipolo bound" },
        // Manila LRT-2 current service: Recto to Antipolo, 13 stations.
        stations: [
          { name: "Recto",                  lat: 14.603467, lng: 120.983984, km: 0.0, dwellSec: 30 },
          { name: "Legarda",                lat: 14.600830, lng: 120.992486, km: 1.1 },
          { name: "Pureza",                 lat: 14.601679, lng: 121.005040, km: 2.5 },
          { name: "V. Mapa",                lat: 14.604003, lng: 121.017048, km: 4.0 },
          { name: "J. Ruiz",                lat: 14.610536, lng: 121.026068, km: 5.3 },
          { name: "Gilmore",                lat: 14.613477, lng: 121.034082, km: 6.4 },
          { name: "Betty Go-Belmonte",      lat: 14.618579, lng: 121.042754, km: 7.6 },
          { name: "Araneta Center-Cubao",   lat: 14.622891, lng: 121.053041, km: 8.9 },
          { name: "Anonas",                 lat: 14.628075, lng: 121.065197, km: 10.4 },
          { name: "Katipunan",              lat: 14.631260, lng: 121.073293, km: 11.4 },
          { name: "Santolan",               lat: 14.621693, lng: 121.086314, km: 13.4 },
          { name: "Marikina-Pasig",         lat: 14.620444, lng: 121.100632, km: 15.1 },
          { name: "Antipolo",               lat: 14.624771, lng: 121.121380, km: 17.6, dwellSec: 30 },
        ],
      },
    ],
    trainTemplates: [
      { line: "MNL-MRT-3", type: "MRT-3", badge: "MRT-3", badgeColor: "#ffcc00", speed: 38, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "MNL-LRT-2", type: "LRT-2", badge: "LRT-2", badgeColor: "#7c3aed", speed: 40, interval: 5, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
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

const RAIL_SHAPE_LOADERS = {
  taiwan:    () => import("./rail-shapes/taiwan.generated.js"),
  japan:     () => import("./rail-shapes/japan.generated.js"),
  korea:     () => import("./rail-shapes/korea.generated.js"),
  hongkong:  () => import("./rail-shapes/hongkong.generated.js"),
  china:     () => import("./rail-shapes/china.generated.js"),
  singapore: () => import("./rail-shapes/singapore.generated.js"),
  malaysia:  () => import("./rail-shapes/malaysia.generated.js"),
  thailand:  () => import("./rail-shapes/thailand.generated.js"),
  indonesia: () => import("./rail-shapes/indonesia.generated.js"),
  philippines: () => import("./rail-shapes/philippines.generated.js"),
  vietnam:   () => import("./rail-shapes/vietnam.generated.js"),
};

const loadedShapeRegions = new Set();
const shapeLoadPromises = {};
let railDataRevision = 0;

function invalidateLineCaches(line) {
  delete line._bounds;
  delete line._renderPolylines;
  delete line._gradeSegments;
  delete line._gradeSegmentsByZoom;
}

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
function mergeShapes(shapes, regionKey) {
  if (!shapes) return 0;
  const regions = regionKey
    ? [[regionKey, RAIL_DATA[regionKey]]]
    : Object.entries(RAIL_DATA);
  let merged = 0;

  for (const [, region] of regions) {
    if (!region) continue;
    for (const line of region.lines) {
      const gen = shapes[line.id];
      if (!gen || !gen.shape || gen.shape.length < 2) continue;

      // Build shape with cumulative km in one pass.
      const pts = gen.shape;
      const out = new Array(pts.length);
      let cum = 0;
      out[0] = { lat: pts[0][0], lng: pts[0][1], km: 0 };
      for (let i = 1; i < pts.length; i++) {
        const a = out[i-1];
        const b = { lat: pts[i][0], lng: pts[i][1] };
        const R = 6371;
        const toRad = d => d * Math.PI / 180;
        const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
        const la1 = toRad(a.lat), la2 = toRad(b.lat);
        const x = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;
        cum += 2 * R * Math.asin(Math.sqrt(x));
        out[i] = { lat: b.lat, lng: b.lng, km: cum };
      }
      line.shape = out;

      if (gen.stations && gen.stations.length > 0) {
        line.stations = gen.stations.map(s => ({ name: s.name, lat: s.lat, lng: s.lng, km: s.km }));
        invalidateLineCaches(line);
        merged++;
        continue;
      }

      if (gen.stationCoords) {
        for (const st of line.stations) {
          const coord = gen.stationCoords[st.name];
          if (!coord) continue;
          st.lat = coord[0];
          st.lng = coord[1];
        }
      }

      let useGenStationKms = true;
      const hasIndexedStationKms = Array.isArray(gen.stationKmsByIndex) &&
        gen.stationKmsByIndex.length === line.stations.length;
      if (gen.stationKms || hasIndexedStationKms) {
        const isLoopLine = line.stations.length >= 3 &&
          line.stations[0].name === line.stations[line.stations.length - 1].name;
        let prev = -Infinity;
        for (let i = 0; i < line.stations.length; i++) {
          const st = line.stations[i];
          const isLoopStart = isLoopLine && i === 0 && gen.totalKm != null;
          const isLoopBack = isLoopLine && i === line.stations.length - 1 && gen.totalKm != null;
          const k = isLoopStart
            ? 0
            : (isLoopBack ? gen.totalKm : (hasIndexedStationKms ? gen.stationKmsByIndex[i] : gen.stationKms[st.name]));
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

      const handFirst = line.stations[0].km;
      const handLast = line.stations[line.stations.length - 1].km;
      const handSpan = handLast - handFirst;

      if ((gen.stationKms || hasIndexedStationKms) && useGenStationKms) {
        const isLoopLine = line.stations.length >= 3 &&
          line.stations[0].name === line.stations[line.stations.length - 1].name;
        for (let i = 0; i < line.stations.length; i++) {
          const st = line.stations[i];
          const isLoopStart = isLoopLine && i === 0 && gen.totalKm != null;
          const isLoopBack = isLoopLine && i === line.stations.length - 1 && gen.totalKm != null;
          const k = isLoopStart
            ? 0
            : (isLoopBack ? gen.totalKm : (hasIndexedStationKms ? gen.stationKmsByIndex[i] : gen.stationKms[st.name]));
          if (k != null) st.km = k;
        }
      } else if (gen.totalKm != null && line.stations.length >= 2) {
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

      invalidateLineCaches(line);
      merged++;
    }
  }
  return merged;
}

export function loadRailShapesForRegion(regionKey) {
  if (loadedShapeRegions.has(regionKey)) return Promise.resolve(railDataRevision);
  if (shapeLoadPromises[regionKey]) return shapeLoadPromises[regionKey];
  const loader = RAIL_SHAPE_LOADERS[regionKey];
  if (!loader) return Promise.resolve(railDataRevision);

  shapeLoadPromises[regionKey] = loader().then((module) => {
    const merged = mergeShapes(module.RAIL_SHAPES, regionKey);
    loadedShapeRegions.add(regionKey);
    if (merged > 0) railDataRevision++;
    return railDataRevision;
  });
  return shapeLoadPromises[regionKey];
}

export function loadAllRailShapes() {
  return Promise.all(Object.keys(RAIL_DATA).map(loadRailShapesForRegion))
    .then(() => railDataRevision);
}

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

  function pointInBounds(P, bounds) {
    if (!P || !bounds) return true;
    return P.lat >= bounds.south && P.lat <= bounds.north &&
      P.lng >= bounds.west && P.lng <= bounds.east;
  }

  function boundsForPoints(points) {
    let south = Infinity, west = Infinity, north = -Infinity, east = -Infinity;
    for (const p of points || []) {
      const lat = Array.isArray(p) ? p[0] : p.lat;
      const lng = Array.isArray(p) ? p[1] : p.lng;
      if (lat < south) south = lat;
      if (lat > north) north = lat;
      if (lng < west) west = lng;
      if (lng > east) east = lng;
    }
    return isFinite(south) ? { south, west, north, east } : null;
  }

  function boundsIntersect(a, b) {
    if (!a || !b) return true;
    return a.north >= b.south && a.south <= b.north &&
      a.east >= b.west && a.west <= b.east;
  }

  function lineBounds(lineOrStations) {
    if (Array.isArray(lineOrStations)) return boundsForPoints(lineOrStations);
    if (!lineOrStations._bounds) {
      lineOrStations._bounds = boundsForPoints(polylineFor(lineOrStations));
    }
    return lineOrStations._bounds;
  }

  function segmentIntersectsBounds(A, B, bounds) {
    if (!bounds) return true;
    if (pointInBounds(A, bounds) || pointInBounds(B, bounds)) return true;
    const minLat = Math.min(A.lat, B.lat);
    const maxLat = Math.max(A.lat, B.lat);
    const minLng = Math.min(A.lng, B.lng);
    const maxLng = Math.max(A.lng, B.lng);
    return maxLat >= bounds.south && minLat <= bounds.north &&
      maxLng >= bounds.west && minLng <= bounds.east;
  }

  function lineIntersectsBounds(lineOrStations, bounds) {
    if (!bounds) return true;
    if (!boundsIntersect(lineBounds(lineOrStations), bounds)) return false;
    const poly = polylineFor(lineOrStations);
    if (!poly || poly.length === 0) return false;
    if (poly.length === 1) return pointInBounds(poly[0], bounds);
    for (let i = 0; i < poly.length - 1; i++) {
      if (segmentIntersectsBounds(poly[i], poly[i+1], bounds)) return true;
    }
    return false;
  }

  function renderBucketForZoom(zoom) {
    if (zoom == null || zoom >= 13) return 'full';
    if (zoom >= 11) return 'near';
    if (zoom >= 9) return 'mid';
    return 'far';
  }

  function simplifyToleranceForBucket(bucket) {
    if (bucket === 'far') return 0.45;
    if (bucket === 'mid') return 0.18;
    if (bucket === 'near') return 0.06;
    return 0;
  }

  function asPoint(p) {
    return Array.isArray(p) ? { lat: p[0], lng: p[1] } : p;
  }

  function distanceToSegmentKm(P, A, B) {
    return projectOnSegment(asPoint(P), asPoint(A), asPoint(B)).dist;
  }

  function simplifyPoints(points, toleranceKm) {
    if (!points || points.length <= 2 || !(toleranceKm > 0)) return points || [];
    const keep = new Uint8Array(points.length);
    keep[0] = 1;
    keep[points.length - 1] = 1;
    const stack = [[0, points.length - 1]];
    while (stack.length) {
      const [start, end] = stack.pop();
      if (end <= start + 1) continue;
      let maxDist = -1;
      let index = -1;
      const A = points[start], B = points[end];
      for (let i = start + 1; i < end; i++) {
        const dist = distanceToSegmentKm(points[i], A, B);
        if (dist > maxDist) {
          maxDist = dist;
          index = i;
        }
      }
      if (maxDist > toleranceKm && index > start) {
        keep[index] = 1;
        stack.push([start, index], [index, end]);
      }
    }
    const out = [];
    for (let i = 0; i < points.length; i++) {
      if (keep[i]) out.push(points[i]);
    }
    return out.length >= 2 ? out : points;
  }

  function renderPolylineFor(line, zoom) {
    const poly = polylineFor(line);
    if (!line.shape || line.shape.length < 2) return poly;
    const bucket = renderBucketForZoom(zoom);
    if (bucket === 'full') return poly;
    if (!line._renderPolylines) line._renderPolylines = {};
    if (!line._renderPolylines[bucket]) {
      line._renderPolylines[bucket] = simplifyPoints(poly, simplifyToleranceForBucket(bucket));
    }
    return line._renderPolylines[bucket];
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
    if (points.length === 2 && points[1].x > points[0].x) {
      const a = points[0], b = points[1];
      points = [
        a,
        {
          lat: (a.lat + b.lat) / 2,
          lng: (a.lng + b.lng) / 2,
          x: (a.x + b.x) / 2,
        },
        b,
      ];
    }
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
    if (line._gradeSegments) return line._gradeSegments;
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
    line._gradeSegments = ranges.map(r => {
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
    return line._gradeSegments;
  }

  function gradeSegmentsForZoom(line, zoom) {
    const bucket = renderBucketForZoom(zoom);
    if (bucket === 'full') return gradeSegments(line);
    if (!line._gradeSegmentsByZoom) line._gradeSegmentsByZoom = {};
    if (!line._gradeSegmentsByZoom[bucket]) {
      const toleranceKm = simplifyToleranceForBucket(bucket);
      line._gradeSegmentsByZoom[bucket] = gradeSegments(line).map(seg => ({
        ...seg,
        points: simplifyPoints(seg.points, toleranceKm),
      }));
    }
    return line._gradeSegmentsByZoom[bucket];
  }

  return { haversine, projectOnSegment, closestOnLine, positionAtKm,
           pointInBounds, segmentIntersectsBounds, lineIntersectsBounds,
           boundsForPoints, boundsIntersect, lineBounds,
           renderBucketForZoom, renderPolylineFor, gradeSegmentsForZoom,
           shapeBetween, curvatureRadii, gradeSegments,
           kinematicProfile, kmAtTimeInProfile, timeAtKmInProfile,
           normalizeName, namesEqual,
           dataRevision: () => railDataRevision };
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

  function normalizeLineFilter(lineIds) {
    if (lineIds == null) return null;
    const ids = lineIds instanceof Set ? Array.from(lineIds) : Array.isArray(lineIds) ? lineIds : [lineIds];
    const uniq = Array.from(new Set(ids.filter(Boolean))).sort();
    return { ids: new Set(uniq), key: uniq.length > 0 ? uniq.join(',') : '__none__' };
  }

  // Generate trains for a given region + date (local), optionally limited to
  // a set of line ids so viewport-only map updates do not build the whole day.
  // Cached per (region, dateYYYYMMDD)
  const cache = {};

  function generate(regionKey, date, lineIds) {
    const region = RAIL_DATA[regionKey];
    const lineFilter = normalizeLineFilter(lineIds);
    const dateKey = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    // Bump the version suffix when the kinematic model changes.
    const cacheKey = regionKey + "|" + dateKey + "|kinV2|" + railDataRevision + "|" + (lineFilter ? lineFilter.key : "all");
    if (cache[cacheKey]) return cache[cacheKey];

    const trains = [];
    const daySeed = hash(dateKey);
    // Service window: 5:30am -> 23:30 (in minutes from midnight)
    const svcStart = 5.5 * 60, svcEnd = 23.5 * 60;

    region.trainTemplates.forEach((tpl, tplIdx) => {
      if (lineFilter && !lineFilter.ids.has(tpl.line)) return;
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
