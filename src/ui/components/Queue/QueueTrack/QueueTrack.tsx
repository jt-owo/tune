/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
import { FC, useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ITrack } from '../../../../typings/types';
import { AudioMetadata } from '../../../../typings/metadata';
import defaultAlbumCover from '../../../../../assets/images/tune_no_artwork.svg';
import deleteIcon from '../../../../../assets/ui-icons/trash-2.svg';

import queueStyle from '../Queue.module.scss';

interface QueueTrackProps {
	id: number;
	track: ITrack;
	index: number;
	isDragging?: boolean;
	removeTrack?: (id: number) => void;
}

const QueueTrack: FC<QueueTrackProps> = (props) => {
	const { id, track, removeTrack, index, isDragging } = props;

	const [metadata, setMetadata] = useState<AudioMetadata>();

	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	useEffect(() => {
		if (track.isLocal) {
			const getMetadata = async () => {
				const metadataJSON = await window.api.system.readMetadata(track.name);
				setMetadata(JSON.parse(metadataJSON) as AudioMetadata);
			};
			getMetadata();
		}
	}, [track.isLocal, track.name]);

	const getAlbumCover = () => {
		if (metadata?.info?.cover) {
			return metadata.info.cover;
		}
		return defaultAlbumCover;
	};

	return (
		<>
			{metadata && (
				<div ref={setNodeRef} style={style} className={queueStyle['queue-track']} {...listeners} {...attributes}>
					<img src={getAlbumCover()} alt="" />
					<div className={queueStyle['queue-track-info']}>
						<div className={`${queueStyle.info} ${queueStyle['queue-track-title']}`}>{metadata.info?.title}</div>
						<div className={`${queueStyle.info} ${queueStyle['queue-track-artist']}`}>{metadata.info?.artist}</div>
					</div>
					{removeTrack && (
						<>
							<div className={queueStyle['queue-track-overlay']} />
							<button className={queueStyle['queue-track-remove']} type="button" onClick={() => removeTrack(index)}>
								<img src={deleteIcon} alt="" />
							</button>
						</>
					)}
				</div>
			)}
		</>
	);
};

export default QueueTrack;
