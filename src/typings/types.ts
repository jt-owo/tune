interface CoverImage {
	height: number;
	width: number;
	url: string;
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
	releaseDate: Date;
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
