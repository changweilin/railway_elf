// Map component — Leaflet integration
import React, {
  useState as useStateM,
  useEffect as useEffectM,
  useRef as useRefM,
  useMemo as useMemoM,
} from "react";
import L from "leaflet";
import { RAIL_DATA, RailUtil } from "./rail-data.js";
// Circular: app-core imports from us too. Safe because all references happen
// inside component bodies / event callbacks, not at module init.
import { Icon, formatClock, formatCountdown, sameDayISO } from "./app-core.js";

// Top-down PNG icons keyed by exact `train.type`. Mirrors
// public/assets/train-icons/train-icon-map.json — keep them in sync. All PNGs
// are 256×256 with the nose pointing up in image space; rotating the <img> by
// the compass heading aligns the nose with travel direction.
// Paths are relative to the document URL so the app works under both `/` (dev)
// and a project sub-path like `/railway_elf/` (GitHub Pages).
const TRAIN_ICON_MAP = {
  '自強':       { src: 'assets/train-icons/tze-chiang.png',          kind: 'express' },
  '莒光':       { src: 'assets/train-icons/chu-kuang.png',           kind: 'limited' },
  '區間':       { src: 'assets/train-icons/local-emu.png',           kind: 'commuter' },
  '高鐵':       { src: 'assets/train-icons/thsr-700t.png',           kind: 'shinkansen' },
  '太魯閣':     { src: 'assets/train-icons/taroko.png',              kind: 'express' },
  '普悠瑪':     { src: 'assets/train-icons/puyuma.png',              kind: 'express' },
  '阿里山號':   { src: 'assets/train-icons/alishan-express.png',     kind: 'heritage' },
  '捷運':       { src: 'assets/train-icons/metro.png',               kind: 'metro' },
  '普通車':     { src: 'assets/train-icons/tymetro-commuter.png',    kind: 'commuter' },
  '直達車':     { src: 'assets/train-icons/tymetro-express.png',     kind: 'express' },
  '輕軌':       { src: 'assets/train-icons/lrt.png',                 kind: 'lrt' },
  'のぞみ':     { src: 'assets/train-icons/shinkansen-nozomi.png',   kind: 'shinkansen' },
  'ひかり':     { src: 'assets/train-icons/shinkansen-hikari.png',   kind: 'shinkansen' },
  'こだま':     { src: 'assets/train-icons/shinkansen-kodama.png',   kind: 'shinkansen' },
  '山手線':     { src: 'assets/train-icons/yamanote.png',            kind: 'commuter' },
  '快速':       { src: 'assets/train-icons/chuo-rapid.png',          kind: 'express' },
  '特別快速':   { src: 'assets/train-icons/chuo-special-rapid.png',  kind: 'express' },
};

// Display size per kind (PNG canvases are square, so width === height).
// Real-world size hierarchy: shinkansen > express > commuter ≈ limited >
// metro > lrt ≈ heritage.
const TRAIN_ICON_KIND_SIZE = {
  shinkansen: 44,
  express:    38,
  limited:    36,
  commuter:   36,
  metro:      32,
  lrt:        28,
  heritage:   28,
};

// Warm the browser cache on script load so the first marker render finds the
// PNG already decoded — otherwise the icon pops in a frame later.
(function preloadTrainIcons() {
  if (typeof Image === 'undefined') return;
  Object.values(TRAIN_ICON_MAP).forEach(({ src }) => {
    const img = new Image();
    img.src = src;
  });
})();

const MAP_VIEWPORT_BUFFER_RATIO = 0.35;
const VIEWPORT_DEBOUNCE_MS = 120;
const STATION_DOT_MIN_ZOOM = 10;
const TRAIN_DETAIL_MIN_ZOOM = 12;

function trainMarkerDensityForZoom(zoom) {
  if (zoom == null) return { maxMarkers: 120, minGapPx: 24, screenPadPx: 48 };
  if (zoom >= 15) return { maxMarkers: 220, minGapPx: 16, screenPadPx: 64 };
  if (zoom >= 13) return { maxMarkers: 160, minGapPx: 20, screenPadPx: 56 };
  if (zoom >= 12) return { maxMarkers: 130, minGapPx: 24, screenPadPx: 56 };
  if (zoom >= 11) return { maxMarkers: 110, minGapPx: 28, screenPadPx: 48 };
  return { maxMarkers: 80, minGapPx: 34, screenPadPx: 40 };
}

function getBufferedViewport(map) {
  const bounds = map.getBounds().pad(MAP_VIEWPORT_BUFFER_RATIO);
  return {
    south: bounds.getSouth(),
    west: bounds.getWest(),
    north: bounds.getNorth(),
    east: bounds.getEast(),
    zoom: map.getZoom(),
  };
}

