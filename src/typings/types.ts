export interface Image {
	height?: number;
	width?: number;
	url: string;
}

export interface IUser {
	name: string;
	email: string;
	avatar: Image;
}

export interface IPlaylist {
	id: string;
	name: string;
	description: string;
	images: Image[];
	tracks: ITrack[];
	pinned: boolean;
	locked: boolean;
	service: StreamingService;

	// Streaming services related stuff
	collaborative?: boolean;
	public?: boolean;
	owner?: IUser;
	/** If the playlist is a spotify playlist the tracks can be requested via this url */
	tracksHref?: string;
}

export interface IArtist {
	name: string;
	images: Image[];
}

export interface IAlbum {
	name: string;
	artists: IArtist[];
	images: Image[];
	releaseDate: string;
	totalTracks: number;
}

export interface ITrack {
	id: number;
	/**
	 * Name of the track.
	 *
	 * Stores the file path if the track is a local audio file.
	 */
	name: string;
	/** Album the track belongs to. Contains information like images. */
	album?: IAlbum;
	artists?: IArtist[];
	/** Duration in ms.	*/
	duration?: number;
	/** The service the track comes from. local is an audio file. */
	service: StreamingService;
}

export interface IPlaybackState {
	track?: ITrack;
	isPlaying: boolean;
	isShuffle: boolean;
	repeatMode: RepeatMode;
	volume: number;
	progress: number;
}

export type RepeatMode = 'off' | 'on' | 'all';

export type StreamingService = 'local' | 'spotify';
