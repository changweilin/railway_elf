// Train icon registry shared by the map and validation scripts.
// Paths are relative to the document URL so the app works under `/` and under
// the GitHub Pages project sub-path.
import { RAIL_DATA } from "./rail-data.js";

function icon(file, kind) {
  return { icon: `assets/train-icons/${file}`, kind };
}

const templatesByLine = new Map();

function trainTemplates(region, lineId) {
  const key = `${region}|${lineId}`;
  if (!templatesByLine.has(key)) {
    const templates = RAIL_DATA[region]?.trainTemplates
      .filter(template => template.line === lineId) || [];
    templatesByLine.set(key, templates);
  }
  return templatesByLine.get(key);
}

function templateType(region, lineId, typeIndex) {
  const template = trainTemplates(region, lineId)[typeIndex];
  if (!template) {
    throw new Error(`Missing train template for ${region}|${lineId}|${typeIndex}`);
  }
  return template.type;
}

function fromUniqueEntries(entries) {
  const registry = {};
  for (const [key, entry] of entries) {
    if (registry[key]) throw new Error(`Duplicate train icon registry key: ${key}`);
    registry[key] = entry;
  }
  return registry;
}

function typeFallback(region, lineId, typeIndex, file, kind) {
  return [templateType(region, lineId, typeIndex), icon(file, kind)];
}

function lineOverride(region, lineId, typeIndex, file, kind) {
  return [
    `${region}|${lineId}|${templateType(region, lineId, typeIndex)}`,
    icon(file, kind),
  ];
}

const typeFallbackSpecs = [
  ["taiwan", "TRA-West", 0, "tze-chiang.png", "express"],
  ["taiwan", "TRA-West", 1, "chu-kuang.png", "limited"],
  ["taiwan", "TRA-West", 2, "local-emu.png", "commuter"],
  ["taiwan", "THSR", 0, "thsr-700t.png", "shinkansen"],
  ["taiwan", "TRA-East", 0, "taroko.png", "express"],
  ["taiwan", "TRA-East", 1, "puyuma.png", "express"],
  ["taiwan", "Alishan-Forest", 0, "alishan-express.png", "heritage"],
  ["taiwan", "TPE-Red", 0, "metro.png", "metro"],
  ["taiwan", "TYMRT", 0, "tymetro-commuter.png", "commuter"],
  ["taiwan", "TYMRT", 1, "tymetro-express.png", "express"],
  ["taiwan", "KHH-LRT", 0, "lrt.png", "lrt"],
  ["japan", "Tokaido-Shinkansen", 0, "shinkansen-nozomi.png", "shinkansen"],
  ["japan", "Tokaido-Shinkansen", 1, "shinkansen-hikari.png", "shinkansen"],
  ["japan", "Tokaido-Shinkansen", 2, "shinkansen-kodama.png", "shinkansen"],
  ["japan", "JR-Yamanote", 0, "yamanote.png", "commuter"],
  ["japan", "JR-Chuo", 0, "chuo-rapid.png", "express"],
  ["japan", "JR-Chuo", 1, "chuo-special-rapid.png", "express"],
];

