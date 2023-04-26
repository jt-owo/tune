/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/rules-of-hooks */
import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deletePlaylist, updatePlaylist } from '../../../state/slices/playlistsSlice';
import { addToQueueLast, addToQueueNext, setQueue } from '../../../state/slices/playerSlice';
import Guid from '../../../util/guid';
import useContextMenu from '../../hooks/useContextMenu';
import useToggle from '../../hooks/useToggle';
import SpotifyAPI from '../../api/spotify';
import AppRoutes from '../../routes';
import Services from '../../util/services';
import TrackHelper from '../../util/trackHelper';

import PlaylistHeader from './PlaylistHeader/PlaylistHeader';
import PlaylistTrack from './PlaylistTrack/PlaylistTrack';
import ToolTip from '../../components/ToolTip/ToolTip';
import ContextMenu from '../../components/ContextMenu/ContextMenu';
import ContextMenuItem from '../../components/ContextMenu/ContextMenuItem/ContextMenuItem';
import Dialog from '../../components/Dialog/Dialog';

import deleteIcon from '../../../../assets/ui-icons/trash-2.svg';
import addTopIcon from '../../../../assets/ui-icons/add-top.svg';
import addBottomIcon from '../../../../assets/ui-icons/add-bottom.svg';
import helpIcon from '../../../../assets/ui-icons/help-circle.svg';

import styles from './Playlist.module.scss';

type PlaylistParams = {
	id: string;
	service: string;
};

