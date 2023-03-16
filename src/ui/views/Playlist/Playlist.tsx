/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-shadow */
import { FC, memo, RefObject, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { removePlaylist, selectPlaylists, updatePlaylist } from '../../../state/slices/playlistSlice';
import { PlaylistData, TrackData } from '../../../typings/playlist';
import { setQueue } from '../../../state/slices/playerSlice';
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

import './Playlist.scss';

const Playlist: FC = memo(function Playlist() {
	const { id } = useParams();

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const playlists = useAppSelector(selectPlaylists);
	const [playlist, setPlaylist] = useState(playlists.find((x) => x.id === id));

	const [tracks, setTracks] = useState<TrackData[]>([]);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);

	const [visibility, setVisibility, position, setPosition] = useContextMenu();

	const lottieShowMenuRef = useRef<LottieRefCurrentProps>(null);
	const lottieAddTracksRef = useRef<LottieRefCurrentProps>(null);
	const lottieDeletePlaylistRef = useRef<LottieRefCurrentProps>(null);

	if (!playlist) {
		navigate(AppRoutes.Library);
	}

	const handleDragEnd = (event: DragEndEvent) => {
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

	const deletePlaylist = () => {
		if (!playlist?.id) return;

		dispatch(removePlaylist(playlist.id));
		navigate(AppRoutes.Library);
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

	useEffect(() => {
		const playlistFound = playlists.find((x) => x.id === id);
		if (playlistFound) {
			setPlaylist(playlistFound);
			if (playlistFound.tracks) setTracks(playlistFound.tracks);
		}
	}, [playlists, id]);

	return (
		<div key={id} id="playlist-container">
			<div id="playlist-heading">
				<img src={defaultAlbumCover} alt="" />
				<div id="playlist-heading-text">{playlist?.name}</div>
				<div id="playlist-controls">
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
						<div id="playlist-delete-btn" className="playlist-heading-btn btn-hover-animation" onClick={deletePlaylist} onMouseEnter={() => startAnimation(lottieDeletePlaylistRef)} onMouseLeave={() => stopAnimation(lottieDeletePlaylistRef)}>
							<Lottie id="delete-icon" animationData={trashIcon} lottieRef={lottieDeletePlaylistRef} loop={false} autoplay={false} />
						</div>
					</ToolTip>
					<div id="playlist-menu-btn" className="playlist-heading-btn btn-hover-animation">
						<Lottie id="menu-icon" animationData={menuIcon} lottieRef={lottieShowMenuRef} loop={false} autoplay={false} />
					</div>
				</div>
			</div>
			<div id="divider" />
			<div id="playlist-content">
				{tracks.length > 0 && (
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
						<SortableContext items={tracks} strategy={verticalListSortingStrategy}>
							{tracks &&
								tracks.map((track) => (
									<PlaylistTrack
										key={track.id}
										id={track.id}
										track={track}
										onContextMenu={(e) => {
											e.preventDefault();
											setVisibility(true);
											setPosition({
												x: e.pageX,
												y: e.pageY
											});
											// FIXME: not sure if e.pageX/Y returns the correct value.
											// console.log('right click', e.pageX, e.pageY);
										}}
									/>
								))}
						</SortableContext>
					</DndContext>
				)}
			</div>
			{visibility && (
				<ContextMenu y={position.y} x={position.x}>
					<ContextMenuItem header="Play Next" staticIcon={addTopIcon} type="default" />
					<ContextMenuItem header="Play Later" staticIcon={addBottomIcon} type="default" />
					<ContextMenuItem header="Delete from Playlist" staticIcon={deleteIcon} type="danger" />
				</ContextMenu>
			)}
		</div>
	);
});

export default Playlist;
