import { useEffect, useState } from 'react';
import { ITrack } from '../../typings/types';
import { getServices } from '../util/serviceHelper';
import { getAlbumCover, getArtists, getDuration } from '../util/formatHelper';

const useTrack = (props: ITrack) => {
	const [track, setTrack] = useState(props);
	const [isLoaded, setLoaded] = useState(false);

	const { isLocal, isSpotify, isAppleMusic } = getServices(track.service);

	useEffect(() => {
		if (!isLoaded && isLocal) {
			const loadMetadata = async () => {
				const metadataJSON = await window.api.system.loadMetadata(JSON.stringify(track));
				setTrack(JSON.parse(metadataJSON) as ITrack);
				setLoaded(true);
			};

			loadMetadata();
		} else if (isSpotify || isAppleMusic) {
			setLoaded(true);
		}
	}, [isAppleMusic, isLoaded, isLocal, isSpotify, track]);

	return {
		name: track.name,
		artists: getArtists(track.album?.artists),
		duration: getDuration(track.duration),
		image: getAlbumCover(track.album?.images),
		isLoaded
	};
};

export default useTrack;
