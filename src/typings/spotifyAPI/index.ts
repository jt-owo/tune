export interface SearchResult {
	albums: Albums;
	artists: Artists;
	tracks: Tracks;
}

export interface Albums {
	href: string;
	items: AlbumElement[];
	limit: number;
	next: string;
	offset: number;
	previous: null;
	total: number;
}

export interface AlbumElement {
	albumGroup: AlbumGroup;
	albumType: AlbumGroup;
	artists: Artist[];
	availableMarkets: string[];
	externalUrls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	isPlayable: boolean;
	name: string;
	releaseDate: string;
	releaseDatePrecision: ReleaseDatePrecision;
	totalTracks: number;
	type: AlbumGroup;
	uri: string;
}

export type AlbumGroup = 'single' | 'album';

export interface Artist {
	externalUrls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: ArtistType;
	uri: string;
	images: Image[];
}

export interface ExternalUrls {
	spotify: string;
}

export type ArtistType = 'artist';

export interface Image {
	height: number;
	url: string;
	width: number;
}

export type ReleaseDatePrecision = 'day' | 'year';

export interface Artists {
	href: string;
	items: ArtistsItem[];
	limit: number;
	next: string;
	offset: number;
	previous: null;
	total: number;
}

export interface ArtistsItem {
	externalUrls: ExternalUrls;
	followers: Followers;
	genres: string[];
	href: string;
	id: string;
	images: Image[];
	name: string;
	popularity: number;
	type: ArtistType;
	uri: string;
}

export interface Followers {
	href: null;
	total: number;
}

export interface Tracks {
	href: string;
	items: TracksItem[];
	limit: number;
	next: string;
	offset: number;
	previous: null;
	total: number;
}

export interface TracksItem {
	album: AlbumElement;
	artists: Artist[];
	availableMarkets: string[];
	discNumber: number;
	durationMS: number;
	explicit: boolean;
	externalIDS: ExternalIDS;
	externalUrls: ExternalUrls;
	href: string;
	id: string;
	isLocal: boolean;
	name: string;
	popularity: number;
	previewURL: null | string;
	trackNumber: number;
	type: PurpleType;
	uri: string;
}

export interface ExternalIDS {
	isrc: string;
}

export type PurpleType = 'track';
