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
}

export default TrackHelper;
