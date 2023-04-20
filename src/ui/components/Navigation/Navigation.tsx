/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { KeyboardEvent, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { addPlaylist } from '../../../state/slices/playlistsSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useToggle from '../../hooks/useToggle';
import { addAlert } from '../../../state/slices/alertSlice';
import AppRoutes from '../../routes';

import NavlistButton from './NavlistButton/NavlistButton';
import TextBox from '../TextBox/TextBox';

import logo from '../../../../assets/images/logo.png';
import iconPlus from '../../../../assets/ui-icons/plus-solid.svg';
import homeIcon from '../../../../assets/animations/home.json';
import browseIcon from '../../../../assets/animations/explore.json';
import libraryIcon from '../../../../assets/animations/folder.json';
import settingsIcon from '../../../../assets/animations/settings.json';

import defaultAlbumCover from '../../../../assets/images/tune_no_artwork.svg';

import styles from './Navigation.module.scss';

const Navigation = (): JSX.Element => {
	const [addNew, toggleAddNew] = useToggle();
	const [newPlaylistName, setNewPlaylistName] = useState('');

	const location = useLocation();

	const playlists = useAppSelector((state) => state.playlists.local);
	const pinnedPlaylists = playlists.filter((x) => x.pinned);

	const dispatch = useAppDispatch();

	const handleKeyDown = async (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			toggleAddNew();
			return;
		}

		if (event.key === 'Enter') {
			toggleAddNew();
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
		<nav className={styles['nav-bar-container']}>
			<ul className={styles['nav-bar']}>
				<li>
					<img src={logo} alt="logo" className={styles['nav-bar-logo']} draggable="false" />
				</li>
				<li>
					<NavLink to={AppRoutes.Home} className={`${styles['nav-btn']} ${styles['btn-hover-animation']} ${styles['home-btn']} ${location.pathname === AppRoutes.Home ? styles.active : ''}`} draggable="false">
						<NavlistButton animation={homeIcon} doLoop={false} title="Home" />
					</NavLink>
				</li>
				<li>
					<NavLink to={AppRoutes.Browse} className={`${styles['nav-btn']} ${styles['btn-hover-animation']} ${styles['browse-btn']} ${location.pathname === AppRoutes.Browse ? styles.active : ''}`} draggable="false">
						<NavlistButton animation={browseIcon} doLoop={false} title="Browse" />
					</NavLink>
				</li>
				<li>
					<NavLink to={AppRoutes.Library} className={`${styles['nav-btn']} ${styles['btn-hover-animation']} ${styles['library-btn']} ${location.pathname === AppRoutes.Library ? styles.active : ''}`} draggable="false">
						<NavlistButton animation={libraryIcon} doLoop={false} title="Library" />
					</NavLink>
				</li>
				<li className={styles['pinned-playlist-section']}>
					<h2>PLAYLISTS</h2>
					<div className={styles['new-playlist-btn']} onClick={() => toggleAddNew()}>
						<img src={iconPlus} alt="" />
						New
					</div>
				</li>
				<li>
					<div className={styles.spacer} />
				</li>
				<li>
					{addNew && <TextBox placeholder="Name..." className={styles['new-playlist-name-field']} autoFocus onBlur={() => toggleAddNew()} onChange={(e) => setNewPlaylistName(e.target.value)} onKeyDown={handleKeyDown} />}
					{pinnedPlaylists?.map((playlist) => {
						return (
							<NavLink to={`${AppRoutes.Playlist}/${playlist.id}/${playlist.service}`} title={playlist.name} key={playlist.id} className={`${styles['playlist-btn']} ${styles['btn-hover-animation']} ${location.pathname === `${AppRoutes.Playlist}/${playlist.id}` ? styles.active : ''}`} draggable="false">
								<div className={styles['playlist-navitem']}>
									<img src={defaultAlbumCover} alt="" className={styles['playlist-navitem-img']} />
									<div className={styles['playlist-navitem-name']}>{playlist.name}</div>
								</div>
							</NavLink>
						);
					})}
				</li>
				<li>
					<NavLink to={AppRoutes.Settings} className={`${styles['nav-btn']} ${styles['btn-hover-animation']} ${styles['settings-btn']} ${location.pathname === AppRoutes.Settings ? styles.active : ''}`} draggable="false">
						<NavlistButton animation={settingsIcon} doLoop={false} title="Settings" />
					</NavLink>
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
