import { chromium } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const base = process.env.COVER_BASE ?? "http://127.0.0.1:4010";
const output = path.resolve("public", "project-previews");
const registry = JSON.parse(await readFile("showcase-projects/registry.json", "utf8"));
const projects = registry.filter((project) => project.id >= 35 && project.id <= 66);

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1200, height: 1000 },
  deviceScaleFactor: 1,
  serviceWorkers: "block",
  reducedMotion: "reduce",
});

try {
  for (const project of projects) {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    try {
      const response = await page.goto(`${base}/${project.slug}/`, {
        waitUntil: "networkidle",
        timeout: 45_000,
      });
      if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? "no response"}`);
      await page.locator("body").waitFor({ state: "visible", timeout: 10_000 });
      await page.screenshot({
        path: path.join(output, `${project.slug}.png`),
        animations: "disabled",
      });
      console.log(`✓ ${project.slug}${errors.length ? ` (${errors.length} page errors)` : ""}`);
    } catch (error) {
      console.error(`✗ ${project.slug}: ${error.message}`);
      process.exitCode = 1;
    } finally {
      await page.close();
    }
  }
} finally {
  await context.close();
  await browser.close();
}
