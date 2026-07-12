// Dev-only visual verification: scrolls through the pinned journey and captures frames.
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const outDir = process.env.OUT_DIR ?? "/tmp/almadery-shots";
mkdirSync(outDir, { recursive: true });

const mobile = process.env.MOBILE === "1";
const vw = mobile ? 390 : 1440;
const vh = mobile ? 844 : 900;
const prefix = mobile ? "m" : "d";

const TOTAL_UNITS = 26;
const SCROLL_VH = 10.5;

const points = [
  ["intro", 0],
  ["rough", 3.6],
  ["polished", 7.6],
  ["gold", 12.2],
  ["setting", 15.6],
  ["prongs", 17.2],
  ["handover", 18.1],
  ["final", 20.3],
  ["reveal", 25.4],
];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: vw, height: vh } });
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(3200);

for (const [name, unit] of points) {
  const y = Math.round((vh * SCROLL_VH * unit) / TOTAL_UNITS);
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${outDir}/${prefix}-${name}.png` });
  console.log(`${prefix}-${name}.png @ y=${y}`);
}

await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
await page.waitForTimeout(1800);
await page.screenshot({ path: `${outDir}/${prefix}-cta-footer.png` });
console.log(`${prefix}-cta-footer.png @ bottom`);

await browser.close();
