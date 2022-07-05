/* eslint-disable import/no-named-as-default */
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import AppRoutes from '../../routes';

import logo from '../../../../assets/images/logo.png';

import './Navigation.scss';

const Navigation: React.FC = () => {
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
				<li id="pinned-playlist-section">PLAYLISTS</li>
				<li>
					<NavLink to={AppRoutes.Playlist} title="Weeb" className="playlist-btn btn-hover-animation" id="playlist-btn" draggable="false">
						Playlist #1
					</NavLink>
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
