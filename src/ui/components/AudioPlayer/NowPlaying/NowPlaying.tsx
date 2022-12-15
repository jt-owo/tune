/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect, useState } from 'react';
import { AudioMetadata, TrackData } from '../../../../typings/playlist';
import defaultAlbumCover from '../../../../../assets/images/tune_no_artwork.svg';

interface NowPlayingProps {
	track?: TrackData;
}

const NowPlaying: React.FC<NowPlayingProps> = (props) => {
	const { track } = props;

	const [metadata, setMetadata] = useState<AudioMetadata>();

	const getMetadata = async () => {
		if (!track) return;
		const metadataJSON = await window.ipc.system.readMetadata(track.filePath);
		setMetadata(JSON.parse(metadataJSON) as AudioMetadata);
	};

	useEffect(() => {
		getMetadata();
	});

	const getAlbumCover = () => {
		if (metadata?.info?.cover) {
			return metadata.info.cover;
		}
		return defaultAlbumCover;
	};

	return (
		<>
			{metadata && (
				<div id="track-info">
					<div id="current-track">{metadata.info?.title}</div>
					<div id="current-artist">{metadata.info?.artist}</div>
				</div>
			)}
		</>
	);
};

export default NowPlaying;
