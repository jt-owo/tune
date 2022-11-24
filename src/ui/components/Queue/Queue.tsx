/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { selectQueue } from '../../../state/slices/playerSlice';
import { useAppSelector } from '../../hooks';

import './Queue.scss';
import QueueTrack from './QueueTrack/QueueTrack';

const Queue: React.FC = () => {
	const queue = useAppSelector(selectQueue);

	return (
		<div id="queue-container">
			<header>Up Next</header>
			<div id="queue">
				{queue &&
					queue.map((track, index) => {
						return <QueueTrack key={track.fileName + index} track={track} />;
					})}
			</div>
		</div>
	);
};

export default Queue;
