/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import style from './HamburgerMenuItem.module.scss';

interface HamburgerMenuItemProps {
	title: string;
	useLottie?: boolean;
	icon?: string;
	isActive?: boolean;
	lottieIcon?: unknown;
	lottieActiveFrame?: number;
	lottieInactiveFrame?: number;
	onClick?: () => void;
}

export type Props = HamburgerMenuItemProps;

const HamburgerMenuItem: FC<HamburgerMenuItemProps> = (props) => {
	const { title, icon, useLottie, lottieIcon, isActive, lottieActiveFrame, lottieInactiveFrame, onClick } = props;

	const lottieRef = useRef<LottieRefCurrentProps>(null);

	useEffect(() => {
		if (lottieRef.current && lottieActiveFrame && lottieInactiveFrame) {
			if (isActive) {
				lottieRef.current.playSegments([lottieInactiveFrame, lottieActiveFrame], true);
			} else {
				lottieRef.current.playSegments([lottieActiveFrame, lottieInactiveFrame], true);
			}
		}
	}, [isActive, lottieActiveFrame, lottieInactiveFrame]);

	return (
		<div className={`${style.container}`} onClick={onClick}>
			{useLottie ? <Lottie animationData={lottieIcon} loop={false} className={style.lottie} lottieRef={lottieRef} /> : <img src={icon} alt="" className={style.icon} />}
			<div className={style.title}>{title}</div>
		</div>
	);
};

export default HamburgerMenuItem;
