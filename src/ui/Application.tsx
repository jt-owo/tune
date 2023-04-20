import { FC, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AppRoutes, { AppRoutesParams } from './routes';
import { useAppDispatch } from './hooks';
import { setOutputDevice } from '../state/slices/playerSlice';
import { loadPlaylists, loadSpotifyPlaylists } from '../state/slices/playlistsSlice';
import { updateUser, updateSpotifyToken } from '../state/slices/userSlice';

import SpotifyAPI from './api/spotify';

import Titlebar from './components/Titlebar/Titlebar';
import Home from './views/Home/Home';
import Library from './views/Library/Library';
import Browse from './views/Browse/Browse';
import Playlist from './views/Playlist/Playlist';
import Settings from './views/Settings/Settings';
import Navigation from './components/Navigation/Navigation';
import Queue from './components/Queue/Queue';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import AlertContainer from './components/Alert/Alert';

import './Application.scss';

const Application: FC = () => {
	const dispatch = useAppDispatch();

	// Load local playlists.
	dispatch(loadPlaylists());

	// Load the saved output device id to the player.
	if (window.api) {
		dispatch(setOutputDevice(window.api.config.get('outputDeviceId').toString()));
	}

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
		<div id="app-container">
			{window.process.platform !== 'darwin' ? <Titlebar /> : <div id="macos-titlebar" />}
			<Router>
				<Navigation />
				<Routes>
					<Route path={AppRoutes.Home} element={<Home />} />
					<Route path={AppRoutes.Library} element={<Library />} />
					<Route path={AppRoutes.Browse} element={<Browse />} />
					<Route path={AppRoutesParams.PlaylistID} element={<Playlist />} />
					<Route path={AppRoutes.Settings} element={<Settings />} />
				</Routes>
			</Router>
			<AudioPlayer />
			<Queue />
			<AlertContainer />
		</div>
	);
};

export default Application;
