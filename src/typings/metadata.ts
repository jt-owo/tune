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
	data: string;
}

export interface AudioFormat {
	container?: string;
	codec?: string;
	lossless: boolean;
	numOfChannels?: number;
	sampleRate?: number;
	bitrate?: number;
}
