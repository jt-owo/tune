interface CoverImage {
	height: number;
	width: number;
	url: string;
}

export interface IUser {
	name: string;
	email: string;
	avatar: CoverImage;
}

export interface PlaylistData {
	id: string;
	name: string;
	tracks: ITrack[];
	pinned: boolean;
}

export interface IArtist {
	name: string;
	images: CoverImage[];
}

export interface IAlbum {
	name: string;
	artists: IArtist[];
	images: CoverImage[];
	releaseDate: string;
	totalTracks: number;
	type: 'album';
}

export interface ITrack {
	id: number;
	/**
	 * Name is the file path if isLocal is true.
	 */
	name: string;
	album?: IAlbum;
	artists?: IArtist[];
	/**
	 * Duration in ms.
	 */
	duration?: number;
	isLocal: boolean;
}

export interface IPlaybackState {
	track?: ITrack;
	isPlaying: boolean;
	isShuffle: boolean;
	isRepeat: boolean;
	volume: number;
	progress: number;
}

export type RepeatMode = 'off' | 'on' | 'all';
