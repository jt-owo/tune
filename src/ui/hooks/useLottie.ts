import { useRef, useEffect } from 'react';
import { LottieRefCurrentProps } from 'lottie-react';

interface LottieProps {
	hoverFrame: number | undefined;
	activeFrame: number | undefined;
	active?: boolean;
}

const useLottie = ({ hoverFrame, activeFrame, active }: LottieProps) => {
	const ref = useRef<LottieRefCurrentProps>(null);

	const handleMouseEnter = () => {
		if (hoverFrame && ref.current) ref.current.goToAndStop(hoverFrame, true);
	};

	const handleMouseLeave = () => {
		if (hoverFrame && ref.current) ref.current.goToAndStop(0, true);
	};

	useEffect(() => {
		if (activeFrame && ref.current) {
			if (active) ref.current.goToAndStop(hoverFrame ?? 0, true);
			else ref.current.goToAndStop(activeFrame, true);
		}
	}, [activeFrame, hoverFrame, active]);

	return [ref, handleMouseEnter, handleMouseLeave] as const;
};

export default useLottie;
