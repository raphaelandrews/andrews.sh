/**
 * Cloudflare Worker for andrews.sh
 *
 * Serves the static site from ./public (via the ASSETS binding) and exposes a
 * small read-only API on top of the Spotify Web API.
 */

const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_ENDPOINT = 'https://api.spotify.com/v1';

const TOP_TRACKS_ENDPOINT = '/me/top/tracks?time_range=long_term&limit=6';
const TOP_ARTISTS_ENDPOINT = '/me/top/artists?time_range=long_term&limit=6';
const CURRENTLY_PLAYING_ENDPOINT = '/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = '/me/player/recently-played?limit=3';

// Cached per Worker isolate so a page load only needs one token request.
let cachedToken = null;

const mockCurrentlyPlayingData = {
	item: {
		album: {
			images: [
				{
					url: 'https://i.scdn.co/image/ab67616d0000b273da187d0211e422b8ef662dc2',
					height: 640,
					width: 640
				}
			],
			name: 'Macro'
		},
		artists: [{ name: 'Jinjer' }],
		external_urls: {
			spotify: 'https://open.spotify.com/track/0MAOtWNk7VClsYs8CuLYTr'
		},
		name: 'Pit of Consciousness'
	}
};

const mockRecentlyPlayedData = {
	items: [
		{
			track: {
				album: {
					images: [
						{
							url: 'https://i.scdn.co/image/ab67616d0000b273da187d0211e422b8ef662dc2',
							height: 640,
							width: 640
						}
					],
					name: 'Macro'
				},
				artists: [
					{
						name: 'Jinjer',
						external_urls: {
							spotify: 'https://open.spotify.com/artist/7o6cOczXTB8ioTAAJTbESf'
						}
					}
				],
				external_urls: {
					spotify: 'https://open.spotify.com/track/0MAOtWNk7VClsYs8CuLYTr'
				},
				name: 'Pit of Consciousness'
			}
		}
	]
};

const mockArtistsData = [
	{
		id: '2KaW48xlLnXC2v8tvyhWsa',
		name: 'Amaranthe',
		genres: ['symphonic metal', 'power metal', 'metal'],
		image: {
			height: 640,
			url: 'https://i.scdn.co/image/ab6761610000e5eb293f7f4aebb31292f607bf3b',
			width: 640
		},
		url: 'https://open.spotify.com/artist/2KaW48xlLnXC2v8tvyhWsa'
	},
	{
		id: '7o6cOczXTB8ioTAAJTbESf',
		name: 'Jinjer',
		genres: ['metal', 'djent', 'groove metal', 'progressive metal', 'metalcore'],
		image: {
			height: 640,
			url: 'https://i.scdn.co/image/ab6761610000e5ebed492174d89956bf1f6af3ff',
			width: 640
		},
		url: 'https://open.spotify.com/artist/7o6cOczXTB8ioTAAJTbESf'
	},
	{
		id: '6pIRdCtSE5hLFfIfcTAicI',
		name: 'Delain',
		genres: ['symphonic metal', 'gothic metal', 'power metal', 'metal', 'gothic rock'],
		image: {
			height: 640,
			url: 'https://i.scdn.co/image/ab6761610000e5eb018cf8aa649ae040cabf9e9c',
			width: 640
		},
		url: 'https://open.spotify.com/artist/6pIRdCtSE5hLFfIfcTAicI'
	},
	{
		id: '4OAddazJM576euUnFSvXSL',
		name: 'Lacuna Coil',
		genres: ['gothic metal', 'symphonic metal', 'gothic rock', 'metal'],
		image: {
			height: 640,
			url: 'https://i.scdn.co/image/ab6761610000e5eb8f989674720776c95065a68d',
			width: 640
		},
		url: 'https://open.spotify.com/artist/4OAddazJM576euUnFSvXSL'
	},
	{
		id: '5t28BP42x2axFnqOOMg3CM',
		name: 'Five Finger Death Punch',
		genres: ['metal', 'groove metal', 'heavy metal', 'hard rock', 'rock'],
		image: {
			height: 640,
			url: 'https://i.scdn.co/image/ab6761610000e5eb1e7f796a17c2dc3c28bdeeb9',
			width: 640
		},
		url: 'https://open.spotify.com/artist/5t28BP42x2axFnqOOMg3CM'
	},
	{
		id: '2tz0dkPlnWB4NcHNIqWPgh',
		name: 'Mc Maha',
		genres: ['anime rap', 'funk', 'brazilian funk'],
		image: {
			height: 640,
			url: 'https://i.scdn.co/image/ab6761610000e5eb74378b3dd3f36d89f99dfe64',
			width: 640
		},
		url: 'https://open.spotify.com/artist/2tz0dkPlnWB4NcHNIqWPgh'
	}
];

