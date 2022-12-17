/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { removePlaylist, selectPlaylists, updatePlaylist } from '../../../state/slices/playlistSlice';
import { PlaylistData, TrackData } from '../../../typings/playlist';
import { setQueue, setTrack } from '../../../state/slices/playerSlice';
import PlaylistTrack from './PlaylistTrack/PlaylistTrack';
import AppRoutes from '../../routes';

import playIcon from '../../../../assets/ui-icons/simple-play-btn.svg';

import folderIcon from '../../../../assets/animations/folder.json';
import trashIcon from '../../../../assets/animations/trash.json';

import './Playlist.scss';

const Playlist: React.FC = () => {
	const { id } = useParams();

	const navigate = useNavigate();

	const playlists = useAppSelector(selectPlaylists);
	const [playlist, setPlaylist] = useState(playlists.find((x) => x.id === id));

	const lottiePlayPlaylistRef = React.useRef<LottieRefCurrentProps>(null);
	const lottieAddTracksRef = React.useRef<LottieRefCurrentProps>(null);
	const lottieDeletePlaylistRef = React.useRef<LottieRefCurrentProps>(null);

	if (!playlist) {
		navigate(AppRoutes.Library);
	}

	const dispatch = useAppDispatch();

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
				sortIndex: index
			});
		});

		dispatch(updatePlaylist(updateData));
		setPlaylist(updateData);
	};

	const setCurrentTrack = (track: TrackData) => {
		dispatch(setTrack(track));
	};

	const playPlaylist = () => {
		if (!playlist) return;

		dispatch(setQueue(playlist.tracks));
	};

	useEffect(() => {
		const playlistFound = playlists.find((x) => x.id === id);
		if (playlistFound) setPlaylist(playlistFound);
	}, [playlists, id]);

	const startAnimation = (e: React.RefObject<LottieRefCurrentProps>) => {
		e?.current?.setDirection(1);
		e?.current?.play();
	};
	const stopAnimation = (e: React.RefObject<LottieRefCurrentProps>) => {
		e?.current?.setDirection(-1);
		e?.current?.play();
	};

	return (
		<div key={id} id="playlist-container">
			<div id="playlist-heading">
				<div id="playlist-heading-text">{playlist?.name}</div>
				<div id="playlist-controls">
					<div id="playlist-play-btn" className="playlist-heading-btn btn-hover-animation" onClick={playPlaylist}>
						<img id="play-icon" src={playIcon} alt="" draggable="false" />
					</div>
					<div id="playlist-import-btn" className="playlist-heading-btn btn-hover-animation" onClick={handleAddTracks} onMouseEnter={() => startAnimation(lottieAddTracksRef)} onMouseLeave={() => stopAnimation(lottieAddTracksRef)}>
						<Lottie id="import-icon" animationData={folderIcon} lottieRef={lottieAddTracksRef} loop={false} autoplay={false} />
					</div>
					<div id="playlist-delete-btn" className="playlist-heading-btn btn-hover-animation" onClick={deletePlaylist} onMouseEnter={() => startAnimation(lottieDeletePlaylistRef)} onMouseLeave={() => stopAnimation(lottieDeletePlaylistRef)}>
						<Lottie id="delete-icon" animationData={trashIcon} lottieRef={lottieDeletePlaylistRef} loop={false} autoplay={false} />
					</div>
				</div>
			</div>
			<div id="divider" />
			<div id="playlist-content">
				<ul>
					{playlist?.tracks &&
						[...playlist.tracks]
							.sort((a, b) => (a.sortIndex > b.sortIndex ? 1 : -1))
							.map((track) => {
								return <PlaylistTrack key={track.sortIndex} track={track} setCurrentTrack={setCurrentTrack} />;
							})}
				</ul>
			</div>
		</div>
	);
};

export default Playlist;
