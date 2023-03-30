interface Image {
	url: string;
	height: number;
	width: number;
}

interface ExternalUrls {
	spotify: string;
}

interface ExternalIDS {
	isrc: string;
}

interface Followers {
	href: null;
	total: number;
}

interface ExplicitContent {
	filter_enabled: boolean;
	filter_locked: boolean;
}

interface Actions {
	disallows: Disallows;
}

interface Disallows {
	resuming: boolean;
	skipping_prev: boolean;
}

interface Context {
	external_urls: ExternalUrls;
	href: string;
	type: string;
	uri: string;
}

interface Device {
	id: string;
	is_active: boolean;
	is_private_session: boolean;
	is_restricted: boolean;
	name: string;
	type: string;
	volume_percent: number;
}

type AlbumType = 'single' | 'album';

type ReleaseDatePrecision = 'day' | 'year';

export interface AlbumsQuery {
	href: string;
	items: AlbumItem[];
	limit: number;
	next: string;
	offset: number;
	previous: null;
	total: number;
}

export interface AlbumItem {
	album_group: AlbumType;
	album_type: AlbumType;
	artists: ArtistItem[];
	available_markets: string[];
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	is_playable: boolean;
	name: string;
	release_date: string;
	release_date_precision: ReleaseDatePrecision;
	total_tracks: number;
	type: AlbumType;
	uri: string;
}

export interface ArtistsQuery {
	href: string;
	items: ArtistItem[];
	limit: number;
	next: string;
	offset: number;
	previous: null;
	total: number;
}

export interface ArtistItem {
	external_urls: ExternalUrls;
	followers: Followers;
	genres: string[];
	href: string;
	id: string;
	images: Image[];
	name: string;
	popularity: number;
	type: 'artist';
	uri: string;
}

export interface TracksQuery {
	href: string;
	items: TrackItem[];
	limit: number;
	next: string;
	offset: number;
	previous: null;
	total: number;
}

export interface TrackItem {
	album: AlbumItem;
	artists: ArtistItem[];
	available_markets: string[];
	discNumber: number;
	duration_ms: number;
	explicit: boolean;
	externalIDS: ExternalIDS;
	externalUrls: ExternalUrls;
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: null | string;
	track_number: number;
	type: 'track';
	uri: string;
}

// RESULTS
export interface SearchResult {
	albums: AlbumsQuery;
	artists: ArtistsQuery;
	tracks: TracksQuery;
}

export interface SavedAlbumsResult {
	href: string;
	limit: number;
	next: string;
	offset: number;
	previous: string;
	total: number;
	items: SavedAlbumsResultItem[];
}

export interface SavedAlbumsResultItem {
	addedAt: string;
	album: AlbumItem;
}

export interface UserTopTracksResult {
	items: TrackItem[];
	total: number;
	limit: number;
	offset: number;
	href: string;
	next: string;
	previous: null;
}

export interface UserTopArtistsResult {
	items: ArtistItem[];
	total: number;
	limit: number;
	offset: number;
	href: string;
	next: null;
	previous: null;
}

export interface SavedTracksResult {
	href: string;
	limit: number;
	next: string;
	offset: number;
	previous: string;
	total: number;
	items: SavedTracksResultItem[];
}

export interface SavedTracksResultItem {
	addedAt: string;
	track: TrackItem;
}

export interface UserProfileResult {
	country: string;
	display_name: string;
	email: string;
	explicit_content: ExplicitContent;
	external_urls: ExternalUrls;
	followers: Followers;
	href: string;
	id: string;
	images: Image[];
	product: string;
	type: string;
	uri: string;
}

export interface PlaybackStateResult {
	device: Device;
	shuffle_state: boolean;
	repeat_state: string;
	timestamp: number;
	context: Context;
	progress_ms: number;
	item?: TrackItem;
	currently_playing_type: string;
	actions: Actions;
	is_playing: boolean;
}
