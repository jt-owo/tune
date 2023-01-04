/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { FC, RefObject, useEffect, useRef } from 'react';

interface PlayPauseButtonProps {
	animationData: unknown;
	isPlaying: boolean;
	onClick: (ref: RefObject<LottieRefCurrentProps>) => void;
}

const PLAY_PAUSE_BUTTON_PLAY_FRAME = 7;

const PlayPauseButton: FC<PlayPauseButtonProps> = (props) => {
	const { animationData, isPlaying, onClick } = props;

	const lottieRef = useRef<LottieRefCurrentProps>(null);

	useEffect(() => {
		lottieRef.current?.setSpeed(2);
		if (!isPlaying) {
			lottieRef.current?.setDirection(1);
		} else {
			lottieRef.current?.setDirection(-1);
		}
		lottieRef.current?.play();
	}, [isPlaying]);

	useEffect(() => {
		lottieRef?.current?.goToAndStop(PLAY_PAUSE_BUTTON_PLAY_FRAME, true);
	}, []);

	return (
		<div className="player-control-container" onClick={() => onClick(lottieRef)}>
			<Lottie id="play-btn" className="player-control-icon" animationData={animationData} loop={false} lottieRef={lottieRef} autoplay={false} />
		</div>
	);
};

export default PlayPauseButton;
