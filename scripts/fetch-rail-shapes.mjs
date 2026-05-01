// Fetch real railway line geometry from TDX (Taiwan) and OSM Overpass (Japan),
// simplify, re-project our hand-coded stations onto the real shape, and emit
// public/assets/rail-data.generated.js.
//
// Usage:
//   TDX_CLIENT_ID=xxx TDX_CLIENT_SECRET=yyy node scripts/fetch-rail-shapes.mjs
//
// Optional flags:
//   --skip-tw         Skip Taiwan (TDX). Useful when iterating on Japan-only.
//   --skip-jp         Skip Japan (OSM). Useful when iterating on Taiwan-only.
//   --pretty          Pretty-print the generated JS (default: minified-ish).
//   --no-cache        Disable disk cache read+write (always hit network, no fallback).
//   --refresh-cache   Bypass cache read but still update the cache on success.
//
// Env vars:
//   OFFLINE=1   Skip all network calls, serve everything from scripts/.cache/.
//               Useful for re-running the build step without internet.
//
// Output:
//   public/assets/rail-data.generated.js — sets window.RAIL_SHAPES = { [lineId]: { shape, stationKms } }
//
// Get a TDX account at https://tdx.transportdata.tw/ (free tier is fine).

import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_PATH = resolve(ROOT, "public/assets/rail-data.generated.js");
const CACHE_DIR = resolve(__dirname, ".cache");

const args = new Set(process.argv.slice(2));
const SKIP_TW = args.has("--skip-tw");
const SKIP_JP = args.has("--skip-jp");
const PRETTY = args.has("--pretty");
const NO_CACHE = args.has("--no-cache");
const REFRESH_CACHE = args.has("--refresh-cache");

// ---------------------------------------------------------------------------
// CONFIG: which internal line ids map to which upstream sources.
// Internal ids must match those in public/assets/rail-data.js.
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
const TDX_LINE_MAP = {
  "TRA-West": ["1001", "1002", "1004"],     // 基隆 → 高雄, stitched in order
  "TRA-East": ["1006", "1007", "1008"],     // 樹林/八堵 → 宜蘭 → 花蓮 → 台東
};

