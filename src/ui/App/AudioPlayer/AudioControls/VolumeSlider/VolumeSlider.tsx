/* eslint-disable no-nested-ternary */
import { WheelEvent, ChangeEvent, useRef, useEffect, useCallback } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import useEffectOnce from '../../../../hooks/useEffectOnce';

import volumeIcon from '../../../../../../assets/animations/volume.json';

import styles from './VolumeSlider.module.scss';

interface VolumeSliderProps {
	volume: number;
	setVolume: React.Dispatch<React.SetStateAction<number>>;
}

const LOTTIE_VOLUME_FRAMES = {
	MAX_VOLUME: 0,
	MID_VOLUME: 9,
	MIN_VOLUME: 14,
	MUTE: 28
};
const VOLUME_SLIDER_STATES = {
	MUTE: 0,
	MIN_VOLUME: 1,
	MID_VOLUME: 2,
	MAX_VOLUME: 3
};

let volumeSliderState: number;
let lottieInitialFrame: number;

const VolumeSlider = ({ volume, setVolume }: VolumeSliderProps) => {
	const ref = useRef<HTMLInputElement>(null);
	const lottieRef = useRef<LottieRefCurrentProps>(null);

	const handleScroll = (e: WheelEvent<HTMLInputElement>) => {
		if (e.deltaY < 0 && volume < 100) setVolume((x) => x + 1);
		else if (e.deltaY > 0 && volume > 0) setVolume((x) => x - 1);
	};

	const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		setVolume(value);
	};

	const handleAnimation = useCallback(() => {
		if (!lottieRef.current) return;

		// Handle animation of lottie icon.
		// @jt-owo: Tried to fix this mess, but it's not worth the effort. Animation works and there are no performance issues.
		if (volume >= 0 && volume < 1 && volumeSliderState >= VOLUME_SLIDER_STATES.MIN_VOLUME) {
			lottieRef.current.playSegments([LOTTIE_VOLUME_FRAMES.MIN_VOLUME, LOTTIE_VOLUME_FRAMES.MUTE], true);
			volumeSliderState = VOLUME_SLIDER_STATES.MUTE;
		} else if (volume >= 1 && volume <= 35 && volumeSliderState === VOLUME_SLIDER_STATES.MUTE) {
			lottieRef.current.playSegments([LOTTIE_VOLUME_FRAMES.MUTE, LOTTIE_VOLUME_FRAMES.MIN_VOLUME], true);
			volumeSliderState = VOLUME_SLIDER_STATES.MIN_VOLUME;
		} else if (volume >= 1 && volume <= 35 && volumeSliderState >= VOLUME_SLIDER_STATES.MID_VOLUME) {
			lottieRef.current.playSegments([LOTTIE_VOLUME_FRAMES.MID_VOLUME, LOTTIE_VOLUME_FRAMES.MIN_VOLUME + 1], true);
			volumeSliderState = VOLUME_SLIDER_STATES.MIN_VOLUME;
		} else if (volume > 35 && volume <= 65 && volumeSliderState <= VOLUME_SLIDER_STATES.MIN_VOLUME) {
			lottieRef.current.playSegments([LOTTIE_VOLUME_FRAMES.MIN_VOLUME - 1, LOTTIE_VOLUME_FRAMES.MID_VOLUME], true);
			volumeSliderState = VOLUME_SLIDER_STATES.MID_VOLUME;
		} else if (volume > 35 && volume <= 65 && volumeSliderState === VOLUME_SLIDER_STATES.MAX_VOLUME) {
			lottieRef.current.playSegments([LOTTIE_VOLUME_FRAMES.MAX_VOLUME, LOTTIE_VOLUME_FRAMES.MID_VOLUME], true);
			volumeSliderState = VOLUME_SLIDER_STATES.MID_VOLUME;
		} else if (volume > 65 && volumeSliderState <= VOLUME_SLIDER_STATES.MID_VOLUME) {
			lottieRef.current.playSegments([LOTTIE_VOLUME_FRAMES.MID_VOLUME, LOTTIE_VOLUME_FRAMES.MAX_VOLUME], true);
			volumeSliderState = VOLUME_SLIDER_STATES.MAX_VOLUME;
		}
	}, [lottieRef, volume]);

	// Set initial volume slider state and lottie icon frame on component mount
	useEffectOnce(() => {
		const initSliderState = () => {
			const initialVolume = volume;

			if (initialVolume <= 1) {
				volumeSliderState = VOLUME_SLIDER_STATES.MUTE;
				lottieInitialFrame = LOTTIE_VOLUME_FRAMES.MUTE;
			} else if (initialVolume < 35) {
				volumeSliderState = VOLUME_SLIDER_STATES.MIN_VOLUME;
				lottieInitialFrame = LOTTIE_VOLUME_FRAMES.MIN_VOLUME;
			} else if (initialVolume < 70) {
				volumeSliderState = VOLUME_SLIDER_STATES.MID_VOLUME;
				lottieInitialFrame = LOTTIE_VOLUME_FRAMES.MID_VOLUME;
			} else {
				volumeSliderState = VOLUME_SLIDER_STATES.MAX_VOLUME;
				lottieInitialFrame = LOTTIE_VOLUME_FRAMES.MAX_VOLUME;
			}
		};

		initSliderState();
		lottieRef?.current?.goToAndStop(lottieInitialFrame, true);
	});

	useEffect(handleAnimation, [handleAnimation]);

	useEffect(() => {
		ref.current?.style.setProperty('--progress', `${volume}%`);
	}, [volume]);

	return (
		<div className={styles['volume-slider-container']}>
			<Lottie animationData={volumeIcon} loop={false} lottieRef={lottieRef} className={styles['volume-slider-icon']} />
			<input type="range" min={0} max={100} value={volume} ref={ref} className={styles['volume-slider']} onChange={handleVolumeChange} onWheel={handleScroll} />
			<div className={styles['volume-slider-percentage']}>{volume}%</div>
		</div>
	);
};

export default VolumeSlider;
