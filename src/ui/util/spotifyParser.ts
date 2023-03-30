import { ArtistItem, AlbumItem, TrackItem, SearchResult } from '../../typings/spotifyAPI';
import { IArtist, IAlbum, ITrack } from '../../typings/spotifyTypes';

class SpotifyParser {
	static parseArtists(artists: ArtistItem[]): IArtist[] {
		const artistsParsed: IArtist[] = [];
		artists.forEach((artist) => {
			artistsParsed.push({
				name: artist.name,
				images: artist.images
			});
		});

		return artistsParsed;
	}

	static parseAlbum(album: AlbumItem): IAlbum {
		return {
			name: album.name,
			artists: SpotifyParser.parseArtists(album.artists),
			images: album.images,
			releaseDate: new Date(album.release_date),
			totalTracks: album.total_tracks,
			type: 'album'
		};
	}

	static parseTrack(track: TrackItem): ITrack {
		return {
			id: track.track_number,
			name: track.name,
			album: SpotifyParser.parseAlbum(track.album),
			artists: SpotifyParser.parseArtists(track.artists),
			duration: track.duration_ms
		};
	}

	static parseSearch(data: SearchResult) {
		const albums: IAlbum[] = [];
		if (data.albums) {
			data.albums.items.forEach((album: AlbumItem) => {
				albums.push(SpotifyParser.parseAlbum(album));
			});
		}

		let artists: IArtist[] = [];
		if (data.artists) {
			artists = SpotifyParser.parseArtists(data.artists.items);
		}

		const tracks: ITrack[] = [];
		if (data.tracks) {
			data.tracks.items.forEach((track: TrackItem) => {
				tracks.push(SpotifyParser.parseTrack(track));
			});
		}

		return { albums, artists, tracks };
	}
}

export default SpotifyParser;
