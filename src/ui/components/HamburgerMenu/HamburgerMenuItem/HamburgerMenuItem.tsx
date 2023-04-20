/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import styles from './HamburgerMenuItem.module.scss';

export interface HamburgerMenuItemProps {
	title: string;
	useLottie?: boolean;
	icon?: string;
	isActive?: boolean;
	lottieIcon?: unknown;
	lottieActiveFrame?: number;
	lottieInactiveFrame?: number;
	hidden?: boolean;
	onClick?: () => void;
}

const HamburgerMenuItem = ({ title, icon, useLottie, lottieIcon, isActive, lottieActiveFrame, lottieInactiveFrame, hidden: hide, onClick }: HamburgerMenuItemProps): JSX.Element | null => {
	const lottieRef = useRef<LottieRefCurrentProps>(null);

	useEffect(() => {
		if (lottieRef.current && lottieActiveFrame && lottieInactiveFrame) {
			if (isActive) lottieRef.current.playSegments([lottieInactiveFrame, lottieActiveFrame], true);
			else lottieRef.current.playSegments([lottieActiveFrame, lottieInactiveFrame], true);
		}
	}, [isActive, lottieActiveFrame, lottieInactiveFrame]);

	if (hide) return null;

	return (
		<div className={`${styles.container}`} onClick={onClick}>
			{useLottie ? <Lottie animationData={lottieIcon} loop={false} className={styles.lottie} lottieRef={lottieRef} /> : <img src={icon} alt="" className={styles.icon} />}
			<div className={styles.title}>{title}</div>
		</div>
	);
};

export default HamburgerMenuItem;
