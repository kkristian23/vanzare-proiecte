import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { chromium, expect } from "@playwright/test";

test("static /admin supports direct access and reload, and is excluded from indexing", { timeout: 30000 }, async () => {
  const sitemap = await readFile("dist/client/sitemap.xml", "utf8");
  const headers = await readFile("dist/client/_headers", "utf8");
  assert.doesNotMatch(sitemap, /<loc>[^<]*\/admin(?:\/|<)/);
  assert.match(headers, /\/admin\n\s+X-Robots-Tag: noindex, nofollow/);
  const server = spawn(process.execPath, ["scripts/serve-seo.mjs"], { env: { ...process.env, SEO_PREVIEW_PORT: "4021" }, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
  let browser;
  try {
    await new Promise((resolve, reject) => { server.stdout.once("data", resolve); server.once("error", reject); server.once("exit", code => reject(new Error(`Static preview exited: ${code}`))); });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const response = await page.goto("http://127.0.0.1:4021/admin", { waitUntil: "domcontentloaded" });
    assert.equal(response.status(), 200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("heading", { name: "Autentificare", exact: true })).toBeVisible();
    const reload = await page.reload();
    assert.equal(reload.status(), 200);
    await expect(page.getByRole("heading", { name: "Autentificare", exact: true })).toBeVisible();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  } finally { await browser?.close(); server.kill(); }
});
