import { ChangeEvent, FC, RefObject, useCallback, useEffect, useRef, useState, WheelEvent } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import './VolumeSlider.scss';

import volumeIcon from '../../../../../assets/animations/volume.json';

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

const VolumeSlider: FC<VolumeSliderProps> = (props) => {
	const { audioRef } = props;
	const volumeSliderProgressRef = useRef<HTMLDivElement>(null);
	const lottieRef = useRef<LottieRefCurrentProps>(null);
	const [volume, setVolume] = useState(+window.api.config.get('volume'));

	const updateVolumeSliderProgress = useCallback(() => {
		if (volumeSliderProgressRef.current) {
			volumeSliderProgressRef.current.style.right = `${100 - volume * 1.0}%`;
		}
	}, [volumeSliderProgressRef, volume]);

	const setInitialVolumeSliderState = () => {
		const initialVolume = +window.api.config.get('volume');

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

	const handleAnimation = useCallback(() => {
		// Handle animation of lottie icon - sry for this mess
		if (lottieRef.current) {
			if (volume >= 0 && volume <= 1 && volumeSliderState >= VOLUME_SLIDER_STATES.MIN_VOLUME) {
				lottieRef.current.playSegments([LOTTIE_VOLUME_FRAMES.MIN_VOLUME, LOTTIE_VOLUME_FRAMES.MUTE], true);
				volumeSliderState = VOLUME_SLIDER_STATES.MUTE;
			} else if (volume > 1 && volume <= 35 && volumeSliderState === VOLUME_SLIDER_STATES.MUTE) {
				lottieRef.current.playSegments([LOTTIE_VOLUME_FRAMES.MUTE, LOTTIE_VOLUME_FRAMES.MIN_VOLUME], true);
				volumeSliderState = VOLUME_SLIDER_STATES.MIN_VOLUME;
			} else if (volume > 1 && volume <= 35 && volumeSliderState >= VOLUME_SLIDER_STATES.MID_VOLUME) {
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
		if (e.deltaY < 0 && volume < 100) setVolume(volume + 1);
		else if (e.deltaY > 0 && volume > 0) setVolume(volume - 1);
	};

	const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newVolume = parseInt(e.target.value, 10);
		setVolume(newVolume);
		window.api.config.set('volume', JSON.stringify(newVolume.toString()));
	};

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume / 100;
		}
	}, [audioRef, volume]);

	// Set initial volume slider state and lottie icon frame on component mount
	useEffect(() => {
		setInitialVolumeSliderState();
		lottieRef?.current?.goToAndStop(lottieInitialFrame, true);
	}, []);

	// Update volume slider progress and handle animation on volume change
	useEffect(() => {
		updateVolumeSliderProgress();
		handleAnimation();
	}, [updateVolumeSliderProgress, handleAnimation]);

	return (
		<div className="volume-slider-container">
			<div id="volume-slider-progress" ref={volumeSliderProgressRef} />
			<Lottie animationData={volumeIcon} loop={false} lottieRef={lottieRef} id="volume-slider-icon" />
			<input type="range" min="0" max="100" value={volume} className="volume-slider" onChange={handleVolumeChange} onWheel={handleScroll} />
			<div id="volume-slider-percentage">{volume}%</div>
		</div>
	);
};

export default VolumeSlider;
