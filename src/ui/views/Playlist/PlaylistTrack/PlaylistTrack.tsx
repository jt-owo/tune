/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';
import { AudioMetadata, TrackData } from '../../../../typings/playlist';

interface PlaylistTrackProps {
	track: TrackData;
	setCurrentTrack: (track: TrackData) => void;
}

const PlaylistTrack: React.FC<PlaylistTrackProps> = (props) => {
	const { track, setCurrentTrack } = props;

	const [metadata, setMetadata] = useState<AudioMetadata>();

	const getMetadata = async () => {
		const metadataJSON = await window.ipc.system.readMetadata(track.filePath);
		setMetadata(JSON.parse(metadataJSON) as AudioMetadata);
	};

	useEffect(() => {
		getMetadata();
	});

	return (
		<>
			{metadata && (
				<li className="song-item btn-hover-animation" onDoubleClick={() => setCurrentTrack(track)}>
					<img src={metadata.info?.cover} alt="" />
					<div className="song-title">
						{metadata?.info?.title} - {metadata?.info?.artist}
					</div>
				</li>
			)}
		</>
	);
};

export default PlaylistTrack;
