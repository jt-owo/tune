interface Image {
	height?: number;
	width?: number;
	url: string;
}

interface IUser {
	name: string;
	avatar?: Image;
}

interface IPlaylist {
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

interface IArtist {
	name: string;
	images: Image[];
}

interface IAlbum {
	name: string;
	artists: IArtist[];
	images: Image[];
	releaseDate: string;
	totalTracks: number;
}

interface ITrack {
	/**
	 * Unique identifier of the track.
	 *
	 * Also used for sorting & drag and drop
	 */
	id: string;
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

type RepeatMode = 'off' | 'on' | 'all';

type StreamingService = 'local' | 'spotify';

type AlertType = 'info' | 'error' | 'warn' | 'success';

interface IAlert {
	id?: string;
	message: string;
	type: AlertType;
}

interface IFormattedTrack {
	/** Title of the track. */
	name: string;
	/** Artists of the track as a comma seperated list. */
	artists: string;
	/** Name of the track's album. */
	album: string;
	/**  Duration of the track in this format: MM:SS */
	duration: string;
	/** Image url of the track. */
	image: string;
	/**
	 * True if all track data is ready for display.
	 *
	 * Only neccessary for local audio files.
	 */
	isLoaded: boolean;
}

interface IQueueState {
	/** Current list of tracks in the queue. */
	tracks: ITrack[];
	/** Recently played tracks. */
	history: ITrack[];
	/**
	 * Current Track index.
	 *
	 * The index represents the current track from {@link tracks}.
	 * (e.g. if the index is 0 the first track of the array will be played)
	 */
	index: number;
}

interface IPlaybackState {
	/** The track that's currently playing. */
	track?: ITrack;
	/** Progress of the track in ms. */
	progress: number;
	/** Player sound volume */
	volume: number;
	isPlaying: boolean;
	isShuffle: boolean;
	repeatMode: RepeatMode;
	/** Selected Output Device, if undefined the default audio device will be used. */
	outputDeviceId: string;
}

interface TuneHTMLAudioElement extends HTMLAudioElement {
	/**
	 * Sets the output device of an audio element.
	 * @param deviceId ID of the output device.
	 */
	setSinkId(deviceId: string): void;
	/** Volume of the audio element. Must be value between `0.0` and `1.0`. */
	volume: number;
}
