/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC, useEffect, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { updateQueue, setQueue } from '../../../state/slices/playerSlice';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { loadTracksMetadata } from '../../util';
import { ITrack } from '../../../typings/types';

import QueueTrack from './QueueTrack/QueueTrack';

import style from './Queue.module.scss';

const Queue: FC = () => {
	const queue = useAppSelector((state) => state.player.queue);
	const queueIndex = useAppSelector((state) => state.player.queueIndex);
	const dispatch = useAppDispatch();

	const [tracks, setTracks] = useState<ITrack[]>([]);
	const [isDraggingId, setIsDraggingId] = useState<UniqueIdentifier>();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 10
			}
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		setIsDraggingId(active.id);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		setIsDraggingId(undefined);
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = tracks.indexOf(tracks.find((x) => x.id === active.id)!);
			const newIndex = tracks.indexOf(tracks.find((x) => x.id === over.id)!);
			const newArray = arrayMove(tracks, oldIndex, newIndex);

			// FIXME: Queue drag and drop sets queue index to zero.
			setTracks(newArray);
			dispatch(setQueue(newArray));
		}
	};

	const handleTrackRemove = (index: number) => {
		const updateData: ITrack[] = [...queue];
		updateData.splice(index + 1, 1);
		dispatch(updateQueue(updateData));
	};

	useEffect(() => {
		const loadLocalTracks = async (tracks: ITrack[]) => {
			const tracksLoaded = await loadTracksMetadata(tracks);
			setTracks(tracksLoaded);
		};

		if (queue.length > 0) {
			loadLocalTracks(queue);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queue]);

	return (
		<div className={style['queue-container']}>
			<header className={style['queue-title']}>Up Next</header>
			<div className={style.queue}>
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
					<SortableContext items={queue} strategy={verticalListSortingStrategy}>
						{tracks && tracks.slice(queueIndex + 1, tracks.length).map((track, index) => (isDraggingId !== track.id ? <QueueTrack key={track.id} id={track.id} track={track} index={index} removeTrack={handleTrackRemove} /> : <QueueTrack key={track.id} id={track.id} track={track} index={index} isDragging />))}
					</SortableContext>
					<DragOverlay modifiers={[restrictToWindowEdges]}>{isDraggingId ? <QueueTrack index={-1} id={tracks.findIndex((x) => x.id === isDraggingId)} track={tracks[tracks.findIndex((x) => x.id === isDraggingId)]} /> : null}</DragOverlay>
				</DndContext>
			</div>
		</div>
	);
};

export default Queue;
