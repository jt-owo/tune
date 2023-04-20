/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import audioPlayerStyles from '../AudioPlayer.module.scss';
import styles from './AudioControlButton.module.scss';

interface AudioControlButtonProps {
	id: string;
	animationData: unknown;
	onClick: () => void;
}

const AudioControlButton = ({ animationData, id, onClick }: AudioControlButtonProps): JSX.Element => {
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
		<div className={styles['player-control-container']} onClick={handleClick}>
			<Lottie className={`${audioPlayerStyles['player-control-icon']} ${audioPlayerStyles[id]}`} animationData={animationData} loop={false} lottieRef={lottieRef} autoplay={false} />
		</div>
	);
};

export default AudioControlButton;
