// Fetch real railway line geometry from TDX (Taiwan) and OSM Overpass (Japan),
// simplify, re-project our hand-coded stations onto the real shape, and emit
// src/rail-data.generated.js.
//
// Usage:
//   TDX_CLIENT_ID=xxx TDX_CLIENT_SECRET=yyy node scripts/fetch-rail-shapes.mjs
//
// Optional flags:
//   --skip-tw         Skip Taiwan (TDX). Useful when iterating on Japan-only.
//   --skip-jp         Skip Japan (OSM). Useful when iterating on Taiwan-only.
//   --only-lines=a,b  Fetch only the listed internal line ids.
//   --pretty          Pretty-print the generated JS (default: minified-ish).
//   --no-cache        Disable disk cache read+write (always hit network, no fallback).
//   --refresh-cache   Bypass cache read but still update the cache on success.
//
// Env vars:
//   OFFLINE=1   Skip all network calls, serve everything from scripts/.cache/.
//               Useful for re-running the build step without internet.
//
// Output:
//   src/rail-data.generated.js — exports RAIL_SHAPES = { [lineId]: { shape, stationKms } }
//
// Get a TDX account at https://tdx.transportdata.tw/ (free tier is fine).

import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_PATH = resolve(ROOT, "src/rail-data.generated.js");
const CACHE_DIR = resolve(__dirname, ".cache");

const args = new Set(process.argv.slice(2));
const SKIP_TW = args.has("--skip-tw");
const SKIP_JP = args.has("--skip-jp");
const PRETTY = args.has("--pretty");

const LINE_OUTPUT_OPTIONS = {
  "THSR": { snapStationCoordsOverKm: 1.0 },
  "TRA-Pingxi": { snapStationCoordsOverKm: 1.0 },
  "TRA-Neiwan": { snapStationCoordsOverKm: 1.0 },
  "TRA-Jiji": { snapStationCoordsOverKm: 1.0 },
};
const NO_CACHE = args.has("--no-cache");
const REFRESH_CACHE = args.has("--refresh-cache");
const ONLY_LINES = new Set(
  process.argv
    .slice(2)
    .filter(arg => arg.startsWith("--only-lines="))
    .flatMap(arg => arg.slice("--only-lines=".length).split(","))
    .map(s => s.trim())
    .filter(Boolean)
);

// ---------------------------------------------------------------------------
// CONFIG: which internal line ids map to which upstream sources.
// Internal ids must match those in src/rail-data.js.
// ---------------------------------------------------------------------------

// TDX TRA LineID reference (subset):
//   1001 縱貫線 (基隆=>竹南)
//   1002 縱貫線 (竹南=>彰化)
//   1003 海岸線
//   1004 縱貫線 (彰化=>高雄)
//   1006 宜蘭線
//   1007 北迴線
//   1008 台東線
// THSR is fetched from /Rail/THSR/Shape (single line, no LineID mapping needed).
// Each entry can be a plain LineID string, or {lineId, from, to} to take a
// sub-segment of that LineID's polyline cut between two lat/lng anchor points.
const TDX_LINE_MAP = {
  // 西部幹線 — WL StationOfLine ends at 屏東; PL (屏東線) extends 屏東 → 枋寮.
  // Append PL[屏東→枋寮] so the line connects to TRA-South-Link's start anchor.
  "TRA-West": [
    "WL",
    { lineId: "PL", from: { lat: 22.6690, lng: 120.4862 }, to: { lat: 22.3683, lng: 120.5953 } },
  ],
  // 海岸線 — TDX LineID 1003 "CL", 竹南↔彰化. A simple single-LineID fetch;
  // no anchor-slicing needed (CL is a self-contained line in the TDX feed).
  // WL-C 為 TDX 海岸線 (竹南→追分,18 站含彰化)。WL-C 形狀只到追分,彰化透過
  // 成追線 (CZ) 接入但 CZ 在拼接時會被當作 closed detour 移除;為保證 km 單調,
  // 我們在站表 extraction 時把彰化過濾掉,把追分當作海線南端終點。
  "TRA-Coast": ["WL-C"],
  "TRA-East": [           // 東部幹線實際營運從樹林發車,需要 WL[樹林→八堵] + EL 拼接
    { lineId: "WL", from: { lat: 24.9935, lng: 121.4253 }, to: { lat: 25.1056, lng: 121.7150 } },
    "EL",
  ],
  // TRA branch lines (TDX provides direct shape per LineID).
  // Note: TDX LineID labels do not match the colloquial Taiwanese names —
  // verified via the /Rail/TRA/Shape feed: SA=深澳線, and SL is a single
  // LineID whose MULTILINESTRING bundles both 沙崙線 (Tainan) AND 南迴線
  // (枋寮↔台東) as separate segments. We disambiguate by anchor-slicing.
  // 阿里山林業鐵路 is operated by 林務局, not TRA — not in the TDX feed and
  // falls back to the station-to-station polyline.
  "TRA-Pingxi": ["PX"], // 平溪線
  "TRA-Neiwan": ["NW"], // 內灣線
  "TRA-Jiji":   ["JJ"], // 集集線
  "TRA-Shalun": [
    { lineId: "SL", from: { lat: 22.9197, lng: 120.2360 }, to: { lat: 22.9252, lng: 120.2853 } },
  ],
  "TRA-South-Link": [
    { lineId: "SL", from: { lat: 22.3672, lng: 120.5961 }, to: { lat: 22.7930, lng: 121.1243 } },
  ],
};

