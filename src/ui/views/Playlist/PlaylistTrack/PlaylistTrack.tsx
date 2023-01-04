/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/prop-types */
import { FC, MouseEvent, memo, useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { AudioMetadata, TrackData } from '../../../../typings/playlist';
import ItemTypes from '../../../../typings/dnd-types';

import defaultAlbumCover from '../../../../../assets/images/tune_no_artwork.svg';

interface PlaylistTrackProps {
	id: string;
	track: TrackData;
	setCurrentTrack?: (track: TrackData) => void;
	moveTrack: (id: string, to: number) => void;
	findTrack: (id: string) => { index: number };
	onContextMenu: (event: MouseEvent<HTMLElement>) => void;
}

interface Item {
	id: string;
	originalIndex: number;
}

const PlaylistTrack: FC<PlaylistTrackProps> = memo((props) => {
	const { id, track, moveTrack, findTrack, onContextMenu } = props;

	const originalIndex = findTrack(id).index;
	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: ItemTypes.TRACK,
			item: { id, originalIndex },
			collect: (monitor) => ({
				isDragging: monitor.isDragging()
			}),
			end: (item, monitor) => {
				const { id: droppedId, originalIndex } = item;
				const didDrop = monitor.didDrop();
				if (!didDrop) {
					moveTrack(droppedId, originalIndex);
				}
			}
		}),
		[id, originalIndex, moveTrack]
	);

	const [, drop] = useDrop(
		() => ({
			accept: ItemTypes.TRACK,
			hover({ id: draggedId }: Item) {
				if (draggedId !== id) {
					const { index: overIndex } = findTrack(id);
					moveTrack(draggedId, overIndex);
				}
			}
		}),
		[findTrack, moveTrack]
	);

	const [metadata, setMetadata] = useState<AudioMetadata>();

	useEffect(() => {
		const getMetadata = async () => {
			const metadataJSON = await window.ipc.system.readMetadata(track.filePath);
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

	const opacity = isDragging ? 0 : 1;
	return (
		<>
			{metadata && (
				<li ref={(node) => drag(drop(node))} style={{ opacity }} className="song-item btn-hover-animation" onContextMenu={onContextMenu}>
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
});

export default PlaylistTrack;
