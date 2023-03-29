/* eslint-disable compat/compat */
export const CLIENT_ID = '5ca32668f6564c6595cdb0a0b315af28';
export const REDIRECT_URI = 'http://localhost:9100/callback';
export const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
export const RESPONSE_TYPE = 'token';

class SpotifyAPI {
	static async authorize() {
		const params = new URLSearchParams();
		params.append('client_id', CLIENT_ID);
		params.append('response_type', RESPONSE_TYPE);
		params.append('redirect_uri', REDIRECT_URI);
		params.append('scope', 'user-read-private user-read-email user-library-read');

		window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
	}

	static getToken() {
		const { hash } = window.location;
		let token: string | undefined;

		if (hash) {
			token = hash
				.substring(1)
				.split('&')
				.find((e) => e.startsWith('access_token'))
				?.split('=')[1];

			window.location.hash = '';
		}

		return token;
	}

	static async fetchAlbums(token: string) {
		const params = new URLSearchParams();
		params.append('limit', '50');

		const result = await fetch(`https://api.spotify.com/v1/me/albums?${params.toString()}`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		});

		return result.json();
	}
}

export default SpotifyAPI;
