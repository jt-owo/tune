import defaultAlbumCover from '../../../assets/images/tune_no_artwork.svg';
import { IArtist } from '../../typings/types';

export const getAlbumCover = (url?: string) => {
	if (url) return url;
	return defaultAlbumCover;
};

export const getDuration = (duration?: number) => {
	if (duration) {
		const minutes = Math.floor(duration / 60);
		const seconds = Math.floor(duration - minutes * 60);

		if (seconds < 10) {
			return `${minutes}:0${seconds}`;
		}
		return `${minutes}:${seconds}`;
	}
	return NaN;
};

export const getArtists = (artists?: IArtist[]) => {
	let artistsStr = '';
	if (artists) {
		artists.forEach((artist) => {
			if (artistsStr === '') artistsStr += artist.name;
			else artistsStr += `, ${artist.name}`;
		});
	}

	return artistsStr;
};
