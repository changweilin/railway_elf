"use strict";
// Map component — Leaflet integration
const { useState: useStateM, useEffect: useEffectM, useRef: useRefM, useMemo: useMemoM } = React;

function MapArea({ region, location, nearest, liveTrains, targetTime, now, visibleLines, mapLayer, setMapLayer, onMapClick, onLocate, flyTo, onTrainClick, onHudClick }) {
  const [hudMode, setHudMode] = useStateM('predict'); // 'predict' | 'now'
  const mapRef = useRefM(null);
  const leafletRef = useRefM(null);
  const userMarkerRef = useRefM(null);
  const railLinesRef = useRefM({});
  const nearestMarkerRef = useRefM(null);
  const connectorRef = useRefM(null);
  const trainMarkersRef = useRefM({});
  const tileLayerRef = useRefM(null);

  // Init Leaflet once
  useEffectM(() => {
    if (!window.L) return;
    if (leafletRef.current) return;
    const map = L.map(mapRef.current, {
      center: RAIL_DATA[region].center,
      zoom: RAIL_DATA[region].zoom,
      zoomControl: true,
      attributionControl: true,
    });
    leafletRef.current = map;

    map.on('click', (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
    // eslint-disable-next-line
  }, []);

  // Tile layer — change when mapLayer changes
  useEffectM(() => {
    const map = leafletRef.current;
    if (!map) return;
    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
    const tiles = {
      dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attr: '&copy; OpenStreetMap &copy; CARTO',
      },
      light: {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attr: '&copy; OpenStreetMap &copy; CARTO',
      },
      satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attr: 'Tiles &copy; Esri',
      },
    }[mapLayer];
    tileLayerRef.current = L.tileLayer(tiles.url, {
      attribution: tiles.attr, maxZoom: 19,
    }).addTo(map);
  }, [mapLayer]);

  // Draw rail lines when region or visibleLines change.
  // Adds layers for newly-visible lines and removes layers for filtered-out
  // lines incrementally, so toggling a category does not trigger a full redraw.
  useEffectM(() => {
    const map = leafletRef.current;
    if (!map) return;
    const lines = visibleLines || RAIL_DATA[region].lines;
    const visibleIds = new Set(lines.map(l => l.id));

    // Remove layers for lines that are no longer visible
    Object.keys(railLinesRef.current).forEach(id => {
      if (!visibleIds.has(id)) {
        railLinesRef.current[id].forEach(l => map.removeLayer(l));
        delete railLinesRef.current[id];
      }
    });

    // Add layers for newly-visible lines
    lines.forEach(line => {
      if (railLinesRef.current[line.id]) return;
      const poly = (line.shape && line.shape.length >= 2) ? line.shape : line.stations;
      const coords = poly.map(s => [s.lat, s.lng]);
      const glow = L.polyline(coords, { color: line.color, weight: 7, opacity: 0.18 }).addTo(map);
      const main = L.polyline(coords, { color: line.color, weight: 3, opacity: 0.9 }).addTo(map);
      const stationDots = line.stations.map(s =>
        L.circleMarker([s.lat, s.lng], {
          radius: 3, color: line.color, fillColor: '#0f1117',
          fillOpacity: 1, weight: 2,
        }).bindTooltip(s.name, { direction: 'top', offset: [0,-4], className: 'station-tip' })
         .addTo(map)
      );
      railLinesRef.current[line.id] = [glow, main, ...stationDots];
    });
  }, [region, visibleLines]);

  // Fit bounds when region changes (use full region, not filtered list, so
  // the initial framing is stable even if a category is toggled off).
  useEffectM(() => {
    const map = leafletRef.current;
    if (!map) return;
    const allCoords = RAIL_DATA[region].lines.flatMap(l => l.stations.map(s => [s.lat, s.lng]));
    if (allCoords.length) map.fitBounds(allCoords, { padding: [40, 40] });
  }, [region]);

  // User location marker
  useEffectM(() => {
    const map = leafletRef.current;
    if (!map || !location) return;
    if (userMarkerRef.current) userMarkerRef.current.remove();
    const icon = L.divIcon({
      className: '', html: '<div class="user-pin"></div>',
      iconSize: [22, 22], iconAnchor: [11, 11],
    });
    userMarkerRef.current = L.marker([location.lat, location.lng], { icon, zIndexOffset: 1000 })
      .addTo(map).bindTooltip(location.name, { direction: 'top', offset: [0, -12] });
  }, [location]);

  // Nearest rail point marker + connector line
  useEffectM(() => {
    const map = leafletRef.current;
    if (!map) return;
    if (nearestMarkerRef.current) nearestMarkerRef.current.remove();
    if (connectorRef.current) connectorRef.current.remove();
    if (!nearest || !location) return;
    const icon = L.divIcon({
      className: '', html: '<div class="rail-pin"></div>',
      iconSize: [18, 18], iconAnchor: [9, 9],
    });
    nearestMarkerRef.current = L.marker([nearest.lat, nearest.lng], { icon, zIndexOffset: 900 })
      .addTo(map)
      .bindTooltip(`${nearest.line.name} · ${nearest.dist.toFixed(2)} km`,
        { direction: 'top', offset: [0, -10], permanent: false });
    // Dashed connector
    connectorRef.current = L.polyline(
      [[location.lat, location.lng], [nearest.lat, nearest.lng]],
      { color: '#fbbf24', weight: 2, opacity: 0.7, dashArray: '4,6' }
    ).addTo(map);
  }, [nearest, location]);

  // Live train markers
  useEffectM(() => {
    const map = leafletRef.current;
    if (!map) return;
    // Remove those not present
    const currentIds = new Set(liveTrains.map(t => t.id));
    Object.keys(trainMarkersRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        trainMarkersRef.current[id].remove();
        delete trainMarkersRef.current[id];
      }
    });
    liveTrains.forEach(train => {
      const dirCls = train.direction === 'up' ? 'northbound' : 'southbound';
      const html = `<div class="train-marker ${dirCls}" style="color:${train.badgeColor}">
        <span class="train-marker-dot"></span>
        <span>${train.badge} ${train.number}</span>
      </div>`;
      const icon = L.divIcon({
        className: '', html, iconSize: [1,1], iconAnchor: [0, 0],
      });
      if (trainMarkersRef.current[train.id]) {
        trainMarkersRef.current[train.id].setLatLng([train.livePos.lat, train.livePos.lng]);
        trainMarkersRef.current[train.id].setIcon(icon);
      } else {
        const m = L.marker([train.livePos.lat, train.livePos.lng], { icon, zIndexOffset: 500 })
          .addTo(map)
          .on('click', () => onTrainClick(train));
        trainMarkersRef.current[train.id] = m;
      }
    });
  }, [liveTrains, onTrainClick]);

  // Pan to location when it changes meaningfully
  useEffectM(() => {
    const map = leafletRef.current;
    if (!map || !location) return;
    map.panTo([location.lat, location.lng], { animate: true, duration: 0.4 });
  }, [location && location.lat, location && location.lng]);

  // FlyTo + zoom when GPS button pressed
  useEffectM(() => {
    const map = leafletRef.current;
    if (!map || !flyTo) return;
    map.flyTo([flyTo.lat, flyTo.lng], Math.max(map.getZoom(), 14), { duration: 1.0 });
  }, [flyTo && flyTo.ts]);

  return React.createElement("div", { className: "map-area" },
    React.createElement("div", { id: "map", ref: mapRef }),
    React.createElement("div", { className: "map-hud" },
      React.createElement("div", { className: "map-hud-card map-hud-clock" },
        React.createElement("div", { className: "map-hud-tabs", role: "tablist" },
          React.createElement("button", {
            type: "button", role: "tab",
            className: "map-hud-tab " + (hudMode === 'now' ? 'active' : ''),
            "aria-selected": hudMode === 'now',
            onClick: (e) => { e.stopPropagation(); setHudMode('now'); },
          }, "現在"),
          React.createElement("button", {
            type: "button", role: "tab",
            className: "map-hud-tab " + (hudMode === 'predict' ? 'active' : ''),
            "aria-selected": hudMode === 'predict',
            onClick: (e) => { e.stopPropagation(); setHudMode('predict'); },
          }, "預測"),
        ),
        React.createElement("button", {
          type: "button",
          className: "map-hud-clock-body",
          onClick: onHudClick,
          title: "點擊調整預測時間",
        },
          React.createElement("div", { className: "map-hud-clock-date" },
            sameDayISO(hudMode === 'now' ? (now || new Date()) : targetTime)),
          React.createElement("div", { className: "map-hud-clock-time" },
            formatClock(hudMode === 'now' ? (now || new Date()) : targetTime)),
        ),
      ),
    ),
    React.createElement("div", { className: "layer-switch" },
      [['dark','深色'], ['light','淺色'], ['satellite','衛星']].map(([k,label]) =>
        React.createElement("button", {
          key: k,
          className: "layer-btn " + (mapLayer === k ? "active" : ""),
          onClick: () => setMapLayer(k),
        }, label)
      ),
    ),
    React.createElement("div", { className: "map-fab-stack" },
      React.createElement("button", {
        className: "map-fab", title: "使用我的位置", onClick: onLocate,
      },
        React.createElement(Icon, { id: "me-locate", size: 20 }),
      ),
    ),
  );
}

