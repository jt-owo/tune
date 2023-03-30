interface CoverImage {
	height: number;
	width: number;
	url: string;
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
	number: number;
	name: string;
	album?: IAlbum; // FIXME: add album parser
	artists: IArtist[];
	duration: number; // Duration in ms
}
