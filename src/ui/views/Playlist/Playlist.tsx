/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { removePlaylist, selectPlaylists, updatePlaylist } from '../../../state/slices/playlistSlice';
import { PlaylistData, TrackData } from '../../../typings/playlist';
import { setQueue, setTrack } from '../../../state/slices/playerSlice';
import PlaylistTrack from './PlaylistTrack/PlaylistTrack';
import AppRoutes from '../../routes';

import playIcon from '../../../../assets/ui-icons/simple-play-btn.svg';
import shuffleIcon from '../../../../assets/ui-icons/shuffle-svgrepo-com.svg';
import optionIcon from '../../../../assets/ui-icons/three-dots.svg';

import './Playlist.scss';

const Playlist: React.FC = () => {
	const { id } = useParams();

	const navigate = useNavigate();

	const playlists = useAppSelector(selectPlaylists);
	const [playlist, setPlaylist] = useState(playlists.find((x) => x.id === id));

	if (!playlist) {
		navigate(AppRoutes.Library);
	}

	const [tracks, setTracks] = useState([...playlist!.tracks]);

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

		const paths = await window.electron.ipc.playlist.addTracks();

		let index = 0;
		paths.forEach((path) => {
			if (updateData.tracks!.length > 0) {
				const values = updateData.tracks!.map((p) => p.sortIndex);
				index = Math.max(...values) + 1;
			}

			updateData.tracks!.push({
				filePath: path,
				fileName: '',
				fileExt: '',
				sortIndex: index
			});
		});

		dispatch(updatePlaylist(updateData));
		setTracks(updateData.tracks);
	};

	const setCurrentTrack = (track: TrackData) => {
		dispatch(setTrack(track));
	};

	const playPlaylist = () => {
		dispatch(setQueue(playlist!.tracks));
	};

	useEffect(() => {
		const playlistFound = playlists.find((x) => x.id === id);

		if (playlistFound) {
			setPlaylist(playlistFound);
		}
	}, [playlists, id]);

	return (
		<div key={id} id="playlist-container">
			<div id="playlist-heading">
				{playlist?.name}
				<div id="playlist-play-btn" className="playlist-heading-btn btn-hover-animation" onClick={playPlaylist}>
					<img id="play-icon" src={playIcon} alt="" draggable="false" />
				</div>
				<div id="playlist-shuffle-btn" className="playlist-heading-btn btn-hover-animation" onClick={handleAddTracks}>
					<img id="shuffle-icon" src={shuffleIcon} alt="" draggable="false" />
				</div>
				<div id="playlist-option-btn" className="playlist-heading-btn btn-hover-animation" onClick={deletePlaylist}>
					<img id="option-icon" src={optionIcon} alt="" draggable="false" />
				</div>
			</div>
			<div id="divider" />
			<div id="playlist-content">
				<ul>
					{tracks &&
						[...tracks]
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