function sameViewport(a, b) {
  if (!a || !b) return false;
  const eps = 0.00001;
  return a.zoom === b.zoom &&
    Math.abs(a.south - b.south) < eps &&
    Math.abs(a.west - b.west) < eps &&
    Math.abs(a.north - b.north) < eps &&
    Math.abs(a.east - b.east) < eps;
}

function pointLat(p) {
  return Array.isArray(p) ? p[0] : p.lat;
}

function pointLng(p) {
  return Array.isArray(p) ? p[1] : p.lng;
}

function pointToLatLng(p) {
  return [pointLat(p), pointLng(p)];
}

function pointInViewport(p, viewport) {
  if (!viewport) return true;
  const lat = pointLat(p);
  const lng = pointLng(p);
  return lat >= viewport.south && lat <= viewport.north &&
    lng >= viewport.west && lng <= viewport.east;
}

function segmentIntersectsViewport(a, b, viewport) {
  if (!viewport) return true;
  if (pointInViewport(a, viewport) || pointInViewport(b, viewport)) return true;
  const minLat = Math.min(pointLat(a), pointLat(b));
  const maxLat = Math.max(pointLat(a), pointLat(b));
  const minLng = Math.min(pointLng(a), pointLng(b));
  const maxLng = Math.max(pointLng(a), pointLng(b));
  return maxLat >= viewport.south && minLat <= viewport.north &&
    maxLng >= viewport.west && minLng <= viewport.east;
}

function slicePolylineToViewport(polyline, viewport) {
  if (!polyline || polyline.length < 2) return [];
  if (!viewport) return [polyline.map(pointToLatLng)];
  const segments = [];
  let current = [];
  for (let i = 0; i < polyline.length - 1; i++) {
    const a = polyline[i];
    const b = polyline[i+1];
    if (segmentIntersectsViewport(a, b, viewport)) {
      if (current.length === 0) current.push(pointToLatLng(a));
      current.push(pointToLatLng(b));
    } else if (current.length > 0) {
      if (current.length >= 2) segments.push(current);
      current = [];
    }
  }
  if (current.length >= 2) segments.push(current);
  return segments;
}

function buildTrainMarkerHtml(train, showDetails = true) {
  const heading = (typeof train.heading === 'number' && isFinite(train.heading)) ? train.heading : 0;
  const dimmed = train.phase === 'dwelling' ? ' dwelling' : '';
  const dirCls = train.direction === 'up' ? ' northbound' : ' southbound';
  const detailCls = showDetails ? '' : ' labels-hidden';
  const entry = TRAIN_ICON_MAP[train.type];
  const size = (entry && TRAIN_ICON_KIND_SIZE[entry.kind]) || 34;
  const half = size / 2;
  const labelTop = half + 4;
  const inner = entry
    ? `<img src="${entry.src}" alt="" draggable="false" />`
    // Fallback for any future type missing from the map: a coloured dot so the
    // train still appears, with badge colour as the visual cue.
    : `<div class="train-icon-fallback" style="background:${train.badgeColor}"></div>`;
  return `<div class="train-marker-v2${dirCls}${dimmed}${detailCls}" style="--col:${train.badgeColor};--rot:${heading.toFixed(1)}deg">
    <div class="train-icon" style="width:${size}px;height:${size}px;left:${-half}px;top:${-half}px">${inner}</div>
    <div class="train-marker-label" style="top:${labelTop}px">${train.badge} ${train.number}</div>
  </div>`;
}

function trainKindPriority(train) {
  const entry = TRAIN_ICON_MAP[train.type];
  switch (entry && entry.kind) {
    case 'shinkansen': return 30;
    case 'express': return 18;
    case 'limited': return 14;
    case 'heritage': return 10;
    case 'commuter': return 6;
    case 'metro': return 4;
    case 'lrt': return 3;
    default: return 0;
  }
}

function shouldKeepTrainPoint(point, size, padPx) {
  return point.x >= -padPx && point.x <= size.x + padPx &&
    point.y >= -padPx && point.y <= size.y + padPx;
}

