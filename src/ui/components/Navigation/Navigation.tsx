/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { FC, KeyboardEvent, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { addPlaylist } from '../../../state/slices/playlistsSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addAlert } from '../../../state/slices/alertSlice';
import AppRoutes from '../../routes';

import NavlistButton from './NavlistButton/NavlistButton';

import logo from '../../../../assets/images/logo.png';
import iconPlus from '../../../../assets/ui-icons/plus-solid.svg';
import homeIcon from '../../../../assets/animations/home.json';
import browseIcon from '../../../../assets/animations/explore.json';
import libraryIcon from '../../../../assets/animations/folder.json';
import settingsIcon from '../../../../assets/animations/settings.json';

import defaultAlbumCover from '../../../../assets/images/tune_no_artwork.svg';

import style from './Navigation.module.scss';

const Navigation: FC = () => {
	const [createNew, setCreateNew] = useState(false);
	const [newPlaylistName, setNewPlaylistName] = useState('');

	const location = useLocation();

	const playlists = useAppSelector((state) => state.playlists.local);
	const pinnedPlaylists = playlists.filter((x) => x.pinned);

	const dispatch = useAppDispatch();

	const handleKeyPress = async (event: KeyboardEvent) => {
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
		<nav className={style['nav-bar-container']}>
			<ul className={style['nav-bar']}>
				<li>
					<img src={logo} alt="logo" className={style['nav-bar-logo']} draggable="false" />
				</li>
				<li>
					<NavLink to={AppRoutes.Home} className={`${style['nav-btn']} ${style['btn-hover-animation']} ${style['home-btn']} ${location.pathname === AppRoutes.Home ? style.active : ''}`} draggable="false">
						<NavlistButton animation={homeIcon} doLoop={false} title="Home" />
					</NavLink>
				</li>
				<li>
					<NavLink to={AppRoutes.Browse} className={`${style['nav-btn']} ${style['btn-hover-animation']} ${style['browse-btn']} ${location.pathname === AppRoutes.Browse ? style.active : ''}`} draggable="false">
						<NavlistButton animation={browseIcon} doLoop={false} title="Browse" />
					</NavLink>
				</li>
				<li>
					<NavLink to={AppRoutes.Library} className={`${style['nav-btn']} ${style['btn-hover-animation']} ${style['library-btn']} ${location.pathname === AppRoutes.Library ? style.active : ''}`} draggable="false">
						<NavlistButton animation={libraryIcon} doLoop={false} title="Library" />
					</NavLink>
				</li>
				<li className={style['pinned-playlist-section']}>
					<h2>PLAYLISTS</h2>
					<div className={style['new-playlist-btn']} onClick={() => setCreateNew(true)}>
						<img src={iconPlus} alt="" />
						New
					</div>
				</li>
				<li>
					<div className={style.spacer} />
				</li>
				<li>
					{createNew && <input type="text" placeholder="Name..." className={style['new-playlist-name-field']} autoFocus onBlur={() => setCreateNew(false)} onChange={(e) => setNewPlaylistName(e.target.value)} onKeyPress={handleKeyPress} />}
					{pinnedPlaylists?.map((playlist) => {
						return (
							<NavLink to={`${AppRoutes.Playlist}/${playlist.id}/${playlist.service}`} title={playlist.name} key={playlist.id} className={`${style['playlist-btn']} ${style['btn-hover-animation']} ${location.pathname === `${AppRoutes.Playlist}/${playlist.id}` ? style.active : ''}`} draggable="false">
								<div className={style['playlist-navitem']}>
									<img src={defaultAlbumCover} alt="" className={style['playlist-navitem-img']} />
									<div className={style['playlist-navitem-name']}>{playlist.name}</div>
								</div>
							</NavLink>
						);
					})}
				</li>
				<li>
					<NavLink to={AppRoutes.Settings} className={`${style['nav-btn']} ${style['btn-hover-animation']} ${style['settings-btn']} ${location.pathname === AppRoutes.Settings ? style.active : ''}`} draggable="false">
						<NavlistButton animation={settingsIcon} doLoop={false} title="Settings" />
					</NavLink>
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
