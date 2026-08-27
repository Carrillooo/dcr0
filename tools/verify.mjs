import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const routes = process.argv[2] ? process.argv[2].split(',') : ['/'];
const W = Number(process.argv[3] ?? 1440);
const H = Number(process.argv[4] ?? 900);
const steps = Number(process.argv[5] ?? 6);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

const errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`.slice(0,300)); });
page.on('pageerror', e => errors.push(`[pageerror] ${e.message}`.slice(0,300)));

for (const route of routes) {
  const tag = route === '/' ? 'home' : route.replace(/\//g,'_').replace(/^_/,'');
  await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(7000); // loader

  const doc = await page.evaluate(() => ({
    scrollH: document.documentElement.scrollHeight,
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
    canvas: !!document.querySelector('canvas'),
  }));
  const overflow = doc.scrollW > doc.innerW + 1;
  console.log(`\n=== ${route} @${W}x${H} ===`);
  console.log(`height=${doc.scrollH}px canvas=${doc.canvas} overflowX=${overflow ? 'YES ('+doc.scrollW+'>'+doc.innerW+')' : 'no'}`);

  for (let i = 0; i < steps; i++) {
    const y = Math.round((doc.scrollH - H) * (i / Math.max(1, steps - 1)));
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `/tmp/shots/${tag}-${W}-${i}.png` });
  }
}

console.log('\n--- console (' + errors.length + ') ---');
[...new Set(errors)].slice(0, 25).forEach(e => console.log(e));
await browser.close();