// OSM Overpass relations for Japanese lines.
// Overpass query: relation["route"="train"]["ref"="<ref>"] — verified manually.
// If a line spans multiple operating segments, list multiple refs and we'll stitch.
// Verified via Overpass name search 2026-04-30. Use single-direction "route"
// relations (not route_master) so that `>` recurse-down yields the way list directly.
const OSM_LINE_MAP = {
  "Tokaido-Shinkansen": { name: "Tōkaidō Shinkansen", relationIds: [5263977] },   // single-direction route
  "JR-Yamanote":        { name: "Yamanote Line (Outer)", relationIds: [1972920] }, // 外回り = clean loop
  "JR-Chuo":            { name: "Chūō Line Rapid (down)", relationIds: [10363876] }, // 下り (Tokyo→west)
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

// Project a station onto the polyline; returns the cumulative km of the closest point.
function stationKmOnShape(station, shape, shapeKm) {
  let bestDist = Infinity, bestKm = 0;
  for (let i = 0; i < shape.length - 1; i++) {
    const p = projectOnSegment(station, shape[i], shape[i + 1]);
    if (p.dist < bestDist) {
      bestDist = p.dist;
      bestKm = shapeKm[i] + p.t * (shapeKm[i + 1] - shapeKm[i]);
    }
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
function stitchPolylines(polylines) {
  if (polylines.length === 0) return [];
  const remaining = polylines.map(p => p.slice());
  let result = remaining.shift();
  while (remaining.length) {
    const tail = result[result.length - 1];
    let bestIdx = 0, bestDist = Infinity, bestReverse = false;
    for (let i = 0; i < remaining.length; i++) {
      const seg = remaining[i];
      const dHead = haversine(tail, seg[0]);
      const dTail = haversine(tail, seg[seg.length - 1]);
      if (dHead < bestDist) { bestDist = dHead; bestIdx = i; bestReverse = false; }
      if (dTail < bestDist) { bestDist = dTail; bestIdx = i; bestReverse = true; }
    }
    let next = remaining.splice(bestIdx, 1)[0];
    if (bestReverse) next.reverse();
    // Skip duplicate junction point
    if (haversine(tail, next[0]) < 0.001) next = next.slice(1);
    result = result.concat(next);
  }
  return result;
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

// Fetch JSON with retry + disk cache fallback. Cache is keyed on `cacheKey`.
// On network failure after all retries, returns the cached value if present.
// Pass `retryOpts: { attempts: 1 }` for fetchers that already do their own
// retry/fallback (avoids ballooning total attempts to N×M).
async function fetchJsonCached(cacheKey, label, fetcher, retryOpts) {
  if (process.env.OFFLINE === "1") {
    const cached = readCache(cacheKey);
    if (cached) {
      console.log(`[cache] ${label}: using cached (OFFLINE=1)`);
      return cached;
    }
    throw new Error(`OFFLINE=1 but no cache for ${label}`);
  }
  try {
    const fresh = await withRetry(label, fetcher, retryOpts);
    writeCache(cacheKey, fresh);
    return fresh;
  } catch (e) {
    const cached = readCache(cacheKey);
    if (cached) {
      console.warn(`[cache] ${label}: network failed (${e.message}) — using cached copy`);
      return cached;
    }
    throw e;
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

async function tdxFetch(token, path) {
  return fetchJsonCached(`tdx:${path}`, `TDX ${path}`, async () => {
    const url = `https://tdx.transportdata.tw/api/basic/v3${path}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
    });
    if (!res.ok) throw new Error(`TDX ${path} failed: ${res.status}`);
    return res.json();
  });
}

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

  console.log("[TDX] Fetching THSR shapes…");
  const thsrData = await tdxFetch(token, "/Rail/THSR/Shape?$format=JSON");
  const thsrShapes = thsrData.Shapes || thsrData;

  const out = {};

  // TRA: stitch sub-lines per internal id
  for (const [internalId, lineIds] of Object.entries(TDX_LINE_MAP)) {
    const polys = [];
    for (const lid of lineIds) {
      const wkt = traShapes[lid];
      if (!wkt) {
        console.warn(`[TDX] TRA LineID ${lid} not found, skipping`);
        continue;
      }
      polys.push(...parseWkt(wkt));
    }
    if (polys.length === 0) continue;
    out[internalId] = stitchPolylines(polys);
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

async function fetchOsmShape(internalId, cfg) {
  const relClause = cfg.relationIds.map(id => `relation(${id});`).join("");
  const query = `[out:json][timeout:180];(${relClause});out body;>;out skel qt;`;
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

  const polys = [];
  for (const rel of relations) {
    for (const m of rel.members) {
      if (m.type !== "way") continue;
      const wayNodes = ways.get(m.ref);
      if (!wayNodes) continue;
      const coords = wayNodes.map(nid => nodes.get(nid)).filter(Boolean);
      if (coords.length >= 2) polys.push(coords);
    }
  }
  console.log(`[OSM] ${internalId}: ${polys.length} ways, stitching…`);
  return stitchPolylines(polys);
}

async function fetchOsmShapes() {
  const out = {};
  for (const [id, cfg] of Object.entries(OSM_LINE_MAP)) {
    try {
      out[id] = await fetchOsmShape(id, cfg);
    } catch (e) {
      console.warn(`[OSM] ${id} failed: ${e.message}`);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

// Read existing RAIL_DATA from rail-data.js by Function-evaluating its window assignment.
// This lets us re-project station coords without manually mirroring the data here.
function loadStationsFromRailData() {
  const src = readFileSync(resolve(ROOT, "public/assets/rail-data.js"), "utf8");
  // Extract just the RAIL_DATA literal: window.RAIL_DATA = { ... };
  const m = src.match(/window\.RAIL_DATA\s*=\s*(\{[\s\S]*?\n\});/);
  if (!m) throw new Error("Could not locate window.RAIL_DATA in rail-data.js");
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
    const simplified = simplify(rawShape, SIMPLIFY_TOLERANCE_KM);
    const shapeKm = cumulativeKm(simplified);

    const stations = stationsByLineId[lineId] || [];
    const stationKms = {};
    let maxStationDist = 0;
    for (const st of stations) {
      const { km, dist } = stationKmOnShape(st, simplified, shapeKm);
      stationKms[st.name] = Number(km.toFixed(3));
      if (dist > maxStationDist) maxStationDist = dist;
    }

    result[lineId] = {
      shape: simplified.map(p => [Number(p.lat.toFixed(6)), Number(p.lng.toFixed(6))]),
      totalKm: Number(shapeKm[shapeKm.length - 1].toFixed(3)),
      stationKms,
    };
    console.log(
      `[OUT] ${lineId}: ${rawShape.length} → ${simplified.length} pts, ` +
      `total ${result[lineId].totalKm} km, max station offset ${(maxStationDist * 1000).toFixed(0)} m`
    );
  }
  return result;
}

function emit(result) {
  const header =
    "// AUTO-GENERATED by scripts/fetch-rail-shapes.mjs — do not edit by hand.\n" +
    `// Generated ${new Date().toISOString()}\n`;
  const body = PRETTY
    ? JSON.stringify(result, null, 2)
    : JSON.stringify(result);
  writeFileSync(OUT_PATH, `${header}window.RAIL_SHAPES = ${body};\n`, "utf8");
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
    try { Object.assign(rawShapes, await fetchOsmShapes()); }
    catch (e) { console.error(`[OSM] failed: ${e.message}`); }
  }

  if (Object.keys(rawShapes).length === 0) {
    console.error("No shapes fetched. Aborting.");
    process.exit(1);
  }

  const result = buildOutput(rawShapes, stationsByLineId);
  emit(result);
}

main().catch(e => { console.error(e); process.exit(1); });