const lineOverrideSpecs = [
  ["taiwan", "TRA-Coast", 1, "taiwan-tra-coast-semi-express.png", "express"],

  ["japan", "Tokyo-Metro-Ginza", 0, "japan-tokyo-metro-ginza-ginza-line.png", "metro"],
  ["japan", "Tokyo-Metro-Marunouchi", 0, "japan-tokyo-metro-marunouchi-marunouchi-line.png", "metro"],
  ["japan", "JR-Keihin-Tohoku", 0, "japan-jr-keihin-tohoku-local.png", "commuter"],
  ["japan", "JR-Sobu-Local", 0, "japan-jr-sobu-local-local.png", "commuter"],
  ["japan", "Tokyu-Toyoko", 0, "japan-tokyu-toyoko-local.png", "commuter"],
  ["japan", "Tokyu-Toyoko", 1, "japan-tokyu-toyoko-express.png", "express"],
  ["japan", "Tokyu-Toyoko", 2, "japan-tokyu-toyoko-limited-express.png", "express"],
  ["japan", "JR-Osaka-Loop", 0, "japan-jr-osaka-loop-local.png", "commuter"],
  ["japan", "JR-Osaka-Loop", 1, "japan-jr-osaka-loop-yamatoji-rapid.png", "express"],
  ["japan", "Osaka-Metro-Midosuji", 0, "japan-osaka-metro-midosuji-midosuji-line.png", "metro"],
  ["japan", "Hankyu-Kobe", 0, "japan-hankyu-kobe-local.png", "commuter"],
  ["japan", "Hankyu-Kobe", 1, "japan-hankyu-kobe-commuter-limited-express.png", "express"],
  ["japan", "Hankyu-Kobe", 2, "japan-hankyu-kobe-limited-express.png", "express"],
  ["japan", "Sanyo-Shinkansen", 1, "japan-sanyo-shinkansen-mizuho.png", "shinkansen"],
  ["japan", "Sanyo-Shinkansen", 2, "japan-sanyo-shinkansen-sakura.png", "shinkansen"],
  ["japan", "Nishi-Kyushu-Shinkansen", 0, "japan-nishi-kyushu-shinkansen-kamome.png", "shinkansen"],
  ["japan", "Tokyo-Monorail", 0, "japan-tokyo-monorail-local.png", "monorail"],
  ["japan", "Utsunomiya-Lightline", 0, "japan-utsunomiya-lightline-lightline.png", "lrt"],

  ["korea", "Seoul-Metro-1", 0, "korea-seoul-metro-1-express.png", "express"],
  ["korea", "Seoul-Metro-1", 1, "korea-seoul-metro-1-local.png", "commuter"],
  ["korea", "Seoul-Metro-2", 0, "korea-seoul-metro-2-loop.png", "metro"],
  ["korea", "Seoul-Metro-3", 0, "korea-seoul-metro-3-line-3.png", "metro"],
  ["korea", "Seoul-Metro-4", 0, "korea-seoul-metro-4-line-4.png", "metro"],
  ["korea", "Seoul-Metro-5", 0, "korea-seoul-metro-5-line-5.png", "metro"],
  ["korea", "Seoul-Metro-6", 0, "korea-seoul-metro-6-line-6.png", "metro"],
  ["korea", "Seoul-Metro-7", 0, "korea-seoul-metro-7-line-7.png", "metro"],
  ["korea", "Seoul-Metro-8", 0, "korea-seoul-metro-8-line-8.png", "metro"],
  ["korea", "Seoul-Metro-9", 0, "korea-seoul-metro-9-line-9.png", "metro"],
  ["korea", "Seoul-Metro-9", 1, "korea-seoul-metro-9-line-9.png", "metro"],
  ["korea", "Seoul-Metro-9", 2, "korea-seoul-metro-9-line-9.png", "metro"],
  ["korea", "Ui-LRT", 0, "korea-ui-lrt-ui-sinseol-line.png", "lrt"],
  ["korea", "Sillim-LRT", 0, "korea-sillim-lrt-sillim-line.png", "lrt"],
  ["korea", "Uijeongbu-LRT", 0, "korea-uijeongbu-lrt-u-line.png", "lrt"],
  ["korea", "Yongin-EverLine", 0, "korea-yongin-everline-everline.png", "lrt"],
  ["korea", "Shinbundang", 0, "korea-shinbundang-shinbundang.png", "metro"],
  ["korea", "Suin-Bundang", 0, "korea-suin-bundang-suin-bundang.png", "commuter"],
  ["korea", "Gyeongui-Jungang", 0, "korea-gyeongui-jungang-gyeongui-jungang.png", "commuter"],
  ["korea", "Gyeongui-Jungang", 1, "korea-gyeongui-jungang-gyeongui-jungang.png", "commuter"],
  ["korea", "Gyeongchun", 0, "korea-gyeongchun-gyeongchun.png", "commuter"],
  ["korea", "Gyeongchun", 1, "korea-gyeongchun-gyeongchun.png", "commuter"],
  ["korea", "Gyeongchun", 2, "korea-gyeongchun-gyeongchun.png", "commuter"],
  ["korea", "Gyeonggang", 0, "korea-gyeonggang-gyeonggang.png", "commuter"],
  ["korea", "Seohae", 0, "korea-seohae-seohae.png", "commuter"],
  ["korea", "Incheon-Metro-1", 0, "korea-incheon-metro-1-line-1.png", "metro"],
  ["korea", "Incheon-Metro-2", 0, "korea-incheon-metro-2-line-2.png", "lrt"],
  ["korea", "AREX", 0, "korea-arex-arex.png", "express"],
  ["korea", "Gimpo-Goldline", 0, "korea-gimpo-goldline-goldline.png", "lrt"],
  ["korea", "Daegu-Metro-1", 0, "korea-daegu-metro-1-line-1.png", "metro"],
  ["korea", "Daegu-Metro-2", 0, "korea-daegu-metro-2-line-2.png", "metro"],
  ["korea", "Daegu-Metro-3", 0, "korea-daegu-metro-3-line-3.png", "monorail"],
  ["korea", "Daejeon-Metro-1", 0, "korea-daejeon-metro-1-line-1.png", "metro"],
  ["korea", "Gwangju-Metro-1", 0, "korea-gwangju-metro-1-line-1.png", "metro"],
  ["korea", "KTX-Gyeongbu", 0, "korea-ktx-gyeongbu-ktx.png", "shinkansen"],
  ["korea", "KTX-Gyeongbu", 1, "korea-ktx-gyeongbu-ktx-sancheon.png", "shinkansen"],
  ["korea", "KTX-Honam", 0, "korea-ktx-gyeongbu-ktx.png", "shinkansen"],
  ["korea", "KTX-Honam", 1, "korea-ktx-gyeongbu-ktx-sancheon.png", "shinkansen"],
  ["korea", "KTX-Jeolla", 0, "korea-ktx-gyeongbu-ktx.png", "shinkansen"],
  ["korea", "KTX-Jeolla", 1, "korea-ktx-gyeongbu-ktx-sancheon.png", "shinkansen"],
  ["korea", "KTX-Gyeongjeon", 0, "korea-ktx-gyeongbu-ktx.png", "shinkansen"],
  ["korea", "KTX-Gyeongjeon", 1, "korea-ktx-gyeongbu-ktx-sancheon.png", "shinkansen"],
  ["korea", "KTX-Gangneung", 0, "korea-ktx-gangneung-ktx-eum.png", "shinkansen"],
  ["korea", "KTX-Donghae", 0, "korea-ktx-gyeongbu-ktx.png", "shinkansen"],
  ["korea", "KTX-Donghae", 1, "korea-ktx-gyeongbu-ktx-sancheon.png", "shinkansen"],
  ["korea", "KTX-Jungang", 0, "korea-ktx-gangneung-ktx-eum.png", "shinkansen"],
  ["korea", "KTX-Jungbu-Naeryuk", 0, "korea-ktx-gangneung-ktx-eum.png", "shinkansen"],
  ["korea", "ITX-Cheongchun", 0, "korea-itx-cheongchun-itx-cheongchun.png", "express"],
  ["korea", "SRT-Gyeongbu", 0, "korea-srt-gyeongbu-srt.png", "shinkansen"],
  ["korea", "SRT-Honam", 0, "korea-srt-gyeongbu-srt.png", "shinkansen"],
  ["korea", "SRT-Jeolla", 0, "korea-srt-gyeongbu-srt.png", "shinkansen"],
  ["korea", "SRT-Gyeongjeon", 0, "korea-srt-gyeongbu-srt.png", "shinkansen"],
  ["korea", "SRT-Donghae", 0, "korea-srt-gyeongbu-srt.png", "shinkansen"],
  ["korea", "Busan-Metro-1", 0, "korea-busan-metro-1-line-1.png", "metro"],
  ["korea", "Busan-Metro-2", 0, "korea-busan-metro-2-line-2.png", "metro"],
  ["korea", "Busan-Metro-3", 0, "korea-busan-metro-3-line-3.png", "metro"],
  ["korea", "Busan-Metro-4", 0, "korea-busan-metro-4-line-4.png", "metro"],
  ["korea", "Busan-Gimhae-LRT", 0, "korea-busan-gimhae-lrt-bgl.png", "lrt"],

  ["hongkong", "MTR-Tsuen-Wan", 0, "hongkong-mtr-tsuen-wan-tsuen-wan-line.png", "metro"],
  ["hongkong", "MTR-Island", 0, "hongkong-mtr-island-island-line.png", "metro"],
  ["hongkong", "MTR-East-Rail", 0, "hongkong-mtr-east-rail-east-rail-line.png", "commuter"],
  ["hongkong", "MTR-Airport-Express", 0, "hongkong-mtr-airport-express-airport-express.png", "express"],

  ["china", "Beijing-Shanghai-HSR", 0, "china-beijing-shanghai-hsr-fuxing.png", "shinkansen"],
  ["china", "Beijing-Shanghai-HSR", 1, "china-beijing-shanghai-hsr-hexie.png", "shinkansen"],
  ["china", "Beijing-Guangzhou-HSR", 0, "china-beijing-guangzhou-hsr-fuxing.png", "shinkansen"],
  ["china", "Beijing-Guangzhou-HSR", 1, "china-beijing-guangzhou-hsr-hexie.png", "shinkansen"],
  ["china", "Shanghai-Kunming-HSR", 0, "china-shanghai-kunming-hsr-fuxing.png", "shinkansen"],
  ["china", "Shanghai-Kunming-HSR", 1, "china-shanghai-kunming-hsr-hexie.png", "shinkansen"],
  ["china", "Beijing-Subway-1", 0, "china-beijing-subway-1-line-1.png", "metro"],
  ["china", "Beijing-Subway-2", 0, "china-beijing-subway-2-line-2.png", "metro"],
  ["china", "Shanghai-Metro-1", 0, "china-shanghai-metro-1-line-1.png", "metro"],
  ["china", "Shanghai-Metro-2", 0, "china-shanghai-metro-2-line-2.png", "metro"],

  ["singapore", "SG-MRT-North-South", 0, "singapore-sg-mrt-north-south-nsl.png", "metro"],
  ["singapore", "SG-MRT-East-West", 0, "singapore-sg-mrt-east-west-ewl.png", "metro"],
  ["singapore", "SG-MRT-North-East", 0, "singapore-sg-mrt-north-east-nel.png", "metro"],
  ["singapore", "SG-MRT-Circle", 0, "singapore-sg-mrt-circle-ccl.png", "metro"],
  ["singapore", "SG-MRT-Downtown", 0, "singapore-sg-mrt-downtown-dtl.png", "metro"],

  ["malaysia", "KL-Kelana-Jaya", 0, "malaysia-kl-kelana-jaya-lrt.png", "metro"],
  ["malaysia", "KL-MRT-Kajang", 0, "malaysia-kl-mrt-kajang-mrt.png", "metro"],
  ["malaysia", "KL-MRT-Putrajaya", 0, "malaysia-kl-mrt-putrajaya-pyl.png", "metro"],

  ["thailand", "BKK-BTS-Sukhumvit", 0, "thailand-bkk-bts-sukhumvit-bts.png", "metro"],
  ["thailand", "BKK-BTS-Silom", 0, "thailand-bkk-bts-sukhumvit-bts.png", "metro"],
  ["thailand", "BKK-MRT-Purple", 0, "thailand-bkk-mrt-purple-mrt.png", "metro"],
  ["thailand", "BKK-MRT-Blue", 0, "thailand-bkk-mrt-blue-mrt.png", "metro"],
  ["thailand", "BKK-Airport-Rail", 0, "thailand-bkk-airport-rail-arl.png", "express"],

  ["vietnam", "HCMC-Metro-1", 0, "vietnam-hcmc-metro-1-metro-1.png", "metro"],
  ["vietnam", "Hanoi-Metro-2A", 0, "vietnam-hanoi-metro-2a-metro-2a.png", "metro"],
];

