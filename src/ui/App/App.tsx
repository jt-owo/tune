import { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AppRoutes, { AppRoutesParams } from '../routes';
import { useAppDispatch } from '../hooks';
import { loadPlaylists, loadSpotifyPlaylists } from '../../state/slices/playlistsSlice';
import { updateUser, updateSpotifyToken } from '../../state/slices/userSlice';

import SpotifyAPI from '../api/spotify';

import Titlebar from '../components/Titlebar/Titlebar';
import Home from '../views/Home/Home';
import Library from '../views/Library/Library';
import Browse from '../views/Browse/Browse';
import Playlist from '../views/Playlist/Playlist';
import Settings from '../views/Settings/Settings';
import Navigation from '../components/Navigation/Navigation';
import Queue from '../components/Queue/Queue';
import AlertContainer from '../components/Alert/Alert';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';

import './App.scss';

const App = (): JSX.Element => {
	const dispatch = useAppDispatch();

	// Load local playlists.
	dispatch(loadPlaylists());

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
			<Titlebar />
			<Router>
				<Navigation />
				<Routes>
					<Route path={AppRoutes.Home} element={<Home />} />
					<Route path={AppRoutes.Library} element={<Library />} />
					<Route path={AppRoutes.Browse} element={<Browse />} />
					<Route path={AppRoutesParams.PlaylistParams} element={<Playlist />} />
					<Route path={AppRoutes.Settings} element={<Settings />} />
				</Routes>
			</Router>
			<AudioPlayer />
			<Queue />
			<AlertContainer />
		</div>
	);
};

export default App;
