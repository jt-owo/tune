class Services {
	/**
	 * Returns a object of booleans indicating what service is currently in use.
	 * @param service Service string. Usually from a Playlist or Track object.
	 */
	static checkServices = (service: string) => {
		const isLocal = service === 'local';
		const isSpotify = service === 'spotify';
		const isAppleMusic = service === 'apple';

		return { isLocal, isSpotify, isAppleMusic };
	};
}

export default Services;
