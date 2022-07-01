/* eslint-disable import/no-named-as-default */
/* eslint-disable @typescript-eslint/no-shadow */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AppRoutes from './routes';
import Titlebar from './components/Titlebar/Titlebar';
import Home from './views/Home/Home';
import Library from './views/Library/Library';
import Navigation from './components/Navigation/Navigation';
import Queue from './components/Queue/Queue';
import PlayerControls from './components/PlayerControls/PlayerControls';

import './Application.scss';

const Application: React.FC = () => {
	return (
		<div id="app-container">
			{window.process.platform !== 'darwin' ? <Titlebar /> : <div id="macos-titlebar" />}
			<Router>
				<Navigation />
				<Routes>
					<Route path={AppRoutes.Home} element={<Home />} />
					<Route path={AppRoutes.Library} element={<Library />} />
					<Route path={AppRoutes.Browse} element={<div />} />
					<Route path={AppRoutes.Settings} element={<div />} />
				</Routes>
			</Router>
			<PlayerControls />
			<Queue />
		</div>
	);
};

export default Application;
