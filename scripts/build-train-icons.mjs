// Generates line-aware train marker PNGs and the contact sheet.
// Existing type-fallback PNGs are kept as-is; this script renders only the
// line override assets declared in src/train-icon-registry.js.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { TRAIN_ICON_REGISTRY } from "../src/train-icon-registry.js";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const PUBLIC = resolve(ROOT, "public");
const ICON_DIR = resolve(PUBLIC, "assets/train-icons");
const MAP_PATH = resolve(ICON_DIR, "train-icon-map.json");
const SHEET_PATH = resolve(ICON_DIR, "train-icons-contact-sheet.png");

const VISUALS = {
  "taiwan|TRA-Coast|區間快": { shape: "commuter", body: "#f8fafc", accent: "#38bdf8", accent2: "#2563eb", roof: "#e2e8f0" },

  "japan|Tokyo-Metro-Ginza|銀座線": { shape: "metro", body: "#f8fafc", accent: "#f59a0c", band: "#f59a0c" },
  "japan|Tokyo-Metro-Marunouchi|丸ノ内線": { shape: "metro", body: "#f8fafc", accent: "#f43f5e", band: "#f43f5e", motif: "wave" },
  "japan|JR-Keihin-Tohoku|各駅停車": { shape: "commuter", body: "#f8fafc", accent: "#60a5fa", accent2: "#38bdf8" },
  "japan|JR-Sobu-Local|各駅停車": { shape: "commuter", body: "#f8fafc", accent: "#fde047", accent2: "#facc15" },
  "japan|Tokyu-Toyoko|各停": { shape: "commuter", body: "#f8fafc", accent: "#c8102e", accent2: "#991b1b" },
  "japan|Tokyu-Toyoko|急行": { shape: "express", body: "#f8fafc", accent: "#f87171", accent2: "#c8102e" },
  "japan|Tokyu-Toyoko|特急": { shape: "express", body: "#f8fafc", accent: "#facc15", accent2: "#c8102e" },
  "japan|JR-Osaka-Loop|普通": { shape: "commuter", body: "#f8fafc", accent: "#f97316", accent2: "#ea580c" },
  "japan|JR-Osaka-Loop|大和路快速": { shape: "express", body: "#f8fafc", accent: "#fb923c", accent2: "#16a34a" },
  "japan|Osaka-Metro-Midosuji|御堂筋線": { shape: "metro", body: "#f8fafc", accent: "#dc2626", band: "#dc2626" },
  "japan|Hankyu-Kobe|普通": { shape: "classic", body: "#7c1d10", accent: "#f8e7c1", accent2: "#a16207", roof: "#5b140b" },
  "japan|Hankyu-Kobe|通勤特急": { shape: "classic", body: "#7c1d10", accent: "#facc15", accent2: "#a16207", roof: "#5b140b" },
  "japan|Hankyu-Kobe|特急": { shape: "classic", body: "#7c1d10", accent: "#fde047", accent2: "#facc15", roof: "#5b140b" },
  "japan|Sanyo-Shinkansen|みずほ": { shape: "shinkansen", body: "#f8fafc", accent: "#a78bfa", accent2: "#2563eb" },
  "japan|Sanyo-Shinkansen|さくら": { shape: "shinkansen", body: "#f8fafc", accent: "#f472b6", accent2: "#2563eb" },

  "korea|Seoul-Metro-1|급행": { shape: "commuter", body: "#f8fafc", accent: "#1d4ed8", accent2: "#0c4ca3" },
  "korea|Seoul-Metro-1|완행": { shape: "commuter", body: "#f8fafc", accent: "#0052a4", accent2: "#60a5fa" },
  "korea|Seoul-Metro-2|순환": { shape: "metro", body: "#f8fafc", accent: "#00a84d", band: "#00a84d" },
  "korea|Seoul-Metro-3|3호선": { shape: "metro", body: "#f8fafc", accent: "#ED6C00", band: "#ED6C00" },
  "korea|Seoul-Metro-4|4호선": { shape: "metro", body: "#f8fafc", accent: "#009BCE", band: "#009BCE" },
  "korea|Seoul-Metro-5|5호선": { shape: "metro", body: "#f8fafc", accent: "#996CAC", band: "#996CAC" },
  "korea|Seoul-Metro-6|6호선": { shape: "metro", body: "#f8fafc", accent: "#7C4932", band: "#7C4932" },
  "korea|Seoul-Metro-7|7호선": { shape: "metro", body: "#f8fafc", accent: "#747F00", band: "#747F00" },
  "korea|Seoul-Metro-8|8호선": { shape: "metro", body: "#f8fafc", accent: "#E6186C", band: "#E6186C" },
  "korea|Seoul-Metro-9|9호선": { shape: "metro", body: "#f8fafc", accent: "#BDB092", band: "#BDB092" },
  "korea|Shinbundang|신분당선": { shape: "metro", body: "#f8fafc", accent: "#B81B30", band: "#B81B30" },
  "korea|Suin-Bundang|수인분당선": { shape: "commuter", body: "#f8fafc", accent: "#ECA300", accent2: "#7a5a00" },
  "korea|Gyeongui-Jungang|경의중앙선": { shape: "commuter", body: "#f8fafc", accent: "#6AC2B3", accent2: "#0f766e" },
  "korea|Gyeongchun|경춘선": { shape: "commuter", body: "#f8fafc", accent: "#007A62", accent2: "#22c55e" },
  "korea|Gyeonggang|경강선": { shape: "commuter", body: "#f8fafc", accent: "#0B318F", accent2: "#60a5fa" },
  "korea|Seohae|서해선": { shape: "commuter", body: "#f8fafc", accent: "#5EAC41", accent2: "#2f7d32" },
  "korea|Incheon-Metro-1|1호선": { shape: "metro", body: "#f8fafc", accent: "#B4C7E7", band: "#B4C7E7" },
  "korea|Incheon-Metro-2|2호선": { shape: "metro", body: "#f8fafc", accent: "#F4A462", band: "#ED8000" },
  "korea|AREX|AREX": { shape: "express", body: "#f8fafc", accent: "#0079ac", accent2: "#f97316" },
  "korea|Gimpo-Goldline|골드라인": { shape: "metro", body: "#f8fafc", accent: "#ad8605", band: "#ad8605" },
  "korea|Daegu-Metro-1|1호선": { shape: "metro", body: "#f8fafc", accent: "#EF5E37", band: "#EF5E37" },
  "korea|Daegu-Metro-2|2호선": { shape: "metro", body: "#f8fafc", accent: "#33AA46", band: "#33AA46" },
  "korea|Daegu-Metro-3|3호선": { shape: "monorail", body: "#f8fafc", accent: "#FDA208", accent2: "#111827" },
  "korea|KTX-Gyeongbu|KTX": { shape: "shinkansen", body: "#f8fafc", accent: "#0c4ca3", accent2: "#dc2626" },
  "korea|KTX-Gyeongbu|KTX-산천": { shape: "shinkansen", body: "#f8fafc", accent: "#dc2626", accent2: "#0c4ca3" },
  "korea|KTX-Gangneung|KTX-이음": { shape: "shinkansen", body: "#f8fafc", accent: "#0f766e", accent2: "#38bdf8" },
  "korea|ITX-Cheongchun|ITX-청춘": { shape: "express", body: "#f8fafc", accent: "#2563eb", accent2: "#22c55e" },
  "korea|SRT-Gyeongbu|SRT": { shape: "shinkansen", body: "#f8fafc", accent: "#6f2da8", accent2: "#dc2626" },
  "korea|Busan-Metro-1|1호선": { shape: "metro", body: "#f8fafc", accent: "#f06a00", band: "#f06a00" },
  "korea|Busan-Metro-2|2호선": { shape: "metro", body: "#f8fafc", accent: "#81BF48", band: "#81BF48" },
  "korea|Busan-Metro-3|3호선": { shape: "metro", body: "#f8fafc", accent: "#BB8C00", band: "#BB8C00" },
  "korea|Busan-Metro-4|4호선": { shape: "metro", body: "#f8fafc", accent: "#217DCB", band: "#217DCB" },

  "hongkong|MTR-Tsuen-Wan|荃灣綫": { shape: "metro", body: "#f8fafc", accent: "#e2231a", band: "#e2231a" },
  "hongkong|MTR-Island|港島綫": { shape: "metro", body: "#f8fafc", accent: "#007dc5", band: "#007dc5" },
  "hongkong|MTR-East-Rail|東鐵綫": { shape: "commuter", body: "#f8fafc", accent: "#5eb7e8", accent2: "#007dc5" },
  "hongkong|MTR-Airport-Express|機場快綫": { shape: "express", body: "#eef2f7", accent: "#00888a", accent2: "#111827" },

  "china|Beijing-Shanghai-HSR|復興號": { shape: "shinkansen", body: "#f8fafc", accent: "#c80000", accent2: "#111827" },
  "china|Beijing-Shanghai-HSR|和諧號": { shape: "shinkansen", body: "#f8fafc", accent: "#fb923c", accent2: "#64748b" },
  "china|Beijing-Guangzhou-HSR|復興號": { shape: "shinkansen", body: "#f8fafc", accent: "#7e22ce", accent2: "#111827" },
  "china|Beijing-Guangzhou-HSR|和諧號": { shape: "shinkansen", body: "#f8fafc", accent: "#a855f7", accent2: "#64748b" },
  "china|Shanghai-Kunming-HSR|復興號": { shape: "shinkansen", body: "#f8fafc", accent: "#16a34a", accent2: "#111827" },
  "china|Shanghai-Kunming-HSR|和諧號": { shape: "shinkansen", body: "#f8fafc", accent: "#84cc16", accent2: "#64748b" },
  "china|Beijing-Subway-1|1號線": { shape: "metro", body: "#f8fafc", accent: "#c23a30", band: "#c23a30" },
  "china|Beijing-Subway-2|2號線": { shape: "metro", body: "#f8fafc", accent: "#066b46", band: "#066b46" },
  "china|Shanghai-Metro-1|1號線": { shape: "metro", body: "#f8fafc", accent: "#e4002b", band: "#e4002b" },
  "china|Shanghai-Metro-2|2號線": { shape: "metro", body: "#f8fafc", accent: "#84cc16", band: "#84cc16" },

  "singapore|SG-MRT-North-South|NSL": { shape: "metro", body: "#f8fafc", accent: "#d42e12", band: "#d42e12" },
  "singapore|SG-MRT-East-West|EWL": { shape: "metro", body: "#f8fafc", accent: "#009645", band: "#009645" },
  "singapore|SG-MRT-Circle|CCL": { shape: "metro", body: "#f8fafc", accent: "#ff9900", band: "#ff9900" },

  "malaysia|KL-Kelana-Jaya|LRT": { shape: "metro", body: "#f8fafc", accent: "#dc2626", band: "#dc2626" },
  "malaysia|KL-MRT-Kajang|MRT": { shape: "metro", body: "#f8fafc", accent: "#16a34a", band: "#16a34a" },

  "thailand|BKK-BTS-Sukhumvit|BTS": { shape: "metro", body: "#f8fafc", accent: "#16a34a", band: "#16a34a" },
  "thailand|BKK-MRT-Blue|MRT": { shape: "metro", body: "#f8fafc", accent: "#1d4ed8", band: "#1d4ed8" },
  "thailand|BKK-Airport-Rail|ARL": { shape: "express", body: "#f8fafc", accent: "#dc2626", accent2: "#7f1d1d" },

  "vietnam|HCMC-Metro-1|Metro 1": { shape: "metro", body: "#f8fafc", accent: "#dc2626", band: "#dc2626" },
  "vietnam|Hanoi-Metro-2A|Metro 2A": { shape: "metro", body: "#f8fafc", accent: "#16a34a", band: "#16a34a" },
};

