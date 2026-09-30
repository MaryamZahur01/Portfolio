/* Captures REAL homepage screenshots for every project in js/data.js
   and real project covers from Behance.

   Runs automatically on GitHub (see .github/workflows/deploy.yml),
   or locally:  npm install  then  npm run shots

   Output
     assets/projects/<slug>.jpg     one per project (websites: homepage, apps: store screenshots)
     assets/behance/covers.json     + assets/behance/*.jpg
     assets/projects/report.json    what worked and what was skipped (and why)

   An error page (404, "access denied", bot check, empty page) is never saved:
   the old image, if any, is kept and the project is listed in report.json. */

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "assets/projects");
const BEH = path.join(ROOT, "assets/behance");
const ONLY = process.argv.slice(2); // optional: node scripts/capture.mjs oraami qoyod

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(await fs.readFile(path.join(ROOT, "js/data.js"), "utf8"), ctx);
const { PROJECTS = [], GRAPHIC = {}, SITE = {} } = ctx.window;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const ERROR_RX = /(404|page not found|not found|access denied|forbidden|just a moment|attention required|verify you are human|are you a robot|captcha|site can.?t be reached|bad gateway|service unavailable|domain (is )?for sale|this site is currently unavailable|store is unavailable|password protected|coming soon|error establishing|internal server error)/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = [];

async function clearOverlays(page) {
  // click typical consent / popup buttons
  const labels = /^(accept( all)?( cookies)?|allow( all)?|agree|i agree|got it|ok|okay|continue|close|no,? thanks|dismiss|×|✕|x)$/i;
  for (const frame of page.frames()) {
    try {
      const buttons = await frame.$$("button, [role=button], a[aria-label*=lose i]");
      for (const b of buttons.slice(0, 80)) {
        const t = ((await b.innerText().catch(() => "")) || (await b.getAttribute("aria-label")) || "").trim();
        if (labels.test(t) && (await b.isVisible().catch(() => false))) await b.click({ timeout: 800 }).catch(() => {});
      }
    } catch {}
  }
  await page.keyboard.press("Escape").catch(() => {});
  // remove anything still covering a large part of the screen (newsletter popups, chat widgets, cookie bars)
  await page.evaluate(() => {
    const vw = innerWidth, vh = innerHeight;
    document.querySelectorAll("body *").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") return;
      const r = el.getBoundingClientRect();
      const area = (Math.min(r.right, vw) - Math.max(r.left, 0)) * (Math.min(r.bottom, vh) - Math.max(r.top, 0));
      const isHeader = r.top <= 2 && r.height < 180 && r.width > vw * 0.8;
      const isBar = r.height < 140 && r.width > vw * 0.6 && r.bottom >= vh - 2; // cookie bar
      const isChat = r.width < 140 && r.height < 140 && r.right > vw - 160 && r.bottom > vh - 160;
      if (!isHeader && (area > vw * vh * 0.25 || isBar || isChat)) el.remove();
    });
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
  }).catch(() => {});
}

async function looksBroken(page, status) {
  if (status && status >= 400) return `HTTP ${status}`;
  const info = await page.evaluate(() => ({
    title: document.title || "",
    text: (document.body?.innerText || "").slice(0, 1500),
    len: (document.body?.innerText || "").trim().length,
    imgs: document.images.length
  })).catch(() => ({ title: "", text: "", len: 0, imgs: 0 }));
  const head = `${info.title}\n${info.text.slice(0, 400)}`;
  if (ERROR_RX.test(head) && info.len < 1500) return `error page: "${info.title.slice(0, 60)}"`;
  if (info.len < 40 && info.imgs < 2) return "empty page";
  return null;
}

