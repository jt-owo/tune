import { AlbumType, ExternalUrls, ReleaseDatePrecision, Followers, ExternalIDS, Owner, PlaylistTracks } from './general';
import { Image } from '../types';

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

export interface PlaylistItem {
	collaborative: boolean;
	description: string;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	name: string;
	owner: Owner;
	primary_color: null;
	public: boolean;
	snapshot_id: string;
	tracks: PlaylistTracks;
	type: string;
	uri: string;
}

export interface PlaylistTrackItem {
	added_at: Date;
	track: TrackItem;
}
