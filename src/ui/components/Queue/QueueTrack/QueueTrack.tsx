import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ITrack } from '../../../../typings/types';
import Format from '../../../util/format';

import deleteIcon from '../../../../../assets/ui-icons/trash-2.svg';

import queueStyle from '../Queue.module.scss';

interface QueueTrackProps {
	index: number;
	id: number;
	track: ITrack;
	isDragging?: boolean;
	removeTrack?: (id: number) => void;
}

const QueueTrack = ({ id, track, removeTrack, index, isDragging }: QueueTrackProps): JSX.Element => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
	const { name, artists, image, isLoaded } = Format.getTrackFormatted(track);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<div className={`${queueStyle['queue-track-container']} ${isDragging ? queueStyle.hide : ''}`}>
			{isLoaded && (
				<div ref={setNodeRef} style={style} className={queueStyle['queue-track']} {...listeners} {...attributes}>
					<img src={image} alt="" />
					<div className={queueStyle['queue-track-info']}>
						<div className={`${queueStyle.info} ${queueStyle['queue-track-title']}`}>{name}</div>
						<div className={`${queueStyle.info} ${queueStyle['queue-track-artist']}`}>{artists}</div>
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
		</div>
	);
};

export default QueueTrack;
