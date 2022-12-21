import React from 'react';
import { AudioMetadata } from '../../../../typings/playlist';
import defaultAlbumCover from '../../../../../assets/images/tune_no_artwork.svg';

interface NowPlayingProps {
	metadata: AudioMetadata;
}

const NowPlaying: React.FC<NowPlayingProps> = (props) => {
	const { metadata } = props;

	const getAlbumCover = () => {
		if (metadata?.info?.cover) {
			return metadata.info.cover;
		}
		return defaultAlbumCover;
	};

	return (
		<div id="track-info">
			<div id="current-track">{metadata.info?.title}</div>
			<div id="current-artist">{metadata.info?.artist}</div>
		</div>
	);
};

export default NowPlaying;
