/* eslint-disable no-param-reassign */
import { ChangeEvent, RefObject, useCallback, useEffect, useRef, WheelEvent } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { updateVolume } from '../../../../state/slices/playerSlice';

import volumeIcon from '../../../../../assets/animations/volume.json';

import styles from './VolumeSlider.module.scss';

interface VolumeSliderProps {
	audioRef: RefObject<HTMLAudioElement>;
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

const VolumeSlider = ({ audioRef }: VolumeSliderProps): JSX.Element => {
	const volumeSliderProgressRef = useRef<HTMLDivElement>(null);
	const lottieRef = useRef<LottieRefCurrentProps>(null);

	const dispatch = useAppDispatch();

	const volume = useAppSelector((state) => state.player.playback.volume);

	const updateVolumeSliderProgress = useCallback(() => {
		if (volumeSliderProgressRef.current) {
			volumeSliderProgressRef.current.style.right = `${100 - volume * 1.0}%`;
		}
	}, [volumeSliderProgressRef, volume]);

	const handleAnimation = useCallback(() => {
		// Handle animation of lottie icon - sry for this mess
		if (lottieRef.current) {
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
		}
	}, [lottieRef, volume]);

	const handleScroll = (e: WheelEvent<HTMLInputElement>) => {
		if (e.deltaY < 0 && volume < 100) dispatch(updateVolume(volume + 1));
		else if (e.deltaY > 0 && volume > 0) dispatch(updateVolume(volume - 1));
	};

	const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		dispatch(updateVolume(value));
	};

	useEffect(() => {
		if (audioRef.current) audioRef.current.volume = volume / 100;
	}, [audioRef, volume]);

	// Set initial volume slider state and lottie icon frame on component mount
	useEffect(() => {
		const setInitialVolumeSliderState = () => {
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

		setInitialVolumeSliderState();
		lottieRef?.current?.goToAndStop(lottieInitialFrame, true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Update volume slider progress and handle animation on volume change
	useEffect(() => {
		updateVolumeSliderProgress();
		handleAnimation();
	}, [updateVolumeSliderProgress, handleAnimation]);

	return (
		<div className={styles['volume-slider-container']}>
			<div className={styles['volume-slider-progress']} ref={volumeSliderProgressRef} />
			<Lottie animationData={volumeIcon} loop={false} lottieRef={lottieRef} className={styles['volume-slider-icon']} />
			<input type="range" min="0" max="100" value={volume} className={styles['volume-slider']} onChange={handleVolumeChange} onWheel={handleScroll} />
			<div className={styles['volume-slider-percentage']}>{volume}%</div>
		</div>
	);
};

export default VolumeSlider;