// OSM Overpass relations for Japanese lines.
// Overpass query: relation["route"="train"]["ref"="<ref>"] — verified manually.
// If a line spans multiple operating segments, list multiple refs and we'll stitch.
// Verified via Overpass name search 2026-04-30. Use single-direction "route"
// relations (not route_master) so that `>` recurse-down yields the way list directly.
const OSM_LINE_MAP = {
  // Tokaido relation 5263977 is bidirectional + sidings + depot (6939 ways → 1029km vs real 552km).
  // No clean single-direction sub-route exists upstream. Use station-chain corridor filter:
  // keep only ways within corridorKm of station chain, then bin by projected km and pick the
  // way nearest to the chain centerline per bin — collapses up/down tracks into one.
  "Tokaido-Shinkansen": {
    name: "Tōkaidō Shinkansen",
    relationIds: [5263977],
    corridor: { corridorKm: 0.7, binKm: 0.15, parallelKm: 0.08 },
  },
  "JR-Yamanote": {
    name: "Yamanote Line (Outer)",
    relationIds: [1972920],
    loopAnchor: { lat: 35.6812, lng: 139.7671 },
    corridor: { corridorKm: 2.0, sampleKm: 0.05 },
    orderStationKms: true,
  }, // 外回り 環狀,以東京站切開
  "JR-Chuo":            { name: "Chūō Line Rapid (down)", relationIds: [10363876] }, // 下り (Tokyo→west)
  "Sanyo-Shinkansen": {
    name: "Sanyō Shinkansen",
    relationIds: [1837932],
    corridor: { corridorKm: 2.5, sampleKm: 0.1 },
  }, // 新大阪→博多; relation includes both directions, so rebuild one centerline

  // Tokyo Metro (route=subway).
  "Tokyo-Metro-Ginza":      { name: "Tokyo Metro Ginza Line (浅草→渋谷)",     relationIds: [443281] },  // A 線 (浅草→渋谷) 主行向
  "Tokyo-Metro-Marunouchi": { name: "Tokyo Metro Marunouchi Line (池袋→荻窪)", relationIds: [8015932] }, // 本線 池袋→荻窪 (不含方南町支線)

  // JR Keihin-Tōhoku (大宮↔横浜) + 根岸線 (横浜↔大船) 合併運轉。
  // OSM 各為獨立 relation,串接後即覆蓋我們的 大宮↔大船 站表。
  "JR-Keihin-Tohoku": {
    name: "JR Keihin-Tōhoku + Negishi (大宮→大船)",
    relationIds: [5195691, 10257299],
    snapStationCoordsOverKm: 1.0,
  }, // 京浜東北南行 + 根岸下り

  // JR 中央・総武緩行線 (Local) — 三鷹↔千葉。10312043 gives the cleanest
  // station-order projection after fixing the Chiba-end station coordinates.
  "JR-Sobu-Local": {
    name: "Chūō-Sōbu Local (千葉→三鷹)",
    relationIds: [10312043],
  },

  // 東急東横線 (渋谷→横浜) 順向。
  "Tokyu-Toyoko":       { name: "Tōkyū Tōyoko Line (渋谷→横浜)", relationIds: [9288982] },

  // 大阪環状線 — 環狀,錨點為大阪站。OSM 將外回り獨立 relation,以大阪
  // 為起終共用點。
  "JR-Osaka-Loop":      { name: "JR Osaka Loop (外回り)", relationIds: [10073682], loopAnchor: { lat: 34.7025, lng: 135.4959 } },

  // 大阪メトロ御堂筋線 — 2024 北延伸後 relation 為 箕面萱野→中百舌鳥。
  // 我們站表只覆蓋 江坂↔なかもず,polyline 會延伸到 箕面萱野 (北端外掛
  // 段約 6 km),站點透過投影映射到 polyline 上保持一致。
  "Osaka-Metro-Midosuji": { name: "Osaka Metro Midōsuji (箕面萱野→中百舌鳥)", relationIds: [2411153] },

  // 阪急電鉄神戸本線 (大阪梅田→神戸三宮)。
  "Hankyu-Kobe": {
    name: "Hankyū Kōbe Line (梅田→三宮)",
    relationIds: [11966252],
    snapStationCoordsOverKm: 1.0,
  },

  // Taiwan Metro / LRT — single-direction sub-routes (NOT route_masters).
  // Using a master would pull both directional sub-routes whose tracks may be
  // > 40 m apart, defeating the parallel-way dedupe and yielding a doubled
  // polyline. Pick one direction per line.
  "TPE-Red":      { name: "Tamsui-Xinyi (S)",  relationIds: [5378981] }, // 南向 淡水→象山
  "TPE-Blue":     { name: "Bannan",            relationIds: [199038]  }, // 南港→土城
  "TPE-Green":    { name: "Songshan-Xindian",  relationIds: [4250357] }, // 順向
  "TPE-Brown": {
    name: "Wenhu",
    relationIds: [447449],
    orderStationKms: true,
    stationStops: { reverse: true },
  }, // 順向
  // 中和新蘆 is a Y-junction; 4250354 (蘆洲 順向) covers 蘆洲→南勢角 (matches our chain).
  "TPE-Yellow":   { name: "Zhonghe-Xinlu (蘆洲)", relationIds: [4250354] },
  "TYMRT": {
    name: "Taoyuan Airport MRT",
    relationIds: [8487062],
    corridor: { corridorKm: 3.0, sampleKm: 0.08 },
    orderStationKms: true,
    snapStationCoordsOverKm: 1.0,
  }, // 台北→環北
  "KHH-Red": {
    name: "KRTC Red",
    relationIds: [4174828],
    corridor: { corridorKm: 1.0, sampleKm: 0.05 },
    snapStationCoordsOverKm: 1.0,
  }, // 小港→岡山
  "KHH-Orange": {
    name: "KRTC Orange",
    relationIds: [4174827],
    orderStationKms: true,
    stationStops: {},
  }, // 哈瑪星→大寮
  // KHH circular LRT — closed loop. Anchor at 籬仔內 (first station in our chain).
  "KHH-LRT": {
    name: "KRTC Circular LRT",
    relationIds: [6826886],
    loopAnchor: { lat: 22.5985, lng: 120.3134 },
    corridor: { corridorKm: 1.0, sampleKm: 0.05 },
    orderStationKms: true,
    snapStationCoordsOverKm: 1.0,
  }, // 順行
  "Tamsui-LRT":   { name: "Danhai LRT (上行)",  relationIds: [9154523] }, // 紅樹林→崁頂
  // Alishan main line (嘉義→阿里山). Mountain spurs (神木/沼平/祝山) are separate relations.
  "Alishan-Forest": {
    name: "Alishan Forest Railway",
    relationIds: [5570989],
    snapStationCoordsOverKm: 1.0,
  },

  // Korea.
  "Seoul-Metro-1": {
    name: "Seoul Metropolitan Subway Line 1 (Soyosan→Incheon, clipped to Gwangwoon Univ.→Incheon)",
    relationIds: [8691809],
    corridor: { corridorKm: 1.2, sampleKm: 0.08 },
  },
  "Seoul-Metro-2": { name: "Seoul Subway Line 2 Outer Circle", relationIds: [2404374], loopAnchor: { lat: 37.5645, lng: 126.9776 } },
  "AREX": {
    name: "Airport Railroad Express All-stop (Seoul Station→Incheon Int'l Airport Terminal 2)",
    relationIds: [7919000],
    orderStationKms: true,
    stationStops: {},
  },
  "Gimpo-Goldline": {
    name: "Gimpo Goldline (Yangchon→Gimpo Int'l Airport)",
    relationIds: [10092720],
    orderStationKms: true,
    stationStops: {},
  },
  "Daegu-Metro-3": {
    name: "Daegu Metro Line 3 monorail (Chilgok Kyungpook Nat'l Univ. Medical Center→Yongji)",
    relationIds: [7685727],
    orderStationKms: true,
    stationStops: {},
  },
  "KTX-Gyeongbu": {
    name: "KTX Gyeongbu Line / Gyeongbu HSL (Seoul→Busan)",
    relationIds: [11214334],
    corridor: { corridorKm: 6.0, sampleKm: 0.3 },
  },
  "SRT-Gyeongbu": {
    name: "SRT Gyeongbu Line (Suseo→Busan)",
    relationIds: [6096884, 6094351],
    corridor: { corridorKm: 3.0, sampleKm: 0.25 },
    snapStationCoordsOverKm: 1.0,
  },
  "SRT-Honam": {
    name: "SRT Honam Line (Suseo-Mokpo)",
    relationIds: [6096884, 6094351, 6095809, 6094787],
    corridor: { corridorKm: 4.0, sampleKm: 0.25 },
    snapStationCoordsOverKm: 1.0,
  },
  "Busan-Metro-1": {
    name: "Busan Metro Line 1 (Dadaepo Beach→Nopo)",
    relationIds: [8255697],
    corridor: { corridorKm: 1.5, sampleKm: 0.05 },
    orderStationKms: true,
    stationStops: {},
    stationKmOverrides: { "동대신": 21.2 },
  },

  // Hong Kong MTR.
  "MTR-Tsuen-Wan":       { name: "MTR Tsuen Wan Line (Central→Tsuen Wan)", relationIds: [9736530] },
  "MTR-Island":          { name: "MTR Island Line (Kennedy Town→Chai Wan)", relationIds: [4432666] },
  "MTR-East-Rail":       { name: "MTR East Rail Line (Admiralty→Lo Wu)", relationIds: [4248592] },
  "MTR-Airport-Express": { name: "MTR Airport Express (Hong Kong→AsiaWorld-Expo)", relationIds: [5317239] },

  // Mainland China. HSR entries use `route=railway` infrastructure relations;
  // corridor reconstruction keeps only the intended station chain.
  "Beijing-Shanghai-HSR": {
    name: "Jinghu High-speed Line",
    relationIds: [356778],
    corridor: { corridorKm: 12.0, sampleKm: 1.0 },
    snapStationCoordsOverKm: 1.0,
  },
  "Beijing-Guangzhou-HSR": {
    name: "Jinggang High-speed Line (clipped to Beijing West→Guangzhou South)",
    relationIds: [5473433, 12265072],
    corridor: { corridorKm: 14.0, sampleKm: 1.2 },
    snapStationCoordsOverKm: 1.0,
  },
  "Shanghai-Kunming-HSR": {
    name: "Shanghai-Kunming High-speed Railway",
    relationIds: [10627959],
    corridor: { corridorKm: 14.0, sampleKm: 1.2 },
    snapStationCoordsOverKm: 1.5,
  },
  "Beijing-Subway-1": {
    name: "Beijing Subway Line 1 / Batong (Gucheng→Universal Resort)",
    relationIds: [1667140],
    corridor: { corridorKm: 3.0, sampleKm: 0.08 },
    orderStationKms: true,
    stationStops: {},
  },
  "Beijing-Subway-2": {
    name: "Beijing Subway Line 2 clockwise",
    relationIds: [1667236],
    loopAnchor: { lat: 39.94, lng: 116.349 },
    corridor: { corridorKm: 1.5, sampleKm: 0.08 },
  },
  "Shanghai-Metro-1": {
    name: "Shanghai Metro Line 1 (Fujin Road→Xinzhuang)",
    relationIds: [199200],
    orderStationKms: true,
    stationStops: {},
  },
  "Shanghai-Metro-2": {
    name: "Shanghai Metro Line 2 (Panxiang Road→Pudong Airport)",
    relationIds: [5611326],
    orderStationKms: true,
    stationStops: { offset: 1 },
  },

  // Singapore MRT.
  "SG-MRT-North-South": { name: "MRT North-South Line (Jurong East→Marina South Pier)", relationIds: [2312797] },
  "SG-MRT-East-West":   { name: "MRT East-West Line (Pasir Ris→Tuas Link)", relationIds: [2312796] },
  "SG-MRT-Circle":      { name: "MRT Circle Line (Dhoby Ghaut→HarbourFront)", relationIds: [7981669] },

  // Kuala Lumpur.
  "KL-Kelana-Jaya": {
    name: "Kelana Jaya Line (Putra Heights→Gombak)",
    relationIds: [8000438],
    corridor: { corridorKm: 1.5, sampleKm: 0.08 },
    orderStationKms: true,
    stationStops: {},
  },
  "KL-MRT-Kajang":  {
    name: "Kajang Line (Kwasa Damansara→Kajang)",
    relationIds: [5690837],
    corridor: { corridorKm: 2.0, sampleKm: 0.08 },
    orderStationKms: true,
    snapStationCoordsOverKm: 1.5,
  },

  // Bangkok.
  "BKK-BTS-Sukhumvit": {
    name: "BTS Sukhumvit Line (Khu Khot→Kheha)",
    relationIds: [444651],
    orderStationKms: true,
    stationStops: {},
  },
  "BKK-MRT-Blue": {
    name: "MRT Blue Line (Tha Phra→Lak Song)",
    relationIds: [444659],
    orderStationKms: true,
    stationStops: {},
  },
  "BKK-Airport-Rail":  { name: "Airport Rail Link (Phaya Thai→Suvarnabhumi)", relationIds: [2148241] },

  // Vietnam.
  "HCMC-Metro-1": {
    name: "HCMC Metro Line 1 (Ben Thanh→Suoi Tien)",
    relationIds: [11919223],
    orderStationKms: true,
    stationStops: {},
  },
  "Hanoi-Metro-2A": {
    name: "Hanoi Metro Line 2A (Cat Linh→Yen Nghia)",
    relationIds: [9684066],
    orderStationKms: true,
    stationStops: {},
  },
};