const outline = "#1f2937";
const glass = "#111827";
const windowFill = "#475569";
const roofFill = "#cbd5e1";

function svgShell(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">${content}</svg>`;
}

function windowStack(x, y, h, fill = windowFill) {
  return `<rect x="${x}" y="${y}" width="24" height="${h}" rx="7" fill="${fill}" opacity="0.9"/>
  <path d="M${x + 4} ${y + 22}H${x + 20}M${x + 4} ${y + 52}H${x + 20}M${x + 4} ${y + 82}H${x + 20}" stroke="#e2e8f0" stroke-width="2" opacity="0.55"/>`;
}

function sideStripes(accent, accent2, y1 = 78, y2 = 210) {
  return `<path d="M98 ${y1}V${y2}" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
  <path d="M158 ${y1}V${y2}" stroke="${accent2 || accent}" stroke-width="6" stroke-linecap="round"/>`;
}

function shinkansen(v) {
  const accent2 = v.accent2 || v.accent;
  return svgShell(`
    <path d="M128 18C145 38 156 57 162 86L172 216L151 239H105L84 216L94 86C100 57 111 38 128 18Z" fill="${v.body}" stroke="${outline}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M116 40L128 25L140 40L139 59H117Z" fill="${v.accent}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="111" y="62" width="34" height="20" rx="7" fill="${glass}"/>
    <rect x="107" y="92" width="42" height="105" rx="17" fill="${windowFill}" opacity="0.9"/>
    ${sideStripes(v.accent, accent2, 96, 204)}
    <path d="M101 219H155" stroke="${v.accent}" stroke-width="8" stroke-linecap="round"/>
    <path d="M100 75C111 84 145 84 156 75" fill="none" stroke="${accent2}" stroke-width="5" stroke-linecap="round"/>
  `);
}

