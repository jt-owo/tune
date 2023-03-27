/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import audioPlayerStyle from '../AudioPlayer.module.scss';
import style from './AudioControlButton.module.scss';

interface AudioControlButtonProps {
	animationData: unknown;
	id: string;
	onClick: () => void;
}

const AudioControlButton: FC<AudioControlButtonProps> = (props) => {
	const { animationData, id, onClick } = props;

	const lottieRef = useRef<LottieRefCurrentProps>(null);

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
		<div className={style['player-control-container']} onClick={() => handleOnClick()}>
			<Lottie className={`${audioPlayerStyle['player-control-icon']} ${audioPlayerStyle[id]}`} animationData={animationData} loop={false} lottieRef={lottieRef} autoplay={false} />
		</div>
	);
};

export default AudioControlButton;
