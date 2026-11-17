# FEATURES.md

Implementation plan for the early-2000s features of `andrews.sh`.

Status: `[ ]` todo · `[~]` in progress · `[x]` done · `[-]` deliberately skipped

**All phases below are implemented and deployed to `andrews.sh` as of 16 Nov 2026.**

## Constraints

- Frontend must stay period-appropriate: tables, inline styles, ES5, `XMLHttpRequest`, DOM0 handlers, no frameworks.
- Backend (`src/index.js`) may use modern JavaScript and Cloudflare bindings.
- No new frontend dependencies, build steps, fonts or CDNs.
- New widgets/forms must look like they came from 2003, not like a modern web app.
- See `AGENTS.md` before changing the frontend.

## Phase 1 — Foundation

- [x] **1.1 Shared retro chrome** — `retro.js`
  - Top navigation (all pages), marquee news ticker, footer.
  - Footer: copyright, "last updated", "best viewed at 1024x768", "made with notepad", HTML badge.
  - `addOnload()` helper so page scripts never overwrite each other's `window.onload`.
- [x] **1.2 Hit counter** — D1 + `/api/counter` + footer odometer.
- [x] **1.3 Under-construction / warning banners** — reusable placeholder.
- [x] **1.4 Random 88x31 banner** — `/buttons.html` link.
- [x] **1.5 Mood/status box** — static sidebar widget.
- [x] **1.6 Cursor sparkle trail + snow/rain toggle** — cookie-persisted.
- [x] **1.7 Custom 404** — `public/404.html` + `not_found_handling: "404-page"`.
- [x] **1.8 Homepage integration** — nav, marquee, footer, widgets in `index.html`.

## Phase 2 — Data layer (D1)

- [x] **2.1 Create D1 database** `andrews`, bind as `DB`.
- [x] **2.2 Schema** — `db/schema.sql`: counter, guestbook, shoutbox, poll.
- [x] **2.3 Worker routes**
  - `GET /api/counter`
  - `GET|POST /api/guestbook`
  - `GET|POST /api/shoutbox`
  - `GET|POST /api/poll`
- [x] **2.4 Validation** — length caps, honeypot field, option whitelist, no-store headers.
- [x] **2.5 Optional Last.fm route** — `GET /api/lastfm`, graceful 503 when unconfigured.
- [x] **2.6 Local + remote schema apply** and endpoint smoke tests.

## Phase 3 — Signature old-web features

- [x] **3.1 Guestbook page** — form + entries table + honeypot.
- [x] **3.2 Shoutbox** — homepage widget + full page.
- [x] **3.3 Poll** — homepage widget + full page with CSS bars.
- [x] **3.4 Webring** — prev / random / next box.
- [x] **3.5 Top 8 cool sites + friends grid** — numbered table and a MySpace-style grid.
- [x] **3.6 Link-back code box** — classic `<textarea>`.

## Phase 4 — Interactive toys

- [x] **4.1 Virtual pet** — adoptable black cat, feed/play/sleep, cookie persistence.
- [x] **4.2 Evangelion quiz** — 5 questions, scored result with GIF.
- [x] **4.3 Fake webcam** — "LIVE from Brazil", static frame + clock.
- [x] **4.4 Random banner rotation** — shared with 1.4.
- [x] **4.5 Sparkle/snow/rain effects** — shared with 1.6.

## Phase 5 — Content pages

- [x] **5.1 About me** — profile table, interests, contact links, mood.
- [x] **5.2 Journal / updates** — dated entries including site history.
- [x] **5.3 My setup** — workspace photo, specs `<pre>`, dotfiles link.
- [x] **5.4 Anime** — GIF wall + favorites.
- [x] **5.5 Music** — top albums table + mixtape + Spotify widgets.
- [x] **5.6 GIF collection** — all unused GIFs in a chaotic table.
- [x] **5.7 Buttons page** — every 88x31 button.
- [x] **5.8 Links page** — cool sites + webring + top 8 + link back.
- [x] **5.9 Downloads** — wallpapers, buddy icons, Winamp skin/cursors (some "under construction").
- [x] **5.10 Awards / affiliates** — fake award badges.
- [x] **5.11 FAQ** — site and tech questions.
- [x] **5.12 Site map** — table of every page.
- [x] **5.13 Credits** — font, images, tools, anachronisms.
- [x] **5.14 404 page** — themed missing-page page.

## Phase 6 — Music & media

- [x] **6.1 Winamp-style player** — generated chiptune `public/audio/chiptune.wav`, play/pause, analyser visualizer, fake EQ.
- [x] **6.2 Spotify widgets on music page** — reuse `script.js`.
- [x] **6.3 Last.fm widget** — "recently scrobbled", fallback text when unconfigured.
- [x] **6.4 Wallpapers** — existing images, "right-click → save as".

## Phase 7 — Polish & verification

- [x] **7.1 Stylesheet additions** — nav, boxes, forms, counter, poll bars, Winamp, pet, quiz, webcam, buttons, GIF wall.
- [x] **7.2 Update homepage links** — make every new page reachable.
- [x] **7.3 Update `README.md`** — pages, D1 setup, new API routes, Last.fm env vars.
- [x] **7.4 Update `AGENTS.md`** — mention `retro.js`, page layout, data rules.
- [x] **7.5 Syntax checks** — `node --check` on all `public/*.js`.
- [x] **7.6 Local smoke tests** — pages, APIs, forms (with mock Spotify).
- [x] **7.7 Deploy + production smoke tests** — Worker routes still on `andrews.sh` / `www`.
- [x] **7.8 Update FEATURES.md status.**

## Phase 8 — Neocities polish

- [x] **8.1 Neocities footer badge** — `neocities.gif`, "not hosted on neocities, spiritually yes".
- [x] **8.2 Profile/stats box** — avatar, joined, views, followers, status.
- [x] **8.3 Odometer hit counter** — individual digit cells instead of plain text.
- [x] **8.4 `/now` page** — what i'm doing now.
- [x] **8.5 Journal RSS** — `journal.xml` + links from journal/footer/sitemap.
- [x] **8.6 "3 users online" + site opened** — footer period details.
- [x] **8.7 Homepage construction banner + webring box** — always under construction.
- [x] **8.8 Palette 2** — mint/cyan/pink/yellow on black, silver bevels, blue-gray borders, lavender-white text.

## Deliberately skipped

- **Framesets** — historically accurate but breaks linking and search.
- **Flash intro / splash gate** — Flash is dead; a splash gate hurts the site.
- **Popups** — accurate, but hostile.
- **Autoplay MIDI/audio** — browsers block it; the Winamp player requires a click.
- **No-right-click scripts** — hostile and easy to bypass; not worth it.
- **External visitor map / flag counter** — third-party tracking; self-hosted counter is better.
- **Real webcam** — bandwidth and privacy; a static "live cam" frame is the joke.

## Acceptance criteria

- Every page is reachable from the top nav or footer.
- All public JS is ES5 and passes `node --check`.
- Guestbook, shoutbox, poll and counter work locally and in production.
- Spotify still works with real credentials and with `MOCK_SPOTIFY=true`.
- Unknown paths render the custom 404.
- Nothing on the visible surface looks like a modern SPA or component library.
