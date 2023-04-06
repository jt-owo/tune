/* eslint-disable no-bitwise */
// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid

import { ITrack } from '../../typings/types';

/**
 * Generates a new guid.
 * @returns Guid.
 */
export default function newGuid() {
	const S4 = () => {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}

export const loadTracksMetadata = async (tracks: ITrack[]) => {
	const loadedTracks = await Promise.all(
		tracks.map(async (track) => {
			const data = await window.api?.system.loadMetadata(JSON.stringify(track));
			return JSON.parse(data ?? '') as ITrack;
		})
	);

	return loadedTracks;
};

export const getNextID = (tracks: ITrack[]) => {
	const values = tracks.map((x) => x.id);
	return Math.max(...values) + 1;
};

export const getFilePath = (filePath: string) => {
	return `tune://file/${filePath}`;
};
