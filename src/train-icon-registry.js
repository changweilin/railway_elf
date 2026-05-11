// Train icon registry shared by the map and validation scripts.
// Paths are relative to the document URL so the app works under `/` and under
// the GitHub Pages project sub-path.
export const TRAIN_ICON_REGISTRY = {
  typeFallbacks: {
    '?ªå¼·':     { icon: 'assets/train-icons/tze-chiang.png',         kind: 'express' },
    '?’å?':     { icon: 'assets/train-icons/chu-kuang.png',          kind: 'limited' },
    '?€??:     { icon: 'assets/train-icons/local-emu.png',          kind: 'commuter' },
    'é«˜éµ':     { icon: 'assets/train-icons/thsr-700t.png',          kind: 'shinkansen' },
    'å¤ªé­¯??:   { icon: 'assets/train-icons/taroko.png',             kind: 'express' },
    '?®æ???:   { icon: 'assets/train-icons/puyuma.png',             kind: 'express' },
    '?¿é?å±±è?': { icon: 'assets/train-icons/alishan-express.png',    kind: 'heritage' },
    '?·é?':     { icon: 'assets/train-icons/metro.png',              kind: 'metro' },
    '?®é€šè?':   { icon: 'assets/train-icons/tymetro-commuter.png',   kind: 'commuter' },
    '?´é?è»?:   { icon: 'assets/train-icons/tymetro-express.png',    kind: 'express' },
    'è¼•è?':     { icon: 'assets/train-icons/lrt.png',                kind: 'lrt' },
    '?®ã???:   { icon: 'assets/train-icons/shinkansen-nozomi.png',  kind: 'shinkansen' },
    '?²ã???:   { icon: 'assets/train-icons/shinkansen-hikari.png',  kind: 'shinkansen' },
    '?“ã???:   { icon: 'assets/train-icons/shinkansen-kodama.png',  kind: 'shinkansen' },
    'å±±æ?ç·?:   { icon: 'assets/train-icons/yamanote.png',           kind: 'commuter' },
    'å¿«é€?:     { icon: 'assets/train-icons/chuo-rapid.png',         kind: 'express' },
    '?¹åˆ¥å¿«é€?: { icon: 'assets/train-icons/chuo-special-rapid.png', kind: 'express' },
  },

  lineOverrides: {
    'taiwan|TRA-Coast|?€?“å¿«': { icon: 'assets/train-icons/taiwan-tra-coast-semi-express.png', kind: 'express' },

    'japan|Tokyo-Metro-Ginza|?€åº§ç?': { icon: 'assets/train-icons/japan-tokyo-metro-ginza-ginza-line.png', kind: 'metro' },
    'japan|Tokyo-Metro-Marunouchi|ä¸¸ã??…ç?': { icon: 'assets/train-icons/japan-tokyo-metro-marunouchi-marunouchi-line.png', kind: 'metro' },
    'japan|JR-Keihin-Tohoku|?„é??œè?': { icon: 'assets/train-icons/japan-jr-keihin-tohoku-local.png', kind: 'commuter' },
    'japan|JR-Sobu-Local|?„é??œè?': { icon: 'assets/train-icons/japan-jr-sobu-local-local.png', kind: 'commuter' },
    'japan|Tokyu-Toyoko|?„å?': { icon: 'assets/train-icons/japan-tokyu-toyoko-local.png', kind: 'commuter' },
    'japan|Tokyu-Toyoko|?¥è?': { icon: 'assets/train-icons/japan-tokyu-toyoko-express.png', kind: 'express' },
    'japan|Tokyu-Toyoko|?¹æ€?: { icon: 'assets/train-icons/japan-tokyu-toyoko-limited-express.png', kind: 'express' },
    'japan|JR-Osaka-Loop|?®é€?: { icon: 'assets/train-icons/japan-jr-osaka-loop-local.png', kind: 'commuter' },
    'japan|JR-Osaka-Loop|å¤§å?è·¯å¿«??: { icon: 'assets/train-icons/japan-jr-osaka-loop-yamatoji-rapid.png', kind: 'express' },
    'japan|Osaka-Metro-Midosuji|å¾¡å?ç­‹ç?': { icon: 'assets/train-icons/japan-osaka-metro-midosuji-midosuji-line.png', kind: 'metro' },
    'japan|Hankyu-Kobe|?®é€?: { icon: 'assets/train-icons/japan-hankyu-kobe-local.png', kind: 'commuter' },
    'japan|Hankyu-Kobe|?šå‹¤?¹æ€?: { icon: 'assets/train-icons/japan-hankyu-kobe-commuter-limited-express.png', kind: 'express' },
    'japan|Hankyu-Kobe|?¹æ€?: { icon: 'assets/train-icons/japan-hankyu-kobe-limited-express.png', kind: 'express' },
    'japan|Sanyo-Shinkansen|?¿ã???: { icon: 'assets/train-icons/japan-sanyo-shinkansen-mizuho.png', kind: 'shinkansen' },
    'japan|Sanyo-Shinkansen|?•ã???: { icon: 'assets/train-icons/japan-sanyo-shinkansen-sakura.png', kind: 'shinkansen' },
    'japan|Nishi-Kyushu-Shinkansen|?‹ã???: { icon: 'assets/train-icons/japan-nishi-kyushu-shinkansen-kamome.png', kind: 'shinkansen' },
    'japan|Tokyo-Monorail|?®é€?: { icon: 'assets/train-icons/japan-tokyo-monorail-local.png', kind: 'monorail' },
    'japan|Utsunomiya-Lightline|?©ã‚¤?ˆãƒ©?¤ãƒ³': { icon: 'assets/train-icons/japan-utsunomiya-lightline-lightline.png', kind: 'lrt' },

    'korea|Seoul-Metro-1|ê¸‰í?': { icon: 'assets/train-icons/korea-seoul-metro-1-express.png', kind: 'express' },
    'korea|Seoul-Metro-1|?„í?': { icon: 'assets/train-icons/korea-seoul-metro-1-local.png', kind: 'commuter' },
    'korea|Seoul-Metro-2|?œí?': { icon: 'assets/train-icons/korea-seoul-metro-2-loop.png', kind: 'metro' },
    'korea|Seoul-Metro-3|3?¸ì?': { icon: 'assets/train-icons/korea-seoul-metro-3-line-3.png', kind: 'metro' },
    'korea|Seoul-Metro-4|4?¸ì?': { icon: 'assets/train-icons/korea-seoul-metro-4-line-4.png', kind: 'metro' },
    'korea|Seoul-Metro-5|5?¸ì?': { icon: 'assets/train-icons/korea-seoul-metro-5-line-5.png', kind: 'metro' },
    'korea|Seoul-Metro-6|6?¸ì?': { icon: 'assets/train-icons/korea-seoul-metro-6-line-6.png', kind: 'metro' },
    'korea|Seoul-Metro-7|7?¸ì?': { icon: 'assets/train-icons/korea-seoul-metro-7-line-7.png', kind: 'metro' },
    'korea|Seoul-Metro-8|8?¸ì?': { icon: 'assets/train-icons/korea-seoul-metro-8-line-8.png', kind: 'metro' },
    'korea|Seoul-Metro-9|9?¸ì?': { icon: 'assets/train-icons/korea-seoul-metro-9-line-9.png', kind: 'metro' },
    'korea|Seoul-Metro-9|Line 9 Fast': { icon: 'assets/train-icons/korea-seoul-metro-9-line-9.png', kind: 'metro' },
    'korea|Seoul-Metro-9|Line 9 Slow': { icon: 'assets/train-icons/korea-seoul-metro-9-line-9.png', kind: 'metro' },
    'korea|Ui-LRT|?°ì´? ì„¤??: { icon: 'assets/train-icons/korea-ui-lrt-ui-sinseol-line.png', kind: 'lrt' },
    'korea|Sillim-LRT|? ë¦¼??: { icon: 'assets/train-icons/korea-sillim-lrt-sillim-line.png', kind: 'lrt' },
    'korea|Uijeongbu-LRT|U Line': { icon: 'assets/train-icons/korea-uijeongbu-lrt-u-line.png', kind: 'lrt' },
    'korea|Yongin-EverLine|EverLine': { icon: 'assets/train-icons/korea-yongin-everline-everline.png', kind: 'lrt' },
    'korea|Shinbundang|? ë??¹ì?': { icon: 'assets/train-icons/korea-shinbundang-shinbundang.png', kind: 'metro' },
    'korea|Suin-Bundang|?˜ì¸ë¶„ë‹¹??: { icon: 'assets/train-icons/korea-suin-bundang-suin-bundang.png', kind: 'commuter' },
    'korea|Gyeongui-Jungang|ê²½ì?ì¤‘ì???: { icon: 'assets/train-icons/korea-gyeongui-jungang-gyeongui-jungang.png', kind: 'commuter' },
    'korea|Gyeongui-Jungang|Gyeongui short-turn': { icon: 'assets/train-icons/korea-gyeongui-jungang-gyeongui-jungang.png', kind: 'commuter' },
    'korea|Gyeongchun|ê²½ì???: { icon: 'assets/train-icons/korea-gyeongchun-gyeongchun.png', kind: 'commuter' },
    'korea|Gyeongchun|Gyeongchun Sangbong': { icon: 'assets/train-icons/korea-gyeongchun-gyeongchun.png', kind: 'commuter' },
    'korea|Gyeongchun|Gyeongchun Gwangwoon': { icon: 'assets/train-icons/korea-gyeongchun-gyeongchun.png', kind: 'commuter' },
    'korea|Gyeonggang|ê²½ê???: { icon: 'assets/train-icons/korea-gyeonggang-gyeonggang.png', kind: 'commuter' },
    'korea|Seohae|?œí•´??: { icon: 'assets/train-icons/korea-seohae-seohae.png', kind: 'commuter' },
    'korea|Incheon-Metro-1|1?¸ì?': { icon: 'assets/train-icons/korea-incheon-metro-1-line-1.png', kind: 'metro' },
    'korea|Incheon-Metro-2|2?¸ì?': { icon: 'assets/train-icons/korea-incheon-metro-2-line-2.png', kind: 'lrt' },
    'korea|AREX|AREX': { icon: 'assets/train-icons/korea-arex-arex.png', kind: 'express' },
    'korea|Gimpo-Goldline|ê³¨ë??¼ì¸': { icon: 'assets/train-icons/korea-gimpo-goldline-goldline.png', kind: 'lrt' },
    'korea|Daegu-Metro-1|1?¸ì?': { icon: 'assets/train-icons/korea-daegu-metro-1-line-1.png', kind: 'metro' },
    'korea|Daegu-Metro-2|2?¸ì?': { icon: 'assets/train-icons/korea-daegu-metro-2-line-2.png', kind: 'metro' },
    'korea|Daegu-Metro-3|3?¸ì?': { icon: 'assets/train-icons/korea-daegu-metro-3-line-3.png', kind: 'monorail' },
    'korea|Daejeon-Metro-1|1?¸ì?': { icon: 'assets/train-icons/korea-daejeon-metro-1-line-1.png', kind: 'metro' },
    'korea|Gwangju-Metro-1|1?¸ì?': { icon: 'assets/train-icons/korea-gwangju-metro-1-line-1.png', kind: 'metro' },
    'korea|KTX-Gyeongbu|KTX': { icon: 'assets/train-icons/korea-ktx-gyeongbu-ktx.png', kind: 'shinkansen' },
    'korea|KTX-Gyeongbu|KTX-?°ì?': { icon: 'assets/train-icons/korea-ktx-gyeongbu-ktx-sancheon.png', kind: 'shinkansen' },
    'korea|KTX-Honam|KTX': { icon: 'assets/train-icons/korea-ktx-gyeongbu-ktx.png', kind: 'shinkansen' },
    'korea|KTX-Honam|KTX-?°ì?': { icon: 'assets/train-icons/korea-ktx-gyeongbu-ktx-sancheon.png', kind: 'shinkansen' },
    'korea|KTX-Jeolla|KTX': { icon: 'assets/train-icons/korea-ktx-gyeongbu-ktx.png', kind: 'shinkansen' },
    'korea|KTX-Jeolla|KTX-?°ì?': { icon: 'assets/train-icons/korea-ktx-gyeongbu-ktx-sancheon.png', kind: 'shinkansen' },
    'korea|KTX-Gyeongjeon|KTX': { icon: 'assets/train-icons/korea-ktx-gyeongbu-ktx.png', kind: 'shinkansen' },
    'korea|KTX-Gyeongjeon|KTX-?°ì?': { icon: 'assets/train-icons/korea-ktx-gyeongbu-ktx-sancheon.png', kind: 'shinkansen' },
    'korea|KTX-Gangneung|KTX-?´ì?': { icon: 'assets/train-icons/korea-ktx-gangneung-ktx-eum.png', kind: 'shinkansen' },
    'korea|KTX-Donghae|KTX': { icon: 'assets/train-icons/korea-ktx-gyeongbu-ktx.png', kind: 'shinkansen' },
    'korea|KTX-Donghae|KTX-?°ì?': { icon: 'assets/train-icons/korea-ktx-gyeongbu-ktx-sancheon.png', kind: 'shinkansen' },
    'korea|KTX-Jungang|KTX-?´ì?': { icon: 'assets/train-icons/korea-ktx-gangneung-ktx-eum.png', kind: 'shinkansen' },
    'korea|KTX-Jungbu-Naeryuk|KTX-?´ì?': { icon: 'assets/train-icons/korea-ktx-gangneung-ktx-eum.png', kind: 'shinkansen' },
    'korea|ITX-Cheongchun|ITX-ì²­ì?': { icon: 'assets/train-icons/korea-itx-cheongchun-itx-cheongchun.png', kind: 'express' },
    'korea|SRT-Gyeongbu|SRT': { icon: 'assets/train-icons/korea-srt-gyeongbu-srt.png', kind: 'shinkansen' },
    'korea|SRT-Honam|SRT': { icon: 'assets/train-icons/korea-srt-gyeongbu-srt.png', kind: 'shinkansen' },
    'korea|SRT-Jeolla|SRT': { icon: 'assets/train-icons/korea-srt-gyeongbu-srt.png', kind: 'shinkansen' },
    'korea|SRT-Gyeongjeon|SRT': { icon: 'assets/train-icons/korea-srt-gyeongbu-srt.png', kind: 'shinkansen' },
    'korea|SRT-Donghae|SRT': { icon: 'assets/train-icons/korea-srt-gyeongbu-srt.png', kind: 'shinkansen' },
    'korea|Busan-Metro-1|1?¸ì?': { icon: 'assets/train-icons/korea-busan-metro-1-line-1.png', kind: 'metro' },
    'korea|Busan-Metro-2|2?¸ì?': { icon: 'assets/train-icons/korea-busan-metro-2-line-2.png', kind: 'metro' },
    'korea|Busan-Metro-3|3?¸ì?': { icon: 'assets/train-icons/korea-busan-metro-3-line-3.png', kind: 'metro' },
    'korea|Busan-Metro-4|4?¸ì?': { icon: 'assets/train-icons/korea-busan-metro-4-line-4.png', kind: 'metro' },
    'korea|Busan-Gimhae-LRT|BGL': { icon: 'assets/train-icons/korea-busan-gimhae-lrt-bgl.png', kind: 'lrt' },

    'hongkong|MTR-Tsuen-Wan|?ƒç£ç¶?: { icon: 'assets/train-icons/hongkong-mtr-tsuen-wan-tsuen-wan-line.png', kind: 'metro' },
    'hongkong|MTR-Island|æ¸¯å³¶ç¶?: { icon: 'assets/train-icons/hongkong-mtr-island-island-line.png', kind: 'metro' },
    'hongkong|MTR-East-Rail|?±éµç¶?: { icon: 'assets/train-icons/hongkong-mtr-east-rail-east-rail-line.png', kind: 'commuter' },
    'hongkong|MTR-Airport-Express|æ©Ÿå ´å¿«ç¶«': { icon: 'assets/train-icons/hongkong-mtr-airport-express-airport-express.png', kind: 'express' },

    'china|Beijing-Shanghai-HSR|å¾©è???: { icon: 'assets/train-icons/china-beijing-shanghai-hsr-fuxing.png', kind: 'shinkansen' },
    'china|Beijing-Shanghai-HSR|?Œè«§??: { icon: 'assets/train-icons/china-beijing-shanghai-hsr-hexie.png', kind: 'shinkansen' },
    'china|Beijing-Guangzhou-HSR|å¾©è???: { icon: 'assets/train-icons/china-beijing-guangzhou-hsr-fuxing.png', kind: 'shinkansen' },
    'china|Beijing-Guangzhou-HSR|?Œè«§??: { icon: 'assets/train-icons/china-beijing-guangzhou-hsr-hexie.png', kind: 'shinkansen' },
    'china|Shanghai-Kunming-HSR|å¾©è???: { icon: 'assets/train-icons/china-shanghai-kunming-hsr-fuxing.png', kind: 'shinkansen' },
    'china|Shanghai-Kunming-HSR|?Œè«§??: { icon: 'assets/train-icons/china-shanghai-kunming-hsr-hexie.png', kind: 'shinkansen' },
    'china|Beijing-Subway-1|1?Ÿç?': { icon: 'assets/train-icons/china-beijing-subway-1-line-1.png', kind: 'metro' },
    'china|Beijing-Subway-2|2?Ÿç?': { icon: 'assets/train-icons/china-beijing-subway-2-line-2.png', kind: 'metro' },
    'china|Shanghai-Metro-1|1?Ÿç?': { icon: 'assets/train-icons/china-shanghai-metro-1-line-1.png', kind: 'metro' },
    'china|Shanghai-Metro-2|2?Ÿç?': { icon: 'assets/train-icons/china-shanghai-metro-2-line-2.png', kind: 'metro' },

    'singapore|SG-MRT-North-South|NSL': { icon: 'assets/train-icons/singapore-sg-mrt-north-south-nsl.png', kind: 'metro' },
    'singapore|SG-MRT-East-West|EWL': { icon: 'assets/train-icons/singapore-sg-mrt-east-west-ewl.png', kind: 'metro' },
    'singapore|SG-MRT-Circle|CCL': { icon: 'assets/train-icons/singapore-sg-mrt-circle-ccl.png', kind: 'metro' },

    'malaysia|KL-Kelana-Jaya|LRT': { icon: 'assets/train-icons/malaysia-kl-kelana-jaya-lrt.png', kind: 'metro' },
    'malaysia|KL-MRT-Kajang|MRT': { icon: 'assets/train-icons/malaysia-kl-mrt-kajang-mrt.png', kind: 'metro' },

    'thailand|BKK-BTS-Sukhumvit|BTS': { icon: 'assets/train-icons/thailand-bkk-bts-sukhumvit-bts.png', kind: 'metro' },
    'thailand|BKK-MRT-Blue|MRT': { icon: 'assets/train-icons/thailand-bkk-mrt-blue-mrt.png', kind: 'metro' },
    'thailand|BKK-Airport-Rail|ARL': { icon: 'assets/train-icons/thailand-bkk-airport-rail-arl.png', kind: 'express' },

    'vietnam|HCMC-Metro-1|Metro 1': { icon: 'assets/train-icons/vietnam-hcmc-metro-1-metro-1.png', kind: 'metro' },
    'vietnam|Hanoi-Metro-2A|Metro 2A': { icon: 'assets/train-icons/vietnam-hanoi-metro-2a-metro-2a.png', kind: 'metro' },
  },
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
