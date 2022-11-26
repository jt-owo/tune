/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import * as React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { addPlaylist, selectPlaylists } from '../../../state/slices/playlistSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addAlert } from '../../../state/slices/alertSlice';
import AppRoutes from '../../routes';

import logo from '../../../../assets/images/logo.png';

import './Navigation.scss';

const Navigation: React.FC = () => {
	const [createNew, setCreateNew] = useState(false);
	const [newPlaylistName, setNewPlaylistName] = useState('');

	const playlists = useAppSelector(selectPlaylists);
	const pinnedPlaylists = playlists.filter((x) => x.pinned);

	const dispatch = useAppDispatch();

	const handleKeyPress = async (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			setCreateNew(false);
			dispatch(addPlaylist(newPlaylistName));
			dispatch(
				addAlert({
					message: `Playlist '${newPlaylistName}' was successfully added.`,
					type: 'success',
					id: ''
				})
			);
		}
	};

	return (
		<nav id="nav-bar-container">
			<ul id="nav-bar">
				<li>
					<img src={logo} alt="logo" id="nav-bar-logo" draggable="false" />
				</li>
				<li>
					<NavLink to={AppRoutes.Home} className="nav-btn btn-hover-animation" id="home-btn" draggable="false">
						Home
					</NavLink>
				</li>
				<li>
					<NavLink to={AppRoutes.Browse} className="nav-btn btn-hover-animation" id="browse-btn" draggable="false">
						Browse
					</NavLink>
				</li>
				<li>
					<NavLink to={AppRoutes.Library} className="nav-btn btn-hover-animation" id="library-btn" draggable="false">
						Library
					</NavLink>
				</li>
				<li id="pinned-playlist-section">
					PLAYLISTS
					<div className="new-playlist-btn" onClick={() => setCreateNew(true)}>
						+
					</div>
				</li>
				<li>
					{createNew && <input type="text" placeholder="Name..." className="new-playlist-name-field" autoFocus onBlur={() => setCreateNew(false)} onChange={(e) => setNewPlaylistName(e.target.value)} onKeyPress={handleKeyPress} />}
					{pinnedPlaylists?.map((playlist) => {
						return (
							<NavLink to={`${AppRoutes.Playlist}/${playlist.id}`} title={playlist.name} key={playlist.id} className="playlist-btn btn-hover-animation" draggable="false">
								{playlist.name}
							</NavLink>
						);
					})}
				</li>
				<li>
					<NavLink to={AppRoutes.Settings} className="nav-btn btn-hover-animation" id="settings-btn" draggable="false">
						Settings
					</NavLink>
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
