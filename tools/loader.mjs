import { chromium } from 'playwright';

/* Capture the loading experience. `waitUntil: 'commit'` matters — waiting for
   'load' returns after the loader has already played. */
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3000/', { waitUntil: 'commit' });
let last = 0;
for (const [ms, name] of [[400,'a'],[1100,'b'],[1900,'c'],[2500,'d'],[3000,'e']]) {
  await p.waitForTimeout(ms - last); last = ms;
  await p.screenshot({ path: `/tmp/shots/loader-${name}.png` });
}
await b.close();
console.log('loader frames captured');
