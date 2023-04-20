/* eslint-disable @typescript-eslint/no-non-null-assertion */
import defaultAlbumCover from '../../../assets/images/tune_no_artwork.svg';
import { IArtist, IFormattedTrack, ITrack, Image } from '../../typings/types';

/**
 * Returns the image url or the default album cover if there are no images.
 * @param images Image array
 */
export const getImageUrl = (images?: Image[]) => {
	if (!images || images.length < 1) return defaultAlbumCover;

	return images[0].url;
};

const getDuration = (duration?: number) => {
	if (duration) {
		const minutes = Math.floor(duration / 60);
		const seconds = Math.floor(duration - minutes * 60);

		if (seconds < 10) {
			return `${minutes}:0${seconds}`;
		}
		return `${minutes}:${seconds}`;
	}
	return NaN.toString();
};

const getArtists = (artists?: IArtist[]) => {
	let artistsStr = '';
	if (artists) {
		artists.forEach((artist) => {
			if (artistsStr === '') artistsStr += artist.name;
			else artistsStr += `, ${artist.name}`;
		});
	}

	return artistsStr;
};

export const getTrackFormatted = (track: ITrack): IFormattedTrack => {
	return {
		name: track.name!,
		artists: getArtists(track.album?.artists),
		duration: getDuration(track.duration),
		image: getImageUrl(track.album?.images),
		isLoaded: track.album !== undefined
	};
};
