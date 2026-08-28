import { chromium } from 'playwright';
const B = 'http://localhost:3000';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

const errors = [];
async function page(w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 900 });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push(`[pageerror] ${e.message}`));
  p.on('console', m => { if (m.type() === 'error') errors.push(`[console] ${m.text().slice(0,200)}`); });
  return p;
}

// 1 — Mobile menu opens, traps focus, closes on Escape
let p = await page(390, 844);
await p.goto(B + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(7000);
await p.click('button[aria-label="Open menu"]');
await p.waitForTimeout(1200);
const menuOpen = await p.isVisible('div[role="dialog"][aria-label="Menu"]');
await p.screenshot({ path: '/tmp/shots/ix-menu.png' });
await p.keyboard.press('Escape');
await p.waitForTimeout(700);
const menuClosed = !(await p.isVisible('div[role="dialog"][aria-label="Menu"]'));
console.log(`menu: opens=${menuOpen} closesOnEsc=${menuClosed}`);
await p.context().close();

// 2 — Vehicle selector: four choices, canvas resolves, count reported
p = await page(1440, 900);
await p.goto(B + '/vehicle', { waitUntil: 'networkidle' });
await p.waitForTimeout(6000);
for (const label of ['BMW', '3 Series', '2023', 'Sport']) {
  await p.click(`button:has-text("${label}")`, { timeout: 8000 });
  await p.waitForTimeout(900);
}
const done = await p.textContent('p:has-text("fit")').catch(() => null);
await p.screenshot({ path: '/tmp/shots/ix-vehicle.png' });
console.log(`vehicle: complete=${done ? 'yes' : 'NO'} text=${(done||'').replace(/\s+/g,' ').trim().slice(0,60)}`);

// 3 — Fitment carries to the product page
await p.goto(B + '/product/dcro-one-shift-module', { waitUntil: 'networkidle' });
await p.waitForTimeout(5000);
const fit = await p.textContent('span:has-text("Compatible")').catch(() => null);
console.log(`product: fitment=${(fit || 'NOT SHOWN').trim()}`);

// 4 — Add to cart updates the nav and the cart page
await p.click('button:has-text("Add to cart")');
await p.waitForTimeout(1200);
const navCart = await p.textContent('header a[href="/cart"]');
await p.goto(B + '/cart', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
const total = await p.textContent('span:has-text("€")').catch(() => null);
await p.screenshot({ path: '/tmp/shots/ix-cart.png' });
console.log(`cart: nav="${navCart.trim()}" hasLine=${await p.isVisible('li:has-text("DCRO ONE")')}`);

// 5 — Checkout validates before advancing
await p.goto(B + '/checkout', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
await p.click('button:has-text("Continue")');
await p.waitForTimeout(500);
const invalid = await p.isVisible('p:has-text("Enter a valid email")');
await p.fill('#email', 'test@example.com');
await p.click('button:has-text("Continue")');
await p.waitForTimeout(600);
const advanced = await p.isVisible('#name');
console.log(`checkout: blocksInvalid=${invalid} advancesOnValid=${advanced}`);

// 6 — Keyboard: tab reaches the skip link and the nav
await p.goto(B + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(7000);
await p.keyboard.press('Tab');
const first = await p.evaluate(() => document.activeElement?.textContent?.trim());
console.log(`a11y: firstTabStop="${first}"`);

console.log(`\nerrors (${errors.length}):`);
[...new Set(errors)].slice(0,10).forEach(e => console.log(' ', e));
await browser.close();
