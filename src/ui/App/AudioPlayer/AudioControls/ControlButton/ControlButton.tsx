import { useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import audioPlayerStyles from '../../AudioPlayer.module.scss';
import styles from './ControlButton.module.scss';

interface ControlButtonProps {
	id: 'skip-forward-btn' | 'skip-back-btn';
	animationData: unknown;
	onClick: () => void;
}

const ControlButton = ({ id, animationData, onClick }: ControlButtonProps): JSX.Element => {
	const lottieRef = useRef<LottieRefCurrentProps>(null);

	const startAnimation = () => {
		lottieRef.current?.setSpeed(4);
		lottieRef.current?.stop();
		lottieRef.current?.play();
	};

	const handleClick = () => {
		startAnimation();
		onClick();
	};

	return (
		<div className={styles['player-control-button']} onClick={handleClick}>
			<Lottie id={styles[id]} className={audioPlayerStyles['player-control-icon']} animationData={animationData} loop={false} lottieRef={lottieRef} autoplay={false} />
		</div>
	);
};

export default ControlButton;
