import * as React from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import './NavlistButton.scss';

interface NavlistButtonProps {
	animation: unknown;
	doLoop: boolean;
	title: string;
}

const NavlistButton: React.FC<NavlistButtonProps> = (props) => {
	const { animation, doLoop, title } = props;

	const lottieRef = React.useRef<LottieRefCurrentProps>(null);

	const startAnimation = () => {
		lottieRef?.current?.setDirection(1);
		lottieRef?.current?.play();
	};
	const stopAnimation = () => {
		lottieRef?.current?.setDirection(-1);
		lottieRef?.current?.play();
	};

	return (
		<div id="container" onMouseEnter={startAnimation} onMouseLeave={stopAnimation}>
			<Lottie id="lottie" animationData={animation} loop={doLoop} lottieRef={lottieRef} autoplay={false} />
			<div>{title}</div>
		</div>
	);
};

export default NavlistButton;
