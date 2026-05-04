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
    ],
    trainTemplates: [
      // TRA West — various types. accel/decel in m/s²; dwellSec is default per non-endpoint stop.
      { line: "TRA-West", type: "自強", badge: "自強", badgeColor: "#f87171", speed: 90,  interval: 30, accel: 0.55, decel: 0.55, dwellSec: 45 },
      { line: "TRA-West", type: "莒光", badge: "莒光", badgeColor: "#fbbf24", speed: 75,  interval: 60, accel: 0.45, decel: 0.50, dwellSec: 60 },
      { line: "TRA-West", type: "區間", badge: "區間", badgeColor: "#60a5fa", speed: 55,  interval: 20, accel: 0.85, decel: 0.90, dwellSec: 30 },
      // THSR
      { line: "THSR",     type: "高鐵", badge: "HSR",  badgeColor: "#6ee7b7", speed: 260, interval: 15, accel: 0.72, decel: 0.70, dwellSec: 60 },
      // TRA East
      { line: "TRA-East", type: "太魯閣", badge: "太魯閣", badgeColor: "#a78bfa", speed: 110, interval: 90, accel: 0.65, decel: 0.65, dwellSec: 45 },
      { line: "TRA-East", type: "普悠瑪", badge: "普悠瑪", badgeColor: "#34d399", speed: 110, interval: 90, accel: 0.65, decel: 0.65, dwellSec: 45 },
      { line: "TRA-East", type: "自強",   badge: "自強",   badgeColor: "#f87171", speed: 95,  interval: 45, accel: 0.55, decel: 0.55, dwellSec: 45 },
      { line: "TRA-East", type: "區間",   badge: "區間",   badgeColor: "#60a5fa", speed: 60,  interval: 30, accel: 0.85, decel: 0.90, dwellSec: 30 },
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
      { line: "Tokaido-Shinkansen", type: "のぞみ",     badge: "のぞみ", badgeColor: "#6ee7b7", speed: 270, interval: 10, accel: 0.72, decel: 0.70, dwellSec: 60 },
      { line: "Tokaido-Shinkansen", type: "ひかり",     badge: "ひかり", badgeColor: "#fbbf24", speed: 220, interval: 30, accel: 0.72, decel: 0.70, dwellSec: 45 },
      { line: "Tokaido-Shinkansen", type: "こだま",     badge: "こだま", badgeColor: "#60a5fa", speed: 160, interval: 30, accel: 0.72, decel: 0.70, dwellSec: 60 },
      { line: "JR-Yamanote",        type: "山手線",     badge: "山手",   badgeColor: "#34d399", speed: 35,  interval: 4,  accel: 1.00, decel: 1.10, dwellSec: 25 },
      { line: "JR-Chuo",            type: "快速",       badge: "快速",   badgeColor: "#fbbf24", speed: 55,  interval: 8,  accel: 0.85, decel: 0.95, dwellSec: 25 },
      { line: "JR-Chuo",            type: "特別快速",   badge: "特快",   badgeColor: "#f87171", speed: 70,  interval: 20, accel: 0.80, decel: 0.90, dwellSec: 30 },
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

      // Validate the projected station kms before applying. Multi-segment or
      // loop shapes (e.g. Tokaido stitched across multiple relations, Yamanote
      // loop without a canonical anchor) can produce non-monotonic projected
      // kms that break schedule generation. When that happens, skip the merge
      // for this line — the station-to-station polyline fallback still draws.
      if (gen.stationKms) {
        // Loop lines (e.g. 山手線) list the anchor station twice — first at
        // km 0 and last at the polyline total length. The generator's flat
        // name→km dict can only hold one value per name, so synthesize the
        // closing km from gen.totalKm for the trailing duplicate.
        const isLoopLine = line.stations.length >= 3 &&
          line.stations[0].name === line.stations[line.stations.length - 1].name;
        let monotonic = true;
        let prev = -Infinity;
        for (let i = 0; i < line.stations.length; i++) {
          const st = line.stations[i];
          const isLoopBack = isLoopLine && i === line.stations.length - 1 && gen.totalKm != null;
          const k = isLoopBack ? gen.totalKm : gen.stationKms[st.name];
          if (k == null) continue;
          // Allow ties only if two adjacent stations have the same name
          // (loop closure), otherwise require strict increase.
          if (k < prev || (k === prev && (i === 0 || line.stations[i-1].name !== st.name))) {
            monotonic = false;
            break;
          }
          prev = k;
        }
        if (!monotonic) {
          if (typeof console !== 'undefined') {
            console.warn(`[rail-data] skipping shape merge for line "${line.id}": projected station kms are non-monotonic`);
          }
          continue;
        }
      }

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
      // Update station km from generator (already projected onto shape)
      if (gen.stationKms) {
        const isLoopLine = line.stations.length >= 3 &&
          line.stations[0].name === line.stations[line.stations.length - 1].name;
        for (let i = 0; i < line.stations.length; i++) {
          const st = line.stations[i];
          const isLoopBack = isLoopLine && i === line.stations.length - 1 && gen.totalKm != null;
          const k = isLoopBack ? gen.totalKm : gen.stationKms[st.name];
          if (k != null) st.km = k;
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
  // Kinematic helpers (trapezoidal velocity profile per inter-station segment).
  // All inputs in SI: L (m), v (m/s), a, d (m/s²). Returns time in seconds and
  // position in metres from segment start. Pure functions — shared by TrainGen
  // (build time) and the React memos (runtime).
  // ====================================================

  // Build the segment kinematics for a run of L metres at cruise v with accel a
  // and decel d. Picks trapezoidal or triangular profile automatically.
  function kinematicSegment(L, v, a, d) {
    if (!(L > 0)) {
      return { tA: 0, tC: 0, tD: 0, La: 0, Lc: 0, Ld: 0, vTop: 0, T: 0, triangular: true };
    }
    const Lcrit = (v*v) / (2*a) + (v*v) / (2*d);
    if (L < Lcrit) {
      // Triangular: peak velocity vp < v
      const vp = Math.sqrt(2 * L * a * d / (a + d));
      const tA = vp / a;
      const tD = vp / d;
      const La = (vp*vp) / (2*a);
      const Ld = L - La; // by construction
      return { tA, tC: 0, tD, La, Lc: 0, Ld, vTop: vp, T: tA + tD, triangular: true };
    }
    // Trapezoidal
    const tA = v / a;
    const tD = v / d;
    const La = (v*v) / (2*a);
    const Ld = (v*v) / (2*d);
    const Lc = L - La - Ld;
    const tC = Lc / v;
    return { tA, tC, tD, La, Lc, Ld, vTop: v, T: tA + tC + tD, triangular: false };
  }

  // Position (m from segment start) at time τ (s since departing prior station).
  function kmAtTimeInSegment(seg, tau) {
    if (tau <= 0) return 0;
    if (tau >= seg.T) return seg.La + seg.Lc + seg.Ld;
    if (tau <= seg.tA) {
      // Phase 1: accelerating from rest. a = vTop / tA
      const a = seg.vTop / seg.tA;
      return 0.5 * a * tau * tau;
    }
    if (tau <= seg.tA + seg.tC) {
      // Phase 2: cruising
      return seg.La + seg.vTop * (tau - seg.tA);
    }
    // Phase 3: decelerating. d = vTop / tD
    const d = seg.vTop / seg.tD;
    const tp = tau - seg.tA - seg.tC;
    return seg.La + seg.Lc + seg.vTop * tp - 0.5 * d * tp * tp;
  }

  // Time (s since departing prior station) at position x (m from segment start).
  function timeAtKmInSegment(seg, x) {
    const L = seg.La + seg.Lc + seg.Ld;
    if (x <= 0) return 0;
    if (x >= L) return seg.T;
    if (x <= seg.La) {
      const a = seg.vTop / seg.tA;
      return Math.sqrt(2 * x / a);
    }
    if (x <= seg.La + seg.Lc) {
      return seg.tA + (x - seg.La) / seg.vTop;
    }
    const d = seg.vTop / seg.tD;
    const remaining = L - x;
    return seg.T - Math.sqrt(2 * remaining / d);
  }

  return { haversine, projectOnSegment, closestOnLine, positionAtKm,
           kinematicSegment, kmAtTimeInSegment, timeAtKmInSegment };
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
    const cacheKey = regionKey + "|" + dateKey + "|kinV1";
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

        // Pre-compute kinematic segments once per (template, direction). Each
        // segment runs between consecutive stations in travel order; tDepart /
        // tArrive are filled in per-train below.
        const segTemplates = [];
        for (let i = 0; i < stationsDir.length - 1; i++) {
          const a = stationsDir[i], b = stationsDir[i+1];
          const Lkm = Math.abs(localKmOf(b) - localKmOf(a));
          const seg = RailUtil.kinematicSegment(Lkm * 1000, vCruise, accel, decel);
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
