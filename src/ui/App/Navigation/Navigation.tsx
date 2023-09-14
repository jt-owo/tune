import { KeyboardEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { addPlaylist } from '../../../state/slices/playlistsSlice';
import { addAlert } from '../../../state/slices/alertSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useToggle from '../../hooks/useToggle';
import AppRoutes from '../../routes';
import Format from '../../util/format';

import NavlistButton from './NavlistButton/NavlistButton';
import TextBox from '../../components/TextBox/TextBox';

import logo from '../../../../assets/images/logo.png';
import iconPlus from '../../../../assets/ui-icons/plus-solid.svg';
import homeIcon from '../../../../assets/animations/home.json';
import browseIcon from '../../../../assets/animations/explore.json';
import libraryIcon from '../../../../assets/animations/folder.json';
import settingsIcon from '../../../../assets/animations/settings.json';
import chevron from '../../../../assets/ui-icons/chevron-right.svg';

import styles from './Navigation.module.scss';
import ControlCenter from '../AudioPlayer/AudioControls/ControlCenter/ControlCenter';

interface NavigationProps {
	audioRef: React.RefObject<TuneHTMLAudioElement>;
}

const Navigation = ({ audioRef }: NavigationProps): JSX.Element => {
	const [addNew, toggleAddNew] = useToggle();
	const [newPlaylistName, setNewPlaylistName] = useState('');

	const navigate = useNavigate();
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
					<img src={logo} alt="logo" className={styles['nav-bar-logo']} draggable={false} />
				</li>
				<li>
					<Link to={AppRoutes.Home} className={`${styles['nav-btn']} ${styles['btn-hover-animation']} ${styles['home-btn']} ${location.pathname === AppRoutes.Home ? styles.active : ''}`} draggable={false}>
						<NavlistButton animation={homeIcon} doLoop={false} title="Home" />
					</Link>
				</li>
				<li>
					<Link to={AppRoutes.Browse} className={`${styles['nav-btn']} ${styles['btn-hover-animation']} ${styles['browse-btn']} ${location.pathname === AppRoutes.Browse ? styles.active : ''}`} draggable={false}>
						<NavlistButton animation={browseIcon} doLoop={false} title="Browse" />
					</Link>
				</li>
				<li>
					<Link to={AppRoutes.Library} className={`${styles['nav-btn']} ${styles['btn-hover-animation']} ${styles['library-btn']} ${location.pathname === AppRoutes.Library ? styles.active : ''}`} draggable={false}>
						<NavlistButton animation={libraryIcon} doLoop={false} title="Library" />
					</Link>
				</li>
				<li>
					<Link to={AppRoutes.Settings} className={`${styles['nav-btn']} ${styles['btn-hover-animation']} ${styles['settings-btn']} ${location.pathname === AppRoutes.Settings ? styles.active : ''}`} draggable={false}>
						<NavlistButton animation={settingsIcon} doLoop={false} title="Settings" />
					</Link>
				</li>
				<li className={styles['pinned-playlist-section']}>
					<h2>PLAYLISTS</h2>
					<div className={styles['new-playlist-btn']} onClick={() => toggleAddNew()}>
						<img src={iconPlus} alt="" />
						New
					</div>
				</li>
				<li>
					<div className={styles['horizontal-spacer']} />
				</li>
				<li>
					{addNew && <TextBox placeholder="Name..." className={styles['new-playlist-name-field']} autoFocus onBlur={() => toggleAddNew()} onChange={(e) => setNewPlaylistName(e.target.value)} onKeyDown={handleKeyDown} />}
					{pinnedPlaylists?.map((playlist) => {
						return (
							<Link to={`${AppRoutes.Playlist}/${playlist.id}/${playlist.service}`} title={playlist.name} key={playlist.id} className={`${styles['playlist-btn']} ${styles['btn-hover-animation']} ${location.pathname === `${AppRoutes.Playlist}/${playlist.id}/${playlist.service}` ? styles.active : ''}`} draggable={false}>
								<div className={styles['playlist-navitem']}>
									<img src={Format.getImage(playlist.images)} alt="" className={styles['playlist-navitem-img']} />
									<div className={styles['playlist-navitem-name']}>{playlist.name}</div>
								</div>
							</Link>
						);
					})}
				</li>
				<li className={styles['control-center-spacer']}>
					<div className={styles['horizontal-spacer']} />
				</li>
				<li className={styles['control-center']}>
					<ControlCenter audioRef={audioRef} />
				</li>
			</ul>
			<div id={styles['history-button-container']}>
				<button type="button" onClick={() => navigate(-1)}>
					<img src={chevron} alt="" />
				</button>
				<div className={styles['vertical-spacer']} />
				<button type="button" onClick={() => navigate(1)}>
					<img src={chevron} alt="" />
				</button>
			</div>
		</nav>
	);
};

export default Navigation;
