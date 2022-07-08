export interface IPlaylist {
	id: string;
	name: string;
	tracks: ITrack[];
	pinned: boolean;
}

export interface ITrack {
	filePath: string;
	fileName: string;
	fileExt: string;
	sortIndex: number;
}
