import { test, expect } from "@playwright/test";

test("Create workflow and rerun", async ({ page }) => {

  await page.goto("/login");

  await page.fill("#email", "qa@test.com");
  await page.fill("#password", "Password123");

  await page.click("button[type=submit]");

  await page.goto("/workflows");

  await page.click("text=HubSpot to Xero");

  await page.click("text=Run History");

  await page.click("text=Re-Run");

  await expect(
    page.locator("text=Workflow queued")
  ).toBeVisible();

});
