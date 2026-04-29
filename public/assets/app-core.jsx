"use strict";
// Main app component
const { useState, useEffect, useMemo, useRef, useCallback } = React;

// Snap tolerance: locations farther than this from any rail line are treated as
// "off-rail" and produce no train list. Tuned for handheld use; revisit when
// zoom-aware tolerances are added.
const MAX_SNAP_DIST_KM = 2;
// A line counts as a candidate (selectable in the chip row) if it is within
// MAX_SNAP_DIST_KM of the user AND within this much of the closest line.
const CANDIDATE_GRACE_KM = 1.0;

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
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [sheetCollapsed, setSheetCollapsed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);        // mobile drawer
  const [panelCollapsed, setPanelCollapsed] = useState(false); // desktop collapse
  const [quickPick, setQuickPick] = useState('now');     // 'now' | '30' | '60' | 'custom'
  const [timeFocusTick, setTimeFocusTick] = useState(0); // bump to scroll/focus the panel's time control

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

  // Default GPS: try geolocation once
  useEffect(() => {
    const defaults = {
      taiwan: { lat: 25.0478, lng: 121.5170, name: '台北車站' },
      japan:  { lat: 35.6812, lng: 139.7671, name: '東京駅' },
    };
    if (!location) setLocation(defaults[region]);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, name: '目前位置' });
      }, () => {}, { timeout: 5000, maximumAge: 300000 });
    }
    // eslint-disable-next-line
  }, []);

  // When region changes, reset location to region default
  const switchRegion = (r) => {
    setRegion(r);
    const defaults = {
      taiwan: { lat: 25.0478, lng: 121.5170, name: '台北車站' },
      japan:  { lat: 35.6812, lng: 139.7671, name: '東京駅' },
    };
    setLocation(defaults[r]);
    setTypeFilters([]);
  };

  // ============= COMPUTE LINE CANDIDATES =============
  // All lines within tolerance, sorted by distance. The first is the default
  // active line; the user can switch via the chip row in the train sheet.
  const [activeLineId, setActiveLineId] = useState(null);
  const { candidates, offRail } = useMemo(() => {
    if (!location) return { candidates: [], offRail: null };
    const lines = RAIL_DATA[region].lines;
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
  }, [location, region]);

  // Keep activeLineId in sync with the candidates list.
  useEffect(() => {
    if (candidates.length === 0) {
      if (activeLineId !== null) setActiveLineId(null);
      return;
    }
    if (!activeLineId || !candidates.some(c => c.line.id === activeLineId)) {
      setActiveLineId(candidates[0].line.id);
    }
  }, [candidates, activeLineId]);

  // The nearest snap point of the *active* candidate.
  const nearest = useMemo(() => {
    if (candidates.length === 0) return null;
    return candidates.find(c => c.line.id === activeLineId) || candidates[0];
  }, [candidates, activeLineId]);

  // Trains on the active line, with time-of-passage at the snap point.
  const trains = useMemo(() => {
    if (!nearest) return [];
    const dayTrains = TrainGen.generate(region, targetTime);
    const out = [];
    dayTrains.forEach(train => {
      if (train.line.id !== nearest.line.id) return;
      const stops = train.stops;
      let passTime = null, prevStop = null, nextStop = null;
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i], b = stops[i+1];
        const lo = Math.min(a.km, b.km), hi = Math.max(a.km, b.km);
        if (nearest.km >= lo && nearest.km <= hi) {
          const t = (nearest.km - a.km) / (b.km - a.km);
          passTime = new Date(a.time.getTime() + t * (b.time.getTime() - a.time.getTime()));
          prevStop = a; nextStop = b;
          break;
        }
      }
      if (!passTime) return;
      out.push({ ...train, passTime, prevStop, nextStop });
    });
    out.sort((a, b) => Math.abs(a.passTime - targetTime) - Math.abs(b.passTime - targetTime));
    return out;
  }, [nearest, region, targetTime]);

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
  const liveTrains = useMemo(() => {
    if (!nearest) return [];
    const dayTrains = TrainGen.generate(region, targetTime);
    const windowMs = 30 * 60 * 1000;
    const result = [];
    dayTrains.forEach(train => {
      const start = train.startTime.getTime();
      const end = train.endTime.getTime();
      const T = targetTime.getTime();
      if (T < start - windowMs || T > end + windowMs) return;
      if (T < start || T > end) return; // only those currently running
      // Find current km via interpolation across stops
      const stops = train.stops;
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i], b = stops[i+1];
        if (T >= a.time.getTime() && T <= b.time.getTime()) {
          const u = (T - a.time.getTime()) / (b.time.getTime() - a.time.getTime());
          const km = a.km + u * (b.km - a.km);
          const pos = RailUtil.positionAtKm(train.line, km);
          result.push({ ...train, livePos: pos, liveKm: km });
          break;
        }
      }
    });
    return result;
  }, [region, targetTime, nearest]);

  // ============= HANDLERS =============
  const [flyTo, setFlyTo] = useState(null); // {lat, lng, ts} — triggers map flyTo
  const pickFromMap = (latlng) => {
    setLocation({ lat: latlng.lat, lng: latlng.lng, name: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}` });
  };
  const useGeolocation = () => {
    if (!navigator.geolocation) { alert('瀏覽器不支援定位'); return; }
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude, lng = pos.coords.longitude;
      setLocation({ lat, lng, name: '目前位置' });
      setFlyTo({ lat, lng, ts: Date.now() });
    }, err => alert('定位失敗：' + err.message), { enableHighAccuracy: true });
  };
  const addFavorite = () => {
    if (!location) return;
    if (favorites.some(f => f.lat === location.lat && f.lng === location.lng)) return;
    setFavorites([...favorites, { ...location, id: Date.now() }]);
  };
  const removeFavorite = (id) => setFavorites(favorites.filter(f => f.id !== id));
  const pickFavorite = (f) => setLocation({ lat: f.lat, lng: f.lng, name: f.name });

  const handleQuickPick = (kind) => {
    setQuickPick(kind);
    const d = new Date();
    if (kind === 'now') setTargetTime(d);
    else if (kind === '30') setTargetTime(new Date(d.getTime() + 30*60000));
    else if (kind === '60') setTargetTime(new Date(d.getTime() + 60*60000));
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
        useGeolocation, favorites, addFavorite, removeFavorite, pickFavorite,
        targetTime, setTargetTime, quickPick, handleQuickPick, setQuickPick,
        now, nearest, offRail, timeFocusTick,
      }),
      React.createElement(MapArea, {
        region, location, nearest, liveTrains, targetTime, now,
        mapLayer, setMapLayer,
        onMapClick: pickFromMap,
        onLocate: useGeolocation,
        flyTo,
        onTrainClick: setSelectedTrain,
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
    }),
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
    favorites, addFavorite, removeFavorite, pickFavorite,
    targetTime, setTargetTime, quickPick, handleQuickPick, setQuickPick,
    now, nearest, offRail, timeFocusTick,
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
  // Swipe-left to close (mobile)
  const touchRef = useRef({ x: 0, y: 0, active: false });
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, active: true };
  };
  const onTouchMove = (e) => {
    if (!touchRef.current.active) return;
    const t = e.touches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (dx < -60 && Math.abs(dx) > Math.abs(dy)) {
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

    // FAVORITES
    favorites.length > 0 && React.createElement("div", { className: "panel-section" },
      React.createElement("div", { className: "ps-header" },
        React.createElement("div", { className: "ps-title" },
          React.createElement(Icon, { id: "me-alternatives", size: 16 }),
          "我的收藏",
        ),
      ),
      React.createElement("div", { className: "fav-list" },
        favorites.map(f =>
          React.createElement("div", { key: f.id, className: "fav-item", onClick: () => { pickFavorite(f); onClose && onClose(); } },
            React.createElement("div", { className: "fav-icon" },
              React.createElement(Icon, { id: "me-waypoint", size: 14 })),
            React.createElement("div", { className: "fav-name" }, f.name),
            React.createElement("button", {
              className: "fav-remove",
              onClick: (e) => { e.stopPropagation(); removeFavorite(f.id); },
            }, React.createElement(Icon, { id: "me-close", size: 12 })),
          )
        )
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
              setTargetTime(nd); setQuickPick('custom');
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
              setTargetTime(nd); setQuickPick('custom');
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
      React.createElement(TimeSlider, { targetTime, setTargetTime, setQuickPick }),
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
            React.createElement("div", { style: { color: 'var(--me-text-primary)', marginBottom: 4 } },
              "目前位置不在任何鐵道附近"),
            React.createElement("div", { style: { fontSize: 11, color: 'var(--me-text-muted)' } },
              `最近的「${offRail.lineName}」距離 ${offRail.dist.toFixed(1)} km`),
          )
        : React.createElement("div", { className: "nearest-empty" }, "請先選擇位置"),
    ),
  );
}

// ============================================================
// SEARCH BOX (OSM Nominatim)
// ============================================================
function SearchBox({ onSelect }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!q.trim() || q.length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&accept-language=zh-TW,ja,en&q=${encodeURIComponent(q)}`;
        const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
        const data = await r.json();
        setResults(data);
      } catch (e) {
        setResults([]);
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
    q && React.createElement("button", { className: "search-clear", onClick: () => { setQ(''); setResults([]); } },
      React.createElement(Icon, { id: "me-close", size: 12 })),
    open && (loading || results.length > 0) && React.createElement("div", { className: "search-results" },
      loading
        ? React.createElement("div", { className: "search-loading" }, "搜尋中…")
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
function TimeSlider({ targetTime, setTargetTime, setQuickPick }) {
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
        setTargetTime(nd); setQuickPick('custom');
      },
    }),
    React.createElement("div", { className: "time-slider-ticks" },
      ['00','06','12','18','24'].map(t => React.createElement("span", { key: t }, t)),
    ),
  );
}

// Export to window so other scripts can use them
Object.assign(window, { App, Toolbar, Panel, SearchBox, TimeSlider, Icon, formatClock, formatCountdown, sameDayISO });
