// Renders PWA / social images from in-repo SVG sources using the Chromium
// instance bundled with @playwright/test. Run via `npm run build:pwa-images`.
//
// Outputs to public/:
//   apple-touch-icon.png   180x180  (square brand mark)
//   og-image.png          1200x630  (social card)

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const PUBLIC = resolve(ROOT, "public");

async function readSvg(rel) {
  return readFile(resolve(PUBLIC, rel), "utf8");
}

async function renderPng({ html, width, height, outPath, browser }) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: "load" });
  const buf = await page.screenshot({ type: "png", omitBackground: false });
  await writeFile(outPath, buf);
  await ctx.close();
  console.log(`wrote ${outPath} (${width}x${height})`);
}

const ICON_HTML = (svg) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:#0f1117;width:100%;height:100%;}
  .wrap{width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;}
  .wrap svg{width:100%;height:100%;display:block;}
</style></head>
<body><div class="wrap">${svg}</div></body></html>`;

const OG_HTML = (svg) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: "Inter"; src: local("Segoe UI"), local("Helvetica Neue"), local("Arial"); }
  html,body{margin:0;padding:0;background:#0f1117;color:#e8eaf0;width:100%;height:100%;
    font-family: "Segoe UI", "Helvetica Neue", system-ui, "Microsoft JhengHei", "Hiragino Sans", sans-serif;}
  .card{
    width:1200px;height:630px;display:flex;align-items:center;
    padding:0 80px;box-sizing:border-box;gap:64px;
    background: radial-gradient(circle at 20% 30%, rgba(110,231,183,0.18), transparent 55%),
                radial-gradient(circle at 80% 70%, rgba(59,130,246,0.18), transparent 55%),
                #0f1117;
    position:relative;
  }
  .rail{position:absolute;left:0;right:0;bottom:120px;height:2px;
    background:linear-gradient(90deg, transparent, #6ee7b7 20%, #3b82f6 80%, transparent);
    opacity:0.5;}
  .ties{position:absolute;left:0;right:0;bottom:108px;height:14px;
    background-image:repeating-linear-gradient(90deg, rgba(232,234,240,0.28) 0 6px, transparent 6px 36px);}
  .mark{width:240px;height:240px;flex:none;}
  .mark svg{width:100%;height:100%;display:block;
    filter: drop-shadow(0 12px 32px rgba(59,130,246,0.35));}
  .text{display:flex;flex-direction:column;gap:14px;}
  h1{margin:0;font-size:84px;font-weight:800;letter-spacing:-0.02em;line-height:1;
    background:linear-gradient(90deg,#6ee7b7,#3b82f6);
    -webkit-background-clip:text;background-clip:text;color:transparent;}
  p.zh{margin:0;font-size:34px;font-weight:600;color:#e8eaf0;}
  p.en{margin:0;font-size:22px;color:#9aa3b2;max-width:720px;line-height:1.4;}
</style></head>
<body>
  <div class="card">
    <div class="ties"></div>
    <div class="rail"></div>
    <div class="mark">${svg}</div>
    <div class="text">
      <h1>Railway Elf</h1>
      <p class="zh">預測台灣與日本鐵道任一地點的下一班列車</p>
      <p class="en">Predict when the next train will pass any point on Taiwan and Japan rail lines.</p>
    </div>
  </div>
</body></html>`;

async function main() {
  const favicon = await readSvg("favicon.svg");
  const browser = await chromium.launch();
  try {
    await renderPng({
      html: ICON_HTML(favicon),
      width: 180,
      height: 180,
      outPath: resolve(PUBLIC, "apple-touch-icon.png"),
      browser,
    });
    await renderPng({
      html: OG_HTML(favicon),
      width: 1200,
      height: 630,
      outPath: resolve(PUBLIC, "og-image.png"),
      browser,
    });
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
