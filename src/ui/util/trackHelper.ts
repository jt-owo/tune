/* eslint-disable no-param-reassign */
class TrackHelper {
	/**
	 * Loads metadata for a list of tracks.
	 * @param tracks List of tracks.
	 * @returns A list of tracks with loaded metadata.
	 */
	static loadTracksMetadata = async (tracks: ITrack[]) => {
		const loadedTracks = await Promise.all(
			tracks.map(async (track) => {
				const data = await window.api?.system.loadMetadata(JSON.stringify(track));
				return JSON.parse(data ?? '') as ITrack;
			})
		);

		return loadedTracks;
	};

	/**
	 * TODO: implement.
	 * PROTOTYPE SHUFFLE!
	 * Shuffles an array of tracks.
	 * @param tracks Array of tracks.
	 * @returns Randomly shuffled array of tracks.
	 */
	static shuffle = (tracks: ITrack[]) => {
		const copy = [...tracks];

		// Shuffle array

		return copy;
	};
}

export default TrackHelper;
