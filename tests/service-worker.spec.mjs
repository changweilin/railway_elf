import { test, expect } from "@playwright/test";

test.describe("service worker", () => {
  test("registers and reaches the activated state", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "SW test runs only on chromium");

    await page.goto("/");
    await page.waitForSelector("#app .toolbar", { timeout: 15_000 });

    await page.waitForFunction(async () => {
      if (!("serviceWorker" in navigator)) return false;
      const reg = await navigator.serviceWorker.getRegistration();
      return Boolean(reg && reg.active && reg.active.state === "activated");
    }, null, { timeout: 15_000 });
  });

  test("update-ready event surfaces a reload notice that dispatches sw:apply-update", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#app");

    // Capture sw:apply-update dispatched back from the notice action.
    await page.evaluate(() => {
      window.__swApplyUpdateCount = 0;
      window.addEventListener("sw:apply-update", () => { window.__swApplyUpdateCount++; });
    });

    // Simulate main.js detecting a waiting SW.
    await page.evaluate(() => window.dispatchEvent(new Event("sw:update-ready")));

    const notice = page.locator(".notice.notice-info").filter({ hasText: "新版已可用" });
    await expect(notice).toBeVisible();

    const action = notice.locator(".notice-action");
    await expect(action).toHaveText("重新載入");
    await action.click();

    await expect(notice).toBeHidden();
    const count = await page.evaluate(() => window.__swApplyUpdateCount);
    expect(count).toBe(1);
  });
});
