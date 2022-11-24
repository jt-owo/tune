export interface PlaylistData {
	id: string;
	name: string;
	tracks: TrackData[];
	pinned: boolean;
}

export interface TrackData {
	filePath: string;
	fileName: string;
	fileExt: string;
	sortIndex: number;
	metadata?: AudioMetadata;
}

export interface AudioMetadata {
	format?: AudioFormat;
	info?: AudioInfo;
}

export interface AudioInfo {
	track?: {
		no?: number;
		of?: number;
	};
	disk?: {
		no?: number;
		of?: number;
	};
	artists?: string[];
	artist: string;
	title: string;
	album?: string;
	year?: number;
	date?: string;
	copyright?: string;
	duration?: number;
	pictures?: AudioPicture[];
	cover?: string;
}

export interface AudioPicture {
	format: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}

export interface AudioFormat {
	container?: string;
	codec?: string;
	losless: boolean;
	numOfChannels?: number;
	sampleRate?: number;
	bitrate?: number;
}
