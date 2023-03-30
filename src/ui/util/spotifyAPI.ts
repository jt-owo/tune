/* eslint-disable compat/compat */
import { SavedAlbumsResult, SearchResult, TrackItem, UserTopArtistsResult, UserTopTracksResult } from '../../typings/spotifyAPI';
import { IAlbum, ITrack } from '../../typings/spotifyTypes';
import SpotifyParser from './spotifyParser';

export const CLIENT_ID = '5ca32668f6564c6595cdb0a0b315af28';
export const REDIRECT_URI = 'http://localhost:9100/callback';

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

class SpotifyAPI {
	private static async callAPI(token: string, url: string, params?: URLSearchParams) {
		let request = url;

		if (params) {
			request += `?${params.toString()}`;
		}

		const result = await fetch(request, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		});

		return result;
	}

	static async authorize() {
		const params = new URLSearchParams();
		params.append('client_id', CLIENT_ID);
		params.append('response_type', 'token');
		params.append('redirect_uri', REDIRECT_URI);
		params.append('scope', 'user-read-private user-read-email user-library-read user-top-read');

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

	/**
	 * Fetches a list of albums saved in the user's library.
	 * https://developer.spotify.com/documentation/web-api/reference/get-users-saved-albums
	 * @param token Acess Token.
	 * @param limit The maximum number of items to return. Range: 0 - 50
	 * @param offset The index of the first item to return. Default: 0
	 * @returns A list of albums.
	 */
	static async fetchSavedAlbums(token: string, limit = 20, offset = 0) {
		const params = new URLSearchParams();
		params.append('limit', limit.toString());
		if (offset && offset > 0) params.append('offset', offset.toString());

		const result = await this.callAPI(token, 'https://api.spotify.com/v1/me/albums', params);
		const data: SavedAlbumsResult = await result.json();

		const savedAlbums: IAlbum[] = [];
		data.items.forEach((item) => {
			savedAlbums.push(SpotifyParser.parseAlbum(item.album));
		});

		return savedAlbums;
	}

	/**
	 * Fetches the user's top artists or tracks based on calculated affinity.
	 * https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
	 * @param token Access Token.
	 * @param type The type of entity to return.
	 * @param timeRange Over what time frame the affinities are computed. For more information check the docs.
	 * @param limit The maximum number of items to return. Range: 0 - 50
	 * @param offset The index of the first item to return. Default: 0
	 * @returns A list of artists or tracks.
	 */
	static async fetchUserTopItems(token: string, type: 'artists' | 'tracks', timeRange: TimeRange = 'medium_term', limit = 20, offset = 0) {
		const params = new URLSearchParams();
		params.append('time_range', timeRange);
		params.append('limit', limit.toString());
		if (offset && offset > 0) params.append('offset', offset.toString());

		const result = await this.callAPI(token, `https://api.spotify.com/v1/me/top/${type}`, params);

		if (type === 'tracks') {
			const data: UserTopTracksResult = await result.json();

			const tracks: ITrack[] = [];
			data.items.forEach((track: TrackItem) => {
				tracks.push(SpotifyParser.parseTrack(track));
			});

			return tracks;
		}

		const data: UserTopArtistsResult = await result.json();
		return SpotifyParser.parseArtists(data.items);
	}

	/**
	 * Fetches spotify catalog information about albums, artists, playlists or tracks that match a keyword string.
	 * This function does not support playlists currently.
	 * https://developer.spotify.com/documentation/web-api/reference/search
	 * @param query Search query
	 * @param token Access Token
	 * @returns A list of albums, artists, playlists and/or tracks
	 */
	static async search(token: string, query: string) {
		const params = new URLSearchParams();
		params.append('q', query);
		params.append('type', 'track,album,artist');

		const result = await this.callAPI(token, 'https://api.spotify.com/v1/search', params);
		const data: SearchResult = await result.json();
		return SpotifyParser.parseSearch(data);
	}
}

export default SpotifyAPI;
