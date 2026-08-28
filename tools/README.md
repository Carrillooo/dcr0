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

Screenshots are written to `/tmp/shots`.

Playwright is deliberately **not** a dependency of this project: it is only used
by these scripts, and its postinstall downloads browser binaries, which would
slow down — or break — a deployment build that installs devDependencies.

Install it for a verification run only, without touching `package.json`:

```bash
npm install --no-save playwright
```

The scripts expect a Chromium at `/opt/pw-browsers/chromium`; change
`executablePath` if yours lives elsewhere.
