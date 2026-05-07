// Main app component
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { RAIL_DATA, RailUtil, TrainGen } from "./rail-data.js";
// Circular import (app-map → app-core too); safe because both sides reference
// the imported symbols only at call time inside React component bodies.
import { MapArea, TrainSheet, TrainModal } from "./app-map.js";

// Snap tolerance: locations farther than this from any rail line are treated as
// "off-rail" and produce no train list. Tuned for handheld use; revisit when
// zoom-aware tolerances are added.
const MAX_SNAP_DIST_KM = 2;
// A line counts as a candidate (selectable in the chip row) if it is within
// MAX_SNAP_DIST_KM of the user AND within this much of the closest line.
const CANDIDATE_GRACE_KM = 1.0;

const RAIL_CATEGORIES = [
  { key: 'TRA',   label: '台鐵' },
  { key: 'HSR',   label: '高鐵' },
  { key: 'Metro', label: '捷運' },
  { key: 'LRT',   label: '輕軌' },
];

const Icon = ({ id, size = 18 }) =>
  React.createElement("svg", { width: size, height: size, "aria-hidden": true },
    React.createElement("use", { href: `assets/icons.svg#${id}` }));

function formatClock(d) {
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}
function formatCountdown(diffMs) {
  const min = Math.round(diffMs / 60000);
  if (min < -60) return { text: '已過', unit: '時', cls: 'past' };
  if (min < 0)   return { text: String(min),  unit: '分', cls: 'past' };
  if (min < 1)   return { text: '現', unit: '即將通過', cls: 'imminent' };
  if (min < 60)  return { text: String(min), unit: min <= 5 ? '分鐘後' : '分鐘', cls: min <= 5 ? 'imminent' : '' };
  const h = Math.floor(min / 60), m = min % 60;
  return { text: h + ':' + String(m).padStart(2,'0'), unit: '小時後', cls: '' };
}
function sameDayISO(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

// ============================================================
// App root
// ============================================================
function App() {
  const [region, setRegion] = useState('taiwan');
  const [now, setNow] = useState(new Date());
  const [targetTime, setTargetTime] = useState(new Date());
  const [location, setLocation] = useState(null);        // {lat, lng, name}
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('relf.favs') || '[]'); } catch { return []; }
  });
  const [mapLayer, setMapLayer] = useState('dark');
  const [dirFilter, setDirFilter] = useState('all');     // 'all' | 'up' | 'down'
  const [typeFilters, setTypeFilters] = useState([]);    // array of type strings
  const [enabledCategories, setEnabledCategories] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem('relf.cats') || 'null');
      if (Array.isArray(v) && v.every(s => typeof s === 'string')) return v;
    } catch {}
    return RAIL_CATEGORIES.map(c => c.key);
  });
  const [showGrades, setShowGrades] = useState(() => {
    try { return JSON.parse(localStorage.getItem('relf.grades') || 'false') === true; }
    catch { return false; }
  });
  const [favCollapsed, setFavCollapsed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('relf.favsCollapsed') || 'false') === true; }
    catch { return false; }
  });
  const [useDetailedNaming, setUseDetailedNaming] = useState(() => {
    try { return JSON.parse(localStorage.getItem('relf.detailedNaming') || 'false') === true; }
    catch { return false; }
  });
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [sheetCollapsed, setSheetCollapsed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);        // mobile drawer
  const [panelCollapsed, setPanelCollapsed] = useState(false); // desktop collapse
  const [quickPick, setQuickPick] = useState('now');     // 'now' | '30' | '60' | 'custom'
  // Remember the last user-picked custom time so toggling 現在/+30/+1小時 → 自訂
  // restores what they had, rather than snapping to whatever targetTime got overwritten with.
  const customTimeRef = useRef(null);
  // Remember the last forecast mode ('30' | '60' | 'custom') so toggling
  // 現在 → 預測 from the HUD restores whichever predict bucket the user last used.
  const [lastPredictPick, setLastPredictPick] = useState('30');
  const [timeFocusTick, setTimeFocusTick] = useState(0); // bump to scroll/focus the panel's time control

  // App-level transient notice — replaces the previous alert() flow for
  // geolocation/tile/search failures. Shape: { id, level: 'error'|'warn'|'info', text, ttlMs }.
  // The UI (NoticeStack) handles auto-dismiss + manual close. Keeps a small
  // queue so a tile-error storm collapses into a single bubble.
  const [notices, setNotices] = useState([]);
  const noticeIdRef = useRef(0);
  const pushNotice = useCallback((text, opts = {}) => {
    const level = opts.level || 'error';
    const ttlMs = opts.ttlMs ?? 5000;
    const dedupeKey = opts.key || text;
    setNotices(prev => {
      if (prev.some(n => n.key === dedupeKey)) return prev;
      const id = ++noticeIdRef.current;
      return [...prev, { id, key: dedupeKey, level, text, ttlMs }];
    });
  }, []);
  const dismissNotice = useCallback((id) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  }, []);
  // Auto-dismiss after ttl
  useEffect(() => {
    if (notices.length === 0) return;
    const timers = notices
      .filter(n => n.ttlMs && n.ttlMs > 0)
      .map(n => setTimeout(() => dismissNotice(n.id), n.ttlMs));
    return () => timers.forEach(clearTimeout);
  }, [notices, dismissNotice]);

  // Tick the "now" clock every 30s so countdowns stay fresh
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // If quickPick is 'now', keep targetTime in sync with now
  useEffect(() => {
    if (quickPick === 'now') setTargetTime(new Date(now));
  }, [now, quickPick]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('relf.favs', JSON.stringify(favorites));
  }, [favorites]);

  // Persist category filters
  useEffect(() => {
    localStorage.setItem('relf.cats', JSON.stringify(enabledCategories));
  }, [enabledCategories]);

  // Persist 立體化差異 toggle
  useEffect(() => {
    localStorage.setItem('relf.grades', JSON.stringify(showGrades));
  }, [showGrades]);

  // Persist favorites collapse state
  useEffect(() => {
    localStorage.setItem('relf.favsCollapsed', JSON.stringify(favCollapsed));
  }, [favCollapsed]);

  // Persist detailed-naming toggle
  useEffect(() => {
    localStorage.setItem('relf.detailedNaming', JSON.stringify(useDetailedNaming));
  }, [useDetailedNaming]);

  const toggleCategory = (cat) => {
    setEnabledCategories(prev => prev.includes(cat)
      ? prev.filter(c => c !== cat)
      : [...prev, cat]);
  };

  // Default GPS: try geolocation once
  useEffect(() => {
    const defaults = {
      taiwan: { lat: 25.0478, lng: 121.5170 },
      japan:  { lat: 35.6812, lng: 139.7671 },
    };
    if (!location) setLocationAuto(defaults[region]);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setLocationAuto({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, () => {}, { timeout: 5000, maximumAge: 300000 });
    }
    // eslint-disable-next-line
  }, []);

  // When region changes, reset location to region default
  const switchRegion = (r) => {
    setRegion(r);
    const defaults = {
      taiwan: { lat: 25.0478, lng: 121.5170 },
      japan:  { lat: 35.6812, lng: 139.7671 },
    };
    setLocationAuto(defaults[r]);
    setTypeFilters([]);
  };

  // ============= COMPUTE LINE CANDIDATES =============
  // All lines within tolerance, sorted by distance. The first is the default
  // active line; the user can switch via the chip row in the train sheet.
  const [activeLineId, setActiveLineId] = useState(null);
  const visibleLines = useMemo(() =>
    RAIL_DATA[region].lines.filter(l => enabledCategories.includes(l.category)),
    [region, enabledCategories]);
  const visibleLineIds = useMemo(() => new Set(visibleLines.map(l => l.id)), [visibleLines]);
  const { candidates, offRail } = useMemo(() => {
    if (!location) return { candidates: [], offRail: null };
    const lines = visibleLines;
    if (lines.length === 0) return { candidates: [], offRail: null };
    const all = lines
      .map(line => ({ ...RailUtil.closestOnLine(location, line), line }))
      .sort((a, b) => a.dist - b.dist);
    const best = all[0];
    if (!best) return { candidates: [], offRail: null };
    if (best.dist > MAX_SNAP_DIST_KM) {
      return { candidates: [], offRail: { lineName: best.line.name, dist: best.dist } };
    }
    const candidates = all.filter(c =>
      c.dist <= MAX_SNAP_DIST_KM && c.dist <= best.dist + CANDIDATE_GRACE_KM
    );
    return { candidates, offRail: null };
  }, [location, visibleLines]);

  // Keep activeLineId in sync with the candidates list. The sentinel 'all'
  // (multi-line aggregation) is preserved across candidate changes.
  useEffect(() => {
    if (candidates.length === 0) {
      if (activeLineId !== null) setActiveLineId(null);
      return;
    }
    if (activeLineId === 'all') return;
    if (!activeLineId || !candidates.some(c => c.line.id === activeLineId)) {
      setActiveLineId(candidates[0].line.id);
    }
  }, [candidates, activeLineId]);

  // The nearest snap point used for panel/map UI. In 'all' mode this still
  // points to the closest line so the "最近的鐵軌" card and the dashed
  // connector keep showing the user's actual nearest rail.
  const nearest = useMemo(() => {
    if (candidates.length === 0) return null;
    if (activeLineId === 'all') return candidates[0];
    return candidates.find(c => c.line.id === activeLineId) || candidates[0];
  }, [candidates, activeLineId]);

  // Trains on the active line(s), with time-of-passage at each line's snap
  // point. Uses each train's pre-computed kinematic segments (from
  // rail-data.js TrainGen) so the snap-point pass time accounts for
  // accel/cruise/decel and any dwell at adjacent stations. When activeLineId
  // is 'all', the sheet aggregates trains from every candidate line, each
  // using its own per-line snap point.
  const activeCandidates = useMemo(() => {
    if (candidates.length === 0) return [];
    if (activeLineId === 'all') return candidates;
    const c = candidates.find(c => c.line.id === activeLineId);
    return c ? [c] : [candidates[0]];
  }, [candidates, activeLineId]);
  const trains = useMemo(() => {
    if (activeCandidates.length === 0) return [];
    const dayTrains = TrainGen.generate(region, targetTime);
    const candidateByLine = new Map(activeCandidates.map(c => [c.line.id, c]));
    const out = [];
    const EPS_KM = 1e-6;
    dayTrains.forEach(train => {
      const snap = candidateByLine.get(train.line.id);
      if (!snap) return;
      const stops = train.stops;
      const segs = train.segments;
      let passTime = null, prevStop = null, nextStop = null;

      // Locate the segment whose canonical km range brackets snap.km.
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        const lo = Math.min(seg.kmStartCanonical, seg.kmEndCanonical);
        const hi = Math.max(seg.kmStartCanonical, seg.kmEndCanonical);
        if (snap.km < lo - EPS_KM || snap.km > hi + EPS_KM) continue;

        // Snap-on-station handling: if the snap point sits at the segment's
        // start station with nonzero dwell, the train is dwelling — passTime
        // = arrival of that station.
        if (Math.abs(snap.km - seg.kmStartCanonical) < EPS_KM && stops[i].dwellSec > 0) {
          passTime = stops[i].arrival;
          prevStop = stops[i];
          nextStop = stops[i+1];
          break;
        }
        // Convert canonical km → directional local km within segment, then
        // invert the kinematic profile to get τ.
        const xLocalKm = Math.abs(snap.km - seg.kmStartCanonical);
        const tau = RailUtil.timeAtKmInProfile(seg.kin, xLocalKm * 1000);
        passTime = new Date(seg.tDepart.getTime() + tau * 1000);
        prevStop = stops[i];
        nextStop = stops[i+1];
        break;
      }
      if (!passTime) return;
      // Drop already-passed trains so the sheet only shows upcoming ones.
      // A 30-second grace lets a train still appear briefly while it crosses
      // the snap point, but after that it is hidden.
      if (passTime - targetTime < -30 * 1000) return;
      out.push({ ...train, passTime, prevStop, nextStop, snap });
    });
    out.sort((a, b) => a.passTime - b.passTime);
    return out;
  }, [activeCandidates, region, targetTime]);

  // Apply filters
  const filteredTrains = useMemo(() => {
    return trains.filter(t => {
      if (dirFilter !== 'all' && t.direction !== dirFilter) return false;
      if (typeFilters.length > 0 && !typeFilters.includes(t.type)) return false;
      return true;
    });
  }, [trains, dirFilter, typeFilters]);

  // Unique types on nearest line
  const availableTypes = useMemo(() => {
    const set = new Set();
    trains.forEach(t => set.add(t.type));
    return Array.from(set);
  }, [trains]);

  // ============= LIVE TRAINS (showing on map within ±30 min of now) =============
  // Uses pre-computed kinematic segments to evaluate position at time T,
  // including dwell-window detection so markers freeze briefly at stations.
  const liveTrains = useMemo(() => {
    if (!nearest) return [];
    const dayTrains = TrainGen.generate(region, targetTime);
    const windowMs = 30 * 60 * 1000;
    const result = [];
    dayTrains.forEach(train => {
      if (!visibleLineIds.has(train.line.id)) return;
      const start = train.startTime.getTime();
      const end = train.endTime.getTime();
      const T = targetTime.getTime();
      if (T < start - windowMs || T > end + windowMs) return;
      if (T < start || T > end) return; // only those currently running

      const stops = train.stops;
      const segs = train.segments;

      // Dwell window: train is sitting at stops[i] between arrival and departure.
      let phase = null, km = null;
      for (let i = 0; i < stops.length; i++) {
        const s = stops[i];
        if (s.dwellSec > 0 && T >= s.arrival.getTime() && T <= s.departure.getTime()) {
          phase = 'dwelling';
          km = s.km;
          break;
        }
      }
      // Otherwise locate the segment T falls into and evaluate kmAtTimeInProfile.
      if (km == null) {
        for (let i = 0; i < segs.length; i++) {
          const seg = segs[i];
          const tD = seg.tDepart.getTime(), tA = seg.tArrive.getTime();
          if (T >= tD && T <= tA) {
            const tau = (T - tD) / 1000;
            const xLocalM = RailUtil.kmAtTimeInProfile(seg.kin, tau);
            const xLocalKm = xLocalM / 1000;
            // Canonical km grows or shrinks with the direction; pick sign from
            // the segment's canonical endpoints.
            const dirSign = seg.kmEndCanonical >= seg.kmStartCanonical ? 1 : -1;
            km = seg.kmStartCanonical + dirSign * xLocalKm;
            phase = 'running';
            break;
          }
        }
      }
      if (km == null) return;
      const pos = RailUtil.positionAtKm(train.line, km);
      // Heading: compass bearing of travel direction at this point along the
      // polyline. Sample ±25 m on either side of the train (in canonical km
      // along the line, signed by travel direction) and take the great-circle
      // bearing from A→B. Used to rotate the top-down train icon on the map.
      const dirSign = train.direction === 'up' ? 1 : -1;
      const probe = 0.025;
      const a = RailUtil.positionAtKm(train.line, km - dirSign * probe);
      const b = RailUtil.positionAtKm(train.line, km + dirSign * probe);
      const φ1 = a.lat * Math.PI / 180;
      const φ2 = b.lat * Math.PI / 180;
      const Δλ = (b.lng - a.lng) * Math.PI / 180;
      const y = Math.sin(Δλ) * Math.cos(φ2);
      const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
      let heading = Math.atan2(y, x) * 180 / Math.PI;
      if (!isFinite(heading)) heading = 0;
      heading = (heading + 360) % 360;
      result.push({ ...train, livePos: pos, liveKm: km, phase, heading });
    });
    return result;
  }, [region, targetTime, nearest, visibleLineIds]);

  // ============= HANDLERS =============
  const [flyTo, setFlyTo] = useState(null); // {lat, lng, ts} — triggers map flyTo
  const pickFromMap = (latlng) => {
    setLocationAuto({ lat: latlng.lat, lng: latlng.lng });
  };
  // Fly the map to a train's best-known position. Map markers carry livePos
  // directly; sheet entries do not, so we look up the matching live train by
  // id, falling back to the user's snap point and finally the first stop.
  const flyToTrain = useCallback((train) => {
    if (!train) return;
    let pos = train.livePos || null;
    if (!pos) {
      const live = liveTrains.find(l => l.id === train.id);
      if (live) pos = live.livePos;
    }
    if (!pos && nearest && train.passTime instanceof Date) {
      pos = { lat: nearest.lat, lng: nearest.lng };
    }
    if (!pos && train.stops && train.stops[0]) {
      pos = { lat: train.stops[0].lat, lng: train.stops[0].lng };
    }
    if (pos) setFlyTo({ lat: pos.lat, lng: pos.lng, ts: Date.now() });
  }, [liveTrains, nearest]);
  const useGeolocation = () => {
    if (!navigator.geolocation) {
      pushNotice('瀏覽器不支援定位功能,請改用搜尋或在地圖上點選位置。', { level: 'warn', key: 'geo-unsupported' });
      return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude, lng = pos.coords.longitude;
      setLocationAuto({ lat, lng });
      setFlyTo({ lat, lng, ts: Date.now() });
    }, err => {
      // Map common GeolocationPositionError codes to short, actionable text.
      let msg = '定位失敗,請改用搜尋或在地圖上點選位置。';
      if (err && err.code === 1) msg = '已拒絕定位權限,請改用搜尋或在地圖上點選位置。';
      else if (err && err.code === 2) msg = '無法取得目前位置(可能無 GPS / 網路訊號)。';
      else if (err && err.code === 3) msg = '定位逾時,請稍後再試。';
      pushNotice(msg, { level: 'error', key: 'geo-failed' });
    }, { enableHighAccuracy: true });
  };
  const FAV_LIMIT = 10;
  const [favLimitPrompt, setFavLimitPrompt] = useState(null); // {entry} when full
  const [favEditingId, setFavEditingId] = useState(null);
  // Initial auto-name from local rail-data only. Nominatim reverse runs async
  // afterwards (see refineFavoriteNameAsync) and overwrites the placeholder
  // unless the user has manually renamed it (entry.auto === false).
  const autoNameFavorite = (loc) => {
    let bestStation = null, bestDist = Infinity;
    const lines = (RAIL_DATA[region] && RAIL_DATA[region].lines) || [];
    for (const line of lines) {
      for (const st of (line.stations || [])) {
        const d = RailUtil.haversine(loc, st);
        if (d < bestDist) { bestDist = d; bestStation = st; }
      }
    }
    if (bestStation && bestDist <= 1.5) return { name: `${bestStation.name}站`, locked: true };
    return { name: `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`, locked: false };
  };
  // Map a Nominatim /reverse response to a name following the priority order
  // 車站 → 景點 → 地標 → 建築 → 商家 → 道路 → 村里. Returns null if no usable
  // field is present.
  const pickPoiName = (j) => {
    if (!j) return null;
    const cls = j.class, type = j.type;
    const nd = j.namedetails || {};
    const name = nd.name || nd['name:zh'] || nd['name:zh-Hant'] || nd['name:ja'] || j.name;
    const addr = j.address || {};
    if (cls === 'railway' && /station|halt|tram_stop|subway_entrance/.test(type || '')) {
      if (name) return /[站駅]$/.test(name) ? name : `${name}站`;
    }
    if (cls === 'tourism' || (cls === 'leisure' && /park|garden|nature_reserve/.test(type || ''))) {
      if (name) return name;
    }
    if (cls === 'historic' || cls === 'man_made') {
      if (name) return name;
    }
    if (cls === 'building') {
      if (name) return name;
    }
    if (cls === 'shop' || cls === 'amenity' || cls === 'office' || cls === 'craft') {
      if (name) return name;
      if (addr.shop) return addr.shop;
      if (addr.amenity) return addr.amenity;
    }
    if (cls === 'highway' || addr.road) {
      return name || addr.road || null;
    }
    const village = addr.village || addr.neighbourhood || addr.suburb || addr.hamlet
      || addr.quarter || addr.city_district || addr.town;
    if (village) return village;
    return name || null;
  };
  // Aggressive variant of pickPoiName for the bulk "詳細命名" action.
  // Applies the priority 車站 → 景點 → 地標 → 建築 → 商家+地名 → 道路 → 鄉鎮村里
  // and concatenates a place suffix for shops so they aren't ambiguous.
  const pickDetailedName = (j) => {
    if (!j) return null;
    const cls = j.class, type = j.type;
    const nd = j.namedetails || {};
    const langName = (region === 'japan')
      ? (nd['name:ja'] || nd['name:zh-Hant'] || nd['name:zh'] || nd.name || j.name)
      : (nd['name:zh-Hant'] || nd['name:zh'] || nd['name:ja'] || nd.name || j.name);
    const addr = j.address || {};
    const place = addr.suburb || addr.neighbourhood || addr.village || addr.quarter
      || addr.city_district || addr.town || addr.hamlet || null;
    if (cls === 'railway' && /station|halt|tram_stop|subway_entrance/.test(type || '')) {
      if (langName) return /[站駅]$/.test(langName) ? langName : `${langName}站`;
    }
    if (cls === 'tourism' || (cls === 'leisure' && /park|garden|nature_reserve|stadium/.test(type || ''))) {
      if (langName) return langName;
    }
    if (cls === 'historic' || cls === 'man_made') {
      if (langName) return langName;
    }
    if (cls === 'building' && langName) return langName;
    if (cls === 'shop' || cls === 'amenity' || cls === 'office' || cls === 'craft') {
      const shopName = langName || addr.shop || addr.amenity || null;
      if (shopName) return place ? `${shopName}・${place}` : shopName;
    }
    if (addr.road) return langName && langName !== addr.road ? `${langName}（${addr.road}）` : addr.road;
    if (place) return place;
    return langName || null;
  };
  const refineFavoriteNameAsync = async (id, lat, lng, detailed) => {
    const lang = region === 'japan' ? 'ja,zh-TW,en' : 'zh-TW,ja,en';
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&extratags=1&namedetails=1&accept-language=${lang}`;
    try {
      const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!r.ok) return;
      const j = await r.json();
      const name = (detailed ? pickDetailedName(j) : pickPoiName(j));
      if (!name) return;
      setFavorites(prev => prev.map(f =>
        (f.id === id && f.auto) ? { ...f, name } : f));
    } catch { /* network failure: keep placeholder */ }
  };

  // Same naming pipeline as favorites, applied to the "current location" pin:
  // 1) instant local rail-data lookup (autoNameFavorite), 2) async Nominatim
  // refine (pickPoiName). A monotonically-increasing stamp protects against a
  // newer location committing while an older refine is still in flight.
  const locStampRef = useRef(0);
  const refineLocationNameAsync = async (lat, lng, stamp) => {
    const lang = region === 'japan' ? 'ja,zh-TW,en' : 'zh-TW,ja,en';
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&extratags=1&namedetails=1&accept-language=${lang}`;
    try {
      const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!r.ok) return;
      const j = await r.json();
      const name = pickPoiName(j);
      if (!name) return;
      if (locStampRef.current !== stamp) return;
      setLocation(prev => (prev && prev.lat === lat && prev.lng === lng) ? { ...prev, name } : prev);
    } catch { /* network failure: keep quick name */ }
  };
  const setLocationAuto = (loc) => {
    if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') return;
    const stamp = ++locStampRef.current;
    const { name, locked } = autoNameFavorite(loc);
    setLocation({ lat: loc.lat, lng: loc.lng, name });
    if (!locked) refineLocationNameAsync(loc.lat, loc.lng, stamp);
  };
  const addFavorite = () => {
    if (!location) return;
    if (favorites.some(f => f.lat === location.lat && f.lng === location.lng)) return;
    const { name, locked } = autoNameFavorite(location);
    const entry = {
      lat: location.lat, lng: location.lng, name,
      auto: !locked, // user-rename / async-refine only when the placeholder is generic
      id: Date.now() + Math.floor(Math.random() * 1000),
    };
    if (favorites.length >= FAV_LIMIT) {
      setFavLimitPrompt({ entry });
      return;
    }
    setFavorites([...favorites, entry]);
    if (!locked) refineFavoriteNameAsync(entry.id, entry.lat, entry.lng, useDetailedNaming);
  };
  const removeFavorite = (id) => setFavorites(favorites.filter(f => f.id !== id));
  const renameFavorite = (id, name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    setFavorites(prev => prev.map(f => f.id === id ? { ...f, name: trimmed, auto: false } : f));
  };
  const pickFavorite = (f) => {
    if (!f || typeof f.lat !== 'number' || typeof f.lng !== 'number') return;
    setLocation({ lat: f.lat, lng: f.lng, name: f.name });
    setFlyTo({ lat: f.lat, lng: f.lng, ts: Date.now() });
  };
  const replaceFavoriteWith = (replaceId) => {
    if (!favLimitPrompt) return;
    const { entry } = favLimitPrompt;
    setFavorites(favorites.map(f => f.id === replaceId ? entry : f));
    setFavLimitPrompt(null);
    if (entry.auto) refineFavoriteNameAsync(entry.id, entry.lat, entry.lng, useDetailedNaming);
  };
  const cancelFavLimitPrompt = () => setFavLimitPrompt(null);
  const copyFavoriteCoords = (f, btn) => {
    const text = `${f.lat.toFixed(6)}, ${f.lng.toFixed(6)}`;
    const flash = (ok) => {
      if (!btn) return;
      btn.classList.remove('copied', 'failed');
      void btn.offsetWidth;
      btn.classList.add(ok ? 'copied' : 'failed');
      setTimeout(() => btn.classList.remove('copied', 'failed'), 1200);
    };
    const fallback = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        flash(ok);
      } catch { flash(false); }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => flash(true), fallback);
    } else {
      fallback();
    }
  };

  const handleQuickPick = (kind) => {
    setQuickPick(kind);
    if (kind !== 'now') setLastPredictPick(kind);
    const d = new Date();
    if (kind === 'now') setTargetTime(d);
    else if (kind === '30') setTargetTime(new Date(d.getTime() + 30*60000));
    else if (kind === '60') setTargetTime(new Date(d.getTime() + 60*60000));
    else if (kind === 'custom' && customTimeRef.current) {
      setTargetTime(new Date(customTimeRef.current));
    }
  };

  // Used by the date/time inputs and the slider — keeps the remembered
  // custom time in sync with whatever the user just picked.
  const setCustomTarget = (d) => {
    customTimeRef.current = d;
    setTargetTime(d);
    setQuickPick('custom');
    setLastPredictPick('custom');
  };

  return React.createElement(React.Fragment, null,
    React.createElement(Toolbar, {
      region, switchRegion,
      onMenu: () => setPanelOpen(!panelOpen),
      panelOpen,
      panelCollapsed, togglePanel: () => setPanelCollapsed(!panelCollapsed),
    }),
    React.createElement("div", { className: "main " + (panelCollapsed ? "panel-hidden" : "") },
      React.createElement("div", {
        className: "panel-backdrop " + (panelOpen ? "show" : ""),
        onClick: () => setPanelOpen(false),
      }),
      React.createElement(Panel, {
        open: panelOpen, collapsed: panelCollapsed,
        onClose: () => setPanelOpen(false),
        region, location, setLocation, pickFromMap,
        useGeolocation, favorites, addFavorite, removeFavorite, pickFavorite, copyFavoriteCoords,
        renameFavorite, favEditingId, setFavEditingId,
        favCollapsed, setFavCollapsed,
        useDetailedNaming, setUseDetailedNaming,
        targetTime, setTargetTime, setCustomTarget, quickPick, handleQuickPick, setQuickPick,
        now, nearest, offRail, timeFocusTick,
        enabledCategories, toggleCategory,
        showGrades, setShowGrades,
      }),
      React.createElement(MapArea, {
        region, location, nearest, liveTrains, targetTime, now,
        quickPick, handleQuickPick, lastPredictPick,
        visibleLines,
        mapLayer, setMapLayer,
        showGrades,
        onMapClick: pickFromMap,
        onLocate: useGeolocation,
        flyTo,
        onTrainClick: setSelectedTrain,
        pushNotice,
        onHudClick: () => {
          // Open the sidebar (mobile) or unhide it (desktop), then focus its time control.
          setPanelCollapsed(false);
          setPanelOpen(true);
          setTimeFocusTick(t => t + 1);
        },
      }),
      React.createElement(TrainSheet, {
        collapsed: sheetCollapsed,
        onToggle: () => setSheetCollapsed(!sheetCollapsed),
        nearest, offRail, candidates, activeLineId, setActiveLineId,
        trains: filteredTrains, totalCount: trains.length,
        liveTrainCount: liveTrains.length,
        dirFilter, setDirFilter,
        typeFilters, setTypeFilters, availableTypes,
        targetTime, onSelect: setSelectedTrain,
      }),
    ),
    selectedTrain && React.createElement(TrainModal, {
      train: selectedTrain, nearest, targetTime,
      onClose: () => setSelectedTrain(null),
      onFlyToTrain: (t) => { flyToTrain(t); setSelectedTrain(null); },
    }),
    favLimitPrompt && React.createElement(FavLimitModal, {
      pending: favLimitPrompt.entry,
      favorites,
      onReplace: replaceFavoriteWith,
      onCancel: cancelFavLimitPrompt,
      limit: FAV_LIMIT,
    }),
    React.createElement(NoticeStack, { notices, onDismiss: dismissNotice }),
  );
}

