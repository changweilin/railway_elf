import { test, expect } from '@playwright/test';

const BASE_ORIGIN = 'http://localhost:4173';
const SAME_ORIGIN_RE = new RegExp(`^${BASE_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`);
const IGNORED_CONSOLE_PATTERNS = [
  /Failed to load resource:/i,
];

function captureErrors(page) {
  const errors = [];
  page.on('pageerror', (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (IGNORED_CONSOLE_PATTERNS.some((re) => re.test(text))) return;
    errors.push(`console.error: ${text}`);
  });
  page.on('crash', () => errors.push('page crashed'));
  page.on('weberror', (err) => errors.push(`weberror: ${err.error().message}`));
  page.on('response', (resp) => {
    const status = resp.status();
    if (status < 400) return;
    const url = resp.url();
    if (!SAME_ORIGIN_RE.test(url)) return;
    errors.push(`http ${status}: ${url}`);
  });
  return errors;
}

async function waitForAppReady(page) {
  await expect(page.locator('#app .toolbar')).toBeVisible();
  await expect(page.locator('#map.leaflet-container')).toBeVisible();
  await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible();
  const timeInput = page.locator('input[type="time"]').first();
  await timeInput.fill('12:00');
  await expect(timeInput).toHaveValue('12:00');
  await expect.poll(async () => page.locator('.train-marker-v2').count(), {
    timeout: 10_000,
  }).toBeGreaterThan(0);
}

async function collectMarkerMetrics(page) {
  return page.evaluate(() => {
    const markers = [...document.querySelectorAll('.train-marker-v2')];
    const icons = [...document.querySelectorAll('.train-marker-v2 .train-icon')];
    const labels = [...document.querySelectorAll('.train-marker-label')];
    const mapRect = document.querySelector('#map')?.getBoundingClientRect();
    const visibleIcons = icons.map((icon) => {
      const rect = icon.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        w: rect.width,
        h: rect.height,
      };
    }).filter((p) => {
      if (!mapRect) return true;
      return p.x >= mapRect.left && p.x <= mapRect.right &&
        p.y >= mapRect.top && p.y <= mapRect.bottom &&
        p.w > 0 && p.h > 0;
    });

    let minIconDistance = null;
    for (let i = 0; i < visibleIcons.length; i++) {
      for (let j = i + 1; j < visibleIcons.length; j++) {
        const dx = visibleIcons[i].x - visibleIcons[j].x;
        const dy = visibleIcons[i].y - visibleIcons[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (minIconDistance == null || distance < minIconDistance) {
          minIconDistance = distance;
        }
      }
    }

    const visibleLabels = labels.filter((label) => {
      const style = getComputedStyle(label);
      const rect = label.getBoundingClientRect();
      return style.visibility !== 'hidden' &&
        Number(style.opacity) > 0.5 &&
        rect.width > 0 &&
        rect.height > 0;
    });

    return {
      markerCount: markers.length,
      iconCount: icons.length,
      visibleIconCount: visibleIcons.length,
      labelCount: labels.length,
      visibleLabelCount: visibleLabels.length,
      hiddenMarkerCount: markers.filter((marker) => marker.classList.contains('labels-hidden')).length,
      minIconDistance: minIconDistance == null ? null : Number(minIconDistance.toFixed(1)),
      hasOverlay: Boolean(document.querySelector('vite-error-overlay')),
    };
  });
}

async function findClickableTrainMarker(page) {
  return page.evaluate(() => {
    const mapRect = document.querySelector('#map')?.getBoundingClientRect();
    if (!mapRect) return null;
    const icons = [...document.querySelectorAll('.train-marker-v2 .train-icon')];
    for (const icon of icons) {
      const rect = icon.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      if (rect.width <= 0 || rect.height <= 0) continue;
      if (x < mapRect.left + 12 || x > mapRect.right - 12) continue;
      if (y < mapRect.top + 70 || y > Math.min(mapRect.bottom - 20, mapRect.top + mapRect.height * 0.46)) continue;
      const top = document.elementFromPoint(x, y);
      if (top && top.closest('.train-marker-v2')) {
        return { x, y };
      }
    }
    return null;
  });
}

