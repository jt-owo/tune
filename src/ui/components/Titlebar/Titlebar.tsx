/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import * as React from 'react';

import './Titlebar.scss';

const Titlebar: React.FC = () => {
	const title = document.querySelector('title');

	const minimize = () => {
		// window.electron.mainWindow.minimize();
	};

	const maximize = () => {
		// window.electron.mainWindow.maximize();
	};

	const close = () => {
		// window.electron.mainWindow.close();
	};

	return (
		<nav id="titlebar">
			<div id="title">{title?.innerHTML || 'tune.'}</div>
			<div id="buttons">
				<div id="minimize" role="button" onClick={minimize}>
					<span>_</span>
				</div>
				<div id="maximize" role="button" onClick={maximize}>
					<span>■</span>
				</div>
				<div id="close" role="button" onClick={close}>
					<span>&times;</span>
				</div>
			</div>
		</nav>
	);
};

export default Titlebar;
