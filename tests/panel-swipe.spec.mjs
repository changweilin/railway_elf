import { test, expect } from '@playwright/test';

// Mobile-only: dragging the time-slider thumb leftward must NOT trigger the
// panel's swipe-to-close gesture. Regression guard for the panel-wide
// onTouchMove that used to fire on any leftward touch drag, including one
// that started inside <input type="range">.
test('mobile: leftward drag on time slider keeps panel open', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only gesture check');

  await page.goto('/');
  await expect(page.locator('#app .toolbar')).toBeVisible();

  // Open the drawer if it isn't already open.
  const menuBtn = page.locator('.tb-menu-btn');
  if (await menuBtn.isVisible().catch(() => false)) {
    const isOpen = await menuBtn.evaluate((el) => el.classList.contains('active'));
    if (!isOpen) await menuBtn.click();
  }
  const panel = page.locator('.panel.open');
  await expect(panel).toBeVisible();

  // Locate the time-slider range input and synthesise a leftward touch drag
  // across its thumb. We dispatch raw TouchEvents because Playwright's
  // touchscreen API moves the page's pointer, not a finger on a specific
  // element, and the bug we're guarding against is bubbling-target specific.
  const slider = page.locator('.time-slider input[type="range"]');
  await expect(slider).toBeVisible();
  const box = await slider.boundingBox();
  expect(box).not.toBeNull();

  const startX = box.x + box.width * 0.8;
  const endX = box.x + box.width * 0.1; // ~70% leftward, well past the 60px threshold
  const y = box.y + box.height / 2;

  await slider.evaluate((el, args) => {
    const { startX, endX, y } = args;
    const make = (type, x) => new TouchEvent(type, {
      bubbles: true,
      cancelable: true,
      touches: type === 'touchend' ? [] : [new Touch({
        identifier: 1, target: el, clientX: x, clientY: y,
      })],
      changedTouches: [new Touch({
        identifier: 1, target: el, clientX: x, clientY: y,
      })],
    });
    el.dispatchEvent(make('touchstart', startX));
    // Several intermediate moves to look like a real drag.
    for (let i = 1; i <= 5; i += 1) {
      const x = startX + (endX - startX) * (i / 5);
      el.dispatchEvent(make('touchmove', x));
    }
    el.dispatchEvent(make('touchend', endX));
  }, { startX, endX, y });

  // Panel must still be open after the slider drag.
  await expect(page.locator('.panel.open')).toBeVisible();
});
