/* eslint-disable react/prop-types */
import update from 'immutability-helper';
import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';
import { TrackData } from '../../../typings/playlist';
import PlaylistTrack from '../../views/Playlist/PlaylistTrack/PlaylistTrack';

import ItemTypes from './ItemTypes';

interface ContainerProps {
	tracks: TrackData[];
}

export const SortableListContainer: FC<ContainerProps> = memo(function Container(props) {
	const [tracks, setTracks] = useState(props.tracks);

	const findTrack = useCallback(
		(id: string) => {
			const card = tracks.filter((c) => `${c.id}` === id)[0] as TrackData;
			return {
				card,
				index: tracks.indexOf(card)
			};
		},
		[tracks]
	);

	const moveTrack = useCallback(
		(id: string, atIndex: number) => {
			const { card, index } = findTrack(id);
			setTracks(
				update(tracks, {
					$splice: [
						[index, 1],
						[atIndex, 0, card]
					]
				})
			);
		},
		[findTrack, tracks, setTracks]
	);

	const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }));
	return (
		<div ref={drop}>
			<ul>
				{tracks.map((card) => (
					<PlaylistTrack key={card.id} id={`${card.id}`} track={card} moveTrack={moveTrack} findTrack={findTrack} />
				))}
			</ul>
		</div>
	);
});

export default SortableListContainer;
