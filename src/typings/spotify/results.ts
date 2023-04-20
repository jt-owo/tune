import { AlbumItem, ArtistItem, TrackItem } from './items';
import { ExplicitContent, ExternalUrls, Followers, Device, Actions, Context } from './general';
import { Image, RepeatMode } from '../types';

// RESULTS
export interface SpotifyQueryResult<T> {
	href: string;
	limit: number;
	offset: number;
	total: number;
	next: string | null;
	previous: string | null;
	items: T[];
}

export interface SearchResult {
	albums: SpotifyQueryResult<AlbumItem>;
	artists: SpotifyQueryResult<ArtistItem>;
	tracks: SpotifyQueryResult<TrackItem>;
}

export interface SavedAlbumsResultItem {
	addedAt: string;
	album: AlbumItem;
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
	repeat_state: RepeatMode;
	timestamp: number;
	context: Context;
	progress_ms: number;
	item?: TrackItem;
	currently_playing_type: string;
	actions: Actions;
	is_playing: boolean;
}