function express(v) {
  const accent2 = v.accent2 || v.accent;
  return svgShell(`
    <path d="M128 24C146 45 157 74 160 106L166 218L151 237H105L90 218L96 106C99 74 110 45 128 24Z" fill="${v.body}" stroke="${outline}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M116 45L128 31L140 45L139 62H117Z" fill="${v.accent}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="110" y="70" width="36" height="22" rx="8" fill="${glass}"/>
    <rect x="108" y="106" width="40" height="96" rx="15" fill="${windowFill}" opacity="0.9"/>
    ${sideStripes(v.accent, accent2, 108, 208)}
    <path d="M101 219H155" stroke="${accent2}" stroke-width="7" stroke-linecap="round"/>
    <path d="M99 98H157" stroke="${v.accent}" stroke-width="5" stroke-linecap="round"/>
  `);
}

function commuter(v) {
  const accent2 = v.accent2 || v.accent;
  return svgShell(`
    <rect x="88" y="28" width="80" height="204" rx="14" fill="${v.body}" stroke="${outline}" stroke-width="5"/>
    <rect x="101" y="42" width="54" height="31" rx="9" fill="${glass}"/>
    <path d="M116 62L128 46L140 62Z" fill="${v.accent}"/>
    <rect x="106" y="88" width="44" height="112" rx="12" fill="${windowFill}" opacity="0.88"/>
    <path d="M99 84H157" stroke="${accent2}" stroke-width="6" stroke-linecap="round"/>
    ${sideStripes(v.accent, accent2, 101, 203)}
    <path d="M101 217H155" stroke="${v.accent}" stroke-width="7" stroke-linecap="round"/>
  `);
}

