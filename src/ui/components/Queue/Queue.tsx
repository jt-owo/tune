/* eslint-disable react/no-array-index-key */
import { FC } from 'react';
import { selectQueue, selectQueueIndex } from '../../../state/slices/playerSlice';
import { useAppSelector } from '../../hooks';

import './Queue.scss';
import QueueTrack from './QueueTrack/QueueTrack';

const Queue: FC = () => {
	const queue = useAppSelector(selectQueue);
	const queueIndex = useAppSelector(selectQueueIndex);

	return (
		<div id="queue-container">
			<header id="queue-title">Up Next</header>
			<div id="queue">
				{queue &&
					queue.length <= queueIndex + 1 &&
					queue.slice(queueIndex + 1, queue.length).map((track, index) => {
						return <QueueTrack key={track.fileName + index} track={track} />;
					})}
			</div>
		</div>
	);
};

export default Queue;
