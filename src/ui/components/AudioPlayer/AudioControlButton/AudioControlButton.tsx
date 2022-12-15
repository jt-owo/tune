/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import React from 'react';

interface AudioControlButtonProps {
	animationData: unknown;
	id: string;
	onClick: () => void;
}

const AudioControlButton: React.FC<AudioControlButtonProps> = (props) => {
	const { animationData, id, onClick } = props;

	const lottieRef = React.useRef<LottieRefCurrentProps>(null);

	const startAnimation = () => {
		lottieRef.current?.setSpeed(4);
		lottieRef.current?.stop();
		lottieRef.current?.play();
	};

	const handleOnClick = () => {
		startAnimation();
		onClick();
	};

	return (
		<div className="player-control-container" onClick={() => handleOnClick()}>
			<Lottie id={id} className="player-control-icon" animationData={animationData} loop={false} lottieRef={lottieRef} autoplay={false} />
		</div>
	);
};

export default AudioControlButton;