async function zoomOutUntilLabelsHidden(page) {
  const zoomOut = page.locator('.leaflet-control-zoom-out');
  for (let i = 0; i < 4; i++) {
    const metrics = await collectMarkerMetrics(page);
    if (metrics.visibleLabelCount === 0) return metrics;
    await zoomOut.click();
  }
  await expect.poll(async () => (await collectMarkerMetrics(page)).visibleLabelCount, {
    timeout: 5_000,
  }).toBe(0);
  return collectMarkerMetrics(page);
}

async function waitForIconSpacing(page, minGapPx) {
  let lastMetrics = null;
  await expect.poll(async () => {
    lastMetrics = await collectMarkerMetrics(page);
    if (lastMetrics.visibleIconCount <= 1 || lastMetrics.minIconDistance == null) return -1;
    return lastMetrics.minIconDistance;
  }, {
    timeout: 8_000,
  }).toBeGreaterThanOrEqual(minGapPx);
  return lastMetrics || collectMarkerMetrics(page);
}

async function waitForLabelsVisible(page) {
  await expect.poll(async () => (await collectMarkerMetrics(page)).visibleLabelCount, {
    timeout: 8_000,
  }).toBeGreaterThan(0);
  return collectMarkerMetrics(page);
}

test.describe('map marker density', () => {
  test('caps dense train markers, hides labels when zoomed out, and keeps markers clickable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'desktop density regression');

    const errors = captureErrors(page);
    await page.goto('/');
    await waitForAppReady(page);

    const taiwanZoom13 = await collectMarkerMetrics(page);
    expect(taiwanZoom13.hasOverlay).toBe(false);
    expect(taiwanZoom13.markerCount).toBeGreaterThan(0);
    expect(taiwanZoom13.markerCount).toBeLessThanOrEqual(160);
    expect(taiwanZoom13.visibleLabelCount).toBeGreaterThan(0);
    expect(taiwanZoom13.hiddenMarkerCount).toBe(0);
    if (taiwanZoom13.visibleIconCount > 1) {
      expect(taiwanZoom13.minIconDistance).toBeGreaterThanOrEqual(19.5);
    }

    let taiwanZoom11 = await zoomOutUntilLabelsHidden(page);
    if (taiwanZoom11.visibleIconCount > 1) {
      taiwanZoom11 = await waitForIconSpacing(page, 27.5);
    }
    expect(taiwanZoom11.markerCount).toBeGreaterThan(0);
    expect(taiwanZoom11.markerCount).toBeLessThanOrEqual(110);
    expect(taiwanZoom11.hiddenMarkerCount).toBe(taiwanZoom11.markerCount);
    if (taiwanZoom11.visibleIconCount > 1) {
      expect(taiwanZoom11.minIconDistance).toBeGreaterThanOrEqual(27.5);
    }

    const regionSelect = page.locator('select').first();
    await regionSelect.selectOption('japan');
    await expect(regionSelect).toHaveValue('japan');
    await expect.poll(async () => page.locator('.train-marker-v2').count(), {
      timeout: 10_000,
    }).toBeGreaterThan(0);

    const japanZoom13 = await waitForLabelsVisible(page);
    expect(japanZoom13.hasOverlay).toBe(false);
    expect(japanZoom13.markerCount).toBeGreaterThan(0);
    expect(japanZoom13.markerCount).toBeLessThanOrEqual(160);
    expect(japanZoom13.visibleLabelCount).toBeGreaterThan(0);
    if (japanZoom13.visibleIconCount > 1) {
      expect(japanZoom13.minIconDistance).toBeGreaterThanOrEqual(19.5);
    }

    const clickTarget = await findClickableTrainMarker(page);
    expect(clickTarget, 'clickable train marker').not.toBeNull();
    await page.mouse.click(clickTarget.x, clickTarget.y);
    await expect(page.locator('.modal-backdrop .modal')).toBeVisible();

    expect(errors, `errors during marker density regression:\n${errors.join('\n')}`).toEqual([]);
  });
});