function filterLiveTrainsForMap(liveTrains, map, viewport, location) {
  if (!liveTrains || liveTrains.length === 0) return [];
  const zoom = viewport ? viewport.zoom : map.getZoom();
  const density = trainMarkerDensityForZoom(zoom);
  const size = map.getSize();
  const center = map.getCenter();
  const focus = location || { lat: center.lat, lng: center.lng };

  const candidates = [];
  for (let i = 0; i < liveTrains.length; i++) {
    const train = liveTrains[i];
    if (!train.livePos) continue;
    const point = map.latLngToContainerPoint([train.livePos.lat, train.livePos.lng]);
    if (!shouldKeepTrainPoint(point, size, density.screenPadPx)) continue;
    const focusDist = RailUtil.haversine(focus, train.livePos);
    const centerDist = RailUtil.haversine({ lat: center.lat, lng: center.lng }, train.livePos);
    const score =
      focusDist * 100 +
      centerDist * 12 -
      trainKindPriority(train) -
      (train.phase === 'dwelling' ? 8 : 0);
    candidates.push({ train, point, score, order: i });
  }
  if (candidates.length <= 1) return candidates.map(c => c.train);

  candidates.sort((a, b) => (a.score - b.score) || (a.order - b.order));

  const accepted = [];
  const cells = new Map();
  const cellSize = density.minGapPx;
  const minGapSq = density.minGapPx * density.minGapPx;

  const cellKey = (x, y) => `${x}:${y}`;
  const hasCollision = (candidate) => {
    const cx = Math.floor(candidate.point.x / cellSize);
    const cy = Math.floor(candidate.point.y / cellSize);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const bucket = cells.get(cellKey(cx + dx, cy + dy));
        if (!bucket) continue;
        for (const other of bucket) {
          const px = candidate.point.x - other.point.x;
          const py = candidate.point.y - other.point.y;
          if (px * px + py * py < minGapSq) return true;
        }
      }
    }
    return false;
  };

  for (const candidate of candidates) {
    if (accepted.length >= density.maxMarkers) break;
    if (hasCollision(candidate)) continue;
    accepted.push(candidate);
    const cx = Math.floor(candidate.point.x / cellSize);
    const cy = Math.floor(candidate.point.y / cellSize);
    const key = cellKey(cx, cy);
    const bucket = cells.get(key);
    if (bucket) bucket.push(candidate);
    else cells.set(key, [candidate]);
  }

  accepted.sort((a, b) => a.order - b.order);
  return accepted.map(c => c.train);
}