// Simplification tolerance (km). 0.005 = 5 m. Bigger = smaller file, more loss.
const SIMPLIFY_TOLERANCE_KM = 0.005;

// ---------------------------------------------------------------------------
// GEO HELPERS
// ---------------------------------------------------------------------------

const R_EARTH = 6371; // km
const toRad = d => d * Math.PI / 180;

function haversine(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const la1 = toRad(a.lat), la2 = toRad(b.lat);
  const x = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;
  return 2 * R_EARTH * Math.asin(Math.sqrt(x));
}

// Point→segment perpendicular distance in km, using local flat-earth.
function perpDistKm(P, A, B) {
  const latMid = (A.lat + B.lat + P.lat) / 3;
  const kx = Math.cos(toRad(latMid)) * 111.32;
  const ky = 110.57;
  const ax = A.lng * kx, ay = A.lat * ky;
  const bx = B.lng * kx, by = B.lat * ky;
  const px = P.lng * kx, py = P.lat * ky;
  const dx = bx - ax, dy = by - ay;
  const len2 = dx*dx + dy*dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

// Project point P onto segment AB; return { lat, lng, t, dist }.
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
  return {
    lat: A.lat + t * (B.lat - A.lat),
    lng: A.lng + t * (B.lng - A.lng),
    t,
    dist: Math.hypot(px - (ax + t * dx), py - (ay + t * dy)),
  };
}

// Douglas–Peucker on [{lat,lng}, ...] using haversine perpDist.
function simplify(points, tolKm) {
  if (points.length < 3) return points.slice();
  const keep = new Uint8Array(points.length);
  keep[0] = 1; keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [lo, hi] = stack.pop();
    let maxD = 0, idx = -1;
    for (let i = lo + 1; i < hi; i++) {
      const d = perpDistKm(points[i], points[lo], points[hi]);
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (idx !== -1 && maxD > tolKm) {
      keep[idx] = 1;
      stack.push([lo, idx], [idx, hi]);
    }
  }
  const out = [];
  for (let i = 0; i < points.length; i++) if (keep[i]) out.push(points[i]);
  return out;
}

// Cumulative km along a polyline.
function cumulativeKm(points) {
  const out = [0];
  for (let i = 1; i < points.length; i++) {
    out.push(out[i - 1] + haversine(points[i - 1], points[i]));
  }
  return out;
}

function positionOnShapeAtKm(shape, shapeKm, targetKm) {
  if (targetKm <= 0) return shape[0];
  const totalKm = shapeKm[shapeKm.length - 1] ?? 0;
  if (targetKm >= totalKm) return shape[shape.length - 1];
  for (let i = 0; i < shape.length - 1; i++) {
    if (shapeKm[i + 1] < targetKm) continue;
    const span = shapeKm[i + 1] - shapeKm[i];
    const t = span > 0 ? (targetKm - shapeKm[i]) / span : 0;
    return {
      lat: shape[i].lat + t * (shape[i + 1].lat - shape[i].lat),
      lng: shape[i].lng + t * (shape[i + 1].lng - shape[i].lng),
    };
  }
  return shape[shape.length - 1];
}

// Project a station onto the polyline; returns the cumulative km of the closest point.
// `minKm` is used while deriving stationKms so repeated nearby geometry does not
// pull a later station backward on the route.
function stationKmOnShape(station, shape, shapeKm, minKm = -Infinity) {
  let bestDist = Infinity, bestKm = 0;
  for (let i = 0; i < shape.length - 1; i++) {
    const p = projectOnSegment(station, shape[i], shape[i + 1]);
    const km = shapeKm[i] + p.t * (shapeKm[i + 1] - shapeKm[i]);
    if (km + 1e-6 < minKm) continue;
    if (p.dist < bestDist) {
      bestDist = p.dist;
      bestKm = km;
    }
  }
  if (bestDist === Infinity) {
    const p = positionOnShapeAtKm(shape, shapeKm, minKm);
    return { km: minKm, dist: haversine(station, p) };
  }
  return { km: bestKm, dist: bestDist };
}

// ---------------------------------------------------------------------------
// WKT (LINESTRING / MULTILINESTRING) — TDX returns geometry as WKT strings.
// ---------------------------------------------------------------------------

function parseWkt(wkt) {
  const m = wkt.match(/^(MULTILINESTRING|LINESTRING)\s*\((.*)\)\s*$/i);
  if (!m) throw new Error(`Unrecognized WKT: ${wkt.slice(0, 80)}…`);
  const kind = m[1].toUpperCase();
  const body = m[2];
  if (kind === "LINESTRING") return [parseCoordList(body)];
  // MULTILINESTRING: outer body is "(c1,c2,...),(c3,c4,...)"
  const segs = [];
  let depth = 0, start = 0;
  for (let i = 0; i < body.length; i++) {
    if (body[i] === "(") { if (depth === 0) start = i + 1; depth++; }
    else if (body[i] === ")") { depth--; if (depth === 0) segs.push(body.slice(start, i)); }
  }
  return segs.map(parseCoordList);
}

function parseCoordList(s) {
  return s.split(",").map(pair => {
    const [lng, lat] = pair.trim().split(/\s+/).map(Number);
    return { lat, lng };
  });
}

// Stitch multiple polylines into one, ordering by which endpoint of the next
// polyline is closest to the running tail. Reverses segments as needed.
// Slice a polyline between two lat/lng anchor points by snapping to the
// nearest vertex on each side. Returns the inclusive sub-array, reversed if
// `to` precedes `from` in the polyline order. Returns [] when either anchor
// is farther than `maxAnchorKm` from the polyline — needed for MULTILINESTRING
// inputs where some segments don't contain the anchors at all (e.g. TDX's
// SL LineID bundles both 沙崙線 and 南迴線 as separate segments).
function sliceByAnchors(poly, from, to, maxAnchorKm = 3) {
  let iFrom = 0, dFrom = Infinity, iTo = 0, dTo = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const df = haversine(poly[i], from);
    const dt = haversine(poly[i], to);
    if (df < dFrom) { dFrom = df; iFrom = i; }
    if (dt < dTo) { dTo = dt; iTo = i; }
  }
  if (dFrom > maxAnchorKm || dTo > maxAnchorKm) return [];
  if (iFrom <= iTo) return poly.slice(iFrom, iTo + 1);
  return poly.slice(iTo, iFrom + 1).reverse();
}

