import { test, expect } from "@playwright/test";

test.describe("service worker", () => {
  test("registers and serves the app shell offline", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "SW offline test runs only on chromium");

    await page.goto("/");

    await page.waitForFunction(async () => {
      if (!("serviceWorker" in navigator)) return false;
      const reg = await navigator.serviceWorker.getRegistration();
      return Boolean(reg && (reg.active || reg.waiting));
    }, null, { timeout: 15_000 });

    await page.waitForSelector("#app");

    await context.setOffline(true);
    try {
      const res = await page.reload({ waitUntil: "load" });
      expect(res, "navigation response").not.toBeNull();
      expect(res.ok(), "navigation response ok").toBeTruthy();
      await expect(page.locator("#app")).toBeVisible();
    } finally {
      await context.setOffline(false);
    }
  });
});