async function shootSite(browser, p) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA, locale: "en-US", deviceScaleFactor: 1 });
  const page = await context.newPage();
  try {
    for (let attempt = 1; attempt <= 2; attempt++) {
      let status = 0;
      try {
        const res = await page.goto(p.url, { waitUntil: "domcontentloaded", timeout: 60000 });
        status = res ? res.status() : 0;
      } catch (e) { if (attempt === 2) return `could not open (${e.message.split("\n")[0]})`; continue; }
      await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
      await sleep(attempt === 1 ? 2500 : 8000); // bot checks / slow heroes get more time on retry
      await clearOverlays(page);
      // trigger lazy images, then back to the top
      await page.evaluate(async () => { for (let y = 0; y < 2400; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); }).catch(() => {});
      await sleep(1500);
      await clearOverlays(page);
      const broken = await looksBroken(page, status);
      if (broken) { if (attempt === 2) return broken; continue; }
      await page.screenshot({ path: path.join(OUT, `${p.slug}.jpg`), type: "jpeg", quality: 82 });
      return null;
    }
  } finally { await context.close(); }
}

async function shootApp(browser, p) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA, locale: "en-US" });
  const page = await context.newPage();
  try {
    const res = await page.goto(p.url, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => null);
    if (!res || res.status() >= 400) return `store page ${res ? "HTTP " + res.status() : "did not open"}`;
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
    await sleep(2500);
    const data = await page.evaluate(() => {
      const best = (img) => {
        const set = img.getAttribute("srcset") || img.closest("picture")?.querySelector("source")?.getAttribute("srcset") || "";
        const parts = set.split(",").map((s) => s.trim().split(/\s+/)).filter((x) => x[0]);
        return parts.length ? parts[parts.length - 1][0] : img.currentSrc || img.src;
      };
      const imgs = [...document.images].filter((i) => i.naturalWidth >= 140 && i.naturalHeight > i.naturalWidth * 1.4);
      const shots = [...new Set(imgs.map(best))].filter((u) => u && !u.startsWith("data:")).slice(0, 4);
      const og = document.querySelector('meta[property="og:image"]')?.content || "";
      const iconEl = [...document.images].find((i) => /icon|logo/i.test(i.alt || "") && i.naturalWidth >= 64 && Math.abs(i.naturalWidth - i.naturalHeight) < 4);
      const name = (document.querySelector("h1")?.innerText || document.title || "").split("\n")[0].trim();
      return { shots, icon: iconEl ? best(iconEl) : og, name };
    });
    // download the real screenshots and embed them, so a blocked hotlink can never leave an empty phone
    const toData = async (u) => {
      const r = await context.request.get(u, { timeout: 20000 }).catch(() => null);
      if (!r || !r.ok()) return null;
      const type = r.headers()["content-type"] || "image/png";
      if (!type.startsWith("image/")) return null;
      return `data:${type};base64,${(await r.body()).toString("base64")}`;
    };
    data.shots = (await Promise.all(data.shots.map(toData))).filter(Boolean);
    data.icon = data.icon ? await toData(data.icon) : null;
    if (data.shots.length < 2) {
      // fall back to the store page itself (still the real listing)
      await clearOverlays(page);
      await page.screenshot({ path: path.join(OUT, `${p.slug}.jpg`), type: "jpeg", quality: 82 });
      return null;
    }
    const comp = await context.newPage();
    await comp.setViewportSize({ width: 1440, height: 900 });
    const phones = data.shots.map((u, i) => `<div class="ph" style="--r:${[-6, -2, 2, 6][i] || 0}deg;--y:${[30, 0, 0, 30][i] || 0}px"><img src="${u}"></div>`).join("");
    await comp.setContent(`<!doctype html><html><head><style>
      *{box-sizing:border-box;margin:0}
      body{width:1440px;height:900px;overflow:hidden;font-family:Inter,Segoe UI,Arial,sans-serif;
        background:radial-gradient(circle at 80% 20%, color-mix(in srgb, ${p.hue} 55%, #fff), transparent 60%),
                   linear-gradient(135deg, color-mix(in srgb, ${p.hue} 22%, #fff), color-mix(in srgb, ${p.hue} 45%, #fff));
        display:flex;align-items:center;gap:40px;padding:0 70px}
      .info{width:330px;flex:none}
      .info img{width:120px;height:120px;border-radius:28px;box-shadow:0 20px 40px -18px rgba(0,0,0,.5);display:block;margin-bottom:28px}
      .info h1{font-size:46px;line-height:1.05;letter-spacing:-.02em;color:color-mix(in srgb, ${p.hue} 60%, #000)}
      .info p{margin-top:12px;font-size:20px;color:color-mix(in srgb, ${p.hue} 40%, #333)}
      .row{display:flex;gap:26px;align-items:center}
      .ph{width:230px;border-radius:30px;background:#0e0e12;padding:8px;box-shadow:0 40px 70px -30px rgba(0,0,0,.6);transform:rotate(var(--r)) translateY(var(--y))}
      .ph img{width:100%;display:block;border-radius:23px;aspect-ratio:9/19.5;object-fit:cover;object-position:top}
    </style></head><body>
      <div class="info">${data.icon ? `<img src="${data.icon}">` : ""}<h1>${p.title}</h1><p>${p.tag}</p></div>
      <div class="row">${phones}</div></body></html>`, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
    await sleep(800);
    await comp.screenshot({ path: path.join(OUT, `${p.slug}.jpg`), type: "jpeg", quality: 85 });
    return null;
  } finally { await context.close(); }
}