// ============================================================
// TRAIN SHEET (bottom)
// ============================================================
function TrainSheet({ collapsed, onToggle, nearest, offRail, candidates, activeLineId, setActiveLineId, trains, totalCount, liveTrainCount, dirFilter, setDirFilter, typeFilters, setTypeFilters, availableTypes, targetTime, onSelect }) {
  const toggleType = (t) => {
    setTypeFilters(typeFilters.includes(t)
      ? typeFilters.filter(x => x !== t)
      : [...typeFilters, t]);
  };
  // ===== Draggable resize on the handle =====
  const sheetRef = React.useRef(null);
  const dragRef = React.useRef({ active: false, startY: 0, startH: 0, moved: false });
  const SHEET_MIN = 120;
  // Persisted height in px
  const [userHeight, setUserHeight] = React.useState(() => {
    try {
      const v = localStorage.getItem('relf.sheetHeight');
      const n = v != null ? parseInt(v, 10) : NaN;
      return Number.isFinite(n) ? n : null;
    } catch { return null; }
  });
  React.useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    if (userHeight == null) {
      el.style.removeProperty('--sheet-user-height');
      el.removeAttribute('data-user-sized');
    } else {
      el.style.setProperty('--sheet-user-height', userHeight + 'px');
      el.setAttribute('data-user-sized', '');
    }
  }, [userHeight]);
  React.useEffect(() => {
    try {
      if (userHeight == null) localStorage.removeItem('relf.sheetHeight');
      else localStorage.setItem('relf.sheetHeight', String(userHeight));
    } catch {}
  }, [userHeight]);
  const beginDrag = (clientY) => {
    const el = sheetRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = { active: true, startY: clientY, startH: rect.height, moved: false };
    document.body.classList.add('sheet-resizing');
    el.classList.add('resizing');
    el.querySelector('.sheet-handle')?.classList.add('dragging');
  };
  React.useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.active) return;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const dy = dragRef.current.startY - y; // dragging UP increases height
      if (Math.abs(dy) > 4) dragRef.current.moved = true;
      // Map area = window.innerHeight - toolbarHeight; cap to 85%
      const map = document.querySelector('.map-wrap, .map-area, .leaflet-container')?.parentElement
        || document.querySelector('.main');
      const mapH = map ? map.getBoundingClientRect().height : window.innerHeight;
      const max = Math.floor(mapH * 0.85);
      let h = Math.round(dragRef.current.startH + dy);
      if (h < SHEET_MIN) h = SHEET_MIN;
      if (h > max) h = max;
      setUserHeight(h);
      if (e.cancelable) e.preventDefault();
    };
    const onUp = () => {
      if (!dragRef.current.active) return;
      const moved = dragRef.current.moved;
      dragRef.current.active = false;
      document.body.classList.remove('sheet-resizing');
      const el = sheetRef.current;
      if (el) el.classList.remove('resizing');
      el?.querySelector('.sheet-handle')?.classList.remove('dragging');
      // If user didn't actually drag, treat as click → toggle
      if (!moved) onToggle && onToggle();
      window.dispatchEvent(new Event('resize'));
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchcancel', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('touchcancel', onUp);
    };
  }, [onToggle]);
  const onHandleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    beginDrag(e.clientY);
  };
  const onHandleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    beginDrag(e.touches[0].clientY);
  };
  const onHandleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUserHeight(null); // reset
    window.dispatchEvent(new Event('resize'));
  };
  return React.createElement("div", {
    ref: sheetRef,
    className: "sheet " + (collapsed ? "collapsed" : ""),
  },
    React.createElement("div", {
      className: "sheet-handle",
      onMouseDown: onHandleMouseDown,
      onTouchStart: onHandleTouchStart,
      onDoubleClick: onHandleDoubleClick,
      title: "拖曳調整高度・雙擊重設・單擊收合",
      role: "separator",
      "aria-orientation": "horizontal",
    }),
    React.createElement("div", { className: "sheet-head" },
      React.createElement("span", { className: "sheet-title" },
        React.createElement(Icon, { id: "me-clock", size: 16 }),
        "即將通過",
      ),
      React.createElement("span", { className: "sheet-count" }, trains.length, " 班"),
      React.createElement("span", { className: "sheet-sub" },
        typeof liveTrainCount === 'number' && React.createElement("span", { className: "sheet-live" },
          React.createElement("span", { className: "sheet-live-dot" }),
          liveTrainCount, " 列運行中",
        ),
        nearest ? nearest.line.name : (offRail ? "不在鐵道附近" : "—")),
    ),
    !collapsed && React.createElement(React.Fragment, null,
      candidates && candidates.length > 1 && React.createElement("div", {
        className: "sheet-filters",
        style: { borderBottom: '1px dashed var(--me-border)' },
      },
        React.createElement("span", {
          style: { fontSize: 11, color: 'var(--me-text-muted)', alignSelf: 'center', marginRight: 4 },
        }, "在這附近："),
        candidates.map(c =>
          React.createElement("button", {
            key: c.line.id,
            className: "pill " + (c.line.id === activeLineId ? 'active' : ''),
            onClick: () => setActiveLineId && setActiveLineId(c.line.id),
            title: `${c.line.name} · ${c.dist.toFixed(2)} km`,
          },
            React.createElement("span", {
              className: "pill-dot",
              style: { background: c.line.color },
            }),
            c.line.name,
            React.createElement("span", {
              style: { fontSize: 10, opacity: 0.65, marginLeft: 4 },
            }, c.dist.toFixed(1), " km"),
          )
        ),
      ),
      React.createElement("div", { className: "sheet-filters" },
        React.createElement("button", {
          className: "pill " + (dirFilter === 'all' ? 'active' : ''),
          onClick: () => setDirFilter('all'),
        }, "全部方向"),
        React.createElement("button", {
          className: "pill " + (dirFilter === 'up' ? 'active' : ''),
          onClick: () => setDirFilter('up'),
        }, React.createElement("span", { className: "pill-dot", style: { background: 'var(--me-info)' } }), "北上"),
        React.createElement("button", {
          className: "pill " + (dirFilter === 'down' ? 'active' : ''),
          onClick: () => setDirFilter('down'),
        }, React.createElement("span", { className: "pill-dot", style: { background: 'var(--me-warning)' } }), "南下"),
        React.createElement("span", { style: {
          width: 1, alignSelf: 'stretch', background: 'var(--me-border)', margin: '0 4px', flexShrink: 0,
        } }),
        availableTypes.map(t =>
          React.createElement("button", {
            key: t,
            className: "pill " + (typeFilters.includes(t) ? 'active' : ''),
            onClick: () => toggleType(t),
          }, t)
        ),
      ),
      React.createElement("div", { className: "train-list" },
        trains.length === 0
          ? React.createElement("div", { className: "train-empty" },
              React.createElement(Icon, { id: offRail ? "me-locate" : "me-clock", size: 32 }),
              React.createElement("div", null,
                offRail
                  ? `目前位置不在任何鐵道附近（最近的「${offRail.lineName}」距離 ${offRail.dist.toFixed(1)} km）`
                  : "沒有符合的列車"))
          : trains.slice(0, 40).map(t =>
              React.createElement(TrainCard, {
                key: t.id, train: t, targetTime, onSelect: () => onSelect(t),
              }))
      ),
    ),
  );
}

