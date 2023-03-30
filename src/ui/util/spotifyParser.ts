import { ArtistItem, AlbumItem, TrackItem, SearchResult, UserProfileResult } from '../../typings/spotifyAPI';
import { IArtist, IAlbum, ITrack, IUser } from '../../typings/types';

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
			duration: track.duration_ms,
			isLocal: false
		};
	}

	static parseUser(user: UserProfileResult): IUser {
		return {
			name: user.display_name,
			email: user.email,
			avatar: user.images[0]
		};
	}

	static parseSearch(data: SearchResult) {
		let albums: IAlbum[] = [];
		if (data.albums) {
			albums = data.albums.items.map((album: AlbumItem) => {
				return SpotifyParser.parseAlbum(album);
			});
		}

		let artists: IArtist[] = [];
		if (data.artists) {
			artists = SpotifyParser.parseArtists(data.artists.items);
		}

		let tracks: ITrack[] = [];
		if (data.tracks) {
			tracks = data.tracks.items.map((track: TrackItem) => {
				return SpotifyParser.parseTrack(track);
			});
		}

		return { albums, artists, tracks };
	}
}

export default SpotifyParser;
