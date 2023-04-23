/* eslint-disable @typescript-eslint/no-empty-interface */
declare namespace SpotifyAPI {
	interface Image {
		/** The image height in pixels. */
		height?: number;
		/** The image width in pixels. */
		width?: number;
		/** The URL of the image. */
		url: string;
	}

	interface Restrictions {
		reason: string;
	}

	interface ExternalUrl {
		spotify: string;
	}

	interface ExternalId {
		isrc?: string;
		ean?: string;
		upc?: string;
	}

	interface TrackLink {
		external_urls: ExternalUrl;
		href: string;
		id: string;
		uri: string;
		type: 'track';
	}

	interface Followers {
		/** A link to the Web API endpoint providing full details of the followers */
		href: string | null;
		/** The total number of followers. */
		total: number;
	}

	interface Copyright {
		text: string;
		type: 'C' | 'P';
	}

	interface UserPublic {
		display_name?: string;
		external_urls: ExternalUrl;
		followers?: Followers;
		href: string;
		id: string;
		images?: Image[];
		type: 'user';
		uri: string;
	}

	interface UserPrivate extends UserPublic {
		birthdate: string;
		country: string;
		email: string;
		product: string;
	}

	interface PlaybackState {
		shuffle_state: boolean;
		repeat_state: 'off' | 'track' | 'context';
	}

	interface CurrentlyPlaying {
		timestamp: number;
		device: Device;
		actions: Actions;
		progress_ms: number | null;
		is_playing: boolean;
		item: Track | null;
		context: Context | null;
		currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
	}

	interface Device {
		id: string | null;
		is_active: boolean;
		is_restricted: boolean;
		is_private_session: boolean;
		name: string;
		type: string;
		volume_percent: number | null;
	}

	interface Actions {
		disallows: Disallows;
	}

	interface Disallows {
		interrupting_playback?: boolean;
		pausing?: boolean;
		resuming?: boolean;
		seeking?: boolean;
		skipping_next?: boolean;
		skipping_prev?: boolean;
		toggling_repeat_context?: boolean;
		toggling_repeat_track?: boolean;
		toggling_shuffle?: boolean;
		transferring_playback?: boolean;
	}

	/**
	 * Query object used for retrieving collections from the Spotify API.
	 */
	interface Query<T> {
		href: string;
		limit: number;
		next: string;
		offset: number;
		previous: string;
		total: number;
		items: T[];
	}

	interface Context {
		/**
		 * The object type.
		 *
		 * tune only supports `artist`, `playlist` and `album`.
		 */
		type: 'artist' | 'playlist' | 'album' | 'show' | 'episode';
		/** A link to the Web API endpoint providing full details. */
		href: string;
		/** Known external URLs. */
		external_urls: ExternalUrl;
		/** * The [Spotify URI](https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids). */
		uri: string;
	}

	interface Error {
		/** The HTTP status code. */
		status: number;
		/** A short description of the cause of the error. */
		message: string;
	}

	interface ArtistSimple extends Context {
		/** The name of the artist. */
		name: string;
		/** The [Spotify ID](https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids) for the artist. */
		id: string;
		type: 'artist';
	}

	interface Artist extends ArtistSimple {
		/** Information about the followers of the artist. */
		followers: Followers;
		/** A list of the genres the artist is associated with. */
		genres: string[];
		/** Images of the artist. */
		images: Image[];
		/** The popularity of the artist. The value will be between `0` and `100`, with `100` being the most popular. */
		popularity: number;
	}

	interface Track extends TrackSimple {
		/** The album on which the track appears. */
		album: Album;
		/** Known external IDs for the track. */
		external_ids: ExternalId;
		/** The popularity of the track. The value will be between `0` and `100`, with `100` being the most popular. */
		popularity: number;
		/** If the track is from a local file. */
		is_local?: boolean;
	}

	interface TrackSimple {
		/** The artist(s of the track. */
		artists: ArtistSimple[];
		/** A list of the countries in which the track can be played. */
		available_markets?: string[];
		/** The disc number. */
		disc_number: number;
		/** The track duration in milliseconds. */
		duration_ms: number;
		/** If the track has explicit lyrics. */
		explicit: boolean;
		/** Known external URLs for this track. */
		external_urls: ExternalUrl;
		/** A link to the Web API endpoint providing full details of the track. */
		href: string;
		/** The [Spotify ID](https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids) for the track. */
		id: string;
		/** If the track is playable or not. */
		is_playable?: boolean;
		linked_from?: TrackLink;
		restrictions?: Restrictions;
		/** The name of the track. */
		name: string;
		/** A link to a 30 second preview (MP3 format) of the track. */
		preview_url: string | null;
		/** The number of the track. If an album has several discs, the track number is the number on the specified disc. */
		track_number: number;
		/** The [Spotify URI](https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids) for the track. */
		uri: string;
		type: 'track';
	}

	interface Album extends AlbumSimple {
		/** The copyright statements of the album. */
		copyrights: Copyright[];
		/** Known external IDs for the album. */
		external_ids: ExternalId;
		/** A list of the genres used to classify the album. */
		genres: string[];
		/** The label for the album. */
		label: string;
		/** The popularity of the album. The value will be between `0` and `100`, with `100` being the most popular. */
		popularity: number;
		/** The tracks of the album. */
		tracks: Query<TrackSimple>;
	}

