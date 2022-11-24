/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { selectQueue } from '../../../state/slices/playerSlice';
import { useAppSelector } from '../../hooks';
import AlbumCover from '../../../../assets/images/AlbumCover.png';

import './Queue.scss';

const Queue: React.FC = () => {
	const queue = useAppSelector(selectQueue);

	return (
		<div id="queue-container">
			<header>Up Next</header>
			<div id="queue">
				{queue &&
					queue.map((track, index) => {
						return (
							<div key={track.filePath + index} className="queue-track">
								<img src={AlbumCover} alt="" />
								<div className="queue-track-info">
									<div className="info queue-track-title">Title</div>
									<div className="info queue-track-artist">Artist</div>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default Queue;
