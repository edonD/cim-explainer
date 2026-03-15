const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const PORT = 3456;
const BASE_URL = `http://localhost:${PORT}`;
const OUT_DIR = path.join(__dirname, "..", "screenshots");

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();

  // Full page desktop screenshot
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 30000 });
  await page.waitForSelector("main", { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 2000)); // wait for animations

  await page.screenshot({
    path: path.join(OUT_DIR, "full-desktop.png"),
    fullPage: true,
  });
  console.log("✓ full-desktop.png");

  // Desktop viewport (above fold)
  await page.screenshot({
    path: path.join(OUT_DIR, "hero-desktop.png"),
    fullPage: false,
  });
  console.log("✓ hero-desktop.png");

  // Mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(OUT_DIR, "full-mobile.png"),
    fullPage: true,
  });
  console.log("✓ full-mobile.png");

  // Chapter screenshots (desktop)
  await page.setViewport({ width: 1920, height: 1080 });
  for (let ch = 1; ch <= 9; ch++) {
    await page.goto(`${BASE_URL}#chapter-${ch}`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll into the chapter
    await page.evaluate((chNum) => {
      const el = document.getElementById(`chapter-${chNum}`);
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    }, ch);
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(OUT_DIR, `chapter-${ch}.png`),
      fullPage: false,
    });
    console.log(`✓ chapter-${ch}.png`);
  }

  await browser.close();
  console.log("\nAll screenshots saved to", OUT_DIR);
}

main().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