const mockTracksData = [
	{
		id: '11Ojp7JniVvwd0gmgvyKkd',
		name: 'Wrong Side of Heaven',
		artists: [{ name: 'Five Finger Death Punch' }],
		albumName: 'The Wrong Side Of Heaven And The Righteous Side Of Hell, Volume 1',
		albumImage: {
			height: 640,
			url: 'https://i.scdn.co/image/ab67616d0000b27376df46a3fd82c419a2dc0a43',
			width: 640
		},
		url: 'https://open.spotify.com/track/11Ojp7JniVvwd0gmgvyKkd'
	},
	{
		id: '1UWGkn34CD31VQfdi4D8Zp',
		name: 'Bad Company',
		artists: [{ name: 'Five Finger Death Punch' }],
		albumName: 'War is the Answer',
		albumImage: {
			height: 640,
			url: 'https://i.scdn.co/image/ab67616d0000b273021dd6fc31a42ac4e4ab778c',
			width: 640
		},
		url: 'https://open.spotify.com/track/1UWGkn34CD31VQfdi4D8Zp'
	},
	{
		id: '7B3z0ySL9Rr0XvZEAjWZzM',
		name: 'Sofia',
		artists: [{ name: 'Amaranthe' }],
		albumName: 'Immunity',
		albumImage: {
			height: 640,
			url: 'https://i.scdn.co/image/ab67616d0000b27333ccb60f9b2785ef691b2fbc',
			width: 640
		},
		url: 'https://open.spotify.com/track/7B3z0ySL9Rr0XvZEAjWZzM'
	},
	{
		id: '14WYmNQWvR2TTWoRp8t9Ml',
		name: 'RATATATA',
		artists: [{ name: 'Jinjer' }, { name: 'Tatiana Shmayluk' }],
		albumName: 'RATATATA',
		albumImage: {
			height: 640,
			url: 'https://i.scdn.co/image/ab67616d0000b2733900e6899672f9dfdc028611',
			width: 640
		},
		url: 'https://open.spotify.com/track/14WYmNQWvR2TTWoRp8t9Ml'
	},
	{
		id: '51m9kUkrbufdmMl4ZBHcgR',
		name: 'Strange Machines',
		artists: [{ name: 'The Gathering' }],
		albumName: 'Mandylion',
		albumImage: {
			height: 640,
			url: 'https://i.scdn.co/image/ab67616d0000b273bf83720ca7a5539a8b0be737',
			width: 640
		},
		url: 'https://open.spotify.com/track/51m9kUkrbufdmMl4ZBHcgR'
	},
	{
		id: '1LHZMWefF9502NPfArRfvP',
		name: 'Lift Me Up (feat. Rob Halford of Judas Priest)',
		artists: [{ name: 'Five Finger Death Punch' }],
		albumName: 'The Wrong Side Of Heaven And The Righteous Side Of Hell, Volume 1',
		albumImage: {
			height: 640,
			url: 'https://i.scdn.co/image/ab67616d0000b27376df46a3fd82c419a2dc0a43',
			width: 640
		},
		url: 'https://open.spotify.com/track/1LHZMWefF9502NPfArRfvP'
	}
];

function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'no-store'
		}
	});
}

function shouldUseMocks(env) {
	return env.MOCK_SPOTIFY === 'true';
}

async function getAccessToken(env) {
	if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
		return cachedToken.accessToken;
	}

	const basic = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
	const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			authorization: `Basic ${basic}`,
			'content-type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: env.SPOTIFY_REFRESH_TOKEN
		})
	});

	if (!response.ok) {
		const body = await response.text();
		let message = `Spotify token error: ${response.status} ${body}`;

		try {
			const parsed = JSON.parse(body);
			if (parsed.error === 'invalid_grant') {
				message = 'Spotify refresh token expired or revoked. Run `npm run auth` and update SPOTIFY_REFRESH_TOKEN.';
			} else if (parsed.error === 'invalid_client') {
				message = 'Spotify rejected the client credentials. Check SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.';
			}
		} catch {
			// Keep the raw response when it is not JSON.
		}

		throw new Error(message);
	}

	const data = await response.json();
	cachedToken = {
		accessToken: data.access_token,
		expiresAt: Date.now() + (data.expires_in || 3600) * 1000
	};

	return cachedToken.accessToken;
}