function MapArea({ region, location, nearest, liveTrains, targetTime, now, quickPick, handleQuickPick, lastPredictPick, visibleLines, mapLayer, setMapLayer, showGrades, onMapClick, onLocate, flyTo, onTrainClick, onHudClick, pushNotice, onViewportChange }) {
  const hudMode = quickPick === 'now' ? 'now' : 'predict';
  const mapRef = useRefM(null);
  const leafletRef = useRefM(null);
  const userMarkerRef = useRefM(null);
  const railLinesRef = useRefM({});
  const prevLineRenderModeRef = useRefM(null);
  const viewportRef = useRefM(null);
  const [viewportTick, setViewportTick] = useStateM(0);
  const nearestMarkerRef = useRefM(null);
  const connectorRef = useRefM(null);
  const trainMarkersRef = useRefM({});
  const tileLayerRef = useRefM(null);

  // Track whether the map has been framed once. Controls whether region
  // changes refit the wide bounds (subsequent switches) or defer to the
  // location-driven framing (first paint).
  const initialFramedRef = useRefM(false);

  // Init Leaflet once
  useEffectM(() => {
    if (!L) return;
    if (leafletRef.current) return;
    const initCenter = location ? [location.lat, location.lng] : RAIL_DATA[region].center;
    const initZoom = location ? 13 : RAIL_DATA[region].zoom;
    const map = L.map(mapRef.current, {
      center: initCenter,
      zoom: initZoom,
      zoomControl: true,
      attributionControl: true,
    });
    if (location) initialFramedRef.current = true;
    leafletRef.current = map;

    const publishViewport = () => {
      const next = getBufferedViewport(map);
      if (sameViewport(viewportRef.current, next)) return;
      viewportRef.current = next;
      setViewportTick(t => t + 1);
      if (onViewportChange) onViewportChange(next);
    };

    let viewportTimer = null;
    const scheduleViewport = () => {
      if (viewportTimer != null) clearTimeout(viewportTimer);
      viewportTimer = setTimeout(publishViewport, VIEWPORT_DEBOUNCE_MS);
    };

    const handleMapClick = (e) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    };

    map.on('click', handleMapClick);
    map.on('moveend zoomend resize', scheduleViewport);
    publishViewport();

    return () => {
      if (viewportTimer != null) clearTimeout(viewportTimer);
      map.off('click', handleMapClick);
      map.off('moveend zoomend resize', scheduleViewport);
      map.remove();
      leafletRef.current = null;
    };
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
    const layer = L.tileLayer(tiles.url, {
      attribution: tiles.attr, maxZoom: 19,
    }).addTo(map);
    // Tile error reporting: count failures within a short window so a single
    // CDN hiccup or one missing zoom-19 tile does not spam the user. Only
    // surface a notice once we hit a real burst (≥ 3 failures inside 4 s),
    // and dedupe via the 'tile-error' notice key.
    let burstCount = 0;
    let burstTimer = null;
    const onTileError = () => {
      burstCount++;
      if (burstTimer == null) {
        burstTimer = setTimeout(() => {
          if (burstCount >= 3 && pushNotice) {
            pushNotice('部分地圖圖磚載入失敗,可能是網路不穩或圖磚服務暫時不可用。', { level: 'warn', key: 'tile-error', ttlMs: 6000 });
          }
          burstCount = 0;
          burstTimer = null;
        }, 4000);
      }
    };
    layer.on('tileerror', onTileError);
    tileLayerRef.current = layer;
    return () => {
      if (burstTimer != null) clearTimeout(burstTimer);
      layer.off('tileerror', onTileError);
    };
  }, [mapLayer, pushNotice]);

  // Draw rail lines around the current viewport. The viewport includes a
  // buffer so panning does not reveal empty track while the next slice loads.
  useEffectM(() => {
    const map = leafletRef.current;
    if (!map) return;
    const viewport = viewportRef.current || getBufferedViewport(map);
    const baseLines = visibleLines || RAIL_DATA[region].lines;
    const lines = viewport
      ? baseLines.filter(line => RailUtil.lineIntersectsBounds(line, viewport))
      : baseLines;
    const visibleIds = new Set(lines.map(l => l.id));
    const showStations = !viewport || viewport.zoom >= STATION_DOT_MIN_ZOOM;
    const detailBucket = RailUtil.renderBucketForZoom(viewport && viewport.zoom);
    const renderMode = `${showGrades ? 'grades' : 'plain'}:${showStations ? 'stations' : 'lines-only'}:${detailBucket}`;

    const removeLineLayers = (id) => {
      const entry = railLinesRef.current[id];
      if (!entry) return;
      const layers = Array.isArray(entry) ? entry : entry.layers;
      layers.forEach(l => map.removeLayer(l));
      delete railLinesRef.current[id];
    };

    if (prevLineRenderModeRef.current !== renderMode) {
      Object.keys(railLinesRef.current).forEach(removeLineLayers);
      prevLineRenderModeRef.current = renderMode;
    }

    // Remove layers for lines that are no longer visible
    Object.keys(railLinesRef.current).forEach(id => {
      if (!visibleIds.has(id)) {
        removeLineLayers(id);
      }
    });

    // Add layers for newly-visible lines
    lines.forEach(line => {
      if (railLinesRef.current[line.id]) return;
      const hasShape = line.shape && line.shape.length >= 2;
      const poly = RailUtil.renderPolylineFor(line, viewport && viewport.zoom);
      const coords = slicePolylineToViewport(poly, viewport);
      const layers = [];

      if (showGrades) {
        // Per-segment styling. The glow is split per segment too — drawing it
        // continuously under the line would fill the dashes of underground
        // sections and wash out the contrast between grades.
        const segs = RailUtil.gradeSegmentsForZoom(line, viewport && viewport.zoom).flatMap(seg =>
          slicePolylineToViewport(seg.points, viewport).map(points => ({ ...seg, points }))
        );
        // First pass: under-layers (glow / trench / halo), so the main line
        // sits on top regardless of declaration order.
        segs.forEach(seg => {
          if (seg.type === 'ground' || seg.type === 'tunnel') {
            // Tunnel reuses the ground glow — the visual signal that the line
            // is hidden by topography (rather than by an urban project) is
            // the dashes alone, without a dark trench.
            layers.push(L.polyline(seg.points, { color: line.color, weight: 7, opacity: 0.18 }).addTo(map));
          } else if (seg.type === 'underground') {
            // Dark "trench" so the dashed line above reads as recessed track
            // — distinguishes 都會地下化 from a topographical tunnel.
            layers.push(L.polyline(seg.points, { color: '#0f1117', weight: 6, opacity: 0.85 }).addTo(map));
          } else if (seg.type === 'elevated') {
            // White halo so the elevated track reads as lifted off ground.
            layers.push(L.polyline(seg.points, { color: '#ffffff', weight: 9, opacity: 0.55 }).addTo(map));
          }
        });
        // Second pass: main coloured strokes.
        segs.forEach(seg => {
          const style = seg.type === 'underground'
            ? { color: line.color, weight: 3, opacity: 1, dashArray: '10,7' }
            : seg.type === 'tunnel'
              ? { color: line.color, weight: 3, opacity: 0.9, dashArray: '4,5' }
              : seg.type === 'elevated'
                ? { color: line.color, weight: 5, opacity: 1 }
                : { color: line.color, weight: 3, opacity: 0.95 };
          const main = L.polyline(seg.points, style).addTo(map);
          if (seg.note) {
            const label = { ground: '平面', underground: '地下化', tunnel: '隧道', elevated: '高架化' }[seg.type] || seg.type;
            main.bindTooltip(`${line.name} · ${label} · ${seg.note}`, { sticky: true, className: 'station-tip' });
          }
          layers.push(main);
        });
      } else {
        // Default rendering: continuous glow + single coloured spine.
        coords.forEach(points => {
          layers.push(L.polyline(points, { color: line.color, weight: 7, opacity: 0.18 }).addTo(map));
          layers.push(L.polyline(points, { color: line.color, weight: 3, opacity: 0.9 }).addTo(map));
        });
      }

      // When a real-world shape is present, station hand-coded lat/lng may drift
      // off the track polyline; snap dots to positionAtKm so they sit on the line.
      const stationDots = showStations
        ? line.stations.flatMap(s => {
            const pos = hasShape ? RailUtil.positionAtKm(line, s.km) : { lat: s.lat, lng: s.lng };
            if (viewport && !RailUtil.pointInBounds(pos, viewport)) return [];
            return [L.circleMarker([pos.lat, pos.lng], {
              radius: 3, color: line.color, fillColor: '#0f1117',
              fillOpacity: 1, weight: 2,
            }).bindTooltip(s.name, { direction: 'top', offset: [0,-4], className: 'station-tip' })
             .addTo(map)];
          })
        : [];
      railLinesRef.current[line.id] = { layers: [...layers, ...stationDots] };
    });
  }, [region, visibleLines, showGrades, viewportTick]);

  // Fit bounds only when the user explicitly switches region after the first
  // paint. The initial framing is handled by the location effect below so the
  // map opens centred on the user, not zoomed out to the whole network.
  useEffectM(() => {
    const map = leafletRef.current;
    if (!map) return;
    if (!initialFramedRef.current) return;
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
    const viewport = viewportRef.current || getBufferedViewport(map);
    const showTrainDetails = !viewport || viewport.zoom >= TRAIN_DETAIL_MIN_ZOOM;
    const visibleTrains = filterLiveTrainsForMap(liveTrains, map, viewport, location);
    // Remove those not present
    const currentIds = new Set(visibleTrains.map(t => t.id));
    Object.keys(trainMarkersRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        trainMarkersRef.current[id].remove();
        delete trainMarkersRef.current[id];
      }
    });
    visibleTrains.forEach(train => {
      const heading = (typeof train.heading === 'number' && isFinite(train.heading)) ? train.heading : 0;
      const dwelling = train.phase === 'dwelling';
      const existing = trainMarkersRef.current[train.id];
      if (existing) {
        // Tick update: just move and rotate. Avoid setIcon — that swaps the
        // entire DOM and would re-decode the PNG every second, causing flicker.
        existing.setLatLng([train.livePos.lat, train.livePos.lng]);
        const el = existing.getElement();
        const wrapper = el && el.querySelector('.train-marker-v2');
        if (wrapper) {
          wrapper.style.setProperty('--rot', heading.toFixed(1) + 'deg');
          wrapper.classList.toggle('dwelling', dwelling);
          wrapper.classList.toggle('labels-hidden', !showTrainDetails);
        }
      } else {
        const icon = L.divIcon({
          className: '', html: buildTrainMarkerHtml(train, showTrainDetails),
          iconSize: [1,1], iconAnchor: [0, 0],
        });
        const m = L.marker([train.livePos.lat, train.livePos.lng], { icon, zIndexOffset: 500 })
          .addTo(map)
          .on('click', () => onTrainClick(train));
        trainMarkersRef.current[train.id] = m;
      }
    });
  }, [liveTrains, location && location.lat, location && location.lng, onTrainClick, viewportTick]);

  // Centre on the user's location whenever it changes. On first paint, also
  // bump the zoom up so the user lands on a usable street-level view instead
  // of the wide region-default zoom.
  useEffectM(() => {
    const map = leafletRef.current;
    if (!map || !location) return;
    if (!initialFramedRef.current) {
      map.setView([location.lat, location.lng], 13, { animate: false });
      initialFramedRef.current = true;
      return;
    }
    const targetZoom = Math.max(map.getZoom() || 0, 13);
    map.flyTo([location.lat, location.lng], targetZoom, { duration: 0.6 });
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
            onClick: (e) => {
              e.stopPropagation();
              if (handleQuickPick) handleQuickPick('now');
            },
          }, "現在"),
          React.createElement("button", {
            type: "button", role: "tab",
            className: "map-hud-tab " + (hudMode === 'predict' ? 'active' : ''),
            "aria-selected": hudMode === 'predict',
            onClick: (e) => {
              e.stopPropagation();
              // Switching from "now" → forecast: restore the bucket the user
              // last used (+30 / +1 小時 / 自訂), defaulting to +30 on first
              // toggle. Already-forecast modes stay put. Open the panel either
              // way so the user can fine-tune.
              if (handleQuickPick && quickPick === 'now') {
                handleQuickPick(lastPredictPick || '30');
              }
              if (onHudClick) onHudClick();
            },
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
// EMPTY-STATE RENDERER — single source of truth for "why is the train list
// blank right now". Three flavours, ranked by specificity:
//   1. no location yet               → ask user to pick one
//   2. off-rail (location set, but   → tell them how far the closest line is
//      no candidate line in range)
//   3. filters too tight             → suggest loosening direction / type
//   4. genuinely nothing within ±30m → show a quiet "no trains" message
// All flavours share the .train-empty container so layout is identical.
function renderEmptyState({ nearest, offRail, dirFilter, typeFilters }) {
  let iconId = 'me-clock';
  let title = '沒有符合的列車';
  let detail = null;
  if (!nearest && !offRail) {
    iconId = 'me-locate';
    title = '尚未選擇位置';
    detail = '可以使用上方搜尋、按定位按鈕,或在地圖上直接點選一個位置。';
  } else if (offRail) {
    iconId = 'me-locate';
    title = '目前位置不在任何鐵道附近';
    detail = `最近的「${offRail.lineName}」距離 ${offRail.dist.toFixed(1)} km,可以再放大地圖、或挑一個更靠近鐵道的位置。`;
  } else if (dirFilter !== 'all' || (typeFilters && typeFilters.length > 0)) {
    iconId = 'me-clock';
    title = '此篩選下沒有列車';
    detail = '可以放寬方向或車種篩選,或調整預測時間試試。';
  } else {
    detail = '附近 ±30 分鐘內目前沒有列車經過,可以試著調整預測時間。';
  }
  return React.createElement("div", { className: "train-empty" },
    React.createElement(Icon, { id: iconId, size: 32 }),
    React.createElement("div", { className: "train-empty-title" }, title),
    detail && React.createElement("div", { className: "train-empty-detail" }, detail),
  );
}

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
        activeLineId === 'all' && candidates && candidates.length > 1
          ? `全部 ${candidates.length} 條線`
          : (nearest ? nearest.line.name : (offRail ? "不在鐵道附近" : "—"))),
    ),
    !collapsed && React.createElement(React.Fragment, null,
      candidates && candidates.length > 1 && React.createElement("div", {
        className: "sheet-filters",
        style: { borderBottom: '1px dashed var(--me-border)' },
      },
        React.createElement("span", {
          style: { fontSize: 11, color: 'var(--me-text-muted)', alignSelf: 'center', marginRight: 4 },
        }, "在這附近："),
        React.createElement("button", {
          key: '__all__',
          className: "pill " + (activeLineId === 'all' ? 'active' : ''),
          onClick: () => setActiveLineId && setActiveLineId('all'),
          title: `全部 ${candidates.length} 條線`,
        },
          React.createElement("span", {
            className: "pill-dot",
            style: {
              background: `linear-gradient(135deg, ${candidates.slice(0, 3).map(c => c.line.color).join(', ')})`,
            },
          }),
          "全部",
          React.createElement("span", {
            style: { fontSize: 10, opacity: 0.65, marginLeft: 4 },
          }, candidates.length, " 條"),
        ),
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
          ? renderEmptyState({ nearest, offRail, dirFilter, typeFilters })
          : trains.slice(0, 40).map(t =>
              React.createElement(TrainCard, {
                key: t.id, train: t, targetTime, onSelect: () => onSelect(t),
                showLine: activeLineId === 'all',
              }))
      ),
    ),
  );
}

