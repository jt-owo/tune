import React, { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

import './VolumeSlider.scss';

import volumeIcon from '../../../../../assets/animations/volume.json';

interface VolumeSliderProps {
	audioRef: React.RefObject<HTMLAudioElement>;
}

const MAX_VOLUME_FRAME = 0;
const MID_VOLUME_FRAME = 9;
const MIN_VOLUME_FRAME = 14;
const MUTE_FRAME = 28;
const VOLUME_SLIDER_STATES = {
	MUTE: 0,
	MIN_VOLUME: 1,
	MID_VOLUME: 2,
	MAX_VOLUME: 3
};
let volumeSliderState = 2;

const VolumeSlider: React.FC<VolumeSliderProps> = (props) => {
	const { audioRef } = props;
	const volumeSliderProgressRef = useRef<HTMLDivElement>(null);
	const lottieRef = useRef<LottieRefCurrentProps>(null);
	const [volume, setVolume] = useState(window.ipc.config.get('volume') as number);

	const updateVolumeSliderProgress = () => {
		if (volumeSliderProgressRef.current) {
			// Weird math to make the slider look right
			volumeSliderProgressRef.current.style.right = `${101 - volume * 1.02}%`;
		}
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = parseInt(e.target.value, 10);
		setVolume(newVolume);
		updateVolumeSliderProgress();
		window.ipc.config.set('volume', JSON.stringify(newVolume.toString()));

		// Handle animation of lottie icon - sry for this mess
		if (lottieRef.current) {
			if (volume >= 0 && volume <= 1 && volumeSliderState === VOLUME_SLIDER_STATES.MIN_VOLUME) {
				lottieRef.current.playSegments([MIN_VOLUME_FRAME, MUTE_FRAME], true);
				volumeSliderState = VOLUME_SLIDER_STATES.MUTE;
			} else if (volume > 2 && volume < 35 && volumeSliderState === VOLUME_SLIDER_STATES.MUTE) {
				lottieRef.current.playSegments([MUTE_FRAME, MIN_VOLUME_FRAME], true);
				volumeSliderState = VOLUME_SLIDER_STATES.MIN_VOLUME;
			} else if (volume > 2 && volume < 35 && volumeSliderState === VOLUME_SLIDER_STATES.MID_VOLUME) {
				lottieRef.current.playSegments([MID_VOLUME_FRAME, MIN_VOLUME_FRAME + 1], true);
				volumeSliderState = VOLUME_SLIDER_STATES.MIN_VOLUME;
			} else if (volume > 35 && volume < 70 && volumeSliderState === VOLUME_SLIDER_STATES.MIN_VOLUME) {
				lottieRef.current.playSegments([MIN_VOLUME_FRAME - 1, MID_VOLUME_FRAME], true);
				volumeSliderState = VOLUME_SLIDER_STATES.MID_VOLUME;
			} else if (volume > 35 && volume < 70 && volumeSliderState === VOLUME_SLIDER_STATES.MAX_VOLUME) {
				lottieRef.current.playSegments([MAX_VOLUME_FRAME, MID_VOLUME_FRAME], true);
				volumeSliderState = VOLUME_SLIDER_STATES.MID_VOLUME;
			} else if (volume > 70 && volumeSliderState === 2) {
				lottieRef.current.playSegments([MID_VOLUME_FRAME, MAX_VOLUME_FRAME], true);
				volumeSliderState = VOLUME_SLIDER_STATES.MAX_VOLUME;
			}
		}
	};

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume / 100;
		}
	}, [audioRef, volume]);

	useEffect(() => {
		lottieRef?.current?.goToAndStop(MID_VOLUME_FRAME, true);
	}, []);

	return (
		<div className="volume-slider-container">
			<div id="volume-slider-progress" ref={volumeSliderProgressRef} />
			<Lottie animationData={volumeIcon} loop={false} lottieRef={lottieRef} id="volume-slider-icon" />
			<input type="range" min="0" max="100" value={volume} className="volume-slider" onChange={handleVolumeChange} />
			<div id="volume-slider-percentage">{volume}%</div>
		</div>
	);
};

export default VolumeSlider;
