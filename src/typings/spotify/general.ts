export interface ExternalUrls {
	spotify: string;
}

export interface ExternalIDS {
	isrc: string;
}

export interface Followers {
	href: null;
	total: number;
}

export interface ExplicitContent {
	filter_enabled: boolean;
	filter_locked: boolean;
}

export interface Actions {
	disallows: Disallows;
}

export interface Disallows {
	resuming: boolean;
	skipping_prev: boolean;
}

export interface Context {
	external_urls: ExternalUrls;
	href: string;
	type: string;
	uri: string;
}

export interface Device {
	id: string;
	is_active: boolean;
	is_private_session: boolean;
	is_restricted: boolean;
	name: string;
	type: string;
	volume_percent: number;
}

export interface Owner {
	display_name: string;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	type: string;
	uri: string;
}

export interface PlaylistTracks {
	href: string;
	total: number;
}

export type AlbumType = 'single' | 'album';

export type ReleaseDatePrecision = 'day' | 'year';
