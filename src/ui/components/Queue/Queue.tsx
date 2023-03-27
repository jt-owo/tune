/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/no-array-index-key */
import { FC, useEffect, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { selectQueue, selectQueueIndex, updateQueue } from '../../../state/slices/playerSlice';
import { TrackData } from '../../../typings/playlist';
import { useAppSelector, useAppDispatch } from '../../hooks';

import QueueTrack from './QueueTrack/QueueTrack';

import style from './Queue.module.scss';

const Queue: FC = () => {
	const queue = useAppSelector(selectQueue);
	const queueIndex = useAppSelector(selectQueueIndex);
	const dispatch = useAppDispatch();

	const [tracks, setTracks] = useState<TrackData[]>([]);
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

			setTracks(newArray);
			dispatch(updateQueue(newArray));
		}
	};

	const handleTrackRemove = (index: number) => {
		const updateData: TrackData[] = [...queue];
		updateData.splice(index + 1, 1);
		dispatch(updateQueue(updateData));
	};

	useEffect(() => {
		if (queue.length > 0) {
			setTracks(queue);
		}
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
