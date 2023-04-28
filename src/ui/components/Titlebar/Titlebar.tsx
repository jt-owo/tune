import maximizeIcon from '../../../../assets/ui-icons/titlebar-win/square-regular.svg';
import minimizeIcon from '../../../../assets/ui-icons/titlebar-win/minus-solid.svg';
import closeIcon from '../../../../assets/ui-icons/titlebar-win/x-solid.svg';
import UpdateButton from './UpdateButton/UpdateButton';

import styles from './Titlebar.module.scss';

const Titlebar = (): JSX.Element => {
	if (window.process.platform === 'darwin') return <div id="macos-titlebar" />;

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
		<nav className={styles.titlebar}>
			<UpdateButton />
			<div className={styles.buttons}>
				<div className={styles.minimize} role="button" onClick={minimize}>
					<img src={minimizeIcon} alt="" />
				</div>
				<div className={styles.maximize} role="button" onClick={maximize}>
					<img src={maximizeIcon} alt="" />
				</div>
				<div className={styles.close} role="button" onClick={close}>
					<img src={closeIcon} alt="" />
				</div>
			</div>
		</nav>
	);
};

export default Titlebar;