// ============================================================
// TRAIN CARD
// ============================================================
function TrainCard({ train, targetTime, onSelect }) {
  const diffMs = train.passTime - targetTime;
  const cd = formatCountdown(diffMs);
  const firstStop = train.stops[0].name;
  const lastStop = train.stops[train.stops.length - 1].name;
  const passing = Math.abs(diffMs) < 3 * 60 * 1000;
  const prev = train.prevStop, next = train.nextStop;

  return React.createElement("div", {
    className: "train-card " + (passing ? "passing" : ""),
    onClick: onSelect,
  },
    React.createElement("div", { className: "tc-countdown" },
      React.createElement("div", { className: "tc-countdown-value " + cd.cls }, cd.text),
      React.createElement("div", { className: "tc-countdown-unit" }, cd.unit),
    ),
    React.createElement("div", { className: "tc-main" },
      React.createElement("div", { className: "tc-head" },
        React.createElement("span", {
          className: "tc-badge",
          style: {
            background: train.badgeColor + '22',
            color: train.badgeColor,
            border: `1px solid ${train.badgeColor}44`,
          },
        }, train.badge),
        React.createElement("span", { className: "tc-number" }, train.number, " 次"),
        React.createElement("span", { className: "tc-route-mini" },
          firstStop, " → ", lastStop),
      ),
      prev && next && React.createElement("div", { className: "tc-segment" },
        React.createElement("span", { className: "tc-seg-stop" },
          React.createElement("span", { className: "tc-seg-time" }, formatClock(prev.departure)),
          React.createElement("span", { className: "tc-seg-name" }, prev.name),
        ),
        React.createElement("span", { className: "tc-seg-arrow" }, "──▶"),
        React.createElement("span", { className: "tc-seg-stop" },
          React.createElement("span", { className: "tc-seg-time" }, formatClock(next.arrival)),
          React.createElement("span", { className: "tc-seg-name" }, next.name),
        ),
      ),
    ),
    React.createElement("div", { className: "tc-right" },
      React.createElement("div", { className: "tc-time" }, formatClock(train.passTime)),
      React.createElement("div", { className: "tc-dir " + (train.direction === 'up' ? 'northbound' : 'southbound') },
        train.direction === 'up' ? '▲ 北上' : '▼ 南下',
      ),
    ),
  );
}

