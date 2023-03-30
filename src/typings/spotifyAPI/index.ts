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