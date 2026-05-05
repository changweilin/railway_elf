// Mock train line data — Taiwan (TRA/HSR) + Japan (JR major lines)
// Each line has an array of stations with {name, lat, lng, km} (km = cumulative km from line origin)
// Trains are generated dynamically from templates.

window.RAIL_DATA = {
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
      },
    ],
    trainTemplates: [
      { line: "Tokaido-Shinkansen", type: "のぞみ",     badge: "のぞみ", badgeColor: "#6ee7b7", speed: 270, interval: 10, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "Tokaido-Shinkansen", type: "ひかり",     badge: "ひかり", badgeColor: "#fbbf24", speed: 220, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 45 },
      { line: "Tokaido-Shinkansen", type: "こだま",     badge: "こだま", badgeColor: "#60a5fa", speed: 160, interval: 30, accel: 0.72, decel: 0.70, aLat: 0.85, dwellSec: 60 },
      { line: "JR-Yamanote",        type: "山手線",     badge: "山手",   badgeColor: "#34d399", speed: 35,  interval: 4,  accel: 1.00, decel: 1.10, aLat: 0.95, dwellSec: 25 },
      { line: "JR-Chuo",            type: "快速",       badge: "快速",   badgeColor: "#fbbf24", speed: 55,  interval: 8,  accel: 0.85, decel: 0.95, aLat: 0.85, dwellSec: 25 },
      { line: "JR-Chuo",            type: "特別快速",   badge: "特快",   badgeColor: "#f87171", speed: 70,  interval: 20, accel: 0.80, decel: 0.90, aLat: 0.85, dwellSec: 30 },
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
  const shapes = window.RAIL_SHAPES;
  if (!shapes) return;
  for (const region of Object.values(window.RAIL_DATA)) {
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
    }
  }
})();

// ========================================================
// GEO HELPERS
// ========================================================
window.RailUtil = (function(){
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

  return { haversine, projectOnSegment, closestOnLine, positionAtKm,
           shapeBetween, curvatureRadii,
           kinematicProfile, kmAtTimeInProfile, timeAtKmInProfile,
           normalizeName, namesEqual };
})();

// ========================================================
// TRAIN GENERATOR — given a reference time (Date), generate the list of trains
// running on a given day. Each train has stops[{stationIdx, time}].
// ========================================================
window.TrainGen = (function(){
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
