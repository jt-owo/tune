/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { updateQueue } from '../../../state/slices/playerSlice';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { ITrack } from '../../../typings/types';

import QueueTrack from './QueueTrack/QueueTrack';

import trashIcon from '../../../../assets/ui-icons/trash-2.svg';

import styles from './Queue.module.scss';

const Queue = (): JSX.Element => {
	const queue = useAppSelector((state) => state.player.queue);
	const queueIndex = useAppSelector((state) => state.player.index);
	const dispatch = useAppDispatch();

	const [tracks, setTracks] = useState<ITrack[]>([]);
	const [isDraggingId, setIsDraggingId] = useState<UniqueIdentifier>();

	const clearBtnRef = useRef<HTMLButtonElement>(null);

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
		const updateData = [...queue];
		updateData.splice(index + 1, 1);
		dispatch(updateQueue(updateData));
	};

	const handleQueueClear = () => {
		const updateData: ITrack[] = [...queue];

		if (updateData.length <= 1) {
			if (clearBtnRef.current) {
				setTimeout(() => {
					if (clearBtnRef.current) clearBtnRef.current?.classList.remove(styles.shake);
				}, 300);
				clearBtnRef.current.classList.add(styles.shake);
			}
			return;
		}

		updateData.splice(1);
		dispatch(updateQueue(updateData));
	};

	useEffect(() => {
		if (queue.length > 0) {
			setTracks(queue);
		}
	}, [queue]);

	return (
		<div className={styles['queue-container']}>
			<header className={styles['queue-title']}>Up Next</header>
			<div className={styles.queue}>
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
					<SortableContext items={tracks} strategy={verticalListSortingStrategy}>
						{tracks && tracks.slice(queueIndex + 1, tracks.length).map((track, index) => (isDraggingId !== track.id ? <QueueTrack key={track.id} id={track.id} track={track} index={index} removeTrack={handleTrackRemove} /> : <QueueTrack key={track.id} id={track.id} track={track} index={index} isDragging />))}
					</SortableContext>
					<DragOverlay modifiers={[restrictToWindowEdges]}>{isDraggingId ? <QueueTrack index={-1} id={tracks.findIndex((x) => x.id === isDraggingId)} track={tracks[tracks.findIndex((x) => x.id === isDraggingId)]} /> : null}</DragOverlay>
				</DndContext>
			</div>
			<div className={styles['control-section']}>
				<button className={styles['btn-clear-queue']} type="button" ref={clearBtnRef} onClick={handleQueueClear}>
					<img src={trashIcon} alt="" />
					Clear
				</button>
			</div>
		</div>
	);
};

export default Queue;