	interface AlbumSimple extends Context {
		/** The field is present when getting an artist’s albums. */
		album_group?: 'album' | 'single' | 'compilation' | 'appears_on';
		/** The type of the album. */
		album_type: 'album' | 'single' | 'compilation';
		/** The artists of the album. */
		artists: Artist[];
		/** The markets in which the album is available. */
		available_markets?: string[] | undefined;
		/** The [Spotify ID](https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids) for the album. */
		id: string;
		/** The cover art for the album in various sizes, widest first. */
		images: Image[];
		/** The name of the album. In case of an album takedown, the value may be an empty string. */
		name: string;
		/** The date the album was first released. */
		release_date: string;
		/** The precision with which {@link release_date} value is known. */
		release_date_precision: 'year' | 'month' | 'day';
		restrictions?: Restrictions;
		/** The number of tracks in the album. */
		total_tracks: number;
		type: 'album';
	}

	interface PlaylistBase extends Context {
		/** If the owner allows other users to modify this playlist. */
		collaborative: boolean;
		/** The playlist description. */
		description: string | null;
		/** The [Spotify ID](https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids) for the playlist. */
		id: string;
		/** Images for the playlist. */
		images: Image[];
		/** The name of the playlist. */
		name: string;
		/** The owner of the playlist. */
		owner: UserPublic;
		/** The playlist’s visibility status */
		public: boolean | null;
		snapshot_id: string;
		type: 'playlist';
	}

	interface Playlist extends PlaylistBase {
		/** Information about the followers of the playlist. */
		followers: Followers;
		/** Information about the tracks of the playlist. */
		tracks: Query<PlaylistTrack>;
	}

	interface PlaylistSimple extends PlaylistBase {
		tracks: {
			href: string;
			total: number;
		};
	}

	interface PlaylistTrack {
		added_at: string;
		added_by: UserPublic;
		is_local: boolean;
		track: Track;
	}

	interface SavedTrack {
		added_at: string;
		track: Track;
	}

	interface SavedAlbum {
		added_at: string;
		album: Album;
	}

	// RESULTS
	/**
	 * Search for albums.
	 *
	 * GET /v1/search?type=album
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/search
	 */
	interface AlbumSearchResponse {
		albums: Query<Album>;
	}

	/**
	 * Search for artists.
	 *
	 * GET /v1/search?type=artist
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/search
	 */
	interface ArtistSearchResponse {
		artists: Query<Artist>;
	}

	/**
	 * Search for playlists.
	 *
	 * GET /v1/search?type=playlist
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/search
	 */
	interface PlaylistSearchResponse {
		playlists: Query<PlaylistSimple>;
	}

	/**
	 * Search for tracks.
	 *
	 * GET /v1/search?type=track
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/search
	 */
	interface TrackSearchResponse {
		tracks: Query<Track>;
	}

	/**
	 * Search for artists, albums, tracks and playlists.
	 *
	 * GET /v1/search
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/search
	 */
	interface SearchResponse extends Partial<ArtistSearchResponse>, Partial<AlbumSearchResponse>, Partial<TrackSearchResponse>, Partial<PlaylistSearchResponse> {}

	/**
	 * Get the current user's playlists.
	 *
	 * GET /v1/me/playlists
	 *
	 * Auth scopes:
	 * - `playlist-read-private`
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
	 */
	interface UserPlaylistsResponse extends Query<Playlist> {}

	/**
	 * Get the tracks of a playlist.
	 *
	 * GET /v1/playlists/{playlist_id}/tracks
	 *
	 * Auth scopes:
	 * - `playlist-read-private`
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
	 */
	interface PlaylistTrackResponse extends Query<PlaylistTrack> {}

	/**
	 * Get the current user's saved tracks.
	 *
	 * GET /v1/me/tracks
	 *
	 * Auth scopes:
	 * - `user-library-read`
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/get-users-saved-tracks
	 */
	interface UserSavedTracksResponse extends Query<SavedTrack> {}

	/**
	 * Get the current user's saved albums.
	 *
	 * GET /v1/me/albums
	 *
	 * Auth scopes:
	 * - `user-library-read`
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/get-users-saved-albums
	 */
	interface UserSavedAlbumsResponse extends Query<SavedAlbum> {}

	/**
	 * Get the current user's profile.
	 *
	 * GET /v1/me
	 *
	 * Auth scopes:
	 * - `user-read-private`
	 * - `user-read-email` (Only needed to retrieve the E-Mail)
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
	 */
	interface UserProfileResponse extends UserPrivate {}

	/**
	 * Get the current user's playback state.
	 *
	 * GET /me/player
	 *
	 * Auth scopes:
	 * - `user-read-playback-state`
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback
	 */
	interface PlaybackStateResponse extends CurrentlyPlaying, PlaybackState {}

	/**
	 * Get the current user's top tracks.
	 *
	 * GET /me/top?type=tracks
	 *
	 * Auth scopes:
	 * - `user-top-read`
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback
	 */
	interface TopTracksResponse extends Query<Track> {}

	/**
	 * Get the current user's top artists.
	 *
	 * GET /me/top?type=artists
	 *
	 * Auth scopes:
	 * - `user-top-read`
	 *
	 * https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback
	 */
	interface TopArtistsResponse extends Query<Artist> {}
}
