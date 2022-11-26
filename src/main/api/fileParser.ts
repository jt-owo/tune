import * as mm from 'music-metadata';
import { AudioMetadata } from '../../typings/playlist';

export default class FileParser {
	/**
	 * Parses a {@link mm.IAudioMetadata} object into a more compact {@link AudioMetadata} object.
	 * @param rawMetadata Raw AudioMetadata.
	 */
	public static parseMM(rawMetadata: mm.IAudioMetadata): AudioMetadata {
		const metadata: AudioMetadata = {};
		metadata.format = { losless: false };
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
			losless: rawMetadata.format.lossless ? rawMetadata.format.lossless : false
		};

		return metadata;
	}

	public static async getMetadata(file: string): Promise<string> {
		const fileMetadata = await mm.parseFile(file);
		const parsedMetadata = FileParser.parseMM(fileMetadata);

		return JSON.stringify(parsedMetadata);
	}
}