// ============================================================
// NOTICE STACK — transient banners for failure / info messages
// (geolocation, tile errors, etc.). Placed at top-center of the
// viewport above the map so it does not push layout when shown.
// ============================================================
function NoticeStack({ notices, onDismiss }) {
  if (!notices || notices.length === 0) return null;
  return React.createElement("div", { className: "notice-stack", role: "status", "aria-live": "polite" },
    notices.map(n =>
      React.createElement("div", {
        key: n.id,
        className: "notice notice-" + (n.level || 'info'),
      },
        React.createElement(Icon, {
          id: n.level === 'error' ? "me-close" : (n.level === 'warn' ? "me-locate" : "me-info"),
          size: 14,
        }),
        React.createElement("span", { className: "notice-text" }, n.text),
        React.createElement("button", {
          className: "notice-dismiss",
          onClick: () => onDismiss(n.id),
          "aria-label": "關閉提示",
        }, React.createElement(Icon, { id: "me-close", size: 12 })),
      )
    )
  );
}

// ============================================================
// TOOLBAR
// ============================================================
function Toolbar({ region, switchRegion, onMenu, panelOpen, panelCollapsed, togglePanel }) {
  const regions = [['taiwan','🇹🇼 台灣 Taiwan'], ['japan','🇯🇵 日本 Japan']];
  return React.createElement("header", { className: "toolbar" },
    React.createElement("button", {
      className: "tb-tool tb-menu-btn" + (panelOpen ? " active" : ""),
      onClick: onMenu, title: panelOpen ? "收起面板" : "展開面板",
    }, React.createElement(Icon, { id: panelOpen ? "me-close" : "me-menu", size: 20 })),
    React.createElement("button", {
      className: "tb-tool tb-collapse-btn",
      onClick: togglePanel, title: panelCollapsed ? "展開側欄" : "收起側欄",
    }, React.createElement(Icon, { id: panelCollapsed ? "me-chevron-down" : "me-chevron-up", size: 20 })),
    React.createElement("div", { className: "tb-logo" },
      React.createElement("img", { src: "assets/logo-mark.svg", alt: "" }),
      React.createElement("div", null,
        React.createElement("div", { className: "tb-logo-title" }, "Railway Elf"),
        React.createElement("div", { className: "tb-logo-sub" }, "列車經過預測"),
      ),
    ),
    React.createElement("div", { className: "tb-region-select" },
      React.createElement("select", {
        value: region,
        onChange: (e) => switchRegion(e.target.value),
        "aria-label": "選擇地區",
      }, regions.map(([k,label]) => React.createElement("option", { key: k, value: k }, label))),
      React.createElement(Icon, { id: "me-chevron-down", size: 16 }),
    ),
    React.createElement("div", { className: "tb-spacer" }),
    React.createElement("button", { className: "tb-tool", title: "說明" },
      React.createElement(Icon, { id: "me-info", size: 20 })),
  );
}