async function behance(browser) {
  const url = GRAPHIC.behance || SITE.behance;
  if (!url) return;
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, userAgent: UA, locale: "en-US" });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
    await clearOverlays(page);
    for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 1400); await sleep(700); }
    const items = await page.evaluate(() => {
      const out = [], seen = new Set();
      document.querySelectorAll('a[href*="/gallery/"]').forEach((a) => {
        const img = a.querySelector("img") || a.parentElement?.querySelector("img");
        if (!img) return;
        const href = a.href.split("?")[0];
        if (seen.has(href)) return;
        const set = (img.getAttribute("srcset") || "").split(",").map((s) => s.trim().split(/\s+/)[0]).filter(Boolean);
        const src = set[set.length - 1] || img.currentSrc || img.src;
        if (!src || src.startsWith("data:")) return;
        const title = (img.alt || a.getAttribute("title") || a.innerText || "").trim().split("\n")[0];
        seen.add(href);
        out.push({ url: href, img: src, title: title || "Behance project" });
      });
      return out.slice(0, 12);
    });
    await fs.mkdir(BEH, { recursive: true });
    const covers = [];
    for (const [i, it] of items.entries()) {
      const r = await context.request.get(it.img).catch(() => null);
      if (!r || !r.ok()) continue;
      const file = `cover-${String(i + 1).padStart(2, "0")}.jpg`;
      await fs.writeFile(path.join(BEH, file), await r.body());
      covers.push({ title: it.title, url: it.url, img: `assets/behance/${file}` });
    }
    if (covers.length) await fs.writeFile(path.join(BEH, "covers.json"), JSON.stringify(covers, null, 2));
    report.push({ slug: "behance", ok: covers.length > 0, note: `${covers.length} covers` });
  } catch (e) {
    report.push({ slug: "behance", ok: false, note: e.message.split("\n")[0] });
  } finally { await context.close(); }
}

await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ args: ["--disable-blink-features=AutomationControlled"] });
const list = PROJECTS.filter((p) => !ONLY.length || ONLY.includes(p.slug));
for (const p of list) {
  const isStore = /play\.google\.com|apps\.apple\.com/.test(p.url);
  process.stdout.write(`${p.slug.padEnd(22)} `);
  const err = await (isStore ? shootApp(browser, p) : shootSite(browser, p)).catch((e) => e.message.split("\n")[0]);
  report.push({ slug: p.slug, url: p.url, ok: !err, note: err || "saved" });
  console.log(err ? `SKIPPED: ${err}` : "ok");
}
if (!ONLY.length || ONLY.includes("behance")) await behance(browser);
await browser.close();
await fs.writeFile(path.join(OUT, "report.json"), JSON.stringify({ captured: new Date().toISOString(), results: report }, null, 2));
const bad = report.filter((r) => !r.ok);
console.log(`\nDone: ${report.length - bad.length} saved, ${bad.length} skipped.`);
if (bad.length) console.log("Skipped (add your own image as assets/projects/<slug>.jpg):\n" + bad.map((b) => ` - ${b.slug}: ${b.note}`).join("\n"));