// Stitch multiple polylines into one chain. For small N we try every start
// (segment, end) and pick the chain with the smallest total inter-segment
// bridge distance — this avoids the there-and-back artifact that pure
// greedy produces on trunks like WL (3 sub-segments {基隆-八堵, 八堵-桃園area,
// 桃園-高雄}). For large N (OSM way lists with thousands of segments) we
// fall back to greedy-from-segment-0 to keep the build fast.
function stitchPolylines(polylines) {
  if (polylines.length === 0) return [];
  if (polylines.length === 1) return polylines[0].slice();

  function greedyFrom(startS, startEnd) {
    const used = new Set([startS]);
    let chain = polylines[startS].slice();
    if (startEnd === "tail") chain.reverse();
    let totalBridge = 0;
    while (used.size < polylines.length) {
      const tail = chain[chain.length - 1];
      let bestS = -1, bestRev = false, bestDist = Infinity;
      for (let s = 0; s < polylines.length; s++) {
        if (used.has(s)) continue;
        const dH = haversine(tail, polylines[s][0]);
        const dT = haversine(tail, polylines[s][polylines[s].length - 1]);
        if (dH < bestDist) { bestDist = dH; bestS = s; bestRev = false; }
        if (dT < bestDist) { bestDist = dT; bestS = s; bestRev = true; }
      }
      if (bestS < 0) break;
      let pts = polylines[bestS].slice();
      if (bestRev) pts.reverse();
      if (haversine(tail, pts[0]) < 0.001) pts = pts.slice(1);
      chain = chain.concat(pts);
      totalBridge += bestDist;
      used.add(bestS);
    }
    return { chain, totalBridge };
  }

  // O(n^3) — only viable for small n. TDX trunk lines have ≤5 segments.
  const SMALL_N = 20;
  if (polylines.length <= SMALL_N) {
    let best = null;
    for (let s = 0; s < polylines.length; s++) {
      for (const end of ["head", "tail"]) {
        const candidate = greedyFrom(s, end);
        if (!best || candidate.totalBridge < best.totalBridge) best = candidate;
      }
    }
    return best.chain;
  }
  return greedyFrom(0, "head").chain;
}

function coordKey(p) {
  return `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`;
}

// TDX occasionally includes a branch as part of a trunk MULTILINESTRING. When
// stitching later trunk pieces back to the same junction, the branch becomes a
// closed detour (junction -> branch tail -> straight bridge -> junction). For
// linear routes, drop those large closed detours and keep the mainline chain.
function removeLargeClosedDetours(poly, { minLoopKm = 2 } = {}) {
  const out = [];
  const seen = new Map();
  const removed = [];

  for (const p of poly) {
    const key = coordKey(p);
    const priorIdx = seen.get(key);
    if (priorIdx != null) {
      let loopKm = 0;
      for (let i = priorIdx + 1; i < out.length; i++) {
        loopKm += haversine(out[i - 1], out[i]);
      }
      if (out.length > priorIdx + 1) {
        loopKm += haversine(out[out.length - 1], p);
      }
      if (loopKm >= minLoopKm) {
        for (let i = priorIdx + 1; i < out.length; i++) {
          const innerKey = coordKey(out[i]);
          if (seen.get(innerKey) === i) seen.delete(innerKey);
        }
        removed.push({ from: priorIdx, to: out.length, km: loopKm });
        out.length = priorIdx + 1;
        continue;
      }
    }
    seen.set(key, out.length);
    out.push(p);
  }

  return { shape: out, removed };
}

// ---------------------------------------------------------------------------
// CACHE + RETRY
//
// Successful JSON responses are stored in scripts/.cache/<sha1(key)>.json so a
// later run that hits 429/500/timeout can fall back to last-known-good data
// instead of producing an empty rail-data.generated.js.
// ---------------------------------------------------------------------------

function cachePathFor(key) {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  const hash = createHash("sha1").update(key).digest("hex").slice(0, 16);
  return resolve(CACHE_DIR, `${hash}.json`);
}

function readCache(key) {
  if (NO_CACHE) return null;
  const p = cachePathFor(key);
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, "utf8")); }
  catch { return null; }
}

function writeCache(key, value) {
  if (NO_CACHE) return;
  try { writeFileSync(cachePathFor(key), JSON.stringify(value), "utf8"); }
  catch (e) { console.warn(`[cache] write failed: ${e.message}`); }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Generic retry with exponential backoff. fn must throw on error.
async function withRetry(label, fn, { attempts = 4, baseMs = 1500 } = {}) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try { return await fn(); }
    catch (e) {
      lastErr = e;
      if (i === attempts) break;
      const wait = baseMs * 2 ** (i - 1);
      console.warn(`[retry] ${label} attempt ${i}/${attempts}: ${e.message} — backoff ${wait}ms`);
      await sleep(wait);
    }
  }
  throw lastErr;
}

// Track per-source provenance so we can log a summary at the end of the run.
// Three buckets: 'fresh' = just-fetched, 'cache-offline' = OFFLINE=1 hit cache,
// 'cache-fallback' = network failed and we served stale cache.
const sourceProvenance = { fresh: [], 'cache-offline': [], 'cache-fallback': [] };
const osmStationCoordsByLineId = {};

// Fetch JSON with retry + disk cache fallback. Cache is keyed on `cacheKey`.
// On network failure after all retries, returns the cached value if present.
// Pass `retryOpts: { attempts: 1 }` for fetchers that already do their own
// retry/fallback (avoids ballooning total attempts to N×M).
async function fetchJsonCached(cacheKey, label, fetcher, retryOpts) {
  if (process.env.OFFLINE === "1") {
    const cached = readCache(cacheKey);
    if (cached) {
      console.log(`[CACHE] ${label}: using cached copy (OFFLINE=1)`);
      sourceProvenance['cache-offline'].push(label);
      return cached;
    }
    throw new Error(`OFFLINE=1 but no cache for ${label}`);
  }
  try {
    const fresh = await withRetry(label, fetcher, retryOpts);
    writeCache(cacheKey, fresh);
    console.log(`[FRESH] ${label}: fetched live data, cache updated`);
    sourceProvenance.fresh.push(label);
    return fresh;
  } catch (e) {
    const cached = readCache(cacheKey);
    if (cached) {
      console.warn(`[CACHE] ${label}: network failed (${e.message}) — falling back to cached copy`);
      sourceProvenance['cache-fallback'].push(label);
      return cached;
    }
    throw e;
  }
}

// Print a one-glance summary of which upstream sources came from the network
// vs. the on-disk cache. Useful for spotting "this PR rebuilt everything from
// stale cache" before merging.
function logProvenanceSummary() {
  const fresh = sourceProvenance.fresh.length;
  const offline = sourceProvenance['cache-offline'].length;
  const fallback = sourceProvenance['cache-fallback'].length;
  const total = fresh + offline + fallback;
  if (total === 0) return;
  console.log(`\n[SOURCE SUMMARY] ${fresh} fresh · ${offline} cache (OFFLINE) · ${fallback} cache (fallback)`);
  if (fallback > 0) {
    console.warn(`  ⚠ ${fallback} source(s) served from STALE cache (network failure):`);
    for (const label of sourceProvenance['cache-fallback']) console.warn(`    - ${label}`);
  }
  if (offline > 0) {
    console.log(`  · ${offline} source(s) served from cache because OFFLINE=1`);
  }
}

// ---------------------------------------------------------------------------
// TDX (Taiwan)
// ---------------------------------------------------------------------------

async function tdxAuth() {
  const id = process.env.TDX_CLIENT_ID;
  const secret = process.env.TDX_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("TDX_CLIENT_ID / TDX_CLIENT_SECRET not set. Get them at https://tdx.transportdata.tw/");
  }
  return withRetry("TDX auth", async () => {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
    });
    const res = await fetch(
      "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token",
      { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body }
    );
    if (!res.ok) throw new Error(`TDX auth failed: ${res.status} ${await res.text()}`);
    const json = await res.json();
    return json.access_token;
  });
}

