import { useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import styles from './NavlistButton.module.scss';

interface NavlistButtonProps {
	animation: unknown;
	doLoop: boolean;
	title: string;
}

const NavlistButton = ({ animation, doLoop, title }: NavlistButtonProps): JSX.Element => {
	const lottieRef = useRef<LottieRefCurrentProps>(null);

	const startAnimation = () => {
		lottieRef?.current?.setDirection(1);
		lottieRef?.current?.play();
	};
	const stopAnimation = () => {
		lottieRef?.current?.setDirection(-1);
		lottieRef?.current?.play();
	};

	return (
		<div className={styles.container} onMouseEnter={startAnimation} onMouseLeave={stopAnimation}>
			<Lottie className={styles.lottie} animationData={animation} loop={doLoop} lottieRef={lottieRef} autoplay={false} />
			<div>{title}</div>
		</div>
	);
};

export default NavlistButton;
