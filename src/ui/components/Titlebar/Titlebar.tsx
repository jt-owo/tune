/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC } from 'react';

import maximizeIcon from '../../../../assets/ui-icons/titlebar-win/square-regular.svg';
import minimizeIcon from '../../../../assets/ui-icons/titlebar-win/minus-solid.svg';
import closeIcon from '../../../../assets/ui-icons/titlebar-win/x-solid.svg';
import UpdateButton from './UpdateButton/UpdateButton';

import style from './Titlebar.module.scss';

const Titlebar: FC = () => {
	const minimize = () => {
		window.api?.minimize();
	};

	const maximize = () => {
		window.api?.maximize();
	};

	const close = () => {
		window.api?.close();
	};

	return (
		<nav className={style.titlebar}>
			<UpdateButton />
			<div className={style.buttons}>
				<div className={style.minimize} role="button" onClick={minimize}>
					<img src={minimizeIcon} alt="" />
				</div>
				<div className={style.maximize} role="button" onClick={maximize}>
					<img src={maximizeIcon} alt="" />
				</div>
				<div className={style.close} role="button" onClick={close}>
					<img src={closeIcon} alt="" />
				</div>
			</div>
		</nav>
	);
};

export default Titlebar;
