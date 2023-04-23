export interface Image {
	height?: number;
	width?: number;
	url: string;
}

export interface IUser {
	name: string;
	avatar?: Image;
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
	/**
	 * Unique identifier of the track.
	 *
	 * Also used for sorting & drag and drop
	 */
	id: number;
	/**
	 * Name of the track.
	 */
	name?: string;
	/**
	 * File path of the track.
	 */
	filePath?: string;
	/**
	 * Album the track belongs to. Contains information like images.
	 *
	 * This property is also used to determine if a track is loaded and ready to display.
	 */
	album?: IAlbum;
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

export type AlertType = 'info' | 'error' | 'warn' | 'success';

export interface IAlert {
	id?: string;
	message: string;
	type: AlertType;
}

export interface IFormattedTrack {
	/**
	 * Title of the track.
	 */
	name: string;
	/**
	 * Artists of the track as a comma seperated list.
	 */
	artists: string;
	/**
	 * Duration of the track in this format: MM:SS
	 */
	duration: string;
	/**
	 * Image url of the track.
	 */
	image: string;
	/**
	 * True if all track is ready for display.
	 *
	 * Only neccessary for local audio files.
	 */
	isLoaded: boolean;
}
