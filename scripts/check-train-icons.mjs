// Validates that every generated train template resolves to a concrete PNG.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { RAIL_DATA } from "../src/rail-data.js";
import {
  TRAIN_ICON_REGISTRY,
  resolveTrainIcon,
  trainIconKey,
} from "../src/train-icon-registry.js";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const PUBLIC = resolve(ROOT, "public");
const MAP_PATH = resolve(PUBLIC, "assets/train-icons/train-icon-map.json");
const EXPECTED_LINE_OVERRIDES = 77;

function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.keys(value).sort().map(key => [key, sortDeep(value[key])])
  );
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pngInfo(assetPath) {
  const filePath = resolve(PUBLIC, assetPath);
  assert(existsSync(filePath), `Missing icon file: ${assetPath}`);
  const buffer = readFileSync(filePath);
  assert(buffer.length >= 33, `Invalid PNG (too small): ${assetPath}`);
  assert(buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `Invalid PNG signature: ${assetPath}`);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const colorType = buffer.readUInt8(25);
  return { width, height, colorType };
}

const jsonRegistry = JSON.parse(readFileSync(MAP_PATH, "utf8"));
assert(
  JSON.stringify(sortDeep(jsonRegistry)) === JSON.stringify(sortDeep(TRAIN_ICON_REGISTRY)),
  "public train-icon-map.json is not in sync with src/train-icon-registry.js"
);

const lineOverrideKeys = Object.keys(TRAIN_ICON_REGISTRY.lineOverrides);
assert(
  lineOverrideKeys.length === EXPECTED_LINE_OVERRIDES,
  `Expected ${EXPECTED_LINE_OVERRIDES} line overrides, found ${lineOverrideKeys.length}`
);

const allEntries = [
  ...Object.values(TRAIN_ICON_REGISTRY.typeFallbacks),
  ...Object.values(TRAIN_ICON_REGISTRY.lineOverrides),
];
const seenIcons = new Set();
for (const entry of allEntries) {
  assert(entry.icon && entry.icon.startsWith("assets/train-icons/"), `Bad icon path: ${entry.icon}`);
  assert(entry.kind, `Missing icon kind for ${entry.icon}`);
  if (seenIcons.has(entry.icon)) continue;
  seenIcons.add(entry.icon);
  const info = pngInfo(entry.icon);
  assert(info.width === 256 && info.height === 256, `Icon must be 256x256: ${entry.icon} (${info.width}x${info.height})`);
  assert(info.colorType === 6 || info.colorType === 4, `Icon must include alpha channel: ${entry.icon}`);
}

const usedLineOverrides = new Set();
const unresolved = [];
for (const [region, data] of Object.entries(RAIL_DATA)) {
  for (const template of data.trainTemplates) {
    const train = { type: template.type, line: { id: template.line } };
    const entry = resolveTrainIcon(train, region);
    if (!entry) {
      unresolved.push(`${region}|${template.line}|${template.type}`);
      continue;
    }
    const key = trainIconKey(train, region);
    if (TRAIN_ICON_REGISTRY.lineOverrides[key]) usedLineOverrides.add(key);
  }
}

assert(unresolved.length === 0, `Unresolved train icon templates:\n${unresolved.join("\n")}`);
const unusedLineOverrides = lineOverrideKeys.filter(key => !usedLineOverrides.has(key));
assert(unusedLineOverrides.length === 0, `Unused line overrides:\n${unusedLineOverrides.join("\n")}`);

console.log(`Checked ${seenIcons.size} PNG assets`);
console.log(`Resolved ${lineOverrideKeys.length} line-aware overrides plus ${Object.keys(TRAIN_ICON_REGISTRY.typeFallbacks).length} type fallbacks`);
