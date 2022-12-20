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
let volumeSliderState = 0;

const VolumeSlider: React.FC<VolumeSliderProps> = (props) => {
	const { audioRef } = props;
	const volumeSliderProgressRef = useRef<HTMLDivElement>(null);
	const lottieRef = useRef<LottieRefCurrentProps>(null);
	const [volume, setVolume] = useState(50);

	const updateVolumeSliderProgress = () => {
		if (volumeSliderProgressRef.current) {
			// Weird math to make the slider look right
			volumeSliderProgressRef.current.style.right = `${101 - volume * 1.02}%`;
		}
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVolume(parseInt(e.target.value, 10));
		updateVolumeSliderProgress();

		// Handle animation of lottie icon - sry for this mess
		if (lottieRef.current) {
			if (volume >= 0 && volume <= 1 && volumeSliderState === 1) {
				lottieRef.current.playSegments([MIN_VOLUME_FRAME, MUTE_FRAME], true);
				volumeSliderState = 0;
			} else if (volume > 2 && volume < 35 && volumeSliderState === 0) {
				lottieRef.current.playSegments([MUTE_FRAME, MIN_VOLUME_FRAME], true);
				volumeSliderState = 1;
			} else if (volume > 2 && volume < 35 && volumeSliderState === 2) {
				lottieRef.current.playSegments([MID_VOLUME_FRAME, MIN_VOLUME_FRAME + 1], true);
				volumeSliderState = 1;
			} else if (volume > 35 && volume < 70 && volumeSliderState === 1) {
				lottieRef.current.playSegments([MIN_VOLUME_FRAME - 1, MID_VOLUME_FRAME], true);
				volumeSliderState = 2;
			} else if (volume > 35 && volume < 70 && volumeSliderState === 3) {
				lottieRef.current.playSegments([MAX_VOLUME_FRAME, MID_VOLUME_FRAME], true);
				volumeSliderState = 2;
			} else if (volume > 70 && volumeSliderState === 2) {
				lottieRef.current.playSegments([MID_VOLUME_FRAME, MAX_VOLUME_FRAME], true);
				volumeSliderState = 3;
			}
		}
	};

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume / 100;
		}
	}, [audioRef, volume]);

	useEffect(() => {
		lottieRef?.current?.goToAndStop(MAX_VOLUME_FRAME, true);
	}, []);

	return (
		<div className="volume-slider-container">
			<div id="volume-slider-progress" ref={volumeSliderProgressRef} />
			<Lottie animationData={volumeIcon} loop={false} lottieRef={lottieRef} id="volume-slider-icon" />
			<input type="range" min="0" max="100" value={volume} className="volume-slider" onChange={handleVolumeChange} defaultValue="50" />
			<div id="volume-slider-percentage">{volume}%</div>
		</div>
	);
};

export default VolumeSlider;
