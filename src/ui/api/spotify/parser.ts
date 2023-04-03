import { ArtistItem, AlbumItem, TrackItem } from '../../../typings/spotify/items';
import { UserProfileResult, SearchResult, PlaybackStateResult } from '../../../typings/spotify/results';
import { IArtist, IAlbum, ITrack, IUser, IPlaybackState } from '../../../typings/types';

/**
 * The SpotifyParser class contains all functions to parse spotify items into the tune format.
 */
class SpotifyParser {
	/**
	 * Parses a spotify artist object array into the tune format.
	 * @param artists Array of artists. (From spotify result)
	 * @returns An array of artists in the tune format.
	 */
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

	/**
	 * Parses a spotify album object into the tune format.
	 * @param album Album object. (From spotify result)
	 * @returns An album object in the tune format.
	 */
	static parseAlbum(album: AlbumItem): IAlbum {
		return {
			name: album.name,
			artists: SpotifyParser.parseArtists(album.artists),
			images: album.images,
			releaseDate: album.release_date,
			totalTracks: album.total_tracks
		};
	}

	/**
	 * Parses a spotify track object into the tune format.
	 * @param track Track object. (From spotify result)
	 * @returns A track object in the tune format.
	 */
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

	/**
	 * Parses a spotify search result into seperate arrays of objects in the tune format.
	 * @param data Result object. (From spotify result)
	 * @returns Arrays for each search type. (e.g. album array)
	 */
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

	/**
	 * Parses the spotify playback state result into the tune format.
	 * @param playbackState PlaybackState result object. (From spotify result)
	 * @returns A playback state object in the tune format.
	 */
	static parsePlaybackState(playbackState: PlaybackStateResult): IPlaybackState {
		let track: ITrack | undefined;
		if (playbackState.item) {
			track = this.parseTrack(playbackState.item);
		}

		return {
			volume: playbackState.device.volume_percent,
			progress: playbackState.progress_ms,
			isPlaying: playbackState.is_playing,
			repeatMode: playbackState.repeat_state,
			isShuffle: playbackState.shuffle_state,
			track
		};
	}
}

export default SpotifyParser;