// ============================================================
// LEFT PANEL (controls)
// ============================================================
function Panel(props) {
  const {
    open, collapsed, onClose, region, location, setLocation, useGeolocation,
    favorites, addFavorite, removeFavorite, pickFavorite, copyFavoriteCoords,
    renameFavorite, favEditingId, setFavEditingId,
    favCollapsed, setFavCollapsed,
    useDetailedNaming, setUseDetailedNaming,
    targetTime, setTargetTime, setCustomTarget, quickPick, handleQuickPick, setQuickPick,
    now, nearest, offRail, timeFocusTick,
    enabledCategories, toggleCategory,
    showGrades, setShowGrades,
  } = props;
  // Ref to the time-control section so we can scroll & flash it when the map HUD is clicked.
  const timeSectionRef = useRef(null);
  useEffect(() => {
    if (!timeFocusTick) return;
    const el = timeSectionRef.current;
    if (!el) return;
    // Use the panel's own scroll container instead of scrollIntoView (which can shift the whole page).
    const panel = el.closest('.panel');
    if (panel) {
      const top = el.offsetTop - 8;
      panel.scrollTo({ top, behavior: 'smooth' });
    }
    el.classList.remove('flash');
    // Force reflow so the animation restarts even on repeated clicks.
    void el.offsetWidth;
    el.classList.add('flash');
    const dateInput = el.querySelector('input[type="date"]');
    if (dateInput) {
      // Defer focus until after the smooth scroll begins so iOS doesn't fight it.
      setTimeout(() => { try { dateInput.focus({ preventScroll: true }); } catch { dateInput.focus(); } }, 250);
    }
  }, [timeFocusTick]);
  // Swipe-left to close (mobile). Skip when the touch starts on a control
  // that owns its own horizontal drag (range sliders, custom sliders, or
  // anything tagged data-no-swipe) — otherwise dragging the thumb leftward
  // closes the panel mid-gesture.
  const touchRef = useRef({ x: 0, y: 0, active: false });
  const onTouchStart = (e) => {
    if (e.target.closest && e.target.closest('input, textarea, [contenteditable="true"], [role="slider"], [data-no-swipe]')) {
      touchRef.current.active = false;
      return;
    }
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, active: true };
  };
  const onTouchMove = (e) => {
    if (!touchRef.current.active) return;
    const t = e.touches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    // Require a stronger horizontal commitment so a slightly diagonal slider
    // drag isn't mis-read as a panel swipe.
    if (dx < -60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      touchRef.current.active = false;
      onClose && onClose();
    }
  };
  const onTouchEnd = () => { touchRef.current.active = false; };
  return React.createElement("aside", {
    className: "panel " + (open ? "open " : "") + (collapsed ? "collapsed" : ""),
    onTouchStart, onTouchMove, onTouchEnd,
  },
    // SEARCH SECTION
    React.createElement("div", { className: "panel-section" },
      React.createElement(SearchBox, { onSelect: (loc) => { setLocation(loc); onClose && onClose(); } }),
      React.createElement("div", { className: "search-actions" },
        React.createElement("button", { className: "btn-soft", onClick: useGeolocation },
          React.createElement(Icon, { id: "me-locate", size: 14 }), "使用我的位置"),
        React.createElement("button", {
          className: "btn-soft accent", onClick: addFavorite, disabled: !location,
        }, React.createElement(Icon, { id: "me-waypoint", size: 14 }), "加入收藏"),
      ),
      location && React.createElement("div", {
        style: {
          marginTop: 10,
          padding: '8px 10px',
          background: 'var(--me-bg-tertiary)',
          border: '1px solid var(--me-border)',
          borderRadius: 'var(--me-radius-sm)',
          fontSize: 12,
        },
      },
        React.createElement("div", { style: { color: 'var(--me-text-primary)', marginBottom: 2 } }, location.name),
        React.createElement("div", {
          style: { fontFamily: 'var(--me-font-mono)', fontSize: 11, color: 'var(--me-text-muted)' },
        }, `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`),
      ),
    ),

    // FAVORITES (above rail-type so it stays close to the "加入收藏" button)
    favorites.length > 0 && React.createElement("div", { className: "panel-section" },
      React.createElement("button", {
        type: "button",
        className: "ps-header ps-header-toggle",
        onClick: () => setFavCollapsed && setFavCollapsed(v => !v),
        "aria-expanded": !favCollapsed,
        "aria-controls": "fav-list-region",
      },
        React.createElement("div", { className: "ps-title" },
          React.createElement(Icon, { id: "me-alternatives", size: 16 }),
          "我的收藏",
          React.createElement("span", { className: "ps-count" }, `(${favorites.length})`),
        ),
        React.createElement(Icon, {
          id: favCollapsed ? "me-chevron-down" : "me-chevron-up",
          size: 16,
        }),
      ),
      !favCollapsed && React.createElement("div", { id: "fav-list-region" },
        React.createElement("div", { className: "fav-actions" },
          React.createElement("button", {
            type: "button",
            role: "switch",
            "aria-checked": !!useDetailedNaming,
            className: "fav-detailed-switch" + (useDetailedNaming ? " on" : ""),
            onClick: () => setUseDetailedNaming && setUseDetailedNaming(v => !v),
            title: "開啟後，新加入的收藏會依車站/景點/地標/建築/商家/道路/鄉鎮村里順序命名",
          },
            React.createElement("span", { className: "fav-detailed-track" },
              React.createElement("span", { className: "fav-detailed-thumb" }),
            ),
            React.createElement("span", { className: "fav-detailed-label" }, "詳細命名"),
          ),
        ),
        React.createElement("div", { className: "fav-list" },
          favorites.map(f =>
            React.createElement(FavItem, {
              key: f.id,
              fav: f,
              editing: favEditingId === f.id,
              onPick: () => { pickFavorite(f); if (onClose) setTimeout(onClose, 0); },
              onCopy: (btn) => copyFavoriteCoords(f, btn),
              onRemove: () => removeFavorite(f.id),
              onStartEdit: () => setFavEditingId && setFavEditingId(f.id),
              onCancelEdit: () => setFavEditingId && setFavEditingId(null),
              onCommitEdit: (name) => {
                renameFavorite && renameFavorite(f.id, name);
                setFavEditingId && setFavEditingId(null);
              },
            })
          )
        ),
      ),
    ),

    // CATEGORY FILTERS
    React.createElement("div", { className: "panel-section rail-type-section" },
      React.createElement("div", { className: "ps-header" },
        React.createElement("div", { className: "ps-title" },
          React.createElement(Icon, { id: "me-route", size: 16 }),
          "鐵道類型",
        ),
      ),
      React.createElement("div", { className: "pill-group" },
        RAIL_CATEGORIES.map(c =>
          React.createElement("button", {
            key: c.key,
            className: "pill " + (enabledCategories.includes(c.key) ? 'active' : ''),
            onClick: () => toggleCategory(c.key),
            "aria-pressed": enabledCategories.includes(c.key),
          },
            React.createElement("span", {
              className: "pill-check",
              style: {
                width: 12, height: 12, borderRadius: 3,
                border: '1px solid currentColor',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, lineHeight: 1, marginRight: 2,
              },
            }, enabledCategories.includes(c.key) ? '✓' : ''),
            c.label,
          )
        ),
      ),
      // 立體化差異 (ground / underground / elevated)
      React.createElement("div", { className: "pill-group", style: { marginTop: 8 } },
        React.createElement("button", {
          className: "pill " + (showGrades ? 'active' : ''),
          onClick: () => setShowGrades(v => !v),
          "aria-pressed": !!showGrades,
          title: "顯示路線地下化 / 高架化區段差異",
        },
          React.createElement("span", {
            className: "pill-check",
            style: {
              width: 12, height: 12, borderRadius: 3,
              border: '1px solid currentColor',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, lineHeight: 1, marginRight: 2,
            },
          }, showGrades ? '✓' : ''),
          "顯示立體化差異",
        ),
      ),
      showGrades && React.createElement("div", { className: "rail-grade-legend" },
        React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement("span", { style: { display: 'inline-block', width: 28, height: 3, background: 'currentColor', opacity: 0.95 } }),
          "平面",
        ),
        React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement("span", {
            style: {
              display: 'inline-block', width: 28, height: 6,
              background: '#0f1117',
              backgroundImage: 'repeating-linear-gradient(to right, currentColor 0 10px, transparent 10px 17px)',
            },
          }),
          "地下化(暗色凹槽 + 虛線)",
        ),
        React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement("span", {
            style: {
              display: 'inline-block', width: 28, height: 3,
              backgroundImage: 'repeating-linear-gradient(to right, currentColor 0 4px, transparent 4px 9px)',
            },
          }),
          "山岳隧道(短虛線)",
        ),
        React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement("span", {
            style: {
              display: 'inline-block', width: 28, height: 5,
              background: 'currentColor',
              boxShadow: '0 0 0 2px rgba(255,255,255,0.55)',
            },
          }),
          "高架化(白色光暈)",
        ),
      ),
    ),

    // TIME CONTROL
    React.createElement("div", { className: "panel-section", ref: timeSectionRef },
      React.createElement("div", { className: "ps-header" },
        React.createElement("div", { className: "ps-title" },
          React.createElement(Icon, { id: "me-clock", size: 16 }),
          "預測時間",
        ),
      ),
      React.createElement("div", { className: "now-row" },
        React.createElement("span", { className: "now-row-label" }, "現在時間"),
        React.createElement("span", { className: "now-row-date" }, sameDayISO(now)),
        React.createElement("span", { className: "now-row-time" }, formatClock(now)),
        React.createElement("button", {
          className: "now-row-sync",
          onClick: () => handleQuickPick('now'),
          title: "同步到現在",
          disabled: quickPick === 'now',
        }, "同步"),
      ),
      React.createElement("div", { className: "time-row" },
        React.createElement("label", { className: "time-field" },
          React.createElement("span", { className: "time-field-label" }, "日期"),
          React.createElement("input", {
            type: "date",
            value: sameDayISO(targetTime),
            onChange: (e) => {
              const [y,m,d] = e.target.value.split('-').map(Number);
              const nd = new Date(targetTime); nd.setFullYear(y, m-1, d);
              setCustomTarget(nd);
            },
          }),
        ),
        React.createElement("label", { className: "time-field" },
          React.createElement("span", { className: "time-field-label" }, "時間"),
          React.createElement("input", {
            type: "time",
            value: formatClock(targetTime),
            onChange: (e) => {
              const [h,m] = e.target.value.split(':').map(Number);
              const nd = new Date(targetTime); nd.setHours(h, m, 0, 0);
              setCustomTarget(nd);
            },
          }),
        ),
      ),
      React.createElement("div", { className: "time-quick" },
        [['now','現在'], ['30','+30分'], ['60','+1小時'], ['custom','自訂']].map(([k,label]) =>
          React.createElement("button", {
            key: k,
            className: quickPick === k ? "active" : "",
            onClick: () => handleQuickPick(k),
          }, label)
        ),
      ),
      React.createElement(TimeSlider, { targetTime, setCustomTarget }),
    ),

    // NEAREST RAIL
    React.createElement("div", { className: "panel-section" },
      React.createElement("div", { className: "ps-header" },
        React.createElement("div", { className: "ps-title" },
          React.createElement(Icon, { id: "me-route", size: 16 }),
          "最近的鐵軌",
        ),
      ),
      nearest ? React.createElement("div", { className: "nearest-card" },
        React.createElement("div", { className: "nearest-head" },
          React.createElement("span", { className: "nearest-label" }, "距離"),
          React.createElement("span", { className: "nearest-line" }, nearest.line.name),
        ),
        React.createElement("div", { className: "nearest-row" },
          React.createElement("span", { className: "nearest-dist" }, nearest.dist.toFixed(2)),
          React.createElement("span", { className: "nearest-unit" }, "公里"),
        ),
        React.createElement("div", { className: "nearest-detail" },
          React.createElement("span", null, "里程 ", nearest.km.toFixed(1), " km"),
          React.createElement("span", { className: "sep" }, "•"),
          React.createElement("span", { style: { color: nearest.line.color } },
            "● ", nearest.line.nameEn),
        ),
        nearest && React.createElement("div", { className: "nearest-links" },
          React.createElement("a", {
            className: "nearest-link",
            href: `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${nearest.lat},${nearest.lng}`,
            target: "_blank", rel: "noopener noreferrer",
          },
            React.createElement("span", { className: "nl-icon" }, "👁"),
            React.createElement("span", null, "Google 街景"),
          ),
          React.createElement("a", {
            className: "nearest-link",
            href: `https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lng}&travelmode=walking`,
            target: "_blank", rel: "noopener noreferrer",
          },
            React.createElement("span", { className: "nl-icon" }, "🧭"),
            React.createElement("span", null, "Google 導航"),
          ),
        ),
      ) : offRail
        ? React.createElement("div", { className: "nearest-empty" },
            React.createElement("div", { className: "nearest-empty-title" },
              "目前位置不在任何鐵道附近"),
            React.createElement("div", { className: "nearest-empty-detail" },
              `最近的「${offRail.lineName}」距離 ${offRail.dist.toFixed(1)} km。可以挑一個更靠近鐵道的位置。`),
          )
        : React.createElement("div", { className: "nearest-empty" },
            React.createElement("div", { className: "nearest-empty-title" }, "尚未選擇位置"),
            React.createElement("div", { className: "nearest-empty-detail" },
              "可以使用上方搜尋、按定位按鈕,或在地圖上直接點選一個位置。"),
          ),
    ),

    // ABOUT ME
    React.createElement("div", { className: "panel-section about-me" },
      React.createElement("div", { className: "ps-header" },
        React.createElement("div", { className: "ps-title" },
          React.createElement(Icon, { id: "me-info", size: 16 }),
          "About Me",
        ),
      ),
      React.createElement("div", { className: "about-name" }, "Chang Wei Lin"),
      React.createElement("blockquote", { className: "about-quote" },
        React.createElement("div", { className: "about-quote-zh" }, "我愛星空至深，無懼黑夜。"),
        React.createElement("div", { className: "about-quote-en" },
          "We have loved the stars too fondly to fear the dark."),
        React.createElement("cite", { className: "about-quote-cite" },
          "— ",
          React.createElement("span", { className: "about-quote-work" }, "The Old Astronomer"),
          ", Sarah Williams"),
      ),
      React.createElement("div", { className: "about-links" },
        [
          { href: "https://github.com/changweilin", label: "GitHub", host: "github.com" },
          { href: "https://www.linkedin.com/in/wei-lin-chang-ba38049a/", label: "LinkedIn", host: "linkedin.com" },
          { href: "https://changweilin.github.io/demo_link/", label: "Portfolio", host: "changweilin.github.io" },
        ].map(l =>
          React.createElement("a", {
            key: l.href,
            className: "about-link",
            href: l.href,
            target: "_blank",
            rel: "noopener noreferrer",
            title: l.href,
          },
            React.createElement(AboutFavicon, { host: l.host, label: l.label }),
            React.createElement("span", null, l.label),
          )
        ),
      ),
    ),
  );
}