function metro(v) {
  return svgShell(`
    <rect x="88" y="34" width="80" height="188" rx="16" fill="${v.body}" stroke="${outline}" stroke-width="5"/>
    <rect x="101" y="48" width="54" height="30" rx="9" fill="${glass}"/>
    <path d="M116 67L128 51L140 67Z" fill="${v.accent}"/>
    <rect x="107" y="98" width="42" height="91" rx="12" fill="${windowFill}" opacity="0.88"/>
    <path d="M96 89H160" stroke="${v.band || v.accent}" stroke-width="8" stroke-linecap="round"/>
    ${v.motif === "wave" ? `<path d="M102 205C116 190 140 190 154 205" fill="none" stroke="${v.accent}" stroke-width="6" stroke-linecap="round"/>` : ""}
    <path d="M100 204H156" stroke="${v.accent}" stroke-width="7" stroke-linecap="round"/>
    <path d="M98 105V184M158 105V184" stroke="${v.accent}" stroke-width="5" stroke-linecap="round"/>
  `);
}

function monorail(v) {
  const accent2 = v.accent2 || v.accent;
  return svgShell(`
    <path d="M99 35H157L170 58V199L154 220H102L86 199V58Z" fill="${v.body}" stroke="${outline}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="104" y="52" width="48" height="27" rx="9" fill="${glass}"/>
    <path d="M115 70L128 54L141 70Z" fill="${v.accent}"/>
    <rect x="108" y="99" width="40" height="82" rx="12" fill="${windowFill}" opacity="0.88"/>
    <path d="M94 89H162" stroke="${v.accent}" stroke-width="8" stroke-linecap="round"/>
    <path d="M104 194H152" stroke="${accent2}" stroke-width="6" stroke-linecap="round"/>
    <path d="M113 222H143L137 238H119Z" fill="${accent2}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M84 244H172" stroke="${v.accent}" stroke-width="10" stroke-linecap="round"/>
    <path d="M101 106V178M155 106V178" stroke="${v.accent}" stroke-width="5" stroke-linecap="round"/>
  `);
}