// ============================================================
// TRAIN DETAIL MODAL
// ============================================================
function TrainModal({ train, nearest, targetTime, onClose }) {
  const diffMs = train.passTime - targetTime;
  const cd = formatCountdown(diffMs);
  const totalKm = train.stops[train.stops.length-1].km - train.stops[0].km;
  const duration = (train.endTime - train.startTime) / 60000;

  // Decide which stop is "past" vs "upcoming" relative to targetTime
  return React.createElement("div", { className: "modal-backdrop", onClick: onClose },
    React.createElement("div", { className: "modal", onClick: (e) => e.stopPropagation() },
      React.createElement("div", { className: "modal-head" },
        React.createElement("span", {
          className: "tc-badge",
          style: {
            background: train.badgeColor + '22',
            color: train.badgeColor,
            border: `1px solid ${train.badgeColor}44`,
            padding: '4px 10px', fontSize: 11,
          },
        }, train.badge),
        React.createElement("div", null,
          React.createElement("div", {
            style: { fontFamily: 'var(--me-font-mono)', fontSize: 18, fontWeight: 700 }
          }, train.number, " 次"),
          React.createElement("div", {
            style: { fontSize: 12, color: 'var(--me-text-secondary)' }
          }, train.directionLabel),
        ),
        React.createElement("button", { className: "modal-close", onClick: onClose },
          React.createElement(Icon, { id: "me-close", size: 18 })),
      ),
      React.createElement("div", { className: "modal-body" },
        React.createElement("div", { className: "modal-stats" },
          React.createElement("div", { className: "modal-stat" },
            React.createElement("div", { className: "modal-stat-label" }, "通過時間"),
            React.createElement("div", { className: "modal-stat-value" }, formatClock(train.passTime))),
          React.createElement("div", { className: "modal-stat" },
            React.createElement("div", { className: "modal-stat-label" }, "倒數"),
            React.createElement("div", {
              className: "modal-stat-value",
              style: diffMs >= 0 && diffMs < 5*60000 ? {
                background: 'var(--me-accent-gradient)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              } : {},
            }, cd.text + (cd.unit.includes('分') ? ' 分' : cd.unit === '即將通過' ? '' : ' h')),
          ),
          React.createElement("div", { className: "modal-stat" },
            React.createElement("div", { className: "modal-stat-label" }, "全程"),
            React.createElement("div", { className: "modal-stat-value" }, Math.round(duration) + ' 分')),
        ),
        React.createElement("div", {
          style: { fontSize: 12, color: 'var(--me-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }
        }, "停靠站"),
        React.createElement("div", { className: "timetable" },
          train.stops.map((s, i) => {
            const past = s.arrival < targetTime;
            const isHighlight = nearest && (
              (train.stops[i-1] && nearest.km >= Math.min(s.km, train.stops[i-1].km) && nearest.km <= Math.max(s.km, train.stops[i-1].km)) ||
              (train.stops[i+1] && nearest.km >= Math.min(s.km, train.stops[i+1].km) && nearest.km <= Math.max(s.km, train.stops[i+1].km))
            );
            // Pick highlight = prevStop / nextStop at nearest
            const hl = nearest && (train.prevStop && train.prevStop.stationIdx === s.stationIdx);
            return React.createElement("div", {
              key: i,
              className: "tt-stop " + (past ? "past " : "") + (hl ? "highlight" : ""),
            },
              React.createElement("span", { className: "tt-name" }, s.name),
              React.createElement("span", { className: "tt-dist" }, s.km.toFixed(1) + ' km'),
              React.createElement("span", { className: "tt-time" }, formatClock(s.arrival)),
            );
          })
        ),
      ),
    ),
  );
}

Object.assign(window, { MapArea, TrainSheet, TrainCard, TrainModal });
