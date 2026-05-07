import { test, expect } from '@playwright/test';

// Failure-state coverage for the Step 4 NoticeStack + inline UX.
// These tests deliberately break the things that can flake in production
// (geolocation API, Nominatim, tile CDN, off-rail location) and check that
// the user-facing affordances still appear. Without this, a refactor could
// silently strip the notice / empty-state code and the smoke tests would
// not catch it.

const BASE_ORIGIN = 'http://localhost:4173';

// Lightweight ready check that does NOT require .leaflet-tile-loaded —
// the tile-burst test deliberately blocks every tile, so waiting on a
// loaded tile would hang. Toolbar = React tree mounted.
async function waitForToolbar(page) {
  await expect(page.locator('#app .toolbar')).toBeVisible();
}

async function waitForAppReady(page) {
  await waitForToolbar(page);
  await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible();
}

// On the mobile project the side panel starts collapsed; the "使用我的位置"
// button lives inside it. Open the panel via the toolbar menu toggle so the
// failure-state tests work in both desktop and mobile projects.
async function openPanelIfNeeded(page) {
  const menuBtn = page.locator('.tb-menu-btn');
  if (!(await menuBtn.isVisible().catch(() => false))) return;
  const isOpen = await menuBtn.evaluate((el) => el.classList.contains('active'));
  if (!isOpen) {
    await menuBtn.click();
    await expect(page.locator('.panel.open')).toBeVisible();
  }
}

// Replace navigator.geolocation BEFORE any app code runs. Each call
// invokes the supplied `behaviour` so individual tests can pick success
// vs. error and the coordinates returned.
async function installGeolocationStub(page, behaviour) {
  await page.addInitScript((b) => {
    const stub = {
      getCurrentPosition: (success, error) => {
        if (b.kind === 'success') {
          success({
            coords: {
              latitude: b.lat,
              longitude: b.lng,
              accuracy: 10,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          });
        } else {
          error({ code: b.code, message: b.message || 'denied' });
        }
      },
      watchPosition: () => 1,
      clearWatch: () => {},
    };
    Object.defineProperty(navigator, 'geolocation', {
      value: stub,
      configurable: true,
    });
  }, behaviour);
}

test.describe('failure states', () => {
  test('geolocation permission denied surfaces notice-error', async ({ page }) => {
    await installGeolocationStub(page, { kind: 'error', code: 1, message: 'User denied' });
    await page.goto('/');
    await waitForAppReady(page);
    await openPanelIfNeeded(page);

    // The same accessible name "使用我的位置" is on both the panel button
    // (.btn-soft) and the floating map FAB (.map-fab) — scope to the panel.
    await page.locator('.panel button:has-text("使用我的位置")').click();

    const errNotice = page.locator('.notice-error');
    await expect(errNotice).toBeVisible();
    await expect(errNotice).toContainText('已拒絕定位權限');

    // Dismiss button removes it.
    await errNotice.locator('.notice-dismiss').click();
    await expect(errNotice).toHaveCount(0);
  });

  test('nominatim failure surfaces inline search-error', async ({ page }) => {
    await page.route('**/nominatim.openstreetmap.org/**', (route) => route.abort());
    await page.goto('/');
    await waitForAppReady(page);
    await openPanelIfNeeded(page);

    const input = page.locator('.search-input');
    await input.fill('Taipei');

    const err = page.locator('.search-error');
    // 400 ms debounce + aborted fetch → catch branch runs.
    await expect(err).toBeVisible({ timeout: 5000 });
    await expect(err).toContainText('搜尋暫時無法使用');

    // Clearing the input wipes the inline error.
    await page.locator('.search-clear').click();
    await expect(page.locator('.search-error')).toHaveCount(0);
  });

  test('tile-error burst surfaces notice-warn', async ({ page }) => {
    // Block both default and CARTO tile providers so every tile request
    // fails — the burst counter requires ≥3 tileerror within 4 s.
    await page.route('**/*.basemaps.cartocdn.com/**', (route) => route.abort());
    await page.route('**/cartocdn.com/**', (route) => route.abort());
    await page.route('**/*.tile.openstreetmap.org/**', (route) => route.abort());

    await page.goto('/');
    // Toolbar only — a normal waitForAppReady would hang because no tile
    // ever loads.
    await waitForToolbar(page);
    await expect(page.locator('#map')).toBeVisible();

    // Pan the map a few times to provoke fresh tile requests beyond the
    // initial viewport, ensuring we cross the burst threshold.
    const map = page.locator('#map');
    const box = await map.boundingBox();
    if (!box) throw new Error('map has no bounding box');
    for (let i = 0; i < 4; i++) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 200, box.y + box.height / 2 - 200, { steps: 5 });
      await page.mouse.up();
    }

    const warn = page.locator('.notice-warn');
    await expect(warn).toBeVisible({ timeout: 8000 });
    await expect(warn).toContainText('地圖圖磚載入失敗');
  });

  test('off-rail empty state when geolocation lands far from any line', async ({ page }) => {
    // Pacific Ocean east of Taiwan — far from every line in the dataset.
    await installGeolocationStub(page, { kind: 'success', lat: 24, lng: 130 });
    await page.goto('/');
    await waitForAppReady(page);
    await openPanelIfNeeded(page);

    await page.locator('.panel button:has-text("使用我的位置")').click();

    const trainEmptyTitle = page.locator('.train-empty-title');
    await expect(trainEmptyTitle).toHaveText('目前位置不在任何鐵道附近', { timeout: 5000 });
    await expect(page.locator('.train-empty-detail')).toContainText('km');

    // Sidebar nearest section mirrors the same off-rail title.
    await expect(page.locator('.nearest-empty-title')).toHaveText('目前位置不在任何鐵道附近');
  });
});