function classic(v) {
  const window = v.body === "#7c1d10" ? "#f8e7c1" : windowFill;
  return svgShell(`
    <rect x="88" y="30" width="80" height="202" rx="12" fill="${v.body}" stroke="${outline}" stroke-width="5"/>
    <rect x="100" y="43" width="56" height="32" rx="8" fill="${glass}"/>
    <path d="M116 65L128 49L140 65Z" fill="${v.accent}"/>
    <rect x="105" y="92" width="46" height="105" rx="10" fill="${window}" opacity="0.9"/>
    <path d="M99 84H157" stroke="${v.accent}" stroke-width="6" stroke-linecap="round"/>
    <path d="M99 211H157" stroke="${v.accent2 || v.accent}" stroke-width="7" stroke-linecap="round"/>
    <path d="M98 103V198M158 103V198" stroke="${v.accent}" stroke-width="5" stroke-linecap="round"/>
  `);
}

function iconSvg(key, entry) {
  const visual = VISUALS[key];
  if (!visual) throw new Error(`Missing visual recipe for ${key}`);
  if (entry.kind === "shinkansen" || visual.shape === "shinkansen") return shinkansen(visual);
  if (visual.shape === "express") return express(visual);
  if (visual.shape === "metro") return metro(visual);
  if (visual.shape === "monorail") return monorail(visual);
  if (visual.shape === "classic") return classic(visual);
  return commuter(visual);
}

function publicPath(assetPath) {
  return resolve(PUBLIC, assetPath);
}

