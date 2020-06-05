export interface SongObject {
    ID: number;
    title?: string;
    artist?: string;
    album?: string;
    genre?: string;
    year?: number;
    artwork?: string;
    duration?: number;
    src?: string;
}

export enum ListType {
    PLAYLIST,
    QUEUE,
    HISTORY,
}
