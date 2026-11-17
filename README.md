# andrews.sh

Personal cybercore website for [andrews.sh](https://andrews.sh). A static site, a small read-only Spotify API, and a pile of deliberately old-fashioned community features, served by a single [Cloudflare Worker](https://developers.cloudflare.com/workers/).

> **Note:** This site is a deliberate recreation of an early-2000s personal homepage. The old-school markup, CSS and JavaScript are intentional. See [AGENTS.md](AGENTS.md) before making changes.

## Stack

- **Cloudflare Workers** – serves the static assets and the API from one deployment
- **Cloudflare D1** – hit counter, guestbook, shoutbox and poll
- **Wrangler** – local dev server and deployment
- **Vanilla HTML/CSS/JS** – no build step
- **Spotify Web API** – currently playing, recently played, top artists and top tracks
- **Last.fm (optional)** – recently scrobbled widget

## What's on the site

- **Retro chrome** – top navigation, marquee, odometer hit counter, random 88x31 banner, mood box, sparkle trail, snow toggle and rain toggle.
- **Neocities spirit** – profile/stats box, Neocities footer badge, "spiritually yes" note, `/now` page and an RSS feed. The site is not hosted on Neocities; it just wishes it were.
- **Spotify** – vinyl widgets for currently playing, recently played, top artists and top tracks.
- **Community** – guestbook, shoutbox and an OS poll, stored in D1.
- **Toys** – virtual cat, Evangelion quiz, fake webcam, Winamp-style chiptune player.
- **Pages** – about, now, journal, music, anime, setup, buttons, links, downloads, GIF wall, awards, FAQ, site map and credits.

## Project structure

```
public/                 Static site (HTML, CSS, JS, images, audio, fonts)
public/retro.js         Shared nav, footer, counter, widgets and effects
public/script.js        Homepage/music-page Spotify widgets
src/index.js            Worker entry point + API routes
db/schema.sql           D1 schema and seed rows
scripts/spotify-authorize.js  Refresh-token helper for `npm run auth`
wrangler.jsonc          Cloudflare Workers configuration
.dev.vars.example       Example local environment file
FEATURES.md             Implementation plan and status
```

Everything in `public/` is uploaded as static assets. The Worker runs first (because of the retro root page and API routes), then falls back to the assets binding.

## API

All routes return JSON. The Spotify routes are `GET`; the community routes also accept form-encoded `POST` bodies.

| Method | Route                  | Description                              |
| ------ | ---------------------- | ---------------------------------------- |
| GET    | `/currently-playing`   | Track currently playing on Spotify       |
| GET    | `/recently-played`     | The 3 most recently played tracks        |
| GET    | `/top-artists`         | Top 6 artists (long term)                |
| GET    | `/top-tracks`          | Top 6 tracks (long term)                 |
| GET    | `/api/counter`         | Increment and return the visitor counter |
| GET    | `/api/guestbook`       | Latest 50 guestbook entries              |
| POST   | `/api/guestbook`       | Sign the guestbook (`name`, `website`, `message`) |
| GET    | `/api/shoutbox`        | Latest 20 shouts                         |
| POST   | `/api/shoutbox`        | Post a shout (`name`, `message`)         |
| GET    | `/api/poll`            | Poll options and vote counts             |
| POST   | `/api/poll`            | Vote (`option`: linux, windows, macos, bsd, other) |
| GET    | `/api/lastfm`          | Recent scrobbles, or `503` when unconfigured |

Every route is also available without the `/api/` prefix (for example `/top-tracks` and `/guestbook`). Unknown browser paths render the custom `404.html`.

Community forms include a hidden honeypot field and length limits. Messages are escaped on the client when rendered.

## Local development

Requires [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
cp .dev.vars.example .dev.vars
npx wrangler d1 execute andrews --local --file=db/schema.sql
npm run dev
```

The site is served at <http://localhost:8080>. The schema command only needs to run once per local database (or after changing `db/schema.sql`).

### Spotify credentials

To use real data, create a Spotify app at [developer.spotify.com](https://developer.spotify.com/dashboard) and fill in `.dev.vars`:

```dotenv
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REFRESH_TOKEN=...
```

The refresh token must be generated with the `user-read-currently-playing`, `user-read-recently-played` and `user-top-read` scopes. Access tokens are refreshed server-side and cached per Worker isolate.

If you don't have credentials yet, set `MOCK_SPOTIFY=true` in `.dev.vars` to serve bundled sample data.

Development Mode apps require the Spotify account that owns the app to have an active **Premium** subscription and are limited to five authorized users. Only your own account needs to be authorized for this site.

### Refreshing credentials

Spotify refresh tokens expire **six months** after the original authorization (enforced for existing apps since 20 July 2026). Refreshing an access token does not extend that deadline. When the token lapses, Spotify returns `invalid_grant` and the site shows its error box.

Obtain a new token with the bundled helper:

```bash
npm run auth
```

It reads `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` from `.dev.vars`, starts a local callback server at `http://127.0.0.1:8888/callback` (override with `SPOTIFY_REDIRECT_URI`) and prints a fresh refresh token. Register the exact redirect URI in the Spotify app first.

Update the local and production values:

```bash
# .dev.vars
SPOTIFY_REFRESH_TOKEN=the-new-token

# Cloudflare Worker secret
npx wrangler secret put SPOTIFY_REFRESH_TOKEN
```

Repeat roughly every six months. The request scopes are `user-read-currently-playing`, `user-read-recently-played` and `user-top-read`.

### Last.fm (optional)

The music page shows a "recently scrobbled" widget when these are set:

```dotenv
LASTFM_API_KEY=...
LASTFM_USER=...
```

Without them the widget shows a friendly "Last.fm is sleeping" message.

## Deployment

Authenticate Wrangler once:

```bash
npx wrangler login
```

Add the Spotify credentials as Worker secrets:

```bash
npx wrangler secret put SPOTIFY_CLIENT_ID
npx wrangler secret put SPOTIFY_CLIENT_SECRET
npx wrangler secret put SPOTIFY_REFRESH_TOKEN
```

Add the optional Last.fm credentials the same way (`LASTFM_API_KEY`, `LASTFM_USER`).

Create the D1 database and apply the schema once:

```bash
npx wrangler d1 create andrews
npx wrangler d1 execute andrews --remote --file=db/schema.sql
```

If the database already exists, only the second command is needed. The `database_id` lives in `wrangler.jsonc`.

Then deploy:

```bash
npm run deploy
```

`npm run check` performs a dry run of the deployment without uploading anything.

### Domain routing

`wrangler.jsonc` attaches the Worker to `andrews.sh/*` and `www.andrews.sh/*` using [Worker routes](https://developers.cloudflare.com/workers/configuration/routing/routes/). Routes require the hostnames to have proxied DNS records in the `andrews.sh` zone; the old Vercel records can stay in place because the Worker handles every matching request, but **do not delete them while routes are in use** or the hostnames stop resolving.

To use a Workers custom domain instead:

1. Delete the existing `andrews.sh` and `www.andrews.sh` DNS records.
2. Add both hostnames as custom domains for the Worker.
3. Remove the `routes` block from `wrangler.jsonc` and redeploy.

Custom domains manage their own DNS records and certificates, so the two approaches should not be mixed on the same hostname.

### Deploying from Git

If you connect the repository to Cloudflare, configure a Workers Build with:

- **Build command:** `npm install`
- **Deploy command:** `npm run deploy`
- **Root directory:** the repository root

Set `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_REFRESH_TOKEN` as secrets/variables in the build settings. The D1 binding comes from `wrangler.jsonc`; apply `db/schema.sql` to the production database separately.