export const TRAIN_ICON_REGISTRY = {
  typeFallbacks: fromUniqueEntries(
    typeFallbackSpecs.map(([region, lineId, typeIndex, file, kind]) =>
      typeFallback(region, lineId, typeIndex, file, kind)
    )
  ),
  lineOverrides: fromUniqueEntries(
    lineOverrideSpecs.map(([region, lineId, typeIndex, file, kind]) =>
      lineOverride(region, lineId, typeIndex, file, kind)
    )
  ),
};

export const TRAIN_ICON_KIND_SIZE = {
  shinkansen: 44,
  express:    38,
  limited:    36,
  commuter:   36,
  metro:      32,
  monorail:   30,
  lrt:        28,
  heritage:   28,
};

export function trainIconKey(train, region) {
  const lineId = train && train.line && train.line.id;
  return lineId && train && train.type ? `${region}|${lineId}|${train.type}` : null;
}

export function resolveTrainIcon(train, region) {
  const lineKey = trainIconKey(train, region);
  const entry =
    (lineKey && TRAIN_ICON_REGISTRY.lineOverrides[lineKey]) ||
    (train && TRAIN_ICON_REGISTRY.typeFallbacks[train.type]);
  return entry ? { src: entry.icon, kind: entry.kind } : null;
}

export function preloadTrainIcons() {
  if (typeof Image === 'undefined') return;
  const srcs = new Set();
  Object.values(TRAIN_ICON_REGISTRY.typeFallbacks).forEach(entry => srcs.add(entry.icon));
  Object.values(TRAIN_ICON_REGISTRY.lineOverrides).forEach(entry => srcs.add(entry.icon));
  srcs.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

export function trainKindPriority(train, region) {
  const entry = resolveTrainIcon(train, region);
  switch (entry && entry.kind) {
    case 'shinkansen': return 30;
    case 'express': return 18;
    case 'limited': return 14;
    case 'heritage': return 10;
    case 'commuter': return 6;
    case 'metro': return 4;
    case 'monorail': return 4;
    case 'lrt': return 3;
    default: return 0;
  }
}
