/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect, useState } from 'react';
import { AudioMetadata, TrackData } from '../../../../typings/playlist';

import defaultAlbumCover from '../../../../../assets/images/tune_no_artwork.svg';

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

	const getAlbumCover = () => {
		if (metadata?.info?.cover) {
			return metadata.info.cover;
		}
		return defaultAlbumCover;
	};

	const getDuration = () => {
		if (metadata?.info?.duration) {
			const total = metadata.info.duration;
			const minutes = Math.floor(total / 60);
			const seconds = Math.floor(total - minutes * 60);

			return `${minutes}:${seconds}`;
		}
		return NaN;
	};

	return (
		<>
			{metadata && (
				<li className="song-item btn-hover-animation" onDoubleClick={() => setCurrentTrack(track)}>
					<img src={getAlbumCover()} alt="" draggable={false} />
					<div>
						<div className="song-title">{metadata?.info?.title}</div>
						<div className="song-artist">{metadata?.info?.artist}</div>
					</div>
					<div className="song-duration">{getDuration()}</div>
				</li>
			)}
		</>
	);
};

export default PlaylistTrack;
