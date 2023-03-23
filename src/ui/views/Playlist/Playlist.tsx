/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-shadow */
import { FC, memo, RefObject, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { removePlaylist, selectPlaylists, updatePlaylist } from '../../../state/slices/playlistSlice';
import { PlaylistData, TrackData } from '../../../typings/playlist';
import { selectQueue, setQueue, updateQueue } from '../../../state/slices/playerSlice';
import useContextMenu from '../../hooks/useContextMenu';
import AppRoutes from '../../routes';

import PlaylistTrack from './PlaylistTrack/PlaylistTrack';
import ToolTip from '../../components/ToolTip/ToolTip';
import ContextMenu from '../../components/ContextMenu/ContextMenu';
import ContextMenuItem from '../../components/ContextMenu/ContextMenuItem/ContextMenuItem';

import playIcon from '../../../../assets/ui-icons/play.svg';
import folderIcon from '../../../../assets/animations/folder.json';
import trashIcon from '../../../../assets/animations/trash.json';
import menuIcon from '../../../../assets/animations/menuV4.json';

import defaultAlbumCover from '../../../../assets/images/tune_no_artwork.svg';
import deleteIcon from '../../../../assets/ui-icons/trash-2.svg';
import editIcon from '../../../../assets/ui-icons/edit-3.svg';
import addTopIcon from '../../../../assets/ui-icons/add-top.svg';
import addBottomIcon from '../../../../assets/ui-icons/add-bottom.svg';
import imageIcon from '../../../../assets/ui-icons/image-regular.svg';
import lockIcon from '../../../../assets/animations/lock.json';

import RenameDialog from '../../components/RenameDialog/RenameDialog';
import Dialog from '../../components/Dialog/Dialog';
import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu';
import HamburgerMenuItem from '../../components/HamburgerMenu/HamburgerMenuItem/HamburgerMenuItem';

import './Playlist.scss';

const Playlist: FC = memo(function Playlist() {
	const { id } = useParams();

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const playlists = useAppSelector(selectPlaylists);
	const queue = useAppSelector(selectQueue);
	const [playlist, setPlaylist] = useState(playlists.find((x) => x.id === id));

	const [tracks, setTracks] = useState<TrackData[]>([]);
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

	const [renameVisibility, setRenameVisibility] = useState(false);
	const [hamburgerVisibility, setHamburgerVisibility] = useState(false);
	const [isDialogVisible, setDialogVisibility] = useState(false);

	const [visibility, setVisibility, position, setPosition] = useContextMenu();
	const [usingContextMenuId, setUsingContextMenuId] = useState(-1);

	const lottieShowMenuRef = useRef<LottieRefCurrentProps>(null);
	const lottieAddTracksRef = useRef<LottieRefCurrentProps>(null);
	const lottieDeletePlaylistRef = useRef<LottieRefCurrentProps>(null);

	if (!playlist) {
		navigate(AppRoutes.Library);
	}

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
				const updateData: PlaylistData = {
					...playlist!,
					tracks: newArray
				};
				dispatch(updatePlaylist(updateData));
				return newArray;
			});
		}
	};

	const deletePlaylist = (confirm: boolean) => {
		if (!playlist?.id) return;

		if (confirm) {
			dispatch(removePlaylist(playlist.id));
			navigate(AppRoutes.Library);
		}
	};

	const handleAddTracks = async () => {
		if (!playlist?.id) return;

		if (!playlist.tracks) {
			playlist.tracks = [];
		}

		const updateData: PlaylistData = {
			id: playlist.id,
			name: playlist.name,
			tracks: [...playlist.tracks],
			pinned: playlist.pinned
		};

		const paths = await window.api.system.selectFiles();

		let index = 1;
		paths.forEach((path) => {
			if (updateData.tracks.length > 0) {
				const values = updateData.tracks.map((p) => p.id);
				index = Math.max(...values) + 1;
			}

			updateData.tracks.push({
				id: index,
				filePath: path
			});
		});

		dispatch(updatePlaylist(updateData));
		setTracks(updateData.tracks);
	};

	const playPlaylist = () => {
		if (!playlist) return;

		dispatch(setQueue(playlist.tracks));
	};

	const startAnimation = (e: RefObject<LottieRefCurrentProps>) => {
		e?.current?.setDirection(1);
		e?.current?.play();
	};

	const stopAnimation = (e: RefObject<LottieRefCurrentProps>) => {
		e?.current?.setDirection(-1);
		e?.current?.play();
	};

	const handleTrackRemove = (id: number) => {
		if (!playlist) return;

		const updateData: PlaylistData = {
			id: playlist.id,
			name: playlist.name,
			tracks: [...playlist.tracks],
			pinned: playlist.pinned
		};

		const index = updateData.tracks.findIndex((x) => x.id === id);
		updateData.tracks.splice(index, 1);

		dispatch(updatePlaylist(updateData));
		setTracks(updateData.tracks);
	};

	const handlePlayNext = (id: number) => {
		if (!playlist) return;

		const updateData: TrackData[] = [...queue];

		const index = playlist.tracks.findIndex((x) => x.id === id);
		const track = playlist.tracks[index];
		updateData.splice(1, 0, track);
		dispatch(updateQueue(updateData));
	};

	const handlePlayLast = (id: number) => {
		if (!playlist) return;

		const updateData: TrackData[] = [...queue];

		const index = playlist.tracks.findIndex((x) => x.id === id);
		const track = playlist.tracks[index];
		updateData.push(track);
		dispatch(updateQueue(updateData));
	};

	const handleRename = (data: string) => {
		if (playlist) dispatch(updatePlaylist({ ...playlist, name: data } as PlaylistData));
	};

	const handleLockPlaylist = () => {
		setIsSortingLocked(() => !isSortingLocked);
	};

	useEffect(() => {
		const playlistFound = playlists.find((x) => x.id === id);
		if (playlistFound) {
			setPlaylist(playlistFound);
			if (playlistFound.tracks) setTracks(playlistFound.tracks);
		}
	}, [playlists, id]);

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
		<div key={id} id="playlist-container">
			<Dialog heading="Delete?" description="You are about to delete this playlist. This action cannot be undone!" onClose={() => setDialogVisibility(false)} isOpen={isDialogVisible} type="danger" confirmText="Delete" rejectText="Keep" confirmCallback={deletePlaylist} />
			<div id="playlist-heading">
				<RenameDialog value={playlist?.name} nameCB={handleRename} visible={renameVisibility} onClose={() => setRenameVisibility(false)} />
				<img src={defaultAlbumCover} alt="" />
				<div id="playlist-heading-text" onClick={() => setRenameVisibility(true)}>
					{playlist?.name}
				</div>
				<div id="playlist-controls">
					<HamburgerMenu onClose={() => setHamburgerVisibility(false)} visible={hamburgerVisibility} positionX={25} positionY={100}>
						<HamburgerMenuItem title="Edit" icon={editIcon} />
						<HamburgerMenuItem title="Choose image" icon={imageIcon} />
						<HamburgerMenuItem title={isSortingLocked ? 'Unlock playlist' : 'Lock playlist'} lottieIcon={lockIcon} onClick={handleLockPlaylist} isActive={isSortingLocked} lottieActiveFrame={1} lottieInactiveFrame={9} useLottie />
					</HamburgerMenu>
					<ToolTip text="Play Playlist">
						<div id="playlist-play-btn" className="playlist-heading-btn btn-hover-animation" onClick={playPlaylist}>
							<img id="play-icon" src={playIcon} alt="" draggable="false" />
						</div>
					</ToolTip>
					<ToolTip text="Import Tracks">
						<div id="playlist-import-btn" className="playlist-heading-btn btn-hover-animation" onClick={handleAddTracks} onMouseEnter={() => startAnimation(lottieAddTracksRef)} onMouseLeave={() => stopAnimation(lottieAddTracksRef)}>
							<Lottie id="import-icon" animationData={folderIcon} lottieRef={lottieAddTracksRef} loop={false} autoplay={false} />
						</div>
					</ToolTip>
					<ToolTip text="Delete Playlist">
						<div id="playlist-delete-btn" className="playlist-heading-btn btn-hover-animation" onClick={() => setDialogVisibility(true)} onMouseEnter={() => startAnimation(lottieDeletePlaylistRef)} onMouseLeave={() => stopAnimation(lottieDeletePlaylistRef)}>
							<Lottie id="delete-icon" animationData={trashIcon} lottieRef={lottieDeletePlaylistRef} loop={false} autoplay={false} />
						</div>
					</ToolTip>
					<ToolTip text="Options">
						<div id="playlist-menu-btn" className="playlist-heading-btn btn-hover-animation" onClick={() => setHamburgerVisibility(true)}>
							<Lottie id="menu-icon" animationData={menuIcon} lottieRef={lottieShowMenuRef} loop={false} autoplay={false} />
						</div>
					</ToolTip>
				</div>
			</div>
			<div id="divider" />
			<div id="playlist-content">
				{tracks.length > 0 && (
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
						<SortableContext items={tracks} strategy={verticalListSortingStrategy}>
							{tracks &&
								tracks.map((track) =>
									isDraggingId !== track.id ? (
										<PlaylistTrack
											key={track.id}
											id={track.id}
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
										<PlaylistTrack key={track.id} id={track.id} track={track} onContextMenu={() => {}} isDragging />
									)
								)}
						</SortableContext>
						<DragOverlay modifiers={[restrictToWindowEdges]}>{isDraggingId ? <PlaylistTrack id={tracks.findIndex((x) => x.id === isDraggingId)} track={tracks[tracks.findIndex((x) => x.id === isDraggingId)]} onContextMenu={() => {}} /> : null}</DragOverlay>
					</DndContext>
				)}
				{visibility && (
					<ContextMenu y={position.y} x={position.x}>
						<ContextMenuItem header="Play Next" staticIcon={addTopIcon} type="default" onClick={() => handlePlayNext(usingContextMenuId)} />
						<ContextMenuItem header="Play Last" staticIcon={addBottomIcon} type="default" onClick={() => handlePlayLast(usingContextMenuId)} />
						<ContextMenuItem header="Delete from Playlist" staticIcon={deleteIcon} type="danger" onClick={() => handleTrackRemove(usingContextMenuId)} />
					</ContextMenu>
				)}
			</div>
		</div>
	);
});

export default Playlist;
