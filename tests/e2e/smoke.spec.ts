import { test, expect } from "@playwright/test";

test("home page scaffold renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "ProjectHub MVP Scaffold" })).toBeVisible();
});
