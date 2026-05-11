// Mock train line data ??Taiwan (TRA/HSR) + Japan (JR major lines)
// Each line has an array of stations with {name, lat, lng, km} (km = cumulative km from line origin)
// Trains are generated dynamically from templates.
//
// Optional per-line `grades` field ??annotates 頝舐??啣耦 (construction type) by
// km range. Anything not covered defaults to "ground" (撟喲/?圈).
//   grades: [
//     { from: <km>, to: <km>, type: "ground" | "underground" | "elevated", note?: <string> },
//     ...
//   ]
// Conventions:
//   - `from` and `to` are cumulative km in the SAME space as the hand-coded
//     `station.km` values in this file. After shape merge, both station kms
//     and grade kms are linearly remapped onto the polyline together, so they
//     stay aligned. Always author grades using the hand-coded km column ??
//     never the post-merge / TDX-projected values.
//   - Segments must be inside [0, lastStation.km], sorted by `from`,
//     non-overlapping.
//   - Omitted ranges are implicitly "ground"; do not list ground segments.
//   - `note` is optional, used for tooltips / debugging only.
// Type values:
//   "underground" ???菔楝?唬???(urban underground project ??the line was
//                   intentionally moved beneath the city to grade-separate
//                   from streets).
//   "tunnel"      ??撅勗眾?折? / ?啣耦?折? (the line bores through hill or
//                   topography because the surface route is impractical;
//                   distinct from ?賣??唬???even though both are below grade).
//   "elevated"    ???菔楝擃??/ viaduct (visibly raised above ground).
//   "ground"      ??撟喲 / at-grade (default, not listed).
export const RAIL_DATA = {
  taiwan: {
    label: "?啁 Taiwan",
    center: [24.5, 121.0],
    zoom: 8,
    lines: [
      {
        id: "TRA-West",
        name: "?圈镼輸撟寧?",
        nameEn: "TRA West Coast Line",
        color: "#6ee7b7",
        category: "TRA",
        directions: { up: "?? (敺?粹?)", down: "?? (敺擃?)" },
        stations: [
          { name: "?粹?", lat: 25.1315, lng: 121.7405, km: 0 },
          { name: "?啣?", lat: 25.0478, lng: 121.5170, km: 28.2, dwellSec: 90 },
          { name: "?踵?", lat: 25.0144, lng: 121.4637, km: 35.2, dwellSec: 60 },
          { name: "獢?", lat: 24.9894, lng: 121.3130, km: 51.8 },
          { name: "銝剖ㄑ", lat: 24.9535, lng: 121.2255, km: 63.3 },
          { name: "?啁姘", lat: 24.8016, lng: 120.9717, km: 104.3 },
          { name: "??", lat: 24.5680, lng: 120.8130, km: 152.7 },
          { name: "?唬葉", lat: 24.1369, lng: 120.6844, km: 198.9 },
          { name: "敶啣?", lat: 24.0813, lng: 120.5382, km: 215.0 },
          { name: "?⊥?", lat: 23.9581, lng: 120.5717, km: 226.1 },
          { name: "?", lat: 23.7111, lng: 120.5419, km: 258.2 },
          { name: "?儔", lat: 23.4797, lng: 120.4497, km: 288.3 },
          { name: "?啣?", lat: 22.9972, lng: 120.2111, km: 340.6 },
          { name: "擃?", lat: 22.6393, lng: 120.3020, km: 404.5 },
        ],
        // Approximate annotations of major ?菔楝蝡???projects on the West
        // Coast Line. km values are aligned to TDX-canonical station kms after
        // shape merge (see rail-data.generated.js). Ranges are demo-grade
        // (簣0.5 km) ??refine against 鈭日 alignments when adding detail.
        grades: [
          { from: 13.7,  to: 19.7,  type: "elevated",    note: "瘙迫??皜?擃??" },
          { from: 19.7,  to: 36.1,  type: "underground", note: "?葛?撅晦璈??菔楝?唬???" },
          { from: 36.1,  to: 41.5,  type: "underground", note: "?踵??邦???唬??辣隡?" },
          { from: 179.5, to: 198.0, type: "elevated",    note: "?唬葉?菔楝擃??(鞊??之??" },
          { from: 225.2, to: 227.2, type: "elevated",    note: "?⊥?頠?擃" },
          { from: 394.3, to: 406.6, type: "underground", note: "擃??菔楝?唬???(撌衣??陶撅?" },
        ],
      },
      {
        id: "TRA-Coast",
        name: "?圈瘚瑕硫蝺?,
        nameEn: "TRA Coast Line",
        color: "#0ea5e9",
        category: "TRA",
        directions: { up: "?? (敺蝡孵?)", down: "?? (敺餈賢?)" },
        // 蝡孵??蕭??(TDX WL-C 瘚瑕硫蝺?. ?祕??憭匱蝥? ?蕭蝺??亙蔑??雿絲蝺?
        // ?祈澈??polyline 蝯餈賢?,?迨隞亥蕭??垢蝯???暺? km ??build
        // 甇仿???TDX 撖怠 (rail-data.generated.js),?ㄐ??撖怠澆?雿?fallback??
        stations: [
          { name: "蝡孵?", lat: 24.6856, lng: 120.8755, km: 0,    dwellSec: 60 },
          { name: "隢?", lat: 24.6555, lng: 120.8447, km: 4.5  },
          { name: "憭批控", lat: 24.6037, lng: 120.7958, km: 10.6 },
          { name: "敺?", lat: 24.6121, lng: 120.7867, km: 14.1 },
          { name: "樴葛", lat: 24.6463, lng: 120.7700, km: 18.2 },
          { name: "?賣?撅?, lat: 24.6854, lng: 120.7584, km: 23.1 },
          { name: "?啣?", lat: 24.7144, lng: 120.7459, km: 28.2 },
          { name: "??", lat: 24.4874, lng: 120.6798, km: 32.0 },
          { name: "?ㄐ", lat: 24.4421, lng: 120.6510, km: 38.2 },
          { name: "?亙?", lat: 24.3997, lng: 120.6411, km: 42.6 },
          { name: "憭抒", lat: 24.3479, lng: 120.6235, km: 46.4 },
          { name: "?唬葉皜?, lat: 24.2842, lng: 120.5618, km: 51.6 },
          { name: "皜偌", lat: 24.2683, lng: 120.5666, km: 55.0 },
          { name: "瘝嘀", lat: 24.2342, lng: 120.5660, km: 60.4 },
          { name: "樴?", lat: 24.1929, lng: 120.5466, km: 65.0 },
          { name: "憭扯?", lat: 24.1500, lng: 120.5400, km: 69.7 },
          { name: "餈賢?", lat: 24.1208, lng: 120.5417, km: 73.2, dwellSec: 60 },
        ],
      },
      {
        id: "THSR",
        name: "?啁擃",
        nameEn: "Taiwan High Speed Rail",
        color: "#60a5fa",
        category: "HSR",
        directions: { up: "?? (敺?葛)", down: "?? (敺撌衣?)" },
        stations: [
          { name: "?葛", lat: 25.0521, lng: 121.6069, km: 0 },
          { name: "?啣?", lat: 25.0478, lng: 121.5170, km: 9.0, dwellSec: 90 },
          { name: "?踵?", lat: 25.0144, lng: 121.4637, km: 15.0, dwellSec: 60 },
          { name: "獢?", lat: 25.0127, lng: 121.2149, km: 45.0 },
          { name: "?啁姘", lat: 24.8083, lng: 121.0406, km: 80.0 },
          { name: "??", lat: 24.6094, lng: 120.8251, km: 120.0 },
          { name: "?唬葉", lat: 24.1124, lng: 120.6151, km: 175.0 },
          { name: "敶啣?", lat: 23.8728, lng: 120.5956, km: 215.0 },
          { name: "?脫?", lat: 23.7353, lng: 120.4164, km: 240.0 },
          { name: "?儔", lat: 23.4598, lng: 120.3272, km: 272.0 },
          { name: "?啣?", lat: 22.9248, lng: 120.2853, km: 325.0 },
          { name: "撌衣?", lat: 22.6870, lng: 120.3082, km: 345.0 },
        ],
        // ?啁擃:?函?蝝?73% 擃??8% ?折???% 頝臬/撟喲???箔蜓閬?畾?
        // ?葛?璈???萄瑽銝???????血控?折??擗畾萎誑
        // 擃?箔蜓(?祈澈撠望 HSR ??皞極瘜??m ?∠?祆?蝡??神??
        // (?葛 0?璈?15????120?銝?175?椰??345)??
        grades: [
          { from: 0,    to: 15,    type: "underground", note: "?葛?璈??望??唬???" },
          { from: 17,   to: 24,    type: "tunnel",      note: "??折?(蝝?7.4 km)" },
          { from: 24,   to: 142,   type: "elevated",    note: "獢?????擃(銝駁?)" },
          { from: 142,  to: 150,   type: "tunnel",      note: "?怠撅梢??蝝?7.4 km)" },
          { from: 150,  to: 345,   type: "elevated",    note: "?唬葉?椰??擃(銝駁?)" },
        ],
      },
      {
        id: "TRA-East",
        name: "?圈?梢撟寧?",
        nameEn: "TRA East Coast Line",
        color: "#f59e0b",
        category: "TRA",
        directions: { up: "?? (敺璅寞?)", down: "?? (敺?梯/?唳)" },
        stations: [
          { name: "璅寞?", lat: 24.9935, lng: 121.4253, km: 0 },
          { name: "?踵?", lat: 25.0144, lng: 121.4637, km: 6.3, dwellSec: 60 },
          { name: "?啣?", lat: 25.0478, lng: 121.5170, km: 13.0, dwellSec: 90 },
          { name: "?曉控", lat: 25.0497, lng: 121.5774, km: 19.6 },
          { name: "?葛", lat: 25.0521, lng: 121.6069, km: 22.7 },
          { name: "?怠", lat: 25.1056, lng: 121.7150, km: 31.6 },
          { name: "?", lat: 25.1086, lng: 121.8072, km: 39.9 },
          { name: "蝳?", lat: 25.0200, lng: 121.9444, km: 57.1 },
          { name: "摰", lat: 24.7548, lng: 121.7619, km: 104.0 },
          { name: "蝢", lat: 24.6779, lng: 121.7664, km: 112.8 },
          { name: "?噫??, lat: 24.5985, lng: 121.8286, km: 128.0 },
          { name: "?梯", lat: 23.9935, lng: 121.6014, km: 211.0, dwellSec: 120 },
          { name: "??", lat: 23.3352, lng: 121.3132, km: 290.0 },
          { name: "?唳", lat: 22.7930, lng: 121.1243, km: 374.0 },
        ],
        // East Line shares the Taipei underground ?折? with TRA-West between
        // 璅寞? and ?葛. km values aligned to TDX-canonical positions.
        grades: [
          { from: 0,    to: 21.6, type: "underground", note: "璅寞???皜??菔楝?唬???" },
        ],
      },
      {
        id: "TRA-South-Link",
        name: "?圈?艘蝺?,
        nameEn: "TRA South-Link Line",
        color: "#fb923c",
        category: "TRA",
        directions: { up: "镼輯? (敺?祚)", down: "?梯? (敺?唳)" },
        stations: [
          { name: "?祚", lat: 22.3672, lng: 120.5961, km: 0 },
          { name: "?正", lat: 22.3501, lng: 120.6125, km: 4.4 },
          { name: "?抒?", lat: 22.3132, lng: 120.6322, km: 9.0 },
          { name: "?控", lat: 22.2768, lng: 120.6539, km: 14.0 },
          { name: "?方?", lat: 22.3098, lng: 120.7872, km: 26.7 },
          { name: "憭扳郎", lat: 22.3525, lng: 120.9059, km: 45.7 },
          { name: "?扳漯", lat: 22.4631, lng: 120.9555, km: 57.0 },
          { name: "??", lat: 22.5325, lng: 120.9684, km: 64.7 },
          { name: "憭芷獄??, lat: 22.6094, lng: 121.0058, km: 73.4 },
          { name: "?交", lat: 22.7060, lng: 121.0640, km: 85.7 },
          { name: "摨瑟?", lat: 22.7619, lng: 121.1078, km: 92.7 },
          { name: "?唳", lat: 22.7930, lng: 121.1243, km: 98.2 },
        ],
        // ?艘蝺??函?憭挾撅勗眾?折?,銝?芣???瑚誨銵冽抒?銝剖亢?折???
        // ?園??剝???敺??舐敦????
        grades: [
          { from: 14, to: 22, type: "tunnel", note: "銝剖亢?折?(蝝?8.07 km)" },
        ],
      },
      {
        id: "TRA-Pingxi",
        name: "?圈撟單漯蝺?,
        nameEn: "TRA Pingxi Line",
        color: "#fb7185",
        category: "TRA",
        directions: { up: "镼輯? (敺銝?撊?", down: "?梯? (敺??)" },
        stations: [
          { name: "銝?撊?, lat: 25.0584, lng: 121.8208, km: 0 },
          { name: "憭扯", lat: 25.0467, lng: 121.8138, km: 1.7 },
          { name: "??", lat: 25.0418, lng: 121.7748, km: 5.6 },
          { name: "?", lat: 25.0438, lng: 121.7595, km: 7.4 },
          { name: "撊箄", lat: 25.0349, lng: 121.7452, km: 9.0 },
          { name: "撟單漯", lat: 25.0257, lng: 121.7392, km: 10.6 },
          { name: "??", lat: 25.0252, lng: 121.7271, km: 12.9 },
        ],
      },
      {
        id: "TRA-Neiwan",
        name: "?圈?抒蝺?,
        nameEn: "TRA Neiwan Line",
        color: "#84cc16",
        category: "TRA",
        directions: { up: "?? (敺?啁姘)", down: "?? (敺?抒)" },
        stations: [
          { name: "?啁姘", lat: 24.8016, lng: 120.9717, km: 0 },
          { name: "?蝡?, lat: 24.8064, lng: 120.9819, km: 1.0 },
          { name: "?", lat: 24.8128, lng: 120.9980, km: 2.7 },
          { name: "?啗?", lat: 24.8170, lng: 121.0119, km: 4.0 },
          { name: "蝡嫣葉", lat: 24.8132, lng: 121.0264, km: 5.8 },
          { name: "銝", lat: 24.7649, lng: 121.0727, km: 9.7 },
          { name: "璁株", lat: 24.7449, lng: 121.0850, km: 11.9 },
          { name: "蝡寞", lat: 24.7367, lng: 121.0907, km: 14.6 },
          { name: "璈怠控", lat: 24.7233, lng: 121.1281, km: 19.0 },
          { name: "銋???, lat: 24.7242, lng: 121.1404, km: 20.4 },
          { name: "??", lat: 24.7207, lng: 121.1675, km: 23.3 },
          { name: "撖眼", lat: 24.7126, lng: 121.1810, km: 24.8 },
          { name: "?抒", lat: 24.7077, lng: 121.1866, km: 27.1 },
        ],
        // ?抒蝺??啁姘?姘銝??賣?畾?2011 撟游?撌仿??嗅??姘銝凋誑?撅勗?
        // 撟喲/璈?頝舀挾,?芰敦璅?
        grades: [
          { from: 0, to: 5.8, type: "elevated", note: "?啁姘?姘銝??賣?擃畾?" },
        ],
      },
      {
        id: "TRA-Jiji",
        name: "?圈??蝺?,
        nameEn: "TRA Jiji Line",
        color: "#a3e635",
        category: "TRA",
        directions: { up: "镼輯? (敺鈭偌)", down: "?梯? (敺頠?)" },
        stations: [
          { name: "鈭偌", lat: 23.8087, lng: 120.6230, km: 0 },
          { name: "皞?", lat: 23.8159, lng: 120.6526, km: 2.7 },
          { name: "瞈偌", lat: 23.8302, lng: 120.7008, km: 7.7 },
          { name: "樴?", lat: 23.8356, lng: 120.7345, km: 11.5 },
          { name: "??", lat: 23.8284, lng: 120.7869, km: 16.6 },
          { name: "瘞湧?", lat: 23.8117, lng: 120.8538, km: 23.2 },
          { name: "頠?", lat: 23.8290, lng: 120.8653, km: 29.7 },
        ],
      },
      {
        id: "TRA-Shalun",
        name: "?圈瘝?蝺?,
        nameEn: "TRA Shalun Line",
        color: "#fde047",
        category: "TRA",
        directions: { up: "?? (敺銝剜散)", down: "?? (敺瘝?)" },
        stations: [
          { name: "銝剜散", lat: 22.9197, lng: 120.2360, km: 0 },
          { name: "?瑟旨憭批飛", lat: 22.9089, lng: 120.2493, km: 2.0 },
          { name: "瘝?", lat: 22.9252, lng: 120.2853, km: 5.3 },
        ],
      },
      {
        id: "Alishan-Forest",
        name: "?輸?撅望?璆剝頝?,
        nameEn: "Alishan Forest Railway",
        color: "#22c55e",
        category: "TRA",
        directions: { up: "銝? (敺?儔)", down: "銝? (敺?輸?撅?" },
        stations: [
          { name: "?儔", lat: 23.4797, lng: 120.4497, km: 0 },
          { name: "??", lat: 23.4847, lng: 120.4597, km: 1.6 },
          { name: "暽輸獄??, lat: 23.4892, lng: 120.4877, km: 4.4 },
          { name: "蝡孵?", lat: 23.5240, lng: 120.5559, km: 14.2 },
          { name: "璅撖?, lat: 23.5184, lng: 120.6127, km: 23.3 },
          { name: "?函?撅?, lat: 23.5170, lng: 120.6371, km: 27.4 },
          { name: "璇典?撖?, lat: 23.5135, lng: 120.6577, km: 32.3 },
          { name: "鈭文???, lat: 23.5043, lng: 120.6717, km: 35.6 },
          { name: "瘞渡冗撖?, lat: 23.5093, lng: 120.7035, km: 40.5 },
          { name: "憟株絲皝?, lat: 23.4947, lng: 120.7203, km: 45.7 },
          { name: "憭?", lat: 23.4925, lng: 120.7501, km: 50.9 },
          { name: "??頝?, lat: 23.4793, lng: 120.7783, km: 55.3 },
          { name: "?輸?撅?, lat: 23.5099, lng: 120.8030, km: 71.4 },
        ],
      },
      {
        id: "TPE-Red",
        name: "?啣??琿?瘛⊥偌靽∠儔蝺?,
        nameEn: "Taipei Metro Tamsui-Xinyi Line",
        color: "#e2554b",
        category: "Metro",
        directions: { up: "?? (敺瘛⊥偌)", down: "?? (敺鞊∪控)" },
        stations: [
          { name: "瘛⊥偌", lat: 25.1677, lng: 121.4451, km: 0 },
          { name: "蝝邦??, lat: 25.1547, lng: 121.4598, km: 2.0 },
          { name: "蝡孵?", lat: 25.1366, lng: 121.4598, km: 4.4 },
          { name: "?腹", lat: 25.1257, lng: 121.4671, km: 6.0 },
          { name: "敹儔", lat: 25.1308, lng: 121.4736, km: 7.3 },
          { name: "敺抵?撏?, lat: 25.1373, lng: 121.4855, km: 8.5 },
          { name: "??", lat: 25.1322, lng: 121.4985, km: 10.0 },
          { name: "憟痔", lat: 25.1257, lng: 121.5009, km: 11.0 },
          { name: "?剖撗?, lat: 25.1208, lng: 121.5052, km: 11.8 },
          { name: "?喟?", lat: 25.1147, lng: 121.5155, km: 13.0 },
          { name: "?噸", lat: 25.1086, lng: 121.5189, km: 14.0 },
          { name: "?控", lat: 25.1029, lng: 121.5221, km: 14.9 },
          { name: "憯急?", lat: 25.0928, lng: 121.5260, km: 16.1 },
          { name: "?蔬", lat: 25.0850, lng: 121.5253, km: 17.0 },
          { name: "?控", lat: 25.0712, lng: 121.5197, km: 18.9 },
          { name: "瘞?镼輯楝", lat: 25.0626, lng: 121.5193, km: 20.0 },
          { name: "??, lat: 25.0577, lng: 121.5205, km: 20.9 },
          { name: "銝剖控", lat: 25.0526, lng: 121.5204, km: 21.6 },
          { name: "?啣?頠?", lat: 25.0461, lng: 121.5169, km: 22.9 },
          { name: "?啣之?恍", lat: 25.0421, lng: 121.5176, km: 23.8 },
          { name: "銝剜迤蝝敹萄?", lat: 25.0353, lng: 121.5185, km: 24.6 },
          { name: "?梢?", lat: 25.0339, lng: 121.5285, km: 25.7 },
          { name: "憭批?璉格??砍?", lat: 25.0303, lng: 121.5360, km: 26.5 },
          { name: "憭批?", lat: 25.0327, lng: 121.5435, km: 27.6 },
          { name: "靽∠儔摰?", lat: 25.0331, lng: 121.5527, km: 28.4 },
          { name: "?啣?101/銝窒", lat: 25.0334, lng: 121.5650, km: 29.5 },
          { name: "鞊∪控", lat: 25.0327, lng: 121.5705, km: 30.3 },
        ],
        // 瘛⊥偌靽∠儔蝺??挾(蝝邦??控)瘝輻??菜楚瘞渡?擃,?控隞亙?
        // ?冽挾?唬???皜∠??祈澈?臬銝?蝡?憭曉?拇挾擃銋???
        grades: [
          { from: 1.0,  to: 5.0,  type: "elevated",    note: "蝝邦?姘??擃" },
          { from: 5.0,  to: 6.8,  type: "tunnel",      note: "?腹 ?折?(蝛輯??腹銝)" },
          { from: 6.8,  to: 18.0, type: "elevated",    note: "敹儔??撅?擃" },
          { from: 19.5, to: 30.3, type: "underground", note: "瘞?镼輯楝?情撅??唬?" },
        ],
      },
      {
        id: "TPE-Blue",
        name: "?啣??琿??踹?蝺?,
        nameEn: "Taipei Metro Bannan Line",
        color: "#1763b8",
        category: "Metro",
        directions: { up: "镼輯? (敺??)", down: "?梯? (敺?葛撅汗擗?" },
        stations: [
          { name: "??", lat: 24.9606, lng: 121.4193, km: 0 },
          { name: "瘞詨祐", lat: 24.9667, lng: 121.4361, km: 1.7 },
          { name: "??", lat: 24.9728, lng: 121.4439, km: 2.7 },
          { name: "瘚瑕控", lat: 24.9858, lng: 121.4486, km: 4.2 },
          { name: "鈭?恍", lat: 24.9986, lng: 121.4528, km: 5.8 },
          { name: "摨葉", lat: 25.0083, lng: 121.4592, km: 7.0 },
          { name: "?踵?", lat: 25.0144, lng: 121.4637, km: 7.7 },
          { name: "?啣?", lat: 25.0218, lng: 121.4685, km: 8.7 },
          { name: "瘙?蝧?, lat: 25.0306, lng: 121.4717, km: 10.0 },
          { name: "樴控撖?, lat: 25.0353, lng: 121.4998, km: 13.0 },
          { name: "镼輸?", lat: 25.0420, lng: 121.5081, km: 14.2 },
          { name: "?啣?頠?", lat: 25.0461, lng: 121.5169, km: 15.5 },
          { name: "??撖?, lat: 25.0451, lng: 121.5236, km: 16.1 },
          { name: "敹??啁?", lat: 25.0420, lng: 121.5331, km: 17.2 },
          { name: "敹?敺抵?", lat: 25.0418, lng: 121.5436, km: 18.3 },
          { name: "敹??血?", lat: 25.0415, lng: 121.5512, km: 19.0 },
          { name: "?蝝敹菟尹", lat: 25.0413, lng: 121.5577, km: 19.6 },
          { name: "撣摨?, lat: 25.0412, lng: 121.5658, km: 20.5 },
          { name: "瘞豢", lat: 25.0407, lng: 121.5762, km: 21.6 },
          { name: "敺控??, lat: 25.0454, lng: 121.5828, km: 22.5 },
          { name: "?", lat: 25.0509, lng: 121.5945, km: 23.7 },
          { name: "?葛", lat: 25.0524, lng: 121.6071, km: 24.9 },
          { name: "?葛撅汗擗?, lat: 25.0556, lng: 121.6175, km: 25.9 },
        ],
        // ?踹?蝺????唬?蝡???瘞詨祐/?? 擃 ??瘚瑕控隞交?冽挾?唬???
        grades: [
          { from: 0,   to: 0.8,  type: "underground", note: "?? ?唬?" },
          { from: 0.8, to: 3.2,  type: "elevated",    note: "瘞詨祐????擃" },
          { from: 3.2, to: 25.9, type: "underground", note: "瘚瑕控??皜臬?閬賡尹 ?唬?" },
        ],
      },
      {
        id: "TPE-Green",
        name: "?啣??琿??曉控?啣?蝺?,
        nameEn: "Taipei Metro Songshan-Xindian Line",
        color: "#0e8c4a",
        directions: { up: "?? (敺?啣?)", down: "?? (敺?曉控)" },
        category: "Metro",
        stations: [
          { name: "?啣?", lat: 24.9577, lng: 121.5384, km: 0 },
          { name: "?啣???祆?", lat: 24.9670, lng: 121.5417, km: 1.0 },
          { name: "銝撐", lat: 24.9728, lng: 121.5417, km: 1.7 },
          { name: "憭批??, lat: 24.9826, lng: 121.5413, km: 2.9 },
          { name: "?舐?", lat: 24.9925, lng: 121.5412, km: 4.0 },
          { name: "?祇?", lat: 25.0023, lng: 121.5395, km: 5.1 },
          { name: "?祇尹", lat: 25.0144, lng: 121.5346, km: 6.6 },
          { name: "?圈憭扳?", lat: 25.0244, lng: 121.5285, km: 7.9 },
          { name: "?支滬", lat: 25.0270, lng: 121.5226, km: 8.6 },
          { name: "銝剜迤蝝敹萄?", lat: 25.0353, lng: 121.5185, km: 9.6 },
          { name: "撠??", lat: 25.0381, lng: 121.5108, km: 10.4 },
          { name: "镼輸?", lat: 25.0420, lng: 121.5081, km: 11.0 },
          { name: "??", lat: 25.0490, lng: 121.5103, km: 11.9 },
          { name: "銝剖控", lat: 25.0526, lng: 121.5204, km: 13.1 },
          { name: "?暹??漪", lat: 25.0524, lng: 121.5326, km: 14.5 },
          { name: "?漪敺抵?", lat: 25.0521, lng: 121.5440, km: 15.7 },
          { name: "?啣?撠楊??, lat: 25.0520, lng: 121.5512, km: 16.5 },
          { name: "?漪銝?", lat: 25.0517, lng: 121.5681, km: 18.3 },
          { name: "?曉控", lat: 25.0497, lng: 121.5774, km: 19.4 },
        ],
        // ?曉控?啣?蝺??啣??箏銝?,?挾(?啣???祆??擗?瘝輻?楝??
        // 擃,?支滬隞亙??冽挾?唬???
        grades: [
          { from: 0,   to: 0.5,  type: "underground", note: "?啣? ?唬?" },
          { from: 0.5, to: 7.5,  type: "elevated",    note: "?啣???祆??擗?擃" },
          { from: 7.5, to: 19.4, type: "underground", note: "?支滬?撅??唬?" },
        ],
      },
      {
        id: "TPE-Brown",
        name: "?啣??琿???蝺?,
        nameEn: "Taipei Metro Wenhu Line",
        color: "#a8744f",
        category: "Metro",
        directions: { up: "?? (敺???", down: "?? (敺?葛撅汗擗?" },
        stations: [
          { name: "???, lat: 24.9988, lng: 121.5793, km: 0 },
          { name: "?冽", lat: 25.0001, lng: 121.5683, km: 1.2 },
          { name: "?祈蝷曉?", lat: 25.0021, lng: 121.5713, km: 1.9 },
          { name: "?祈?恍", lat: 25.0010, lng: 121.5582, km: 3.0 },
          { name: "颲漸", lat: 25.0050, lng: 121.5495, km: 4.0 },
          { name: "暻?", lat: 25.0144, lng: 121.5547, km: 5.0 },
          { name: "?剖撐??, lat: 25.0233, lng: 121.5535, km: 6.0 },
          { name: "蝘?憭扳?", lat: 25.0260, lng: 121.5435, km: 7.2 },
          { name: "憭批?", lat: 25.0327, lng: 121.5435, km: 7.9 },
          { name: "敹?敺抵?", lat: 25.0418, lng: 121.5436, km: 8.9 },
          { name: "?漪敺抵?", lat: 25.0521, lng: 121.5440, km: 10.0 },
          { name: "銝剖控?葉", lat: 25.0612, lng: 121.5443, km: 11.0 },
          { name: "?曉控璈", lat: 25.0631, lng: 121.5520, km: 11.9 },
          { name: "憭抒", lat: 25.0795, lng: 121.5471, km: 13.6 },
          { name: "??頝?, lat: 25.0843, lng: 121.5556, km: 14.5 },
          { name: "镼踵?", lat: 25.0820, lng: 121.5664, km: 15.8 },
          { name: "皜臬?", lat: 25.0806, lng: 121.5752, km: 16.7 },
          { name: "?噸", lat: 25.0775, lng: 121.5859, km: 17.7 },
          { name: "?扳?", lat: 25.0838, lng: 121.5944, km: 18.7 },
          { name: "憭扳??砍?", lat: 25.0840, lng: 121.6020, km: 19.5 },
          { name: "?急散", lat: 25.0721, lng: 121.6075, km: 21.1 },
          { name: "?望?", lat: 25.0668, lng: 121.6152, km: 22.0 },
          { name: "?葛頠???", lat: 25.0596, lng: 121.6155, km: 23.0 },
          { name: "?葛撅汗擗?, lat: 25.0556, lng: 121.6175, km: 24.0 },
        ],
        // ??蝺?銝剝???:憭折?????撅望??氯之???剜挾?唬???
        // (蝛輯??曉控璈頝?)??
        grades: [
          { from: 0,    to: 11.5, type: "elevated",    note: "??葉撅勗?銝?擃" },
          { from: 11.5, to: 14.0, type: "underground", note: "?曉控璈?之???唬?" },
          { from: 14.0, to: 24.0, type: "elevated",    note: "??頝胼?皜臬?閬賡尹 擃" },
        ],
      },
      {
        id: "TPE-Yellow",
        name: "?啣??琿?銝剖??啗?蝺?,
        nameEn: "Taipei Metro Zhonghe-Xinlu Line",
        color: "#dfa226",
        category: "Metro",
        directions: { up: "?? (敺?散)", down: "?? (敺?閫?" },
        stations: [
          { name: "?閫?, lat: 24.9883, lng: 121.5099, km: 0 },
          { name: "?臬?", lat: 24.9929, lng: 121.5054, km: 1.0 },
          { name: "瘞詨?撣", lat: 25.0014, lng: 121.5081, km: 2.0 },
          { name: "?漯", lat: 25.0143, lng: 121.5152, km: 3.6 },
          { name: "?支滬", lat: 25.0270, lng: 121.5226, km: 5.4 },
          { name: "?梢?", lat: 25.0339, lng: 121.5285, km: 6.5 },
          { name: "敹??啁?", lat: 25.0420, lng: 121.5331, km: 7.6 },
          { name: "?暹??漪", lat: 25.0524, lng: 121.5326, km: 8.8 },
          { name: "銵予摰?, lat: 25.0613, lng: 121.5326, km: 9.8 },
          { name: "銝剖控??", lat: 25.0703, lng: 121.5260, km: 11.0 },
          { name: "瘞?镼輯楝", lat: 25.0626, lng: 121.5193, km: 12.0 },
          { name: "憭扳???, lat: 25.0635, lng: 121.5106, km: 13.0 },
          { name: "銝???", lat: 25.0703, lng: 121.4954, km: 14.4 },
          { name: "銝??葉", lat: 25.0760, lng: 121.4895, km: 15.4 },
          { name: "敺銝剖飛", lat: 25.0817, lng: 121.4830, km: 16.4 },
          { name: "銝?擃葉", lat: 25.0902, lng: 121.4799, km: 17.4 },
          { name: "?散", lat: 25.0891, lng: 121.4654, km: 19.0 },
        ],
        // 銝剖??啗?蝺??函??唬???
        grades: [
          { from: 0, to: 19.0, type: "underground", note: "?閫?瘣??冽挾?唬?" },
        ],
      },
      {
        id: "TYMRT",
        name: "獢?璈?琿?",
        nameEn: "Taoyuan Airport MRT",
        color: "#9c34a4",
        category: "Metro",
        directions: { up: "?梯? (敺?啣?頠?)", down: "镼輯? (敺?啣?)" },
        stations: [
          { name: "?啣?頠?", lat: 25.0461, lng: 121.5169, km: 0 },
          { name: "銝?", lat: 25.0596, lng: 121.4853, km: 6.4 },
          { name: "?啣??Ｘ平??", lat: 25.0631, lng: 121.4570, km: 9.4 },
          { name: "?啗??舫敹?, lat: 25.0436, lng: 121.4593, km: 11.5 },
          { name: "瘜啣控", lat: 25.0497, lng: 121.4382, km: 13.7 },
          { name: "瘜啣控鞎游?", lat: 25.0395, lng: 121.4194, km: 16.0 },
          { name: "擃憭批飛", lat: 25.0190, lng: 121.3856, km: 22.7 },
          { name: "?瑕??恍", lat: 25.0349, lng: 121.3654, km: 25.2 },
          { name: "?", lat: 25.0702, lng: 121.3608, km: 28.5 },
          { name: "撅梢撒", lat: 25.0641, lng: 121.3194, km: 31.5 },
          { name: "?", lat: 25.0699, lng: 121.2861, km: 34.4 },
          { name: "璈蝚砌??芸?", lat: 25.0773, lng: 121.2335, km: 38.7 },
          { name: "璈蝚砌??芸?", lat: 25.0732, lng: 121.2316, km: 39.5 },
          { name: "璈?尹", lat: 25.0628, lng: 121.2360, km: 40.7 },
          { name: "憭批?", lat: 25.0488, lng: 121.2102, km: 43.7 },
          { name: "璈怠控", lat: 25.0286, lng: 121.2151, km: 45.9 },
          { name: "?", lat: 25.0188, lng: 121.2329, km: 47.7 },
          { name: "擃獢?蝡?, lat: 25.0127, lng: 121.2149, km: 49.7 },
          { name: "獢?擃??", lat: 25.0064, lng: 121.2257, km: 50.9 },
          { name: "??", lat: 24.9933, lng: 121.2392, km: 52.5 },
          { name: "?啣?", lat: 24.9669, lng: 121.2256, km: 54.4 },
        ],
        // 獢?璈?琿?:?垢???蝡瑽銝?銝剜挾頧??嗥忽頞像??
        // ?亥?璈蝡臬?甈∪?唬?,?箸??游??Ｗ儔擃?喟??
        grades: [
          { from: 0,    to: 9.4,  type: "underground", note: "?啣?頠???璆剖?? ?唬?" },
          { from: 9.4,  to: 36,   type: "elevated",    note: "?啣??Ｘ平???撱? 擃" },
          { from: 36,   to: 41,   type: "underground", note: "璈蝚砌?/蝚砌??芸? ?唬?" },
          { from: 41,   to: 54.4, type: "elevated",    note: "憭批????擃" },
        ],
      },
      {
        id: "KHH-Red",
        name: "擃??琿?蝝?",
        nameEn: "Kaohsiung MRT Red Line",
        color: "#e2554b",
        category: "Metro",
        directions: { up: "?? (敺?瓷撅?", down: "?? (敺撠葛)" },
        stations: [
          { name: "?瓷撅?, lat: 22.7977, lng: 120.2941, km: 0 },
          { name: "撗∪控", lat: 22.7791, lng: 120.2905, km: 2.3 },
          { name: "璈?怨?蝡?, lat: 22.7592, lng: 120.3013, km: 5.0 },
          { name: "璈蝟?", lat: 22.7553, lng: 120.3066, km: 5.5 },
          { name: "??", lat: 22.7445, lng: 120.3107, km: 6.6 },
          { name: "?賣??砍?", lat: 22.7263, lng: 120.3125, km: 8.7 },
          { name: "璆??極?", lat: 22.7115, lng: 120.3144, km: 10.4 },
          { name: "敺?", lat: 22.6991, lng: 120.3145, km: 11.6 },
          { name: "瘝孵???", lat: 22.6868, lng: 120.3134, km: 12.9 },
          { name: "銝?", lat: 22.6873, lng: 120.3001, km: 14.6 },
          { name: "撌衣?", lat: 22.6870, lng: 120.3082, km: 15.6 },
          { name: "撌刻?", lat: 22.6726, lng: 120.3023, km: 17.2 },
          { name: "?孵?摨?, lat: 22.6603, lng: 120.3008, km: 18.5 },
          { name: "敺?", lat: 22.6521, lng: 120.3010, km: 19.4 },
          { name: "擃?頠?", lat: 22.6395, lng: 120.3023, km: 20.7 },
          { name: "蝢?撜?, lat: 22.6313, lng: 120.3022, km: 21.6 },
          { name: "銝剖亢?砍?", lat: 22.6253, lng: 120.3003, km: 22.4 },
          { name: "銝???", lat: 22.6112, lng: 120.3018, km: 23.9 },
          { name: "?", lat: 22.6014, lng: 120.3037, km: 24.9 },
          { name: "?望?", lat: 22.5921, lng: 120.3074, km: 26.0 },
          { name: "?擃葉", lat: 22.5746, lng: 120.3140, km: 28.1 },
          { name: "??", lat: 22.5651, lng: 120.3296, km: 29.9 },
          { name: "擃???璈", lat: 22.5576, lng: 120.3402, km: 31.1 },
          { name: "撠葛", lat: 22.5650, lng: 120.3576, km: 32.7 },
        ],
        // 擃??琿?蝝?:?挾撱嗡撓(?瓷撅晦????箏擃;銝餌?
        // 璆??極???皜??冽挾?唬???
        grades: [
          { from: 0,   to: 8.7,  type: "elevated",    note: "?瓷撅晦???擃(?挾撱嗡撓)" },
          { from: 8.7, to: 32.7, type: "underground", note: "璆??極???皜??唬?" },
        ],
      },
      {
        id: "KHH-Orange",
        name: "擃??琿?璈?",
        nameEn: "Kaohsiung MRT Orange Line",
        color: "#f99c2a",
        category: "Metro",
        directions: { up: "镼輯? (敺镼踹???", down: "?梯? (敺憭批祚)" },
        stations: [
          { name: "镼踹???, lat: 22.6201, lng: 120.2670, km: 0 },
          { name: "暽賢???, lat: 22.6244, lng: 120.2842, km: 1.7 },
          { name: "撣降??, lat: 22.6275, lng: 120.2942, km: 2.7 },
          { name: "蝢?撜?, lat: 22.6313, lng: 120.3022, km: 3.6 },
          { name: "靽∠儔??", lat: 22.6325, lng: 120.3168, km: 5.0 },
          { name: "??銝剖?", lat: 22.6310, lng: 120.3267, km: 6.0 },
          { name: "鈭???, lat: 22.6296, lng: 120.3411, km: 7.4 },
          { name: "??尹", lat: 22.6276, lng: 120.3534, km: 8.6 },
          { name: "銵郎??, lat: 22.6249, lng: 120.3622, km: 9.6 },
          { name: "曈喳控镼輻?", lat: 22.6266, lng: 120.3531, km: 11.5 },
          { name: "曈喳控", lat: 22.6266, lng: 120.3601, km: 12.5 },
          { name: "憭扳", lat: 22.6266, lng: 120.3681, km: 13.3 },
          { name: "曈喳控?葉", lat: 22.6196, lng: 120.3801, km: 15.0 },
          { name: "憭批祚", lat: 22.6055, lng: 120.3954, km: 17.2 },
        ],
        // 擃??琿?璈?:?冽挾?唬???
        grades: [
          { from: 0, to: 17.2, type: "underground", note: "镼踹???之撖??冽挾?唬?" },
        ],
      },
      {
        id: "KHH-LRT",
        name: "擃??啁?頛?",
        nameEn: "Kaohsiung Circular LRT",
        color: "#5dbb46",
        category: "LRT",
        directions: { up: "??", down: "??" },
        stations: [
          { name: "蝐砌???, lat: 22.5985, lng: 120.3134, km: 0 },
          { name: "?望??", lat: 22.5965, lng: 120.3047, km: 1.0 },
          { name: "?銋?", lat: 22.5948, lng: 120.2974, km: 1.8 },
          { name: "?望?銝剛", lat: 22.6012, lng: 120.2950, km: 2.5 },
          { name: "憭Ｘ?隞?, lat: 22.5983, lng: 120.3068, km: 3.4 },
          { name: "蝬窒??", lat: 22.6068, lng: 120.2951, km: 4.5 },
          { name: "頠???", lat: 22.6175, lng: 120.2902, km: 5.8 },
          { name: "擃?撅汗擗?, lat: 22.6068, lng: 120.2884, km: 6.8 },
          { name: "擃??擗?, lat: 22.6125, lng: 120.2891, km: 7.6 },
          { name: "??蝣潮", lat: 22.6188, lng: 120.2842, km: 8.3 },
          { name: "擏?憭抒儔", lat: 22.6196, lng: 120.2774, km: 9.0 },
          { name: "擏??祈?", lat: 22.6209, lng: 120.2747, km: 9.5 },
          { name: "???, lat: 22.6188, lng: 120.2696, km: 10.1 },
        ],
      },
      {
        id: "Tamsui-LRT",
        name: "瘛⊥絲頛?",
        nameEn: "Danhai LRT",
        color: "#48a4cf",
        category: "LRT",
        directions: { up: "?? (敺撏?)", down: "?? (敺蝝邦??" },
        stations: [
          { name: "蝝邦??, lat: 25.1547, lng: 121.4598, km: 0 },
          { name: "蝡輯???, lat: 25.1614, lng: 121.4523, km: 1.0 },
          { name: "瘛⊿??批", lat: 25.1685, lng: 121.4499, km: 1.8 },
          { name: "瘛⊿??", lat: 25.1734, lng: 121.4519, km: 2.5 },
          { name: "?啣?銝頝?, lat: 25.1801, lng: 121.4571, km: 3.4 },
          { name: "瞈望絲蝢拙控", lat: 25.1844, lng: 121.4513, km: 4.3 },
          { name: "瞈望絲瘝?", lat: 25.1908, lng: 121.4475, km: 5.2 },
          { name: "撏?", lat: 25.1812, lng: 121.4393, km: 6.5 },
        ],
      },
    ],
    trainTemplates: [
      // TRA West ??various types. accel/decel in m/s簡; aLat is the lateral
      // comfort cap (m/s簡) used to derive curve speed limits. dwellSec is the
      // default per non-endpoint stop.
      { line: "TRA-West", type: "?芸撥", badge: "?芸撥", badgeColor: "#f87171", speed: 90,  interval: 30, accel: 0.55, decel: 0.55, aLat: 0.65, dwellSec: 45 },
      { line: "TRA-West", type: "??", badge: "??", badgeColor: "#fbbf24", speed: 75,  interval: 60, accel: 0.45, decel: 0.50, aLat: 0.55, dwellSec: 60 },
      { line: "TRA-West", type: "???, badge: "???, badgeColor: "#60a5fa", speed: 55,  interval: 20, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      // TRA Coast ??瘚瑞? has fewer ?芸撥 services and more ?????翰 than 撅梁?.
      { line: "TRA-Coast", type: "?芸撥",   badge: "?芸撥",   badgeColor: "#f87171", speed: 85, interval: 60, accel: 0.55, decel: 0.55, aLat: 0.65, dwellSec: 45 },
      { line: "TRA-Coast", type: "??翰", badge: "??翰", badgeColor: "#38bdf8", speed: 70, interval: 60, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      { line: "TRA-Coast", type: "???,   badge: "???,   badgeColor: "#60a5fa", speed: 55, interval: 30, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      // THSR ??non-tilting high-speed
      { line: "THSR",     type: "擃", badge: "HSR",  badgeColor: "#6ee7b7", speed: 260, interval: 15, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      // TRA East ??Taroko / Puyuma are tilting EMUs, hence higher aLat.
      { line: "TRA-East", type: "憭芷陌??, badge: "憭芷陌??, badgeColor: "#a78bfa", speed: 110, interval: 90, accel: 0.65, decel: 0.65, aLat: 1.30, dwellSec: 45 },
      { line: "TRA-East", type: "?格???, badge: "?格???, badgeColor: "#34d399", speed: 110, interval: 90, accel: 0.65, decel: 0.65, aLat: 1.30, dwellSec: 45 },
      { line: "TRA-East", type: "?芸撥",   badge: "?芸撥",   badgeColor: "#f87171", speed: 95,  interval: 45, accel: 0.55, decel: 0.55, aLat: 0.65, dwellSec: 45 },
      { line: "TRA-East", type: "???,   badge: "???,   badgeColor: "#60a5fa", speed: 60,  interval: 30, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      // TRA branches
      { line: "TRA-South-Link", type: "?芸撥", badge: "?芸撥", badgeColor: "#f87171", speed: 90, interval: 60, accel: 0.55, decel: 0.55, aLat: 0.65, dwellSec: 45 },
      { line: "TRA-South-Link", type: "???, badge: "???, badgeColor: "#60a5fa", speed: 55, interval: 90, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      { line: "TRA-Pingxi",     type: "???, badge: "???, badgeColor: "#60a5fa", speed: 30, interval: 60, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 45 },
      { line: "TRA-Neiwan",     type: "???, badge: "???, badgeColor: "#60a5fa", speed: 45, interval: 30, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      { line: "TRA-Jiji",       type: "???, badge: "???, badgeColor: "#60a5fa", speed: 45, interval: 60, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      { line: "TRA-Shalun",     type: "???, badge: "???, badgeColor: "#60a5fa", speed: 50, interval: 30, accel: 0.85, decel: 0.90, aLat: 0.65, dwellSec: 30 },
      { line: "Alishan-Forest", type: "?輸?撅梯?", badge: "?輸?撅?, badgeColor: "#22c55e", speed: 25, interval: 240, accel: 0.40, decel: 0.50, aLat: 0.45, dwellSec: 60 },
      // Taipei Metro
      { line: "TPE-Red",    type: "?琿?", badge: "蝝?,   badgeColor: "#e2554b", speed: 60, interval: 6, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "TPE-Blue",   type: "?琿?", badge: "??,   badgeColor: "#1763b8", speed: 60, interval: 5, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "TPE-Green",  type: "?琿?", badge: "蝬?,   badgeColor: "#0e8c4a", speed: 60, interval: 6, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "TPE-Brown",  type: "?琿?", badge: "??", badgeColor: "#a8744f", speed: 50, interval: 4, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 20 },
      { line: "TPE-Yellow", type: "?琿?", badge: "暺?,   badgeColor: "#dfa226", speed: 60, interval: 7, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      // Taoyuan Airport MRT
      { line: "TYMRT", type: "?桅?", badge: "?桅?, badgeColor: "#9c34a4", speed: 70,  interval: 15, accel: 0.90, decel: 1.00, aLat: 0.95, dwellSec: 30 },
      { line: "TYMRT", type: "?湧?頠?, badge: "?湧?", badgeColor: "#c084fc", speed: 100, interval: 30, accel: 0.90, decel: 1.00, aLat: 0.95, dwellSec: 30 },
      // Kaohsiung MRT
      { line: "KHH-Red",    type: "?琿?", badge: "蝝?, badgeColor: "#e2554b", speed: 60, interval: 8, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "KHH-Orange", type: "?琿?", badge: "璈?, badgeColor: "#f99c2a", speed: 60, interval: 8, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      // LRT
      { line: "KHH-LRT",    type: "頛?", badge: "頛?", badgeColor: "#5dbb46", speed: 30, interval: 12, accel: 0.80, decel: 0.90, aLat: 0.80, dwellSec: 20 },
      { line: "Tamsui-LRT", type: "頛?", badge: "頛?", badgeColor: "#48a4cf", speed: 30, interval: 15, accel: 0.80, decel: 0.90, aLat: 0.80, dwellSec: 20 },
    ],
  },

  japan: {
    label: "?交 Japan",
    center: [35.68, 139.76],
    zoom: 9,
    lines: [
      {
        id: "Tokaido-Shinkansen",
        name: "?望絲?撟寧?",
        nameEn: "Tokaido Shinkansen",
        color: "#6ee7b7",
        category: "HSR",
        directions: { up: "銝? (?曹漪?寥)", down: "銝? (?啣之?芣??" },
        stations: [
          { name: "?曹漪", lat: 35.6812, lng: 139.7671, km: 0 },
          { name: "??", lat: 35.6285, lng: 139.7387, km: 6.8, dwellSec: 60 },
          { name: "?唳赤瘚?, lat: 35.5075, lng: 139.6175, km: 28.8 },
          { name: "撠??, lat: 35.2562, lng: 139.1552, km: 83.9 },
          { name: "?望絲", lat: 35.1036, lng: 139.0783, km: 104.6 },
          { name: "銝雀", lat: 35.1260, lng: 138.9115, km: 120.7 },
          { name: "?瓷", lat: 34.9718, lng: 138.3891, km: 180.2 },
          { name: "瘚", lat: 34.7035, lng: 137.7346, km: 257.1 },
          { name: "?撅?, lat: 35.1709, lng: 136.8815, km: 366.0, dwellSec: 90 },
          { name: "鈭祇", lat: 34.9858, lng: 135.7588, km: 513.6 },
          { name: "?啣之??, lat: 34.7335, lng: 135.5002, km: 552.6 },
        ],
        // ?望絲?撟寧?:?函?蝝?73% 擃,18% ?折?,9% 頝臬???Ｗ璅??
        // 銝餉??琿???唬號???砍?);?園??剝???
        grades: [
          { from: 0,   to: 96,    type: "elevated",    note: "?曹漪???啣? 擃(銝駁?)" },
          { from: 96,  to: 104,   type: "tunnel",      note: "?唬號????喋???蝝?8 km)" },
          { from: 104, to: 190,   type: "elevated",    note: "?望絲??撗?擃/頝臬" },
          { from: 190, to: 192.5, type: "tunnel",      note: "?交???喋???蝝?2.2 km)" },
          { from: 192.5, to: 552.6, type: "elevated",  note: "?瓷?憭折 擃(銝駁?)" },
        ],
      },
      {
        id: "JR-Yamanote",
        name: "撅望?蝺?,
        nameEn: "JR Yamanote Line",
        color: "#34d399",
        category: "TRA",
        directions: { up: "憭???(瞉靚猾??啣挪??鋡?", down: "????(瘙??摰踱?瞉靚?" },
        stations: [
          { name: "?曹漪", lat: 35.6812, lng: 139.7671, km: 0 },
          { name: "蟡", lat: 35.6917, lng: 139.7709, km: 1.3 },
          { name: "蝘???, lat: 35.6983, lng: 139.7731, km: 2.0 },
          { name: "銝?", lat: 35.7139, lng: 139.7770, km: 3.6 },
          { name: "?交??, lat: 35.7278, lng: 139.7709, km: 5.8 },
          { name: "瘙?", lat: 35.7295, lng: 139.7109, km: 11.4 },
          { name: "?啣挪", lat: 35.6896, lng: 139.7006, km: 15.9 },
          { name: "皜健", lat: 35.6580, lng: 139.7016, km: 20.2 },
          { name: "?菜?撖?, lat: 35.6466, lng: 139.7101, km: 21.8 },
          { name: "??", lat: 35.6285, lng: 139.7387, km: 26.0 },
          { name: "?啁", lat: 35.6457, lng: 139.7474, km: 28.3 },
          { name: "瘚??, lat: 35.6553, lng: 139.7573, km: 29.6 },
          { name: "?末??, lat: 35.6749, lng: 139.7631, km: 31.0 },
          { name: "?曹漪", lat: 35.6812, lng: 139.7671, km: 34.5 },
        ],
        // 撅望?蝺??曹漪?賢??啁?,憭批?頝舀挾?粹???頝臬(?曹漪-?唳???蝤?
        // 擃璈 1910 撟湔窒?刻隞??蝪∪?,?渡閬 elevated??
        grades: [
          { from: 0, to: 34.5, type: "elevated", note: "撅望??啁? 憭折????頝臬" },
        ],
      },
      {
        id: "JR-Chuo",
        name: "銝剖亢蝺?,
        nameEn: "JR Chuo Rapid Line",
        color: "#fbbf24",
        category: "TRA",
        directions: { up: "銝? (敺?曹漪)", down: "銝? (敺擃偏)" },
        stations: [
          { name: "?曹漪", lat: 35.6812, lng: 139.7671, km: 0 },
          { name: "蟡", lat: 35.6917, lng: 139.7709, km: 1.3 },
          { name: "敺∟?偌", lat: 35.6993, lng: 139.7630, km: 2.6 },
          { name: "??靚?, lat: 35.6862, lng: 139.7302, km: 6.6 },
          { name: "?啣挪", lat: 35.6896, lng: 139.7006, km: 10.3 },
          { name: "銝剝?", lat: 35.7064, lng: 139.6659, km: 14.7 },
          { name: "銝溯", lat: 35.7028, lng: 139.5604, km: 24.1 },
          { name: "?賢?撖?, lat: 35.7006, lng: 139.4803, km: 31.4 },
          { name: "蝡?", lat: 35.6983, lng: 139.4140, km: 37.5 },
          { name: "?怎?摮?, lat: 35.6558, lng: 139.3390, km: 47.4 },
          { name: "擃偏", lat: 35.6429, lng: 139.2869, km: 52.4 },
        ],
        // 銝剖亢蝺翰???曹漪-蝡? ?箄??葉憭桃????擃?極蝔?
        // (銝溯-蝡?畾?2010 撟游?撌?,?曹漪-銝溯 ?拙歇擃??撌誑镼?
        // ?箏像??頝臬,?芰敦璅?
        grades: [
          { from: 0, to: 37.5, type: "elevated", note: "?曹漪??撌????擃??" },
        ],
      },
      {
        id: "Sanyo-Shinkansen",
        name: "撅梢?啣凳蝺?,
        nameEn: "Sany? Shinkansen",
        color: "#0ea5e9",
        category: "HSR",
        directions: { up: "銝? (?啣之?芣??", down: "銝? (???寥)" },
        // 撅梢?啣凳蝺??啣之?芬??? 19 擏?553.7 km???准銵刻??憭折隞交
        // ?湧瘚琿??啣凳蝺?憭誑???撌撟寧?(?祈”?芾??控?質頨???
        stations: [
          { name: "?啣之??,   lat: 34.7335, lng: 135.5002, km: 0,    dwellSec: 90 },
          { name: "?啁???,   lat: 34.7065, lng: 135.1956, km: 32.7 },
          { name: "镼踵???,   lat: 34.6669, lng: 134.9604, km: 53.2 },
          { name: "憪怨楝",     lat: 34.8264, lng: 134.6908, km: 86.8 },
          { name: "?貊?",     lat: 34.8183, lng: 134.4740, km: 105.9 },
          { name: "撗∪控",     lat: 34.6668, lng: 133.9183, km: 164.8, dwellSec: 60 },
          { name: "?啣",   lat: 34.5653, lng: 133.6785, km: 187.3 },
          { name: "蝳控",     lat: 34.4893, lng: 133.3619, km: 217.8 },
          { name: "?啣偏??,   lat: 34.4301, lng: 133.1903, km: 235.1 },
          { name: "銝?",     lat: 34.4008, lng: 133.0833, km: 245.8 },
          { name: "?勗?撜?,   lat: 34.3889, lng: 132.7589, km: 280.7 },
          { name: "摨雀",     lat: 34.3985, lng: 132.4754, km: 309.8, dwellSec: 60 },
          { name: "?啣痔??,   lat: 34.1646, lng: 132.1495, km: 348.4 },
          { name: "敺喳控",     lat: 34.0511, lng: 131.8021, km: 391.0 },
          { name: "?啣控??,   lat: 34.0931, lng: 131.3970, km: 432.6 },
          { name: "?",     lat: 34.0534, lng: 131.1598, km: 465.6 },
          { name: "?唬???,   lat: 34.0082, lng: 130.9493, km: 490.1 },
          { name: "撠?,     lat: 33.8868, lng: 130.8825, km: 509.5, dwellSec: 60 },
          { name: "??",     lat: 33.5900, lng: 130.4204, km: 553.7, dwellSec: 90 },
        ],
        // 撅梢?啣凳蝺?蝝??貉楝畾萇撅勗眾??(?剔?駁??餅蟡??蝑?
        // 憭??琿?????Ｗ璅?誨銵冽批?畾??園??折????嗆蝝啣???
        grades: [
          { from: 25,    to: 35,    type: "tunnel",   note: "?剔?? (蝝?16 km, 頝冽蟡隞?)" },
          { from: 480,   to: 495,   type: "tunnel",   note: "?圈??? (蝝?18.7 km, 瘚瑕?)" },
        ],
      },
      {
        id: "Nishi-Kyushu-Shinkansen",
        name: "镼蹂?撌撟寧?",
        nameEn: "Nishi Kyushu Shinkansen",
        color: "#e11d48",
        category: "HSR",
        directions: { up: "銝? (甇阡?皜拇??寥)", down: "銝? (?瑕??寥)" },
        // 镼蹂?撌撟寧?:甇阡?皜拇??撏?5 擏?蝝?66 km?allback km is
        // line-length scaled; generated OSM stationKms replace it for runtime.
        stations: [
          { name: "甇阡?皜拇?", lat: 33.1964792, lng: 130.0230661, km: 0,    dwellSec: 60 },
          { name: "戭?皜拇?", lat: 33.1066719, lng: 129.9989438, km: 10.9 },
          { name: "?啣之??,   lat: 32.9329805, lng: 129.9570496, km: 32.2 },
          { name: "隢急",     lat: 32.8515808, lng: 130.0414370, km: 44.7, dwellSec: 60 },
          { name: "?瑕?",     lat: 32.7521727, lng: 129.8688815, km: 66.0, dwellSec: 90 },
        ],
      },
      {
        id: "JR-Osaka-Loop",
        name: "憭折?啁蝺?,
        nameEn: "JR Osaka Loop Line",
        color: "#f97316",
        category: "TRA",
        directions: { up: "憭???(憭拍?撖箸??蝯 镼?", down: "????(憭拍?撖箸??蝯 ??" },
        // 憭折?啁蝺??券 21.7 km ?啁??祕???之??頠楊??憭批?頝舐?
        // (憟?孵?) ???芸?蝺?(?Ｚ正蝛箸葛?孵?);?祈”?芾???芾澈??
        // 隞乓之?芥?券?:蝚砌?蝡??敺?蝡???銵函內???
        stations: [
          { name: "憭折",         lat: 34.7025, lng: 135.4959, km: 0,    dwellSec: 30 },
          { name: "蝳雀",         lat: 34.6951, lng: 135.4880, km: 1.0 },
          { name: "?",         lat: 34.6925, lng: 135.4753, km: 1.9 },
          { name: "镼蹂???,       lat: 34.6802, lng: 135.4644, km: 3.4 },
          { name: "撘予??,       lat: 34.6650, lng: 135.4616, km: 5.4 },
          { name: "憭扳迤",         lat: 34.6585, lng: 135.4760, km: 7.4 },
          { name: "?血?璈?,       lat: 34.6494, lng: 135.4960, km: 8.5 },
          { name: "隞悅",         lat: 34.6491, lng: 135.5045, km: 9.4 },
          { name: "?唬?摰?,       lat: 34.6498, lng: 135.5066, km: 10.0 },
          { name: "憭拍?撖?,       lat: 34.6463, lng: 135.5142, km: 11.0, dwellSec: 30 },
          { name: "撖箇??,       lat: 34.6519, lng: 135.5256, km: 12.0 },
          { name: "獢健",         lat: 34.6601, lng: 135.5269, km: 12.9 },
          { name: "曊湔?",         lat: 34.6658, lng: 135.5294, km: 13.9 },
          { name: "??,         lat: 34.6747, lng: 135.5304, km: 14.9 },
          { name: "璉柴?摰?,       lat: 34.6802, lng: 135.5320, km: 15.8 },
          { name: "憭折???,   lat: 34.6881, lng: 135.5346, km: 16.7 },
          { name: "鈭祆?",         lat: 34.6968, lng: 135.5343, km: 17.5, dwellSec: 30 },
          { name: "獢?摰?,       lat: 34.7022, lng: 135.5179, km: 19.0 },
          { name: "憭拇?",         lat: 34.7042, lng: 135.5083, km: 20.4 },
          { name: "憭折",         lat: 34.7025, lng: 135.4959, km: 21.7, dwellSec: 30 },
        ],
        // 憭折?啁蝺??函?擃 / 頝臬,?∪?頝舫??嗅??極蝔?雿?閬箔?
        // ?渡?粹撣??嗚陛??桐? elevated ?畾萸?
        grades: [
          { from: 0, to: 21.7, type: "elevated", note: "憭折?啁蝺??函擃 / 頝臬" },
        ],
      },
      {
        id: "Osaka-Metro-Midosuji",
        name: "憭折?～??剖鴃??蝺?,
        nameEn: "Osaka Metro Mid?suji Line",
        color: "#dc2626",
        category: "?琿?",
        directions: { up: "銝? (瘙??寥)", down: "銝? (?芥????寥)" },
        // 憭折?～???M 蝺?瘙??????24.5 km???誑????之?芣亥?
        // (??銝剖亢?孵?),?祈”?芾??鴃???芣??畾萸?
        stations: [
          { name: "瘙?",         lat: 34.7592, lng: 135.4979, km: 0,    dwellSec: 30 },
          { name: "?曹???,       lat: 34.7480, lng: 135.4974, km: 1.5 },
          { name: "?啣之??,       lat: 34.7330, lng: 135.5004, km: 2.5, dwellSec: 30 },
          { name: "镼蹂葉撜嗅???,   lat: 34.7253, lng: 135.4999, km: 3.5 },
          { name: "銝剜揖",         lat: 34.7100, lng: 135.4961, km: 5.3 },
          { name: "璇",         lat: 34.7039, lng: 135.4988, km: 6.3, dwellSec: 30 },
          { name: "瘛撅?",       lat: 34.6928, lng: 135.5009, km: 7.6 },
          { name: "?祉",         lat: 34.6826, lng: 135.4998, km: 8.4 },
          { name: "敹?璈?,       lat: 34.6730, lng: 135.4993, km: 9.4 },
          { name: "??郭",         lat: 34.6655, lng: 135.5012, km: 10.6, dwellSec: 30 },
          { name: "憭批??,       lat: 34.6531, lng: 135.4994, km: 11.9 },
          { name: "???",     lat: 34.6479, lng: 135.5039, km: 13.1 },
          { name: "憭拍?撖?,       lat: 34.6463, lng: 135.5142, km: 13.8, dwellSec: 30 },
          { name: "?剖???,       lat: 34.6321, lng: 135.5191, km: 15.4 },
          { name: "镼輻颲?,       lat: 34.6217, lng: 135.5171, km: 16.7 },
          { name: "?瑕?",         lat: 34.6107, lng: 135.5170, km: 17.9 },
          { name: "???,       lat: 34.5980, lng: 135.5168, km: 19.4 },
          { name: "???,       lat: 34.5836, lng: 135.5126, km: 21.0 },
          { name: "?圈?撗?,       lat: 34.5705, lng: 135.5128, km: 22.5 },
          { name: "?芥???",     lat: 34.5566, lng: 135.5048, km: 24.5, dwellSec: 30 },
        ],
      },
      {
        id: "Hankyu-Kobe",
        name: "?芣亦??豢蝺?,
        nameEn: "Hanky贖 K?be Main Line",
        color: "#7c1d10",
        category: "TRA",
        directions: { up: "銝? (憭折璇?寥)", down: "銝? (蟡銝悅?寥)" },
        // ?芣仿??蟡?祉?:憭折璇???訾?摰?32.3 km?銵函?寞亙?蝡?
        // 銝餉? 16 蝡??憭??撟脩?,?誑?寞亙?頠皞?蝺?
        stations: [
          { name: "憭折璇",     lat: 34.7058, lng: 135.4974, km: 0,    dwellSec: 30 },
          { name: "銝剜揖",         lat: 34.7152, lng: 135.4963, km: 0.9 },
          { name: "??",         lat: 34.7204, lng: 135.4847, km: 2.4, dwellSec: 30 },
          { name: "蟡?撌?,       lat: 34.7229, lng: 135.4661, km: 4.1 },
          { name: "?",         lat: 34.7338, lng: 135.4458, km: 6.3 },
          { name: "憛",         lat: 34.7384, lng: 135.4248, km: 7.9 },
          { name: "甇血澈銋?",     lat: 34.7359, lng: 135.4047, km: 9.6 },
          { name: "镼踹悅?",     lat: 34.7405, lng: 135.3556, km: 12.0, dwellSec: 30 },
          { name: "憭?",         lat: 34.7459, lng: 135.3263, km: 14.4 },
          { name: "?血?撌?,       lat: 34.7345, lng: 135.3015, km: 16.5 },
          { name: "撗⊥",         lat: 34.7287, lng: 135.2657, km: 19.6 },
          { name: "敺∪蔣",         lat: 34.7232, lng: 135.2459, km: 21.6 },
          { name: "?剔",         lat: 34.7184, lng: 135.2247, km: 23.2 },
          { name: "???砍?",     lat: 34.7113, lng: 135.2007, km: 25.6 },
          { name: "?交??",     lat: 34.7000, lng: 135.1922, km: 27.9 },
          { name: "蟡銝悅",     lat: 34.6943, lng: 135.1955, km: 32.3, dwellSec: 30 },
        ],
      },
      {
        id: "Tokyu-Toyoko",
        name: "?望交璅芰?",
        nameEn: "T?ky贖 T?yoko Line",
        color: "#c8102e",
        category: "TRA",
        directions: { up: "銝? (皜健?寥)", down: "銝? (璅芣??寥)" },
        // ?望交璅芰?:皜健?赤瘚?24.2 km??靚瑞垢?鈭研??舫敹???
        // 璅芣?蝡航??踴?具??蝺??頧?雿銵典閬??望赤?芣??畾萸?
        stations: [
          { name: "皜健",       lat: 35.6580, lng: 139.7016, km: 0,    dwellSec: 30 },
          { name: "隞??撅?,     lat: 35.6486, lng: 139.7036, km: 1.5 },
          { name: "銝剔暺?,     lat: 35.6438, lng: 139.6986, km: 2.2 },
          { name: "蟡予撖?,     lat: 35.6360, lng: 139.6918, km: 3.2 },
          { name: "摮西憭批郎",   lat: 35.6273, lng: 139.6857, km: 4.2 },
          { name: "?賜?憭批郎",   lat: 35.6166, lng: 139.6809, km: 5.6 },
          { name: "?芰??",   lat: 35.6072, lng: 139.6691, km: 7.0 },
          { name: "?啣?隤踹?",   lat: 35.5985, lng: 139.6664, km: 8.2 },
          { name: "憭撌?,     lat: 35.5933, lng: 139.6671, km: 9.0 },
          { name: "?唬虜摮?,     lat: 35.5871, lng: 139.6595, km: 10.3 },
          { name: "甇西撠?",   lat: 35.5774, lng: 139.6585, km: 10.8, dwellSec: 30 },
          { name: "????,     lat: 35.5664, lng: 139.6494, km: 12.1 },
          { name: "?亙?",       lat: 35.5547, lng: 139.6473, km: 13.6 },
          { name: "蝬勗雀",       lat: 35.5388, lng: 139.6357, km: 15.8 },
          { name: "憭批控",     lat: 35.5251, lng: 139.6258, km: 17.3 },
          { name: "??",       lat: 35.5119, lng: 139.6280, km: 18.8 },
          { name: "憒撖?,     lat: 35.5044, lng: 139.6243, km: 19.8 },
          { name: "?賣末",       lat: 35.4969, lng: 139.6262, km: 20.7 },
          { name: "?梁璆?,     lat: 35.4923, lng: 139.6275, km: 21.4 },
          { name: "?",       lat: 35.4742, lng: 139.6204, km: 22.6 },
          { name: "璅芣?",       lat: 35.4661, lng: 139.6219, km: 24.2, dwellSec: 30 },
        ],
      },
      {
        id: "JR-Sobu-Local",
        name: "蝺郎蝺?????)",
        nameEn: "JR S?bu Line (Local)",
        color: "#fde047",
        category: "TRA",
        directions: { up: "銝? (銝溯?寥)", down: "銝? (???寥)" },
        // 銝剖亢?餌?甇衣楨銵?:銝溯????60.2 km????蝡???銝剖亢蝺翰??
        // (?祈”?Ｘ? JR-Chuo) ???Local ?? 憭找?靽?/ 隞? / 靽⊥???/ 憌舐璈?
        // 蝑葉憭桀翰??蝡?
        stations: [
          { name: "銝溯",       lat: 35.7028, lng: 139.5604, km: 0,    dwellSec: 30 },
          { name: "?孕撖?,     lat: 35.7035, lng: 139.5797, km: 1.6 },
          { name: "镼輯蝒?,     lat: 35.7044, lng: 139.5995, km: 3.5 },
          { name: "?餌牧",       lat: 35.7045, lng: 139.6196, km: 5.3 },
          { name: "?蹂??梯健",   lat: 35.7050, lng: 139.6362, km: 6.7 },
          { name: "擃?撖?,     lat: 35.7059, lng: 139.6498, km: 7.8 },
          { name: "銝剝?",       lat: 35.7064, lng: 139.6659, km: 9.4 },
          { name: "?曹葉??,     lat: 35.7069, lng: 139.6839, km: 11.4 },
          { name: "憭找?靽?,     lat: 35.6997, lng: 139.6982, km: 12.7 },
          { name: "?啣挪",       lat: 35.6896, lng: 139.7006, km: 13.4, dwellSec: 30 },
          { name: "隞?",     lat: 35.6830, lng: 139.7022, km: 14.2 },
          { name: "???梯健",   lat: 35.6810, lng: 139.7113, km: 15.0 },
          { name: "靽⊥???,     lat: 35.6800, lng: 139.7204, km: 15.7 },
          { name: "??靚?,     lat: 35.6862, lng: 139.7302, km: 16.7 },
          { name: "撣靚?,     lat: 35.6909, lng: 139.7351, km: 17.4 },
          { name: "憌舐璈?,     lat: 35.7022, lng: 139.7448, km: 18.5 },
          { name: "瘞湧?璈?,     lat: 35.7022, lng: 139.7531, km: 19.3 },
          { name: "敺∟?偌",   lat: 35.6993, lng: 139.7630, km: 20.1 },
          { name: "蝘???,     lat: 35.6983, lng: 139.7731, km: 21.1 },
          { name: "瘚?璈?,     lat: 35.7011, lng: 139.7853, km: 22.0 },
          { name: "銝∪",       lat: 35.6968, lng: 139.7935, km: 22.9 },
          { name: "?衣雩??,     lat: 35.6970, lng: 139.8132, km: 24.1 },
          { name: "鈭??,       lat: 35.6979, lng: 139.8262, km: 25.4 },
          { name: "撟喃?",       lat: 35.7058, lng: 139.8404, km: 26.9 },
          { name: "?啣?撗?,     lat: 35.7166, lng: 139.8567, km: 28.7 },
          { name: "撠痔",       lat: 35.7335, lng: 139.8830, km: 31.8 },
          { name: "撣?",       lat: 35.7314, lng: 139.9088, km: 35.4, dwellSec: 30 },
          { name: "?砍撟?,     lat: 35.7218, lng: 139.9286, km: 37.5 },
          { name: "銝?銝剖控",   lat: 35.7080, lng: 139.9494, km: 39.1 },
          { name: "镼輯璈?,     lat: 35.7039, lng: 139.9684, km: 40.6 },
          { name: "?寞?",       lat: 35.7019, lng: 139.9856, km: 42.6, dwellSec: 30 },
          { name: "?梯璈?,     lat: 35.6998, lng: 140.0043, km: 44.3 },
          { name: "瘣亦瘝?,     lat: 35.6914, lng: 140.0202, km: 46.1 },
          { name: "撟撐?祇",   lat: 35.6727, lng: 140.0423, km: 48.1 },
          { name: "撟撐",       lat: 35.6593, lng: 140.0580, km: 49.8 },
          { name: "?唳?閬?",   lat: 35.6518, lng: 140.0731, km: 51.3 },
          { name: "蝔脫?",       lat: 35.6371, lng: 140.0926, km: 53.6 },
          { name: "镼踹???,     lat: 35.6227, lng: 140.1031, km: 55.0 },
          { name: "??",       lat: 35.6137, lng: 140.1125, km: 60.2, dwellSec: 30 },
        ],
      },
      {
        id: "JR-Keihin-Tohoku",
        name: "鈭祆??勗?蝺?,
        nameEn: "JR Keihin-T?hoku Line",
        color: "#60a5fa",
        category: "TRA",
        directions: { up: "?? (憭批悅?寥)", down: "?? (憭扯?寥)" },
        // 鈭祆??勗??餅撗貊? 憭批悅?之???函? 81.2 km?祕???楊 JR ?勗??祉?
        // (憭批悅?鈭? + ?望絲?蝺?(?曹漪?赤瘚? + ?孵硫蝺?(璅芣??之??,
        // ?∪?銝頝舐???,?祈”?蔥閬?桃???
        stations: [
          { name: "憭批悅",             lat: 35.9059, lng: 139.6234, km: 0,    dwellSec: 30 },
          { name: "????圈敹?,   lat: 35.8943, lng: 139.6294, km: 1.6 },
          { name: "銝?",             lat: 35.8784, lng: 139.6349, km: 2.7 },
          { name: "?策??,           lat: 35.8639, lng: 139.6444, km: 4.5 },
          { name: "瘚血?",             lat: 35.8589, lng: 139.6566, km: 6.4, dwellSec: 30 },
          { name: "?策??,           lat: 35.8419, lng: 139.6630, km: 8.6 },
          { name: "??,               lat: 35.8264, lng: 139.6800, km: 11.4 },
          { name: "镼踹???,           lat: 35.8055, lng: 139.7108, km: 14.2 },
          { name: "撌",             lat: 35.7927, lng: 139.7224, km: 15.8 },
          { name: "韏斤噬",             lat: 35.7775, lng: 139.7211, km: 18.0, dwellSec: 30 },
          { name: "?勗???,           lat: 35.7675, lng: 139.7228, km: 19.5 },
          { name: "??",             lat: 35.7530, lng: 139.7384, km: 21.4 },
          { name: "銝葉??,           lat: 35.7429, lng: 139.7468, km: 23.2 },
          { name: "?啁垢",             lat: 35.7378, lng: 139.7610, km: 24.2 },
          { name: "镼踵?桅?",         lat: 35.7320, lng: 139.7670, km: 25.2 },
          { name: "?交??,           lat: 35.7278, lng: 139.7709, km: 26.0 },
          { name: "曊航健",             lat: 35.7215, lng: 139.7783, km: 27.1 },
          { name: "銝?",             lat: 35.7139, lng: 139.7770, km: 28.0, dwellSec: 30 },
          { name: "敺∪???,           lat: 35.7074, lng: 139.7748, km: 28.6 },
          { name: "蝘???,           lat: 35.6983, lng: 139.7731, km: 29.6 },
          { name: "蟡",             lat: 35.6917, lng: 139.7709, km: 30.3 },
          { name: "?曹漪",             lat: 35.6812, lng: 139.7671, km: 31.1, dwellSec: 30 },
          { name: "?末??,           lat: 35.6749, lng: 139.7631, km: 31.7 },
          { name: "?唳?",             lat: 35.6661, lng: 139.7585, km: 32.8 },
          { name: "瘚??,           lat: 35.6553, lng: 139.7573, km: 33.9 },
          { name: "?啁",             lat: 35.6457, lng: 139.7474, km: 34.8 },
          { name: "擃憚?脯??扼", lat: 35.6358, lng: 139.7402, km: 35.7 },
          { name: "??",             lat: 35.6285, lng: 139.7387, km: 36.4, dwellSec: 30 },
          { name: "憭找???,           lat: 35.6065, lng: 139.7344, km: 39.6 },
          { name: "憭扳ㄝ",             lat: 35.5871, lng: 139.7282, km: 41.7 },
          { name: "?脩",             lat: 35.5614, lng: 139.7164, km: 44.3 },
          { name: "撌?",             lat: 35.5311, lng: 139.6967, km: 47.0, dwellSec: 30 },
          { name: "曊渲?",             lat: 35.5076, lng: 139.6766, km: 50.9 },
          { name: "?啣?摰?,           lat: 35.4948, lng: 139.6602, km: 53.4 },
          { name: "?梁?憟?",         lat: 35.4748, lng: 139.6326, km: 55.5 },
          { name: "璅芣?",             lat: 35.4661, lng: 139.6219, km: 56.6, dwellSec: 30 },
          { name: "獢??,           lat: 35.4513, lng: 139.6314, km: 57.8 },
          { name: "?Ｗ?",             lat: 35.4428, lng: 139.6391, km: 58.8 },
          { name: "?喳???,           lat: 35.4394, lng: 139.6486, km: 59.4 },
          { name: "撅望?",             lat: 35.4313, lng: 139.6526, km: 60.6 },
          { name: "?孵硫",             lat: 35.4053, lng: 139.6362, km: 62.9 },
          { name: "蝤臬?",             lat: 35.3865, lng: 139.6312, km: 65.8 },
          { name: "?唳???,           lat: 35.3733, lng: 139.6231, km: 67.4 },
          { name: "瘣???,           lat: 35.3625, lng: 139.6028, km: 70.3 },
          { name: "皜臬???,           lat: 35.3585, lng: 139.5867, km: 72.6 },
          { name: "?祇??,           lat: 35.3551, lng: 139.5670, km: 74.7 },
          { name: "憭扯",             lat: 35.3578, lng: 139.5304, km: 81.2, dwellSec: 30 },
        ],
      },
      {
        id: "Tokyo-Metro-Marunouchi",
        name: "?曹漪?～??凋虜??蝺?,
        nameEn: "Tokyo Metro Marunouchi Line",
        color: "#f43f5e",
        category: "?琿?",
        directions: { up: "A蝺?(瘙??寥)", down: "B蝺?(?餌牧?寥)" },
        // ?祈”?芸??祉? 瘙??蝒?25 蝡?(24.2 km),銝銝剝??????舐???
        stations: [
          { name: "瘙?",         lat: 35.7295, lng: 139.7109, km: 0,    dwellSec: 30 },
          { name: "?啣之憛?,       lat: 35.7314, lng: 139.7286, km: 1.2 },
          { name: "?靚?,       lat: 35.7172, lng: 139.7402, km: 2.0 },
          { name: "敺末??,       lat: 35.7066, lng: 139.7521, km: 3.4 },
          { name: "?祇銝???,   lat: 35.7077, lng: 139.7613, km: 4.3 },
          { name: "敺∟?偌",     lat: 35.6993, lng: 139.7630, km: 5.3 },
          { name: "瘛∟楝??,       lat: 35.6932, lng: 139.7670, km: 6.0 },
          { name: "憭扳???,       lat: 35.6855, lng: 139.7666, km: 7.0 },
          { name: "?曹漪",         lat: 35.6812, lng: 139.7671, km: 7.8, dwellSec: 30 },
          { name: "?摨?,         lat: 35.6720, lng: 139.7649, km: 8.9, dwellSec: 30 },
          { name: "???,       lat: 35.6735, lng: 139.7521, km: 10.0 },
          { name: "?賭?霅唬???", lat: 35.6745, lng: 139.7458, km: 10.6 },
          { name: "韏文?閬?",     lat: 35.6772, lng: 139.7372, km: 11.5 },
          { name: "??靚?,       lat: 35.6862, lng: 139.7302, km: 12.4 },
          { name: "?健銝???,   lat: 35.6885, lng: 139.7211, km: 13.1 },
          { name: "?啣挪敺∟???,   lat: 35.6878, lng: 139.7104, km: 14.0 },
          { name: "?啣挪銝???,   lat: 35.6911, lng: 139.7048, km: 14.7 },
          { name: "?啣挪",         lat: 35.6896, lng: 139.7006, km: 15.4, dwellSec: 30 },
          { name: "镼踵摰?,       lat: 35.6938, lng: 139.6929, km: 16.4 },
          { name: "銝剝???",     lat: 35.6953, lng: 139.6818, km: 17.6 },
          { name: "?唬葉??,       lat: 35.6986, lng: 139.6680, km: 18.7 },
          { name: "?梢??笑",     lat: 35.7048, lng: 139.6584, km: 19.7 },
          { name: "?圈??笑",     lat: 35.7034, lng: 139.6504, km: 20.6 },
          { name: "?雿靚?,   lat: 35.7028, lng: 139.6383, km: 21.7 },
          { name: "?餌牧",         lat: 35.7045, lng: 139.6196, km: 24.2, dwellSec: 30 },
        ],
        // 銝詻???:撟曆??冽挾?唬?;?臬?璆賢????瑁健銋???畾萄銵?擃
        // (蟡撌窒蝺?,蝝?0.3 km?ategory="?琿?" 撌脤?怠銝?,??
        // 擃?嫣???
        grades: [
          { from: 2.4, to: 3.0, type: "elevated", note: "?靚猾?璆賢? 蟡撌??嗆挾" },
        ],
      },
      {
        id: "Tokyo-Metro-Ginza",
        name: "?曹漪?～??剝?摨抒?",
        nameEn: "Tokyo Metro Ginza Line",
        color: "#f59a0c",
        category: "?琿?",
        directions: { up: "A蝺?(瘚??寥)", down: "B蝺?(皜健?寥)" },
        stations: [
          { name: "瘚?",       lat: 35.7106, lng: 139.7976, km: 0,    dwellSec: 30 },
          { name: "?啣???,     lat: 35.7099, lng: 139.7917, km: 0.6 },
          { name: "蝔脰??,     lat: 35.7113, lng: 139.7841, km: 1.3 },
          { name: "銝?",       lat: 35.7117, lng: 139.7773, km: 2.2, dwellSec: 30 },
          { name: "銝?摨?頝?, lat: 35.7079, lng: 139.7747, km: 2.7 },
          { name: "?怠???,     lat: 35.7027, lng: 139.7717, km: 3.3 },
          { name: "蟡",       lat: 35.6917, lng: 139.7709, km: 4.4 },
          { name: "銝???,     lat: 35.6873, lng: 139.7727, km: 5.0 },
          { name: "?交璈?,     lat: 35.6814, lng: 139.7740, km: 5.7 },
          { name: "鈭祆?",       lat: 35.6770, lng: 139.7706, km: 6.4 },
          { name: "?摨?,       lat: 35.6720, lng: 139.7649, km: 7.1, dwellSec: 30 },
          { name: "?唳?",       lat: 35.6661, lng: 139.7585, km: 8.0 },
          { name: "???",     lat: 35.6695, lng: 139.7493, km: 8.8 },
          { name: "皞?撅梁?",   lat: 35.6738, lng: 139.7411, km: 9.6 },
          { name: "韏文?閬?",   lat: 35.6772, lng: 139.7372, km: 10.1 },
          { name: "?控銝銝", lat: 35.6726, lng: 139.7228, km: 11.6 },
          { name: "憭???,     lat: 35.6691, lng: 139.7170, km: 12.3 },
          { name: "銵典???,     lat: 35.6651, lng: 139.7126, km: 12.9 },
          { name: "皜健",       lat: 35.6580, lng: 139.7016, km: 14.3, dwellSec: 30 },
        ],
        // ?摨抒?:?曹漪??方???芣?????畾萇瘛箏惜?唬?;
        // 皜健蝡??潮????勗銝?),?湔挾瘝??詨??頝舫??嗅??極蝔?
        // ??璅?靚瑞垢???嗆擏擗銝???category="?琿?" ?勗??
        grades: [
          { from: 13.6, to: 14.3, type: "elevated", note: "皜健蝡??嗆???(?望交璅芾??摨抒??望?)" },
        ],
      },
      {
        id: "Tokyo-Monorail",
        name: "?曹漪?Ｕ??研?怎噬?啁征皜舐?",
        nameEn: "Tokyo Monorail Haneda Airport Line",
        color: "#003685",
        category: "Monorail",
        directions: { up: "銝? (?Ｕ??研?急??曄?寥)", down: "銝? (蝢賜蝛箸葛蝚??踴???急??" },
        // Official line map lists 11 stations from Monorail Hamamatsucho to
        // Haneda Airport Terminal 2; only the all-stop local template is modeled
        // until skip-stop service support is available.
        stations: [
          { name: "?Ｕ??研?急??曄",       lat: 35.6555976, lng: 139.7567934, km: 0.050, dwellSec: 30 },
          { name: "憭拍?瘣脯?扎",           lat: 35.6227519, lng: 139.7508064, km: 4.141 },
          { name: "憭找?蝡園收?游?",           lat: 35.5951293, lng: 139.7470745, km: 7.318 },
          { name: "瘚?喋??,           lat: 35.5816902, lng: 139.7491442, km: 8.851 },
          { name: "?剖?撜?,                 lat: 35.5707693, lng: 139.7500681, km: 10.105 },
          { name: "?游???,                 lat: 35.5551633, lng: 139.7533778, km: 12.005 },
          { name: "憭拍征璈?,                 lat: 35.5489899, lng: 139.7543945, km: 12.705 },
          { name: "蝢賜蝛箸葛蝚??踴????,  lat: 35.5438943, lng: 139.7686676, km: 14.227, dwellSec: 30 },
          { name: "?唳?",               lat: 35.5428370, lng: 139.7868127, km: 16.329 },
          { name: "蝢賜蝛箸葛蝚??踴????,  lat: 35.5491467, lng: 139.7845042, km: 17.100, dwellSec: 30 },
          { name: "蝢賜蝛箸葛蝚??踴????,  lat: 35.5508377, lng: 139.7882856, km: 18.047, dwellSec: 30 },
        ],
      },
      {
        id: "Utsunomiya-Lightline",
        name: "摰摰株鞈?押??潦蝺?,
        nameEn: "Utsunomiya Haga Light Rail Line",
        color: "#facc15",
        category: "LRT",
        directions: { up: "銝? (摰摰桅??勗?寥)", down: "銝? (?唾??駁??寞甜撌交平???寥)" },
        // Official route map lists 19 stops from Utsunomiya Station East to
        // Haga-Takanezawa Industrial Park. Fallback km values are scaled to the
        // 14.6 km project length; generated OSM stationKms replace them at runtime.
        stations: [
          { name: "摰摰桅??勗", lat: 36.5590222, lng: 139.8995751, km: 0.000, dwellSec: 25 },
          { name: "?勗挪??, lat: 36.5582650, lng: 139.9040643, km: 0.432 },
          { name: "擏?砍???, lat: 36.5579621, lng: 139.9081419, km: 0.817 },
          { name: "撜?, lat: 36.5575329, lng: 139.9162772, km: 1.584 },
          { name: "?賣3銝", lat: 36.5572788, lng: 139.9232319, km: 2.239 },
          { name: "摰摰桀之摮阡?晞???", lat: 36.5570446, lng: 139.9301903, km: 2.894 },
          { name: "撟喟", lat: 36.5550683, lng: 139.9392659, km: 3.778 },
          { name: "撟喟銝剖亢撠郎?∪?", lat: 36.5548335, lng: 139.9447606, km: 4.296 },
          { name: "憌控?楚", lat: 36.5483643, lng: 139.9634208, km: 6.208 },
          { name: "皜擃??, lat: 36.5449489, lng: 139.9762998, km: 7.484 },
          { name: "皜??啣撣??颯?踴??, lat: 36.5476408, lng: 139.9842429, km: 8.295 },
          { name: "?啜?潦?嫘?詻??", lat: 36.5535964, lng: 139.9832384, km: 8.999 },
          { name: "???格?镼?, lat: 36.5674513, lng: 139.9872795, km: 10.665 },
          { name: "???格?銝剖亢", lat: 36.5677248, lng: 139.9929737, km: 11.202 },
          { name: "???格???, lat: 36.5676112, lng: 139.9987885, km: 11.749 },
          { name: "?唾???, lat: 36.5661120, lng: 140.0064986, km: 12.495 },
          { name: "?唾??箏極璆剖?啁恣??喋?澆?", lat: 36.5649729, lng: 140.0106667, km: 12.909 },
          { name: "???格ㄝ?砍???, lat: 36.5723821, lng: 140.0145609, km: 13.851 },
          { name: "?唾??駁??寞甜撌交平??", lat: 36.5784382, lng: 140.0120077, km: 14.600, dwellSec: 25 },
        ],
      },
    ],
    trainTemplates: [
      { line: "Tokaido-Shinkansen", type: "?柴???,     badge: "?柴???, badgeColor: "#6ee7b7", speed: 270, interval: 10, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Tokaido-Shinkansen", type: "?脯???,     badge: "?脯???, badgeColor: "#fbbf24", speed: 220, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 45 },
      { line: "Tokaido-Shinkansen", type: "????,     badge: "????, badgeColor: "#60a5fa", speed: 160, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "JR-Yamanote",        type: "撅望?蝺?,     badge: "撅望?",   badgeColor: "#34d399", speed: 35,  interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "JR-Chuo",            type: "敹恍?,       badge: "敹恍?,   badgeColor: "#fbbf24", speed: 55,  interval: 8,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "JR-Chuo",            type: "?孵敹恍?,   badge: "?孵翰",   badgeColor: "#f87171", speed: 70,  interval: 20, accel: 0.80, decel: 0.90, aLat: 0.85, dwellSec: 30 },
      { line: "Tokyo-Metro-Ginza",        type: "?摨抒?",     badge: "G",  badgeColor: "#f59a0c", speed: 35, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Tokyo-Metro-Marunouchi",   type: "銝詻???",   badge: "M",  badgeColor: "#f43f5e", speed: 40, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "JR-Keihin-Tohoku",         type: "????",   badge: "鈭祆?",   badgeColor: "#60a5fa", speed: 45, interval: 4,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "JR-Keihin-Tohoku",         type: "敹恍?,       badge: "鈭祆?敹?, badgeColor: "#22d3ee", speed: 55, interval: 12, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "JR-Sobu-Local",            type: "????",   badge: "蝺郎",   badgeColor: "#fde047", speed: 40, interval: 4,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Tokyu-Toyoko",             type: "??",       badge: "??",   badgeColor: "#c8102e", speed: 40, interval: 5,  accel: 0.95, decel: 1.05, aLat: 0.90, dwellSec: 25 },
      { line: "Tokyu-Toyoko",             type: "?亥?",       badge: "?亥?",   badgeColor: "#f87171", speed: 55, interval: 10, accel: 0.95, decel: 1.05, aLat: 0.90, dwellSec: 25 },
      { line: "Tokyu-Toyoko",             type: "?寞?,       badge: "?寞?,   badgeColor: "#facc15", speed: 65, interval: 15, accel: 0.95, decel: 1.05, aLat: 0.90, dwellSec: 30 },
      { line: "JR-Osaka-Loop",            type: "?桅?,       badge: "?啁",   badgeColor: "#f97316", speed: 40, interval: 4,  accel: 0.95, decel: 1.05, aLat: 0.90, dwellSec: 25 },
      { line: "JR-Osaka-Loop",            type: "憭批?頝臬翰??, badge: "憭批?頝?, badgeColor: "#fb923c", speed: 55, interval: 15, accel: 0.95, decel: 1.05, aLat: 0.90, dwellSec: 25 },
      { line: "Osaka-Metro-Midosuji",     type: "敺∪?蝑?",   badge: "M",      badgeColor: "#dc2626", speed: 40, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Hankyu-Kobe",              type: "?桅?,       badge: "?桅?,   badgeColor: "#7c1d10", speed: 50, interval: 8,  accel: 0.90, decel: 1.00, aLat: 0.85, dwellSec: 25 },
      { line: "Hankyu-Kobe",              type: "??寞?,   badge: "?",   badgeColor: "#a16207", speed: 65, interval: 15, accel: 0.90, decel: 1.00, aLat: 0.85, dwellSec: 25 },
      { line: "Hankyu-Kobe",              type: "?寞?,       badge: "?寞?,   badgeColor: "#fde047", speed: 70, interval: 15, accel: 0.90, decel: 1.00, aLat: 0.85, dwellSec: 30 },
      { line: "Sanyo-Shinkansen",         type: "?柴???,     badge: "?柴???, badgeColor: "#0ea5e9", speed: 285, interval: 15, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Sanyo-Shinkansen",         type: "?踴???,     badge: "?踴???, badgeColor: "#a78bfa", speed: 290, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Sanyo-Shinkansen",         type: "????,     badge: "????, badgeColor: "#f472b6", speed: 270, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Sanyo-Shinkansen",         type: "????,     badge: "????, badgeColor: "#60a5fa", speed: 180, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Nishi-Kyushu-Shinkansen",  type: "????,     badge: "????, badgeColor: "#e11d48", speed: 230, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Tokyo-Monorail",           type: "?桅?,       badge: "MO",     badgeColor: "#003685", speed: 80,  interval: 5,  accel: 0.95, decel: 1.05, aLat: 0.85, dwellSec: 25 },
      { line: "Utsunomiya-Lightline",     type: "?押??扎", badge: "HU",   badgeColor: "#facc15", speed: 30,  interval: 8,  accel: 0.80, decel: 0.90, aLat: 0.80, dwellSec: 20 },
    ],
  },

  korea: {
    label: "?筏 Korea",
    center: [37.55, 126.99],
    zoom: 9,
    lines: [
      {
        id: "Seoul-Metro-1",
        name: "??窷??? 1?賄? (??麮?",
        nameEn: "Seoul Metro Line 1 (Seoul?ncheon)",
        color: "#0052a4",
        category: "?琿?",
        directions: { up: "?? (窵? 諻拘庖)", down: "?? (?賄? 諻拘庖)" },
        // 1?賄? ?眼??KORAIL ?渥? 窵麮? + ?窱窸蛙 ?渥? 麮卿?謔砂??賄 窱禹???
        // ?蛭 ?渣?. 貐貲???窵????賄?麮??? 儠諤?儢月?. 麮?/?偷/????
        // 鴔?? 貐? ??.
        stations: [
          { name: "窵?",     lat: 37.6235, lng: 127.0578, km: 0,    dwellSec: 30 },
          { name: "??",       lat: 37.6147, lng: 127.0654, km: 1.4 },
          { name: "麮卿?謔?,     lat: 37.5803, lng: 127.0466, km: 4.6, dwellSec: 30 },
          { name: "???,     lat: 37.5762, lng: 127.0254, km: 6.7 },
          { name: "??諡?,     lat: 37.5713, lng: 127.0095, km: 7.5 },
          { name: "鮈?5穈",    lat: 37.5705, lng: 127.0014, km: 8.2 },
          { name: "鮈?3穈",    lat: 37.5710, lng: 126.9919, km: 9.0 },
          { name: "鮈?",       lat: 37.5703, lng: 126.9826, km: 9.7 },
          { name: "?痍",       lat: 37.5645, lng: 126.9776, km: 10.3 },
          { name: "???,     lat: 37.5547, lng: 126.9706, km: 11.1, dwellSec: 30 },
          { name: "?拖",       lat: 37.5295, lng: 126.9648, km: 13.0 },
          { name: "?賈?鴔?,     lat: 37.5135, lng: 126.9425, km: 15.2 },
          { name: "???,     lat: 37.5156, lng: 126.9070, km: 18.4 },
          { name: "??謔?,     lat: 37.5089, lng: 126.8916, km: 21.2 },
          { name: "窱禺?",       lat: 37.5031, lng: 126.8819, km: 22.6 },
          { name: "?月???,     lat: 37.4914, lng: 126.8400, km: 25.8 },
          { name: "?匪部",       lat: 37.4844, lng: 126.8079, km: 28.2 },
          { name: "賱麮?,       lat: 37.4838, lng: 126.7787, km: 32.1 },
          { name: "?㏑",       lat: 37.4877, lng: 126.7530, km: 34.5 },
          { name: "賱??,       lat: 37.4895, lng: 126.7236, km: 38.5, dwellSec: 30 },
          { name: "??",       lat: 37.4690, lng: 126.6998, km: 41.7 },
          { name: "鴥潰?",       lat: 37.4574, lng: 126.6776, km: 44.7 },
          { name: "?狩??,     lat: 37.4596, lng: 126.6566, km: 46.7 },
          { name: "?麮?,     lat: 37.4742, lng: 126.6328, km: 50.6 },
          { name: "?賄?",       lat: 37.4708, lng: 126.6218, km: 51.8, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-2",
        name: "? 鴔?? 2?賄?",
        nameEn: "Seoul Metro Line 2",
        color: "#00a84d",
        category: "?琿?",
        directions: { up: "?賄??? (??諻拗)", down: "?渥??? (諻?窸骨??" },
        // 2?賄?:48.8 km ?????痍???蛙誘諢??賄??? 篣域??潺? ?.
        // 麮??匪頃 諤?諤???諈刺? ?痍(? ?渠?)?潺? ??????.
        stations: [
          { name: "?痍",                 lat: 37.5645, lng: 126.9776, km: 0,    dwellSec: 30 },
          { name: "??諢?窱?,           lat: 37.5660, lng: 126.9826, km: 0.5 },
          { name: "??諢?穈",            lat: 37.5661, lng: 126.9912, km: 1.3 },
          { name: "??諢?穈",            lat: 37.5663, lng: 126.9978, km: 1.9 },
          { name: "??諡賄?禺爰?陬??,   lat: 37.5666, lng: 127.0080, km: 2.7 },
          { name: "?",                 lat: 37.5658, lng: 127.0179, km: 3.6 },
          { name: "???卿收",             lat: 37.5642, lng: 127.0290, km: 4.6 },
          { name: "?謔?,               lat: 37.5614, lng: 127.0376, km: 5.5, dwellSec: 30 },
          { name: "???",               lat: 37.5556, lng: 127.0440, km: 6.3 },
          { name: "?",                 lat: 37.5476, lng: 127.0473, km: 7.5 },
          { name: "?桿?",                 lat: 37.5446, lng: 127.0560, km: 8.4 },
          { name: "穇渠??筋",             lat: 37.5400, lng: 127.0701, km: 9.7 },
          { name: "窱科?",                 lat: 37.5371, lng: 127.0858, km: 10.8 },
          { name: "穈?",                 lat: 37.5350, lng: 127.0945, km: 11.7 },
          { name: "??ㄗ",             lat: 37.5208, lng: 127.1031, km: 13.0 },
          { name: "?",                 lat: 37.5135, lng: 127.1003, km: 14.0, dwellSec: 30 },
          { name: "??",             lat: 37.5113, lng: 127.0860, km: 15.3 },
          { name: "鮈?渠???,           lat: 37.5111, lng: 127.0735, km: 16.4 },
          { name: "?潰",                 lat: 37.5089, lng: 127.0631, km: 17.5 },
          { name: "??",                 lat: 37.5044, lng: 127.0490, km: 19.0 },
          { name: "?原",                 lat: 37.5005, lng: 127.0364, km: 20.4 },
          { name: "穈",                 lat: 37.4979, lng: 127.0276, km: 21.4, dwellSec: 30 },
          { name: "窱?",                 lat: 37.4934, lng: 127.0144, km: 22.7 },
          { name: "??",                 lat: 37.4915, lng: 127.0078, km: 23.4 },
          { name: "諻拘偽",                 lat: 37.4814, lng: 126.9971, km: 24.6 },
          { name: "?禺",                 lat: 37.4765, lng: 126.9818, km: 25.9 },
          { name: "??",               lat: 37.4767, lng: 126.9637, km: 27.2 },
          { name: "???筋",           lat: 37.4814, lng: 126.9527, km: 28.4 },
          { name: "賵?",                 lat: 37.4824, lng: 126.9415, km: 29.5 },
          { name: "?汝",                 lat: 37.4843, lng: 126.9295, km: 30.7 },
          { name: "??諻?,               lat: 37.4874, lng: 126.9133, km: 31.9 },
          { name: "窱禺????賈鴔",       lat: 37.4854, lng: 126.9013, km: 33.2 },
          { name: "?謔?,                 lat: 37.4929, lng: 126.8956, km: 34.0 },
          { name: "??謔?,               lat: 37.5089, lng: 126.8916, km: 35.0 },
          { name: "諡賈?",                 lat: 37.5180, lng: 126.8949, km: 36.0 },
          { name: "??禹筋麮?,           lat: 37.5246, lng: 126.8957, km: 36.8 },
          { name: "?寢",                 lat: 37.5343, lng: 126.9023, km: 38.1 },
          { name: "?拖?",                 lat: 37.5497, lng: 126.9134, km: 39.6 },
          { name: "???筋",             lat: 37.5567, lng: 126.9237, km: 40.7, dwellSec: 30 },
          { name: "??",                 lat: 37.5559, lng: 126.9359, km: 41.6 },
          { name: "?渠?",                 lat: 37.5567, lng: 126.9461, km: 42.5 },
          { name: "??",                 lat: 37.5577, lng: 126.9560, km: 43.4 },
          { name: "黺拖?諢?,               lat: 37.5602, lng: 126.9636, km: 44.3 },
          { name: "?痍",                 lat: 37.5645, lng: 126.9776, km: 48.8, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-3",
        name: "??窷??? 3?賄?",
        nameEn: "Seoul Metropolitan Subway Line 3",
        color: "#ED6C00",
        category: "?琿?",
        directions: { up: "?? (???諻拘庖)", down: "?? (?曰? 諻拘庖)" },
        // 3?賄?: Daehwa ??Ogeum all-stop service. OSM stop nodes provide the
        // station anchors; generated shapes replace these fallback kms at build time.
        stations: [
          { name: "???,       lat: 37.6761485, lng: 126.7474578, km: 0,    dwellSec: 30 },
          { name: "鴥潰",       lat: 37.6701110, lng: 126.7612341, km: 1.5 },
          { name: "????,     lat: 37.6597112, lng: 126.7732179, km: 3.1 },
          { name: "諤?",       lat: 37.6520005, lng: 126.7777178, km: 4.1 },
          { name: "諻桿?",       lat: 37.6430565, lng: 126.7879533, km: 5.5 },
          { name: "?窸?,       lat: 37.6318362, lng: 126.8096784, km: 7.9 },
          { name: "??",       lat: 37.6345957, lng: 126.8326234, km: 10.1 },
          { name: "?",       lat: 37.6538264, lng: 126.8433973, km: 12.5 },
          { name: "?",       lat: 37.6504946, lng: 126.8737376, km: 15.3 },
          { name: "?潰",       lat: 37.6531033, lng: 126.8954689, km: 17.3 },
          { name: "鴔黺?,       lat: 37.6479341, lng: 126.9149061, km: 19.2 },
          { name: "窱秒?諻?,     lat: 37.6368537, lng: 126.9187721, km: 20.6 },
          { name: "?域???,     lat: 37.6194491, lng: 126.9208580, km: 22.7, dwellSec: 30 },
          { name: "賱?",       lat: 37.6098806, lng: 126.9303980, km: 24.0 },
          { name: "?寨?",       lat: 37.6009430, lng: 126.9357156, km: 25.2 },
          { name: "??",       lat: 37.5886740, lng: 126.9441990, km: 26.9 },
          { name: "諡渥???,     lat: 37.5823147, lng: 126.9503083, km: 27.8 },
          { name: "?汗諡?,     lat: 37.5745130, lng: 126.9578197, km: 29.0 },
          { name: "窶趟陬窷?,     lat: 37.5757585, lng: 126.9735668, km: 30.3 },
          { name: "?筏",       lat: 37.5768286, lng: 126.9862272, km: 31.6 },
          { name: "鮈?3穈",    lat: 37.5720185, lng: 126.9916922, km: 32.3, dwellSec: 30 },
          { name: "??諢?穈",  lat: 37.5663629, lng: 126.9925882, km: 32.9 },
          { name: "黺拘炭諢?,     lat: 37.5606488, lng: 126.9948063, km: 33.7, dwellSec: 30 },
          { name: "???筋",   lat: 37.5590197, lng: 127.0057659, km: 34.7 },
          { name: "?趣?",       lat: 37.5548296, lng: 127.0105499, km: 35.4 },
          { name: "篣",       lat: 37.5480153, lng: 127.0158595, km: 36.3 },
          { name: "?伊?",       lat: 37.5408763, lng: 127.0178475, km: 37.1 },
          { name: "?筋??,     lat: 37.5261356, lng: 127.0284705, km: 39.1 },
          { name: "?",       lat: 37.5161705, lng: 127.0196309, km: 40.5 },
          { name: "??",       lat: 37.5127485, lng: 127.0110886, km: 41.4 },
          { name: "窸??圉站??, lat: 37.5050376, lng: 127.0049022, km: 42.5, dwellSec: 30 },
          { name: "窱?",       lat: 37.4928812, lng: 127.0138064, km: 44.2, dwellSec: 30 },
          { name: "?刺??圉站??, lat: 37.4849718, lng: 127.0162904, km: 45.1 },
          { name: "?",       lat: 37.4845433, lng: 127.0343170, km: 46.8, dwellSec: 30 },
          { name: "諤月?",       lat: 37.4870435, lng: 127.0469913, km: 48.0 },
          { name: "?部",       lat: 37.4908838, lng: 127.0554872, km: 48.9 },
          { name: "?儦?,       lat: 37.4944502, lng: 127.0632186, km: 49.7 },
          { name: "???,     lat: 37.4964802, lng: 127.0699125, km: 50.4 },
          { name: "?麮?,       lat: 37.4936540, lng: 127.0795056, km: 51.3 },
          { name: "?潰?",       lat: 37.4837678, lng: 127.0841812, km: 52.6 },
          { name: "??",       lat: 37.4874270, lng: 127.1019706, km: 54.3, dwellSec: 30 },
          { name: "穈?趣???,   lat: 37.4922475, lng: 127.1177039, km: 55.8 },
          { name: "窶趣偽貐?",   lat: 37.4953088, lng: 127.1238319, km: 56.5 },
          { name: "?曰?",       lat: 37.5021419, lng: 127.1283544, km: 57.4, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-4",
        name: "??窷??? 4?賄?",
        nameEn: "Seoul Metropolitan Subway Line 4",
        color: "#009BCE",
        category: "?琿?",
        directions: { up: "?? (鴔? 諻拘庖)", down: "?? (?木??諻拘庖)" },
        // 4?賄?:Jinjeop ??Oido all-stop trunk. Pungyang is not included until
        // it opens in service; generated shapes replace these fallback kms.
        stations: [
          { name: "鴔?",               lat: 37.7212032, lng: 127.2031634, km: 0,    dwellSec: 30 },
          { name: "?月",               lat: 37.7057341, lng: 127.1923455, km: 2.1 },
          { name: "貐貐???,         lat: 37.6680941, lng: 127.1169523, km: 10.4 },
          { name: "賱???,             lat: 37.6709164, lng: 127.0797159, km: 13.9, dwellSec: 30 },
          { name: "??",               lat: 37.6599912, lng: 127.0726737, km: 15.3 },
          { name: "?賄?",               lat: 37.6561244, lng: 127.0623632, km: 16.4, dwellSec: 30 },
          { name: "麆趟?",               lat: 37.6529636, lng: 127.0466586, km: 17.9, dwellSec: 30 },
          { name: "?爰",               lat: 37.6484204, lng: 127.0345485, km: 19.1 },
          { name: "??",               lat: 37.6379893, lng: 127.0256914, km: 20.6 },
          { name: "諯賄?",               lat: 37.6254296, lng: 127.0264909, km: 22.1 },
          { name: "諯賄??禹掠謔?,         lat: 37.6131644, lng: 127.0300744, km: 23.6 },
          { name: "篣賄?",               lat: 37.6024214, lng: 127.0244140, km: 25.0 },
          { name: "?桿??禺??筋",       lat: 37.5926650, lng: 127.0164111, km: 26.3 },
          { name: "???筋",         lat: 37.5882010, lng: 127.0053156, km: 27.5 },
          { name: "??",               lat: 37.5821434, lng: 127.0019312, km: 28.3 },
          { name: "??諡?,             lat: 37.5707564, lng: 127.0093746, km: 29.8, dwellSec: 30 },
          { name: "??諡賄?禺爰?陬??, lat: 37.5652027, lng: 127.0080476, km: 30.5, dwellSec: 30 },
          { name: "黺拘炭諢?,             lat: 37.5610655, lng: 126.9926025, km: 32.0, dwellSec: 30 },
          { name: "諈?",               lat: 37.5609174, lng: 126.9862899, km: 32.6 },
          { name: "??",               lat: 37.5587614, lng: 126.9784360, km: 33.3 },
          { name: "???,             lat: 37.5525760, lng: 126.9724492, km: 34.3, dwellSec: 30 },
          { name: "???筋",           lat: 37.5451375, lng: 126.9719211, km: 35.1 },
          { name: "?澎?鴔",             lat: 37.5344579, lng: 126.9729031, km: 36.4, dwellSec: 30 },
          { name: "???,             lat: 37.5291568, lng: 126.9678072, km: 37.2 },
          { name: "?渥?",               lat: 37.5226181, lng: 126.9736117, km: 38.1, dwellSec: 30 },
          { name: "??",               lat: 37.5021191, lng: 126.9808291, km: 40.6, dwellSec: 30 },
          { name: "黕???筋",         lat: 37.4870260, lng: 126.9822046, km: 42.4, dwellSec: 30 },
          { name: "?禺",               lat: 37.4762635, lng: 126.9815846, km: 43.7, dwellSec: 30 },
          { name: "?刮???,             lat: 37.4639720, lng: 126.9889176, km: 45.3 },
          { name: "????,             lat: 37.4507449, lng: 127.0030560, km: 47.3 },
          { name: "窶趟?窸蛙?",           lat: 37.4438286, lng: 127.0079130, km: 48.3 },
          { name: "?窸蛙?",             lat: 37.4350880, lng: 127.0061773, km: 49.3 },
          { name: "窸潰?",               lat: 37.4330278, lng: 126.9968428, km: 50.2 },
          { name: "??窸潰?麮原",       lat: 37.4264288, lng: 126.9897471, km: 51.2 },
          { name: "?賈???,             lat: 37.4013614, lng: 126.9769874, km: 54.4 },
          { name: "??",               lat: 37.3942706, lng: 126.9638926, km: 55.9 },
          { name: "貒?",               lat: 37.3898873, lng: 126.9509188, km: 57.2 },
          { name: "篣?",               lat: 37.3715851, lng: 126.9439463, km: 59.5, dwellSec: 30 },
          { name: "?圉雩",               lat: 37.3575433, lng: 126.9321639, km: 61.5 },
          { name: "?收??,             lat: 37.3498152, lng: 126.9253962, km: 62.6 },
          { name: "??潺站",             lat: 37.3272174, lng: 126.9162856, km: 65.4 },
          { name: "諻?",               lat: 37.3116652, lng: 126.9032326, km: 67.6 },
          { name: "????,             lat: 37.3028721, lng: 126.8656673, km: 71.2 },
          { name: "????,             lat: 37.3104519, lng: 126.8528880, km: 72.7 },
          { name: "鴗?",               lat: 37.3160633, lng: 126.8374647, km: 74.3, dwellSec: 30 },
          { name: "窸?",               lat: 37.3169005, lng: 126.8220934, km: 75.8 },
          { name: "黕?",               lat: 37.3211622, lng: 126.8049024, km: 77.5, dwellSec: 30 },
          { name: "?",               lat: 37.3274089, lng: 126.7879605, km: 79.2 },
          { name: "?虜?到?",           lat: 37.3380983, lng: 126.7661867, km: 81.6 },
          { name: "??",               lat: 37.3520536, lng: 126.7419901, km: 84.4 },
          { name: "?木??,             lat: 37.3628018, lng: 126.7387180, km: 85.7, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-5",
        name: "??窷??? 5?賄?",
        nameEn: "Seoul Metropolitan Subway Line 5",
        color: "#996CAC",
        category: "?琿?",
        directions: { up: "?? (諻拗? 諻拘庖)", down: "?? (?窶?到 諻拘庖)" },
        // 5?賄?: Banghwa ??Hanam Geomdansan main branch only. The Macheon
        // branch splits after Gangdong and is intentionally left for a later
        // branch-aware data pass.
        stations: [
          { name: "諻拗?", lat: 37.5773986, lng: 126.8126915, km: 0,    dwellSec: 30 },
          { name: "穈???, lat: 37.5728725, lng: 126.8081607, km: 0.7 },
          { name: "篧?禹陬??, lat: 37.5621160, lng: 126.8013024, km: 2.1, dwellSec: 30 },
          { name: "?∫?", lat: 37.5612507, lng: 126.8119964, km: 3.1 },
          { name: "諤部", lat: 37.5602258, lng: 126.8247396, km: 4.3 },
          { name: "諻", lat: 37.5584330, lng: 126.8374583, km: 5.5 },
          { name: "?域??, lat: 37.5488667, lng: 126.8362945, km: 6.6 },
          { name: "?部", lat: 37.5416946, lng: 126.8403637, km: 7.6 },
          { name: "篧???, lat: 37.5320943, lng: 126.8464982, km: 8.8, dwellSec: 30 },
          { name: "??", lat: 37.5250243, lng: 126.8559551, km: 10.0 },
          { name: "諈拘?", lat: 37.5261036, lng: 126.8645084, km: 10.8 },
          { name: "?月版窱?, lat: 37.5245316, lng: 126.8751484, km: 11.9 },
          { name: "??", lat: 37.5256184, lng: 126.8861154, km: 12.9 },
          { name: "??禹筋麮?, lat: 37.5240118, lng: 126.8964077, km: 13.9, dwellSec: 30 },
          { name: "??科???, lat: 37.5226792, lng: 126.9051244, km: 14.7 },
          { name: "?虜", lat: 37.5174957, lng: 126.9166068, km: 15.9 },
          { name: "?科???, lat: 37.5219444, lng: 126.9248093, km: 16.9, dwellSec: 30 },
          { name: "?科??ㄗ", lat: 37.5268372, lng: 126.9325490, km: 17.8 },
          { name: "諤", lat: 37.5396061, lng: 126.9459969, km: 19.7 },
          { name: "窸蛟?", lat: 37.5436373, lng: 126.9508356, km: 20.4 },
          { name: "?穈?, lat: 37.5534301, lng: 126.9567324, km: 21.7, dwellSec: 30 },
          { name: "黺拖?諢?, lat: 37.5594482, lng: 126.9621729, km: 22.5, dwellSec: 30 },
          { name: "??諡?, lat: 37.5657783, lng: 126.9666700, km: 23.4 },
          { name: "窵?諡?, lat: 37.5715921, lng: 126.9769127, km: 24.6 },
          { name: "鮈?3穈", lat: 37.5725275, lng: 126.9908072, km: 25.9, dwellSec: 30 },
          { name: "??諢?穈", lat: 37.5669307, lng: 126.9980713, km: 26.8 },
          { name: "??諡賄?禺爰?陬??, lat: 37.5642040, lng: 127.0072575, km: 27.7, dwellSec: 30 },
          { name: "麮匪筋", lat: 37.5602418, lng: 127.0136945, km: 28.5 },
          { name: "????, lat: 37.5544039, lng: 127.0202557, km: 29.4 },
          { name: "?", lat: 37.5575595, lng: 127.0299795, km: 30.4 },
          { name: "?謔?, lat: 37.5610151, lng: 127.0357909, km: 31.1, dwellSec: 30 },
          { name: "諤", lat: 37.5660844, lng: 127.0429225, km: 32.0 },
          { name: "?蛙謔?, lat: 37.5667984, lng: 127.0526477, km: 32.9 },
          { name: "?伕???, lat: 37.5614569, lng: 127.0645907, km: 34.1 },
          { name: "窱域?", lat: 37.5571224, lng: 127.0795354, km: 35.6, dwellSec: 30 },
          { name: "?馬??, lat: 37.5516758, lng: 127.0897660, km: 36.8 },
          { name: "窵?諴?, lat: 37.5452672, lng: 127.1035050, km: 38.3 },
          { name: "麮", lat: 37.5385722, lng: 127.1234109, km: 40.3, dwellSec: 30 },
          { name: "穈?", lat: 37.5357680, lng: 127.1325963, km: 41.2, dwellSec: 30 },
          { name: "篣賈?", lat: 37.5383373, lng: 127.1402269, km: 42.0 },
          { name: "窱趣??月收", lat: 37.5456477, lng: 127.1429834, km: 42.9 },
          { name: "諈", lat: 37.5519222, lng: 127.1441072, km: 43.6 },
          { name: "窸?", lat: 37.5549570, lng: 127.1537952, km: 44.6 },
          { name: "???, lat: 37.5568602, lng: 127.1680427, km: 45.9 },
          { name: "穈", lat: 37.5574904, lng: 127.1761414, km: 46.7 },
          { name: "諯賄", lat: 37.5629465, lng: 127.1928227, km: 48.4 },
          { name: "??", lat: 37.5528169, lng: 127.2043013, km: 50.0 },
          { name: "??痍", lat: 37.5416107, lng: 127.2069843, km: 51.3 },
          { name: "?窶?到", lat: 37.5396413, lng: 127.2236752, km: 52.9, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-6",
        name: "? 鴔?? 6?賄?",
        nameEn: "Seoul Subway Line 6",
        color: "#7C4932",
        category: "?琿?",
        directions: { up: "?? (???? 諻拘庖)", down: "?? (? 諻拘庖)" },
        // 6?賄?: Eungam one-way loop followed by the eastbound trunk to Sinnae.
        // Eungam intentionally appears twice so the loop movement stays explicit.
        stations: [
          { name: "??", lat: 37.5987740, lng: 126.9157018, km: 0,    dwellSec: 30 },
          { name: "?原?", lat: 37.6060541, lng: 126.9228008, km: 1.1 },
          { name: "賱?", lat: 37.6107380, lng: 126.9292223, km: 1.8, dwellSec: 30 },
          { name: "????, lat: 37.6184519, lng: 126.9330576, km: 2.8 },
          { name: "?域???, lat: 37.6186289, lng: 126.9205315, km: 3.9, dwellSec: 30 },
          { name: "窱科", lat: 37.6110401, lng: 126.9170995, km: 4.9 },
          { name: "??", lat: 37.5984384, lng: 126.9154726, km: 6.3, dwellSec: 30 },
          { name: "??", lat: 37.5910867, lng: 126.9134797, km: 7.2 },
          { name: "鴞", lat: 37.5841289, lng: 126.9098598, km: 8.0 },
          { name: "???賈站??", lat: 37.5762160, lng: 126.9014392, km: 9.2, dwellSec: 30 },
          { name: "??儢虛祭篣域", lat: 37.5701609, lng: 126.8992939, km: 9.9 },
          { name: "諤窱科痍", lat: 37.5635156, lng: 126.9033737, km: 10.8 },
          { name: "諤?", lat: 37.5559808, lng: 126.9101224, km: 11.8 },
          { name: "?拖?", lat: 37.5492052, lng: 126.9134584, km: 12.7, dwellSec: 30 },
          { name: "??", lat: 37.5477391, lng: 126.9229225, km: 13.5 },
          { name: "窵麆?, lat: 37.5474490, lng: 126.9320010, km: 14.4 },
          { name: "???, lat: 37.5476895, lng: 126.9423171, km: 15.3 },
          { name: "窸蛟?", lat: 37.5436396, lng: 126.9515209, km: 16.2, dwellSec: 30 },
          { name: "?到偷窸蛙???, lat: 37.5393117, lng: 126.9613534, km: 17.3, dwellSec: 30 },
          { name: "?澎?鴔", lat: 37.5355911, lng: 126.9738989, km: 18.5, dwellSec: 30 },
          { name: "?寢??, lat: 37.5347329, lng: 126.9864975, km: 19.6 },
          { name: "?渣???, lat: 37.5344810, lng: 126.9943860, km: 20.3 },
          { name: "??鴔?, lat: 37.5398199, lng: 127.0017633, km: 21.3 },
          { name: "貒窸?", lat: 37.5482256, lng: 127.0066769, km: 22.3 },
          { name: "?趣?", lat: 37.5541596, lng: 127.0103961, km: 23.1, dwellSec: 30 },
          { name: "麮匪筋", lat: 37.5602864, lng: 127.0138544, km: 23.8, dwellSec: 30 },
          { name: "?", lat: 37.5664040, lng: 127.0162221, km: 24.6, dwellSec: 30 },
          { name: "????, lat: 37.5714130, lng: 127.0158026, km: 25.1, dwellSec: 30 },
          { name: "麆趣?", lat: 37.5797860, lng: 127.0152730, km: 26.1 },
          { name: "貐渠爰", lat: 37.5852622, lng: 127.0193326, km: 26.8, dwellSec: 30 },
          { name: "??", lat: 37.5862818, lng: 127.0293290, km: 27.7 },
          { name: "窸?", lat: 37.5897500, lng: 127.0359359, km: 28.5 },
          { name: "?部", lat: 37.6019240, lng: 127.0414890, km: 29.9 },
          { name: "??窸?, lat: 37.6062070, lng: 127.0482569, km: 30.7 },
          { name: "?雀??, lat: 37.6105343, lng: 127.0564905, km: 31.6 },
          { name: "??", lat: 37.6148757, lng: 127.0657680, km: 32.6, dwellSec: 30 },
          { name: "???筋", lat: 37.6172248, lng: 127.0745285, km: 33.4, dwellSec: 30 },
          { name: "???", lat: 37.6197559, lng: 127.0837172, km: 34.3 },
          { name: "賵???, lat: 37.6173928, lng: 127.0910747, km: 35.0, dwellSec: 30 },
          { name: "?", lat: 37.6124026, lng: 127.1046462, km: 36.4, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-7",
        name: "? 鴔?? 7?賄?",
        nameEn: "Seoul Subway Line 7",
        color: "#747F00",
        category: "?琿?",
        directions: { up: "?? (?伊? 諻拘庖)", down: "?? (? 諻拘庖)" },
        // 7?賄?: Jangam ??Seongnam all-stop service. Full current westward
        // extension is used; older Onsu/Bupyeong-gu Office short routes are not
        // modeled as separate templates in this seed pass.
        stations: [
          { name: "?伊?", lat: 37.7001801, lng: 127.0530750, km: 0,    dwellSec: 30 },
          { name: "????, lat: 37.6888071, lng: 127.0467403, km: 1.4, dwellSec: 30 },
          { name: "???, lat: 37.6770108, lng: 127.0552337, km: 3.0 },
          { name: "諤", lat: 37.6647424, lng: 127.0577568, km: 4.4 },
          { name: "?賄?", lat: 37.6535163, lng: 127.0607422, km: 5.7, dwellSec: 30 },
          { name: "鴗?", lat: 37.6455228, lng: 127.0638548, km: 6.6 },
          { name: "??", lat: 37.6359753, lng: 127.0682067, km: 7.8 },
          { name: "窸蛟?", lat: 37.6256062, lng: 127.0729869, km: 9.0 },
          { name: "???筋", lat: 37.6181175, lng: 127.0754565, km: 9.9, dwellSec: 30 },
          { name: "諟實釣", lat: 37.6114362, lng: 127.0775866, km: 10.7 },
          { name: "鴗?", lat: 37.6016296, lng: 127.0794500, km: 11.8 },
          { name: "??", lat: 37.5958368, lng: 127.0856306, km: 12.7, dwellSec: 30 },
          { name: "諰渠版", lat: 37.5883794, lng: 127.0875458, km: 13.5 },
          { name: "?禹???, lat: 37.5807153, lng: 127.0883912, km: 14.4 },
          { name: "?拘???, lat: 37.5738974, lng: 127.0864879, km: 15.2 },
          { name: "鴗部", lat: 37.5662958, lng: 127.0844900, km: 16.1 },
          { name: "窱域?", lat: 37.5572237, lng: 127.0795184, km: 17.2, dwellSec: 30 },
          { name: "?渠旭?渠?窸蛙?", lat: 37.5476281, lng: 127.0743859, km: 18.4 },
          { name: "穇渠??筋", lat: 37.5401446, lng: 127.0707105, km: 19.3, dwellSec: 30 },
          { name: "??", lat: 37.5308705, lng: 127.0664071, km: 20.4 },
          { name: "麮卿", lat: 37.5188573, lng: 127.0500373, km: 22.4 },
          { name: "穈窱科痍", lat: 37.5171958, lng: 127.0413029, km: 23.2, dwellSec: 30 },
          { name: "??", lat: 37.5139701, lng: 127.0307332, km: 24.3 },
          { name: "?潤?", lat: 37.5111305, lng: 127.0214771, km: 25.2 },
          { name: "諻", lat: 37.5081855, lng: 127.0116190, km: 26.1 },
          { name: "窸??圉站??, lat: 37.5038331, lng: 127.0053083, km: 26.9, dwellSec: 30 },
          { name: "?渠骨", lat: 37.4872377, lng: 126.9921169, km: 29.1 },
          { name: "?渥?", lat: 37.4853378, lng: 126.9819566, km: 30.0, dwellSec: 30 },
          { name: "?到", lat: 37.4843794, lng: 126.9718787, km: 30.9 },
          { name: "?原??筋", lat: 37.4956558, lng: 126.9541388, km: 33.0 },
          { name: "??", lat: 37.5032145, lng: 126.9476896, km: 34.0 },
          { name: "?伊諻國萼", lat: 37.5049927, lng: 126.9391954, km: 34.8 },
          { name: "??諻拖穇圉收", lat: 37.4997200, lng: 126.9282087, km: 36.0 },
          { name: "貐渠諤?, lat: 37.4999833, lng: 126.9197810, km: 36.7, dwellSec: 30 },
          { name: "??", lat: 37.5001548, lng: 126.9089367, km: 37.7 },
          { name: "?謔?, lat: 37.4925164, lng: 126.8962526, km: 39.1, dwellSec: 30 },
          { name: "?刷筋諢?, lat: 37.4854040, lng: 126.8866733, km: 40.3 },
          { name: "穈?圉?鴔?賈鴔", lat: 37.4801015, lng: 126.8816142, km: 41.1, dwellSec: 30 },
          { name: "麮", lat: 37.4760589, lng: 126.8677626, km: 42.4 },
          { name: "窵??禹掠謔?, lat: 37.4796210, lng: 126.8538115, km: 43.7 },
          { name: "麮?", lat: 37.4863535, lng: 126.8389512, km: 45.3 },
          { name: "?到?", lat: 37.4925674, lng: 126.8221638, km: 46.9, dwellSec: 30 },
          { name: "篧???, lat: 37.5062561, lng: 126.8113774, km: 48.8 },
          { name: "賱麮??拖?", lat: 37.5054654, lng: 126.7972534, km: 50.1 },
          { name: "黺?", lat: 37.5037437, lng: 126.7871771, km: 51.0 },
          { name: "????, lat: 37.5030595, lng: 126.7762185, km: 52.0 },
          { name: "賱麮?麮?, lat: 37.5047828, lng: 126.7631827, km: 53.2 },
          { name: "??", lat: 37.5058462, lng: 126.7531662, km: 54.1 },
          { name: "?潰麮渥窵", lat: 37.5065175, lng: 126.7423065, km: 55.1 },
          { name: "窱渣麮?, lat: 37.5070361, lng: 126.7313177, km: 56.0 },
          { name: "賱?筋麮?, lat: 37.5075712, lng: 126.7198593, km: 57.1, dwellSec: 30 },
          { name: "?國部", lat: 37.5086158, lng: 126.7036796, km: 58.5 },
          { name: "?", lat: 37.5063954, lng: 126.6731764, km: 61.3, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-8",
        name: "? 鴔?? 8?賄?",
        nameEn: "Seoul Subway Line 8",
        color: "#E6186C",
        category: "?琿?",
        directions: { up: "?? (貐 諻拘庖)", down: "?? (諈刺? 諻拘庖)" },
        // 8?賄?: Byeollae ??Moran all-stop service. The current Byeollae
        // extension is used; older Amsa/Moran short relations are not modeled
        // as separate templates in this seed pass.
        stations: [
          { name: "貐", lat: 37.6418028, lng: 127.1280243, km: 0,    dwellSec: 30 },
          { name: "?木", lat: 37.6237479, lng: 127.1496187, km: 2.9 },
          { name: "?筋謔?, lat: 37.6101744, lng: 127.1381349, km: 4.8 },
          { name: "窱禺收", lat: 37.6016366, lng: 127.1410186, km: 5.8, dwellSec: 30 },
          { name: "?伊??賄?窸蛙?", lat: 37.5864905, lng: 127.1378478, km: 7.6 },
          { name: "??原窸蛙?", lat: 37.5568968, lng: 127.1365133, km: 11.0 },
          { name: "?", lat: 37.5490025, lng: 127.1270746, km: 12.3 },
          { name: "麮", lat: 37.5380736, lng: 127.1232037, km: 13.6, dwellSec: 30 },
          { name: "穈?窱科痍", lat: 37.5306815, lng: 127.1205980, km: 14.5 },
          { name: "諈趣??", lat: 37.5175496, lng: 127.1126502, km: 16.2 },
          { name: "?", lat: 37.5143195, lng: 127.1034964, km: 17.1, dwellSec: 30 },
          { name: "??", lat: 37.5053042, lng: 127.1070931, km: 18.2, dwellSec: 30 },
          { name: "?∮?", lat: 37.4996207, lng: 127.1122514, km: 19.0 },
          { name: "穈?趣???, lat: 37.4931855, lng: 127.1181478, km: 20.0, dwellSec: 30 },
          { name: "諡賄?", lat: 37.4858500, lng: 127.1224840, km: 20.9 },
          { name: "?伊?", lat: 37.4788927, lng: 127.1260371, km: 21.8 },
          { name: "貐蛙?", lat: 37.4701567, lng: 127.1266101, km: 22.8, dwellSec: 30 },
          { name: "?到?諢", lat: 37.4624724, lng: 127.1397967, km: 24.3 },
          { name: "?域", lat: 37.4568481, lng: 127.1499078, km: 25.4 },
          { name: "?刮??域?筋", lat: 37.4515840, lng: 127.1598040, km: 26.5 },
          { name: "?刺??曰掠謔?, lat: 37.4450934, lng: 127.1567551, km: 27.3 },
          { name: "?", lat: 37.4410138, lng: 127.1476254, km: 28.3 },
          { name: "??", lat: 37.4374574, lng: 127.1406647, km: 29.1 },
          { name: "諈刺?", lat: 37.4340338, lng: 127.1303157, km: 30.1, dwellSec: 30 },
        ],
      },
      {
        id: "Seoul-Metro-9",
        name: "? 鴔?? 9?賄?",
        nameEn: "Seoul Subway Line 9",
        color: "#BDB092",
        category: "?琿?",
        directions: { up: "?? (穈? 諻拘庖)", down: "?? (鴗?貐渣?貐? 諻拘庖)" },
        // 9?賄?: Gaehwa to VHS Medical Center all-stop service. Express
        // skip-stop patterns exist, but are left for a later skip-stop pass.
        stations: [
          { name: "穈?", lat: 37.5784343, lng: 126.7968238, km: 0,    dwellSec: 30 },
          { name: "篧?禹陬??, lat: 37.5619723, lng: 126.8015364, km: 2.1, dwellSec: 30 },
          { name: "窸蛭?", lat: 37.5634156, lng: 126.8104215, km: 2.9 },
          { name: "?骨??, lat: 37.5674056, lng: 126.8178288, km: 3.8 },
          { name: "諤部?ㄗ", lat: 37.5666674, lng: 126.8277135, km: 4.8, dwellSec: 30 },
          { name: "???伉?", lat: 37.5684782, lng: 126.8412018, km: 6.1 },
          { name: "穈??, lat: 37.5611258, lng: 126.8550615, km: 7.7 },
          { name: "鴞站", lat: 37.5574220, lng: 126.8619300, km: 8.5 },
          { name: "?桿?", lat: 37.5511895, lng: 126.8645708, km: 9.3 },
          { name: "?潰偷", lat: 37.5470051, lng: 126.8754428, km: 10.5 },
          { name: "?版??, lat: 37.5442270, lng: 126.8831853, km: 11.3 },
          { name: "????, lat: 37.5378557, lng: 126.8938639, km: 12.6 },
          { name: "?寢", lat: 37.5329103, lng: 126.9037755, km: 13.7, dwellSec: 30 },
          { name: "窱厝????, lat: 37.5274368, lng: 126.9184254, km: 15.3 },
          { name: "?科???, lat: 37.5217071, lng: 126.9241053, km: 16.2, dwellSec: 30 },
          { name: "??", lat: 37.5172824, lng: 126.9283959, km: 16.8, dwellSec: 30 },
          { name: "?賈?鴔?, lat: 37.5136072, lng: 126.9418701, km: 18.2, dwellSec: 30 },
          { name: "?賈", lat: 37.5129494, lng: 126.9535788, km: 19.4 },
          { name: "??", lat: 37.5083660, lng: 126.9639299, km: 20.5 },
          { name: "??", lat: 37.5026030, lng: 126.9788678, km: 22.1, dwellSec: 30 },
          { name: "窱禺???, lat: 37.5012703, lng: 126.9867889, km: 22.9 },
          { name: "????, lat: 37.5035801, lng: 126.9964259, km: 23.9 },
          { name: "窸??圉站??, lat: 37.5060746, lng: 127.0047415, km: 24.7, dwellSec: 30 },
          { name: "?秒?", lat: 37.5041050, lng: 127.0153773, km: 25.8 },
          { name: "???, lat: 37.5045465, lng: 127.0248738, km: 26.7 },
          { name: "?賄ˉ", lat: 37.5073701, lng: 127.0341153, km: 27.7 },
          { name: "??謔?, lat: 37.5103535, lng: 127.0442542, km: 28.7, dwellSec: 30 },
          { name: "?潰鴗?", lat: 37.5130743, lng: 127.0537122, km: 29.7 },
          { name: "賵???, lat: 37.5141546, lng: 127.0601774, km: 30.3 },
          { name: "鮈?渠???, lat: 37.5111232, lng: 127.0767504, km: 32.0, dwellSec: 30 },
          { name: "?潰?", lat: 37.5044780, lng: 127.0871856, km: 33.2 },
          { name: "??窸?", lat: 37.5024170, lng: 127.0965651, km: 34.2 },
          { name: "??", lat: 37.5050452, lng: 127.1068567, km: 35.2, dwellSec: 30 },
          { name: "?∮??ㄗ", lat: 37.5112303, lng: 127.1128828, km: 36.2 },
          { name: "?諻桿?", lat: 37.5167113, lng: 127.1162809, km: 36.9 },
          { name: "?禺汝?赭陬??, lat: 37.5160799, lng: 127.1303019, km: 38.3, dwellSec: 30 },
          { name: "???月?", lat: 37.5198527, lng: 127.1383293, km: 39.2 },
          { name: "鴗?貐渣?貐?", lat: 37.5282699, lng: 127.1482860, km: 40.6, dwellSec: 30 },
        ],
      },
      {
        id: "Ui-LRT",
        name: "? 窶趣?麮??域???,
        nameEn: "Seoul LRT Ui-Sinseol Line",
        color: "#BACC50",
        category: "LRT",
        directions: { up: "?? (賱??域??諻拘庖)", down: "?? (???諻拘庖)" },
        // Seoul's first fully underground driverless light metro; OSM relation
        // 7533582 follows the Bukhansan Ui?inseol-dong direction.
        stations: [
          { name: "賱??域??, lat: 37.6633606, lng: 127.0123479, km: 0.000, dwellSec: 30 },
          { name: "?鬼窸蛙?", lat: 37.6559343, lng: 127.0131587, km: 0.850 },
          { name: "4.19諯潰ˉ諡?", lat: 37.6493635, lng: 127.0136521, km: 1.604 },
          { name: "穈?月收", lat: 37.6420351, lng: 127.0165155, km: 2.459 },
          { name: "??", lat: 37.6340359, lng: 127.0174308, km: 3.353 },
          { name: "?潰?", lat: 37.6269639, lng: 127.0181389, km: 4.142 },
          { name: "?潰??禹掠謔?, lat: 37.6211740, lng: 127.0205140, km: 4.840 },
          { name: "??", lat: 37.6202204, lng: 127.0137122, km: 5.605 },
          { name: "賱??圉陷窱卿爰", lat: 37.6119626, lng: 127.0082576, km: 6.880 },
          { name: "??", lat: 37.6027532, lng: 127.0133380, km: 8.014 },
          { name: "?桿??禺??筋", lat: 37.5925679, lng: 127.0164561, km: 9.187, dwellSec: 30 },
          { name: "貐渠爰", lat: 37.5850612, lng: 127.0194667, km: 10.086, dwellSec: 30 },
          { name: "???, lat: 37.5760855, lng: 127.0231571, km: 11.147, dwellSec: 30 },
        ],
      },
      {
        id: "Sillim-LRT",
        name: "? 窶趣?麮??汝??,
        nameEn: "Seoul LRT Sillim Line",
        color: "#6789CA",
        category: "LRT",
        directions: { up: "?? (?? 諻拘庖)", down: "?? (窵? 諻拘庖)" },
        // Rubber-tyred automated light metro; OSM relation 14191877 follows
        // the Saetgang?wanaksan direction and provides stop members for all stations.
        stations: [
          { name: "??", lat: 37.5173398, lng: 126.9293465, km: 0.000, dwellSec: 30 },
          { name: "?諻?, lat: 37.5125156, lng: 126.9250675, km: 0.600, dwellSec: 30 },
          { name: "?鴔諻拘?諡渥痍", lat: 37.5059702, lng: 126.9226486, km: 1.400 },
          { name: "貐渠諤?, lat: 37.5003803, lng: 126.9204283, km: 2.000, dwellSec: 30 },
          { name: "貐渠諤曰陬??, lat: 37.4952476, lng: 126.9181210, km: 2.600 },
          { name: "貐渠諤月???, lat: 37.4929164, lng: 126.9242838, km: 3.400 },
          { name: "?實部", lat: 37.4897250, lng: 126.9277642, km: 3.900 },
          { name: "?汝", lat: 37.4848427, lng: 126.9295604, km: 4.600, dwellSec: 30 },
          { name: "??", lat: 37.4781827, lng: 126.9329546, km: 5.300 },
          { name: "??貒木????, lat: 37.4720468, lng: 126.9336031, km: 6.400 },
          { name: "窵?", lat: 37.4687700, lng: 126.9452234, km: 7.800, dwellSec: 30 },
        ],
      },
      {
        id: "Uijeongbu-LRT",
        name: "??賱窶趣?麮?,
        nameEn: "Uijeongbu LRT U Line",
        color: "#F0831E",
        category: "LRT",
        directions: { up: "?? (諻部 諻拘庖)", down: "?? (麆刺?篣域????實???諻拘庖)" },
        // Elevated rubber-tyred VAL light metro; OSM relation 13738410
        // follows the Balgok?epot Temporary Platform station order.
        stations: [
          { name: "諻部", lat: 37.7269971, lng: 127.0529344, km: 0.000, dwellSec: 30 },
          { name: "?ㄐ", lat: 37.7250332, lng: 127.0471527, km: 0.795, dwellSec: 30 },
          { name: "貒釣", lat: 37.7289028, lng: 127.0437020, km: 1.450 },
          { name: "窶趣?麮???", lat: 37.7374450, lng: 127.0433186, km: 2.400, dwellSec: 30 },
          { name: "??賱?痍", lat: 37.7393951, lng: 127.0348982, km: 3.316 },
          { name: "?伊?", lat: 37.7432726, lng: 127.0374127, km: 3.949 },
          { name: "??賱鴗?", lat: 37.7436756, lng: 127.0498713, km: 5.045 },
          { name: "?", lat: 37.7453477, lng: 127.0571834, km: 5.755 },
          { name: "??", lat: 37.7488705, lng: 127.0639796, km: 6.482 },
          { name: "窶赭萼?痍賱?麮原", lat: 37.7507504, lng: 127.0718140, km: 7.202 },
          { name: "?到?", lat: 37.7539890, lng: 127.0773992, km: 7.824 },
          { name: "窸木?", lat: 37.7503452, lng: 127.0838985, km: 8.601 },
          { name: "?渠ㄐ", lat: 37.7425371, lng: 127.0852351, km: 9.502 },
          { name: "?∫", lat: 37.7371073, lng: 127.0873011, km: 10.132 },
          { name: "??", lat: 37.7334804, lng: 127.0889389, km: 10.561, dwellSec: 30 },
          { name: "麆刺?篣域????實???, lat: 37.7286629, lng: 127.0949069, km: 11.343, dwellSec: 30 },
        ],
      },
      {
        id: "Yongin-EverLine",
        name: "?拖 ???潰",
        nameEn: "Yongin EverLine",
        color: "#44A436",
        category: "LRT",
        directions: { up: "?? (篣堅 諻拘庖)", down: "?? (??繚???? 諻拘庖)" },
        // Automated Bombardier Innovia ART light metro; OSM relation 6064093
        // follows the Giheung?eondae Everland station order.
        stations: [
          { name: "篣堅", lat: 37.2753771, lng: 127.1170247, km: 0.000, dwellSec: 30 },
          { name: "穈?", lat: 37.2700508, lng: 127.1262349, km: 1.049 },
          { name: "鴔??, lat: 37.2698069, lng: 127.1368761, km: 2.111 },
          { name: "?渥?", lat: 37.2750080, lng: 127.1439872, km: 3.026 },
          { name: "?停", lat: 37.2688635, lng: 127.1528478, km: 4.208 },
          { name: "黕", lat: 37.2606548, lng: 127.1596362, km: 5.304 },
          { name: "?澎?", lat: 37.2420185, lng: 127.1683974, km: 7.890 },
          { name: "?痍繚?拖?", lat: 37.2393178, lng: 127.1791165, km: 8.925 },
          { name: "諈??", lat: 37.2378920, lng: 127.1905189, km: 9.956 },
          { name: "篧?", lat: 37.2372156, lng: 127.1988861, km: 10.708 },
          { name: "?拖鴗??", lat: 37.2377806, lng: 127.2092509, km: 11.647 },
          { name: "窸?", lat: 37.2446925, lng: 127.2143199, km: 12.582 },
          { name: "貐渣?", lat: 37.2590842, lng: 127.2184773, km: 14.337 },
          { name: "??", lat: 37.2673470, lng: 127.2137260, km: 15.369 },
          { name: "??繚????", lat: 37.2854600, lng: 127.2194319, km: 17.995, dwellSec: 30 },
        ],
      },
      {
        id: "AREX",
        name: "窸蛭麮?",
        nameEn: "Airport Railroad Express",
        color: "#0079ac",
        category: "HSR",
        directions: { up: "?? (???諻拘庖)", down: "?? (?賄?窸蛭2?圉站??諻拘庖)" },
        // AREX all-stop service:??凌??賄?窸蛭2?圉站??63.8 km 14 ??
        // 鴔?渥馬??? skip-stop 諈刺???諯諢?貐? template ?潺? ??? ????
        stations: [
          { name: "???,               lat: 37.554095, lng: 126.969920, km: 0,    dwellSec: 60 },
          { name: "窸蛟?",                 lat: 37.542389, lng: 126.952230, km: 3.3 },
          { name: "???筋",             lat: 37.557625, lng: 126.926429, km: 6.1 },
          { name: "???賈站??",     lat: 37.577412, lng: 126.898038, km: 9.5 },
          { name: "諤部?ㄗ",             lat: 37.565659, lng: 126.827619, km: 18.1 },
          { name: "篧?禹陬??,             lat: 37.561726, lng: 126.801544, km: 20.4, dwellSec: 30 },
          { name: "窸?",                 lat: 37.571752, lng: 126.736350, km: 27.0 },
          { name: "窶??,                 lat: 37.569132, lng: 126.673677, km: 32.5 },
          { name: "麮卿窱原???",         lat: 37.556381, lng: 126.624703, km: 37.3 },
          { name: "??",                 lat: 37.511973, lng: 126.524889, km: 47.6 },
          { name: "?渥?",                 lat: 37.492783, lng: 126.493800, km: 51.1 },
          { name: "窸蛭?狩麮原",         lat: 37.458856, lng: 126.477670, km: 55.4 },
          { name: "?賄?窸蛭1?圉站??,      lat: 37.447176, lng: 126.452766, km: 58.0, dwellSec: 60 },
          { name: "?賄?窸蛭2?圉站??,      lat: 37.468988, lng: 126.433429, km: 63.8, dwellSec: 60 },
        ],
      },
      {
        id: "Shinbundang",
        name: "??窷??? ???寢?",
        nameEn: "Seoul Metropolitan Subway Shinbundang Line",
        color: "#B81B30",
        category: "?琿?",
        directions: { up: "?? (? 諻拘庖)", down: "?? (窵? 諻拘庖)" },
        stations: [
          { name: "?", lat: 37.5157525, lng: 127.0196599, km: 0,    dwellSec: 30 },
          { name: "?潤?", lat: 37.5099469, lng: 127.0218958, km: 0.66, dwellSec: 30 },
          { name: "???, lat: 37.5035711, lng: 127.0249157, km: 1.417, dwellSec: 30 },
          { name: "穈", lat: 37.4971249, lng: 127.0279931, km: 2.183, dwellSec: 30 },
          { name: "?", lat: 37.4838155, lng: 127.0346881, km: 3.78, dwellSec: 30 },
          { name: "??紡?", lat: 37.4701433, lng: 127.0383592, km: 5.405 },
          { name: "麮匪??域?窱?, lat: 37.4483921, lng: 127.0545673, km: 8.266 },
          { name: "??", lat: 37.3943639, lng: 127.1111873, km: 16.466, dwellSec: 30 },
          { name: "??", lat: 37.3673677, lng: 127.1084329, km: 19.504, dwellSec: 30 },
          { name: "諯資?", lat: 37.3499880, lng: 127.1089145, km: 21.437, dwellSec: 30 },
          { name: "??", lat: 37.3378769, lng: 127.1028482, km: 23.065 },
          { name: "??窱科痍", lat: 37.3224903, lng: 127.0947567, km: 25.1 },
          { name: "?梵陬", lat: 37.3134135, lng: 127.0803106, km: 26.776 },
          { name: "??", lat: 37.2974137, lng: 127.0693373, km: 28.896 },
          { name: "窵?鴗?", lat: 37.2885470, lng: 127.0514993, km: 31.241, dwellSec: 30 },
          { name: "窵?", lat: 37.3024813, lng: 127.0435221, km: 33.17, dwellSec: 30 },
        ],
      },
      {
        id: "Suin-Bundang",
        name: "??窷??? ?繚賱??,
        nameEn: "Seoul Metropolitan Subway Suin-Bundang Line",
        color: "#ECA300",
        category: "?琿?",
        directions: { up: "?? (麮卿?謔?諻拘庖)", down: "?? (?賄? 諻拘庖)" },
        stations: [
          { name: "麮卿?謔?, lat: 37.5808603, lng: 127.0479196, km: 0, dwellSec: 30 },
          { name: "?謔?, lat: 37.5607527, lng: 127.0389074, km: 2.465, dwellSec: 30 },
          { name: "???, lat: 37.5436119, lng: 127.0447677, km: 4.53 },
          { name: "?筋???域", lat: 37.5278095, lng: 127.0407302, km: 6.326 },
          { name: "穈窱科痍", lat: 37.5167874, lng: 127.0414625, km: 7.599 },
          { name: "??謔?, lat: 37.5106840, lng: 127.0437422, km: 8.307 },
          { name: "??", lat: 37.5045872, lng: 127.0490134, km: 9.158 },
          { name: "?", lat: 37.4962880, lng: 127.0528888, km: 10.142 },
          { name: "?部", lat: 37.4906191, lng: 127.0555009, km: 10.813 },
          { name: "窱禺ㄐ", lat: 37.4869490, lng: 127.0594678, km: 11.385 },
          { name: "穈??, lat: 37.4891184, lng: 127.0660366, km: 12.027 },
          { name: "?諈到?筋", lat: 37.4914098, lng: 127.0727398, km: 12.683 },
          { name: "??", lat: 37.4871034, lng: 127.1018995, km: 15.824, dwellSec: 30 },
          { name: "貐蛙?", lat: 37.4701492, lng: 127.1267445, km: 18.962 },
          { name: "穈麮?", lat: 37.4486985, lng: 127.1267480, km: 21.355 },
          { name: "??", lat: 37.4397127, lng: 127.1277696, km: 22.359 },
          { name: "諈刺?", lat: 37.4321817, lng: 127.1291124, km: 23.204, dwellSec: 30 },
          { name: "?潤?", lat: 37.4112825, lng: 127.1287390, km: 25.533 },
          { name: "?渠坐", lat: 37.3952555, lng: 127.1282725, km: 27.321 },
          { name: "??", lat: 37.3848959, lng: 127.1233499, km: 28.647 },
          { name: "?", lat: 37.3783898, lng: 127.1142619, km: 29.728 },
          { name: "??", lat: 37.3661802, lng: 127.1081423, km: 31.317, dwellSec: 30 },
          { name: "諯資?", lat: 37.3499987, lng: 127.1090211, km: 33.121 },
          { name: "?月收", lat: 37.3395228, lng: 127.1089708, km: 34.286 },
          { name: "鴥趣?", lat: 37.3245618, lng: 127.1074384, km: 35.972, dwellSec: 30 },
          { name: "貐渥?", lat: 37.3123537, lng: 127.1083504, km: 37.337 },
          { name: "窱科", lat: 37.2990235, lng: 127.1057833, km: 38.885 },
          { name: "??", lat: 37.2861829, lng: 127.1114081, km: 40.474 },
          { name: "篣堅", lat: 37.2755112, lng: 127.1160397, km: 41.808 },
          { name: "??", lat: 37.2616481, lng: 127.1089132, km: 43.8 },
          { name: "麮卿?", lat: 37.2599671, lng: 127.0795655, km: 46.501 },
          { name: "?", lat: 37.2513378, lng: 127.0713229, km: 47.707 },
          { name: "諤", lat: 37.2455829, lng: 127.0570030, km: 49.259 },
          { name: "諤欠?窷?", lat: 37.2530129, lng: 127.0404191, km: 51.054 },
          { name: "???痍", lat: 37.2617204, lng: 127.0318902, km: 52.363 },
          { name: "諤曰?", lat: 37.2654534, lng: 127.0157180, km: 53.853 },
          { name: "??", lat: 37.2658117, lng: 126.9993051, km: 55.43, dwellSec: 30 },
          { name: "窸?", lat: 37.2494292, lng: 126.9796874, km: 58.166 },
          { name: "?月版麮?, lat: 37.2431034, lng: 126.9634832, km: 59.769 },
          { name: "?渥?", lat: 37.2503749, lng: 126.9081819, km: 64.87 },
          { name: "?潺版", lat: 37.2616308, lng: 126.8833633, km: 67.417 },
          { name: "?禺收", lat: 37.2915384, lng: 126.8573725, km: 72.146 },
          { name: "????, lat: 37.3103831, lng: 126.8527773, km: 74.433, dwellSec: 30 },
          { name: "鴗?", lat: 37.3160633, lng: 126.8374647, km: 76.038 },
          { name: "窸?", lat: 37.3169005, lng: 126.8220934, km: 77.401 },
          { name: "黕?", lat: 37.3211622, lng: 126.8049024, km: 79.028 },
          { name: "?", lat: 37.3274089, lng: 126.7879605, km: 80.69 },
          { name: "?虜?到?", lat: 37.3380983, lng: 126.7661867, km: 82.954 },
          { name: "??", lat: 37.3520536, lng: 126.7419901, km: 85.709 },
          { name: "?木??, lat: 37.3623497, lng: 126.7386441, km: 87.126, dwellSec: 30 },
          { name: "?科?", lat: 37.3807129, lng: 126.7458836, km: 89.312 },
          { name: "?雀", lat: 37.3921604, lng: 126.7423159, km: 90.735 },
          { name: "???禹筋", lat: 37.4013038, lng: 126.7325487, km: 92.078 },
          { name: "?賄??潤?", lat: 37.4004832, lng: 126.7215322, km: 93.073 },
          { name: "?資筋??, lat: 37.4020968, lng: 126.7077547, km: 94.373 },
          { name: "?刺??賈??欠???, lat: 37.4082483, lng: 126.6943986, km: 95.741 },
          { name: "???, lat: 37.4136809, lng: 126.6856687, km: 96.72, dwellSec: 30 },
          { name: "?域?", lat: 37.4183698, lng: 126.6779472, km: 97.579 },
          { name: "?㏑?", lat: 37.4303043, lng: 126.6538721, km: 100.151 },
          { name: "?貲??", lat: 37.4489904, lng: 126.6493767, km: 102.548 },
          { name: "?原?", lat: 37.4612390, lng: 126.6370849, km: 104.331 },
          { name: "?", lat: 37.4689305, lng: 126.6236807, km: 105.809 },
          { name: "?賄?", lat: 37.4769719, lng: 126.6173267, km: 106.914, dwellSec: 30 },
        ],
      },
      {
        id: "Gyeongui-Jungang",
        name: "??窷??? 窶趣?繚鴗???,
        nameEn: "Seoul Metropolitan Subway Gyeongui-Jungang Line",
        color: "#6AC2B3",
        category: "?琿?",
        directions: { up: "?? (諡賄 諻拘庖)", down: "?? (?拘爰 諻拘庖)" },
        // Main all-stop corridor: Munsan ??Yongmun. Seoul Station, Imjingang,
        // Dorasan, and sparse Jipyeong services need branch/short-turn support.
        stations: [
          { name: "諡賄", lat: 37.8536263, lng: 126.7879859, km: 0, dwellSec: 30 },
          { name: "?ˉ", lat: 37.8142380, lng: 126.7926805, km: 4.387 },
          { name: "?§", lat: 37.7955006, lng: 126.7922970, km: 6.537 },
          { name: "篣?", lat: 37.7658340, lng: 126.7737312, km: 10.61 },
          { name: "篣?", lat: 37.7506152, lng: 126.7657991, km: 12.71 },
          { name: "?渥?", lat: 37.7245774, lng: 126.7667245, km: 15.814 },
          { name: "?潺", lat: 37.7121076, lng: 126.7613347, km: 17.28 },
          { name: "??", lat: 37.6931171, lng: 126.7610484, km: 19.393 },
          { name: "?潰", lat: 37.6821094, lng: 126.7699182, km: 21.008 },
          { name: "?", lat: 37.6716106, lng: 126.7867036, km: 22.955 },
          { name: "諻梵?", lat: 37.6575978, lng: 126.7949216, km: 24.673 },
          { name: "窸∫", lat: 37.6451532, lng: 126.8021797, km: 26.197 },
          { name: "?窸?, lat: 37.6313327, lng: 126.8103746, km: 27.895, dwellSec: 30 },
          { name: "?伉部", lat: 37.6185073, lng: 126.8213369, km: 29.643 },
          { name: "??", lat: 37.6122614, lng: 126.8341932, km: 31.043 },
          { name: "穈坐", lat: 37.6124295, lng: 126.8446915, km: 31.968 },
          { name: "?筏?匪陬?", lat: 37.6022601, lng: 126.8689497, km: 34.504 },
          { name: "??", lat: 37.5801350, lng: 126.8963173, km: 37.953 },
          { name: "???賈站??", lat: 37.5770829, lng: 126.9008550, km: 38.478, dwellSec: 30 },
          { name: "穈鮈?, lat: 37.5682788, lng: 126.9155556, km: 40.111 },
          { name: "???筋", lat: 37.5573063, lng: 126.9271637, km: 41.737, dwellSec: 30 },
          { name: "???", lat: 37.5519834, lng: 126.9357580, km: 42.702 },
          { name: "窸蛟?", lat: 37.5419764, lng: 126.9533741, km: 44.655, dwellSec: 30 },
          { name: "?到偷窸蛙???, lat: 37.5383603, lng: 126.9635452, km: 45.647 },
          { name: "?拖", lat: 37.5285081, lng: 126.9636297, km: 47.208, dwellSec: 30 },
          { name: "?渥?(窱卿汗鴗?諻狩窵)", lat: 37.5222635, lng: 126.9739881, km: 49.028 },
          { name: "??窸?, lat: 37.5196341, lng: 126.9892394, km: 50.43 },
          { name: "?", lat: 37.5297070, lng: 127.0099115, km: 52.679 },
          { name: "?伊?", lat: 37.5410818, lng: 127.0196130, km: 54.233 },
          { name: "??", lat: 37.5505539, lng: 127.0349018, km: 55.98 },
          { name: "?謔?, lat: 37.5613457, lng: 127.0384326, km: 57.346, dwellSec: 30 },
          { name: "麮卿?謔?, lat: 37.5806700, lng: 127.0481704, km: 59.753, dwellSec: 30 },
          { name: "?萼", lat: 37.5898882, lng: 127.0583976, km: 61.141, dwellSec: 30 },
          { name: "鴗?", lat: 37.5952240, lng: 127.0771185, km: 62.907 },
          { name: "??", lat: 37.5970179, lng: 127.0860245, km: 63.717, dwellSec: 30 },
          { name: "諤", lat: 37.5996557, lng: 127.0931647, km: 64.411, dwellSec: 30 },
          { name: "??", lat: 37.6068926, lng: 127.1089835, km: 66.042 },
          { name: "窱禺收", lat: 37.6035577, lng: 127.1443580, km: 69.275 },
          { name: "??", lat: 37.6088094, lng: 127.1611904, km: 70.878 },
          { name: "??", lat: 37.6035431, lng: 127.1949837, km: 74.574 },
          { name: "??", lat: 37.5862296, lng: 127.2101005, km: 76.996, dwellSec: 30 },
          { name: "?", lat: 37.5793764, lng: 127.2236437, km: 78.421 },
          { name: "?", lat: 37.5469642, lng: 127.2446171, km: 82.577 },
          { name: "?湊虜??, lat: 37.5544075, lng: 127.3107824, km: 88.986 },
          { name: "??", lat: 37.5456213, lng: 127.3299121, km: 90.935 },
          { name: "??", lat: 37.5249382, lng: 127.3735585, km: 95.573 },
          { name: "窱原?", lat: 37.5164148, lng: 127.4003392, km: 98.544 },
          { name: "??", lat: 37.5136649, lng: 127.4443172, km: 102.538 },
          { name: "?月?", lat: 37.5059864, lng: 127.4746621, km: 105.347 },
          { name: "??", lat: 37.4920648, lng: 127.4926684, km: 107.622, dwellSec: 30 },
          { name: "??", lat: 37.4686581, lng: 127.5476780, km: 113.427 },
          { name: "?拘爰", lat: 37.4823229, lng: 127.5945812, km: 118.024, dwellSec: 30 },
        ],
      },
      {
        id: "Gyeongchun",
        name: "??窷??? 窶趣???,
        nameEn: "Seoul Metropolitan Subway Gyeongchun Line",
        color: "#007A62",
        category: "?琿?",
        directions: { up: "?? (麮卿?謔?諻拘庖)", down: "?? (黺? 諻拘庖)" },
        // Main all-stop corridor: Cheongnyangni ??Chuncheon. Sangbong and
        // Gwangwoon Univ. variants need branch/short-turn support; ITX is separate.
        stations: [
          { name: "麮卿?謔?, lat: 37.5807488, lng: 127.0480007, km: 0, dwellSec: 30 },
          { name: "?萼", lat: 37.5898882, lng: 127.0583976, km: 1.389, dwellSec: 30 },
          { name: "鴗?", lat: 37.5952240, lng: 127.0771185, km: 3.155 },
          { name: "??", lat: 37.5975308, lng: 127.0865782, km: 4.028, dwellSec: 30 },
          { name: "諤", lat: 37.6001579, lng: 127.0920944, km: 4.597, dwellSec: 30 },
          { name: "?", lat: 37.6126451, lng: 127.1032226, km: 6.586 },
          { name: "穈坐", lat: 37.6339552, lng: 127.1147005, km: 9.174 },
          { name: "貐", lat: 37.6426852, lng: 127.1283724, km: 10.775 },
          { name: "?湊???, lat: 37.6482702, lng: 127.1435237, km: 12.249 },
          { name: "?禺?", lat: 37.6511137, lng: 127.1769097, km: 15.498 },
          { name: "篣部", lat: 37.6373387, lng: 127.2074212, km: 19.083 },
          { name: "??貲?", lat: 37.6532338, lng: 127.2444884, km: 23.028, dwellSec: 30 },
          { name: "麮???, lat: 37.6592290, lng: 127.2850612, km: 26.892 },
          { name: "諤?", lat: 37.6527896, lng: 127.3116743, km: 29.406 },
          { name: "??梵收", lat: 37.6838528, lng: 127.3795675, km: 36.751 },
          { name: "麮厝?", lat: 37.7355228, lng: 127.4266248, km: 44.313 },
          { name: "??", lat: 37.7701614, lng: 127.4544037, km: 49.127 },
          { name: "穈??, lat: 37.8145424, lng: 127.5107447, km: 56.228, dwellSec: 30 },
          { name: "窱渠???, lat: 37.8319414, lng: 127.5571302, km: 60.775 },
          { name: "諻桿?謔?, lat: 37.8307979, lng: 127.5891698, km: 63.699 },
          { name: "穈?", lat: 37.8057393, lng: 127.6341157, km: 68.998 },
          { name: "篧??", lat: 37.8184499, lng: 127.7143217, km: 76.443 },
          { name: "?到?麮?, lat: 37.8639923, lng: 127.7239204, km: 82.4, dwellSec: 30 },
          { name: "黺?", lat: 37.8845276, lng: 127.7166203, km: 85.089, dwellSec: 30 },
        ],
      },
      {
        id: "Gyeonggang",
        name: "??窷??? 窶赭???,
        nameEn: "Seoul Metropolitan Subway Gyeonggang Line",
        color: "#0B318F",
        category: "?琿?",
        directions: { up: "?? (?? 諻拘庖)", down: "?? (?科ˉ 諻拘庖)" },
        // Main all-stop corridor: Pangyo to Yeoju. Bubal short-turns share the
        // same template; future extensions west of Pangyo and east of Yeoju
        // need branch/extension support before being folded into this line.
        stations: [
          { name: "??", lat: 37.3947577, lng: 127.1115664, km: 0, dwellSec: 30 },
          { name: "?梵", lat: 37.3947450, lng: 127.1206192, km: 0.763, dwellSec: 30 },
          { name: "?渠坐", lat: 37.3946908, lng: 127.1276046, km: 1.38, dwellSec: 30 },
          { name: "?潺?", lat: 37.4086667, lng: 127.2033703, km: 8.314 },
          { name: "窶赭萼窵ˉ", lat: 37.3989152, lng: 127.2532951, km: 13.271 },
          { name: "黕?", lat: 37.3731656, lng: 127.3004700, km: 18.387 },
          { name: "窸木???, lat: 37.3505190, lng: 127.3462861, km: 23.206 },
          { name: "????黕?, lat: 37.3156754, lng: 127.4052750, km: 30.009 },
          { name: "?渥?", lat: 37.2642550, lng: 127.4421828, km: 37.791 },
          { name: "賱諻?, lat: 37.2604283, lng: 127.4903138, km: 42.265, dwellSec: 30 },
          { name: "?賄????", lat: 37.2936415, lng: 127.5706498, km: 50.565 },
          { name: "?科ˉ", lat: 37.2828230, lng: 127.6290136, km: 55.96, dwellSec: 30 },
        ],
      },
      {
        id: "Seohae",
        name: "??窷??? ???,
        nameEn: "Seoul Metropolitan Subway Seohae Line",
        color: "#5EAC41",
        category: "?琿?",
        directions: { up: "?? (?潰 諻拘庖)", down: "?? (?? 諻拘庖)" },
        // Main all-stop corridor: Ilsan to Wonsi. Most trains short-turn at
        // Daegok; future southward extensions need branch/extension support.
        stations: [
          { name: "?潰", lat: 37.6821094, lng: 126.7699182, km: 0, dwellSec: 30 },
          { name: "?", lat: 37.6716106, lng: 126.7867036, km: 1.947 },
          { name: "諻梵?", lat: 37.6575978, lng: 126.7949216, km: 3.665 },
          { name: "窸∫", lat: 37.6451532, lng: 126.8021797, km: 5.19 },
          { name: "?窸?, lat: 37.6312822, lng: 126.8102660, km: 6.889, dwellSec: 30 },
          { name: "?伉部", lat: 37.6184109, lng: 126.8211962, km: 8.636 },
          { name: "篧?禹陬??, lat: 37.5605190, lng: 126.8044964, km: 16.143, dwellSec: 30 },
          { name: "??", lat: 37.5221625, lng: 126.8049364, km: 20.54 },
          { name: "賱麮??拖?", lat: 37.5055909, lng: 126.7974602, km: 22.573 },
          { name: "?", lat: 37.4824192, lng: 126.7951956, km: 25.195, dwellSec: 30 },
          { name: "????, lat: 37.4687000, lng: 126.7972489, km: 26.758 },
          { name: "????, lat: 37.4501052, lng: 126.7930513, km: 28.94 },
          { name: "??", lat: 37.4393371, lng: 126.7868733, km: 30.256 },
          { name: "??", lat: 37.4096889, lng: 126.7878815, km: 33.624 },
          { name: "??痍", lat: 37.3820315, lng: 126.8058563, km: 37.213 },
          { name: "??伉部", lat: 37.3702397, lng: 126.8088237, km: 38.557 },
          { name: "?禺站", lat: 37.3489976, lng: 126.8091335, km: 40.965 },
          { name: "??", lat: 37.3343857, lng: 126.8099592, km: 42.597 },
          { name: "黕?", lat: 37.3198213, lng: 126.8080122, km: 44.236, dwellSec: 30 },
          { name: "?", lat: 37.3130971, lng: 126.7957458, km: 45.625 },
          { name: "??", lat: 37.3025413, lng: 126.7868312, km: 47.136, dwellSec: 30 },
        ],
      },
      {
        id: "Incheon-Metro-1",
        name: "?賄? ??麮? 1?賄?",
        nameEn: "Incheon Subway Line 1",
        color: "#B4C7E7",
        category: "?琿?",
        directions: { up: "?? (?㏑??禺?黺?窸蛙? 諻拘庖)", down: "?? (窶?刮?陬??諻拘庖)" },
        // Incheon Line 1 after the 2025-06-28 Geomdan extension: 33 stations,
        // 37.1 km. Station order follows OSM route 19425646 because its stop
        // members include all stations, including ?賄???筋.
        stations: [
          { name: "?㏑??禺?黺?窸蛙?", lat: 37.4067870, lng: 126.6260503, km: 0, dwellSec: 30 },
          { name: "窱原??炭鴔窱?, lat: 37.3997664, lng: 126.6305042, km: 0.874 },
          { name: "?潤?渣???, lat: 37.3933820, lng: 126.6345132, km: 1.668 },
          { name: "?賄???筋", lat: 37.3860039, lng: 126.6394959, km: 2.599 },
          { name: "鴔??貐渠鴔", lat: 37.3780049, lng: 126.6455001, km: 3.634 },
          { name: "??貲???, lat: 37.3819920, lng: 126.6559828, km: 5.013 },
          { name: "儥?欠???, lat: 37.3878438, lng: 126.6616832, km: 5.835 },
          { name: "??", lat: 37.3983217, lng: 126.6739517, km: 7.441 },
          { name: "??", lat: 37.4045662, lng: 126.6806620, km: 8.354 },
          { name: "???, lat: 37.4124962, lng: 126.6880891, km: 9.454 },
          { name: "???, lat: 37.4179744, lng: 126.6938914, km: 10.25 },
          { name: "??", lat: 37.4271567, lng: 126.6990793, km: 11.404 },
          { name: "諡貲?窶赭萼??, lat: 37.4348761, lng: 126.6978836, km: 12.275 },
          { name: "?賄??圉站??, lat: 37.4418961, lng: 126.6997770, km: 13.082 },
          { name: "????", lat: 37.4500411, lng: 126.7010891, km: 13.995 },
          { name: "?賄??痍", lat: 37.4579298, lng: 126.7022364, km: 14.878 },
          { name: "穈??曰掠謔?, lat: 37.4673120, lng: 126.7079669, km: 16.257 },
          { name: "賱?穇圉收", lat: 37.4778688, lng: 126.7102992, km: 17.457 },
          { name: "??", lat: 37.4854320, lng: 126.7184693, km: 18.633 },
          { name: "賱??, lat: 37.4899777, lng: 126.7237760, km: 19.386, dwellSec: 30 },
          { name: "賱????, lat: 37.4983757, lng: 126.7223422, km: 20.329 },
          { name: "賱?筋麮?, lat: 37.5080784, lng: 126.7206376, km: 21.42, dwellSec: 30 },
          { name: "穈", lat: 37.5167011, lng: 126.7215481, km: 22.383 },
          { name: "??", lat: 37.5303004, lng: 126.7225937, km: 23.898 },
          { name: "窶趣窱??筋", lat: 37.5384258, lng: 126.7226536, km: 24.802 },
          { name: "窸", lat: 37.5432872, lng: 126.7278961, km: 25.68 },
          { name: "??", lat: 37.5451262, lng: 126.7387700, km: 26.769 },
          { name: "諻?", lat: 37.5536206, lng: 126.7450735, km: 27.866 },
          { name: "篞欠?", lat: 37.5674066, lng: 126.7422024, km: 29.496 },
          { name: "窸?", lat: 37.5715213, lng: 126.7366990, km: 30.243, dwellSec: 30 },
          { name: "?", lat: 37.5921919, lng: 126.7133760, km: 34.284 },
          { name: "???到???, lat: 37.6026985, lng: 126.6985035, km: 36.293 },
          { name: "窶?刮?陬??, lat: 37.6024640, lng: 126.6885315, km: 37.172, dwellSec: 30 },
        ],
      },
      {
        id: "Incheon-Metro-2",
        name: "?賄? ??麮? 2?賄?",
        nameEn: "Incheon Subway Line 2",
        color: "#F4A462",
        category: "LRT",
        directions: { up: "?? (窶?到諝?諻拘庖)", down: "?? (?渥 諻拘庖)" },
        // Incheon Line 2 is a driverless light metro using ITC 2000-series cars.
        // Station order follows OSM route 7527496; its stop members cover all 27 stations.
        stations: [
          { name: "窶?到諝?, lat: 37.5949031, lng: 126.6282878, km: 0, dwellSec: 30 },
          { name: "?虜", lat: 37.5952783, lng: 126.6427535, km: 1.326 },
          { name: "窶?到穇圉收", lat: 37.6019359, lng: 126.6570932, km: 2.797 },
          { name: "諤?", lat: 37.5974375, lng: 126.6673527, km: 3.849 },
          { name: "??", lat: 37.5925926, lng: 126.6728784, km: 4.622 },
          { name: "??", lat: 37.5847513, lng: 126.6759397, km: 5.541 },
          { name: "窶??, lat: 37.5685199, lng: 126.6756990, km: 7.384, dwellSec: 30 },
          { name: "窶諻?", lat: 37.5608918, lng: 126.6774743, km: 8.266 },
          { name: "????窶赭萼??, lat: 37.5510172, lng: 126.6770356, km: 9.365 },
          { name: "?筋麮?, lat: 37.5433208, lng: 126.6767447, km: 10.221 },
          { name: "穈??, lat: 37.5241073, lng: 126.6752382, km: 12.362 },
          { name: "穈??????, lat: 37.5170880, lng: 126.6767385, km: 13.233 },
          { name: "?", lat: 37.5063870, lng: 126.6761225, km: 14.424, dwellSec: 30 },
          { name: "???科??", lat: 37.4995411, lng: 126.6757103, km: 15.186 },
          { name: "?賄?穈鮈?, lat: 37.4895993, lng: 126.6751276, km: 16.293 },
          { name: "穈?科", lat: 37.4835734, lng: 126.6844519, km: 17.451 },
          { name: "鴥潰?窱匪??圉", lat: 37.4732154, lng: 126.6808599, km: 18.827 },
          { name: "鴥潰?", lat: 37.4648978, lng: 126.6788699, km: 19.77, dwellSec: 30 },
          { name: "?紡窸蛙?", lat: 37.4583648, lng: 126.6813015, km: 20.775 },
          { name: "??????, lat: 37.4576075, lng: 126.6929190, km: 21.804 },
          { name: "?賄??痍", lat: 37.4567305, lng: 126.7028705, km: 22.688, dwellSec: 30 },
          { name: "???禹掠謔?, lat: 37.4566506, lng: 126.7112017, km: 23.426 },
          { name: "諈刺??渥???, lat: 37.4558040, lng: 126.7199840, km: 24.207 },
          { name: "諤?", lat: 37.4549230, lng: 126.7322622, km: 25.296 },
          { name: "?刺?窱科痍", lat: 37.4481210, lng: 126.7373278, km: 26.536 },
          { name: "?賄??窸蛙?", lat: 37.4484300, lng: 126.7533155, km: 28.004 },
          { name: "?渥", lat: 37.4393136, lng: 126.7594871, km: 29.277, dwellSec: 30 },
        ],
      },
      {
        id: "Gimpo-Goldline",
        name: "篧?禹釣???,
        nameEn: "Gimpo Goldline",
        color: "#ad8605",
        category: "LRT",
        directions: { up: "?? (?? 諻拘庖)", down: "?? (篧?禹陬??諻拘庖)" },
        // Gimpo Goldline: Yangchon ??Gimpo Int'l Airport 23.47 km, 10 stations.
        // Light metro / AGT-like automated service, modeled as all-stop only.
        stations: [
          { name: "??",       lat: 37.641658, lng: 126.614822, km: 0,    dwellSec: 30 },
          { name: "窱禺?",       lat: 37.645315, lng: 126.628743, km: 1.37 },
          { name: "諤",       lat: 37.640560, lng: 126.644145, km: 2.54 },
          { name: "?伉萼",       lat: 37.643975, lng: 126.669070, km: 5.53 },
          { name: "?渥?",       lat: 37.653783, lng: 126.683932, km: 7.22 },
          { name: "穇貲賱?",   lat: 37.631465, lng: 126.705881, km: 10.61 },
          { name: "?科",       lat: 37.620157, lng: 126.719728, km: 12.48 },
          { name: "?炭",       lat: 37.612354, lng: 126.732440, km: 13.86 },
          { name: "窸?",       lat: 37.601304, lng: 126.770147, km: 17.55 },
          { name: "篧?禹陬??,   lat: 37.562389, lng: 126.801895, km: 23.47, dwellSec: 30 },
        ],
      },
      {
        id: "Daegu-Metro-1",
        name: "?窱???麮? 1?賄?",
        nameEn: "Daegu Metro Line 1",
        color: "#EF5E37",
        category: "?琿?",
        directions: { up: "?? (?欠?諈部 諻拘庖)", down: "?? (?? 諻拘庖)" },
        // Daegu Line 1: Seolhwa-Myeonggok?ayang all-stop route; OSM
        // relation 7685464 includes the 2024 Hayang extension and 35 stops.
        stations: [
          { name: "?欠?諈部", lat: 35.7986759, lng: 128.4893370, km: 0.000, dwellSec: 30 },
          { name: "??", lat: 35.8042787, lng: 128.5003930, km: 1.189 },
          { name: "?窸?, lat: 35.8094126, lng: 128.5125079, km: 2.431 },
          { name: "鴔?", lat: 35.8137562, lng: 128.5226822, km: 3.490 },
          { name: "?偽", lat: 35.8161096, lng: 128.5304345, km: 4.241 },
          { name: "?", lat: 35.8189392, lng: 128.5378522, km: 4.983 },
          { name: "??", lat: 35.8240106, lng: 128.5458898, km: 5.932 },
          { name: "?∮?", lat: 35.8312484, lng: 128.5519764, km: 6.906 },
          { name: "??????, lat: 35.8369013, lng: 128.5571566, km: 7.696 },
          { name: "?諈?, lat: 35.8392258, lng: 128.5650316, km: 8.460 },
          { name: "????, lat: 35.8391616, lng: 128.5738399, km: 9.256 },
          { name: "?隆諢?, lat: 35.8407964, lng: 128.5813354, km: 9.987 },
          { name: "??貐?", lat: 35.8443850, lng: 128.5886490, km: 10.758 },
          { name: "窱?", lat: 35.8503938, lng: 128.5906054, km: 11.518 },
          { name: "諈?", lat: 35.8569420, lng: 128.5907999, km: 12.246 },
          { name: "諻???, lat: 35.8652084, lng: 128.5934479, km: 13.203, dwellSec: 30 },
          { name: "鴗?諢?, lat: 35.8707400, lng: 128.5941029, km: 13.822 },
          { name: "?窱科", lat: 35.8762249, lng: 128.5970846, km: 14.535 },
          { name: "儦?", lat: 35.8760602, lng: 128.6050621, km: 15.273 },
          { name: "??", lat: 35.8745695, lng: 128.6176043, km: 16.482 },
          { name: "??窱科", lat: 35.8772995, lng: 128.6274527, km: 17.429, dwellSec: 30 },
          { name: "?筋麮?, lat: 35.8844960, lng: 128.6323595, km: 18.348 },
          { name: "??窱?, lat: 35.8871194, lng: 128.6399259, km: 19.108 },
          { name: "??", lat: 35.8859970, lng: 128.6503660, km: 20.156 },
          { name: "?渥?", lat: 35.8835489, lng: 128.6588633, km: 20.982 },
          { name: "諻拖?", lat: 35.8797454, lng: 128.6696328, km: 22.049 },
          { name: "?抱?", lat: 35.8762307, lng: 128.6813844, km: 23.178 },
          { name: "?刮?", lat: 35.8696762, lng: 128.6927905, km: 24.479 },
          { name: "?萼", lat: 35.8666654, lng: 128.7017034, km: 25.393 },
          { name: "諻??, lat: 35.8658937, lng: 128.7136998, km: 26.478 },
          { name: "穈", lat: 35.8678436, lng: 128.7239176, km: 27.442 },
          { name: "?", lat: 35.8711424, lng: 128.7337402, km: 28.400, dwellSec: 30 },
          { name: "?窱秒???貐?", lat: 35.8716571, lng: 128.7511584, km: 30.021 },
          { name: "賱??, lat: 35.9001593, lng: 128.8031097, km: 35.863 },
          { name: "??", lat: 35.9093966, lng: 128.8175446, km: 37.549, dwellSec: 30 },
        ],
      },
      {
        id: "Daegu-Metro-2",
        name: "?窱???麮? 2?賄?",
        nameEn: "Daegu Metro Line 2",
        color: "#33AA46",
        category: "?琿?",
        directions: { up: "?? (諡賄? 諻拘庖)", down: "?? (?? 諻拘庖)" },
        // Daegu Line 2: Munyang?eungnam University all-stop route; OSM
        // relation 7685783 provides complete stop members for 29 stations.
        stations: [
          { name: "諡賄?", lat: 35.8643039, lng: 128.4371644, km: 0.000, dwellSec: 30 },
          { name: "?木", lat: 35.8653200, lng: 128.4579020, km: 2.831 },
          { name: "???, lat: 35.8572721, lng: 128.4656502, km: 3.967 },
          { name: "穈偷", lat: 35.8530741, lng: 128.4780960, km: 5.241 },
          { name: "窸??", lat: 35.8514819, lng: 128.4919275, km: 6.502 },
          { name: "?桿??域??到?", lat: 35.8516848, lng: 128.5070241, km: 7.869 },
          { name: "?湊部", lat: 35.8505073, lng: 128.5157932, km: 8.670 },
          { name: "?拖", lat: 35.8489970, lng: 128.5288891, km: 9.894 },
          { name: "鴥趣?", lat: 35.8504172, lng: 128.5382364, km: 10.755 },
          { name: "穈", lat: 35.8542959, lng: 128.5482878, km: 11.759 },
          { name: "??", lat: 35.8571511, lng: 128.5557793, km: 12.505 },
          { name: "?渠", lat: 35.8600749, lng: 128.5647603, km: 13.377 },
          { name: "諻?穈?, lat: 35.8623859, lng: 128.5736624, km: 14.219 },
          { name: "麮卿?賈?", lat: 35.8650572, lng: 128.5832267, km: 15.132, dwellSec: 30 },
          { name: "諻???, lat: 35.8653962, lng: 128.5937558, km: 16.117, dwellSec: 30 },
          { name: "窶趟?貐?", lat: 35.8630360, lng: 128.6030138, km: 17.001 },
          { name: "?窱科???, lat: 35.8597102, lng: 128.6141103, km: 18.089 },
          { name: "貒", lat: 35.8589767, lng: 128.6264978, km: 19.208 },
          { name: "?窱科痍", lat: 35.8587763, lng: 128.6357941, km: 20.047 },
          { name: "諤?", lat: 35.8588297, lng: 128.6451118, km: 20.886 },
          { name: "?渣", lat: 35.8546377, lng: 128.6541896, km: 21.841 },
          { name: "?堅", lat: 35.8463576, lng: 128.6719606, km: 23.699 },
          { name: "????", lat: 35.8425943, lng: 128.6799597, km: 24.534 },
          { name: "窸", lat: 35.8428572, lng: 128.6934096, km: 25.793 },
          { name: "?坐", lat: 35.8407648, lng: 128.7049547, km: 26.867 },
          { name: "?科?", lat: 35.8367886, lng: 128.7160117, km: 27.964 },
          { name: "??", lat: 35.8340264, lng: 128.7282908, km: 29.112 },
          { name: "?", lat: 35.8340509, lng: 128.7410260, km: 30.260 },
          { name: "??", lat: 35.8365664, lng: 128.7535757, km: 31.457, dwellSec: 30 },
        ],
      },
      {
        id: "Daegu-Metro-3",
        name: "?窱???麮? 3?賄?",
        nameEn: "Daegu Metro Line 3",
        color: "#FDA208",
        category: "Monorail",
        directions: { up: "?? (儦部窶趟?貐? 諻拘庖)", down: "?? (?拖? 諻拘庖)" },
        // Daegu Line 3: Chilgok Kyungpook Nat'l Univ. Medical Center ??Yongji.
        // Korea's first straddle-beam urban monorail; 30 stations, about 23.95 km.
        stations: [
          { name: "儦部窶趟?貐?",   lat: 35.958513, lng: 128.559856, km: 0,    dwellSec: 30 },
          { name: "??",           lat: 35.951571, lng: 128.559137, km: 0.8 },
          { name: "?掠",           lat: 35.944128, lng: 128.558301, km: 1.6 },
          { name: "??",           lat: 35.937750, lng: 128.556629, km: 2.3 },
          { name: "儦部?渥?",       lat: 35.931544, lng: 128.554521, km: 3.1 },
          { name: "窱科?",           lat: 35.925777, lng: 128.550275, km: 3.8 },
          { name: "??",           lat: 35.919753, lng: 128.547359, km: 4.5 },
          { name: "諤木?",           lat: 35.912723, lng: 128.543359, km: 5.4 },
          { name: "諤木??",       lat: 35.904339, lng: 128.545648, km: 6.5 },
          { name: "?",           lat: 35.897835, lng: 128.546678, km: 7.3 },
          { name: "窸蛟",           lat: 35.892030, lng: 128.553548, km: 8.2 },
          { name: "諤?",           lat: 35.889842, lng: 128.561037, km: 9.0 },
          { name: "??",       lat: 35.888865, lng: 128.567867, km: 9.6 },
          { name: "??",           lat: 35.887871, lng: 128.574296, km: 10.2 },
          { name: "賱筋麮?,         lat: 35.883802, lng: 128.581398, km: 11.0 },
          { name: "?科窸蛙?",       lat: 35.875696, lng: 128.582052, km: 12.0 },
          { name: "?爰?",       lat: 35.869703, lng: 128.582221, km: 12.7 },
          { name: "麮卿?賈?",       lat: 35.864203, lng: 128.582325, km: 13.4, dwellSec: 30 },
          { name: "?到",           lat: 35.856674, lng: 128.583379, km: 14.2 },
          { name: "諈?",           lat: 35.856931, lng: 128.590143, km: 14.8, dwellSec: 30 },
          { name: "穇渠諻?",       lat: 35.855388, lng: 128.599592, km: 15.7 },
          { name: "?賵?",         lat: 35.854966, lng: 128.606335, km: 16.4 },
          { name: "??",       lat: 35.854298, lng: 128.615996, km: 17.2 },
          { name: "?窱禺紡?渠???, lat: 35.852365, lng: 128.625152, km: 18.2 },
          { name: "?渠旭?渥??,     lat: 35.845156, lng: 128.624445, km: 19.0 },
          { name: "?抱?",           lat: 35.839037, lng: 128.623901, km: 19.7 },
          { name: "?諈?,         lat: 35.831413, lng: 128.623188, km: 20.5 },
          { name: "鴔??,           lat: 35.825252, lng: 128.631819, km: 21.7 },
          { name: "貒狩",           lat: 35.820951, lng: 128.640013, km: 22.5 },
          { name: "?拖?",           lat: 35.818265, lng: 128.646436, km: 23.2, dwellSec: 30 },
        ],
        grades: [
          { from: 0, to: 23.2, type: "elevated", note: "憭折 3 ??頝典漣撘頠蝺???" },
        ],
      },
      {
        id: "Daejeon-Metro-1",
        name: "?????麮? 1?賄?",
        nameEn: "Daejeon Metro Line 1",
        color: "#007448",
        category: "?琿?",
        directions: { up: "?? (?? 諻拘庖)", down: "?? (諻? 諻拘庖)" },
        // Daejeon Line 1: Panam?anseok all-stop route; OSM relation
        // 7792527 provides complete stop members for 22 stations.
        stations: [
          { name: "??", lat: 36.3169619, lng: 127.4576797, km: 0.000, dwellSec: 30 },
          { name: "?", lat: 36.3196335, lng: 127.4489861, km: 0.852 },
          { name: "???, lat: 36.3294490, lng: 127.4429386, km: 2.161 },
          { name: "??", lat: 36.3313841, lng: 127.4333493, km: 3.180, dwellSec: 30 },
          { name: "鴗?諢?, lat: 36.3286138, lng: 127.4258937, km: 3.915 },
          { name: "鴗筋麮?, lat: 36.3248208, lng: 127.4195531, km: 4.637 },
          { name: "???穇圉收", lat: 36.3224022, lng: 127.4125356, km: 5.441 },
          { name: "?月ㄐ", lat: 36.3284108, lng: 127.4050960, km: 6.385 },
          { name: "?拘爰", lat: 36.3382554, lng: 127.3932978, km: 7.906 },
          { name: "?骨", lat: 36.3461286, lng: 127.3847192, km: 9.177 },
          { name: "?痍", lat: 36.3514837, lng: 127.3866258, km: 9.824, dwellSec: 30 },
          { name: "??麮原", lat: 36.3576300, lng: 127.3816126, km: 10.825, dwellSec: 30 },
          { name: "穈?", lat: 36.3577013, lng: 127.3727947, km: 11.615 },
          { name: "??", lat: 36.3583733, lng: 127.3645747, km: 12.356 },
          { name: "穈?", lat: 36.3546063, lng: 127.3544975, km: 13.408 },
          { name: "??到?", lat: 36.3537327, lng: 127.3417016, km: 14.703, dwellSec: 30 },
          { name: "窱科?", lat: 36.3567574, lng: 127.3306550, km: 15.748 },
          { name: "?隆??, lat: 36.3594558, lng: 127.3214460, km: 16.625 },
          { name: "??儢虛祭篣域", lat: 36.3667814, lng: 127.3179378, km: 17.650 },
          { name: "?賄?", lat: 36.3741401, lng: 127.3179740, km: 18.468 },
          { name: "鴔魽?, lat: 36.3843970, lng: 127.3195772, km: 19.635 },
          { name: "諻?", lat: 36.3926366, lng: 127.3144036, km: 20.667, dwellSec: 30 },
        ],
      },
      {
        id: "Gwangju-Metro-1",
        name: "窵ˉ ??麮? 1?賄?",
        nameEn: "Gwangju Metro Line 1",
        color: "#009088",
        category: "?琿?",
        directions: { up: "?? (?寨? 諻拘庖)", down: "?? (?? 諻拘庖)" },
        // Gwangju Line 1: Nokdong?yeongdong all-stop route; OSM relation
        // 13463725 provides complete stop members for 20 stations.
        stations: [
          { name: "?寨?", lat: 35.1068152, lng: 126.9340426, km: 0.000, dwellSec: 30 },
          { name: "??", lat: 35.1236547, lng: 126.9322702, km: 1.930 },
          { name: "??繚鴞?科?窱?, lat: 35.1331325, lng: 126.9281965, km: 3.048 },
          { name: "?刷?鴥?, lat: 35.1394057, lng: 126.9228689, km: 3.900 },
          { name: "諡貲??", lat: 35.1467213, lng: 126.9198690, km: 4.783, dwellSec: 30 },
          { name: "篣諢?穈", lat: 35.1507626, lng: 126.9146034, km: 5.445 },
          { name: "篣諢?穈", lat: 35.1537794, lng: 126.9100288, km: 5.979 },
          { name: "???", lat: 35.1545606, lng: 126.9017218, km: 6.927 },
          { name: "??穈?, lat: 35.1517511, lng: 126.8955310, km: 7.580 },
          { name: "?", lat: 35.1532570, lng: 126.8841168, km: 8.767 },
          { name: "??", lat: 35.1519537, lng: 126.8768469, km: 9.444 },
          { name: "??", lat: 35.1515347, lng: 126.8695561, km: 10.110 },
          { name: "?渥?", lat: 35.1504421, lng: 126.8586931, km: 11.107 },
          { name: "?炭", lat: 35.1467699, lng: 126.8486397, km: 12.120, dwellSec: 30 },
          { name: "篧?鴗豪貒木??潤", lat: 35.1431984, lng: 126.8412775, km: 12.898 },
          { name: "窸蛭", lat: 35.1441580, lng: 126.8117209, km: 15.724, dwellSec: 30 },
          { name: "?∫?窸蛙?", lat: 35.1436097, lng: 126.7995073, km: 16.839 },
          { name: "窵ˉ?∫?", lat: 35.1376413, lng: 126.7915725, km: 17.897, dwellSec: 30 },
          { name: "?", lat: 35.1316358, lng: 126.7875518, km: 18.666 },
          { name: "??", lat: 35.1247461, lng: 126.7687769, km: 20.581, dwellSec: 30 },
        ],
      },
      {
        id: "ITX-Cheongchun",
        name: "ITX-麮原?",
        nameEn: "ITX-Cheongchun",
        color: "#2563eb",
        category: "Intercity",
        directions: { up: "?拖 諻拘庖", down: "黺? 諻拘庖" },
        // KORAIL ITX-Cheongchun links Yongsan and Chuncheon via the
        // Gyeongwon, Jungang, and Gyeongchun corridors.
        stations: [
          { name: "?拖",       lat: 37.529953, lng: 126.964827, km: 0,    dwellSec: 75 },
          { name: "?伊?",       lat: 37.540264, lng: 127.018359, km: 4.9 },
          { name: "?謔?,     lat: 37.561486, lng: 127.038579, km: 7.5 },
          { name: "麮卿?謔?,     lat: 37.580596, lng: 127.048257, km: 9.3,  dwellSec: 60 },
          { name: "??",       lat: 37.597031, lng: 127.085656, km: 13.1 },
          { name: "?湊???,     lat: 37.648256, lng: 127.143532, km: 20.2 },
          { name: "?禺?",       lat: 37.651099, lng: 127.176896, km: 23.2 },
          { name: "??貲?",   lat: 37.653214, lng: 127.244490, km: 29.3 },
          { name: "諤?",       lat: 37.652775, lng: 127.311675, km: 35.3 },
          { name: "麮厝?",       lat: 37.735508, lng: 127.426636, km: 48.0 },
          { name: "穈??,       lat: 37.814518, lng: 127.510763, km: 58.4, dwellSec: 60 },
          { name: "穈?",       lat: 37.805714, lng: 127.634129, km: 69.5 },
          { name: "?到?麮?,     lat: 37.864011, lng: 127.723938, km: 79.2, dwellSec: 60 },
          { name: "黺?",       lat: 37.884560, lng: 127.716664, km: 81.1, dwellSec: 75 },
        ],
      },
      {
        id: "KTX-Gyeongbu",
        name: "KTX 窶趟???,
        nameEn: "KTX Gyeongbu Line",
        color: "#0c4ca3",
        category: "HSR",
        directions: { up: "?? (? 諻拘庖)", down: "?? (賱??諻拘庖)" },
        // KTX 窶趟?窸???+ ?潺????潤 ?渣?. 貐貲???鴥潰? ?馬??10穈?
        // 儢月?(???賄? ??諢???417.5 km).
        stations: [
          { name: "?",         lat: 37.5547, lng: 126.9706, km: 0,    dwellSec: 90 },
          { name: "窵?",         lat: 37.4159, lng: 126.8849, km: 22 },
          { name: "麮??",     lat: 36.7945, lng: 127.1043, km: 96 },
          { name: "?木",         lat: 36.6202, lng: 127.3260, km: 128 },
          { name: "???,         lat: 36.3320, lng: 127.4346, km: 161, dwellSec: 60 },
          { name: "篧麮?窱禺站)",   lat: 36.1153, lng: 128.1732, km: 225 },
          { name: "??窱?,       lat: 35.8794, lng: 128.6285, km: 293, dwellSec: 60 },
          { name: "?祭鴥?,       lat: 35.7975, lng: 129.1369, km: 335 },
          { name: "?賄",         lat: 35.5512, lng: 129.1330, km: 364 },
          { name: "賱??,         lat: 35.1153, lng: 129.0418, km: 418, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Honam",
        name: "KTX ?賈??,
        nameEn: "KTX Honam Line",
        color: "#2563eb",
        category: "HSR",
        directions: { up: "?拖 諻拘庖", down: "諈拗 諻拘庖" },
        // KORAIL operates Honam KTX on the Yongsan/Seoul - Gwangju-Songjeong/Mokpo axis.
        // This seed models the representative Yongsan - Mokpo high-speed stopping pattern.
        stations: [
          { name: "?拖",       lat: 37.529849, lng: 126.964561, km: 0,     dwellSec: 90 },
          { name: "窵?",       lat: 37.4159,   lng: 126.8849,   km: 18.4 },
          { name: "麮??",   lat: 36.794380, lng: 127.104499, km: 104.0 },
          { name: "?木",       lat: 36.620230, lng: 127.327363, km: 136.0 },
          { name: "窸蛙ˉ",       lat: 36.332237, lng: 127.096637, km: 173.0 },
          { name: "?蛙",       lat: 35.941256, lng: 126.945913, km: 211.0, dwellSec: 60 },
          { name: "??",       lat: 35.575773, lng: 126.841917, km: 251.0 },
          { name: "窵ˉ?∫?",   lat: 35.137707, lng: 126.790110, km: 303.8, dwellSec: 60 },
          { name: "?ˉ",       lat: 35.013927, lng: 126.717485, km: 324.0 },
          { name: "諈拗",       lat: 34.792134, lng: 126.387645, km: 367.0, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Jeolla",
        name: "KTX ???,
        nameEn: "KTX Jeolla Line",
        color: "#0ea5e9",
        category: "HSR",
        directions: { up: "?拖 諻拘庖", down: "?科?EXPO 諻拘庖" },
        // KORAIL Jeolla KTX runs on the Yongsan/Seoul - Jeonju/Suncheon/Yeosu EXPO axis.
        // This seed uses the Gongju high-speed routing before entering the Jeolla Line at Iksan.
        stations: [
          { name: "?拖",       lat: 37.529849, lng: 126.964561, km: 0,     dwellSec: 90 },
          { name: "窵?",       lat: 37.4159,   lng: 126.8849,   km: 18.4 },
          { name: "麮??",   lat: 36.794380, lng: 127.104499, km: 104.0 },
          { name: "?木",       lat: 36.620230, lng: 127.327363, km: 136.0 },
          { name: "窸蛙ˉ",       lat: 36.332237, lng: 127.096637, km: 173.0 },
          { name: "?蛙",       lat: 35.941256, lng: 126.945913, km: 211.0, dwellSec: 60 },
          { name: "?ˉ",       lat: 35.850054, lng: 127.162365, km: 236.4 },
          { name: "?到?",       lat: 35.411251, lng: 127.361333, km: 289.2 },
          { name: "窸∫",       lat: 35.283456, lng: 127.304458, km: 305.8 },
          { name: "窱禺?窱?,     lat: 35.163478, lng: 127.451967, km: 325.5 },
          { name: "??",       lat: 34.945811, lng: 127.504060, km: 351.8, dwellSec: 60 },
          { name: "?科?",       lat: 34.779462, lng: 127.664450, km: 376.8 },
          { name: "?科?EXPO",   lat: 34.755514, lng: 127.749239, km: 385.7, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Gyeongjeon",
        name: "KTX 窶趣???,
        nameEn: "KTX Gyeongjeon Line",
        color: "#0284c7",
        category: "HSR",
        directions: { up: "? 諻拘庖", down: "鴔ˉ 諻拘庖" },
        // KORAIL Gyeongjeon KTX runs Seoul - Dongdaegu - Miryang - Changwon/Masan/Jinju.
        // This seed mirrors the SRT Gyeongjeon branch after Dongdaegu while using the Seoul KTX trunk.
        stations: [
          { name: "?",       lat: 37.5547,   lng: 126.9706,   km: 0,     dwellSec: 90 },
          { name: "窵?",       lat: 37.4159,   lng: 126.8849,   km: 22.0 },
          { name: "麮??",   lat: 36.7945,   lng: 127.1043,   km: 96.0 },
          { name: "?木",       lat: 36.6202,   lng: 127.3260,   km: 128.0 },
          { name: "???,       lat: 36.3320,   lng: 127.4346,   km: 161.0, dwellSec: 60 },
          { name: "篧麮筋諯?,   lat: 36.1153,   lng: 128.1732,   km: 225.0 },
          { name: "??窱?,     lat: 35.881470, lng: 128.540403, km: 284.0 },
          { name: "??窱?,     lat: 35.8794,   lng: 128.6285,   km: 293.0, dwellSec: 60 },
          { name: "諻??,       lat: 35.474851, lng: 128.771418, km: 340.0 },
          { name: "鴔?",       lat: 35.298748, lng: 128.773550, km: 368.5 },
          { name: "麆趣?鴗?",   lat: 35.242572, lng: 128.701605, km: 382.5 },
          { name: "麆趣?",       lat: 35.258125, lng: 128.607034, km: 392.5 },
          { name: "諤",       lat: 35.236364, lng: 128.576728, km: 398.0, dwellSec: 60 },
          { name: "鴔ˉ",       lat: 35.150120, lng: 128.118349, km: 445.0, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Gangneung",
        name: "KTX 穈???,
        nameEn: "KTX Gangneung Line",
        color: "#0f766e",
        category: "HSR",
        directions: { up: "? 諻拘庖", down: "穈? 諻拘庖" },
        // KORAIL operates KTX-Eum on the Seoul/Cheongnyangni - Gangneung axis.
        // This seed models the representative Seoul - Gangneung stopping pattern.
        stations: [
          { name: "?",       lat: 37.554555, lng: 126.970779, km: 0,     dwellSec: 90 },
          { name: "麮卿?謔?,     lat: 37.580596, lng: 127.048257, km: 15.0,  dwellSec: 60 },
          { name: "??",       lat: 37.597031, lng: 127.085656, km: 21.0 },
          { name: "??",       lat: 37.492847, lng: 127.491897, km: 58.0 },
          { name: "??鴥?,     lat: 37.348530, lng: 127.839395, km: 94.0 },
          { name: "諤?",       lat: 37.353949, lng: 127.893112, km: 103.0 },
          { name: "?∫",       lat: 37.482807, lng: 128.010484, km: 123.0 },
          { name: "?",       lat: 37.510021, lng: 128.221271, km: 147.0 },
          { name: "?偷",       lat: 37.561957, lng: 128.430034, km: 174.0 },
          { name: "鴔?(?月???", lat: 37.642569, lng: 128.574822, km: 191.0 },
          { name: "穈?",       lat: 37.764520, lng: 128.899398, km: 238.0, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Donghae",
        name: "KTX ???,
        nameEn: "KTX Donghae Line",
        color: "#0369a1",
        category: "HSR",
        directions: { up: "? 諻拘庖", down: "?秒 諻拘庖" },
        // KORAIL Donghae KTX runs on the Seoul - Dongdaegu - Pohang axis.
        // This seed models the representative Seoul - Pohang stopping pattern.
        stations: [
          { name: "?",       lat: 37.554700, lng: 126.970600, km: 0,     dwellSec: 90 },
          { name: "窵?",       lat: 37.415900, lng: 126.884900, km: 22.0 },
          { name: "麮??",   lat: 36.794500, lng: 127.104300, km: 96.0 },
          { name: "?木",       lat: 36.620200, lng: 127.326000, km: 128.0 },
          { name: "???,       lat: 36.332000, lng: 127.434600, km: 161.0, dwellSec: 60 },
          { name: "篧麮筋諯?,   lat: 36.115300, lng: 128.173200, km: 225.0 },
          { name: "??窱?,     lat: 35.879400, lng: 128.628500, km: 293.0, dwellSec: 60 },
          { name: "?秒",       lat: 36.071233, lng: 129.342678, km: 363.0, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Jungang",
        name: "KTX 鴗???,
        nameEn: "KTX Jungang Line",
        color: "#0891b2",
        category: "HSR",
        directions: { up: "? 諻拘庖", down: "賱??諻拘庖" },
        // KORAIL KTX-Eum central-line service links Seoul/Cheongnyangni with
        // Bujeon via the Jungang and Donghae corridors. This seed models the
        // representative Seoul - Bujeon stopping pattern.
        stations: [
          { name: "?",       lat: 37.554700, lng: 126.970600, km: 0,     dwellSec: 90 },
          { name: "麮卿?謔?,     lat: 37.580596, lng: 127.048257, km: 15.0,  dwellSec: 60 },
          { name: "??",       lat: 37.597031, lng: 127.085656, km: 21.0 },
          { name: "??",       lat: 37.492847, lng: 127.491897, km: 58.0 },
          { name: "??鴥?,     lat: 37.348530, lng: 127.839395, km: 94.0 },
          { name: "?ˉ",       lat: 37.316379, lng: 127.920730, km: 104.0 },
          { name: "??",       lat: 37.128700, lng: 128.205400, km: 151.0 },
          { name: "?到?",       lat: 36.981712, lng: 128.342873, km: 169.0 },
          { name: "?萼",       lat: 36.872000, lng: 128.524000, km: 196.0 },
          { name: "?ˉ",       lat: 36.810700, lng: 128.624000, km: 207.0 },
          { name: "??",       lat: 36.569302, lng: 128.678354, km: 237.0 },
          { name: "?",       lat: 36.352000, lng: 128.697000, km: 264.0 },
          { name: "??",       lat: 35.966800, lng: 128.938100, km: 311.0 },
          { name: "窶趣ˉ",       lat: 35.798100, lng: 129.138100, km: 333.0 },
          { name: "??穈?,     lat: 35.538700, lng: 129.353700, km: 367.0 },
          { name: "賱??,       lat: 35.162700, lng: 129.061100, km: 433.0, dwellSec: 90 },
        ],
      },
      {
        id: "KTX-Jungbu-Naeryuk",
        name: "KTX 鴗??渠???,
        nameEn: "KTX Jungbu Naeryuk Line",
        color: "#0d9488",
        category: "HSR",
        directions: { up: "?? 諻拘庖", down: "諡資祭 諻拘庖" },
        // KORAIL KTX-Eum service runs from Pangyo over the Gyeonggang corridor,
        // then branches at Bubal onto the Jungbu Naeryuk Line to Mungyeong.
        stations: [
          { name: "??",       lat: 37.394730, lng: 127.111189, km: 0.1,   dwellSec: 90 },
          { name: "賱諻?,       lat: 37.260402, lng: 127.490328, km: 40.7,  dwellSec: 60 },
          { name: "穈??,       lat: 37.197417, lng: 127.535438, km: 50.9 },
          { name: "穈部?伕??, lat: 37.127043, lng: 127.635620, km: 63.0 },
          { name: "??到?",   lat: 37.092071, lng: 127.786949, km: 77.7 },
          { name: "黺拖ˉ",       lat: 36.975257, lng: 127.908068, km: 96.7,  dwellSec: 60 },
          { name: "?渠站",       lat: 36.902245, lng: 127.960179, km: 107.2 },
          { name: "??貐渥麮?, lat: 36.841692, lng: 128.005012, km: 115.7 },
          { name: "?堅?",       lat: 36.786434, lng: 128.018302, km: 121.9 },
          { name: "諡資祭",       lat: 36.720262, lng: 128.110201, km: 136.0, dwellSec: 90 },
        ],
      },
      {
        id: "SRT-Gyeongbu",
        name: "SRT 窶趟???,
        nameEn: "SRT Gyeongbu Line",
        color: "#6f2da8",
        category: "HSR",
        directions: { up: "?? 諻拘庖", down: "賱??諻拘庖" },
        // SR official route: ?? ???? ????鴔????麮?? ???木 ???????        // 篧麮?窱禺站) ????窱?????窱????祭鴥????賄(?蛟??? ??賱??
        // The end-to-end distance follows SR's Suseo-Busan 401.2 km service length.
        stations: [
          { name: "??",       lat: 37.487321, lng: 127.101690, km: 0,     dwellSec: 90 },
          { name: "??",       lat: 37.200138, lng: 127.095533, km: 32.4 },
          { name: "??鴔??,   lat: 37.018749, lng: 127.069842, km: 56.9 },
          { name: "麮??",   lat: 36.7945,   lng: 127.1043,   km: 82.0 },
          { name: "?木",       lat: 36.6202,   lng: 127.3260,   km: 114.0 },
          { name: "???,       lat: 36.3320,   lng: 127.4346,   km: 147.0, dwellSec: 60 },
          { name: "篧麮筋諯?,   lat: 36.1153,   lng: 128.1732,   km: 211.0 },
          { name: "??窱?,     lat: 35.881470, lng: 128.540403, km: 270.0 },
          { name: "??窱?,     lat: 35.8794,   lng: 128.6285,   km: 279.0, dwellSec: 60 },
          { name: "?祭鴥?,     lat: 35.7975,   lng: 129.1369,   km: 321.0 },
          { name: "?賄",       lat: 35.5512,   lng: 129.1330,   km: 350.0 },
          { name: "賱??,       lat: 35.1153,   lng: 129.0418,   km: 401.2, dwellSec: 90 },
        ],
      },
      {
        id: "SRT-Honam",
        name: "SRT ?賈??,
        nameEn: "SRT Honam Line",
        color: "#8b5cf6",
        category: "HSR",
        directions: { up: "?? 諻拘庖", down: "諈拗 諻拘庖" },
        // SR official route: ?? ???? ????鴔????麮?? ???木 ??窸蛙ˉ ??        // ?蛙 ???? ??窵ˉ?∫? ???ˉ ??諈拗.
        // The end-to-end distance follows SR's Suseo-Mokpo 354.2 km service length.
        stations: [
          { name: "??",       lat: 37.487321, lng: 127.101690, km: 0,     dwellSec: 90 },
          { name: "??",       lat: 37.200359, lng: 127.095576, km: 32.4 },
          { name: "??鴔??,   lat: 37.018753, lng: 127.069867, km: 56.9 },
          { name: "麮??",   lat: 36.794380, lng: 127.104499, km: 82.0 },
          { name: "?木",       lat: 36.620230, lng: 127.327363, km: 114.0 },
          { name: "窸蛙ˉ",       lat: 36.332237, lng: 127.096637, km: 151.0 },
          { name: "?蛙",       lat: 35.941256, lng: 126.945913, km: 188.0, dwellSec: 60 },
          { name: "??",       lat: 35.575773, lng: 126.841917, km: 229.0 },
          { name: "窵ˉ?∫?",   lat: 35.137707, lng: 126.790110, km: 281.0, dwellSec: 60 },
          { name: "?ˉ",       lat: 35.013927, lng: 126.717485, km: 301.0 },
          { name: "諈拗",       lat: 34.792134, lng: 126.387645, km: 354.2, dwellSec: 90 },
        ],
      },
      {
        id: "SRT-Jeolla",
        name: "SRT ???,
        nameEn: "SRT Jeolla Line",
        color: "#a855f7",
        category: "HSR",
        directions: { up: "?? 諻拘庖", down: "?科?EXPO 諻拘庖" },
        // SR official route: ?? ???? ????鴔????麮?? ???木 ??窸蛙ˉ ??        // ?蛙 ???ˉ ???到? ??窸∫ ??窱禺?窱????? ???科? ???科?EXPO.
        // Iksan-Yeosu EXPO follows the Jeolla Line route distance of 180.4 km.
        stations: [
          { name: "??",       lat: 37.487321, lng: 127.101690, km: 0,     dwellSec: 90 },
          { name: "??",       lat: 37.200359, lng: 127.095576, km: 32.7 },
          { name: "??鴔??,   lat: 37.018753, lng: 127.069867, km: 53.5 },
          { name: "麮??",   lat: 36.794380, lng: 127.104499, km: 80.6 },
          { name: "?木",       lat: 36.620230, lng: 127.327363, km: 109.0 },
          { name: "窸蛙ˉ",       lat: 36.332237, lng: 127.096637, km: 148.5 },
          { name: "?蛙",       lat: 35.941256, lng: 126.945913, km: 194.6, dwellSec: 60 },
          { name: "?ˉ",       lat: 35.850054, lng: 127.162365, km: 220.0 },
          { name: "?到?",       lat: 35.411251, lng: 127.361333, km: 272.8 },
          { name: "窸∫",       lat: 35.283456, lng: 127.304458, km: 289.4 },
          { name: "窱禺?窱?,     lat: 35.163478, lng: 127.451967, km: 309.1 },
          { name: "??",       lat: 34.945811, lng: 127.504060, km: 335.4, dwellSec: 60 },
          { name: "?科?",       lat: 34.779462, lng: 127.664450, km: 360.4 },
          { name: "?科?EXPO",   lat: 34.755514, lng: 127.749239, km: 369.3, dwellSec: 90 },
        ],
      },
      {
        id: "SRT-Gyeongjeon",
        name: "SRT 窶趣???,
        nameEn: "SRT Gyeongjeon Line",
        color: "#9333ea",
        category: "HSR",
        directions: { up: "?? 諻拘庖", down: "鴔ˉ 諻拘庖" },
        // SR official route: ?? ???? ????鴔????麮?? ???木 ???????        // 篧麮?窱禺站) ????窱?????窱???諻????鴔? ??麆趣?鴗? ??麆趣? ??諤 ??鴔ˉ.
        // Dongdaegu-Jinju uses the Gyeongbu Line to Miryang and the Gyeongjeon Line branch.
        stations: [
          { name: "??",       lat: 37.487321, lng: 127.101690, km: 0,     dwellSec: 90 },
          { name: "??",       lat: 37.200138, lng: 127.095533, km: 32.4 },
          { name: "??鴔??,   lat: 37.018749, lng: 127.069842, km: 56.9 },
          { name: "麮??",   lat: 36.794500, lng: 127.104300, km: 82.0 },
          { name: "?木",       lat: 36.620200, lng: 127.326000, km: 114.0 },
          { name: "???,       lat: 36.332000, lng: 127.434600, km: 147.0, dwellSec: 60 },
          { name: "篧麮筋諯?,   lat: 36.115300, lng: 128.173200, km: 211.0 },
          { name: "??窱?,     lat: 35.881470, lng: 128.540403, km: 270.0 },
          { name: "??窱?,     lat: 35.879400, lng: 128.628500, km: 279.0, dwellSec: 60 },
          { name: "諻??,       lat: 35.474851, lng: 128.771418, km: 326.0 },
          { name: "鴔?",       lat: 35.298748, lng: 128.773550, km: 354.5 },
          { name: "麆趣?鴗?",   lat: 35.242572, lng: 128.701605, km: 368.5 },
          { name: "麆趣?",       lat: 35.258125, lng: 128.607034, km: 378.5 },
          { name: "諤",       lat: 35.236364, lng: 128.576728, km: 384.0, dwellSec: 60 },
          { name: "鴔ˉ",       lat: 35.150120, lng: 128.118349, km: 431.0, dwellSec: 90 },
        ],
      },
      {
        id: "SRT-Donghae",
        name: "SRT ???,
        nameEn: "SRT Donghae Line",
        color: "#7c3aed",
        category: "HSR",
        directions: { up: "?? 諻拘庖", down: "?秒 諻拘庖" },
        // SR official route: ?? ???? ????鴔????麮?? ???木 ???????        // 篧麮?窱禺站) ????窱?????窱????秒.
        // Dongdaegu-Pohang follows the Gyeongbu HSR, Geoncheon connection, and Donghae Line.
        stations: [
          { name: "??",       lat: 37.487321, lng: 127.101690, km: 0,     dwellSec: 90 },
          { name: "??",       lat: 37.200138, lng: 127.095533, km: 32.4 },
          { name: "??鴔??,   lat: 37.018749, lng: 127.069842, km: 56.9 },
          { name: "麮??",   lat: 36.794500, lng: 127.104300, km: 82.0 },
          { name: "?木",       lat: 36.620200, lng: 127.326000, km: 114.0 },
          { name: "???,       lat: 36.332000, lng: 127.434600, km: 147.0, dwellSec: 60 },
          { name: "篧麮筋諯?,   lat: 36.115300, lng: 128.173200, km: 211.0 },
          { name: "??窱?,     lat: 35.881470, lng: 128.540403, km: 270.0 },
          { name: "??窱?,     lat: 35.879400, lng: 128.628500, km: 279.0, dwellSec: 60 },
          { name: "?秒",       lat: 36.071233, lng: 129.342678, km: 363.0, dwellSec: 90 },
        ],
      },
      {
        id: "Busan-Metro-1",
        name: "賱????麮? 1?賄?",
        nameEn: "Busan Metro Line 1",
        color: "#f06a00",
        category: "?琿?",
        directions: { up: "?? (?月??秒????諻拘庖)", down: "?? (?貲 諻拘庖)" },
        // 賱??1?賄?:?月??秒???乒??貲 40.5 km 40 ??
        stations: [
          { name: "?月??秒????,   lat: 35.0492, lng: 128.9659, km: 0,    dwellSec: 30 },
          { name: "?月??秒",         lat: 35.0628, lng: 128.9665, km: 0.8 },
          { name: "?恰?",             lat: 35.0726, lng: 128.9694, km: 1.5 },
          { name: "?謔?,           lat: 35.0837, lng: 128.9707, km: 2.5 },
          { name: "?伙汝",             lat: 35.0926, lng: 128.9722, km: 3.5 },
          { name: "?坐",             lat: 35.0987, lng: 128.9759, km: 4.4 },
          { name: "??",             lat: 35.0988, lng: 128.9818, km: 5.0 },
          { name: "?",             lat: 35.1058, lng: 128.9663, km: 6.5 },
          { name: "?寨收",             lat: 35.1077, lng: 128.9772, km: 7.6 },
          { name: "?秒?",             lat: 35.1087, lng: 128.9888, km: 8.6 },
          { name: "窵渥?",             lat: 35.1093, lng: 128.9979, km: 9.7 },
          { name: "???,             lat: 35.1108, lng: 129.0099, km: 11.0 },
          { name: "????,           lat: 35.1135, lng: 129.0224, km: 12.4 },
          { name: "????,           lat: 35.1133, lng: 129.0291, km: 13.1 },
          { name: "?",             lat: 35.1024, lng: 129.0254, km: 14.5 },
          { name: "??儦?,           lat: 35.0974, lng: 129.0310, km: 15.4 },
          { name: "?刮",             lat: 35.0980, lng: 129.0349, km: 16.0 },
          { name: "鴗?",             lat: 35.1018, lng: 129.0384, km: 16.7 },
          { name: "賱?域",           lat: 35.1153, lng: 129.0418, km: 17.5, dwellSec: 30 },
          { name: "黕?",             lat: 35.1196, lng: 129.0454, km: 18.5 },
          { name: "賱?域?",           lat: 35.1383, lng: 129.0526, km: 20.6 },
          { name: "鮈?",             lat: 35.1420, lng: 129.0540, km: 21.4 },
          { name: "貒",             lat: 35.1497, lng: 129.0597, km: 22.6 },
          { name: "貒窸?,           lat: 35.1568, lng: 129.0612, km: 23.4 },
          { name: "?庖",             lat: 35.1577, lng: 129.0593, km: 24.0, dwellSec: 30 },
          { name: "賱??,             lat: 35.1646, lng: 129.0596, km: 24.8 },
          { name: "??",             lat: 35.1706, lng: 129.0698, km: 26.0 },
          { name: "?痍",             lat: 35.1801, lng: 129.0762, km: 26.8 },
          { name: "?域",             lat: 35.1862, lng: 129.0822, km: 27.5 },
          { name: "窱?",             lat: 35.1939, lng: 129.0866, km: 28.5 },
          { name: "??",             lat: 35.2052, lng: 129.0824, km: 29.7 },
          { name: "諈?",             lat: 35.2148, lng: 129.0789, km: 30.6 },
          { name: "?到???,           lat: 35.2249, lng: 129.0837, km: 31.7 },
          { name: "賱?圉?",           lat: 35.2329, lng: 129.0843, km: 32.6 },
          { name: "?伊?",             lat: 35.2387, lng: 129.0871, km: 33.4 },
          { name: "窱科?",             lat: 35.2486, lng: 129.0918, km: 34.5 },
          { name: "?",             lat: 35.2538, lng: 129.0945, km: 35.2 },
          { name: "?到",             lat: 35.2641, lng: 129.0972, km: 36.2 },
          { name: "貒??,           lat: 35.2769, lng: 129.0967, km: 37.7 },
          { name: "?貲",             lat: 35.2935, lng: 129.0930, km: 40.5, dwellSec: 30 },
        ],
      },
      {
        id: "Busan-Metro-2",
        name: "賱????麮? 2?賄?",
        nameEn: "Busan Metro Line 2",
        color: "#81BF48",
        category: "?琿?",
        directions: { up: "?? (?伊 諻拘庖)", down: "?? (? 諻拘庖)" },
        // 賱??2?賄?: Jangsan?angsan all-stop route; OSM relation 2194999
        // provides complete stop members for the current 43-station service.
        stations: [
          { name: "?伊", lat: 35.1694514, lng: 129.1759213, km: 0.478, dwellSec: 30 },
          { name: "鴗?", lat: 35.1666518, lng: 129.1678104, km: 1.315 },
          { name: "?渥?", lat: 35.1636846, lng: 129.1588087, km: 2.223 },
          { name: "?停", lat: 35.1612770, lng: 129.1480904, km: 3.339 },
          { name: "貒∫儠?, lat: 35.1688889, lng: 129.1387511, km: 4.556 },
          { name: "?潤??", lat: 35.1686251, lng: 129.1311985, km: 5.392 },
          { name: "諯潺", lat: 35.1673950, lng: 129.1217190, km: 6.409 },
          { name: "??", lat: 35.1654182, lng: 129.1146714, km: 7.284, dwellSec: 30 },
          { name: "窵?", lat: 35.1579160, lng: 129.1131700, km: 8.13 },
          { name: "篣??, lat: 35.1497560, lng: 129.1109700, km: 9.059 },
          { name: "?到?", lat: 35.1421344, lng: 129.1078416, km: 9.967 },
          { name: "窶趣?繚賱窶趟?", lat: 35.1375580, lng: 129.1005310, km: 10.812 },
          { name: "???, lat: 35.1351480, lng: 129.0921720, km: 11.627 },
          { name: "諈骯釣", lat: 35.1347580, lng: 129.0847830, km: 12.301 },
          { name: "鴔窶釣", lat: 35.1356680, lng: 129.0742240, km: 13.336 },
          { name: "諡貲?", lat: 35.1391392, lng: 129.0673312, km: 14.133 },
          { name: "窱原?篣?潤繚賱?域???, lat: 35.1457278, lng: 129.0667134, km: 14.871 },
          { name: "?", lat: 35.1528193, lng: 129.0653641, km: 15.68 },
          { name: "?庖", lat: 35.1577084, lng: 129.0591028, km: 16.769, dwellSec: 30 },
          { name: "賱??, lat: 35.1574390, lng: 129.0505061, km: 17.552 },
          { name: "穈??, lat: 35.1558284, lng: 129.0426874, km: 18.286 },
          { name: "???", lat: 35.1539803, lng: 129.0321386, km: 19.266 },
          { name: "穈?", lat: 35.1532536, lng: 129.0204602, km: 20.336 },
          { name: "??", lat: 35.1512851, lng: 129.0124257, km: 21.112 },
          { name: "鴥潺?", lat: 35.1505040, lng: 129.0031500, km: 21.96 },
          { name: "穈?", lat: 35.1557054, lng: 128.9908801, km: 23.273 },
          { name: "?科?", lat: 35.1625081, lng: 128.9845090, km: 24.227, dwellSec: 30 },
          { name: "?", lat: 35.1738665, lng: 128.9839737, km: 25.555 },
          { name: "諈刺?", lat: 35.1803610, lng: 128.9856210, km: 26.292 },
          { name: "諈刺", lat: 35.1892988, lng: 128.9884422, km: 27.322 },
          { name: "窱禺", lat: 35.1969455, lng: 128.9950174, km: 28.408 },
          { name: "窱禺?", lat: 35.2028827, lng: 128.9996216, km: 29.19 },
          { name: "??", lat: 35.2107798, lng: 129.0050608, km: 30.337, dwellSec: 30 },
          { name: "??", lat: 35.2233039, lng: 129.0091715, km: 31.857 },
          { name: "??", lat: 35.2352534, lng: 129.0138007, km: 33.27 },
          { name: "?刺收", lat: 35.2464762, lng: 129.0128975, km: 34.531 },
          { name: "??", lat: 35.2586149, lng: 129.0124334, km: 35.966 },
          { name: "篣部", lat: 35.2673839, lng: 129.0168673, km: 37.022 },
          { name: "?貲", lat: 35.2810803, lng: 129.0174697, km: 38.581 },
          { name: "鴞", lat: 35.3083224, lng: 129.0102327, km: 42.046 },
          { name: "賱?圉??儥??, lat: 35.3168773, lng: 129.0139796, km: 43.057 },
          { name: "?到???, lat: 35.3254040, lng: 129.0193639, km: 44.158 },
          { name: "?", lat: 35.3386950, lng: 129.0263995, km: 45.801, dwellSec: 30 },
        ],
      },
      {
        id: "Busan-Metro-3",
        name: "賱????麮? 3?賄?",
        nameEn: "Busan Metro Line 3",
        color: "#BB8C00",
        category: "?琿?",
        directions: { up: "?? (?? 諻拘庖)", down: "?? (?? 諻拘庖)" },
        // 賱??3?賄?: Suyeong?aejeo all-stop route; OSM relation 2195014
        // provides complete stop members for the current 17-station service.
        stations: [
          { name: "??", lat: 35.1654182, lng: 129.1146714, km: 0, dwellSec: 30 },
          { name: "諤站", lat: 35.1717331, lng: 129.1075159, km: 1.065 },
          { name: "諻域", lat: 35.1734626, lng: 129.0957491, km: 2.159 },
          { name: "諡潺?窸?, lat: 35.1766388, lng: 129.0858331, km: 3.214 },
          { name: "?域", lat: 35.1859918, lng: 129.0815013, km: 4.333, dwellSec: 30 },
          { name: "穇域?", lat: 35.1885438, lng: 129.0739981, km: 5.073 },
          { name: "鮈?渠???, lat: 35.1914648, lng: 129.0674868, km: 5.767 },
          { name: "?科?", lat: 35.1990904, lng: 129.0650666, km: 6.643 },
          { name: "諯賈", lat: 35.2065443, lng: 129.0687047, km: 7.563, dwellSec: 30 },
          { name: "諤?", lat: 35.2129876, lng: 129.0364611, km: 10.774 },
          { name: "?到??, lat: 35.2133254, lng: 129.0239260, km: 11.925 },
          { name: "?", lat: 35.2119767, lng: 129.0127544, km: 12.958 },
          { name: "??", lat: 35.2102272, lng: 129.0057948, km: 13.62, dwellSec: 30 },
          { name: "窱秒", lat: 35.2067105, lng: 128.9963297, km: 14.65 },
          { name: "穈?窱科痍", lat: 35.2112369, lng: 128.9819597, km: 16.204 },
          { name: "麮渥窸蛙?", lat: 35.2125086, lng: 128.9693851, km: 17.355 },
          { name: "??", lat: 35.2134159, lng: 128.9607978, km: 18.142, dwellSec: 30 },
        ],
      },
      {
        id: "Busan-Metro-4",
        name: "賱????麮? 4?賄?",
        nameEn: "Busan Metro Line 4",
        color: "#217DCB",
        category: "?琿?",
        directions: { up: "?? (諯賈 諻拘庖)", down: "?? (?? 諻拘庖)" },
        // 賱??4?賄?: rubber-tyred light metro from Minam to Anpyeong; OSM
        // relation 2205952 provides complete stop members for 14 stations.
        stations: [
          { name: "諯賈", lat: 35.2065213, lng: 129.0687890, km: 0, dwellSec: 30 },
          { name: "??", lat: 35.2047222, lng: 129.0772975, km: 0.926 },
          { name: "??", lat: 35.2017248, lng: 129.0838787, km: 1.611 },
          { name: "?紡", lat: 35.2001883, lng: 129.0908233, km: 2.267 },
          { name: "黺拘??, lat: 35.1997237, lng: 129.0975688, km: 2.979 },
          { name: "諈", lat: 35.2053788, lng: 129.1017618, km: 3.722 },
          { name: "??", lat: 35.2130228, lng: 129.1075237, km: 4.765 },
          { name: "篣", lat: 35.2157922, lng: 129.1152377, km: 5.552 },
          { name: "諻?諡潰???, lat: 35.2177692, lng: 129.1238374, km: 6.368 },
          { name: "??", lat: 35.2180644, lng: 129.1368574, km: 7.567 },
          { name: "??", lat: 35.2256484, lng: 129.1460921, km: 8.934 },
          { name: "????, lat: 35.2325216, lng: 129.1539359, km: 10.056 },
          { name: "窸?", lat: 35.2361256, lng: 129.1604700, km: 10.795 },
          { name: "??", lat: 35.2373765, lng: 129.1717326, km: 11.856, dwellSec: 30 },
        ],
      },
      {
        id: "Busan-Gimhae-LRT",
        name: "賱?國??湊祭??",
        nameEn: "Busan-Gimhae Light Rail Transit",
        color: "#8652A1",
        category: "LRT",
        directions: { up: "?? (?科? 諻拘庖)", down: "?? (穈?潺? 諻拘庖)" },
        // BGL's official route map lists Sasang?aya University station order.
        // OSM relation 2204611 provides one-direction stop members along that corridor.
        stations: [
          { name: "?科?", lat: 35.1622969, lng: 128.9859362, km: 0.205, dwellSec: 30 },
          { name: "窵?諝渠?", lat: 35.1632779, lng: 128.9777255, km: 0.962 },
          { name: "???域??蛙?窱?, lat: 35.1663971, lng: 128.9549558, km: 3.226 },
          { name: "窸蛭", lat: 35.1719342, lng: 128.9485611, km: 4.134, dwellSec: 30 },
          { name: "??", lat: 35.1819682, lng: 128.9541369, km: 5.454 },
          { name: "?梓筋", lat: 35.1962280, lng: 128.9635275, km: 7.318 },
          { name: "??", lat: 35.2130680, lng: 128.9605168, km: 9.378, dwellSec: 30 },
          { name: "??", lat: 35.2140428, lng: 128.9506178, km: 10.284 },
          { name: "???, lat: 35.2177127, lng: 128.9382966, km: 11.479 },
          { name: "賱?", lat: 35.2222403, lng: 128.9278224, km: 12.563 },
          { name: "鴔??, lat: 35.2276363, lng: 128.9237133, km: 13.271 },
          { name: "篧?渠???, lat: 35.2289874, lng: 128.9155819, km: 14.063 },
          { name: "?賄??", lat: 35.2281017, lng: 128.9017358, km: 15.325 },
          { name: "篧?渥?麮?, lat: 35.2270991, lng: 128.8903193, km: 16.368 },
          { name: "賱??, lat: 35.2264726, lng: 128.8838005, km: 16.964 },
          { name: "賵", lat: 35.2273503, lng: 128.8742550, km: 17.934 },
          { name: "????", lat: 35.2329251, lng: 128.8720656, km: 18.589 },
          { name: "諻狩窵", lat: 35.2401301, lng: 128.8718405, km: 19.394 },
          { name: "?域?窸蛙?", lat: 35.2496565, lng: 128.8692227, km: 20.506 },
          { name: "?伊??", lat: 35.2595560, lng: 128.8671904, km: 21.694 },
          { name: "穈?潺?", lat: 35.2668321, lng: 128.8649754, km: 22.560, dwellSec: 30 },
        ],
      },
    ],
    trainTemplates: [
      { line: "Seoul-Metro-1",  type: "篣?",   badge: "篣?",   badgeColor: "#1d4ed8", speed: 60, interval: 12, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Seoul-Metro-1",  type: "??",   badge: "??,     badgeColor: "#0052a4", speed: 40, interval: 4,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Seoul-Metro-2",  type: "??",   badge: "2",      badgeColor: "#00a84d", speed: 35, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-3",  type: "3?賄?",  badge: "3",      badgeColor: "#ED6C00", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-4",  type: "4?賄?",  badge: "4",      badgeColor: "#009BCE", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-5",  type: "5?賄?",  badge: "5",      badgeColor: "#996CAC", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-6",  type: "6?賄?",  badge: "6",      badgeColor: "#7C4932", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-7",  type: "7?賄?",  badge: "7",      badgeColor: "#747F00", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-8",  type: "8?賄?",  badge: "8",      badgeColor: "#E6186C", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-9",  type: "9?賄?",  badge: "9",      badgeColor: "#BDB092", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Seoul-Metro-9",  type: "Line 9 Fast",  badge: "9F", badgeColor: "#BDB092", speed: 40, interval: 22, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25, stationIdxStart: 0, stationIdxEnd: 21 },
      { line: "Seoul-Metro-9",  type: "Line 9 Slow",  badge: "9S", badgeColor: "#BDB092", speed: 40, interval: 24, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25, stationIdxStart: 0, stationIdxEnd: 21 },
      { line: "Ui-LRT",         type: "?域???, badge: "UI", badgeColor: "#BACC50", speed: 70, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Sillim-LRT",     type: "?汝??, badge: "SL",     badgeColor: "#6789CA", speed: 70, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Uijeongbu-LRT",  type: "U Line", badge: "U",      badgeColor: "#F0831E", speed: 80, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Yongin-EverLine", type: "EverLine", badge: "E",   badgeColor: "#44A436", speed: 80, interval: 6,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Shinbundang",    type: "???寢?", badge: "DX",    badgeColor: "#B81B30", speed: 80, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Suin-Bundang",   type: "?賱??, badge: "SB",  badgeColor: "#ECA300", speed: 80, interval: 6,  accel: 0.90, decel: 1.00, aLat: 0.90, dwellSec: 25 },
      { line: "Gyeongui-Jungang", type: "窶趣?鴗???, badge: "GJ", badgeColor: "#6AC2B3", speed: 85, interval: 10, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Gyeongui-Jungang", type: "Gyeongui short-turn", badge: "GJ", badgeColor: "#6AC2B3", speed: 85, interval: 20, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25, stationIdxStart: 0, stationIdxEnd: 23 },
      { line: "Gyeongchun",     type: "窶趣???, badge: "GC",     badgeColor: "#007A62", speed: 85, interval: 15, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Gyeongchun",     type: "Gyeongchun Sangbong", badge: "GC", badgeColor: "#007A62", speed: 85, interval: 20, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25, stationIdxStart: 0, stationIdxEnd: 3 },
      { line: "Gyeongchun",     type: "Gyeongchun Gwangwoon", badge: "GC", badgeColor: "#007A62", speed: 85, interval: 22, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25, stationIdxStart: 0, stationIdxEnd: 5 },
      { line: "Gyeonggang",     type: "窶赭???, badge: "GG",     badgeColor: "#0B318F", speed: 85, interval: 15, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Seohae",         type: "???, badge: "SH",     badgeColor: "#5EAC41", speed: 85, interval: 15, accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "Incheon-Metro-1", type: "1?賄?", badge: "I1",     badgeColor: "#B4C7E7", speed: 40, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Incheon-Metro-2", type: "2?賄?", badge: "I2",     badgeColor: "#F4A462", speed: 70, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "AREX",           type: "AREX",   badge: "A",      badgeColor: "#0079ac", speed: 90, interval: 8,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 30 },
      { line: "Gimpo-Goldline", type: "窸刺??潰", badge: "G",    badgeColor: "#ad8605", speed: 80, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Daegu-Metro-1",  type: "1?賄?",  badge: "1",      badgeColor: "#EF5E37", speed: 40, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Daegu-Metro-2",  type: "2?賄?",  badge: "2",      badgeColor: "#33AA46", speed: 40, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Daegu-Metro-3",  type: "3?賄?",  badge: "3",      badgeColor: "#FDA208", speed: 70, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.90, dwellSec: 25 },
      { line: "Daejeon-Metro-1", type: "1?賄?", badge: "D1",     badgeColor: "#007448", speed: 40, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Gwangju-Metro-1", type: "1?賄?", badge: "G1",     badgeColor: "#009088", speed: 40, interval: 7,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "ITX-Cheongchun", type: "ITX-麮原?", badge: "ITX",  badgeColor: "#2563eb", speed: 180, interval: 60, accel: 0.70, decel: 0.75, aLat: 0.85, dwellSec: 45 },
      { line: "KTX-Gyeongbu",   type: "KTX",    badge: "KTX",    badgeColor: "#0c4ca3", speed: 250, interval: 20, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Gyeongbu",   type: "KTX-?域?", badge: "?域?", badgeColor: "#dc2626", speed: 230, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Honam",      type: "KTX",    badge: "KTX",    badgeColor: "#2563eb", speed: 250, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Honam",      type: "KTX-?域?", badge: "?域?", badgeColor: "#dc2626", speed: 230, interval: 40, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Jeolla",     type: "KTX",    badge: "KTX",    badgeColor: "#0ea5e9", speed: 250, interval: 40, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Jeolla",     type: "KTX-?域?", badge: "?域?", badgeColor: "#dc2626", speed: 230, interval: 50, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Gyeongjeon", type: "KTX",    badge: "KTX",    badgeColor: "#0284c7", speed: 250, interval: 50, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Gyeongjeon", type: "KTX-?域?", badge: "?域?", badgeColor: "#dc2626", speed: 230, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Gangneung",  type: "KTX-?渥?", badge: "?渥?", badgeColor: "#0f766e", speed: 230, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Donghae",    type: "KTX",    badge: "KTX",    badgeColor: "#0369a1", speed: 250, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Donghae",    type: "KTX-?域?", badge: "?域?", badgeColor: "#dc2626", speed: 230, interval: 70, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Jungang",    type: "KTX-?渥?", badge: "?渥?", badgeColor: "#0891b2", speed: 230, interval: 80, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "KTX-Jungbu-Naeryuk", type: "KTX-?渥?", badge: "?渥?", badgeColor: "#0d9488", speed: 230, interval: 120, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "SRT-Gyeongbu",   type: "SRT",    badge: "SRT",    badgeColor: "#6f2da8", speed: 250, interval: 20, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "SRT-Honam",      type: "SRT",    badge: "SRT",    badgeColor: "#8b5cf6", speed: 250, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "SRT-Jeolla",     type: "SRT",    badge: "SRT",    badgeColor: "#a855f7", speed: 240, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "SRT-Gyeongjeon", type: "SRT",    badge: "SRT",    badgeColor: "#9333ea", speed: 240, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "SRT-Donghae",    type: "SRT",    badge: "SRT",    badgeColor: "#7c3aed", speed: 240, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Busan-Metro-1",  type: "1?賄?",  badge: "1",      badgeColor: "#f06a00", speed: 35, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Busan-Metro-2",  type: "2?賄?",  badge: "2",      badgeColor: "#81BF48", speed: 40, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Busan-Metro-3",  type: "3?賄?",  badge: "3",      badgeColor: "#BB8C00", speed: 40, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Busan-Metro-4",  type: "4?賄?",  badge: "4",      badgeColor: "#217DCB", speed: 55, interval: 5,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Busan-Gimhae-LRT", type: "BGL", badge: "BGL",     badgeColor: "#8652A1", speed: 80, interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
    ],
  },

  hongkong: {
    label: "擐葛 Hong Kong",
    center: [22.37, 114.13],
    zoom: 11,
    lines: [
      {
        id: "MTR-Tsuen-Wan",
        name: "?蝬?,
        nameEn: "MTR Tsuen Wan Line",
        color: "#e2231a",
        category: "?琿?",
        directions: { up: "銝? (敺銝剔)", down: "銝? (敺?)" },
        stations: [
          { name: "銝剔",     lat: 22.2820, lng: 114.1581, km: 0,    dwellSec: 30 },
          { name: "??",     lat: 22.2785, lng: 114.1647, km: 0.6, dwellSec: 30 },
          { name: "撠??",   lat: 22.2974, lng: 114.1722, km: 2.4 },
          { name: "雿",     lat: 22.3052, lng: 114.1716, km: 3.1 },
          { name: "瘝寥獄??,   lat: 22.3128, lng: 114.1707, km: 3.7 },
          { name: "?箄?",     lat: 22.3199, lng: 114.1693, km: 4.5 },
          { name: "憭芸?",     lat: 22.3247, lng: 114.1681, km: 5.2 },
          { name: "瘛望偌??,   lat: 22.3309, lng: 114.1623, km: 6.0 },
          { name: "?瑟???,   lat: 22.3357, lng: 114.1565, km: 6.8 },
          { name: "??閫?,   lat: 22.3382, lng: 114.1483, km: 7.5 },
          { name: "蝢?",     lat: 22.3373, lng: 114.1378, km: 8.7 },
          { name: "?",     lat: 22.3486, lng: 114.1259, km: 9.6 },
          { name: "?菔",     lat: 22.3568, lng: 114.1295, km: 11.5 },
          { name: "?菔?",     lat: 22.3631, lng: 114.1313, km: 12.7 },
          { name: "憭抒版??,   lat: 22.3712, lng: 114.1248, km: 13.8 },
          { name: "?",     lat: 22.3735, lng: 114.1175, km: 16.0, dwellSec: 30 },
        ],
      },
      {
        id: "MTR-Island",
        name: "皜臬雀蝬?,
        nameEn: "MTR Island Line",
        color: "#007dc5",
        category: "?琿?",
        directions: { up: "銝? (敺?側?啣?)", down: "銝? (敺?渡)" },
        stations: [
          { name: "?側?啣?", lat: 22.2814, lng: 114.1289, km: 0,    dwellSec: 30 },
          { name: "擐葛憭批飛", lat: 22.2837, lng: 114.1351, km: 1.0 },
          { name: "镼輻???,   lat: 22.2858, lng: 114.1426, km: 1.5 },
          { name: "銝",     lat: 22.2867, lng: 114.1518, km: 2.4 },
          { name: "銝剔",     lat: 22.2820, lng: 114.1581, km: 2.9, dwellSec: 30 },
          { name: "??",     lat: 22.2785, lng: 114.1647, km: 3.5, dwellSec: 30 },
          { name: "???",     lat: 22.2773, lng: 114.1731, km: 4.4 },
          { name: "???,   lat: 22.2802, lng: 114.1853, km: 5.4 },
          { name: "憭拙?",     lat: 22.2823, lng: 114.1922, km: 6.2 },
          { name: "?桀撅?,   lat: 22.2879, lng: 114.1936, km: 6.7 },
          { name: "??",     lat: 22.2912, lng: 114.2008, km: 7.4 },
          { name: "敿?瘨?,   lat: 22.2876, lng: 114.2098, km: 8.4 },
          { name: "憭芸",     lat: 22.2845, lng: 114.2168, km: 9.5 },
          { name: "镼輻瘝?,   lat: 22.2818, lng: 114.2218, km: 11.0 },
          { name: "蝑脩???,   lat: 22.2789, lng: 114.2294, km: 11.7 },
          { name: "???,   lat: 22.2766, lng: 114.2399, km: 13.2 },
          { name: "?渡",     lat: 22.2645, lng: 114.2374, km: 16.3, dwellSec: 30 },
        ],
      },
      {
        id: "MTR-East-Rail",
        name: "?梢蝬?,
        nameEn: "MTR East Rail Line",
        color: "#5eb7e8",
        category: "TRA",
        directions: { up: "銝? (敺??)", down: "銝? (敺蝢?)" },
        // ?梢蝬?????皝?蝝?46 km?擐祆散?箸蝺?暺?甇方”銝?),蝢?
        // ????瘛勗?銵?14 蝡銝餉?摰ａ?蝡?
        stations: [
          { name: "??",     lat: 22.2785, lng: 114.1647, km: 0,    dwellSec: 30 },
          { name: "??",     lat: 22.2829, lng: 114.1730, km: 0.7 },
          { name: "蝝ㄐ",     lat: 22.3022, lng: 114.1817, km: 4.2, dwellSec: 30 },
          { name: "?箄???,   lat: 22.3216, lng: 114.1729, km: 6.6 },
          { name: "銋?憛?,   lat: 22.3367, lng: 114.1762, km: 8.7, dwellSec: 30 },
          { name: "憭批?",     lat: 22.3733, lng: 114.1789, km: 12.3 },
          { name: "瘝",     lat: 22.3814, lng: 114.1866, km: 14.4, dwellSec: 30 },
          { name: "?怎",     lat: 22.3957, lng: 114.1972, km: 16.5 },
          { name: "憭批飛",     lat: 22.4135, lng: 114.2098, km: 19.7 },
          { name: "憭批?憓?,   lat: 22.4448, lng: 114.1701, km: 24.2 },
          { name: "憭芸?",     lat: 22.4509, lng: 114.1611, km: 25.3 },
          { name: "蝎飯",     lat: 22.4920, lng: 114.1389, km: 28.5 },
          { name: "銝偌",     lat: 22.5022, lng: 114.1281, km: 30.6 },
          { name: "蝢?",     lat: 22.5279, lng: 114.1132, km: 35.5, dwellSec: 30 },
        ],
      },
      {
        id: "MTR-Airport-Express",
        name: "璈敹怎陲",
        nameEn: "MTR Airport Express",
        color: "#00888a",
        category: "HSR",
        directions: { up: "銝? (敺擐葛)", down: "銝? (敺?汗擗?" },
        stations: [
          { name: "擐葛",     lat: 22.2849, lng: 114.1582, km: 0,    dwellSec: 60 },
          { name: "銋?",     lat: 22.3047, lng: 114.1612, km: 2.6, dwellSec: 60 },
          { name: "?﹝",     lat: 22.3585, lng: 114.1077, km: 12.0 },
          { name: "璈",     lat: 22.3157, lng: 113.9367, km: 31.6, dwellSec: 60 },
          { name: "?汗擗?,   lat: 22.3243, lng: 113.9416, km: 35.3, dwellSec: 60 },
        ],
      },
    ],
    trainTemplates: [
      { line: "MTR-Tsuen-Wan",       type: "?蝬?,     badge: "TWL", badgeColor: "#e2231a", speed: 38, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "MTR-Island",          type: "皜臬雀蝬?,     badge: "ISL", badgeColor: "#007dc5", speed: 38, interval: 3,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "MTR-East-Rail",       type: "?梢蝬?,     badge: "EAL", badgeColor: "#5eb7e8", speed: 55, interval: 5,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "MTR-Airport-Express", type: "璈敹怎陲",   badge: "AEL", badgeColor: "#00888a", speed: 120, interval: 12, accel: 0.80, decel: 0.85, aLat: 0.85, dwellSec: 60 },
    ],
  },

  china: {
    label: "銝剖? China",
    center: [35.0, 110.0],
    zoom: 5,
    lines: [
      {
        id: "Beijing-Shanghai-HSR",
        name: "鈭祆賑擃頝?,
        nameEn: "Beijing?hanghai HSR",
        color: "#c80000",
        category: "HSR",
        directions: { up: "銝? (?漪???", down: "銝? (銝絲?寞??孵?)" },
        // 鈭祆賑擃:?漪??銝絲?寞? 23 蝡?1318 km?身閮?380 km/h,撖阡???
        // ?儔????50 km/h??隢扯???50 km/h ?箔蜓??
        stations: [
          { name: "?漪??,     lat: 39.8645, lng: 116.3784, km: 0,    dwellSec: 90 },
          { name: "撱?",       lat: 39.5340, lng: 116.6750, km: 59 },
          { name: "憭拇揖??,     lat: 38.9890, lng: 117.1250, km: 131, dwellSec: 60 },
          { name: "皛?镼?,     lat: 38.3390, lng: 116.8230, km: 219 },
          { name: "敺瑕???,     lat: 37.4500, lng: 116.3530, km: 326 },
          { name: "瞈?镼?,     lat: 36.6510, lng: 116.8870, km: 406, dwellSec: 60 },
          { name: "瘜啣?",       lat: 36.1860, lng: 117.0610, km: 462 },
          { name: "?脤???,     lat: 35.5950, lng: 117.0530, km: 533 },
          { name: "皛???,     lat: 35.0850, lng: 117.2450, km: 588 },
          { name: "璉?",       lat: 34.7950, lng: 117.3160, km: 626 },
          { name: "敺???,     lat: 34.2620, lng: 117.2810, km: 692, dwellSec: 60 },
          { name: "摰踹???,     lat: 33.6510, lng: 117.0290, km: 767 },
          { name: "????,     lat: 32.8920, lng: 117.3280, km: 844 },
          { name: "摰?",       lat: 32.5100, lng: 117.6890, km: 913 },
          { name: "皛?",       lat: 32.2960, lng: 118.3110, km: 989 },
          { name: "?漪??,     lat: 31.9650, lng: 118.7920, km: 1018, dwellSec: 60 },
          { name: "?格???,     lat: 32.1750, lng: 119.4590, km: 1085 },
          { name: "銝寥??,     lat: 32.0140, lng: 119.6160, km: 1129 },
          { name: "撣詨???,     lat: 31.8390, lng: 119.9710, km: 1170 },
          { name: "?⊿??,     lat: 31.5990, lng: 120.4190, km: 1223 },
          { name: "????,     lat: 31.4140, lng: 120.6320, km: 1259 },
          { name: "撏控??,     lat: 31.3270, lng: 120.9550, km: 1289 },
          { name: "銝絲?寞?",   lat: 31.1947, lng: 121.3214, km: 1318, dwellSec: 90 },
        ],
      },
      {
        id: "Beijing-Guangzhou-HSR",
        name: "鈭砍誨擃頝?,
        nameEn: "Beijing?uangzhou HSR",
        color: "#7e22ce",
        category: "HSR",
        directions: { up: "銝? (?漪镼踵??", down: "銝? (撱?????" },
        // 鈭砍誨擃:?漪镼踱?撱????28 蝡?2298 km?????琿??萄凳蝺?銝??
        stations: [
          { name: "?漪镼?,     lat: 39.8946, lng: 116.3217, km: 0,    dwellSec: 90 },
          { name: "瘨踹???,     lat: 39.4770, lng: 116.0890, km: 57 },
          { name: "擃?摨",   lat: 39.3270, lng: 115.8190, km: 99 },
          { name: "靽???,     lat: 38.8550, lng: 115.5340, km: 146 },
          { name: "?喳振??,     lat: 38.0420, lng: 114.5160, km: 271, dwellSec: 60 },
          { name: "擃?镼?,     lat: 37.6230, lng: 114.5950, km: 332 },
          { name: "?Ｗ??,     lat: 37.0780, lng: 114.5570, km: 372 },
          { name: "?舫??,     lat: 36.6010, lng: 114.5550, km: 422 },
          { name: "摰??,     lat: 36.0820, lng: 114.4030, km: 501 },
          { name: "曊游???,     lat: 35.7250, lng: 114.3110, km: 545 },
          { name: "?圈???,     lat: 35.3050, lng: 114.0990, km: 605 },
          { name: "?剖???,     lat: 34.7750, lng: 113.7370, km: 694, dwellSec: 60 },
          { name: "閮望???,     lat: 34.0030, lng: 113.8760, km: 774 },
          { name: "瞍舀眾镼?,     lat: 33.5800, lng: 113.9370, km: 841 },
          { name: "擏收摨正",   lat: 32.9760, lng: 114.0210, km: 913 },
          { name: "靽⊿??,     lat: 32.0930, lng: 114.1080, km: 988 },
          { name: "甇行慰",       lat: 30.6010, lng: 114.4280, km: 1112, dwellSec: 90 },
          { name: "?詨祐??,     lat: 29.8360, lng: 114.3210, km: 1207 },
          { name: "韏文???,     lat: 29.7110, lng: 113.8650, km: 1245 },
          { name: "撗喲??,     lat: 29.3580, lng: 113.1500, km: 1304 },
          { name: "瘙函???,     lat: 28.7990, lng: 113.0710, km: 1411 },
          { name: "?瑟???,     lat: 28.1500, lng: 113.0590, km: 1472, dwellSec: 60 },
          { name: "?芣散镼?,     lat: 27.8430, lng: 112.9760, km: 1530 },
          { name: "銵⊿??,     lat: 26.9290, lng: 112.6800, km: 1640 },
          { name: "?游?镼?,     lat: 25.7960, lng: 113.0010, km: 1786 },
          { name: "?園?",       lat: 24.8430, lng: 113.6160, km: 1914 },
          { name: "皜?",       lat: 23.6960, lng: 113.0510, km: 2070 },
          { name: "撱????,     lat: 22.9890, lng: 113.2680, km: 2298, dwellSec: 90 },
        ],
      },
      {
        id: "Shanghai-Kunming-HSR",
        name: "皛祆?擃頝?,
        nameEn: "Shanghai?unming HSR",
        color: "#16a34a",
        category: "HSR",
        directions: { up: "銝? (銝絲?寞??孵?)", down: "銝? (?????" },
        // 皛祆?擃:銝絲?寞????? 26 蝡?2252 km?葉?镼踹?擃銝餉遘??
        stations: [
          { name: "銝絲?寞?",   lat: 31.1947, lng: 121.3214, km: 0,    dwellSec: 90 },
          { name: "?暹???,     lat: 30.9450, lng: 121.2490, km: 40 },
          { name: "????,     lat: 30.6920, lng: 120.7340, km: 105 },
          { name: "?剖???,     lat: 30.2920, lng: 120.2100, km: 175, dwellSec: 60 },
          { name: "隢豢",       lat: 29.7320, lng: 120.2370, km: 240 },
          { name: "蝢拍?",       lat: 29.3160, lng: 120.0930, km: 295 },
          { name: "?",       lat: 29.0790, lng: 119.6500, km: 350 },
          { name: "銵Ｗ?",       lat: 28.9670, lng: 118.8300, km: 425 },
          { name: "?控??,     lat: 28.6800, lng: 118.2510, km: 470 },
          { name: "銝?",       lat: 28.4760, lng: 117.9710, km: 535 },
          { name: "曋寞蔬??,     lat: 28.2460, lng: 117.0690, km: 624 },
          { name: "?怠???,     lat: 27.9390, lng: 116.3820, km: 700 },
          { name: "??镼?,     lat: 28.5820, lng: 115.7940, km: 800, dwellSec: 60 },
          { name: "?圈???,     lat: 27.8510, lng: 114.8920, km: 920 },
          { name: "摰",       lat: 27.8170, lng: 114.4120, km: 985 },
          { name: "????,     lat: 27.6250, lng: 113.8320, km: 1080 },
          { name: "?芣散镼?,     lat: 27.8430, lng: 112.9760, km: 1170 },
          { name: "憍???,     lat: 27.7280, lng: 111.9720, km: 1280 },
          { name: "?菟??,     lat: 27.3100, lng: 111.4600, km: 1370 },
          { name: "?瑕???,     lat: 27.4850, lng: 109.9510, km: 1530 },
          { name: "????,     lat: 27.6900, lng: 109.1900, km: 1620 },
          { name: "?梢???,     lat: 26.5630, lng: 107.9990, km: 1810 },
          { name: "鞎湧??,     lat: 26.6420, lng: 107.0110, km: 1942, dwellSec: 60 },
          { name: "摰?镼?,     lat: 26.2500, lng: 106.0250, km: 2055 },
          { name: "?脤???,     lat: 25.4910, lng: 103.7870, km: 2178 },
          { name: "????,     lat: 24.7850, lng: 102.8660, km: 2252, dwellSec: 90 },
        ],
      },
      {
        id: "Beijing-Subway-1",
        name: "?漪?圈1??",
        nameEn: "Beijing Subway Line 1",
        color: "#c23a30",
        category: "?琿?",
        directions: { up: "銝? (?????", down: "銝? (?啁?摨血???孵?)" },
        // ?漪 1 ?? + ?恍? 2021 撟游?雿萇蝯曹? 1 ????,?????啁?摨血??
        // ?券 47.6 km??5 蝡?
        stations: [
          { name: "????,         lat: 39.9270, lng: 116.1760, km: 0,    dwellSec: 30 },
          { name: "?文?",           lat: 39.9110, lng: 116.1900, km: 1.6 },
          { name: "?怨?????,     lat: 39.9080, lng: 116.2050, km: 2.5 },
          { name: "?怠窄撅?,         lat: 39.9050, lng: 116.2300, km: 4.4 },
          { name: "??頝?,         lat: 39.9040, lng: 116.2470, km: 6.0 },
          { name: "鈭ㄤ??,         lat: 39.9070, lng: 116.2750, km: 8.4 },
          { name: "?砍ˊ頝?,         lat: 39.9060, lng: 116.2920, km: 9.7 },
          { name: "?砌蜓憓?,         lat: 39.9070, lng: 116.3170, km: 12.0 },
          { name: "頠??擗?,     lat: 39.9070, lng: 116.3270, km: 13.0 },
          { name: "?冽豕??,         lat: 39.9100, lng: 116.3420, km: 14.5 },
          { name: "?旨憯怨楝",       lat: 39.9130, lng: 116.3570, km: 15.7 },
          { name: "敺抵??",         lat: 39.9100, lng: 116.3580, km: 16.7, dwellSec: 30 },
          { name: "镼踹",           lat: 39.9070, lng: 116.3740, km: 18.0 },
          { name: "憭拙??镼?,       lat: 39.9070, lng: 116.3910, km: 19.3 },
          { name: "憭拙????,       lat: 39.9070, lng: 116.4040, km: 20.3 },
          { name: "??鈭?,         lat: 39.9100, lng: 116.4130, km: 21.4 },
          { name: "?勗",           lat: 39.9100, lng: 116.4210, km: 22.1 },
          { name: "撱箏??",         lat: 39.9100, lng: 116.4350, km: 23.4, dwellSec: 30 },
          { name: "瘞詨???,         lat: 39.9100, lng: 116.4500, km: 24.7 },
          { name: "?窒",           lat: 39.9110, lng: 116.4640, km: 25.9 },
          { name: "憭扳?頝?,         lat: 39.9110, lng: 116.4810, km: 27.4 },
          { name: "??",           lat: 39.9100, lng: 116.5080, km: 29.5 },
          { name: "????,         lat: 39.9100, lng: 116.5230, km: 30.4 },
          { name: "擃?摨?,         lat: 39.9100, lng: 116.5460, km: 32.0 },
          { name: "?喳?憭批飛",       lat: 39.9130, lng: 116.5610, km: 33.0 },
          { name: "??",           lat: 39.9130, lng: 116.5830, km: 34.5 },
          { name: "蝞∟?",           lat: 39.9130, lng: 116.6050, km: 36.5 },
          { name: "?恍?璈?,         lat: 39.9110, lng: 116.6250, km: 38.5 },
          { name: "????",       lat: 39.9100, lng: 116.6400, km: 39.5 },
          { name: "??",           lat: 39.9010, lng: 116.6580, km: 41.0 },
          { name: "銋ㄤ璅?,         lat: 39.8920, lng: 116.6650, km: 42.5 },
          { name: "璇典?",           lat: 39.8810, lng: 116.6670, km: 43.5 },
          { name: "?冽眾??,         lat: 39.8710, lng: 116.6680, km: 44.5 },
          { name: "??",           lat: 39.8600, lng: 116.6680, km: 45.5 },
          { name: "?梯?",           lat: 39.8350, lng: 116.6830, km: 46.7 },
          { name: "?啁?摨血??",     lat: 39.8290, lng: 116.7040, km: 47.6, dwellSec: 30 },
        ],
      },
      {
        id: "Beijing-Subway-2",
        name: "?漪?圈2??",
        nameEn: "Beijing Subway Line 2",
        color: "#066b46",
        category: "?琿?",
        directions: { up: "憭 (????", down: "?抒 (????" },
        // 2 ??:?漪銝剖??啁?蝺?23.1 km 18 蝡誑镼輻??粹暺?擐蝡???
        // 銵函內???
        stations: [
          { name: "镼輻?",     lat: 39.9400, lng: 116.3490, km: 0,    dwellSec: 30 },
          { name: "蝛偌瞏?,     lat: 39.9450, lng: 116.3670, km: 1.5 },
          { name: "曌?憭扯?",   lat: 39.9490, lng: 116.3940, km: 3.6 },
          { name: "摰??",     lat: 39.9500, lng: 116.4130, km: 4.7 },
          { name: "??摰?,     lat: 39.9480, lng: 116.4180, km: 5.6 },
          { name: "?梁?",     lat: 39.9400, lng: 116.4350, km: 6.5, dwellSec: 30 },
          { name: "?勗???",   lat: 39.9340, lng: 116.4350, km: 7.4 },
          { name: "??",     lat: 39.9260, lng: 116.4350, km: 8.4 },
          { name: "撱箏??",     lat: 39.9100, lng: 116.4350, km: 9.7, dwellSec: 30 },
          { name: "?漪蝡?,     lat: 39.9010, lng: 116.4350, km: 11.5, dwellSec: 30 },
          { name: "撏??",     lat: 39.9010, lng: 116.4180, km: 12.5 },
          { name: "??",       lat: 39.9000, lng: 116.3980, km: 13.7 },
          { name: "?像?",     lat: 39.9010, lng: 116.3880, km: 14.6 },
          { name: "摰?郎?",     lat: 39.9000, lng: 116.3710, km: 15.6 },
          { name: "?瑟凶銵?,     lat: 39.9010, lng: 116.3570, km: 16.5 },
          { name: "敺抵??",     lat: 39.9100, lng: 116.3580, km: 17.7, dwellSec: 30 },
          { name: "???",     lat: 39.9260, lng: 116.3570, km: 19.0 },
          { name: "頠摨?,     lat: 39.9330, lng: 116.3570, km: 20.0 },
          { name: "镼輻?",     lat: 39.9400, lng: 116.3490, km: 23.1, dwellSec: 30 },
        ],
      },
      {
        id: "Shanghai-Metro-1",
        name: "銝絲?圈1??",
        nameEn: "Shanghai Metro Line 1",
        color: "#e4002b",
        category: "?琿?",
        directions: { up: "銝? (撖頝舀??", down: "銝? (???孵?)" },
        stations: [
          { name: "撖頝?,         lat: 31.3970, lng: 121.3950, km: 0,    dwellSec: 30 },
          { name: "?盲镼輯楝",       lat: 31.3880, lng: 121.3980, km: 0.9 },
          { name: "撖嗅??祈楝",       lat: 31.3780, lng: 121.4020, km: 2.0 },
          { name: "?勗??唳?",       lat: 31.3570, lng: 121.4080, km: 4.5 },
          { name: "?潸頝?,         lat: 31.3450, lng: 121.4130, km: 5.8 },
          { name: "?眾?唳?",       lat: 31.3310, lng: 121.4200, km: 7.4 },
          { name: "?勗熒頝?,         lat: 31.3200, lng: 121.4270, km: 8.7 },
          { name: "敶剜策?唳?",       lat: 31.3130, lng: 121.4350, km: 9.5 },
          { name: "瘙嗆偌頝?,         lat: 31.3010, lng: 121.4430, km: 11.0 },
          { name: "銝絲擐祆??,     lat: 31.2900, lng: 121.4520, km: 12.2 },
          { name: "撱園頝?,         lat: 31.2810, lng: 121.4560, km: 13.2 },
          { name: "銝剖控?楝",       lat: 31.2690, lng: 121.4590, km: 14.5 },
          { name: "銝絲?怨?蝡?,     lat: 31.2500, lng: 121.4560, km: 16.7, dwellSec: 30 },
          { name: "瞍Ｖ葉頝?,         lat: 31.2450, lng: 121.4610, km: 17.4 },
          { name: "?圈?頝?,         lat: 31.2400, lng: 121.4660, km: 18.0 },
          { name: "鈭箸?撱?",       lat: 31.2340, lng: 121.4710, km: 18.9, dwellSec: 30 },
          { name: "暺??楝",       lat: 31.2250, lng: 121.4710, km: 19.9 },
          { name: "?正?楝",       lat: 31.2180, lng: 121.4560, km: 21.0 },
          { name: "撣貊?頝?,         lat: 31.2120, lng: 121.4500, km: 22.0 },
          { name: "銵∪控頝?,         lat: 31.2040, lng: 121.4430, km: 22.9 },
          { name: "敺振??,         lat: 31.1950, lng: 121.4350, km: 24.0, dwellSec: 30 },
          { name: "銝絲擃擗?,     lat: 31.1860, lng: 121.4340, km: 25.1 },
          { name: "瞍窄頝?,         lat: 31.1660, lng: 121.4210, km: 27.6 },
          { name: "銝絲??",       lat: 31.1550, lng: 121.4260, km: 28.9, dwellSec: 30 },
          { name: "?行?璅?",       lat: 31.1350, lng: 121.4080, km: 31.4 },
          { name: "?株頝?,         lat: 31.1190, lng: 121.4020, km: 33.4 },
          { name: "憭頝?,         lat: 31.1040, lng: 121.3950, km: 35.0 },
          { name: "??",           lat: 31.1140, lng: 121.3850, km: 36.4, dwellSec: 30 },
        ],
      },
      {
        id: "Shanghai-Metro-2",
        name: "銝絲?圈2??",
        nameEn: "Shanghai Metro Line 2",
        color: "#84cc16",
        category: "?琿?",
        directions: { up: "銝? (敺??望??", down: "銝? (瘚行??璈?孵?)" },
        // 銝絲 2 ??:敺??晦?瘚行??璈 64.0 km 30 蝡?銝剖???瑕?萇?銋???
        stations: [
          { name: "敺???,             lat: 31.1922, lng: 121.2734, km: 0,    dwellSec: 30 },
          { name: "?寞??怨?蝡?,         lat: 31.1958, lng: 121.3198, km: 4.4, dwellSec: 30 },
          { name: "?寞?2?蝡?",      lat: 31.1969, lng: 121.3370, km: 6.2 },
          { name: "瘛頝?,             lat: 31.2274, lng: 121.3673, km: 9.7 },
          { name: "?瘨?,             lat: 31.2218, lng: 121.3856, km: 11.5 },
          { name: "憡祐頝?,             lat: 31.2185, lng: 121.4046, km: 13.3 },
          { name: "憍控?楝",           lat: 31.2173, lng: 121.4172, km: 14.5 },
          { name: "銝剖控?砍?",           lat: 31.2238, lng: 121.4198, km: 15.5 },
          { name: "瘙?頝?,             lat: 31.2225, lng: 121.4304, km: 16.6 },
          { name: "??撖?,             lat: 31.2261, lng: 121.4477, km: 18.4 },
          { name: "?漪镼輯楝",           lat: 31.2326, lng: 121.4612, km: 19.8 },
          { name: "鈭箸?撱?",           lat: 31.2342, lng: 121.4709, km: 20.7, dwellSec: 30 },
          { name: "?漪?梯楝",           lat: 31.2392, lng: 121.4790, km: 21.8 },
          { name: "?詨振??,             lat: 31.2386, lng: 121.5032, km: 24.1 },
          { name: "?望?頝?,             lat: 31.2308, lng: 121.5121, km: 25.0 },
          { name: "銝?憭折?",           lat: 31.2272, lng: 121.5274, km: 26.5, dwellSec: 30 },
          { name: "銝絲蝘?擗?,         lat: 31.2199, lng: 121.5419, km: 27.9 },
          { name: "銝??砍?",           lat: 31.2151, lng: 121.5538, km: 29.0 },
          { name: "樴頝?,             lat: 31.2073, lng: 121.5663, km: 30.4 },
          { name: "撘菜?擃?",           lat: 31.2070, lng: 121.5944, km: 33.5 },
          { name: "??頝?,             lat: 31.2073, lng: 121.6086, km: 35.0 },
          { name: "撱?頝?,             lat: 31.2073, lng: 121.6248, km: 36.7 },
          { name: "?",               lat: 31.2154, lng: 121.6727, km: 41.5 },
          { name: "?菜銝剛楝",           lat: 31.2179, lng: 121.7126, km: 45.4 },
          { name: "?臬??梯楝",           lat: 31.2225, lng: 121.7407, km: 48.5 },
          { name: "撌?",               lat: 31.1969, lng: 121.7012, km: 52.2 },
          { name: "?征頝?,             lat: 31.1869, lng: 121.7264, km: 54.7 },
          { name: "?憭折?",           lat: 31.1664, lng: 121.7600, km: 58.7 },
          { name: "瘚瑕予銝楝",           lat: 31.1455, lng: 121.7854, km: 62.5 },
          { name: "瘚行??璈",       lat: 31.1510, lng: 121.8084, km: 64.0, dwellSec: 30 },
        ],
      },
    ],
    trainTemplates: [
      { line: "Beijing-Shanghai-HSR",   type: "敺抵???,   badge: "G",  badgeColor: "#c80000", speed: 290, interval: 10, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Beijing-Shanghai-HSR",   type: "?咩??,   badge: "D",  badgeColor: "#fb923c", speed: 230, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Beijing-Guangzhou-HSR",  type: "敺抵???,   badge: "G",  badgeColor: "#7e22ce", speed: 280, interval: 15, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Beijing-Guangzhou-HSR",  type: "?咩??,   badge: "D",  badgeColor: "#a855f7", speed: 220, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Shanghai-Kunming-HSR",   type: "敺抵???,   badge: "G",  badgeColor: "#16a34a", speed: 260, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Shanghai-Kunming-HSR",   type: "?咩??,   badge: "D",  badgeColor: "#84cc16", speed: 210, interval: 60, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Beijing-Subway-1",       type: "1??",    badge: "1",  badgeColor: "#c23a30", speed: 35, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Beijing-Subway-2",       type: "2??",    badge: "2",  badgeColor: "#066b46", speed: 35, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Shanghai-Metro-1",       type: "1??",    badge: "1",  badgeColor: "#e4002b", speed: 38, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "Shanghai-Metro-2",       type: "2??",    badge: "2",  badgeColor: "#84cc16", speed: 40, interval: 3, accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
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
        category: "?琿?",
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
        category: "?琿?",
        directions: { up: "Eastbound (to Pasir Ris)", down: "Westbound (to Tuas Link)" },
        // East-West Line:Pasir Ris?uas Link 銝餌??hangi Airport ?舐?
        // (Tanah Merah?hangi Airport)?芸??乓?
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
        category: "?琿?",
        directions: { up: "Clockwise (Dhoby Ghaut ??HarbourFront)", down: "Anti-clockwise" },
        // Circle Line:?桀???horseshoe(Dhoby Ghaut?arbourFront 28 蝡?
        // ~29 km),Stage 6 ?撱嗡撓摰極敺?甇????arina Bay ?舐?
        // (Promenade?ayfront?arina Bay)?芰??交銵具?
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
        category: "?琿?",
        directions: { up: "Putra Heights bound", down: "Gombak bound" },
        // LRT Laluan Kelana Jaya:Putra Heights?ombak 46.4 km 37 蝡?
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
        category: "?琿?",
        directions: { up: "Kwasa Damansara bound", down: "Kajang bound" },
        // MRT Sungai Buloh-Kajang Line:Kwasa Damansara?ajang 51.0 km 31 蝡?
        // (??Sungai Buloh 蝡臬 2022 撟游辣隡詨??寧 Kwasa Damansara ?箏??潛?)??
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
    label: "鉊腦鉊啤?鉊落鉆?鉊?Thailand",
    center: [13.75, 100.50],
    zoom: 11,
    lines: [
      {
        id: "BKK-BTS-Sukhumvit",
        name: "BTS 鉊芹葡鉊Ｒ葵鉊詮?鉊詮腹鉊抉葩鉊?,
        nameEn: "BTS Sukhumvit Line",
        color: "#16a34a",
        category: "?琿?",
        directions: { up: "Khu Khot bound (鉆鉊徇?鉊獅葉)", down: "Kheha bound (鉆?鉆?" },
        // BTS Sukhumvit Line:Khu Khot?heha 53.5 km 47 蝡?
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
        name: "MRT 鉊芹葡鉊Ｒ葵鉊菽?鉆董鉆鉊葩鉊?,
        nameEn: "MRT Blue Line",
        color: "#1d4ed8",
        category: "?琿?",
        directions: { up: "Tha Phra outer loop", down: "Lak Song bound" },
        // MRT ??:Bangkok 蝚砌?璇???桀???horseshoe loop,??Tha Phra
        // 蝬?Sukhumvit / Bang Sue / Chinatown / Hua Lamphong ??Bang Wa,
        // ?辣隡?Lak Song?銵?38 蝡?銝餌???
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
    label: "Vi廙 Nam Vietnam",
    center: [16.0, 107.0],
    zoom: 6,
    lines: [
      {
        id: "HCMC-Metro-1",
        name: "Tuy廕積 Metro s廙?1",
        nameEn: "H廙?Ch穩 Minh City Metro Line 1",
        color: "#dc2626",
        category: "?琿?",
        directions: { up: "B廕積 Th?nh bound", down: "Su廙 Ti礙n bound" },
        // ?∪??? Metro 1 ??:B廕積 Th?nh?u廙 Ti礙n 19.7 km 14 蝡?
        // 頞?蝚砌?璇???2024 撟湧???
        stations: [
          { name: "B廕積 Th?nh",          lat: 10.7724, lng: 106.6986, km: 0,    dwellSec: 30 },
          { name: "Nh? H獺t Th?nh Ph廙?,  lat: 10.7766, lng: 106.7035, km: 0.7 },
          { name: "Ba Son",             lat: 10.7837, lng: 106.7088, km: 1.5 },
          { name: "V?n Th獺nh",          lat: 10.7984, lng: 106.7142, km: 3.5 },
          { name: "T璽n C廕τg",           lat: 10.7972, lng: 106.7218, km: 4.5 },
          { name: "Th廕υ ?i廙",          lat: 10.8050, lng: 106.7398, km: 6.5 },
          { name: "An Ph繳",             lat: 10.8096, lng: 106.7497, km: 7.7 },
          { name: "R廕︷h Chi廕盧",         lat: 10.8189, lng: 106.7611, km: 9.3 },
          { name: "Ph廙 Long",         lat: 10.8273, lng: 106.7756, km: 11.0 },
          { name: "B穫nh Th獺i",          lat: 10.8450, lng: 106.7723, km: 13.5 },
          { name: "Th廙??廙妾",            lat: 10.8506, lng: 106.7717, km: 14.5 },
          { name: "Khu C繫ng Ngh廙?Cao",  lat: 10.8595, lng: 106.7878, km: 16.5 },
          { name: "?廕【 H廙 Qu廙 Gia",   lat: 10.8721, lng: 106.7960, km: 18.0 },
          { name: "Su廙 Ti礙n",          lat: 10.8765, lng: 106.8093, km: 19.7, dwellSec: 30 },
        ],
      },
      {
        id: "Hanoi-Metro-2A",
        name: "Tuy廕積 s廙?2A",
        nameEn: "H? N廙 Metro Line 2A",
        color: "#16a34a",
        category: "?琿?",
        directions: { up: "C獺t Linh bound", down: "Y礙n Ngh藺a bound" },
        // 瘝喳 Metro 2A 蝺?C獺t Linh?礙n Ngh藺a 13.0 km 12 蝡?
        // 頞?蝚砌?璇?撣???2021 撟湧???
        stations: [
          { name: "C獺t Linh",           lat: 21.0297, lng: 105.8327, km: 0,    dwellSec: 30 },
          { name: "La Th?nh",           lat: 21.0218, lng: 105.8267, km: 0.9 },
          { name: "Th獺i H?",            lat: 21.0148, lng: 105.8224, km: 1.7 },
          { name: "L獺ng",               lat: 21.0116, lng: 105.8192, km: 2.2 },
          { name: "?廕【 H廙 Qu廙 Gia",   lat: 21.0073, lng: 105.8132, km: 2.9 },
          { name: "V?nh ?ai 3",         lat: 20.9967, lng: 105.7983, km: 4.5 },
          { name: "Thanh Xu璽n 3",       lat: 20.9869, lng: 105.7878, km: 6.0 },
          { name: "B廕積 Xe H? ?繫ng",     lat: 20.9756, lng: 105.7796, km: 7.5 },
          { name: "H? ?繫ng",            lat: 20.9654, lng: 105.7768, km: 8.7 },
          { name: "La Kh礙",             lat: 20.9576, lng: 105.7688, km: 10.0 },
          { name: "V?n Kh礙",            lat: 20.9497, lng: 105.7657, km: 11.0 },
          { name: "Y礙n Ngh藺a",          lat: 20.9448, lng: 105.7550, km: 13.0, dwellSec: 30 },
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
//   - line.shape: [{lat,lng,km}, ...] ??high-resolution polyline along the real
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
  // We use a local flat approximation ??fine for < 1000 km segments.
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
  // sqrt(aLat 繚 R), where R is the local curve radius from the polyline shape.
  // A forward (accel-limited) and backward (decel-limited) sweep then enforces
  // kinematic feasibility, giving a profile that starts and ends at rest.
  // Pure functions ??shared by TrainGen (build time) and the React memos.
  // ====================================================

  // Min plausible curve radius. Caps the slowdown from noisy polyline points
  // (e.g. OSM zig-zag artefacts) that would otherwise produce R values far
  // tighter than real track geometry permits.
  const MIN_CURVE_RADIUS_M = 60;
  const DEFAULT_A_LAT = 0.65;

  // Curvature radius (m) at every interior node of `points` via 3-point
  // circumscribed-circle formula in a local flat (lat/lng ??metres) frame.
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

    // 1. Speed cap at each node: cruise ??curvature limit. Endpoints clamped to
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
    // under constant acceleration, so dt = 2繚dx / (v0+v1) (exact).
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
        // Both endpoints at rest with non-zero dx ??only happens at degenerate
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

  // Position (m from start) at time ? (s since departure).
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
    // Solve x_local = v0繚? + 0.5繚acc繚?簡 for ? ??0.
    const disc = v0 * v0 + 2 * acc * xLocal;
    const sqrtD = Math.sqrt(Math.max(0, disc));
    return a.t + (-v0 + sqrtD) / acc;
  }

  // Normalize Chinese station names so user input "?啣?" / "?唳" matches the
  // TDX-canonical "?箏?" / "?箸" (and vice versa). The two glyphs are
  // semantically identical in Taiwan place names; TDX uses ?? common usage
  // mixes both. This collapses ??????for keys, queries, and equality checks.
  // For display, the canonical TDX form (with ?? is preserved in `station.name`.
  function normalizeName(s) {
    return typeof s === 'string' ? s.replace(/??g, '??) : s;
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
// TRAIN GENERATOR ??given a reference time (Date), generate the list of trains
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
      const vCruise = tpl.speed / 3.6; // km/h ??m/s
      const accel = tpl.accel, decel = tpl.decel, defaultDwell = tpl.dwellSec;
      const aLat = tpl.aLat; // m/s簡 lateral comfort cap (per train type)

    for (let dir = 0; dir < 2; dir++) { // 0 = down, 1 = up
      // Build a directional view: stations in travel order, with km-from-origin
      // (always 0 at the start of the run, growing to totalKm at the end). The
      // canonical (region-wide) station.km is preserved for snap lookups.
      const stationsDir = dir === 1
        ? line.stations.slice().reverse()
        : line.stations.slice();
      const totalStations = line.stations.length;
      const reqStart = tpl.stationIdxStart == null ? 0 : tpl.stationIdxStart;
      const reqEnd = tpl.stationIdxEnd == null ? (totalStations - 1) : tpl.stationIdxEnd;
      const sClamp = n => Math.max(0, Math.min(totalStations - 1, n));
      const routeStartCanonical = Math.min(sClamp(reqStart), sClamp(reqEnd));
      const routeEndCanonical = Math.max(sClamp(reqStart), sClamp(reqEnd));
      const startSidx = dir === 1
        ? (totalStations - 1 - routeEndCanonical)
        : routeStartCanonical;
      const endSidx = dir === 1
        ? (totalStations - 1 - routeStartCanonical)
        : routeEndCanonical;
      if (startSidx > endSidx) continue;
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
        const runStations = stationsDir.slice(startSidx, endSidx + 1);
        const runSegTemplates = segTemplates.slice(startSidx, endSidx);
        const stops = new Array(runStations.length);
        const segments = new Array(runSegTemplates.length);

          let clock = startSec;
          for (let sidx = 0; sidx < runStations.length; sidx++) {
            const st = runStations[sidx];
            const arrival = clock;
            const isEndpoint = (sidx === 0 || sidx === runStations.length - 1);
            const dwellSec = isEndpoint ? 0 : (st.dwellSec != null ? st.dwellSec : defaultDwell);
            const departure = clock + dwellSec;
            stops[sidx] = {
              stationIdx: stationIdxOf(startSidx + sidx),
              name: st.name,
              km: st.km,
              lat: st.lat,
              lng: st.lng,
              arrival: secondsToDate(date, arrival),
              departure: secondsToDate(date, departure),
              dwellSec,
            };
            if (sidx < runSegTemplates.length) {
              const segTpl = runSegTemplates[sidx];
              segments[sidx] = {
                kin: segTpl.kin,
                kmStartCanonical: segTpl.kmStartCanonical,
                kmEndCanonical: segTpl.kmEndCanonical,
                localKmStart: segTpl.localKmStart,
                localKmEnd: segTpl.localKmEnd,
                stationIdxStart: segTpl.stationIdxStart,
                stationIdxEnd: segTpl.stationIdxEnd,
                tDepart: secondsToDate(date, departure),
                tArrive: secondsToDate(date, departure + segTpl.kin.T),
              };
              clock = departure + segTpl.kin.T;
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
      "?芸撥": "", "??": "", "???: "",
      "擃": "", "憭芷陌??: "", "?格???: "",
      "?柴???: "", "?脯???: "", "????: "",
      "撅望?蝺?: "", "敹恍?: "", "?孵敹恍?: "",
    };
    // Real-world-ish number ranges
    if (tpl.type === "擃") return String(100 + (n % 900));
    if (tpl.type === "?柴???) return String(1 + (n % 299));
    if (tpl.type === "?脯???) return String(460 + (n % 40));
    if (tpl.type === "????) return String(700 + (n % 90));
    if (tpl.type === "撅望?蝺?) return String(n % 9999).padStart(4, "0") + "G";
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
