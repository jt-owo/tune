import { FC } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAppDispatch } from './hooks';
import { loadPlaylists } from '../state/slices/playlistSlice';
import AppRoutes, { AppRoutesParams } from './routes';
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
	dispatch(loadPlaylists());

	return (
		<div id="app-container">
			{window.process.platform !== 'darwin' ? <Titlebar /> : <div id="macos-titlebar" />}
			<Router>
				<Navigation />
				<Routes>
					<Route path={AppRoutes.Home} element={<Home />} />
					<Route path={AppRoutes.Library} element={<Library />} />
					<Route path={AppRoutes.Browse} element={<Browse />} />
					<Route
						path={AppRoutesParams.PlaylistID}
						element={
							<DndProvider backend={HTML5Backend}>
								<Playlist />
							</DndProvider>
						}
					/>
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
