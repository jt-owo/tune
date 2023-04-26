import fs from 'fs';
import * as mm from 'music-metadata';
import Json from '../../util/jsonHelper';
import { AudioMetadata } from '../../typings/metadata';

export default class FileParser {
	/**
	 * @deprecated Please use {@link loadMetadata}
	 *
	 * Parses a {@link mm.IAudioMetadata} object into a more compact {@link AudioMetadata} object.
	 * @param rawMetadata Raw AudioMetadata.
	 */
	private static parseMetadata(rawMetadata: mm.IAudioMetadata): AudioMetadata {
		const metadata: AudioMetadata = {};
		metadata.format = { lossless: false };
		metadata.info = { artist: '', title: '' };
		metadata.info.track = {};

		const cover = mm.selectCover(rawMetadata.common.picture);
		if (cover === null) {
			metadata.info.cover = undefined;
		} else {
			metadata.info.cover = `data:${cover?.format};base64,${cover?.data.toString('base64')}`;
		}

		if (rawMetadata.common.artist) {
			metadata.info.artist = rawMetadata.common.artist;
		} else if (rawMetadata.common.artistsort) {
			metadata.info.artist = rawMetadata.common.artistsort;
		} else {
			metadata.info.artist = '(unknown)';
		}

		if (rawMetadata.common.title) {
			metadata.info.title = rawMetadata.common.title;
		} else if (rawMetadata.common.titlesort) {
			metadata.info.title = rawMetadata.common.titlesort;
		} else {
			metadata.info.title = '(unknown)';
		}

		if (rawMetadata.common.album) {
			metadata.info.album = rawMetadata.common.album;
		} else if (rawMetadata.common.albumsort) {
			metadata.info.album = rawMetadata.common.albumsort;
		} else {
			metadata.info.album = '(unknown)';
		}

		metadata.info = {
			...metadata.info,
			duration: rawMetadata.format.duration,
			year: rawMetadata.common.year,
			date: rawMetadata.common.date,
			copyright: rawMetadata.common.copyright
		};

		metadata.format = {
			container: rawMetadata.format.container,
			sampleRate: rawMetadata.format.sampleRate,
			codec: rawMetadata.format.codec,
			numOfChannels: rawMetadata.format.numberOfChannels,
			bitrate: rawMetadata.format.bitrate,
			lossless: rawMetadata.format.lossless ? rawMetadata.format.lossless : false
		};

		return metadata;
	}

	/**
	 * Retrieves an ITrack object as a JSON string and returns an ITrack JSON string with loaded metadata.
	 * @param trackJSON ITrack object as a JSON string.
	 * @returns ITrack JSON string with loaded metadata.
	 */
	public static async loadMetadata(trackJSON: string): Promise<string> {
		let track: ITrack;
		if (Json.validate<ITrack>(trackJSON)) track = JSON.parse(trackJSON);
		else return '';

		let metadata: mm.IAudioMetadata | undefined;
		if (track.filePath && fs.existsSync(track.filePath)) metadata = await mm.parseFile(track.filePath);
		if (!metadata) return '';

		const ret: ITrack = {
			...track,
			album: {
				name: 'No metdata',
				artists: [],
				images: [],
				releaseDate: '',
				totalTracks: 0
			}
		};

		const cover = mm.selectCover(metadata.common.picture);
		if (cover !== null) {
			ret.album?.images.push({
				url: `data:${cover?.format};base64,${cover?.data.toString('base64')}`
			});
		}

		if (metadata.common.artist) {
			ret.album?.artists.push({
				name: metadata.common.artist,
				images: []
			});
		}

		if (metadata.common.title) {
			ret.name = metadata.common.title;
		}

		if (ret.album && metadata.common.album) {
			ret.album.name = metadata.common.album;
		}

		if (metadata.format.duration) {
			ret.duration = metadata.format.duration;
		}

		if (ret.album && metadata.common.date) {
			ret.album.releaseDate = metadata.common.date;
		}

		return JSON.stringify(ret);
	}
}
