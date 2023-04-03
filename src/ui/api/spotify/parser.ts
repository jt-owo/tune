import { ArtistItem, AlbumItem, TrackItem, PlaylistItem } from '../../../typings/spotify/items';
import { UserProfileResult, SearchResult, PlaybackStateResult } from '../../../typings/spotify/results';
import { IArtist, IAlbum, ITrack, IUser, IPlaybackState, IPlaylist } from '../../../typings/types';
import newGuid from '../../util';

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
		return artists.map((artist) => {
			return {
				name: artist.name,
				images: artist.images
			};
		});
	}

	/**
	 * Parses a spotify album object into the tune format.
	 * @param album Album object. (From spotify result)
	 * @returns An album object in the tune format.
	 */
	static parseAlbum(album: AlbumItem): IAlbum {
		return {
			name: album.name,
			artists: this.parseArtists(album.artists),
			images: album.images,
			releaseDate: album.release_date,
			totalTracks: album.total_tracks
		};
	}

	/**
	 * Parses a spotify album array into the tune format.
	 * @param albums Album array. (From spotify result)
	 * @returns An album array in the tune format.
	 */
	static parseAlbums(albums: AlbumItem[]): IAlbum[] {
		return albums.map((album) => this.parseAlbum(album));
	}

	/**
	 * Parses a spotify track object into the tune format.
	 * @param track Track object. (From spotify result)
	 * @returns A track object in the tune format.
	 */
	static parseTrack(track: TrackItem, id: number): ITrack {
		return {
			id,
			name: track.name,
			album: this.parseAlbum(track.album),
			artists: this.parseArtists(track.artists),
			duration: track.duration_ms,
			isLocal: false,
			service: 'spotify'
		};
	}

	/**
	 * Parses a spotify track array into the tune format.
	 * @param tracks Track array. (From spotify result)
	 * @returns A track array in the tune format.
	 */
	static parseTracks(tracks: TrackItem[]): ITrack[] {
		return tracks.map((track, index) => {
			const parsed = this.parseTrack(track, index + 1);
			return parsed;
		});
	}

	/**
	 * Parses a spotify playlist object into the tune format.
	 * @param playlist Playlist object. (From spotify result)
	 * @returns A playlist object in the tune format.
	 */
	static parsePlaylist(playlist: PlaylistItem): IPlaylist {
		return {
			id: newGuid(),
			name: playlist.name,
			description: playlist.description,
			images: playlist.images,
			tracks: [],
			pinned: false,
			locked: false,
			service: 'spotify',
			collaborative: playlist.collaborative,
			public: playlist.public,
			tracksHref: playlist.tracks.href
		};
	}

	/**
	 * Parses a spotify playlist array into the tune format.
	 * @param playlists Playlist array. (From spotify result)
	 * @returns A playlist array in the tune format.
	 */
	static parsePlaylists(playlists: PlaylistItem[]): IPlaylist[] {
		return playlists.map((playlist) => this.parsePlaylist(playlist));
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
			albums = this.parseAlbums(data.albums.items);
		}

		let artists: IArtist[] = [];
		if (data.artists) {
			artists = this.parseArtists(data.artists.items);
		}

		let tracks: ITrack[] = [];
		if (data.tracks) {
			tracks = this.parseTracks(data.tracks.items);
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
			track = this.parseTrack(playbackState.item, -1);
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
