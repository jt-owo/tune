/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */
import { FC, memo, RefObject, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { removePlaylist, updatePlaylist } from '../../../state/slices/playlistsSlice';
import { IPlaylist, ITrack } from '../../../typings/types';
import { setQueue, updateQueue } from '../../../state/slices/playerSlice';
import { getServices } from '../../util/serviceHelper';
import { getImageUrl } from '../../util/formatHelper';
import useContextMenu from '../../hooks/useContextMenu';
import SpotifyAPI from '../../api/spotify';
import AppRoutes from '../../routes';

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
// FIXME: @tobytaken fix svg.
/* import addTopIcon from '../../../../assets/ui-icons/add-top.svg'; */
/* import addBottomIcon from '../../../../assets/ui-icons/add-bottom.svg'; */
/* import imageIcon from '../../../../assets/ui-icons/image-regular.svg'; */
import lockIcon from '../../../../assets/animations/lock.json';

import style from './Playlist.module.scss';
import { loadTracksMetadata } from '../../util';

type PlaylistParams = {
	id: string;
	service: string;
};

const Playlist: FC = memo(() => {
	const { id, service } = useParams<PlaylistParams>();

	const { isLocal, isSpotify } = getServices(service ?? '');

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const spotifyToken = useAppSelector((state) => state.user.spotifyToken);

	const playlists = useAppSelector((state) => state.playlists.local);
	const spotifyPlaylists = useAppSelector((state) => state.playlists.spotify);
	const queue = useAppSelector((state) => state.player.queue);

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
	const [isSortingLocked, setIsSortingLocked] = useState(false);

	// Other ui states.
	const [renameVisibility, setRenameVisibility] = useState(false);
	const [hamburgerVisibility, setHamburgerVisibility] = useState(false);
	const [isDialogVisible, setDialogVisibility] = useState(false);

	// Context Menu states.
	const [visibility, setVisibility, position, setPosition] = useContextMenu();
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
		if (isSortingLocked) return;
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setTracks((tracks) => {
				const oldIndex = tracks.indexOf(tracks.find((x) => x.id === active.id)!);
				const newIndex = tracks.indexOf(tracks.find((x) => x.id === over.id)!);
				const newArray = arrayMove(tracks, oldIndex, newIndex);
				if (isLocal) {
					const updateData: IPlaylist = {
						...playlist,
						tracks: newArray
					};
					dispatch(updatePlaylist(updateData));
				}
				return newArray;
			});
		}
	};

	const deletePlaylist = (confirm: boolean) => {
		if (confirm) {
			dispatch(removePlaylist(playlist.id));
			navigate(AppRoutes.Library);
		}
	};

	const handleAddTracks = async () => {
		const updateData: IPlaylist = {
			...playlist,
			tracks: [...playlist.tracks]
		};

		const paths = await window.api?.system.selectFiles();
		if (!paths) return;

		let index = 1;
		paths.forEach((path) => {
			if (updateData.tracks.length > 0) {
				const values = updateData.tracks.map((p) => p.id);
				index = Math.max(...values) + 1;
			}

			updateData.tracks.push({
				id: index,
				name: '',
				filePath: path,
				service: 'local'
			});
		});

		dispatch(updatePlaylist(updateData));
		setTracks(updateData.tracks);
	};

	const handlePlay = () => {
		dispatch(setQueue(playlist.tracks));
	};

	const handleTrackRemove = (id: number) => {
		const updateData: IPlaylist = {
			...playlist
		};

		const index = updateData.tracks.findIndex((x) => x.id === id);
		updateData.tracks.splice(index, 1);

		dispatch(updatePlaylist(updateData));
		setTracks(updateData.tracks);
	};

	const handlePlayNext = (id: number) => {
		const updateData: ITrack[] = [...queue];
		const track = playlist.tracks.find((x) => x.id === id);

		if (track) {
			updateData.splice(1, 0, track);
			dispatch(updateQueue(updateData));
		}
	};

	const handlePlayLast = (id: number) => {
		const updateData: ITrack[] = [...queue];
		const track = playlist.tracks.find((x) => x.id === id);

		if (track) {
			updateData.push(track);
			dispatch(updateQueue(updateData));
		}
	};

	const handleToggleRename = () => {
		if (!isLocal) return;
		setRenameVisibility(true);
	};

	const handleRename = (data: string) => {
		dispatch(updatePlaylist({ ...playlist, name: data }));
	};

	const handleLockPlaylist = () => {
		setIsSortingLocked(() => !isSortingLocked);
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

		const loadLocalTracks = async (tracks: ITrack[]) => {
			const tracksLoaded = await loadTracksMetadata(tracks);
			setTracks(tracksLoaded);
		};

		let query: IPlaylist[] | undefined;
		if (isLocal) {
			query = playlists;
		} else if (isSpotify) {
			query = spotifyPlaylists;
		}

		if (query) {
			const found = query.find((x) => x.id === id);
			if (found) {
				setPlaylist(found);
				if (isLocal) {
					if (found.tracks) loadLocalTracks(found.tracks);
				} else if (isSpotify) {
					if (found.tracksHref && spotifyToken) loadSpotifyTracks(spotifyToken, found.tracksHref);
				}
			}
		}
	}, [id, isLocal, isSpotify, playlists, spotifyPlaylists, spotifyToken]);

	useEffect(() => {
		if (lottieShowMenuRef.current) {
			lottieShowMenuRef.current.setSpeed(2);
			if (!hamburgerVisibility) {
				stopAnimation(lottieShowMenuRef);
			} else {
				startAnimation(lottieShowMenuRef);
			}
		}
	}, [hamburgerVisibility]);

	return (
		<div className={style['playlist-container']}>
			<Dialog heading="Delete?" description="You are about to delete this playlist. This action cannot be undone!" onClose={() => setDialogVisibility(false)} isOpen={isDialogVisible} type="danger" confirmText="Delete" rejectText="Keep" confirmCallback={deletePlaylist} />
			<div className={style['playlist-heading']}>
				<RenameDialog value={playlist?.name} nameCB={handleRename} visible={renameVisibility} onClose={() => setRenameVisibility(false)} />
				<img src={getImageUrl(playlist.images)} alt="" />
				<div className={style['playlist-heading-text']} onClick={handleToggleRename}>
					{playlist?.name}
				</div>
				<div className={style['playlist-controls']}>
					<HamburgerMenu onClose={() => setHamburgerVisibility(false)} visible={hamburgerVisibility} positionX={25} positionY={100}>
						<HamburgerMenuItem title="Edit" icon={editIcon} />
						<HamburgerMenuItem title="Choose image" icon={undefined} />
						<HamburgerMenuItem title={isSortingLocked ? 'Unlock playlist' : 'Lock playlist'} lottieIcon={lockIcon} onClick={handleLockPlaylist} isActive={isSortingLocked} lottieActiveFrame={1} lottieInactiveFrame={9} useLottie />
					</HamburgerMenu>
					{isLocal && (
						<>
							<ToolTip text="Play Playlist">
								<div className={`${style['playlist-heading-btn']} ${style['btn-hover-animation']} ${style['playlist-play-btn']}`} onClick={handlePlay}>
									<img className={style['play-icon']} src={playIcon} alt="" draggable="false" />
								</div>
							</ToolTip>
							<ToolTip text="Import Tracks">
								<div className={`${style['playlist-heading-btn']} ${style['btn-hover-animation']} ${style['playlist-import-btn']}`} onClick={handleAddTracks} onMouseEnter={() => startAnimation(lottieAddTracksRef)} onMouseLeave={() => stopAnimation(lottieAddTracksRef)}>
									<Lottie className={style['import-icon']} animationData={folderIcon} lottieRef={lottieAddTracksRef} loop={false} autoplay={false} />
								</div>
							</ToolTip>
							<ToolTip text="Delete Playlist">
								<div className={`${style['playlist-heading-btn']} ${style['btn-hover-animation']} ${style['playlist-delete-btn']}`} onClick={() => setDialogVisibility(true)} onMouseEnter={() => startAnimation(lottieDeletePlaylistRef)} onMouseLeave={() => stopAnimation(lottieDeletePlaylistRef)}>
									<Lottie className={style['delete-icon']} animationData={trashIcon} lottieRef={lottieDeletePlaylistRef} loop={false} autoplay={false} />
								</div>
							</ToolTip>
							<ToolTip text="Options">
								<div className={`${style['playlist-heading-btn']} ${style['btn-hover-animation']} ${style['playlist-menu-btn']}`} onClick={() => setHamburgerVisibility(true)}>
									<Lottie className={style['menu-icon']} animationData={menuIcon} lottieRef={lottieShowMenuRef} loop={false} autoplay={false} />
								</div>
							</ToolTip>
						</>
					)}
				</div>
			</div>
			<div className={style.divider} />
			<div className={style['playlist-content']}>
				{tracks.length > 0 && (
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
						<SortableContext items={tracks} strategy={verticalListSortingStrategy}>
							{tracks &&
								tracks.map((track) =>
									isDraggingId !== track.id ? (
										<PlaylistTrack
											key={track.id}
											track={track}
											onContextMenu={(e) => {
												e.preventDefault();
												setUsingContextMenuId(track.id);
												setVisibility(true);
												setPosition({
													x: e.pageX,
													y: e.pageY
												});
												// FIXME: not sure if e.pageX/Y returns the correct value.
												// console.log('right click', e.pageX, e.pageY);
											}}
										/>
									) : (
										<PlaylistTrack key={track.id} track={track} onContextMenu={() => {}} isDragging />
									)
								)}
						</SortableContext>
						<DragOverlay modifiers={[restrictToWindowEdges]}>{isDraggingId ? <PlaylistTrack track={tracks[tracks.findIndex((x) => x.id === isDraggingId)]} onContextMenu={() => {}} /> : null}</DragOverlay>
					</DndContext>
				)}
				{visibility && (
					<ContextMenu y={position.y} x={position.x}>
						<ContextMenuItem header="Play Next" staticIcon={undefined} type="default" onClick={() => handlePlayNext(usingContextMenuId)} />
						<ContextMenuItem header="Play Last" staticIcon={undefined} type="default" onClick={() => handlePlayLast(usingContextMenuId)} />
						<ContextMenuItem header="Delete from Playlist" staticIcon={deleteIcon} type="danger" onClick={() => handleTrackRemove(usingContextMenuId)} />
					</ContextMenu>
				)}
			</div>
		</div>
	);
});

export default Playlist;
