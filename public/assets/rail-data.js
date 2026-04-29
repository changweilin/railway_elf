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
        directions: { up: "北上 (往基隆)", down: "南下 (往高雄)" },
        stations: [
          { name: "基隆", lat: 25.1315, lng: 121.7405, km: 0 },
          { name: "台北", lat: 25.0478, lng: 121.5170, km: 28.2 },
          { name: "板橋", lat: 25.0144, lng: 121.4637, km: 35.2 },
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
        directions: { up: "北上 (往南港)", down: "南下 (往左營)" },
        stations: [
          { name: "南港", lat: 25.0521, lng: 121.6069, km: 0 },
          { name: "台北", lat: 25.0478, lng: 121.5170, km: 9.0 },
          { name: "板橋", lat: 25.0144, lng: 121.4637, km: 15.0 },
          { name: "桃園", lat: 25.0127, lng: 121.2149, km: 45.0 },
          { name: "新竹", lat: 24.8083, lng: 121.0406, km: 80.0 },
          { name: "苗栗", lat: 24.6094, lng: 120.8251, km: 120.0 },
          { name: "台中", lat: 24.1124, lng: 120.6151, km: 175.0 },
          { name: "彰化", lat: 24.0174, lng: 120.4251, km: 200.0 },
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
        directions: { up: "北上 (往樹林)", down: "南下 (往花蓮/台東)" },
        stations: [
          { name: "樹林", lat: 24.9935, lng: 121.4253, km: 0 },
          { name: "板橋", lat: 25.0144, lng: 121.4637, km: 6.3 },
          { name: "台北", lat: 25.0478, lng: 121.5170, km: 13.0 },
          { name: "松山", lat: 25.0497, lng: 121.5774, km: 19.6 },
          { name: "南港", lat: 25.0521, lng: 121.6069, km: 22.7 },
          { name: "八堵", lat: 25.1056, lng: 121.7150, km: 31.6 },
          { name: "瑞芳", lat: 25.1086, lng: 121.8072, km: 39.9 },
          { name: "福隆", lat: 25.0200, lng: 121.9444, km: 57.1 },
          { name: "宜蘭", lat: 24.7548, lng: 121.7619, km: 104.0 },
          { name: "羅東", lat: 24.6779, lng: 121.7664, km: 112.8 },
          { name: "蘇澳新", lat: 24.5985, lng: 121.8286, km: 128.0 },
          { name: "花蓮", lat: 23.9935, lng: 121.6014, km: 211.0 },
          { name: "玉里", lat: 23.3352, lng: 121.3132, km: 290.0 },
          { name: "台東", lat: 22.7930, lng: 121.1243, km: 374.0 },
        ],
      },
    ],
    trainTemplates: [
      // TRA West — various types
      { line: "TRA-West", type: "自強", badge: "自強", badgeColor: "#f87171", speed: 90, interval: 30 },
      { line: "TRA-West", type: "莒光", badge: "莒光", badgeColor: "#fbbf24", speed: 75, interval: 60 },
      { line: "TRA-West", type: "區間", badge: "區間", badgeColor: "#60a5fa", speed: 55, interval: 20 },
      // THSR
      { line: "THSR", type: "高鐵", badge: "HSR", badgeColor: "#6ee7b7", speed: 260, interval: 15 },
      // TRA East
      { line: "TRA-East", type: "太魯閣", badge: "太魯閣", badgeColor: "#a78bfa", speed: 110, interval: 90 },
      { line: "TRA-East", type: "普悠瑪", badge: "普悠瑪", badgeColor: "#34d399", speed: 110, interval: 90 },
      { line: "TRA-East", type: "自強", badge: "自強", badgeColor: "#f87171", speed: 95, interval: 45 },
      { line: "TRA-East", type: "區間", badge: "區間", badgeColor: "#60a5fa", speed: 60, interval: 30 },
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
        directions: { up: "上り (東京方面)", down: "下り (新大阪方面)" },
        stations: [
          { name: "東京", lat: 35.6812, lng: 139.7671, km: 0 },
          { name: "品川", lat: 35.6285, lng: 139.7387, km: 6.8 },
          { name: "新横浜", lat: 35.5075, lng: 139.6175, km: 28.8 },
          { name: "小田原", lat: 35.2562, lng: 139.1552, km: 83.9 },
          { name: "熱海", lat: 35.1036, lng: 139.0783, km: 104.6 },
          { name: "三島", lat: 35.1260, lng: 138.9115, km: 120.7 },
          { name: "静岡", lat: 34.9718, lng: 138.3891, km: 180.2 },
          { name: "浜松", lat: 34.7035, lng: 137.7346, km: 257.1 },
          { name: "名古屋", lat: 35.1709, lng: 136.8815, km: 366.0 },
          { name: "京都", lat: 34.9858, lng: 135.7588, km: 513.6 },
          { name: "新大阪", lat: 34.7335, lng: 135.5002, km: 552.6 },
        ],
      },
      {
        id: "JR-Yamanote",
        name: "山手線",
        nameEn: "JR Yamanote Line",
        color: "#34d399",
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
      { line: "Tokaido-Shinkansen", type: "のぞみ", badge: "のぞみ", badgeColor: "#6ee7b7", speed: 270, interval: 10 },
      { line: "Tokaido-Shinkansen", type: "ひかり", badge: "ひかり", badgeColor: "#fbbf24", speed: 220, interval: 30 },
      { line: "Tokaido-Shinkansen", type: "こだま", badge: "こだま", badgeColor: "#60a5fa", speed: 160, interval: 30 },
      { line: "JR-Yamanote", type: "山手線", badge: "山手", badgeColor: "#34d399", speed: 35, interval: 4 },
      { line: "JR-Chuo", type: "快速", badge: "快速", badgeColor: "#fbbf24", speed: 55, interval: 8 },
      { line: "JR-Chuo", type: "特別快速", badge: "特快", badgeColor: "#f87171", speed: 70, interval: 20 },
    ],
  },
};

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

  // Find the closest point on a polyline (array of {lat,lng,km})
  // Returns {lat,lng, km, segmentIndex, dist}
  function closestOnLine(P, stations) {
    let best = null;
    for (let i = 0; i < stations.length - 1; i++) {
      const A = stations[i], B = stations[i+1];
      const proj = projectOnSegment(P, A, B);
      const km = A.km + proj.t * (B.km - A.km);
      if (!best || proj.dist < best.dist) {
        best = { lat: proj.lat, lng: proj.lng, km, segmentIndex: i, dist: proj.dist };
      }
    }
    return best;
  }

  // Given a line's stations (with km) and a cumulative km value, return lat/lng of that position.
  function positionAtKm(stations, km) {
    if (km <= stations[0].km) return { lat: stations[0].lat, lng: stations[0].lng };
    const last = stations[stations.length - 1];
    if (km >= last.km) return { lat: last.lat, lng: last.lng };
    for (let i = 0; i < stations.length - 1; i++) {
      const A = stations[i], B = stations[i+1];
      if (km >= A.km && km <= B.km) {
        const t = (km - A.km) / (B.km - A.km);
        return { lat: A.lat + t * (B.lat - A.lat), lng: A.lng + t * (B.lng - A.lng) };
      }
    }
    return { lat: last.lat, lng: last.lng };
  }

  return { haversine, projectOnSegment, closestOnLine, positionAtKm };
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
    const cacheKey = regionKey + "|" + dateKey;
    if (cache[cacheKey]) return cache[cacheKey];

    const trains = [];
    const daySeed = hash(dateKey);

    region.trainTemplates.forEach((tpl, tplIdx) => {
      const line = region.lines.find(l => l.id === tpl.line);
      if (!line) return;
      const totalKm = line.stations[line.stations.length - 1].km;
      const travelMin = (totalKm / tpl.speed) * 60;
      // Service window: 5:30am -> 23:30
      const svcStart = 5.5 * 60, svcEnd = 23.5 * 60;
      const numTrains = Math.max(1, Math.floor((svcEnd - svcStart) / tpl.interval));

      for (let dir = 0; dir < 2; dir++) { // 0 = down, 1 = up
        for (let i = 0; i < numTrains; i++) {
          // Stagger up/down by half an interval
          const startMin = svcStart + i * tpl.interval + (dir * tpl.interval * 0.5);
          if (startMin > svcEnd) continue;
          // Train number — e.g. HSR123, TRA1234
          const numBase = 100 + (tplIdx * 200) + (dir * 1000) + i * 2;
          const trainNumber = makeTrainNumber(tpl, numBase, dir, daySeed);

          const stops = [];
          const stations = line.stations;
          for (let sidx = 0; sidx < stations.length; sidx++) {
            const station = dir === 1 ? stations[stations.length - 1 - sidx] : stations[sidx];
            const fromOrigin = dir === 1 ? (totalKm - station.km) : station.km;
            const timeMin = startMin + (fromOrigin / totalKm) * travelMin;
            // Dwell time: 1-2 min at each station except endpoints
            const dwell = (sidx === 0 || sidx === stations.length - 1) ? 0 : 1;
            stops.push({
              stationIdx: dir === 1 ? (stations.length - 1 - sidx) : sidx,
              name: station.name,
              km: station.km,
              lat: station.lat,
              lng: station.lng,
              time: minutesToDate(date, timeMin + dwell * 0.5),
            });
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
            stops,
            startTime: stops[0].time,
            endTime: stops[stops.length - 1].time,
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

  function minutesToDate(baseDate, minutes) {
    const d = new Date(baseDate);
    d.setHours(0, 0, 0, 0);
    d.setMinutes(minutes);
    return d;
  }

  return { generate };
})();
