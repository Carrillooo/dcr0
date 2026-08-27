# Visual verification

`verify.mjs` drives a real Chromium over the running site, scrolls each route in
steps, screenshots every step and reports console errors and horizontal overflow.

A build passing is not evidence that a scene looks right — this is what is used
to check that it does.

```bash
npm run build && npm start          # or: npm run dev
node tools/verify.mjs "/,/shop" 1440 900 6     # routes, width, height, steps
node tools/verify.mjs "/" 390 844 6            # portrait pass
```

Screenshots are written to `/tmp/shots`. Requires Playwright (`npm i -D playwright`)
and a Chromium at `/opt/pw-browsers/chromium`.
