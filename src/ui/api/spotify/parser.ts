import Guid from '../../../util/guid';

/**
 * The {@link SpotifyParser} class contains all functions to parse spotify responses into the tune format.
 */
class SpotifyParser {
	/**
	 * Parses a spotify artist object array into the tune format.
	 * @param artists Array of {@link SpotifyAPI.Artist}.
	 * @returns An array of artists in the tune format.
	 */
	static parseArtists(artists: SpotifyAPI.Artist[]): IArtist[] {
		return artists.map((artist) => {
			return {
				name: artist.name,
				images: artist.images
			};
		});
	}

	/**
	 * Parses a spotify album object into the tune format.
	 * @param album Album object.
	 * @returns An album object in the tune format.
	 */
	static parseAlbum(album: SpotifyAPI.Album): IAlbum {
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
	 * @param albums Album array.
	 * @returns An album array in the tune format.
	 */
	static parseAlbums(albums: SpotifyAPI.Album[]): IAlbum[] {
		return albums.map((album) => this.parseAlbum(album));
	}

	/**
	 * Parses a spotify track object into the tune format.
	 * @param track Track object.
	 * @returns A track object in the tune format.
	 */
	static parseTrack(track: SpotifyAPI.Track, id: number): ITrack {
		return {
			id,
			name: track.name,
			album: this.parseAlbum(track.album),
			duration: track.duration_ms / 1000,
			service: 'spotify'
		};
	}

	/**
	 * Parses a spotify track array into the tune format.
	 * @param tracks Track array.
	 * @returns A track array in the tune format.
	 */
	static parseTracks(tracks: SpotifyAPI.Track[]): ITrack[] {
		return tracks.map((track, index) => {
			const parsed = this.parseTrack(track, index + 1);
			return parsed;
		});
	}

	/**
	 * Parses a spotify playlist object into the tune format.
	 * @param playlist Playlist object.
	 * @returns A playlist object in the tune format.
	 */
	static parsePlaylist(playlist: SpotifyAPI.Playlist): IPlaylist {
		return {
			id: Guid.new(),
			name: playlist.name,
			description: playlist.description ?? '',
			images: playlist.images,
			tracks: [],
			pinned: false,
			locked: false,
			service: 'spotify',
			collaborative: playlist.collaborative,
			public: playlist.public ?? false,
			tracksHref: playlist.tracks.href
		};
	}

	/**
	 * Parses a spotify playlist array into the tune format.
	 * @param playlists Playlist array.
	 * @returns A playlist array in the tune format.
	 */
	static parsePlaylists(playlists: SpotifyAPI.Playlist[]): IPlaylist[] {
		return playlists.map((playlist) => this.parsePlaylist(playlist));
	}

	/**
	 * Parses a spotify user into the tune format.
	 * @param user User profile response.
	 * @returns User information.
	 */
	static parseUser(user: SpotifyAPI.UserProfileResponse): IUser {
		const avatar = user.images ? user.images[0] : undefined;

		return {
			name: user.display_name ?? '',
			avatar
		};
	}

	/**
	 * Parses a spotify search result into seperate arrays of objects in the tune format.
	 * @param data Result object.
	 * @returns Arrays for each search type. (e.g. album array)
	 */
	static parseSearch(data: SpotifyAPI.SearchResponse) {
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

		return { albums, artists, tracks } as const;
	}

	/**
	 * Parses the spotify playback state result into the tune format.
	 * @param playbackState PlaybackState result object.
	 * @returns A playback state object in the tune format.
	 */
	static parsePlaybackState(playbackState: SpotifyAPI.PlaybackStateResponse): IPlaybackState {
		let track: ITrack | undefined;
		if (playbackState.item) {
			track = this.parseTrack(playbackState.item, -1);
		}

		return {
			volume: playbackState.device.volume_percent ?? 0,
			progress: playbackState.progress_ms ?? 0,
			isPlaying: playbackState.is_playing,
			repeatMode: 'off',
			isShuffle: playbackState.shuffle_state,
			track
		};
	}
}

export default SpotifyParser;