async function spotifyGet(env, endpoint) {
	const accessToken = await getAccessToken(env);
	const response = await fetch(`${SPOTIFY_API_ENDPOINT}${endpoint}`, {
		headers: { authorization: `Bearer ${accessToken}` }
	});

	// Spotify responds with 204 when there is nothing to return.
	if (response.status === 204) {
		return null;
	}

	if (!response.ok) {
		throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

async function getTopArtists(_request, env) {
	if (shouldUseMocks(env)) {
		return mockArtistsData;
	}

	const data = await spotifyGet(env, TOP_ARTISTS_ENDPOINT);

	return (data?.items || []).map((artist) => ({
		id: artist.id,
		name: artist.name,
		genres: artist.genres,
		image: artist.images?.[0] ?? null,
		url: artist.external_urls.spotify
	}));
}

async function getTopTracks(_request, env) {
	if (shouldUseMocks(env)) {
		return mockTracksData;
	}

	const data = await spotifyGet(env, TOP_TRACKS_ENDPOINT);

	return (data?.items || []).map((track) => ({
		id: track.id,
		name: track.name,
		artists: track.artists,
		albumName: track.album.name,
		albumImage: track.album.images?.[0] ?? null,
		url: track.external_urls.spotify
	}));
}

async function getRecentlyPlayed(_request, env) {
	if (shouldUseMocks(env)) {
		return mockRecentlyPlayedData;
	}

	return spotifyGet(env, RECENTLY_PLAYED_ENDPOINT);
}

async function getCurrentlyPlaying(_request, env) {
	const data = shouldUseMocks(env) ? mockCurrentlyPlayingData : await spotifyGet(env, CURRENTLY_PLAYING_ENDPOINT);
	const track = data?.item;

	if (!track || data.is_playing === false) {
		return { isPlaying: false };
	}

	return {
		isPlaying: true,
		title: track.name,
		artist: track.artists.map((artist) => artist.name).join(', '),
		albumImageUrl: track.album.images?.[0]?.url ?? null,
		songUrl: track.external_urls.spotify
	};
}

class HttpError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}

async function readForm(request) {
	return new URLSearchParams(await request.text());
}

function cleanText(value, maxLength) {
	return String(value || '')
		.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
		.trim()
		.slice(0, maxLength);
}

function normalizeWebsite(value) {
	const raw = cleanText(value, 200);
	if (!raw) {
		return '';
	}

	try {
		const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
		if (url.protocol !== 'http:' && url.protocol !== 'https:') {
			return '';
		}
		return url.toString();
	} catch {
		return '';
	}
}

async function incrementCounter(_request, env) {
	await env.DB.prepare('UPDATE counter SET hits = hits + 1 WHERE id = 1').run();
	const row = await env.DB.prepare('SELECT hits FROM counter WHERE id = 1').first();
	return { hits: row ? row.hits : 0 };
}

async function listGuestbook(_request, env) {
	const { results } = await env.DB.prepare(
		'SELECT id, name, website, message, created_at FROM guestbook ORDER BY id DESC LIMIT 50'
	).all();

	return { entries: results || [] };
}

async function createGuestbook(request, env) {
	const form = await readForm(request);

	// Honeypot field: real visitors never fill this one in.
	if (cleanText(form.get('url2'), 100)) {
		return { ok: true };
	}

	const name = cleanText(form.get('name'), 40) || 'anonymous';
	const message = cleanText(form.get('message'), 800);

	if (!message) {
		throw new HttpError(400, 'Message is required.');
	}

	await env.DB.prepare('INSERT INTO guestbook (name, website, message) VALUES (?, ?, ?)')
		.bind(name, normalizeWebsite(form.get('website')), message)
		.run();

	return { ok: true };
}

async function listShoutbox(_request, env) {
	const { results } = await env.DB.prepare(
		'SELECT id, name, message, created_at FROM shoutbox ORDER BY id DESC LIMIT 20'
	).all();

	return { entries: results || [] };
}

async function createShoutbox(request, env) {
	const form = await readForm(request);

	if (cleanText(form.get('url2'), 100)) {
		return { ok: true };
	}

	const name = cleanText(form.get('name'), 30) || 'anonymous';
	const message = cleanText(form.get('message'), 200);

	if (!message) {
		throw new HttpError(400, 'Message is required.');
	}

	await env.DB.prepare('INSERT INTO shoutbox (name, message) VALUES (?, ?)')
		.bind(name, message)
		.run();

	return { ok: true };
}

const routes = {
	'/currently-playing': { GET: getCurrentlyPlaying },
	'/recently-played': { GET: getRecentlyPlayed },
	'/top-artists': { GET: getTopArtists },
	'/top-tracks': { GET: getTopTracks },
	'/counter': { GET: incrementCounter },
	'/guestbook': { GET: listGuestbook, POST: createGuestbook },
	'/shoutbox': { GET: listShoutbox, POST: createShoutbox }
};

export default {
	async fetch(request, env) {
		const { pathname } = new URL(request.url);
		const path = pathname.replace(/\/+$/, '') || '/';
		const route = path.startsWith('/api/') ? path.slice(4) : path;

		// html_handling is "none" so .html URLs are preserved; serve the root
		// through the assets binding explicitly.
		if (path === '/') {
			const indexUrl = new URL(request.url);
			indexUrl.pathname = '/index.html';
			return env.ASSETS.fetch(new Request(indexUrl, request));
		}

		const handlers = routes[route];

		if (!handlers) {
			return env.ASSETS.fetch(request);
		}

		const handler = handlers[request.method];

		if (!handler) {
			return new Response('Method Not Allowed', {
				status: 405,
				headers: { allow: Object.keys(handlers).join(', ') }
			});
		}

		try {
			return json(await handler(request, env));
		} catch (error) {
			console.error(`[${route}]`, error);
			return json({ error: error.message || 'Unexpected error' }, error.status || 500);
		}
	}
};