function pngDataUrl(assetPath) {
  const data = readFileSync(publicPath(assetPath)).toString("base64");
  return `data:image/png;base64,${data}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function contactEntries() {
  const entries = [];
  Object.entries(TRAIN_ICON_REGISTRY.typeFallbacks).forEach(([type, entry]) => {
    entries.push({ label: type, sublabel: entry.icon.split("/").pop(), entry });
  });
  Object.entries(TRAIN_ICON_REGISTRY.lineOverrides).forEach(([key, entry]) => {
    const [region, line, type] = key.split("|");
    entries.push({ label: `${region} / ${type}`, sublabel: `${line} · ${entry.icon.split("/").pop()}`, entry });
  });
  return entries;
}

async function renderIcon(page, key, entry) {
  const outPath = publicPath(entry.icon);
  if (!VISUALS[key] && existsSync(outPath)) return;
  await page.setViewportSize({ width: 256, height: 256 });
  await page.setContent(`<html><body style="margin:0;background:transparent"><div id="icon" style="width:256px;height:256px">${iconSvg(key, entry)}</div></body></html>`);
  await page.locator("#icon").screenshot({ path: outPath, omitBackground: true });
}

async function renderContactSheet(page) {
  const entries = contactEntries();
  const cards = entries.map(({ label, sublabel, entry }) => {
    const src = pngDataUrl(entry.icon);
    return `<article class="card">
      <div class="meta"><strong>${escapeHtml(label)}</strong><code>${escapeHtml(sublabel)}</code></div>
      <div class="preview big"><img src="${src}" width="256" height="256"></div>
      <div class="sizes">
        <div class="preview"><img src="${src}" width="64" height="64"></div>
        <div class="preview"><img src="${src}" width="32" height="32"></div>
        <div class="preview"><img src="${src}" width="24" height="24"></div>
      </div>
    </article>`;
  }).join("");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.setContent(`<!doctype html>
    <html><head><meta charset="utf-8">
    <style>
      body { margin: 0; background: #f4f7fb; color: #111827; font: 14px system-ui, -apple-system, Segoe UI, sans-serif; }
      header { padding: 24px 28px 12px; display: flex; justify-content: space-between; align-items: end; }
      h1 { margin: 0; font-size: 22px; font-weight: 700; }
      .note { color: #475569; font-size: 13px; }
      main { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 16px 24px 28px; }
      .card { background: #fff; border: 1px solid #dbe3ee; border-radius: 8px; padding: 14px; display: grid; grid-template-columns: 112px 1fr 86px; gap: 12px; align-items: center; }
      .meta { min-width: 0; }
      strong { display: block; font-size: 13px; line-height: 1.25; margin-bottom: 6px; overflow-wrap: anywhere; }
      code { display: block; color: #475569; font: 11px ui-monospace, SFMono-Regular, Consolas, monospace; line-height: 1.25; overflow-wrap: anywhere; }
      .preview { background-color: #fff; background-image:
        linear-gradient(45deg, #d8e0ea 25%, transparent 25%),
        linear-gradient(-45deg, #d8e0ea 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #d8e0ea 75%),
        linear-gradient(-45deg, transparent 75%, #d8e0ea 75%);
        background-position: 0 0, 0 8px, 8px -8px, -8px 0;
        background-size: 16px 16px; border: 1px solid #d4dde9; display: grid; place-items: center; }
      .big { width: 128px; height: 128px; justify-self: center; }
      .big img { width: 128px; height: 128px; }
      .sizes { display: grid; gap: 8px; justify-items: center; }
      .sizes .preview { width: 70px; height: 70px; }
    </style></head>
    <body><header><h1>Train icons: 256 / 64 / 32 / 24 px</h1><div class="note">${entries.length} assets</div></header><main>${cards}</main></body></html>`,
    { waitUntil: "load" });
  await page.waitForFunction(
    () => [...document.images].every(img => img.complete && img.naturalWidth > 0),
    null,
    { timeout: 120000 }
  );
  await page.screenshot({ path: SHEET_PATH, fullPage: true });
}

mkdirSync(ICON_DIR, { recursive: true });
writeFileSync(MAP_PATH, `${JSON.stringify(TRAIN_ICON_REGISTRY, null, 2)}\n`, "utf8");

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const [key, entry] of Object.entries(TRAIN_ICON_REGISTRY.lineOverrides)) {
  await renderIcon(page, key, entry);
}
await renderContactSheet(page);
await browser.close();

console.log(`Generated ${Object.keys(TRAIN_ICON_REGISTRY.lineOverrides).length} line-aware train icons`);
console.log(`Wrote ${MAP_PATH}`);
console.log(`Wrote ${SHEET_PATH}`);
