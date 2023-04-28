import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { RefObject, useEffect, useRef } from 'react';

import audioPlayerStyles from '../../AudioPlayer.module.scss';
import styles from './PlayPauseButton.module.scss';

interface PlayPauseButtonProps {
	animationData: unknown;
	isPlaying: boolean;
	onClick: (ref: RefObject<LottieRefCurrentProps>) => void;
}

const PLAY_FRAME = 7;

const PlayPauseButton = ({ isPlaying, animationData, onClick }: PlayPauseButtonProps): JSX.Element => {
	const lottieRef = useRef<LottieRefCurrentProps>(null);

	useEffect(() => {
		lottieRef.current?.setSpeed(2);

		if (!isPlaying) lottieRef.current?.setDirection(1);
		else lottieRef.current?.setDirection(-1);

		lottieRef.current?.play();
	}, [isPlaying]);

	useEffect(() => {
		lottieRef?.current?.goToAndStop(PLAY_FRAME, true);
	}, []);

	return (
		<div onClick={() => onClick(lottieRef)}>
			<Lottie id={styles['play-btn']} className={audioPlayerStyles['player-control-icon']} animationData={animationData} loop={false} lottieRef={lottieRef} autoplay={false} />
		</div>
	);
};

export default PlayPauseButton;
