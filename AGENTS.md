# AGENTS.md

This file is for coding agents. Humans should read `README.md`.

## What this project is

`andrews.sh` is a personal homepage built to look, feel and read like an early-2000s personal website: a GeoCities/Angelfire-era "webmaster" page with a cybercore/vaporwave palette, pixel fonts, blinkies, 88x31 buttons, tiled backgrounds and a three-column table layout.

It is a deliberate period piece, not a modern web app. The Spotify integration is real, the Cloudflare deployment is real, but everything a visitor sees should feel like it was made around 2003. The "bad" code is part of the exhibit: table layouts, deprecated attributes, duplicated IDs, synchronous XHR and copy-pasted functions are intentional.

There are two layers:

- **Period layer** — `public/*.html`, `public/style.css`, `public/script.js`, `public/retro.js`, `public/images/`, `public/audio/`, `public/fonts/`. Must stay faithful to the aesthetic, including its limitations and bad practices.
- **Modern layer** — `src/index.js`, `wrangler.jsonc`, `db/schema.sql`, `package.json`, `scripts/`, `.dev.vars`, deployment config, `README.md`. May use modern JS and tooling because visitors never see it.

**Core rule: modernity must stay invisible.** A change that alters what a visitor sees, or how the frontend markup/CSS/JS reads, must look and read like early-2000s code.

## The aesthetic

Reference points: GeoCities/Angelfire personal pages (roughly 1998–2004), "webmaster" homepages, cybercore/vaporwave/Neocities revival, Japanese personal sites with pixel fonts and tiled starfields. The target is a Neocities-style personal homepage; the site is not hosted on Neocities and should not claim that it is.

Signals that must be preserved:

- Fixed-width 1250px, centered three-column `<table>` layout. No responsive design.
- Pixel bitmap font `04b_03` from `/fonts/04B_03__.TTF`, with a hard black `text-shadow` outline.
- Tiled `images/bluecore-1.jpg` background, `background-attachment: fixed`.
- Scanline and flicker overlays via `body::before` / `body::after`.
- Dense decoration: blinkies, 88x31 buttons, GIFs, star backgrounds, the "site button" copy-paste `<textarea>`.
- Community furniture: hit counter, guestbook, shoutbox, poll, webring, top 8, awards, "under construction".
- Neocities furniture: profile/stats box, odometer counter, Neocities 88x31 badge, `/now` page, journal RSS feed, "spiritually yes" disclaimer.
- Toys and media: virtual pet, quiz, fake webcam, marquee, Winamp-style chiptune player.
- Palette: black, purple `#cba6f7`, neon green `#35ffb3`, cyan `#00e5ff`, hot pink `#ff2e88`, highlight yellow `#ffcc00`, lavender-white text `#dcd6f7`, blue-gray borders `#3a3a5a` and silver bevels `#c0c0c0`. Component accents stay: orange `#ff8c00` (Eva slants) and Spotify green `#1db954`.
- Chunky custom components (the vinyl record widget) over clean, minimal UI.
- Personal, lowercase, casual voice ("Hi! I'm a Webmaster based in Brazil").

A change that makes the page cleaner, more spacious, more legible, more accessible or more "professional" is almost certainly wrong for this project.

## Do not modernize the frontend

Treat all of the following as intentional and leave them alone unless the user explicitly asks otherwise.

Keep:

- Table layout, `border="0" cellpadding="0" cellspacing="0"`, nested `<td>` structure, inline `style` attributes.
- Invalid or deprecated markup: duplicated `id="blinkies"` (12 times), `<textarea readonly="">`, `<img>` used as buttons, non-semantic nesting.
- Absolute pixel widths, floats, fixed heights, non-responsive behavior.
- Copy-pasted blocks in `script.js`; `TopArtists`, `TopTracks`, `CurrentlyPlaying` and `RecentlyPlayed` are similar on purpose.
- Shared chrome injected by `retro.js` with `innerHTML`, and page-specific inline `<script>` blocks. This is intentional; do not replace it with a template engine, components or a build step.
- `addOnload()` chaining for `window.onload`. Do not switch page scripts to `addEventListener`.
- Community widgets rendered from JSON with `innerHTML` and `escapeHtml()`. Do not replace them with a frontend framework or a modern form library.
- Global functions, `var`, string concatenation, `innerHTML`, synchronous `XMLHttpRequest`, `window.onload`, DOM0 `onclick`.
- Inline HTML error boxes, broken-image fallbacks (the referenced `images/placeholder.gif` does not exist), unused functions (`generateSlantedRectangles`), unused variables, commented-out code, comments like `//eva`, dead CSS (`.track-list-item`), no-op declarations, and inconsistent file naming (`04B_03__.TTF`, `yahoo_mail.gif`).
- Old asset formats (`.gif`, `.jpg`, `.TTF`), large tiled images, and uppercase filenames in `fonts/`.

