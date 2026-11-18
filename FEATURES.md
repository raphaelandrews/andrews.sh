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
- [-] **1.5 Mood/status box** — removed at the user's request.
- [x] **1.6 Cursor sparkle trail** — cookie-persisted.
- [x] **1.7 Custom 404** — `public/404.html` + `not_found_handling: "404-page"`.
- [x] **1.8 Homepage integration** — nav, marquee, footer, widgets in `index.html`.

## Phase 2 — Data layer (D1)

- [x] **2.1 Create D1 database** `andrews`, bind as `DB`.
- [x] **2.2 Schema** — `db/schema.sql`: counter, guestbook, shoutbox.
- [x] **2.3 Worker routes**
  - `GET /api/counter`
  - `GET|POST /api/guestbook`
  - `GET|POST /api/shoutbox`
- [x] **2.4 Validation** — length caps, honeypot field, no-store headers.
- [-] **2.5 Optional Last.fm route** — removed; Last.fm is not used.
- [x] **2.6 Local + remote schema apply** and endpoint smoke tests.

## Phase 3 — Signature old-web features

- [x] **3.1 Guestbook page** — form + entries table + honeypot.
- [x] **3.2 Shoutbox** — homepage widget + full page.
- [-] **3.3 Poll** — removed with the poll functionality.
- [-] **3.4 Webring** — removed with the links page.
- [-] **3.5 Top 8 cool sites + friends grid** — removed with the links page.
- [x] **3.6 Link-back code box** — classic `<textarea>`.

## Phase 4 — Interactive toys

- [-] **4.1 Virtual pet** — page removed at the user's request.
- [-] **4.2 Evangelion quiz** — page removed at the user's request.
- [-] **4.3 Fake webcam** — page removed at the user's request.
- [x] **4.4 Random banner rotation** — shared with 1.4.
- [x] **4.5 Sparkle effect** — shared with 1.6.

## Phase 5 — Content pages

- [x] **5.1 About me** — profile table, interests, contact links.
- [-] **5.2 Journal / updates** — page removed at the user's request.
- [-] **5.3 My setup** — page removed at the user's request.
- [-] **5.4 Anime** — page removed at the user's request.
- [x] **5.5 Music** — top albums table + mixtape + Spotify widgets.
- [x] **5.6 GIF collection** — all unused GIFs in a chaotic table.
- [x] **5.7 Buttons page** — every 88x31 button.
- [-] **5.8 Links page** — page removed at the user's request.
- [-] **5.9 Downloads** — page removed at the user's request.
- [-] **5.10 Awards / affiliates** — page removed at the user's request.
- [-] **5.11 FAQ** — page removed at the user's request.
- [x] **5.12 Site map** — table of every page.
- [-] **5.13 Credits** — page removed at the user's request.
- [x] **5.14 404 page** — themed missing-page page.

## Phase 6 — Music & media

- [-] **6.1 Winamp-style player** — removed at the user's request.
- [x] **6.2 Spotify widgets on music page** — reuse `script.js`.
- [-] **6.3 Last.fm widget** — removed; Last.fm is not used.
- [-] **6.4 Wallpapers** — removed with the downloads page.

## Phase 7 — Polish & verification

- [x] **7.1 Stylesheet additions** — nav, boxes, forms, counter, buttons, GIF wall.
- [x] **7.2 Update homepage links** — make every new page reachable.
- [x] **7.3 Update `README.md`** — pages, D1 setup, new API routes.
- [x] **7.4 Update `AGENTS.md`** — mention `retro.js`, page layout, data rules.
- [x] **7.5 Syntax checks** — `node --check` on all `public/*.js`.
- [x] **7.6 Local smoke tests** — pages, APIs, forms (with mock Spotify).
- [x] **7.7 Deploy + production smoke tests** — Worker routes still on `andrews.sh` / `www`.
- [x] **7.8 Update FEATURES.md status.**

## Phase 8 — Neocities polish

- [x] **8.1 Neocities footer badge** — `neocities.gif`, "not hosted on neocities, spiritually yes".
- [-] **8.2 Profile/stats box** — removed at the user's request.
- [x] **8.3 Odometer hit counter** — individual digit cells instead of plain text.
- [x] **8.4 `/now` page** — what i'm doing now.
- [-] **8.5 Journal RSS** — removed with the journal page.
- [x] **8.6 "3 users online" + site opened** — footer period details.
- [x] **8.7 Homepage construction banner** — always under construction.
- [x] **8.8 Vice City sunset palette** — pink `#F76C91`, coral `#FF9562`, amber `#FFC46B`, purple `#A77BC8`, deep purple `#514B87`; the Forest and Double R Diner palettes are archived in `PALETTES.md`.
- [x] **8.9 Removed pages** — links, downloads, awards, poll, pet, quiz, credits, journal, setup and FAQ.
- [x] **8.10 Twin Peaks easter eggs** — red room overlay via typing `coffee`, clicking a palm or the footer coffee cup, `/ #redroom`, console hint, hidden HTML comments and a 404 in the Black Lodge.

## Deliberately skipped

- **Framesets** — historically accurate but breaks linking and search.
- **Flash intro / splash gate** — Flash is dead; a splash gate hurts the site.
- **Popups** — accurate, but hostile.
- **Autoplay MIDI/audio** — browsers block it; no autoplay.
- **No-right-click scripts** — hostile and easy to bypass; not worth it.
- **External visitor map / flag counter** — third-party tracking; self-hosted counter is better.

## Acceptance criteria

- Every page is reachable from the top nav or footer.
- All public JS is ES5 and passes `node --check`.
- Guestbook, shoutbox and counter work locally and in production.
- Spotify still works with real credentials and with `MOCK_SPOTIFY=true`.
- Unknown paths render the custom 404.
- Nothing on the visible surface looks like a modern SPA or component library.