async function tdxFetch(token, path, { version = "v3" } = {}) {
  const cacheKey = version === "v3" ? `tdx:${path}` : `tdx:${version}:${path}`;
  return fetchJsonCached(cacheKey, `TDX ${path}`, async () => {
    const url = `https://tdx.transportdata.tw/api/basic/${version}${path}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
    });
    if (!res.ok) throw new Error(`TDX ${path} failed: ${res.status}`);
    return res.json();
  });
}

// Lines for which we derive station lists from TDX instead of from rail-data.js.
const TDX_FULL_STATION_LINES = new Set(["TRA-West", "TRA-East", "TRA-South-Link", "TRA-Coast"]);

// Built by fetchTdxShapes; consumed by buildOutput.
let tdxStationsByInternalId = {};

async function fetchTdxShapes() {
  // If OFFLINE=1, skip auth — we'll read everything from cache anyway.
  let token = null;
  if (process.env.OFFLINE !== "1") {
    console.log("[TDX] Authenticating…");
    try { token = await tdxAuth(); }
    catch (e) {
      console.warn(`[TDX] auth failed: ${e.message} — will try cache`);
    }
  }

  console.log("[TDX] Fetching TRA shapes…");
  const traData = await tdxFetch(token, "/Rail/TRA/Shape?$format=JSON");
  const traShapes = (traData.Shapes || traData) // v3 wraps in {Shapes}, older versions don't
    .reduce((acc, row) => { acc[row.LineID] = row.Geometry; return acc; }, {});

  // ── NEW: fetch all TRA stations and station-of-line lists ──────────────────
  console.log("[TDX] Fetching TRA station list…");
  const stationListData = await tdxFetch(token, "/Rail/TRA/Station?$format=JSON");
  const stationRows = stationListData.Stations || stationListData;
  const stationById = {};
  for (const row of stationRows) {
    stationById[row.StationID] = {
      name: row.StationName.Zh_tw,
      lat:  row.StationPosition.PositionLat,
      lng:  row.StationPosition.PositionLon,
    };
  }

  console.log("[TDX] Fetching TRA station-of-line list…");
  const solData = await tdxFetch(token, "/Rail/TRA/StationOfLine?$format=JSON");
  const solRows = solData.StationOfLines || solData;
  // tdxStationsByLineId[lineId] = [{name, lat, lng, sequence}, ...] sorted by Sequence
  const tdxStationsByLineId = {};
  for (const row of solRows) {
    const lid = row.LineID;
    const arr = [];
    for (const s of (row.Stations || [])) {
      const info = stationById[s.StationID];
      if (!info) continue;
      arr.push({ ...info, sequence: s.Sequence });
    }
    arr.sort((a, b) => a.sequence - b.sequence);
    tdxStationsByLineId[lid] = arr;
  }

  // ── Build TDX-derived ordered station lists for the three in-scope lines ───
  // Helper: find closest station in an array to a given {lat,lng}.
  function closestIdx(arr, anchor) {
    let best = 0, bestD = Infinity;
    for (let i = 0; i < arr.length; i++) {
      const d = haversine(arr[i], anchor);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  // TDX WL includes a routing-only entry "臺北-環島" (StationID 1001) at the
  // same CumulativeDistance as 臺北. It is not a real passenger stop — filter
  // it and any similar "-環島" suffixed entries from all in-scope station lists.
  function isRoutingNode(name) {
    // "環島" — TDX virtual loop-routing nodes (not real platforms).
    // "基地"/"機廠" — depots/maintenance bases that fall inside the corridor
    //   filter when deriving stations from polyline geometry (e.g. 潮州基地).
    return name.includes("環島") || name.includes("基地") || name.includes("機廠");
  }

  // Derive a corridor-filtered ordered station list for a TDX shape LineID
  // when StationOfLine doesn't carry it (e.g. PL, NL, TT). Projects every TRA
  // station onto the longest polyline in the WKT and keeps those within
  // corridorKm of the line, ordered by km along the polyline. Optional anchor
  // slicing trims to the inclusive segment between two lat/lng points.
  function stationsAlongShapeLineId(lineId, opts = {}) {
    const { corridorKm = 0.3, fromAnchor, toAnchor } = opts;
    const wkt = traShapes[lineId];
    if (!wkt) return [];
    const segs = parseWkt(wkt);
    const seg = segs.reduce((a, b) => (b.length > a.length ? b : a), segs[0] || []);
    if (seg.length < 2) return [];
    const segKm = cumulativeKm(seg);
    const allStations = Object.values(stationById);
    const onLine = [];
    for (const st of allStations) {
      let bestKm = 0, bestDist = Infinity;
      for (let i = 0; i < seg.length - 1; i++) {
        const p = projectOnSegment(st, seg[i], seg[i + 1]);
        if (p.dist < bestDist) {
          bestDist = p.dist;
          bestKm = segKm[i] + p.t * (segKm[i + 1] - segKm[i]);
        }
      }
      if (bestDist <= corridorKm) onLine.push({ ...st, _km: bestKm });
    }
    onLine.sort((a, b) => a._km - b._km);
    let sliced = onLine;
    if (fromAnchor && toAnchor) {
      const iFrom = closestIdx(onLine, fromAnchor);
      const iTo = closestIdx(onLine, toAnchor);
      const lo = Math.min(iFrom, iTo), hi = Math.max(iFrom, iTo);
      sliced = onLine.slice(lo, hi + 1);
      if (iFrom > iTo) sliced.reverse();
    }
    return sliced.map(s => ({ name: s.name, lat: s.lat, lng: s.lng }));
  }

  // TRA-West: WL verbatim + PL[屏東→枋寮] derived from PL polyline + station list.
  // (PL is in /Rail/TRA/Shape but not in /Rail/TRA/StationOfLine.)
  if (tdxStationsByLineId["WL"]) {
    const wlStations = tdxStationsByLineId["WL"]
      .filter(s => !isRoutingNode(s.name))
      .map(s => ({ name: s.name, lat: s.lat, lng: s.lng }));
    const plStations = stationsAlongShapeLineId("PL", {
      corridorKm: 0.4,
      fromAnchor: { lat: 22.6690, lng: 120.4862 }, // 屏東
      toAnchor:   { lat: 22.3683, lng: 120.5953 }, // 枋寮
    });
    const wlNames = new Set(wlStations.map(s => s.name));
    const plAppend = plStations.filter(s => !wlNames.has(s.name) && !isRoutingNode(s.name));
    const combined = [...wlStations, ...plAppend];
    tdxStationsByInternalId["TRA-West"] = combined;
    if (plAppend.length > 0) {
      console.log(`[TDX] TRA-West: ${wlStations.length} WL + ${plAppend.length} PL (屏東→枋寮) = ${combined.length} stations from TDX`);
    } else {
      console.log(`[TDX] TRA-West: ${combined.length} stations from TDX (PL section not derived)`);
    }
  } else {
    console.warn("[TDX] TRA-West: WL not found in StationOfLine — will use hand-coded stations");
  }

  // TRA-East: WL[樹林→八堵] slice  +  EL list, deduped at seam
  {
    const wl = tdxStationsByLineId["WL"] || [];
    const el = tdxStationsByLineId["EL"] || [];
    const wlFrom = { lat: 24.9935, lng: 121.4253 }; // 樹林
    const wlTo   = { lat: 25.1056, lng: 121.7150 }; // 八堵
    const iFrom  = closestIdx(wl, wlFrom);
    const iTo    = closestIdx(wl, wlTo);
    let wlSlice;
    if (iFrom <= iTo) {
      wlSlice = wl.slice(iFrom, iTo + 1);
    } else {
      wlSlice = wl.slice(iTo, iFrom + 1).reverse();
    }
    const wlSliceFiltered = wlSlice.filter(s => !isRoutingNode(s.name));
    const wlNames = new Set(wlSliceFiltered.map(s => s.name));
    // Append EL stations, dropping any that share a name already present in wlSliceFiltered
    const combined = [
      ...wlSliceFiltered.map(s => ({ name: s.name, lat: s.lat, lng: s.lng })),
      ...el.filter(s => !wlNames.has(s.name) && !isRoutingNode(s.name)).map(s => ({ name: s.name, lat: s.lat, lng: s.lng })),
    ];
    if (combined.length > 0) {
      tdxStationsByInternalId["TRA-East"] = combined;
      console.log(
        `[TDX] TRA-East: ${wlSliceFiltered.length} WL stations (樹林→八堵) + ` +
        `${combined.length - wlSliceFiltered.length} EL stations = ${combined.length} total`
      );
    } else {
      console.warn("[TDX] TRA-East: could not build station list from TDX — will use hand-coded stations");
    }
  }

  // TRA-Coast: WL-C 18 站 (竹南→彰化, in sequence order)。WL-C 形狀只覆蓋
  // 竹南→追分,彰化由 成追線 CZ 接入。CZ 在 stitch 時會被當作 closed detour
  // 移除,因此將彰化從站表過濾掉,海線在我們的模型中以追分為終點。
  {
    const wlc = tdxStationsByLineId["WL-C"] || [];
    if (wlc.length >= 2) {
      tdxStationsByInternalId["TRA-Coast"] = wlc
        .filter(s => !isRoutingNode(s.name) && s.name !== "彰化")
        .map(s => ({ name: s.name, lat: s.lat, lng: s.lng }));
      console.log(`[TDX] TRA-Coast: ${tdxStationsByInternalId["TRA-Coast"].length} stations from TDX (WL-C 海岸線, 彰化過濾)`);
    } else {
      console.warn("[TDX] TRA-Coast: WL-C not found in StationOfLine — will use hand-coded stations");
    }
  }

  // TRA-South-Link: SL slice by anchors 枋寮→台東
  {
    const sl = tdxStationsByLineId["SL"] || [];
    const slFrom = { lat: 22.3672, lng: 120.5961 }; // 枋寮
    const slTo   = { lat: 22.7930, lng: 121.1243 }; // 台東
    if (sl.length >= 2) {
      const iFrom = closestIdx(sl, slFrom);
      const iTo   = closestIdx(sl, slTo);
      let slSlice;
      if (iFrom <= iTo) {
        slSlice = sl.slice(iFrom, iTo + 1);
      } else {
        slSlice = sl.slice(iTo, iFrom + 1).reverse();
      }
      tdxStationsByInternalId["TRA-South-Link"] = slSlice
        .filter(s => !isRoutingNode(s.name))
        .map(s => ({ name: s.name, lat: s.lat, lng: s.lng }));
      console.log(`[TDX] TRA-South-Link: ${tdxStationsByInternalId["TRA-South-Link"].length} stations from TDX`);
    } else {
      console.warn("[TDX] TRA-South-Link: SL not found in StationOfLine — will use hand-coded stations");
    }
  }
  // ──────────────────────────────────────────────────────────────────────────

  console.log("[TDX] Fetching THSR shapes…");
  // THSR Shape lives only on v2 — v3 returns 404.
  const thsrData = await tdxFetch(token, "/Rail/THSR/Shape?$format=JSON", { version: "v2" });
  const thsrShapes = thsrData.Shapes || thsrData;

  const out = {};

  // TRA: stitch sub-lines per internal id
  for (const [internalId, entries] of Object.entries(TDX_LINE_MAP)) {
    const polys = [];
    for (const entry of entries) {
      const lid = typeof entry === "string" ? entry : entry.lineId;
      const wkt = traShapes[lid];
      if (!wkt) {
        console.warn(`[TDX] TRA LineID ${lid} not found, skipping`);
        continue;
      }
      const parsed = parseWkt(wkt);
      if (typeof entry === "string") {
        polys.push(...parsed);
      } else {
        // Sub-segment per anchor pair — find the longest parsed segment that
        // hits both anchors (in practice TRA shapes are a single LINESTRING).
        for (const seg of parsed) {
          const sliced = sliceByAnchors(seg, entry.from, entry.to);
          if (sliced.length >= 2) polys.push(sliced);
        }
      }
    }
    if (polys.length === 0) continue;
    const stitched = stitchPolylines(polys);
    const repaired = removeLargeClosedDetours(stitched);
    out[internalId] = repaired.shape;
    if (repaired.removed.length > 0) {
      const detail = repaired.removed
        .map(r => `${r.km.toFixed(1)}km`)
        .join(", ");
      console.log(
        `[TDX] ${internalId}: removed ${repaired.removed.length} stitched closed detour(s): ${detail}`
      );
    }
    console.log(`[TDX] ${internalId}: ${out[internalId].length} raw points`);
  }

  // THSR: assume single LineString; concatenate any sub-shapes if present.
  if (thsrShapes && thsrShapes.length) {
    const polys = thsrShapes.flatMap(s => parseWkt(s.Geometry));
    out["THSR"] = stitchPolylines(polys);
    console.log(`[TDX] THSR: ${out["THSR"].length} raw points`);
  }

  return out;
}

// ---------------------------------------------------------------------------
// OSM Overpass (Japan)
// ---------------------------------------------------------------------------

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

async function overpassQuery(query) {
  let lastErr;
  for (const url of OVERPASS_ENDPOINTS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "user-agent": "railway-elf-shape-fetcher/1.0 (build-time tool)",
            accept: "application/json",
          },
          body: "data=" + encodeURIComponent(query),
        });
        if (res.ok) return res.json();
        lastErr = new Error(`${url} → ${res.status}`);
        console.warn(`[OSM]   ${url} attempt ${attempt}: ${res.status}`);
        if (res.status === 429 || res.status >= 500) {
          await new Promise(r => setTimeout(r, 3000 * attempt));
          continue;
        }
        break; // non-retryable for this endpoint
      } catch (e) {
        lastErr = e;
        console.warn(`[OSM]   ${url} attempt ${attempt}: ${e.message}`);
        await new Promise(r => setTimeout(r, 2000 * attempt));
      }
    }
  }
  throw lastErr || new Error("All Overpass endpoints failed");
}

async function fetchOsmShape(internalId, cfg, stations) {
  const relClause = cfg.relationIds.map(id => `relation(${id});`).join("");
  // `>>` (recurse-down full) drills through route_master → sub-routes → ways → nodes
  // in one step. Single-route relations behave the same as with `>`.
  const query = `[out:json][timeout:180];(${relClause});out body;>>;out skel qt;`;
  console.log(`[OSM] ${internalId} (${cfg.name}) — querying…`);
  const cacheKey = `osm:${internalId}:${cfg.relationIds.sort().join(",")}`;
  const json = await fetchJsonCached(
    cacheKey, `OSM ${internalId}`,
    () => overpassQuery(query),
    { attempts: 1 }, // overpassQuery already loops 4 endpoints × 2 retries
  );

  const nodes = new Map();
  const ways = new Map();
  const relations = [];
  for (const el of json.elements) {
    if (el.type === "node") nodes.set(el.id, { lat: el.lat, lng: el.lon });
    else if (el.type === "way") ways.set(el.id, el.nodes);
    else if (el.type === "relation") relations.push(el);
  }

  if (cfg.stationStops && stations && stations.length > 0) {
    const { reverse = false, offset = 0 } = cfg.stationStops;
    const relationIds = new Set(cfg.relationIds.map(Number));
    let stopMembers = [];
    for (const rel of relations) {
      if (!relationIds.has(Number(rel.id))) continue;
      const members = rel.members
        .filter(m => m.type === "node" && /stop|station|platform/.test(m.role || ""))
        .map(m => nodes.get(m.ref))
        .filter(Boolean);
      if (members.length > stopMembers.length) stopMembers = members;
    }
    if (reverse) stopMembers = stopMembers.slice().reverse();
    const stationCoords = {};
    for (let i = 0; i < stations.length; i++) {
      const stop = stopMembers[i + offset];
      if (!stop) continue;
      stationCoords[stations[i].name] = [
        Number(stop.lat.toFixed(6)),
        Number(stop.lng.toFixed(6)),
      ];
    }
    if (Object.keys(stationCoords).length > 0) {
      osmStationCoordsByLineId[internalId] = stationCoords;
      console.log(
        `[OSM] ${internalId}: mapped ${Object.keys(stationCoords).length}/${stations.length} station coords from relation stops`
      );
    }
  }

  // Deduplicate ways by ID across relations. Overpass `out body;>>;` echoes the
  // queried relation back in the recurse output, so a route relation often
  // appears twice — without dedup, every way member gets pushed into polys
  // twice and parallelWay dedupe must clean it up later (sometimes too
  // aggressively, dropping unique track segments).
  const seenWayIds = new Set();
  const polys = [];
  for (const rel of relations) {
    for (const m of rel.members) {
      if (m.type !== "way") continue;
      if (m.role === "platform" || m.role === "stop") continue;
      if (seenWayIds.has(m.ref)) continue;
      const wayNodes = ways.get(m.ref);
      if (!wayNodes) continue;
      const coords = wayNodes.map(nid => nodes.get(nid)).filter(Boolean);
      if (coords.length >= 2) {
        polys.push(coords);
        seenWayIds.add(m.ref);
      }
    }
  }

  let stitched;
  if (cfg.corridor && stations && stations.length >= 2) {
    // Centerline reconstruction — bypasses connectivity-based stitching entirely.
    const { shape, vertexStats } = reconstructCorridorShape(polys, stations, cfg.corridor);
    console.log(
      `[OSM] ${internalId}: ${polys.length} ways → ` +
      `${vertexStats.kept}/${vertexStats.total} vertices in corridor → ${shape.length} centerline points`
    );
    stitched = shape;
  } else {
    // Spatial dedupe: when an OSM route relation includes both up/down tracks
    // (or main + siding), parallel ways collapse into one geometric line.
    const processed = dedupeParallelWays(polys, 0.04);
    if (processed.length !== polys.length) {
      console.log(`[OSM] ${internalId}: ${polys.length} ways → ${processed.length} after parallel dedupe`);
    }
    console.log(`[OSM] ${internalId}: ${processed.length} ways, stitching…`);
    stitched = stitchPolylines(processed);
  }
  if (cfg.loopAnchor) {
    stitched = rotateLoopToAnchor(stitched, cfg.loopAnchor);
  }
  return stitched;
}

// For closed-loop lines (e.g. Yamanote), greedy stitch produces a polyline
// that starts wherever way[0] sat — typically not at the line's anchor
// station. Rotate it so the loop starts at the nearest vertex to `anchor`.
// We always rotate cyclically (treating the chain as a loop) when loopAnchor
// is set: even when the stitched endpoints don't exactly close (>100 m gap
// from missing junction ways), cyclic rotation preserves all vertices and
// keeps the anchor at km 0.
function rotateLoopToAnchor(poly, anchor) {
  if (poly.length < 3) return poly;
  let bestIdx = 0, bestDist = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const d = haversine(poly[i], anchor);
    if (d < bestDist) { bestDist = d; bestIdx = i; }
  }
  if (bestIdx === 0) return poly;
  const isLoop = haversine(poly[0], poly[poly.length - 1]) < 0.1;
  const open = isLoop ? poly.slice(0, -1) : poly;
  const rotated = open.slice(bestIdx).concat(open.slice(0, bestIdx));
  if (isLoop) rotated.push(rotated[0]); // re-close
  return rotated;
}

// Station-chain centerline reconstruction. For noisy OSM relations (Tokaido)
// where the relation contains bidirectional tracks + sidings + depots and
// no clean upstream relation exists, ignore connectivity and rebuild a single
// polyline:
//   1. Project every way vertex onto the station chain → (km, dist).
//   2. Drop vertices farther than corridorKm from the chain (depot/branch removal).
//   3. Bucket surviving vertices by km bin (sampleKm).
//   4. Emit one polyline point per bin = centroid of all vertices in the bin.
// Adjacent up/down tracks within the corridor average to a single mid-line,
// so the result follows the real corridor shape with length ≈ chain length.
function reconstructCorridorShape(polys, stations, opts) {
  const { corridorKm = 0.7, sampleKm = 0.1 } = opts;
  const chain = stations.map(s => ({ lat: s.lat, lng: s.lng }));
  const chainKm = cumulativeKm(chain);

  function projectOnChain(point) {
    let best = { km: 0, dist: Infinity };
    for (let i = 0; i < chain.length - 1; i++) {
      const p = projectOnSegment(point, chain[i], chain[i + 1]);
      if (p.dist < best.dist) {
        best = {
          km: chainKm[i] + p.t * (chainKm[i + 1] - chainKm[i]),
          dist: p.dist,
        };
      }
    }
    return best;
  }

  const buckets = new Map();
  let kept = 0, total = 0;
  for (const poly of polys) {
    for (const v of poly) {
      total++;
      const proj = projectOnChain(v);
      if (proj.dist > corridorKm) continue;
      kept++;
      const bin = Math.floor(proj.km / sampleKm);
      let arr = buckets.get(bin);
      if (!arr) { arr = []; buckets.set(bin, arr); }
      arr.push({ lat: v.lat, lng: v.lng });
    }
  }

  const out = [];
  const sortedBins = [...buckets.keys()].sort((a, b) => a - b);
  for (const bin of sortedBins) {
    const arr = buckets.get(bin);
    let sLat = 0, sLng = 0;
    for (const v of arr) { sLat += v.lat; sLng += v.lng; }
    out.push({ lat: sLat / arr.length, lng: sLng / arr.length });
  }
  return { shape: out, vertexStats: { kept, total } };
}

function dedupeParallelWays(polys, parallelKm) {
  const buckets = new Map(); // "iLat,iLng" → [polyIdx]
  const cell = 0.001; // ~110 m
  function cellKey(p) { return Math.round(p.lat / cell) + "," + Math.round(p.lng / cell); }
  function nearby(p) {
    const iLat = Math.round(p.lat / cell), iLng = Math.round(p.lng / cell);
    const out = [];
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const arr = buckets.get((iLat + dx) + "," + (iLng + dy));
      if (arr) out.push(...arr);
    }
    return out;
  }
  function distPointToPolyline(p, poly) {
    let m = Infinity;
    for (const q of poly) {
      const d = haversine(p, q);
      if (d < m) m = d;
      if (m < 0.001) return m;
    }
    return m;
  }
  const keep = [];
  for (let i = 0; i < polys.length; i++) {
    const a = polys[i];
    const reps = [a[0], a[Math.floor(a.length / 2)], a[a.length - 1]];
    let dup = false;
    const candidates = new Set(reps.flatMap(r => nearby(r)));
    for (const j of candidates) {
      const b = polys[j];
      if (Math.abs(a.length - b.length) > Math.max(a.length, b.length) * 0.7) continue;
      if (reps.every(r => distPointToPolyline(r, b) < parallelKm)) { dup = true; break; }
    }
    if (dup) continue;
    keep.push(i);
    for (const r of reps) {
      const k = cellKey(r);
      let arr = buckets.get(k);
      if (!arr) { arr = []; buckets.set(k, arr); }
      arr.push(i);
    }
  }
  return keep.map(i => polys[i]);
}

async function fetchOsmShapes(stationsByLineId) {
  const out = {};
  for (const [id, cfg] of Object.entries(OSM_LINE_MAP)) {
    if (ONLY_LINES.size && !ONLY_LINES.has(id)) continue;
    try {
      out[id] = await fetchOsmShape(id, cfg, stationsByLineId[id]);
    } catch (e) {
      console.warn(`[OSM] ${id} failed: ${e.message}`);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

// Read existing RAIL_DATA from src/rail-data.js by extracting its export
// literal and Function-evaluating it. This lets us re-project station coords
// without manually mirroring the data here.
function loadStationsFromRailData() {
  const src = readFileSync(resolve(ROOT, "src/rail-data.js"), "utf8");
  // Extract just the RAIL_DATA literal: export const RAIL_DATA = { ... };
  const m = src.match(/export\s+const\s+RAIL_DATA\s*=\s*(\{[\s\S]*?\n\});/);
  if (!m) throw new Error("Could not locate `export const RAIL_DATA` in rail-data.js");
  // eslint-disable-next-line no-new-func
  const RAIL_DATA = new Function(`return (${m[1]});`)();
  const stationsByLineId = {};
  for (const region of Object.values(RAIL_DATA)) {
    for (const line of region.lines) stationsByLineId[line.id] = line.stations;
  }
  return stationsByLineId;
}

function buildOutput(rawShapes, stationsByLineId) {
  const result = {};
  for (const [lineId, rawShape] of Object.entries(rawShapes)) {
    if (!rawShape || rawShape.length < 2) continue;
    let simplified = simplify(rawShape, SIMPLIFY_TOLERANCE_KM);
    let shapeKm = cumulativeKm(simplified);

    // For in-scope lines, use the TDX-derived full station list; otherwise use
    // the hand-coded list from rail-data.js (used for direction probe + stuck anchors).
    const isInScope = TDX_FULL_STATION_LINES.has(lineId);
    const tdxStations = isInScope ? (tdxStationsByInternalId[lineId] || null) : null;
    // stations used for direction probe and stuck-prefix/suffix anchoring
    const cfg = { ...(LINE_OUTPUT_OPTIONS[lineId] || {}), ...(OSM_LINE_MAP[lineId] || {}) };
    const stations = tdxStations || stationsByLineId[lineId] || [];
    const stopStationCoords = osmStationCoordsByLineId[lineId] || null;
    const projectionStations = stopStationCoords
      ? stations.map(s => {
          const coord = stopStationCoords[s.name];
          return coord ? { ...s, lat: coord[0], lng: coord[1] } : s;
        })
      : stations;

    // Polyline direction may not match the station order in rail-data.js
    // (e.g. TDX returns the West Trunk parameterised 桃園→Keelung while
    // stations are listed Keelung→Kaohsiung; OSM Yamanote loop greedy-stitches
    // counter-clockwise while stations go clockwise). Reverse the polyline if
    // the second station projects farther along it than the second-to-last
    // (works for both linear and loop lines).
    if (projectionStations.length >= 4) {
      const probeA = stationKmOnShape(projectionStations[1], simplified, shapeKm).km;
      const probeB = stationKmOnShape(projectionStations[projectionStations.length - 2], simplified, shapeKm).km;
      if (probeA > probeB) {
        simplified = simplified.slice().reverse();
        shapeKm = cumulativeKm(simplified);
      }
    } else if (projectionStations.length >= 2) {
      const first = stationKmOnShape(projectionStations[0], simplified, shapeKm).km;
      const last = stationKmOnShape(projectionStations[projectionStations.length - 1], simplified, shapeKm).km;
      if (first > last) {
        simplified = simplified.slice().reverse();
        shapeKm = cumulativeKm(simplified);
      }
    }

    // Leading/trailing stations that are far from the polyline endpoints can
    // happen on branch lines whose upstream geometry starts at the branch
    // divergence rather than the junction station (e.g. TDX 內灣線 begins at
    // 北新竹 not 新竹; 沙崙線 begins south of 中洲). Such stations all clamp
    // to km=0 (or km=totalKm), which breaks the merge's monotonicity check.
    // Prepend/append their coordinates so each gets its own anchor.
    // For in-scope lines the full TDX list is used so anchoring covers all stations.
    const STUCK_DIST_KM = 0.5;
    {
      const stuckPrefix = [];
      for (let i = 0; i < projectionStations.length; i++) {
        const probe = stationKmOnShape(projectionStations[i], simplified, shapeKm);
        if (probe.km < 1e-6 && probe.dist > STUCK_DIST_KM) stuckPrefix.push(projectionStations[i]);
        else break;
      }
      if (stuckPrefix.length) {
        simplified = [...stuckPrefix.map(s => ({ lat: s.lat, lng: s.lng })), ...simplified];
        shapeKm = cumulativeKm(simplified);
      }
    }
    {
      const stuckSuffix = [];
      const totalK = shapeKm[shapeKm.length - 1];
      for (let i = projectionStations.length - 1; i >= 0; i--) {
        const probe = stationKmOnShape(projectionStations[i], simplified, shapeKm);
        if (probe.km > totalK - 1e-6 && probe.dist > STUCK_DIST_KM) stuckSuffix.unshift(projectionStations[i]);
        else break;
      }
      if (stuckSuffix.length) {
        simplified = [...simplified, ...stuckSuffix.map(s => ({ lat: s.lat, lng: s.lng }))];
        shapeKm = cumulativeKm(simplified);
      }
    }

    const orderStationKms = cfg.orderStationKms === true;
    const snapStationCoordsOverKm = cfg.snapStationCoordsOverKm ?? Infinity;
    const stationKms = {};
    const stationCoords = { ...(stopStationCoords || {}) };
    let maxStationDist = 0;
    let snappedStationCount = 0;
    const stopStationCount = stopStationCoords ? Object.keys(stopStationCoords).length : 0;
    let minStationKm = -Infinity;
    const totalKm = shapeKm[shapeKm.length - 1];
    const isLoopLine = projectionStations.length >= 3 && projectionStations[0].name === projectionStations[projectionStations.length - 1].name;
    for (let i = 0; i < projectionStations.length; i++) {
      const st = projectionStations[i];
      const isLoopStart = isLoopLine && i === 0;
      const isLoopEnd = isLoopLine && i === projectionStations.length - 1;
      const overrideKm = cfg.stationKmOverrides?.[st.name];
      let km;
      let dist;
      if (overrideKm != null) {
        km = overrideKm;
        dist = haversine(st, positionOnShapeAtKm(simplified, shapeKm, km));
      } else if (orderStationKms && isLoopStart) {
        km = 0;
        dist = haversine(st, simplified[0]);
      } else if (orderStationKms && isLoopEnd) {
        km = totalKm;
        dist = haversine(st, simplified[simplified.length - 1]);
      } else {
        const projected = stationKmOnShape(
          st,
          simplified,
          shapeKm,
          orderStationKms ? minStationKm : -Infinity,
        );
        km = projected.km;
        dist = projected.dist;
      }
      stationKms[st.name] = Number(km.toFixed(3));
      if (!stationCoords[st.name] && dist > snapStationCoordsOverKm) {
        const p = positionOnShapeAtKm(simplified, shapeKm, km);
        stationCoords[st.name] = [Number(p.lat.toFixed(6)), Number(p.lng.toFixed(6))];
        snappedStationCount++;
      }
      if (dist > maxStationDist) maxStationDist = dist;
      if (orderStationKms) minStationKm = km + 0.001;
    }

    const entry = {
      shape: simplified.map(p => [Number(p.lat.toFixed(6)), Number(p.lng.toFixed(6))]),
      totalKm: Number(shapeKm[shapeKm.length - 1].toFixed(3)),
      stationKms,
    };
    if (Object.keys(stationCoords).length > 0) entry.stationCoords = stationCoords;

    // For in-scope lines, also emit the full projected station list so that
    // mergeShapes() in rail-data.js can replace the hand-coded stub array.
    if (isInScope && tdxStations && tdxStations.length > 0) {
      entry.stations = tdxStations.map(s => {
        const { km, dist } = stationKmOnShape(s, simplified, shapeKm);
        if (dist > maxStationDist) maxStationDist = dist;
        return {
          name: s.name,
          lat:  Number(s.lat.toFixed(6)),
          lng:  Number(s.lng.toFixed(6)),
          km:   Number(km.toFixed(3)),
        };
      });
    }

    result[lineId] = entry;
    console.log(
      `[OUT] ${lineId}: ${rawShape.length} → ${simplified.length} pts, ` +
      `total ${entry.totalKm} km, max station offset ${(maxStationDist * 1000).toFixed(0)} m` +
      (stopStationCount > 0 ? `, ${stopStationCount} stop coords` : "") +
      (snappedStationCount > 0 ? `, snapped ${snappedStationCount} station coords` : "") +
      (entry.stations ? `, ${entry.stations.length} TDX stations` : "")
    );
  }
  return result;
}

function loadExistingGeneratedShapes() {
  if (!existsSync(OUT_PATH)) return {};
  const src = readFileSync(OUT_PATH, "utf8");
  const m = src.match(/export\s+const\s+RAIL_SHAPES\s*=\s*(\{[\s\S]*\});?\s*$/);
  if (!m) return {};
  try {
    return JSON.parse(m[1]);
  } catch {
    return {};
  }
}

function emit(result) {
  const header =
    "// AUTO-GENERATED by scripts/fetch-rail-shapes.mjs — do not edit by hand.\n" +
    `// Generated ${new Date().toISOString()}\n`;
  const body = PRETTY
    ? JSON.stringify(result, null, 2)
    : JSON.stringify(result);
  writeFileSync(OUT_PATH, `${header}export const RAIL_SHAPES = ${body};\n`, "utf8");
  console.log(`[OUT] wrote ${OUT_PATH}`);
}

async function main() {
  const stationsByLineId = loadStationsFromRailData();

  let rawShapes = {};
  if (!SKIP_TW) {
    try { Object.assign(rawShapes, await fetchTdxShapes()); }
    catch (e) { console.error(`[TDX] failed: ${e.message}`); }
  }
  if (!SKIP_JP) {
    try { Object.assign(rawShapes, await fetchOsmShapes(stationsByLineId)); }
    catch (e) { console.error(`[OSM] failed: ${e.message}`); }
  }

  if (Object.keys(rawShapes).length === 0) {
    console.error("No shapes fetched. Aborting.");
    process.exit(1);
  }

  const result = buildOutput(rawShapes, stationsByLineId);
  emit(ONLY_LINES.size ? { ...loadExistingGeneratedShapes(), ...result } : result);
  logProvenanceSummary();
}

main().catch(e => { console.error(e); process.exit(1); });