const Playlist = memo(() => {
	const { id, service } = useParams<PlaylistParams>();
	const { isLocal, isSpotify } = Services.checkServices(service ?? '');
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const spotifyToken = useAppSelector((state) => state.user.spotifyToken);

	const playlists = useAppSelector((state) => state.playlists.local);
	const spotifyPlaylists = useAppSelector((state) => state.playlists.spotify);

	let found: IPlaylist | undefined;
	if (isLocal) {
		found = playlists.find((x) => x.id === id);
	} else if (isSpotify) {
		found = spotifyPlaylists.find((x) => x.id === id);
	}

	if (!found) {
		navigate(AppRoutes.Library);
		return null;
	}

	const [playlist, setPlaylist] = useState<IPlaylist>(found);
	const [tracks, setTracks] = useState<ITrack[]>([]);

	// Drag and drop hooks
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
	const [isDraggingId, setIsDraggingId] = useState<UniqueIdentifier>();

	// Other ui states.
	const [isRenameVisible, toggleRename] = useToggle();
	const [isDialogVisible, toggleDialog, hideDialog] = useToggle(false);
	const [headerFloat, toggleHeaderFloat] = useToggle();

	// Context Menu states.
	const [isContextMenuVisible, toggleContextMenu, position, setPosition] = useContextMenu();
	const [usingContextMenuId, setUsingContextMenuId] = useState('');

	const playlistContainerRef = useRef<HTMLDivElement>(null);

	const duration = Math.round(tracks.reduce((acc, track) => acc + (track.duration ?? 0), 0));

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
			if (isLocal) {
				dispatch(
					updatePlaylist({
						...playlist,
						tracks: newArray
					})
				);
			}
		}
	};

	const handleDeletePlaylist = (confirm: boolean) => {
		if (confirm) {
			dispatch(deletePlaylist(playlist.id));
			navigate(AppRoutes.Library);
		}
	};

	const handleAddTracks = async () => {
		const paths = await window.api?.system.selectFiles();
		if (!paths) return;

		const updateData = [...playlist.tracks];

		paths.forEach((path) => {
			updateData.push({
				id: Guid.new(),
				filePath: path,
				service: 'local'
			});
		});

		dispatch(
			updatePlaylist({
				...playlist,
				tracks: updateData
			})
		);
	};

	const handlePlay = () => {
		if (tracks.length) dispatch(setQueue(tracks));
	};

	const handleTrackRemove = (trackID: string) => {
		const updateData = [...playlist.tracks];

		const index = updateData.findIndex((x) => x.id === trackID);
		updateData.splice(index, 1);

		dispatch(
			updatePlaylist({
				...playlist,
				tracks: updateData
			})
		);
	};

	const handlePlayNext = (trackID: string) => {
		const track = tracks.find((x) => x.id === trackID);
		if (track) dispatch(addToQueueNext(track));
	};

	const handlePlayLast = (trackID: string) => {
		const track = tracks.find((x) => x.id === trackID);
		if (track) dispatch(addToQueueLast(track));
	};

	const handleToggleRename = () => {
		if (playlist.locked || !isLocal) return;
		toggleRename();
	};

	const handleRename = (data: string) => {
		if (data === '') return;
		dispatch(updatePlaylist({ ...playlist, name: data }));
	};

	const handleLockPlaylist = () => {
		dispatch(
			updatePlaylist({
				...playlist,
				locked: !playlist.locked
			})
		);
	};

	const handlePinPlaylist = () => {
		dispatch(
			updatePlaylist({
				...playlist,
				pinned: !playlist.pinned
			})
		);
	};

	const checkScroll = () => {
		if (!playlistContainerRef.current) return;
		if (!headerFloat && playlistContainerRef.current?.scrollTop > 300) toggleHeaderFloat();
		if (headerFloat && playlistContainerRef.current?.scrollTop < 300) toggleHeaderFloat();
	};

	useEffect(() => {
		const loadSpotifyTracks = async (token: string, url: string) => {
			const tracksLoaded = await SpotifyAPI.fetchPlaylistTracks(token, url);
			setTracks(tracksLoaded);
		};

		const loadLocalTracks = async (localTracks: ITrack[]) => {
			const tracksLoaded = await TrackHelper.loadTracksMetadata(localTracks);
			setTracks(tracksLoaded);
		};

		let query: IPlaylist[] | undefined;
		if (isLocal) {
			query = playlists;
		} else if (isSpotify) {
			query = spotifyPlaylists;
		}

		if (!query) return;

		const foundPlaylist = query.find((x) => x.id === id);
		if (!foundPlaylist) return;

		setPlaylist(foundPlaylist);
		if (isLocal) {
			if (foundPlaylist.tracks) loadLocalTracks(foundPlaylist.tracks);
		} else if (isSpotify) {
			if (foundPlaylist.tracksHref && spotifyToken) loadSpotifyTracks(spotifyToken, foundPlaylist.tracksHref);
		}
	}, [id, isLocal, isSpotify, playlists, spotifyPlaylists, spotifyToken]);

	return (
		<div className={styles['playlist-container']} onScroll={checkScroll} ref={playlistContainerRef}>
			<Dialog heading="Delete?" description="You are about to delete this playlist. This action cannot be undone!" onClose={hideDialog} visible={isDialogVisible} type="danger" confirmText="Delete" rejectText="Keep" confirmCallback={handleDeletePlaylist} />
			<PlaylistHeader playlist={playlist} duration={duration} handlePlay={handlePlay} handleAddTracks={handleAddTracks} handleLockPlaylist={handleLockPlaylist} handlePinPlaylist={handlePinPlaylist} handleRename={handleRename} handleToggleRename={handleToggleRename} toggleRename={toggleRename} toggleDialog={toggleDialog} renameVisible={isRenameVisible} shouldFloat={headerFloat} />
			<div className={styles.sortbar}>
				<div className={styles.title}>Title</div>
				<div className={styles.album}>Album</div>
				<div className={styles['source-container']}>
					<div className={styles.source}>Source</div>
					<ToolTip text="Shows whether the song is sourced locally or from one of the respective streaming services">
						<img src={helpIcon} alt="" className={styles['help-icon']} />
					</ToolTip>
				</div>
				<div className={styles.duration}>Duration</div>
			</div>
			<div className={styles['playlist-content']}>
				{tracks.length > 0 && (
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
						<SortableContext items={tracks} strategy={verticalListSortingStrategy}>
							{tracks &&
								tracks.map((track) =>
									isDraggingId !== track.id ? (
										<PlaylistTrack
											key={track.id}
											track={track}
											locked={playlist.locked}
											onContextMenu={(e) => {
												e.preventDefault();
												setUsingContextMenuId(track.id);
												toggleContextMenu();
												setPosition({
													x: e.pageX,
													y: e.pageY
												});
												// FIXME: not sure if e.pageX/Y returns the correct value.
												// console.log('right click', e.pageX, e.pageY);
											}}
										/>
									) : (
										<PlaylistTrack key={track.id} track={track} locked={playlist.locked} onContextMenu={() => {}} isDragging />
									)
								)}
						</SortableContext>
						<DragOverlay modifiers={[restrictToWindowEdges]}>{isDraggingId ? <PlaylistTrack track={tracks[tracks.findIndex((x) => x.id === isDraggingId)]} locked={playlist.locked} onContextMenu={() => {}} /> : null}</DragOverlay>
					</DndContext>
				)}
				{isContextMenuVisible && (
					<ContextMenu y={position.y} x={position.x}>
						<ContextMenuItem text="Play Next" staticIcon={addTopIcon} type="default" onClick={() => handlePlayNext(usingContextMenuId)} />
						<ContextMenuItem text="Play Last" staticIcon={addBottomIcon} type="default" onClick={() => handlePlayLast(usingContextMenuId)} />
						<ContextMenuItem text="Delete from Playlist" staticIcon={deleteIcon} type="danger" onClick={() => handleTrackRemove(usingContextMenuId)} hidden={playlist.locked} />
					</ContextMenu>
				)}
			</div>
		</div>
	);
});

export default Playlist;
