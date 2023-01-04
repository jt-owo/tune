/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
import { FC, useEffect, useState } from 'react';
import { AudioMetadata, TrackData } from '../../../../typings/playlist';

import defaultAlbumCover from '../../../../../assets/images/tune_no_artwork.svg';

interface QueueTrackProps {
	track: TrackData;
	setCurrentTrack?: (track: TrackData) => void;
}

const QueueTrack: FC<QueueTrackProps> = (props) => {
	const { track, setCurrentTrack } = props;

	const [metadata, setMetadata] = useState<AudioMetadata>();

	const getMetadata = async () => {
		const metadataJSON = await window.api.system.readMetadata(track.filePath);
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
				<div className="queue-track">
					<img src={getAlbumCover()} alt="" />
					<div className="queue-track-info">
						<div className="info queue-track-title">{metadata.info?.title}</div>
						<div className="info queue-track-artist">{metadata.info?.artist}</div>
					</div>
				</div>
			)}
		</>
	);
};

export default QueueTrack;