// ============================================================
// ABOUT FAVICON — try Google s2, fall back to DuckDuckGo, then letter
// ============================================================
function AboutFavicon({ host, label }) {
  const sources = [
    `https://www.google.com/s2/favicons?domain=${host}&sz=64`,
    `https://icons.duckduckgo.com/ip3/${host}.ico`,
  ];
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  if (failed) {
    return React.createElement("span", {
      className: "about-favicon about-favicon-fallback",
      "aria-hidden": "true",
    }, (label || host).charAt(0).toUpperCase());
  }
  return React.createElement("img", {
    className: "about-favicon",
    src: sources[idx],
    alt: "",
    width: 16, height: 16, loading: "lazy",
    onError: () => {
      if (idx < sources.length - 1) setIdx(idx + 1);
      else setFailed(true);
    },
  });
}

// ============================================================
// SEARCH BOX (OSM Nominatim)
// ============================================================
function SearchBox({ onSelect }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!q.trim() || q.length < 2) { setResults([]); setErrorText(null); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setErrorText(null);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&accept-language=zh-TW,ja,en&q=${encodeURIComponent(q)}`;
        const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!r.ok) throw new Error(`Nominatim ${r.status}`);
        const data = await r.json();
        setResults(data);
        if (data.length === 0) setErrorText(null);
      } catch (e) {
        setResults([]);
        setErrorText('搜尋暫時無法使用,請稍後再試,或在地圖上直接點選位置。');
      } finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  const choose = (item) => {
    onSelect({ lat: parseFloat(item.lat), lng: parseFloat(item.lon), name: item.display_name.split(',')[0] });
    setQ(item.display_name.split(',')[0]);
    setOpen(false);
  };

  return React.createElement("div", { className: "search-wrap" },
    React.createElement(Icon, { id: "me-waypoint", size: 16 }),
    React.createElement("svg", {
      className: "search-icon", width: 16, height: 16, viewBox: "0 0 24 24",
    }, React.createElement("path", {
      d: "M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z",
      fill: "currentColor",
    })),
    React.createElement("input", {
      className: "search-input", placeholder: "搜尋地點、地標、車站…",
      value: q,
      onChange: (e) => { setQ(e.target.value); setOpen(true); },
      onFocus: () => setOpen(true),
      onBlur: () => setTimeout(() => setOpen(false), 200),
    }),
    q && React.createElement("button", { className: "search-clear", onClick: () => { setQ(''); setResults([]); setErrorText(null); } },
      React.createElement(Icon, { id: "me-close", size: 12 })),
    open && (loading || results.length > 0 || errorText) && React.createElement("div", { className: "search-results" },
      loading
        ? React.createElement("div", { className: "search-loading" }, "搜尋中…")
        : errorText
          ? React.createElement("div", { className: "search-error" }, errorText)
          : results.map(r => React.createElement("div", {
              key: r.place_id, className: "search-item", onMouseDown: () => choose(r),
            },
              React.createElement("div", { className: "search-item-icon" },
                React.createElement(Icon, { id: "me-waypoint", size: 14 })),
              React.createElement("div", { className: "search-item-main" },
                React.createElement("div", { className: "search-item-name" }, r.display_name.split(',')[0]),
                React.createElement("div", { className: "search-item-sub" }, r.display_name.split(',').slice(1).join(',').trim()),
              ),
            )),
    ),
  );
}

// ============================================================
// TIME SLIDER — hour-of-day for the target time
// ============================================================
function TimeSlider({ targetTime, setCustomTarget }) {
  const totalMin = targetTime.getHours() * 60 + targetTime.getMinutes();
  const pct = (totalMin / (24 * 60)) * 100;
  return React.createElement("div", { className: "time-slider" },
    React.createElement("div", { className: "time-slider-track" },
      React.createElement("div", { className: "time-slider-fill", style: { width: pct + '%' } }),
    ),
    React.createElement("div", { className: "time-slider-thumb", style: { left: pct + '%' } }),
    React.createElement("input", {
      type: "range", min: 0, max: 1439, step: 5, value: totalMin,
      onChange: (e) => {
        const v = parseInt(e.target.value, 10);
        const nd = new Date(targetTime);
        nd.setHours(Math.floor(v/60), v % 60, 0, 0);
        setCustomTarget(nd);
      },
    }),
    React.createElement("div", { className: "time-slider-ticks" },
      ['00','06','12','18','24'].map(t => React.createElement("span", { key: t }, t)),
    ),
  );
}

// Long names get faded out + marquee on hover. Detection is via scrollWidth
// vs clientWidth — re-measured on name/layout change via ResizeObserver.
function FavName({ name }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const [overflow, setOverflow] = useState(false);
  const [scrollPx, setScrollPx] = useState(0);
  useEffect(() => {
    const w = wrapRef.current, t = trackRef.current;
    if (!w || !t) return;
    const measure = () => {
      const diff = t.scrollWidth - w.clientWidth;
      setOverflow(diff > 2);
      setScrollPx(Math.max(0, diff));
    };
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure);
      ro.observe(w); ro.observe(t);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [name]);
  return React.createElement("div", {
    ref: wrapRef,
    className: "fav-name" + (overflow ? " fav-name-overflow" : ""),
    style: overflow ? { '--fav-scroll': scrollPx + 'px' } : null,
    title: name,
  },
    React.createElement("span", { ref: trackRef, className: "fav-name-track" }, name),
  );
}

// ============================================================
// FAVORITE ITEM — shows the favorite, with copy / rename / delete actions.
// In edit mode the name is replaced by an inline <input>; Enter commits and
// Escape / blur cancels.
// ============================================================
function FavItem({ fav, editing, onPick, onCopy, onRemove, onStartEdit, onCancelEdit, onCommitEdit }) {
  const [draft, setDraft] = useState(fav.name);
  const inputRef = useRef(null);
  useEffect(() => {
    if (editing) {
      setDraft(fav.name);
      const el = inputRef.current;
      if (el) { el.focus(); el.select(); }
    }
  }, [editing, fav.name]);
  const commit = () => onCommitEdit(draft);
  return React.createElement("div", {
    className: "fav-item" + (editing ? " editing" : ""),
    onClick: (e) => { if (editing) return; e.preventDefault(); onPick(); },
  },
    React.createElement("div", { className: "fav-icon" },
      React.createElement(Icon, { id: "me-waypoint", size: 14 })),
    editing
      ? React.createElement("input", {
          className: "fav-name-input",
          ref: inputRef,
          value: draft,
          onChange: (e) => setDraft(e.target.value),
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => {
            if (e.key === 'Enter') { e.preventDefault(); commit(); }
            else if (e.key === 'Escape') { e.preventDefault(); onCancelEdit(); }
          },
          onBlur: () => commit(),
          maxLength: 40,
          "aria-label": "收藏名稱",
        })
      : React.createElement(FavName, { name: fav.name }),
    React.createElement("button", {
      className: "fav-edit",
      title: editing ? "完成" : "重新命名",
      "aria-label": editing ? "完成" : "重新命名",
      onClick: (e) => { e.stopPropagation(); editing ? commit() : onStartEdit(); },
    }, React.createElement(Icon, { id: editing ? "me-fit" : "me-edit", size: 12 })),
    React.createElement("button", {
      className: "fav-copy",
      title: "複製座標",
      "aria-label": "複製座標",
      onClick: (e) => { e.stopPropagation(); onCopy(e.currentTarget); },
    }, React.createElement(Icon, { id: "me-copy", size: 12 })),
    React.createElement("button", {
      className: "fav-remove",
      title: "刪除收藏",
      "aria-label": "刪除收藏",
      onClick: (e) => { e.stopPropagation(); onRemove(); },
    }, React.createElement(Icon, { id: "me-close", size: 12 })),
  );
}

// ============================================================
// FAVORITE LIMIT MODAL
// ============================================================
function FavLimitModal({ pending, favorites, onReplace, onCancel, limit }) {
  return React.createElement("div", { className: "fav-modal-backdrop", onClick: onCancel },
    React.createElement("div", {
      className: "fav-modal",
      onClick: (e) => e.stopPropagation(),
    },
      React.createElement("div", { className: "fav-modal-header" },
        React.createElement("div", { className: "fav-modal-title" }, `收藏已達上限 ${limit} 個`),
        React.createElement("button", {
          className: "fav-modal-close", onClick: onCancel, "aria-label": "關閉",
        }, React.createElement(Icon, { id: "me-close", size: 16 })),
      ),
      React.createElement("div", { className: "fav-modal-body" },
        React.createElement("div", { className: "fav-modal-hint" },
          "請選擇要替換的收藏，將以新位置取代："),
        React.createElement("div", { className: "fav-modal-pending" },
          React.createElement(Icon, { id: "me-waypoint", size: 14 }),
          React.createElement("span", null, pending && pending.name || "新收藏"),
        ),
        React.createElement("div", { className: "fav-modal-list" },
          favorites.map(f =>
            React.createElement("button", {
              key: f.id,
              className: "fav-modal-item",
              onClick: () => onReplace(f.id),
            },
              React.createElement("div", { className: "fav-modal-item-name" }, f.name),
              React.createElement("div", { className: "fav-modal-item-sub" },
                `${f.lat.toFixed(4)}, ${f.lng.toFixed(4)}`),
            )
          )
        ),
      ),
      React.createElement("div", { className: "fav-modal-footer" },
        React.createElement("button", { className: "btn-soft", onClick: onCancel }, "取消"),
      ),
    )
  );
}

export { App, Toolbar, Panel, SearchBox, TimeSlider, Icon, FavItem, FavLimitModal, formatClock, formatCountdown, sameDayISO };
