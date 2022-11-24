/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';
import { AudioMetadata, TrackData } from '../../../../typings/playlist';

interface QueueTrackProps {
	track: TrackData;
	setCurrentTrack?: (track: TrackData) => void;
}

const QueueTrack: React.FC<QueueTrackProps> = (props) => {
	const { track } = props;

	const [metadata, setMetadata] = useState<AudioMetadata>();

	const getMetadata = async () => {
		const metadataJSON = await window.electron.ipc.parser.getMetadata(track.filePath);
		setMetadata(JSON.parse(metadataJSON) as AudioMetadata);
	};

	useEffect(() => {
		getMetadata();
	});

	return (
		<>
			{metadata && (
				<div className="queue-track">
					<img src={metadata.info?.cover} alt="" />
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
