/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react-hooks/rules-of-hooks */
import { memo, RefObject, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deletePlaylist, updatePlaylist } from '../../../state/slices/playlistsSlice';
import { addToQueueLast, addToQueueNext, setQueue } from '../../../state/slices/playerSlice';
import useContextMenu from '../../hooks/useContextMenu';
import useToggle from '../../hooks/useToggle';
import SpotifyAPI from '../../api/spotify';
import AppRoutes from '../../routes';
import { IPlaylist, ITrack } from '../../../typings/types';
import Services from '../../util/services';
import Format from '../../util/format';
import TrackHelper from '../../util/trackHelper';

import PlaylistTrack from './PlaylistTrack/PlaylistTrack';
import ToolTip from '../../components/ToolTip/ToolTip';
import ContextMenu from '../../components/ContextMenu/ContextMenu';
import ContextMenuItem from '../../components/ContextMenu/ContextMenuItem/ContextMenuItem';
import RenameDialog from '../../components/RenameDialog/RenameDialog';
import Dialog from '../../components/Dialog/Dialog';
import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu';
import HamburgerMenuItem from '../../components/HamburgerMenu/HamburgerMenuItem/HamburgerMenuItem';

import playIcon from '../../../../assets/ui-icons/play.svg';
import folderIcon from '../../../../assets/animations/folder.json';
import trashIcon from '../../../../assets/animations/trash.json';
import menuIcon from '../../../../assets/animations/menuV4.json';

import deleteIcon from '../../../../assets/ui-icons/trash-2.svg';
import editIcon from '../../../../assets/ui-icons/edit-3.svg';
import addTopIcon from '../../../../assets/ui-icons/add-top.svg';
import addBottomIcon from '../../../../assets/ui-icons/add-bottom.svg';
import imageIcon from '../../../../assets/ui-icons/image-regular.svg';
import lockIcon from '../../../../assets/animations/lock.json';

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
	const [isHamburgerVisible, setHamburgerVisibility] = useState(false);
	const [isDialogVisible, toggleDialog, hideDialog] = useToggle(false);

	// Context Menu states.
	const [isContextMenuVisible, toggleContextMenu, position, setPosition] = useContextMenu();
	const [usingContextMenuId, setUsingContextMenuId] = useState(-1);

	// Lottie refs.
	const lottieShowMenuRef = useRef<LottieRefCurrentProps>(null);
	const lottieAddTracksRef = useRef<LottieRefCurrentProps>(null);
	const lottieDeletePlaylistRef = useRef<LottieRefCurrentProps>(null);

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

		let index = 1;
		paths.forEach((path) => {
			if (updateData.length > 0) {
				index = TrackHelper.getNextID(updateData);
			}

			updateData.push({
				id: index,
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
		dispatch(setQueue(tracks));
	};

	const handleTrackRemove = (trackID: number) => {
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

	const handlePlayNext = (trackID: number) => {
		const track = tracks.find((x) => x.id === trackID);
		if (track) dispatch(addToQueueNext(track));
	};

	const handlePlayLast = (trackID: number) => {
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

	const startAnimation = (e: RefObject<LottieRefCurrentProps>) => {
		e?.current?.setDirection(1);
		e?.current?.play();
	};

	const stopAnimation = (e: RefObject<LottieRefCurrentProps>) => {
		e?.current?.setDirection(-1);
		e?.current?.play();
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

	useEffect(() => {
		if (lottieShowMenuRef.current) {
			lottieShowMenuRef.current.setSpeed(2);
			if (!isHamburgerVisible) stopAnimation(lottieShowMenuRef);
			else startAnimation(lottieShowMenuRef);
		}
	}, [isHamburgerVisible]);

	return (
		<div className={styles['playlist-container']}>
			<Dialog heading="Delete?" description="You are about to delete this playlist. This action cannot be undone!" onClose={hideDialog} visible={isDialogVisible} type="danger" confirmText="Delete" rejectText="Keep" confirmCallback={handleDeletePlaylist} />
			<div className={styles['playlist-heading']}>
				<RenameDialog value={playlist?.name} cb={handleRename} visible={isRenameVisible} onClose={toggleRename} />
				<img src={Format.getImage(playlist.images)} alt="" />
				<div className={styles['playlist-heading-text']} onClick={handleToggleRename}>
					{playlist?.name}
				</div>
				<div className={styles['playlist-controls']}>
					<HamburgerMenu onClose={() => setHamburgerVisibility(false)} visible={isHamburgerVisible} positionX={25} positionY={100}>
						<HamburgerMenuItem title="Edit" icon={editIcon} hidden={playlist.locked} />
						<HamburgerMenuItem title="Choose image" icon={imageIcon} hidden={playlist.locked} />
						<HamburgerMenuItem title={playlist.locked ? 'Unlock playlist' : 'Lock playlist'} lottieIcon={lockIcon} onClick={handleLockPlaylist} isActive={playlist.locked} lottieActiveFrame={1} lottieInactiveFrame={9} useLottie />
						<HamburgerMenuItem title={playlist.pinned ? 'Unpin playlist' : 'Pin playlist'} onClick={handlePinPlaylist} isActive={playlist.pinned} hidden={playlist.locked} />
					</HamburgerMenu>
					{isLocal && (
						<>
							<ToolTip text="Play Playlist">
								<div className={`${styles['playlist-heading-btn']} ${styles['btn-hover-animation']} ${styles['playlist-play-btn']}`} onClick={handlePlay}>
									<img className={styles['play-icon']} src={playIcon} alt="" draggable="false" />
								</div>
							</ToolTip>
							{!playlist.locked && (
								<>
									<ToolTip text="Import Tracks">
										<div className={`${styles['playlist-heading-btn']} ${styles['btn-hover-animation']} ${styles['playlist-import-btn']}`} onClick={handleAddTracks} onMouseEnter={() => startAnimation(lottieAddTracksRef)} onMouseLeave={() => stopAnimation(lottieAddTracksRef)}>
											<Lottie className={styles['import-icon']} animationData={folderIcon} lottieRef={lottieAddTracksRef} loop={false} autoplay={false} />
										</div>
									</ToolTip>
									<ToolTip text="Delete Playlist">
										<div className={`${styles['playlist-heading-btn']} ${styles['btn-hover-animation']} ${styles['playlist-delete-btn']}`} onClick={toggleDialog} onMouseEnter={() => startAnimation(lottieDeletePlaylistRef)} onMouseLeave={() => stopAnimation(lottieDeletePlaylistRef)}>
											<Lottie className={styles['delete-icon']} animationData={trashIcon} lottieRef={lottieDeletePlaylistRef} loop={false} autoplay={false} />
										</div>
									</ToolTip>
								</>
							)}
							<ToolTip text="Options">
								<div className={`${styles['playlist-heading-btn']} ${styles['btn-hover-animation']} ${styles['playlist-menu-btn']}`} onClick={() => setHamburgerVisibility(true)}>
									<Lottie className={styles['menu-icon']} animationData={menuIcon} lottieRef={lottieShowMenuRef} loop={false} autoplay={false} />
								</div>
							</ToolTip>
						</>
					)}
				</div>
			</div>
			<div className={styles.divider} />
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
