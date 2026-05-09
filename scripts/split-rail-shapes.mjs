// Splits src/rail-data.generated.js into per-region dynamic-import chunks.
// Run after fetch-rail-shapes.mjs updates the canonical generated file.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'src', 'rail-shapes');

const { RAIL_DATA } = await import(pathToFileURL(resolve(ROOT, 'src', 'rail-data.js')).href);
const { RAIL_SHAPES } = await import(pathToFileURL(resolve(ROOT, 'src', 'rail-data.generated.js')).href);

await mkdir(OUT_DIR, { recursive: true });

for (const [regionKey, region] of Object.entries(RAIL_DATA)) {
  const lineIds = new Set(region.lines.map(line => line.id));
  const regionShapes = {};
  for (const lineId of lineIds) {
    if (RAIL_SHAPES[lineId]) regionShapes[lineId] = RAIL_SHAPES[lineId];
  }

  // Partial fetches such as --skip-jp should not wipe existing region chunks.
  if (Object.keys(regionShapes).length === 0) continue;

  const body = [
    '// AUTO-GENERATED from src/rail-data.generated.js; do not edit by hand.',
    `export const RAIL_SHAPES = ${JSON.stringify(regionShapes)};`,
    '',
  ].join('\n');
  await writeFile(resolve(OUT_DIR, `${regionKey}.generated.js`), body, 'utf8');
  console.log(`${regionKey}: ${Object.keys(regionShapes).length} shapes`);
}
