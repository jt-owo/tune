/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/prop-types */
import { FC, memo, MouseEvent, useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AudioMetadata, TrackData } from '../../../../typings/playlist';

import defaultAlbumCover from '../../../../../assets/images/tune_no_artwork.svg';

interface PlaylistTrackProps {
	id: number;
	track: TrackData;
	isDragging?: boolean;
	setCurrentTrack?: (track: TrackData) => void;
	onContextMenu: (event: MouseEvent<HTMLElement>) => void;
}

const PlaylistTrack: FC<PlaylistTrackProps> = memo((props) => {
	const { id, track, isDragging, onContextMenu } = props;

	const [metadata, setMetadata] = useState<AudioMetadata>();

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	useEffect(() => {
		const getMetadata = async () => {
			const metadataJSON = await window.api.system.readMetadata(track.filePath);
			setMetadata(JSON.parse(metadataJSON) as AudioMetadata);
		};

		getMetadata();
	}, [track.filePath]);

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

			if (seconds < 10) {
				return `${minutes}:0${seconds}`;
			}
			return `${minutes}:${seconds}`;
		}
		return NaN;
	};

	return (
		<div className={`song-item-container ${isDragging ? 'hide' : ''}`}>
			{metadata && (
				<div ref={setNodeRef} style={style} className="song-item" onContextMenu={onContextMenu} {...listeners} {...attributes}>
					<img src={getAlbumCover()} alt="" draggable={false} />
					<div>
						<div className="song-title">{metadata.info?.title}</div>
						<div className="song-artist">{metadata.info?.artist}</div>
					</div>
					<div className="song-duration">{getDuration()}</div>
				</div>
			)}
		</div>
	);
});

export default PlaylistTrack;
