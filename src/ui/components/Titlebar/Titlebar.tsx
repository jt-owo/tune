/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC } from 'react';

import './Titlebar.scss';

import maximizeIcon from '../../../../assets/ui-icons/titlebar-win/square-regular.svg';
import minimizeIcon from '../../../../assets/ui-icons/titlebar-win/minus-solid.svg';
import closeIcon from '../../../../assets/ui-icons/titlebar-win/x-solid.svg';

const Titlebar: FC = () => {
	const minimize = () => {
		window.api.minimize();
	};

	const maximize = () => {
		window.api.maximize();
	};

	const close = () => {
		window.api.close();
	};

	return (
		<nav id="titlebar">
			<div id="buttons">
				<div id="minimize" role="button" onClick={minimize}>
					<img src={minimizeIcon} alt="" />
				</div>
				<div id="maximize" role="button" onClick={maximize}>
					<img src={maximizeIcon} alt="" />
				</div>
				<div id="close" role="button" onClick={close}>
					<img src={closeIcon} alt="" />
				</div>
			</div>
		</nav>
	);
};

export default Titlebar;
