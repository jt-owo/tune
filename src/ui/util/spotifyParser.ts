import { ArtistItem, AlbumItem, TrackItem, SearchResult, UserProfileResult, PlaybackStateResult } from '../../typings/spotifyAPI';
import { IArtist, IAlbum, ITrack, IUser, IPlaybackState } from '../../typings/types';

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
			releaseDate: album.release_date,
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

	static parsePlaybackState(playbackState: PlaybackStateResult): IPlaybackState {
		let track: ITrack | undefined;
		if (playbackState.item) {
			track = this.parseTrack(playbackState.item);
		}

		return {
			volume: playbackState.device.volume_percent,
			progress: playbackState.progress_ms,
			isPlaying: playbackState.is_playing,
			isRepeat: playbackState.repeat_state === 'on',
			isShuffle: playbackState.shuffle_state,
			track
		};
	}
}

export default SpotifyParser;
