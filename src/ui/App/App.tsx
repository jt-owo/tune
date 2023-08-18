import { useEffect, useRef } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AppRoutes, { AppRoutesParams } from '../routes';
import { useAppDispatch } from '../hooks';
import { loadPlaylists, loadSpotifyPlaylists } from '../../state/slices/playlistsSlice';
import { updateUser, updateSpotifyToken } from '../../state/slices/userSlice';
import SpotifyAPI from '../api/spotify';

import TitleBar from './Titlebar/Titlebar';
import Navigation from './Navigation/Navigation';
import AudioPlayer from './AudioPlayer/AudioPlayer';
import Queue from './Queue/Queue';

import Home from '../views/Home/Home';
import Library from '../views/Library/Library';
import Browse from '../views/Browse/Browse';
import Playlist from '../views/Playlist/Playlist';
import Settings from '../views/Settings/Settings';
import AlertContainer from '../components/Alert/Alert';

import styles from './App.module.scss';

const App = (): JSX.Element => {
	const dispatch = useAppDispatch();
	dispatch(loadPlaylists());

	const audioRef = useRef<TuneHTMLAudioElement>(null);

	useEffect(() => {
		const loadSpotifyContent = async (accessToken: string) => {
			const user = await SpotifyAPI.fetchUserProfile(accessToken);
			const playlists = await SpotifyAPI.fetchUserPlaylists(accessToken);
			dispatch(loadSpotifyPlaylists(playlists));
			dispatch(updateUser(user));
		};

		const token = SpotifyAPI.getToken();

		if (token) {
			dispatch(updateSpotifyToken(token));
			loadSpotifyContent(token);
		}
	}, [dispatch]);

	return (
		<div id={styles['app-container']}>
			<TitleBar />
			<Router>
				<Navigation audioRef={audioRef} />
				<Routes>
					<Route path={AppRoutes.Home} element={<Home />} />
					<Route path={AppRoutes.Library} element={<Library />} />
					<Route path={AppRoutes.Browse} element={<Browse />} />
					<Route path={AppRoutesParams.PlaylistParams} element={<Playlist />} />
					<Route path={AppRoutes.Settings} element={<Settings />} />
				</Routes>
			</Router>
			<AudioPlayer audioRef={audioRef} />
			<Queue />
			<AlertContainer />
		</div>
	);
};

export default App;
