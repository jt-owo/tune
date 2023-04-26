/* eslint-disable @typescript-eslint/no-non-null-assertion */
import defaultAlbumCover from '../../../assets/images/tune_no_artwork.svg';
import { IArtist, IFormattedTrack, ITrack, Image } from '../../typings/types';

class Format {
	/**
	 * Gets the first image available.
	 * @param images Array of images.
	 * @returns The first available image or the default album cover if none was found.
	 */
	static getImage = (images?: Image[]): string => {
		if (!images || images.length < 1) return defaultAlbumCover;

		return images[0].url;
	};

	/**
	 * Formats duration data for display.
	 * @param duration Duration of the track in seconds.
	 * @param long If the song should be returned as a long form string like 'xx minutes, xx seconds'.
	 * @returns A string in this format: MM:SS
	 */
	static getDuration = (duration?: number, long?: boolean): string => {
		if (duration) {
			if (!long) {
				const minutes = Math.floor(duration / 60);
				const seconds = Math.floor(duration - minutes * 60);

				if (seconds < 10) {
					return `${minutes}:0${seconds}`;
				}
				return `${minutes}:${seconds}`;
			}
			const hours = Math.floor(duration / 3600);
			const minutes = Math.floor((duration - hours * 3600) / 60);
			const seconds = Math.floor(duration - hours * 3600 - minutes * 60);

			if (hours === 0) return `${minutes} minutes${seconds ? `, ${seconds} seconds` : ''}`;
			if (minutes === 0) return `${seconds} seconds`;
			return `${hours} hours, ${minutes} minutes${seconds ? `, ${seconds} seconds` : ''}`;
		}
		return NaN.toString();
	};

	/**
	 * Formats artist data for display.
	 * @param artists Array of artists.
	 * @returns A comma seperated string with all artists.
	 */
	static getArtists = (artists?: IArtist[]): string => {
		let artistsStr = '';
		if (artists) {
			artists.forEach((artist) => {
				if (artistsStr === '') artistsStr += artist.name;
				else artistsStr += `, ${artist.name}`;
			});
		}

		return artistsStr;
	};

	/**
	 * Formats the track data for display.
	 * @param track Track object.
	 * @returns Formatted track object.
	 */
	static getTrackFormatted = (track: ITrack): IFormattedTrack => {
		return {
			name: track.name!,
			artists: Format.getArtists(track.album?.artists),
			album: track.album?.name ?? '',
			duration: Format.getDuration(track.duration),
			image: Format.getImage(track.album?.images),
			isLoaded: track.album !== undefined
		};
	};

	/**
	 * Formats a file path to the tune protocol.
	 * @param filePath File path.
	 * @returns File path with tune protocol.
	 */
	static getFilePath = (filePath: string) => {
		return `tune://file/${filePath}`;
	};
}

export default Format;
