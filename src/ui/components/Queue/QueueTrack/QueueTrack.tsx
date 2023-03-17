/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
import { FC, useEffect, useState } from 'react';
import { AudioMetadata, TrackData } from '../../../../typings/playlist';

import defaultAlbumCover from '../../../../../assets/images/tune_no_artwork.svg';
import deleteIcon from '../../../../../assets/ui-icons/trash-2.svg';

interface QueueTrackProps {
	track: TrackData;
	index: number;
	removeTrack: (id: number) => void;
	setCurrentTrack?: (track: TrackData) => void;
}

const QueueTrack: FC<QueueTrackProps> = (props) => {
	const { track, setCurrentTrack, removeTrack, index } = props;

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
					<div className="queue-track-overlay" />
					<button className="queue-track-remove" type="button" onClick={() => removeTrack(index)}>
						<img src={deleteIcon} alt="" />
					</button>
				</div>
			)}
		</>
	);
};

export default QueueTrack;
