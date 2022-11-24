/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';
import { AudioMetadata, TrackData } from '../../../../typings/playlist';

import AlbumCover from '../../../../../assets/images/AlbumCover.png';

interface PlaylistTrackProps {
	track: TrackData;
	setCurrentTrack: (track: TrackData) => void;
}

const PlaylistTrack: React.FC<PlaylistTrackProps> = (props) => {
	const { track, setCurrentTrack } = props;

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
				<li className="song-item btn-hover-animation" onDoubleClick={() => setCurrentTrack(track)}>
					<img src={AlbumCover} alt="" />
					<div className="song-title">
						{metadata?.info?.title} - {metadata?.info?.artist}
					</div>
				</li>
			)}
		</>
	);
};

export default PlaylistTrack;
