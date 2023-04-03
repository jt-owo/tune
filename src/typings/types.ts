export interface Image {
	height?: number;
	width?: number;
	url: string;
}

export interface PlaylistData {
	id: string;
	name: string;
	tracks: ITrack[];
	pinned: boolean;
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
	pinned: boolean;
	locked: boolean;
	service: 'local' | 'spotify';

	// Streaming services related stuff
	collaborative: boolean;
	public: boolean;
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
	 * Stores the is the file path if the track is a local audio file.
	 */
	name: string;
	/** Album the track belongs to. Contains information like images. */
	album?: IAlbum;
	artists?: IArtist[];
	/** Duration in ms.	*/
	duration?: number;
	/** If the track is a local audio file. */
	isLocal: boolean;
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
