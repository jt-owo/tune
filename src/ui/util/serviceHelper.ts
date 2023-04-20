/* eslint-disable import/prefer-default-export */
export const getServices = (service: string) => {
	const isLocal = service === 'local';
	const isSpotify = service === 'spotify';
	const isAppleMusic = service === 'apple';

	return { isLocal, isSpotify, isAppleMusic };
};
