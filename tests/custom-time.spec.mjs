import { test, expect } from '@playwright/test';

test('custom time persists across now/custom toggling', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#app .toolbar')).toBeVisible();

  // Make sure the panel is open (mobile drawer)
  const menuBtn = page.locator('.tb-menu-btn');
  if (await menuBtn.isVisible().catch(() => false)) {
    const isOpen = await menuBtn.evaluate((el) => el.classList.contains('active'));
    if (!isOpen) await menuBtn.click();
  }

  // 1) Click 自訂
  await page.locator('.time-quick button', { hasText: '自訂' }).click();

  // 2) Adjust the time input to a fixed value
  const timeInput = page.locator('input[type="time"]').first();
  await timeInput.fill('16:30');
  // sanity: time input now reads 16:30
  await expect(timeInput).toHaveValue('16:30');

  // 3) Click 現在
  await page.locator('.time-quick button', { hasText: '現在' }).click();
  // time input no longer 16:30 (it tracks now)
  await expect.poll(async () => (await timeInput.inputValue())).not.toBe('16:30');

  // 4) Click 自訂 again — should restore 16:30
  await page.locator('.time-quick button', { hasText: '自訂' }).click();
  await expect(timeInput).toHaveValue('16:30');
});