Do not add:

- Frameworks, bundlers, a frontend build step, TypeScript, JSX, preprocessors, Tailwind, PostCSS, linters, formatters or frontend test runners. npm exists only for Wrangler.
- Semantic HTML5 layout elements (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`) for page structure. Use `div`, `table`, `td`.
- Flexbox or grid for new structural layout (see grandfathered exceptions below), CSS variables, container queries, `clamp()`, `aspect-ratio`, `backdrop-filter`, `:has()`, `@supports`.
- External/Google fonts, icon fonts, SVG icon sets, CSS resets or normalizers.
- Responsive/mobile work, hamburger menus, dark/light toggles, cookie banners, skeleton loaders, spinners, toasts, smooth scrolling, scroll animations, or new hover transitions.
- Accessibility retrofits (ARIA sweeps, skip links, focus-ring work), SEO work, structured data, RSS, sitemaps, PWA/service workers or analytics.
- Image optimization: no WebP/AVIF conversion, `srcset`, `loading="lazy"` or `decoding="async"`. Keep the big JPEGs and GIFs.
- `rel="noopener"` / `target="_blank"` cleanups, URL normalization, or semicolon/quote reformatting.

Do not "fix" something just because it is invalid HTML, unused, duplicated or unidiomatic. W3C validation is not a goal.

## Frontend code rules

### HTML (`public/*.html`)

- Lay out with `<table>`, `<tbody>`, `<tr>`, `<td>`; center with `text-align` and margins.
- New pages use the existing subpage skeleton: `<div id="retro-nav"></div>`, `<div id="page"><div class="page-box">...</div></div>`, `<div id="retro-footer"></div>`, then `<script src="/retro.js"></script>`.
- Use inline `style=` for one-offs; use classes/CSS only for repeated or structural styling.
- Root-absolute asset paths (`/images/...`), matching the existing file.
- `<img>` for buttons and blinkies. Keep `alt` text; do not add ARIA or roles.
- Keep the HTML5 doctype, charset, viewport and Open Graph/Twitter tags. These are accepted anachronisms needed by modern hosting and link previews.
- New content should copy the existing rows/wrappers. Do not introduce a semantic page skeleton.

### CSS (`public/style.css`)

- Prefer fixed widths, floats, `display: table` and absolute positioning.
- Keep the palette, the `04b_03` font and the existing visual language.
- Period-appropriate effects: tiled backgrounds, `text-shadow`, chunky borders, scanlines, `@keyframes` flicker/spin, the `linear-gradient` already used.
- **Grandfathered modern CSS:** `flex`/`gap` in `.vinyl-container`, `#slanted-rectangles-container`, `.slanted-rectangle*`, `#regular-column`, `#flipped-column`, plus the `rotate` property and `calc(infinity * 1px)` in the vinyl/slanted components. Do not spread these techniques to new layout, and do not "clean them up" either.
- **Grandfathered modern APIs:** the Winamp analyser uses `<canvas>` and Web Audio. The UI is a period Winamp skin; keep it that way and do not use it as a precedent for other frontend work.
- No CSS variables. No grid. No media queries unless the user explicitly asks for mobile work.
- 2-space indentation is the existing style in this file.

### JavaScript (`public/script.js`, `public/retro.js`, inline page scripts)

- ES5 only: `var`, `function` declarations/expressions, classic `for` loops, string concatenation with `+`, object literals, `XMLHttpRequest`.
- No `let` / `const`, arrow functions, template literals, `fetch`, `async` / `await`, modules, classes, `dataset`, `querySelector`, `addEventListener`, promises or optional chaining.
- Keep global function names (`TopArtists`, `VinylRecord`, `initRetro`, ...) and the call order in `window.onload`.
- Use `addOnload()` instead of assigning `window.onload` directly in page scripts.
- DOM style: `getElementById`, `createElement`, `appendChild`, `innerHTML`, `getAttribute` / `setAttribute`, DOM0 `onclick`.
- Use the shared `xhrGet` / `xhrPost` helpers. Escape every user-supplied value with `escapeHtml()` before putting it in `innerHTML`.
- 4-space indentation, semicolons, single quotes for JS strings, single quotes around HTML fragments.
- Report API failures with an inline HTML error box in the relevant section, not a thrown error, toast or console-only message.

## The modern layer (do not contaminate the frontend)

`src/index.js` is a Cloudflare Worker. It may use ESM, `async` / `await`, `fetch`, optional chaining and other modern JS because it never ships to the browser. The same applies to `wrangler.jsonc`, `package.json`, `scripts/`, `.dev.vars`, deployment configuration and `README.md`.

- Keep the API surface stable: Spotify routes (`/currently-playing`, `/recently-played`, `/top-artists`, `/top-tracks`), community routes (`/api/counter`, `/api/guestbook`, `/api/shoutbox`, `/api/poll`) and the optional `/api/lastfm`. Every route also works without the `/api/` prefix.
- Keep response shapes identical. The frontend consumes them with synchronous/async `XMLHttpRequest`.
- Server-side improvements (token caching, error handling, mock data, headers) are welcome.
- Never move Spotify calls or credentials into `public/`.
- `MOCK_SPOTIFY=true` in `.dev.vars` serves bundled sample data. Use it for visual work without credentials.
- Community data lives in D1. The schema is `db/schema.sql` (`counter`, `guestbook`, `shoutbox`, `poll_votes`). Keep the schema idempotent (`CREATE TABLE IF NOT EXISTS`, `INSERT OR IGNORE`).
- Validate all form input: length caps, option whitelist for the poll, honeypot field `url2`, and no HTML trust. Escape messages on the client when rendering.
- The Last.fm route stays optional: return `503` with a readable message when `LASTFM_API_KEY` / `LASTFM_USER` are missing.

### Accepted anachronisms

These cannot be replicated and are not bugs:

- HTTPS and Cloudflare hosting.
- The Spotify Web API itself. The vinyl UI is a modern component and may use modern CSS.
- HTML5 doctype, charset/viewport meta, Open Graph/Twitter meta.
- Modern browser behavior; no IE6 support is needed.
- `.webp` files that already exist in `public/images/`.
- The modern code inside the Worker.

Anything else modern that a visitor can see is a regression.

## When adding a feature

Ask: **"How would a 2003 webmaster have built this?"** Then implement the closest period-appropriate equivalent, not the modern best practice.

Examples:

- New widget → table cells, GIFs, inline HTML.
- "App-like" interaction → DOM0 handlers, `innerHTML`, global functions.
- Data → synchronous XHR to a same-origin endpoint.
- Animation → CSS `@keyframes` or an animated GIF, never an animation library.
- Layout → floats and tables, not grid/flex (grandfathered components excepted).
- Small text → pixel font, never a web font.

If a modern approach is unavoidable (Spotify, Cloudflare), isolate it and keep the rendered output period-appropriate.

## Workflow

```bash
npm run dev      # http://localhost:8080
npm run check    # dry-run Cloudflare deploy
npm run deploy   # deploy to Cloudflare
node --check public/script.js
node --check public/retro.js
```

- Apply the local D1 schema once (or after changing `db/schema.sql`):
  ```bash
  npx wrangler d1 execute andrews --local --file=db/schema.sql
  ```
- Apply it to production before deploying schema-dependent code:
  ```bash
  npx wrangler d1 execute andrews --remote --file=db/schema.sql
  ```
- Visual check at 1250px wide on the homepage and 900px on subpages. There are no automated frontend tests; the page is checked by eye.
- Do not commit `.dev.vars` or `.wrangler/`.
- Keep diffs surgical. Do not reformat whole files or reorder existing code.

## Definition of done

- Every page is reachable from the top navigation or footer.
- The page looks unchanged, or more period-appropriate, at a glance and at fixed width.
- No new modern syntax in `public/` JavaScript.
- No new modern layout primitives in CSS outside the grandfather clause.
- No new dependencies, build steps, fonts or CDNs.
- Spotify works with real credentials and with `MOCK_SPOTIFY=true`.
- Guestbook, shoutbox, poll and counter work locally and in production.
- Unknown paths render the custom 404 page.
- `README.md` stays accurate for humans; this file stays accurate for agents.
