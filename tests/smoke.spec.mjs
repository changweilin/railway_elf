import { test, expect } from '@playwright/test';

// Wires console / pageerror / unhandledrejection capture and returns a
// getter for the accumulated errors.
// Smoke test only cares about errors from our own origin and React/Leaflet
// runtime issues. Third-party services (favicon proxies, map tile CDNs,
// unpkg) can flake or return 4xx for individual edge cases without breaking
// the app, so we filter those out before asserting.
const BASE_ORIGIN = 'http://localhost:4173';
const SAME_ORIGIN_RE = new RegExp(`^${BASE_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`);

// "Failed to load resource: the server responded with a status of …" is the
// browser's own paraphrase of a 4xx/5xx network response. We capture HTTP
// status separately and only on same-origin, so this generic console message
// would be a duplicate (and is usually triggered by an external 404 we are
// already ignoring).
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
  // App renders inside #app via React.createRoot. Wait for the toolbar (first
  // thing painted) so we know the React tree has mounted.
  await expect(page.locator('#app .toolbar')).toBeVisible();
  // Leaflet tiles are async — wait for at least one to load.
  await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible();
}

test.describe('homepage smoke', () => {
  test('boots without errors and renders core UI', async ({ page }) => {
    const errors = captureErrors(page);
    await page.goto('/');
    await waitForAppReady(page);

    // App container is non-empty
    const appHandle = page.locator('#app');
    await expect(appHandle).not.toBeEmpty();

    // Toolbar + region select present
    await expect(page.locator('select[aria-label="選擇地區"]')).toBeVisible();

    // Map HUD clock is visible (now/predict tabs)
    await expect(page.locator('.map-hud-clock')).toBeVisible();

    // No console / page errors during boot
    expect(errors, `errors during boot:\n${errors.join('\n')}`).toEqual([]);
  });

  test('region toggle TW ↔ JP', async ({ page }) => {
    const errors = captureErrors(page);
    await page.goto('/');
    await waitForAppReady(page);

    const regionSelect = page.locator('select[aria-label="選擇地區"]');
    await expect(regionSelect).toHaveValue('taiwan');
    await regionSelect.selectOption('japan');
    await expect(regionSelect).toHaveValue('japan');
    // Tiles should still load after region switch
    await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible();
    await regionSelect.selectOption('taiwan');
    await expect(regionSelect).toHaveValue('taiwan');

    expect(errors, `errors during region toggle:\n${errors.join('\n')}`).toEqual([]);
  });

  test('map click drops a location and surfaces train list', async ({ page }) => {
    const errors = captureErrors(page);
    await page.goto('/');
    await waitForAppReady(page);

    // Click the centre of the map. The map starts framed on the regional
    // default (台北車站) which sits on multiple TRA / metro lines, so a
    // centre click reliably snaps to a candidate.
    const mapBox = await page.locator('#map').boundingBox();
    expect(mapBox).not.toBeNull();
    await page.mouse.click(mapBox.x + mapBox.width / 2, mapBox.y + mapBox.height / 2);

    // Either the train list populates with cards, or it shows a "no trains"
    // empty state. Both are acceptable as long as nothing throws.
    const sheet = page.locator('.train-list');
    await expect(sheet).toBeVisible();
    const hasTrains = await page.locator('.train-list .train-card').count();
    const hasEmpty = await page.locator('.train-list .train-empty').count();
    expect(hasTrains + hasEmpty).toBeGreaterThan(0);

    expect(errors, `errors after map click:\n${errors.join('\n')}`).toEqual([]);
  });

  test('train detail modal opens and closes', async ({ page }) => {
    const errors = captureErrors(page);
    await page.goto('/');
    await waitForAppReady(page);

    // Use the regional default location's pre-snapped trains. Cards may take
    // a tick to render after generate() runs, so use locator auto-waiting.
    const firstCard = page.locator('.train-list .train-card').first();
    if ((await firstCard.count()) === 0) {
      test.skip(true, 'no trains in default snap window — skipping modal check');
      return;
    }
    await firstCard.click();
    const modal = page.locator('.modal-backdrop .modal');
    await expect(modal).toBeVisible();
    // Click backdrop to close
    await page.locator('.modal-backdrop').click({ position: { x: 5, y: 5 } });
    await expect(modal).toHaveCount(0);

    expect(errors, `errors during modal flow:\n${errors.join('\n')}`).toEqual([]);
  });

  test('HUD now/predict tab drives global targetTime', async ({ page }) => {
    const errors = captureErrors(page);
    await page.goto('/');
    await waitForAppReady(page);

    const nowTab = page.locator('.map-hud-tab', { hasText: '現在' });
    const predictTab = page.locator('.map-hud-tab', { hasText: '預測' });
    const clock = page.locator('.map-hud-clock-time');

    await expect(nowTab).toHaveAttribute('aria-selected', 'true');
    const before = (await clock.textContent())?.trim() ?? '';

    await predictTab.click();
    await expect(predictTab).toHaveAttribute('aria-selected', 'true');

    // After clicking 預測 from a 'now' state, targetTime jumps +30 min so
    // the clock text must change. Allow a tick for React state propagation.
    await expect.poll(async () => (await clock.textContent())?.trim() ?? '',
      { timeout: 4000 }).not.toBe(before);

    // Predict-tab side-effect on mobile: opens the drawer panel as an overlay
    // so the user can fine-tune the time. That panel covers the HUD, so close
    // it via the toolbar menu toggle before clicking 現在 again. On desktop
    // the menu button is hidden (the panel is a permanent sidebar), so this
    // step is a no-op there.
    const menuBtn = page.locator('.tb-menu-btn');
    if (await menuBtn.isVisible().catch(() => false)) {
      const isOpen = await menuBtn.evaluate((el) => el.classList.contains('active'));
      if (isOpen) {
        await menuBtn.click();
        await expect(page.locator('.panel.open')).toHaveCount(0);
      }
    }

    // Switching back to 現在 resyncs.
    await nowTab.click();
    await expect(nowTab).toHaveAttribute('aria-selected', 'true');

    expect(errors, `errors during HUD toggle:\n${errors.join('\n')}`).toEqual([]);
  });

  test('mobile viewport: key controls are within viewport and not occluded', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile-only check');
    const errors = captureErrors(page);
    await page.goto('/');
    await waitForAppReady(page);

    const viewport = page.viewportSize();
    const mustBeVisible = ['.toolbar', '#map', '.map-hud-clock', '.train-list'];
    for (const sel of mustBeVisible) {
      const el = page.locator(sel).first();
      await expect(el).toBeVisible();
      const box = await el.boundingBox();
      expect(box, `${sel} bounding box`).not.toBeNull();
      // Must intersect the viewport on both axes
      expect(box.x).toBeLessThan(viewport.width);
      expect(box.y).toBeLessThan(viewport.height);
      expect(box.x + box.width).toBeGreaterThan(0);
      expect(box.y + box.height).toBeGreaterThan(0);
    }

    expect(errors, `errors during mobile layout check:\n${errors.join('\n')}`).toEqual([]);
  });
});
