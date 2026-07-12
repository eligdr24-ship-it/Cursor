import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const outDir = "/tmp/almadery-shots";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });

// --- Form behaviour ---
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.locator("#private-access").scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);

// invalid submit
await page.getByLabel("Email Address").fill("not-an-email");
await page.getByRole("button", { name: /request private access/i }).click();
await page.waitForTimeout(400);
console.log("invalid msg:", await page.locator('[role="alert"]').textContent());
await page.screenshot({ path: `${outDir}/f-invalid.png` });

// valid submit -> loading -> success
await page.getByLabel("Email Address").fill("collector@example.com");
await page.getByRole("button", { name: /request private access/i }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${outDir}/f-loading.png` });
await page.waitForTimeout(1600);
console.log("success visible:", await page.locator('[role="status"]').textContent());
await page.screenshot({ path: `${outDir}/f-success.png` });
await page.close();

// --- Reduced motion smoke test ---
const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const errors = [];
rm.on("pageerror", (e) => errors.push(String(e)));
await rm.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await rm.waitForTimeout(2000);
const total = await rm.evaluate(() => document.body.scrollHeight);
for (const frac of [0.15, 0.4, 0.65, 0.85]) {
  await rm.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), Math.round(total * frac));
  await rm.waitForTimeout(1000);
}
await rm.screenshot({ path: `${outDir}/rm-late.png` });
console.log("reduced-motion page errors:", errors.length ? errors : "none");
await rm.close();

await browser.close();