// ============================================================
// TRAIN CARD
// ============================================================
function TrainCard({ train, targetTime, onSelect, showLine }) {
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
        showLine && train.line && React.createElement("span", {
          className: "tc-line-tag",
          style: {
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 6px',
            fontSize: 10, fontWeight: 500,
            color: train.line.color,
            background: train.line.color + '14',
            border: `1px solid ${train.line.color}33`,
            borderRadius: 4,
            whiteSpace: 'nowrap',
          },
        },
          React.createElement("span", {
            style: { width: 6, height: 6, borderRadius: '50%', background: train.line.color },
          }),
          train.line.name,
        ),
        React.createElement("span", {
          className: "tc-route-mini",
          title: `${firstStop} → ${lastStop}`,
        }, firstStop, " → ", lastStop),
      ),
      prev && next && React.createElement("div", { className: "tc-segment" },
        React.createElement("span", { className: "tc-seg-stop" },
          React.createElement("span", { className: "tc-seg-time" }, formatClock(prev.departure)),
          React.createElement("span", { className: "tc-seg-name", title: prev.name },
            React.createElement("span", { className: "tc-seg-name-inner" }, prev.name)),
        ),
        React.createElement("span", { className: "tc-seg-arrow" }, "──▶"),
        React.createElement("span", { className: "tc-seg-stop tc-seg-stop-end" },
          React.createElement("span", { className: "tc-seg-time" }, formatClock(next.arrival)),
          React.createElement("span", { className: "tc-seg-name", title: next.name },
            React.createElement("span", { className: "tc-seg-name-inner" }, next.name)),
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
function TrainModal({ train, nearest, targetTime, onClose, onFlyToTrain }) {
  // Trains can arrive here from two sources:
  //   • the bottom sheet — they carry passTime/prevStop/nextStop computed at
  //     the user's snap point;
  //   • a marker click on the map — they carry livePos/liveKm/phase but no
  //     snap-point fields.
  // Treat all snap-point-specific data as optional so a map click never
  // throws (formatClock(undefined) used to crash the whole tree).
  const hasPassTime = train.passTime instanceof Date && !isNaN(train.passTime);
  const diffMs = hasPassTime ? (train.passTime - targetTime) : null;
  const cd = hasPassTime ? formatCountdown(diffMs) : null;
  const firstStop = train.stops[0];
  const lastStop = train.stops[train.stops.length - 1];
  const totalKm = lastStop.km - firstStop.km;
  const duration = (train.endTime - train.startTime) / 60000;
  const stopsCount = train.stops.length;
  const phaseLabel = train.phase === 'dwelling' ? '停靠中'
    : train.phase === 'running' ? '運行中'
    : null;

  // Find the upcoming stop relative to targetTime — used to highlight the
  // train's progress along the timetable when no snap point is available.
  let upcomingIdx = -1;
  for (let i = 0; i < train.stops.length; i++) {
    if (train.stops[i].arrival >= targetTime) { upcomingIdx = i; break; }
  }

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
        React.createElement("div", { style: { flex: 1, minWidth: 0 } },
          React.createElement("div", {
            style: { fontFamily: 'var(--me-font-mono)', fontSize: 18, fontWeight: 700 }
          }, train.number, " 次"),
          React.createElement("div", {
            style: { fontSize: 12, color: 'var(--me-text-secondary)' }
          }, train.directionLabel || (train.direction === 'up' ? '北上' : '南下')),
        ),
        phaseLabel && React.createElement("span", {
          style: {
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px',
            fontSize: 11, fontWeight: 600,
            borderRadius: 999,
            background: train.phase === 'dwelling' ? 'rgba(251,191,36,0.15)' : 'rgba(34,197,94,0.15)',
            color: train.phase === 'dwelling' ? 'var(--me-warning)' : '#22c55e',
            border: `1px solid ${train.phase === 'dwelling' ? 'rgba(251,191,36,0.35)' : 'rgba(34,197,94,0.35)'}`,
          },
        },
          React.createElement("span", {
            style: {
              width: 6, height: 6, borderRadius: '50%',
              background: 'currentColor',
              animation: train.phase === 'running' ? 'pulse 1.5s ease-in-out infinite' : 'none',
            },
          }),
          phaseLabel,
        ),
        onFlyToTrain && React.createElement("button", {
          className: "modal-action",
          onClick: () => onFlyToTrain(train),
          title: "在地圖上顯示列車位置",
        },
          React.createElement(Icon, { id: "me-locate", size: 14 }),
          React.createElement("span", null, "顯示位置"),
        ),
        React.createElement("button", { className: "modal-close", onClick: onClose },
          React.createElement(Icon, { id: "me-close", size: 18 })),
      ),
      React.createElement("div", { className: "modal-body" },
        // Route summary — start station → end station along this line.
        React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: 12, alignItems: 'center',
            padding: '12px',
            background: 'var(--me-bg-tertiary)',
            border: '1px solid var(--me-border)',
            borderRadius: 'var(--me-radius-sm)',
            marginBottom: 12,
          },
        },
          React.createElement("div", { style: { textAlign: 'left', minWidth: 0 } },
            React.createElement("div", {
              style: { fontSize: 10, color: 'var(--me-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }
            }, "起站"),
            React.createElement("div", {
              style: { fontSize: 14, fontWeight: 600, color: 'var(--me-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
            }, firstStop.name),
            React.createElement("div", {
              style: { fontFamily: 'var(--me-font-mono)', fontSize: 12, color: 'var(--me-text-secondary)' }
            }, formatClock(firstStop.departure)),
          ),
          React.createElement("div", {
            style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'var(--me-text-muted)', fontSize: 11 },
          },
            React.createElement("span", null, train.line.name),
            React.createElement("span", { style: { fontSize: 14 } }, "──▶"),
          ),
          React.createElement("div", { style: { textAlign: 'right', minWidth: 0 } },
            React.createElement("div", {
              style: { fontSize: 10, color: 'var(--me-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }
            }, "迄站"),
            React.createElement("div", {
              style: { fontSize: 14, fontWeight: 600, color: 'var(--me-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
            }, lastStop.name),
            React.createElement("div", {
              style: { fontFamily: 'var(--me-font-mono)', fontSize: 12, color: 'var(--me-text-secondary)' }
            }, formatClock(lastStop.arrival)),
          ),
        ),
        React.createElement("div", { className: "modal-stats" },
          hasPassTime
            ? React.createElement("div", { className: "modal-stat" },
                React.createElement("div", { className: "modal-stat-label" }, "通過時間"),
                React.createElement("div", { className: "modal-stat-value" }, formatClock(train.passTime)))
            : React.createElement("div", { className: "modal-stat" },
                React.createElement("div", { className: "modal-stat-label" }, "出發"),
                React.createElement("div", { className: "modal-stat-value" }, formatClock(firstStop.departure))),
          hasPassTime
            ? React.createElement("div", { className: "modal-stat" },
                React.createElement("div", { className: "modal-stat-label" }, "倒數"),
                React.createElement("div", {
                  className: "modal-stat-value",
                  style: diffMs >= 0 && diffMs < 5*60000 ? {
                    background: 'var(--me-accent-gradient)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  } : {},
                }, cd.text + (cd.unit.includes('分') ? ' 分' : cd.unit === '即將通過' ? '' : ' ' + cd.unit)),
              )
            : React.createElement("div", { className: "modal-stat" },
                React.createElement("div", { className: "modal-stat-label" }, "終點"),
                React.createElement("div", { className: "modal-stat-value" }, formatClock(lastStop.arrival))),
          React.createElement("div", { className: "modal-stat" },
            React.createElement("div", { className: "modal-stat-label" }, "全程"),
            React.createElement("div", { className: "modal-stat-value" }, Math.round(duration) + ' 分')),
          React.createElement("div", { className: "modal-stat" },
            React.createElement("div", { className: "modal-stat-label" }, "里程"),
            React.createElement("div", { className: "modal-stat-value" }, totalKm.toFixed(1) + ' km')),
          React.createElement("div", { className: "modal-stat" },
            React.createElement("div", { className: "modal-stat-label" }, "停靠"),
            React.createElement("div", { className: "modal-stat-value" }, stopsCount + ' 站')),
          React.createElement("div", { className: "modal-stat" },
            React.createElement("div", { className: "modal-stat-label" }, "車種"),
            React.createElement("div", { className: "modal-stat-value", style: { fontSize: 14 } }, train.type)),
        ),
        (train.snap || nearest) && hasPassTime && React.createElement("div", {
          style: {
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', marginBottom: 12,
            background: 'rgba(251,191,36,0.08)',
            border: '1px solid rgba(251,191,36,0.25)',
            borderRadius: 'var(--me-radius-sm)',
            fontSize: 12, color: 'var(--me-text-secondary)',
          },
        },
          React.createElement(Icon, { id: "me-locate", size: 14 }),
          (() => {
            const ref = train.snap || nearest;
            return React.createElement("span", null,
              "於距您 ",
              React.createElement("strong", { style: { color: 'var(--me-warning)' } }, ref.dist.toFixed(2), " km"),
              " 的軌道上經過 (里程 ", ref.km.toFixed(1), " km)",
            );
          })(),
        ),
        React.createElement("div", {
          style: { fontSize: 12, color: 'var(--me-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }
        }, "停靠站"),
        React.createElement("div", { className: "timetable" },
          train.stops.map((s, i) => {
            const past = s.arrival < targetTime;
            const isUpcoming = i === upcomingIdx;
            const hl = nearest && train.prevStop && train.prevStop.stationIdx === s.stationIdx;
            const dwellMin = s.dwellSec ? Math.round(s.dwellSec / 60) : 0;
            return React.createElement("div", {
              key: i,
              className: "tt-stop " + (past ? "past " : "") + (hl || (isUpcoming && !hasPassTime) ? "highlight" : ""),
            },
              React.createElement("span", { className: "tt-name" },
                s.name,
                dwellMin > 0 && React.createElement("span", {
                  style: { fontSize: 10, color: 'var(--me-text-muted)', marginLeft: 6, fontWeight: 400 },
                }, "停 ", dwellMin, " 分"),
              ),
              React.createElement("span", { className: "tt-dist" }, s.km.toFixed(1) + ' km'),
              React.createElement("span", { className: "tt-time" }, formatClock(s.arrival)),
            );
          })
        ),
      ),
    ),
  );
}

export { MapArea, TrainSheet, TrainCard, TrainModal };
