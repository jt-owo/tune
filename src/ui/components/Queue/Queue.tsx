/* eslint-disable react/no-array-index-key */
import { FC } from 'react';
import { selectQueue, selectQueueIndex, updateQueue } from '../../../state/slices/playerSlice';
import { TrackData } from '../../../typings/playlist';
import { useAppSelector, useAppDispatch } from '../../hooks';

import QueueTrack from './QueueTrack/QueueTrack';

import './Queue.scss';

const Queue: FC = () => {
	const queue = useAppSelector(selectQueue);
	const queueIndex = useAppSelector(selectQueueIndex);
	const dispatch = useAppDispatch();

	const handleTrackRemove = (index: number) => {
		const updateData: TrackData[] = [...queue];
		updateData.splice(index + 1, 1);
		dispatch(updateQueue(updateData));
	};

	return (
		<div id="queue-container">
			<header id="queue-title">Up Next</header>
			<div id="queue">
				{queue &&
					queue.slice(queueIndex + 1, queue.length).map((track, index) => {
						return <QueueTrack key={track.fileName + index} track={track} index={index} removeTrack={handleTrackRemove} />;
					})}
			</div>
		</div>
	);
};

export default Queue;
