#!/usr/bin/env node
/**
 * Obtain a Spotify refresh token using the Authorization Code flow.
 *
 * Usage:
 *   npm run auth
 *
 * The script reads SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET from .dev.vars
 * (or from environment variables). The redirect URI defaults to
 * http://127.0.0.1:8888/callback and can be overridden with SPOTIFY_REDIRECT_URI.
 *
 * Add the exact redirect URI to the Spotify app before running the script.
 */

import { exec } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

const SCOPES = [
	'user-read-currently-playing',
	'user-read-recently-played',
	'user-top-read'
];

function readDevVars() {
	const file = fileURLToPath(new URL('../.dev.vars', import.meta.url));
	const vars = {};

	if (!existsSync(file)) {
		return vars;
	}

	for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) {
			continue;
		}

		const separator = trimmed.indexOf('=');
		if (separator === -1) {
			continue;
		}

		vars[trimmed.slice(0, separator).trim()] = trimmed.slice(separator + 1).trim();
	}

	return vars;
}

const vars = { ...readDevVars(), ...process.env };
const clientId = vars.SPOTIFY_CLIENT_ID;
const clientSecret = vars.SPOTIFY_CLIENT_SECRET;
const redirectUri = vars.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:8888/callback';

if (!clientId || !clientSecret) {
	console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .dev.vars or the environment.');
	process.exit(1);
}

const redirect = new URL(redirectUri);
const port = Number(redirect.port || 80);
const state = randomBytes(12).toString('hex');

const authorizeUrl = new URL('https://accounts.spotify.com/authorize');
authorizeUrl.search = new URLSearchParams({
	client_id: clientId,
	response_type: 'code',
	redirect_uri: redirectUri,
	scope: SCOPES.join(' '),
	state,
	show_dialog: 'true'
}).toString();

function openBrowser(url) {
	const command = process.platform === 'darwin' ? 'open' : 'xdg-open';
	exec(`${command} "${url}"`, () => {
		// Opening the browser is a convenience; the URL is printed either way.
	});
}

const server = createServer(async (request, response) => {
	const url = new URL(request.url, redirectUri);

	if (url.pathname !== redirect.pathname) {
		response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
		response.end('Not found');
		return;
	}

	const error = url.searchParams.get('error');
	const code = url.searchParams.get('code');

	if (error) {
		response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
		response.end('Authorization failed: ' + error);
		console.error('\nAuthorization failed: ' + error);
		server.close();
		process.exitCode = 1;
		return;
	}

	if (!code) {
		response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
		response.end('Missing authorization code.');
		server.close();
		process.exitCode = 1;
		return;
	}

	if (url.searchParams.get('state') !== state) {
		response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
		response.end('State mismatch. Start the flow again.');
		server.close();
		process.exitCode = 1;
		return;
	}

	try {
		const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
				'content-type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: redirectUri
			})
		});

		const body = await tokenResponse.json();

		if (!tokenResponse.ok) {
			throw new Error(JSON.stringify(body));
		}

		response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
		response.end('Authorized. You can close this tab and return to the terminal.');

		console.log('\nRefresh token:\n');
		console.log(body.refresh_token);
		console.log('\nAdd it to .dev.vars, then update the Worker secret:');
		console.log('  npx wrangler secret put SPOTIFY_REFRESH_TOKEN\n');
		console.log('Spotify refresh tokens expire 6 months after authorization. Repeat then.\n');
		server.close();
	} catch (tokenError) {
		response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
		response.end('Token exchange failed: ' + tokenError.message);
		console.error('\nToken exchange failed: ' + tokenError.message);
		server.close();
		process.exitCode = 1;
	}
});

server.on('error', (error) => {
	if (error.code === 'EADDRINUSE') {
		console.error('\nPort ' + port + ' is already in use on ' + redirect.hostname + '.');
		console.error('Stop the other process, or use another redirect URI registered in Spotify:');
		console.error('  SPOTIFY_REDIRECT_URI=http://127.0.0.1:8899/callback npm run auth\n');
	} else {
		console.error(error);
	}

	process.exit(1);
});

server.listen(port, redirect.hostname, () => {
	console.log('\nRedirect URI (must be registered in the Spotify app):');
	console.log('  ' + redirectUri);
	console.log('\nAuthorize here:\n');
	console.log(authorizeUrl.toString() + '\n');
	console.log('Waiting for the callback...');
	openBrowser(authorizeUrl.toString());
});
