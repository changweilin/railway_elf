// Verifies the kinematic train schedule produced by TrainGen.generate.
// Run: npm run check:timing
//
// Asserts per train:
//   - endTime - startTime is within [theoretical lower bound, +25%]
//   - arrival ≤ departure ≤ next arrival, strictly
//   - departure - arrival === stop.dwellSec (within 1 ms)
//   - no NaN / Invalid Date
//   - segment kmAtTime / timeAtKm round-trip error < 1 m at midpoint
//
// Then prints one full sample timetable per representative train type.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import vm from "node:vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Bootstrap: the browser scripts assume `window` is the global, so they read
// `RAIL_DATA` (without `window.` prefix) inside helpers. Make the vm sandbox
// be its own window so `window.X = ...` and bare `X` resolve to the same slot.
const sandbox = { console };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

const generated = readFileSync(resolve(ROOT, "public/assets/rail-data.generated.js"), "utf8");
const railData = readFileSync(resolve(ROOT, "public/assets/rail-data.js"), "utf8");
vm.runInContext(generated, sandbox);
vm.runInContext(railData, sandbox);

const { RAIL_DATA, RailUtil, TrainGen } = sandbox;

if (!RAIL_DATA || !RailUtil || !TrainGen) {
  console.error("Bootstrap failed — RAIL_DATA / RailUtil / TrainGen not on window");
  process.exit(1);
}

// ---------------------------------------------------------------------------

let failures = 0;
const fail = (msg) => { failures++; console.error("  FAIL: " + msg); };

function checkTrain(train, regionKey) {
  const { stops, segments, startTime, endTime, line, type, number, speed } = train;
  const tag = `${regionKey}/${line.id}/${type}#${number}/${train.direction}`;

  // 1. No NaN / Invalid Date
  if (Number.isNaN(startTime?.getTime?.()) || Number.isNaN(endTime?.getTime?.())) {
    fail(`${tag}: invalid startTime/endTime`);
    return;
  }

  // 2. Monotonic arrivals/departures and dwell precision
  let totalDwellSec = 0;
  for (let i = 0; i < stops.length; i++) {
    const s = stops[i];
    if (s.arrival.getTime() > s.departure.getTime()) {
      fail(`${tag} stop[${i}] ${s.name}: arrival > departure`);
    }
    const measuredDwell = (s.departure.getTime() - s.arrival.getTime()) / 1000;
    if (Math.abs(measuredDwell - s.dwellSec) > 0.001) {
      fail(`${tag} stop[${i}] ${s.name}: dwell mismatch (${measuredDwell}s vs ${s.dwellSec}s)`);
    }
    totalDwellSec += s.dwellSec;
    if (i > 0) {
      const prev = stops[i-1];
      if (s.arrival.getTime() < prev.departure.getTime()) {
        fail(`${tag} stop[${i}] ${s.name}: arrival before previous departure`);
      }
    }
  }

  // 3. Trip duration bounds. Lower bound = constant-speed transit + dwells.
  // Upper bound = lower + 25% kinematic overhead allowance.
  const totalKmCanonical = Math.abs(
    stops[stops.length - 1].km - stops[0].km
  );
  const lowerSec = (totalKmCanonical / speed) * 3600 + totalDwellSec;
  const upperSec = lowerSec * 1.25 + 60; // tolerate +60s slack for tiny lines
  const actualSec = (endTime.getTime() - startTime.getTime()) / 1000;
  if (actualSec < lowerSec - 1) {
    fail(`${tag}: trip ${actualSec.toFixed(1)}s < theoretical floor ${lowerSec.toFixed(1)}s`);
  }
  if (actualSec > upperSec) {
    fail(`${tag}: trip ${actualSec.toFixed(1)}s > tolerated ceiling ${upperSec.toFixed(1)}s (lower ${lowerSec.toFixed(1)})`);
  }

  // 4. Segment count consistency
  if (segments.length !== stops.length - 1) {
    fail(`${tag}: ${segments.length} segments for ${stops.length} stops`);
  }

  // 5. Round-trip kmAtTime / timeAtKm at segment midpoint
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const L = seg.kin.La + seg.kin.Lc + seg.kin.Ld;
    if (!(L > 0)) {
      fail(`${tag} seg[${i}]: zero-length segment`);
      continue;
    }
    const xMid = L / 2;
    const tau = RailUtil.timeAtKmInSegment(seg.kin, xMid);
    const xBack = RailUtil.kmAtTimeInSegment(seg.kin, tau);
    if (Math.abs(xBack - xMid) > 1) {
      fail(`${tag} seg[${i}]: round-trip error ${Math.abs(xBack-xMid).toFixed(3)} m`);
    }
    // Check tDepart/tArrive match kin.T
    const segDur = (seg.tArrive.getTime() - seg.tDepart.getTime()) / 1000;
    if (Math.abs(segDur - seg.kin.T) > 0.002) {
      fail(`${tag} seg[${i}]: tDepart→tArrive ${segDur}s vs kin.T ${seg.kin.T}s`);
    }
  }
}

