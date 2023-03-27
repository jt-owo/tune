import { FC, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import style from './NavlistButton.module.scss';

interface NavlistButtonProps {
	animation: unknown;
	doLoop: boolean;
	title: string;
}

const NavlistButton: FC<NavlistButtonProps> = (props) => {
	const { animation, doLoop, title } = props;

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
		<div className={style.container} onMouseEnter={startAnimation} onMouseLeave={stopAnimation}>
			<Lottie className={style.lottie} animationData={animation} loop={doLoop} lottieRef={lottieRef} autoplay={false} />
			<div>{title}</div>
		</div>
	);
};

export default NavlistButton;
