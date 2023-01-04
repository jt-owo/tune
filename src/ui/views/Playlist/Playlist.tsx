/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-shadow */
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { removePlaylist, selectPlaylists, updatePlaylist } from '../../../state/slices/playlistSlice';
import { PlaylistData, TrackData } from '../../../typings/playlist';
import { setQueue } from '../../../state/slices/playerSlice';
import ItemTypes from '../../components/DragAndDrop/ItemTypes';
import newGuid from '../../util';

import PlaylistTrack from './PlaylistTrack/PlaylistTrack';
import ToolTip from '../../components/ToolTip/ToolTip';
import AppRoutes from '../../routes';

import playIcon from '../../../../assets/ui-icons/play.svg';
import folderIcon from '../../../../assets/animations/folder.json';
import trashIcon from '../../../../assets/animations/trash.json';
import menuIcon from '../../../../assets/animations/menuV4.json';

import defaultAlbumCover from '../../../../assets/images/tune_no_artwork.svg';

import './Playlist.scss';

const Playlist: FC = memo(function Playlist() {
	const { id } = useParams();

	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const playlists = useAppSelector(selectPlaylists);
	const [playlist, setPlaylist] = useState(playlists.find((x) => x.id === id));
	const [tracks, setTracks] = useState<TrackData[]>([]);

	const lottieShowMenuRef = useRef<LottieRefCurrentProps>(null);
	const lottieAddTracksRef = useRef<LottieRefCurrentProps>(null);
	const lottieDeletePlaylistRef = useRef<LottieRefCurrentProps>(null);

	if (!playlist) {
		navigate(AppRoutes.Library);
	}

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

		const paths = await window.ipc.system.selectFiles();

		let index = 0;
		paths.forEach((path) => {
			if (updateData.tracks.length > 0) {
				const values = updateData.tracks.map((p) => p.sortIndex);
				index = Math.max(...values) + 1;
			}

			updateData.tracks.push({
				filePath: path,
				fileName: '',
				fileExt: '',
				id: newGuid(),
				sortIndex: index
			});
		});

		dispatch(updatePlaylist(updateData));
		setTracks(updateData.tracks);
	};

	const playPlaylist = () => {
		if (!playlist) return;

		dispatch(setQueue(playlist.tracks));
	};

	const startAnimation = (e: React.RefObject<LottieRefCurrentProps>) => {
		e?.current?.setDirection(1);
		e?.current?.play();
	};
	const stopAnimation = (e: React.RefObject<LottieRefCurrentProps>) => {
		e?.current?.setDirection(-1);
		e?.current?.play();
	};

	const findTrack = useCallback(
		(id: string) => {
			const card = tracks?.filter((c) => `${c.id}` === id)[0] as TrackData;
			return {
				card,
				index: tracks?.indexOf(card)
			};
		},
		[tracks]
	);

	const moveTrack = useCallback(
		(id: string, atIndex: number) => {
			const { card, index } = findTrack(id);
			const updateData = update(tracks, {
				$splice: [
					[index, 1],
					[atIndex, 0, card]
				]
			});
			setTracks(updateData);
			dispatch(
				updatePlaylist({
					...playlist,
					tracks: updateData
				} as PlaylistData)
			);
		},
		[findTrack, tracks, dispatch, playlist]
	);

	const [, drop] = useDrop(() => ({ accept: ItemTypes.TRACK }));

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
					<div ref={drop}>
						<ul>{tracks && tracks.map((track) => <PlaylistTrack key={track.id} id={`${track.id}`} track={track} moveTrack={moveTrack} findTrack={findTrack} />)}</ul>
					</div>
				)}
			</div>
		</div>
	);
});

export default Playlist;
