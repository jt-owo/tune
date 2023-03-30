/* eslint-disable max-classes-per-file */
/* eslint-disable compat/compat */
import { AlbumElement, Artist, SearchResult, TracksItem } from '../../typings/spotifyAPI';
import { IAlbum, IArtist, ITrack } from '../../typings/spotifyTypes';

export const CLIENT_ID = '5ca32668f6564c6595cdb0a0b315af28';
export const REDIRECT_URI = 'http://localhost:9100/callback';
export const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
export const RESPONSE_TYPE = 'token';

class SpotifyParser {
	static parseArtists(artists: Artist[]): IArtist[] {
		const artistsParsed: IArtist[] = [];
		artists.forEach((artist) => {
			artistsParsed.push({
				name: artist.name,
				images: artist.images
			});
		});

		return artistsParsed;
	}

	static parseSearch(data: SearchResult) {
		const albums: IAlbum[] = [];
		if (data.albums) {
			data.albums.items.forEach((album: AlbumElement) => {
				albums.push({
					name: album.name,
					artists: SpotifyParser.parseArtists(album.artists),
					images: album.images,
					releaseDate: new Date(album.releaseDate),
					totalTracks: album.totalTracks,
					type: 'album'
				});
			});
		}

		let artists: IArtist[] = [];
		if (data.artists) {
			artists = SpotifyParser.parseArtists(data.artists.items);
		}

		const tracks: ITrack[] = [];
		if (data.tracks) {
			data.tracks.items.forEach((track: TracksItem) => {
				tracks.push({
					number: track.trackNumber,
					name: track.name,
					album: undefined,
					artists: SpotifyParser.parseArtists(track.artists),
					duration: track.durationMS
				});
			});
		}

		return { albums, artists, tracks };
	}
}

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

	/**
	 * https://developer.spotify.com/documentation/web-api/reference/search
	 * @param query Search query
	 * @param token Access Token
	 * @returns
	 */
	static async search(query: string, token: string) {
		const params = new URLSearchParams();
		params.append('q', query);
		params.append('type', 'track,album,artist');

		const result = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		});

		const data: SearchResult = await result.json();
		return SpotifyParser.parseSearch(data);
	}
}

export default SpotifyAPI;