// ---------------------------------------------------------------------------
// Run checks
// ---------------------------------------------------------------------------

const REF_DATE = new Date(2026, 4, 1, 0, 0, 0, 0); // 2026-05-01, deterministic
let totalTrains = 0;

for (const regionKey of Object.keys(RAIL_DATA)) {
  console.log(`\n=== Region: ${regionKey} ===`);
  const trains = TrainGen.generate(regionKey, REF_DATE);
  totalTrains += trains.length;
  console.log(`  Generated ${trains.length} trains`);
  for (const t of trains) checkTrain(t, regionKey);
}

console.log(`\nChecked ${totalTrains} trains; ${failures} failures.\n`);

// ---------------------------------------------------------------------------
// Sample timetables — one train per representative type
// ---------------------------------------------------------------------------

const SAMPLE_TYPES = [
  ["taiwan", "THSR", "高鐵"],
  ["taiwan", "TRA-West", "自強"],
  ["taiwan", "TRA-East", "區間"],
  ["japan", "JR-Yamanote", "山手線"],
  ["japan", "JR-Chuo", "快速"],
  ["japan", "Tokaido-Shinkansen", "のぞみ"],
];

const fmtClock = (d) =>
  String(d.getHours()).padStart(2, "0") + ":" +
  String(d.getMinutes()).padStart(2, "0") + ":" +
  String(d.getSeconds()).padStart(2, "0");

for (const [regionKey, lineId, type] of SAMPLE_TYPES) {
  const trains = TrainGen.generate(regionKey, REF_DATE);
  const sample = trains.find(t =>
    t.line.id === lineId && t.type === type && t.direction === "down"
  );
  if (!sample) {
    console.log(`(no sample for ${regionKey}/${lineId}/${type})`);
    continue;
  }
  const totalKm = Math.abs(
    sample.stops[sample.stops.length - 1].km - sample.stops[0].km
  );
  const tripMin = (sample.endTime - sample.startTime) / 60000;
  const baselineMin = (totalKm / sample.speed) * 60;
  console.log(
    `\n--- ${regionKey} ${sample.line.name} ${type} #${sample.number} ` +
    `(speed ${sample.speed} km/h, ${totalKm.toFixed(1)} km, ` +
    `trip ${tripMin.toFixed(1)} min vs constant-speed ${baselineMin.toFixed(1)} min) ---`
  );
  for (const s of sample.stops) {
    const dwellTag = s.dwellSec > 0 ? `  +${s.dwellSec}s` : "";
    console.log(
      `  ${fmtClock(s.arrival)}  ${fmtClock(s.departure)}${dwellTag.padEnd(8)}` +
      `  km ${s.km.toFixed(1).padStart(6)}  ${s.name}`
    );
  }
}

if (failures > 0) {
  console.error(`\n${failures} failures.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
